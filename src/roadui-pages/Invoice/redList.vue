<template>
    <div>
        <!-- 红字发票列表-->
        <div class="form-container">
            <el-form :inline="true" :model="formData">
                <el-form-item label="单位名称">
                    <el-input v-model="formData.name" style="width: 230px;" clearable></el-input>
                </el-form-item>
                <el-form-item label="纳税人识别号">
                    <el-input v-model="formData.taxno" style="width: 230px;" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadTableData(true)" icon="Search">查询</el-button>
                    <!-- <el-button type="success" @click="addNew" icon="Plus">新增</el-button> -->
                </el-form-item>
            </el-form>
        </div>
        <div class="table-container">
            <el-table :data="tableData" v-loding="loading" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" style="width: 100%; color: #000 "
                :header-cell-style="headerCellStyle" v-bind="$attrs" @current-change="tableCurrentChange">
                >
                <el-table-column prop="blueid" v-if="false" width="1" />
                <el-table-column v-for="(item, index) in tableColumns" fit show-overflow-tooltip min-width="200%"
                    :key="index" :prop="item.prop" :label="item.label" align="center" :width="item.width">
                    <template v-if="item.template" #default="scope">
                        <div style="display: flex; align-items: center">
                            <a @click="openview(scope.row.id)" style="margin-left: 10px">{{ scope.row.redConfirmSerialNo
                            }}</a>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" align="center" width="100">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="onDetail(scope.row)">开具</el-button>
                        <!-- <el-button size="small" type="primary" @click="onEdit(scope.row)">修改</el-button>
                        <el-button size="small" type="danger" @click="Delete(scope.row)">删除</el-button>
                        <el-button type="primary" size="small" @click="Downloads(scope.row)">下载</el-button>
                        <el-button type="warning" size="small" @click="reback(scope.row)">更新</el-button>
                        <el-button type="success" size="small"
                            @click="Emailout(scope.row.eInvoiceUrl, scope.row.buyerEmail, scope.row.buyerTaxName, scope.row.connid, scope.row.id, scope.row)">推送邮箱</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="roadui_pagerdiv">
                <el-pagination v-model:currentPage="pager.number" v-model:page-size="pager.size" :page-sizes="pager.sizes"
                    :background="pager.background" :layout="pager.layout" :total="pager.total" :disabled="butDisabled"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
            <!-- 查看 -->
            <el-dialog v-model="dialogShow" :fullscreen="fullscreen" style="position: relative;" :title="dialogTitle"
                align-center destroy-on-close width="1200px" @close="fullscreen = false" draggable
                :close-on-click-modal="false">
                <RedInvoice v-model:id="saleid" v-model:readonly="readonly">
                </RedInvoice>
                <!-- <el-icon @click="fullscreen = !fullscreen"
                    style="position: absolute;right: 45px;top: 24px;cursor: pointer;font-size: 14px;">
                    <FullScreen />
                </el-icon> -->
            </el-dialog>
            <!--提交窗口-->
            <el-dialog v-model="RedShow" :title="dialogTitle" align-center destroy-on-close width="1400px" draggable
                :close-on-click-modal="false">
                <Add v-model:id="id" v-model:blueid="blueid"></Add>
            </el-dialog>
            <!-- 下载页面 -->
            <el-dialog v-model="Downlodfile" style="position: relative;" :title="DownlodTitle" align-center destroy-on-close
                width="600px" draggable :close-on-click-modal="false">
                <div style="width: 100%;padding: 20px 0 30px 0;display: flex;justify-content:space-around;">
                    <el-button size="large" type="primary" @click="openOFD()" round>OFD下载</el-button>
                    <el-button size="large" type="danger" @click="openPDF()" round>PDF下载</el-button>
                    <el-button size="large" type="success" @click="openXML()" round>XML下载</el-button>
                </div>
            </el-dialog>
            <!-- 邮件发送 -->
            <el-dialog v-model="sendemail" title="推送客户邮箱" align-center destroy-on-close width="500px">
                <el-form :model="EmailData" class="inline" label-width="100px">
                    <el-form-item label="邮箱号码">
                        <el-input v-model="EmailData.emailcode" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"
                            @click="SendEmail(EmailData.emailcode, customercode, connid, rowids)">发送</el-button>
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
        </div>
    </div>
