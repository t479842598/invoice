<template>
    <div>
        <!-- 导入 -->
        <div class="form-container">
            <el-form ref="formbutton" inline>
                <el-form-item>
                    <el-button icon="DocumentCopy" type="primary" :disabled="butDisabled"
                        @click="ticketstart">开票</el-button>
                    <el-button icon="Upload" type="warning" :disabled="butDisabled" @click="openImport">导入</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled="butDisabled" @click="Searchform" icon="Search">查询</el-button>
                    <el-button type="success" :disabled="butDisabled" @click="reset" icon="Refresh">刷新</el-button>
                </el-form-item>
                <el-form-item label="开票单位" prop="sobItems">
                    <el-select v-model="sobItems" :disabled="butDisabled" placeholder="请选择开票单位" style="width: 260px;">
                        <el-option v-for="item in checkList" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-container">
            <el-table :data="tableData" v-loading="loading" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" max-height="300"
                style="width:100%; color: #000;" :header-cell-style="headerCellStyle"
                @selection-change="handleSelectionChange" @current-change="tableCurrentChange">
                <el-table-column prop="id" v-if="false" width="1" />
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column v-for="(column, index) in maincolumns" :key="index" :prop="column.prop"
                    :label="column.label" :align="column.align" :width="column.width">
                </el-table-column>
                <el-table-column prop="istatus" label="开票状态" align="center" width="160">
                    <template #default="scope">
                        <el-tag effect="light" :type="getTagType(scope.row.istatus)">{{
                            scope.row.istatus }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="msg" label="开票失败提示" align="center" width="170">
                </el-table-column>
                <el-table-column label="操作" align="center" width="250" fixed="right">
                    <template #default="scope">
                        <el-button type="success" size="small" v-if="scope.row.istatus == '已开票待返回电子版'"
                            @click="getticket(scope.row)">获取电子版</el-button>
                        <el-button type="primary" size="small" v-if="scope.row.istatus == '待开票'"
                            @click="openEdit(scope.row)">修改</el-button>
                        <el-button type="danger" size="small" @click="DeleteAll(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="table-text">
            <table border="0" class="table" style="position: relative;" width="900">
                <tr>
                    <!-- <el-button style="margin-left: 20px;" type="danger" @click="Batchdele">批量删除</el-button> -->
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
            <el-table :data="detailData" v-loading="loadings" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" max-height="300" style="width: 100%;color: #000"
                :header-cell-style="headerCellStyle" :default-sort="defaultOrder">
                <template v-for=" item in tableDetail ">
                    <el-table-column v-if="item.show" :prop="item.prop" :label="item.label" :align="item.align"
                        :width="item.width" />
                </template>
            </el-table>
        </div>
        <div class="roadui_pagerdiv">
            <el-pagination v-model:currentPage="pagers.number" v-model:page-size="pagers.size"
                :page-sizes="pagers.sizes" :background="pagers.background" :layout="pagers.layout" :total="pagers.total"
                :disabled="butDisableds" @size-change="handleSizeChanges" @current-change="handleCurrentChanges" />
        </div>
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
                    <el-button type="success" @click="resets">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog v-model="finishprogress" top="5vh" title="完成进度" align-center @closed="taskclose" destroy-on-close
            width="600px" draggable :close-on-click-modal="false">
            <el-form style="width: 100%;">
                <div style="margin:auto;width: 80%;">
                    <div style="margin-top: 10px;">
                        <el-progress :text-inside="true" :stroke-width="20" :color="customColorMethod"
                            :percentage="percentage" striped striped-flow>
                            <span>正在开票中</span>
                            <span>{{ percentage }}%</span>
                        </el-progress>
                    </div>
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
        <!-- 修改 -->
        <el-dialog v-model="dialogShow" :title="dialogTitle" @close="fullscreen = false" style="position: relative;"
            :fullscreen="fullscreen" align-center destroy-on-close width="1300px" draggable
            :close-on-click-modal="false">
            <EditTask v-model:id="ids" v-model:serialNo="serialNo" v-model:buyerTaxNo="buyerTaxNo"
                v-model:buyerName="buyerName" v-model:invoiceTotalPrice="invoiceTotalPrices"
                v-model:invoiceTotalTax="invoiceTotalTaxs"></EditTask>
            <el-icon @click="fullscreen = !fullscreen"
                style="position: absolute;right: 45px;top: 24px;cursor: pointer;font-size: 14px;">
                <FullScreen />
            </el-icon>
        </el-dialog>
        <!-- 导入列表 -->
        <el-dialog v-model="ImportShow" :fullscreen="fullscreens" style="position: relative;" :title="ImportTitle"
            align-center destroy-on-close width="1300px" @close="fullscreens = false" draggable
            :close-on-click-modal="false">
            <Export></Export>
            <el-icon @click="fullscreens = !fullscreens"
                style="position: absolute;right: 45px;top: 24px;cursor: pointer;font-size: 14px;">
                <FullScreen />
            </el-icon>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, shallowRef, provide, reactive, nextTick, watch, defineAsyncComponent } from 'vue'
