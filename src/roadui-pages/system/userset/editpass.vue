<template>
    <el-form :model="editData" ref="ruleFormRef" :rules="rules" label-width="100px">
        <el-form-item label="旧密码" prop="oldPassword">
            <el-input type="password" v-model="editData.oldPassword" clearable />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
            <el-input type="password" v-model="editData.newPassword" clearable />
        </el-form-item>
        <el-form-item label="确认新密码" prop="newPassword1">
            <el-input type="password" v-model="editData.newPassword1" clearable />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" :disabled="butDisabled" @click="ok(ruleFormRef)">保存</el-button>
            <!--<el-button :disabled="butDisabled" @click="index_dialogshow=false">关闭</el-button>-->
        </el-form-item>
    </el-form>
</template>

<script setup>
    import { ref, inject } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const index_dialogshow = inject('index_dialogshow');

    const butDisabled = ref(false);
    const editData = ref({});
    const ruleFormRef = ref(null);
    const validatePass = (_, value, callback) => {
        if (utils.length(value) === 0) {
            callback(new Error('请输入确认新密码'));
        } else if (value !== editData.value.newPassword) {
            callback(new Error("两次密码输入不一致"));
        } else {
            callback();
        }
    }
    const rules = {
        oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur', },],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur', },],
        newPassword1: [{ required: true, validator: validatePass, trigger: 'blur' }],
    };
    
    const ok = async (formEl) => {
        if (!formEl) {
            return;
        }
        await formEl.validate((valid) => {
            if (valid) {
                butDisabled.value = true;
                const formData = {
                    oldPassword: utils.aes(editData.value.oldPassword),
                    newPassword: utils.aes(editData.value.newPassword),
                };
                ajax.post('/User/EditPassword', qs.stringify(formData)).then((res) => {
                    butDisabled.value = false;
                    let msg = res.msg;
                    if (utils.length(msg) === 0) {
                        //返回 0：成功 1：未找到用户实体 2：旧密码错误 3：新密码为空
                        if (res.success) {
                            msg = '修改成功！';
                        } else if (res.code == 1) {
                            msg = '未找到用户！';
                        } else if (res.code == 2) {
                            msg = '旧密码错误！';
                        } else if (res.code == 3) {
                            msg = '新密码为空！';
                        } else if (res.code == 4) {
                            msg = '新密码不能和旧密码一样！';
                        } else {
                            msg = '修改失败！';
                        }
                    }
                    utils.msg(msg, res.success);
                    if (res.success) {
                        index_dialogshow.value = false;
                    }
                }).catch(() => {
                    butDisabled.value = false;
                });
            }
        });
    };
</script>