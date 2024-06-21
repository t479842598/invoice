<template>
    <div v-loading="loading" element-loading-text="正在发布…">
        <div class="roadui_toolbar">
            <div><button :disabled="butDisabled" @click="returnList()" type="button"><el-icon><Back /></el-icon>返回</button></div>
            <div><span>|</span></div>
            <div><button :disabled="butDisabled" @click="setPage(Attr)" type="button"><el-icon><Operation /></el-icon>属性</button></div>
            <div><button :disabled="butDisabled" @click="setPage(Chart)" type="button"><el-icon><Histogram /></el-icon>图表</button></div>
            <div><button :disabled="butDisabled" @click="setPage(List)" type="button"><el-icon><Document /></el-icon>列表</button></div>
            <div><button :disabled="butDisabled" @click="setPage(Query)" type="button"><el-icon><Search /></el-icon>查询</button></div>
            <div><button :disabled="butDisabled" @click="setPage(Button1)" type="button"><el-icon><Open /></el-icon>按钮</button></div>
            <div><button :disabled="butDisabled" @click="setPage(Validate)" type="button"><el-icon><Finished /></el-icon>验证</button></div>
            <div><button :disabled="butDisabled" @click="setPage(Export)" type="button"><el-icon><Mouse /></el-icon>导出</button></div>
            <div><span>|</span></div>
            <div><button :disabled="butDisabled" @click="publish()" type="button"><el-icon><Select /></el-icon>发布</button></div>
        </div>
        <div :style="'padding:18px 0 0 0;overflow:auto;height:'+divHeight+'px;'">
            <component :is="page" :query="pageQuery"></component>
        </div>
    </div>
</template>

<script setup>
    import Attr from './attr.vue';
    import List from './list.vue';
    import Chart from './chart.vue';
    import Query from './query.vue';
    import Button1 from './button1.vue';
    import Validate from './validate.vue';
    import Export from './export.vue';
    import { ref, inject, shallowRef, onMounted, onUnmounted, nextTick, provide } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const index_themeset = inject('index_themeset');
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const programId = utils.query('programid', props.query);
    const program_returnlist = inject('program_returnlist');
    const divHeight = ref(500);
    const butDisabled = ref(false);
    const loading = ref(false);
    const page = shallowRef(Attr);
    const pageQuery = ref(props.query);

    const formId = ref('');//编辑表单ID，验证页面会用到表单ID，去加载表单对应的字段。
    const fields = ref([]);//应用查询SQL对应的字段，这里保存目的是让子页面选择字段的地方不重复加载。

    onMounted(() => {
        nextTick(() => {
            setHeight();
            window.addEventListener('resize', setHeight, false);
        });
    });
    onUnmounted(() => {
        window.removeEventListener('resize', setHeight, false);
    });

    const setHeight = () => {
        divHeight.value = document.body.clientHeight - (index_themeset.value.homeType === 1 ? 135 : 185);//index_themeset.value.homeType首页是左右布局高度不一样。
    };

    const setPage = (p) => {
        pageQuery.value = props.query;
        page.value = p;
    };

    //返回
    const returnList = () => {
        program_returnlist();
    };
    //发布
    const publish = () => {
        butDisabled.value = true;
        loading.value = true;
        ajax.post('/Program/publish?programid=' + programId + '&iselement=1').then((res) => {
            let msg = '';
            switch (res.code) {
                case 0:
                    msg = '发布成功！';
                    break;
                case 1:
                    msg = '未找到要发布的应用！';
                    break;
                default:
                    msg = '发布失败！';
                    break;
            }
            utils.msg(msg, res.success);
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; loading.value = false; });
    };
    provide('program_attr_formid', formId);
    provide('program_attr_fields', fields);
</script>