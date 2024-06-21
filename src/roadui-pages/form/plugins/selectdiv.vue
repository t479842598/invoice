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
                    <th>弹出页面</th>
                    <td>
                        <el-cascader v-model="setJson.applibraryTypeId" placeholder="请选择应用分类" :options="apptypeOptions" @change="typeSelect" :props="{expandTrigger:'hover',checkStrictly:false}" clearable style="width:260px;margin-right:18px"></el-cascader>
                        <el-select v-model="setJson.applibraryId" @change="appSelect" style="width:323px;" clearable>
                            <el-option v-for="type in appOptions" :key="type.id" :value="type.id" :label="type.label">
                                <span>{{type.label+(utils.length(type.note)>0?' - '+type.note:'')}}</span>
                            </el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <th>值字段</th>
                    <td>
                        <el-select v-model="setJson.valueField" style="width:260px;" clearable>
                            <el-option v-for="op in valueFields" :key="op.value" :value="op.value" :label="op.title"></el-option>
                        </el-select>
                        <span style="margin-left:12px;">
                            标题字段<el-select v-model="setJson.titleField" :options="titleFields" style="width: 257px; margin-left: 12px;" clearable>
                                <el-option v-for="op in titleFields" :key="op.value" :value="op.value" :label="op.title"></el-option>
                            </el-select>
                        </span>
                    </td>
                </tr>
                <tr>
                    <th>值分隔符</th>
                    <td>
                        <el-input v-model="setJson.valueSeparator" placeholder="多选时多个值之间的分隔符" style="width:260px;" clearable></el-input>
                        <span style="margin-left:12px;">
                            标题分隔符<el-input v-model="setJson.titleSeparator" placeholder="多选时多个标题之间的分隔符" style="width: 243px; margin-left: 12px;" clearable></el-input>
                        </span>
                    </td>
                </tr>
                <tr>
                    <th>窗口标题</th>
                    <td>
                        <el-input v-model="setJson.modalTitle" style="width:100px;" clearable></el-input>
                        <span style="margin-left:10px;">
                            背景文字<el-input v-model="setJson.placeholder" placeholder="placeholder" style="width: 100px; margin-left: 12px; " clearable></el-input>
                        </span>
                        <span style="margin-left:10px;">
                            控件宽度<el-input v-model="setJson.width" placeholder="px或%" style="width: 70px; margin-left: 12px;" allow-clear></el-input>
                        </span>
                        <span style="margin-left:10px;">
                            窗口宽度<el-input-number v-model="setJson.modalWidth" controls-position="right" style="width: 85px; margin-left: 12px;"></el-input-number>
                        </span>
                    </td>
                </tr>
                <tr>
                    <th>参数</th>
                    <td>
                        <el-input v-model="setJson.params" style="width:601px;" allow-clear placeholder="js表达式，例'size=5&test='+this.formData['id']"></el-input>
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
                        <!--<el-input type="textarea" v-for="event in eventsJson.events" :key="'script_'+event.name" v-show="eventName==event.name" v-model="event.script" :rows="16" clearable></el-input>-->
                        <div style="width:620px" v-for="event in eventsJson.events" :key="'script_'+event.name" v-show="eventName==event.name">
                            <el-codemirror v-model="event.script" height="350px"></el-codemirror>
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
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
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
    const apptypeOptions = ref([]);
    const appOptions = ref([]);
    const valueFields = ref([]);
    const titleFields = ref([]);

    onMounted(() => {
        if (attrJson) {
            utils.getConnTableFields(attrJson.dbConn, attrJson.dbTable).then(fields => {
                fieldsOptions.value = fields;
                loadOptions();
            });
        }
    });
    //设置默认值
    const setDefault = (v) => {
        if (utils.length(v) === 0) {
            return;
        }
        setJson.value.defaultValue += v[v.length - 1];
    };
    //载入分类
    const loadOptions = () => {
        if (utils.length(apptypeOptions.value) > 0) {
            init();
            return;//如果已加载，则不加载。
        }
        const params = [{ id: 'system_applibrary_type', key: 'type', children: true, valueField: 'id' }];
        ajax.post('/Dictionary/GetMultipleOptions', qs.stringify({ json: JSON.stringify(params) })).then((res) => {
            apptypeOptions.value = res.data['type'];
            init();
        }).catch(() => { });
    };
    //类型选择时载入类型下的应用
    const typeSelect = (val) => {
        if (utils.length(val) > 0) {
            ajax.post('/Applibrary/GetOptions?typeid=' + val[val.length - 1]).then((res) => {
                appOptions.value = res.data;
            }).catch(() => { });
        } else {
            setJson.value.applibraryId = '';
            appOptions.value = [];
        }
    };
    //选择应用后加载应用对应的字段
    const appSelect = (val) => {
        //设置应用地址
        const appObj = utils.getArrayObj(appOptions.value, val, 'id');
        if (utils.isDef(appObj)) {
            setJson.value['applibraryAddress'] = appObj.address;
        }
        ajax.post('/Program/GetFieldOptionsByApplibraryId?applibraryid=' + val).then((res) => {
            valueFields.value = res.data;
            titleFields.value = res.data;
        }).catch(() => { });
    };
    //初始化
    const init = (input) => {
        setJson.value = {
            id: '', label: '', field: '', width: '', defaultValue: '', placeholder: ''
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
            setJson.value.applibraryTypeId = JSON.parse(utils.decodeURI(input.getAttribute("data-applibrarytypeid") || '[]')) || [];
            setJson.value.applibraryId = utils.decodeURI(input.getAttribute("data-applibraryid"));
            setJson.value.applibraryAddress = utils.decodeURI(input.getAttribute("data-applibraryaddress"));
            setJson.value.valueField = input.getAttribute("data-valuefield");
            setJson.value.titleField = input.getAttribute("data-titlefield");
            setJson.value.valueSeparator = input.getAttribute("data-valueseparator");
            setJson.value.titleSeparator = input.getAttribute("data-titleseparator");
            setJson.value.modalTitle = input.getAttribute("data-modaltitle");
            setJson.value.placeholder = input.getAttribute("data-placeholder");
            setJson.value.width = input.getAttribute("data-width");
            if (utils.isNumberString(input.getAttribute("data-modalwidth"))) {
                setJson.value.modalWidth = utils.toNumber(input.getAttribute("data-modalwidth"));
            }
            //setJson.value.modalHeight = input.getAttribute("data-modalheight");
            setJson.value.params = utils.decodeURI(input.getAttribute("data-params"));

            //加载应用分类下的应用
            if (setJson.value.applibraryTypeId.length > 0) {
                typeSelect(setJson.value.applibraryTypeId);
            }
            //加载应用对应的字段
            if (utils.length(setJson.value.applibraryId) > 0) {
                appSelect(setJson.value.applibraryId);
            }

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
        editor.initFunction_selectdiv = init;
    };
</script>