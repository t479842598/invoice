<template>
    <div>
        <form v-show="false" ref="formref" action="" method="post"></form>
        <!-- 开票任务 -->
        <div class="form-container">
            <el-form ref="formbutton" inline>
                <el-form-item>
                    <el-button type="primary" @click="Searchform" icon="Search">查询</el-button>
                    <el-button type="success" @click="reset" icon="Refresh">刷新</el-button>
                    <el-button type="warning" @click="exportfiles" icon="Upload">导出</el-button>
                </el-form-item>
                <el-form-item label="开票单位" prop="sobItemsName">
                    <!-- <el-select v-model="sobItems" placeholder="请选择开票单位" style="width: 260px;">
                        <el-option v-for="item in checkList" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select> -->
                    {{ sobInfo.accountname }}
                </el-form-item>
                <el-form-item label="税号" prop="sobTaxno">
                    <!-- <el-select v-model="sobItems" placeholder="请选择开票单位" style="width: 260px;">
                        <el-option v-for="item in checkList" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select> -->
                    {{ sobInfo.taxno }}
                </el-form-item>
            </el-form>
        </div>
        <!-- <div>
            <h3 class="before">待开发票</h3>
        </div> -->
        <div class="table-container">
            <el-table :data="tableData" v-loading="loading" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" max-height="550"
                style="width:100%; color: #000;" :header-cell-style="headerCellStyle" @sort-change="sortChange">
                <el-table-column prop="id" v-if="false" width="1" />
                <el-table-column v-for="(column, index) in maincolumns" :key="index" :prop="column.prop"
                    :label="column.label" :align="column.align" fit show-overflow-tooltip :width="column.width">
                    <template v-if="column.template" #default="scope">
                        <div style="display: flex; align-items: center">
                            <a @click="openview(scope.row.id)" style="margin-left: 10px">{{ scope.row.serialNo }}</a>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="250" fixed="right">
                    <template #default="scope">
                        <el-button type="primary" size="small"
                            @click="Download(scope.row.eInvoiceUrl)">下载电子版</el-button>
                        <el-button type="success" size="small"
                            @click="Emailout(scope.row.eInvoiceUrl, scope.row.buyerEmail, scope.row.customercode, scope.row.connid, scope.row.id, scope.row)">发送客户邮箱</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="table-text">
            <table border="0" class="table" width="900">
                <tr>
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
        <!-- 查询 -->
        <el-dialog v-model="showserch" title="查询" align-center destroy-on-close width="800px" draggable
            :close-on-click-modal="false">
            <el-form :inline="true" :model="formData" class="inline" label-width="100px">
                <el-form-item label="开票流水号">
                    <el-input v-model="formData.serino"></el-input>
                </el-form-item>
                <el-form-item label="发票号">
                    <el-input v-model="formData.invoiceno"></el-input>
                </el-form-item>
                <el-form-item label="客户名称">
                    <el-input v-model="formData.buyerName"></el-input>
                </el-form-item>
                <el-form-item label="开票日期">
                    <el-date-picker v-model="formData.invoiceDate" type="daterange" value-format="YYYY-MM-DD"
                        clearable />
                </el-form-item>
                <el-form-item style="margin-left: 30px;">
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button type="success" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 邮件发送 -->
        <el-dialog v-model="sendemail" title="发送邮件" align-center destroy-on-close width="500px">
            <el-form :model="EmailData" class="inline" label-width="100px">
                <el-form-item label="邮箱号码">
                    <el-input v-model="EmailData.emailcode" style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                        @click="SendEmail(EmailData.emailcode, buyerName, connid, rowids)">发送</el-button>
                    <el-button type="success" @click="closeDialog">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 回显发票号 -->
        <el-dialog v-model="texnoshow" title="发票号修改" align-center destroy-on-close width="500px">
            <el-form :model="texnoData" class="inline" label-width="100px">
                <el-form-item label="发票号">
                    <el-input v-model="texnoData.no" style="width: 210px;"></el-input>
                </el-form-item>
                <el-form-item label="开票日期">
                    <el-date-picker v-model="texnoData.invoiceDate" type="date" value-format="YYYY-MM-DD" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="Save">保存</el-button>
                    <el-button type="success" @click="closeDialog">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 查看 -->
        <el-dialog v-model="dialogShow" :fullscreen="fullscreen" style="position: relative;" :title="dialogTitle"
            align-center destroy-on-close width="1300px" @close="fullscreen = false" draggable
            :close-on-click-modal="false">
            <Task v-model:id="saleid"></Task>
            <el-icon @click="fullscreen = !fullscreen"
                style="position: absolute;right: 45px;top: 24px;cursor: pointer;font-size: 14px;">
                <FullScreen />
            </el-icon>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, shallowRef, provide, reactive, nextTick, watch, defineAsyncComponent } from 'vue'
