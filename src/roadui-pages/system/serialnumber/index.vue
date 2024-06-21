<template>
    <div class="roadui_page">
        <div>
            <el-form :inline="true" @submit.native.prevent>
                <el-form-item label="标题">
                    <el-input v-model="formData.title" style="width:200px" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled="butDisabled" @click="loadTableData">查询</el-button>
                    <el-button type="primary" :disabled="butDisabled" @click="edit(null)">添加</el-button>
                    <el-button type="danger" :disabled="butDisabled" @click="remove">删除</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div style="height:calc(100% - 60px);overflow:auto;">
            <el-scrollbar>
                <el-table :data="tableData"
                          v-loading="loading"
                          :stripe="pager.tableStripe"
                          :border="pager.tableBorder"
                          style="width:100%;"
                          :highlight-current-row="pager.tableHighlightCurrentRow"
                          @selection-change="handleSelectionChange"
                          :default-sort="defaultOrder">
                    <el-table-column type="selection" width="45" />
                    <el-table-column prop="title" label="标题" width="300" sortable></el-table-column>
                    <el-table-column prop="format" label="格式" sortable></el-table-column>
                    <el-table-column prop="numberSize" label="位数" width="130" sortable></el-table-column>
                    <el-table-column prop="currentNumber" label="当前值" width="130" sortable></el-table-column>
                    <el-table-column prop="numberType" label="类型" width="205" sortable>
                        <template #default="scope">
                            <el-tag>{{getTypeTitle(scope.row.numberType)}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column width="80">
                        <template #header>
                            <span>操作</span>
                        </template>
                        <template #default="scope">
                            <el-button size="small" :disabled="butDisabled" type="primary" @click="edit(scope.row)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-scrollbar>
        </div>
        <!--编辑窗口-->
        <el-dialog v-model="dialogShow" :title="dialogTitle" align-center destroy-on-close width="620px" draggable :close-on-click-modal="false">
            <el-form :model="editData" ref="ruleFormRef" :rules="rules" label-width="60px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="editData.title" clearable />
                </el-form-item>
                <el-form-item label="类型" prop="numberType">
                    <el-radio-group v-model="editData.numberType">
                        <el-radio v-for="opt in typeOptions" :key="opt.value" :label="opt.value">{{opt.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="位数" prop="numberSize">
                    <el-input-number v-model="editData.numberSize" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="格式" prop="format">
                    <el-input v-model="editData.format" placeholder="例：road-{DateTime<yyyyMMdd>}-{number}，会用生成的流水号替换{number}。" clearable />
                </el-form-item>
                <el-form-item label="当前值" prop="currentNumber">
                    <el-input-number v-model="editData.currentNumber" :min="0"></el-input-number>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button :disabled="butDisabled" type="primary" @click="save(ruleFormRef)">保存</el-button>
                    <el-button :disabled="butDisabled" @click="dialogShow=false">关闭</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted, computed } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');

    const butDisabled = ref(false);
    const loading = ref(false);
    const formData = ref({});
    const tableData = ref([]);
    let selectRows = [];//保存选择的行
    const defaultOrder = ref({ prop: 'title', order: 'ascending' });
    const pager = ref(utils.getPager(defaultOrder.value));
    //类型选项 类型 0：不重置 1：年流水 2：月流水 3：日流水
    const typeOptions = ref([{ value: 0, label: '不重置' }, { value: 1, label: '年流水' }, { value: 2, label: '月流水' }, { value: 3, label: '日流水' }]);

    onMounted(() => {
        loadTableData();
    });

    //得到流水号类型标题
    const getTypeTitle = computed(() => (type) => {
        const typeOpt = utils.getArrayObj(typeOptions.value, type, 'value');
        return typeOpt === null ? '' : typeOpt.label;
    });
    //选择行
    const handleSelectionChange = (val) => {
        selectRows = val;
    };
    //加载列表
    const loadTableData = () => {
        loading.value = true;
        butDisabled.value = true;
        ajax.post('/SerialNumber/GetList', qs.stringify(formData.value)).then((res) => {
            tableData.value = res.data;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; });
    };

    //编辑
    const dialogShow = ref(false);
    const dialogTitle = ref('');
    const ruleFormRef = ref(null);
    const editData = ref({});
    const rules = {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        numberSize: [{ required: true, message: '请输入位数', trigger: 'blur' }],
        numberType: [{ required: true, message: '请选择类型', trigger: 'blur' }],
    };
    //删除选择行
    const remove = () => {
        if (selectRows.length === 0) {
            utils.msg('请选择要删除的流水号！', 'error');
            return;
        }
        utils.confirm('您确定要删除所选流水号吗？', () => {
            butDisabled.value = true;
            ajax.post('/SerialNumber/Delete', qs.stringify({ ids: utils.getArrayValues(selectRows, 'id').join(',') })).then((res) => {
                utils.msg(res.success ? '删除成功！' : '删除失败！', res.success);
                butDisabled.value = false;
                if (res.success) {
                    selectRows = [];
                    loadTableData();
                }
            }).catch(() => { butDisabled.value = false; });
        });
    };
    //添加或编辑
    const edit = (row) => {
        if (utils.isUndef(row) || utils.length(row.id) === 0) {
            editData.value = { numberSize: 5 };
            dialogTitle.value = '添加';
            dialogShow.value = true;
            return;
        }
        if (utils.length(row.id) > 0) {
            butDisabled.value = true;
            ajax.post('/SerialNumber/Get?numberid=' + row.id).then((res) => {
                if (res.code == 1) {
                    utils.msg('加载数据错误！', false);
                    return;
                }
                editData.value = res.data;
                dialogTitle.value = '编辑 - ' + res.data.title;
                dialogShow.value = true;
                butDisabled.value = false;
            }).catch(() => { butDisabled.value = false; });
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
                const editId = editData.value.id || '';
                ajax.post('/SerialNumber/Save?numberid=' + editId, qs.stringify(editData.value)).then((res) => {
                    let msg = res.msg;
                    if (utils.length(msg) === 0) {
                        msg = res.success ? '保存成功！' : res.code == 1 ? '数据验证错误！' : '保存失败！';
                    }
                    utils.msg(msg, res.success);
                    butDisabled.value = false;
                    if (res.success) {
                        dialogShow.value = false;
                        loadTableData();
                    }
                }).catch(() => { butDisabled.value = false; });
            }
        });
    };
</script>