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
            <el-table-column prop="field" label="字段名称"></el-table-column>
            <el-table-column prop="showTitle" label="显示名称"></el-table-column>
            <el-table-column prop="showType" label="显示方式" width="150">
                <template #default="scope">
                    {{scope.row.showTypeTitle}}
                </template>
            </el-table-column>
            <el-table-column prop="align" label="对齐方式" width="110">
                <template #default="scope">
                    {{scope.row.alignTitle}}
                </template>
            </el-table-column>
            <el-table-column prop="width" label="宽度" width="80"></el-table-column>
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
                <el-form-item label="字段" prop="field">
                    <el-select v-model="editData.field" clearable filterable style="width:100%">
                        <el-option v-for="op in fieldOptions" :key="op.value" :label="op.title" :value="op.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="显示名称" prop="showTitle">
                    <el-input v-model="editData.showTitle" clearable />
                </el-form-item>
                <el-form-item label="显示方式" prop="showType">
                    <el-select v-model="editData.showType" clearable style="width: 210px">
                        <el-option v-for="op in showTypeOptions" :key="op.value" :label="op.label" :value="op.value"></el-option>
                    </el-select>
                    <span style="margin-left:12px">
                        <el-checkbox v-model="editData.isShow">隐藏</el-checkbox>
                    </span>
                    <span style="margin-left:12px">
                        <el-checkbox v-model="editData.isSort">排序</el-checkbox>
                    </span>
                    <span style="margin-left:12px">
                        冻结列<el-select v-model="editData.isDefaultSort" style="width:73px;margin-left:12px">
                            <el-option label="无" :value="0"></el-option>
                            <el-option label="左" :value="1"></el-option>
                            <el-option label="右" :value="2"></el-option>
                        </el-select>
                    </span>
                </el-form-item>
                <el-form-item v-show="editData.showType==2||editData.showType==3" label="格式" prop="showFormat">
                    <el-input v-model="editData.showFormat" clearable />
                </el-form-item>
                <el-form-item label="对齐方式" prop="align">
                    <el-select v-model="editData.align" clearable style="width: 110px">
                        <el-option v-for="op in alignOptions" :key="op.value" :label="op.label" :value="op.value"></el-option>
                    </el-select>
                    <span style="margin-left:12px">
                        列宽度<el-input-number v-model="editData.width" :min="0" style="width: 130px; margin-left: 12px" clearable />
                    </span>
                    <span style="margin-left:12px">
                        <el-checkbox v-model="editData.subTotal" :true-label="1" :false-label="0">小计</el-checkbox>
                    </span>
                    <span style="margin-left:12px">
                        <el-checkbox v-model="editData.total" :true-label="1" :false-label="0">合计</el-checkbox>
                    </span>
                    <span style="margin-left:12px">
                        <el-checkbox v-model="editData.typeConvert" :true-label="1" :false-label="0">类型转换</el-checkbox>
                    </span>
                </el-form-item>
                <el-form-item v-if="editData.showType==10" label="自定义" prop="customString">
                    <el-input v-model="editData.customString" clearable />
                </el-form-item>
                <el-form-item label="显示顺序" prop="sort">
                    <el-input-number :step="5" v-model="editData.sort" style="width:110px" controls-position="right" />
                    <span v-if="editData.showType==7||editData.showType==8||editData.showType==9" style="margin-left:12px;">
                        显示样式<el-input v-model="editData.showStyle" placeholder="css样式" style="width: 339px; margin-left: 12px;"></el-input>
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
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const program_attr_fields = inject('program_attr_fields');//读取已加载的应用查询对应的字段选项(design.vue中定义)
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const programId = utils.query('programid', props.query);

    const tableData = ref([]);
    const butDisabled = ref(false);
    const loading = ref(false);
    let selectRows = [];//保存选择的行
    const defaultOrder = ref({ prop: 'sort', order: 'ascending' });
    const pager = ref(utils.getPager(defaultOrder.value));
    const fieldOptions = ref(program_attr_fields.value);//字段选项
    const showTypeOptions = ref([]);//显示类型选项
    const alignOptions = ref([]);//对齐方式选项

    onMounted(() => {
        loadOptions();
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
        const params = [
            { id: 'programdesigner_showtype', key: 'showType', children: false, valueField: 'value' },
            { id: 'programdesigner_algin', key: 'align', children: false, valueField: 'value' },
        ];
        ajax.post('/Dictionary/GetMultipleOptions', qs.stringify({ json: JSON.stringify(params) })).then((res) => {
            showTypeOptions.value = res.data['showType'];
            alignOptions.value = res.data['align'];
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
        ajax.post('/Program/GetFieldList?programid=' + programId).then((res) => {
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
        if (fieldOptions.value.length === 0) {
            ajax.post('/Program/GetFieldOptions?programid=' + programId).then((res) => {
                fieldOptions.value = res.data;
                program_attr_fields.value = res.data;
                edit1(row);
            }).catch(() => { });
        } else {
            edit1(row);
        }
    };
    const edit1 = (row) => {
        if (utils.isDef(row)) {
            ajax.post('/Program/GetField?fieldid=' + row.id).then((res) => {
                editData.value = res.data;
                editData.value.showType = res.data.showType + '';
                editData.value.isShow = res.data.isShow == 1;
                editData.value.isSort = res.data.isSort == 1;
                if (utils.isNumberString(editData.value.width)) {
                    editData.value.width = utils.toNumber(editData.value.width);
                } else {
                    delete editData.value.width;
                }
                dialogTitle.value = '编辑 - ' + res.data.field;
                dialogShow.value = true;
            }).catch(() => { });
        } else {
            editData.value = { programId: programId, showType: '0', align: 'left', sort: utils.getArrayMax(tableData.value, 'sort') + 5 };
            dialogTitle.value = '添加';
            dialogShow.value = true;
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
                ajax.post('/Program/SaveField', qs.stringify(editData.value)).then((res) => {
                    let msg = res.msg;
                    if (utils.length(msg) === 0) {
                        switch (res.code) {
                            case 0:
                                msg = '保存成功！';
                                break;
                            case 1:
                                msg = '参数错误！';
                                break;
                            case 2:
                                msg = '一个应用只能添加一个按钮列！';
                                break;
                            default:
                                msg = '保存失败！';
                                break;
                        }
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
            utils.msg('您没有选择要删除的列表！', false);
            return;
        }
        utils.confirm('您确定要删除所选列表吗？', () => {
            butDisabled.value = true;
            ajax.post('/Program/DeleteField', qs.stringify({ ids: utils.getArrayValues(selectRows, 'id').join(',') })).then((res) => {
                butDisabled.value = false;
                utils.msg(res.success ? '删除成功！' : '删除失败！', res.success);
                selectRows = [];
                loadTableData(false);
            }).catch(() => { butDisabled.value = false; });
        });
    };
</script>