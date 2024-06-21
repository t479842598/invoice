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
                    <el-button type="danger" :disabled="butDisabled" @click="del()">删除</el-button>
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
                      @sort-change="sortChange"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="45" :selectable="(row)=>{return utils.length(row.readTime)===0;}" />
                <el-table-column prop="contents" label="消息内容" sortable="custom"></el-table-column>
                <el-table-column prop="sendTime" label="发送日期" sortable="custom" width="150"></el-table-column>
                <el-table-column prop="sendType" label="接收人" sortable="custom" width="120">
                    <template #default="scope">
                        <el-tooltip placement="left" :content="scope.row.receiverOrganize">
                            <el-tag>{{scope.row.receiverName}}</el-tag>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="sendType" label="接收方式" sortable="custom" width="220">
                    <template #default="scope">
                        {{getSendTypeTitle(scope.row.sendType)}}
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="状态" sortable="custom" width="80">
                    <template #default="scope">
                        <el-tag v-if="utils.length(scope.row.readTime)===0" type="info">未读</el-tag>
                        <el-tooltip v-else placement="left" :content="'阅读时间 '+scope.row.readTime">
                            <el-tag type="success" effect="dark">已读</el-tag>
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
    import { ref, inject, computed, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');

    const butDisabled = ref(false);
    const loading = ref(false);
    const formData = ref({});
    const formDataDateRange = ref([]);

    let selectRows = [];//保存选择的行
    const tableData = ref([]);
    const defaultOrder = ref({ prop: 'groupid', order: 'descending' });
    const pager = ref(utils.getPager(defaultOrder.value));

    onMounted(() => {
        loadTableData(false);
    });

    //根据接收类型标题
    const getSendTypeTitle = computed(() => (sendType) => {
        const sendTypeArray = sendType.split(',');
        let titles = [];
        for (let i = 0; i < sendTypeArray.length; i++) {
            if (sendTypeArray[i] == 0) {
                titles.push('站内消息');
            } else if (sendTypeArray[i] == 1) {
                titles.push('手机短信');
            } else if (sendTypeArray[i] == 2) {
                titles.push('企业微信');
            }
        }
        return titles.join(' ');
    });

    //选择行
    const handleSelectionChange = (val) => {
        selectRows = val;
    };
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
        ajax.post('/Message/GetSendList', qs.stringify(formData.value)).then((res) => {
            tableData.value = res.data.rows;
            pager.value.total = res.data.total;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; });
    };
    //删除
    const del = () => {
        if (selectRows.length === 0) {
            utils.msg('您没有选择要删除的消息！', false);
            return;
        }
        utils.confirm('您确定要删除所选消息吗？', () => {
            butDisabled.value = true;
            ajax.post('/Message/Delete?type=0', qs.stringify({ ids: utils.getArrayValues(selectRows, 'id').join(',') })).then((res) => {
                let msg = res.msg;
                if (utils.length(msg) === 0) {
                    msg = res.success ? "删除成功！" : "删除失败！";
                }
                utils.msg(msg, res.success);
                butDisabled.value = false;
                if (res.success) {
                    selectRows = [];
                    loadTableData(false);
                }
            }).catch(() => { });
        });
    };
</script>