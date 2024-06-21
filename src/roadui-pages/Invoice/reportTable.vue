<template>
    <div>
        <!-- 发票资料查询 -->
        <form v-show="false" ref="formref" action="" method="post"></form>
        <div class="form-container">
            <el-form :inline="true" :model="mainform">
                <el-form-item label="发票类型">
                    <el-select v-model="mainform.type" placeholder="" style="width: 240px">
                        <el-option label="增值税普通发票" value="02" />
                        <el-option label="增值税专用发票" value="01" />
                        <!-- <el-option label="增值税特殊发票" value="99" /> -->
                    </el-select>
                </el-form-item>
                <el-form-item label="特殊票种">
                    <el-select v-model="specValue" multiple clearable collapse-tags placeholder=""
                        popper-class="custom-header" :max-collapse-tags="1" style="width: 240px">
                        <template #header>
                            <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">
                                全部
                            </el-checkbox>
                        </template>
                        <el-option v-for="item in specList" :key="item.code" :label="item.name" :value="item.code" />
                    </el-select>
                </el-form-item>
                <el-form-item label="时间">
                    <el-date-picker v-model="mainform.time" style="width: 220px;" format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD" type="daterange" range-separator="到" start-placeholder="开始时间"
                        end-placeholder="结束时间" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getTableData()" icon="Search">查询</el-button>
                    <el-button icon="Refresh" style="text-align:right" @click="reset">重置</el-button>
                    <el-button type="warning" @click="exportfiles" icon="Upload">导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- <div> -->
        <h4>按发票种类统计(开票)</h4>
        <!-- </div> -->
        <div class="table-container">
            <el-table :data="tableData" v-loading="loading" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" max-height="180" style="width:100%; color: #000;"
                :header-cell-style="headerCellStyle" @selection-change="handleSelectionChange">
                <el-table-column prop="id" v-if="false" width="1" />
                <el-table-column type="index" width="65" label="序号" align="center" />
                <el-table-column fit show-overflow-tooltip v-for="(column, index) in maincolumns" :key="index"
                    :prop="column.prop" :label="column.label" :align="column.align" :width="column.width">
                </el-table-column>
            </el-table>
        </div>
        <!-- <div> -->
        <h4>按税率/征收率统计</h4>
        <!-- </div> -->
        <div class="table-container">
            <el-table :data="detailData" v-loading="loadings" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" max-height="500" style="width: 100%;color: #000"
                :header-cell-style="headerCellStyle" :default-sort="defaultOrder" :summary-method="getSummaries"
                show-summary>
                <el-table-column type="index" width="65" label="序号" align="center" />
                <template v-for=" item in tableDetail ">
                    <el-table-column v-if="item.show" fit show-overflow-tooltip :prop="item.prop" :label="item.label"
                        :align="item.align" :min-width="item.width" />
                </template>
            </el-table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, shallowRef, provide, reactive, nextTick, watch, defineAsyncComponent } from 'vue'
import type { TabPaneName } from 'element-plus'
import { View, Edit, Search, Plus, Refresh, Tools } from '@element-plus/icons-vue'
import { ElMessage, inputNumberEmits } from 'element-plus'
import { debounce } from 'lodash';
// import { useRealProgress } from './components/fake-progress'
import axios from 'axios';
import { ElNotification } from 'element-plus'
const EditTask = defineAsyncComponent(() => import('./components/taskEdit.vue'))
const HandEditTask = defineAsyncComponent(() => import('./components/HandEdit.vue'))
const isHand = ref(false);//是否是手工开票
const fullscreen = ref(false);
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
const sobItems = ref();//开票单位
const billcode = ref('');//单据号
const index_userinfo = inject('index_userinfo');//首页用户信息
const checkAll = ref(false)
const indeterminate = ref(false)
const specList = ref([])
const specValue = ref([])
const formref = ref()//ref
// 主表格列
const maincolumns = ref([
    { prop: 'invoicetypename', label: '发票种类', align: 'center' },
    { prop: 'bluenum', label: '正数发票份数', align: 'right' },
    { prop: 'rednum', label: '负数发票份数', align: 'right' },
]);
// 明细表格列
const tableDetail = ref([
    { prop: 'id', align: 'center', show: false },
    { prop: 'invoicetypename', label: '发票种类', align: 'center', show: true, width: '200', },
    { prop: 'goodsTaxRate', label: '税率/征收率', show: true, align: 'right', width: '120', },
    { prop: 'goodsTotalPrice', label: '开具蓝字发票金额', show: true, align: 'right', width: '150', },
    { prop: 'goodsTotalTax', label: '开具蓝字发票税额', show: true, align: 'right', width: '150', },
    { prop: 'redgoodsTotalPrice', label: '开具红字发票金额', show: true, align: 'right', width: '150', },
    { prop: 'redgoodsTotalTax', label: '开具红字发票税额', show: true, align: 'right', width: '150', },
    { prop: 'chagoodsTotalPrice', label: '实际开具发票金额', show: true, align: 'right', width: '150' },
    { prop: 'chagoodsTotalTax', label: '实际开具发票税颜', show: true, align: 'right', width: '150' },
]);

