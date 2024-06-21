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
                    <th>宽度</th>
                    <td>
                        <el-input v-model="setJson.width" placeholder="%或px" clearable style="width:260px;margin-right:12px;"></el-input>
                        背景文字<el-input v-model="setJson.placeholder" placeholder="placeholder" clearable style="width:257px;margin-left:12px;"></el-input>
                    </td>
                </tr>
                <tr>
                    <th>选择类型</th>
                    <td>
                        <el-select v-model="setJson.selectType" clearable style="width: 260px;">
                            <el-option value="date" label="日期 - date"></el-option>
                            <el-option value="datetime" label="日期时间 - datetime"></el-option>
                            <el-option value="daterange" label="日期范围 - daterange"></el-option>
                            <el-option value="datetimerange" label="日期时间范围 - datetimerange"></el-option>
                            <el-option value="year" label="年 - year"></el-option>
                            <el-option value="month" label="月 - month"></el-option>
                            <el-option value="monthrange" label="月范围 - monthrange"></el-option>
                            <el-option value="week" label="周 - week"></el-option>
                            <el-option value="dates" label="多个日期 - dates"></el-option>
                            <el-option value="time" label="时间 - time"></el-option>
                        </el-select>
                        <span style="margin-left:12px;"><el-checkbox v-model="setJson.clearable" label="可清除"></el-checkbox></span>
                        <span style="margin-left:12px;" v-show="setJson.selectType==='daterange'||setJson.selectType==='datetimerange'"><el-checkbox v-model="setJson.shortcuts" label="快捷选项"></el-checkbox></span>
                        <span style="margin-left:12px;" v-show="setJson.selectType==='daterange'||setJson.selectType==='datetimerange'||setJson.selectType==='monthrange'">分隔符<el-input v-model="setJson.separator" style="width:109px;margin-left:12px;" placeholder="默认-"></el-input></span>
                    </td>
                </tr>
                <tr v-show="setJson.selectType==='time'">
                    <th>开始时间</th>
                    <td>
                        <el-input v-model="setJson.startTime" placeholder="" style="width: 75px;"></el-input>
                        <span style="margin-left:12px;">
                            <span style="margin-right:12px;">结束</span>
                            <el-input v-model="setJson.endTime" placeholder="" style="width: 75px;"></el-input>
                        </span>
                        <span style="margin-left:12px;">
                            <span style="margin-right:12px;">最早</span>
                            <el-input v-model="setJson.minTime" placeholder="" style="width: 75px;"></el-input>
                        </span>
                        <span style="margin-left:12px;">
                            <span style="margin-right:12px;">最晚</span>
                            <el-input v-model="setJson.maxTime" placeholder="" style="width: 75px;"></el-input>
                        </span>
                        <span style="margin-left:12px;">
                            <span style="margin-right:12px;">步长</span>
                            <el-input v-model="setJson.stepTime" placeholder="" style="width: 75px;"></el-input>
                        </span>
                    </td>
                </tr>
                <tr>
                    <th>显示格式</th>
                    <td>
                        <el-input v-model="setJson.format" placeholder="例：YYYY-MM-DD" style="width:260px;margin-right:12px"></el-input>
                        <span>值格式</span>
                        <el-input v-model="setJson.valueFormat" placeholder="例：YYYY-MM-DD" style="width:275px;margin-left:12px;"></el-input>
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
                        <!--<el-input type="textarea" v-for="event in eventsJson.events" :key="'script_'+event.name" v-show="eventName==event.name" v-model="event.script" :rows="14" clearable></el-input>-->
                        <div style="width:620px" v-for="event in eventsJson.events" :key="'script_'+event.name" v-show="eventName==event.name">
                            <el-codemirror v-model="event.script" height="340px"></el-codemirror>
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
            id: '', label: '', field: '', width: '', defaultValue: '', placeholder: '', selectType: 'date', clearable: true, shortcuts: false
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
            setJson.value.placeholder = input.getAttribute("data-placeholder");
            setJson.value.selectType = input.getAttribute("data-selecttype");
            setJson.value.shortcuts = input.getAttribute("data-shortcuts") == 'true';
            setJson.value.clearable = input.getAttribute("data-clearable") == 'true';
            setJson.value.format = input.getAttribute("data-format");
            setJson.value.valueFormat = input.getAttribute("data-valueformat");
            setJson.value.separator = input.getAttribute("data-separator") || '';
            setJson.value.startTime = input.getAttribute("data-starttime") || '';
            setJson.value.endTime = input.getAttribute("data-endtime") || '';
            setJson.value.minTime = input.getAttribute("data-mintime") || '';
            setJson.value.maxTime = input.getAttribute("data-maxtime") || '';
            setJson.value.stepTime = input.getAttribute("data-steptime") || '';

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
        editor.initFunction_datetime = init;
    };
</script>