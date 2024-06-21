<template>
    <div class="roadui_page">
        <div>
            <el-form :inline="true">
                <el-form-item label="名称/标题">
                    <el-input v-model="formData.name" placeholder="模块名称或标题" style="width:200px" clearable />
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="formData.type" style="width:120px" clearable>
                        <el-option label="顶部统计" value="0"></el-option>
                        <el-option label="左边模块" value="1"></el-option>
                        <el-option label="右边模块" value="2"></el-option>
                    </el-select>
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
                    <el-table-column prop="name" width="250" label="名称" sortable></el-table-column>
                    <el-table-column prop="title" width="250" label="显示标题" sortable></el-table-column>
                    <el-table-column prop="type" width="120" label="类型" sortable>
                        <template #default="scope">
                            <span v-if="scope.row.type==0">顶部统计</span>
                            <span v-else-if="scope.row.type==1">左边模块</span>
                            <span v-else-if="scope.row.type==2">右边模块</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dataSourceType" width="150" label="数据来源" sortable>
                        <template #default="scope">
                            <span v-if="scope.row.dataSourceType==0">SQL</span>
                            <span v-else-if="scope.row.dataSourceType==1">VUE组件</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="note" label="备注" sortable></el-table-column>
                    <el-table-column prop="sort" label="排序" width="90" sortable></el-table-column>
                    <el-table-column width="100">
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
        <el-dialog v-model="dialogShow" :title="dialogTitle" destroy-on-close width="700px" draggable :close-on-click-modal="false">
            <el-form :model="editData" ref="ruleFormRef" :rules="rules" label-width="80px">
                <el-tabs style="margin-top:-20px;">
                    <el-tab-pane name="0" label="常规">
                        <el-form-item label="模块名称" prop="name">
                            <el-input v-model="editData.name" style="width:241px;margin-right:16px" clearable />
                            <el-form-item label="显示标题" prop="title">
                                <el-input v-model="editData.title" style="width:242px" clearable />
                            </el-form-item>
                        </el-form-item>
                        <el-form-item label="模块类型" prop="type">
                            <el-radio-group v-model="editData.type" @change="typeChange">
                                <el-radio :label="0">顶部统计</el-radio>
                                <el-radio :label="1">左边模块</el-radio>
                                <el-radio :label="2">右边模块</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="数据来源" prop="datasourceType">
                            <el-radio-group v-model="editData.datasourceType" :disabled="datasourceTypeDisabled">
                                <el-radio :label="0">SQL</el-radio>
                                <el-radio :label="1">VUE组件</el-radio>
                            </el-radio-group>
                            <el-form-item v-if="editData.datasourceType=='0'" label="数据连接" prop="connId" style="margin-left:26px">
                                <el-select v-model="editData.connId">
                                    <el-option v-for="conn in conns" :key="conn.id" :label="conn.title" :value="conn.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item label="来源" prop="datasource">
                            <el-input v-model="editData.datasource" placeholder="SQL或VUE组件名称。当模块类型为左边模块或右边模块时，这里的SQL为图表数据来源。" type="textarea" :rows="5" clearable />
                        </el-form-item>
                        <el-form-item label="使用对象" prop="useMember">
                            <el-selectorg v-model="editData.useMember" placeholder="为空表示所有人可使用" clearable style="width:100%" />
                        </el-form-item>
                        <el-form-item label="链接地址" prop="linkUrl">
                            <el-input v-model="editData.linkUrl" clearable />
                        </el-form-item>
                        <el-form-item label="图标" prop="icon">
                            <el-selectico v-model="editData.icon" style="width:360px;" clearable />
                            <el-form-item label="颜色" prop="background">
                                <el-color-picker v-model="editData.background" />
                            </el-form-item>
                        </el-form-item>
                        <el-form-item label="备注" prop="note">
                            <el-input v-model="editData.note" style="width:360px;" clearable />
                            <el-form-item label="排序" prop="sort">
                                <el-input-number v-model="editData.sort" style="width:139px;" :step="5" :min="0"></el-input-number>
                            </el-form-item>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane name="1" label="图表">
                        <el-form-item label="图表高度" prop="sort">
                            <el-input-number v-model="editData.chartsHeight" style="width:200px;" :min="50" placeholder="默认300"></el-input-number>
                        </el-form-item>
                        <el-form-item label="图表选项" prop="chart">
                            <el-codemirror v-model="editData.charts" style="height:247px;" placeholder="" clearable />
                        </el-form-item>
                        <el-form-item label="数据脚本" prop="chart">
                            <el-codemirror v-model="editData.chartsScripts" style="height:150px;" placeholder="替换图表选项中数据的脚本。" clearable />
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>
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
    const ElSelectorg = inject('ElSelectorg');
    const ElSelectico = inject('ElSelectico');
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
    const conns = ref([]);//数据来源为sql时的连接选项
    const ruleFormRef = ref(null);
    const dialogShow = ref(false);
    const dialogTitle = ref('');
    const datasourceTypeDisabled = ref(false);
    const rules = {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        title: [{ required: true, message: '请输入显示标题', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        datasourceType: [{ required: true, message: '请选择数据来源', trigger: 'change' }],
        datasource: [{ required: true, message: '请输入来源', trigger: 'blur' }],
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
        ajax.post('/HomeSet/GetList', qs.stringify(formData.value)).then((res) => {
            tableData.value = res.data;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; });
    };
    //编辑
    const edit = (row) => {
        if (conns.value.length === 0) {
            //初始化数据连接选项
            utils.getConns().then((conns1) => {
                conns.value = conns1;
                editShow(row);
            });
        } else {
            editShow(row);
        }
    };
    const editShow = (row) => {
        if (utils.isUndef(row) || utils.length(row.id) === 0) {
            editData.value = { id: utils.emptyLong, sort: utils.getArrayMax(tableData.value, 'sort') + 5 };
            dialogTitle.value = '添加';
            dialogShow.value = true;
            return;
        }
        if (utils.length(row.id) > 0) {
            ajax.post('/HomeSet/Get?setid=' + row.id).then((res) => {
                if (res.success) {
                    editData.value = res.data;
                    dialogTitle.value = '编辑 - ' + res.data.name;
                    dialogShow.value = true;
                    typeChange(res.data.type);
                } else {
                    utils.msg('获取数据失败！', false);
                }
            }).catch(() => { });
        }
    };
    //模块类型改变时，如果不是顶部模块，则数据来源只能选择VUE组件。
    const typeChange = (val) => {
        return;
        if (val != 0) {
            editData.value.datasourceType = 1;
            datasourceTypeDisabled.value = true;
        } else {
            datasourceTypeDisabled.value = false;
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
                ajax.post('HomeSet/Save?setid=' + editId, qs.stringify(editData.value)).then((res) => {
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
            utils.msg('您没有选择要删除的首页设置！', 'error');
            return;
        }
        utils.confirm('您确定要删除所选首页设置吗？', () => {
            butDisabled.value = true;
            ajax.post('/HomeSet/Delete', qs.stringify({ ids: utils.getArrayValues(selectRows, 'id').join(',') })).then((res) => {
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