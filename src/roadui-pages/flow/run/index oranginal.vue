<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <div>
            <!--按钮栏PC端-->
            <div v-if="buttons.length > 0 && !isPreview && '1' != isMobile" class="roadui_noprint">
                <!--流程处理按钮-->
                <div v-if="utils.length(programId) === 0 && utils.length(formId) === 0">
                    <div class="roadui_toolbar">
                        <div v-for="button in buttons" :key="button.id">
                            <button v-if="button.id !== utils.emptyLong + ''" @click="execScript(button.scripts, true)"
                                :disabled="butDisabled" type="button">
                                <component v-if="utils.length(button.ico) > 0" :is="button.ico" />{{ button.title }}
                            </button>
                            <span v-else>|</span>
                        </div>
                    </div>
                </div>
            </div>
            <!--意见栏PC端-->
            <div v-if="step.signType > 0 && (step.display == 0 || step.display == 4) && '1' != isMobile"
                style="margin:15px 0 0 0;">
                <div>
                    <el-select placeholder="常用意见" @change="(val) => { step.comment = val; }"
                        style="width:180px;margin-right:12px;">
                        <el-option v-for="(comment, index) in form.commentList" :key="index" :label="comment"
                            :value="comment"></el-option>
                    </el-select>
                    <el-input v-model="step.comment" style="width:55%;margin-right:12px;" placeholder="请输入意见"
                        clearable></el-input>
                    <el-selectfile v-model="step.attachment" v-if="step.showAttachment == 1"
                        style="width: 130px; margin-right: 12px;"></el-selectfile>
                    <el-button @click="sign()" v-if="step.signType >= 2" type="primary"
                        style="margin-right:12px;">签章</el-button>
                    <el-usersign v-if="step.sign == 1"
                        :sign="utils.length(step.signImg) > 0 ? step.signImg : step.signName"
                        style="vertical-align:-3px;"></el-usersign>
                </div>
            </div>
        </div>
        <!--表单-->
        <div :style="{ 'height': formHeight, 'overflow': 'auto' }">
            <!--表单-->
            <div>
                <!--步骤说明-->
                <div v-if="utils.length(step.note) > 0" class="roadui_flowrunstepnote">
                    {{ step.note }}
                </div>
                <!--征求意见说明-->
                <div v-if="utils.length(step.solicitOpinion) > 0" class="roadui_flowrunstepnote">
                    {{ step.solicitOpinion }}
                </div>
                <!--加载表单-->
                <div style="padding-top:12px;">
                    <component ref="roadComponentFormRef" v-if="form.type === 0 || form.type === 1"
                        :is="formComponentId" :query="formComponentQuery"></component>
                    <iframe v-else :src="form.address"
                        :style="`border:none;width:100%;height:${parseInt(formHeight) - 20}px;`"
                        frameborder="0"></iframe>
                </div>
                <!--历史意见列表-->
                <div style="margin-top: 20px;">
                    <el-timeline>
                        <el-timeline-item v-for="(comment, index) in form.commentStepList" :key="index" type="primary">
                            <div>
                                <!--移动端-->
                                <div v-if="isMobile == '1'">
                                    <div>
                                        <span style="margin-right:18px">{{ comment.receiverName }}</span>
                                        <span>{{ comment.stepName }}</span>
                                    </div>
                                    <div style="margin-top:10px">{{ comment.receiveTime }} - 接收</div>
                                    <div style="margin-top:10px">{{ comment.completedTime }} -
                                        {{ utils.getTaskHadleTitle(comment.handleType) }}</div>
                                </div>
                                <!--PC端-->
                                <div v-else>
                                    <el-space :size="20">
                                        <span>{{ comment.receiverName }}</span>
                                        <span>{{ comment.stepName }}</span>
                                        <span>{{ comment.receiveTime }} - 接收</span>
                                        <span>{{ comment.completedTime }} -
                                            {{ utils.getTaskHadleTitle(comment.handleType) }}</span>
                                    </el-space>
                                </div>
                            </div>
                            <div style="margin-top:12px">
                                <span style="margin-right:12px">{{ comment.comment }}</span>
                                <el-usersign v-if="comment.isSign === 1" :sign="comment.sign"></el-usersign>
                            </div>
                            <div style="margin-top:12px" v-if="utils.length(comment.attachment) > 0">
                                <span style="margin-right:12px">附件</span>
                                <el-space :size="20" wrap>
                                    <el-link v-for="(file, index) in comment.attachment" :key="file.id"
                                        @click="utils.showFile(index_openmenu, file, sysConfig.SERVER_WEBADDRESS, '1' == isMobile)">{{+
                                            + index }}、{{ file.name }}</el-link>
                                </el-space>
                            </div>
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </div>
        </div>

        <!--移动端按钮和意见显示在底部-->
        <div v-if="'1' == isMobile" class="roadui_noprint" style="border-top: 1px solid var(--el-border-color-light);">
            <div v-if="step.signType > 0 && (step.display == 0 || step.display == 4)"
                style="padding: 12px 0 0 0; text-align: center;">
                <el-select placeholder="常用" @change="(val) => { step.comment = val; }"
                    style="width:75px;margin-right:8px;">
                    <el-option v-for="(comment, index) in form.commentList" :key="index" :label="comment"
                        :value="comment"></el-option>
                </el-select>
                <el-input v-model="step.comment"
                    :style="'width:' + (step.signType >= 2 ? '35%' : '65%') + ';margin-right:8px;'" placeholder="请输入意见"
                    clearable></el-input>
                <el-button @click="sign()" v-if="step.signType >= 2" type="primary"
                    style="margin-right:8px;padding:8px;">签章</el-button>
                <el-usersign v-if="step.sign == 1" :sign="utils.length(step.signImg) > 0 ? step.signImg : step.signName"
                    style="vertical-align:-2px;"></el-usersign>
            </div>
            <div v-if="utils.length(programId) === 0 && utils.length(formId) === 0"
                style="padding: 12px 0 0 0; text-align:center; white-space: nowrap;">
                <el-button-group>
                    <el-button type="primary" v-for="(button, index) in buttonsMobile" :key="button.id"
                        @click="execScript(button.scripts, true)" :disabled="butDisabled" style="cursor:pointer;">
                        <component style="width:16px;height:16px;vertical-align:-3px;margin-right:5px;"
                            v-if="utils.length(button.ico) > 0" :is="button.ico" />
                        {{ button.title }}
                    </el-button>
                    <el-button v-if="buttonsMobileMore.length > 0" type="primary"
                        @click="() => { dropdown_mobilebuttons.handleOpen(); }"><el-icon>
                            <ArrowUpBold />
                        </el-icon></el-button>
                </el-button-group>
                <el-dropdown ref="dropdown_mobilebuttons" trigger="click" placement="top">
                    <span></span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-for="(button, index) in buttonsMobileMore" :key="button.id"
                                @click="execScript(button.scripts, true)" :disabled="butDisabled"
                                style="cursor:pointer;">
                                <el-button type="default">
                                    <component style="width:16px;height:16px;vertical-align:-3px;margin-right:5px;"
                                        v-if="utils.length(button.ico) > 0" :is="button.ico" />
                                    {{ button.title }}
                                </el-button>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <!--操作窗口-->
        <el-dialog v-model="dialogShow" :title="dialogTitle" :class="dialogClass" destroy-on-close :width="dialogWidth"
            draggable :close-on-click-modal="false">
            <component :is="dialogPage" :query="dialogQuery"></component>
        </el-dialog>
        <!--应用程序设计编辑窗口按钮栏-->
        <div v-if="(utils.length(programId) > 0 || utils.length(formId) > 0) && !isPreview"
            style="text-align:center;padding-bottom:8px;">
            <el-button v-for="button in buttons" type="primary" :key="button.id" :disabled="butDisabled"
                @click="execScript(button.scripts, true)">
                {{ button.title }}
            </el-button>
        </div>
    </div>
