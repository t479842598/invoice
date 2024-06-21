<template>
    <div class="roadui_page">
        <div>
            <el-form v-show="searchform" :inline="true">
                <el-form-item label="单据号" prop="billcode">
                    <el-input v-model="formData.billcode" clearable />
                </el-form-item>
                <el-form-item label="单据名称" prop="billname">
                    <el-input v-model="formData.billname" clearable />
                </el-form-item>
                <el-form-item label="单据类型" prop="formtype">
                    <el-input v-model="formData.formtype" clearable />
                </el-form-item>
                <el-form-item label="流程" prop="flowId">
                    <el-selectflow v-model="formData.flowId" :auth-type="4"></el-selectflow>
                </el-form-item>
                <el-form-item label="经办人" prop="username">
                    <el-input v-model="formData.username" clearable />
                </el-form-item>
                <el-form-item label="到达日期">
                    <el-date-picker v-model="formDataDateRange" type="daterange" value-format="YYYY-MM-DD" unlink-panels
                        start-placeholder="开始日期" end-placeholder="结束日期" :shortcuts="utils.dateShortucts" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="Search" :disabled="butDisabled"
                        @click="loadTableData(true)">查询</el-button>
                    <el-button icon="Refresh" style="text-align:right" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
            <el-form>
                <el-form-item style="float:left">
                    <el-button type="warning" plain icon="Download" @click="exportexcel">导出到excel</el-button>
                </el-form-item>
                <el-form-item style="float:right">
                    <el-tooltip class="box-item" effect="dark" content="隐藏搜索" placement="top">
                        <el-button icon="Search" style="text-align:right" circle @click="searchhide"></el-button>
                    </el-tooltip>
                    <el-tooltip class="box-item" effect="dark" content="刷新" placement="top">
                        <el-button icon="Refresh" style="text-align:right" circle @click="reset"></el-button>
                    </el-tooltip>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-table :data="tableData" v-loading="loading" :stripe="pager.tableStripe" :border="pager.tableBorder"
                :header-cell-style="{ background: '#f4f3f9', color: '#000000', }"
                style="width:100%;color: #000000;font-size: 14px;" size="small"
                :highlight-current-row="pager.tableHighlightCurrentRow" :default-sort="defaultOrder"
                @sort-change="sortChange">
                <el-table-column prop="formtype" label="单据类型" width="120"></el-table-column>
                <el-table-column prop="billcode" label="单据号" min-width="200"></el-table-column>
                <el-table-column prop="billname" label="单据名称" min-width="230">
                    <template #default="scope">
                        <el-tag effect="dark" style="margin-right:8px;border-width:0;"
                            :color="utils.getTaskTypeColor(scope.row.taskType)" v-if="scope.row.taskType > 0">{{
                                utils.getTaskTypeTitle(scope.row.taskType) }}</el-tag>
                        <span>{{ scope.row.billname }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="flowName" label="流程" v-if="false" width="160" sortable="custom"></el-table-column>
                <el-table-column prop="username" label="经办人" width="100" sortable="custom"></el-table-column>
                <el-table-column prop="formid" label="单据主键" width="100" v-if="false" sortable="custom"></el-table-column>
                <el-table-column prop="senderName" label="发送人" width="100" sortable="custom"></el-table-column>
                <el-table-column prop="billdate" label="制单日期" width="150"></el-table-column>
                <el-table-column prop="receiveTime" label="到达时间" width="150" sortable="custom"></el-table-column>
                <el-table-column prop="status" label="状态" width="100" sortable="custom">
                    <template #default="scope">
                        <el-tooltip placement="left">
                            <template #content>
                                <span>{{ (utils.length(scope.row.completeTime) > 0 ?
                                    '要求完成时间' + scope.row.completeTime : '无要求完成时间') }}</span>
                            </template>
                            <el-tag :color="utils.getTaskStatusColor(scope.row.status)" effect="dark"
                                style="border-width:0;">{{
                                    utils.getTaskStatusTitle(scope.row.status) }}</el-tag>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="stepName" label="当前步骤" width="150" sortable="custom"></el-table-column>
                <el-table-column min-width="100" align="center">
                    <template #default="scope">
                        <el-space>
                            <el-button type="primary" size="small" :disabled="butDisabled"
                                @click="openTask(scope.row)">处理</el-button>
                            <!-- <el-button type="warning" size="small" :disabled="butDisabled"
                                @click="showProcess(scope.row)">过程</el-button> -->
                            <!-- <el-button v-if="scope.row.isDelete == 1" type="danger" size="small" :disabled="butDisabled"
                                @click="del(scope.row)">作废</el-button> -->
                        </el-space>
                    </template>
                </el-table-column>
            </el-table>
            <div class="roadui_pagerdiv">
                <el-pagination v-model:currentPage="pager.number" v-model:page-size="pager.size" :page-sizes="pager.sizes"
                    :background="pager.background" :layout="pager.layout" :total="pager.total" :disabled="butDisabled"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </div>
        <FlowIndex v-show="false" @index="loadTableData"></FlowIndex>
    </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
import { View, Edit, Search, Plus, Refresh, Tools } from '@element-plus/icons-vue'
import FlowIndex from './index.vue';//列表页面
const ajax = inject('ajax');
const utils = inject('utils');
const qs = inject('qs');
const ElSelectflow = inject('ElSelectflow');
const index_openmenu = inject('index_openmenu');
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const butDisabled = ref(false);
const loading = ref(false);
const tableData = ref([]);
const formData = ref({
    formtype: '开票申请',
});
const formDataDateRange = ref([]);//日期范围选择
const defaultOrder = ref({ prop: 'receivetime', order: 'descending' });
const pager = ref(utils.getPager(defaultOrder.value));
const props = defineProps({ query: { type: String, default: () => { return ''; } } });
onMounted(() => {
    loadTableData(false);
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
    ajax.post('/Flow/GetTodoList', qs.stringify(formData.value)).then((res) => {
        tableData.value = res.data.rows;
        pager.value.total = res.data.total;
        butDisabled.value = false;
        loading.value = false;
    }).catch(() => { butDisabled.value = false; loading.value = false; });
};
//处理任务
const openTask = (task) => {
    localStorage.setItem('task', JSON.stringify(task))
    localStorage.setItem('tasks', JSON.stringify(task))
    localStorage.setItem('formid', JSON.stringify(task.formid))
    localStorage.setItem('tasktype', JSON.stringify(task.taskType))
    let loadUrl = '/flow/run/index?flowid=' + task.flowId + '&stepid=' + task.stepId + '&taskid=' + task.id + '&groupid=' + task.groupId + '&instanceid=' + task.instanceId;
    let loadMode = 0;
    if (utils.query("isiframe", props.query) == 1) {
        loadUrl += '&nroadflow-token=' + utils.query("nroadflow-token", props.query);
        loadMode = 1;
    }
    const item = {
        title: task.stepName,
        id: 'task_' + task.id,
        url: loadUrl,
        ico: 'Edit',
        openMode: loadMode,
        width: 1500,
        height: 820,
    };
    index_openmenu(item);
};
//显示处理过程
const showProcess = (task) => {
    const item = {
        id: 'task_process_' + utils.createGuid(false),
        title: task.title,
        url: '/flow/run/process?flowid=' + task.flowId + '&groupid=' + task.groupId + '&status=0',
        openMode: 1,
        width: '1150px',
        customClass: 'el-dialog__padding',
        center: false,
    };
    index_openmenu(item);
};
//作废
const del = (task) => {
    utils.confirm('您确定要作废吗？', () => {
        butDisabled.value = true;
        const json = { type: 'delete', flowId: task.flowId, stepId: task.stepId, taskId: task.id };
        ajax.post('/Flow/FlowExecute?srcorgid=' + sobInfo.value.id, qs.stringify({ id: task.id, formtype: task.formtype, json: JSON.stringify(json) })).then((res) => {
            if (res.data.code == 0) {
                //消息提示
                utils.msg('作废成功！', true);
                //重新加载数据
                loadTableData(false);
            } else {
                utils.msg('执行作废发生了错误！', false);
            }
            butDisabled.value = false;
        }).catch(() => { butDisabled.value = false; });
    });
};
// 搜索隐藏
const searchform = ref(true)
// 搜索显示隐藏
const searchhide = () => {
    searchform.value = !searchform.value
}
// 重置
function reset() {
    formData.value = {
        billname: '',
        billname: '',
        formtype: '',
        flowId: '',
        username: '',
    }
    formDataDateRange.value = []
    loadTableData(true)
}
</script>