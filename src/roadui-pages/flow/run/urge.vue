<template>
    <div>
        <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="80px">
            <el-form-item label="接收人" prop="receiver">
                <el-checkbox-group v-model="formData.receiver">
                    <el-checkbox v-for="user in users" :label="user.value">{{user.label}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="催办方式" prop="messageType">
                <el-checkbox-group v-model="formData.messageType">
                    <el-checkbox :label="0">站内消息</el-checkbox>
                    <el-checkbox :label="1">手机短信</el-checkbox>
                    <el-checkbox :label="2">企业微信</el-checkbox>
                    <el-checkbox :label="4">邮件</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="消息内容" prop="contents">
                <el-input type="textarea" v-model="formData.contents" :rows="4"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="butDisabled" @click="ok()">确定</el-button>
                <el-button :disabled="butDisabled" @click="closeModal()">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const queryString = utils.getQuery(props.query);
    const uid = utils.query('uid', props.query);//uid==-1表单是通过已完成页面打开的（首页弹出打开）。
    const openMode = utils.query('openmode', props.query);
    const dialogShow = utils.query('uid', props.query) != '-1' ? inject('flowrun_dialogshow') : null;//控制窗口显示
    const index_dialogshow = utils.query('uid', props.query) == '-1' ? inject('index_dialogshow') : null;//首页的弹窗口显示
    const urge = utils.length(queryString) === 0 ? inject('flowrun_urge') : null;//这里引用一下催办，实际没什么用，只是为了解决正式发布后urge报错的问题。
    const completed = utils.length(queryString) === 0 ? inject('flowrun_completed') : null;

    const butDisabled = ref(false);
    const ruleFormRef = ref(null);
    const formData = ref({ receiver: [], messageType: [0, 1, 2, 4], contents: '' });
    const users = ref([]);//可催办的人员选项
    const rules = {
        receiver: [{ required: true, message: '请选择接收人', trigger: 'blur', },],
        messageType: [{ required: true, message: '请选择催办方式', trigger: 'change', },],
        contents: [{ required: true, message: '请输入消息内容', trigger: 'blur', },]
    };

    onMounted(() => {
        loadData();
    });

    const loadData = () => {
        butDisabled.value = true;
        ajax.post('/Flow/GetUrgeUsers?' + queryString).then((res) => {
            formData.value.contents = res.data.contents;
            users.value = res.data.users;
            for (let i = 0; i < users.value.length; i++) {
                formData.value.receiver.push(users.value[i].value);
            }
            butDisabled.value = false;
        }).catch(() => { butDisabled.value = false; });
    };
    const ok = async () => {
        await ruleFormRef.value.validate((valid) => {
            if (valid) {
                const formData1 = { contents: formData.value.contents, receiver: formData.value.receiver.join(','), messageType: formData.value.messageType.join(',') };
                ajax.post('/Flow/SaveUrge?' + queryString, qs.stringify(formData1)).then((res) => {
                    if (res.success) {
                        utils.msg('催办成功！', true);
                        closeModal();
                    } else {
                        if (res.code == 1) {
                            utils.msg('未找到当前用户信息！', false);
                        } else if (res.code == 2) {
                            utils.msg('未找到流程任务！', false);
                        }
                    }
                }).catch(() => { });
            }
        });
    };
    //关闭窗口
    const closeModal = () => {
        //uid == '-1'表示是通过已完成页面打开的窗口（首页modal打开的）。
        if (uid == '-1') {
            if (openMode == '2' || openMode == '3') {
                window.close();
            } else {
                if (utils.isDef(index_dialogshow.value)) {
                    index_dialogshow.value = false;
                }
            }
        } else {
            if (utils.isDef(dialogShow.value)) {
                dialogShow.value = false;
            }
        }
    };
</script>