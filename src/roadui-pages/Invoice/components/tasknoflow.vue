<template>
    <div v-loading="loading">
        <el-form ref="formbutton" inline>
            <el-form-item>
                <el-button :icon="DocumentCopy" type="primary" @click="ticketstart">开票</el-button>
                <el-button :icon="Close" type="success" @click="closed">关闭</el-button>
            </el-form-item>
            <el-form-item label="开票单位" prop="sobItemsName">
                {{ sobInfo.accountname }}
            </el-form-item>
            <el-form-item label="税号" prop="sobTaxno">
                {{ sobInfo.taxno }}
            </el-form-item>
        </el-form>
        <div class="table-container">
            <el-table :data="tableData" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" max-height="300"
                style="width: 100%; color: #000 " :header-cell-style="headerCellStyle" v-bind="$attrs"
                @current-change="tableCurrentChange" @selection-change="handleSelectionChange"
                :row-style="changmaincolor">
                <el-table-column prop="id" v-if="false" width="1" />
                <el-table-column prop="salebillid" v-if="false" width="1" />
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column type="index" label="序号" align="center" width="60" />
                <el-table-column v-for="(column, index) in maincolumns" :key="index" :prop="column.prop"
                    :label="column.label" :align="column.align" fit show-overflow-tooltip :min-width="column.width">
                    <!-- <template v-if="column.template" #default="scope">
                        <el-button type="primary" size="small" @click="openEdit(scope.row)">修改</el-button>
                    </template> -->
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right" width="100">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="openEdit(scope.row)">修改</el-button>
                    </template>
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
                :highlight-current-row="pager.tableHighlightCurrentRow" max-height="400" style="width: 100%;color: #000"
                :header-cell-style="headerCellStyle" :default-sort="defaultOrder" :row-style="changdetailcolor">
                <template v-for="item in tableDetail">
                    <el-table-column v-if="item.show" fit show-overflow-tooltip :prop="item.prop" :label="item.label"
                        :align="item.align" :width="item.width" />
                </template>
            </el-table>
        </div>
        <div class="roadui_pagerdiv">
            <el-pagination v-model:currentPage="pager.number" v-model:page-size="pager.size" :page-sizes="pager.sizes"
                :background="pager.background" :layout="pager.layout" :total="pager.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
        <!-- 修改 -->
        <el-dialog v-model="dialogShow" :fullscreen="fullscreens" style="position: relative;" :title="dialogTitle"
            align-center destroy-on-close @close="fullscreens = false" width="1300px" draggable
            :close-on-click-modal="false">
            <EditTask v-model:id="ids" v-model:serialNo="serialNo" v-model:buyerTaxNo="buyerTaxNo"
                v-model:buyerName="buyerName" v-model:invoiceTotalPrice="invoiceTotalPrices"
                v-model:invoiceTotalTax="invoiceTotalTaxs"></EditTask>
            <el-icon @click="fullscreens = !fullscreens"
                style="position: absolute;right: 45px;top: 24px;cursor: pointer;font-size: 14px;">
                <FullScreen />
            </el-icon>
        </el-dialog>
        <!-- 完成进度条 -->
        <el-dialog v-model="finishprogress" top="5vh" title="完成进度" align-center @closed="taskclose" destroy-on-close
            width="600px" draggable :close-on-click-modal="false">
            <el-form style="width: 100%;">
                <div style="margin:auto;width: 80%;">
                    <el-progress :text-inside="true" :stroke-width="18" :color="customColorMethod"
                        :percentage="percentage" striped striped-flow>
                        <span>正在开票中</span>
                        <span>{{ percentage }}%</span>
                    </el-progress>
                    <div style="margin-top: 10px;margin: 10px auto;display: flex;justify-content: space-around;">
                        <div class="successfa">
                            <el-statistic :value="successCount">
                                <template #title>
                                    <div style="display: inline-flex; align-items: center;font-size: 14px;">
                                        已开票
                                    </div>
                                </template>
                                <template #suffix>/{{ selectrow.length }}张</template>
                            </el-statistic>
                        </div>
                        <div class="errorfa">
                            <el-statistic :value="errorcount">
                                <template #title>
                                    <div style="display: inline-flex; align-items: center;font-size: 14px;">
                                        开票失败
                                    </div>
                                </template>
                                <template #suffix>张</template>
                            </el-statistic>
                        </div>
                    </div>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, shallowRef, provide, reactive, nextTick, watch, defineAsyncComponent, computed } from 'vue'
