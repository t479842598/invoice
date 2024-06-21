<template>
    <div>
        <el-form-item>
            <el-button :icon="Select" type="primary" @click="SaveData">保存</el-button>
            <el-button :icon="Delete" type="danger" @click="DeleteAll">作废</el-button>
        </el-form-item>
        <table border="0" style="margin-left: 20px;" cellpadding="1" cellspacing="1" min-width="1200" class="table">
            <tbody>
                <tr>
                    <td width="120" class="center">开票流水号</td>
                    <td width="220">
                        {{ formDatas.serialNo }}
                    </td>
                    <td width="120" class="center">客户名称</td>
                    <td width="220">
                        <el-input v-model="formDatas.buyerName"></el-input>
                    </td>
                    <td width="125" class="center">纳税人识别号</td>
                    <td width="220">
                        <el-input v-model="formDatas.buyerTaxNo"></el-input>
                    </td>
                    <td width="120" class="center">单位地址</td>
                    <td width="220">
                        <el-input v-model="formDatas.buyerAddress"></el-input>
                    </td>
                </tr>
                <tr>
                    <td width="100" class="center">含税金额</td>
                    <td width="220">
                        <el-input v-model="formDatas.invoiceTotalPriceTax"></el-input>
                    </td>
                    <td width="120" class="center">税额</td>
                    <td width="220">
                        <el-input v-model="formDatas.invoiceTotalTax"></el-input>
                    </td>
                    <td width="125" class="center">无税金额</td>
                    <td width="220">
                        <el-input v-model="formDatas.invoiceTotalPrice"></el-input>
                    </td>
                    <td width="100" class="center">银行账户</td>
                    <td width="220">
                        <el-input v-model="formDatas.buyerBankAccount"></el-input>
                    </td>

                </tr>
                <tr>
                    <td width="100" class="center">原单据含税金额</td>
                    <td width="220">
                        {{ formDatas.oldinvoiceTotalPriceTax }}
                    </td>
                    <td width="120" class="center">原单据税额</td>
                    <td width="220">
                        {{ formDatas.oldinvoiceTotalTax }}
                    </td>
                    <td width="125" class="center">原单据无税金额</td>
                    <td width="220">
                        {{ formDatas.oldinvoiceTotalPrice }}
                    </td>
                    <td width="120" class="center">开户银行</td>
                    <td width="220">
                        <el-input v-model="formDatas.buyerBankName"></el-input>
                    </td>
                </tr>
                <tr>
                    <td width="125" class="center">备注</td>
                    <td colspan="3">
                        <el-input type="textarea" autosize v-model="formDatas.remarks"></el-input>
                    </td>
                    <td width="125" class="center">邮箱</td>
                    <td width="220">
                        <el-input v-model="formDatas.buyerEmail"></el-input>
                    </td>
                    <td width="125" class="center">联系电话</td>
                    <td width="220">
                        <el-input v-model="formDatas.buyerPhone"></el-input>
                    </td>
                </tr>
            </tbody>
        </table>
        <div style="display: flex;width:35%;justify-content: space-around;vertical-align: bottom;">
            <h3 class="before">发票明细</h3>
            <el-form-item style="padding-top: 10px;">
                <el-button type="warning" @click="Mergeline">合并明细行</el-button>
                <el-button type="primary" @click="Addline">添加折扣行</el-button>
                <el-button type="danger" @click="Deleteline">删除行</el-button>
            </el-form-item>
        </div>
        <div class="table-container">
            <el-table :data="detailData" v-loading="loading" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" max-height="400"
                style=" width: 100%; color: #000" :header-cell-style="headerCellStyle" :default-sort="defaultOrder"
                @selection-change="handleSelectionChange" :row-style="changRed">
                <el-table-column type="index" width="50" align="center" />
                <el-table-column type="selection" width="55" align="center" />
                <template v-for="item in tableDetails">
                    <el-table-column v-if="item.show" :prop="item.prop" :min-width="item.minWidth" :label="item.label"
                        :align="item.align" :width="item.width">
                        <template v-slot="scope">
                            <el-input v-if="item.useTemplate" v-model="scope.row[item.prop]"></el-input>
                            <span v-else>{{ scope.row[item.prop] }}</span>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
        </div>
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
const TableData = inject('getTableData');//刷新标签方式
const Detail = inject('postSaleDetail');//获取明细表数据
const dialogShow = inject('dialogShow');//弹窗显示方式
const index_refreshtab = inject('index_refreshtab');//首页刷新标签方式
const defaultOrder = ref({ prop: 'goodsLineNo', order: 'ascending' });
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const pager = ref(utils.getPager(defaultOrder.value));
const butDisabled = ref(false);//按钮是否可用
const loading = ref(false);//加载状态
const selectrow = ref([]);//多选
onMounted(() => {
    // open();
    postSaleDetail();
    getformdata();
})
// 创建emits
const emits = defineEmits(['update:id', 'update:serialNo', 'update:buyerTaxNo', 'update:buyerName', 'update:invoiceTotalPrice', 'update:invoiceTotalTax', 'update:billcode'])
// 创建props
const props = defineProps({
    query: { type: String, default: () => { return ''; } },
    modelValue: { type: Boolean, default: false },
    id: { type: String, default: "" },
    serialNo: { type: String, default: "" },
    buyerTaxNo: { type: String, default: "" },
    buyerName: { type: String, default: "" },
    invoiceTotalPrice: { type: String, default: "" },
    invoiceTotalTax: { type: String, default: "" },
    billcode: { type: String, default: "" },
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
const serialNo = createComputed('serialNo')
const buyerTaxNo = createComputed('buyerTaxNo')
const buyerName = createComputed('buyerName')
const invoiceTotalPrice = createComputed('invoiceTotalPrice')
const invoiceTotalTax = createComputed('invoiceTotalTax')
const billcode = createComputed('billcode')
// 表单信息
const formDatas = ref({
    id: '',
    serialNo: '',
    buyerTaxNo: '',
    buyerName: '',
    invoiceTotalPrice: '',
    invoiceTotalTax: '',
    buyerPhone: '',
    buyerAddress: '',
    buyerBankAccount: '',
    buyerBankName: '',
    remarks: '',
});
// 明细表格循环
const tableDetails = ref([
    { prop: 'id', align: 'center', show: false, useTemplate: false },
    { prop: 'goodsLineNo', label: '序号', align: 'center', useTemplate: false, show: false, width: '60', },
    { prop: 'goodsCode', label: '商品编号', show: true, useTemplate: true, align: 'center', width: '200', },
    { prop: 'goodsName', label: '商品名称', show: true, useTemplate: true, align: 'center', width: '160', },
    { prop: 'goodsSpecification', label: '规格型号', show: true, useTemplate: true, align: 'center', width: '180', },
    { prop: 'goodsUnit', label: '单位', show: true, align: 'center', useTemplate: true, width: '100', },
    { prop: 'goodsQuantity', label: '数量', show: true, align: 'center', useTemplate: true, width: '120', },
    { prop: 'goodsPrice', label: '单价', show: true, align: 'center', useTemplate: false, width: '120', },
    { prop: 'goodsTotalPrice', label: '价税合计', show: true, align: 'right', useTemplate: true, width: '120', },
    { prop: 'notaxamount', label: '无税金额', show: true, align: 'right', useTemplate: false, width: '120', },
    { prop: 'goodsTotalTax', label: '税额', show: true, useTemplate: true, align: 'center', width: '150' },
    { prop: 'goodsTaxRate', label: '税率/征收率', show: true, align: 'center', useTemplate: false, minWidth: '150%', },
    { prop: 'invoiceLineNature', label: '发票行性质', show: false, align: 'center', useTemplate: true, width: '200', },
    { prop: 'discountRate', label: '折扣率', show: false, align: 'center', useTemplate: true, width: '200', },
    { prop: 'discountAmount', label: '折扣额', show: false, align: 'center', useTemplate: true, width: '200', },
])

// 打开页面
function open() {
    // 初始化
    formDatas.value = {
        id: id.value,
        serialNo: serialNo.value,
        buyerTaxNo: buyerTaxNo.value,
        buyerName: buyerName.value,
        invoiceTotalPrice: invoiceTotalPrice.value,
        invoiceTotalTax: invoiceTotalTax.value,
    };
}
// 获取明细表数据
const postSaleDetail = async () => {
    loading.value = true;
    try {
        const res = await ajax.post('/Invoice/GetInvoiceDetailMainNoPageList', qs.stringify({ id: id.value }));
        detailData.value = res.data.rows;
    } catch (error) {
        utils.msg(error.message, 'error', false);
        // 这里可以添加你的错误处理逻辑
    } finally {
        loading.value = false;
    }
}
// const getformdata = async () => {
//     loading.value = true;
//     try {
//         const res = await ajax.post('/Invoice/Get', qs.stringify({ ids: id.value }));
//         formDatas.value = res.data.invoicemain[0];
//     } catch (error) {
//         // 这里可以添加你的错误处理逻辑
//     } finally {
//         loading.value = false;
//     }
// }
const getformdata = async () => {
    loading.value = true;
    try {
        const res = await ajax.post('/Invoice/Get', qs.stringify({ ids: id.value }));
        if (Array.isArray(res.data.invoicemain) && res.data.invoicemain.length > 0) {
            // const invoice = res.data.invoicemain[0];
            formDatas.value = res.data.invoicemain[0];
            // const keys = ['id', 'serialNo', 'buyerTaxNo', 'buyerName', 'oldinvoiceTotalPriceTax', 'oldinvoiceTotalTax', 'oldinvoiceTotalPrice', 'buyerBankName', 'remarks', 'buyerEmail', 'buyerPhone'];
            // keys.forEach(key => {
            //     formDatas.value[key] = invoice[key] === undefined ? '' : invoice[key];
            // });
        }
    } catch (error) {
        // 这里可以添加你的错误处理逻辑
    } finally {
        loading.value = false;
    }
}
// 合并明细行
function Mergeline() {
    ajax.post('/invoice/GetInvoiceDetailHB?srcorgid=' + sobInfo.value.id, qs.stringify({ id: id.value })).then(res => {
        if (res.success) {
            utils.msg('合并成功', 'success', false);
            detailData.value = res.data.rows;
        } else {
            utils.msg(res.msg, 'error', false);
            return;
        }
    }).catch(() => { });
}

// 添加折扣行
function Addline() {
    const row = {
        id: utils.getLongId(),
        goodsLineNo: '',
        goodsName: '',
        goodsSpecification: '',
        goodsUnit: '',
        goodsQuantity: '',
        goodsPrice: '0',
        goodsTotalPrice: '',
        goodsTaxRate: '',
        goodsTotalTax: '',
        invoiceLineNature: 1,
        discountRate: '',
        discountAmount: '',
    }
    detailData.value.push(row);
}
// 删除行
function Deleteline() {
    const rows = selectrow.value;
    if (rows.length === 0) {
        utils.msg('请选择要删除的行', 'warning', false);
        return;
    }
    // 删除选中行
    for (let i = 0; i < rows.length; i++) {
        const index = detailData.value.indexOf(rows[i]);
        detailData.value.splice(index, 1);
    }
}
// 保存
function SaveData() {
    ElMessageBox.confirm('确定要保存吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        ajax.post('/Invoice/Save?srcorgid=' + sobInfo.value.id, qs.stringify({ invoiceJSON: JSON.stringify(formDatas.value), invoicedetailsJSON: JSON.stringify(detailData.value) })).then((res) => {
            const messageType = res.success ? 'success' : 'error';
            utils.msg(res.msg, messageType, false);
            if (res.success) {
                TableData()
                dialogShow.value = false;
            }
        }).catch(() => { });
    }).catch(() => { });
}
// 作废
function DeleteAll() {
    ElMessageBox.confirm('确定要作废吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        ajax.post('/Invoice/DeleteAll', qs.stringify({ id: id.value, type: billcode.value })).then((res) => {
            const messageType = res.success ? 'success' : 'error';
            utils.msg(res.msg, messageType, false);
            if (res.success) {
                index_refreshtab();
            }
        }).catch(() => { });
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

