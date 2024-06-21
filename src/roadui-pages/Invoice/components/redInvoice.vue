<style scoped>
@import '../../../roadui-assets/before.css';
@import '../../../roadui-assets/required.css';
@import '../../main/Customsubmit.css';

.vertical-text {
    writing-mode: vertical-rl;
    letter-spacing: 10px;
    padding-top: 10px;
}

:deep(.el-table__border-left-patch) {
    background-color: #99938f;
    width: 0.5px;
}

:deep(.el-table--border::after) {
    background-color: #99938f;
    /* width: 0.5px; */
}

:deep(.el-table__inner-wrapper::before) {
    background-color: #99938f;
    height: 0.5px;
}

:deep(.el-table) {
    border-color: #99938f !important;
}

:deep(.el-form-item__label) {
    color: #6f4946
}

:deep(.remarkTable) td {
    padding: 0 !important;
}

:deep(.remarkTable .el-textarea__inner) {
    height: 115px !important;
    border-radius: 0 !important;
    width: 100%;
}

:deep(.eltable .el-scrollbar__wrap, .el-scrollbar__wrap--hidden-default) {
    min-height: 300px !important;
}

:deep(.maintable .el-form-item .el-form-item__label) {
    display: block !important;
    text-align: justify !important;
    text-align-last: justify !important;
}

:deep(.maintable .selectBtn) {
    border-radius: 0 !important;
}

:deep(.maintable .el-form-item__content .el-input .el-input__wrapper) {
    border-radius: 0 !important;
}

:deep(.remarkTable .el-form-item__content .el-input .el-input__wrapper) {
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 0 !important;
}

:deep(.remarkTable .el-form-item__content .el-input, .el-input__inner) {
    border: 0 !important;
    max-width: 60% !important;
}

:deep(.remarkTable .el-form-item) {
    width: 100% !important;
}

:deep(.remarkTable .el-form-item:first-child) {
    margin: 0 !important;
}

:deep(.el-form-item) {
    margin-bottom: 10px !important;
}

:deep(.maintable .type div) {
    margin: 0 !important;
}

:deep(.maintable .show) {
    padding: 0 !important;
    overflow: hidden;
    margin-left: -5px;
}

:deep(.maintable .show .el-form-item__content) {
    margin: 0 !important;
}

:deep(.maintable .show .el-checkbox__label) {
    padding-left: 3px !important;
    font-size: 12px !important;
}

:deep(.amountshow span) {
    margin-left: 12px;
}

:deep(.el-input.is-disabled .el-input__inner) {
    background-color: #ffffff !important;
    color: #303133 !important;
    -webkit-text-fill-color: #000000 !important;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
    background-color: #ffffff !important;
    color: #303133 !important;
}

.black {
    color: #000 !important;
}

/* .show_table {
    position: relative;
    width: 100%;
    max-height: 500px;
    overflow: auto;
} */

