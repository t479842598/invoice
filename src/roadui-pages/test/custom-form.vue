<template>
    <div>
        <br />
        <el-form :model="customFormData" ref="customFormRef" :rules="customFormRules" label-width="80px">
            <el-form-item label="标题" prop="title">
                <el-input v-if="getFieldStatus('title') == 0" v-model="customFormData.title" clearable />
                <span v-if="getFieldStatus('title') == 1">{{ customFormData.title }}</span>
            </el-form-item>
            <el-form-item label="地址" prop="f1">
                <el-input v-if="getFieldStatus('f1') == 0" v-model="customFormData.f1" clearable />
                <span v-if="getFieldStatus('f1') == 1">{{ customFormData.f1 }}</span>
            </el-form-item>
            <el-form-item label="数量" prop="f3">
                <el-input-number v-model="customFormData.f3" clearable />
            </el-form-item>
            <el-form-item label="备注" prop="f2">
                <el-input v-if="getFieldStatus('f2') == 0" v-model="customFormData.f2" type="textarea" clearable />
                <span v-if="getFieldStatus('f2') == 1">{{ customFormData.f2 }}</span>
            </el-form-item>
            <el-form-item label="子表">
                <el-table :data="customFormData['rf_form_test_sub']" :stripe="true" :border="true" style="width:100%">
                    <el-table-column prop="f1" label="名称">
                        <template #default="scope">
                            <el-form-item :prop="'rf_form_test_sub.' + scope.$index + '.f1'"
                                :rules="customSubtableFormRules['rf_form_test_sub.f1']">
                                <el-input v-model="scope.row.f1" clearable></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="f2" label="标题">
                        <template #default="scope">
                            <el-form-item :prop="'rf_form_test_sub.' + scope.$index + '.f2'"
                                :rules="customSubtableFormRules['rf_form_test_sub.f2']">
                                <el-input v-model="scope.row.f2" clearable></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="f3" label="备注">
                        <template #default="scope">
                            <el-input v-model="scope.row.f3" clearable></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column width="80">
                        <template #header>
                            <el-button size="small" type="primary" @click="addRow">
                                添加
                            </el-button>
                        </template>
                        <template #default="scope">
                            <el-button size="small" type="primary" @click="removeRow(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref, inject, watch, onMounted, computed } from 'vue';
const ajax = inject('ajax');
const utils = inject('utils');
const qs = inject('qs');
const flowrun_form = inject('flowrun_form');//父页面表单数据
const flowrun_step = inject('flowrun_step');//父页面步骤相关设置

const customFormData = flowrun_form.value.formData;
const customFormRef = ref(null);
//const customFormRules = {
//    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
//    f1: [{ required: true, message: '请输入地址', trigger: 'blur' }],

//};
//获取步骤上设置的验证
const customFormRules = flowrun_form.value.formRules;
//子表验证
//const customSubtableFormRules = {
//    'rf_form_test_sub.f1': [{ required: true, message: '请输入名称', trigger: 'blur' }],
//    'rf_form_test_sub.f2': [{ required: true, message: '请输入标题', trigger: 'blur' }],
//};
//获取步骤上设置的验证
const customSubtableFormRules = flowrun_form.value.formRulesSubtable;

onMounted(() => {
    //console.log(flowrun_step)
    //设置表单属性
    customFormData['formAttrJson'] = {
        'dbConn': utils.emptyLong + '',//对应的连接ID，100000000000000表示系统连接。
        'dbTable': 'rf_form_test',//对应的表名
        'dbTablePrimaryKey': 'id',//主键
    };

    //设置子表属性
    customFormData['formSubtableJson'] = [
        {
            'id': 'rf_form_test_sub',//子表id
            'table': 'rf_form_test_sub',//子表表名
            'primaryKey': 'id',//子表主键
            'primaryTableKey': 'id',//主表主键
            'linkField': 'mainid',//子表与主表主键关联字段
        },
        //如果有多个子表，这里继续添加。
    ];

    //设置任务标题字段
    customFormData['titleField'] = 'title';

    //如果初次加载不存在子表数据，则添加。
    if (!utils.hasKey(customFormData, 'rf_form_test_sub')) {
        customFormData['rf_form_test_sub'] = [];
    }
});

//得到字段状态
const getFieldStatus = computed(() => (field) => {
    const fieldStatus = flowrun_step.value.fieldStatus;
    let s = fieldStatus['rf_form_test-' + field.toLowerCase()];
    if (flowrun_step.value.display > 0) {
        return utils.isDef(s) && s['status'] == 2 ? 2 : 1;
    }
    if (utils.isDef(s)) {
        return s['status'];
    }
    let s1 = fieldStatus['rf_form_test_sub.' + field.toLowerCase()];
    if (utils.isDef(s1)) {
        return s1['status'];
    }
});

//子表
const addRow = () => {
    customFormData['rf_form_test_sub'].push({ key: utils.createGuid() });
};
const removeRow = (row) => {
    for (let i = 0; i < customFormData['rf_form_test_sub'].length; i++) {
        if (customFormData['rf_form_test_sub'][i]['key'] === row['key']) {
            customFormData['rf_form_test_sub'].splice(i, 1);
            break;
        }
    }
};
</script>