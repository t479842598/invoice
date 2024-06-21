<template>
    <div style="padding: 15px;">
        <el-form :model="formData" :rules="rules" ref="ruleFormRef" label-width="110px">
            <el-form-item style="margin-bottom: 10px;" label="发票类型:" prop="invoiceTypeCode">
                <el-radio-group v-show="!readonly" v-model="formData.invoiceTypeCode">
                    <el-radio v-for="item in ticketList" :label="item.id">{{ item.label }}</el-radio>
                </el-radio-group>
                <span v-show="readonly">{{ formData.invoiceTypeName }}</span>
            </el-form-item>
            <el-form-item style="margin-bottom: 20px" label="开票流水号:">
                <span>{{ formData.serialNo }}</span>
            </el-form-item>
            <el-divider content-position="left">购买方信息</el-divider>
            <el-form-item label="购方名称" prop="buyerName" class="elitem">
                <el-input v-show="!readonly" v-model="formData.buyerName"></el-input>
                <span v-show="readonly">
                    {{ formData.buyerName }}
                </span>
            </el-form-item>
            <el-form-item label="纳税人识别号" prop="buyerTaxNo" class="elitem">
                <el-input v-show="!readonly" v-model="formData.buyerTaxNo"></el-input>
                <span v-show="readonly">
                    {{ formData.buyerTaxNo }}
                </span>
            </el-form-item>
            <el-form-item label="邮箱" prop="buyerEmail" class="elitem">
                <el-input v-show="!readonly" v-model="formData.buyerEmail"></el-input>
                <span v-show="readonly">
                    {{ formData.buyerEmail }}
                </span>
            </el-form-item>
            <el-divider content-position="left">销售方信息</el-divider>
            <el-form-item label="销售方名称" prop="sellerid" class='elitem'>
                <el-select v-show="!readonly" @change="changeSob" v-model="formData.sellerName" placeholder="请选择开票单位"
                    style="width: 100%;">
                    <el-option v-for="item in checkList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
                <span v-show="readonly">
                    {{ formData.sellerName }}
                </span>
            </el-form-item>
            <el-form-item label="纳税人识别号" prop="sellerTaxNo" class='elitem'>
                <span style="color:#606266">{{ formData.sellerTaxNo }}</span>
            </el-form-item>
            <el-form-item label="备注" style="height: 50px;" prop="remarks">
                <el-input v-show="!readonly" type="textarea" v-model="formData.remarks"></el-input>
                <span v-show="readonly">
                    {{ formData.remarks }}
                </span>
            </el-form-item>
        </el-form>
        <el-divider content-position="left">商品明细
            <el-button type="primary" size="small" @click="Addline" :icon="Plus" />
        </el-divider>
        <el-card class="box-card" v-for="(items, indexs) in detailData" shadow="never">
            <template #header>
                <div class="card-header" style="display: flex;align-items: center;">
                    <el-button type="danger" size="small" @click="Deleteline(indexs)" :icon="Delete">删除</el-button>
                </div>
            </template>
            <el-form :model="detailData[indexs]" ref="detailRef" label-width="100px">
                <template v-for="(item, index) in tableDetails">
                    <el-form-item :label="item.label" :prop="item.prop" v-show="item.show">
                        <el-input v-show="!readonly" v-model="detailData[indexs][item.prop]"></el-input>
                        <span v-show="readonly">
                            {{ detailData[indexs][item.prop] }}
                        </span>
                    </el-form-item>
                </template>
            </el-form>
        </el-card>
    </div>
    <div class="bottom">
        <el-affix :offset="20" target=".bottom" position="bottom">
            <el-button type="warning" @click="SaveData(ruleFormRef)">暂存</el-button>
            <el-button type="primary" @click="SubData(ruleFormRef)">提交</el-button>
            <el-button type="primary" @click="refreshtab">刷新</el-button>
            <el-button type="danger" v-if="!news" @click="DeleteAll">作废</el-button>
            <el-button type="success" @click="openflow">查看流程</el-button>
        </el-affix>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch, nextTick, onUnmounted, shallowRef, provide } from 'vue';
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import FlowSend from '../../flow/run/send.vue';//发送页面
const ajax = inject('ajax');
const utils = inject('utils');
const qs = inject('qs');
const config = inject('config');
const TableData = inject('getTableData');//刷新标签方式
const Detail = inject('postSaleDetail');//获取明细表数据
const Show = inject('dialogShow');//弹窗显示方式
const index_openmenu = inject('index_openmenu');//首页打开菜单
const index_removetab = inject('index_removetab');//首页关闭标签方法
const index_refreshtab = inject('index_refreshtab');//首页刷新标签方式
const index_dialogshow = inject('index_dialogshow');//首页弹出modal显示
const index_regcomponent = inject('index_regcomponent');//首页注册组件
const index_userinfo = inject('index_userinfo');//首页用户信息
const defaultOrder = ref({ prop: '', order: 'ascending' });
const pager = ref(utils.getPager(defaultOrder.value));
const selectrow = ref([]);//多选
const checkList = ref([])//单位选择
const ticketItems = ref('01');//发票类型
const FristStepId = ref('');//第一步id
const isflow = ref(false);//是否是流程
const addnewid = ref('');//新增id
const ticketList = ref([
    { id: '01', label: '全电专用发票' },
    { id: '02', label: '全电普通发票' },
])

