<template>
    <div class="roadui_page" v-loading="loading">
        <div>
            <el-input v-model="searchKey" placeholder="输入关键字查询" clearable @input="onSearch" style="width:300px" />
        </div>
        <div>
            <div v-for="flowType in flows" :key="flowType.id">
                <div class="roadui_flowstar_title">{{ flowType.title }}</div>
                <el-space wrap :size="36">
                    <div v-for="flow in flowType.children" :key="flow.id" @click="startFlow(flow)"
                        class="roadui_flowstar_flow">
                        <div class="roadui_flowstar_flowico"
                            :style="'background-color:' + (utils.length(flow.color) === 0 ? 'var(--el-color-primary)' : flow.color)">
                            <component :is="utils.length(flow.ico)>0?flow.ico:'ship'"></component>
                        </div>
                        <div class="roadui_flowstar_flowtitle">
                            <span>{{ flow.name }}</span>
                        </div>
                    </div>
                </el-space>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
const ajax = inject('ajax');
const utils = inject('utils');
const index_openmenu = inject('index_openmenu');
const loading = ref(false);

onMounted(() => {
    loadFlows();
});

const searchKey = ref('');
const flows = ref([]);
var flows1 = [];
//载入流程的流程选项
const loadFlows = () => {
    loading.value = true;
    ajax.post('/Flow/GetStarts').then((res) => {
        if (res.success) {
            flows.value = res.data;
            flows1 = utils.cloneJson(res.data);
        } else {
            let msg = res.msg;
            if (utils.length(msg) === 0) {
                msg = res.code == 1 ? '用户id错误！' : '流程加载失败！';
            }
            utils.msg(msg, false);
        }
        loading.value = false;
    }).catch(() => { loading.value = false });
};
//搜索
const onSearch = (val) => {
    if (utils.length(val) === 0) {
        flows.value = utils.cloneJson(flows1);
        return;
    }
    let flows2 = [];
    for (let i = 0; i < flows1.length; i++) {
        const flows3 = flows1[i].children.filter((flow) => flow.name.toLowerCase().indexOf(val.toLowerCase()) >= 0);
        if (flows3.length > 0) {
            flows2.push({ id: flows1[i].id, title: flows1[i].title, title_en: flows1[i].title_en, title_tw: flows1[i].title_tw, children: flows3 });
        }
    }
    flows.value = flows2;
};
//发起流程
const startFlow = (flow) => {
    const url = utils.length(flow.address) === 0 ? '/flow/run/index.vue?flowid=' + flow.id : flow.address;
    index_openmenu({ id: 'task_' + utils.createGuid(false), title: flow.name, url: url, ico: flow.ico, openMode: 0 });
};
</script>