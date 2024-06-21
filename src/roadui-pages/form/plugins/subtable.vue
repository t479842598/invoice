<template>
    <div style="height:100%;">
        <table class="roadui_formtable" style="width:98%; margin: 0 auto;">
            <tr>
                <th style="width: 60px">子表</th>
                <td>
                    <el-select v-model="subtableJson.table" @change="subtableChange" filterable clearable>
                        <el-option v-for="table in tables" :key="table.key" :value="table.key" :label="table.key+(utils.length(table.label)>0?' - '+table.label:'')">
                            <span>{{table.key}}</span>
                            <span class="roadui_note1">{{utils.length(table.label)>0?' - '+table.label:''}}</span>
                        </el-option>
                    </el-select>
                </td>
                <th style="width:60px;padding-left:12px;">子表主键</th>
                <td>
                    <el-select v-model="subtableJson.primaryKey" filterable clearable>
                        <el-option v-for="field in subtableFields" :key="field.name" :value="field.name" :label="field.name+(utils.length(field.comment)>0?' - '+field.comment:'')">
                            <span>{{field.name}}</span>
                            <span class="roadui_note1">{{utils.length(field.comment)>0?' - '+field.comment:''}}</span>
                        </el-option>
                    </el-select>
                </td>
                <th style="width: 60px; padding-left: 12px;">主表字段</th>
                <td>
                    <el-select v-model="subtableJson.primaryTableKey" filterable clearable>
                        <el-option v-for="field in fields" :key="field.name" :value="field.name" :label="field.name+(utils.length(field.comment)>0?' - '+field.comment:'')">
                            <span>{{field.name}}</span>
                            <span class="roadui_note1">{{utils.length(field.comment)>0?' - '+field.comment:''}}</span>
                        </el-option>
                    </el-select>
                </td>
                <th style="width: 60px; padding-left: 12px;">关联字段</th>
                <td>
                    <el-select v-model="subtableJson.linkField" filterable clearable>
                        <el-option v-for="field in subtableFields" :key="field.name" :value="field.name" :label="field.name+(utils.length(field.comment)>0?' - '+field.comment:'')">
                            <span>{{field.name}}</span>
                            <span class="roadui_note1">{{utils.length(field.comment)>0?' - '+field.comment:''}}</span>
                        </el-option>
                    </el-select>
                </td>
            </tr>
            <tr>
                <th>标签</th>
                <td>
                    <el-input v-model="subtableJson.label" clearable style="width:75px"></el-input>
                    <span style="margin-left:10px">
                        <el-checkbox v-model="subtableJson.rowNumber" style="vertical-align:middle">序号</el-checkbox>
                    </span>
                    <span style="margin-left:10px">
                        <el-button type="primary" text bg @click="setEvent()">事件</el-button>
                    </span>
                </td>
                <th style="padding-left:12px;">表格大小</th>
                <td>
                    <el-select v-model="subtableJson.size" clearable style="width:72px;vertical-align:2px;" placeholder="size">
                        <el-option value="default" label="默认"></el-option>
                        <el-option value="large" label="大"></el-option>
                        <el-option value="small" label="小"></el-option>
                    </el-select>
                    <el-checkbox v-model="subtableJson.bordered" style="margin:0 0 0 10px">边框</el-checkbox>
                    <el-checkbox v-model="subtableJson.stripe" style="margin-left:10px">斑马纹</el-checkbox>
                </td>
                <th style="padding-left: 12px;">表格宽度</th>
                <td>
                    <el-input v-model="subtableJson.width" clearable style="width:76px" placeholder="px或%"></el-input>
                    <span style="margin:0 12px;">高度</span>
                    <el-input v-model="subtableJson.height" clearable style="width:76px;" placeholder="数字"></el-input>
                </td>
                <th style="padding-left: 12px;">子表id</th>
                <td>
                    <el-input v-model="subtableJson.id" clearable style="width:140px"></el-input>
                    <el-checkbox v-model="subtableJson.pager" style="margin-left:10px;vertical-align:middle;">分页</el-checkbox>
                </td>
            </tr>
        </table>
        <div>
            <el-table :data="columnList" stripe style="width:100%" :height="tableHeight">
                <el-table-column prop="field" label="字段">
                    <template #default="scope">
                        <el-select v-model="scope.row.field" @change="setName(scope.row)" clearable style="width:100%">
                            <el-option v-for="field in subtableFields" :key="field.name" :value="field.name" :label="field.name+(utils.length(field.comment)>0?' - '+field.comment:'')">
                                <span>{{field.name}}</span>
                                <span class="roadui_note1">{{utils.length(field.comment)>0?' - '+field.comment:''}}</span>
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="显示标题" width="200">
                    <template #default="scope">
                        <el-input v-model="scope.row.name" clearable></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="align" label="对齐" width="120">
                    <template #default="scope">
                        <el-select v-model="scope.row.align" clearable>
                            <el-option value="left" label="左对齐"></el-option>
                            <el-option value="center" label="居中"></el-option>
                            <el-option value="right" label="右对齐"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="width" label="宽度" width="100">
                    <template #default="scope">
                        <el-input v-model="scope.row.width" clearable></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="editMode" label="编辑控件" width="160">
                    <template #default="scope">
                        <el-button @click="setEdit(scope.row)">{{scope.row.edit.title||'输入框'}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="sum" label="合计" width="60" align="center">
                    <template #default="scope">
                        <el-checkbox v-model="scope.row.sum" />
                    </template>
                </el-table-column>
                <el-table-column prop="order" label="排序" width="60" align="center">
                    <template #default="scope">
                        <el-checkbox v-model="scope.row.order" />
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="显示顺序" width="110">
                    <template #default="scope">
                        <el-button-group>
                            <el-button size="small" @click="colUp(scope.row)"><el-icon><ArrowUpBold /></el-icon></el-button>
                            <el-button size="small" @click="colDown(scope.row)"><el-icon><ArrowDownBold /></el-icon></el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
                <el-table-column width="80">
                    <template #header>
                        <el-button size="small" type="primary" @click="addColumn">添加</el-button>
                    </template>
                    <template #default="scope">
                        <el-button size="small" type="primary" @click="delColumn(scope.row)">移出</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog v-model="dialogShow" :title="dialogTitle" align-center destroy-on-close width="96%" class="el-dialog_formdesign_subtable_margin" :close-on-click-modal="false">
            控件类型
            <el-select style="width:200px;margin:0 0 0 12px;" @change="setEditChange" v-model="setEditRecord.type">
                <el-option v-for="type in ctlTypes" :value="type.value" :label="type.label" :key="type.value"></el-option>
            </el-select>
            <el-button style="margin-left:12px;" @click="dialogShow=false">关闭</el-button>
            <component :is="dialogPage" :query="dialogQuery"></component>
        </el-dialog>
        <!--子表事件dialog-->
        <el-dialog v-model="eventDialogShow" title="事件" align-center destroy-on-close width="96%" class="el-dialog_formdesign_subtable_margin" :close-on-click-modal="false">
            <table class="roadui_formtable" style="width:98%; margin: 0 auto;">
                <tr>
                    <th style="width:50px">事件</th>
                    <td>
                        <el-select v-model="eventValue">
                            <el-option v-for="event in subtableJson.events" :key="event.value" :value="event.value" :label="event.title"></el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <th>脚本</th>
                    <td>
                        <div v-for="event in subtableJson.events" :key="'script_'+event.value" v-show="eventValue==event.value">
                            <el-codemirror v-model="event.script" height="340px" style="width:100%;"></el-codemirror>
                        </div>
                    </td>
                </tr>
            </table>
        </el-dialog>
    </div>
</template>

<script setup>
    import EditTexts from './subtable/texts.vue';
    import EditTextareas from './subtable/textareas.vue';
    import EditNumber from './subtable/number.vue';
    import EditSelects from './subtable/selects.vue';
    import EditCascader from './subtable/cascader.vue';
    import EditSelectdiv from './subtable/selectdiv.vue';
    import EditRadio from './subtable/radio.vue';
    import EditCheckbox from './subtable/checkbox.vue';
    import EditSwitchs from './subtable/switchs.vue';
    import EditDatetime from './subtable/datetime.vue';
    import EditDictionary from './subtable/dictionary.vue';
    import EditOrganize from './subtable/organize.vue';
    import EditAppraise from './subtable/appraise.vue';
    import EditFiles from './subtable/files.vue';
    import EditLabels from './subtable/labels.vue';
    import EditHidden from './subtable/hidden.vue';

    import { ref, shallowRef, inject, onMounted, provide } from 'vue';
    const utils = inject('utils');
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const editorName = utils.query('editorname', props.query);
    const editor = window.parent.CKEDITOR.instances[editorName];

    const columnList = ref([]);//设计子表列
    const tables = ref([]);//子表选项
    const fields = ref([]);//主表字段选项
    const subtableFields = ref([]);//子表字段选项
    const attrJson = ref({});//表单属性
    const subtableJson = ref({});//子表设置
    const tableHeight = ref(400);//子表高度

    const ctlTypes = [
        { value: 'texts', label: '输入框' },
        { value: 'textareas', label: '文本域' },
        { value: 'number', label: '数字输入框' },
        { value: 'selects', label: '下拉选择' },
        { value: 'cascader', label: '级联选择' },
        { value: 'selectdiv', label: '弹出选择' },
        { value: 'radio', label: '单选按钮' },
        { value: 'checkbox', label: '复选按钮' },
        { value: 'switchs', label: '开关' },
        { value: 'datetime', label: '日期时间' },
        { value: 'dictionary', label: '数据字典' },
        { value: 'organize', label: '组织架构' },
        { value: 'appraise', label: '评分' },
        { value: 'files', label: '附件' },
        { value: 'labels', label: '标签Label' },
        { value: 'hidden', label: '隐藏域' },
    ];//子表控件类型

    onMounted(() => {
        getTableHeight();
        init();
    });

    const getTableHeight = () => {
        tableHeight.value = document.body.clientHeight - 118;
    }

    //初始加载
    const init = (input) => {
        if (utils.isUndef(editor)) {
            console.log('未找到editor对象！');
            return;
        }

        attrJson.value = editor.formAttributeJSON;
        //if (attrJson.value) {
        //    utils.getConnTableFields(attrJson.value.dbConn, attrJson.value.dbTable).then(fields => {
        //        //fieldsOptions.value = fields;
        //    });
        //}

        //初始化表选项
        if (utils.length(attrJson.value.dbConn) > 0) {
            utils.getConnTables(attrJson.value.dbConn).then((tableList) => {
                tables.value = tableList;
                if (utils.length(attrJson.value.dbTable) > 0) {
                    tableChange(attrJson.value.dbTable);//加载主表字段
                }
            });
        }
        if (!input) {
            input = editor.currentSelectEditorElement;
        }
        if (!input) {
            subtableJson.value = { id: 'subtable_' + (new Date().getTime()), columns: [] };
            editor.formSubtabsJSON.push(subtableJson.value);
            columnList.value = subtableJson.value.columns;
        }
        if (input) {
            const subtableId = input.getAttribute("data-id");
            subtableJson.value = utils.getArrayObj(editor.formSubtabsJSON, subtableId, 'id');
            if (utils.isUndef(subtableJson.value)) {
                subtableJson.value = { id: 'subtable_' + (new Date().getTime()), columns: [] };
                editor.formSubtabsJSON.push(subtableJson.value);
            }
            columnList.value = utils.isArray(subtableJson.value.columns) ? subtableJson.value.columns : [];
            //加载子表字段
            if (utils.length(subtableJson.value.table) > 0) {
                subtableChange(subtableJson.value.table);
            }
            //设置事件
            if (!utils.hasKey(subtableJson.value, "events")) {
                subtableJson.value['events'] = [{ value: 'addRow', title: '添加行', script: '' },
                { value: 'deleteRow', title: '删除行', script: '' },
                { value: 'summaries', title: '求和', script: '' }];
            }
        }
        editor.currentSelectEditorElementJson = subtableJson.value;
        editor.initFunction_subtable = init;
    };
    //加载主表字段
    const tableChange = (table) => {
        utils.getConnTableFields(attrJson.value.dbConn, table).then((fieldList) => {
            fields.value = fieldList;
        });
    };
    //子表改变获取字段
    const subtableChange = (table) => {
        utils.getConnTableFields(attrJson.value.dbConn, table).then((fieldList) => {
            subtableFields.value = fieldList;
        });
    };
    //添加一列
    const addColumn = () => {
        const column = {
            key: utils.createGuid(false),
            field: '',
            name: '',
            align: 'left',
            width: '',
            edit: { type: 'texts', title: '输入框', set: { events: [{ name: 'change', script: '' }] } },
            sum: false,
        };
        columnList.value.push(column);
    };
    //删除一列
    const delColumn = (row) => {
        utils.removeArrayObj(columnList.value, row.key, 'key');
    };
    //子表行字段选择后设置名称
    const setName = (row) => {
        if (utils.length(row.name) === 0) {
            row.name = row.field;
        }
    };
    //设置列编辑方式
    const dialogShow = ref(false);
    const dialogTitle = ref('设置子表控件');
    const dialogPage = shallowRef(null);
    const dialogQuery = ref('');
    const setEditRecord = ref({ type: 'texts', title: '输入框', set: {} });
    provide('setEditRecord', setEditRecord);//注入，子页面调用
    const componentList = {
        'edit_texts': EditTexts,
        'edit_textareas': EditTextareas,
        'edit_number': EditNumber,
        'edit_selects': EditSelects,
        'edit_cascader': EditCascader,
        'edit_selectdiv': EditSelectdiv,
        'edit_radio': EditRadio,
        'edit_checkbox': EditCheckbox,
        'edit_switchs': EditSwitchs,
        'edit_datetime': EditDatetime,
        'edit_dictionary': EditDictionary,
        'edit_organize': EditOrganize,
        'edit_appraise': EditAppraise,
        'edit_files': EditFiles,
        'edit_labels': EditLabels,
        'edit_hidden': EditHidden,
    };
    //设置列编辑控件
    const setEdit = (row) => {
        setEditRecord.value = row.edit;
        dialogTitle.value = row.name;
        dialogPage.value = componentList['edit_' + (setEditRecord.value.type || 'texts')];
        dialogShow.value = true;
    };
    //控件类型改变时。
    const setEditChange = (type) => {
        const ctlType = utils.getArrayObj(ctlTypes, type, 'value');
        if (utils.isUndef(ctlType)) {
            return;
        }
        setEditRecord.value.type = type;
        setEditRecord.value.title = ctlType.label;
        setEditRecord.value.set = {};
        //初始化事件
        switch (type) {
            case 'texts':
            case 'textareas':
            case 'number':
            case 'selects':
            case 'cascader':
            case 'radio':
            case 'checkbox':
            case 'datetime':
            case 'dictionary':
            case 'organize':
            case 'appraise':
            case 'selectdiv':
            case 'files':
                var events = [{ name: 'change', script: '' }];
                for (let i = 0; i < events.length; i++) {
                    var event = utils.getArrayObj(setEditRecord.value.set.events, events[i].name, 'name');
                    if (utils.isDef(event)) {
                        events[i].script = event.script;
                    }
                }
                setEditRecord.value.set.events = events;
                break;
            case 'switchs':
                var events1 = [{ name: 'change', script: '' }, { name: 'click', script: '' }];
                for (let i = 0; i < events1.length; i++) {
                    var event1 = utils.getArrayObj(setEditRecord.value.set.events, events1[i].name, 'name');
                    if (utils.isDef(event1)) {
                        events1[i].script = event1.script;
                    }
                }
                setEditRecord.value.set.events = events1;
                break;
        }
        dialogPage.value = componentList['edit_' + type];
    };
    //行上移
    const colUp = (row) => {
        //如果只有一行不需要移动
        if (columnList.value.length <= 1) {
            return;
        }
        let index = -1;
        for (let i = 0; i < columnList.value.length; i++) {
            if (columnList.value[i].key === row.key) {
                index = i;
                break;
            }
        }
        if (index != 0) {
            columnList.value[index] = columnList.value.splice(index - 1, 1, columnList.value[index])[0];
        } else {
            columnList.value.push(columnList.value.shift());
        }
    };
    //行下移
    const colDown = (row) => {
        //如果只有一行不需要移动
        if (columnList.value.length <= 1) {
            return;
        }
        let index = -1;
        for (let i = 0; i < columnList.value.length; i++) {
            if (columnList.value[i].key === row.key) {
                index = i;
                break;
            }
        }
        if (index != columnList.value.length - 1) {
            columnList.value[index] = columnList.value.splice(index + 1, 1, columnList.value[index])[0];
        } else {
            columnList.value.unshift(columnList.value.splice(index, 1)[0]);
        }
    };

    //设置子表事件
    const ElCodemirror = inject('ElCodemirror');
    const eventDialogShow = ref(false);
    const eventValue = ref('addRow');
    const setEvent = () => {
        eventDialogShow.value = true;
    };
</script>