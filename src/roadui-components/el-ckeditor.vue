<template>
    <textarea v-if="status===0" :id="editorId"></textarea>
    <div v-else-if="status===1" v-html="modelValue"></div>
</template>

<script>
    export default {
        name: 'ElEditor'
    }
</script>

<script setup>
    const CKEDITOR = window.CKEDITOR;
    import { inject, onMounted, nextTick } from 'vue';
    const utils = inject('utils');
    const sysConfig = inject('config');
    const props = defineProps({
        //id
        id: { type: String, default: () => { return '' } },
        //值
        modelValue: { type: String, default: () => { return ''; } },
        //状态 0编辑 1只读
        status: { type: Number, default: () => { return 0; } },
        //工具栏 0常规 1简洁
        toolbar: { type: Number, default: () => { return 0; } },
        //宽度
        width: { type: String, default: () => { return '100%'; } },
        //高度
        height: { type: Number, default: () => { return 300; } },
        //背景文字
        placeholder: { type: String, default: () => { return ''; } },
        //是否onchange时更新值
        input: { type: Boolean, default() { return true; } },
    });
    const emit = defineEmits(['update:modelValue']);
    const editorId = utils.length(props.id) === 0 ? 'ckeditor_' + utils.createGuid(false) : props.id;
    onMounted(() => {
        nextTick(() => {
            setTimeout(() => {
                if (props.status === 0) {
                    let toolbar = [];
                    let removeButtons = '';
                    if (props.toolbar === 0) {
                        toolbar = [
                            { name: 'document', groups: ['mode', 'document', 'doctools'] },
                            { name: 'clipboard', groups: ['clipboard', 'undo'] },
                            { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing', 'cleanup'] },
                            { name: 'insert', groups: ['insert'] },
                            { name: 'paragraph', groups: ['list', 'indent', 'paragraph'] },
                            { name: 'links', groups: ['links'] },
                            '/',
                            { name: 'styles', groups: ['styles'] },
                            { name: 'colors', groups: ['colors'] },
                            { name: 'basicstyles', groups: ['align', 'basicstyles'] },
                            { name: 'tools', groups: ['tools'] },
                            { name: 'about', groups: ['about'] },
                        ];
                        removeButtons = 'Flash,Anchor';
                    } else if (props.toolbar === 1) {
                        toolbar = [
                            { name: 'document', groups: ['mode', 'document', 'doctools'] },
                            { name: 'clipboard', groups: ['undo'] },
                            { name: 'styles', groups: ['styles'] },
                            { name: 'colors', groups: ['colors'] },
                            { name: 'paragraph', groups: ['align', 'paragraph'] },
                            { name: 'insert' },
                            { name: 'editing', groups: ['editing'] },
                            { name: 'links', groups: ['links'] },
                            { name: 'about', groups: ['about'] }
                        ];
                        removeButtons = 'Font,Flash,HorizontalRule,PageBreak,Anchor,Templates';
                    }
                    let config = {
                        allowedContent: true,
                        entities_greek: true,
                        height: props.height,
                        width: props.width,
                        image_previewText: sysConfig.CKEDITOR_IMAGE_PREVIVETEXT,
                        filebrowserImageUploadUrl: sysConfig.SERVER_WEBADDRESS + '/Files/SaveFiles?uploadtype=1&webaddress=' + encodeURIComponent(sysConfig.SERVER_WEBADDRESS),
                        filebrowserUploadUrl: sysConfig.SERVER_WEBADDRESS + '/Files/SaveFiles?uploadtype=1&webaddress=' + encodeURIComponent(sysConfig.SERVER_WEBADDRESS),
                        extraPlugins: 'tableresizerowandcolumn,editorplaceholder',
                        editorplaceholder: props.placeholder,
                    };
                    if (toolbar.length > 0) {
                        config.toolbarGroups = toolbar;
                    }
                    if (removeButtons.length > 0) {
                        config.removeButtons = removeButtons;
                    }

                    var ckEditor = CKEDITOR.replace(editorId, config);
                    ckEditor.on('fileUploadRequest', function (evt) {
                        //const xhr = evt.data.fileLoader.xhr;
                        //xhr.withCredentials = true;
                        evt.data.requestData['nroadflow-token'] = utils.getToken();
                    });
                    if (props.input) {
                        ckEditor.on('change', function (ev) {
                            updateValue(ev.editor.getData());
                        });
                        ckEditor.on('afterInsertHtml', function (ev) {
                            updateValue(ev.editor.getData());
                        });
                    }
                    ckEditor.on('instanceReady', function (event) {
                        var editor = event.editor;
                        setTimeout(function () {
                            editor.setData(props.modelValue);
                            if (!editor.element) {
                                setTimeout(arguments.callee, 100);
                                return;
                            }
                        }, 0);
                    });
                }
            }, 1);
        });

        //更新值
        const updateValue = (val) => {
            emit('update:modelValue', val);
        };
    });
</script>