import { Search, DocumentCopy, Refresh, Upload } from '@element-plus/icons-vue'
const EditTask = defineAsyncComponent(() => import('./components/taskEdit.vue'))
const Export = defineAsyncComponent(() => import('./components/importExcel.vue'))
const fullscreen = ref(false);//修改列表全屏
const fullscreens = ref(false);//导入列表全屏
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
const qs = inject('qs');
const index_openmenu = inject('index_openmenu');//首页打开菜单
const index_removetab = inject('index_removetab');//首页关闭标签方法
const index_refreshtab = inject('index_refreshtab');//首页刷新标签方式
const submit_dialogshow = inject('submit_dialogshow');
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const props = defineProps({ query: { type: String, default: () => { return ''; } } })
const defaultOrder = ref({ prop: 'serialNo', order: 'ascending' });
const defaultOrders = ref({ prop: 'goodsLineNo', order: 'ascending' });
const pager = ref(utils.getPager(defaultOrder.value));
const pagers = ref(utils.getPager(defaultOrders.value));
const butDisabled = ref(false);//按钮是否可用
const butDisableds = ref(false);//按钮是否可用
const loading = ref(false);//加载状态
const loadings = ref(false);//加载状态
const showserch = ref(false);//查询弹窗
const saleid = ref('');//发票id
const ids = ref('');//发票id
const serialNo = ref('');//发票流水号
const buyerTaxNo = ref('');//税号
const buyerName = ref('');//客户名称
const invoiceTotalPrices = ref('');//金额
const invoiceTotalTaxs = ref('');//税额
const sobItems = ref();//开票单位
const checkList = ref([])//单位选择
const index_userinfo = inject('index_userinfo');//首页用户信息
const dataprovide = ref({ id: '', invoicedepartmentid: '' });//开票接口参数
const finishprogress = ref(false);//完成进度弹窗
const ImportShow = ref(false);//导入列表
const ImportTitle = ref('导入开票列表');
// 发票张数
const invoiceCount = ref(0);
// 价税合计
const invoiceTotalPrice = ref(0);
// 总税额
const invoiceTotalTax = ref(0);
onMounted(async () => {
    // 获取表格数据
    await getTableData();
    // 获取开票单位信息
    await getsobItems();

})
// 选中行
const selectrow = ref<any>([]);
const successCount = ref<number>(0);//开票成功数量
const percentage = ref<number>(0);//进度条百分比
const errorcount = ref<number>(0);//开票失败数量
// 主表格列
const maincolumns = ref([
    { prop: 'serialNo', label: '开票流水号', align: 'center', width: '200' },
    { prop: 'buyerName', label: '客户名称', align: 'center', width: '250' },
    { prop: 'buyerTaxNo', label: '税号', align: 'center', width: '200' },
    { prop: 'invoiceTotalPriceTax', label: '价税合计', align: 'right', width: '100' },
    { prop: 'invoiceTotalTax', label: '税额', align: 'center', width: '110' },
    { prop: 'invoiceTypeName', label: '发票类型', align: 'center', width: '130' },
    { prop: 'invoiceDate', label: '开票日期', align: 'center', width: '180' },
    { prop: 'invoiceNo', label: '发票号', align: 'center', width: '220' },
]);
// 明细表格列
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
    { prop: 'goodsTaxRate', label: '税率/征收率', show: true, align: 'center', width: '150', },
    { prop: 'goodsTotalTax', label: '税额', show: true, align: 'center', },
]);

