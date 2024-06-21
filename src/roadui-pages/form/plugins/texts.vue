<template>
    <el-tabs>
        <el-tab-pane name="0" label="属性" style="height:100%">
            <table class="roadui_formtable" style="width:98%; margin: 0 auto;">
                <tr>
                    <th style="width:60px">控件id</th>
                    <td class="roadui_formfont">{{ setJson.id }}</td>
                </tr>
                <tr>
                    <th>绑定字段</th>
                    <td>
                        <el-select v-model="setJson.field" filterable style="width:260px;" clearable>
                            <el-option v-for="field in fieldsOptions" :key="field.name" :value="field.name"
                                :label="field.name + (utils.length(field.comment) > 0 ? ' - ' + field.comment : '')">
                                <span>{{ field.name }}</span>
                                <span class="roadui_note1">{{ utils.length(field.comment) > 0 ? ' - ' + field.comment : ''
                                }}</span>
                            </el-option>
                        </el-select>
                        <span style="margin-left:12px;">
                            标签<el-input v-model="setJson.label" placeholder="控件label" style="width:285px;margin-left:12px;"
                                clearable></el-input>
                        </span>
                    </td>
                </tr>
                <tr>
                    <th>默认值</th>
                    <td>
                        <el-cascader placeholder="选择默认值" :options="defaultValueOptions"
                            :props="{ expandTrigger: 'hover', checkStrictly: false }" clearable @change="setDefault"
                            style="width:260px;margin-right:18px" />
                        <el-input v-model="setJson.defaultValue" style="width:323px;" clearable></el-input>
                    </td>
                </tr>
                <tr>
                    <th>宽度</th>
                    <td>
                        <el-input v-model="setJson.width" placeholder="%或px" style="width:140px;margin-right:12px;"
                            clearable></el-input>
                        对齐方式
                        <el-select v-model="setJson.align" style="width:100px;margin-left:12px;" clearable>
                            <el-option value="left" label="左对齐"></el-option>
                            <el-option value="center" label="居中"></el-option>
                            <el-option value="right" label="右对齐"></el-option>
                        </el-select>
                        <span style="margin-left:12px;"><el-checkbox v-model="setJson.disabled" label="禁用"
                                style="vertical-align:middle"></el-checkbox></span>
                        <span style="margin-left:12px;"><el-checkbox v-model="setJson.readOnly" label="只读"
                                style="vertical-align:middle"></el-checkbox></span>
                        <span style="margin-left:12px;"><el-checkbox v-model="setJson.allowClear" label="可清除"
                                style="vertical-align:middle"></el-checkbox></span>
                    </td>
                </tr>
                <tr>
                    <th>最大字符</th>
                    <td>
                        <el-input-number :min="0" v-model="setJson.maxLength" style="width:120px;margin-right:12px;"
                            clearable controls-position="right"></el-input-number>
                        背景文字<el-input v-model="setJson.placeholder" placeholder="placeholder"
                            style="width:313px;margin-left:12px;" clearable></el-input>
                    </td>
                </tr>
                <tr>
                    <th>前缀图标</th>
                    <td>
                        <el-selectico v-model="setJson.prefix" style="width:200px;margin-right:12px;"
                            clearable></el-selectico>
                        后缀图标
                        <el-selectico v-model="setJson.suffix" style="width:200px;margin:0 12px;" clearable></el-selectico>
                    </td>
                </tr>
                <tr>
                    <th>输入类型</th>
                    <td>
                        <el-radio-group v-model="setJson.inputType">
                            <el-radio label="text">明文</el-radio>
                            <el-radio label="password">密码</el-radio>
                            <el-radio label="url">Url</el-radio>
                        </el-radio-group>
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
                            <el-option v-for="event in eventsJson.events" :key="event.name" :value="event.name"
                                :label="event.name"></el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <th>脚本</th>
                    <td>
                        <!--<el-input type="textarea" v-for="event in eventsJson.events" :key="'script_'+event.name" v-show="eventName==event.name" v-model="event.script" :rows="14" clearable></el-input>-->
                        <div style="width:620px" v-for="event in eventsJson.events" :key="'script_' + event.name"
                            v-show="eventName == event.name">
                            <el-codemirror v-model="event.script" height="330px"></el-codemirror>
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
const ElSelectico = inject('ElSelectico');//图标选择控件
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
const valueTypeOptions = designjs.valueTypeOptions();
const formatOptions = designjs.formatOptions();

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
//初始化当前设置
const init = (input) => {
    setJson.value = {
        field: '', width: '', defaultValue: '', align: 'left', prefix: '', suffix: ''
        , placeholder: '', disabled: false, allowClear: false, inputType: 'text',
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
        setJson.value.defaultValue = utils.decodeURI(input.getAttribute("data-defaultvalue"));
        setJson.value.width = input.getAttribute("data-width");
        setJson.value.align = input.getAttribute("data-align");
        setJson.value.prefix = input.getAttribute("data-prefix");
        setJson.value.suffix = input.getAttribute("data-suffix");
        setJson.value.disabled = input.getAttribute("data-disabled") == 'true';
        setJson.value.allowClear = input.getAttribute("data-allowclear") == 'true';
        setJson.value.readOnly = input.getAttribute("data-readonly") == 'true';
        if (parseInt(input.getAttribute("data-maxlength"))) {
            setJson.value.maxLength = parseInt(input.getAttribute("data-maxlength"));
        }
        setJson.value.placeholder = input.getAttribute("data-placeholder");
        setJson.value.inputType = input.getAttribute("data-inputtype");

        //初始化事件
        eventsJson.value = utils.getArrayObj(editor.formEventsJSON, setJson.value.id, 'id');
        if (utils.isUndef(eventsJson.value)) {
            eventsJson.value = { id: setJson.value.id, events: [{ name: 'change', script: '' }] };
            editor.formEventsJSON.push(eventsJson.value)
        } else if (utils.length(eventsJson.value.events) === 0) {
            eventsJson.value = { id: setJson.value.id, events: [{ name: 'change', script: '' }] };
        }
        eventName.value = eventsJson.value.events[0].name;
    }
    editor.currentSelectEditorElementJson = setJson.value;
    editor.initFunction_text = init;
};
</script>