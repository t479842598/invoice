<template>
    <div>
        <div class="roadui_vote_title">
            {{questionnaireData.subject}}
            <el-button v-if="questionnaireData.status==0" type="primary" size="small" @click="add(null)" style="margin-left:12px">添加选题</el-button>
        </div>
        <div class="roadui_vote_titleinfo">
            <el-space :size="25">
                <span><span style="margin-right:12px">发布人</span>{{questionnaireData.addUser}}<span style="color:#666"> - {{questionnaireData.addUserOrganize}}</span></span>
                <span v-if="utils.length(questionnaireData.publishTime)>0"><span style="margin-right:12px">发布时间</span>{{questionnaireData.publishTime}}</span>
                <span><span style="margin-right:12px">结束时间</span>{{utils.length(questionnaireData.endTime)>0?questionnaireData.endTime:'无结束时间'}}</span>
                <span v-if="questionnaireData.anonymous==1"><span style="margin-right:12px">提交方式</span><span style="font-weight:bold;">匿名</span></span>
            </el-space>
        </div>
        <div class="roadui_vote_body">
            <div v-for="(subject,index) in questionnaireData.subjects" :key="subject.id" class="roadui_vote_subjectline">
                <div class="roadui_vote_subject_title">
                    <span :style="subject.subjectStyle">{{index+1}}、{{subject.subjectTitle}}</span>
                    <el-button v-if="questionnaireData.status==0" size="small" type="primary" @click="add(subject)" style="margin-left:12px;">编辑</el-button>
                </div>
                <div>
                    <el-radio-group v-if="subject.subjectMode==1" v-model="subject.selectValue" style="display:block;">
                        <div v-for="option in subject.options" :key="option.id" class="roadui_vote_subject_option">
                            <el-radio :label="option.id">
                                <span :style="option.optionMode==0?option.optionStyle:''">{{option.optionTitle}}</span>
                                <span v-if="option.optionMode==1&&subject.selectValue==option.id">
                                    <el-input v-model="option.inputValue" clearable :style="'margin-left:12px;'+option.optionStyle"></el-input>
                                </span>
                                <span v-else-if="option.optionMode==2&&subject.selectValue==option.id">
                                    <el-input v-model="option.textareaValue" type="textarea" :style="'margin-left:12px;vertical-align:middle;'+option.optionStyle"></el-input>
                                </span>
                            </el-radio>
                        </div>
                    </el-radio-group>
                    <el-checkbox-group v-else-if="subject.subjectMode==2" :name="'checkbox_'+subject.id" v-model="subject.selectValue">
                        <div v-for="option in subject.options" :key="option.id" class="roadui_vote_subject_option">
                            <el-checkbox :label="option.id">
                                <span :style="option.optionMode==0?option.optionStyle:''">{{option.optionTitle}}</span>
                                <span v-if="option.optionMode==1&&utils.inArray(subject.selectValue,option.id)">
                                    <el-input v-model="option.inputValue" clearable :style="'margin-left:12px;'+option.optionStyle"></el-input>
                                </span>
                                <span v-else-if="option.optionMode==2&&utils.inArray(subject.selectValue,option.id)">
                                    <el-input v-model="option.textareaValue" type="textarea" :style="'margin-left:12px;vertical-align:middle;'+option.optionStyle"></el-input>
                                </span>
                            </el-checkbox>
                        </div>
                    </el-checkbox-group>
                    <el-input v-model="subject.inputValue" clearable v-else-if="subject.subjectMode==3" :style="'margin-top:10px;'+subject.subjectStyle"></el-input>
                    <el-input v-model="subject.textareaValue" type="textarea" v-else-if="subject.subjectMode==4" :style="'margin-top:10px;vertical-align:middle;'+subject.subjectStyle"></el-input>
                </div>
            </div>
            <div style="text-align:center;width:100%;margin-top:12px;">
                <el-button :disabled="butDisabled" type="primary" @click="submitTo()">提交</el-button>
                <el-button :disabled="butDisabled" @click="wait_dialogshow=false;">关闭</el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const qs = inject('qs');
    const utils = inject('utils');
    const wait_dialogshow = inject('wait_dialogshow');
    const wait_loadtabledata = inject('wait_loadtabledata');

    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const butDisabled = ref(false);
    const questionnaireData = ref({});

    onMounted(() => {
        loadData();
    });

    const loadData = () => {
        butDisabled.value = true;
        ajax.post('/Questionnaire/GetSubjects' + (props.query || '') + '&loadresult=1').then((res) => {
            questionnaireData.value = res.data;
            butDisabled.value = false;
        }).catch(() => { butDisabled.value = false; });
    };

    //提交
    const submitTo = () => {
        utils.confirm('您确定要提交吗？', () => {
            butDisabled.value = true;
            var formData = { id: questionnaireData.value.id, subjects: [] };
            for (var i = 0; i < questionnaireData.value.subjects.length; i++) {
                var subject = questionnaireData.value.subjects[i];
                var value1 = '';
                switch (subject.subjectMode) {
                    case 1://单选
                        value1 = subject.selectValue || '';
                        break;
                    case 2://多选
                        value1 = (subject.selectValue || []).join(',');
                        break;
                    case 3://文本框
                        value1 = subject.inputValue || '';
                        break;
                    case 4://文本域
                        value1 = subject.textareaValue || '';
                        break;
                }
                var subjectSelected = {
                    id: subject.id,
                    value: value1,
                    mode: subject.subjectMode,
                };
                //获取选项输入值
                for (var j = 0; j < subject.options.length; j++) {
                    if (subject.options[j].optionMode == 1) {
                        subjectSelected['value_' + subject.options[j].id] = subject.options[j].inputValue || '';
                    } else if (subject.options[j].optionMode == 2) {
                        subjectSelected['value_' + subject.options[j].id] = subject.options[j].textareaValue || '';
                    }
                }
                formData.subjects.push(subjectSelected);
            }
            formData.subjectSize = formData.subjects.length;
            ajax.post('/Questionnaire/SaveSubmit', qs.stringify(formData)).then((res) => {
                butDisabled.value = false;
                let msg = res.msg;
                if (utils.length(msg) === 0) {
                    if (res.success) {
                        msg = '提交成功！';
                    } else if (res.code == 1) {
                        msg = '没有找到要提交的问卷！';
                    } else if (res.code == 2) {
                        msg = '问卷已超过结束时间，不能提交！';
                    } else {
                        msg = '提交失败！';
                    }
                }
                utils.msg(msg, res.success);
                if (res.success) {
                    wait_loadtabledata(false);
                    wait_dialogshow.value = false;
                }
            }).catch(() => {
                butDisabled.value = false;
            });
        });
    }
</script>