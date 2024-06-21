<template>
    <div class="roadui_page">
        <div>
            <div class="roadui_toolbar">
                <div><button :disabled="butDisabled" @click="print1()" type="button"><el-icon><Printer /></el-icon>打印</button></div>
                <div><span>|</span></div>
                <div v-if="source==='inbox'"><button :disabled="butDisabled" @click="reply()" type="button"><el-icon><ChatLineSquare /></el-icon>回复</button></div>
                <div v-if="source==='inbox'"><button :disabled="butDisabled" @click="redurect()" type="button"><el-icon><Position /></el-icon>转发</button></div>
                <div v-if="source==='deleted'"><button :disabled="butDisabled" @click="redurect1()" type="button"><el-icon><Position /></el-icon>转发</button></div>
                <div v-if="source==='outbox'"><button :disabled="butDisabled" @click="edit()" type="button"><el-icon><Edit /></el-icon>编辑</button></div>
                <div v-if="source==='outbox'"><button :disabled="butDisabled" @click="viewRead()" type="button"><el-icon><View /></el-icon>阅读情况</button></div>
                <div><span>|</span></div>
                <div v-if="source!=='deleted'"><button :disabled="butDisabled" @click="del(0)" type="button"><el-icon><Delete /></el-icon>删除</button></div>
                <div><button :disabled="butDisabled" @click="del(1)" type="button"><el-icon><DeleteFilled /></el-icon>彻底删除</button></div>
            </div>
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
        <!--阅读情况窗口-->
        <div>
            <el-dialog v-model="dialogShow" title="邮件阅读情况" align-center destroy-on-close width="700px" draggable>
                <el-table :data="viewData"
                          :stripe="pager.tableStripe"
                          :border="pager.tableBorder"
                          style="width:100%">
                    <el-table-column prop="userName" label="收件人">
                        <template #default="scope">
                            <el-tag effect="dark" style="margin-right:8px;border-width:0;vertical-align:middle;" v-if="scope.row.mailType>1" :type="scope.row.mailType===2?'':'success'">{{scope.row.mailType===2?'抄送':'密送'}}</el-tag>
                            <span>{{scope.row.userName}}</span> -
                            <span class="roadui_note">{{scope.row.userOrg}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="readTime" label="阅读时间" width="160">
                        <template #default="scope">
                            <el-tag v-if="scope.row.isRead===0" type="info">未读</el-tag>
                            <span v-else class="roadui_note">{{scope.row.readTime}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
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
    const pager = ref(utils.getPager({}));

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
                } else if (res.code === -1) {
                    utils.msg('您无权查看该邮件！', false);
                    index_removetab();
                    return;
                }
                editData.value = res.data;
                butDisabled.value = false;
            }).catch(() => { butDisabled.value = false; });
        }
    });

    //删除 type: 0删除 1彻底删除
    const del = (type) => {
        utils.confirm('您确定要' + (type == 1 ? '彻底' : '') + '删除邮件吗？', () => {
            butDisabled.value = true;
            let postUrl = '';
            switch (source) {
                case "inbox":
                    postUrl = '/Mail/DeleteIn';
                    break;
                case "outbox":
                    postUrl = '/Mail/DeleteDraft';
                    break;
                case "deleted":
                    postUrl = '/Mail/DeleteDeleted';
                    break;
            }
            ajax.post(postUrl, qs.stringify({ ids: mailId, type: type })).then((res) => {
                let msg = res.msg;
                if (utils.length(msg) === 0) {
                    msg = res.success ? "删除成功！" : "删除失败！";
                }
                utils.msg(msg, res.success);
                butDisabled.value = false;
                if (res.success) {
                    index_removetab();
                }
            }).catch(() => { butDisabled.value = false; });
        });
    };

    //回复
    const reply = () => {
        const item = {
            title: '回复 - ' + editData.value.mailSubject,
            id: 'mail_reply_' + editData.value.id,
            url: '/system/mail/send?id=' + editData.value.id + '&source=inboxreply',
            ico: 'Edit',
            openMode: 0,
        };
        index_openmenu(item);
    };

    //转发
    const redurect = () => {
        const item = {
            title: '转发 - ' + editData.value.mailSubject,
            id: 'mail_reply_' + editData.value.id,
            url: '/system/mail/send?id=' + editData.value.id + '&source=inboxredirect',
            ico: 'Edit',
            openMode: 0,
        };
        index_openmenu(item);
    };

    //转发已删除邮件
    const redurect1 = () => {
        const item = {
            title: '转发 - ' + editData.value.mailSubject,
            id: 'mail_reply_' + editData.value.id,
            url: '/system/mail/send?id=' + editData.value.id + '&source=deleted',
            ico: 'Edit',
            openMode: 0,
        };
        index_openmenu(item);
    };

    //编辑
    const edit = () => {
        const item = {
            title: '编辑邮件 - ' + editData.value.mailSubject,
            id: 'mail_edit_' + editData.value.id,
            url: '/system/mail/send?id=' + editData.value.id + '&source=' + source,
            ico: 'Edit',
            openMode: 0,
        };
        index_openmenu(item);
    };

    //查看阅读情况
    const dialogShow = ref(false);
    const viewData = ref([]);
    const viewRead = () => {
        butDisabled.value = true;
        ajax.post('/Mail/GetInboxUsers?id=' + mailId).then((res) => {
            viewData.value = res.data;
            butDisabled.value = false;
            dialogShow.value = true;
        }).catch(() => { butDisabled.value = false; });
    };

    //打印
    const print1 = () => {
        const item = {
            title: '打印 - ' + editData.value.mailSubject,
            id: 'mail_print_' + mailId,
            url: '/system/mail/print1?id=' + mailId + '&source=' + source,
            ico: 'Message',
            openMode: 2,
            width: 1000,
            height: 680,
        };
        index_openmenu(item);
    };
</script>