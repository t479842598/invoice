<template>
    <div>
        <div class="roadui_home_leftdivtitle">
            <span class="roadui_home_leftdivtitle1"><el-icon><Edit /></el-icon>待办事项</span>
            <el-link class="roadui_home_leftdivtitlemore" @click="openMore()">更多…</el-link>
        </div>
        <div v-for="todo in todoList" :key="todo.id" @click="openTask(todo)" class="roadui_home_leftdivitem">
            <div>
                <el-tooltip v-if="todo.status!=0" placement="top">
                    <template #content>
                        <span>{{(utils.length(todo.completeTime)>0?'要求完成时间 '+todo.completeTime:'无要求完成时间')}}</span>
                    </template>
                    <el-tag :color="utils.getTaskStatusColor(todo.status)" effect="dark" style="margin-right:8px;border-width:0;">{{utils.getTaskStatusTitle(todo.status)}}</el-tag>
                </el-tooltip>
                <el-tag effect="dark" style="margin-right:8px;border-width:0;" :color="utils.getTaskTypeColor(todo.taskType)" v-if="todo.taskType>0">{{utils.getTaskTypeTitle(todo.taskType)}}</el-tag>{{todo.title}}
            </div>
            <div class="roadui_note" style="margin-top:6px;">
                <el-space :size="18">
                    <span><el-icon style="margin-right:8px;vertical-align:-1px"><User /></el-icon>{{todo.senderName}}</span>
                    <span>{{todo.flowName}} - {{todo.stepName}}</span>
                    <span>{{utils.replaceTime(todo.receiveTimeTitle)}}</span>
                </el-space>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const index_openmenu = inject('index_openmenu');
    const todoList = ref([]);

    onMounted(() => {
        loadData();
    })

    const loadData = () => {
        const formData = { size: 5, number: 1, order: 'receivetime desc' };
        ajax.post('/Flow/GetTodoList', qs.stringify(formData)).then((res) => {
            todoList.value = res.data.rows;
        }).catch(() => { });
    };

    const openTask = (task) => {
        const item = {
            title: task.title,
            id: 'task_' + task.id,
            url: '/flow/run/index?flowid=' + task.flowId + '&stepid=' + task.stepId + '&taskid=' + task.id + '&groupid=' + task.groupId + '&instanceid=' + task.instanceId,
            ico: 'Edit',
            openMode: 0,
        };
        index_openmenu(item);
    };

    const openMore = () => {
        const item = {
            title: '待办事项',
            id: 'task_todolist',
            url: '/flow/run/todo',
            ico: 'Edit',
            openMode: 0,
        };
        index_openmenu(item);
    };
</script>