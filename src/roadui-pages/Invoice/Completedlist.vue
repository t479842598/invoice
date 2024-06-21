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
                    <el-button type="danger" @click="downLoad()" icon="Download">批量下载PDF</el-button>
                    <el-button type="primary" @click="downLoadOFD()" icon="Download">批量下载OFD</el-button>
                    <el-button type="primary" :disabled="!isShow" @click="viewfile()">批量打印</el-button>
                </el-form-item>
                <el-form-item label="发票类型">
                    <el-select v-model="formData.invoicetype" @change="chengesob" placeholder="请选择发票类型"
                        style="width: 200px;">
                        <el-option v-for="item in ticketList" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="">
                    <el-select v-model="formData.redtype" @change="changeRedtype" placeholder="请选择红冲类型"
                        style="width: 200px;">
                        <el-option v-for="item in redtypeList" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select>
                </el-form-item> -->
            </el-form>
        </div>
        <!-- <div>
            <h3 class="before">待开发票</h3>
        </div> -->
        <div class="table-container">
            <el-table :data="tableData" v-loading="loading" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" max-height="550" style="width:100%; color: #000;"
                :header-cell-style="headerCellStyle" @selection-change="handleSelectionChange" @sort-change="sortChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column v-for="(column, index) in maincolumns" :key="index" :prop="column.prop"
                    :label="column.label" :align="column.align" fit show-overflow-tooltip :width="column.width">
                    <template v-if="column.template" #default="scope">
                        <div style="display: flex; align-items: center">
                            <a @click="openview(scope.row)" style="margin-left: 10px">{{ scope.row.invoiceNo }}</a>
                        </div>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="istatus" label="开票状态" align="center" width="180">
                    <template #default="scope">
                        <el-tag effect="light" :type="getTagType(scope.row.istatus)">{{
                            scope.row.istatus }}</el-tag>
                    </template>
                </el-table-column> -->
                <el-table-column label="操作" align="center" width="220" fixed="right">
                    <template #default="scope">
                        <!-- <el-button type="primary" size="small" v-if="scope.row.istatus == '开票完成'"
                            @click="print(scope.row.eInvoiceUrl)">打印</el-button> -->
                        <!-- <el-button type="primary" size="small" @click="viewfile(scope.row)">查看</el-button> -->
                        <el-button type="primary" size="small" @click="Downloads(scope.row)">下载</el-button>
                        <el-button type="success" size="small" @click="Emailout(scope.row.eInvoiceUrl, scope.row.buyerEmail, scope.row.customername,
                            scope.row.connid, scope.row.id, scope.row)">推送邮箱</el-button>
                        <el-button type="warning" size="small" @click="reback(scope.row)">更新</el-button>
                        <!-- <el-button type="danger" size="small" v-if="scope.row.istatus == '开票完成'"
                            @click="Reddel(scope.row.id, scope.row.billcode)">红冲</el-button>
                        <el-button type="danger" size="small" v-if="scope.row.istatus == '开票完成'"
                            @click="DeleteAll(scope.row.id, scope.row.billcode)" plain>删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="table-text">
            <table border="0" class="table" style="width: 100%;">
                <tr>
                    <td style="width: 25%;" align="center">
                        发票张数：{{ invoiceCount }}张
                    </td>
                    <td style="width: 25%;" align="center">
                        价税合计：{{ invoiceTotalPriceTax }}元
                    </td>
                    <td style="width: 25%;" align="center">
                        无税金额合计：{{ invoiceTotalPrice }}元
                    </td>
                    <td style="width: 25%;" align="left">
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
                <el-form-item label="类型">
                    <!-- <el-input v-model="formData.serino"></el-input> -->
                    <el-select v-model="formData.fptype" @change="" placeholder="" style="width: 200px;">
                        <el-option v-for="item in fptypeList" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="发票号">
                    <el-input v-model="formData.invoiceno"></el-input>
                </el-form-item>
                <el-form-item label="客户名称">
                    <el-input v-model="formData.customername"></el-input>
                </el-form-item>
                <el-form-item label="开票日期">
                    <el-date-picker v-model="formData.invoiceDate" type="daterange" value-format="YYYY-MM-DD" clearable />
                </el-form-item>
                <el-form-item style="margin-left: 30px;">
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button type="success" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 邮件发送 -->
        <el-dialog v-model="sendemail" title="推送客户邮箱" align-center destroy-on-close width="500px">
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

        <!-- 更新发票号 -->
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
            align-center destroy-on-close width="1200px" @close="fullscreen = false" draggable
            :close-on-click-modal="false">
            <div style="padding: 0 10px;">
                <viewPage v-model:id="saleid" v-model:type="typeName"></viewPage>
            </div>
            <!-- <el-icon @click="fullscreen = !fullscreen"
                style="position: absolute;right: 45px;top: 24px;cursor: pointer;font-size: 14px;">
                <FullScreen />
            </el-icon> -->
        </el-dialog>

        <!-- 红冲页面 -->
        <el-dialog v-model="RedShow" :fullscreen="fullscreens" style="position: relative;" :title="RedTitle" align-center
            destroy-on-close width="1400px" @close="fullscreens = false" draggable :close-on-click-modal="false">
            <RedInvoice v-model:blueid="blueid" v-model:id="id"></RedInvoice>
            <el-icon @click="fullscreens = !fullscreens"
                style="position: absolute;right: 45px;top: 24px;cursor: pointer;font-size: 14px;">
                <FullScreen />
            </el-icon>
        </el-dialog>

        <!-- 下载页面 -->
        <el-dialog v-model="Downlodfile" style="position: relative;" :title="DownlodTitle" align-center destroy-on-close
            width="600px" :close-on-click-modal="false">
            <div style="width: 100%;padding: 20px 0 30px 0;display: flex;justify-content:space-around;">
                <el-button size="large" type="primary" @click="openOFD()" round>OFD下载</el-button>
                <el-button size="large" type="danger" @click="openPDF()" round>PDF下载</el-button>
                <el-button size="large" type="success" @click="openXML()" round>XML下载</el-button>
            </div>
        </el-dialog>

        <el-dialog v-model="viewfileshow" style="position: relative;" title="点击图片可放大预览" align-center destroy-on-close
            width="1000px" :close-on-click-modal="false">
            <PrintImg v-model:ids="selectListid"></PrintImg>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, inject, nextTick, onMounted, provide, ref, shallowRef, watch } from 'vue'
