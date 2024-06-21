<template>
    <div>
        <div>
            <el-form :inline="true">
                <el-form-item label="名称">
                    <el-input v-model="formData.fileName" clearable style="width:180px" />
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
                      style="width:100%"
                      :highlight-current-row="pager.tableHighlightCurrentRow"
                      :default-sort="defaultOrder"
                      @sort-change="sortChange"
                      >
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
                <el-table-column prop="userName" label="分享人" width="150" sortable="custom">
                    <template #default="scope">
                        <el-tooltip :content="scope.row.userOrg" placement="top">
                            <el-tag style="user-select:none">{{scope.row.userName}}</el-tag>
                        </el-tooltip>
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
        ajax.post('/File/GetShareMyList', qs.stringify(formData.value)).then((res) => {
            tableData.value = res.data.rows;
            pager.value.total = res.data.total;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; });
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
        //更新查看状态
        ajax.post('/File/UpdateIsView', qs.stringify({ id: file.id })).then((res) => {

        }).catch(() => {  });
    };
</script>