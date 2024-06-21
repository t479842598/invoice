<template>
    <div class="roadui_page">
        <el-form :model="editData" ref="ruleFormRef" :rules="rules" label-width="80px">
            <el-form-item label="收件人" prop="receiveUsers">
                <el-selectorg ref="receiveUsersRef" v-model="editData.receiveUsers" style="width:100%" clearable />
            </el-form-item>
            <el-form-item label="抄送" prop="carbonCopy">
                <el-selectorg ref="carbonCopyRef" v-model="editData.carbonCopy" style="width: 460px" clearable />
                <span style="margin-left:12px;">
                    密送<el-selectorg ref="secretCopyRef" v-model="editData.secretCopy" style="width: 460px; margin-left: 12px;" clearable />
                </span>
            </el-form-item>
            <el-form-item label="主题" prop="mailSubject">
                <el-input v-model="editData.mailSubject" style="width:90%" clearable />
                <span style="margin-left:12px;">
                    <span style="margin-right:12px;">颜色</span><el-color-picker v-model="editData.subjectColor" />
                </span>
            </el-form-item>
            <el-form-item label="附件" prop="files">
                <el-selectfile ref="filesRef" v-model="editData.files" style="width:100%" />
            </el-form-item>
            <el-form-item label="正文" prop="content">
                <el-ckeditor v-model="editData.content" :toolbar="1" :height="280" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="butDisabled" @click="send(ruleFormRef,0)">存草稿</el-button>
                <el-button type="primary" :disabled="butDisabled" @click="send(ruleFormRef,1)">发送</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted, nextTick } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const sysConfig = inject('config');
    const ElSelectfile = inject('ElSelectfile');
    const ElCkeditor = inject('ElCkeditor');
    const ElSelectorg = inject('ElSelectorg');
    const props = defineProps({
        query: { type: String, default: () => { return ''; } }
    });
    const mailId = utils.query('id', props.query);
    //要加载邮件内容的来源 draftbox：草稿箱 inboxreply：收件箱-回复 inboxredirect：收件箱-转发 outbox：发件箱
    const source = utils.query('source', props.query);
    const filesRef = ref(null);

    const ruleFormRef = ref(null);
    const receiveUsersRef = ref(null);
    const carbonCopyRef = ref(null);
    const secretCopyRef = ref(null);
    const butDisabled = ref(false);
    const editData = ref({});
    const rules = {
        receiveUsers: [{ required: true, message: '请选择收件人', trigger: 'blur', },],
        mailSubject: [{ required: true, message: '邮件主题不能为空', trigger: 'blur', },],
    };

    onMounted(() => {
        nextTick(() => {
            if (utils.length(mailId) > 0) {
                butDisabled.value = true;
                let postUrl = '/Mail/GetSendMail?id=' + mailId + '&source=' + source;
                ajax.post(postUrl).then((res) => {
                    editData.value = res.data;
                    //如果是回复或转发，组织原始邮件内容。
                    if (source === 'inboxreply' || source === 'inboxredirect') {
                        let subject = (source === 'inboxreply' ? '回复 - ' : '转发 - ') + res.data.mailSubject;
                        let content = '<p></p><div style="padding:4px 10px;margin-bottom:8px;border:1px solid #d9d9d9;border-radius:4px;">';
                        content += '<div style="padding:5px 0;">--------------------------原始邮件--------------------------</div>';
                        content += '<div style="background-color:#f5f5f5;border-radius:4px;padding:8px;margin:5px 0 10px 0;">';
                        content += '<div>发件人：' + res.data.sender + ' - ' + res.data.senderOrg + '</div>';
                        content += '<div>收件人：' + res.data.receiver + ' - ' + res.data.receiverOrg + '</div>';
                        content += '<div>日期：' + res.data.receiveTime + '</div>';
                        content += '</div>';
                        content += res.data.content;
                        //附件
                        if (res.data.files1.length > 0) {
                            content += '<div>附件：</div><div>';
                            for (let i = 0; i < res.data.files1.length; i++) {
                                content += '<span style="margin-right:20px;"><a target="_blank" class="roaduia" href="javascript:;" data-fileid="' + res.data.files1[i].id +'" onclick="javascript:window.open(\'' + sysConfig.SERVER_WEBADDRESS + '/Files/Show?id='
                                    + res.data.files1[i].id + '&nroadflow-token=\'+getRoadFlowLoginToken())">' + (i + 1) + '. ' + res.data.files1[i].name + '</a></span>';
                            }
                            content += '</div>';
                        }
                        content += '</div>';
                        editData.value.mailSubject = subject;
                        editData.value.content = content;
                    }
                    filesRef.value.initTitle(editData.value.files);
                    butDisabled.value = false;
                }).catch(() => { butDisabled.value = false; });
            }
        });
    });

    //type 0：存草稿 1：发送
    const send = async (formEl, type) => {
        if (!formEl) {
            return;
        }
        await formEl.validate((valid) => {
            if (valid) {
                editData.value.type = type;
                if (type === 1) {
                    utils.confirm('您确定要发送吗？', send1);
                } else {
                    send1();
                }
            }
        });
    };

    const send1 = () => {
        butDisabled.value = true;
        ajax.post('/Mail/Send', qs.stringify(editData.value)).then((res) => {
            let msg = res.msg;
            if (utils.length(msg) === 0) {
                switch (res.code) {
                    case 1:
                        msg = '接收人不能为空！';
                        break;
                    case 2:
                        msg = '邮件主题不能为空！';
                        break;
                    default:
                        msg = (editData.value.type === 0 ? '保存' : '发送') + (res.success ? '成功！' : '失败！');
                        break;
                }
            }
            utils.msg(msg, res.success);
            if (res.success) {
                //发送成功清空表单，已免重复发送。
                if (editData.value.type === 1) {
                    editData.value = { id: '', receiver: '', carbonCopy: '', secretCopy: '' };
                    receiveUsersRef.value.initTitle('');
                    carbonCopyRef.value.initTitle('');
                    secretCopyRef.value.initTitle('');
                } else {
                    editData.value['id'] = res.data.id;
                }
            }
            butDisabled.value = false;
        }).catch(() => { butDisabled.value = false; });
    };
</script>