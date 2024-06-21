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
                            标签<el-input v-model="setJson.label" placeholder="控件label" style="width:280px;margin-left:12px;" clearable></el-input>
                        </span>
                    </td>
                </tr>
                <tr>
                    <th>默认值</th>
                    <td>
                        <el-cascader placeholder="选择默认值" :options="defaultValueOptions" :props="{expandTrigger:'hover',checkStrictly:false}" clearable @change="setDefault" style="width:260px;margin-right:18px" />
                        <el-input v-model="setJson.defaultValue" style="width:318px;" clearable></el-input>
                    </td>
                </tr>
                <tr>
                    <th>宽度</th>
                    <td>
                        <el-input v-model="setJson.width" placeholder="px或%" style="width:100px;margin-right:12px;" clearable></el-input>
                        <span style="margin-right:12px;">背景文字<el-input v-model="setJson.placeholder" placeholder="placeholder" style="width:200px;margin-left:12px" clearable></el-input></span>
                        <el-checkbox v-model="setJson.search">搜索</el-checkbox>
                        <el-checkbox v-model="setJson.allowClear">清空</el-checkbox>
                        <el-checkbox v-model="setJson.multiple">多选</el-checkbox>
                    </td>
                </tr>
                <tr>
                    <th>选项来源</th>
                    <td>
                        <el-radio-group v-model="setJson.dataSource" style="vertical-align:middle">
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
                        <el-selectdict v-model="setJson.dataSourceDict" ref="dataSourceDictRef" style="width:380px;margin-right:12px;" clearable></el-selectdict>
                        值字段
                        <el-select v-model="setJson.dataSourceDictValueField" style="width:127px;margin-left:12px" clearable>
                            <el-option v-for="opt in dictValueFieldOptions" :key="opt.value" :value="opt.value" :label="opt.label"></el-option>
                        </el-select>
                    </td>
                </tr>
                <tr v-show="setJson.dataSource=='string'">
                    <th>字符串</th>
                    <td>
                        <el-input type="textarea" :rows="3" v-model="setJson.dataSourceString" clearable placeholder="格式：选项1值,选项1标题;选项2值,选项2标题...（字符串不能有单引号)"></el-input>
                    </td>
                </tr>
                <tr v-show="setJson.dataSource=='sql'">
                    <th>SQL</th>
                    <td>
                        <el-input type="textarea" :rows="3" v-model="setJson.dataSourceSql" clearable placeholder="查询返回两个字段，选项值和选项标题。如果只返回一个字段，则选项值和选项标题一样。"></el-input>
                    </td>
                </tr>
                <tr v-show="setJson.dataSource=='url'">
                    <th>URL</th>
                    <td>
                        <el-input type="textarea" :rows="3" v-model="setJson.dataSourceUrl" clearable placeholder="post一个url地址，地址返回[{value:'值',label:'标题'},...]格式json字符串。"></el-input>
                    </td>
                </tr>
                <!--联动-->
                <tr>
                    <td colspan="2">
                        <el-collapse @change="collapseChange">
                            <el-collapse-item title="联动">
                                <div>
                                    <div>
                                        <span style="margin-right:12px">
                                            控件id
                                            <el-select v-model="setJson.linkageId" style="width:250px;margin-left:12px;" clearable>
                                                <el-option v-for="opt in linkageIdOptions" :key="opt.value" :value="opt.value" :label="opt.label"></el-option>
                                            </el-select>
                                        </span>
                                        <span>
                                            选项来源
                                            <el-radio-group v-model="setJson.linkageDataSource" style="vertical-align:middle;margin-left:12px;">
                                                <el-radio label="dict">数据字典下级</el-radio>
                                                <el-radio label="sql">SQL</el-radio>
                                                <el-radio label="url">URL</el-radio>
                                            </el-radio-group>
                                        </span>
                                    </div>
                                    <div style="margin-top:12px">
                                        <el-input type="textarea" v-model="setJson.linkageText" placeholder="加载下级SQL/URL" :rows="2" clearable></el-input>
                                    </div>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
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
                            <el-codemirror v-model="event.script" height="360px"></el-codemirror>
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
    const linkageIdOptions = ref([]);//联动字段选项
    const connOptions = ref([]);//数据连接选项
    const dataSourceDictRef = ref(null);
    const dataSourceOptions = designjs.dataSourceOptions();//选项来源选项
    const dictValueFieldOptions = designjs.dictValueFieldOptions();//数据字典值字段选项
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
    //联动面板展开时加载控件id选项
    const collapseChange = (v) => {
        if (v.length > 0) {
            if (utils.isDef(editor)) {
                linkageIdOptions.value = [];
                let elements = editor.document.getElementsByTag('input');
                for (let i = 0; i < elements.count(); i++) {
                    let id = elements.getItem(i).getAttribute('data-id');
                    //跳过自己控件
                    if (id == setJson.value.id) {
                        continue;
                    }
                    let label = elements.getItem(i).getAttribute('data-label');
                    linkageIdOptions.value.push({ value: id, label: utils.length(label) > 0 ? label + ' (' + id + ')' : id });
                }
            }
        }
    };
    //初始化
    const init = (input) => {
        setJson.value = {
            id: '', label: '', field: '', width: '', defaultValue: '', placeholder: '', selectParent: '', dataSource: ''
            , dataSourceDict: '', dataSourceDictValueField: '', search: false, allowClear: false, multiple: false
            , dataSourceString: '', dataSourceSqlConn: '', dataSourceSql: '', dataSourceUrl: ''
            , linkageId: '', linkageDataSource: '', linkageText: ''
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
            setJson.value.dataSource = input.getAttribute("data-datasource");
            setJson.value.dataSourceDict = input.getAttribute("data-datasourcedict");
            setJson.value.dataSourceDictValueField = input.getAttribute("data-datasourcedictvaluefield");
            setJson.value.dataSourceString = utils.decodeURI(input.getAttribute("data-datasourcestring"));
            setJson.value.dataSourceSqlConn = input.getAttribute("data-datasourcesqlconn");
            setJson.value.dataSourceSql = utils.decodeURI(input.getAttribute("data-datasourcesql"));
            setJson.value.dataSourceUrl = utils.decodeURI(input.getAttribute("data-datasourceurl"));
            setJson.value.search = input.getAttribute("data-search") == 'true';
            setJson.value.allowClear = input.getAttribute("data-allowclear") == 'true';
            setJson.value.multiple = input.getAttribute("data-multiple") == 'true';
            setJson.value.linkageId = input.getAttribute("data-linkageid");
            setJson.value.linkageDataSource = input.getAttribute("data-linkagedatasource");
            setJson.value.linkageText = utils.decodeURI(input.getAttribute("data-linkagetext"));

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
        editor.initFunction_select = init;
    };
</script>