<template>
    <div class="roadui_page">
        <div>
            <el-form :inline="true" @submit.native.prevent>
                <el-form-item label="名称">
                    <el-input v-model="formData.name" placeholder="连接名称" style="width:200px" clearable />
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
                    <el-table-column prop="name" label="连接名称" width="200" sortable></el-table-column>
                    <el-table-column prop="type" label="连接类型" width="150"  sortable></el-table-column>
                    <el-table-column prop="url" label="连接字符串" sortable></el-table-column>
                    <el-table-column prop="note" label="备注" width="200" sortable></el-table-column>
                    <el-table-column prop="sort" label="排序" width="80" sortable></el-table-column>
                    <el-table-column width="140">
                        <template #header>
                            <span>操作</span>
                        </template>
                        <template #default="scope">
                            <el-button size="small" :disabled="butDisabled" type="primary" @click="edit(scope.row)">编辑</el-button>
                            <el-button size="small" :disabled="butDisabled" type="primary" @click="test(scope.row)">测试</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-scrollbar>
        </div>
        <!--编辑窗口-->
        <el-dialog v-model="dialogShow" :title="dialogTitle" align-center destroy-on-close width="700px" draggable :close-on-click-modal="false">
            <el-form :model="editData" ref="ruleFormRef" :rules="rules" label-width="100px">
                <el-form-item label="连接名称" prop="name">
                    <el-input v-model="editData.name" clearable />
                </el-form-item>
                <el-form-item label="连接类型" prop="type">
                    <el-radio-group v-model="editData.type">
                        <el-radio v-for="opt in connTypes" :key="opt.value" :label="opt.value">{{opt.title}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="连接字符串" prop="url">
                    <el-input v-model="editData.url" :rows="5" type="textarea" clearable />
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

    //列表
    const butDisabled = ref(false);
    const loading = ref(false);
    const tableData = ref([]);
    const formData = ref({});
    const editData = ref({});
    let selectRows = [];//保存选择的行
    const defaultOrder = ref({ prop: 'sort', order: 'ascending' });
    const pager = ref(utils.getPager(defaultOrder.value));
    const connTypes = ref([]);//数据库类型选项
    const ruleFormRef = ref(null);
    const dialogShow = ref(false);
    const dialogTitle = ref('');
    const rules = {
        name: [{ required: true, message: '请输入连接名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择连接类型', trigger: 'change' }],
        url: [{ required: true, message: '请输入连接字符串', trigger: 'blur' }],
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
        ajax.post('/DbConnection/GetList', qs.stringify({ findname: formData.value.name })).then((res) => {
            tableData.value = res.data;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; });
    };

    //编辑
    const edit = (row) => {
        if (connTypes.value.length === 0) {
            ajax.post('/DbConnection/GetDbConnTypeOptions').then((res) => {
                connTypes.value = res.data;
                editShow(row);
            }).catch(() => { });
        } else {
            editShow(row);
        }
    };
    const editShow = (row) => {
        if (utils.isUndef(row) || utils.length(row.id) === 0) {
            editData.value = { id: utils.emptyLong, name: '', type: '', url: '', account: '', password: '', sort: utils.getArrayMax(tableData.value, 'sort') + 5 };
            dialogTitle.value = '添加';
            dialogShow.value = true;
            return;
        }
        if (utils.length(row.id) > 0) {
            ajax.post('/DbConnection/Get?connid=' + row.id).then((res) => {
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
                ajax.post('/DbConnection/Save?connid=' + editId, qs.stringify(editData.value)).then((res) => {
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
                    butDisabled.value = false;
                }).catch(() => { butDisabled.value = false; });
            }
        });
    };
    //删除
    const remove = () => {
        if (selectRows.length === 0) {
            utils.msg('请选择要删除的数据连接！', 'error');
            return;
        }
        utils.confirm('您确定要删除所选数据连接吗？', () => {
            butDisabled.value = true;
            ajax.post('/DbConnection/Delete', qs.stringify({ ids: utils.getArrayValues(selectRows, 'id').join(',') })).then((res) => {
                utils.msg(res.success ? '删除成功！' : '删除失败！', res.success);
                butDisabled.value = false;
                if (res.success) {
                    selectRows = [];
                    loadTableData();
                }
            }).catch(() => { butDisabled.value = false; });
        });
    };
    //测试连接
    const test = (row) => {
        loading.value = true;
        ajax.post('/DbConnection/TestConn?connid=' + row.id).then((res) => {
            if (res.success) {
                utils.msg('连接数据库成功！', true);
            } else {
                utils.msg(utils.length(res.msg) === 0 ? '连接数据库失败，请检查数据库服务器是否正常以及连接字符串是否正确！' : res.msg, false);
            }
            loading.value = false;
        }).catch(() => { loading.value = false;  });
    };
</script>