// 创建emits
const emits = defineEmits(['update:id', 'update:buyerTaxNo', 'update:new', 'update:flowtaskid'])
// 创建props
const props = defineProps({
    query: { type: String, default: () => { return ''; } },
    modelValue: { type: Boolean, default: false },
    new: { type: Boolean, default: true },
    id: { type: String, default: "0" },
    buyerTaxNo: { type: String, default: "" },
    flowtaskid: { type: String, default: "" },
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
const news = createComputed('new')
const flowtaskid = createComputed('flowtaskid')
const ruleFormRef = ref()
const refreshtab = () => {
    open()
}
// 传参赋值
const name = ref(utils.query('name', props.query))
var formId = utils.query('formid', props.query);//直接保存表单的formid
const programrun_programcomponentref = utils.length(utils.query('programid', props.query)) > 0 ? inject('programrun_programcomponentref') : ref(null);//应用程序设计编辑数据窗口component ref
// 审批流程判断
const indexm_refreshpage = '1' == isMobile && '1' != isApp ? inject('indexm_refreshpage') : null;//移动端刷新页面方法。
const index_dialogcomponentId = inject('index_dialogcomponentId');
const index_dialogcomponentquery = inject('index_dialogcomponentquery');
const readonly = ref(false)
const loading = ref(false);
const butDisabled = ref(false);
const flowId = ref('');
const groupId = ref('');
const stepId = utils.query('stepid', props.query);
const taskId = utils.query('taskid', props.query);
const instanceId = utils.query('instanceid', props.query);
const roadComponentFormRef = ref(null);
const queryString = ref('')
var formId = utils.query('formid', props.query);//直接保存表单的formid
// var programId = utils.query('programid', props.query);//加载应用程序设计页面的应用程序id
var isMiniProgram = utils.query('isminiprogram', props.query);//是否是小程序
var isApp = utils.query('isapp', props.query);//是否是app
var isEmail = utils.query('isemail', props.query);//是否是邮件连接

const buttons = ref([]);//步骤按钮
const buttonsMobile = ref([]);//移动端步骤按钮（移出分隔线按钮）
const buttonsMobileMore = ref([]);//多余的按钮，移动端只显示几个按钮，多余的显示到更多里。
const step = ref({});//步骤
const forms = ref({})//表单
const formComponentId = ref(null);//表单页面组件
const formComponentQuery = ref('');//表单页面组件参数
const formDisplay = utils.query('display', props.query);//表单显示方式 0编辑 1只读
var openMode = utils.query('openmode', props.query) || '0';//打开方式
var isMobile = utils.query('ismobile', props.query);//是否是移动端
const flowtaskjson = ref({});//流程任务json
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
// 判断是否是新流程
const isnew = ref(true)
const customFormRef = ref(null);
const tasks = ref({
    id: ''
})
// 表单信息
const formData = ref({
    invoiceTypeCode: ticketItems.value,//发票类型
    serialNo: '',//开票流水号
    buyerName: '',//购方名称
    buyerTaxNo: '',//购方税号
    buyerEmail: '',//购方邮箱
    sellerName: [],//销方名称
    sellerid: [],//销方id
    sellerTaxNo: '',//销方税号
    remarks: '',//备注
});
onMounted(() => {
    nextTick(() => {
        loadRun();
    });
    open();
    index_regcomponent('503254660329541', '/Invoice/components/Editmobile.vue');
})
onUnmounted(() => {
    window.removeEventListener('resize', computeFormHeight, false);
});

// 表单验证
const rules = {
    buyerName: [
        {
            required: true,
            message: '请输入购方名称',
            trigger: 'blur'
        },
    ],
    // invoiceTypeCode: [
    //     {
    //         required: true,
    //         message: '请选择发票类型',
    //         trigger: 'change'
    //     },
    // ],
    buyerTaxNo: [
        {
            required: true,
            message: '请输入纳税人识别号',
            trigger: 'blur'
        },
    ],

}
// 作废
function DeleteAll() {
    ElMessageBox.confirm('确定要作废吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        ajax.post('/Invoice/DeleteAll', qs.stringify({ id: id.value })).then((res) => {
            const messageType = res.success ? 'success' : 'error';
            utils.msg(res.msg, messageType, false);
            if (res.success) {
                index_refreshtab();
            }
        }).catch(() => { });
    }).catch(() => { });
}
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
    { prop: 'goodsTotalTax', label: '税额', show: true, useTemplate: false, align: 'center', width: '150' },
    { prop: 'goodsTaxRate', label: '税率/征收率', show: true, align: 'center', useTemplate: true, minWidth: '150%' },
    { prop: 'invoiceLineNature', label: '发票行性质', show: false, align: 'center', useTemplate: true, width: '200', },
    { prop: 'discountRate', label: '折扣率', show: false, align: 'center', useTemplate: true, width: '200', },
    { prop: 'discountAmount', label: '折扣额', show: false, align: 'center', useTemplate: true, width: '200', },
])
// 获取开票单位信息
// 开票单位
const getsobItems = async () => {
    try {
        const res = await ajax.post('user/GetUserInvoiceDepartByUser', qs.stringify({ userid: index_userinfo.value.userId }));
        if (res.success) {
            checkList.value = res.data;
        }
    } catch (error) {
        // 这里可以添加你的错误处理逻辑
    }
}
// 打开页面
function open() {
    // 流程打开页面
    if (name.value == '流程') {
        let task = JSON.parse(localStorage.getItem('task'))
        tasks.value = JSON.parse(localStorage.getItem('tasks'))
        FristStepId.value = localStorage.getItem('FristStepId')
        isflow.value = true
        isnew.value = false
        if (task.stepId === localStorage.getItem('FristStepId')) {
            readonly.value = false
        } else {
            readonly.value = true
        }
        getflowid();
        getformdata(localStorage.getItem('formid'));
        getsobItems();
        formData.value = {
            invoiceTypeCode: ticketItems.value,//发票类型
            customercode: '',//客户编码
            customername: '',//客户名称
            serialNo: '',//开票流水号
            buyerName: '',//购方名称
            buyerTaxNo: '',//购方税号
            buyerEmail: '',//购方邮箱
            sellerName: [],//销方名称
            sellerid: [],//销方id
            sellerTaxNo: '',//销方税号
            remarks: '',//备注
        }
        const flowrun_form = inject('flowrun_form');//父页面表单数据
        const flowrun_step = inject('flowrun_step');//父页面步骤相关设置
        const customFormData = flowrun_form.value.formData;
        const customFormRef = ref(null);
        //获取步骤上设置的验证
        const customFormRules = flowrun_form.value.formRules;
        onMounted(() => {
            //设置表单属性
            customFormData['formAttrJson'] = {
                'dbConn': utils.emptyLong + '',//对应的连接ID，100000000000000表示系统连接。
                'dbTable': 'rf_form_test',//对应的表名
                'dbTablePrimaryKey': 'id',//主键
            };
        });
    }
    if (news.value == true) {
        isnew.value = news.value
        isflow.value = false
        formData.value = {
            invoiceTypeCode: ticketItems.value,//发票类型
            customercode: '',//客户编码
            customername: '',//客户名称
            serialNo: '',//开票流水号
            buyerName: '',//购方名称
            buyerTaxNo: '',//购方税号
            buyerEmail: '',//购方邮箱
            sellerName: [],//销方名称
            sellerid: [],//销方id
            sellerTaxNo: '',//销方税号
            remarks: '',//备注
        }
        flowtaskid.value = '0'
        getflowids();
        getformdata(id.value);
        getsobItems();
    } else if (news.value == false && name.value != '流程') {
        isnew.value = news.value
        isflow.value = false
        formData.value = {
            invoiceTypeCode: ticketItems.value,//发票类型
            customercode: '',//客户编码
            customername: '',//客户名称
            serialNo: '',//开票流水号
            buyerName: '',//购方名称
            buyerTaxNo: '',//购方税号
            buyerEmail: '',//购方邮箱
            sellerName: [],//销方名称
            sellerid: [],//销方id
            sellerTaxNo: '',//销方税号
            remarks: '',//备注
        }
        isflow.value = false
        getflowids();
        getformdata(id.value);
        getsobItems();
    }
}
// 销售方名称查询
function changeSob(row) {
    let checklistItem = checkList.value.find(item => item.id === row);
    if (checklistItem) {
        formData.value.sellerName = checklistItem.label;
        formData.value.sellerTaxNo = checklistItem.taxno;
    } else {
    }
}

