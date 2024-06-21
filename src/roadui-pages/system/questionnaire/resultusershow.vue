<template>
    <div>
        <div class="roadui_vote_title">
            {{questionnaireData.subject}}
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
            <div v-for="(subject,index) in questionnaireData.subjects" :key="subject.id" class="roadui_vote_subject_title">
                <div class="roadui_vote_subject_title">
                    <span :style="subject.subjectStyle">{{index+1}}、{{subject.subjectTitle}}</span>
                </div>
                <div>
                    <el-radio-group v-if="subject.subjectMode==1" v-model="subject.selectValue" style="display:block;">
                        <div v-for="option in subject.options" :key="option.id" class="roadui_vote_subject_option">
                            <el-radio :label="option.id" disabled><span :style="option.optionMode==0?option.optionStyle:''">{{option.optionTitle}}</span></el-radio>
                            <div v-if="option.optionMode==1&&subject.selectValue==option.id" style="padding-top:8px" class="roadui_vote_result_user">
                                {{option.inputValue}}
                            </div>
                            <div v-else-if="option.optionMode==2&&subject.selectValue==option.id" style="padding-top:8px" class="roadui_vote_result_user">
                                {{option.textareaValue}}
                            </div>
                        </div>
                    </el-radio-group>
                    <el-checkbox-group v-else-if="subject.subjectMode==2" :name="'checkbox_'+subject.id" v-model="subject.selectValue">
                        <div v-for="option in subject.options" :key="option.id" class="roadui_vote_subject_option">
                            <el-checkbox :label="option.id" disabled><span :style="option.optionMode==0?option.optionStyle:''">{{option.optionTitle}}</span></el-checkbox>
                            <div v-if="option.optionMode==1&&utils.inArray(subject.selectValue,option.id)" style="padding-top:8px" class="roadui_vote_result_user">
                                {{option.inputValue}}
                            </div>
                            <div v-else-if="option.optionMode==2&&utils.inArray(subject.selectValue,option.id)" style="padding-top:8px" class="roadui_vote_result_user">
                                {{option.textareaValue}}
                            </div>
                        </div>
                    </el-checkbox-group>
                    <div v-else-if="subject.subjectMode==3" style="padding-top:8px" class="roadui_vote_result_user">{{subject.inputValue}}</div>
                    <div v-else-if="subject.subjectMode==4" style="padding-top:8px" class="roadui_vote_result_user">{{subject.textareaValue}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const resultuser_dialogshow = inject('resultuser_dialogshow');

    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const questionnaireData = ref({});

    onMounted(() => {
        loadData();
    })

    const loadData = () => {
        ajax.post('/Questionnaire/GetUserSubjects' + props.query + '&loadresult=1').then((res) => {
            if (res.code == 1) {
                utils.msg('您没有权限查看问卷结果', res.success);
                resultuser_dialogshow.value = false;
            } else {
                questionnaireData.value = res.data;
            }
        }).catch(() => { });
    };

</script>