import axios from 'axios';
// import * as pdfjs from 'pdfjs-dist'
// import * as pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker
import { debounce } from 'lodash';
import Base64 from '../../roadui-assets/base64'
// const Task = defineAsyncComponent(() => import('./components/completeView.vue'))
const viewPage = defineAsyncComponent(() => import('./components/viewPage.vue'))
const RedInvoice = defineAsyncComponent(() => import('./components/redInvoice.vue'))
const PrintImg = defineAsyncComponent(() => import('./components/imgPrint.vue'))
// const PrintImg = () => import('./components/imgPrint.vue')
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
const qs = inject('qs');
const app = inject('app');
const formHeight = ref('600px');//表单高度
const viewurl = ref('');//查看url
const viewfileshow = ref(false);//查看弹窗
const typeName = ref('普通发票');
// 图片
const imgshow = ref([
    // { name: 'loong.png' },
    { name: '菏泽市牡丹区妇幼保健院24372000000046315109_00.png' },
    { name: '巨野县妇幼保健计划生育服务中心24372000000033311392_00.png' },
    { name: '泰安市中心血站24372000000046279205_00.png' }
])
// 选中行
const successCount = ref<number>(0);//开票成功数量
const percentage = ref<number>(0);//进度条百分比
const errorcount = ref<number>(0);//开票失败数量
const index_openmenu = inject('index_openmenu');//首页打开菜单
const index_removetab = inject('index_removetab');//首页关闭标签方法
const index_refreshtab = inject('index_refreshtab');//首页刷新标签方式
const index_userinfo = inject('index_userinfo');//首页用户信息
const submit_dialogshow = inject('submit_dialogshow');
const props = defineProps({ query: { type: String, default: () => { return ''; } } })
const defaultOrder = ref({ prop: 'invoiceDate', order: 'descending' });
const defaultOrders = ref({ prop: 'goodsLineNo', order: 'ascending' });
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const pager = ref(utils.getPagerMore(defaultOrder.value));
const pagers = ref(utils.getPager(defaultOrders.value));
const butDisabled = ref(false);//按钮是否可用
const loading = ref(false);//加载状态
const showserch = ref(false);//查询弹窗
const saleid = ref('');//销售id
const blueid = ref('');//红冲id
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
const sellerName = ref('')//开票单位名称
const sellerTaxNo = ref('');//开票单位税号
const finishprogress = ref(false);//完成进度
const selectList = ref([]);//多选
const selectListid = ref('');//多选id
const Downlodfile = ref(false);//下载弹窗
const DownlodTitle = ref('下载文件');
const id = ref('');
const EmailData = ref({
    emailcode: '',//邮箱号码
})

