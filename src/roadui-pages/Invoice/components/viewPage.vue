<style scoped>
@import '../../main/Customsubmit.css';
@import '../../../roadui-assets/viewpage.css';

.main-page {
    max-height: 90vh;
    overflow: hidden;
    overflow-y: scroll;
    padding-bottom: 10px;
    font-family: 'STSong';
    font-weight: 600;
    margin-top: -20px;
    width: 1150px;
}

.top {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100px;
    position: relative;
    margin-bottom: 20px;
}

.top-div {
    width: 400px;
    text-align: center;
    color: #AD7353;
}

.top-div-1 {
    position: absolute;
    top: 40px;
    right: 50px;
}

.top-title {
    width: fit-content;
    text-align: right;
    color: #AD7353;
}

.top-title span {
    font-size: 14px;
    color: #585859;
}

.image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
}

.image-slot .el-icon {
    font-size: 30px;
}
</style>
<template>
    <div class="main-page">

        <!-- 顶部标题内容 -->
        <div class="top">
            <div style="position: absolute;left: 0px;top: 0;">
                <el-image style="width: 120px; height: 120px" :src="formDatas.base64Image" fit="scale-down">
                    <template #error>
                        <div class="image-slot">
                            <el-icon>
                                <Picture />
                            </el-icon>
                        </div>
                    </template>
                </el-image>
            </div>
            <div class="top-div">
                <div v-if="type == '普通发票' || type == '专用发票'" style="font-size: 28px;">电子发票（{{ type }}）</div>
                <div v-else style="font-size: 28px;">电子发票（普通发票）</div>
                <div style="border: 1.1px solid #AD7353;margin-top: 8px;"></div>
                <div style="border: 1.1px solid #AD7353;margin-top: 3px;"></div>
            </div>
            <div class="top-div-1">
                <div class="top-title">发票号码：<span>{{ formDatas.invoiceNo }}</span>
                </div>
                <div class="top-title">开票日期：<span>{{ formDatas.invoiceDate
                }}</span></div>
            </div>
        </div>

        <!-- 中部表格内容 -->
        <table border="1" cellpadding="1" cellspacing="1"
            style="line-height: 50px;border-color: #AD7353;border-width: 1.3px;color: #AD7353;width: 100%;margin-bottom: 0;font-family: 'STSong';font-weight: 600;"
            class="table maintable">
            <tbody>
                <!-- 左侧 -->
                <tr style="height: 80px !important;">
                    <td class="vertical-text" style="font-weight: bolder;width: 30px !important;">
                        购买方信息</td>
                    <td colspan="3" width="257" style="padding: 15px 10px 0px 10px;">
                        <el-form :model="formDatas">
                            <el-form-item label="名称:" style="position: relative;">
                                <span style="font-size: 12px; color: #585859;">
                                    {{ formDatas.buyerName }}
                                </span>
                            </el-form-item>
                            <el-form-item label="统一社会信用代码/纳税人识别:">
                                <span style="font-size: 12px; color: #585859;">
                                    {{ formDatas.buyerTaxNo }}
                                </span>
                            </el-form-item>
                        </el-form>
                    </td>
                    <!-- 右侧 -->
                    <td class="vertical-text" style="font-weight: bolder;width: 30px !important;">
                        销售方信息</td>
                    <td colspan="3" width="243" style="padding: 15px 10px 0px 10px;">
                        <el-form :model="formDatas" ref="ruleFormRef">
                            <el-form-item label="名称:">
                                <span style="font-size: 12px; color: #585859;">
                                    {{ formDatas.sellerName }}
                                </span>
                            </el-form-item>
                            <el-form-item label="统一社会信用代码/纳税人识别:">
                                <span style="font-size: 12px; color: #585859;">
                                    {{ formDatas.sellerTaxNo }}
                                </span>
                            </el-form-item>
                        </el-form>
                    </td>
                </tr>
            </tbody>
        </table>
        <el-table class="eltable show_table" :data="detailData" v-loading="loading" size="small" :stripe="pager.tableStripe"
            :highlight-current-row="pager.tableHighlightCurrentRow" style="width: 100%; color: #000;"
            :header-cell-style="headerCellStyle" :default-sort="defaultOrder" @selection-change="handleSelectionChange"
            :row-style="changRed">
            <!-- <template > -->
            <el-table-column v-for="item in tableDetails" :prop="item.prop" fit show-overflow-tooltip
                :min-width="item.minWidth" :label="item.label" :align="item.align" :width="item.width">
                <template #default="scope" v-if="item.prop === 'goodsTaxRate'">{{ scope.row[item.prop] }}%</template>
            </el-table-column>
            <!-- </template> -->
        </el-table>

        <!-- 底部金额显示 -->
        <table border
            style="width: 100%; height: 30px; font-family: 'STSong'; font-weight: 600; border: 0px solid #AD7353 !important; border-spacing: 0; border-top: 0px; color: #AD7353;">
            <tr>
                <td style="width: 30%; text-align: center; font-family: 'STSong'; font-weight: 600;font-size: 12px;">
                    价税合计（大写）
                </td>
                <td
                    style="font-family: 'STSong'; font-weight: 600; display: flex; align-items: center; justify-content: space-between; min-width: 400px;">
                    <div
                        style="width: calc(100% - 200px); text-align: left; height: 30px; font-size: 14px; color: #585859; line-height: 30px;margin-left: 30px;">
                        {{ useConvertNumMoneyToChinese(formDatas.invoiceTotalPriceTax) }}
                    </div>
                    <div style="line-height: 30px; margin-right: 50px; line-height: 30px">
                        (小写)&nbsp;<span style="font-size: 14px; color: #585859;">￥{{ formDatas.invoiceTotalPriceTax
                        }}</span>
                    </div>
                </td>
            </tr>
        </table>
        <table border
            style="width: 100%; height: 160px; font-family: 'STSong'; font-weight: 600; border: 0px solid #AD7353 !important; border-spacing: 0; border-top: 0px; color: #AD7353;font-size: 12px;">
            <tr>
                <td style="width: 30px; writing-mode: vertical-rl; vertical-align: middle; text-align: center;">备注</td>
                <td style="padding: 12px; vertical-align: top;">
                    <span style="font-size: 12px; color: #585859;">{{ formDatas.remarks }}</span>
                </td>
            </tr>
        </table>
    </div>
