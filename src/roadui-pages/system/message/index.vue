<template>
    <div class="roadui_page">
        <div>
            <el-form :inline="true">
                <el-form-item label="内容">
                    <el-input v-model="formData.contents" style="width:200px" placeholder="消息内容" clearable />
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
                    <el-button type="danger" :disabled="butDisabled" @click="transferRead()">全部标记为已读</el-button>
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
                <el-table-column prop="contents" label="消息内容" sortable="custom">
                    <template #default="scope">
                        <a class="roaduia" href="javascript:;" @click="openUrl(scope.row)">{{scope.row.contents}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="sendTime" label="接收时间" sortable="custom" width="150"></el-table-column>
                <el-table-column prop="senderName" label="发送人" sortable="custom" width="120">
                    <template #default="scope">
                        <el-tooltip v-if="utils.length(scope.row.senderName)>0" placement="left" :content="scope.row.senderOrganize">
                            <el-tag>{{scope.row.senderName}}</el-tag>
                        </el-tooltip>
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
    const index_openmenu = inject('index_openmenu');//首页打开菜单
    const butDisabled = ref(false);
    const loading = ref(false);
    const formData = ref({});
    const formDataDateRange = ref([]);

    const tableData = ref([]);
    const defaultOrder = ref({ prop: 'groupid', order: 'descending' });
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
        ajax.post('/Message/GetNoReadList', qs.stringify(formData.value)).then((res) => {
            tableData.value = res.data.rows;
            pager.value.total = res.data.total;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; });
    };
    //打开消息连接
    const openUrl = (row) => {
        //转为已读
        ajax.post('/Message/ToRead?msgid=' + row.id).then(() => {
            if (utils.length(row.url) > 0) {
                let title = '', key = '', ico = '';
                switch (row.type) {
                    case 1:
                        title = row.sourceTitle || '流程任务';
                        key = 'message_task_' + row.id;
                        ico = 'Edit';
                        break;
                    default:
                        title = utils.length(row.sourceTitle) > 0 ? row.sourceTitle : row.contents;
                        key = 'message_task_' + utils.createGuid(false);
                        ico = '';
                        break;
                }
                const item = {
                    title: title,
                    id: key,
                    url: row.url,
                    ico: ico,
                    openMode: 0,
                };
                index_openmenu(item);
            }
            loadTableData(false);
        }).catch(() => { });
    };
    //全部标记为已读
    const transferRead = () => {
        if (tableData.value.length === 0) {
            utils.msg('没有需要标记的消息！', false);
            return;
        }
        butDisabled.value = true;
        ajax.post('/Message/TransferRead').then((res) => {
            utils.msg(res.success ? '标记成功！' : res.code == 1 ? '没有需要标记的消息！' : '标记失败！', res.success);
            loadTableData(false);
            butDisabled.value = false;
        }).catch(() => {
            butDisabled.value = false;
        });
    };
</script>