:deep(.colschange .el-form-item__content .black) {
    overflow: hidden;
    word-wrap: break-word !important;
    word-break: normal !important;
}
</style>
<template>
    <div style="overflow: hidden;overflow-y:scroll;padding-bottom: 10px;">
        <el-form inline v-if="!readonly" style="padding-left: 5px;">
            <el-form-item label="开票流水号:">
                <div style="width: 200px;">{{ formDatas.serialNo }}</div>
            </el-form-item>
            <el-form-item style="margin-left: 280px">
                <!-- <el-button type="primary" @click="SaveData()">保存</el-button> -->
                <el-button type="primary" @click="AddRedInvoice()">开具</el-button>
                <el-button @click="RedShow = false">关闭</el-button>
            </el-form-item>
        </el-form>
        <table border="1" cellpadding="1" cellspacing="1"
            style="line-height: 50px;border-color: #99938f;border-width: 1px;color: #6f4946;width: 100%;margin-bottom: 0;"
            class="table maintable">
            <tbody>
                <tr>
                    <td class="type" colspan="4" height="50" style="padding-left: 5px;font-weight: bold;">
                        <el-form :model="formDatas" ref="ruleFormRef" style="width: 250px !important;">
                            <el-form-item style="margin: auto;" label="红冲原因:" prop="redInvoiceLabel">
                                <el-select v-model="formDatas.redInvoiceLabel" :disabled="readonly"
                                    style="width: 200px;">
                                    <el-option v-for="item in redInvoiceList" :key="item.id" :label="item.label"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </td>
                    <td colspan="4" height="50" class="type" style="padding-left: 5px;font-weight: bold;">
                        <el-form :model="formDatas" ref="ruleFormRef">
                            <el-form-item style="margin: auto;" label="发票类型:" prop="originInvoiceTypeName">
                                <span>{{ formDatas.originInvoiceTypeName }}</span>
                            </el-form-item>
                        </el-form>
                    </td>
                </tr>
                <!-- 左侧 -->
                <tr style="height: 100px !important;">
                    <td width="26" class="center vertical-text" style="font-weight: bolder;">购买方</td>
                    <td colspan="3" width="250" style="padding: 15px 10px 0px 10px;">
                        <el-form :model="formDatas" ref="ruleFormRef" label-width="100px">
                            <el-form-item label="名称" prop="buyerName" style="position: relative;">
                                <span class="black">
                                    {{ formDatas.buyerTaxName }}
                                </span>
                            </el-form-item>
                            <el-form-item label="纳税人识别号" prop="buyerTaxNo">
                                <span class="black">
                                    {{ formDatas.buyerTaxNo }}
                                </span>
                            </el-form-item>
                        </el-form>
                    </td>
                    <!-- 右侧 -->
                    <td width="26" class="center vertical-text" style="font-weight: bolder;">销售方</td>
                    <td colspan="3" width="250" style="padding: 15px 10px 0px 10px;">
                        <el-form :model="formDatas" ref="ruleFormRef" label-width="110px">
                            <el-form-item label="名称" prop="sellerid">
                                <span class="black">
                                    {{ formDatas.sellerTaxName }}
                                </span>
                            </el-form-item>
                            <el-form-item label="纳税人识别号" prop="sellerTaxNo">
                                <span class="black">
                                    {{ formDatas.sellerTaxNo }}
                                </span>
                            </el-form-item>
                        </el-form>
                    </td>
                </tr>
            </tbody>
        </table>
        <el-table class="eltable show_table" :data="detailData" v-loading="loading" :stripe="pager.tableStripe"
            :highlight-current-row="pager.tableHighlightCurrentRow" style="width: 100%; color: #000;margin-bottom: 20px"
            :header-cell-style="headerCellStyle" :default-sort="defaultOrder" @selection-change="handleSelectionChange"
            :row-style="changRed">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <template v-for="item in tableDetails">
                <el-table-column v-if="item.show" :prop="item.prop" fit show-overflow-tooltip :min-width="item.minWidth"
                    :label="item.label" :align="item.align" :width="item.width">
                </el-table-column>
            </template>
        </el-table>
    </div>
</template>

<script setup>
import { ref, inject, onMounted, shallowRef, provide, reactive, nextTick, watch, computed } from 'vue'
import { Delete, Select, Close } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios';
import { merge } from 'lodash';
const ajax = inject('ajax');
const utils = inject('utils');
const qs = inject('qs');
const config = inject('config');
const RedShow = inject('RedShow');//关闭标签方式
const TableData = inject('getTableData');//刷新标签方式
const Detail = inject('postSaleDetail');//获取明细表数据
const index_refreshtab = inject('index_refreshtab');//首页刷新标签方式
const defaultOrder = ref({ prop: 'goodsLineNo', order: 'ascending' });
const pager = ref(utils.getPager(defaultOrder.value));
const butDisabled = ref(false);//按钮是否可用
const loading = ref(false);//加载状态
const selectrow = ref([]);//多选
// const blueid = ref('');//蓝票id
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const redInvoiceList = ref([
    { id: '01', label: '开票有误' },
    { id: '02', label: '销货退回' },
    { id: '03', label: '服务中止' },
    { id: '04', label: '销售折让' },
])
onMounted(() => {
    // open();
    // postSaleDetail();
    getformdata();
})