// 明细表数据
const detailData = ref([])
// 获取表单数据
const getformdata = async (ids) => {
    loading.value = true;
    try {
        const res = await ajax.post('/Invoice/GetInvoiceApply', qs.stringify({ id: ids }));
        formData.value = res.data.invoicemain
        id.value = res.data.invoicemain.id
        detailData.value = res.data.invoicedetail
    } catch (error) {
        // 这里可以添加你的错误处理逻辑
    } finally {
        loading.value = false;
    }
}




// 添加行
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
            invoiceLineNature: 0,//发票行性质
            discountRate: '0',//折扣率
            discountAmount: '0',//折扣额
        }
        detailData.value.push(row);
    }).catch(() => { });
}
// 删除行
function Deleteline(index) {
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        detailData.value.splice(index, 1)
        for (let i = 0; i < detailData.value.length; i++) {
            detailData.value[i].goodsLineNo = i + 1;
        }
    }).catch(() => { });
}
// 多选
const handleSelectionChange = (val) => {
    selectrow.value = val
}
// 表头单元格样式
function headerCellStyle({ row, column, rowIndex, columnIndex }) {
    return {
        color: '#000',
        textAlign: 'center',
        // borderColor: '#6f4946',
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
            let price = (Number(row.goodsTotalPrice) / Number(row.goodsQuantity)).toFixed(2);
            row.goodsPrice = isNaN(price) ? 0 : price;
        }
        // 计算税额，等于价税合计*税率/（1+税率）
        // row.goodsTotalTax = (row.goodsTotalPrice * row.goodsTaxRate / (1 + row.goodsTaxRate)).toFixed(2);
        // 计算不含税金额，等于无税金额计算=价税合计/（1+税率）
        const goodsTaxRate = 1 + Number(row.goodsTaxRate);
        notaxamount.value = (Number(row.goodsTotalPrice) / Number(goodsTaxRate)).toFixed(2);
        // 计算税额，等于税额=价税合计-价税合计/（1+税率）
        row.goodsTotalTax = (Number(row.goodsTotalPrice) - notaxamount.value).toFixed(2);
        // 无税金额=价税合计-税额
        formData.value.invoiceTotalPrice = row.goodsTotalPrice - row.goodsTotalTax
    })

}, { deep: true }) // 使用 deep: true 以便在 detailData.value 的内部值变化时也能触发 watch 函数





