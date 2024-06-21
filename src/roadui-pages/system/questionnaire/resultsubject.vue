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
            <div v-for="(subject,index) in questionnaireData.subjects" :key="subject.id" class="roadui_vote_subjectline">
                <div class="roadui_vote_subject_title">
                    <span :style="subject.subjectStyle">{{index+1}}、{{subject.subjectTitle}}<el-tag @click="subject.showUser=!subject.showUser" v-if="subject.subjectMode==3||subject.subjectMode==4" style="margin-left:12px">{{subject.count}}</el-tag></span>
                    <div v-if="subject.showUser" class="roadui_vote_result_user">
                        <div class="roadui_vote_result_user1" v-for="user in subject.users" :key="user.userId">{{user.userName=='anonymous'?'匿名':user.userName}}{{user.userOrganize=='anonymous'?'':' - '+user.userOrganize}}<span v-show="utils.length(user.contents)>0">：{{user.contents}}</span></div>
                    </div>
                </div>
                <div>
                    <div v-if="subject.subjectMode==1">
                        <div v-for="option in subject.options" :key="option.id" class="roadui_vote_subject_option">
                            <div>
                                <el-radio disabled model-value="null"/><span :style="option.optionMode==0?option.optionStyle:''">{{option.optionTitle}}</span><el-tag @click="option.showUser=option.count==0?false:!option.showUser" style="margin-left:12px">{{option.count}}</el-tag>
                                <div v-if="option.showUser" class="roadui_vote_result_user">
                                    <div class="roadui_vote_result_user1" v-for="user in option.users" :key="user.userId">{{user.userName=='anonymous'?'匿名':user.userName}}{{user.userOrganize=='anonymous'?'':' - '+user.userOrganize}}<span v-show="utils.length(user.contents)>0">：{{user.contents}}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="subject.subjectMode==2" :name="'checkbox_'+subject.id">
                        <div v-for="option in subject.options" :key="option.id" class="roadui_vote_subject_option">
                            <div>
                                <el-checkbox disabled style="margin-right:10px" /><span :style="option.optionMode==0?option.optionStyle:''">{{option.optionTitle}}</span><el-tag @click="option.showUser=option.count==0?false:!option.showUser" style="margin-left:12px">{{option.count}}</el-tag>
                                <div v-if="option.showUser" class="roadui_vote_result_user">
                                    <div class="roadui_vote_result_user1" v-for="user in option.users" :key="user.userId">{{user.userName=='anonymous'?'匿名':user.userName}}{{user.userOrganize=='anonymous'?'':' - '+user.userOrganize}}<span v-show="utils.length(user.contents)>0">：{{user.contents}}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');

    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const questionnaireData = ref({});

    onMounted(() => {
        loadData();
    });

    const loadData = () => {
        ajax.post('/Questionnaire/GetResultSubject' + props.query).then((res) => {
            questionnaireData.value = res.data;
        }).catch(() => { });
    }
</script>