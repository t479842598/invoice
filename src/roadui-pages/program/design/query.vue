<template>
    <div>
        <el-table :data="tableData"
                  v-loading="loading"
                  :stripe="pager.tableStripe"
                  :border="pager.tableBorder"
                  style="width:100%"
                  :highlight-current-row="pager.tableHighlightCurrentRow"
                  :default-sort="defaultOrder"
                  @sort-change="sortChange"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="45" />
            <el-table-column prop="field" label="字段名称"></el-table-column>
            <el-table-column prop="showTitle" label="显示名称"></el-table-column>
            <el-table-column prop="operators" label="操作符" width="100"></el-table-column>
            <el-table-column prop="controlName" label="控件名称" width="200" show-overflow-tooltip></el-table-column>
            <el-table-column prop="inputType" label="输入类型" width="100">
                <template #default="scope">
                    {{scope.row.inputTypeTitle}}
                </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" width="80"></el-table-column>
            <el-table-column width="80">
                <template #header>
                    <span>操作</span>
                </template>
                <template #default="scope">
                    <el-button size="small" :disabled="butDisabled" type="primary" @click="edit(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin:15px auto 0 auto; text-align:center;">
            <el-button :disabled="butDisabled" type="primary" @click="edit(null)">添加</el-button>
            <el-button :disabled="butDisabled" type="danger" @click="del()">删除所选</el-button>
        </div>
        <el-dialog v-model="dialogShow" :title="dialogTitle" align-center destroy-on-close width="750px" draggable :close-on-click-modal="false">
            <el-form :model="editData" ref="ruleFormRef" :rules="rules" label-width="80px">
                <el-form-item label="字段" prop="field">
                    <el-select v-model="editData.field" clearable filterable style="width:100%">
                        <el-option v-for="op in fieldOptions" :key="op.value" :label="op.title" :value="op.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="显示名称" prop="showTitle">
                    <el-input v-model="editData.showTitle" clearable />
                </el-form-item>
                <el-form-item label="默认值" prop="defaultValue">
                    <el-input v-model="editData.defaultValue" clearable />
                </el-form-item>
                <el-form-item label="操作符" prop="operators">
                    <el-select v-model="editData.operators" style="width:200px" clearable>
                        <el-option v-for="op in operatorsOptions" :key="op.value" :label="op.label" :value="op.value"></el-option>
                    </el-select>
                    <span style="margin-left:12px">
                        控件名称<el-input v-model="editData.controlName" style="width: 350px; margin-left: 12px" clearable placeholder="不填则随机生成" />
                    </span>
                </el-form-item>
                <el-form-item label="输入类型" prop="inputType">
                    <el-select v-model="editData.inputType" style="width:200px" clearable>
                        <el-option v-for="op in inputTypeOptions" :key="op.value" :label="op.label" :value="op.value"></el-option>
                    </el-select>
                    <span style="margin-left:12px">
                        背景文字<el-input v-model="editData.placeholder" style="width: 350px; margin-left: 12px" clearable></el-input>
                    </span>
                </el-form-item>
                <el-form-item v-if="editData.inputType=='5'||editData.inputType=='7'" label="数据来源" prop="dataSource">
                    <el-radio-group v-model="editData.datasource" clearable>
                        <el-radio v-for="op in dataSourceOptions" :key="op.value" :label="op.value">{{op.label}}</el-radio>
                    </el-radio-group>
                    <span v-if="editData.datasource=='2'" style="margin-left:12px">
                        数据连接
                        <el-select v-model="editData.connId" clearable style="width: 162px; margin-left: 12px">
                            <el-option v-for="conn in conns" :key="conn.id" :value="conn.id" :label="conn.title"></el-option>
                        </el-select>
                    </span>
                </el-form-item>
                <el-form-item v-if="(editData.inputType=='5'||editData.inputType=='7')&&(editData.datasource=='0'||editData.datasource=='2'||editData.datasource=='3')" label="来源" prop="datasourceString">
                    <el-input type="textarea" v-model="editData.datasourceString" placeholder="字符串表达式/SQL语句/URL地址" clearable></el-input>
                </el-form-item>
                <el-form-item v-if="(editData.inputType=='5'||editData.inputType=='7')&&editData.datasource=='1'" label="数据字典" prop="datasourceString">
                    <el-selectdict v-model="editData.datasourceString" style="width:250px" clearable></el-selectdict>
                    <span style="margin-left:12px;">
                        值字段
                        <el-select v-model="editData.dictValue" :options="dictValueOptions" style="width: 120px; margin-left: 12px;" clearable>
                            <el-option v-for="op in dictValueOptions" :key="op.value" :value="op.value" :label="op.label"></el-option>
                        </el-select>
                    </span>
                </el-form-item>
                <el-form-item v-if="editData.inputType=='6'" label="选择范围" prop="orgrange">
                    <el-selectorg v-model="editData.orgrange" style="width:200px" clearable></el-selectorg>
                    <span style="margin-left:12px">
                        选择类型
                        <el-select multiple v-model="editData.orgAttribute1" style="width: 186px; margin-left: 12px" clearable>
                            <el-option v-for="op in orgSlectTypeOptions" :key="op.value" :value="op.value" :label="op.label"></el-option>
                        </el-select>
                    </span>
                    <span style="margin-left:12px">
                        选择个数<el-input-number style="width: 79px; margin-left: 12px" v-model="editData.orgMultiple" controls-position="right"></el-input-number>
                    </span>
                </el-form-item>
                <el-form-item label="显示样式" prop="showStyle">
                    <el-input v-model="editData.showStyle" clearable style="width:300px" placeholder="控件样式，例：width:200px;" />
                    <span style="margin-left:12px">
                        显示顺序<el-input-number :step="5" v-model="editData.sort" style="width: 110px; margin-left: 12px" controls-position="right" />
                    </span>
                    <span v-show="editData.inputType==6" style="margin-left:12px">
                        <el-checkbox v-model="editData.isQueryUsers">查询时转数字id</el-checkbox>
                    </span>
                </el-form-item>
                <el-form-item>
                    <el-button :disabled="butDisabled" @click="save(ruleFormRef)" type="primary">保存</el-button>
                    <el-button :disabled="butDisabled" @click="dialogShow=false">关闭</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const program_attr_fields = inject('program_attr_fields');//读取已加载的应用查询对应的字段选项(design.vue中定义)
    const ElSelectdict = inject('ElSelectdict');
    const ElSelectorg = inject('ElSelectorg');
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const programId = utils.query('programid', props.query);

    const tableData = ref([]);
    const butDisabled = ref(false);
    const loading = ref(false);
    let selectRows = [];//保存选择的行
    const defaultOrder = ref({ prop: 'sort', order: 'ascending' });
    const pager = ref(utils.getPager(defaultOrder.value));
    const fieldOptions = ref(program_attr_fields.value);//字段选项
    const inputTypeOptions = ref([]);//输入类型选项
    const operatorsOptions = ref([]);//操作符选项
    //数据来源 0.字符串表达式 1.数据字典 2.SQL
    const dataSourceOptions = [{ value: '0', label: '字符串表达式' }, { value: '1', label: '数据字典' }, { value: '2', label: 'SQL' }, { value: '3', label: 'URL' }];
    //组织架构选择类型选项
    const orgSlectTypeOptions = [{ value: '', label: '全部' }, { value: 'unit', label: '单位' }, { value: 'dept', label: '部门' }, { value: 'station', label: '岗位' }, { value: 'user', label: '人员' }, { value: 'workgroup', label: '工作组' }];
    //数据字典值字段选项
    const dictValueOptions = [{ value: 'id', label: 'id' }, { value: 'title', label: '标题' }, { value: 'code', label: '唯一代码' }, { value: 'value', label: '值' }, { value: 'note', label: '备注' }, { value: 'other', label: '其他' }];
    const conns = ref([]);//数据连接选项

    onMounted(() => {
        //初始化数据连接选项
        utils.getConns().then((conns1) => {
            conns.value = conns1;
            loadOptions();
        });
    });

    //选择行
    const handleSelectionChange = (val) => {
        selectRows = val;
    };
    //每页条数改变
    const handleSizeChange = (size) => {
        pager.value.size = size;
        loadTableData(false);
    };
    //页码改变
    const handleCurrentChange = (number) => {
        pager.value.number = number;
        loadTableData(false);
    };
    //排序
    const sortChange = (order) => {
        pager.value.order = utils.getOrder(order);
        loadTableData(false);
    };
    const loadOptions = () => {
        const params = [
            { id: 'programdesigner_inputtype', key: 'inputType', children: false, valueField: 'value' },
            { id: 'programdesigner_operators', key: 'operators', children: false, valueField: 'value' },
        ];
        ajax.post('/Dictionary/GetMultipleOptions', qs.stringify({ json: JSON.stringify(params) })).then((res) => {
            inputTypeOptions.value = res.data['inputType'];
            operatorsOptions.value = res.data['operators'];
            loadTableData(false);
        }).catch(() => { });
    };
    //加载列表，isQuery 点查询按钮为true，初始加载为false，为了区分点查询按钮时要将页number置为1。
    const loadTableData = (isQuery) => {
        if (isQuery) {
            pager.value.number = 1;
        }
        loading.value = true;
        butDisabled.value = true;
        ajax.post('/Program/GetQueryList?programid=' + programId).then((res) => {
            tableData.value = res.data;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; loading.value = false; });
    };
    //编辑
    const editData = ref({});
    const dialogShow = ref(false);
    const dialogTitle = ref('');
    const ruleFormRef = ref(null);
    const rules = {};
    const edit = (row) => {
        if (fieldOptions.value.length === 0) {
            ajax.post('/Program/GetFieldOptions?programid=' + programId).then((res) => {
                fieldOptions.value = res.data;
                program_attr_fields.value = res.data;
                edit1(row);
            }).catch(() => { });
        } else {
            edit1(row);
        }
    };
    const edit1 = (row) => {
        if (utils.isDef(row)) {
            ajax.post('/Program/GetQuery?queryid=' + row.id).then((res) => {
                editData.value = res.data;
                editData.value.inputType = editData.value.inputType + '';
                editData.value.datasource = editData.value.datasource + '';
                editData.value.isQueryUsers = editData.value.isQueryUsers == 1;
                if (editData.value.connId == 0) {
                    editData.value.connId = '';
                }
                if (editData.value.orgMultiple <= 0) {
                    delete editData.value.orgMultiple;
                }
                editData.value['orgAttribute1'] = utils.length(editData.value.orgAttribute) > 0 ? editData.value.orgAttribute.split(',') : [];
                dialogTitle.value = '编辑 - ' + res.data.field;
                console.log(editData.value);
                dialogShow.value = true;
            }).catch(() => { });
        } else {
            editData.value = { programId: programId, inputType: '0', operators: '=', orgAttribute1: [], sort: utils.getArrayMax(tableData.value, 'sort') + 5 };
            dialogTitle.value = '添加';
            dialogShow.value = true;
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
                editData.value.orgAttribute = editData.value.orgAttribute1.join(',');
                ajax.post('/Program/SaveQuery', qs.stringify(editData.value)).then((res) => {
                    let msg = res.msg;
                    if (utils.length(msg) === 0) {
                        msg = res.success ? '保存成功！' : '保存失败！';
                    }
                    utils.msg(msg, res.success);
                    butDisabled.value = false;
                    if (res.success) {
                        loadTableData(false);
                        dialogShow.value = false;
                        editData.value = {};
                    }
                }).catch(() => { butDisabled.value = false; });
            }
        });
    };
    //删除所选
    const del = () => {
        if (selectRows.length === 0) {
            utils.msg('您没有选择要删除的查询！', false);
            return;
        }
        utils.confirm('您确定要删除所选查询吗？', () => {
            butDisabled.value = true;
            ajax.post('/Program/DeleteQuery', qs.stringify({ ids: utils.getArrayValues(selectRows, 'id').join(',') })).then((res) => {
                butDisabled.value = false;
                utils.msg(res.success ? '删除成功！' : '删除失败！', res.success);
                selectRows = [];
                loadTableData(false);
            }).catch(() => { });
        });
    };
</script>