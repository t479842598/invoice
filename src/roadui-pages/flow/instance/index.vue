<template>
    <div class="roadui_page">
        <div>
            <el-form :inline="true">
                <el-form-item label="标题">
                    <el-input v-model="formData.title" style="width:130px" clearable />
                </el-form-item>
                <el-form-item label="流程">
                    <el-selectflow v-model="formData.flowId" :auth-type="2" style="width:160px"></el-selectflow>
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
                <el-form-item label="流程状态">
                    <el-radio-group v-model="formData.status" @change="loadTableData(true)">
                        <el-radio-button label="0">进行中</el-radio-button>
                        <el-radio-button label="1">已结束</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled="butDisabled" @click="loadTableData(true)">查询</el-button>
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
                      @sort-change="sortChange">
                <el-table-column prop="title" label="标题">
                    <template #default="scope">
                        <a class="roaduia" href="javascript:;" @click="openTask(scope.row)">{{scope.row.title}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="flowName" label="流程" width="160"></el-table-column>
                <el-table-column prop="receiverName" label="接收人" width="100"></el-table-column>
                <el-table-column prop="receiveTime" label="接收时间" width="150" sortable="custom"></el-table-column>
                <el-table-column prop="stepName" label="当前" width="150">
                    <template #default="scope">
                        <el-tag v-if="formData.status==0">{{scope.row.stepName}}</el-tag>
                        <el-tag v-else>{{utils.getTaskHadleTitle(scope.row.handleType)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column width="138">
                    <template #default="scope">
                        <el-space>
                            <el-button type="primary" size="small" :disabled="butDisabled" @click="manage(scope.row)">管理</el-button>
                            <el-button type="danger" :disabled="butDisabled" @click="del(scope.row)" size="small">作废</el-button>
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
        <!--管理列表-->
        <el-dialog v-model="dialogShow" title="实例管理" class="el-dialog__padding" align-center destroy-on-close width="1180px" draggable :close-on-click-modal="false">
            <el-table :data="dialogData"
                      v-loading="dialogLoading"
                      :stripe="pager.tableStripe"
                      :border="pager.tableBorder"
                      style="width:100%;"
                      :highlight-current-row="pager.tableHighlightCurrentRow">
                <el-table-column prop="stepName" label="步骤"></el-table-column>
                <el-table-column prop="senderName" label="发送人"></el-table-column>
                <el-table-column prop="receiverName" label="接收人"></el-table-column>
                <el-table-column prop="receiveTime" label="接收时间" width="150"></el-table-column>
                <el-table-column prop="completedTime" label="完成时间" width="150"></el-table-column>
                <el-table-column prop="handleType" label="状态" width="100">
                    <template #default="scope">
                        <el-tag v-if="scope.row.handleType==0" type="info" effect="dark">{{utils.getTaskHadleTitle(scope.row.handleType)}}</el-tag>
                        <el-tag v-else-if="scope.row.handleType==1" color="#E6A23C" effect="dark" style="border-width:0;">{{utils.getTaskHadleTitle(scope.row.handleType)}}</el-tag>
                        <span v-else>{{utils.getTaskHadleTitle(scope.row.handleType)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="note" label="备注">
                    <template #default="scope">
                        <span v-if="utils.length(scope.row.note)>0">{{note}}</span>
                        <span v-else>
                            <el-tag v-if="scope.row.taskType>0" :color="utils.getTaskTypeColor(scope.row.taskType)" effect="dark" style="border-width:0;">{{utils.getTaskTypeTitle(scope.row.taskType)}}</el-tag>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column width="265">
                    <template #default="scope">
                        <el-button @click="manageStatus(scope.row)" size="small" type="primary">状态</el-button>
                        <el-button @click="manageDel(scope.row)" size="small" type="danger">删除</el-button>
                        <el-button @click="manageDesignate(scope.row)" size="small" v-if="scope.row.handleType==0||scope.row.handleType==1" type="warning">指派</el-button>
                        <el-button @click="manageGoto(scope.row)" size="small" v-if="scope.row.handleType==0||scope.row.handleType==1" type="info">跳转</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!--改变状态-->
        <el-dialog v-model="dialogStatusShow" title="修改状态" align-center destroy-on-close width="500px" draggable :close-on-click-modal="false">
            <el-form :model="statusFormData" ref="ruleStatusFormRef" :rules="statusRules" label-width="70px">
                <el-form-item label="状态" prop="status">
                    <el-select style="width:100%" v-model="statusFormData.status">
                        <el-option v-for="opt in statusOptions" :key="opt.value" :value="opt.value" :label="opt.title"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled="butDisabled" @click="statusOk(ruleStatusFormRef)">确定</el-button>
                    <el-button :disabled="butDisabled" @click="dialogStatusShow=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--指派-->
        <el-dialog v-model="dialogDesignateShow" title="指派" align-center destroy-on-close width="500px" draggable :close-on-click-modal="false">
            <el-form :model="designateFormData" ref="ruleDesignateFormRef" :rules="designateRules" label-width="70px">
                <el-form-item label="指派给" prop="receiver">
                    <el-selectorg style="width:100%" v-model="designateFormData.receiver" placeholder="选择接收人"></el-selectorg>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled="butDisabled" @click="designateOk(ruleDesignateFormRef)">确定</el-button>
                    <el-button :disabled="butDisabled" @click="dialogDesignateShow=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--跳转-->
        <el-dialog v-model="dialogGotoShow" title="跳转" align-center destroy-on-close width="500px" draggable :close-on-click-modal="false">
            <div style="max-height:500px;overflow:auto;">
                <el-form :model="gotoFormData" v-loading="gotoLoading" label-position="top" ref="ruleGotoFormRef" :rules="gotoRules" label-width="70px">
                    <el-form-item v-for="gotoStep in gotoSteps" :key="gotoStep.id" :label="gotoStep.name">
                        <el-selectorg style="width:98%" v-model="gotoStep.members" placeholder="选择接收人"></el-selectorg>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span>
                    <el-button type="primary" :disabled="butDisabled" @click="gotoOk(ruleGotoFormRef)">确定</el-button>
                    <el-button :disabled="butDisabled" @click="dialogGotoShow=false">取消</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const ElSelectorg = inject('ElSelectorg');
    const ElSelectflow = inject('ElSelectflow');
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const index_openmenu = inject('index_openmenu');

    const loading = ref(false);
    const butDisabled = ref(false);
    const formData = ref({ status: utils.query('status', props.query) || '0' });
    const formDataDateRange = ref([]);
    const tableData = ref([]);
    const defaultOrder = ref({ prop: 'receivetime', order: 'descending' });
    const pager = ref(utils.getPager(defaultOrder.value));

    const dialogShow = ref(false);
    const dialogLoading = ref(false);
    const dialogData = ref([]);

    onMounted(() => {
        loadTableData(false);
    });

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
    //加载实例列表
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
        ajax.post('/Flow/GetInstanceManageList', qs.stringify(formData.value)).then((res) => {
            tableData.value = res.data.rows;
            pager.value.total = res.data.total;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; loading.value = false; });
    };
    //作废一组实例
    const del = (row) => {
        utils.confirm('您确定要作废该流程实例吗？', () => {
            butDisabled.value = true;
            ajax.post('/Flow/InstanceManageDelete', qs.stringify({ groupid: row.id })).then((res) => {
                if (res.success) {
                    //消息提示
                    utils.msg('作废成功！', true);
                    loadTableData(false);
                } else {
                    utils.msg('作废流程实例发生了错误！', false);
                }
                butDisabled.value = false;
            }).catch(() => { butDisabled.value = false; });
        });
    };
    //管理
    const manage = (row) => {
        dialogShow.value = true;
        loadManageData(row.id);
    };
    //打开表单
    const openTask = (task) => {
        const item = {
            title: task.title,
            id: 'task_' + task.taskId,
            url: '/flow/run/index?flowid=' + task.flowId + '&stepid=' + task.stepId + '&taskid=' + task.taskId + '&groupid=' + task.id + '&instanceid=' + task.instanceId + '&display=1',
            ico: 'Edit',
            openMode: 0,
        };
        index_openmenu(item);
    };
    //载入实例管理列表
    const loadManageData = (groupId) => {
        dialogLoading.value = true;
        ajax.post('/Flow/GetInstanceManageTasks', qs.stringify({ groupid: groupId })).then((res) => {
            dialogData.value = res.data;
            dialogLoading.value = false;
        }).catch(() => { });
    };
    //改变状态
    const dialogStatusShow = ref(false);
    const statusFormData = ref({});
    const ruleStatusFormRef = ref(null);
    const statusOptions = [
        { value: 0, title: '待处理' },
        { value: 1, title: '处理中' },
        { value: 2, title: '已完成' },
        { value: 3, title: '他人已处理' },
        { value: 4, title: '已退回' },
        { value: 5, title: '他人已退回' },
        { value: 6, title: '已转交' },
        { value: 7, title: '已委托' },
        { value: 8, title: '已阅知' },
        { value: 9, title: '已指派' },
        { value: 10, title: '已跳转' },
        { value: 11, title: '已终止' },
        { value: 12, title: '他人已终止' },
        { value: 13, title: '已暂缓' },
        { value: 14, title: '他人已暂缓' },
        { value: 15, title: '已加签' },
        { value: 16, title: '自动完成' },
        { value: 17, title: '已回复' },
    ];
    const statusRules = {
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
    };
    const manageStatus = (task) => {
        statusFormData.value.taskId = task.id;
        statusFormData.value.groupId = task.groupId;
        statusFormData.value.status = task.handleType;
        dialogStatusShow.value = true;
    };
    const statusOk = async (formEl) => {
        if (!formEl) {
            return;
        }
        await formEl.validate((valid) => {
            if (valid) {
                ajax.post('/Flow/InstanceManageSaveStatus', qs.stringify({ taskId: statusFormData.value.taskId, status: statusFormData.value.status })).then((res) => {
                    //返回res.data 0：实例为空 1：修改未完成表 2：修改未完成表并转移到了已完成 3：修改已完成表 4：修改已完成表并转移到了未完成
                    if (res.success) {
                        //消息提示
                        utils.msg('任务状态修改成功！', true);
                        dialogStatusShow.value = false;
                        //刷新
                        if (res.data == '2' || res.data == '4') {
                            //如果是将已结束流程改为了待办状态，则刷新整个实例管理页面。
                            dialogShow.value = false;
                            loadTableData(false);
                        } else {
                            loadManageData(statusFormData.value.groupId);
                        }
                    } else {
                        utils.msg('修改流程任务状态发生了错误！', false);
                    }
                }).catch(() => { });
            }
        });
    };

    //指派
    const dialogDesignateShow = ref(false);
    const designateFormData = ref({});
    const ruleDesignateFormRef = ref(null);
    const designateRules = {
        receiver: [{ required: true, message: '请选择接收人', trigger: 'blur' }],
    };
    const manageDesignate = (task) => {
        designateFormData.value.taskId = task.id;
        designateFormData.value.groupId = task.groupId;
        designateFormData.value.receiver = '';
        dialogDesignateShow.value = true;
    };
    const designateOk = async (formEl) => {
        if (!formEl) {
            return;
        }
        await formEl.validate((valid) => {
            if (valid) {
                ajax.post('/Flow/InstanceManageSaveDesignate', qs.stringify({ taskId: designateFormData.value.taskId, receiver: designateFormData.value.receiver })).then((res) => {
                    if (res.success) {
                        utils.msg('指派成功！', true);
                        dialogDesignateShow.value = false;
                        loadManageData(designateFormData.value.groupId);
                    } else {
                        utils.msg('指派失败！', false);
                    }
                }).catch(() => { });
            }
        });
    };

    //跳转
    const dialogGotoShow = ref(false);
    const gotoFormData = ref({});
    const ruleGotoFormRef = ref(null);
    const gotoSteps = ref([]);//步骤列表
    const gotoLoading = ref(false);
    const gotoRules = {};
    const manageGoto = (task) => {
        gotoFormData.value.taskId = task.id;
        gotoFormData.value.groupId = task.groupId;
        gotoLoading.value = true;
        dialogGotoShow.value = true;
        butDisabled.value = true;
        ajax.post('/Flow/InstanceManageGetGotoSteps', qs.stringify({ taskId: task.id })).then((res) => {
            if (res.success) {
                gotoSteps.value = res.data;
                gotoLoading.value = false;
                butDisabled.value = false;
            }
        }).catch(() => { });
    };
    const gotoOk = async (formEl) => {
        if (!formEl) {
            return;
        }
        await formEl.validate((valid) => {
            if (valid) {
                let steps = [];
                for (let i = 0; i < gotoSteps.value.length; i++) {
                    if (utils.length(gotoSteps.value[i].members) > 0) {
                        steps.push({ id: gotoSteps.value[i].id, members: gotoSteps.value[i].members })
                    }
                }
                if (steps.length === 0) {
                    utils.msg('您没有选择要跳转的步骤！', false);
                    return;
                }
                ajax.post('/Flow/InstanceManageSaveGoto', qs.stringify({ taskId: gotoFormData.value.taskId, steps: JSON.stringify(steps) })).then((res) => {
                    if (res.success) {
                        utils.msg('跳转成功！', true);
                        dialogGotoShow.value = false;
                        loadManageData(gotoFormData.value.groupId);
                    } else {
                        let msg = res.msg;
                        if (utils.length(msg) === 0) {
                            if (res.code == 1) {
                                msg = '参数错误！';
                            } else if (res.code == 2) {
                                msg = '当前任务为空！';
                            } else {
                                msg = '跳转失败！'
                            }
                        }
                        utils.msg(msg, false);
                    }
                }).catch(() => { });
            }
        });
    }

    //删除
    const manageDel = (task) => {
        utils.confirm('您确定要删除该任务吗？', () => {
            ajax.post('/Flow/InstanceManageDeleteTask', qs.stringify({ taskId: task.id, otherType: task.otherType })).then((res) => {
                if (res.success) {
                    //消息提示
                    utils.msg('删除成功！', true);
                    //刷新
                    loadManageData(task.groupId);
                } else {
                    utils.msg('删除流程任务发生了错误！', false);
                }
            }).catch(() => { });
        });
    };
</script>