import type { TabPaneName } from 'element-plus'
import { View, Delete, Search, Plus, Refresh, Upload } from '@element-plus/icons-vue'
import { ElMessage, inputNumberEmits } from 'element-plus'
const Task = defineAsyncComponent(() => import('./components/completeView.vue'))
import axios from 'axios';
import { debounce } from 'lodash';
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
const qs = inject('qs');
const app = inject('app');
const index_openmenu = inject('index_openmenu');//首页打开菜单
const index_removetab = inject('index_removetab');//首页关闭标签方法
const index_refreshtab = inject('index_refreshtab');//首页刷新标签方式
const index_userinfo = inject('index_userinfo');//首页用户信息
const submit_dialogshow = inject('submit_dialogshow');
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const props = defineProps({ query: { type: String, default: () => { return ''; } } })
const defaultOrder = ref({ prop: 'invoiceDate', order: 'ascending' });
const defaultOrders = ref({ prop: 'goodsLineNo', order: 'ascending' });
const pager = ref(utils.getPager(defaultOrder.value));
const pagers = ref(utils.getPager(defaultOrders.value));
const butDisabled = ref(false);//按钮是否可用
const loading = ref(false);//加载状态
const showserch = ref(false);//查询弹窗
const saleid = ref('');//销售id
const ids = ref('');//发票id
const rowid = ref('');//行id
const sobItems = ref();//开票单位
const checkList = ref([])//单位选择
const connid = ref('')//发票id
const connids = ref('')//发票id
const printfile = ref(false);//打印弹窗
const pdfUrl = ref('')//pdf文件地址
const Iframe = ref()//ref
const height = ref('')//高度
const formref = ref()//ref
const sobItemss = ref();//开票单位
const rowids = ref('')//行id
const downurl = ref('')//发票下载地址
const customercode = ref('')//客户代码
const buyerName = ref('')//客户代码
const emaildata = ref('')//邮件发送地址
const emailBuyerName = ref('')//客户名称
const emailsellerName = ref('')//销售方名称
const emailInvoice = ref('')//发票号码
const emailDate = ref('')//开票日期
const emailTax = ref('')//价税合计
const sendemail = ref(false);//邮件发送弹窗
const emailtitle = ref('')//邮件标题
const emailtext = ref('')//邮件底部内容
const EmailData = ref({
    emailcode: '',//邮箱号码
})
const texnoshow = ref(false);//发票号码
const texnoData = ref({
    no: '',//发票号码
    invoiceDate: '',//开票日期
});
// 发票张数
const invoiceCount = ref(0);
// 价税合计
const invoiceTotalPrice = ref(0);
// 总税额
const invoiceTotalTax = ref(0);
//开票
const dialogTitle = ref('');
const dialogPage = shallowRef(null);
const dialogShow = ref(false);//是否显示窗口
const fullscreen = ref(false);//全屏
onMounted(() => {
    // 获取表格数据
    getsobItems();
    // 获取开票单位信息
    // 获取邮箱模板
    getEmailTemplate();
})
// 主表格列
const maincolumns = ref([
    { prop: 'serialNo', label: '开票流水号', align: 'center', width: '200', template: true },
    { prop: 'buyerName', label: '客户名称', align: 'center', width: '245' },
    { prop: 'sellerName', label: '销售方名称', align: 'center', width: '245' },
    { prop: 'buyerTaxNo', label: '税号', align: 'center', width: '250' },
    { prop: 'invoiceTotalPriceTax', label: '价税合计', align: 'right', width: '100' },
    { prop: 'invoiceTotalPrice', label: '无税金额', align: 'right', width: '100' },
    { prop: 'invoiceTotalTax', label: '税额', align: 'center', width: '110' },
    { prop: 'invoiceDate', label: '开票日期', align: 'center', width: '200' },
    { prop: 'invoiceNo', label: '发票号', align: 'center', width: '220' },
]);
//表单数据
const formData = ref({
    serino: '',//销售单据号
    invoiceno: '',//发票号
    customername: '',//客户名称
    invoiceDate: '',//单据日期
    status: '',//状态
});
// 主表数据
const tableData = ref([]);
// 获取表格数据
async function getTableData(isQuery) {
    loading.value = true;
    try {
        if (isQuery) {
            pager.value.number = 1;
        }
        // formData.value.size = pager.value.size
        // formData.value.number = pager.value.number
        // formData.value.order = pager.value.order
        formData.value.date1 = formData.value.invoiceDate[0]
        formData.value.date2 = formData.value.invoiceDate[1]
        formData.value.pageSize = 10
        formData.value.pageNo = 1
        formData.value.Invoicedepartmentid = sobItems.value
        // formData.value.type = '已开票'
        const res = await ajax.post('/invoice/SearchInvoice', qs.stringify(formData.value));
        if (res.data.total == 0) {
            butDisabled.value = true;
        } else {
            butDisabled.value = false;
        }
        if (res.data.rows.length > 0) {
            tableData.value = res.data.rows
            invoiceCount.value = res.data.total;
            saleid.value = res.data.rows[0].id;
            pager.value.total = res.data.total;
            // 发票总金额等于res.data.invoicemain.invoiceTotalPrice的总和
            // 发票总税额等于res.data.invoicemain.invoiceTotalTax的总和
            invoiceTotalPrice.value = 0;
            invoiceTotalTax.value = 0;
            for (let i = 0; i < res.data.rows.length; i++) {
                invoiceTotalPrice.value = Number((invoiceTotalPrice.value + Number(res.data.rows[i].invoiceTotalPriceTax)).toFixed(2))
                invoiceTotalTax.value = Number((invoiceTotalTax.value + Number(res.data.rows[i].invoiceTotalTax)).toFixed(2))
            }
        } else {
            tableData.value = res.data.rows
            invoiceCount.value = res.data.total;
            saleid.value = '0';
            pager.value.total = res.data.total;
            // 发票总金额等于res.data.invoicemain.invoiceTotalPrice的总和
            // 发票总税额等于res.data.invoicemain.invoiceTotalTax的总和
            invoiceTotalPrice.value = 0;
            invoiceTotalTax.value = 0;
            for (let i = 0; i < res.data.rows.length; i++) {
                invoiceTotalPrice.value = Number((invoiceTotalPrice.value + Number(res.data.rows[i].invoiceTotalPriceTax)).toFixed(2))
                invoiceTotalTax.value = Number((invoiceTotalTax.value + Number(res.data.rows[i].invoiceTotalTax)).toFixed(2))
            }
        }
    } catch (error) {
        butDisabled.value = false;
        loading.value = false;
        // 这里可以添加你的错误处理逻辑
    } finally {
        loading.value = false;
    }
}
// 下载电子版
const Download = (url) => {
    window.open(url)
}
// 打开邮箱页面
const Emailout = (url, email, code, id, rowid, row) => {
    downurl.value = url//发票下载地址
    emaildata.value = email//邮件发送地址
    EmailData.value.emailcode = email//邮箱号码
    customercode.value = code//客户代码
    buyerName.value = row.buyerName//客户代码
    connid.value = id//发票id
    rowids.value = rowid//行id
    emailBuyerName.value = row.buyerName//客户名称
    emailsellerName.value = row.sellerName//销售方名称
    emailInvoice.value = row.invoiceNo//发票号码
    emailDate.value = row.invoiceDate//开票日期
    emailTax.value = row.invoiceTotalPriceTax//价税合计
    sendemail.value = true;//邮件发送弹窗
}
// 发送邮箱
const SendEmail = (email, code, id, rowids) => {
    // 邮箱正则
    if (!utils.isEmail(email)) {
        utils.msg('邮箱格式不正确', 'error', false);
        return;
    }
    if (EmailData.value.emailcode == '') {
        utils.msg('邮箱号码不能为空', 'error', false);
        return;
    }
    ajax.post('/Invoice/Send?srcorgid=' + sobInfo.value.id, qs.stringify({
        receiver: code,
        sendType: 4,
        email: email,
        connid: id,
        id: rowids,
        ists: 1,//是否推送公司邮箱
        title: emailsellerName.value + emailtitle.value,
        contents: '尊敬的客户：<br>给您开具的数电发票下载链接为：<a href=' + downurl.value + '>点击下载</a><br><br><br>购买方名称:' + emailBuyerName.value + '<br>发票号码: ' + emailInvoice.value + '<br>开具日期: ' + emailDate.value + '<br>价税合计: ￥' + emailTax.value + '<br><br><br><br><hr>' + emailtext.value,
    })).then((res) => {
        downurl.value = ''
        emaildata.value = ''
        customercode.value = ''
        const messageType = res.code == 0 ? 'success' : 'error';
        if (res.code == 0) {
            sendemail.value = false;
            getTableData(true);
            utils.notify('', res.msg, messageType);
        } else {
            utils.notify('', res.msg, messageType);
        }
    }).catch((err) => {
    });
}
function closeDialog() {
    sendemail.value = false;
    texnoshow.value = false;
    EmailData.value.emailcode = '';
    texnoData.value.no = '';
    texnoData.value.invoiceDate = '';
}
// 红冲删除
const DeleteAll = (id, billcode) => {
    utils.confirm('确定要删除吗？', () => {
        ajax.post('/Invoice/DeleteAll', qs.stringify({ id: id, type: billcode })).then((res) => {
            const messageType = res.success ? 'success' : 'error';
            utils.msg(res.msg, messageType, false);
            if (res.success) {
                index_refreshtab();
            }
        }).catch((err) => {
        });
    });
}


