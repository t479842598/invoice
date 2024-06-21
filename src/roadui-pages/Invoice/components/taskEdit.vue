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

:deep(.cell) {
    padding: 5px 2px !important;
}

:deep(.el-table__cell) {
    padding: 0px 0 !important;
}

:deep(.el-dropdown .el-button) {
    padding: 0px 0px
}

/* :deep(.el-dropdown .el-button+.el-button) {
    margin-left: 0px;
} */

:deep(.el-table__cell .el-input .el-input__wrapper) {
    border-radius: 0 !important;
    /* box-shadow: none !important; */
    padding: 0;
    padding-left: 2px;
    height: 35px;
}

:deep(.el-table__cell .el-input .el-input__wrapper .el-input__inner) {
    height: 35px;
}
</style>
<template>
    <div style="height: 86.7vh;overflow: hidden;overflow-y:scroll;">
        <el-form inline style="display: flex;justify-content: space-between;">
            <el-form-item v-if="!isflow">
                <el-button type="primary" icon="Plus" @click="Select">增行</el-button>
                <el-button type="primary" @click="Addline">添加折扣行</el-button>
                <el-button type="primary" @click="Addlines">添加被折扣行</el-button>
                <el-button type="primary" @click="Mergeline">合并明细行</el-button>
                <el-button type="danger" :disabled="!isSelect" @click="Deleteline">删除行</el-button>
            </el-form-item>
            <el-form-item v-if="!isflow">
                <el-button icon="Select" type="primary" @click="SaveData">暂存</el-button>
                <el-button icon="Delete" type="danger" @click="DeleteAll">作废</el-button>
            </el-form-item>
        </el-form>
        <table border="1" cellpadding="1" cellspacing="1"
            style="line-height: 50px;border-color: #99938f;border-width: 1px;color: #6f4946;width: 100%;margin-bottom: 0;"
            class="table maintable">
            <tbody>
                <tr>
                    <td class="type" colspan="4" height="50" style="padding-left: 5px;font-weight: bold;color: #6f4946;">
                        <el-form :model="formDatas" ref="ruleFormRef">
                            <el-form-item style="margin: auto;" label="发票类型:" prop="invoiceTypeName">
                                <span>{{ formDatas.invoiceTypeName }}</span>
                            </el-form-item>
                        </el-form>
                    </td>
                    <td colspan="4" height="50" class="type" style="padding-left: 5px;font-weight: bold;color: #6f4946;">
                        <el-form :model="formDatas" ref="ruleFormRef">
                            <el-form-item style="margin: auto;" label="开票流水号:">
                                <span>{{ formDatas.serialNo }}</span>
                            </el-form-item>
                        </el-form>
                    </td>
                </tr>
                <!-- 左侧 -->
                <tr style="height: 100px !important;">
                    <td width="26" class="center vertical-text" style="font-weight: bolder;">购买方</td>
                    <td colspan="3" width="250" style="padding: 15px 10px 0px 10px;">
                        <el-form :model="formDatas" ref="ruleFormRef" label-width="100px">
                            <el-row :gutter="20">
                                <el-col :span="13.5" style="padding-right: 0;">
                                    <el-form-item label="名称" prop="buyerName">
                                        <el-autocomplete style="width: 250px;" trigger-on-focus="true"
                                            :fetch-suggestions="querySearch" v-model="formDatas.buyerName"
                                            @select="handleSelect" clearable @clear="blurForBug()">
                                        </el-autocomplete>
                                        <!-- <el-select v-model="formDatas.buyerName" filterable placeholder=""
                                            style="width: 300px" @change="handleSelect">
                                            <el-option v-for="item in options" :key="item.id" :label="item.value"
                                                :value="item.id" />
                                        </el-select> -->
                                        <el-button style="display: inline-block;" class="selectBtn" type="default"
                                            icon="Operation" @click="showmodel" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" style="line-height: 30px;">
                                    <div v-show="formDatas.buyerNaturalPerson == 'Y'"
                                        style="display: inline-block;width: 40px">
                                        (个人)
                                    </div>
                                </el-col>
                                <el-col :span="5" style="line-height: 30px;">
                                    <el-checkbox true-label="Y" false-label="N" v-model="formDatas.buyerNaturalPerson"
                                        label="是否开票给自然人" />
                                </el-col>
                            </el-row>
                            <el-form-item label="纳税人识别号" prop="buyerTaxNo">
                                <el-input v-show="!readonly" style="width: 90%;" v-model="formDatas.buyerTaxNo"></el-input>
                                <span v-show="readonly">
                                    {{ formDatas.buyerTaxNo }}
                                </span>
                            </el-form-item>
                            <el-row :gutter="20">
                                <el-col :span="11">
                                    <el-form-item label="地址" prop="buyerAddress">
                                        <el-input v-show="!readonly" v-model="formDatas.buyerAddress"></el-input>
                                        <span v-show="readonly">
                                            {{ formDatas.buyerAddress }}
                                        </span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="电话" prop="buyerPhone">
                                        <el-input v-show="!readonly" v-model="formDatas.buyerPhone"></el-input>
                                        <span v-show="readonly">
                                            {{ formDatas.buyerPhone }}
                                        </span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" class="show">
                                    <el-form-item prop="show">
                                        <el-checkbox style="font-size: 12px;" @change="buyerAddshow()"
                                            v-model="formDatas.buyerAddshow" label="展示" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="11">
                                    <el-form-item label="开户银行" prop="buyerBankName">
                                        <el-input v-show="!readonly" v-model="formDatas.buyerBankName"></el-input>
                                        <span v-show="readonly">
                                            {{ formDatas.buyerBankName }}
                                        </span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="银行账号" prop="buyerBankNumber">
                                        <el-input v-show="!readonly" v-model="formDatas.buyerBankNumber"></el-input>
                                        <span v-show="readonly">
                                            {{ formDatas.buyerBankNumber }}
                                        </span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" class="show">
                                    <el-form-item prop="show">
                                        <el-checkbox style="font-size: 12px;" @change="buyershow()"
                                            v-model="formDatas.buyershow" label="展示" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </td>
                    <!-- 右侧 -->
                    <td width="26" class="center vertical-text" style="font-weight: bolder;">销售方</td>
                    <td colspan="3" width="250" style="padding: 15px 10px 0px 10px;">
                        <el-form :model="formDatas" ref="ruleFormRef" label-width="110px">
                            <el-form-item label="名称" prop="sellerid">
                                <span class="black">
                                    {{ formDatas.sellerName }}
                                </span>
                            </el-form-item>
                            <el-form-item label="纳税人识别号" prop="sellerTaxNo">
                                <span class="black">
                                    {{ formDatas.sellerTaxNo }}
                                </span>
                            </el-form-item>
                            <el-row :gutter="20">
                                <el-col :span="11">
                                    <el-form-item label="地址" prop="sellerAddress">
                                        <span class="black">
                                            {{ formDatas.sellerAddress }}
                                        </span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="电话" prop="sellerPhone">
                                        <span class="black">
                                            {{ formDatas.sellerPhone }}
                                        </span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" class="show">
                                    <el-form-item prop="sellershow">
                                        <el-checkbox style="font-size: 12px;" @change="sellerAddshow()"
                                            v-model="formDatas.sellerAddshow" label="展示" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="11">
                                    <el-form-item label="开户银行" prop="sellerBankName">
                                        <span class="black">
                                            {{ formDatas.sellerBankName }}
                                        </span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="银行账号" class="colschange" prop="sellerBankNumber">
                                        <span class="black">
                                            {{ formDatas.sellerBankNumber }}
                                        </span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" class="show">
                                    <el-form-item prop="sellershow">
                                        <el-checkbox style="font-size: 12px;" @change="sellershow()"
                                            v-model="formDatas.sellershow" label="展示" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </td>
                </tr>
            </tbody>
        </table>
        <el-table class="eltable show_table" height="380" :data="detailData" v-loading="loading" :stripe="pager.tableStripe"
            :highlight-current-row="pager.tableHighlightCurrentRow" style="width: 100%; color: #000;"
            :header-cell-style="headerCellStyle" :default-sort="defaultOrder" @selection-change="handleSelectionChange"
            :row-style="changRed">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="" width="20">
                <template #default="scope">
                    <!-- <el-button type="primary" size="small" icon="Edit" @click="up(scope.$index, scope.row)" /> -->
                    <!-- <el-button type="primary" size="small" icon="Bottom" @click="down(scope.$index, scope.row)" /> -->
                    <el-dropdown placement="bottom-start" size="small" :hide-on-click='true'>
                        <el-button type="primary" size="small" icon="DCaret" />
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item icon="CaretTop" @click="up(scope.$index, scope.row)">上移</el-dropdown-item>
                                <el-dropdown-item icon="CaretBottom" divided
                                    @click="down(scope.$index, scope.row)">下移</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </el-table-column>
            <template v-for="item in tableDetails">
                <el-table-column v-if="item.show" :prop="item.prop" :min-width="item.minWidth" :label="item.label"
                    :align="item.align" :width="item.width" sortable>
                    <template v-slot="scope">
                        <el-input v-if="item.useTemplate && !isflow" v-model="scope.row[item.prop]"></el-input>
                        <span v-else>{{ scope.row[item.prop] }}</span>
                    </template>
                </el-table-column>
            </template>
        </el-table>
        <table border="1" cellpadding="1" cellspacing="1"
            style="line-height: 50px;border-color: #99938f;border-width: 1px;color: #6f4946;width: 100%;margin-bottom: 0;"
            class="table remarkTable">
            <tbody>
                <tr>
                    <td colspan="8" height="40" class="amountshow">
                        <div style="display: flex;justify-content: space-around;">
                            <span>原单据含税金额:{{ formDatas.oldinvoiceTotalPriceTax }}</span>
                            <span>原单据税额:{{ formDatas.oldinvoiceTotalTax }}</span>
                            <span>原单据无税金额:{{ formDatas.oldinvoiceTotalPrice }}</span>
                            <span>价税合计:{{ formDatas.invoiceTotalPriceTax }}</span>
                            <span>无税金额:{{ formDatas.invoiceTotalPrice }}</span>
                            <span>税额:{{ formDatas.invoiceTotalTax }}</span>
                        </div>
                    </td>
                </tr>
                <!-- 左侧 -->
                <tr style="height: 100px !important;">
                    <td width="26" class="center vertical-text" style="font-weight: bolder;">备注</td>
                    <td colspan="3" width="270" style="padding: 0;">
                        <el-form style="height: 100%;" :model="formDatas" ref="ruleFormRef">
                            <el-form-item style="margin: 0px 0px 0px !important;padding: 0 !important;" prop="remarks">
                                <el-input type="textarea" v-model="formDatas.remarks"></el-input>
                            </el-form-item>
                        </el-form>
                    </td>
                    <!-- 右侧 -->
                    <td width="26" class="center vertical-text" style="font-weight: bolder;">交付到</td>
                    <td colspan="3" width="250" style="padding: 15px 10px 0px 10px !important;">
                        <el-form :model="formDatas" :rules="rules" ref="ruleFormRef">
                            <el-form-item label="手机号码:" prop="phone">
                                <el-input v-show="!readonly" placeholder="请输入手机号码" v-model="formDatas.phone"></el-input>
                                <span v-show="readonly">
                                    {{ formDatas.phone }}
                                </span>
                            </el-form-item>
                            <el-form-item label="邮箱地址:" prop="buyerEmail">
                                <el-input v-show="!readonly" placeholder="请输入邮箱地址"
                                    v-model="formDatas.buyerEmail"></el-input>
                                <span v-show="readonly">
                                    {{ formDatas.buyerEmail }}
                                </span>
                            </el-form-item>
                        </el-form>
                    </td>
                </tr>
            </tbody>
        </table>
        <el-dialog title="选择产品" style="height: 637px;" v-model="Productvisible" align-center @open="Productopen"
            @close="Productclosed" destroy-on-close width="1200px" draggable :close-on-click-modal="false">
            <el-form :inline="true" :model="Productselect" class="inline">
                <el-form-item>
                    <el-input placeholder="请输入商品名称" v-model="Productselect.productname" style="width: 250px;" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="ProjectAll">查询</el-button>
                    <el-button type="primary" @click="ProductSelect">选择商品</el-button>
                </el-form-item>
            </el-form>
            <el-table class="eltable" :data="ProductTable" :stripe="Productpagers.tableStripe" border
                :highlight-current-row="Productpagers.tableHighlightCurrentRow" height="460" style="color: #000;"
                :header-cell-style="headerCellStyle" :default-sort="defaultOrder"
                @selection-change="ProductSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <template v-for="item in SelectProductColumn">
                    <el-table-column v-if="item.show" :prop="item.prop" :fixed="item.fixed" :label="item.label"
                        :align="item.align" :min-width="item.width">
                        <!-- <template v-if="item.useTemplate" #default="scope">
                            <el-button type="primary" size="small" @click="ProductSelect(scope.row)">选择</el-button>
                        </template> -->
                    </el-table-column>
                </template>
            </el-table>
            <div class="roadui_pagerdiv">
                <el-pagination v-model:currentPage="Productpagers.number" v-model:page-size="Productpagers.size"
                    :page-sizes="Productpagers.sizes" :background="Productpagers.background" :layout="Productpagers.layout"
                    :total="Productpagers.total" @size-change="ProductSizeChange" @current-change="ProductCurrentChange" />
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, inject, onMounted, shallowRef, provide, reactive, nextTick, watch, computed } from 'vue'
// import { Delete, Select, Close } from '@element-plus/icons-vue'
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
const pager = ref(utils.getPager(defaultOrder.value));
const butDisabled = ref(false);//按钮是否可用
const loading = ref(false);//加载状态
const selectrow = ref([]);//多选
const Productselectrow = ref([]);//多选
const invoiceLineNature = ref(0);//发票行性质
const Productvisible = ref(false);//产品弹出框
const ProductTable = ref([]);//产品弹出框表格数据
const addnewid = ref('');//新增id
const isSelect = ref(false);//是否选中
// const id = ref('');
const Productpagers = ref(utils.getPager(defaultOrder.value));
// 选择产品
const Productselect = ref({
    projectname: '',
})
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
onMounted(() => {
    // open();
    getformdata();
    postSaleDetail();
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
const billcode = createComputed('billcode')

// 表单信息
const formDatas = ref({
    id: '',
    serialNo: '',
    buyerTaxNo: '',
    buyerName: '',
    buyerPhone: '',
    buyerAddress: '',
    buyerBankAccount: '',
    buyerBankName: '',
    remarks: '',
    buyerEmail: '',
    sellerName: '',
    sellerTaxNo: '',
    sellerAddress: '',
    sellerAddressPhone: '',
    sellerBankName: '',
    sellerBankNumber: '',
    invoiceTotalPrice: '',//无税金额
    invoiceTotalPriceTax: '',//价税合计
    invoiceTotalTax: '',//税额
    invoiceTypeName: '',//发票类型
    buyerNaturalPerson: 'N',//是否是自然人
})
const SelectProductColumn = ref([
    { prop: 'id', align: 'center', show: false, useTemplate: false },
    { prop: 'goodsLineNo', label: '序号', align: 'center', useTemplate: false, show: false, width: '75', },
    { prop: 'goodsCode', label: '商品编号', show: true, useTemplate: false, align: 'center', width: '150', },
    { prop: 'goodsName', label: '商品名称', show: true, useTemplate: false, align: 'center', width: '200', },
    { prop: 'spec', label: '规格型号', show: true, useTemplate: false, align: 'center', width: '160', },
    { prop: 'unitname', label: '单位', show: true, align: 'center', useTemplate: false, width: '100', },
    { prop: 'taxrate', label: '税率(%)', show: true, align: 'center', useTemplate: false, minWidth: '150%' },
    { prop: 'goodsQuantity', label: '数量', show: false, align: 'center', useTemplate: false, width: '120', },
    { prop: 'goodsPrice', label: '单价', show: false, align: 'center', useTemplate: false, width: '120', },
    { prop: 'goodsTotalPrice', label: '价税合计', show: false, align: 'right', useTemplate: false, width: '120', },
    { prop: 'notaxamount', label: '无税金额', show: false, align: 'right', useTemplate: false, width: '120', },
    { prop: 'goodsTotalTax', label: '税额', show: false, useTemplate: false, align: 'center', width: '120' },
    { prop: 'priceTaxMark', label: '发票行性质', show: false, align: 'center', useTemplate: false, width: '200', },
    { prop: 'preferentialMarkFlag', label: '', show: false, align: 'center', useTemplate: false, width: '200', },
    { prop: 'vatSpecialManagement', label: '', show: false, align: 'center', useTemplate: false, width: '200', },
    { prop: 'freeTaxMark ', label: '', show: false, align: 'center', useTemplate: false, width: '200', },
])
// 明细表格循环
const tableDetails = ref([
    { prop: 'id', align: 'center', show: false, useTemplate: false },
    { prop: 'goodsLineNo', label: '序号', align: 'center', useTemplate: false, show: true, width: '80', },
    { prop: 'goodsCode', label: '商品编号', show: true, useTemplate: true, align: 'center', width: '200', },
    { prop: 'goodsName', label: '商品名称', show: true, useTemplate: true, align: 'center', width: '160', },
    { prop: 'goodsSpecification', label: '规格型号', show: true, useTemplate: true, align: 'center', width: '180', },
    { prop: 'goodsUnit', label: '单位', show: true, align: 'center', useTemplate: true, width: '100', },
    { prop: 'goodsQuantity', label: '数量', show: true, align: 'center', useTemplate: true, width: '120', },
    { prop: 'goodsPrice', label: '单价', show: true, align: 'center', useTemplate: false, width: '120', },
    { prop: 'goodsTotalPrice', label: '价税合计', show: true, align: 'right', useTemplate: true, width: '120', },
    { prop: 'notaxamount', label: '无税金额', show: true, align: 'right', useTemplate: false, width: '120', },
    { prop: 'goodsTotalTax', label: '税额', show: true, useTemplate: true, align: 'center', width: '150' },
    { prop: 'goodsTaxRate', label: '税率/征收率(%)', show: true, align: 'center', useTemplate: true, minWidth: '140', },
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
        // invoiceTotalPrice: invoiceTotalPrice.value,
        // invoiceTotalTax: invoiceTotalTax.value,
        invoiceTypeName: invoiceTypeName.value,//发票类型
    };
}
function querySearch(queryString, cb) { // queryString是用户输入的想要查询的内容，cb是回调函数（可以发请求获取数据）
    if (queryString == "") {
        cb([]); // 当然这里的历史记录是后端返给我们的，应该为接口返回的数据
    } else {
        let apiResult = [];
        // 这里我们模拟从后端的接口异步获取的数据
        // setTimeout(() => {
        //     // cb([])    cb函数如果返回一个空数组的话，那个模糊搜索输入建议的下拉选项因为length为0就会消失了
        //     cb(apiResult);
        // }, 500);
        ajax.post('/Customer/GetAllCustomer?srcorgid=' + sobInfo.value.id, {}).then((res) => {
            if (res.success) {
                apiResult = res.data.customer;
                // 这里的result是后端返回的数据，我们需要根据用户输入的内容进行模糊搜索
                apiResult = apiResult.filter(item => {
                    return item.customername.toLowerCase().indexOf(queryString.toLowerCase()) > -1;
                });
                cb(apiResult);
            }
        }).catch(() => { });
    }
}
//多选
const ProductSelectionChange = (val) => {
    // 将val中Proxy(Object)转为普通对象，然后将Proxy(Array)转为普通数组
    Productselectrow.value = JSON.parse(JSON.stringify(val))
}

function handleSelect(item) { // 参数
    formDatas.value.buyerTaxNo = item.buyerTaxno;
    formDatas.value.buyerAddress = item.Address;
    formDatas.value.buyerPhone = item.Phone;
    formDatas.value.buyerBankName = item.BankName;
    formDatas.value.buyerEmail = item.Email;
    formDatas.value.buyerAddress = item.Address;
    formDatas.value.buyerBankName = item.BankName;
    formDatas.value.buyerBankNumber = item.Account;
}
// 点击clearable清空小图标按钮以后，继续重新在输入框中输入数据，querySearch会触发，但是cb函数不会触发
// 这样的话就会出现发请求了，也获取数据了，但是input框的输入建议下拉框不呈现在页面上的问题，所以解决方法就是
// 只要用户点击了
function blurForBug() {
    document.activeElement.blur()
    formDatas.value.buyerTaxNo = '';
    formDatas.value.buyerAddress = '';
    formDatas.value.buyerPhone = '';
    formDatas.value.buyerBankName = '';
    formDatas.value.buyerBankNumber = '';
    formDatas.value.buyerEmail = '';
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
const ProductSelect = () => {
    if (Productselectrow.value.length === 0) {
        utils.msg('请选择要添加的行', 'warning', false);
        return;
    }
    for (let i = 0; i < Productselectrow.value.length; i++) {
        ajax.post("/Flow/GetLongId").then((res) => {
            addnewid.value = res.data;
            const row = {
                goodsLineNo: detailData.value.length + 1,//序号
                id: addnewid.value,
                mainid: id.value,
                goodsCode: Productselectrow.value[i].goodsCode,//商品编号
                goodsName: Productselectrow.value[i].goodsName,//商品名称
                goodsSpecification: Productselectrow.value[i].spec,//规格型号
                goodsUnit: Productselectrow.value[i].unitname,//单位
                goodsQuantity: '',//数量
                goodsPrice: '0',//单价
                goodsTotalPrice: '',//价税合计
                goodsTaxRate: Productselectrow.value[i].taxrate,//税率/征收率
                goodsTotalTax: '',//税额
                invoiceLineNature: invoiceLineNature.value,//发票行性质
                discountRate: '0',//折扣率
                discountAmount: '0',//折扣额
                priceTaxMark: '1',
                preferentialMarkFlag: Productselectrow.value[i].preferentialMarkFlag,//优惠标记
                vatSpecialManagement: Productselectrow.value[i].vatSpecialManagement,//专票管理
            }
            detailData.value.push(row);
        }).catch(() => { });
    }
    Productvisible.value = false;
}
// 选择产品
const Select = () => {
    invoiceLineNature.value = 0;
    Productvisible.value = true;
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
            // id.value = res.data.invoicemain[0].id;
            formDatas.value = res.data.invoicemain[0];
            formDatas.value.sellerName = sobInfo.value.accountname;
            formDatas.value.sellerTaxNo = sobInfo.value.taxno;
            formDatas.value.sellerid = sobInfo.value.id;
            formDatas.value.sellerAddress = sobInfo.value.address;
            formDatas.value.sellerPhone = sobInfo.value.phone;
            formDatas.value.sellerBankName = sobInfo.value.openbank;
            formDatas.value.sellerBankNumber = sobInfo.value.bankaccount;
            // formDatas.value.buyerNaturalPerson = false;
            getSysinfo()
            // formDatas.value.invoiceTypeName = res.data.invoicemain[0].invoiceTypeName;
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
//获取系统设置数据
const getSysinfo = async () => {
    try {
        const res = await ajax.post('/Systemset/Get?srcorgid=' + sobInfo.value.id, {});
        formDatas.value.buyershow = res.data.invoicesystemset.是否默认选中购买方;
        formDatas.value.sellershow = res.data.invoicesystemset.是否默认选中销售方;
        // buyershow()
        // sellershow()
    } catch (error) {
    }
};
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
    ajax.post("/Flow/GetLongId").then((res) => {
        addnewid.value = res.data;
        const row = {
            goodsLineNo: detailData.value.length + 1,//序号
            id: addnewid.value,
            mainid: id.value,
            goodsCode: '',//商品编号
            goodsName: '',//商品名称
            goodsSpecification: '',//规格型号
            goodsUnit: '',//单位
            goodsQuantity: '',//数量
            goodsPrice: '0',//单价
            goodsTotalPrice: '',//价税合计
            goodsTaxRate: '',//税率/征收率
            goodsTotalTax: '',//税额
            invoiceLineNature: 1,//发票行性质
            discountRate: '0',//折扣率
            discountAmount: '0',//折扣额
            priceTaxMark: '1',
            preferentialMarkFlag: '0',
            vatSpecialManagement: ''
        }
        detailData.value.push(row);
    }).catch(() => { });
}
// 添加被折扣行
function Addlines() {
    invoiceLineNature.value = 2;
    Productvisible.value = true;
}
// 打开页面
function Productopen() {
    ProjectAll();
}
// 获取全部商品
const ProjectAll = () => {
    Productselect.value.size = Productpagers.value.size;
    Productselect.value.number = Productpagers.value.number;
    ajax.post('/invoiceproduct/GetAllProduct?srcorgid=' + sobInfo.value.id, qs.stringify(Productselect.value)).then((res) => {
        if (res.success) {
            ProductTable.value = res.data.product;
            Productpagers.value.total = res.data.total;
        }
    }).catch(() => { });
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
    // 重新排序
    for (let i = 0; i < detailData.value.length; i++) {
        detailData.value[i].goodsLineNo = i + 1;
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
    if (selectrow.value.length > 0) { isSelect.value = true; } else { isSelect.value = false; }
}
// 明细表数据
const detailData = ref([])
// 上移
function up(index, row) {
    if (index === 0) {
        utils.msg('已经是第一行了', 'warning', false);
        return;
    }
    const temp = detailData.value[index - 1];//上一行
    detailData.value[index - 1] = detailData.value[index];//当前行
    detailData.value[index] = temp;//上一行
    // 重新排序
    detailData.value.forEach((item, index) => {
        item.goodsLineNo = index + 1;
    })
    utils.notify('', '操作成功', 'success');
}
// 下移
function down(index, row) {
    if (index === detailData.value.length - 1) {
        utils.msg('已经是最后一行了', 'warning', false);
        return;
    }
    const temp = detailData.value[index + 1];//下一行
    detailData.value[index + 1] = detailData.value[index];//当前行
    detailData.value[index] = temp;//下一行
    // 重新排序
    detailData.value.forEach((item, index) => {
        item.goodsLineNo = index + 1;
    })
    utils.notify('', '操作成功', 'success');
}
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
// 合计
const getSummaries = (param) => {
    const { columns, data } = param
    const sums = []
    const columnsToShowSum = ['goodsTotalPrice', 'goodsTotalTax', 'notaxamount']

    columns.forEach((column, index) => {
        if (index === 0) {
            sums[index] = '合计'
            return
        }
        if (columnsToShowSum.includes(column.property)) {
            const values = data.map((item) => Number(item[column.property]))
            if (!values.every((value) => Number.isNaN(value))) {
                sums[index] = ` ${values.reduce((prev, curr) => {
                    const value = Number(curr)
                    if (!Number.isNaN(value)) {
                        const total = ref()
                        total.value = (parseFloat(prev) + parseFloat(curr)).toFixed(2)
                        return total.value
                    } else {
                        return parseFloat(prev).toFixed(2)
                    }
                }, 0)}`
            } else {
                sums[index] = ''
            }
        } else {
            sums[index] = ''
        }
    })
    return sums
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
    formDatas.value.invoiceTotalPriceTax = Number(totalInvoicePriceTax.toFixed(2));
    formDatas.value.invoiceTotalTax = Number(totalInvoiceTax.toFixed(2));
    formDatas.value.invoiceTotalPrice = Number(totalNotaxAmount.toFixed(2)); // 使用累加的无税金额总计

}, { deep: true })




let originalBuyerBankName = '';//购买方原始数据
let originalBuyerBankNumber = '';//购买方原始数据
let originalBuyerAddress = '';
let originalBuyerPhone = '';

let originalSellerBankName = '';//销售方原始数据
let originalSellerBankNumber = '';//销售方原始数据
let originalSellerAddress = '';//销售方原始数据
let originalSellerPhone = '';//销售方原始数据

// 购买方展示
function buyershow() {
    let remarks = formDatas.value.remarks
    if (formDatas.value.buyerBankName == null) formDatas.value.buyerBankName = ''
    if (formDatas.value.buyerBankNumber == null) formDatas.value.buyerBankNumber = ''
    if (formDatas.value.buyershow == true && formDatas.value.buyerBankName != '' && formDatas.value.buyerBankNumber != '') {
        originalBuyerBankName = formDatas.value.buyerBankName;
        originalBuyerBankNumber = formDatas.value.buyerBankNumber;
        if (remarks != undefined) {
            formDatas.value.remarks = "购买方开户银行:" + formDatas.value.buyerBankName + ";" + "      " + " 银行账号:" + formDatas.value.buyerBankNumber + ";" + "\n" + remarks
        } else {
            formDatas.value.remarks = "购买方开户银行:" + formDatas.value.buyerBankName + ";" + "      " + " 银行账号:" + formDatas.value.buyerBankNumber + ";" + "\n"
        }
    } else {
        formDatas.value.remarks = formDatas.value.remarks.replace("购买方开户银行:" + originalBuyerBankName + ";" + "      " + " 银行账号:" + originalBuyerBankNumber + ";" + "\n", '');
    }
}
// 销售方展示
function sellershow() {
    if (formDatas.value.sellershow == true) {
        originalSellerBankName = formDatas.value.sellerBankName;
        originalSellerBankNumber = formDatas.value.sellerBankNumber;
        if (formDatas.value.remarks != undefined) {
            formDatas.value.remarks += "销售方开户银行:" + formDatas.value.sellerBankName + ";" + "      " + " 银行账号:" + formDatas.value.sellerBankNumber + ";" + "\n"
        } else {
            formDatas.value.remarks = "销售方开户银行:" + formDatas.value.sellerBankName + ";" + "      " + " 银行账号:" + formDatas.value.sellerBankNumber + ";" + "\n"
        }
    } else {
        formDatas.value.remarks = formDatas.value.remarks.replace("销售方开户银行:" + originalSellerBankName + ";" + "      " + " 银行账号:" + originalSellerBankNumber + ";" + "\n", '');
    }
}


function buyerAddshow() {
    // 保存原始值用于后续比较和替换
    originalBuyerAddress = formDatas.value.buyerAddress || '';
    originalBuyerPhone = formDatas.value.buyerPhone || '';

    // 确保buyerAddress和buyerPhone非空
    formDatas.value.buyerAddress = formDatas.value.buyerAddress || '';
    formDatas.value.buyerPhone = formDatas.value.buyerPhone || '';

    // 定义一个正则表达式模式，用于匹配和替换
    const pattern = new RegExp(`购买方地址:${originalBuyerAddress};\\s*电话:${originalBuyerPhone};`, 'g');

    // 根据条件决定是否添加或清除备注信息
    if (formDatas.value.buyerAddshow && formDatas.value.buyerAddress && formDatas.value.buyerPhone) {
        // 添加地址和电话到备注
        if (formDatas.value.remarks) {
            formDatas.value.remarks += `购买方地址:${formDatas.value.buyerAddress}; 电话:${formDatas.value.buyerPhone};\n`;
        } else {
            formDatas.value.remarks = `购买方地址:${formDatas.value.buyerAddress}; 电话:${formDatas.value.buyerPhone};\n`;
        }
    } else {
        // 清除备注中匹配的地址和电话信息
        formDatas.value.remarks = formDatas.value.remarks.replace(pattern, '');
        // 如果清空后只剩余分号或换行符，进一步清理
        formDatas.value.remarks = formDatas.value.remarks.replace(/^[;\n]+|[,;\n]+$/g, '');
    }
}

defineExpose({
    open,
    headerCellStyle,
})
</script>