</template>

<script setup>
import FlowSignPassword from './signpassword.vue';//签章确认密码页面
import FlowSend from './send.vue';//发送页面
import FlowBack from './back.vue';//退回页面
import FlowSetHandler from './sethandler.vue';//指定处理人页面
import FlowAddWrite from './addwrite.vue';//加签页面
import FlowSolicitOpinions from './solicitopinions.vue';//征求意见页面
import FlowCopyfor from './copyfor.vue';//抄送页面
import FlowRedirect from './redirect.vue';//转交页面
import FlowChart from './chart.vue';//流程图页面
import FlowProcess from './process.vue';//处理过程页面
import FlowUrge from './urge.vue';//催办页面
import jquery from 'jquery';
import dayjs from 'dayjs';
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
import { ref, provide, inject, onMounted, onUnmounted, nextTick, shallowRef } from 'vue';
const ajax = inject('ajax');
const utils = inject('utils');
const app = inject('app');
const sysConfig = inject('config');
const qs = inject('qs');
const ElSelectdict = inject('ElSelectdict');
const ElSelectorg = inject('ElSelectorg');
const ElSelectfile = inject('ElSelectfile');
const ElCkeditor = inject('ElCkeditor');
const ElUsersign = inject('ElUsersign');
const ElSelectdiv = inject('ElSelectdiv');
const index_openmenu = inject('index_openmenu');//首页打开菜单
const index_removetab = inject('index_removetab');//首页关闭标签方法
const index_refreshtab = inject('index_refreshtab');//首页刷新标签方式
const index_dialogshow = inject('index_dialogshow');//首页弹出modal显示状态
const index_dialogcomponentId = inject('index_dialogcomponentId');
const index_dialogcomponentquery = inject('index_dialogcomponentquery');
const index_regcomponent = inject('index_regcomponent');//首页注册组件
const index_userinfo = inject('index_userinfo');//首页用户信息
const props = defineProps({ query: { type: String, default: () => { return ''; } } });
const formHeight = ref('500px');
var programId = utils.query('programid', props.query);//加载应用程序设计页面的应用程序id
var formId = utils.query('formid', props.query);//直接保存表单的formid
var isPreview = utils.query('ispreview', props.query) === '1';//是否是预览表单
const programrun_programcomponentref = utils.length(utils.query('programid', props.query)) > 0 ? inject('programrun_programcomponentref') : ref(null);//应用程序设计编辑数据窗口component ref
var openMode = utils.query('openmode', props.query) || '0';//打开方式
var isMobile = utils.query('ismobile', props.query);//是否是移动端
var isApp = utils.query('isapp', props.query);//是否是app
var isMiniProgram = utils.query('isminiprogram', props.query);//是否是小程序
var isEmail = utils.query('isemail', props.query);//是否是邮件连接
const indexm_openurl = '1' == isMobile && '1' != isApp ? inject('indexm_openurl') : null;//移动端打开页面方法。
const indexm_refreshpage = '1' == isMobile && '1' != isApp ? inject('indexm_refreshpage') : null;//移动端刷新页面方法。
const indexm_backpage = '1' == isMobile && '1' != isApp ? inject('indexm_backpage') : null;//移动端回退页面方法。
const index_themeset = inject('index_themeset');
const dropdown_mobilebuttons = ref(null);//移动端展开更多按钮dropdown

