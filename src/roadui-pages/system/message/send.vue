<template>
    <div style="margin:20px 0 0 20px;">
        <el-form :model="editData" ref="ruleFormRef" :rules="rules" label-width="80px">
            <el-form-item label="接收人员" prop="receiver">
                <el-selectorg ref="receiverRef" v-model="editData.receiver" style="width:100%" clearable />
            </el-form-item>
            <el-form-item label="发送方式" prop="sendType">
                <el-checkbox-group v-model="editData.sendType">
                    <el-checkbox :label="0">站内消息</el-checkbox>
                    <el-checkbox :label="1">手机短信</el-checkbox>
                    <el-checkbox :label="2">企业微信</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="消息内容" prop="contents">
                <el-input type="textarea" v-model="editData.contents" style="width:100%" :rows="5" clearable />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="butDisabled" @click="ok(ruleFormRef)">发送</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
    import { ref, inject } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const ElSelectorg = inject('ElSelectorg');

    const butDisabled = ref(false);
    const editData = ref({ receiver: '', sendType:[0] });
    const ruleFormRef = ref(null);
    const receiverRef = ref(null);
    const rules = {
        receiver: [{ required: true, message: '请选择接收人', trigger: 'blur', },],
        sendType: [{ required: true, message: '请选择发送方式', trigger: 'change', },],
        contents: [{ required: true, message: '请输入消息内容', trigger: 'blur', },],
    };

    const ok = async (formEl) => {
        if (!formEl) {
            return;
        }
        await formEl.validate((valid) => {
            if (valid) {
                butDisabled.value = true;
                const formData1 = { receiver: editData.value.receiver, sendType: editData.value.sendType.join(','), contents: editData.value.contents }
                ajax.post('/Message/Send', qs.stringify(formData1)).then((res) => {
                    let msg = res.msg;
                    if (utils.length(msg) === 0) {
                        switch (res.code) {
                            case 1:
                                msg = '消息内容不能为空！';
                                break;
                            case 2:
                                msg = '消息接收人员不能为空！';
                                break;
                            default:
                                msg = res.success ? '发送成功！' : '发送失败！';
                                break;
                        }
                    }
                    utils.msg(msg, res.success);
                    if (res.success) {
                        //发送成功清空表单，已免重复发送。
                        editData.value = { receiver: '', sendType: [0] };
                        receiverRef.value.initTitle('');
                    }
                    butDisabled.value = false;
                }).catch(() => { butDisabled.value = false; });
            }
        });
    };
</script>