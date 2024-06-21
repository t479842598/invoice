<template>
    <el-tabs>
        <el-tab-pane name="0" label="属性" style="height:100%">
            <table class="roadui_formtable" style="width:98%; margin: 0 auto;">
                <tr>
                    <th style="width:60px">控件id</th>
                    <td class="roadui_formfont">{{setJson.id}}</td>
                </tr>
                <tr>
                    <th>绑定字段</th>
                    <td>
                        <el-select v-model="setJson.field" filterable style="width:260px;" clearable>
                            <el-option v-for="field in fieldsOptions" :key="field.name" :value="field.name" :label="field.name+(utils.length(field.comment)>0?' - '+field.comment:'')">
                                <span>{{field.name}}</span>
                                <span class="roadui_note1">{{utils.length(field.comment)>0?' - '+field.comment:''}}</span>
                            </el-option>
                        </el-select>
                        <span style="margin-left:12px;">
                            标签<el-input v-model="setJson.label" placeholder="控件label" style="width:285px;margin-left:12px;" clearable></el-input>
                        </span>
                    </td>
                </tr>
                <tr>
                    <th>宽度</th>
                    <td>
                        <el-input v-model="setJson.width" style="width:260px;margin-right:12px;" clearable placeholder="px或%"></el-input>
                        背景文字<el-input v-model="setJson.placeholder" style="width:257px;margin-left:12px;" clearable placeholder="placeholder"></el-input>
                    </td>
                </tr>
                <tr>
                    <th>文件类型</th>
                    <td>
                        <el-input v-model="setJson.fileType" style="width:260px;margin-right:12px;" clearable placeholder="可上传的文件类型，例：.jpg,.png,.docx等。"></el-input>
                        文件数量<el-input-number v-model="setJson.limit" style="width:100px;margin-left:12px;" :min="1" controls-position="right" clearable></el-input-number>
                    </td>
                </tr>
                <tr>
                    <th>显示类型</th>
                    <td>
                        <el-radio-group v-model="setJson.showType" style="vertical-align: middle;">
                            <el-radio label="link">链接</el-radio>
                            <el-radio label="linkbr">链接换行</el-radio>
                        </el-radio-group>
                        <el-checkbox style="margin-left:22px;vertical-align:middle;" v-model="setJson.showImg">显示图片</el-checkbox>
                        <el-checkbox v-model="setJson.showIndex" style="vertical-align:middle;">显示序号</el-checkbox>
                        <span class="roadui_note" style="margin-left:12px;vertical-align:middle;">只读时的显示方式</span>
                    </td>
                </tr>
                <tr>
                    <th>控件类型</th>
                    <td>
                        <el-radio-group v-model="setJson.controlType" style="vertical-align: middle;">
                            <el-radio label="0">弹出层</el-radio>
                            <el-radio label="1">Element</el-radio>
                        </el-radio-group>
                        <span style="margin-left: 12px; vertical-align: middle;">显示样式</span><el-input v-model="setJson.showStyle" style="width: 330px; margin-left: 12px; vertical-align: middle;" clearable placeholder="显示时的css样式"></el-input>
                    </td>
                </tr>
                <tr v-show="setJson.controlType=='1'">
                    <th>显示方式</th>
                    <td>
                        <el-radio-group v-model="setJson.controlShowType" style="vertical-align: middle;">
                            <el-radio label="0">列表</el-radio>
                            <el-radio label="1">头像</el-radio>
                            <el-radio label="2">照片墙</el-radio>
                        </el-radio-group>
                        <span style="margin-left:12px">
                            提示<el-input v-model="setJson.tip" style="margin-left:12px;width:180px;" placeholder="对上传文件的要求说明等提示"></el-input>
                        </span>
                        <span style="margin-left:12px">
                            按钮文字<el-input v-model="setJson.buttonText" style="margin-left:12px;width:80px;" placeholder=""></el-input>
                        </span>
                    </td>
                </tr>
            </table>
        </el-tab-pane>
        <el-tab-pane name="1" label="事件" style="height:100%">
            <table class="roadui_formtable" style="width:98%; margin: 0 auto;">
                <tr>
                    <th style="width:50px">事件</th>
                    <td>
                        <el-select v-model="eventName">
                            <el-option value="change" label="change"></el-option>
                            <el-option value="click" label="click"></el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <th>脚本</th>
                    <td>
                        <!--<el-input type="textarea" v-for="event in eventsJson.events" :key="'script_'+event.name" v-show="eventName==event.name" v-model="event.script" :rows="11" clearable></el-input>-->
                        <div style="width:620px" v-for="event in eventsJson.events" :key="'script_'+event.name" v-show="eventName==event.name">
                            <el-codemirror v-model="event.script" height="300px"></el-codemirror>
                        </div>
                    </td>
                </tr>
            </table>
        </el-tab-pane>
    </el-tabs>
