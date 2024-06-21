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
                        <el-input v-model="setJson.width" placeholder="px或%" clearable style="width:100px;margin-right:12px;"></el-input>
                        <span style="margin-right:12px;">背景文字<el-input v-model="setJson.placeholder" placeholder="placeholder" clearable style="width:120px;margin-left:12px;"></el-input></span>
                        <el-checkbox v-model="setJson.allowClear" style="vertical-align:middle">可清空</el-checkbox>
                        <span style="margin-left:12px;">
                            展开方式
                            <el-radio-group v-model="setJson.expandTrigger" style="margin-left:12px;vertical-align:middle;">
                                <el-radio label="click">单击</el-radio>
                                <el-radio label="hover">移入</el-radio>
                            </el-radio-group>
                        </span>
                    </td>
                </tr>
                <tr>
                    <th>值类型</th>
                    <td style="padding-top:1px;padding-bottom:1px;">
                        <el-radio-group v-model="setJson.emitPath" style="vertical-align:middle;">
                            <el-radio label="0">全路径数组</el-radio>
                            <el-radio label="1">最后节点值</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr>
                    <th>选项来源</th>
                    <td>
                        <el-radio-group v-model="setJson.dataSource" style="vertical-align:middle;">
                            <el-radio v-for="opt in dataSourceOptions" :key="opt.value" :label="opt.value">{{opt.label}}</el-radio>
                        </el-radio-group>
                        <span v-show="setJson.dataSource=='sql'" style="margin-left:12px">
                            数据连接
                            <el-select v-model="setJson.dataSourceSqlConn" placeholder="选择执行SQL的数据连接" clearable style="width:200px;margin:0 12px;vertical-align:middle">
                                <el-option v-for="(conn,index) in connOptions" :key="'conn_'+index" :value="conn.id" :label="conn.title"></el-option>
                            </el-select>
                        </span>
                    </td>
                </tr>
                <tr v-show="setJson.dataSource=='dict'">
                    <th>字典项</th>
                    <td>
                        <el-selectdict v-model="setJson.dataSourceDict" ref="dataSourceDictRef" style="width:400px;margin-right:12px;"></el-selectdict>
                        值字段
                        <el-select v-model="setJson.dataSourceDictValueField" style="width:127px;margin-left:12px;" clearable>
                            <el-option v-for="opt in dictValueFieldOptions" :key="opt.value" :value="opt.value" :label="opt.label"></el-option>
                        </el-select>
                    </td>
                </tr>
                <tr v-show="setJson.dataSource=='string'">
                    <th>字符串</th>
                    <td>
                        <el-input type="textarea" :rows="3" v-model="setJson.dataSourceString" placeholder="cascader控件的json格式字符串：[{value:'',label:'',children:[{value:'',label:''}]}]。"></el-input>
                    </td>
                </tr>
                <tr v-show="setJson.dataSource=='sql'">
                    <th>SQL</th>
                    <td>
                        <el-input type="textarea" :rows="3" v-model="setJson.dataSourceSql" placeholder="通过sql查询返回一个json格式字符串：[{value:'',label:'',children:[{value:'',label:''}]}]。"></el-input>
                    </td>
                </tr>
                <tr v-show="setJson.dataSource=='url'">
                    <th>URL</th>
                    <td>
                        <el-input type="textarea" :rows="3" v-model="setJson.dataSourceUrl" placeholder="post一个url地址，返回一个json格式字符串：[{value:'',label:'',children:[{value:'',label:''}]}]。"></el-input>
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
    import { ref, inject, onMounted, watch } from 'vue';
    const utils = inject('utils');
    const ElSelectdict = inject('ElSelectdict');//数据字典选择控件
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
    const connOptions = ref([]);//数据连接选项
    const dataSourceOptions = designjs.dataSourceOptions();//选项来源选项
    const dictValueFieldOptions = designjs.dictValueFieldOptions();//数据字典值字段选项
    const dataSourceDictRef = ref(null);
    onMounted(() => {
        if (attrJson) {
            utils.getConnTableFields(attrJson.dbConn, attrJson.dbTable).then(fields => {
                fieldsOptions.value = fields;
            });
        }
        init();
    });
    //如果数据源选择SQL，则加载数据连接选项。
    watch(() => setJson.value.dataSource, (val) => {
        if (val == 'sql') {
            utils.getConns().then((conns) => {
                connOptions.value = conns;
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
    const init = (input) => {
        setJson.value = {
            id: '', label: '', field: '', width: '', defaultValue: '', placeholder: '', selectParent: '', dataSource: ''
            , dataSourceDict: '', dataSourceDictValueField: '', search: false, allowClear: false, expandTrigger: 'click'
            , dataSourceString: '', dataSourceSqlConn: '', dataSourceSql: '', dataSourceUrl: ''
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
            setJson.value.expandTrigger = input.getAttribute("data-expandtrigger");
            setJson.value.dataSource = input.getAttribute("data-datasource");
            setJson.value.dataSourceDict = input.getAttribute("data-datasourcedict");
            setJson.value.dataSourceDictValueField = input.getAttribute("data-datasourcedictvaluefield");
            setJson.value.dataSourceString = utils.decodeURI(input.getAttribute("data-datasourcestring"));
            setJson.value.dataSourceSqlConn = input.getAttribute("data-datasourcesqlconn");
            setJson.value.dataSourceSql = utils.decodeURI(input.getAttribute("data-datasourcesql"));
            setJson.value.dataSourceUrl = utils.decodeURI(input.getAttribute("data-datasourceurl"));
            setJson.value.search = input.getAttribute("data-search") == 'true';
            setJson.value.allowClear = input.getAttribute("data-allowclear") == 'true';
            setJson.value.emitPath = input.getAttribute("data-emitPath");

            dataSourceDictRef.value.initTitle(setJson.value.dataSourceDict);

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
        editor.initFunction_cascader = init;
    }
</script>