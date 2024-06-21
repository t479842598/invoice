<template>
    <div class="roadui_page">
        <!--只显示列表-->
        <div v-if="showType === 0" style="width: 100%; height: inherit;">
            <component ref="programComponentRef" :is="programComponentId" :query="programComponentQuery" />
        </div>
        <!--只显示图表-->
        <div v-else-if="showType === 1" id="programDiv_chart" style="width: 100%; height: inherit;">
            <component ref="programComponentRef_chart" :is="programComponentId_Chart"
                :query="programComponentQuery_Chart" />
        </div>
        <div v-else style="width: 100%; height: inherit; overflow: auto;">
            <el-tabs v-model="activeName" @tab-click="tabClick" style="width: 100%;" id="programDiv_chart">
                <el-tab-pane :label="listLabel" name="list">
                    <component ref="programComponentRef" :is="programComponentId" :query="programComponentQuery" />
                </el-tab-pane>
                <el-tab-pane :label="chartLabel" name="chart">
                    <component ref="programComponentRef_chart" :is="programComponentId_Chart"
                        :query="programComponentQuery_Chart" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script setup>
import Loading from '../../loading.vue';
import Error from '../../error.vue';
import { ref, inject, onMounted, onUnmounted, defineAsyncComponent, provide } from 'vue';
const ajax = inject('ajax');
const utils = inject('utils');
const qs = inject('qs');
const app = inject('app');
const config = inject('config');
const index_openmenu = inject('index_openmenu');
const index_regcomponent = inject('index_regcomponent');
const index_dialogshow = inject('index_dialogshow');
const ElSelectdict = inject('ElSelectdict');
const ElSelectorg = inject('ElSelectorg');
const props = defineProps({ query: { type: String, default: () => { return ''; } } });
const programId = utils.query('programid', props.query);
const programComponentId = ref(null);
const programComponentQuery = ref('');
const programComponentRef = ref(null);
const dialogButtons = ref([]);

const isSelectDiv = '1' == utils.query('isselectdiv', props.query);
const selectdiv_dialogshow = isSelectDiv ? inject('selectdiv_dialogshow') : null;
const selectdiv_ok = isSelectDiv ? inject('selectdiv_ok') : null;
const selectdiv_selectvalues = isSelectDiv ? inject('selectdiv_selectvalues') : null;
const propsQueryString = utils.getQuery(props.query);

//显示图表新增
import * as echarts from 'echarts';
const activeName = ref('list');//当前活动标题
const showType = ref(0);//显示类型
const listLabel = ref('列表');
const chartLabel = ref('图表');
const programComponentId_Chart = ref(null);
const programComponentQuery_Chart = ref('');
const programComponentRef_chart = ref(null);
const resData = ref({});//加载VUE模板数据
const listData = ref([]);//列表数据，getRunData数据。

onMounted(() => {
    load();
});

//标签点击事件
const tabClick = (tab) => {
    const name = tab.props.name;
    if (name === 'list') {
        if (utils.isUndef(programComponentId.value)) {
            regList(resData.value);
        }
    } else if (name === 'chart') {
        if (utils.isUndef(programComponentId_Chart.value)) {
            regChart(resData.value);
        }
    }
};

const load = () => {
    ajax.post('/Program/GetRun?' + propsQueryString + '&iselement=1').then((res) => {
        resData.value = res;
        if (res.success) {
            //列表和图表显示类型
            showType.value = utils.hasKey(res.data, 'chart') && utils.hasKey(res.data['chart'], 'showType') ? res.data['chart']['showType'] || 0 : 0;
            //设置列表和图表默认显示标签，如果显示类型设置的是默认显示图表。
            if (showType.value === 3) {
                activeName.value = 'chart';
            }
            //设置tab标签
            if (utils.hasKey(res.data, 'chart') && utils.length(res.data['chart']['listLabel']) > 0) {
                listLabel.value = res.data['chart']['listLabel'];
            }
            if (utils.hasKey(res.data, 'chart') && utils.length(res.data['chart']['chartLabel']) > 0) {
                chartLabel.value = res.data['chart']['chartLabel'];
            }
            switch (showType.value) {
                case 0:
                case 2:
                    regList(res);
                    break;
                case 1:
                case 3:
                    regChart(res);
                    break;
            }
        }
    }).catch(() => { });
};

