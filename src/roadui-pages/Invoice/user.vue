<template>
    <div>
        <!-- 用户管理 -->
        <div class="form-container">
            <el-form :inline="true" :model="form">
                <el-form-item label="用户编号">
                    <el-input v-model="formData.userNumber"></el-input>
                </el-form-item>
                <el-form-item label="用户名称">
                    <el-input v-model="formData.userName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="" icon="Search">查询</el-button>
                    <el-button type="default" @click="reset" icon="Refresh">重置</el-button>
                    <el-button type="success" @click="addNew" icon="Plus">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-container">
            <el-table :data="tableData" v-loading="loading" :stripe="pager.tableStripe" border style="width:100%"
                :highlight-current-row="pager.tableHighlightCurrentRow" :default-sort="defaultOrder">
                <el-table-column prop="id" v-if="false" width="1" />
                <el-table-column prop="userNumber" label="用户编号" width="150"></el-table-column>
                <el-table-column prop="userName" label="用户名称" width="150"></el-table-column>
                <el-table-column prop="status" label="状态" width="150">
                    <template #default="scope">
                        <el-tag effect="light" :type="scope.row.status == '启用' ? 'success' : 'danger'">{{
                            scope.row.status
                            }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="success" size="small" @click="views(scope.row)">查看</el-button>
                        <el-button size="small" type="primary" @click="edit(scope.row)">修改</el-button>
                        <el-button size="small" v-if="scope.row.status == '停用'" type="danger"
                            @click="del(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagerdiv">
                <el-pagination v-model:currentPage="pager.number" v-model:page-size="pager.size"
                    :page-sizes="pager.sizes" :background="pager.background" :layout="pager.layout" :total="pager.total"
                    :disabled="butDisabled" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { View, Edit, Search, Plus, Refresh, Tools } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios';
import { nextTick } from 'process'
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
const qs = inject('qs');
const index_openmenu = inject('index_openmenu');//首页打开菜单
const index_removetab = inject('index_removetab');//首页关闭标签方法
const index_refreshtab = inject('index_refreshtab');//首页刷新标签方式
const butDisabled = ref(false);//按钮是否可用
const loading = ref(false);//加载状态
const type = ref('');//类型
const tableData = ref([
    //生成五条数据
    { id: 1, userNumber: '001', userName: '用户1', status: '启用' },
    { id: 2, userNumber: '002', userName: '用户2', status: '启用' },
    { id: 3, userNumber: '003', userName: '用户3', status: '启用' },
    { id: 4, userNumber: '004', userName: '用户4', status: '停用' },
    { id: 5, userNumber: '005', userName: '用户5', status: '启用' },
    { id: 6, userNumber: '006', userName: '用户6', status: '启用' },
    { id: 7, userNumber: '007', userName: '用户7', status: '停用' },
    { id: 8, userNumber: '008', userName: '用户8', status: '启用' },
]);//表格数据
let selectRows = [];//保存选择的行
const defaultOrder = ref({ prop: 'userNumber', order: 'ascending' });
const pager = ref(utils.getPager(defaultOrder.value));
//表单数据
const formData = ref({
    userNumber: '',
    userName: '',
});
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
    ajax.post('/Flow/GetTodoList', qs.stringify(formData.value)).then((res) => {
        tableData.value = res.data.rows;
        pager.value.total = res.data.total;
        butDisabled.value = false;
        loading.value = false;
    }).catch(() => { butDisabled.value = false; loading.value = false; });
};
//重置
const reset = () => {
    form.value.userNumber = '';
    form.value.userName = '';
};
//新增
const addNew = () => {
};

//每页条数改变
const handleSizeChange = (size) => {
    pager.value.size = size;
    // loadTableData(false);
};
//页码改变
const handleCurrentChange = (number) => {
    pager.value.number = number;
    // loadTableData(false);
};
//排序
const sortChange = (order) => {
    pager.value.order = utils.getOrder(order);
    // loadTableData(false);
};



</script>

<style scoped>
@import './css/setting.css'
</style>
