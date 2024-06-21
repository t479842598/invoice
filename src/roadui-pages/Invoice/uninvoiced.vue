<template>
    <div>
        <!-- 开票申请单无流程 -->
        <div class="form-container">
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="mergeTicket">合并开票</el-button>
                    <el-button type="primary" @click="handleTicketTask">批量开票</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="opensearch" :icon="Search">查询</el-button>
                    <el-button type="success" @click="reset" :icon="Refresh">刷新</el-button>
                </el-form-item>
                <el-form-item label="账套选择">
                    <el-select v-model="sobItems" @change="chengesob" placeholder="请选择账套" style="width: 200px;">
                        <el-option v-for="item in checkList" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="发票类型">
                    <el-radio-group v-model="ticketItems">
                        <el-radio v-for="item in ticketList" :label="item.id" border>{{ item.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item style="float:right">
                    <el-popover placement="top-start" title="列设置" width="150" trigger="hover" content="点击打开">
                        <template #reference>
                            <el-button :icon="Tools" style="text-align:right" circle @click="opentest"></el-button>
                        </template>
                    </el-popover>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-container">
            <el-table :data="tableData" :key="tableKey" v-loading="loading" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" :style="{ width: '100%', color: '#000' }"
                max-height="300" :header-cell-style="headerCellStyle" :default-sort="defaultOrder"
                @selection-change="handleSelectionChange" v-bind="$attrs" @current-change="tableCurrentChange"
                @sort-change="sortChange">
                <el-table-column prop="id" v-if="false" width="1" />
                <el-table-column type="selection" width="55" align="center" />
                <!-- 表格循环添加列 -->
                <template v-for="column in maintable">
                    <el-table-column :key="column.prop" v-if="column.isvisible" :prop="column.label" :label="column.label"
                        align="center" min-width="210%" :default-sort="defaultOrder" :sortable="column.sortable" fit
                        show-overflow-tooltip>
                    </el-table-column>
                </template>
                <el-table-column label="操作" align="center" width="120" fixed="right">
                    <template #default="scope">
                        <el-button type="primary" size="small"
                            @click="reback(scope.row.发票号, scope.row.id)">回写发票号</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="roadui_pagerdiv">
            <el-pagination v-model:currentPage="pager.number" v-model:page-size="pager.size" :page-sizes="pager.sizes"
                :background="pager.background" :layout="pager.layout" :total="pager.total" :disabled="butDisabled"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
        <!-- <div class="bottom-buttons">
            <el-button type="primary" @click="">合并折扣行</el-button>
            <el-button type="primary" @click="">添加折扣行</el-button>
        </div> -->
        <div class="detail-container">
            <el-form :inline="true">
                <el-form-item>
                    <h3 class="before">商品明细</h3>
                </el-form-item>
                <el-form-item style="float:right;margin-top: 10px;">
                    <el-popover placement="top-start" title="列设置" width="150" trigger="hover" content="点击打开">
                        <template #reference>
                            <el-button :icon="Tools" style="text-align:right" circle @click="opentests"></el-button>
                        </template>
                    </el-popover>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-bottom">
            <el-table :data="AddtableData" :key="detailtableKey" align="center" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" :style="{ width: '100%', color: '#000' }"
                max-height="280" :header-cell-style="headerCellStyle" :default-sort="defaultOrders">
                <el-table-column prop="billid" v-if="false" width="1" />
                <!-- 表格循环添加列 -->
                <template v-for="item in tableDetail">
                    <el-table-column v-if="item.isvisible" :prop="item.prop" :label="item.label" :width="item.width"
                        :key="item.prop" align="center" />
                </template>
            </el-table>
        </div>
        <div class="roadui_pagerdiv">
            <el-pagination v-model:currentPage="pagers.number" v-model:page-size="pagers.size" :page-sizes="pagers.sizes"
                :background="pagers.background" :layout="pagers.layout" :total="pagers.total" :disabled="butDisableds"
                @size-change="handleSizeChanges" @current-change="handleCurrentChanges" />
        </div>
        <!-- 开票 -->
        <el-dialog v-model="dialogShow" :fullscreen="fullscreen" style="position: relative;" :title="dialogTitle"
            align-center destroy-on-close width="1300px" @close="fullscreen = false" draggable
            :close-on-click-modal="false">
            <Task v-model:id="ids"></Task>
            <el-icon @click="fullscreen = !fullscreen"
                style="position: absolute;right: 45px;top: 24px;cursor: pointer;font-size: 14px;">
                <FullScreen />
            </el-icon>
        </el-dialog>
        <!-- 查询 -->
        <el-dialog v-model="showserch" title="查询" align-center destroy-on-close width="800px" draggable
            :close-on-click-modal="false">
            <el-form inline :model="formData" class="inline" label-width="100px">
                <el-form-item label="单据号">
                    <el-input v-model="formData.单据号"></el-input>
                </el-form-item>
                <el-form-item label="客户名称">
                    <el-input v-model="formData.客户名称"></el-input>
                </el-form-item>
                <el-form-item label="制单人">
                    <el-input v-model="formData.制单人"></el-input>
                </el-form-item>
                <el-form-item label="日期">
                    <el-date-picker v-model="formData.日期" style="width: 200px" type="daterange" value-format="YYYY-MM-DD"
                        clearable />
                </el-form-item>
                <el-form-item style="margin-left: 50px;">
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button type="success" @click="resets">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 显隐列 -->
        <el-dialog v-model="showmain" title="列设置" align-center destroy-on-close width="800px" draggable
            :close-on-click-modal="false">
            <my-transfer class="box-width" :titles="['已隐藏列表', '已显示列表']" :filterable="true" filterPlaceholder="请输入"
                :leftTransferData="deviceData" :rightTransferData="chooseDeviceList"
                @transferChange="transferChange"></my-transfer>
        </el-dialog>
        <el-dialog v-model="showdetail" title="列设置" align-center destroy-on-close width="800px" draggable
            :close-on-click-modal="false">
            <my-transfertwo class="box-width" :titles="['已隐藏列表', '已显示列表']" :filterable="true" filterPlaceholder="请输入"
                :leftTransferData="detailData" :rightTransferData="chooseDetailList"
                @transferChange="transferChanges"></my-transfertwo>
        </el-dialog>

        <el-dialog v-model="texnoshow" title="发票号修改" align-center destroy-on-close width="500px">
            <el-form :model="texnoData" class="inline" label-width="100px">
                <el-form-item label="发票号">
                    <el-input v-model="texnoData.no" style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="Savetexno">保存</el-button>
                    <el-button type="success" @click="closeDialog">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, nextTick, shallowRef, provide, watch, onUnmounted, defineAsyncComponent } from 'vue'
import { View, Edit, Search, Plus, Refresh, Tools } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios';
import { debounce } from 'lodash';
const Task = defineAsyncComponent(() => import('./components/tasknoflow.vue'))
import MyTransfer from './components/Transfer.vue';//征求意见页面
import MyTransfertwo from './components/Transfer.vue';//征求意见页面
// const MyTransfer = defineAsyncComponent(() => import('./components/Transfer.vue'))
// const MyTransfertwo = defineAsyncComponent(() => import('./components/Transfer.vue'))
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
const index_userinfo = inject('index_userinfo');//首页用户信息
const qs = inject('qs');
const index_openmenu = inject('index_openmenu');//首页打开菜单
const index_removetab = inject('index_removetab');//首页关闭标签方法
const index_refreshtab = inject('index_refreshtab');//首页刷新标签方式
const butDisabled = ref(false);//按钮是否可用
const butDisableds = ref(false);//按钮是否可用
const loading = ref(false);//加载状态
const loadings = ref(false);//加载状态
const defaultOrder = ref({ prop: '日期', order: 'descending' });
const defaultOrders = ref({ prop: '商品编号', order: 'ascending' });
const pager = ref(utils.getPager(defaultOrder.value));
const pagers = ref(utils.getPager(defaultOrders.value));
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const selectrow = ref([]);//选择的行
const showserch = ref(false);//查询
const tableKey = ref(0);//表格key
const detailtableKey = ref(0);//表格key
const saleid = ref('');//单据号
const transformvisible = ref(false);//穿梭框
const ids = ref('');//开票id
const showmain = ref(false);//显隐列
const showdetail = ref(false);//显隐列
const userInfo = ref({});//用户信息
const texnoshow = ref(false);//发票号码
const fullscreen = ref(false);//全屏
const type = ref('待开票');//类型
const texnoData = ref({
    no: '',//发票号码
});//发票号码
const systemInfo = ref('');//系统信息
const ticketItems = ref('');//发票类型
onMounted(() => {
    loadTableData(false);
    getSysinfo()
});
//获取系统设置数据
const getSysinfo = async () => {
    try {
        const res = await ajax.post('/Systemset/Get?srcorgid=' + sobInfo.value.id, {});
        systemInfo.value = res.data.invoicesystemset;
        ticketItems.value = res.data.invoicesystemset.默认发票类型;
    } catch (error) {
    }
};
//表单数据
const formData = ref({
    单据号: '',//单据号
    客户名称: '',//客户名称
    // 日期: [utils.formatDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000)), utils.formatDate(new Date())],//日期
    日期: utils.getMonth(),
    制单人: '',//制单人
});
// 账套选择
const sobItems = ref();//账套选择

const checkList = ref([])//账套选择
const ticketList = ref([
    { id: '01', label: '全电专用发票' },
    { id: '02', label: '全电普通发票' },
])
// 监听sobItems变化，当sobItems变化时，重新加载表格数据
watch(sobItems, (newVal, oldVal) => {
    loadTableData(true);
});
// 表格循环
const maintable = ref([])
const tableDetail = ref([])
const uninvoicedhide = ref();//显示隐藏列
const detailhide = ref();//显示隐藏列

//表格数据
const tableData = ref([])
const AddtableData = ref([])
//加载列表，isQuery 点查询按钮为true，初始加载为false，为了区分点查询按钮时要将页number置为1。
const loadTableData = async (isQuery) => {
    try {
        if (isQuery) {
            pager.value.number = 1;
        }
        loading.value = true;
        loadings.value = true;
        butDisabled.value = true;
        formData.value.size = pager.value.size;
        formData.value.number = pager.value.number;
        formData.value.order = pager.value.order;
        formData.value.connid = sobItems.value;
        const res = await ajax.post('/SaleInvoice/GetSaleMain', qs.stringify(formData.value));
        tableData.value = res.data.rows;
        pager.value.total = res.data.total;
        pagers.value.total = res.data.total;
        loading.value = false;
        loadings.value = false;
        if (res.data.total == 0) {
            butDisabled.value = true;
            butDisableds.value = true;
        } else {
            butDisabled.value = false;
            butDisableds.value = false;
        }
        if (res.data.rows.length > 0) {
            saleid.value = res.data.rows[0].id;
            postSaleDetail();
        }
        await getColumns();
    } catch (error) {
        butDisabled.value = false;
        loading.value = false;
    }
};
// 待选列表
const deviceData = ref([])
const detailData = ref([])
// 已选列表
const chooseDeviceList = ref([]);
const chooseDetailList = ref([]);

// 获取列
const getColumns = async () => {
    try {
        loading.value = true;
        loadings.value = true;

        const res = await ajax.post('/cn_columns/Get', qs.stringify({ connid: sobItems.value }));
        maintable.value = res.data.maincolumns;
        tableDetail.value = res.data.detailcolumns;

        deviceData.value = res.data.maincolumns.filter(item => item.isvisible === false);
        chooseDeviceList.value = res.data.maincolumns.filter(item => item.isvisible === true);
        uninvoicedhide.value = maintable.value.map(item => item.label);


        detailData.value = res.data.detailcolumns.filter(item => item.isvisible === false);
        chooseDetailList.value = res.data.detailcolumns.filter(item => item.isvisible === true);
        detailhide.value = tableDetail.value.map(item => item.label);

        uninvoicedhide.value = uninvoicedhide.value.filter(label => {
            const column = maintable.value.find(item => item.label === label);
            return column && column.isvisible;
        });

        detailhide.value = detailhide.value.filter(label => {
            const column = tableDetail.value.find(item => item.label === label);
            return column && column.isvisible;
        });


        loading.value = false;
        loadings.value = false;
    } catch (error) {
        butDisabled.value = false;
        loading.value = false;
    }
};

//开票
const dialogTitle = ref('');
const dialogPage = shallowRef(null);
const dialogShow = ref(false);//是否显示窗口
const pl = ref(0)//是否是批量开票

// 点击合并开票
// 使用防抖函数，防止用户频繁点击，300毫秒内只会触发一次
function mergeTicket() {
    debounce(() => {
        if (!selectrow.value.length) {
            return utils.msg('没有选择任何数据', 'error', false);
        }
        // if (selectrow.value.length > 1 && !selectrow.value.every(row => row.税号 === selectrow.value[0].税号)) {
        //     return utils.msg('请选择批量开票', 'warning', false);
        // }
        if (selectrow.value.length > 1 && !selectrow.value.every(row => row.客户名称 === selectrow.value[0].客户名称)) {
            return utils.msg('请选择批量开票', 'warning', false);
        }
        saveInvoiceFromSaleBill(pl.value = 0);
    }, 300)();
}

// 点击批量开票
// 使用防抖函数，防止用户频繁点击，300毫秒内只会触发一次
function handleTicketTask() {
    debounce(() => {
        if (!selectrow.value.length) {
            return utils.msg('没有选择任何数据', 'error', false);
        }
        saveInvoiceFromSaleBill(pl.value = 1);
    }, 300)();
}

// 开票第一步
// 保存开票信息
async function saveInvoiceFromSaleBill(pl) {
    try {
        const res = await ajax.post('/Invoice/SaveFromSaleBill?srcorgid=' + sobInfo.value.id, qs.stringify({
            connid: sobItems.value,
            invoiceTypeCode: ticketItems.value,
            invoiceJSON: JSON.stringify(selectrow.value),
            pl: pl,
            sellerBankName: sobInfo.value.openbank,
            sellerBankNumber: sobInfo.value.bankaccount,
            sellerAddress: sobInfo.value.address,
            sellerPhone: sobInfo.value.phone,
        }));
        if (res.code === 0) {
            ids.value = res.data;
            dialogTitle.value = pl.value === 0 ? '合并开票' : '批量开票';
            [dialogPage.value, dialogShow.value] = [Task, true];
        } else if (res.code === -1) {
            utils.msg(res.msg, 'error', false);
        }
    } catch (error) {
        if (error.message === 'Network Error') {
            utils.msg('网络请求失败，请检查你的网络连接', 'error', false);
        } else {
            utils.msg(error.message, 'error', false);
        }
    }
}

// 打开查询页面
const opensearch = () => {
    showserch.value = true;
}

// 查询
const search = () => {
    loadTableData(true);
    showserch.value = false;
}

// 刷新
const reset = () => {
    debounce(() => {
        formData.value = {
            单据号: '',//销售单据号
            客户名称: '',//客户名称
            日期: '',//单据日期
        };
        loadTableData(true);
    }, 300)();
};

// 重置表单
const resets = () => {
    formData.value = {
        单据号: '',//销售单据号
        客户名称: '',//客户名称
        日期: '',//单据日期
    };
    // loadTableData(true);
};
// 账套选择
const getsobItems = async () => {
    try {
        const res = await ajax.post('user/GetUserAccountByUser?srcorgid=' + sobInfo.value.id, qs.stringify({ userid: userInfo.value.userId }));
        if (res.success) {
            if (res.data.length > 0) {
                sobItems.value = res.data[0].id;
                checkList.value = res.data;
            }
        }
    } catch (error) {
        // utils.msg(error.message, 'error', false);
        // 这里可以添加你的错误处理逻辑
    }
}

//载入首页数据
const loadData = () => {
    ajax.post('/Home/GetIndexInfo').then((res) => {
        if (res.success) {
            userInfo.value = res.data.userInfo;
            getsobItems();
        }
    }).catch(() => { });
};
loadData()

// 保存显示隐藏列
const saveDetail = async () => {
    try {
        const res = await ajax.post('/cn_columns/Save', qs.stringify({ maincolumnsJSON: JSON.stringify(maintable.value), detailcolumnsJSON: JSON.stringify(tableDetail.value) }));
        if (res.success) {
            utils.msg('保存成功', 'success', false);
            index_refreshtab();
        }
    } catch (error) {
        utils.msg(error.message, 'error', false);
        // 这里可以添加你的错误处理逻辑
    }
}

// 每页条数改变
const handleSizeChange = (size) => {
    pager.value.size = size;
    loadTableData(false);
};

//页码改变
const handleCurrentChange = (number) => {
    pager.value.number = number;
    loadTableData(false);
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

// 单击行触发
const tableCurrentChange = (currentRow, oldCurrentRow) => {
    if (currentRow != null) {
        saleid.value = currentRow.id;
        pagers.value.number = 1;
        postSaleDetail()
    }
}

const detailform = ref({})
// 封装ajax请求
const postSaleDetail = async () => {
    loadings.value = true;
    detailform.value = {
        saleid: saleid.value,
        connid: sobItems.value,
        size: pagers.value.size,
        number: pagers.value.number,
        order: pagers.value.order,
    }
    try {
        const res = await ajax.post('/SaleInvoice/GetSaleDetailMain', qs.stringify(detailform.value));
        AddtableData.value = res.data.rows;
        pagers.value.total = res.data.total;
        if (res.data.total == 0) {
            butDisableds.value = true;
        } else {
            butDisableds.value = false;
        }
    } catch (error) {
        utils.msg(error.message, 'error', false);
        // 这里可以添加你的错误处理逻辑
    } finally {
        loadings.value = false;
    }
}

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
// 回写发票号
// 关闭
const closeDialog = () => {
    texnoData.value.no = '';
    texnoshow.value = false;
};
// 打开
const reback = (row, id) => {
    texnoData.value.no = row;
    if (texnoData.value.no == '') {
        type.value = '待开票'
    } else {
        type.value = '已开票'
    }
    ids.value = id
    texnoshow.value = true;
};

// 保存
const Savetexno = async () => {
    try {
        const res = await ajax.post('/SaleInvoice/UpdateInvoiceNo', qs.stringify({ id: ids.value, invoiceno: texnoData.value.no, connid: sobItems.value, type: type.value }));
        if (res.success) {
            utils.msg('保存成功', 'success', false);
            closeDialog();
            loadTableData(false);
        }
    } catch (error) {
        utils.msg(error.message, 'error', false);
    }
};
function chengesob() {
    // 明细表格数据清空
    AddtableData.value = [];
}

// 打开测试显隐列
const opentest = () => {
    showmain.value = true;
}

const opentests = () => {
    showdetail.value = true;
}


// 选中的待选列表主表
function transferChange(data) {
    // 使用map替换外层循环
    maintable.value = maintable.value.map(item => {
        // 创建一个新的对象，避免修改原对象
        const newItem = { ...item };
        const match = data.find(d => d.label === newItem.label);
        if (match) {
            newItem.isvisible = true;
            // 只有被点击的数据被添加到右侧
            if (match.label === newItem.label && !chooseDeviceList.value.some(d => d.label === newItem.label)) {
                chooseDeviceList.value.push(newItem);
            }
        } else {
            newItem.isvisible = false;
            // 右侧的数据在被点击时被移除
            const index = chooseDeviceList.value.findIndex(d => d.label === newItem.label);
            if (index !== -1) {
                chooseDeviceList.value.splice(index, 1);
            }
        }
        return newItem;
    });
}
// 选中的已选列表明细
function transferChanges(data) {
    // 使用map替换外层循环
    tableDetail.value = tableDetail.value.map(item => {
        // 创建一个新的对象，避免修改原对象
        const newItem = { ...item };
        const match = data.find(d => d.label === newItem.label);
        if (match) {
            newItem.isvisible = true;
            // 只有被点击的数据被添加到右侧
            if (match.label === newItem.label && !chooseDetailList.value.some(d => d.label === newItem.label)) {
                chooseDetailList.value.push(newItem);
            }
        } else {
            newItem.isvisible = false;
            // 右侧的数据在被点击时被移除
            const index = chooseDetailList.value.findIndex(d => d.label === newItem.label);
            if (index !== -1) {
                chooseDetailList.value.splice(index, 1);
            }
        }
        return newItem;
    });
}
//排序
const sortChange = (order) => {
    pager.value.order = utils.getOrder(order);
    loadTableData(false);
};








provide('view_dialogshow', dialogShow);
provide('Savecolum', saveDetail);
</script>

<style scoped>
@import url('./css/uninvoiced.css');
@import url('../../roadui-assets/before.css');
</style>
