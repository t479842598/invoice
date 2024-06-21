<template>
    <table cellpadding="0" v-loading="loading" :element-loading-text="loadingText" cellspacing="0" border="0" style="width:100%;">
        <tr>
            <td valign="top"><div ref="formEditorRef" :id="editorId"></div></td>
        </tr>
    </table>
</template>

<script setup>
    import { ref, inject, onMounted, onUnmounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const config = inject('config')
    const qs = inject('qs');
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const CKEDITOR = window.CKEDITOR;
    let ckEditor = null;

    const editorId = 'formdesigneditor_' + utils.query('formid', props.query);
    const formId = utils.query('formid', props.query);
    const isNew = "1" === utils.query('isnew', props.query);
    const loading = ref(false);
    const loadingText = ref('');
    const index_themeset = inject('index_themeset');

    import designjs from './form-design.js';
    onMounted(() => {
        ckEditor = CKEDITOR.replace(editorId, {
            allowedContent: true,
            entities_greek: true,
            height: window.innerHeight - (index_themeset.value.homeType === 1 ? 218 : 261),//index_themeset.value.homeType首页是左右布局高度不一样。
            contentsCss: CKEDITOR.basePath + "/from-design.css",
            image_previewText: config.CKEDITOR_IMAGE_PREVIVETEXT,
            filebrowserImageUploadUrl: config.SERVER_WEBADDRESS + '/Files/SaveFiles?uploadtype=1&webaddress=' + encodeURIComponent(config.SERVER_WEBADDRESS),
            filebrowserUploadUrl: config.SERVER_WEBADDRESS + '/Files/SaveFiles?uploadtype=1&webaddress=' + encodeURIComponent(config.SERVER_WEBADDRESS),
            toolbarGroups: [
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
                '/',
                { name: 'rf_plugins', groups: ['rf_plugins', 'rf_plugins1'] },
            ],
            removeButtons: 'Flash,Anchor',
            extraPlugins: 'tableresizerowandcolumn,rf_attribute,rf_text,rf_textarea,rf_number,rf_select,rf_cascader,rf_radio,rf_checkbox,rf_switch,rf_hidden'
                + ',rf_datetime,rf_dictionary,rf_organize,rf_files,rf_appraise,rf_html,rf_label,rf_button,rf_serialnumber,rf_datatable'
                + ',rf_selectdiv,rf_signature,rf_subtable,rf_script'
                + ',rf_preview,rf_save,rf_saveas,rf_publish'
        });
        ckEditor.on('fileUploadRequest', function (evt) {
            //const xhr = evt.data.fileLoader.xhr;
            //xhr.withCredentials = true;
            evt.data.requestData['nroadflow-token'] = utils.getToken();
        });
        ckEditor.designjs = designjs;
        ckEditor.utils = utils;
        ckEditor.roaduiTools = { ajax: ajax, qs: qs, isNew: isNew, loading: loading, loadingText: loadingText };
        ckEditor.iframeQueryString = '&nroadflow-token=' + utils.getToken();//要加在组件弹出窗口URL后面的参数。这里加上token是为了iframe模式时读取token验证用户。
        CKEDITOR.on('instanceReady', function (event) {
            var editor = event.editor;
            setTimeout(function () {
                if (!editor.element) {
                    setTimeout(arguments.callee, 100);
                    return;
                }
                event.removeListener('instanceReady', this.callee);
                //如果是新建表单，弹出表单属性设置
                if (isNew) {
                    ckEditor.formAttributeJSON = { showMessage: true, inlineMessage: false, statusIcon: false };
                    ckEditor.formEventsJSON = [];
                    ckEditor.formSubtabsJSON = [];
                    var command = editor.getCommand('rf_attribute');
                    command.exec();
                } else {
                    ajax.post('/Form/GetDesignHtml?formid=' + formId).then((res) => {
                        if (!res.success) {
                            utils.msg('获取表单信息失败！', false);
                            return;
                        }
                        ckEditor.setData(res.data.html);
                        //设置表单属性默认值
                        if (!utils.hasKey(res.data.attr, 'showMessage')) {
                            res.data.attr['showMessage'] = true;
                        }
                        if (!utils.hasKey(res.data.attr, 'inlineMessage')) {
                            res.data.attr['inlineMessage'] = false;
                        }
                        if (!utils.hasKey(res.data.attr, 'statusIcon')) {
                            res.data.attr['statusIcon'] = false;
                        }
                        ckEditor.formAttributeJSON = res.data.attr;
                        ckEditor.formEventsJSON = res.data.event;
                        ckEditor.formSubtabsJSON = res.data.subtable;
                    }).catch(() => { });
                }
            }, 0);
        });
        window.addEventListener('resize', resize, false);
    });
    onUnmounted(() => {
        window.removeEventListener('resize', resize, false);
    });
    //窗口大小改变时设置编辑器大小
    const resize = () => {
        try {
            ckEditor.resize('100%', window.innerHeight - (index_themeset.value.homeType === 1 ? 77 : 130));
        } catch (e) {
            //console.log(e);
        }
    }
</script>