// 流程处理
//加载流程运行
//计算表单高度
const computeFormHeight = () => {
    if (utils.length(programId) > 0) {
        let programmodalheight = utils.query('programmodalheight', props.query);
        formHeight.value = utils.length(programmodalheight) > 0 && programmodalheight > 0 ? programmodalheight + 'px' : 'auto';
        return;
    }
    let minusHeight = '1' == isMobile ? 105 : 155;//要减去的高度
    //res.data.step.signType == 0 表示没有意见栏，res.data.step.display > 0 表示表单只读，也不会显示意见栏 != 4是征求意见，要显示意见栏
    const isShowCommentDiv = step.value.signType > 0 && (step.value.display == 0 || step.value.display == 4);
    //如果要签意见，则表单高度要减去意见div高度。
    if (isShowCommentDiv) {
        minusHeight += 46;
    }
    //表单设计时预览
    if (isPreview) {
        minusHeight -= 105;
    }
    //首页布局是左右时计算高度。
    if (index_themeset.value.homeType === 1) {
        minusHeight -= 46;
    }
    formHeight.value = (window.document.body.offsetHeight - minusHeight) + 'px';
};
const loadRun = () => {
    loading.value = true;
    ajax.post('/Flow/GetRun' + queryString.value).then((res) => {
        if (!res.success) {
            let msg = res.msg;
            if (utils.length(msg) === 0) {
                switch (res.code) {
                    case 1:
                        msg = '未找到流程运行时！';
                        break;
                    case 2:
                        msg = '未找到流程步骤运行时！';
                        break;
                    case 3:
                        msg = '当前任务正由' + res.data + '处理，请等待！';
                        break;
                    case 4:
                        msg = '您无权查看当前任务！';
                        break;
                    case 5:
                        msg = '当前流程' + utils.getFlowStatusTitle(parseInt(res.data)) + '不能发起新的实例！';
                        break;
                    case 6:
                        msg = '未找到用户登录信息！';
                        break;
                    case 7:
                        msg = '未找到当前任务！';
                        break;
                }
            }
            utils.alert(msg || '加载错误！', '', '', 'error', () => { index_removetab(); });
        } else {
            // 加载表单
            if (utils.length(res.data.form) > 0) {
                switch (res.data.form.type) {
                    //设计的表单
                    case 0:
                        initFormData(res.data);//初始化表单默认值和表单验证
                        regFormComponent(res.data);
                        break;
                    //自定义vue组件
                    case 1:
                        initFormData(res.data);//初始化表单默认值和表单验证
                        let urlArray = res.data.form.address.split('?');
                        let vueUrl = urlArray[0];
                        let vueQuery = urlArray.length > 1 ? urlArray[1] : '';
                        let vueId = 'formrun-' + utils.createGuid(false)
                        index_regcomponent(vueId, vueUrl);
                        formComponentId.value = vueId;
                        formComponentQuery.value = vueQuery;
                        break;
                    //外部地址
                    case 2:
                        break;
                }
            }
            buttons.value = res.data.buttons;//步骤按钮
            buttonsMobile.value = utils.spliceArrayObj([...res.data.buttons], utils.emptyLong + '', 'id');//utils.spliceArrayObj是去除分隔线按钮
            //移动端只显示3个，其他的显示到更多里面。
            if (buttonsMobile.value.length > 2) {
                for (var i = 3; i < buttonsMobile.value.length; i++) {
                    buttonsMobileMore.value.push(buttonsMobile.value[i]);
                }
                buttonsMobile.value = buttonsMobile.value.slice(0, 3);
            }
            step.value = res.data.step;
            forms.value = res.data.form;

        }
        loading.value = false;
        //计算表单高度
        computeFormHeight();
        window.addEventListener('resize', computeFormHeight, false);
    }).catch(() => { });
};
//执行流程后的操作，关闭，跳转等操作。
//resData后端执行后返回的数据；type提交类型；json提交参数
const executeAfter = (resData, type, json) => {
    //应用程序设计的保存
    if (utils.length(programId) > 0 || utils.length(formId) > 0) {
        const save = utils.query('save', props.query).toLowerCase() || 'close';//保存后的操作 close-关闭录入窗口 refresh-刷新
        switch (save) {
            case 'close':
                if (utils.isDef(programrun_programcomponentref) && utils.isDef(programrun_programcomponentref.value)) {
                    //应用程序设计的保存关闭
                    programrun_programcomponentref.value.dialogShow = false;//关闭编辑窗口
                    programrun_programcomponentref.value.loadData(false);//重新加载列表数据
                } else {
                    //直接保存表单的关闭
                    switch (openMode) {
                        case '0'://标签方式打开
                            index_removetab();//关闭当前标签
                            break;
                        case '1'://弹出层打开
                            if (utils.isDef(index_dialogshow.value)) {
                                index_dialogshow.value = false;
                            }
                            break;
                        case '2'://弹出窗口打开
                        case '3'://新窗口打开
                            window.close();
                            break;
                    }
                }
                break;
            case 'refresh':
                switch (openMode) {
                    case '0':
                        index_refreshtab();//调用首页刷新标签方法
                        break;
                    //case '1':

                    //    break;
                    case '2':
                    case '3':
                        var herf = window.location.href;
                        window.location.href = herf;
                        break;
                }
                break;
        }
        return;
    }

    //resData.code != 0表示发生了错误，这里不操作。
    //type==='Copyfor' 抄送也不操作。
    //type==='Solicitopinion' 征求意见不操作。
    if (resData.code != 0 || type === 'Copyfor' || type === 'Solicitopinion') {
        return;
    }

    //加签（如果是并签页面不作操作。）
    if (type === 'AddWrite' && utils.length(json.steps) > 0 && json.steps[0].addWriteType == 0) {
        return;
    }

    //刷新
    //刷新首页
    if (utils.isDef(index_refreshtab)) {
        index_refreshtab('Tab_Home');
    }
    //刷新待办标签页面 170346575288606：是待办标签对应的菜单key
    if (utils.isDef(index_refreshtab)) {
        index_refreshtab('170346575288606');
        //如果是撤回，刷新已办标签
        if (type === 'Withdraw') {
            index_refreshtab('170346576223936');
        }
    }

    //保存后刷新页面
    if (type === 'Save') {
        if (resData.nextTasks.length > 0) {
            const task = resData.nextTasks[0];
            //如果是移动端或者email链接或者浏览器窗口打开则重新加载
            if ('1' == isMobile || '1' == isEmail || '3' == openMode || '2' == openMode) {
                window.setTimeout(function () {
                    const url = '/flow/run/index?flowid=' + task.flowId + '&stepid=' + task.stepId + '&taskid=' + task.id
                        + '&groupid=' + task.groupId + '&instanceid=' + task.instanceId
                        + '&ismobile=' + isMobile + '&isapp=' + isApp + '&isemail=' + isEmail + '&openmode=' + openMode;
                    window.location.href = '?loadurl=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(task.title);
                }, 100);
            } else {
                const content = '/flow/run/index?flowid=' + task.flowId + '&stepid=' + task.stepId + '&taskid=' + task.id
                    + '&groupid=' + task.groupId + '&instanceid=' + task.instanceId
                    + '&ismobile=' + isMobile + '&isapp=' + isApp + '&isemail=' + isEmail + '&openmode=' + openMode;
                refresh(content);
            }
        }
        return;
    }

    //如果是移动端返回待办页面
    if ('1' == isMobile) {
        //如果是小程序，刷新页面。
        if ('1' == isMiniProgram) {
            window.setTimeout(function () {
                var href = window.location.href;
                window.location.href = href;
            }, 100);
            return
        }
        //如果是APP，则刷新，返回前页刷新。
        if ('1' == isApp) {
            window.parent.postMessage({ msg: 'refresh' }, '*');
            return;
        }

        //window.location.href = '?loadurl=' + encodeURIComponent('/mobile/flow/todo') + '&title=' + encodeURIComponent('待办事项');
        indexm_openurl(undefined, '/mobile/flow/todo.vue');
        return;
    }
    //如果是邮件或者弹出浏览器窗口，刷新当前页面。
    if ('1' == isEmail || '3' == openMode || '2' == openMode) {
        window.setTimeout(function () {
            var href = window.location.href;
            window.location.href = href;
        }, 100);
        return;
    }
    //弹出层，关闭
    if ('1' == openMode) {
        index_dialogshow.value = false;
        return;
    }
    //关闭当前标签 '0' != openMode表示是以tab方式打开的才关闭
    if ('0' == openMode) {
        //关闭标签
        index_removetab();
    }
    //如果后续任务有自己的任务则打开。
    let userId = index_userinfo.value.userId;
    if (utils.length(resData.nextTasks) > 0) {
        let task = null;
        for (let i = 0; i < resData.nextTasks.length; i++) {
            if (resData.nextTasks[i].receiverId == userId && resData.nextTasks[i].status == 0) {
                task = resData.nextTasks[i];
                break;
            }
        }
        if (utils.isDef(task)) {
            index_openmenu({
                title: task.title,
                id: 'task_' + task.id,
                url: '/flow/run/index?flowid=' + task.flowId + '&stepid=' + task.stepId + '&taskid=' + task.id + '&groupid=' + task.groupId + '&instanceid=' + task.instanceId,
                ico: 'Edit',
                openMode: openMode,
                closable: true
            });
        }
    }
};
//得到处理后提示信息
const getExecuteMsg = (resData, type) => {
    const code = resData.code;
    let msg = '';
    if (code == 0) {
        switch (type.toLowerCase()) {
            case 'save':
                msg = '已保存！';
                break;
            case 'saveprogram':
                msg = '保存成功！';
                break;
            case 'submit':
            case 'freesubmit':
                //resData.sendMessage为服务端返回的流程步骤上设置的发送提示语。
                if (utils.length(resData.sendMessage) > 0) {
                    msg = resData.sendMessage;
                } else if (utils.length(resData.receiveHandler) > 0) {
                    msg = '已发送到：' + resData.receiveHandler;
                } else if (!resData.stepPass) {
                    msg = resData.nextTasks.length == 0 ? '已完成，等待他人处理！' : '已发送，等待他人处理！'
                } else if (!resData.stepCountersignPass) {
                    msg = resData.nextTasks.length == 0 ? '已完成，等待其他步骤处理！' : '已发送，等待其他步骤处理！'
                } else if (resData.flowCompleted) {
                    msg = '已完成！';
                } else {
                    msg = '已发送！';
                }
                break;
            case 'back':
                //resData.backMessage为服务端返回的流程步骤上设置的退回提示语。
                if (utils.length(resData.backMessage) > 0) {
                    msg = resData.backMessage;
                } else if (utils.length(resData.receiveHandler) > 0) {
                    msg = '已退回到：' + resData.receiveHandler;
                } else if (!resData.backPass) {
                    msg = '已退回，等待他人处理！'
                } else {
                    msg = '已退回！';
                }
                break;
            case 'known'://抄送已阅知
                msg = '已完成！';
                break;
            case 'postpone'://暂缓
                msg = '已暂缓！';
                break;
            case 'end'://终止
                msg = '已终止！';
                break;
            case 'copyfor'://抄送
                msg = utils.length(resData.receiveHandler) > 0 ? '已抄送给：' + resData.receiveHandler : '已抄送！';
                break;
            case 'solicitopinion'://征求意见
                msg = utils.length(resData.receiveHandler) > 0 ? '已向：' + resData.receiveHandler + '征求意见！' : '已征求意见！';
                break;
            case 'reply'://回复意见
                msg = '已回复！';
                break;
            case 'redirect'://转交
                msg = utils.length(resData.receiveHandler) > 0 ? '已转交给：' + resData.receiveHandler : '已转交！';
                break;
            case 'addwrite'://加签
                msg = utils.length(resData.receiveHandler) > 0 ? '已发送给：' + resData.receiveHandler + ' 加签！' : '已加签！';
                break;
            case 'withdraw'://撤回
                msg = '已撤回！';
                break;
            default:
                msg = '处理成功！';
                break;
        }
        return msg;
    }
    switch (code) {
        case 1:
            msg = '参数错误！';
            break;
        case 2:
            msg = '流程id错误！';
            break;
        case 3:
            msg = '未知的处理类型！';
            break;
        case 4:
            msg = '未找到流程运行时实体！';
            break;
        case 5:
            msg = '未找到当前步骤运行时实体！';
            break;
        case 6:
            msg = '您不能处理该任务！';
            break;
        case 7:
            msg = '当前任务已处理，不能再次处理！';
            break;
        case 8:
            msg = '处理人为空！';
            break;
        case 9:
            msg = '当前流程不能发起新的任务！';
            break;
        case 10:
            msg = '未找到要处理的任务！';
            break;
        case 11:
            msg = '当前实例组任务为空！';
            break;
        case 12:
            msg = '保存表单数据时发生了错误！';
            break;
        case 1001://执行提交前事件返回不能提交。
            msg = resData.message;
            break;
        case 1002://执行子流程激活前事件发生错误。
            msg = '发起子流程发生了错误！';
            break;
        case 1003://子流程对应的任务未完成，不能提交。
            msg = '子流程对应的任务未完成，不能提交！';
            break;
        case 1100://未找到要抄送的步骤
            msg = '未找到要抄送的步骤！';
            break;//抄送接收人为空
        case 1101:
            msg = '抄送接收人为空！';
            break;
        case 1200://未找到要征求意见的步骤
            msg = '未找到要征求意见的步骤！';
            break;
        case 1201://征求意见接收人为空
            msg = '征求意见接收人为空！';
            break;
        case 1300://未找到要转交的步骤
            msg = '未找到要转交的步骤！';
            break;
        case 1301://转交接收人为空
            msg = '转交接收人为空！';
            break;
        case 1400://未找到要加签的步骤
            msg = '未找到要加签的步骤！';
            break;
        case 1401://加签接收人为空
            msg = '加签接收人为空！';
            break;
        case 1500://不是发起人不能作废流程实例
            msg = '不是发起人不能作废流程实例！';
            break;
        case 1501://作废流程实例发生错误
            msg = '作废流程实例发生错误！';
            break;
        case 2000://200以上为处理退回时返回代码
            msg = '当前步骤设置为不能退回！';
            break;
        case 2001://执行退回前事件返回不能退回
            msg = resData.message;
            break;
        case 2002://退回没有找到接收人
            msg = '退回没有找到接收人！';
            break;
        case 3000://3000为程序发生了异常
            msg = '处理流程发生了错误！';
            break;
        case 5006://任务已处理，不能撤回！
            msg = '任务已处理，不能撤回！';
            break;
    }
    return msg;
};
const stepid = ref('')
const taskid = ref('')
const formtype = ref('开票申请')
// 从本地存储当中提取JSON名字的字段
const localStorageKeys = ref()
const jsonObjects = ref()
// 保存表单和流程
const executeFlows = (type, steps) => {
    const json = {
        type: type,
        flowId: flowId.value,
        stepId: stepId,
        taskId: taskId,
        groupId: groupId.value,
        instanceId: instanceId,
        isMobile: isMobile,
        steps: steps || [],
        comment: step.value.comment,
        attachment: step.value.attachment,
        sign: step.value.sign
    };
    //如果要归档，要把下拉选项相关值提交到后台。
    if (step.value.archive == 1) {
        forms.value.formData['archiveFormSelectOptions'] = forms.value.formSelectOptions;
    }
    //判断符合条件的序列号
    if (utils.hasKey(forms.value.formData, 'serialNumber') && utils.length(forms.value.formData['serialNumber']) > 0) {
        for (let i = 0; i < forms.value.formData['serialNumber'].length; i++) {
            let serialNumberi = forms.value.formData['serialNumber'][i];
            let serialNumberRemove = [];
            for (let j = 0; j < serialNumberi['serials'].length; j++) {
                let serialData = serialNumberi['serials'][j]['data'];
                //如果数据条件为空，表示满足。
                if (utils.length(serialData) === 0) {
                    continue;
                }
                let fun = new Function('formData', serialData);
                let funResult = fun(forms.value.formData);
                if (!funResult) {
                    serialNumberRemove.push(j);
                }
            }
            for (let j = 0; j < serialNumberRemove.length; j++) {
                serialNumberi['serials'].splice(serialNumberRemove[j], 1);
            }
        }
    }
    ajax.post('/Flow/FlowExecute?srcorgid=' + sobInfo.value.id + queryString.value, qs.stringify({
        json: JSON.stringify(json)
        , formData: JSON.stringify(forms.value.formData)
        , id: id.value
        , isapply: '1'
        , formtype: formtype.value
        , billJson: JSON.stringify(jsonObjects.value)
    })).then((res) => {
        flowtaskjson.value = res.data.currentTaskModel
        if (flowtaskjson.value.entrustUserId == null) {
            flowtaskjson.value.entrustUserId = 0
        }
        if (flowtaskjson.value.mainTaskId == null) {
            flowtaskjson.value.mainTaskId = 0
        }
        stepid.value = res.data.currentTaskModel.stepId
        taskid.value = res.data.currentTaskModel.id
        if (res.success) {
            const resData = res.data;
            sendShow()
            //消息提示
            if (utils.length(programId) > 0) {
                //应用程序设计用msg方式
                utils.msg(getExecuteMsg(resData, type), resData.code == 0);
                executeAfter(resData, type, json);
            } else {
                utils.alert(getExecuteMsg(resData, type), '', '', resData.code == 0, () => { executeAfter(resData, type, json); });
            }
        } else {
            utils.msg('执行流程发生了错误！', false);
        }
        butDisabled.value = false;
        loading.value = false;
    }).catch(() => {
        butDisabled.value = false;
        loading.value = false;
    });
};
// 提交到第二步
const executeFlowss = (type, steps) => {
    const json = {
        type: type,
        flowId: flowId.value,
        stepId: stepid.value,
        taskId: taskid.value,
        groupId: groupId.value,
        instanceId: instanceId,
        isMobile: isMobile,
        steps: steps || [],
        comment: step.value.comment,
        attachment: step.value.attachment,
        sign: step.value.sign
    };
    //如果要归档，要把下拉选项相关值提交到后台。
    if (step.value.archive == 1) {
        forms.value.formData['archiveFormSelectOptions'] = forms.value.formSelectOptions;
    }
    //判断符合条件的序列号
    if (utils.hasKey(forms.value.formData, 'serialNumber') && utils.length(forms.value.formData['serialNumber']) > 0) {
        for (let i = 0; i < forms.value.formData['serialNumber'].length; i++) {
            let serialNumberi = forms.value.formData['serialNumber'][i];
            let serialNumberRemove = [];
            for (let j = 0; j < serialNumberi['serials'].length; j++) {
                let serialData = serialNumberi['serials'][j]['data'];
                //如果数据条件为空，表示满足。
                if (utils.length(serialData) === 0) {
                    continue;
                }
                let fun = new Function('formData', serialData);
                let funResult = fun(forms.value.formData);
                if (!funResult) {
                    serialNumberRemove.push(j);
                }
            }
            for (let j = 0; j < serialNumberRemove.length; j++) {
                serialNumberi['serials'].splice(serialNumberRemove[j], 1);
            }
        }
    }
    ajax.post('/Flow/FlowExecute?srcorgid=' + sobInfo.value.id + queryString.value, qs.stringify({
        istj: '0'
        , isapply: '1'
        , formtype: formtype.value
        , json: JSON.stringify(json)
        , formData: JSON.stringify(forms.value.formData)
        , id: id.value
    })).then((res) => {
        flowtaskjson.value = res.data.currentTaskModel
        if (flowtaskjson.value.entrustUserId == null) {
            flowtaskjson.value.entrustUserId = 0
        }
        if (flowtaskjson.value.mainTaskId == null) {
            flowtaskjson.value.mainTaskId = 0
        }
        if (res.success) {
            index_refreshtab();
            const resData = res.data;
            //消息提示
            if (utils.length(programId) > 0) {
                //应用程序设计用msg方式
                utils.msg(getExecuteMsg(resData, type), resData.code == 0);
                executeAfter(resData, type, json);
            } else {
                utils.alert(getExecuteMsg(resData, type), '', '', resData.code == 0, () => { executeAfter(resData, type, json); });
            }
        } else {
            utils.msg('执行流程发生了错误！', false);
        }
    }).catch(() => {
    });
};
//弹出层
const dialogShow = ref(false);
const dialogTitle = ref('');
const dialogWidth = ref('');
const dialogQuery = ref('');
const dialogClass = ref('');
const dialogCenter = ref(true);
const dialogPage = shallowRef(null);
//显示发送窗口
const sendShow = () => {
    //检查如果要签意见，是否签意见和签章
    if (step.value.signType > 0 && utils.length(step.value.comment) === 0) {
        utils.msg('请填写处理意见！', false);
        return;
    }
    if (step.value.signType >= 2 && step.value.sign == 0) {
        if (step.value.signType == 3) {
            //如果要输入密码签章，则弹出输入密码窗口。
            sign(1);
        } else {
            utils.msg('请签章！', false);
        }
        return;
    }
    dialogQuery.value = queryString.value;
    dialogPage.value = FlowSend;
    dialogTitle.value = '确认接收步骤';
    dialogWidth.value = '1' == isMobile ? '350px' : '600px';
    dialogClass.value = '';
    dialogCenter.value = true;
    dialogShow.value = true;
};
const sendOk = (steps) => {
    executeFlowss('Submit', steps);
};
// --------------------------
// 有流程提交事件
// 保存
const SubData = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            savecontent()
            localStorageKeys.value = Object.keys(localStorage);
            jsonObjects.value = localStorageKeys.value.filter(key => key.endsWith('JSON')).reduce((objects, key) => {
                const jsonString = localStorage.getItem(key);
                const jsonObject = JSON.parse(jsonString);
                objects[key] = jsonObject;
                return objects;
            }, {});
            ElMessageBox.confirm(
                '是否保存并提交下一步流程?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '关闭',
                    type: 'warning',
                }
            ).then(() => {
                const type = 'Save'
                executeFlows(type);
            }).catch(() => { })
        }
    })
}
// 暂存
const SaveData = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            save(0);
        }
    })
}