// 使用 watch 函数监听 detailData.value 的变化
watch(() => detailData.value, (newVal) => {
    // 初始化含税金额和税额的总计
    let totalInvoicePriceTax = 0;
    let totalInvoiceTax = 0;
    const notaxamount = ref(0);
    // 遍历 newVal（即新的 detailData.value）
    newVal.forEach(row => {
        // 计算含税金额的总计
        totalInvoicePriceTax += Number(row.goodsTotalPrice);
        // 计算税额的总计
        totalInvoiceTax += Number(row.goodsTotalTax);
        // 计算单价，等于金额/数量
        if (row.goodsQuantity == '' || row.goodsQuantity == null) {
            row.goodsPrice = 0;
        } else {
            let price = (Number(row.goodsTotalPrice) / Number(row.goodsQuantity)).toFixed(8);
            row.goodsPrice = isNaN(price) ? 0 : price;
        }
        // 计算税额，等于价税合计*税率/（1+税率）
        // row.goodsTotalTax = (row.goodsTotalPrice * row.goodsTaxRate / (1 + row.goodsTaxRate)).toFixed(2);
        // 计算不含税金额，等于无税金额计算=价税合计/（1+税率）
        const goodsTaxRate = 1 + Number(row.goodsTaxRate) / 100;
        notaxamount.value = (Number(row.goodsTotalPrice) / Number(goodsTaxRate)).toFixed(2);
        // 计算税额，等于税额=价税合计-价税合计/（1+税率）
        row.goodsTotalTax = (Number(row.goodsTotalPrice) - notaxamount.value).toFixed(2);
        // 计算无税金额
        row.notaxamount = notaxamount.value;
    })

    // 更新 formDatas.value 的含税金额和税额
    formDatas.value.invoiceTotalPriceTax = Number(totalInvoicePriceTax.toFixed(2));
    formDatas.value.invoiceTotalTax = Number(totalInvoiceTax.toFixed(2));
}, { deep: true }) // 使用 deep: true 以便在 detailData.value 的内部值变化时也能触发 watch 函数


defineExpose({
    open,
    headerCellStyle,
})
</script>

<style scoped>
@import '../../../roadui-assets/before.css';
@import '../../main/Customsubmit.css';
</style>