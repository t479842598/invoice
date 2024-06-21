<template>
    <div>
        <!-- 红字发票列表-->
        <div class="form-container">
            <el-form :inline="true" :model="formData">
                <el-form-item label="单位名称">
                    <el-input v-model="formData.name" style="width: 230px;" clearable></el-input>
                </el-form-item>
                <el-form-item label="纳税人识别号">
                    <el-input v-model="formData.taxno" style="width: 230px;" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadTableData(true)" icon="Search">查询</el-button>
                    <!-- <el-button type="success" @click="addNew" icon="Plus">新增</el-button> -->
                </el-form-item>
            </el-form>
        </div>
        <div class="table-container">
            <el-table :data="tableData" v-loding="loading" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" style="width: 100%; color: #000 "
                :header-cell-style="headerCellStyle" v-bind="$attrs" @current-change="tableCurrentChange">
                >
                <el-table-column prop="blueid" v-if="false" width="1" />
                <el-table-column v-for="(item, index) in tableColumns" fit show-overflow-tooltip min-width="200%"
                    :key="index" :prop="item.prop" :label="item.label" align="center" :width="item.width">
                </el-table-column>
                <el-table-column label="操作" fixed="right" align="center" width="170">
                    <template #default="scope">
                        <!-- <el-button type="success" size="small" @click="onDetail(scope.row)">详情</el-button> -->
                        <el-button size="small" type="primary" @click="onEdit(scope.row)">修改</el-button>
                        <el-button size="small" type="danger" @click="Delete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="roadui_pagerdiv">
                <el-pagination v-model:currentPage="pager.number" v-model:page-size="pager.size" :page-sizes="pager.sizes"
                    :background="pager.background" :layout="pager.layout" :total="pager.total" :disabled="butDisabled"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, inject, onMounted, shallowRef, provide, reactive, nextTick, watch, computed, defineAsyncComponent } from 'vue'
import { View, Edit, Search, Plus, Refresh, Tools } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios';
const Add = defineAsyncComponent(() => import('./components/redInvoice.vue'))
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
const qs = inject('qs');
const openmenu = inject('index_openmenu');//首页打开菜单
const removetab = inject('index_removetab');//首页关闭标签方法
const refreshtab = inject('index_refreshtab');//首页刷新标签方式
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const butDisabled = ref(false);//按钮是否可用
const loading = ref(false);//加载状态
let selectRows = [];//保存选择的行
const defaultOrder = ref({ prop: '', order: 'ascending' });
const pager = ref(utils.getPager(defaultOrder.value));
const tableData = ref([]);//表格数据
const id = ref('');//id
const blueid = ref('');//蓝字发票id
onMounted(() => {
    loadTableData(false);
});
// 表格循环列
const tableColumns = [
    { prop: 'redConfirmSerialNo', label: '开票流水号' },
    { prop: 'redConfirmNo', label: '红字确认单编号' },
    { prop: 'redInvoiceNo', label: '红字发票号' },
    { prop: 'confirmState', label: '确认单状态' },
    { prop: 'invoiceDate', label: '开具日期' },
    { prop: 'invoiceTotalPriceTax', label: '价税合计' },
    { prop: 'invoiceTotalPrice', label: '无税金额' },
    { prop: 'invoiceTotalTax', label: '税额' },
    { prop: 'sellerTaxName', label: '销售方名称' },
    { prop: 'sellerTaxNo', label: '销方税号' },
    { prop: 'buyerTaxName', label: '购方名称' },
    { prop: 'buyerTaxNo', label: '购方税号' },
    { prop: 'originalInvoiceNo', label: '蓝字发票号' },
    { prop: 'remarks', label: '备注' },
    { prop: 'msg', label: '错误提示' },
]
//表单数据
const formData = ref({
    // name: '',//单位名称
    // taxno: '',//纳税人识别号
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
    ajax.post('/Invoice/GetRedList?srcorgid=' + sobInfo.value.id, qs.stringify(formData.value)).then((res) => {
        // console.log(res)
        tableData.value = res.data.rows;
        pager.value.total = res.data.total;
        butDisabled.value = false;
        loading.value = false;
    }).catch(() => { butDisabled.value = false; loading.value = false; });
};
//新增
const dialogTitle = ref('');
const dialogPage = shallowRef(null);
const RedShow = ref(false);//是否显示窗口
const addNew = () => {
    id.value = '';
    dialogTitle.value = '新增';
    dialogPage.value = Add;
    RedShow.value = true;
};
// 修改
const onEdit = (row) => {
    id.value = row.id;
    blueid.value = row.blueid;
    dialogTitle.value = '红冲发票修改';
    dialogPage.value = Add;
    RedShow.value = true;
};
// 删除
async function Delete(row) {
    try {
        await ElMessageBox.confirm('确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        });
        const res = await ajax.post('/SystemAccount/Delete', qs.stringify({ id: row.id }));
        const messageType = res.success ? 'success' : 'error';
        utils.msg(res.msg, messageType, false);
        refreshtab();
    } catch (error) {
        if (error === 'cancel') {
            utils.msg('已取消删除', 'info', false);
        }
        // handle other errors
    }
}
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
provide('RedShow', RedShow);
provide('getTableData', loadTableData);

provide('submit_dialogshow', RedShow);
// provide('refreshtab', refreshtab); //刷新标签
// provide('removetab', removetab); //关闭标签
// provide('openmenu', openmenu); //打开菜单

</script>

<style scoped>
@import './css/setting.css';
</style>
