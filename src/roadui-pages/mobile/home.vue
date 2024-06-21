<template>
    <div v-loading="loading">
        <div class="roaduim_main_header">
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
                <tr>
                    <td style="width:68px; text-align:left;">
                        <!-- <el-avatar v-if="utils.length(userInfo.headerImg) > 0" :size="48" :src="userInfo.headerImg"
                            class="roaduim_main_header_img" />
                        <el-avatar v-else :size="48" :src="headerImg" class="roaduim_main_header_img" /> -->
                        <el-avatar :size="48" :src="headerImg" class="roaduim_main_header_img" />
                    </td>
                    <td style="text-align:left;">
                        <div class="roaduim_main_header_name">
                            <div style="font-weight:bold; font-size:16px;">{{ userInfo.userName }}</div>
                            <div style="font-size:12px;margin-top:6px;">{{ userInfo.userOrganize }}</div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <div style="padding:0 12px;">
            <div class="roaduim_main_shortuct">
                <el-row :gutter="20" justify="center">
                    <el-col :span="4" style="margin: 5px; padding: 8px 0 10px 0;" v-for="shortuct in shortucts"
                        :key="shortuct.id" @click="openShortuct(shortuct)" class="roaduim_main_shortuctitem">
                        <div>
                            <component :is="shortuct.ico"></component>
                        </div>
                        <div style="font-size:12px; word-break:keep-all;">{{ shortuct.title }}</div>
                    </el-col>
                </el-row>
            </div>
            <div class="roaduim_main_todo">
                <div class="roaduim_main_listtitle">
                    <el-icon>
                        <Edit />
                    </el-icon><span style="display:inline-block;vertical-align:-1px;">待办事项</span>
                </div>
                <div v-for="todo in todoList" :key="todo.id" @click="openTask(todo)" class="roaduim_main_todoitem">
                    <div>
                        <el-tag effect="dark" style="margin-right:5px;border-width:0;"
                            :color="utils.getTaskTypeColor(todo.taskType)" v-if="todo.taskType > 0">{{
                                utils.getTaskTypeTitle(todo.taskType) }}</el-tag>
                        {{ todo.title }}
                    </div>
                    <div class="roaduim_main_todonote">
                        <el-space :size="15" wrap>
                            <span><el-icon>
                                    <User />
                                </el-icon>{{ todo.senderName }}</span>
                            <span>{{ todo.flowName }} - {{ todo.stepName }}</span>
                            <span>{{ todo.receiveTime }}</span>
                        </el-space>
                    </div>
                </div>
                <div class="roadui_note" style="text-align:center;padding:10px 0;" v-show="butDisabled">没有更多了</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
const ajax = inject('ajax');
const utils = inject('utils');
const indexm_openurl = inject('indexm_openurl');
const indexm_userinfo = inject('indexm_userinfo');
const loading = ref(false);
import headerImg from '../../roadui-assets/header.png';

const shortucts = ref([
    { id: 'shortuct_index', title: '开票申请', ico: 'Tickets', url: '/mobile/flow/main.vue' },
    { id: 'shortuct_starts', title: '发起流程', ico: 'Promotion', url: '/mobile/flow/starts.vue' },
    { id: 'shortuct_todo', title: '待办事项', ico: 'WalletFilled', url: '/mobile/flow/todo.vue' },
    { id: 'shortuct_completed', title: '已办事项', ico: 'FolderChecked', url: '/mobile/flow/completed.vue' },
    { id: 'shortuct_mystarts', title: '我的流程', ico: 'FolderAdd', url: '/mobile/flow/mystarts.vue' },
    // { id: 'shortuct_document', title: '文档中心', ico: 'Briefcase', url: '/mobile/document/index.vue' },
]);

const todoList = ref([]);
const userInfo = ref({});

onMounted(() => {
    // loadData();
    getUserInfo()
    getTodoList()
});

const loadData = () => {
    loading.value = true;
    ajax.post('/Home/GetIndexInfo').then((res) => {
        todoList.value = res.data.todoList;
        userInfo.value = res.data.userInfo;
        indexm_userinfo.value = res.data.userInfo;
        loading.value = false;
    }).catch(() => { loading.value = false; });
};

const getUserInfo = () => {
    ajax.post('/Home/GetUserInfo').then((res) => {
        userInfo.value = res.data;
        indexm_userinfo.value = res.data;
        loading.value = false;
    }).catch(() => { loading.value = false; });
}

const getTodoList = () => {
    ajax.post('/Flow/GetTodoList').then((res) => {
        todoList.value = res.data.rows;
    });
};

const openTask = (task) => {
    const id = 'task_m_todo_' + task.id;
    const url = '/flow/run/index.vue?flowid=' + task.flowId + '&stepid=' + task.stepId + '&taskid=' + task.id + '&groupid=' + task.groupId + '&instanceid=' + task.instanceId + '&ismobile=1';
    indexm_openurl(id, url);
};

const openShortuct = (shortuct) => {
    indexm_openurl(shortuct.id, shortuct.url);
};
</script>