<template>
    <div class="roadui_page">
        <div>
            <el-form :inline="true">
                <el-form-item label="标题">
                    <el-input v-model="formData.title" style="width:130px" clearable />
                </el-form-item>
                <el-form-item label="流程">
                    <el-input v-model="formData.flowName" style="width:130px" clearable></el-input>
                </el-form-item>
                <el-form-item label="步骤">
                    <el-input v-model="formData.stepName" style="width:130px" clearable></el-input>
                </el-form-item>
                <el-form-item label="日期">
                    <el-date-picker v-model="formDataDateRange" style="width:220px;"
                                    type="daterange"
                                    value-format="YYYY-MM-DD"
                                    unlink-panels
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :shortcuts="utils.dateShortucts" />
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
                <el-table-column prop="title" label="标题" sortable="custom" show-overflow-tooltip>
                    <template #default="scope">
                        <el-tag effect="dark" style="margin-right:8px;border-width:0;" :color="utils.getTaskTypeColor(scope.row.taskType)" v-if="scope.row.taskType>0">{{utils.getTaskTypeTitle(scope.row.taskType)}}</el-tag>
                        <a class="roaduia" href="javascript:;" @click="view(scope.row)">{{scope.row.title}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="flowName" label="流程" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="stepName" label="步骤" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="receiveTime" label="归档时间" width="150" sortable="custom"></el-table-column>
                <el-table-column prop="senderName" label="处理人" width="100" sortable="custom">
                    <template #default="scope">
                        <el-tag>{{scope.row.senderName}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column width="80">
                    <template #default="scope">
                        <el-button @click="view(scope.row)" type="primary" size="small">查看</el-button>
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

    const loading = ref(false);
    const butDisabled = ref(false);
    const formData = ref({});
    const formDataDateRange = ref([]);
    const tableData = ref([]);
    const defaultOrder = ref({ prop: 'writetime', order: 'descending' });
    const pager = ref(utils.getPager(defaultOrder.value));

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
    //查询列表
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
        ajax.post('/FlowArchive/GetList', qs.stringify(formData.value)).then((res) => {
            tableData.value = res.data.rows;
            pager.value.total = res.data.total;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; loading.value = false; });
    };
    //查看
    const view = (row) => {
        utils.open('?loadurl=' + encodeURIComponent('/flow/archive/print.vue?archiveid=' + row.id), 1000, 600, row.title);
    };
</script>