import { DocumentCopy, Close } from '@element-plus/icons-vue'
const EditTask = defineAsyncComponent(() => import('./taskEdit.vue'))
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
const qs = inject('qs');
const index_openmenu = inject('index_openmenu');//首页打开菜单
const index_removetab = inject('index_removetab');//首页关闭标签方法
const index_refreshtab = inject('index_refreshtab');//首页刷新标签方式
const index_userinfo = inject('index_userinfo');//首页用户信息
const dialogshow = inject('view_dialogshow');
const defaultOrder = ref({ prop: 'goodsLineNo', order: 'ascending' });
const pager = ref(utils.getPager(defaultOrder.value));
const butDisabled = ref(false);//按钮是否可用
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const loading = ref(false);//加载状态
const invoiceCount = ref(0);//发票张数
const invoiceTotalPrice = ref(0);// 发票总金额
const invoiceTotalTax = ref(0);// 发票总税额
const saleid = ref('');//发票id
const ids = ref('');//发票id
const serialNo = ref('');//发票流水号
const buyerTaxNo = ref('');//税号
const buyerName = ref('');//客户名称
const invoiceTotalPrices = ref('');//金额
const invoiceTotalTaxs = ref('');//税额
const sobItems = ref();//开票单位
const checkList = ref([])//单位选择
const finishprogress = ref(false);//完成进度
const dataprovide = ref({ Id: '', invoicedepartname: '', taxno: '' })
const fullscreens = ref(false);//是否全屏
// 选中行
const selectrow = ref<any>([]);
const successCount = ref<number>(0);//开票成功数量
const percentage = ref<number>(0);//进度条百分比
const errorcount = ref<number>(0);//开票失败数量
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
    // 获取明细表数据
    // await getDetailData();
    // 获取开票单位信息
    await getsobItems();
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
        // detailData.value = res.data.invoicedetails
    } catch (error) {
        butDisabled.value = false;
        loading.value = false;
        // utils.msg(error, 'error', false);
        // 这里可以添加你的错误处理逻辑
    } finally {
        loading.value = false;
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
    { prop: 'invoiceTotalPrice', label: '无税金额', align: 'right', width: '110' },
    { prop: 'invoiceTotalTax', label: '税额', align: 'center', width: '110' },
    { prop: 'remarks', label: '备注', align: 'center', width: '200' },
    // { label: '操作', align: 'center', template: true },
])
// 明细表格循环
const tableDetail = ref([
    { prop: 'id', align: 'center', show: false },
    { prop: 'goodsLineNo', label: '序号', align: 'center', show: true, width: '60', },
    { prop: 'goodsCode', label: '商品编号', show: true, align: 'center', width: '200', },
    { prop: 'goodsName', label: '商品名称', show: true, align: 'center', width: '160', },
    { prop: 'goodsSpecification', label: '规格型号', show: true, align: 'center', width: '180', },
    { prop: 'goodsUnit', label: '单位', show: true, align: 'center', width: '100', },
    { prop: 'goodsQuantity', label: '数量', show: true, align: 'center', width: '120', },
    { prop: 'goodsPrice', label: '单价', show: true, align: 'center', width: '120', },
    { prop: 'goodsTotalPrice', label: '价税合计', show: true, align: 'right', width: '120', },
    { prop: 'notaxamount', label: '无税金额', show: true, align: 'right', width: '120', },
    { prop: 'goodsTaxRate', label: '税率/征收率', show: true, align: 'center', width: '200', },
    { prop: 'goodsTotalTax', label: '税额', show: true, align: 'center', },
])