const openview = (id) => {
    saleid.value = id;
    pagers.value.number = 1;
    dialogPage.value = Task;
    dialogTitle.value = '明细查看';
    dialogShow.value = true;
}
// 获取邮箱模板
const getEmailTemplate = () => {
    ajax.post('Invoice/GetEmailModal?srcorgid=' + sobInfo.value.id).then((res) => {
        emailtitle.value = res.data.emailmodal.emailtitle
        emailtext.value = res.data.emailmodal.emailtext
    }).catch((err) => {
    });
}
// 查询
const Searchform = () => {
    showserch.value = true;
}
// 刷新
const reset = () => {
    debounce(() => {
        invoiceTotalTax.value = 0;
        invoiceTotalPrice.value = 0;
        formData.value = {
            serino: '',//销售单据号
            customername: '',//客户名称
            invoiceDate: '',//单据日期
            status: '开票完成',//状态
        }
        getTableData(true);
    }, 300)();
}
// 打开
const reback = (row) => {
    rowid.value = row.id;
    texnoData.value.no = row.invoiceNo;
    texnoData.value.invoiceDate = row.invoiceDate;
    ids.value = row.salebillid;
    connids.value = row.connid;
    texnoshow.value = true;
};
// 保存
const Save = async () => {
    try {
        const res1 = ajax.post('/SaleInvoice/UpdateInvoiceNo', qs.stringify({ id: ids.value, invoiceno: texnoData.value.no, connid: connids.value, invoiceDate: texnoData.value.invoiceDate }));
        const res2 = ajax.post('/Invoice/UpdateInvoiceNo', qs.stringify({ id: rowid.value, invoiceno: texnoData.value.no, invoiceDate: texnoData.value.invoiceDate }));
        const results = await Promise.all([res1, res2]);

        if (results[0].success && results[1].success) {
            utils.msg(results[0].msg, 'success', false);
            utils.msg(results[1].msg, 'success', false);
            getTableData(false);
            closeDialog();
        }
    } catch (error) {
        utils.msg(error.message, 'error', false);
    }
};
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
// 获取开票单位信息
// 开票单位
const getsobItems = async () => {
    try {
        const res = await ajax.post('user/GetUserInvoiceDepartByUser', qs.stringify({ userid: index_userinfo.value.userId }));
        if (res.success) {
            checkList.value = res.data;
            sobItems.value = res.data[0].id;
            // getTableData(false);
        }
    } catch (error) {
        // 这里可以添加你的错误处理逻辑
    }
}
// 监听切换单位时调用
const changeSobItems = (val) => {
    sobItems.value = val;
    getTableData(false);
}
// 查询
const search = () => {
    invoiceTotalTax.value = 0;
    invoiceTotalPrice.value = 0;
    pager.value.number = 1;
    getTableData(true);
    showserch.value = false;
}
//每页条数改变
const handleSizeChange = (size) => {
    pager.value.size = size;
    getTableData(false);
};
//页码改变
const handleCurrentChange = (number) => {
    invoiceTotalTax.value = 0;
    invoiceTotalPrice.value = 0;
    pager.value.number = number;
    getTableData(false);
};
// 表头单元格样式
function headerCellStyle({ row, column, rowIndex, columnIndex }) {
    return {
        color: '#000',
        textAlign: 'center',
    }
}
// 打印
const print = (url) => {
    utils.notify('请注意打印机打印状态', '开始打印', 'success');
    ajax.post('/Print/PrintPDF').then((res) => {
    }).catch((err) => {
    });
    // pdfUrl.value = url;
    // printfile.value = true;
    // window.print();
}
//排序
const sortChange = (order) => {
    pager.value.order = utils.getOrder(order);
    getTableData(false);
};

//导出表格
function exportfiles() {
    formData.value.date1 = formData.value.invoiceDate[0]
    formData.value.date2 = formData.value.invoiceDate[1]
    nextTick(() => {
        exportfileexcel()
    })
}
function exportfileexcel() {
    debounce(() => {
        formref.value.action = config.SERVER_PRO_APIADDRESS + '/Report/ExportInvoiceMain?' + qs.stringify({ whereJSON: JSON.stringify(formData.value) });
        formref.value.submit();
    }, 300)();
}



</script>

<style scoped>
@import './css/task.css';
@import './css/tasklist.css';
@import '../../roadui-assets/before.css';
@import '../../roadui-assets/a.css';

#Iframe {
    border-width: 1px;
}
</style>