const texnoshow = ref(false);//发票号码
const texnoData = ref({
    no: '',//发票号码
    invoiceDate: '',//开票日期
});
const fptypeList = ref([
    { id: '', label: '全部' },
    { id: '蓝字发票', label: '蓝字发票' },
    { id: '红字发票', label: '红字发票' },
])
const urls = ref([])//pdf文件地址
// 监听进度
// 监听开票成功数量，计算进度条百分比，当百分比为100时，延迟800ms关闭进度条弹窗
watch(successCount, (val) => {
    percentage.value = Math.floor((successCount.value + errorcount.value) / 1 * 100);
    if (successCount.value > 0) {
    }
    if (percentage.value === 100) {
        // 延迟800ms
        setTimeout(() => {
            finishprogress.value = false;
        }, 800);
    }
})
// 发票张数
const invoiceCount = ref(0);
// 价税合计
const invoiceTotalPriceTax = ref(0);
// 价税合计
const invoiceTotalPrice = ref(0);
// 总税额
const invoiceTotalTax = ref(0);
//开票
const dialogTitle = ref('');
const RedTitle = ref('');
const dialogPage = shallowRef(null);
const dialogShow = ref(false);//是否显示窗口
const RedShow = ref(false);//是否显示窗口
const fullscreen = ref(false);//全屏
const fullscreens = ref(false);//全屏
const filename = ref('');//文件名
const Ofdfileid = ref('');//Ofd文件id
const Ofdfilename = ref('');//Ofd文件名
const fileid = ref('');//客户名称
const OfdUrl = ref('');//Ofd文件地址
const XmlUrl = ref('');//Xml文件地址
const isShow = ref(false);

