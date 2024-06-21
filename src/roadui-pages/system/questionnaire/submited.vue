<template>
    <div class="roadui_page">
        <div>
            <el-form :inline="true">
                <el-form-item label="主题">
                    <el-input v-model="formData.subject" style="width:200px" clearable />
                </el-form-item>
                <el-form-item label="开始时间">
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
                      style="width: 100%"
                      :highlight-current-row="pager.tableHighlightCurrentRow"
                      :default-sort="defaultOrder"
                      @sort-change="sortChange">
                <el-table-column prop="subject" label="主题" sortable="custom">
                    <template #default="scope">
                        <a class="roaduia" href="javascript:;" @click="submitTo(scope.row)">{{scope.row.subject}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="addUser" label="发布人" sortable="custom" width="120">
                    <template #default="scope">
                        <el-tag>{{scope.row.addUserName}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="publishTime" label="开始时间" sortable="custom" width="150"></el-table-column>
                <el-table-column prop="endTime" label="结束时间" sortable="custom" width="150">
                    <template #default="scope">
                        <span v-if="utils.length(scope.row.endTime)>0">{{scope.row.endTime}}</span>
                        <el-tag v-else type="info">无结束时间</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template #default="scope">
                        <el-button size="small" type="primary" @click="submitTo(scope.row)">重新提交</el-button>
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
            <!--提交窗口-->
            <el-dialog v-model="dialogShow" :title="dialogTitle" align-center destroy-on-close width="1000px" draggable :close-on-click-modal="false">
                <component :is="dialogPage" :query="dialogQuery"></component>
            </el-dialog>
        </div>
    </div>
</template>

<script setup>
    import WaitSubmit from './waitsubmit.vue';
    import { ref, inject, onMounted, shallowRef, provide } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');

    const butDisabled = ref(false);
    const loading = ref(false);
    const formData = ref({});
    const formDataDateRange = ref([]);
    const tableData = ref([]);
    const defaultOrder = ref({ prop: 'addtime', order: 'descending' });
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
        ajax.post('/Questionnaire/GetSubmitedList', qs.stringify(formData.value)).then((res) => {
            tableData.value = res.data.rows;
            pager.value.total = res.data.total;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; });
    };

    //提交
    const dialogShow = ref(false);
    const dialogTitle = ref('');
    const dialogPage = shallowRef(null);
    const dialogQuery = ref('');
    const submitTo = (row) => {
        dialogPage.value = WaitSubmit;
        dialogQuery.value = '?questionnaireid=' + row.id;
        dialogTitle.value = '';
        dialogShow.value = true;
    };

    provide('wait_dialogshow', dialogShow);
    provide('wait_loadtabledata', loadTableData);
</script>