</template>

<script setup>
import { ref, inject, onMounted, shallowRef, provide, reactive, nextTick, watch, computed } from 'vue'
import { Delete, Select, Close } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useConvertNumMoneyToChinese } from './NumMoneyToChinese';//引入金额转中文
import axios from 'axios';
import { merge } from 'lodash';
const ajax = inject('ajax');
const utils = inject('utils');
const qs = inject('qs');
const config = inject('config');
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
onMounted(() => {
    // open();
    // postSaleDetail();
    getformdata();
})
const id = defineModel('id')
const type = defineModel('type')



// 表单信息
const formDatas = ref({
})
// 明细表格循环
const tableDetails = ref([
    // { prop: 'id', align: 'center', show: false },
    // { prop: 'goodsLineNo', label: '序号', align: 'center', show: false, width: '60', },
    // { prop: 'goodsCode', label: '商品编号', show: false, align: 'center', width: '200', },
    { prop: 'goodsName', label: '项目名称', align: 'left', width: '200', },
    { prop: 'goodsSpecification', label: '规格型号', align: 'left', width: '150', },
    { prop: 'goodsUnit', label: '单位', align: 'center' },
    { prop: 'goodsQuantity', label: '数量', align: 'right' },
    { prop: 'goodsPrice', label: '单价', align: 'right' },
    // { prop: 'goodsTotalPrice', label: '价税合计', show: false, align: 'right' },
    { prop: 'notaxamount', label: '金额', align: 'right' },
    { prop: 'goodsTaxRate', label: '税率/征收率', align: 'center' },
    { prop: 'goodsTotalTax', label: '税额', align: 'right', width: '110' },
    // { prop: 'invoiceLineNature', label: '发票行性质', show: false, align: 'center', width: '200', },
    // { prop: 'discountRate', label: '折扣率', show: false, align: 'center', width: '200', },
    // { prop: 'discountAmount', label: '折扣额', show: false, align: 'center', width: '200', },
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
        const res = await ajax.post('/Invoice/Get', qs.stringify({ ids: id.value }));
        if (Array.isArray(res.data.invoicemain) && res.data.invoicemain.length > 0) {
            formDatas.value = res.data.invoicemain[0];
        }
        if (Array.isArray(res.data.invoicedetails) && res.data.invoicedetails.length > 0) {
            detailData.value = res.data.invoicedetails;
        }
    } catch (error) {
        // 这里可以添加你的错误处理逻辑
    } finally {
        loading.value = false;
    }
}
// 获取明细表数据
// const postSaleDetail = async () => {
//     loading.value = true;
//     try {
//         const res = await ajax.post('/Invoice/GetInvoiceDetailMainNoPageList', qs.stringify({ id: id.value }));
//         detailData.value = res.data.rows;
//     } catch (error) {
//         utils.msg(error.message, 'error', false);
//         // 这里可以添加你的错误处理逻辑
//     } finally {
//         loading.value = false;
//     }
// }

// 多选
const handleSelectionChange = (val) => {
    selectrow.value = val
}
// 明细表数据
const detailData = ref([
])
// 表头单元格样式
function headerCellStyle({ row, column, rowIndex, columnIndex }) {
    return {
        color: '#AD7353',
        fontFamily: 'STSong',
        textAlign: 'center',
        fontWeight: 600,
        height: '30px',
        fontSize: '14px',
        padding: '0'
    }
}
watch(() => detailData.value, (newVal) => {
    let totalInvoicePriceTax = 0;
    let totalInvoiceTax = 0;
    let totalNotaxAmount = 0; // 添加一个变量来累加每一行的无税金额
    newVal.forEach(row => {
        totalInvoicePriceTax += Number(row.goodsTotalPrice);
        totalInvoiceTax += Number(row.goodsTotalTax);
        if (row.goodsQuantity == '' || row.goodsQuantity == null) {
            row.goodsPrice = 0;
        } else {
            let price = (Number(row.goodsTotalPrice) / Number(row.goodsQuantity)).toFixed(8);
            row.goodsPrice = isNaN(price) ? 0 : price;
        }
        const goodsTaxRate = 1 + Number(row.goodsTaxRate / 100);
        var notaxamount = (Number(row.goodsTotalPrice) / Number(goodsTaxRate)).toFixed(2);
        row.goodsTotalTax = (Number(row.goodsTotalPrice) - notaxamount).toFixed(2);
        row.notaxamount = Number(notaxamount);
        totalNotaxAmount += Number(notaxamount); // 累加每一行的无税金额
    })
    formDatas.value.invoiceTotalPriceTax = Number(totalInvoicePriceTax.toFixed(2));//价税合计
    formDatas.value.invoiceTotalTax = Number(totalInvoiceTax.toFixed(2));//税额
    formDatas.value.invoiceTotalPrice = Number(totalNotaxAmount.toFixed(2)); // 使用累加的无税金额总计

}, { deep: true })
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
