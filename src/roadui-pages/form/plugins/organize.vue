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
                        <el-input v-model="setJson.width" placeholder="%或px" style="width:116px;margin-right:12px;" clearable></el-input>
                        背景文字<el-input v-model="setJson.placeholder" placeholder="placeholder" style="width:155px;margin:0 12px;" clearable></el-input>
                        <span style="margin-right: 12px; vertical-align: middle">
                            <el-checkbox v-model="setJson.multiple" tyle="vertical-align:middle;">多选</el-checkbox>
                        </span>
                        <span v-show="setJson.multiple" style="vertical-align:middle">
                            选择个数
                            <el-input-number v-model="setJson.selectSize" style="width:90px;margin-left:12px;vertical-align:middle" clearable controls-position="right"></el-input-number>
                        </span>
                    </td>
                </tr>
                <tr>
                    <th>选择类型</th>
                    <td>
                        <el-checkbox-group v-model="setJson.selectType">
                            <el-checkbox label="unit">单位</el-checkbox>
                            <el-checkbox label="dept">部门</el-checkbox>
                            <el-checkbox label="station">岗位</el-checkbox>
                            <el-checkbox label="user">用户</el-checkbox>
                            <el-checkbox label="workgroup">工作组</el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <th>选择范围</th>
                    <td>
                        <el-checkbox-group v-model="setJson.selectRange">
                            <el-checkbox label="{<initiatorDeptId>}">发起者部门</el-checkbox>
                            <el-checkbox label="{<initiatorUnitId>}">发起者单位</el-checkbox>
                            <el-checkbox label="{<senderDeptId>}">处理者部门</el-checkbox>
                            <el-checkbox label="{<senderUnitId>}">处理者单位</el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <th>指定范围</th>
                    <td>
                        <el-selectorg ref="selectOrgRef" v-model="setJson.range" style="width:100%" clearable />
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
                            <el-codemirror v-model="event.script" height="320px"></el-codemirror>
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
    const ElSelectorg = inject('ElSelectorg');//组织架构选择控件
    const ElCodemirror = inject('ElCodemirror');
    const selectOrgRef = ref(null);

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
            id: '', label: '', field: '', width: '', defaultValue: '', multiple: false, selectType: [], range: '', selectRange: [],
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
            setJson.value.selectType = (input.getAttribute("data-selecttype") || 'unit,dept,station,user,workgroup').split(',');
            setJson.value.range = input.getAttribute("data-range");
            setJson.value.selectRange = (input.getAttribute("data-selectrange") || '').split(',');
            setJson.value.multiple = input.getAttribute("data-multiple") == 'true';
            if (parseInt(input.getAttribute("data-selectsize"))) {
                setJson.value.selectSize = parseInt(input.getAttribute("data-selectsize"));
            }

            //初始化选择范围组织架构控件标题
            selectOrgRef.value.initTitle(setJson.value.range);

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
        editor.initFunction_organize = init;
    }
</script>