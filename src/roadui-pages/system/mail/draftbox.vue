<template>
    <div class="roadui_page">
        <div>
            <el-form :inline="true">
                <el-form-item label="主题">
                    <el-input v-model="formData.mailSubject" style="width:200px" clearable />
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
                    <el-button type="danger" :disabled="butDisabled" @click="delTableData(0)">删除</el-button>
                    <el-button type="danger" :disabled="butDisabled" @click="delTableData(1)">彻底删除</el-button>
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
                <el-table-column type="selection" width="45" />
                <el-table-column prop="mailSubject" label="主题" sortable="custom" show-overflow-tooltip>
                    <template #default="scope">
                        <a class="roaduia" href="javascript:;" @click="edit(scope.row)" :style="utils.length(scope.row.subjectColor)>0?'color:'+scope.row.subjectColor:''">{{scope.row.mailSubject}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="receiveUsers" label="收件人" width="300" sortable="custom">
                    <template #default="scope">
                        {{scope.row.receiveUsers}}
                    </template>
                </el-table-column>
                <el-table-column prop="sendTime" label="日期" width="180" sortable="custom" />
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
    </div>
</template>

<script setup>
    import { ref, onMounted, inject } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const index_openmenu = inject('index_openmenu');
    const formData = ref({});
    const formDataDateRange = ref([]);//选择的日期范围
    const butDisabled = ref(false);

    const loading = ref(false);//数据加载状态
    const tableData = ref([]);
    let selectRows = [];//保存选择的行
    const defaultOrder = ref({ prop: 'sendtime', order: 'descending' });
    const pager = ref(utils.getPager(defaultOrder.value));

    onMounted(() => {
        loadTableData(false);
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
        ajax.post('/Mail/GetDraftList', qs.stringify(formData.value)).then((res) => {
            tableData.value = res.data.rows;
            pager.value.total = res.data.total;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; });
    };

    //删除选择行 type 0：删除 1：物理删除
    const delTableData = (type) => {
        if (selectRows.length === 0) {
            utils.msg('请选择要删除的草稿邮件！', 'error');
            return;
        }
        utils.confirm('您确定要' + (type == 1 ? '彻底' : '') + '删除所选草稿邮件吗？', () => {
            butDisabled.value = true;
            ajax.post('/Mail/DeleteDraft', qs.stringify({ ids: utils.getArrayValues(selectRows, 'id').join(','), type: type })).then((res) => {
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
            }).catch(() => { butDisabled.value = false; });
        });
    };

    const edit = (row) => {
        const item = {
            title: row.mailSubject,
            id: 'mail_' + row.id,
            url: '/system/mail/send?id=' + row.id + '&source=draftbox',
            ico: 'Edit',
            openMode: 0,
        };
        index_openmenu(item);
    };
</script>