<template>
    <div>
        <el-form :model="editData" ref="ruleFormRef" :rules="rules" label-width="100px">
            <el-form-item label="手机" prop="phone">
                <el-input v-model="editData.phone" clearable />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editData.email" clearable />
            </el-form-item>
            <el-form-item label="电话" prop="tel">
                <el-input v-model="editData.tel" clearable />
            </el-form-item>
            <el-form-item label="生日" prop="birthDay">
                <el-date-picker v-model="editData.birthDay" value-format="YYYY-MM-DD" type="date" />
            </el-form-item>
            <el-form-item label="其他联系方式" prop="concatInfo">
                <el-input v-model="editData.concatInfo" clearable />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="butDisabled" @click="ok()">保存</el-button>
                <el-button :disabled="butDisabled" @click="index_dialogshow=false">关闭</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const index_dialogshow = inject('index_dialogshow');

    const butDisabled = ref(false);
    const editData = ref({});
    const ruleFormRef = ref(null);
    const rules = {};

    onMounted(() => {
        loadData();
    });

    const loadData = () => {
        butDisabled.value = true;
        ajax.post('/User/GetInfo', qs.stringify(editData.value)).then((res) => {
            if (!res.success) {
                utils.msg('获取用户信息失败！', false);
                return;
            }
            editData.value = res.data;
            butDisabled.value = false;
        }).catch(() => { butDisabled.value = false; });
    };
    const ok = () => {
        butDisabled.value = true;
        ajax.post('/User/SaveInfo', qs.stringify(editData.value)).then((res) => {
            utils.msg(res.success ? '保存成功！' : '保存失败！', res.success);
            butDisabled.value = false;
            if (res.success) {
                index_dialogshow.value = false;
            }
        }).catch(() => { butDisabled.value = false; });
    };
</script>