// 多选
const handleSelectionChange = (val) => {
    // 把每一行的id放到数组里面,有重复的只留一个
    selectrow.value = Array.from(new Set(val.map(item => item.id)));
}
// 表格数据1
const tableData = ref([]);
// 表格数据2
const detailData = ref([])
// 获取表格数据
const mainform = ref({
    serino: '',//销售单据号
    customername: '',//客户名称
    invoiceDate: '',//单据日期
    status: '',//开票状态
})//明细表单
// 获取表格数据
async function getTableData() {
    try {
        loading.value = true;
        loadings.value = true;
        butDisabled.value = true;
        butDisableds.value = true;
        mainform.value.size = pager.value.size
        mainform.value.number = pager.value.number
        mainform.value.order = pager.value.order
        mainform.value.invoicedepartmentid = sobItems.value
        mainform.value.data1 = mainform.value.invoiceDate[0]
        mainform.value.data2 = mainform.value.invoiceDate[1]
        mainform.value.type = '未开票'
        const res = await ajax.post('/Invoice/GetList?srcorgid=' + sobInfo.value.id, qs.stringify(mainform.value));
        if (res.data.rows.length > 0) {
            loading.value = false;
            loadings.value = false;
            butDisabled.value = false;
            butDisableds.value = false;
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
            loading.value = false;
            loadings.value = false;
            butDisabled.value = false;
            butDisableds.value = false;
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
        butDisableds.value = false;
        loading.value = false;
        loadings.value = false;
        // 这里可以添加你的错误处理逻辑
    } finally {
        // loading.value = false;
    }
}
const detailform = ref({})//明细表单
// 获取明细表数据
const postSaleDetail = async () => {
    loadings.value = true;
    butDisabled.value = true;
    butDisableds.value = true;
    detailform.value = {
        id: saleid.value,
        size: pagers.value.size,
        number: pagers.value.number,
        order: pagers.value.order,
    }
    try {
        const res = await ajax.post('/Invoice/GetInvoiceDetailMain', qs.stringify(detailform.value));
        if (res.data.rows.length > 0) {
            loadings.value = false;
            butDisabled.value = false;
            butDisableds.value = false;
            detailData.value = res.data.rows;
        }
        pagers.value.total = res.data.total;
    } catch (error) {
        loadings.value = false;
        butDisabled.value = false;
        butDisableds.value = false;
        // 这里可以添加你的错误处理逻辑
    } finally {
        loadings.value = false;
        butDisabled.value = false;
        butDisableds.value = false;
    }
}
// 开票状态
const getTagType = (status) => {
    switch (status) {
        case '开票完成':
            return 'success';
        case '待开票':
            return 'danger';
        case '已开票待返回电子版':
            return 'warning';
        default:
            return 'info';
    }
}
// 表格单击事件
const tableCurrentChange = (currentRow, oldCurrentRow) => {
    if (currentRow != null) {
        saleid.value = currentRow.id;
        pagers.value.number = 1;
        postSaleDetail()
    }
}
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
const resets = () => {
    mainform.value = {
        serino: '',//销售单据号
        customername: '',//客户名称
        invoiceDate: '',//单据日期
        status: '',//开票状态
    }
}
// 红冲删除
const DeleteAll = (id) => {
    utils.confirm('确定要删除吗？', () => {
        ajax.post('/Invoice/DeleteAll', qs.stringify({ id: id })).then((res) => {
            const messageType = res.success ? 'success' : 'error';
            utils.msg(res.msg, messageType, false);
            if (res.success) {
                index_refreshtab();
            }
        }).catch((err) => {
        });
    });
}
// 开票
const ticketstart = async () => {
    if (selectrow.value == '') {
        utils.msg('请选择要开票的数据', 'warning', false);
        return;
    }
    finishprogress.value = true;
    dataprovide.value.invoicedepartmentid = sobItems.value;
    for (let i = 0; i < selectrow.value.length; i++) {
        dataprovide.value.id = selectrow.value[i];
        try {
            await openticket();
        } catch (error) {
            utils.msg('开票失败', 'error', false);
            errorcount.value++;
        }
    }
}
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
    const res = await ajax.post('/Invoice/a', qs.stringify(dataprovide.value));
    if (res.code == 0) {
        successCount.value++;
        utils.notify('第' + successCount.value + '张', res.msg, 'success');
    } else {
        errorcount.value++;
        utils.notify('', res.msg, 'error');
    }
}
// 删除重复id
const deleteid = () => {
    selectrow.value = selectrow.value.filter(item => item !== dataprovide.value.id);
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

// 获取电子版
const getticket = async (row) => {
    try {
        const res = await ajax.post('/Invoice/SearchInvoice', qs.stringify({ Id: row.id, invoicedepartmentid: sobItems.value }));
        if (res.success) {
            utils.msg('获取成功', 'success', false);
            index_refreshtab();
        }
    } catch (error) {
        // 这里可以添加你的错误处理逻辑
    }
}
const taskclose = () => {
    percentage.value = 0
    successCount.value = 0
    errorcount.value = 0
    selectrow.value = []
    index_refreshtab()
}

// 打开导入列表
const openImport = () => {
    ImportTitle.value = '导入列表';
    ImportShow.value = true;
}
//每页条数改变
const handleSizeChange = (size) => {
    pager.value.size = size;
    getTableData();
};
//页码改变
const handleCurrentChange = (number) => {
    invoiceTotalTax.value = 0;
    invoiceTotalPrice.value = 0;
    pager.value.number = number;
    getTableData();
};
//每页条数改变
const handleSizeChanges = (size) => {
    invoiceTotalTax.value = 0;
    invoiceTotalPrice.value = 0;
    pagers.value.size = size;
    postSaleDetail()
};
//页码改变
const handleCurrentChanges = (number) => {
    pagers.value.number = number;
    postSaleDetail()
};
// 表头单元格样式
function headerCellStyle({ row, column, rowIndex, columnIndex }) {
    return {
        color: '#000',
        textAlign: 'center',
    }
}
// 页面加载
// 打开修改页
const dialogTitle = ref('');
const dialogShow = ref(false);//是否显示窗口
const openEdit = (row) => {
    ids.value = row.id;
    serialNo.value = row.serialNo;
    buyerTaxNo.value = row.buyerTaxNo;
    buyerName.value = row.buyerName;
    invoiceTotalPrices.value = row.invoiceTotalPrice;
    invoiceTotalTaxs.value = row.invoiceTotalTax;
    dialogTitle.value = '修改';
    dialogShow.value = true;
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
// 批量删除
const Batchdele = () => {
    if (selectrow.value == '') {
        utils.msg('请选择要删除的数据', 'warning', false);
        return;
    }
    utils.confirm('确定要删除吗？', () => {
        ajax.post('/Invoice/PLDelete', qs.stringify({ ids: selectrow.value.join(',') })).then((res) => {
            const messageType = res.success ? 'success' : 'error';
            utils.msg(res.msg, messageType, false);
            if (res.success) {
                index_refreshtab();
            }
        }).catch((err) => {
        });
    });
}
provide('deleteid', deleteid);//删除已开票id
provide('getTableData', getTableData);
provide('dialogShow', dialogShow);
provide('importshow', ImportShow);


</script>

<style scoped>
@import './css/task.css';
@import './css/tasklist.css';
@import '../../roadui-assets/before.css';

:deep(.successfa .el-statistic__number) {
    color: green
}

:deep(.errorfa .el-statistic__number) {
    color: red;
}
</style>