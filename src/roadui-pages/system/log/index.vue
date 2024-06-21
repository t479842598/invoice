<template>
    <div class="roadui_page">
        <div>
            <el-form :inline="true">
                <el-form-item label="标题">
                    <el-input v-model="formData.title" style="width:200px" placeholder="日志标题" clearable />
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="formData.type" style="width:130px" clearable>
                        <el-option v-for="item in types"
                                   :key="item.value"
                                   :label="item.title"
                                   :value="item.value" />
                    </el-select>
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
                      style="width: 100%"
                      :highlight-current-row="pager.tableHighlightCurrentRow"
                      :default-sort="defaultOrder"
                      @sort-change="sortChange">
                <el-table-column prop="title" label="标题" sortable="custom" show-overflow-tooltip>
                    <template #default="scope">
                        <a class="roaduia" href="javascript:;" @click="view(scope.row)">{{scope.row.title}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="userName" label="操作人" width="120" sortable="custom">
                    <template #default="scope">
                        <el-tag v-if="utils.length(scope.row.userName)>0" type="info">{{scope.row.userName}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="类型" width="150" sortable="custom">
                    <template #default="scope">
                        <el-tag :type="getTypeTagType(scope.row.type)">{{getTypeTitle(scope.row.type+'')}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="writeTime" label="时间" width="180" sortable="custom" />
                <el-table-column prop="ipAddress" label="ip" width="135" sortable="custom" />
                <el-table-column width="100">
                    <template #header>
                        <span>操作</span>
                    </template>
                    <template #default="scope">
                        <el-button size="small" :disabled="butDisabled" type="primary" @click="view(scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
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
        <!--查看详情窗口-->
        <el-dialog v-model="dialogShow" align-center title="查看日志详情" width="1000px" draggable>
            <div style="max-height:460px;overflow:auto;padding:0">
                <table cellpadding="0" cellspacing="1" class="roadui_infotable">
                    <tr>
                        <th>日志标题</th>
                        <td colspan="3">{{logData.title}}</td>
                    </tr>
                    <tr>
                        <th style="width:110px">日志类型</th>
                        <td>{{getTypeTitle(logData.type+'')}}</td>
                        <th style="width:110px">发生ip</th>
                        <td>{{logData.ipAddress=='::1'?'127.0.0.1':logData.ipAddress}}</td>
                    </tr>
                    <tr>
                        <th>发生时间</th>
                        <td>{{logData.writeTime}}</td>
                        <th>操作人员</th>
                        <td>{{logData.userName}}</td>
                    </tr>
                    <tr>
                        <th>来源URL</th>
                        <td colspan="3">{{logData.referer}}</td>
                    </tr>
                    <tr>
                        <th>操作URL</th>
                        <td colspan="3">{{logData.url}}</td>
                    </tr>
                    <tr>
                        <th>浏览器</th>
                        <td colspan="3">{{logData.agent}}</td>
                    </tr>
                    <tr v-if="utils.length(logData.contents)>0">
                        <th>日志内容</th>
                        <td colspan="3">{{logData.contents}}</td>
                    </tr>
                    <tr v-if="utils.length(logData.oldContents)>0">
                        <th>操作前</th>
                        <td colspan="3">{{logData.oldContents}}</td>
                    </tr>
                    <tr v-if="utils.length(logData.newContents)>0">
                        <th>操作后</th>
                        <td colspan="3">{{logData.newContents}}</td>
                    </tr>
                    <tr v-if="utils.length(logData.others)>0">
                        <th>其他内容</th>
                        <td colspan="3">{{logData.others}}</td>
                    </tr>
                </table>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="dialogShow=false">关闭</el-button>
                    <el-button @click="printLog">打印</el-button>
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
    const formData = ref({});
    const formDataDateRange = ref([]);//选择的日期范围
    const butDisabled = ref(false);

    const loading = ref(false);//数据加载状态
    const tableData = ref([]);
    const selectRows = ref([]);
    const defaultOrder = ref({ prop: 'writetime', order: 'descending' });
    const pager = ref(utils.getPager(defaultOrder.value));
    //日志类型选项
    const types = [
        { value: '0', title: '登录日志' },
        { value: '1', title: '系统管理' },
        { value: '2', title: '流程管理' },
        { value: '3', title: '流程运行' },
        { value: '4', title: '表单管理' },
        { value: '100', title: '其他类型' },
        { value: '500', title: '系统异常' },
    ];
    //根据日志类型得到标题
    const getTypeTitle = computed(() => (type) => {
        const typeObj = utils.getArrayObj(types, type, 'value');
        return typeObj == null ? type : typeObj.title;
    });
    //根据日志类型得到标签类型
    const getTypeTagType = computed(() => (type) => {
        let tagType = '';
        switch (type) {
            case 0:
                tagType = 'success';
                break;
            case 100:
                tagType = 'info';
                break;
            case 500:
                tagType = 'danger';
                break;
        }
        return tagType;
    });

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
        ajax.post('/Log/GetList', qs.stringify(formData.value)).then((res) => {
            tableData.value = res.data.rows;
            pager.value.total = res.data.total;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; });
    };
    //查看详情
    const dialogShow = ref(false);
    const logData = ref({});
    const view = (row) => {
        if (utils.length(row.id) > 0) {
            ajax.post('/Log/Get?logid=' + row.id).then((res) => {
                if (res.code == -1) {
                    utils.msg('未找到日志！', res.success);
                    return;
                }
                logData.value = res.data;
                dialogShow.value = true;
            }).catch(() => { });
        }
    };
    //打印
    const printLog = () => {
        utils.open('?loadurl=' + encodeURIComponent('/system/log/print?logid=' + logData.value.id), 1000, 600, '打印日志');
    };
</script>