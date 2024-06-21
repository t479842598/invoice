<template>
    <div>
        <el-tabs @tab-change="tabChange">
            <el-tab-pane name="0" label="过程列表" v-loading="loading">
                <el-table :data="tasks"
                          :stripe="pager.tableStripe"
                          :border="pager.tableBorder"
                          style="width:100%"
                          :highlight-current-row="pager.tableHighlightCurrentRow">
                    <el-table-column prop="indexNumber" label="#" width="40" />
                    <el-table-column prop="stepName" label="步骤" min-width="100" />
                    <el-table-column prop="senderName" label="发送人" />
                    <el-table-column prop="receiveTime" label="接收时间" width="145" />
                    <el-table-column prop="receiverName" label="处理人" />
                    <el-table-column prop="completedTime" label="完成时间" width="145" />
                    <el-table-column prop="handleType" label="状态" min-width="100">
                        <template #default="scope">
                            <el-tag v-if="scope.row.handleType==0" type="info" effect="dark">{{utils.getTaskHadleTitle(scope.row.handleType)}}</el-tag>
                            <el-tag v-else-if="scope.row.handleType==1" color="#E6A23C" effect="dark" style="border-width:0;">{{utils.getTaskHadleTitle(scope.row.handleType)}}</el-tag>
                            <el-tag v-else type="info">{{utils.getTaskHadleTitle(scope.row.handleType)}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="comment" label="处理意见" min-width="100"/>
                    <el-table-column prop="note" label="备注">
                        <template #default="scope">
                            <span v-if="utils.length(scope.row.note)>0">{{note}}</span>
                            <span v-else>
                                <el-tag v-if="scope.row.taskType>0" :color="utils.getTaskTypeColor(scope.row.taskType)" effect="dark" style="border-width:0;">{{utils.getTaskTypeTitle(scope.row.taskType)}}</el-tag>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="1" label="流程图" v-loading="loading">
                <div>
                    <el-space size="large">
                        <el-tag color="#67C23A" effect="dark" style="border-width:0;">已完成</el-tag>
                        <el-tag color="#E6A23C" effect="dark" style="border-width:0;">处理中</el-tag>
                        <el-tag color="#909399" effect="dark" style="border-width:0;">未到达</el-tag>
                    </el-space>
                </div>
                <div style="overflow:auto">
                    <div :id="divId"></div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div v-show="dialogVisible" @mouseover="dialogVisible=true" @mouseout="dialogVisible=false" ref="dialogRef" class="roadui_flowrun_showprocess">
            <el-table :data="dialogData" stripe style="width:100%" :max-height="330">
                <el-table-column width="85" property="receiverName" label="处理人"></el-table-column>
                <el-table-column width="143" property="receiveTime" label="接收时间" />
                <el-table-column width="100" property="taskType" label="任务类型">
                    <template #default="scope">
                        <el-tag effect="dark" style="margin-right:8px;border-width:0;" :color="utils.getTaskTypeColor(scope.row.taskType)" v-if="scope.row.taskType>0">{{utils.getTaskTypeTitle(scope.row.taskType)}}</el-tag>
                        <el-tag type="info" v-else>常规</el-tag>
                    </template>
                </el-table-column>
                <el-table-column width="143" property="completedTime" label="完成时间" />
                <el-table-column width="108" property="handleType" label="处理类型">
                    <template #default="scope">
                        <el-tag v-if="scope.row.handleType==0" type="info" effect="dark">{{utils.getTaskHadleTitle(scope.row.handleType)}}</el-tag>
                        <el-tag v-else-if="scope.row.handleType==1" color="#E6A23C" effect="dark" style="border-width:0;">{{utils.getTaskHadleTitle(scope.row.handleType)}}</el-tag>
                        <el-tag v-else type="info">{{utils.getTaskHadleTitle(scope.row.handleType)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column property="comment" label="处理意见" />
            </el-table>
        </div>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    import flowShow from './flow-show.js';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const queryString = utils.getQuery(props.query);
    const flowId = utils.query('flowid', props.query);
    const groupId = utils.query('groupid', props.query);
    const status = utils.query('status', props.query);//状态，是查询进行中的流程还是已完成的流程。
    const tasks = ref([]);
    const loading = ref(false);
    const pager = ref(utils.getPager(''));

    const flowJson = ref({});
    const divId = 'flowShowDiv_' + utils.query('flowid', props.query);
    const dialogVisible = ref(false);
    const dialogRef = ref(null);
    const dialogData = ref([]);

    onMounted(() => {
        loadData();
    });

    const tabChange = (activeName) => {
        if (activeName == '1' && utils.length(flowJson.value) === 0) {
            loadFlow();
        }
    };

    const loadData = () => {
        loading.value = true;
        ajax.post('/Flow/GetGroupList?groupid=' + groupId + '&status=' + status).then((res) => {
            //循环加序号
            for (let i = 0; i < res.data.length; i++) {
                res.data[i]['indexNumber'] = i + 1;
            }
            tasks.value = res.data;
            loading.value = false;
        }).catch(() => { });
    };

    //图形方式
    const loadFlow = () => {
        loading.value = true;
        ajax.post('/Flow/GetFlowDesignJson?isnew=0&flowid=' + flowId + '&groupid=' + groupId).then((res) => {
            if (!res.success) {
                utils.msg('加载流程图失败！', false);
            } else {
                flowJson.value = res.data;
                //根据主题得到colorObj
                const theme = utils.getTheme();
                let colorObj = undefined;
                if (utils.isDef(theme) && utils.length(theme.color) > 0) {
                    colorObj = { line: theme.color, step: theme.color, focus: '#E6A23C', fontSize: 14, stepText: '' };
                }
                const xy = utils.getFlowMaxXY(res.data.steps);
                flowShow.dialogVisible = dialogVisible;
                flowShow.dialogRef = dialogRef;
                flowShow.dialogData = dialogData;
                flowShow.roaduiUtils = utils;
                flowShow.init(flowId, xy.x + 150, xy.y + 50, colorObj, false);
                flowShow.openFlow(res.data, tasks.value);
            }
            loading.value = false;
        }).catch(() => { });
    };
</script>