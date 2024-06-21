<template>
    <div>
        <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="60px">
            <el-form-item prop="password" label="密码">
                <el-input type="password" v-model="formData.password" clearable show-password/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="butDisabled" @click="ok(ruleFormRef)">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
    import { ref, inject } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const flowrun_step = inject('flowrun_step');//流程运行页面步骤数据
    const flowrun_sign = inject('flowrun_sign');//流程运行页面签章方法
    const flowrun_dialogshow = inject('flowrun_dialogshow');//流程运行页面控制窗口显示
    const flowrun_send = inject('flowrun_send');//流程运行页面发送方法
    const flowrun_freesend = inject('flowrun_freesend');//流程运行页面自由发送
    const flowrun_back = inject('flowrun_back');//流程运行页面退回
    const flowrun_completed = inject('flowrun_completed');//流程运行页面完成

    const butDisabled = ref(false);
    const formData = ref({});
    const ruleFormRef = ref(null);
    const rules = {
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    };
    const signAction = utils.query('signaction', props.query);//签章之后要做的操作。0：不操作 1：发送 2：退回 3：步骤内发送 4：完成
    const ok = async (formEl) => {
        if (!formEl) {
            return;
        }
        await formEl.validate((valid) => {
            if (valid) {
                butDisabled.value = true;
                ajax.post('/User/ValidateSignPassword', qs.stringify({ password: utils.aes(formData.value.password) })).then((res) => {
                    butDisabled.value = false;
                    if (!res.success) {
                        let msg = res.msg;
                        if (utils.length(msg) === 0) {
                            if (res.code == 1) {
                                msg = '未找到当前用户！';
                            } else if (res.code == 2) {
                                msg = '密码不能为空！';
                            } else if (res.code == 3) {
                                msg = '密码错误！';
                            }
                        }
                        utils.msg(msg, res.success);
                    } else {
                        flowrun_step.value.sign = 1;
                        flowrun_sign();
                        flowrun_dialogshow.value = false;
                        //签章之后要做的操作。0：不操作 1：发送 2：退回 3：步骤内发送 4：完成
                        if (signAction == '1') {
                            flowrun_send();
                        } else if (signAction == '2') {
                            flowrun_back();
                        } else if (signAction == '3') {
                            flowrun_freesend();
                        } else if (signAction == '4') {
                            flowrun_completed();
                        }
                    }
                }).catch(() => { butDisabled.value = false; });
            }
        });
    };
</script>