</template>

<script setup>
    import designjs from '../form-design.js';
    import { ref, inject, onMounted } from 'vue';
    const utils = inject('utils');
    const ElCodemirror = inject('ElCodemirror');

    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const editorName = utils.query('editorname', props.query);
    const editor = window.parent.CKEDITOR.instances[editorName];
    const attrJson = editor.formAttributeJSON;
    const setJson = ref({});
    const eventsJson = ref({});
    const eventName = ref('');
    const fieldsOptions = ref([]);
    const defaultValueOptions = designjs.defaultValueOptions();

    onMounted(() => {
        if (attrJson) {
            utils.getConnTableFields(attrJson.dbConn, attrJson.dbTable).then(fields => {
                fieldsOptions.value = fields;
            });
        }
        init();
    });
    //设置默认值
    const setDefault = (v) => {
        if (utils.length(v) === 0) {
            return;
        }
        setJson.value.defaultValue += v[v.length - 1];
    };
    const init = (input) => {
        setJson.value = {
            id: '', label: '', field: '', width: '', placeholder: '', fileType: '', showType: '', showImg: false, showIndex: false
        };
        //初始化事件，不然新添加控件时会显示上一个控件的事件。
        eventsJson.value = {};
        if (!input) {
            input = editor.currentSelectEditorElement;
        }
        if (input) {
            setJson.value.id = input.getAttribute("data-id");
            setJson.value.label = input.getAttribute("data-label");
            setJson.value.field = input.getAttribute("data-bindfiled");
            setJson.value.width = input.getAttribute("data-width") || '';
            setJson.value.placeholder = input.getAttribute("data-placeholder");
            setJson.value.fileType = input.getAttribute("data-filetype");
            setJson.value.showType = input.getAttribute("data-showtype");
            setJson.value.showImg = input.getAttribute("data-showimg") == 'true';
            setJson.value.showIndex = input.getAttribute("data-showindex") == 'true';
            setJson.value.showStyle = utils.decodeURI(input.getAttribute("data-showstyle"));
            if (parseInt(input.getAttribute("data-limit"))) {
                setJson.value.limit = parseInt(input.getAttribute("data-limit"));
            } 
            setJson.value.size = input.getAttribute("data-size" || '');
            setJson.value.controlType = utils.decodeURI(input.getAttribute("data-controlType") || '0');
            setJson.value.controlShowType = utils.decodeURI(input.getAttribute("data-controlShowType") || '0');
            setJson.value.tip = utils.decodeURI(input.getAttribute("data-tip"));
            setJson.value.buttonText = utils.decodeURI(input.getAttribute("data-buttonText") || '');

            //初始化事件
            eventsJson.value = utils.getArrayObj(editor.formEventsJSON, setJson.value.id, 'id');
            if (utils.isUndef(eventsJson.value)) {
                eventsJson.value = { id: setJson.value.id, events: [{ name: 'change', script: '' }, { name: 'click', script: '' }] };
                editor.formEventsJSON.push(eventsJson.value)
            } else if (utils.length(eventsJson.value.events) === 0) {
                eventsJson.value = { id: setJson.value.id, events: [{ name: 'change', script: '' }, { name: 'click', script: '' }] };
            } else {
                let es = ['change', 'click'];
                for (let i = 0; i < es.length; i++) {
                    if (!utils.inArray(eventsJson.value.events, es[i], 'name')) {
                        eventsJson.value.events.push({ name: es[i], script: '' });
                    }
                }
            }
            eventName.value = eventsJson.value.events[0].name;
        }

        editor.currentSelectEditorElementJson = setJson.value;
        editor.initFunction_files = init;
    }
</script>