
<template>
    <div>
        <el-button type="primary" @click="show = true">打开</el-button>
        <el-dialog v-model="show" title="列设置" align-center destroy-on-close width="800px" draggable
            :close-on-click-modal="false">
            <my-transfer class="box-width" :titles="['待选列表', '已选列表']" :filterable="true" filterPlaceholder="请输入"
                :leftTransferData="deviceData" @transferChange="transferChange"></my-transfer>
        </el-dialog>
        <div ref='showordersRef' style='width:800px; height:500px'></div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from "vue";
// const MyTransfer = defineAsyncComponent(() => import('../Invoice/components/Transfer.vue'))
import MyTransfer from '../Invoice/components/Transfer.vue';//征求意见页面
import * as echarts from 'echarts';
const show = ref(false);
onMounted(
    () => { showorders(); }
);
const showordersRef = ref(null);
const showorders = () => {
    // 基于准备好的dom，初始化echarts实例
    //var chartDom = document.getElementById('showorders');
    var myChart = echarts.init(showordersRef.value);
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: 'Referer of a Website',
            subtext: 'Fake Data',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: 1048, name: 'Search Engine' },
                    { value: 735, name: 'Direct' },
                    { value: 580, name: 'Email' },
                    { value: 484, name: 'Union Ads' },
                    { value: 300, name: 'Video Ads' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
};
// 待选列表
const deviceData = ref([
    { label: '待选内容1', value: 0, show: true },
    { label: '待选内容2', value: 1, show: true },
    { label: '待选内容3', value: 2, show: true },
    { label: '待选内容4', value: 3, show: true },
    { label: '待选内容5', value: 4, show: true },
    { label: '待选内容6', value: 5, show: true },
    { label: '待选内容7', value: 6, show: true },
    { label: '待选内容8', value: 7, show: true },
    { label: '待选内容9', value: 8, show: true },
    { label: '待选内容10', value: 9, show: true },
    { label: '待选内容11', value: 10, show: true },
])
// 已选列表
const chooseDeviceList = ref([]);
// 选中的待选列表
function transferChange(data) {
    console.log(data);
    // 将data中的show属性设置为true
    chooseDeviceList.value = data
    console.log('chooseDeviceList', chooseDeviceList.value);
    console.log('deviceData', deviceData.value);
}
</script>

<style></style>