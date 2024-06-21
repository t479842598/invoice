<template>
    <div style="overflow:auto" v-loading="loading">
        <div :id="divId"></div>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    import flowShow from './flow-show.js';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const flowId = utils.query('flowid', props.query);
    const divId = 'flowShowDiv_' + utils.query('flowid', props.query);
    const loading = ref(false);
    const flowJson = ref({});

    onMounted(() => {
        loadFlow();
    });

    const loadFlow = () => {
        loading.value = true;
        ajax.post('/Flow/GetFlowDesignJson?isnew=0&flowid=' + flowId).then((res) => {
            if (!res.success) {
                utils.msg('加载流程图失败！', false);
            } else {
                flowJson.value = res.data;
                //根据主题得到colorObj
                const theme = utils.getTheme();
                let colorObj = undefined;
                if (utils.isDef(theme) && utils.length(theme.color) > 0) {
                    colorObj = { line: theme.color, step: theme.color, focus: '#ffb526', fontSize: 14, stepText: '' };
                }
                const xy = utils.getFlowMaxXY(res.data.steps);
                flowShow.init(flowId, xy.x + 150, xy.y + 50, colorObj, false);
                flowShow.openFlow(res.data, null);
            }
            loading.value = false;
        }).catch(() => { });
    }
</script>