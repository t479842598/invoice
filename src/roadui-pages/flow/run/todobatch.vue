<template>
    <div class="roadui_page">
        <div>
            <el-form :inline="true">
                <el-form-item label="标题">
                    <el-input v-model="formData.title" clearable style="width:200px"/>
                </el-form-item>
                <el-form-item label="流程">
                    <el-selectflow v-model="formData.flowId" :auth-type="8"></el-selectflow>
                </el-form-item>
                <el-form-item label="接收时间">
                    <el-date-picker v-model="formDataDateRange" style="width:210px;"
                                    type="daterange"
                                    value-format="YYYY-MM-DD"
                                    unlink-panels
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :shortcuts="utils.dateShortucts" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled="butDisabled" @click="loadTableData(true)">查询</el-button>
                    <el-button type="primary" :disabled="butDisabled" @click="batch()">批量处理</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-table :data="tableData"
                      v-loading="loading"
                      :stripe="pager.tableStripe"
                      :border="pager.tableBorder"
                      style="width:100%;"
                      :highlight-current-row="pager.tableHighlightCurrentRow"
                      :default-sort="defaultOrder"
                      @sort-change="sortChange"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="45" />
                <el-table-column prop="title" label="标题" sortable="custom">
                    <template #default="scope">
                        <el-tag effect="dark" style="margin-right:8px;border-width:0;" :color="utils.getTaskTypeColor(scope.row.taskType)" v-if="scope.row.taskType>0">{{utils.getTaskTypeTitle(scope.row.taskType)}}</el-tag>
                        <a class="roaduia" href="javascript:;" @click="openTask(scope.row)">{{scope.row.title}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="flowName" label="流程" width="160" sortable="custom"></el-table-column>
                <el-table-column prop="stepName" label="步骤" width="150" sortable="custom"></el-table-column>
                <el-table-column prop="senderName" label="发送人" width="100"></el-table-column>
                <el-table-column prop="receiveTime" label="接收时间" width="150" sortable="custom"></el-table-column>
                <el-table-column prop="status" label="状态" width="100" sortable="custom">
                    <template #default="scope">
                        <el-tooltip placement="left">
                            <template #content>
                                <span>{{(utils.length(scope.row.completeTime)>0?'要求完成时间：'+scope.row.completeTime:'无要求完成时间')}}</span>
                            </template>
                            <el-tag :color="utils.getTaskStatusColor(scope.row.status)" effect="dark" style="border-width:0;">{{utils.getTaskStatusTitle(scope.row.status)}}</el-tag>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column width="138">
                    <template #default="scope">
                        <el-space>
                            <el-button type="primary" size="small" :disabled="butDisabled" @click="openTask(scope.row)">处理</el-button>
                            <el-button type="info" size="small" :disabled="butDisabled" @click="showProcess(scope.row)">过程</el-button>
                        </el-space>
                    </template>
                </el-table-column>
            </el-table>
            <div class="roadui_pagerdiv">
                <el-pagination v-model:currentPage="pager.number"
                               v-model:page-size="pager.size"
                               :page-sizes="pager.sizes"
                               :background="pager.background"
                               :layout="pager.layout"
                               :total="pager.total"
                               :disabled="butDisabled"
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange" />
            </div>
        </div>
        <!--批量处理窗口-->
        <el-dialog v-model="dialogShow" title="批量处理" destroy-on-close width="650px" draggable :close-on-click-modal="false">
            <el-form :model="editData" ref="ruleFormRef" :rules="rules" label-width="80px">
                <el-form-item label="常用意见" prop="comment1">
                    <el-select v-model="editData.comment1" @change="(val)=>{editData.comment=val;}" style="width:100%">
                        <el-option v-for="comment in comments" :key="comment.id" :label="comment.comment" :value="comment.comment"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="处理意见" prop="comment">
                    <el-input type="textarea" v-model="editData.comment" :rows="3" clearable />
                </el-form-item>
                <el-form-item label="处理类型" prop="handleType">
                    <el-radio-group v-model="editData.handleType">
                        <el-radio :label="0">通过</el-radio>
                        <el-radio :label="1">退回</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled="butDisabled" @click="batchOk(ruleFormRef)">确定</el-button>
                    <el-button @click="dialogShow=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const ElSelectflow = inject('ElSelectflow');
    const index_openmenu = inject('index_openmenu');

    const butDisabled = ref(false);
    const loading = ref(false);
    const tableData = ref([]);
    const formData = ref({ batch: 1 });
    const formDataDateRange = ref([]);//日期范围选择
    const defaultOrder = ref({ prop: 'receivetime', order: 'descending' });
    const pager = ref(utils.getPager(defaultOrder.value));

    let selectRows = [];//保存选择的行
    const comments = ref([]);//当前用户常用意见
    const dialogShow = ref(false);
    const ruleFormRef = ref(null);
    const editData = ref({ comment1: '', handleType: 0 });
    const rules = {
        comment: [{ required: true, message: '请选输入处理意见', trigger: 'blur', },],
        handleType: [{ required: true, message: '请选择处理类型', trigger: 'blur', },]
    };

    onMounted(() => {
        loadTableData(false);
    });
    //选择行
    const handleSelectionChange = (val) => {
        selectRows = val;
    };
    //每页条数改变
    const handleSizeChange = (size) => {
        pager.value.size = size;
        loadTableData(false);
    };
    //页码改变
    const handleCurrentChange = (number) => {
        pager.value.number = number;
        loadTableData(false);
    };
    //排序
    const sortChange = (order) => {
        pager.value.order = utils.getOrder(order);
        loadTableData(false);
    };
    //加载列表，isQuery 点查询按钮为true，初始加载为false，为了区分点查询按钮时要将页number置为1。
    const loadTableData = (isQuery) => {
        if (isQuery) {
            pager.value.number = 1;
        }
        loading.value = true;
        butDisabled.value = true;
        formData.value.size = pager.value.size;
        formData.value.number = pager.value.number;
        formData.value.order = pager.value.order;
        formData.value['date1'] = utils.length(formDataDateRange.value) > 0 ? formDataDateRange.value[0] : '';
        formData.value['date2'] = utils.length(formDataDateRange.value) > 1 ? formDataDateRange.value[1] : '';
        ajax.post('/Flow/GetTodoList', qs.stringify(formData.value)).then((res) => {
            tableData.value = res.data.rows;
            pager.value.total = res.data.total;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; loading.value = false; });
    };
    //处理任务
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
    //显示处理过程
    const showProcess = (task) => {
        const item = {
            id: 'task_process_' + utils.createGuid(false),
            title: task.title,
            url: '/flow/run/process?flowid=' + task.flowId + '&groupid=' + task.groupId + '&status=0',
            openMode: 1,
            width: '1150px',
            customClass: 'el-dialog__padding',
            center: false,
        };
        index_openmenu(item);
    };
    //载入当前用户的快捷意见
    const loadComments = () => {
        if (comments.value.length > 0) {
            dialogShow.value = true;
            return;
        }
        ajax.post('/FlowComment/GetUserComments').then((res) => {
            comments.value = res.data;
            dialogShow.value = true;
        }).catch(() => { });
    };
    //批量处理
    const batch = () => {
        if (selectRows.length === 0) {
            utils.msg('请选择要批量处理的任务！', false);
            return;
        }
        loadComments();
    };
    //批量处理确定
    const batchOk = async (formEl) => {
        if (!formEl) {
            return;
        }
        await formEl.validate((valid) => {
            if (valid) {
                butDisabled.value = true;
                ajax.post('/Flow/FlowBatchExecute', qs.stringify({ tasks: utils.getArrayValues(selectRows, 'id').join(','), comment: editData.value.comment, handleType: editData.value.handleType })).then((res) => {
                    if (res.success) {
                        utils.msg('成功批量处理了' + res.data + '个任务！', true);
                        //重新载入数据
                        loadTableData(false);
                        dialogShow.value = false;
                    } else {
                        utils.msg('批量处理发生了错误！', false);
                    }
                    butDisabled.value = false;
                }).catch(() => { butDisabled.value = false; });
            }
        });
    };
</script>