<template>
    <div>
        <div class="roadui_noprint" style="margin:10px 0 12px 10px">
            <el-button type="primary" @click="print1">打印</el-button>
            <el-button @click="close1">关闭</el-button>
        </div>
        <div style="padding: 0 8px; margin-top: 8px;">
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                <tr>
                    <td style="font-size: 16px; font-weight: bold; height: 40px;">
                        <el-tag effect="dark" style="margin-right:8px;border-width:0;" v-if="editData.mailType>1" :type="editData.mailType===2?'':'success'">{{editData.mailType===2?'抄送':'密送'}}</el-tag>
                        主题：<span :style="utils.length(editData.subjectColor)>0?'color:'+editData.subjectColor:''">{{editData.mailSubject}}</span>
                    </td>
                </tr>
                <tr>
                    <td style="height: 40px; color: var(--el-color-info); ">
                        <el-space :size="30">
                            <span>发件人：{{editData.sender}} - {{editData.senderOrg}}</span>
                            <span>日期：{{editData.receiveTime}}</span>
                            <span v-if="utils.length(editData.receiveUsers)>0">收件人：{{editData.receiveUsers}}</span>
                            <span v-if="utils.length(editData.carbonCopy)>0">抄送：{{editData.carbonCopy}}</span>
                        </el-space>
                    </td>
                </tr>
                <tr>
                    <td style="border-bottom: 1px dashed var(--el-border-color-light); "></td>
                </tr>
                <tr>
                    <td>
                        <div style="margin:12px 0 0 0;" v-html="editData.content"></div>
                    </td>
                </tr>
                <tr v-if="utils.length(editData.files)>0">
                    <td>
                        <div style="margin-top:8px;">附件：</div>
                        <div>
                            <el-space :size="20">
                                <span v-for="(file,index) in editData.files" :key="file.id"><el-link @click="utils.showFile(index_openmenu, file, sysConfig.SERVER_WEBADDRESS)">{{index+1}}. {{file.name}}</el-link></span>
                            </el-space>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const index_openmenu = inject('index_openmenu');
    const index_removetab = inject('index_removetab');//首页关闭标签方法
    const sysConfig = inject('config');

    const props = defineProps({
        query: { type: String, default: () => { return ''; } }
    });
    const mailId = utils.query('id', props.query);
    const source = utils.query('source', props.query);//来源 inbox：收件箱 outbox：发件箱 deleted：已删除
    const butDisabled = ref(false);
    const editData = ref({});

    onMounted(() => {
        if (utils.length(mailId) > 0) {
            butDisabled.value = true;
            let postUrl = '/Mail/GetViewMail?id=' + mailId + '&source=' + source;
            ajax.post(postUrl).then((res) => {
                if (res.code === 1) {
                    utils.msg('要查看的邮件不存在，请刷新列表！', false);
                    index_removetab();
                    return;
                }
                editData.value = res.data;
                butDisabled.value = false;
            }).catch(() => { butDisabled.value = false; });
        }
    });
    
    //打印
    const print1 = () => {
        window.print();
    };

    //关闭窗口
    const close1 = () => {
        window.close();
    };
</script>