<template>
    <div>
        <!-- 用户管理 -->
        <div class="form-container">
            <el-form :inline="true" style="overflow: hidden;">
                <el-form-item>
                    <el-button type="primary" @click="tickettask">申请开票</el-button>
                    <el-button type="primary" @click="tickettask">批量开票</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="showserch = true" icon="Search">查询</el-button>
                    <el-button type="default" @click="reset" icon="Refresh">刷新</el-button>
                </el-form-item>
                <el-form-item style="float: right;">
                    <table border class="table" style="width: 100%;height: 30px;padding: 0;">
                        <tr>
                            <td width="87" align="center">
                                本月额度
                            </td>
                            <td width="110" align="center">
                            </td>
                            <td width="87" align="center">
                                已开额度
                            </td>
                            <td width="110" align="center">
                            </td>
                            <td width="87" align="center">
                                未开额度
                            </td>
                            <td width="110" align="center">
                            </td>
                        </tr>
                    </table>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-container">
            <el-table :data="tableData" v-loading="loading" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" :style="{ width: '100%', color: '#000' }"
                :header-cell-style="headerCellStyle" :default-sort="defaultOrder"
                @selection-change="handleSelectionChange">
                <el-table-column prop="id" v-if="false" width="1" />
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column prop="billcode" label="销售单据号" align="center" width="200"></el-table-column>
                <el-table-column prop="invoiceDate" label="单据日期" align="center" width="150"></el-table-column>
                <el-table-column prop="buyerName" label="客户名称" align="center" width="150"></el-table-column>
                <el-table-column prop="invoiceTotalPrice" label="金额" align="right" width="150"></el-table-column>
                <el-table-column prop="discountAmount" label="折扣" align="center" width="100"></el-table-column>
                <el-table-column prop="invoiceNo" label="发票号" align="center" width="200"></el-table-column>
                <el-table-column prop="invoiceTypename" label="发票类别" align="center" width="200"></el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template #default="scope">
                        <el-tag effect="light"
                            :type="scope.row.status == '开票完成' ? 'success' : scope.row.status == '待开票' ? 'danger' : scope.row.status == '已开票待返回电子版' ? 'warning' : 'info'">{{
                                scope.row.status }}</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- <div class="bottom-buttons">
            <el-button type="primary" @click="">合并折扣行</el-button>
            <el-button type="primary" @click="">添加折扣行</el-button>
        </div> -->
        <div>
            <h3 class="before">商品明细</h3>
        </div>
        <div class="table-bottom">
            <el-table :data="AddtableData" v-loading="loadings" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" :style="{ width: '100%', color: '#000' }"
                :header-cell-style="headerCellStyle" :default-sort="defaultOrder">
                <el-table-column prop="id" v-if="false" width="1" />
                <el-table-column prop="goodsName" label="商品名称" align="center" width="200"></el-table-column>
                <el-table-column prop="goodsSpecification" label="规格型号" align="center" width="150"></el-table-column>
                <el-table-column prop="goodsUnit" label="单位" align="center" width="100"></el-table-column>
                <el-table-column prop="goodsQuantity" label="数量" align="center" width="120"></el-table-column>
                <el-table-column prop="goodsPrice" label="单价" align="center" width="150"></el-table-column>
                <el-table-column prop="priceTaxMark" label="含税" align="center" width="80"></el-table-column>
                <el-table-column prop="goodsTotalPrice" label="金额(未税)" align="center" width="150"></el-table-column>
                <el-table-column prop="goodsTaxRate" label="税率" align="center" width="100"></el-table-column>
                <el-table-column prop="goodsTotalTax" label="税额" align="center" width="100"></el-table-column>
                <el-table-column prop="invoiceTypename1" label="折扣未税" align="center" width="100"></el-table-column>
                <el-table-column prop="invoiceTypename2" label="折扣税额" align="center" width="100"></el-table-column>
                <el-table-column prop="invoiceTypename3" label="分类编码" align="center" width="120"></el-table-column>
            </el-table>
        </div>
        <!-- 开票 -->
        <el-dialog v-model="dialogShow" :title="dialogTitle" align-center destroy-on-close width="1300px" draggable
            :close-on-click-modal="false">
            <!-- <component :is="dialogPage" :query="dialogQuery"></component> -->
            <Task></Task>
        </el-dialog>
        <!-- 查询 -->
        <el-dialog v-model="showserch" title="查询" align-center destroy-on-close width="800px" draggable
            :close-on-click-modal="false">
            <el-form inline :model="formData" class="inline" label-width="100px">
                <el-form-item label="销售单据号">
                    <el-input v-model="formData.billcode"></el-input>
                </el-form-item>
                <el-form-item label="客户名称">
                    <el-input v-model="formData.buyerName"></el-input>
                </el-form-item>
                <el-form-item label="发票号码">
                    <el-input v-model="formData.invoiceNo"></el-input>
                </el-form-item>
                <el-form-item label="发票种类">
                    <el-select v-model="formData.invoiceTypeCode" clearable>
                        <el-option v-for="item in invoiceTypeCode" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="开票状态">
                    <el-select v-model="formData.istate" clearable>
                        <el-option label="待开票" value="待开票" />
                        <el-option label="已开票待返回电子版" value="已开票待返回电子版" />
                        <el-option label="开票完成" value="开票完成" />
                    </el-select>
                </el-form-item>
                <el-form-item label="单据日期">
                    <el-date-picker v-model="formData.invoiceDate" type="daterange" value-format="YYYY-MM-DD"
                        clearable />
                </el-form-item>
                <el-form-item style="margin-left: 30px;">
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button type="default" @click="resets">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, nextTick, shallowRef, provide } from 'vue'
import { View, Edit, Search, Plus, Refresh, Tools } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios';
import Task from './task.vue'
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
const qs = inject('qs');
const index_openmenu = inject('index_openmenu');//首页打开菜单
const index_removetab = inject('index_removetab');//首页关闭标签方法
const index_refreshtab = inject('index_refreshtab');//首页刷新标签方式
const butDisabled = ref(false);//按钮是否可用
const loading = ref(false);//加载状态
const loadings = ref(false);//加载状态
const type = ref('');//类型
let selectRows = [];//保存选择的行
const defaultOrder = ref({ prop: 'userNumber', order: 'ascending' });
const pager = ref(utils.getPager(defaultOrder.value));
const selectrow = ref([]);//选择的行
const showserch = ref(false);//查询
//表单数据
const formData = ref({
    billcode: '',//销售单据号
    buyerName: '',//客户名称
    invoiceNo: '',//发票号码
    invoiceDate: '',//单据日期
    invoiceType: '0',//发票类型
    invoiceTypeCode: '',//发票种类
    istate: '',//开票状态
});
//表格数据
const tableData = ref([
    {
        id: 1,
        billcode: '2021010100000000001',
        invoiceDate: '2021-01-01',
        buyerName: '张三',
        invoiceTotalPrice: '1000.00',
        discountAmount: '100.00',
        invoiceNo: '123456789012345',
        invoiceTypename: '全电发票(普通发票)',
        status: '待开票'
    },
    {
        id: 2,
        billcode: '2021010100000000001',
        invoiceDate: '2021-01-01',
        buyerName: '张三',
        invoiceTotalPrice: '1000.00',
        discountAmount: '100.00',
        invoiceNo: '123456789012345',
        invoiceTypename: '全电发票(普通发票)',
        status: '开票完成'
    },
    {
        id: 3,
        billcode: '2021010100000000001',
        invoiceDate: '2021-01-01',
        buyerName: '张三',
        invoiceTotalPrice: '1000.00',
        discountAmount: '100.00',
        invoiceNo: '123456789012345',
        invoiceTypename: '全电发票(普通发票)',
        status: '已开票待返回电子版'
    },
])
const AddtableData = ref([
    {
        id: 1,
        goodsName: '商品名称',
        goodsSpecification: '规格型号',
        goodsUnit: '单位',
        goodsQuantity: '数量',
        goodsPrice: '单价',
        priceTaxMark: '含税',
        goodsTotalPrice: '金额(未税)',
        goodsTaxRate: '税率',
        goodsTotalTax: '税额',
        invoiceTypename1: '折扣未税',
        invoiceTypename2: '折扣税额',
        invoiceTypename3: '分类编码',
    },
])
//发票类型
const invoiceTypeCode = [
    { value: '01', label: '全电发票(增值税专用发票)' },
    { value: '02', label: '全电发票(普通发票)' },
];
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
    // ajax.post('/Flow/GetTodoList', qs.stringify(formData.value)).then((res) => {
    //     tableData.value = res.data.rows;
    //     pager.value.total = res.data.total;
    butDisabled.value = false;
    loading.value = false;
    // }).catch(() => { butDisabled.value = false; loading.value = false; });
};
//开票
const dialogTitle = ref('');
const dialogPage = shallowRef(null);
const dialogShow = ref(false);//是否显示窗口
const tickettask = () => {
    dialogPage.value = Task;
    dialogTitle.value = '申请开票';
    dialogShow.value = true;
}
//查询
const search = () => {
    loadTableData(true);
    showserch.value = false;
};
//重置
const reset = () => {
    formData.value = {
        billcode: '',//销售单据号
        buyerName: '',//客户名称
        invoiceNo: '',//发票号码
        invoiceDate: '',//单据日期
        invoiceType: '0',//发票类型
        invoiceTypeCode: '',//发票种类
        istate: '',//开票状态
    };
    loadTableData(true);
};
// 重置表单
const resets = () => {
    formData.value = {
        billcode: '',//销售单据号
        buyerName: '',//客户名称
        invoiceNo: '',//发票号码
        invoiceDate: '',//单据日期
        invoiceType: '0',//发票类型
        invoiceTypeCode: '',//发票种类
        istate: '',//开票状态
    };
    // loadTableData(true);
};
//新增
const addNew = () => {
};
// 多选
const handleSelectionChange = (val) => {
    selectrow.value = val
}
//表头单元格样式
function headerCellStyle({ row, column, rowIndex, columnIndex }) {
    return {
        color: '#000',
        textAlign: 'center',
    }
}
provide('view_dialogshow', dialogShow);
</script>

<style scoped>
@import url('./css/uninvoiced.css');
@import url('../../roadui-assets/before.css');
</style>