// 保存
function save(flow) {
    ajax.post("/Flow/GetLongId").then((res) => {
        flowtaskjson.value.Id = res.data;
        savetwo(flow)
    }).catch(() => { })
}
function savetwo(flow) {
    formData.value.customercode = formData.value.buyerName
    ajax.post('Invoice/SaveWithFlow?srcorgid=' + sobInfo.value.id, qs.stringify({
        isapply: flow
        , invoiceJSON: JSON.stringify(formData.value)
        , invoicedetailsJSON: JSON.stringify(detailData.value)
        , flowtaskjson: JSON.stringify(flowtaskjson.value)
    }))
        .then((res) => {
            if (res.success == true) {
                Show.value = false
                index_refreshtab()
            }
            if (res.code == 1) {
                ElMessageBox.confirm(
                    res.msg,
                    '提示',
                    {
                        confirmButtonText: '确定',
                        type: 'warning',
                    }
                )
            }
        }).catch((err) => { })
}

// 查看
const openflow = () => {
    showProcess()
}

//刷新页面
const refresh = (content, key) => {
    if (isMobile == '1') {
        if ('1' == isApp) {
            let href = window.location.href;
            window.location.href = href;
        } else {
            indexm_refreshpage(key, content);
        }
    } else if ('2' == openMode || '3' == openMode) {
        let href = window.location.href;
        window.location.href = href;
    } else if ('1' == openMode) {
        //弹出层刷新
        if (utils.length(content) === 0) {
            content = '/flow/run/index' + (props.query.indexOf('?') === 0 ? '' : '?') + props.query;
        }
        const refreshComponentId = 'task_' + utils.createGuid(false);
        const refreshUrlArray = content.split('?');
        const refreshUrl = refreshUrlArray[0];
        const refreshQuery = refreshUrlArray.length > 1 ? refreshUrlArray[1] : '';
        index_regcomponent(refreshComponentId, refreshUrl);
        index_dialogcomponentId.value = refreshComponentId;
        index_dialogcomponentquery.value = refreshQuery;
    } else {
        index_refreshtab(key, content);
    }
};



