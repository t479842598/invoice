<template>
    <div>
        <div>
            <el-form :inline="true">
                <el-form-item label="名称">
                    <el-input v-model="formData.fileName" clearable style="width:180px" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled="butDisabled" @click="loadTableData(true)">查询</el-button>
                    <el-button type="primary" :disabled="butDisabled" @click="cancelShare()">取消分享</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-table :data="tableData"
                      v-loading="loading"
                      :stripe="pager.tableStripe"
                      :border="pager.tableBorder"
                      style="width:100%"
                      :highlight-current-row="pager.tableHighlightCurrentRow"
                      :default-sort="defaultOrder"
                      @sort-change="sortChange"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="45" />
                <el-table-column prop="fileName" label="名称" sortable="custom">
                    <template #default="scope">
                        <a class="roaduia" href="javascript:;" @click="openFile(scope.row)">
                            <el-icon class="roadui_main_tabico" style="vertical-align:middle"><Document /></el-icon>
                            {{scope.row.fileName}}
                        </a>
                    </template>
                </el-table-column>
                <el-table-column prop="shareTime" label="分享时间" width="150" sortable="custom" />
                <el-table-column prop="expireTime" label="失效时间" width="150" sortable="custom">
                    <template #default="scope">
                        <el-tag v-if="scope.row.expireTime==='0'">永久有效</el-tag>
                        <span v-else>{{scope.row.expireTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="toUserName" label="接收人" width="120" sortable="custom">
                    <template #default="scope">
                        <el-tooltip :content="scope.row.toUserOrg" placement="top">
                            <el-tag style="user-select:none">{{scope.row.toUserName}}</el-tag>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="isView" label="查看" width="80" sortable="custom">
                    <template #default="scope">
                        <el-tag v-if="scope.row.isView===1">是</el-tag>
                        <el-tag v-else type="info">否</el-tag>
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
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const config = inject('config');
    const formData = ref([]);
    const tableData = ref([]);
    const butDisabled = ref(false);
    const loading = ref(false);
    const defaultOrder = ref({ prop: 'sharetime', order: 'ascending' });
    const pager = ref(utils.getPager(defaultOrder.value));
    const index_openmenu = inject('index_openmenu');
    let selectRows = [];//保存选择的行

    onMounted(() => {
        loadTableData(false);
    });

    const loadTableData = (isQuery) => {
        if (isQuery) {
            pager.value.number = 1;
        }
        loading.value = true;
        butDisabled.value = true;
        formData.value.size = pager.value.size;
        formData.value.number = pager.value.number;
        formData.value.order = pager.value.order;
        ajax.post('/File/GetMyShareList', qs.stringify(formData.value)).then((res) => {
            tableData.value = res.data.rows;
            pager.value.total = res.data.total;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; });
    };
    //选择行
    const handleSelectionChange = (val) => {
        selectRows = val;
    };
    //排序
    const sortChange = (order) => {
        pager.value.order = utils.getOrder(order);
        loadTableData(false);
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
    //打开文件或目录
    const openFile = (file) => {
        utils.showFile(index_openmenu, { name: file.fileName, id: file.fileId }, config.SERVER_WEBADDRESS, false);
    };
    //取消分享
    const cancelShare = () => {
        if (selectRows.length === 0) {
            utils.msg('请选择要取消分享的文件！', false);
            return;
        }
        utils.confirm('您确定要取消分享吗？', () => {
            ajax.post('/File/CancelShare', qs.stringify({ ids: utils.getArrayValues(selectRows, 'id').join(',') })).then((res) => {
                let msg = res.msg;
                if (utils.length(msg) === 0) {
                    if (res.success) {
                        msg = '取消分享成功！';
                    } else {
                        msg = '取消分享失败！';
                    }
                }
                utils.msg(msg, res.success);
                butDisabled.value = false;
                if (res.success) {
                    loadTableData(false);
                }
            }).catch(() => { butDisabled.value = false; });
        });
    };
</script>