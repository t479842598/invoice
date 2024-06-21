<template>
    <div v-loading="loading">
        <div class="table-container">
            <el-table :data="tableData" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" style="width: 100%;max-height: 30vh; color: #000 "
                :header-cell-style="headerCellStyle" v-bind="$attrs" @current-change="tableCurrentChange"
                :row-style="changmaincolor">
                <el-table-column prop="id" v-if="false" width="1" />
                <el-table-column prop="salebillid" v-if="false" width="1" />
                <el-table-column v-for="(column, index) in maincolumns" :key="index" :prop="column.prop"
                    :label="column.label" :align="column.align" :width="column.width">
                </el-table-column>
            </el-table>
        </div>
        <div class="table-text">
            <table border="0" class="table">
                <tr>
                    <td width="65%" align="center">
                        发票张数：{{ invoiceCount }}张
                    </td>
                    <td width="17.5%">
                        价税合计：{{ invoiceTotalPrice }}元
                    </td>
                    <td width="17.5%">
                        合计税额：{{ invoiceTotalTax }}元
                    </td>
                </tr>
            </table>
        </div>
        <div>
            <h3 class="before">发票明细</h3>
        </div>
        <div class="table-container">
            <el-table :data="detailData" v-loading="loading" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" style="width: 100%;height: 30vh;color: #000"
                :header-cell-style="headerCellStyle" :default-sort="defaultOrder" :row-style="changdetailcolor">
                <template v-for="item in tableDetail">
                    <el-table-column v-if="item.show" :prop="item.prop" :label="item.label" :align="item.align"
                        :width="item.width" />
                </template>
            </el-table>
        </div>
        <div class="roadui_pagerdiv">
            <el-pagination v-model:currentPage="pager.number" v-model:page-size="pager.size" :page-sizes="pager.sizes"
                :background="pager.background" :layout="pager.layout" :total="pager.total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, shallowRef, provide, reactive, nextTick, watch, defineAsyncComponent, computed } from 'vue'
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
const qs = inject('qs');
const index_openmenu = inject('index_openmenu');//首页打开菜单
const index_removetab = inject('index_removetab');//首页关闭标签方法
const index_refreshtab = inject('index_refreshtab');//首页刷新标签方式
const index_userinfo = inject('index_userinfo');//首页用户信息
const defaultOrder = ref({ prop: 'goodsLineNo', order: 'ascending' });
const pager = ref(utils.getPager(defaultOrder.value));
const butDisabled = ref(false);//按钮是否可用
const loading = ref(false);//加载状态
const invoiceCount = ref(0);//发票张数
const invoiceTotalPrice = ref(0);// 发票总金额
const invoiceTotalTax = ref(0);// 发票总税额
const saleid = ref('');//发票id
// 创建emits
const emits = defineEmits(['update:id'])
// 创建props
const props = defineProps({
    query: { type: String, default: () => { return ''; } },
    modelValue: { type: Boolean, default: false },
    id: { type: String, default: "" },
})
// 创建计算属性
function createComputed(propName) {
    return computed({
        get: () => props[propName],
        set: (val) => {
            emits(`update:${propName}`, val)
        }
    })
}
const id = createComputed('id')
onMounted(async () => {
    // 获取主表数据
    await getTableData();
})
// 主表数据
const tableData = ref([]);
// 明细表数据
const detailData = ref([])
// 获取表格数据
async function getTableData() {
    loading.value = true;
    try {
        const res = await ajax.post('/Invoice/Get', qs.stringify({ ids: id.value }));
        butDisabled.value = true;
        if (res.data.invoicemain.length > 0) {
            saleid.value = res.data.invoicemain[0].id;
            tableData.value = res.data.invoicemain
            invoiceCount.value = res.data.invoicemain.length;
        }
        // 发票总金额等于res.data.invoicemain.invoiceTotalPrice的总和
        // 发票总税额等于res.data.invoicemain.invoiceTotalTax的总和
        invoiceTotalPrice.value = 0
        invoiceTotalTax.value = 0
        for (let i = 0; i < res.data.invoicemain.length; i++) {
            invoiceTotalPrice.value = Number((invoiceTotalPrice.value + Number(res.data.invoicemain[i].invoiceTotalPriceTax)).toFixed(2))
            invoiceTotalTax.value = Number((invoiceTotalTax.value + Number(res.data.invoicemain[i].invoiceTotalTax)).toFixed(2))
        }
        if (res.success) {
            postSaleDetail()
        }
    } catch (error) {
        butDisabled.value = false;
        loading.value = false;
    } finally {
        loading.value = false;
    }
}
// 主表格循环
const maincolumns = ref([
    { prop: 'serialNo', label: '开票流水号', align: 'center', },
    { prop: 'buyerName', label: '客户名称', align: 'center', },
    { prop: 'buyerTaxNo', label: '税号', align: 'center', },
    // { prop: 'redIssueReason', label: '开票日期', align: 'center', width: '150' },
    { prop: 'invoiceTotalPriceTax', label: '含税金额', align: 'right', width: '110' },
    { prop: 'invoiceTotalTax', label: '税额', align: 'center', },
])
// 明细表格循环
const tableDetail = ref([
    { prop: 'id', align: 'center', show: false },
    { prop: 'goodsCode', label: '商品编号', show: true, align: 'center', width: '220', },
    { prop: 'goodsName', label: '商品名称', show: true, align: 'center', width: '170', },
    { prop: 'goodsSpecification', label: '规格型号', show: true, align: 'center', width: '180', },
    { prop: 'goodsUnit', label: '单位', show: true, align: 'center', width: '100', },
    { prop: 'goodsQuantity', label: '数量', show: true, align: 'center', width: '120', },
    { prop: 'goodsPrice', label: '单价', show: true, align: 'center', width: '120', },
    { prop: 'goodsTotalPrice', label: '价税合计', show: true, align: 'right', width: '120', },
    { prop: 'notaxamount', label: '无税金额', show: true, align: 'right', width: '120', },
    { prop: 'goodsTaxRate', label: '税率/征收率', show: true, align: 'center', width: '150', },
    { prop: 'goodsTotalTax', label: '税额', show: true, align: 'center', },
])


// 单击行触发
const tableCurrentChange = (currentRow, oldCurrentRow) => {
    if (currentRow != null) {
        saleid.value = currentRow.id;
        pager.value.number = 1;
        postSaleDetail()
    }
}
const detailform = ref({})
// 封装ajax请求
const postSaleDetail = async () => {
    loading.value = true;
    detailform.value = {
        id: saleid.value,
        size: pager.value.size,
        number: pager.value.number,
        order: pager.value.order,
    }
    try {
        const res = await ajax.post('/Invoice/GetInvoiceDetailMain', qs.stringify(detailform.value));
        detailData.value = res.data.rows;
        pager.value.total = res.data.total;
    } catch (error) {
        utils.msg(error.message, 'error', false);
        // 这里可以添加你的错误处理逻辑
    } finally {
        loading.value = false;
    }
}

//每页条数改变
const handleSizeChange = (size) => {
    pager.value.size = size;
    postSaleDetail()
};
//页码改变
const handleCurrentChange = (number) => {
    pager.value.number = number;
    postSaleDetail()
};




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



</script>

<style scoped>
@import '../css/task.css';
@import '../../../roadui-assets/before.css';

:deep(.successfa .el-statistic__number) {
    color: green
}

:deep(.errorfa .el-statistic__number) {
    color: red;
}
</style>