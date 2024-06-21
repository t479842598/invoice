<template>
    <div>
        <el-table :data="tableData"
                  v-loading="loading"
                  :stripe="pager.tableStripe"
                  :border="pager.tableBorder"
                  style="width:100%"
                  :highlight-current-row="pager.tableHighlightCurrentRow"
                  :default-sort="defaultOrder"
                  @sort-change="sortChange"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="45" />
            <el-table-column prop="buttonName" label="按钮名称"></el-table-column>
            <el-table-column prop="icon" label="图标" width="100">
                <template #default="scope">
                    <component v-if="utils.length(scope.row.icon)>0" :is="scope.row.icon"></component>
                </template>
            </el-table-column>
            <el-table-column prop="showType" label="类型" width="150">
                <template #default="scope">
                    {{getShowTypeTitle(scope.row.showType)}}
                </template>
            </el-table-column>
            <el-table-column prop="isValidate" label="权限验证" width="150">
                <template #default="scope">
                    {{scope.row.isValidate==0?'不验证':'验证'}}
                </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" width="80"></el-table-column>
            <el-table-column width="80">
                <template #header>
                    <span>操作</span>
                </template>
                <template #default="scope">
                    <el-button size="small" :disabled="butDisabled" type="primary" @click="edit(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin:15px auto 0 auto; text-align:center;">
            <el-button :disabled="butDisabled" type="primary" @click="edit(null)">添加</el-button>
            <el-button :disabled="butDisabled" type="danger" @click="del()">删除所选</el-button>
        </div>
        <el-dialog v-model="dialogShow" :title="dialogTitle" align-center destroy-on-close width="650px" draggable :close-on-click-modal="false">
            <el-form :model="editData" ref="ruleFormRef" :rules="rules" label-width="80px">
                <el-form-item label="选择按钮" prop="buttonId">
                    <el-select v-model="editData.buttonId" style="width:246px;" @change="buttonSelect" clearable>
                        <el-option v-for="but in buttonOptions" :key="but.id" :value="but.id" :label="but.name">
                            <span>{{but.name}}</span>
                            <span v-if="utils.length(but.note)>0" class="roadui_note"> - {{but.note}}</span>
                        </el-option>
                    </el-select>
                    <span style="margin-left: 12px">
                        按钮名称<el-input v-model="editData.buttonName" style="width:200px;margin-left:12px" clearable />
                    </span>
                </el-form-item>
                <el-form-item label="执行脚本" prop="clientScript">
                    <!--<el-input type="textarea" :rows="3" v-model="editData.clientScript"></el-input>-->
                    <el-codemirror v-model="editData.clientScript" height="120px"></el-codemirror>
                </el-form-item>
                <el-form-item label="按钮类型" prop="type">
                    <el-radio-group v-model="editData.type">
                        <el-radio v-for="but in utils.buttonTypes" :label="but.value">{{but.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="显示类型" prop="showType">
                    <el-radio-group v-model="editData.showType">
                        <el-radio label="1">常规按钮</el-radio>
                        <el-radio label="2">列表按钮</el-radio>
                    </el-radio-group>
                    <span style="margin-left:24px">
                        图标<el-selectico v-model="editData.icon" style="width: 175px; margin-left: 12px" clearable />
                    </span>
                    <span style="margin-left:12px">
                        <el-checkbox v-model="editData.isValidate">权限验证</el-checkbox>
                    </span>
                </el-form-item>
                <el-form-item label="显示判断" prop="showScript">
                    <el-input type="textarea" :rows="2" v-model="editData.showScript" placeholder="判断按钮是否显示的js脚本"></el-input>
                </el-form-item>
                <el-form-item label="备注说明" prop="note">
                    <el-input v-model="editData.note" style="width:330px" clearable />
                    <span style="margin-left:12px">
                        显示顺序<el-input-number :step="5" v-model="editData.sort" controls-position="right" style="width: 120px; margin-left: 12px" />
                    </span>
                </el-form-item>
                <el-form-item>
                    <el-button :disabled="butDisabled" @click="save(ruleFormRef)" type="primary">保存</el-button>
                    <el-button :disabled="butDisabled" @click="dialogShow=false">关闭</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup>
    import { ref, inject, computed, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const ElSelectico = inject('ElSelectico');
    const ElCodemirror = inject('ElCodemirror');
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const programId = utils.query('programid', props.query);

    const tableData = ref([]);
    const butDisabled = ref(false);
    const loading = ref(false);
    let selectRows = [];//保存选择的行
    const defaultOrder = ref({ prop: 'sort', order: 'ascending' });
    const pager = ref(utils.getPager(defaultOrder.value));
    const buttonOptions = ref([]);//按钮选项

    onMounted(() => {
        loadOptions();
    });

    //得到按钮类型标题
    const getShowTypeTitle = computed(() => (showType) => {
        switch (showType) {
            case 1:
                return '常规按钮';
            case 2:
                return '列表按钮';
            default:
                return '';
        }
    });

    //选择行
    const handleSelectionChange = (val) => {
        selectRows = val;
    };
    //每页条数改变
    const handleSizeChange = (size) => {
        pager.value.size = size;
        loadTableData(false);
    };
    //页码改变
    const handleCurrentChange = (number) => {
        pager.value.number = number;
        loadTableData(false);
    };
    //排序
    const sortChange = (order) => {
        pager.value.order = utils.getOrder(order);
        loadTableData(false);
    };
    const loadOptions = () => {
        ajax.post('/Button/GetList').then((res) => {
            buttonOptions.value = res.data;
            loadTableData(false);
        }).catch(() => { });
    };
    //加载列表，isQuery 点查询按钮为true，初始加载为false，为了区分点查询按钮时要将页number置为1。
    const loadTableData = (isQuery) => {
        if (isQuery) {
            pager.value.number = 1;
        }
        loading.value = true;
        butDisabled.value = true;
        ajax.post('/Program/GetButtonList?programid=' + programId).then((res) => {
            tableData.value = res.data;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; loading.value = false; });
    };
    //编辑
    const editData = ref({});
    const dialogShow = ref(false);
    const dialogTitle = ref('');
    const ruleFormRef = ref(null);
    const rules = {};
    const edit = (row) => {
        if (utils.isDef(row)) {
            ajax.post('/Program/GetButton?buttonid=' + row.id).then((res) => {
                editData.value = res.data;
                editData.value.isValidate = res.data.isValidate == 1;
                editData.value.showType = res.data.showType + '';
				if (editData.value.buttonId == 0) {
                    //不是从按钮库选择的按钮时要删除buttonId属性，不然会显示0。
                    delete editData.value.buttonId;
                }
                dialogTitle.value = '编辑 - ' + res.data.buttonName;
                dialogShow.value = true;
            }).catch(() => { });
        } else {
            editData.value = { programId: programId, isValidate: false, type: '', sort: utils.getArrayMax(tableData.value, 'sort') + 5 };
            dialogTitle.value = '添加';
            dialogShow.value = true;
        }
    };
    //选择按钮改变时
    const buttonSelect = (record) => {
        const but = utils.getArrayObj(buttonOptions.value, record, 'id');
        if (utils.isDef(but)) {
            editData.value.clientScript = but.scripts;
            editData.value.buttonName = but.name;
            editData.value.icon = but.ico;
            editData.value.type = but.type;
            editData.value.note = but.note;
        }
    };
    //保存
    const save = async (formEl) => {
        if (!formEl) {
            return;
        }
        await formEl.validate((valid) => {
            if (valid) {
                butDisabled.value = true;
                ajax.post('/Program/SaveButton', qs.stringify(editData.value)).then((res) => {
                    let msg = res.msg;
                    if (utils.length(msg) === 0) {
                        msg = res.success ? '保存成功！' : '保存失败！';
                    }
                    utils.msg(msg, res.success);
                    butDisabled.value = false;
                    if (res.success) {
                        loadTableData(false);
                        dialogShow.value = false;
                        editData.value = {};
                    }
                }).catch(() => { butDisabled.value = false; });
            }
        });
    };
    //删除所选
    const del = () => {
        if (selectRows.length === 0) {
            utils.msg('您没有选择要删除的按钮！', false);
            return;
        }
        utils.confirm('您确定要删除所选按钮吗？', () => {
            butDisabled.value = true;
            ajax.post('/Program/DeleteButton', qs.stringify({ ids: utils.getArrayValues(selectRows, 'id').join(',') })).then((res) => {
                butDisabled.value = false;
                utils.msg(res.success ? '删除成功！' : '删除失败！', res.success);
                selectRows = [];
                loadTableData(false);
            }).catch(() => { });
        });
    };
</script>