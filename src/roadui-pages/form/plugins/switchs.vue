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
                    <th>默认值</th>
                    <td>
                        <el-cascader placeholder="选择默认值" :options="defaultValueOptions" :props="{expandTrigger:'hover',checkStrictly:false}" clearable @change="setDefault" style="width:260px;margin-right:18px" />
                        <el-input v-model="setJson.defaultValue" style="width:323px;" clearable></el-input>
                    </td>
                </tr>
                <tr>
                    <th>选中文本</th>
                    <td>
                        <el-input v-model="setJson.checkedChildren" clearable style="width:140px;margin-right:12px"></el-input>
                        <span>
                            非选中文本
                            <el-input v-model="setJson.unCheckedChildren" clearable style="width:140px;margin:0 12px"></el-input>
                            <el-checkbox v-model="setJson.inlinePrompt">是否显示在点内</el-checkbox>
                        </span>
                    </td>
                </tr>
                <tr>
                    <th>选中时值</th>
                    <td>
                        <el-input v-model="setJson.checkedValue" clearable style="width:140px;margin-right:12px"></el-input>
                        <span>
                            非选中时值
                            <el-input v-model="setJson.unCheckedValue" clearable style="width:140px;margin:0 12px"></el-input>
                            <el-checkbox v-model="setJson.defaultChecked">默认是否选中</el-checkbox>
                        </span>
                    </td>
                </tr>
                <tr>
                    <th>选中颜色</th>
                    <td>
                        <el-color-picker v-model="setJson.checkedColor"></el-color-picker>
                        <span style="margin-left:12px">
                            非选中颜色
                            <span style="margin-left:12px">
                                <el-color-picker v-model="setJson.unCheckedColor"></el-color-picker>
                            </span>
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
                            <el-option v-for="event in eventsJson.events" :key="event.name" :value="event.name" :label="event.name"></el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <th>脚本</th>
                    <td>
                        <!--<el-input type="textarea" v-for="event in eventsJson.events" :key="'script_'+event.name" v-show="eventName==event.name" v-model="event.script" :rows="11" clearable></el-input>-->
                        <div style="width:620px" v-for="event in eventsJson.events" :key="'script_'+event.name" v-show="eventName==event.name">
                            <el-codemirror v-model="event.script" height="260px"></el-codemirror>
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
            id: '', label: '', field: '', width: '', defaultChecked: false, unCheckedChildren: '', checkedChildren: '',
            inlinePrompt: false, unCheckedValue: '', checkedValue: '', unCheckedColor: '', checkedColor: '',
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
            setJson.value.defaultChecked = input.getAttribute("data-defaultchecked") == 'true';
            setJson.value.unCheckedChildren = input.getAttribute("data-uncheckedchildren");
            setJson.value.checkedChildren = input.getAttribute("data-checkedchildren");
            setJson.value.inlinePrompt = input.getAttribute("data-inlineprompt") == 'true';
            setJson.value.unCheckedValue = input.getAttribute("data-uncheckedvalue");
            setJson.value.checkedValue = input.getAttribute("data-checkedvalue");
            setJson.value.unCheckedColor = input.getAttribute("data-uncheckedcolor");
            setJson.value.checkedColor = input.getAttribute("data-checkedcolor");

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
        editor.initFunction_switch = init;
    }
</script>