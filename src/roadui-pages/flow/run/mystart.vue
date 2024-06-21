<template>
    <div class="roadui_page">
        <div>
            <el-form :inline="true">
                <el-form-item label="标题">
                    <el-input v-model="formData.title" style="width:130px" clearable />
                </el-form-item>
                <el-form-item label="流程">
                    <el-selectflow v-model="formData.flowId" :auth-type="6" style="width:160px"></el-selectflow>
                </el-form-item>
                <el-form-item label="发起时间">
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
                        <a class="roaduia" href="javascript:;" @click="openTask(scope.row)">{{scope.row.title}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="flowName" label="流程" width="190" sortable="custom"></el-table-column>
                <el-table-column prop="receiveTime" label="发起时间" width="150" sortable="custom"></el-table-column>
                <el-table-column prop="stepName" label="当前步骤" width="190">
                    <template #default="scope">
                        <el-tag v-if="formData.status==0">{{scope.row.stepName}}</el-tag>
                        <el-tag v-else>{{utils.getTaskHadleTitle(parseInt(scope.row.stepName)||2)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column width="138">
                    <template #default="scope">
                        <el-space>
                            <el-button type="primary" size="small" :disabled="butDisabled" @click="openTask(scope.row)">表单</el-button>
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
        ajax.post('/Flow/GetMyStartList', qs.stringify(formData.value)).then((res) => {
            tableData.value = res.data.rows;
            pager.value.total = res.data.total;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; loading.value = false; });
    };
    //查看表单
    const openTask = (task) => {
        let loadUrl = '/flow/run/index?flowid=' + task.flowId + '&stepid=' + task.stepId + '&taskid=' + task.id + '&groupid=' + task.groupId + '&instanceid=' + task.instanceId;
        let loadMode = 0;
        if (utils.query("isiframe", props.query) == 1) {
            loadUrl += '&nroadflow-token=' + utils.query("nroadflow-token", props.query);
            loadMode = 1;
        }
        const item = {
            title: task.title,
            id: 'task_' + task.id,
            url: loadUrl,
            ico: 'Folder',
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
</script>