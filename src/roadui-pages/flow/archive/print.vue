<template>
    <div>
        <div class="roadui_noprint" style="margin:10px 0 0 12px">
            <el-button @click="print1" type="primary">打印</el-button>
            <el-button @click="close1">关闭</el-button>
            <el-checkbox v-if="showComment" style="margin-left:10px;vertical-align:middle;" v-model="printComment">打印处理意见</el-checkbox>
        </div>
        <div>
            <component :is="page"></component>
        </div>
        <div v-if="printComment">
            <!--意见-->
            <div v-for="comment in comments" :key="comment.id">
                <table class="roadui_commenttable" v-if="utils.length(comment.completedTime)>0">
                    <tr>
                        <td>
                            <el-space :size="20">
                                <span>{{comment.receiverName}}</span>
                                <span>{{comment.stepName}}</span>
                                <span>{{comment.receiveTime}} - 接收</span>
                                <span>{{comment.completedTime}} - {{utils.getTaskHadleTitle(comment.handleType)}}</span>
                            </el-space>
                        </td>
                    </tr>
                    <tr v-if="utils.length(comment.comment)>0">
                        <td>
                            <div>
                                <span style="margin-right:15px;display:inline-block;vertical-align:middle;">{{comment.comment}}</span>
                                <el-usersign v-if="comment.isSign==1" :sign="utils.length(comment.sign)>0?comment.sign:comment.receiverName"></el-usersign>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="utils.length(comment.attachment)>0">
                        <td>
                            <span style="margin-right:12px;vertical-align:middle;">附件</span>
                            <el-space :size="20">
                                <span v-for="(file,index) in comment.attachment" :key="file.id">
                                    <el-link @click="utils.showFile(index_openmenu, file, config.SERVER_WEBADDRESS);">{{++index}}、{{file.name}}</el-link>
                                </span>
                            </el-space>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>


<script setup>
    import '../../../roadui-assets/print.css';
    import { ref, inject, onMounted, onUnmounted } from 'vue';
    import dayjs from 'dayjs';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const index_openmenu = inject('index_openmenu');
    const app = inject('app');
    const ElSelectdict = inject('ElSelectdict');
    const ElSelectorg = inject('ElSelectorg');
    const ElSelectfile = inject('ElSelectfile');
    const ElCkeditor = inject('ElCkeditor');
    const ElUsersign = inject('ElUsersign');
    const ElSelectdiv = inject('ElSelectdiv');
    const config = inject('config');
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const archiveId = utils.query('archiveid', props.query);

    const loadUrl = utils.query('loadurl');
    const isFlowRun = '1' == utils.query('isflowrun', loadUrl);//流程处理过程中的打印
    const showComment = '1' == utils.query('isflowrun', loadUrl) ? '1' == utils.query('showcomment', loadUrl) : true;//流程处理中的打印，步骤上设置的是否显示意见。
    const printComment = ref(true);//是否打印处理意见
    var isMobile = utils.query('ismobile', props.query);//是否是移动端
    
    const comments = ref([]);
    const fieldStatus = ref({});
    const page = ref(null);

    onMounted(() => {
        loadData();
    });

    onUnmounted(() => {
        clearLocalStorage();
    });

    const loadData = () => {
        if (isFlowRun) {
            const formSelectOptions = JSON.parse(window.opener.localStorage.getItem('flow_print_selectOptions'));
            const html = window.opener.localStorage.getItem('flow_print_html');
            const formData = JSON.parse(window.opener.localStorage.getItem('flow_print_formData'));
            fieldStatus.value = JSON.parse(window.opener.localStorage.getItem('flow_print_fieldStatus'));
            comments.value = JSON.parse(window.opener.localStorage.getItem('flow_print_comments'));
            const data = { formData: formData, formSelectOptions: formSelectOptions, html: html };
            regComponent(data);
            return;
        }
        ajax.post('/FlowArchive/GetShow?archiveid=' + archiveId).then((res) => {
            if (res.success) {
                comments.value = res.data.comments;
                regComponent(res.data);
            } else {
                utils.msg('加载错误！', false);
            }
        }).catch(() => { });
    };

    const regComponent = (data) => {
        const component = {
            components: {
                'el-selectdict': ElSelectdict,
                'el-selectorg': ElSelectorg,
                'el-selectfile': ElSelectfile,
                'el-ckeditor': ElCkeditor,
                'el-usersign': ElUsersign,
                'el-selectdiv': ElSelectdiv,
            },
            data() {
                return {
                    formData: data.formData,
                    formSelectOptions: data.formSelectOptions,
                    formRules: {},
                    formRulesSubtable: {},
                    formLabelPosition: 'left',//表单标签对齐'left'|'right'|'top'
                    formSign: '',//签章
                    isMobile: data.isMobile == '1',//是否是移动端
                    utils: utils,//utils工具，方便代码中调用
                    roadflowFormRef: ref(null),
                    subTablePagers: {},//子表分页
                    subTableLoading: false,
                };
            },
            computed: {
                //得到字段状态
                getFieldStatus() {
                    return function (id) {
                        //如果没有设置字段状态，则返回只读。
                        if (utils.length(id) === 0 || utils.length(fieldStatus.value) === 0) {
                            return 1;
                        }
                        const f = fieldStatus.value[id];
                        const status = utils.isDef(f) ? f.status : 0;
                        //如果不是隐藏则返回只读。
                        return status != 2 ? 1 : 2;
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
                    return function () {
                        return true;
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
            mounted() {

            },
            methods: {
                //子表计算合计
                getSummaries(data) {
                    const columns = data.columns;
                    const tableData = data.data;
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
            },
            template: data.html
        };
        const componentId = 'flow_archive_' + utils.createGuid(false);
        app.component(componentId, component);
        page.value = componentId;
    };

    const print1 = () => {
        window.print();
    };

    const close1 = () => {
        clearLocalStorage();
        window.close();
    };

    const clearLocalStorage = () => {
        window.opener.localStorage.removeItem('flow_print_selectOptions');
        window.opener.localStorage.removeItem('flow_print_html');
        window.opener.localStorage.removeItem('flow_print_formData');
        window.opener.localStorage.removeItem('flow_print_comments');
        window.opener.localStorage.removeItem('flow_print_fieldStatus');
    }
</script>