onMounted(async () => {
    // 获取表格数据
    await getTableData();
    // 获取开票单位信息
    await getsobItems();

})
//明细表单
// 获取表格数据
async function getTableData() {
    console.log(mainform.value)
    try {
        loading.value = true;
        loadings.value = true;
        butDisabled.value = true;
        butDisableds.value = true;
        mainform.value.spec = specValue.value.join(',')
        if (mainform.value.time != null) {
            mainform.value.time1 = mainform.value.time[0]
            mainform.value.time2 = mainform.value.time[1]
        } else {
            mainform.value.time1 = ''
            mainform.value.time2 = ''
        }

        const res = await ajax.post('/Report/ReportInvoice?srcorgid=' + sobInfo.value.id, qs.stringify(mainform.value));
        console.log(res)
        loading.value = false;
        loadings.value = false;
        butDisabled.value = false;
        butDisableds.value = false;

        tableData.value = res.data.invoicenum
        detailData.value = res.data.invoice
        // saleid.value = res.data.rows[0].id;
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

const getsobItems = async () => {
    try {
        const res = await ajax.post('invoice_BaseInfo/GetAll', qs.stringify({}));
        if (res.success) {
            specList.value = res.data.main
        }
    } catch (error) {
        // 这里可以添加你的错误处理逻辑
    }
}
// 获取表格数据
const mainform = ref<any>({
    type: '',
    spec: '',
    time: ''
})
const reset = () => {
    mainform.value = {
        type: '',
        spec: '',
        time: ''
    }
    getTableData()
}
watch(mainform.value.spec, (val) => {
    if (val.length === 0) {
        checkAll.value = false
        indeterminate.value = false
    } else if (val.length === specList.value.length) {
        checkAll.value = true
        indeterminate.value = false
    } else {
        indeterminate.value = true
    }
})
const handleCheckAll = (val) => {
    indeterminate.value = false;
    specValue.value = val ? specList.value.map((item) => item.code) : [];
    mainform.value.spec = specValue.value.join(',')
}


// 多选
// const handleSelectionChange = (val) => {
//     // 把每一行的id放到数组里面,有重复的只留一个
//     selectrow.value = Array.from(new Set(val.map(item => item.id)));
// }
// 表格数据1
const tableData = ref([]);
// 表格数据2
const detailData = ref([])

//导出表格
function exportfiles() {
    mainform.value.time1 = mainform.value.time[0]
    mainform.value.time2 = mainform.value.time[1]
    mainform.value.srcorgid = sobInfo.value.id
    nextTick(() => {
        exportfileexcel()
    })
}

function exportfileexcel() {
    debounce(() => {
        formref.value.action = config.SERVER_PRO_APIADDRESS + '/Report/ExportInvoiceDetail?' + qs.stringify({ whereJSON: JSON.stringify(mainform.value) });
        // formref.value.action = config.SERVER_DEV_APIADDRESS + '/Report/ExportInvoiceDetail?' + qs.stringify({ whereJSON: JSON.stringify(mainform.value) });
        formref.value.submit();
    }, 300)();
}

// 表头单元格样式
function headerCellStyle({ row, column, rowIndex, columnIndex }) {
    return {
        color: '#000',
        textAlign: 'center',
    }
}
// 合计
const getSummaries = (param) => {
    const { columns, data } = param
    const sums = []
    const columnsToShowSum = ['goodsTotalPrice', 'goodsTotalTax', 'deletegoodsTotalPrice', 'redgoodsTotalPrice', 'redgoodsTotalTax', 'deleteredgoodsTotalPrice', 'deleteredgoodsTotalTax', 'chagoodsTotalPrice', 'chagoodsTotalTax', 'deletegoodsTotalTax']

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
                        return Number(prev) + Number(curr)
                    } else {
                        return Number(prev)
                    }
                }, 0).toFixed(2)}`
            } else {
                sums[index] = ''
            }
        } else {
            sums[index] = ''
        }
    })
    return sums
}

provide('getTableData', getTableData);
</script>

<style scoped></style>