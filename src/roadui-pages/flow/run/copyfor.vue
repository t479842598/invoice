<template>
    <div>
        <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="70px">
            <el-form-item label="接收人" prop="receiver">
                <el-selectorg placeholder="选择接收人" style="width:100%" :show-search="isMobile!='1'" v-model="formData.receiver"></el-selectorg>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="butDisabled" @click="ok()">确定</el-button>
                <el-button :disabled="butDisabled" @click="dialogShow=false">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
    import { ref, inject } from 'vue';
    const utils = inject('utils');
    const ElSelectorg = inject('ElSelectorg');
    const copyforOk = inject('flowrun_copyforok');
    const dialogShow = inject('flowrun_dialogshow');//控制窗口显示
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const stepId = utils.query('stepid', props.query);//步骤id
    const isMobile = utils.query('ismobile', props.query);

    const butDisabled = ref(false);
    const ruleFormRef = ref(null);
    const formData = ref({});
    const rules = {
        receiver: [{ required: true, message: '请选择接收人', trigger: 'blur' }],
    };

    //确定
    const ok = async () => {
        if (utils.length(stepId) === 0) {
            utils.msg('未找到步骤！', false);
            return;
        }
        await ruleFormRef.value.validate((valid) => {
            if (valid) {
                butDisabled.value = true;
                let selectSteps = [{ id: stepId, members: formData.value.receiver }];
                //调用父页面方法
                copyforOk(selectSteps);
                butDisabled.value = false;
                dialogShow.value = false;
            }
        });
    };
</script>