// 新增获取flowid
const getflowid = () => {
    ajax.post('flow/GetFlowTask?flowtaskid=' + tasks.value.id + ' &isnew=' + isnew.value + '&flowname=开票申请').then((res) => {
        FristStepId.value = res.data.FristStepId
        flowId.value = res.data.taskmodel.flowId
        groupId.value = res.data.taskmodel.groupId
        task.value = res.data.taskmodel
        flowtaskjson.value = res.data.taskmodel
        queryString.value = '?' + 'flowid' + '=' + res.data.taskmodel.flowId + '&' + 'openmode' + '=' + '0'
    }).catch((err) => { })
}
const getflowids = () => {
    ajax.post('flow/GetFlowTask?flowtaskid=' + flowtaskid.value + ' &isnew=' + isnew.value + '&flowname=开票申请').then((res) => {
        FristStepId.value = res.data.FristStepId
        flowId.value = res.data.taskmodel.flowId
        groupId.value = res.data.taskmodel.groupId
        task.value = res.data.taskmodel
        flowtaskjson.value = res.data.taskmodel
        queryString.value = '?' + 'flowid' + '=' + res.data.taskmodel.flowId + '&' + 'openmode' + '=' + '0'
    }).catch((err) => { })
}
// 流程数据
const task = ref({})
//显示处理过程
const showProcess = () => {
    const item = {
        id: 'task_process_' + utils.createGuid(false),
        title: task.value.title,
        url: '/flow/run/process?flowid=' + task.value.flowId + '&groupid=' + task.value.groupId + '&status=0',
        openMode: 1,
        width: '1150px',
        customClass: 'el-dialog__padding',
        center: false,
    };
    index_openmenu(item);
};

