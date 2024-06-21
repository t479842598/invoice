<template>
    <div v-if="status === 0">
        <el-input :placeholder="placeholder" v-model="selectTitles" :title="selectTitles" @clear="clear" clearable
            :disabled="disabled">
            <template #append>
                <el-button @click="popSelect"><el-icon>
                        <Search />
                    </el-icon></el-button>
            </template>
        </el-input>
        <!--选择框-->
        <el-dialog v-model="dialogShow" :append-to-body="appendTobody" :title="dialogTitle" destroy-on-close
            :width="dialogWidth" draggable :close-on-click-modal="false">
            <component :is="dialogPage" :query="dialogQuery"></component>
        </el-dialog>
    </div>
    <span v-else-if="status === 1" class="roadui_fromreadonly">{{ selectTitles }}</span>
</template>

<script setup>
import Loading from '../roadui-pages/loading.vue';
import Error from '../roadui-pages/error.vue';
import { ref, inject, defineAsyncComponent, provide, onMounted } from 'vue';
const ajax = inject('ajax');
const utils = inject('utils');
const qs = inject('qs');
const app = inject('app');

const props = defineProps({
    //值
    modelValue: { type: String, default: () => { return ''; } },
    //状态 0编辑 1只读
    status: { type: Number, default: () => { return 0; } },
    //背景文字
    placeholder: { type: String, default: () => { return '请选择'; } },
    //是否禁用
    disabled: { type: Boolean, default: () => { return false; } },
    //是否多选
    multiple: { type: Boolean, default: () => { return false; } },
    //多选选择数量
    multipleLimit: { type: Number, default: () => { return 0; } },
    //弹出选择的应用id
    applibraryId: { type: String, default: () => { return ''; } },
    //弹出选择的应用地址
    applibraryAddress: { type: String, default: () => { return ''; } },
    //值字段
    valueField: { type: String, default: () => { return ''; } },
    //标题字段
    titleField: { type: String, default: () => { return ''; } },
    //值分隔符，多选时多个值用分隔符隔开
    valueSeparator: { type: String, default: () => { return ','; } },
    //标题分隔符，多选时多个标题用分隔符隔开
    titleSeparator: { type: String, default: () => { return '；'; } },
    //弹出窗口宽度
    modalWidth: { type: String, default: () => { return '800px'; } },
    //弹出窗口标题
    modalTitle: { type: String, default: () => { return ''; } },
    //参数
    queryParams: { type: String, default: () => { return ''; } },
    //弹出窗口append-to-body属性
    appendTobody: { type: Boolean, default: () => { return false; } },
});

const dialogShow = ref(false);
const dialogTitle = ref(props.modalTitle);
const dialogWidth = ref(props.modalWidth);
const dialogPage = ref(null);
const dialogQuery = ref('');

const emit = defineEmits(['update:modelValue', 'change']);
const selectTitles = ref('');
const selectValues = ref(props.modelValue);

onMounted(() => {
    initTitle(props.modelValue);
})

//弹出选择 props.queryParams参数js表达式在加载表单HTML中已经计算。:query-params="'f1='+this.formData['f1']"，属性中就计算好了。
const popSelect = () => {
    const urlArray = props.applibraryAddress.split('?');
    dialogQuery.value = urlArray.length > 1 ? '?' + urlArray[1] + '&' + props.queryParams + '&isselectdiv=1' : '?' + props.queryParams + '&isselectdiv=1';
    const url = './roadui-pages' + (utils.startWith(urlArray[0], '/') ? '' : '/') + urlArray[0] + (utils.endWith(urlArray[0], '.vue') ? '' : '.vue');
    const id = 'selectdiv_' + utils.createGuid(false);
    const c = defineAsyncComponent({
        loader: utils.systemModules[url], //() => import(/*@vite-ignore*/`${url}`), //加载函数 /*@vite-ignore*/这个是为了消除vite警告：then above dynamic import cannot be analyzed by vite
        loadingComponent: Loading,//加载异步组件时使用的组件
        delay: 200,//展示加载组件前的延迟时间，默认为 200ms
        errorComponent: Error,//加载失败后展示的组件
    });
    app.component(id, c);
    dialogPage.value = id;
    dialogShow.value = true;
};

//根据值加载标题。
const initTitle = (val) => {
    if (utils.length(val) > 0) {
        ajax.post('/Program/GetSelectDivTitle' + (props.queryParams.indexOf('?') === 0 ? '' : '?') + props.queryParams, qs.stringify({ value: val, valuefield: props.valueField, titlefield: props.titleField, valueseparator: props.valueSeparator, titleseparator: props.titleSeparator, applibraryid: props.applibraryId })).then((res) => {
            selectTitles.value = res.success ? res.data : '';
        }).catch(() => { });
    }
};

//确定选择
const ok = (rows) => {
    let values = new Array();
    let titles = new Array();
    for (let i = 0; i < rows.length; i++) {
        let value = rows[i][props.valueField];
        let title = rows[i][props.titleField];
        if (utils.length(value) > 0 && utils.length(title) > 0) {
            if (values.findIndex((item) => { return item === value; }) < 0) {
                values.push(value);
                titles.push(title);
            }
        }
    }
    selectValues.value = values.join(props.valueSeparator);
    selectTitles.value = titles.join(props.titleSeparator);
    updateModalValue(rows);
    dialogShow.value = false;
};

//更新值
const updateModalValue = (rows) => {
    emit('update:modelValue', selectValues.value);
    emit('change', { value: selectValues.value, rows: rows });
};

//清空
const clear = () => {
    emit('update:modelValue', '');
    selectValues.value = '';
    selectTitles.value = '';
    emit('change', { value: '', rows: [] });
};

//注入让子组件调用，弹出窗口中调用。
provide('selectdiv_dialogshow', dialogShow);
provide('selectdiv_ok', ok);
provide('selectdiv_selectvalues', selectValues);

//暴露方法给父组件调用
defineExpose({ initTitle });
</script>