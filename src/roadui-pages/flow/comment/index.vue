<template>
    <div class="roadui_page">
        <div>
            <el-form :inline="true" @submit.native.prevent>
                <el-form-item v-if="addType==1" label="使用人">
                    <el-selectorg v-model="formData.userId" select-type="user" :multiple-limit="1" style="width:170px" clearable />
                </el-form-item>
                <el-form-item label="意见">
                    <el-input v-model="formData.comment" style="width:180px" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled="butDisabled" @click="loadTableData(true)">查询</el-button>
                    <el-button type="primary" :disabled="butDisabled" @click="edit(null)">添加</el-button>
                    <el-button type="danger" :disabled="butDisabled" @click="remove">删除</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div style="height:calc(100% - 60px);overflow:auto;">
            <el-table :data="tableData"
                      v-loading="loading"
                      :stripe="pager.tableStripe"
                      :border="pager.tableBorder"
                      style="width:100%;"
                      :highlight-current-row="pager.tableHighlightCurrentRow"
                      @selection-change="handleSelectionChange"
                      :default-sort="defaultOrder"
                      @sort-change="sortChange">
                <el-table-column type="selection" width="42" />
                <el-table-column prop="comments" label="意见"></el-table-column>
                <el-table-column prop="userId" label="使用人" width="200">
                    <template #default="scope">
                        <span v-if="scope.row.userId==utils.emptyLong">所有人员</span>
                        <el-tag v-else>{{scope.row.userId}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="addType" label="来源" width="130" sortable="custom">
                    <template #default="scope">
                        <el-tag v-if="scope.row.addType==0">用户添加</el-tag>
                        <span v-else>管理员添加</span>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="90"></el-table-column>
                <el-table-column width="90">
                    <template #header>
                        <span>操作</span>
                    </template>
                    <template #default="scope">
                        <el-button size="small" :disabled="butDisabled" type="primary" @click="edit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="roadui_pagerdiv">
                <el-pagination v-model:currentPage="pager.number"
                               v-model:page-size="pager.size"
                               :page-sizes="pager.sizes"
                               :background="pager.background"
                               :layout="pager.layout"
                               :total="pager.total"
                               :disabled="butDisabled"
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange" />
            </div>
        </div>
        <!--编辑窗口-->
        <el-dialog v-model="dialogShow" :title="dialogTitle" align-center destroy-on-close width="700px" draggable :close-on-click-modal="false">
            <el-form :model="editData" ref="ruleFormRef" :rules="rules" label-width="80px">
                <el-form-item v-if="addType==1" label="使用人" prop="userId">
                    <!--:disabled="editData.id!==utils.emptyLong"让编辑时选择人员不可用，只能是上次选择的使用人员-->
                    <el-selectorg v-model="editData.userId" :disabled="editData.id!==utils.emptyLong" select-type="user" :multiple-limit="1" clearable />
                    <span class="roadui_note" style="margin-left:12px" v-show="editData.id!==utils.emptyLong">编辑时不能修改使用人员</span>
                </el-form-item>
                <el-form-item label="意见" prop="comment">
                    <el-input v-model="editData.comment" type="textarea" :rows="3"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sort" v-if="editData.id!==utils.emptyLong">
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
    import { ref, onMounted, inject, computed } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const ElSelectorg = inject('ElSelectorg');//组织架构选择控件
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });

    //列表
    const butDisabled = ref(false);
    const loading = ref(false);
    const tableData = ref([]);
    const formData = ref({});
    const formDataDateRange = ref([]);//日期范围选择
    const editData = ref({});
    let selectRows = [];//保存选择的行
    const defaultOrder = ref({ prop: 'addtype', order: 'descending' });
    const pager = ref(utils.getPager(defaultOrder.value));
    const ruleFormRef = ref(null);
    const dialogShow = ref(false);
    const dialogTitle = ref('');
    const addType = utils.query('addtype', props.query);//添加方式 0用户添加 1管理员管理
    const rules = {
        comment: [{ required: true, message: '请输入意见', trigger: 'blur' }],
    };

    onMounted(() => {
        loadTableData();
    });

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

    //选择行
    const handleSelectionChange = (val) => {
        selectRows = val;
    };
    //加载列表，isQuery 点查询按钮为true，初始加载为false，为了区分点查询按钮时要将页number置为1。
    const loadTableData = (isQuery) => {
        if (isQuery) {
            pager.value.number = 1;
        }
        loading.value = true;
        butDisabled.value = true;
        formData.value.size = pager.value.size;
        formData.value.number = pager.value.number;
        formData.value.order = pager.value.order;
        ajax.post('/FlowComment/' + (addType == '1' ? 'GetManageList' : 'GetUserList'), qs.stringify(formData.value)).then((res) => {
            tableData.value = res.data.rows;
            pager.value.total = res.data.total;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; });
    };

    //编辑
    const edit = (row) => {
        if (utils.isUndef(row) || utils.length(row.id) === 0) {
            editData.value = { id: utils.emptyLong, addType: addType, userId: '', comment: '' };
            dialogTitle.value = '添加';
            dialogShow.value = true;
            return;
        }
        if (utils.length(row.id) > 0) {
            ajax.post('/FlowComment/Get?commentid=' + row.id).then((res) => {
                if (res.success) {
                    editData.value = res.data;
                    editData.value.userId = res.data.userId > utils.emptyLong ? 'u_' + res.data.userId : '';
                    dialogTitle.value = '编辑';
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
                ajax.post('/FlowComment/Save?commentid=' + editId, qs.stringify(editData.value)).then((res) => {
                    let msg = res.msg;
                    if (utils.length(msg) === 0) {
                        if (res.success) {
                            msg = '保存成功！';
                        } else if (res.code == 1) {
                            msg = '数据验证错误！';
                        } else {
                            msg = '保存失败！';
                        }
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
            utils.msg('您没有选择要删除的意见！', false);
            return;
        }
        utils.confirm('您确定要删除所选意见吗？', () => {
            butDisabled.value = true;
            ajax.post('/FlowComment/Delete', qs.stringify({ ids: utils.getArrayValues(selectRows, 'id').join(',') })).then((res) => {
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