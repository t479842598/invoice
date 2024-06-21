<template>
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
                    标签<el-input v-model="setJson.label" placeholder="控件label" style="width:275px;margin-left:12px;" clearable></el-input>
                </span>
            </td>
        </tr>
        <tr>
            <th>尺寸</th>
            <td>
                <el-radio-group v-model="setJson.size" style="margin-right:12px;vertical-align:middle;">
                    <el-radio label="default">默认</el-radio>
                    <el-radio label="large">大</el-radio>
                    <el-radio label="small">小</el-radio>
                </el-radio-group>
                <el-checkbox v-model="setJson.border" style="vertical-align:middle;margin-right:12px">边框</el-checkbox>
                <el-checkbox v-model="setJson.stripe" style="vertical-align:middle;margin-right:12px">斑马纹</el-checkbox>
                宽度
                <el-input v-model="setJson.width" style="width: 90px; margin:0 12px"></el-input>
                高度<el-input v-model="setJson.height" style="width: 90px;margin-left:12px"></el-input>
            </td>
        </tr>
        <tr>
            <th>数据来源</th>
            <td>
                <el-radio-group v-model="setJson.dataSource" style="margin-right:12px;vertical-align:middle;">
                    <el-radio label="sql">SQL</el-radio>
                    <el-radio label="url">URL</el-radio>
                </el-radio-group>
                <span v-show="setJson.dataSource=='sql'">
                    数据连接
                    <el-select v-model="setJson.dataSourceSqlConn" style="width:210px;margin-left:12px;vertical-align:middle;">
                        <el-option v-for="(conn,index) in connOptions" :key="'conn_'+index" :value="conn.id" :label="conn.title"></el-option>
                    </el-select>
                </span>
               
            </td>
        </tr>
        <tr>
            <th>SQL/URL</th>
            <td>
                <el-input type="textarea" :rows="3" v-model="setJson.dataSourceText"></el-input>
            </td>
        </tr>
        <tr>
            <th>列设置</th>
            <td>
                <el-input type="textarea" :rows="5" v-model="setJson.columns" placeholder="<el-table-column type='selection' width='45'/>..."></el-input>
            </td>
        </tr>
    </table>
</template>

<script setup>
    import { ref, inject, onMounted, watch } from 'vue';
    const utils = inject('utils');

    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const editorName = utils.query('editorname', props.query);
    const editor = window.parent.CKEDITOR.instances[editorName];
    const attrJson = editor.formAttributeJSON;
    const setJson = ref({});
    const fieldsOptions = ref([]);
    const connOptions = ref([]);//数据连接选项

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

    const init = (input) => {
        setJson.value = {
            id: '', field: '', label: '', title: false, width: '', height: '', border: false, stripe: false, columns: '', dataSource: '',
            dataSourceSqlConn: '', dataSourceText: '', size: ''
        };
        if (!input) {
            input = editor.currentSelectEditorElement;
        }
        if (input) {
            setJson.value.id = input.getAttribute("data-id");
            setJson.value.label = input.getAttribute("data-label");
            setJson.value.field = input.getAttribute("data-bindfiled");
            setJson.value.title = input.getAttribute("data-title") == 'true';
            setJson.value.width = input.getAttribute("data-width");
            setJson.value.height = input.getAttribute("data-height");
            setJson.value.border = input.getAttribute("data-border") == 'true';
            setJson.value.stripe = input.getAttribute("data-stripe") == 'true';
            setJson.value.size = input.getAttribute("data-size");
            setJson.value.columns = utils.decodeURI(input.getAttribute("data-columns"));
            setJson.value.dataSource = input.getAttribute("data-datasource");
            setJson.value.dataSourceSqlConn = input.getAttribute("data-datasourcesqlconn");
            setJson.value.dataSourceText = utils.decodeURI(input.getAttribute("data-datasourcetext"));
        }

        editor.currentSelectEditorElementJson = setJson.value;
        editor.initFunction_datatable = init;
    }
</script>