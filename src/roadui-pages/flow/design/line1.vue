<template>
    <el-tabs>
        <el-tab-pane name="0" style="height:100%">
            <template #label>
                <el-icon class="roadui_main_tabsvg"><Coin /></el-icon>数据条件
            </template>
            <table cellpadding="0" cellspacing="0" border="0" class="roadui_fromtable">
                <tr>
                    <td colspan="2" style="padding:0">
                        <el-table :data="dataList" :row-key="record=>record.key" style="width:100%;" height="308px">
                            <el-table-column label="数据条件表达式">
                                <template #default="scope">
                                    <el-select v-model="scope.row.khleft" placeholder=" " clearable style="width:55px;margin-right:12px;">
                                        <el-option value="(" label="("></el-option>
                                    </el-select>
                                    <el-select v-model="scope.row.field" placeholder=" " style="width:200px;margin-right:12px;" filterable clearable @change="setFieldType(scope.row)">
                                        <el-option v-for="(formField,index) in formFields" :key="'f_'+index"
                                                   :value="(formField.type=='subtable'?formField.table+'.':'')+formField.field"
                                                   :label="(formField.type=='subtable'?formField.tableName+'-':'')+formField.field+(utils.length(formField.comment)>0?'-'+formField.comment:'')">
                                            <span>{{(formField.type=='subtable'?formField.tableName+'-':'')+formField.field}}</span>
                                            <span class="roadui_note1">{{utils.length(formField.comment)>0?'-'+formField.comment:''}}</span>
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="scope.row.condition" placeholder=" " style="width:155px;margin-right:12px;" clearable>
                                        <el-option v-for="(condition,index) in conditions" :key="'c_'+index" :value="condition.value" :label="condition.label"></el-option>
                                    </el-select>
                                    <el-input v-model="scope.row.value" style="width:110px;margin-right:12px;" clearable></el-input>
                                    <el-select v-model="scope.row.khright" placeholder=" " style="width:55px;margin-right:12px;" clearable>
                                        <el-option value=")" label=")"></el-option>
                                    </el-select>
                                    <el-select v-model="scope.row.tjand" placeholder=" " style="width:75px;" clearable>
                                        <el-option value="and" label="并且"></el-option>
                                        <el-option value="or" label="或者"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column width="75">
                                <template #header>
                                    <el-button size="small" type="primary" @click="addData">添加</el-button>
                                </template>
                                <template #default="scope">
                                    <el-button size="small" type="primary" @click="removeData(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </td>
                </tr>
                <tr>
                    <th>条件标签</th>
                    <td>
                        <el-input @change="setLineText" v-model="lineJson.text" style="width:300px;" placeholder="连线上显示的条件标签"></el-input>
                        <span style="margin-left:12px">
                            判断方式
                            <el-radio-group v-model="lineJson.judagType" style="vertical-align:middle;margin-left:12px;">
                                <el-radio :label="0">或者</el-radio>
                                <el-radio :label="1">并且</el-radio>
                            </el-radio-group>
                        </span>
                    </td>
                </tr>
            </table>
        </el-tab-pane>
        <el-tab-pane name="1" style="height:100%">
            <template #label>
                <el-icon class="roadui_main_tabsvg"><office-building /></el-icon>组织架构
            </template>
            <el-table :data="orgList" :row-key="record=>record.key" style="width:100%;" height="365px">
                <el-table-column label="组织架构表达式">
                    <template #default="scope">
                        <el-select v-model="scope.row.khleft" placeholder=" " style="width:50px" clearable>
                            <el-option value="(" label="("></el-option>
                        </el-select>
                        <el-select v-model="scope.row.usertype" placeholder=" " style="width:85px;margin-left:12px;" clearable>
                            <el-option value="0" label="发送者"></el-option>
                            <el-option value="1" label="发起者"></el-option>
                        </el-select>
                        <el-select v-model="scope.row.in1" placeholder=" " style="width:85px;margin-left:12px;" clearable>
                            <el-option value="0" label="属于"></el-option>
                            <el-option value="1" label="不属于"></el-option>
                        </el-select>
                        <el-select v-model="scope.row.users" placeholder=" " style="width:145px;margin-left:12px;" clearable>
                            <el-option value="0" label="选择组织架构"></el-option>
                            <el-option v-for="role in workRole" :value="role.value" :key="role.value" :label="role.label"></el-option>
                        </el-select>
                        <el-selectorg v-model="scope.row.selectorganize" style="width:150px;margin-left:12px;" placeholder="选择组织架构"></el-selectorg>
                        <el-select v-model="scope.row.khright" placeholder=" " style="width:50px;margin-left:12px;" clearable>
                            <el-option value=")" label=")"></el-option>
                        </el-select>
                        <el-select v-model="scope.row.tjand" placeholder=" " style="width:73px;margin-left:12px;" clearable>
                            <el-option value="and" label="并且"></el-option>
                            <el-option value="or" label="或者"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column width="75">
                    <template #header>
                        <el-button size="small" type="primary" @click="addOrg(null)">添加</el-button>
                    </template>
                    <template #default="scope">
                        <el-button size="small" type="primary" @click="removeOrg(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane name="2" style="height:100%">
            <template #label>
                <el-icon class="roadui_main_tabsvg"><scale-to-original /></el-icon>自定义方法
            </template>
            <table cellpadding="0" cellspacing="0" border="0" class="roadui_fromtable">
                <tr>
                    <th style="width:60px;">方法</th>
                    <td><el-input type="textarea" :rows="8" v-model="lineJson.customMethod" clearable></el-input></td>
                </tr>
                <tr>
                    <th></th>
                    <td style="line-height:28px;">
                        <div class="roadui_note">1、方法格式为：命名空间.类名.方法名。例：RoadFlow.Web.Controllers.TestController.TestLineCondition</div>
                        <div class="roadui_note">2、方法返回布尔类型（bool）true或字符串类型（string）"true"、"1"时条件成立，否则条件不成立。</div>
                    </td>
                </tr>
            </table>
        </el-tab-pane>
        <el-tab-pane name="3" style="height:100%">
            <template #label>
                <el-icon class="roadui_main_tabsvg"><Search /></el-icon>SQL查询
            </template>
            <table cellpadding="0" cellspacing="0" border="0" class="roadui_fromtable">
                <tr>
                    <th style="width:60px;">SQL</th>
                    <td><el-input type="textarea" :rows="8" v-model="lineJson.sql" clearable></el-input></td>
                </tr>
                <tr>
                    <th></th>
                    <td style="line-height:28px;">
                        <div class="roadui_note">1、SQL查询有返回结果表示条件成立，否则条件不成立，SQL中可以写通配符。</div>
                        <div class="roadui_note">2、为了提高查询性能，SQL应当只返回一行一列数据。</div>
                    </td>
                </tr>
            </table>
        </el-tab-pane>
    </el-tabs>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const ElSelectorg = inject('ElSelectorg');//组织架构选择控件
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const design_setLineText = inject('design_setLineText');//更新连线标签文本方法
    //查询条件
    const conditions = ref([
        { value: '=', label: '等于' },
        { value: '!=', label: '不等于' },
        { value: '>', label: '大于' },
        { value: '>=', label: '大于等于' },
        { value: '<', label: '小于' },
        { value: '<=', label: '小于等于' },
        { value: 'like', label: '包含' },
        { value: 'notlike', label: '不包含' },
        { value: 'subtablesum=', label: '子表求和等于' },
        { value: 'subtablesum!=', label: '子表求和不等于' },
        { value: 'subtablesum>', label: '子表求和大于' },
        { value: 'subtablesum>=', label: '子表求和大于等于' },
        { value: 'subtablesum<', label: '子表求和小于' },
        { value: 'subtablesum<=', label: '子表求和小于等于' },
    ]);

    const flowJson = inject('flowJson');
    const lineJson = ref({});
    const dataList = ref([]);//数据条件
    const formFields = ref([]);//步骤对应的表单字段
    const workRole = ref([]);//工作角色，组织架构表达式用。
    const lineId = utils.query('lineid', props.query);
    const flowId = utils.query('flowid', props.query);//流程id，用于获取表单字段。
    const stepId = utils.query('fromstepid', props.query);//线的来源步骤id，用于获取表单字段。

    onMounted(() => {
        if (utils.length(lineId) > 0 && utils.length(flowJson.value.lines) > 0) {
            for (let i = 0; i < flowJson.value.lines.length; i++) {
                if (flowJson.value.lines[i].id == lineId) {
                    lineJson.value = flowJson.value.lines[i];
                    if (!utils.isArray(lineJson.value.organize)) {
                        lineJson.value.organize = [];
                    }
                    orgList.value = lineJson.value.organize;
                    if (!utils.isArray(lineJson.value.dataConditions)) {
                        lineJson.value.dataConditions = [];
                    }
                    dataList.value = lineJson.value.dataConditions;
                    break;
                }
            }
        }
        loadFormField();
    });

    //加载表单字段
    const loadFormField = () => {
        //查找来源步骤的表单
        let formId = '';
        for (let i = 0; i < flowJson.value.steps.length; i++) {
            if (flowJson.value.steps[i].id == stepId) {
                formId = flowJson.value.steps[i].formId;
            }
        }
        utils.getFromFields(flowId, stepId, formId).then((tables) => {
            for (let i = 0; i < tables.length; i++) {
                for (let j = 0; j < tables[i].fields.length; j++) {
                    formFields.value.push({ table: tables[i].id, tableName: tables[i].tableName, type: tables[i].type, field: tables[i].fields[j].id, fieldType: tables[i].fields[j].type, comment: tables[i].fields[j].label });
                }
            }
            loadWorkRole();
        });
    };
    //加载工作角色选项
    const loadWorkRole = () => {
        //已经加载过工作角色选项，判断不重复加载。在design.vue中定义。
        if (utils.length(workRole.value) > 0) {
            return;
        }
        const params = [{ id: 'system_organize_workrole', key: 'workrole', children: false, valueField: 'value' }];
        ajax.post('/Dictionary/getMultipleOptions', qs.stringify({ json: JSON.stringify(params) })).then((res) => {
            workRole.value = res.data['workrole'];
        }).catch(() => { });
    };

    //数据条件=====================
    //添加数据条件 fieldType 字段数据类型
    const addData = () => {
        dataList.value.push({ key: utils.createGuid(false), khleft: '', field: '', fieldType: '', condition: '', value: '', khright: '', tjand: '' });
    };
    //删除数据条件
    const removeData = (row) => {
        utils.removeArrayObj(dataList.value, row.key, 'key')
    };
    //字段选中后设置字段数据类型
    const setFieldType = (row) => {
        const field = utils.getArrayObj(formFields.value, row.field, 'field');
        let filedType = 'string';
        if (utils.isDef(field) && utils.length(field.fieldType) > 0) {
            filedType = field.fieldType.toLowerCase();
            //如果字段类型是数字，则统一为number。自定义表单会读取数据表字段类型，这里要判断。
            if (filedType === 'decimal'
                || filedType === 'numeric'
                || filedType === 'int'
                || filedType === 'bigint'
                || filedType === 'long'
                || filedType === 'double'
                || filedType === 'float'
                || filedType === 'money'
                || filedType === 'smallint'
                || filedType === 'tinyint'
                || filedType === 'real') {
                filedType = 'number';
            }
        }
        row.fieldType = filedType;
    };
    //设置连线文本
    const setLineText = (val) => {
        design_setLineText(lineId, val);
    };

    //组织架构==================
    const orgList = ref([]);
    //添加行 row要在row所在行插入
    const addOrg = (row) => {
        const key = utils.createGuid(false);
        let index = 0;
        if (utils.isDef(row)) {
            for (let i = 0; i < orgList.value.length; i++) {
                if (orgList.value[i].key == row.key) {
                    index = i;
                    break;
                }
            }
        }
        let orgObj = { key: key, khleft: '', usertype: '', in1: '', users: '', selectorganize: '', khright: '', tjand: '' };
        if (index === 0) {
            orgList.value.push(orgObj);
        } else {
            orgList.value.splice(index + 1, 0, orgObj);
        }
    };
    //删除行
    const removeOrg = (row) => {
        utils.removeArrayObj(orgList.value, row.key, 'key');
    };

    //自定义方法================

</script>