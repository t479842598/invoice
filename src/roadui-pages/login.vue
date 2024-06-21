<template>
    <div class="login_div">
        <div class="login_titlediv">
            <div class="login_title">{{ config.SYSTEM_NAME }}</div>
            <div class="login_title1">{{ config.SYSTEM_TITLE }}</div>
        </div>
        <div class="login_body">
            <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="auto">
                <el-form-item label="帐号" prop="account">
                    <el-input v-model="formData.account" prefix-icon="User" clearable />
                </el-form-item>
                <el-form-item label="密码" prop="password" style="padding-top:10px">
                    <el-input v-model="formData.password" prefix-icon="Key" type="password" clearable />
                </el-form-item>
                <el-form-item label="账套" prop="sobItem" style="padding-top:10px">
                    <el-select v-model="sobItems" @change="chengesob" placeholder="请选择账套" style="width: 100%;">
                        <el-option v-for="item in checkList" :key="item.id" :label="item.accountname"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="utils.length(validateImgSrc) > 0" label="验证码" prop="validateCode"
                    style="padding-top:10px">
                    <el-input v-model="formData.validateCode" style="width:135px" clearable />
                    <el-image @click="nextImg" :src="validateImgSrc" style="margin-left:8px;" />
                </el-form-item>
                <el-form-item label="记住我" prop="expireTime" style="padding-top:10px">
                    <el-radio-group v-model="formData.expireTime" style="margin-left: 14px;">
                        <el-radio :label="0">不</el-radio>
                        <el-radio :label="1">一天</el-radio>
                        <el-radio :label="7">一周</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item style="padding-top:10px">
                    <el-button type="primary" :loading="loading" :disabled="loading" auto-insert-space
                        style="width:100%;" @click="submitForm(ruleFormRef)">{{ butText }}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="login_footer">
            <span v-html="config.LOGIN_FOOTER"></span>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, inject, onMounted, onUnmounted, provide } from 'vue';
const config = inject('config');
const utils = inject('utils');
const ajax = inject('ajax');
const qs = inject('qs');
const butText = ref('登录');
const loading = ref(false);
const sobItems = ref();//账套选择
const id = ref('');//账套选择id
const checkList = ref([])//账套选择
const rules = reactive({
    account: [{ required: true, message: '请输入帐号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    // sobItem: [{ required: true, message: '请选择账套', trigger: 'change' }],
    validateCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
});
const ruleFormRef = ref(null);
const formData = reactive({ expireTime: 0, force: '0' });
// 获取账套信息
const getsobItem = async () => {
    const res = await ajax.post('/Home/GetAccount');
    if (res.success) {
        if (utils.length(res.data) > 0) {
            checkList.value = res.data;
        }
    }
};
// 账套选择
const chengesob = (val) => {
    formData.sobItem = val;
    id.value = val;
};
// 提交账号密码
const submitForm = async (formEl) => {
    if (!formEl) {
        return;
    }
    await formEl.validate((valid) => {
        if (valid) {
            loading.value = true;
            const submitData = {
                expireTime: formData.expireTime,
                force: formData.force,
                account: utils.aes(formData.account),
                password: utils.aes(formData.password),
                clientId: utils.getClientId(),
                validateCode: formData.validateCode,
                validateCodeId: validateCodeId.value,
            };
            setSelectAccount(id.value, submitData);
        }
    });
};
// 传入账套id
const setSelectAccount = (id, submitData) => {
    ajax.post('/Home/GetSelectAccount', qs.stringify({ id: id })).then((res) => {
        if (res.success) {
            if (utils.length(res.data) > 0) {
                localStorage.setItem('sobInfo', JSON.stringify(res.data[0]));
                loadAccount(submitData, res.data[0].id);
            } else {
                loadAccount(submitData, '');
            }
        } else {
        }
    }).catch(() => {

    });
};

// 新写法
// 登录接口
const loadAccount = async (submitData, id) => {
    try {
        const res = await ajax.post('/Home/ValidLogin?srcorgid=' + id, qs.stringify(submitData));
        if (res.success) {
            utils.setToken(res.data.token);
            utils.setClientId(res.data.clientId);
            document.onkeydown = null;
            window.location.href = utils.length(config.BASE_URL) === 0 ? '/' : config.BASE_URL;
        } else {
            handleFailure(res);
        }
    } catch {
        resetLogin();
    }
};
// 处理登录失败
const handleFailure = (res) => {
    if (utils.hasKey(res, 'data') && utils.length(res.data.loginIp) > 0) {
        //已在其他IP登录
        utils.confirm('您的帐号已经在' + res.data.loginIp + '登录，您要强行登录吗？', () => {
            formData.force = '1';
            submitForm(formEl);
        });
    } else {
        const errorMessages = {
            1: '帐号或密码不能为空！',
            2: '帐号或密码错误！',
            3: utils.length(res.msg) === 0 ? '用户被冻结！' : '用户所在组织 ' + res.msg + ' 被冻结！',
            4: '未找到您的所在组织！',
            5: '验证码错误！',
            default: '登录失败'
        };
        const msg = errorMessages[res.code] || errorMessages.default;
        utils.msg(msg, false);
        nextImg();
        resetLogin();
    }
};
// 重置登录按钮
const resetLogin = () => {
    butText.value = '登录';
    loading.value = false;
};
const keyDown = (e) => {
    if (e.keyCode == 13) {
        submitForm(ruleFormRef.value);
    }
}
onMounted(() => {
    getsobItem();
    window.addEventListener('keydown', keyDown);
});
onUnmounted(() => {
    window.removeEventListener('keydown', keyDown, false);
});
//图片验证码
const validateCodeId = ref(utils.createGuid(false));
const validateImgSrc = ref('');
const nextImg = () => {
    validateImgSrc.value = config.SERVER_WEBADDRESS + '/Files/ValidCode?v=' + utils.createGuid(false) + '&validatecodeid=' + validateCodeId.value;
};
</script>