// 页面加载
// 打开修改页
const openEdit = (row) => {
    ids.value = row.id;
    serialNo.value = row.serialNo;
    buyerTaxNo.value = row.buyerTaxNo;
    buyerName.value = row.buyerName;
    invoiceTotalPrices.value = row.invoiceTotalPrice;
    invoiceTotalTaxs.value = row.invoiceTotalTax;
    dialogPage.value = EditTask;
    dialogTitle.value = '修改';
    dialogShow.value = true;
}
// 获取开票单位信息
// 开票单位
const getsobItems = async () => {
    try {
        const res = await ajax.post('user/GetUserInvoiceDepartByUser', qs.stringify({ userid: index_userinfo.value.userId }));
        if (res.success) {
            checkList.value = res.data;
            sobItems.value = res.data[0].id;
        }
    } catch (error) {
        // 这里可以添加你的错误处理逻辑
    }
}
// 关闭
const closed = () => {
    dialogshow.value = false;
}
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
// 多选
const handleSelectionChange = (val) => {
    // 把每一行的id放到数组里面,有重复的只留一个
    selectrow.value = Array.from(new Set(val.map(item => item.id)));
}

// 开票
const ticketstart = async () => {
    // 如果没有选中行
    if (selectrow.value == '') {
        utils.msg('请选择要开票的数据', 'warning', false);
        return;
    }
    // 如果选中的行里面没有纳税人识别号，就不能开票
    for (let i = 0; i < selectrow.value.length; i++) {
        for (let j = 0; j < tableData.value.length; j++) {
            if (selectrow.value[i] == tableData.value[j].id) {
                if (tableData.value[j].buyerTaxNo == '') {
                    utils.msg('请选择有纳税人识别号的数据', 'warning', false);
                    return;
                }
            }
        }
    }
    finishprogress.value = true;
    dataprovide.value.invoicedepartname = sobInfo.value.accountname;
    dataprovide.value.taxno = sobInfo.value.taxno;
    for (let i = 0; i < selectrow.value.length; i++) {
        dataprovide.value.Id = selectrow.value[i];
        try {
            await openticket();
        } catch (error) {
            utils.msg('开票失败', 'error', false);
            errorcount.value++;
        }
    }
}

// 监听进度
// 监听开票成功数量，计算进度条百分比，当百分比为100时，延迟800ms关闭进度条弹窗
watch(successCount, (val) => {
    percentage.value = Math.floor((successCount.value + errorcount.value) / Number(selectrow.value.length) * 100);
    if (successCount.value > 0) {
    }
    if (percentage.value === 100) {
        // 延迟800ms
        setTimeout(() => {
            finishprogress.value = false;
        }, 800);
    }
})

// 开票
const openticket = async () => {
    const res = await ajax.post('/Invoice/OpenInvoice?srcorgid=' + sobInfo.value.id, qs.stringify(dataprovide.value));
    if (res.code == 0) {
        successCount.value++;
        utils.notify('第' + successCount.value + '张', res.msg, 'success');
    } else {
        errorcount.value++;
        utils.notify('', res.msg, 'error');
    }
}

const taskclose = () => {
    percentage.value = 0
    successCount.value = 0
    errorcount.value = 0
    selectrow.value = []
    index_refreshtab()
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
// 自定义进度条颜色
const customColorMethod = (percentage: number) => {
    if (percentage < 34) {
        return '#409eff'
    }
    if (percentage < 60) {
        return '#e6a23c'
    }
    return '#67c23a'
}


provide('getTableData', getTableData);
provide('postSaleDetail', postSaleDetail);
provide('dialogShow', dialogShow);



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