<template>
    <div class="roadui_page">
        <div>
            <el-form :inline="true">
                <el-form-item label="标题">
                    <el-input v-model="formData.title" style="width:130px" clearable />
                </el-form-item>
                <el-form-item label="流程">
                    <el-selectflow v-model="formData.flowId" :auth-type="5" style="width:160px"></el-selectflow>
                </el-form-item>
                <el-form-item label="完成时间">
                    <el-date-picker v-model="formDataDateRange" style="width:210px;" type="daterange"
                        value-format="YYYY-MM-DD" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期"
                        :shortcuts="utils.dateShortucts" />
                </el-form-item>
                <el-form-item label="流程状态">
                    <el-radio-group v-model="formData.status" @change="loadTableData(true)">
                        <el-radio-button label="0">进行中</el-radio-button>
                        <el-radio-button label="1">已结束</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled="butDisabled" @click="loadTableData(true)">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-table :data="tableData" v-loading="loading" :stripe="pager.tableStripe" :border="pager.tableBorder"
                :header-cell-style="{ background: '#f4f3f9', color: '#000000', }"
                style="width:100%;color: #000000;font-size: 14px;" size="small"
                :highlight-current-row="pager.tableHighlightCurrentRow" :default-sort="defaultOrder"
                @sort-change="sortChange">
                <el-table-column prop="formtype" label="单据类型" width="150"></el-table-column>
                <el-table-column prop="billcode" label="单据号" width="150"></el-table-column>
                <el-table-column prop="billname" label="单据名称" width="250">
                    <template #default="scope">
                        <el-tag effect="dark" style="margin-right:8px;border-width:0;"
                            :color="utils.getTaskTypeColor(scope.row.taskType)" v-if="scope.row.taskType > 0">{{
                                utils.getTaskTypeTitle(scope.row.taskType) }}</el-tag>
                        <span>{{ scope.row.billname }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="flowName" v-if="false" label="流程" width="160"
                    sortable="custom"></el-table-column>
                <el-table-column prop="senderName" label="发送人" width="100"></el-table-column>
                <el-table-column prop="username" label="制单人" width="100" sortable="custom"></el-table-column>
                <el-table-column prop="formid" label="单据主键" width="100" v-if="false"
                    sortable="custom"></el-table-column>
                <el-table-column prop="billdate" label="制单日期" width="150"></el-table-column>
                <el-table-column prop="receiveTime" label="接收时间" width="150" sortable="custom"></el-table-column>
                <el-table-column prop="completedTime" label="完成时间" width="150" sortable="custom"></el-table-column>
                <el-table-column prop="stepName" label="当前步骤" width="150" sortable="custom"></el-table-column>
                <el-table-column width="230">
                    <template #default="scope">
                        <el-space>
                            <el-button type="primary" size="small" :disabled="butDisabled"
                                @click="openTask(scope.row)">表单</el-button>
                            <!-- <el-button type="info" size="small" :disabled="butDisabled"
                                @click="showProcess(scope.row)">过程</el-button> -->
                            <el-button v-if="scope.row.urge == 1" type="warning" :disabled="butDisabled"
                                @click="urge(scope.row)" size="small">催办</el-button>
                            <el-button v-if="scope.row.withdraw == 1" type="danger" :disabled="butDisabled"
                                @click="withdraw(scope.row)" size="small">撤回</el-button>
                        </el-space>
                    </template>
                </el-table-column>
            </el-table>
            <div class="roadui_pagerdiv">
                <el-pagination v-model:currentPage="pager.number" v-model:page-size="pager.size"
                    :page-sizes="pager.sizes" :background="pager.background" :layout="pager.layout" :total="pager.total"
                    :disabled="butDisabled" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
const ajax = inject('ajax');
const utils = inject('utils');
const qs = inject('qs');
const ElSelectflow = inject('ElSelectflow');
const index_openmenu = inject('index_openmenu');//首页打开应用方法
const props = defineProps({ query: { type: String, default: () => { return ''; } } });
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const loading = ref(false);
const butDisabled = ref(false);
const formData = ref({ status: utils.query('status', props.query) || '0' });
const formDataDateRange = ref([]);
const tableData = ref([]);
const defaultOrder = ref({ prop: 'completedtime', order: 'descending' });
const pager = ref(utils.getPager(defaultOrder.value));

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
    ajax.post('/Flow/GetCompletedList', qs.stringify(formData.value)).then((res) => {
        tableData.value = res.data.rows;
        pager.value.total = res.data.total;
        butDisabled.value = false;
        loading.value = false;
    }).catch(() => { butDisabled.value = false; loading.value = false; });
};
//查看表单
const openTask = (task) => {
    localStorage.setItem('task', JSON.stringify(task))
    localStorage.setItem('tasks', JSON.stringify(task))
    localStorage.setItem('formid', JSON.stringify(task.formid))
    localStorage.setItem('tasktype', JSON.stringify(task.taskType))
    const read = true
    let loadUrl = '/flow/run/index?flowid=' + task.flowId + '&stepid=' + task.stepId + '&taskid=' + task.id + '&groupid=' + task.groupId + '&instanceid=' + task.instanceId + '&readonly=' + read;
    let loadMode = 0;
    if (utils.query("isiframe", props.query) == 1) {
        loadUrl += '&nroadflow-token=' + utils.query("nroadflow-token", props.query);
        loadMode = 1;
    }
    const item = {
        title: task.stepName,
        id: 'task_' + task.id,
        url: loadUrl,
        ico: 'FolderChecked',
        openMode: loadMode,
        width: 1000,
        height: 620,
    };
    index_openmenu(item);
};
//过程
const showProcess = (task) => {
    const item = {
        id: 'task_process_' + utils.createGuid(false),
        title: task.title,
        url: '/flow/run/process?flowid=' + task.flowId + '&groupid=' + task.groupId + '&status=' + formData.value.status,
        openMode: 1,
        width: '1150px',
        customClass: 'el-dialog__padding',
        center: false,
    };
    index_openmenu(item);
};
//催办
const urge = (task) => {
    const item = {
        id: 'task_urge_' + utils.createGuid(false),
        title: '任务催办',
        url: '/flow/run/urge?flowid=' + task.flowId + '&stepid=' + task.stepId + '&taskid=' + task.id + '&groupid=' + task.groupId + '&instanceid=' + task.instanceId + '&uid=-1&openmode=1',
        openMode: 1,
        width: '680px',
    };
    index_openmenu(item);
};
//撤回
const withdraw = (task) => {
    utils.confirm('您确定要撤回吗？', () => {
        const json = {
            type: 'withdraw', flowId: task.flowId, stepId: task.stepId, taskId: task.id, groupId: task.groupId,
            instanceId: task.instanceId, steps: [], comment: '', attachment: '', sign: 0
        };
        butDisabled.value = true;
        ajax.post('/Flow/FlowExecute?srcorgid=' + sobInfo.value.id, qs.stringify({ json: JSON.stringify(json) })).then((res) => {
            if (res.data.code == 0) {
                //消息提示
                utils.msg('撤回成功！', true);
                //重新加载数据
                loadTableData(false);
            } else {
                const msg = res.data.code == 5006 ? '后续任务已处理，不能撤回！' : '执行撤回发生了错误！';
                utils.msg(msg, false);
            }
            butDisabled.value = false;
        }).catch(() => { butDisabled.value = false; });
    });
};
</script>