//注册列表
const regList = (res) => {
    const componentId = 'roadflow_program_' + utils.createGuid(false);
    const component = {
        components: { 'el-selectdict': ElSelectdict, 'el-selectorg': ElSelectorg, },
        data() {
            return {
                butDisabled: false,
                loading: false,
                id: res.data.id,//应用id
                applibraryId: res.data.applibraryId, //应用对应的表单应用id
                selectOptions: res.data.selectOptions,//下拉选项
                buttonScripts: res.data.buttonScripts,//按钮脚本
                buttonLangs: res.data.buttonLangs,//按钮语言
                buttonLangField: 'name',//当前按钮语言
                // buttonLangField: utils.getTitleField(null, 'name'),//当前按钮语言
                selectRows: [],//选择行
                selectColumn: res.data.selectColumn,//选择方式 0：不能选择 1：单选，2：多选
                buttonShow: res.data.buttonShow,//按钮显示
                buttonShowScripts: res.data.buttonShowScripts,//判断按钮是否显示的脚本
                formData: res.data.formDataDefaultValue || {},
                tableData: [],
                summarySubSum: [],//小计数据
                summarySum: [],//合计数据
                pager: utils.getPager({}),
                defaultOrder: {},
                utils: utils,
                sysConfig: config,
                indexOpenMenu: index_openmenu,
                propsQueryString: propsQueryString,

                //编辑窗口
                dialogFormUrl: res.data.modalFormUrl,//编辑窗口地址
                dialogShow: false,
                dialogWidth: utils.toNumber(res.data.modalWidth, 900) + 'px',//编辑窗口宽度,
                dialogTitle: '',
                dialogPage: null,
                dialogQuery: '',
                dialogButtons: dialogButtons.value,//按钮
                dialogShowTitle: false,//是否显示弹出窗口的标题栏
                dialogCloseOnPressEscape: false,//是否可按esc关闭弹出窗口
                dialogCloseOnClickModal: false, //是否可以点击遮罩层关闭窗口

                //导入窗口
                importDialogShow: false,
                importDialogTitle: '导入',
                importDialogButtonTitle: '选择文件',
                importLoading: false,
            };
        },
        mounted() {
            this.$nextTick(() => {
                this.loadData(true);
                //执行页面脚本
                if (utils.length(res.data.clientScripts) > 0) {
                    eval(res.data.clientScripts);
                }
            });
        },
        computed: {},
        methods: {
            //isQuery：是否是点的查询按钮
            loadData(isQuery) {
                if (isQuery && res.data.isPager) {
                    this.pager.number = 1;
                }
                this.butDisabled = true;
                this.formData.size = res.data.isPager ? this.pager.size : 10000000;
                this.formData.number = this.pager.number;
                this.formData.order = this.pager.order;

                ajax.post('/Program/GetRunData?' + propsQueryString + '&iselement=1', qs.stringify(this.formData)).then((res) => {
                    if (res.success) {
                        this.summarySubSum = res.data.subSum;
                        this.summarySum = res.data.sum;
                        this.tableData = res.data.rows;
                        listData.value = res.data.rows;
                        this.pager.total = res.data.total;
                        this.initSelection();
                        //如果设置了图表数据变化则要重新加载图表。
                        if (isQuery && programComponentId_Chart.value && showType.value > 1) {
                            regChart(resData.value);
                        }
                    } else {
                        let msg = '';
                        switch (res.code) {
                            case 1:
                                msg = '未找到对应的应用！';
                                break;
                        }
                        utils.msg(msg, false);
                    }
                    this.butDisabled = false;
                }).catch(() => { this.butDisabled = false; });
            },
            //初始已选择的行
            initSelection() {
                if (!isSelectDiv || utils.length(selectdiv_selectvalues.value) === 0) {
                    return;
                }
                const tableRef = this.$refs['programTableRef_' + this.id];
                if (utils.isUndef(tableRef)) {
                    return;
                }
                //tableRef.clearSelection();
                const array = selectdiv_selectvalues.value.split(',');
                for (let i = 0; i < array.length; i++) {
                    const row = utils.getArrayObj(this.tableData, array[i], 'id');
                    if (utils.isUndef(row)) {
                        continue;
                    }
                    tableRef.toggleRowSelection(row, true);
                }
            },
            //清空选择行
            clearSelection() {
                const tableRef = this.$refs['programTableRef_' + this.id];
                if (utils.isUndef(tableRef)) {
                    return;
                }
                tableRef.clearSelection();
            },
            //选择行
            handleSelectionChange(val) {
                this.selectRows = val;
            },
            //行点击，单选
            rowClick(row) {
                //2022-9-15增加判断，如果不是弹出选择，单击不选择行。避免点了行点击后点删除选择按钮判断有选择行。
                if (!isSelectDiv) {
                    return;
                }
                this.selectRows = [];
                this.selectRows.push(row);
            },
            //行双击
            rowDblClick(row) {
                //2022-9-15增加判断，如果不是弹出选择，双击不选择行。避免点了行点击后点删除选择按钮判断有选择行。
                if (!isSelectDiv) {
                    return;
                }
                this.selectRows = [];
                this.selectRows.push(row);
                //如果是弹出层选择，直接直接选择。
                this.confirmSelect();
            },
            //排序
            sortChange(order) {
                this.pager.order = utils.getOrder(order);
                this.loadData(false);
            },
            //每页条数改变
            handleSizeChange(size) {
                this.pager.size = size;
                this.loadData(false);
            },
            //页码改变
            handleCurrentChange(number) {
                this.pager.number = number;
                this.loadData(false);
            },
            //执行按钮脚本
            execButtonScript(id, row) {
                const scripts = this.buttonScripts[id];
                if (utils.length(scripts) === 0) {
                    return row;
                }
                eval(scripts);
            },
            //判断按钮是否显示
            getButtonShow(id, row) {
                const scripts = utils.hasKey(this.buttonShowScripts, id) ? this.buttonShowScripts[id] : '';
                if (utils.length(scripts) === 0) {
                    return true || row == undefined;
                } else {
                    try {
                        return eval(scripts);
                    } catch (e) {
                        console.log(e);
                        return false;
                    }
                }
            },
            //编辑 row：编辑的行数据，如果是新增为null display：是否只读显示 0否 1是（查看时为1）other：其他参数
            edit(row, display, other) {
                if (utils.length(this.dialogFormUrl) === 0) {
                    return;
                }
                const pageArray = this.dialogFormUrl.split('?');
                const page = pageArray[0];
                const componentId = 'program_form_' + utils.createGuid(false);
                var queryString = pageArray.length > 1 ? '?' + pageArray[1] : '?a=1';
                if (utils.isDef(row)) {
                    //编辑
                    queryString += '&instanceid=' + (row['id'] || '') + '&display=' + (display || '0');
                    this.dialogTitle = '';
                } else {
                    //添加
                    this.dialogTitle = '';
                }
                //const url1 = './roadui-pages' + (utils.startWith(page, '/') ? '' : '/') + page + (utils.endWith(page, '.vue') ? '' : '.vue');
                //const isComponent = utils.isDef(app._context.components[componentId]);//检查是否已经注册
                //if (!isComponent) {
                //    const c = defineAsyncComponent({
                //        loader: utils.systemModules[url1], //() => import(/*@vite-ignore*/`${url1}`), //加载函数 /*@vite-ignore*/这个是为了消除vite警告：then above dynamic import cannot be analyzed by vite
                //        loadingComponent: Loading,//加载异步组件时使用的组件
                //        delay: 200,//展示加载组件前的延迟时间，默认为 200ms
                //        errorComponent: Error,//加载失败后展示的组件
                //    });
                //    app.component(componentId, c);
                //}
                //注释上面的，启用index_regcomponent是解决发布后正式环境点生成程序菜单会抖动问题。
                index_regcomponent(componentId, page);
                this.dialogPage = componentId;
                this.dialogQuery = queryString + '&' + (other || '');
                this.dialogShow = true;
            },
            //删除 row：要删除的行数据（列表删除按钮时传），如果不传则表示是常规按钮删除所选行。
            del(row) {
                console.log(this.selectRows)
                const ids = utils.isDef(row) ? [row['id']] : utils.getArrayValues(this.selectRows, 'id');
                console.log(ids)
                if (ids.length === 0) {
                    utils.msg('您没有选择要删除的数据！', false);
                    return;
                }
                utils.confirm('您确定要删除所选数据吗？', () => {
                    this.butDisabled = true;
                    ajax.post('/Program/DeleteData?programid=' + this.id + '&applibraryid=' + this.applibraryId, qs.stringify({ ids: ids.join(',') })).then((res) => {
                        let msg = '';
                        switch (res.code) {
                            case 0:
                                msg = '删除成功！';
                                break;
                            case 1:
                                msg = '应用未设置表单！';
                                break;
                            default:
                                msg = '删除失败！';
                                break;
                        }
                        utils.msg(msg, res.success);
                        this.butDisabled = false;
                        if (res.success) {
                            this.loadData(false);
                            this.clearSelection();//重置选择行。
                            this.selectRows = [];
                        }
                    }).catch(() => { });
                });
            },
            //隐藏dialog标题
            hiddenHeader() {
                if (!this.dialogShowTitle) {
                    this.$refs['programComponentDialogRef'].$refs['dialogContentRef'].$refs['headerRef'].hidden = true;
                }
            },
            //导出excel
            exportExcel() {
                const form = this.$refs['program_exportform'];
                //将查询条件提交到后台
                for (var key in this.formData) {
                    var input = document.getElementById(key);
                    if (utils.isUndef(input)) {
                        input = document.createElement("input");
                        input.setAttribute("type", "hidden");
                        input.setAttribute("name", key);
                        input.setAttribute("id", key);
                        form.appendChild(input);
                    }
                    input.value = this.formData[key];
                }
                //将选择行提交到后台，如果有选择行，则只导出选择行。
                var selectRowsInput = document.getElementById("exportSelectRows");
                if (utils.isUndef(selectRowsInput)) {
                    selectRowsInput = document.createElement("input");
                    selectRowsInput.setAttribute("type", "hidden");
                    selectRowsInput.setAttribute("name", "exportSelectRows");
                    selectRowsInput.setAttribute("id", "exportSelectRows");
                    form.appendChild(selectRowsInput);
                }
                selectRowsInput.value = utils.getArrayValues(this.selectRows, "id").join(',');
                form.submit();
            },
            //导入excel数据
            importExcel() {
                this.importDialogShow = true;
            },
            //导入上传前检查文件格式。
            beforeAvatarUpload(rawFile) {
                //console.log(rawFile.type)
                if (rawFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    && rawFile.type !== 'application/vnd.ms-excel') {
                    utils.msg('要导入的文件必须是excel格式文件!', false);
                    return false;
                }
                this.importLoading = true;
                return true;
            },
            //导入上传成功
            handleAvatarSuccess(response, uploadFile) {
                if (uploadFile.status === 'success') {
                    let code = response.code;
                    if (code == 401) {
                        //登录失效

                    }
                    if (code != 0) {
                        utils.msg('文件上传失败！', false);
                        return;
                    }
                    const fileId = response.data.id;
                    ajax.post('/Program/ImportExcel', qs.stringify({ files: fileId, programId: this.id })).then((res) => {
                        let msg = res.msg;
                        if (utils.length(msg) === 0) {
                            if (res.success) {
                                msg = '导入成功！';
                            } else if (res.code == 1) {
                                msg = '要导入的文件不存在！';
                            } else if (res.code == 2) {
                                msg = '未找到程序运行时！';
                            } else if (res.code == 3) {
                                msg = '未设置要导入的表！';
                            } else if (res.code == 4) {
                                msg = '未设置数据连接！';
                            } else if (res.code == 5) {
                                msg = '导入发生错误！请联系管理员！';
                            } else {
                                msg = '导入失败！';
                            }
                        }
                        utils.msg(msg, res.success);
                        this.importDialogShow = false;
                        this.importLoading = false;
                        if (res.success) {
                            this.loadData();//刷新
                        }
                    }).catch(() => { });
                } else if (uploadFile.status === 'error') {
                    utils.msg('文件上传失败！', false);
                }
            },
            //关闭窗口
            closeDialog() {
                if (utils.isDef(selectdiv_dialogshow.value)) {
                    selectdiv_dialogshow.value = false;
                }
            },
            //确定选择
            confirmSelect() {
                //if (this.selectRows.length === 0) {
                //    utils.msg('请至少选择一条数据！', false);
                //    return;
                //}
                if (utils.isFunction(selectdiv_ok)) {
                    selectdiv_ok(this.selectRows);
                }
            },
            //选择时判断行是否可以选择。
            rowSelectableFun(row, index) {
                return utils.isFunction(this.rowSelectable) ? this.rowSelectable(row, index) : true;
            },
            //计算合计方法
            summaryMethod1(data) {
                var sums = [];
                var isSumText = false;
                for (var i = 0; i < data.columns.length; i++) {
                    if (utils.length(this.summarySubSum) > 0 || utils.length(this.summarySum) > 0) {
                        const property = data.columns[i]['property'];
                        var sumTotal = [];
                        var sumText = [];
                        if (utils.length(this.summarySubSum) > 0) {
                            var subSum = utils.hasKey(this.summarySubSum, property) ? this.summarySubSum[property] : "";
                            if (utils.length(subSum) > 0) {
                                sumTotal.push(subSum);
                            }
                            sumText.push('小计');
                        }
                        if (utils.length(this.summarySum) > 0) {
                            var sum = utils.hasKey(this.summarySum, property) ? this.summarySum[property] : "";
                            if (utils.length(sum) > 0) {
                                sumTotal.push(sum);
                            }
                            sumText.push('合计');
                        }
                        if (!isSumText && data.columns[i].type === 'default' && sumTotal.length === 0) {
                            sums.push(sumText.join('/'));
                            isSumText = true;
                        } else {
                            sums.push(sumTotal.join('/'));
                        }
                    } else {
                        sums.push("");
                    }
                }
                return sums;
            },
            //序号列
            indexMethod(index) {
                const size = utils.toNumber(this.formData.size, 10);
                const number = utils.toNumber(this.formData.number, 1);
                return index + (size * number - size) + 1;
            },
            //批量下载附件 row-当前行数据，按钮设置在列表时传值，field-附件字段
            downloadFiles(row, field) {
                const rows = utils.isDef(row) ? [row] : this.selectRows;
                if (rows.length === 0) {
                    utils.msg('您没有选择要下载的行！', false);
                    return;
                }
                //组织要下载的附件文件id
                const fileIds = [];
                for (let i = 0; i < rows.length; i++) {
                    var fieldFiels = rows[i][field];
                    //如果是数组表示是本地附件
                    if (utils.isArray(fieldFiels)) {
                        for (let j = 0; j < fieldFiels.length; j++) {
                            fileIds.push(fieldFiels[j]['id']);
                        }
                    } else {
                        //远程文件
                        fileIds.push(fieldFiels);
                    }
                }
                if (fileIds.length === 0) {
                    utils.msg('没有要下载的文件！', false);
                    return;
                }
                this.butDisabled = true;
                ajax.post('/Program/DownloadFiles?programid=' + this.id + '&applibraryid=' + this.applibraryId, qs.stringify({ ids: JSON.stringify(fileIds) })).then((res) => {
                    this.butDisabled = false;
                    if (res.success) {
                        this.clearSelection();//重置选择行。
                        this.selectRows = [];
                        const url = this.sysConfig['SERVER_WEBADDRESS'] + '/Files/Show?id=' + res.msg + '&contenttype=attachment'
                            + '&nroadflow-token=' + utils.getToken();
                        utils.open(url, 300, 200, '', false);
                    } else {
                        let msg = '';
                        if (res.code === 1) {
                            msg = '没有要下载的文件！';
                        }
                        utils.msg(msg, false);
                    }
                }).catch(() => { });
            },
        },
        template: '<div>' + res.data.template + '</div>',
    };
    app.component(componentId, component);
    programComponentId.value = componentId;
};

