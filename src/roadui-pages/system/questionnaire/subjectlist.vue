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
                                    <el-input :style="'margin-left:12px;'+option.optionStyle"></el-input>
                                </span>
                                <span v-else-if="option.optionMode==2&&subject.selectValue==option.id">
                                    <el-input type="textarea" :style="'margin-left:12px;vertical-align:middle;'+option.optionStyle"></el-input>
                                </span>
                            </el-radio>
                        </div>
                    </el-radio-group>
                    <el-checkbox-group v-else-if="subject.subjectMode==2" :name="'checkbox_'+subject.id" v-model="subject.selectValue">
                        <div v-for="option in subject.options" :key="option.id" class="roadui_vote_subject_option">
                            <el-checkbox :label="option.id">
                                <span :style="option.optionMode==0?option.optionStyle:''">{{option.optionTitle}}</span>
                                <span v-if="option.optionMode==1&&utils.inArray(subject.selectValue,option.id)">
                                    <el-input :style="'margin-left:12px;'+option.optionStyle"></el-input>
                                </span>
                                <span v-else-if="option.optionMode==2&&utils.inArray(subject.selectValue,option.id)">
                                    <el-input type="textarea" :style="'margin-left:12px;vertical-align:middle;'+option.optionStyle"></el-input>
                                </span>
                            </el-checkbox>
                        </div>
                    </el-checkbox-group>
                    <el-input v-else-if="subject.subjectMode==3" :style="'margin-top:10px;'+subject.subjectStyle"></el-input>
                    <el-input type="textarea" v-else-if="subject.subjectMode==4" :style="'margin-top:10px;vertical-align:middle;'+subject.subjectStyle"></el-input>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const questionnaire_addsubject = inject('questionnaire_addsubject');

    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const butDisabled = ref(false);
    const questionnaireData = ref({});

    onMounted(() => {
        loadData();
    });

    const loadData = () => {
        butDisabled.value = true;
        ajax.post('/Questionnaire/GetSubjects' + props.query).then((res) => {
            questionnaireData.value = res.data;
            butDisabled.value = false;
        }).catch(() => { butDisabled.value = false; });
    };

    //添加选题
    const add = (subject) => {
        questionnaire_addsubject(questionnaireData.value.id,
            utils.isDef(subject) ? subject.id : '',
            utils.getArrayMax(questionnaireData.value.subjects, 'sort') + 5);
    };

</script>