onMounted(() => {
    nextTick(() => {
        loadRun();
    });
});
onUnmounted(() => {
    window.removeEventListener('resize', computeFormHeight, false);
});

const queryString = '?' + utils.getQuery(props.query);
const loading = ref(false);
const loadingText = ref('');
const butDisabled = ref(false);
const flowId = utils.query('flowid', props.query);
const stepId = utils.query('stepid', props.query);
const taskId = utils.query('taskid', props.query);
const groupId = utils.query('groupid', props.query);
const instanceId = utils.query('instanceid', props.query);
const roadComponentFormRef = ref(null);

const buttons = ref([]);//步骤按钮
const buttonsMobile = ref([]);//移动端步骤按钮（移出分隔线按钮）
const buttonsMobileMore = ref([]);//多余的按钮，移动端只显示几个按钮，多余的显示到更多里。
const step = ref({});//步骤
const form = ref({});//表单
const formComponentId = ref(null);//表单页面组件
const formComponentQuery = ref('');//表单页面组件参数
const formDisplay = utils.query('display', props.query);//表单显示方式 0编辑 1只读

//弹出层
const dialogShow = ref(false);
const dialogTitle = ref('');
const dialogWidth = ref('');
const dialogPage = shallowRef(null);
const dialogQuery = ref('');
const dialogClass = ref('');
const dialogCenter = ref(true);

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

