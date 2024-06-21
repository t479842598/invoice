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
            <th>显示样式</th>
            <td><el-input type="textarea" v-model="setJson.style" placeholder="标签文字css样式" style="width:601px" :rows="3"></el-input></td>
        </tr>
        <tr>
            <th></th>
            <td>
                <el-checkbox v-model="setJson.isSet">始终设置默认值</el-checkbox>
                <span class="roadui_note1" style="margin-left:18px;vertical-align:2px;">每次都重新加载默认值</span>
            </td>
        </tr>
    </table>
</template>

<script setup>
    import designjs from '../form-design.js';
    import { ref, inject, onMounted } from 'vue';
    const utils = inject('utils');

    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const editorName = utils.query('editorname', props.query);
    const editor = window.parent.CKEDITOR.instances[editorName];
    const attrJson = editor.formAttributeJSON;
    const setJson = ref({});
    const defaultValueOptions = designjs.defaultValueOptions();
    const fieldsOptions = ref([]);

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
            id: '', label: '', field: '', defaultValue: '', placeholder: '', width: '', height: '', toolbar: 0,
        };
        if (!input) {
            input = editor.currentSelectEditorElement;
        }
        if (input) {
            setJson.value.id = input.getAttribute("data-id");
            setJson.value.label = input.getAttribute("data-label");
            setJson.value.field = input.getAttribute("data-bindfiled");
            setJson.value.defaultValue = utils.decodeURI(input.getAttribute("data-defaultvalue"));
            setJson.value.style = utils.decodeURI(input.getAttribute("data-style") || '');
            setJson.value.isSet = input.getAttribute("data-isset") == 'true';
        }

        editor.currentSelectEditorElementJson = setJson.value;
        editor.initFunction_label = init;
    }
</script>