<template>
    <div class="roadui_page">
        <div>
            <el-form :inline="true" @submit.native.prevent>
                <el-form-item label="姓名">
                    <el-input v-model="formData.userName" style="width:200px" clearable />
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
                <el-table-column prop="userName" label="姓名" width="110" sortable="custom"></el-table-column>
                <el-table-column prop="userOrganize" label="组织" width="260" sortable="custom"></el-table-column>
                <el-table-column prop="loginTime" label="登录时间" width="145" sortable="custom"></el-table-column>
                <el-table-column prop="loginIp" label="登录ip" width="140" sortable="custom"></el-table-column>
                <el-table-column prop="lastTime" label="活动时间" width="145" sortable="custom"></el-table-column>
                <el-table-column prop="agent" label="客户端信息" sortable="custom" show-overflow-tooltip></el-table-column>
                <el-table-column prop="loginType" label="登录类型" width="120" sortable="custom">
                    <template #default="scope">
                        <el-tag>{{getLoginTypeTitle(scope.row.loginType)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column width="80">
                    <template #header>
                        <span>操作</span>
                    </template>
                    <template #default="scope">
                        <el-button size="small" :disabled="butDisabled" type="primary" @click="logout(scope.row)">离线</el-button>
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
    import { ref, inject, computed, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');

    const butDisabled = ref(false);
    const loading = ref(false);
    const formData = ref({});
    const tableData = ref([]);
    const defaultOrder = ref({ prop: 'logintime', order: 'descending' });
    const pager = ref(utils.getPager(defaultOrder.value));

    //根据登录类型得到标题
    const getLoginTypeTitle = computed(() => (type) => {
        console.log(type)
        switch (type) {
            case 0:
                return '电脑端';
            case 1:
                return '企业微信';
            case 3:
                return '钉钉';
            case 4:
                return 'APP';
            case 5:
                return '微信小程序';
            default:
                return '';
        }
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
        ajax.post('/Organize/GetOnlineUserList', qs.stringify(formData.value)).then((res) => {
            tableData.value = res.data.rows;
            pager.value.total = res.data.total;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; });
    };
    //离线
    const logout = (row) => {
        utils.confirm('您确定要将该用户强制离线吗？', () => {
            butDisabled.value = true;
            ajax.post('/Organize/OnlineUserLogout?id=' + row.id + '&userid=' + row.userId + '&clientid=' + row.clientId).then((res) => {
                let msg = res.msg;
                if (utils.length(msg) === 0) {
                    msg = res.success ? "操作成功！" : "操作失败！";
                }
                utils.msg(msg, res.success);
                butDisabled.value = false;
                if (res.success) {
                    loadTableData();
                }
            }).catch(() => { });
        });
    }

</script>