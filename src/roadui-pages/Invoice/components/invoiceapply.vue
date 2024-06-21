<template>
    <div v-loading="loading">
        <el-form ref="formbutton" inline>
            <el-form-item>
                <el-button type="primary" @click="ticketstart">申请开票</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="Searchform" :icon="Search">查询</el-button>
                <el-button type="success" @click="reset" :icon="Refresh">刷新</el-button>
            </el-form-item>
        </el-form>
        <div class="table-container">
            <el-table :data="tableData" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" style="width: 100%;height: 30vh; color: #000 "
                :header-cell-style="headerCellStyle" v-bind="$attrs" @current-change="tableCurrentChange"
                @selection-change="handleSelectionChange" :row-style="changmaincolor">
                <el-table-column prop="id" v-if="false" width="1" />
                <el-table-column prop="salebillid" v-if="false" width="1" />
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column type="index" label="序号" align="center" width="60" />
                <el-table-column v-for="(column, index) in maincolumns" :key="index" :prop="column.prop"
                    :label="column.label" :align="column.align" :width="column.width">
                    <template v-if="column.template" #default="scope">
                        <el-button type="primary" size="small" @click="openEdit(scope.row)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="table-text">
            <table border="0" class="table" width="900">
                <tr>
                    <td width="300" align="center">
                        发票张数：{{ invoiceCount }}张
                    </td>
                    <td width="300" align="center">
                        价税合计：{{ invoiceTotalPrice }}元
                    </td>
                    <td width="300" align="left">
                        合计税额：{{ invoiceTotalTax }}元
                    </td>
                </tr>
            </table>
        </div>
        <div class="roadui_pagerdiv">
            <el-pagination v-model:currentPage="pager.number" v-model:page-size="pager.size" :page-sizes="pager.sizes"
                :background="pager.background" :layout="pager.layout" :total="pager.total" :disabled="butDisabled"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
        <div>
            <h3 class="before">发票明细</h3>
        </div>
        <div class="table-container">
            <el-table :data="detailData" v-loading="loading" :stripe="pagers.tableStripe" border
                :highlight-current-row="pagers.tableHighlightCurrentRow" style="width: 100%;height: 30vh;color: #000"
                :header-cell-style="headerCellStyle" :default-sort="defaultOrder" :row-style="changdetailcolor">
                <template v-for="item in tableDetail">
                    <el-table-column v-if="item.show" :prop="item.prop" :label="item.label" :align="item.align"
                        :width="item.width" />
                </template>
            </el-table>
        </div>
        <div class="roadui_pagerdiv">
            <el-pagination v-model:currentPage="pagers.number" v-model:page-size="pagers.size"
                :page-sizes="pagers.sizes" :background="pagers.background" :layout="pagers.layout" :total="pagers.total"
                @size-change="handleSizeChanges" @current-change="handleCurrentChanges" :disabled="butDisableds" />
        </div>
        <!-- 修改 -->
        <el-dialog v-model="dialogShow" :fullscreen="fullscreen" style="padding-bottom: 10px;position: relative;"
            :title="dialogTitle" align-center destroy-on-close width="1200px" draggable :close-on-click-modal="false"
            @close="fullscreen = false">
            <EditTask ref="EditRef" v-model:id="ids" v-model:buyerTaxNo="buyerTaxNo" v-model:new="news"
                v-model:flowtaskid="flowtaskid"></EditTask>
            <el-icon @click="fullscreen = !fullscreen"
                style="position: absolute;right: 45px;top: 24px;cursor: pointer;font-size: 14px;">
                <FullScreen />
            </el-icon>
        </el-dialog>
        <!-- 查询 -->
        <el-dialog v-model="showserch" title="查询" align-center destroy-on-close width="800px" draggable
            :close-on-click-modal="false">
            <el-form :inline="true" :model="mainform" class="inline" label-width="100px">
                <el-form-item label="开票流水号">
                    <el-input v-model="mainform.serino"></el-input>
                </el-form-item>
                <el-form-item label="客户名称">
                    <el-input v-model="mainform.customername"></el-input>
                </el-form-item>
                <el-form-item label="开票日期">
                    <el-date-picker v-model="mainform.invoiceDate" type="daterange" value-format="YYYY-MM-DD"
                        clearable />
                </el-form-item>
                <el-form-item label="开票状态">
                    <el-select v-model="mainform.status" clearable>
                        <el-option label="待开票" value="待开票" />
                        <el-option label="已开票待返回电子版" value="已开票待返回电子版" />
                        <el-option label="开票完成" value="开票完成" />
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-left: 30px;">
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button type="success" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, shallowRef, provide, reactive, nextTick, watch, defineAsyncComponent, computed } from 'vue'
import type { TabPaneName } from 'element-plus'
import { View, Edit, Search, Plus, Refresh, Tools, Delete, Files, Select, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
const EditTask = defineAsyncComponent(() => import('./Edit.vue'))
import axios from 'axios';
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
const qs = inject('qs');
const index_openmenu = inject('index_openmenu');//首页打开菜单
const index_removetab = inject('index_removetab');//首页关闭标签方法
const index_refreshtab = inject('index_refreshtab');//首页刷新标签方式
const index_userinfo = inject('index_userinfo');//首页用户信息
const dialogshow = inject('view_dialogshow');
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const defaultOrder = ref({ prop: 'invoiceDate', order: 'ascending' });
const pager = ref(utils.getPager(defaultOrder.value));
const defaultOrders = ref({ prop: 'goodsCode', order: 'ascending' });
const pagers = ref(utils.getPager(defaultOrders.value));
const butDisabled = ref(false);//按钮是否可用
const butDisableds = ref(false);//按钮是否可用
const loading = ref(false);//加载状态
const invoiceCount = ref(0);//发票张数
const invoiceTotalPrice = ref(0);// 发票总金额
const invoiceTotalTax = ref(0);// 发票总税额
const saleid = ref('');//发票id
const ids = ref('');//发票id
const buyerTaxNo = ref('');//税号'
const news = ref(false);//是否新增
const EditRef = ref();//修改弹窗ref
const sendemail = ref(false);//邮件发送弹窗
const downurl = ref('')//发票下载地址
const customercode = ref('')//客户代码
const emaildata = ref('')//邮件发送地址
const connid = ref('')//发票id
const rowids = ref('')//发票明细id
const showserch = ref(false);//查询弹窗
const fullscreen = ref(false);//是否全屏
const flowtaskid = ref('');//流程任务id
// 获取表格数据
const mainform = ref({
    serino: '',//销售单据号
    customername: '',//客户名称
    invoiceDate: '',//单据日期
    status: '',//开票状态
})//明细表单
// 选中行
const selectrow = ref<any>([]);
onMounted(async () => {
    // 获取主表数据
    await getTableData();
})
// 主表数据
const tableData = ref([
]);
// 明细表数据
const detailData = ref([])
// 获取表格数据
async function getTableData() {
    try {
        // loading.value = true;
        mainform.value.size = pager.value.size
        mainform.value.number = pager.value.number
        mainform.value.order = pager.value.order
        mainform.value.data1 = mainform.value.invoiceDate[0]
        mainform.value.data2 = mainform.value.invoiceDate[1]
        mainform.value.type = ''
        const res = await ajax.post('/Invoice/GetInvoiceApplyList?srcorgid=' + sobInfo.value.id, qs.stringify(mainform.value));
        if (res.data.total == 0) {
            butDisabled.value = true;
            butDisableds.value = true;
        } else {
            butDisabled.value = false;
            butDisableds.value = false;
        }
        if (res.data.rows.length > 0) {
            tableData.value = res.data.rows
            invoiceCount.value = res.data.total;
            saleid.value = res.data.rows[0].id;
            pager.value.total = res.data.total;
            // 发票总金额等于res.data.invoicemain.invoiceTotalPrice的总和
            // 发票总税额等于res.data.invoicemain.invoiceTotalTax的总和
            invoiceTotalPrice.value = 0
            invoiceTotalTax.value = 0
            for (let i = 0; i < res.data.rows.length; i++) {
                invoiceTotalPrice.value = Number((invoiceTotalPrice.value + Number(res.data.rows[i].invoiceTotalPriceTax)).toFixed(2))
                invoiceTotalTax.value = Number((invoiceTotalTax.value + Number(res.data.rows[i].invoiceTotalTax)).toFixed(2))
            }
            postSaleDetail()
        } else {
            tableData.value = res.data.rows
            invoiceCount.value = res.data.total;
            saleid.value = '0';
            pager.value.total = res.data.total;
            // 发票总金额等于res.data.invoicemain.invoiceTotalPrice的总和
            // 发票总税额等于res.data.invoicemain.invoiceTotalTax的总和
            for (let i = 0; i < res.data.rows.length; i++) {
                invoiceTotalPrice.value = Number((invoiceTotalPrice.value + Number(res.data.rows[i].invoiceTotalPriceTax)).toFixed(2))
                invoiceTotalTax.value = Number((invoiceTotalTax.value + Number(res.data.rows[i].invoiceTotalTax)).toFixed(2))
            }
            postSaleDetail()
        }
    } catch (error) {
        butDisabled.value = false;
        // loading.value = false;
        // 这里可以添加你的错误处理逻辑
    } finally {
        // loading.value = false;
    }
}
//开票
const dialogTitle = ref('');
const dialogPage = shallowRef(null);
const dialogShow = ref(false);//是否显示窗口
// 主表格循环
const maincolumns = ref([
    { prop: 'serialNo', label: '开票流水号', align: 'center', width: '200' },
    { prop: 'buyerName', label: '客户名称', align: 'center', width: '250' },
    { prop: 'buyerTaxNo', label: '税号', align: 'center', width: '200' },
    // { prop: 'redIssueReason', label: '开票日期', align: 'center', width: '150' },
    { prop: 'invoiceTotalPriceTax', label: '含税金额', align: 'right', width: '110' },
    { prop: 'invoiceTotalTax', label: '税额', align: 'center', width: '110' },
    { label: '操作', align: 'center', template: true },
])
// 明细表格循环
const tableDetail = ref([
    { prop: 'id', align: 'center', show: false },
    { label: '序号', align: 'center', show: true, width: '60', },
    { prop: 'goodsCode', label: '商品编号', show: true, align: 'center', width: '200', },
    { prop: 'goodsName', label: '商品名称', show: true, align: 'center', width: '160', },
    { prop: 'goodsSpecification', label: '规格型号', show: true, align: 'center', width: '180', },
    { prop: 'goodsUnit', label: '单位', show: true, align: 'center', width: '100', },
    { prop: 'goodsQuantity', label: '数量', show: true, align: 'center', width: '120', },
    { prop: 'goodsPrice', label: '单价', show: true, align: 'center', width: '120', },
    { prop: 'goodsTotalPrice', label: '价税合计', show: true, align: 'right', width: '120', },
    { prop: 'goodsTaxRate', label: '税率/征收率', show: true, align: 'center', width: '200', },
    { prop: 'goodsTotalTax', label: '税额', show: true, align: 'center' },
])


// 页面加载
// 申请开票--新增
const ticketstart = async () => {
    ids.value = '0';
    buyerTaxNo.value = '';
    news.value = true;
    flowtaskid.value = '0';
    dialogPage.value = EditTask;
    dialogTitle.value = '新增';
    dialogShow.value = true;
}
// 打开修改页
const openEdit = (row) => {
    flowtaskid.value = row.flowtaskid;
    ids.value = row.id;
    news.value = false;
    dialogPage.value = EditTask;
    dialogTitle.value = '修改';
    dialogShow.value = true;
}

// 单击行触发
const tableCurrentChange = (currentRow, oldCurrentRow) => {
    if (currentRow != null) {
        saleid.value = currentRow.id;
        pager.value.number = 1;
        postSaleDetail()
    }
}
// 明细表格数据
const detailform = ref({})
// 封装ajax请求
const postSaleDetail = async () => {
    loading.value = true;
    detailform.value = {
        id: saleid.value,
        size: pagers.value.size,
        number: pagers.value.number,
        order: pagers.value.order,
    }
    try {
        const res = await ajax.post('/Invoice/GetInvoiceDetailMain', qs.stringify(detailform.value));
        detailData.value = res.data.rows;
        pagers.value.total = res.data.total;
    } catch (error) {
        utils.msg(error.message, 'error', false);
        // 这里可以添加你的错误处理逻辑
    } finally {
        loading.value = false;
    }
}
// 多选
const handleSelectionChange = (val) => {
    // 把每一行的id放到数组里面,有重复的只留一个
    selectrow.value = Array.from(new Set(val.map(item => item.id)));
}


// 每页条数改变
const handleSizeChange = (size) => {
    pager.value.size = size;
    getTableData();
};

//页码改变
const handleCurrentChange = (number) => {
    pager.value.number = number;
    getTableData();
};

// 每页条数改变
const handleSizeChanges = (size) => {
    pagers.value.size = size;
    postSaleDetail()
};

// 页码改变
const handleCurrentChanges = (number) => {
    pagers.value.number = number;
    postSaleDetail()
};
// 查询
const Searchform = () => {
    showserch.value = true;
}
// 查询
const search = () => {
    invoiceTotalTax.value = 0;
    invoiceTotalPrice.value = 0;
    pager.value.number = 1;
    getTableData();
    showserch.value = false;
}
// 刷新
const reset = () => {
    invoiceTotalTax.value = 0;
    invoiceTotalPrice.value = 0;
    mainform.value = {
        serino: '',//销售单据号
        customername: '',//客户名称
        invoiceDate: '',//单据日期
        status: '',//开票状态
    }
    getTableData();
}



// 表头单元格样式
function headerCellStyle({ row, column, rowIndex, columnIndex }) {
    return {
        color: '#000',
        textAlign: 'center',
    }
}
// 明细表格行样式
function changdetailcolor({ row }) {
    if (row.goodsTotalPrice === 0) { // 变颜色的条件
        return {
            backgroundColor: "yellow"  // 这个return的就是样式 可以是color 也可以是backgroundColor
        }
    }
}
// 主表格行样式
function changmaincolor({ row }) {
    if (row.isedit == 1) { // 变颜色的条件
        return {
            backgroundColor: "#ec5353",  // 这个return的就是样式 可以是color 也可以是backgroundColor
        }
    }
}


provide('getTableData', getTableData);
provide('postSaleDetail', postSaleDetail);
provide('dialogShow', dialogShow);

</script>

<style scoped>
@import '../css/task.css';
@import '../css/tasklist.css';
@import '../../../roadui-assets/before.css';
</style>