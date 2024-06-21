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
            <th>按钮类型</th>
            <td>
                <el-radio-group v-model="setJson.buttonType">
                    <el-radio label="primary">主要</el-radio>
                    <el-radio label="">默认</el-radio>
                    <el-radio label="success">成功</el-radio>
                    <el-radio label="warning">警告</el-radio>
                    <el-radio label="danger">危险</el-radio>
                    <el-radio label="info">信息</el-radio>
                    <el-radio label="text">文本</el-radio>
                </el-radio-group>
            </td>
        </tr>
        <tr>
            <th></th>
            <td><el-checkbox v-model="setJson.sign">默认已签</el-checkbox></td>
        </tr>
    </table>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const utils = inject('utils');

    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const editorName = utils.query('editorname', props.query);
    const editor = window.parent.CKEDITOR.instances[editorName];
    const attrJson = editor.formAttributeJSON;
    const setJson = ref({});
    const fieldsOptions = ref([]);

    onMounted(() => {
        if (attrJson) {
            utils.getConnTableFields(attrJson.dbConn, attrJson.dbTable).then(fields => {
                fieldsOptions.value = fields;
            });
        }
        init();
    });
    const init = (input) => {
        setJson.value = {
            id: '', label: '', field: '', buttonType: '', sign: false,
        };
        if (!input) {
            input = editor.currentSelectEditorElement;
        }
        if (input) {
            setJson.value.id = input.getAttribute("data-id");
            setJson.value.label = input.getAttribute("data-label");
            setJson.value.field = input.getAttribute("data-bindfiled");
            setJson.value.buttonType = input.getAttribute("data-buttontype") || '';
            //setJson.value.password = input.getAttribute("data-password") == 'true';
            setJson.value.sign = input.getAttribute("data-sign") == 'true';
        }

        editor.currentSelectEditorElementJson = setJson.value;
        editor.initFunction_signature = init;
    }
</script>