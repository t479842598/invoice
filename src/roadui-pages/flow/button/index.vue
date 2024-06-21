<template>
    <div class="roadui_page">
        <div>
            <el-form :inline="true" @submit.native.prevent>
                <el-form-item label="名称">
                    <el-input v-model="formData.name" placeholder="按钮名称" style="width:200px" clearable />
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
                    <el-table-column prop="name" label="名称" width="300" sortable></el-table-column>
                    <el-table-column prop="ico" label="图标" width="120">
                        <template #default="scope">
                            <component :is="scope.row.ico"></component>
                        </template>
                    </el-table-column>
                    <el-table-column prop="note" label="备注"></el-table-column>
                    <el-table-column prop="sort" label="排序" width="90" sortable></el-table-column>
                    <el-table-column width="90">
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
        <el-dialog v-model="dialogShow" :title="dialogTitle" align-center destroy-on-close width="700px" draggable :close-on-click-modal="false">
            <el-form :model="editData" ref="ruleFormRef" :rules="rules" label-width="80px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editData.name" clearable />
                </el-form-item>
                <el-form-item label="脚本" prop="scripts">
                    <!--<el-input v-model="editData.scripts" type="textarea" :rows="5" clearable />-->
                    <el-codemirror v-model="editData.scripts" height="120px"></el-codemirror>
                </el-form-item>
                <el-form-item label="图标" prop="ico">
                    <el-selectico v-model="editData.ico" clearable />
                </el-form-item>
                <el-form-item label="备注" prop="note">
                    <el-input v-model="editData.note"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input-number v-model="editData.sort" :step="5" :min="0"></el-input-number>
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
    import { ref, onMounted, inject } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const ElSelectico = inject('ElSelectico');//图标选择控件
    const ElCodemirror = inject('ElCodemirror');

    //列表
    const butDisabled = ref(false);
    const loading = ref(false);
    const tableData = ref([]);
    const formData = ref({});
    const editData = ref({});
    let selectRows = [];//保存选择的行
    const defaultOrder = ref({ prop: 'sort', order: 'ascending' });
    const pager = ref(utils.getPager(defaultOrder.value));
    const ruleFormRef = ref(null);
    const dialogShow = ref(false);
    const dialogTitle = ref('');
    const rules = {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        scripts: [{ required: true, message: '请输入脚本', trigger: 'blur' }],
    };

    onMounted(() => {
        loadTableData();
    });

    //选择行
    const handleSelectionChange = (val) => {
        selectRows = val;
    };
    //加载列表
    const loadTableData = () => {
        loading.value = true;
        butDisabled.value = true;
        ajax.post('/FlowButton/GetList', qs.stringify({ findname: formData.value.name })).then((res) => {
            tableData.value = res.data;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; });
    };

    //编辑
    const edit = (row) => {
        if (utils.isUndef(row) || utils.length(row.id) === 0) {
            editData.value = { id: utils.emptyLong + '', name: '', scripts: '', sort: utils.getArrayMax(tableData.value, 'sort') + 5 };
            dialogTitle.value = '添加';
            dialogShow.value = true;
            return;
        }
        if (utils.length(row.id) > 0) {
            ajax.post('/FlowButton/Get?buttonid=' + row.id).then((res) => {
                if (res.success) {
                    editData.value = res.data;
                    dialogTitle.value = '编辑 - ' + res.data.name;
                    dialogShow.value = true;
                } else {
                    utils.msg('获取数据失败！', false);
                }
            }).catch(() => { });
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
                ajax.post('/FlowButton/Save?buttonid=' + editId, qs.stringify(editData.value)).then((res) => {
                    let msg = res.msg;
                    if (utils.length(msg) === 0) {
                        msg = res.success ? '保存成功！' : '保存失败！';
                    }
                    utils.msg(msg, res.success);
                    butDisabled.value = false;
                    if (res.success) {
                        dialogShow.value = false;
                        loadTableData();
                    }
                    butDisabled.value = false;
                }).catch(() => { butDisabled.value = false; });
            }
        });
    };
    //删除
    const remove = () => {
        if (selectRows.length === 0) {
            utils.msg('您没有选择要删除的按钮！', false);
            return;
        }
        utils.confirm('您确定要删除所选按钮吗？', () => {
            butDisabled.value = true;
            ajax.post('/FlowButton/Delete', qs.stringify({ ids: utils.getArrayValues(selectRows, 'id').join(',') })).then((res) => {
                utils.msg(res.success ? '删除成功！' : '删除失败！', res.success);
                butDisabled.value = false;
                if (res.success) {
                    selectRows = [];
                    loadTableData();
                }
            }).catch(() => { butDisabled.value = false; });
        });
    };
</script>