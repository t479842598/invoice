<template>
    <div>
        <div>
            <div v-for="step in steps" :key="step.id">
                <div style="margin-bottom:8px">
                    <el-checkbox @change="stepChecked" :true-label="step.id" false-label="" :disabled="step.disabled"
                        v-model="step.checked">{{ step.name }}</el-checkbox>
                </div>
                <div style="margin-bottom:15px;">
                    <el-selectorg
                        :style="(step.selectTime == 1 ? 'width:360px;' : 'width:552px;') + 'max-width:98%;margin-right:12px;'"
                        placeholder="选择接收人" :select-type="step.selectType" :disabled="step.allowSelect == 0"
                        :select-range="step.selectRange" :multiple-limit="step.selectQuantity"
                        :show-search="isMobile != '1'" v-model="step.members"></el-selectorg>
                    <el-date-picker v-if="step.selectTime == 1"
                        :style="'width:180px;vertical-align:-2px;' + ('1' == isMobile ? 'margin-top:10px;' : '')"
                        v-model="step.completeTime" type="datetime" format="YYYY-MM-DD HH:mm"
                        value-format="YYYY-MM-DD HH:mm" placeholder="选择完成时间" :editable="'1' != isMobile" />
                </div>
            </div>
        </div>
        <div style="margin-top:25px;text-align:center;">
            <el-button type="primary" @click="ok()">确定</el-button>
            <el-button @click="dialogShow = false">取消</el-button>
        </div>
    </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
const ajax = inject('ajax');
const utils = inject('utils');
const qs = inject('qs');
const ElSelectorg = inject('ElSelectorg');

const props = defineProps({ query: { type: String, default: () => { return ''; } } });
const steps = ref([]);//后续接收步骤
const stepSet = inject('flowrun_step');//当前步骤相关配置，从父窗口获取
const isFreeSend = '1' == utils.query('freesend', props.query);//是否是自由发送
const form = inject('flowrun_form');//当前步骤表单
const sendOk = inject('flowrun_sendok');//直接发送
const freeSendOk = inject('flowrun_freesendok');//自由发送
const dialogShow = inject('flowrun_dialogshow');//控制窗口显示
const queryString = utils.getQuery(props.query);
const isMobile = utils.query('ismobile', props.query);

onMounted(() => {
    loadData();
});
const loadData = () => {
    const formData = '';
    ajax.post('/Flow/GetSendSteps?' + queryString, qs.stringify({ formData: JSON.stringify(formData) })).then((res) => {
        if (res.success) {
            steps.value = res.data.steps;
            if (steps.value.length === 0) {
                //如果返回没有符合条件的步骤，流程图设计也是最后一步，则完成任务。
                //调用父页面方法完成任务
                if (res.data.designNextStepSize == 0) {
                    sendOk();
                    dialogShow.value = false;
                } else if (res.data.flowType == 4) {
                    //系统判断后续步骤均不符合条件，设置的提示。
                    utils.alert('后续步骤均不符合条件！', false);
                    dialogShow.value = false;
                    return;
                } else if (res.data.flowType == 5) {
                    //系统判断后续步骤均不符合条件，设置的完成。
                    sendOk();
                    dialogShow.value = false;
                }
            } else {
                //有默认处理人时直接发送
                let autoSend = true;
                for (let i = 0; i < steps.value.length; i++) {
                    //如果没有勾选提交，或者没有设置默认处理人，或者需要指定完成时间，都不能直接发送。
                    if (steps.value[i].autoConfirm == 0 || utils.length(steps.value[i].members) === 0 || steps.value[i].selectTime == 1) {
                        autoSend = false;
                        break;
                    }
                }
                if (autoSend) {
                    steps.value.map((o) => { o.checked = true });
                    ok();
                }

                //判断当前步骤流转类型，如多选默认选中第一个时，在这里设置。
                if (stepSet.value.flowType == 2) {
                    //多选默认全部选中
                    steps.value.map((o) => { o.checked = true });
                } else if (stepSet.value.flowType == 3) {
                    //多选默认全部选中，不能取消
                    steps.value.map((o) => { o.checked = true; o.disabled = true; });
                } else {
                    //默认选中第一个
                    steps.value[0].checked = true;
                }
            }
        }
    }).catch(() => { });
};
//步骤选择时调用，判断单选时只能选择一项
const stepChecked = (val) => {
    if (stepSet.value.flowType == 0) {
        for (let i = 0; i < steps.value.length; i++) {
            if (steps.value[i].id != val) {
                steps.value[i].checked = false;
            }
        }
    }
};
//确定
const ok = () => {
    let selectSteps = [];
    for (let i = 0; i < steps.value.length; i++) {
        if (steps.value[i].checked) {
            if (utils.length(steps.value[i].members) === 0) {
                utils.msg(steps.value[i].name + '没有选择接收人！', false);
                return;
            }
            if (steps.value[i].selectTime == 1 && utils.length(steps.value[i].completeTime) === 0) {
                utils.msg(steps.value[i].name + '没有选择完成时间！', false);
                return;
            }
            selectSteps.push({
                id: steps.value[i].id,
                members: steps.value[i].members,
                completeTime: steps.value[i].completeTime,
            });
        }
    }
    if (selectSteps.length === 0) {
        utils.msg('您没有选择接收步骤！', false);
        return;
    }
    //调用父页面方法发送
    if (isFreeSend) {
        freeSendOk(selectSteps);
    } else {
        sendOk(selectSteps);
    }
    dialogShow.value = false;
};
</script>