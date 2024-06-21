<template>
    <div>
        <el-form :model="editData" ref="ruleFormRef" :rules="rules" label-width="80px">
            <el-form-item label="选题标题" prop="subjectTitle">
                <el-input v-model="editData.subjectTitle" clearable />
            </el-form-item>
            <el-form-item label="选择方式" prop="subjectMode">
                <el-radio-group v-model="editData.subjectMode">
                    <el-radio :label="1">单选</el-radio>
                    <el-radio :label="2">多选</el-radio>
                    <el-radio :label="3">文本框</el-radio>
                    <el-radio :label="4">文本域</el-radio>
                </el-radio-group>
                <span style="margin-left:20px">
                    样式<el-input placeholder="选题样式" v-model="editData.subjectStyle" style="width:351px;margin-left:12px"></el-input>
                </span>
                <span style="margin-left:12px">
                    排序<el-input-number :step="5" :min="0" v-model="editData.sort" style="width:120px;margin-left:12px" />
                </span>
            </el-form-item>
            <el-form-item label-width="0">
                <el-table :data="editData.options"
                          :stripe="pager.tableStripe"
                          :border="pager.tableBorder"
                          style="width:100%">
                    <el-table-column prop="optionTitle" label="选项标题">
                        <template #default="scope">
                            <el-input v-model="scope.row.optionTitle" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="optionMode" label="输入" width="130">
                        <template #default="scope">
                            <el-select v-model="scope.row.optionMode" style="width:100%">
                                <el-option :value="0" label="无"></el-option>
                                <el-option :value="1" label="文本框"></el-option>
                                <el-option :value="2" label="文本域"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="optionStyle" label="样式" width="190">
                        <template #default="scope">
                            <el-input v-model="scope.row.optionStyle" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="排序" width="120">
                        <template #default="scope">
                            <el-input-number :step="5" :min="0" controls-position="right" v-model="scope.row.sort" style="width:100%" />
                        </template>
                    </el-table-column>
                    <el-table-column width="75">
                        <template #header>
                            <el-button size="small" type="primary" @click="optionAdd()">添加</el-button>
                        </template>
                        <template #default="scope">
                            <el-button size="small" type="primary" @click="optionDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
        <div style="text-align:center;width:100%;">
            <el-button :disabled="butDisabled" type="primary" @click="optionSave(ruleFormRef)">保存</el-button>
            <el-button :disabled="butDisabled" @click="returnList()">返回</el-button>
        </div>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const questionnaire_subject = inject('questionnaire_subject');
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const questionnaireId = utils.query('questionnaireid', props.query);
    const subjecId = utils.query('subjectid', props.query);

    const butDisabled = ref(false);
    const editData = ref({ subjectTitle: '', subjectMode: 1, options: [], sort: parseInt(utils.query('sort', props.query)) || 5 });
    const ruleFormRef = ref(null);
    const rules = {
        subjectTitle: [{ required: true, message: '请输入选题标题', trigger: 'blur', },],
    };
    const pager = ref(utils.getPager({}));

    onMounted(() => {
        loadData();
    });

    const loadData = () => {
        if (utils.length(subjecId) > 0) {
            butDisabled.value = true;
            ajax.post('/Questionnaire/GetSubject?subjectid=' + subjecId).then((res) => {
                if (res.code == 1) {
                    utils.msg('加载选题错误！', res.success);
                    return;
                }
                editData.value = res.data;
                butDisabled.value = false;
            }).catch(() => {
                butDisabled.value = false;
            });
        }
    };

    const optionAdd = () => {
        editData.value.options.push({
            id: utils.createGuid(false),
            optionTitle: '',
            optionMode: 0,
            optionStyle: '',
            sort: utils.getArrayMax(editData.value.options, 'sort') + 5
        });
    };

    const optionDelete = (row) => {
        utils.removeArrayObj(editData.value.options, row.id, "id");
    }
    //保存
    const optionSave = async (formEl) => {
        if (!formEl) {
            return;
        }
        await formEl.validate((valid) => {
            if (valid) {
                butDisabled.value = true;
                ajax.post('/Questionnaire/SaveSubject' + props.query + '&optionsize=' + editData.value.options.length, qs.stringify(editData.value)).then((res) => {
                    butDisabled.value = false;
                    let msg = res.msg;
                    if (utils.length(msg) === 0) {
                        if (res.success) {
                            msg = '保存成功！';
                        } else if (res.code == 1) {
                            msg = '数据验证错误！';
                        } else {
                            msg = '保存失败！';
                        }
                    }
                    utils.msg(msg, res.success);
                    if (res.success) {
                        returnList();
                    }
                }).catch(() => {
                    butDisabled.value = false;
                });
            }
        });
    }

    //返回选题列表
    const returnList = () => {
        questionnaire_subject({ id: questionnaireId });
    };
</script>