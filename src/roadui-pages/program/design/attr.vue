<template>
    <div>
        <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="80px" v-loading="loading">
            <el-form-item label="名称" prop="name">
                <el-input v-model="formData.name" clearable style="width:200px" />
                <el-form-item label="分类" prop="type1">
                    <el-cascader v-model="formData.type1"
                                 :options="apptypeOptions"
                                 style="width:200px;margin-left:12px"
                                 :props="{expandTrigger:'hover'}" />
                </el-form-item>
                <el-form-item label="数据连接" prop="connId" style="margin-left:20px">
                    <el-select v-model="formData.connId" clearable style="width:190px;margin-left:12px">
                        <el-option v-for="conn in conns" :key="conn.id" :value="conn.id" :label="conn.title"></el-option>
                    </el-select>
                </el-form-item>
            </el-form-item>
            <el-form-item label="编辑表单">
                <el-cascader v-model="formData.applibraryTypeId"
                             :options="formOptions"
                             placeholder="选择应用分类"
                             style="width:200px;"
                             :props="{expandTrigger:'hover'}"
                             clearable
                             @change="typeSelect" />
                <el-select v-model="formData.formId" clearable style="margin-left: 12px">
                    <el-option v-for="app in appOptions" :key="app.id" :value="app.id" :label="app.label"></el-option>
                </el-select>
                <el-form-item label="窗口宽度" prop="width" style="margin-left: 12px">
                    <el-input-number v-model="formData.width" controls-position="right" clearable style="width:92px;"></el-input-number>
                </el-form-item>
                <el-form-item label="窗口高度" prop="height" style="margin-left: 12px">
                    <el-input-number v-model="formData.height" controls-position="right" clearable style="width: 92px;"></el-input-number>
                </el-form-item>
            </el-form-item>
            <el-form-item label="按钮位置" prop="buttonLocation">
                <el-select v-model="formData.buttonLocation" clearable style="width:115px">
                    <el-option :value="0" label="新行"></el-option>
                    <el-option :value="1" label="查询后面"></el-option>
                </el-select>
                <span style="margin-left: 12px; color: var(--el-text-color-regular);">
                    选择列<el-select v-model="formData.selectColumn" clearable style="width: 105px; margin-left: 12px">
                        <el-option :value="0" label="无"></el-option>
                        <el-option :value="1" label="单选"></el-option>
                        <el-option :value="2" label="多选"></el-option>
                    </el-select>
                </span>
                <span style="margin-left: 12px; color: var(--el-text-color-regular);">
                    分页<el-select v-model="formData.isPager" clearable style="width: 95px; margin-left: 12px">
                        <el-option :value="0" label="不分页"></el-option>
                        <el-option :value="1" label="分页"></el-option>
                    </el-select>
                </span>
                <span style="margin-left: 12px; color: var(--el-text-color-regular);">
                    表格宽度<el-input-number v-model="formData.tableWidth" controls-position="right" clearable style="width: 100px; margin-left: 12px"></el-input-number>
                </span>
                <span style="margin-left: 12px; color: var(--el-text-color-regular);">
                    表格高度<el-input-number v-model="formData.tableHeight" controls-position="right" clearable style="width: 100px; margin-left: 12px"></el-input-number>
                </span>
            </el-form-item>
            <el-form-item label="表格大小" prop="tableSize">
                <el-select v-model="formData.tableSize" clearable style="width:115px">
                    <el-option value="default" label="default"></el-option>
                    <el-option value="large" label="large"></el-option>
                    <el-option value="small" label="small"></el-option>
                </el-select>
                <span style="margin-left:12px">
                    <el-checkbox v-model="formData.tableBorder">表格边框</el-checkbox>
                </span>
                <span style="margin-left:12px">
                    <el-checkbox v-model="formData.rowNumber">序号列</el-checkbox>
                </span>
                <span style="margin-left: 12px; color: var(--el-text-color-regular);">
                    事件<el-input v-model="formData.editEvents" clearable style="width: 300px; margin-left: 12px" placeholder="添加修改删除数据时执行的方法"></el-input>
                </span>
                <span style="margin-left: 12px; color: var(--el-text-color-regular);">
                    排序<el-input v-model="formData.defaultSort" placeholder="初次打开列表时的排序" clearable style="width: 108px; margin-left: 12px" />
                </span>
            </el-form-item>
            <el-form-item label="SQL" prop="sqlString">
                <!--<el-input type="textarea" v-model="formData.sqlString" :rows="4" style="width:99%"></el-input>-->
                <el-codemirror v-model="formData.sqlString" type="sql" :autofocus="false" height="130px" width="99%"></el-codemirror>
            </el-form-item>
            <el-form-item label="列设置" prop="tableHead">
                <!--<el-input type="textarea" v-model="formData.tableHead" :rows="4" style="width:99%" placeholder="<el-table-column prop='name' label='列名'></el-table-column>"></el-input>-->
                <el-codemirror v-model="formData.tableHead" type="html" :autofocus="false" placeholder="<el-table-column prop='name' label='列名'></el-table-column>" height="130px" width="99%"></el-codemirror>
            </el-form-item>
            <el-form-item label="脚本" prop="clientScript">
                <!--<el-input type="textarea" v-model="formData.clientScript" :rows="4" style="width:99%" placeholder="mounted中加载数据后执行"></el-input>-->
                <el-codemirror v-model="formData.clientScript" :autofocus="false" placeholder="mounted中加载数据后执行" height="200px" width="99%"></el-codemirror>
            </el-form-item>
            <el-form-item label="导出标题" prop="editEvents">
                <el-input v-model="formData.exportHeaderText" placeholder="导出Excel文件的标题" clearable style="width: 300px;" />
                <span style="margin-left: 12px; color: var(--el-text-color-regular);">
                    文件名称<el-input v-model="formData.exportFileName" placeholder="导出Excel文件的文件名" clearable style="width: 200px; margin-left: 12px" />
                </span>
                <span style="margin-left: 12px; color: var(--el-text-color-regular);">
                    模板文件<el-selectfile ref="exportTemplateRef" v-model="formData.exportTemplate" accept=".xls,.xlsx" :limit="1" style="width: 130px; margin-left: 12px;"></el-selectfile>
                </span>
            </el-form-item>
            <el-form-item label="导入表" prop="editEvents">
                <el-input v-model="formData.importTable" placeholder="导入Excel文件对应的数据表名" clearable style="width: 300px;" />
                <span style="margin-left: 12px; color: var(--el-text-color-regular);">
                    标识列<el-input v-model="formData.importTitleField" placeholder="标识单次导入的标识字段" clearable style="width: 200px; margin-left: 12px" />
                </span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="butDisabled" @click="save(ruleFormRef)">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const program_returnlist = inject('program_returnlist');
    const program_attr_formid = inject('program_attr_formid');
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const programId = utils.query('programid', props.query);
    const formData = ref({ width: 900 });
    const apptypeOptions = ref([]);//应用分类
    const formOptions = ref([]);//表单分类
    const appOptions = ref([]);//表单选项
    const conns = ref([]);//数据连接选项
    const ElCodemirror = inject('ElCodemirror');
    const ElSelectfile = inject('ElSelectfile');
    const ruleFormRef = ref(null);
    const rules = {
        name: [{ required: true, message: '请输入应用名称', trigger: 'blur', },],
        type1: [{ required: true, message: '请选择分类', trigger: 'change', },],
        connId: [{ required: true, message: '请选择数据连接', trigger: 'change', },],
        sqlString: [{ required: true, message: '请输入SQL', trigger: 'blur', },],
    };
    const butDisabled = ref(false);
    const loading = ref(true);
    const exportTemplateRef = ref(null);

    onMounted(() => {
        //初始化数据连接选项
        utils.getConns().then((conns1) => {
            conns.value = conns1;
            loadOptions();
        });
    });

    const loadOptions = () => {
        //if (utils.length(apptypeOptions.value) > 0) {
        //    return;//如果已加载，则不加载。
        //}
        const params = [{ id: 'system_applibrary_formtype', key: 'formType', children: true, valueField: 'id' },
        { id: 'system_applibrary_type', key: 'type', children: true, valueField: 'id' }];
        ajax.post('/Dictionary/GetMultipleOptions', qs.stringify({ json: JSON.stringify(params) })).then((res) => {
            formOptions.value = res.data['formType'];
            apptypeOptions.value = res.data['type'];
            loadData();
        }).catch(() => { });
    };

    const loadData = () => {
        if (utils.length(programId) > 0) {
            butDisabled.value = true;
            ajax.post('/Program/Get?programid=' + programId).then((res) => {
                if (res.code == 1) {
                    utils.msg('加载数据失败！', res.success);
                } else {
                    typeSelect(res.data.applibraryTypeId);
                    formData.value = res.data;
                    if (res.data.tableWidth <= 0) {
                        delete formData.value.tableWidth;//如果表格宽度为0表示没有设置，则删除属性，不然控件会显示0。
                    }
                    if (res.data.tableHeight <= 0) {
                        delete formData.value.tableHeight;//如果表格高度为0表示没有设置，则删除属性，不然控件会显示0。
                    }
                    if (res.data.width <= 0) {
                        formData.value.width = 900;//如果窗口宽度为0表示没有设置，则默认为900。
                    }
                    if (res.data.height <= 0) {
                        delete formData.value.height;//如果窗口高度为0表示没有设置，则删除属性，不然控件会显示0。
                    }
                    if (res.data.formId <= 0) {
                        delete formData.value.formId;//如果编辑表格为0表示没有设置，则删除属性，不然控件会显示0。
                    }
                    formData.value.tableBorder = formData.value.tableBorder == 1;//设置是否勾选表格边框checkbox
                    formData.value.rowNumber = formData.value.rowNumber == 1;//设置是否勾选序号列checkbox
                    program_attr_formid.value = formData.value.formId;
                    exportTemplateRef.value.initTitle(formData.value.exportTemplate);
                }
                butDisabled.value = false;
                loading.value = false;
            }).catch(() => { butDisabled.value = false; loading.value = false; });
        } else {
            loading.value = false;
        }
    };
    //表单分类改变时加载分类下的应用
    const typeSelect = (val) => {
        if (utils.length(val) > 0) {
            ajax.post('/Applibrary/GetOptions?typeid=' + val[val.length - 1]).then((res) => {
                appOptions.value = res.data;
            }).catch(() => { });
        } else {
            formData.AppLibraryId = '';
            appOptions.value = [];
        }
    };
    //保存
    const save = async (formEl) => {
        if (!formEl) {
            return;
        }
        await formEl.validate((valid) => {
            if (valid) {
                butDisabled.value = true;
                //加密sql
                let sqlString = formData.value['sqlString'];
                formData.value['sqlString'] = utils.aes(formData.value.sqlString);
                //分类取数组最后一个
                formData.value.type = formData.value.type1.length > 0 ? formData.value.type1[formData.value.type1.length - 1] : 0;
                ajax.post('/Program/SaveAttr' + props.query, qs.stringify(formData.value)).then((res) => {
                    let msg = res.msg;
                    if (utils.length(msg) === 0) {
                        msg = res.success ? '保存成功！' : '保存失败！';
                    }
                    formData.value['sqlString'] = sqlString;
                    utils.msg(msg, res.success);
                    butDisabled.value = false;
                    //如果是新建，保存后返回列表。
                    if (res.success && utils.length(programId) === 0) {
                        program_returnlist();
                    }
                }).catch(() => { butDisabled.value = false; });
            }
        });
    };
</script>