//加载流程运行
const loadRun = () => {
    loading.value = true;
    ajax.post('/Flow/GetRun' + queryString).then((res) => {
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
            //加载表单
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
            form.value = res.data.form;
        }
        loading.value = false;
        //计算表单高度
        computeFormHeight();
        window.addEventListener('resize', computeFormHeight, false);
    }).catch(() => { });
};
//执行脚本 script:脚本 disabledButton是否禁用按钮
const execScript = (script, disabledButton) => {
    if (utils.length(script) === 0) {
        return;
    }
    if (disabledButton) {
        butDisabled.value = true;
    }
    try {
        eval(script);
        butDisabled.value = false;
    } catch (e) {
        butDisabled.value = false;
        console.log(e);
    }
};
//注册表单组件前做的一些初始化
const initFormData = (data) => {
    //设置默认值
    for (var key in data.form.formDefaultValues) {
        //如果示是子表ID，子表不设置，跳过（id以subtable_开头表示是子表）。
        if (utils.startWith(key, 'subtable_')) {
            continue;
        }
        //如果表单中没有值才设置默认值
        if (!utils.hasKey(data.form.formData, key) || utils.isUndef(data.form.formData[key])) {
            data.form.formData[key] = data.form.formDefaultValues[key];
        }
    }

    //设置验证
    data.form.formRules = {};
    data.form.formRulesSubtable = {};
    for (let field in data.step.fieldStatus) {
        const check = data.step.fieldStatus[field].check;
        if (check > 0) {
            if (field.indexOf('.') < 0) {
                //如果是自定义表单，字段名取-后面的。
                let filedName = field;
                if (data.form.type === 1) {
                    let filedNameArray = filedName.split('-');
                    filedName = filedNameArray.length > 1 ? filedNameArray[1] : filedNameArray[0];
                }
                data.form.formRules[filedName] = [{
                    required: check === 2,
                    message: '不能为空',
                    trigger: 'blur'
                }];
            } else {
                //子表
                data.form.formRulesSubtable[field] = [{
                    required: check === 2,
                    message: '不能为空',
                    trigger: 'blur'
                }];
            }
        }
    }
};
//加载表单设计器设计的表单
const regFormComponent = (data) => {
    if (utils.length(data.form.html) === 0) {
        return;
    }
    const componentId = 'formrun-' + utils.createGuid(false);
    const component = {
        components: { 'el-selectdict': ElSelectdict, 'el-selectorg': ElSelectorg, 'el-selectfile': ElSelectfile, 'el-ckeditor': ElCkeditor, 'el-usersign': ElUsersign, 'el-selectdiv': ElSelectdiv },
        data() {
            return {
                formData: data.form.formData,//表单数据
                formRules: data.form.formRules,//表单验证
                formRulesSubtable: data.form.formRulesSubtable,//子表验证
                formSelectOptions: data.form.formSelectOptions,//表单下拉控件选项
                formDefaultValues: data.form.formDefaultValues,//表单控件默认值
                formEvents: data.form.fromEvents,//表单控件事件
                formFieldStatus: data.step.fieldStatus,//表单字段状态
                formDisplay: data.step.display,//是否是查看，1，查看，2已完成（有催办，撤回按钮）
                formLabelPosition: 'left',//表单标签对齐'left'|'right'|'top'
                formSign: utils.length(data.step.signImg) > 0 ? data.step.signImg : data.step.signName,//签章
                isMobile: isMobile == '1',//是否是移动端
                utils: utils,//utils工具，方便代码中调用
                roadflowFormRef: ref(null),
                subTablePagers: {},//子表分页
                subTableLoading: false,
            };
        },
        mounted() {
            this.$nextTick(() => {
                //执行表单脚本
                if (utils.length(data.form.script) > 0) {
                    eval(data.form.script);
                }
            });
        },
        computed: {
            //得到字段状态
            getFieldStatus() {
                return function (id) {
                    const f = this.formFieldStatus[id];
                    //如果表单是只读状态(url参数中的display=1)，直接返回只读。
                    if (formDisplay == '1' || formDisplay == '2' || this.formDisplay == 1 || this.formDisplay == 2) {
                        //判断如果字段是设置的隐藏，则返回隐藏，否则返回只读。
                        return utils.isDef(f) && f.status == 2 ? 2 : 1;
                    }
                    //如果没有设置字段状态，则返回编辑。
                    if (utils.length(id) === 0 || utils.length(this.formFieldStatus) === 0) {
                        return 0;
                    }
                    //如果某个字段没有设置状态，则默认返回编辑。
                    const status = utils.isDef(f) ? f.status : 0;
                    //如果表单是只读状态，即使字段是编辑状态也返回只读状态。
                    return (formDisplay > 0 || this.formDisplay > 0) && status == 0 ? 1 : status;
                }
            },
            //得到只读时显示文本
            getText() {
                return function (id) {
                    if (utils.length(id) === 0) {
                        return '';
                    }
                    const val = this.formData[id];
                    return utils.isDef(val) ? val : '';
                }
            },
            //得到子表添加删除按钮状态
            getSubtableDisabled() {
                return function (id) {
                    //如果表单是只读状态，直接返回禁用。
                    if (this.formDisplay > 0) {
                        return true;
                    }
                    //如果没有设置字段状态，则返回可用。
                    if (utils.length(this.formFieldStatus) === 0 || utils.length(id) === 0) {
                        return false;
                    }
                    //循环判断子表字段状态，只要有一个不为只读，则按钮不禁用。
                    let isField = false;//是否设置了子表字段状态
                    for (let key in this.formFieldStatus) {
                        const hasField = key.indexOf('.') > 0 && key.split('.')[0].toLowerCase() == id.toLowerCase();
                        if (!isField) {
                            isField = hasField;
                        }
                        if (hasField && this.formFieldStatus[key].status == 0) {
                            return false;
                        }
                    }
                    return isField;
                }
            },
            //得到下拉选择只读时标题
            getSelectTitle() {
                return function (id, value) {
                    const options = this.formSelectOptions[id];
                    if (utils.length(options) === 0) {
                        return;
                    }
                    let titles = [];
                    let values = utils.isArray(value) ? value : [value];
                    for (let i = 0; i < values.length; i++) {
                        for (let j = 0; j < options.length; j++) {
                            if (options[j].value == values[i]) {
                                titles.push(options[j].label);
                            }
                        }
                    }
                    return titles.join('; ');
                }
            },
            //得到级联选择只读时标题
            getCascaderTitle() {
                return function (id, value) {
                    if (utils.isUndef(value)) {
                        return '';
                    }
                    const options = utils.getLevelArray(this.formSelectOptions[id], 'children');
                    let titles = [];
                    for (let i = 0; i < value.length; i++) {
                        let obj = utils.getArrayObj(options, value[i], 'value');
                        if (obj != null) {
                            titles.push(obj.label);
                        }
                    }
                    return titles.join(' / ');
                }
            },
            //得到日期时间只读时显示标题 format：显示格式 separator：选择范围分隔符
            getDateTimeTitle() {
                return function (value, format, separator) {
                    if (format === 'undefined') {
                        format = undefined;
                    }
                    if (separator === 'undefined') {
                        separator = ' - ';
                    }
                    if (utils.isArray(value)) {
                        let val1 = value.length > 0 ? value[0] : '';
                        let val2 = value.length > 1 ? value[1] : '';
                        if (utils.length(format) > 0) {
                            if (utils.length(val1) > 0) {
                                val1 = dayjs(val1).format(format);
                            }
                            if (utils.length(val2) > 0) {
                                val2 = dayjs(val2).format(format);
                            }
                        }
                        return val1 + (separator || ' - ') + val2;
                    } else {
                        if (utils.length(format) > 0 && utils.length(value) > 0) {
                            value = dayjs(value).format(format);
                        }
                        return value;
                    }
                }
            },
            //得到开关只读时显示标题 unCheckedChildren：非选中文本 checkedChildren：选中文本 checkedValue：选中值
            getSwitchTitle() {
                return function (value, unCheckedChildren, checkedChildren, checkedValue) {
                    return value === true || (utils.isDef(checkedValue) && value === checkedValue) ? checkedChildren || '开' : unCheckedChildren || '关';
                }
            },
        },
        methods: {
            //执行事件 id:事件id, eventName:事件名称 value:控件值 row:子表事件时的行数据
            execFormEvent(id, eventName, value, row) {
                const eventObj = utils.getArrayObj(this.formEvents, id, 'id');
                if (utils.isUndef(eventObj)) {
                    return;
                }
                const eventObj1 = utils.getArrayObj(eventObj.events, eventName, 'name');
                if (utils.isUndef(eventObj1) || utils.length(eventObj1.script) === 0) {
                    return;
                }
                try {
                    eval(eventObj1.script);
                } catch (e) {
                    console.log(e);
                }
            },
            //联动加载下级 val:如果根据id没取到this.formData中的值，则用val作为值。row：当前行数据
            linkageAddChilds(id, linkageId, linkageDataSource, linkageText, sqlConnId, val, row) {
                const value = this.formData[id] || (val || '');
                if (utils.length(value) === 0) {
                    return;
                }
                ajax.post('/Form/GetSelectChildOptions', qs.stringify({
                    value: value,//上级值
                    linkageDataSource: linkageDataSource,//数据源类型 dict,sql,string
                    linkageText: utils.decodeURI(linkageText), //数据源如为SQL的sql语句
                    sqlConnId: sqlConnId //数据连接id
                })).then((res) => {
                    if (row && row['key']) {
                        this.formSelectOptions[linkageId + '_' + row['key']] = res.data;
                    } else {
                        this.formSelectOptions[linkageId] = res.data;
                    }
                }).catch(() => { });
            },
            //子表添加行
            addSubtableRow(id, record) {
                if (!utils.isArray(this.formData[id])) {
                    this.formData[id] = new Array();
                }
                const defaultValue = this.formDefaultValues[id];
                if (utils.isDef(defaultValue)) {
                    let defaultValue1 = { key: utils.createGuid(false) };
                    for (var key in defaultValue) {
                        //如果是数组字符串,转换为数组格式，checbox等多选控件，默认值是数组。
                        if (utils.isString(defaultValue[key])) {
                            let val = utils.trim(defaultValue[key]);
                            if (val.substr(0, 1) == '[' && val.substr(val.length - 1) == ']') {
                                try {
                                    defaultValue1[key] = JSON.parse(val);
                                } catch {
                                    defaultValue1[key] = val;
                                }
                            } else {
                                defaultValue1[key] = val;
                            }
                        } else {
                            defaultValue1[key] = defaultValue[key];
                        }
                    }
                    if (utils.isDef(record)) {
                        //插入
                        for (let i = 0; i < this.formData[id].length; i++) {
                            if (this.formData[id][i].key == record.key) {
                                this.formData[id].splice(i + 1, 0, defaultValue1);
                                break;
                            }
                        }
                    } else {
                        this.formData[id].push(defaultValue1);
                    }
                }
            },
            //子表插入行
            insertSubtableRow(id, record) {
                this.addSubtableRow(id, record);
            },
            //子表删除行
            delSubtableRow(id, record) {
                utils.removeArrayObj(this.formData[id], record.key, 'key');
            },
            //子表计算合计
            getSummaries(data, isSubtable) {
                const columns = data.columns;
                //获取子表id
                //如果子表分了页这里传的data.data为当前页数据，所以要根据子表名去获取整个子表数据。
                let tableName = '';
                for (let i = 0; i < columns.length; i++) {
                    if (columns[i]['className'] == '1') {
                        tableName = columns[i]['labelClassName'];
                        break;
                    }
                }
                const tableData = utils.length(tableName) > 0 && utils.isDef(this.formData[tableName]) ? this.formData[tableName] : data.data;
                if (isSubtable) {
                    //子表
                    let sumArray = [];
                    if (columns.length > 0) {
                        console.log(columns[0]['className'])
                        let classNameArray = columns[0]['className'].split(';');
                        for (let i = 0; i < classNameArray.length; i++) {
                            let classNameArray1 = classNameArray[i].split(',');
                            let filed = classNameArray1[0];
                            let label = classNameArray1.length > 1 ? classNameArray1[1] : '';
                            if (utils.length(filed) === 0) {
                                continue;
                            }
                            let sum = 0;
                            for (let j = 0; j < tableData.length; j++) {
                                sum = utils.accAdd(sum, parseFloat(tableData[j][filed]) || 0);
                            }
                            sumArray.push(label + ': ' + sum);
                        }
                    }
                    return ['合计        ' + sumArray.join('        ')];
                }

                let sums = [];
                for (let i = 0; i < columns.length; i++) {
                    if (columns[i]['className'] == '1') {
                        let sum = 0;
                        for (let j = 0; j < tableData.length; j++) {
                            sum = utils.accAdd(sum, parseFloat(tableData[j][columns[i].property]) || 0);
                        }
                        sums[i] = sum;
                    } else if ((i === 0 || i === 1) && !utils.inArray(sums, '合计') && columns[i]['type'] !== 'index') {
                        //如果设置合计，并且不是序号列，则显示合计标题。
                        sums[i] = '合计';
                    } else {
                        sums[i] = '';
                    }
                }
                return sums;
            },
            //子表计算合计
            getSubtableSummaries(data) {
                return this.getSummaries(data, true);
            },
            //子表分页条数改变
            handleSizeChange(e, id) {
                let number = !utils.hasKey(this.subTablePagers, id) || utils.isUndef(this.subTablePagers[id]) ? 1 : this.subTablePagers[id]['number'] || 1;
                this.handleCurrentChange(number, id, e);
            },
            //子表分页页码改变 e-当前页码 id-子表id size-每页条数
            handleCurrentChange(e, id, size) {
                this.subTableLoading = true;
                if (!utils.hasKey(this.subTablePagers, id) || utils.isUndef(this.subTablePagers[id])) {
                    this.subTablePagers[id] = {};
                }
                const size1 = size || this.subTablePagers[id]['size'] || 10;
                this.subTablePagers[id]['number'] = e;//记录当前页码
                this.subTablePagers[id]['size'] = size1;//每页条数
                if (e === 1) {
                    this.subTablePagers[id]['start'] = 0;
                    this.subTablePagers[id]['end'] = size1;
                    this.subTableLoading = false;
                    return;
                }
                this.subTablePagers[id]['start'] = e * size1 - size1;
                this.subTablePagers[id]['end'] = e * size1;
                this.subTableLoading = false;
            },
        },
        template: '<div>' + data.form.html + '</div>',
    };
    app.component(componentId, component);
    formComponentId.value = componentId;
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
//执行流程，type：执行类型， steps：发送或退回等操作的接收步骤
const executeFlow = (type, steps) => {
    let task = ref(JSON.parse(localStorage.getItem('task')))
    const id = ref('')
    const formtype = ref('')
    if (task.value != null) {
        id.value = task.value.formid
        formtype.value = task.value.formtype
    }
    butDisabled.value = true;
    loading.value = true;
    const json = {
        type: type,
        flowId: flowId,
        stepId: stepId,
        taskId: taskId,
        groupId: groupId,
        instanceId: instanceId,
        isMobile: isMobile,
        steps: steps || [],
        comment: step.value.comment,
        attachment: step.value.attachment,
        sign: step.value.sign
    };
    //如果要归档，要把下拉选项相关值提交到后台。
    if (step.value.archive == 1) {
        form.value.formData['archiveFormSelectOptions'] = form.value.formSelectOptions;
    }
    //判断符合条件的序列号
    if (utils.hasKey(form.value.formData, 'serialNumber') && utils.length(form.value.formData['serialNumber']) > 0) {
        for (let i = 0; i < form.value.formData['serialNumber'].length; i++) {
            let serialNumberi = form.value.formData['serialNumber'][i];
            let serialNumberRemove = [];
            for (let j = 0; j < serialNumberi['serials'].length; j++) {
                let serialData = serialNumberi['serials'][j]['data'];
                //如果数据条件为空，表示满足。
                if (utils.length(serialData) === 0) {
                    continue;
                }
                //if (serialData.indexOf('return') === -1) {
                //    serialData = "return " + serialData;
                //}
                //try {
                let fun = new Function('formData', serialData);
                let funResult = fun(form.value.formData);
                if (!funResult) {
                    serialNumberRemove.push(j);
                }
                //} catch (e) {
                //    continue;
                //}
            }
            for (let j = 0; j < serialNumberRemove.length; j++) {
                serialNumberi['serials'].splice(serialNumberRemove[j], 1);
            }
        }
    }
    ajax.post('/Flow/FlowExecut?srcorgid=' + sobInfo.value.id + queryString, qs.stringify({ id: id.value, formtype: formtype.value, json: JSON.stringify(json), formData: JSON.stringify(form.value.formData) })).then((res) => {
        if (res.success) {
            task = ''
            localStorage.removeItem('task')
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
        butDisabled.value = false;
        loading.value = false;
    }).catch(() => {
        butDisabled.value = false;
        loading.value = false;
    });
};
//保存
const save = async () => {
    //utils.length(programId) > 0表示应用程序设计编辑保存
    const type = utils.length(programId) > 0 || utils.length(formId) > 0 ? 'SaveProgram' : 'Save';
    if (form.value.type == 0) {
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
                executeFlow(type);
            } else {
                utils.msg('表单验证错误，请检查表单必填项等信息！', false);
            }
        });
    } else if (form.value.type == 1) {
        //自定义表单
        const customFormRef = roadComponentFormRef.value.$refs['customFormRef'];
        await customFormRef.validate((valid) => {
            if (valid) {
                executeFlow(type);
            } else {
                utils.msg('表单验证错误，请检查表单必填项等信息！', false);
            }
        });
    } else {
        executeFlow(type);
    }
};
//发送
const send = async () => {
    if (form.value.type == 0) {
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
    } else if (form.value.type == 1) {
        //自定义表单
        const customFormRef = roadComponentFormRef.value.$refs['customFormRef'];
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
    dialogQuery.value = queryString;
    dialogPage.value = FlowSend;
    dialogTitle.value = '确认接收步骤';
    dialogWidth.value = '1' == isMobile ? '350px' : '600px';
    dialogClass.value = '';
    dialogCenter.value = true;
    dialogShow.value = true;
};
//确定发送
const sendOk = (steps) => {
    executeFlow('Submit', steps);
};
//退回
const back = () => {
    //检查如果要签意见，是否签意见和签章
    if (step.value.signType > 0 && utils.length(step.value.comment) === 0) {
        utils.msg('请填写处理意见！', false);
        return;
    }
    if (step.value.signType >= 2 && step.value.sign == 0) {
        if (step.value.signType == 3) {
            //如果要输入密码签章，则弹出输入密码窗口。
            sign(2);
        } else {
            utils.msg('请签章！', false);
        }
        return;
    }
    dialogQuery.value = queryString;
    dialogPage.value = FlowBack;
    dialogTitle.value = '确认退回步骤';
    dialogWidth.value = '1' == isMobile ? '350px' : '600px';
    dialogClass.value = '';
    dialogCenter.value = true;
    dialogShow.value = true;
};
//确定退回
const backOk = (steps) => {
    executeFlow('Back', steps);
};
//处理过程
const process = () => {
    dialogQuery.value = queryString;
    dialogPage.value = FlowProcess;
    dialogTitle.value = '处理过程';
    dialogWidth.value = '1' == isMobile ? '350px' : '1150px';
    dialogClass.value = 'el-dialog__padding';
    dialogCenter.value = false;
    dialogShow.value = true;
};
//流程图
const flowChart = () => {
    dialogQuery.value = queryString;
    dialogPage.value = FlowChart;
    dialogTitle.value = '流程图';
    dialogWidth.value = '1' == isMobile ? '350px' : '1150px';
    dialogClass.value = 'el-dialog__padding';
    dialogCenter.value = true;
    dialogShow.value = true;
};
//签章 action：是否是点发送或退回验证时弹出的签章 1:发送 2:退回
const sign = (action) => {
    if (step.value.signType == 3 && step.value.sign == 0) {
        //需要输入密码
        dialogQuery.value = queryString + '&signaction=' + (action || '0');
        dialogPage.value = FlowSignPassword;
        dialogTitle.value = '输入签章密码';
        dialogWidth.value = '1' == isMobile ? '350px' : '400px';
        dialogClass.value = '';
        dialogCenter.value = true;
        dialogShow.value = true;
        return;
    }
    //不需要密码，直接签章
    step.value.sign = 1;
};
//抄送已阅知
const known = () => {
    executeFlow('Known', []);
};
//指定后续步骤处理人
const setHandler = () => {
    if (utils.length(taskId) === 0) {
        utils.msg('请先保存再指定处理人！', false);
        return;
    }
    dialogQuery.value = queryString;
    dialogPage.value = FlowSetHandler;
    dialogTitle.value = '指定后续步骤处理人';
    dialogWidth.value = '1' == isMobile ? '350px' : '600px';
    dialogClass.value = '';
    dialogCenter.value = true;
    dialogShow.value = true;
};
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
//关闭
const close1 = () => {
    //移动端关闭
    if ('1' == isMobile) {
        //app
        if ('1' == isApp) {
            window.parent.postMessage({ msg: 'close' }, '*');
            return;
        }
        indexm_backpage();
        return;
    }
    //邮件,弹出窗口连接待办直接关闭窗口
    if ('1' == isEmail || '2' == openMode || '3' == openMode) {
        window.close();
        return;
    }
    //应用程序设计编辑窗口关闭
    if (utils.length(programId) > 0 || utils.length(formId) > 0) {
        if (utils.isDef(programrun_programcomponentref) && utils.isDef(programrun_programcomponentref.value)) {
            //当前表单ElForm的label-width属性为auto时，关闭窗口会有错误警告。label-width设置为固定宽度时就没有警告。
            programrun_programcomponentref.value.dialogShow = false;
        } else {
            //直接保存表单的关闭
            switch (openMode) {
                case '0':
                    index_removetab();
                    break;
                case '1':
                    if (utils.isDef(index_dialogshow) && utils.isDef(index_dialogshow.value)) {
                        index_dialogshow.value = false;
                    }
                    break;
                case '2':
                case '3':
                    window.close();
                    break;
            }
        }
        return;
    } else if ('1' == openMode) {
        //如果是弹出层处理流程
        if (utils.isDef(index_dialogshow.value)) {
            index_dialogshow.value = false;
        }
        return;
    }
    //关闭当前标签
    index_removetab();
};
//打印
const print1 = () => {
    if ('1' == isMobile) {
        window.print();
        return;
    }
    if (form.value.type == 0) {
        window.localStorage.setItem('flow_print_selectOptions', JSON.stringify(form.value.formSelectOptions));
        window.localStorage.setItem('flow_print_html', form.value.html);
        window.localStorage.setItem('flow_print_formData', JSON.stringify(form.value.formData));
        window.localStorage.setItem('flow_print_fieldStatus', JSON.stringify(step.value.fieldStatus));
        window.localStorage.setItem('flow_print_comments', JSON.stringify(form.value.commentStepList));
        let showComment = utils.length(programId) > 0 ? 0 : step.value.showComment;//是否要在打印页面显示意见
        let url = '?loadurl=' + encodeURIComponent('/flow/archive/print?isflowrun=1&showcomment=' + showComment);
        utils.open(url, 1000, 600, '打印');
    } else if (form.value.type == 1) {
        //点了打印按钮就直接打印，customformprint下面加载页面传的参数。
        if ('1' === utils.query('customformprint', props.query)) {
            window.print();
            return;
        }
        //自定义表单打印
        let url = '?loadurl=' + encodeURIComponent('/flow/run/index.vue?flowid=' + flowId + '&stepid=' + stepId + '&taskid=' + taskId + '&instanceid=' + instanceId + '&display=1&openmode=2&customformprint=1');
        utils.open(url, 1000, 600, '打印');
    }
};
//催办
const urge = () => {
    dialogQuery.value = queryString;
    dialogPage.value = FlowUrge;
    dialogTitle.value = '任务催办';
    dialogWidth.value = '1' == isMobile ? '350px' : '680px';
    dialogClass.value = '';
    dialogCenter.value = true;
    dialogShow.value = true;
};
//撤回
const withdraw = () => {
    utils.confirm('您确定要撤回吗？', () => {
        executeFlow('Withdraw', []);
    });
};
//暂缓
const postpone = () => {
    utils.confirm('您确定要暂缓吗？', () => {
        executeFlow('Postpone', []);
    });
};
//终止
const end = () => {
    utils.confirm('您确定要终止吗？', () => {
        executeFlow('End', []);
    });
};
//抄送
const copyfor = () => {
    dialogQuery.value = queryString;
    dialogPage.value = FlowCopyfor;
    dialogTitle.value = '抄送';
    dialogWidth.value = '1' == isMobile ? '350px' : '500px';
    dialogClass.value = '';
    dialogCenter.value = true;
    dialogShow.value = true;
};
//抄送提交
const copyforOk = (steps) => {
    executeFlow('Copyfor', steps);
};
//征求意见
const solicitOpinions = () => {
    dialogQuery.value = queryString;
    dialogPage.value = FlowSolicitOpinions;
    dialogTitle.value = '征求意见';
    dialogWidth.value = '1' == isMobile ? '350px' : '680px';
    dialogClass.value = 'el-dialog__padding';
    dialogCenter.value = false;
    dialogShow.value = true;
};
//征求意见提交
const solicitOpinionsOk = (steps) => {
    executeFlow('Solicitopinion', steps);
};
//回复别人征求的意见
const reply = () => {
    //检查如果要签意见，是否签意见和签章
    if (utils.length(step.value.comment) === 0) {
        utils.msg('请填写回复意见！', false);
        return;
    }
    executeFlow('Reply', []);
};
//转交
const redirect = () => {
    dialogQuery.value = queryString;
    dialogPage.value = FlowRedirect;
    dialogTitle.value = '转交';
    dialogWidth.value = '1' == isMobile ? '350px' : '500px';
    dialogClass.value = '';
    dialogCenter.value = true;
    dialogShow.value = true;
};
//转交提交
const redirectOk = (steps) => {
    executeFlow('Redirect', steps);
};
//加签
const addWrite = () => {
    dialogQuery.value = queryString;
    dialogPage.value = FlowAddWrite;
    dialogTitle.value = '加签';
    dialogWidth.value = '1' == isMobile ? '350px' : '650px';
    dialogClass.value = '';
    dialogCenter.value = true;
    dialogShow.value = true;
};
//加签提交
const addWriteOk = (steps) => {
    executeFlow('AddWrite', steps);
};
//步骤内循环发送
const freeSend = async () => {
    if (form.value.type == 0) {
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
                freeSendShow();
            } else {
                utils.msg('表单验证错误，请检查表单必填项等信息！', false);
            }
        });
    } else if (form.value.type == 1) {
        //自定义表单
        const customFormRef = roadComponentFormRef.value.$refs['customFormRef'];
        await customFormRef.validate((valid) => {
            if (valid) {
                freeSendShow();
            } else {
                utils.msg('表单验证错误，请检查表单必填项等信息！', false);
            }
        });
    } else {
        freeSendShow();
    }
};
//步骤内发送窗口
const freeSendShow = () => {
    //检查如果要签意见，是否签意见和签章
    if (step.value.signType > 0 && utils.length(step.value.comment) === 0) {
        utils.msg('请填写处理意见！', false);
        return;
    }
    if (step.value.signType >= 2 && step.value.sign == 0) {
        if (step.value.signType == 3) {
            //如果要输入密码签章，则弹出输入密码窗口。
            sign(3);
        } else {
            utils.msg('请签章！', false);
        }
        return;
    }
    dialogQuery.value = queryString + '&freesend=1';
    dialogPage.value = FlowSend;
    dialogTitle.value = '步骤内发送';
    dialogWidth.value = '1' == isMobile ? '350px' : '600px';
    dialogClass.value = '';
    dialogCenter.value = true;
    dialogShow.value = true;
};
//步骤内循环发送确认
const freeSendOk = (steps) => {
    executeFlow('FreeSubmit', steps);
};
//完成
const completed = async () => {
    if (form.value.type == 0) {
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
                completedOk();
            } else {
                utils.msg('表单验证错误，请检查表单必填项等信息！', false);
            }
        });
    } else if (form.value.type == 1) {
        //自定义表单
        const customFormRef = roadComponentFormRef.value.$refs['customFormRef'];
        await customFormRef.validate((valid) => {
            if (valid) {
                completedOk();
            } else {
                utils.msg('表单验证错误，请检查表单必填项等信息！', false);
            }
        });
    } else {
        completedOk();
    }
};
const completedOk = () => {
    //检查如果要签意见，是否签意见和签章
    if (step.value.signType > 0 && utils.length(step.value.comment) === 0) {
        utils.msg('请填写处理意见！', false);
        return;
    }

    if (step.value.signType >= 2 && step.value.sign == 0) {
        if (step.value.signType == 3) {
            //如果要输入密码签章，则弹出输入密码窗口。
            sign(4);
        } else {
            utils.msg('请签章！', false);
        }
        return;
    }
    utils.confirm('您确定要完成吗？', () => {
        executeFlow('Submit', []);
    });
};

