<template>
    <div>
        <!-- 开票业务基础设置 -->
        <div class="form-container">
            <el-form :inline="true" :model="formData">
                <el-form-item label="账套编号">
                    <el-input v-model="formData.accountcode" style="width: 200px;" clearable></el-input>
                </el-form-item>
                <el-form-item label="账套名称">
                    <el-input v-model="formData.accountname" style="width: 200px;" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadTableData(true)" icon="Search">查询</el-button>
                    <!-- <el-button type="default" @click="reset" icon="Refresh">重置</el-button> -->
                    <el-button type="success" @click="addNew" icon="Plus">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-container">
            <el-table :data="tableData" v-loding="loading" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" style="width: 100%; color: #000 "
                :header-cell-style="headerCellStyle" v-bind="$attrs" @current-change="tableCurrentChange">
                >
                <el-table-column prop="id" v-if="false" width="1" />
                <el-table-column prop="accountcode" label="账套编号" align="center" width="150"></el-table-column>
                <el-table-column prop="accountname" label="账套名称" align="center" width="150"></el-table-column>
                <el-table-column prop="Status" label="状态" align="center" width="150">
                    <template #default="scope">
                        <el-tag effect="light" :type="scope.row.status == '启用' ? 'success' : 'danger'">{{
                            scope.row.status
                            }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <!-- <el-button type="success" size="small" @click="onDetail(scope.row)">详情</el-button> -->
                        <el-button size="small" type="primary" @click="onEdit(scope.row)">修改</el-button>
                        <el-button size="small" type="danger" @click="Delete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagerdiv">
                <el-pagination v-model:currentPage="pager.number" v-model:page-size="pager.size"
                    :page-sizes="pager.sizes" :background="pager.background" :layout="pager.layout" :total="pager.total"
                    :disabled="butDisabled" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
            <!--提交窗口-->
            <el-dialog v-model="dialogShow" :title="dialogTitle" align-center destroy-on-close width="800px" draggable
                :close-on-click-modal="false">
                <!-- <component :is="dialogPage" :query="dialogQuery"></component> -->
                <Add v-model:id="id" v-model:new="newdata"></Add>
            </el-dialog>
        </div>
    </div>
</template>

<script setup>
import { ref, inject, onMounted, shallowRef, provide, reactive, nextTick, watch, computed, defineAsyncComponent } from 'vue'
import { View, Edit, Search, Plus, Refresh, Tools } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios';
const Add = defineAsyncComponent(() => import('./basicadd.vue'))
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
const qs = inject('qs');
const openmenu = inject('index_openmenu');//首页打开菜单
const removetab = inject('index_removetab');//首页关闭标签方法
const refreshtab = inject('index_refreshtab');//首页刷新标签方式
const butDisabled = ref(false);//按钮是否可用
const loading = ref(false);//加载状态
let selectRows = [];//保存选择的行
const defaultOrder = ref({ prop: 'accountcode', order: 'ascending' });
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const pager = ref(utils.getPager(defaultOrder.value));
const tableData = ref([]);//表格数据
const id = ref('');//id
const newdata = ref(false);//是否新增
onMounted(() => {
    loadTableData(false);
});

//表单数据
const formData = ref({
    accountcode: '',
    accountname: '',
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
    // formData.value['date1'] = utils.length(formDataDateRange.value) > 0 ? formDataDateRange.value[0] : '';
    // formData.value['date2'] = utils.length(formDataDateRange.value) > 1 ? formDataDateRange.value[1] : '';
    ajax.post('/cn_account/GetList?srcorgid=' + sobInfo.value.id, qs.stringify(formData.value)).then((res) => {
        tableData.value = res.data.rows;
        pager.value.total = res.data.total;
        butDisabled.value = false;
        loading.value = false;
    }).catch(() => { butDisabled.value = false; loading.value = false; });
};

//重置
const reset = () => {
    form.value.accountNumber = '';
    form.value.accountName = '';
};
//新增
const dialogTitle = ref('');
const dialogPage = shallowRef(null);
const dialogShow = ref(false);//是否显示窗口
const addNew = () => {
    id.value = '';
    newdata.value = true;
    dialogTitle.value = '新增';
    dialogPage.value = Add;
    dialogShow.value = true;
};
// 修改
const onEdit = (row) => {
    id.value = row.id;
    newdata.value = false;
    dialogTitle.value = '修改';
    dialogPage.value = Add;
    dialogShow.value = true;
};
// 删除
const Delete = (row) => {
    ElMessageBox.confirm('确定删除该账套?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        ajax.post('/cn_account/DeleteAll', qs.stringify({ id: row.id }))
            .then((res) => {
                utils.msg(res.msg, res.success ? 'success' : 'error', false);
                refreshtab();
            })
            .catch((error) => {
                utils.msg('删除操作失败', 'error', false);
            });
    }).catch(() => {
        utils.msg('已取消删除', 'info', false);
    });
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
// 表头单元格样式
function headerCellStyle({ row, column, rowIndex, columnIndex }) {
    return {
        color: '#000',
        textAlign: 'center',
    }
}

provide('submit_dialogshow', dialogShow);
// provide('refreshtab', refreshtab); //刷新标签
// provide('removetab', removetab); //关闭标签
// provide('openmenu', openmenu); //打开菜单

</script>

<style scoped>
@import './css/setting.css'
</style>