// 创建emits
const emits = defineEmits(['update:id', 'update:blueid',])
// 创建props
const props = defineProps({
    query: { type: String, default: () => { return ''; } },
    modelValue: { type: Boolean, default: false },
    id: { type: String, default: "" },
    blueid: { type: String, default: "" },
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

const id = defineModel('id')
const blueid = defineModel('blueid')
const readonly = defineModel('readonly')



// 表单信息
const formDatas = ref({
    id: '',
    serialNo: '',
    buyerTaxNo: '',
    buyerName: '',
    sellerName: '',
    sellerTaxNo: '',
    redInvoiceLabel: '',//红冲原因
    originInvoiceType: '',//发票类型
    originInvoiceTypeName: '',//发票类型名称
})
// 明细表格循环
const tableDetails = ref([
    { prop: 'id', align: 'center', show: false },
    { prop: 'goodsLineNo', label: '序号', align: 'center', show: false, width: '60', },
    { prop: 'goodsCode', label: '商品编号', show: true, align: 'center', width: '200', },
    { prop: 'goodsName', label: '商品名称', show: true, align: 'center', width: '160', },
    { prop: 'goodsSpecification', label: '规格型号', show: true, align: 'center', width: '130', },
    { prop: 'goodsUnit', label: '单位', show: true, align: 'center', width: '100', },
    { prop: 'goodsQuantity', label: '数量', show: true, align: 'center', width: '100', },
    { prop: 'goodsPrice', label: '单价', show: true, align: 'center', width: '110', },
    { prop: 'goodsTotalPrice', label: '价税合计', show: true, align: 'right', width: '110', },
    { prop: 'notaxamount', label: '无税金额', show: true, align: 'right', width: '110', },
    { prop: 'goodsTotalTax', label: '税额', show: true, align: 'center', width: '110' },
    { prop: 'goodsTaxRate', label: '税率/征收率', show: true, align: 'center', minWidth: '120', },
    { prop: 'invoiceLineNature', label: '发票行性质', show: false, align: 'center', width: '200', },
    { prop: 'discountRate', label: '折扣率', show: false, align: 'center', width: '200', },
    { prop: 'discountAmount', label: '折扣额', show: false, align: 'center', width: '200', },
])

// 打开页面
function open() {
    // 初始化
    // formDatas.value = {
    //     id: id.value,
    //     serialNo: serialNo.value,
    //     buyerTaxNo: buyerTaxNo.value,
    //     buyerName: buyerName.value,
    //     // invoiceTotalPrice: invoiceTotalPrice.value,
    //     // invoiceTotalTax: invoiceTotalTax.value,
    //     invoiceTypeName: invoiceTypeName.value,//发票类型
    // };
}
const getformdata = async () => {
    loading.value = true;
    try {
        const res = await ajax.post('/Invoice/GetRedInvoice', qs.stringify({ id: id.value, blueid: blueid.value }));
        if (Array.isArray(res.data.invoicemain) && res.data.invoicemain.length > 0) {
            formDatas.value = res.data.invoicemain[0];
            formDatas.value.sellerName = res.data.invoicemain[0].sellerTaxName;
            formDatas.value.buyerName = res.data.invoicemain[0].buyerTaxName;
            formDatas.value.buyerTaxNo = res.data.invoicemain[0].buyerTaxNo;
            formDatas.value.serialNo = res.data.invoicemain[0].redConfirmSerialNo;
            detailData.value = res.data.invoicedetail;
        }
    } catch (error) {
        // 这里可以添加你的错误处理逻辑
    } finally {
        loading.value = false;
    }
}

// 保存
function SaveData() {
    // ElMessageBox.confirm('是否确认保存？', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    // }).then(() => {
    ajax.post('/Invoice/SaveRedInvoice?srcorgid=' + sobInfo.value.id, qs.stringify({ redinvoiceJSON: JSON.stringify(formDatas.value), invoicedetailsJSON: JSON.stringify(detailData.value) })).then((res) => {
        const messageType = res.success ? 'success' : 'error';
        utils.msg(res.msg, messageType, false);
        if (res.success) {
            addredInvoice()
        }
    }).catch(() => { });
    // }).catch(() => { });
}
// 开具
function AddRedInvoice() {
    ElMessageBox.confirm('是否确认开具？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        SaveData()
    }).catch(() => { });
}
// 开具
function addredInvoice() {
    ajax.post('/Invoice/AddRedInvoice?srcorgid=' + sobInfo.value.id, qs.stringify({ id: formDatas.value.id, blueid: blueid.value })).then((res) => {
        const messageType = res.success ? 'success' : 'error';
        utils.msg(res.msg, messageType, false);
        if (res.success) {
            TableData()
            RedShow.value = false;
        }
    }).catch(() => { });
}
// 多选
const handleSelectionChange = (val) => {
    selectrow.value = val
}
// 明细表数据
const detailData = ref([])
// 表头单元格样式
function headerCellStyle({ row, column, rowIndex, columnIndex }) {
    return {
        color: '#000',
        textAlign: 'center',
    }
}

// 表格行样式
function changRed({ row }) {
    if (row.goodsTotalPrice === 0) { // 变颜色的条件
        return {
            backgroundColor: "yellow"  // 这个return的就是样式 可以是color 也可以是backgroundColor
        }
    }
}

defineExpose({
    open,
    headerCellStyle,
})
</script>
