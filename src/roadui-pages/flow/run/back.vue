<template>
    <div>
        <div>
            <div v-for="step in steps" :key="step.id">
                <div style="margin-bottom:8px"><el-checkbox :disabled="step.disabled" v-model="step.checked">{{ step.name
                }}</el-checkbox></div>
                <div style="margin-bottom:15px">
                    <el-selectorg placeholder="选择接收人" style="width:100%" :disabled="step.allowSelect == 0"
                        :select-range="step.selectRange" :show-search="isMobile != '1'"
                        v-model="step.members"></el-selectorg>
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
const ElSelectorg = inject('ElSelectorg');

const props = defineProps({ query: { type: String, default: () => { return ''; } } });
const steps = ref([]);//退回步骤
const dialogShow = inject('flowrun_dialogshow');//控制窗口显示
const backOk = inject('flowrun_backok');//退回方法
const queryString = utils.getQuery(props.query);
const isMobile = utils.query('ismobile', props.query);

onMounted(() => {
    loadData();
});

const loadData = () => {
    ajax.post('/Flow/GetBackSteps?' + queryString).then((res) => {
        if (res.success) {
            switch (res.data.code) {
                case 0://成功
                    steps.value = res.data.steps;
                    break;
                case 1://当前任务为空
                    utils.alert('未找到当前任务！', false);
                    break;
                case 2://未找到流程运行时
                    utils.alert('未找到流程运行时！', false);
                    break;
                case 3://未找到步骤运行时
                    utils.alert('未找到步骤运行时！', false);
                    break;
                case 4://不能退回
                    utils.alert('当前步骤设置为不能退回！', false);
                    break;
            }
            if (res.data.code > 0) {
                dialogShow.value = false;
            }
        }
    }).catch(() => { });
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
            selectSteps.push({
                id: steps.value[i].id,
                members: steps.value[i].members
            });
        }
    }
    if (selectSteps.length === 0) {
        utils.msg('您没有选择要退回的步骤！', false);
        return;
    }
    //调用父页面方法发送
    backOk(selectSteps);
    dialogShow.value = false;
};
</script>