// -----------------------
//发送
const send = async () => {
    if (forms.value.type == 0) {
        const roadflowFormRef = roadComponentFormRef.value.$refs['roadflowFormRef'];
        //表单设计器设计的表单，执行表单验证。
        if (utils.isUndef(roadflowFormRef)) {
            return;
        }
        //表单脚本中自定义的formValidate函数，用于自定义表单验证。
        if (utils.isFunction(roadComponentFormRef.value.formValidate) && !roadComponentFormRef.value.formValidate()) {
            return;
        }
        await roadflowFormRef.validate((valid) => {
            if (valid) {
                sendShow();
            } else {
                utils.msg('表单验证错误，请检查表单必填项等信息！', false);
            }
        });
    } else if (forms.value.type == 1) {
        //自定义表单
        // const customFormRef = roadComponentFormRef.value.$refs['customFormRef'];
        await customFormRef.validate((valid) => {
            if (valid) {
                sendShow();
            } else {
                utils.msg('表单验证错误，请检查表单必填项等信息！', false);
            }
        });
    } else {
        sendShow();
    }
};
// 合计
const getSummaries = (param) => {
    const { columns, data } = param
    const sums = []
    const columnsToShowSum = ['goodsTotalPrice', 'goodsTotalTax']

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
                        return prev + curr
                    } else {
                        return prev
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





defineExpose({
    open,
    headerCellStyle,
    openflow,
    refresh,
    getflowid,
    savecontent,
    save,
    savetwo,
})
// 存储数据
function savecontent() {
    formData.value.customercode = formData.value.buyerName
    localStorage.setItem('invoiceJSON', JSON.stringify(formData.value))
    localStorage.setItem('invoicedetailsJSON', JSON.stringify(detailData.value))
}
provide('flowrun_step', step);
provide('flowrun_form', formData.value);
provide('flowrun_send', send);
provide('flowrun_sendok', sendOk);
provide('flowrun_dialogshow', dialogShow);
</script>

<style scoped>
@import '../../../roadui-assets/required.css';
@import '../../main/Customsubmit.css';

.vertical-text {
    writing-mode: vertical-rl;
    letter-spacing: 15px;
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

.elitem {
    margin-bottom: 20px;
    padding-bottom: 5px;
}

.bottom {
    text-align: center;
    margin-bottom: 10px;
    height: 50px;
}
</style>