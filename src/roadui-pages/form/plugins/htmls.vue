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
            <th>背景文字</th>
            <td>
                <el-input v-model="setJson.placeholder" placeholder="placeholder" style="width:99%" clearable></el-input>
            </td>
        </tr>
        <tr>
            <th>宽度</th>
            <td>
                <el-input v-model="setJson.width" placeholder="px或%" clearable style="width:180px;margin-right:12px"></el-input>
                高度<el-input v-model="setJson.height" placeholder="数字" clearable style="width:180px;margin-left:12px;"></el-input>
            </td>
        </tr>
        <tr>
            <th>工具栏</th>
            <td>
                <el-radio-group v-model="setJson.toolbar">
                    <el-radio :label="0">标准</el-radio>
                    <el-radio :label="1">简洁</el-radio>
                </el-radio-group>
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
            setJson.value.toolbar = parseInt(input.getAttribute("data-toolbar")) || 0;
            setJson.value.width = input.getAttribute("data-width");
            setJson.value.height = input.getAttribute("data-height");
            setJson.value.placeholder = input.getAttribute("data-placeholder");
        }

        editor.currentSelectEditorElementJson = setJson.value;
        editor.initFunction_html = init;
    }
</script>