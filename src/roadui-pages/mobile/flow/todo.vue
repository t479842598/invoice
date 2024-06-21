<template>
    <div style="height: inherit">
        <div class="roaduim_title">
            <el-icon>
                <Edit />
            </el-icon>
            <span>待办事项</span>
        </div>
        <div v-loading="loading">
            <div style="padding: 0 12px">
                <el-form :inline="true">
                    <el-form-item label="" style="margin: 0 12px 0 0; width: 220px">
                        <el-input v-model="formData.title" :placeholder="`共${total}项`" clearable />
                    </el-form-item>
                    <el-form-item style="margin: 0">
                        <el-button type="primary" @click="loadData(true)">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div style="padding: 0 6px" v-infinite-scroll="loadMore" :infinite-scroll-disabled="butDisabled"
                :infinite-scroll-immediate="true">
                <div v-for="task in taskList" :key="task.id" class="roaduim_main_todoitem" @click="openTask(task)">
                    <div>
                        <el-tag effect="dark" style="margin-right: 5px; border-width: 0"
                            :color="utils.getTaskTypeColor(task.taskType)" v-if="task.taskType > 0">{{
                                utils.getTaskTypeTitle(task.taskType) }}</el-tag>
                        {{ task.title }}
                    </div>
                    <div class="roaduim_main_todonote">
                        <el-space :size="15" wrap>
                            <span><el-icon>
                                    <User />
                                </el-icon>{{ task.senderName }}</span>
                            <span>{{ task.flowName }} - {{ task.stepName }}</span>
                            <span>{{ task.receiveTime }}</span>
                        </el-space>
                    </div>
                </div>
                <div class="roadui_note" style="text-align: center; padding: 10px 0" v-show="butDisabled">
                    没有更多了
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, inject, onMounted, defineComponent } from "vue";
const ajax = inject("ajax");
const utils = inject("utils");
const qs = inject("qs");
const indexm_openurl = inject("indexm_openurl");
const indexm_backpage = inject('indexm_backpage');
const indexm_refreshpage = inject('indexm_refreshpage');
const loading = ref(false);
const butDisabled = ref(false);
const total = ref(0);
let currentNumber = 0;
const formData = ref({});

const taskList = ref([]);

const loadMore = () => {
    if (butDisabled.value) {
        return;
    }
    currentNumber++;
    loadData(false);
};

const loadData = (isQuery) => {
    if (isQuery) {
        taskList.value = new Array();
        currentNumber = 1;
    }
    loading.value = true;
    butDisabled.value = true;
    formData.value.size = 8;
    formData.value.number = currentNumber;
    formData.value.order = "receivetime desc";
    ajax
        .post("/Flow/GetTodoList", qs.stringify(formData.value))
        .then((res) => {
            taskList.value = taskList.value.concat(res.data.rows);
            total.value = res.data.total;
            butDisabled.value = currentNumber >= Math.ceil(res.data.total / 8);
            loading.value = false;
        })
        .catch(() => {
            loading.value = false;
        });
};

const openTask = (task) => {
    const id = "task_m_todo_" + task.id;
    const url =
        "/flow/run/index.vue?flowid=" +
        task.flowId +
        "&stepid=" +
        task.stepId +
        "&taskid=" +
        task.id +
        "&groupid=" +
        task.groupId +
        "&instanceid=" +
        task.instanceId +
        "&ismobile=1";
    indexm_openurl(id, url);
};
</script>
