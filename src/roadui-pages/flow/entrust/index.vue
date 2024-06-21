<template>
    <div class="roadui_page">
        <div>
            <el-form :inline="true">
                <el-form-item v-if="addType==1" label="委托人">
                    <el-selectorg v-model="formData.userId" select-type="user" :multiple-limit="1" style="width:170px" clearable />
                </el-form-item>
                <el-form-item label="接收人">
                    <el-selectorg v-model="formData.toUserId" select-type="user" :multiple-limit="1" style="width:170px" clearable />
                </el-form-item>
                <el-form-item label="编辑时间">
                    <el-date-picker v-model="formDataDateRange" style="width:220px;"
                                    type="daterange"
                                    value-format="YYYY-MM-DD"
                                    unlink-panels
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :shortcuts="utils.dateShortucts" 
                                    />
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
                <el-table-column prop="userId" label="委托人" width="120"></el-table-column>
                <el-table-column prop="toUserId" label="接收人" width="120"></el-table-column>
                <el-table-column prop="flowId" label="委托流程" sortable="custom">
                    <template #default="scope">
                        <span v-if="scope.row.flowId==utils.emptyLong">所有流程</span>
                        <span v-else>{{scope.row.flowId}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="writeTime" label="编辑时间" width="145" sortable="custom"></el-table-column>
                <el-table-column prop="startTime" label="开始时间" width="145" sortable="custom"></el-table-column>
                <el-table-column prop="endTime" label="结束时间" width="145" sortable="custom"></el-table-column>
                <el-table-column prop="note" label="备注"></el-table-column>
                <el-table-column prop="status" label="状态" width="90">
                    <template #default="scope">
                        <el-tag :color="getStatusColor(scope.row.status)" effect="plain" style="color:#fff;border:none;">{{getStatusTitle(scope.row.status)}}</el-tag>
                    </template>
                </el-table-column>
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
                <el-form-item v-if="addType==1" label="委托人" prop="userId">
                    <el-selectorg v-model="editData.userId" select-type="user" :multiple-limit="1" clearable />
                </el-form-item>
                <el-form-item label="接收人" prop="toUserId">
                    <el-selectorg v-model="editData.toUserId" select-type="user" :multiple-limit="1" clearable />
                </el-form-item>
                <el-form-item label="委托流程" prop="flowId">
                    <el-selectflow placeholder="为空表示所有流程" style="width:100%"></el-selectflow>
                </el-form-item>
                <el-form-item label="开始时间" prop="startTime">
                    <el-date-picker v-model="editData.startTime" value-format="YYYY-MM-DD HH:mm" type="datetime" />
                </el-form-item>
                <el-form-item label="结束时间" prop="endTime">
                    <el-date-picker v-model="editData.endTime" value-format="YYYY-MM-DD HH:mm" type="datetime" />
                </el-form-item>
                <el-form-item label="备注" prop="note">
                    <el-input v-model="editData.note"></el-input>
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
    const ElSelectflow = inject('ElSelectflow');//选择流程控件
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });

    //列表
    const butDisabled = ref(false);
    const loading = ref(false);
    const tableData = ref([]);
    const formData = ref({});
    const formDataDateRange = ref([]);//日期范围选择
    const editData = ref({});
    let selectRows = [];//保存选择的行
    const defaultOrder = ref({ prop: 'writetime', order: 'descending' });
    const pager = ref(utils.getPager(defaultOrder.value));
    const ruleFormRef = ref(null);
    const dialogShow = ref(false);
    const dialogTitle = ref('');
    const addType = utils.query('addtype', props.query);//添加方式 0用户添加 1管理员管理
    const rules = {
        toUserId: [{ required: true, message: '请选择接收人', trigger: 'blur' }],
        startTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        endTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
    };

    onMounted(() => {
        loadTableData();
    });

    //得到状态标题
    const getStatusTitle = computed(() => (status) => {
        switch (status) {
            case 1:
                return '未开始';
            case 2:
                return '委托中';
            case 3:
                return '已结束';
            default:
                return '未知';
        }
    });
    //得到状态标签颜色
    const getStatusColor = computed(() => (status) => {
        switch (status) {
            case 1:
                return '#999999';
            case 2:
                return '#52c41a';
            case 3:
                return 'var(--el-color-primary)';
            default:
                return '';
        }
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
        formData.value['date1'] = utils.length(formDataDateRange.value) > 0 ? formDataDateRange.value[0] : '';
        formData.value['date2'] = utils.length(formDataDateRange.value) > 1 ? formDataDateRange.value[1] : '';
        ajax.post('/FlowEntrust/' + (addType == '1' ? 'GetManageList' : 'GetUserList'), qs.stringify(formData.value)).then((res) => {
            tableData.value = res.data.rows;
            pager.value.total = res.data.total;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; loading.value = false; });
    };

    //编辑
    const edit = (row) => {
        if (utils.isUndef(row) || utils.length(row.id) === 0) {
            editData.value = { };
            dialogTitle.value = '添加';
            dialogShow.value = true;
            return;
        }
        if (utils.length(row.id) > 0) {
            ajax.post('/FlowEntrust/Get?entrustid=' + row.id).then((res) => {
                if (res.success) {
                    editData.value = res.data;
                    editData.value.userId = res.data.userId > utils.emptyLong ? 'u_' + res.data.userId : '';
                    editData.value.toUserId = res.data.toUserId > utils.emptyLong ? 'u_' + res.data.toUserId : '';
                    if (editData.flowId == utils.emptyLong) {
                        delete editData.value.flowId;
                    } else {
                        editData.value.flowId = editData.value.flowId + '';
                    }
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
                ajax.post('/FlowEntrust/Save?entrustid=' + editId, qs.stringify(editData.value)).then((res) => {
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
            utils.msg('您没有选择要删除的委托！', 'error');
            return;
        }
        utils.confirm('您确定要删除所选委托吗？', () => {
            butDisabled.value = true;
            ajax.post('/FlowEntrust/Delete', qs.stringify({ ids: utils.getArrayValues(selectRows, 'id').join(',') })).then((res) => {
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