// 查看电子版
const viewfile = () => {
    if (selectListid.value.length == 0) {
        utils.msg('请选择要打印的发票', 'warning', false)
        return;
    }
    ajax.post('Invoice/GetImageList', qs.stringify({ ids: selectListid.value })).then((res) => {
        if (res.success) {
            imgshow.value = res.data.imagelist
            // setTimeout(() => {
            viewfileshow.value = true;
            // }, 500);
        } else {
            utils.msg(res.msg, 'warning', false)
        }
    }).catch((err) => {
    });
}
// 下载电子版
const Downloads = (row) => {
    DownlodTitle.value = '下载文件';
    if (row.fileid == null || row.fileid == '' || row.Ofdfileid == '' || row.Ofdfileid == null) {
        if (row.type == '蓝字发票') {
            ajax.post('/Invoice/SearchInvoice?srcorgid=' + sobInfo.value.id, qs.stringify({ id: row.id, invoicedepartname: row.sellerName, taxno: row.sellerTaxNo })).then((res) => {
                if (res.success) {
                    filename.value = res.data.filename;
                    fileid.value = res.data.fileid;
                    Ofdfileid.value = res.data.Ofdfileid;
                    Ofdfilename.value = res.data.Ofdfilename;
                    XmlUrl.value = res.data.XmlUrl;
                    Downlodfile.value = true;
                    getTableData(false);
                } else {
                    utils.msg(res.msg, 'warning', false);
                }
            }).catch((err) => {
            });
        } else {
            ajax.post('/Invoice/SearchRedInvoice?srcorgid=' + sobInfo.value.id, qs.stringify({ id: row.id, blueid: row.blueid, taxno: row.sellerTaxNo })).then((res) => {
                const messageType = res.success ? 'success' : 'error';
                utils.msg(res.msg, messageType, false);
                if (res.success) {
                    filename.value = res.data.filename;
                    fileid.value = res.data.fileid;
                    Ofdfileid.value = res.data.Ofdfileid;
                    Ofdfilename.value = res.data.Ofdfilename;
                    XmlUrl.value = res.data.XmlUrl;
                    Downlodfile.value = true;
                    getTableData(false);
                } else {
                    utils.msg(res.msg, 'warning', false);
                }
            }).catch(() => { });
        }
    } else {
        filename.value = row.filename;
        fileid.value = row.fileid;
        Ofdfileid.value = row.Ofdfileid;
        Ofdfilename.value = row.Ofdfilename;
        OfdUrl.value = row.OfdUrl;
        XmlUrl.value = row.XmlUrl;
        Downlodfile.value = true;
    }
}
// 打开
const reback = (row) => {
    // finishprogress.value = true;
    rowid.value = row.id;
    texnoData.value.no = row.invoiceNo;
    texnoData.value.invoiceDate = row.invoiceDate;
    ids.value = row.id;
    connids.value = row.connid;
    sellerName.value = row.sellerName;
    sellerTaxNo.value = row.sellerTaxNo;
    // texnoshow.value = true;
    if (row.type == '蓝字发票') {
        Save(ids.value, sellerName.value, sellerTaxNo.value);
    } else {
        addredInvoice(row.id, row.blueid, row.sellerTaxNo)
    }
};
// 保存
const Save = (id, name, taxno) => {
    ajax.post('/Invoice/SearchInvoice?srcorgid=' + sobInfo.value.id, qs.stringify({ id: id, invoicedepartname: name, taxno: taxno })).then((res) => {
        if (res.success) {
            utils.msg(res.msg, 'success', false);
            getTableData(false);
            // index_refreshtab()
        } else {
            utils.msg(res.msg, 'warning', false);
        }
    }).catch((err) => {
    });
};
// 开具
function addredInvoice(id, blueid, taxno) {
    ajax.post('/Invoice/SearchRedInvoice?srcorgid=' + sobInfo.value.id, qs.stringify({ id: id, blueid: blueid, taxno: taxno })).then((res) => {
        const messageType = res.success ? 'success' : 'error';
        utils.msg(res.msg, messageType, false);
        if (res.success) {
            getTableData(false);
            RedShow.value = false;
        }
    }).catch(() => { });
}
// 打开PDF
function openPDF() {
    // console.log(filename.value)
    utils.NewshowFile(index_openmenu, { name: filename.value, id: fileid.value }, config.SERVER_WEBADDRESS, false);
}
// 打开OFD
function openOFD() {
    // 创建一个新的隐藏的可点击的a标签
    // let link = document.createElement('a');
    // link.style.display = 'none';
    // link.href = OfdUrl.value;
    // // 设置下载的文件名
    // // link.download = filename.value + '.ofd';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    utils.NewshowFile(index_openmenu, { name: Ofdfilename.value, id: Ofdfileid.value }, config.SERVER_WEBADDRESS, false);
}
// 打开XML
function openXML() {
    // 创建一个新的隐藏的可点击的a标签
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = XmlUrl.value;
    // 设置下载的文件名
    // link.download = filename.value + '.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
onMounted(() => {
    // 获取表格数据
    getTableData(false);
    // 获取开票单位信息
    getsobItems();
    // 获取邮箱模板
    getEmailTemplate();
})
// 主表格列
const maincolumns = ref([
    { prop: 'type', label: '类型', align: 'center', width: '120' },
    { prop: 'invoicetype', label: '发票类型', align: 'center', width: '120' },
    // { prop: 'serialNo', label: '开票流水号', align: 'center', width: '200', template: true },
    // { prop: 'billcode', label: '单据号', align: 'center', width: '200' },
    { prop: 'buyerName', label: '客户名称', align: 'center', width: '245' },
    // { prop: 'sellerName', label: '销售方名称', align: 'center', width: '245' },
    { prop: 'buyerTaxNo', label: '税号', align: 'center', width: '250' },
    { prop: 'invoiceNo', label: '发票号', align: 'center', width: '220', template: true },
    { prop: 'invoiceDate', label: '开票日期', align: 'center', width: '200' },
    { prop: 'invoiceTotalPriceTax', label: '价税合计', align: 'right', width: '100' },
    { prop: 'invoiceTotalPrice', label: '无税金额', align: 'right', width: '100' },
    { prop: 'invoiceTotalTax', label: '税额', align: 'center', width: '110' },
]);
//表单数据
const formData = ref({
    serino: '',//销售单据号
    invoiceno: '',//发票号
    customername: '',//客户名称
    invoiceDate: '',//单据日期
    status: '开票完成',//状态
    invoicetype: '',//发票类型
    // redtype: '',//红冲类型
});
// const invoicetype = ref();//账套选择
const ticketList = ref([
    { id: '', label: '全部发票类型' },
    { id: '01', label: '全电专用发票' },
    { id: '02', label: '全电普通发票' },
])
const redtypeList = ref([
    { id: '', label: '是否可红冲' },
    { id: '可红冲', label: '可红冲' },
    { id: '不可红冲', label: '不可红冲' },
])
function chengesob() {
    getTableData(true);
}
// 主表数据
const tableData = ref([]);
// 获取表格数据
async function getTableData(isQuery) {
    loading.value = true;
    try {
        if (isQuery) {
            pager.value.number = 1;
        }
        formData.value.size = pager.value.size
        formData.value.number = pager.value.number
        formData.value.order = pager.value.order
        if (formData.value.invoiceDate == null) {
            formData.value.date1 = ''
            formData.value.date2 = ''
        } else {
            formData.value.date1 = formData.value.invoiceDate[0]
            formData.value.date2 = formData.value.invoiceDate[1]
        }
        formData.value.type = '已开票'
        const res = await ajax.post('/Invoice/GetAllInvoiceMain?srcorgid=' + sobInfo.value.id, qs.stringify(formData.value));
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
            invoiceTotalPriceTax.value = 0;
            invoiceTotalPrice.value = 0;
            invoiceTotalTax.value = 0;
            for (let i = 0; i < res.data.rows.length; i++) {
                invoiceTotalPriceTax.value = Number((invoiceTotalPriceTax.value + Number(res.data.rows[i].invoiceTotalPriceTax)).toFixed(2))
                invoiceTotalPrice.value = Number((invoiceTotalPrice.value + Number(res.data.rows[i].invoiceTotalPrice)).toFixed(2))
                invoiceTotalTax.value = Number((invoiceTotalTax.value + Number(res.data.rows[i].invoiceTotalTax)).toFixed(2))
            }
        } else {
            tableData.value = res.data.rows
            invoiceCount.value = res.data.total;
            saleid.value = '0';
            pager.value.total = res.data.total;
            // 发票总金额等于res.data.invoicemain.invoiceTotalPrice的总和
            // 发票总税额等于res.data.invoicemain.invoiceTotalTax的总和
            invoiceTotalPriceTax.value = 0;
            invoiceTotalTax.value = 0;
            for (let i = 0; i < res.data.rows.length; i++) {
                invoiceTotalPriceTax.value = Number((invoiceTotalPriceTax.value + Number(res.data.rows[i].invoiceTotalPriceTax)).toFixed(2))
                invoiceTotalPrice.value = Number((invoiceTotalPrice.value + Number(res.data.rows[i].invoiceTotalPrice)).toFixed(2))
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



// 打开邮箱页面
const Emailout = (url, email, code, id, rowid, row) => {
    downurl.value = url//发票下载地址
    emaildata.value = email//邮件发送地址
    EmailData.value.emailcode = email//邮箱号码
    customercode.value = code//客户代码
    connid.value = id//发票id
    rowids.value = rowid//行id
    buyerName.value = row.buyerName//客户代码
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
        contents: '尊敬的客户：<br>给您开具的数电发票下载链接为：<a href=' + downurl.value + '>点击下载</a><br><br><br><br>购买方名称:' + emailBuyerName.value + '<br>发票号码: ' + emailInvoice.value + '<br>开具日期: ' + emailDate.value + '<br>价税合计: ￥' + emailTax.value + '<br><br><br><br><hr>' + emailtext.value,
    })).then((res) => {
        downurl.value = ''
        emaildata.value = ''
        // customercode.value = ''
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
// 红冲
const Reddel = (id1, billcode) => {
    blueid.value = id1;
    id.value = ''
    RedTitle.value = '红冲';
    RedShow.value = true;
    // utils.confirm('确定要删除吗？', () => {
    //     ajax.post('/Invoice/DeleteAll', qs.stringify({ id: id, type: billcode })).then((res) => {
    //         const messageType = res.success ? 'success' : 'error';
    //         utils.msg(res.msg, messageType, false);
    //         if (res.success) {
    //             index_refreshtab();
    //         }
    //     }).catch((err) => {
    //     });
    // });
}
// 红冲
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
function changeRedtype(val) {
    getTableData(true);
}

const openview = (row) => {
    saleid.value = row.id;
    if (row.invoicetype == '全电普通发票') {
        typeName.value = '普通发票';
    } else {
        typeName.value = '专用发票';
    }
    pagers.value.number = 1;
    // dialogPage.value = Task;
    dialogTitle.value = '发票详情';
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
        invoiceTotalPriceTax.value = 0;
        invoiceTotalPrice.value = 0;
        formData.value = {
            serino: '',//销售单据号
            customername: '',//客户名称
            invoiceDate: '',//单据日期
            status: '开票完成',//状态
            // redtype: '可红冲',//红冲类型
        }
        getTableData(true);
    }, 300)();
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
// 查询
const search = () => {
    invoiceTotalTax.value = 0;
    invoiceTotalPriceTax.value = 0;
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
    invoiceTotalPriceTax.value = 0;
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
//排序
const sortChange = (order) => {
    pager.value.order = utils.getOrder(order);
    getTableData(false);
};
// 批量下载
function downLoad() {
    if (selectList.value.length == 0) {
        utils.msg('请选择要下载的附件', 'warning', false);
        return;
    }
    const arrid = ref<any>([]);
    const arrname = ref<any>([]);
    const arridlist = ref<any>();
    for (let i = 0; i < selectList.value.length; i++) {
        arrid.value.push(selectList.value[i].fileid);
        arrname.value.push(selectList.value[i].buyerName);
    }
    arridlist.value = arrid.value.join(',');
    var name = arrname.value[0] + JSON.stringify(arrname.value.length) + '-'
    //获取当前时分秒格式202403121150
    var now = ref<any>([]);
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    // 月份小于10前面加0
    if (month < 10) {
        month = '0' + month;
    }
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    now.value = year + '' + month + '' + day + '' + hour + '' + minute + '' + second;
    axios.post("/File/ShowAll", qs.stringify({ fileids: arridlist.value, buyernames: name }), { responseType: 'blob', }, { headers: { "content-type": "multipart/from-data", } }).then((res) => {
        const link = document.createElement('a');
        try {
            //如果文件类型不确定的时候，可以不设置type
            let blob = new Blob([res], { type: 'application/zip' });

            // let _fileName = res.headers['content-disposition'].split(';')[1].split('=')[1];//文件名，中文无法解析的时候会显示 _(下划线),生产环境获取不到
            let fileName = name + now.value;//文件名，中文无法解析的时候会显示 _(下划线),生产环境获取不到
            link.style.display = 'none';
            // 兼容不同浏览器的URL对象
            const url = window.URL || window.webkitURL;

            link.href = url.createObjectURL(blob);
            link.setAttribute('download', fileName);
            link.setAttribute('download', fileName.substring(fileName.lastIndexOf('_') + 1));
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            url.revokeObjectURL(link.href);//销毁url对象
        } catch (e) {
        }
    }).catch((err: any) => {
    });
}
function downLoadOFD() {
    if (selectList.value.length == 0) {
        utils.msg('请选择要下载的附件', 'warning', false);
        return;
    }
    const OFDid = ref<any>([]);
    const OFDname = ref<any>([]);
    const arridlist = ref<any>();
    for (let i = 0; i < selectList.value.length; i++) {
        OFDid.value.push(selectList.value[i].Ofdfileid);
        OFDname.value.push(selectList.value[i].Ofdfilename);
    }
    arridlist.value = OFDid.value.join(',');
    var name = OFDname.value[0].replace('.ofd', '') + JSON.stringify(OFDname.value.length) + '-'
    //获取当前时分秒格式202403121150
    var now = ref<any>([]);
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    // 月份小于10前面加0
    if (month < 10) {
        month = '0' + month;
    }
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    now.value = year + '' + month + '' + day + '' + hour + '' + minute + '' + second;
    axios.post("/File/ShowAll", qs.stringify({ fileids: arridlist.value, buyernames: name }), { responseType: 'blob', }, { headers: { "content-type": "multipart/from-data", } }).then((res) => {
        const link = document.createElement('a');
        try {
            //如果文件类型不确定的时候，可以不设置type
            let blob = new Blob([res], { type: 'application/zip' });

            // let _fileName = res.headers['content-disposition'].split(';')[1].split('=')[1];//文件名，中文无法解析的时候会显示 _(下划线),生产环境获取不到
            let fileName = name + now.value;//文件名，中文无法解析的时候会显示 _(下划线),生产环境获取不到
            link.style.display = 'none';
            // 兼容不同浏览器的URL对象
            const url = window.URL || window.webkitURL;

            link.href = url.createObjectURL(blob);
            link.setAttribute('download', fileName);
            link.setAttribute('download', fileName.substring(fileName.lastIndexOf('_') + 1));
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            url.revokeObjectURL(link.href);//销毁url对象
        } catch (e) {
        }
    }).catch((err: any) => {
    });
}

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
        formref.value.action = config.SERVER_PRO_APIADDRESS + '/Report/ExportInvoice?' + qs.stringify({ whereJSON: JSON.stringify(formData.value) });
        // formref.value.action = config.SERVER_DEV_APIADDRESS + '/Report/ExportInvoice?' + qs.stringify({ whereJSON: JSON.stringify(formData.value) });
        formref.value.submit();
    }, 300)();
}
// 多选
const handleSelectionChange = (val) => {
    if (val.length > 0) {
        isShow.value = true
    } else {
        isShow.value = false
    }
    selectList.value = val;
    // 新增以下代码
    selectListid.value = selectList.value.map(item => item.id).join(', ');
};

provide('RedShow', RedShow);
provide('viewfileshow', viewfileshow);
provide('getTableData', getTableData);
provide('imgshow', imgshow);
provide('selectListid', selectListid);

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