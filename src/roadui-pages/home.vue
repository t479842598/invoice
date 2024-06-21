<template>
    <div>
        <!--首页顶部统计-->
        <div class="roadui_home_count">
            <el-space :size="50" wrap>
                <div v-for="(count,index) in homeSets['type_0']" :key="'home_left_'+index" @click="openLinkUrl(count)" class="roadui_home_countdiv">
                    <div class="roadui_home_counticon" :style="'background-color:'+(utils.length(count.background)>0?count.background:'')">
                        <component :is="utils.length(count.icon)>0?count.icon:'bar-chart'"></component>
                    </div>
                    <div class="roadui_home_countamount">
                        <div>{{count.title}}</div>
                        <div class="roadui_home_countamount_count">{{count.dataSource}}</div>
                    </div>
                </div>
            </el-space>
        </div>
        <div style="clear:both;height:6px;"></div>
        <div>
            <div class="roadui_home_left">
                <div class="roadui_home_leftdiv" v-for="(left,index) in homeSets['type_1']" :key="'home_left_'+index">
                    <component :is="left.componentId" :query="left.query"></component>
                </div>
            </div>
            <div class="roadui_home_right">
                <div class="roadui_home_leftdiv" v-for="(right,index) in homeSets['type_2']" :key="'home_right_'+index">
                    <component :is="right.componentId" :query="right.query"></component>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted, compile } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const index_openmenu = inject('index_openmenu');
    const index_regcomponent = inject('index_regcomponent');
    const app = inject('app');
    import * as echarts from 'echarts';

    const homeSets = ref({});

    onMounted(() => {
        loadData();
    });

    const loadData = () => {
        ajax.post('/HomeSet/GetUserList').then((res) => {
            homeSets.value = res.data;
            //注册左边模块
            for (let i = 0; i < res.data['type_1'].length; i++) {
                const leftComponent = res.data['type_1'][i];
                if (utils.length(leftComponent.dataSource) === 0) {
                    continue;
                }
                //是图表
                if (leftComponent.isCharts === 1) {
                    loadCharts(leftComponent);
                    continue;
                }
                const componentId = 'home_left_' + leftComponent.id;

                const urlArray = leftComponent.dataSource.split('?');
                const url = urlArray[0];
                leftComponent['query'] = urlArray.length > 1 ? urlArray[1] : '';
                index_regcomponent(componentId, url);
                leftComponent['componentId'] = componentId;
            }
            //注册右边模块
            for (let i = 0; i < res.data['type_2'].length; i++) {
                const rightComponent = res.data['type_2'][i];
                if (utils.length(rightComponent.dataSource) === 0) {
                    continue;
                }
                //是图表
                if (rightComponent.isCharts === 1) {
                    loadCharts(rightComponent);
                    continue;
                }
                const urlArray = rightComponent.dataSource.split('?');
                const url = urlArray[0];
                rightComponent['query'] = urlArray.length > 1 ? urlArray[1] : '';
                const componentId = 'home_left_' + rightComponent.id;
                index_regcomponent(componentId, url);
                rightComponent['componentId'] = componentId;
            }
        }).catch(() => { });
    };
    //打开连接URL
    const openLinkUrl = (model) => {
        const item = {
            title: model.title,
            id: 'home_item_' + model.id,
            url: model.linkUrl,
            ico: model.icon,
            openMode: 0,
        };
        index_openmenu(item);
    };
    //加载图表
    const loadCharts = (c) => {
        const componentId_chart = 'roadflow_home_chart_' + utils.createGuid(false);
        const component_chart = {
            data() {
                return {
                    width: '100%',
                    height: 300,
                    chartOption: {},
                    rows: [],
                    data: [],
                };
            },
            mounted() {
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.loadChart();
                    }, 100);
                });
            },
            methods: {
                //渲染chart
                loadChart() {
                    var programChart = echarts.init(document.getElementById('programChartRef_' + c.id), '');
                    this.chartOption = c.charts;
                    this.rows = c.chartsData;
                    this.data = c.chartsData;
                    this.height = c.chartsHeight || 300;
                    //执行数据替换脚本
                    if (utils.length(c.chartsScripts) > 0) {
                        eval(c.chartsScripts);
                    }
                    programChart.setOption(this.chartOption);
                }
            },
            template: `<div id="programChartRef_${c.id}" ref="programChartRef_${c.id}" :style="'padding:12px;width:'+width+'px;height:'+height+'px'"></div>`,
        };
        app.component(componentId_chart, component_chart);
        c['componentId'] = componentId_chart;
    };
</script>