</template>

<script setup>
import { ref, inject, onMounted, shallowRef, provide, reactive, nextTick, watch, computed, defineAsyncComponent } from 'vue'
import { View, Edit, Search, Plus, Refresh, Tools } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios';
const Add = defineAsyncComponent(() => import('./components/redInvoice.vue'))
// const RedInvoice = defineAsyncComponent(() => import('./components/redInvoice.vue'))
const RedInvoice = defineAsyncComponent(() => import('./components/viewRedPage.vue'))
const ajax = inject('ajax');

const utils = inject('utils');
const index_openmenu = inject('index_openmenu');//首页打开菜单
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const config = inject('config');
const qs = inject('qs');
const openmenu = inject('index_openmenu');//首页打开菜单
const removetab = inject('index_removetab');//首页关闭标签方法
const refreshtab = inject('index_refreshtab');//首页刷新标签方式
const butDisabled = ref(false);//按钮是否可用
const loading = ref(false);//加载状态
const customercode = ref('')//客户代码
const fullscreen = ref(false);//全屏
const connid = ref('')//发票id
const connids = ref('')//发票id
const formref = ref()//ref
const rowids = ref('')//行id
const emaildata = ref('')//邮件发送地址
const emailBuyerName = ref('')//客户名称
const emailsellerName = ref('')//销售方名称
const emailInvoice = ref('')//发票号码
const emailDate = ref('')//开票日期
const emailTax = ref('')//价税合计
const sendemail = ref(false);//邮件发送弹窗
const emailtitle = ref('')//邮件标题
const emailtext = ref('')//邮件底部内容
const downurl = ref('')//发票下载地址
const readonly = ref(true)//是否只读
const EmailData = ref({
    emailcode: '',//邮箱号码
})
const rowid = ref('');//行id
const ids = ref('');//发票id
const texnoshow = ref(false);//发票号码
const texnoData = ref({
    no: '',//发票号码
    invoiceDate: '',//开票日期
});
const sellerName = ref('')//开票单位名称
const sellerTaxNo = ref('');//开票单位税号
let selectRows = [];//保存选择的行
const defaultOrder = ref({ prop: '', order: 'ascending' });
const pager = ref(utils.getPager(defaultOrder.value));
const tableData = ref([]);//表格数据
const id = ref('');//id
const blueid = ref('');//蓝字发票id
onMounted(() => {
    loadTableData(false);
});
// 表格循环列
const tableColumns = [
    { prop: 'redConfirmSerialNo', label: '开票流水号', template: true },
    { prop: 'redConfirmNo', label: '红字确认单编号' },
    { prop: 'redInvoiceNo', label: '红字发票号' },
    { prop: 'confirmState', label: '确认单状态' },
    { prop: 'invoiceDate', label: '开具日期' },
    { prop: 'invoiceTotalPriceTax', label: '价税合计' },
    { prop: 'invoiceTotalPrice', label: '无税金额' },
    { prop: 'invoiceTotalTax', label: '税额' },
    { prop: 'sellerTaxName', label: '销售方名称' },
    { prop: 'sellerTaxNo', label: '销方税号' },
    { prop: 'buyerTaxName', label: '购方名称' },
    { prop: 'buyerTaxNo', label: '购方税号' },
    { prop: 'originalInvoiceNo', label: '蓝字发票号' },
    { prop: 'remarks', label: '备注' },
    { prop: 'msg', label: '错误提示' },
]
//表单数据
const formData = ref({
    // name: '',//单位名称
    // taxno: '',//纳税人识别号
});
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
    // formData.value['date1'] = utils.length(formDataDateRange.value) > 0 ? formDataDateRange.value[0] : '';
    // formData.value['date2'] = utils.length(formDataDateRange.value) > 1 ? formDataDateRange.value[1] : '';
    ajax.post('/Invoice/GetRedList?srcorgid=' + sobInfo.value.id, qs.stringify(formData.value)).then((res) => {
        tableData.value = res.data.rows;
        pager.value.total = res.data.total;
        butDisabled.value = false;
        loading.value = false;
    }).catch(() => { butDisabled.value = false; loading.value = false; });
};
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
    Save(row);
};
const saleid = ref('');//销售id
const openview = (id) => {
    saleid.value = id;
    pager.value.number = 1;
    dialogPage.value = RedInvoice;
    dialogTitle.value = '发票详情';
    dialogShow.value = true;
}
// 保存
const Save = (row) => {
    ajax.post('/Invoice/GetFormat', qs.stringify({ id: row.id })).then((res) => {
        if (res.success) {
            utils.msg(res.msg, 'success', false);
            getTableData(false);
            // closeDialog();
        } else {
            utils.msg(res.msg, 'warning', false);
        }
    }).catch((err) => {
    });
};
// 打开邮箱页面
const Emailout = (url, email, code, id, rowid, row) => {
    downurl.value = url//发票下载地址
    emaildata.value = email//邮件发送地址
    EmailData.value.emailcode = email//邮箱号码
    customercode.value = code//客户代码
    connid.value = id//发票id
    rowids.value = rowid//行id
    emailBuyerName.value = row.buyerTaxName//客户名称
    emailsellerName.value = row.sellerTaxName//销售方名称
    emailInvoice.value = row.redInvoiceNo//发票号码
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
//新增
const dialogTitle = ref('');
const dialogPage = shallowRef(null);
const Downlodfile = ref(false);//下载弹窗
const DownlodTitle = ref('下载文件');
const RedShow = ref(false);//是否显示窗口
const filename = ref('');//文件名
const fileid = ref('');//客户名称
const dialogShow = ref(false);//是否显示窗口
const OfdUrl = ref('');//Ofd文件地址
const XmlUrl = ref('');//Xml文件地址
// 下载电子版
const Downloads = (row) => {
    Downlodfile.value = true;
    DownlodTitle.value = '下载文件';
    filename.value = row.filename;
    fileid.value = row.fileid;
    OfdUrl.value = row.OfdUrl;
    XmlUrl.value = row.XmlUrl;
}
// 打开PDF
function openPDF() {
    utils.NewshowFile(index_openmenu, { name: filename.value, id: fileid.value }, config.SERVER_WEBADDRESS, false);
}
// 打开OFD
function openOFD() {
    // 创建一个新的隐藏的可点击的a标签
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = OfdUrl.value;
    // 设置下载的文件名
    // link.download = filename.value + '.ofd';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
function onDetail(row) {
    ajax.post('/Invoice/AddRedInvoice?srcorgid=' + sobInfo.value.id, qs.stringify({
        id: row.id, blueid: row.blueid
    })).then((res) => {
        utils.msg(res.msg, 'success', false)
        loadTableData(false);
    }).catch((err) => {
    });
}
//每页条数改变
const handleSizeChange = (size) => {
    pager.value.size = size;
    loadTableData(false);
};
//页码改变
const handleCurrentChange = (number) => {
    pager.value.number = number;
    loadTableData(false);
};
//排序
const sortChange = (order) => {
    pager.value.order = utils.getOrder(order);
    loadTableData(false);
};
// 表头单元格样式
function headerCellStyle({ row, column, rowIndex, columnIndex }) {
    return {
        color: '#000',
        textAlign: 'center',
    }
}
provide('RedShow', RedShow);
provide('getTableData', loadTableData);

provide('submit_dialogshow', RedShow);
// provide('refreshtab', refreshtab); //刷新标签
// provide('removetab', removetab); //关闭标签
// provide('openmenu', openmenu); //打开菜单

</script>

<style scoped>
@import './css/setting.css';
@import '../../roadui-assets/a.css';
</style>