provide('flowrun_step', step);
provide('flowrun_form', form);
provide('flowrun_sign', sign);
provide('flowrun_send', send);
provide('flowrun_sendok', sendOk);
provide('flowrun_freesend', freeSend);
provide('flowrun_freesendok', freeSendOk);
provide('flowrun_back', back);
provide('flowrun_backok', backOk);
provide('flowrun_addwriteok', addWriteOk);
provide('flowrun_solicitopinionsok', solicitOpinionsOk);
provide('flowrun_copyforok', copyforOk);
provide('flowrun_redirectok', redirectOk);
provide('flowrun_dialogshow', dialogShow);

//以下provide是为了build后能够eval，实际其他地方没有调用到。
provide('flowrun_save', save);
provide('flowrun_process', process);
provide('flowrun_flowchart', flowChart);
provide('flowrun_known', known);
provide('flowrun_sethandler', setHandler);
provide('flowrun_close1', close1);
provide('flowrun_print1', print1);
provide('flowrun_withdraw', withdraw);
provide('flowrun_postpone', postpone);
provide('flowrun_end', end);
provide('flowrun_copyfor', copyfor);
provide('flowrun_solicitopinions', solicitOpinions);
provide('flowrun_reply', reply);
provide('flowrun_redirect', redirect);
provide('flowrun_addwrite', addWrite);
provide('flowrun_urge', urge);
provide('flowrun_completed', completed);

provide('roadcomponentformref', roadComponentFormRef);
</script>