<template>
    <div>
        <component :is="componentId" :query="componentQuery"></component>
    </div>
</template>

<script setup>
    import Loading from '../../loading.vue';
    import Error from '../../error.vue';
    import { ref, inject, onMounted, defineAsyncComponent } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const app = inject('app');
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const componentId = ref(null);
    const componentQuery = ref('');

    onMounted(() => {
        load();
    });

    const load = () => {
        //先保存表单
        const editorName = utils.query('editorname', props.query);
        const editor = window.parent.CKEDITOR.instances[editorName];
        if (utils.isUndef(editor)) {
            console.log('editor is null');
            return;
        }
        editor.initFunction_preview = load;

        if (editor.roaduiTools.isNew && utils.length(editor.formAttributeJSON.id) <= 0) {
            return;
        }

        var attJSON = editor.formAttributeJSON;
        var eventJSON = editor.formEventsJSON;
        var subtableJSON = editor.formSubtabsJSON;
        var html = editor.getData();

        var runHtml = editor.designjs.compile(html, attJSON, eventJSON, subtableJSON);

        if (editor.designjs.formCompileErrMsg.length > 0) {
            for (var i = 0; i < editor.designjs.formCompileErrMsg.length; i++) {
                utils.msg(editor.designjs.formCompileErrMsg[i], false);
            }
            return;
        }
        ajax.post('/Form/Save?1=1' + editor.iframeQueryString,
            qs.stringify({
                attJSON: JSON.stringify(attJSON)
                , eventJSON: JSON.stringify(eventJSON)
                , subtableJSON: JSON.stringify(subtableJSON)
                , defaultValueJSON: JSON.stringify(editor.designjs.formDefaultValues)
                , selectOptionsJSON: JSON.stringify(editor.designjs.formSelectOptions)
                , fieldsJSON: JSON.stringify(editor.designjs.formFields)
                , html: html
                , runHtml: runHtml
            })).then(function (res) {
                if (res.success) {
                    attJSON.id = res.data;
                    const pageId = 'form_preview_' + utils.createGuid(false);
                    componentQuery.value = '?flowid=100000000000000&formid=' + attJSON.id + '&ispreview=1';

                    var url = './roadui-pages/flow/run/index.vue';
                    const c = defineAsyncComponent({
                        loader: utils.systemModules[url], //() => import(/*@vite-ignore*/`${url}`), //加载函数 /*@vite-ignore*/这个是为了消除vite警告：then above dynamic import cannot be analyzed by vite
                        loadingComponent: Loading,//加载异步组件时使用的组件
                        delay: 200,//展示加载组件前的延迟时间，默认为 200ms
                        errorComponent: Error,//加载失败后展示的组件
                    });

                    app.component(pageId, c);
                    componentId.value = pageId;
                } else {
                    let msg = '保存表单失败！';
                    utils.msg(msg, false);
                }
            });
    };
</script>