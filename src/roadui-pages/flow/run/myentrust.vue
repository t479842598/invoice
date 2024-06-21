<template>
    <div class="roadui_page">
        <div>
            <el-form :inline="true">
                <el-form-item label="标题">
                    <el-input v-model="formData.title" style="width:130px" clearable />
                </el-form-item>
                <el-form-item label="流程">
                    <el-selectflow v-model="formData.flowId" :auth-type="7" style="width:160px"></el-selectflow>
                </el-form-item>
                <el-form-item label="委托时间">
                    <el-date-picker v-model="formDataDateRange" style="width:210px;"
                                    type="daterange"
                                    value-format="YYYY-MM-DD"
                                    unlink-panels
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
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
            <el-table :data="tableData"
                      v-loading="loading"
                      :stripe="pager.tableStripe"
                      :border="pager.tableBorder"
                      style="width:100%;"
                      :highlight-current-row="pager.tableHighlightCurrentRow"
                      :default-sort="defaultOrder"
                      @sort-change="sortChange">
                <el-table-column prop="title" label="标题" sortable="custom">
                    <template #default="scope">
                        <el-tag effect="dark" style="margin-right:8px;border-width:0;" :color="utils.getTaskTypeColor(scope.row.taskType)" v-if="scope.row.taskType>0">{{utils.getTaskTypeTitle(scope.row.taskType)}}</el-tag>
                        <a class="roaduia" href="javascript:;" @click="openTask(scope.row)">{{scope.row.title}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="flowName" label="流程" width="160" sortable="custom"></el-table-column>
                <el-table-column prop="stepName" label="步骤" width="150" sortable="custom"></el-table-column>
                <el-table-column prop="senderName" label="发送人" width="100"></el-table-column>
                <el-table-column prop="receiverName" label="委托接收人" width="100"></el-table-column>
                <el-table-column prop="receiveTime" label="委托时间" width="150" sortable="custom"></el-table-column>
                <el-table-column prop="handleType" label="状态" width="100" sortable="custom">
                    <template #default="scope">
                        <span>{{utils.getTaskHadleTitle(scope.row.handleType)}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="156">
                    <template #default="scope">
                        <el-space>
                            <el-button v-if="scope.row.handleType<2" type="primary" size="small" :disabled="butDisabled" @click="takeBack(scope.row)">收回</el-button>
                            <el-button type="info" size="small" :disabled="butDisabled" @click="showProcess(scope.row)">过程</el-button>
                        </el-space>
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

    const loading = ref(false);
    const butDisabled = ref(false);
    const formData = ref({ status: utils.query('status', props.query) || '0' });
    const formDataDateRange = ref([]);
    const tableData = ref([]);
    const defaultOrder = ref({ prop: 'receivetime', order: 'descending' });
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
    //加载列表
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
        ajax.post('/Flow/GetEntrustList', qs.stringify(formData.value)).then((res) => {
            tableData.value = res.data.rows;
            pager.value.total = res.data.total;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; loading.value = false; });
    };
    //查看表单
    const openTask = (task) => {
        let loadUrl = '/flow/run/index?flowid=' + task.flowId + '&stepid=' + task.stepId + '&taskid=' + task.id + '&groupid=' + task.groupId + '&instanceid=' + task.instanceId + '&display=1';
        let loadMode = 0;
        if (utils.query("isiframe", props.query) == 1) {
            loadUrl += '&nroadflow-token=' + utils.query("nroadflow-token", props.query);
            loadMode = 1;
        }
        const item = {
            title: task.title,
            id: 'task_' + task.id,
            url: loadUrl,
            ico: 'Edit',
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
    //收回
    const takeBack = (task) => {
        utils.confirm('您确定要收回该任务吗？', () => {
            butDisabled.value = true;
            ajax.post('/Flow/TakeBackEntrustTask', qs.stringify({ taskId: task.id })).then((res) => {
                let msg = res.msg;
                if (utils.length(msg) === 0) {
                    if (res.success) {
                        msg = "收回成功，请在待办事项中查看该任务！";
                    } else {
                        switch (res.code) {
                            case 1:
                                msg = '未找到该任务！';
                                break;
                            case 2:
                                msg = '该任务已处理，不能收回！';
                                break;
                            case 3:
                                msg = '未找到当前人员！';
                                break;
                            default:
                                msg = '收回失败！';
                                break;
                        }
                    }
                }
                utils.msg(msg, res.success);
                butDisabled.value = false;
                if (res.success) {
                    loadTableData(false);
                }
            }).catch(() => { });
        });
    };
</script>