//注册图表
const regChart = (res) => {
    const componentId_chart = 'roadflow_program_chart_' + utils.createGuid(false);
    const component_chart = {
        data() {
            return {
                width: 800,
                height: 500,
                chartOption: {},
                pager: utils.getPager({}),
                formData: res.data.formDataDefaultValue || {},
                rows: listData.value,
            };
        },
        mounted() {
            var domParent = document.getElementById('programDiv_chart');
            this.width = domParent.clientWidth;
            this.height = domParent.clientHeight;
            this.$nextTick(() => {
                setTimeout(() => {
                    this.showChart();
                }, 500);
            });
        },
        methods: {
            showChart() {
                //判断如果没有加载列表，则说明没有加载数据，则要加载数据。
                if (showType.value === 1 || showType.value === 3 && this.rows.length === 0) {
                    this.loadData(true);
                } else {
                    this.loadChart();
                }
            },
            //渲染chart
            loadChart() {
                //var programChart = echarts.init(document.getElementById('programChartRef'), res.data['chart']['dark'] === 1 ? 'dark' : '', { height: this.height, width: this.width });
                var programChart = echarts.init(document.getElementById('programChartRef'), res.data['chart']['dark'] === 1 ? 'dark' : '', { height: document.getElementById('app').clientHeight - 150, width: this.width });
                this.chartOption = res.data['chart']['option'];
                //执行页面脚本
                if (utils.length(res.data.clientScripts) > 0) {
                    eval(res.data.clientScripts);
                }
                programChart.setOption(this.chartOption);
            },
            //isQuery：是否是点的查询按钮
            loadData(isQuery) {
                if (isQuery && res.data.isPager) {
                    this.pager.number = 1;
                }
                this.butDisabled = true;
                this.formData.size = res.data.isPager ? this.pager.size : 10000000;
                this.formData.number = this.pager.number;
                this.formData.order = this.pager.order;

                ajax.post('/Program/GetRunData?' + propsQueryString + '&iselement=1', qs.stringify(this.formData)).then((res1) => {
                    if (res1.success) {
                        listData.value = res1.data.rows;
                        this.rows = res1.data.rows;
                        this.loadChart();
                    } else {
                        let msg = '';
                        switch (res1.code) {
                            case 1:
                                msg = '未找到对应的应用！';
                                break;
                        }
                        utils.msg(msg, false);
                    }
                    this.butDisabled = false;
                }).catch(() => { this.butDisabled = false; });
            },
        },
        //template: `<div id="programChartRef" ref="programChartRef" :style="'width:'+width+'px;height:'+height+'px'"></div>`,
        template: `<div id="programChartRef" ref="programChartRef" :style="'width:'+width+'px;height:` + (document.getElementById('app').clientHeight - 150) + `px'"></div>`,
    };
    app.component(componentId_chart, component_chart);
    programComponentId_Chart.value = componentId_chart;
};


//将component ref注入，以便编辑页面调用关闭窗口，加载数据等。
provide("programrun_programcomponentref", programComponentRef);
</script>