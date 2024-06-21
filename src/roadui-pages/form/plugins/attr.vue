<template>
    <table class="roadui_fromtable" style="width:95%; margin: 0 auto;">
        <tr>
            <th>表单名称</th>
            <td colspan="3">
                <el-input v-model="attrJson.name" clearable />
            </td>
        </tr>
        <tr>
            <th>管理人员</th>
            <td colspan="3">
                <el-selectorg v-model="attrJson.manageUser" select-type="user" style="width: 100%" clearable></el-selectorg>
            </td>
        </tr>
        <tr>
            <th style="width:70px">数据连接</th>
            <td>
                <el-select v-model="attrJson.dbConn" @change="connChange" style="width: 100%" clearable>
                    <el-option v-for="conn in conns" :key="conn.id" :value="conn.id" :label="conn.title"></el-option>
                </el-select>
            </td>
            <th style="width:70px;padding-left:20px;">数据表</th>
            <td>
                <el-select v-model="attrJson.dbTable" style="width: 100%" @change="tableChange" filterable clearable>
                    <el-option v-for="table in tables" :key="table.key" :value="table.key" :label="table.key+(utils.length(table.label)>0?' - '+table.label:'')">
                        <span>{{table.key}}</span>
                        <span class="roadui_note1">{{utils.length(table.label)>0?' - '+table.label:''}}</span>
                    </el-option>
                </el-select>
            </td>
        </tr>
        <tr>
            <th>主键</th>
            <td>
                <el-select v-model="attrJson.dbTablePrimaryKey" style="width: 100%" filterable clearable>
                    <el-option v-for="field in fields" :key="field.name" :value="field.name" :label="field.name+(utils.length(field.comment)>0?' - '+field.comment:'')">
                        <span>{{field.name}}</span>
                        <span class="roadui_note1">{{utils.length(field.comment)>0?' - '+field.comment:''}}</span>
                    </el-option>
                </el-select>
            </td>
            <th style="padding-left:20px">标题字段</th>
            <td>
                <el-select v-model="attrJson.dbTableTitle" style="width: 100%" filterable clearable>
                    <el-option v-for="field in fields" :key="field.name" :value="field.name" :label="field.name+(utils.length(field.comment)>0?' - '+field.comment:'')">
                        <span>{{field.name}}</span>
                        <span class="roadui_note1">{{utils.length(field.comment)>0?' - '+field.comment:''}}</span>
                    </el-option>
                </el-select>
            </td>
        </tr>
        <tr>
            <th>标题表达式</th>
            <td colspan="3">
                <el-input type="textarea" :rows="3" v-model="attrJson.dbTableTitleExpression" placeholder="例：测试-{json<控件id>}，{json<控件id>}用当前业务数据对应的的控件值替换。" />
            </td>
        </tr>
        <tr>
            <th>表单分类</th>
            <td>
                <el-cascader v-model="attrJson.type" style="width:100%"
                             :props="{expandTrigger:'hover',checkStrictly:false}"
                             clearable
                             :options="apptypeOptions"></el-cascader>
            </td>
            <th style="padding-left:20px">标签宽度</th>
            <td>
                <el-input v-model="attrJson.labelCol" placeholder="默认auto" style="width:80px;margin-right:12px;" clearable></el-input>
                <span>标签后缀</span>
                <el-input v-model="attrJson.labelSuffix" placeholder="默认无" style="width:65px;margin-left:12px;" clearable></el-input>
            </td>
        </tr>
        <tr>
            <th>检验信息</th>
            <td colspan="3">
                <el-checkbox v-model="attrJson.showMessage" style="margin-right:12px">显示</el-checkbox>
                <el-checkbox v-model="attrJson.inlineMessage" v-show="attrJson.showMessage" style="margin-right:12px">行内显示</el-checkbox>
                <el-checkbox v-model="attrJson.statusIcon" v-show="attrJson.showMessage">显示图标</el-checkbox>
                <span style="margin-left:12px;"><el-checkbox v-model="attrJson.tableBorder">表格边框</el-checkbox></span>
            </td>
        </tr>
    </table>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const ElSelectorg = inject('ElSelectorg');//组织架构选择控件
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });

    const apptypeOptions = ref([]);
    const conns = ref([]);
    const tables = ref([]);
    const fields = ref([]);
    const editorName = utils.query('editorname', props.query);
    const editor = window.parent.CKEDITOR.instances[editorName];
    const attrJson = ref(editor.formAttributeJSON);
    onMounted(() => {
        loadOptions();
    });

    //载入表单分类
    const loadOptions = () => {
        const params = [{ id: 'system_applibrary_formtype', key: 'type', children: true, valueField: 'id' }];
        ajax.post('/Dictionary/getMultipleOptions', qs.stringify({ json: JSON.stringify(params) })).then((res) => {
            apptypeOptions.value = res.data['type'];
            loadConns();
            if (utils.length(attrJson.value.dbConn) > 0) {
                connChange(attrJson.value.dbConn);
            }
        }).catch(() => { });
    };
    const loadConns = () => {
        //初始化数据连接选项
        utils.getConns().then((connsList) => {
            conns.value = connsList;
        });
    };
    //连接改变时重新加载表 isLoadFields：是否加载完表后加载字段
    const connChange = (connId) => {
        utils.getConnTables(connId).then((tablesList) => {
            tables.value = tablesList;
            if (utils.length(attrJson.value.dbTable) > 0) {
                tableChange(attrJson.value.dbTable);
            }
        });
    };
    //表改变获取字段
    const tableChange = (table) => {
        utils.getConnTableFields(attrJson.value.dbConn, table).then((fieldsList) => {
            fields.value = fieldsList;
        });
    };
</script>