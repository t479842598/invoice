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
            <th>背景文字</th>
            <td>
                <el-input v-model="setJson.placeholder" style="width:601px" clearable placeholder="没有流水号时显示的提示文字"></el-input>
            </td>
        </tr>
        <tr v-for="(s,index) in setJson.serial" :key="index">
            <th>
                <el-button v-if="index===0" @click="serialAdd()">添加</el-button>
                <el-button v-else @click="serialDel(index)">删除</el-button>
            </th>
            <td>
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
                    <tr>
                        <th style="width:50px">流水号</th>
                        <td>
                            <el-select v-model="s.serial" placeholder="选择流水号" style="width:539px" clearable>
                                <el-option v-for="opt in serialOptions" :key="opt.value" :value="opt.value" :label="opt.label"></el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <th>条件</th>
                        <td><el-input style="width: 539px" v-model="s.data" clearable></el-input></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const utils = inject('utils');
    const ajax = inject('ajax');

    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const editorName = utils.query('editorname', props.query);
    const editor = window.parent.CKEDITOR.instances[editorName];
    const attrJson = editor.formAttributeJSON;
    const setJson = ref({});
    const fieldsOptions = ref([]);
    const serialOptions = ref([]);

    onMounted(() => {
        if (attrJson) {
            utils.getConnTableFields(attrJson.dbConn, attrJson.dbTable).then(fields => {
                fieldsOptions.value = fields;
            });
        }
        //载入流水号选项
        ajax.post('/SerialNumber/GetOptions').then((res) => {
            serialOptions.value = res.data;
            init();
        }).catch(() => { });
    });
    
    const init = (input) => {
        setJson.value = {
            id: '', label: '', field: '', serial: [{ serial: '', data: '' }], placeholder: ''
        };
        if (!input) {
            input = editor.currentSelectEditorElement;
        }
        if (input) {
            setJson.value.id = input.getAttribute("data-id");
            setJson.value.label = input.getAttribute("data-label");
            setJson.value.field = input.getAttribute("data-bindfiled");
            setJson.value.placeholder = input.getAttribute("data-placeholder");
            try {
                setJson.value.serial = JSON.parse(utils.decodeURI(input.getAttribute("data-serial")));
            } catch (e) {
                setJson.value.serial = [{ serial: '', data: '' }];
            }
            if (utils.length(setJson.value.serial) === 0) {
                setJson.value.serial = [{ serial: '', data: '' }];
            }
        }

        editor.currentSelectEditorElementJson = setJson.value;
        editor.initFunction_serialnumber = init;
    };

    const serialAdd = () => {
        setJson.value.serial.push({ serial: '', data: '' });
    };

    const serialDel = (index) => {
        setJson.value.serial.splice(index, 1);
    };
</script>