<template>
    <div class="roadui_page">
        <div>
            <el-form :inline="true">
                <el-form-item label="主题">
                    <el-input v-model="formData.subject" style="width:200px" clearable />
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker v-model="formDataDateRange" style="width:220px;"
                                    type="daterange"
                                    value-format="YYYY-MM-DD"
                                    unlink-panels
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :shortcuts="utils.dateShortucts" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled="butDisabled" @click="loadTableData(true)">查询</el-button>
                    <el-button type="primary" :disabled="butDisabled" @click="add()">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-table :data="tableData"
                      v-loading="loading"
                      :stripe="pager.tableStripe"
                      :border="pager.tableBorder"
                      style="width: 100%"
                      :highlight-current-row="pager.tableHighlightCurrentRow"
                      :default-sort="defaultOrder"
                      @sort-change="sortChange">
                <el-table-column prop="subject" label="主题" sortable="custom"></el-table-column>
                <el-table-column prop="addTime" label="创建时间" sortable="custom" width="150"></el-table-column>
                <el-table-column prop="participantsName" label="参与人员" width="200"></el-table-column>
                <el-table-column prop="endTime" label="结束时间" sortable="custom" width="150">
                    <template #default="scope">
                        <span v-if="utils.length(scope.row.endTime)>0">{{scope.row.endTime}}</span>
                        <el-tag v-else type="info">无结束时间</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" sortable="custom" width="80">
                    <template #default="scope">
                        <el-tag effect="dark" :type="getStatusColor(scope.row.status)">{{getStatusTitle(scope.row.status)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="235">
                    <template #default="scope">
                        <el-space>
                            <el-button size="small" type="primary" @click="edit(scope.row)">编辑</el-button>
                            <el-button size="small" type="primary" @click="subject(scope.row)">选题</el-button>
                            <el-button size="small" type="success" @click="publish(scope.row,1)" v-if="scope.row.status==0">发布</el-button>
                            <el-button size="small" type="warning" @click="publish(scope.row,0)" v-else-if="scope.row.status==1&&scope.row.status<2">取消</el-button>
                            <el-button size="small" type="danger" @click="del(scope.row)" v-if="scope.row.status<1">删除</el-button>
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
            <!--编辑窗口-->
            <el-dialog v-model="dialogShow" :title="dialogTitle" destroy-on-close width="850px" draggable :close-on-click-modal="false">
                <el-form :model="editData" ref="ruleFormRef" :rules="rules" label-width="100px">
                    <el-form-item label="主题" prop="subject">
                        <el-input v-model="editData.subject" clearable />
                    </el-form-item>
                    <el-form-item label="参与人员" prop="participants">
                        <el-selectorg v-model="editData.participants" style="width:100%" clearable />
                    </el-form-item>
                    <el-form-item label="结果查询人员" prop="queryUsers">
                        <el-selectorg v-model="editData.queryUsers" style="width:100%" clearable />
                    </el-form-item>
                    <el-form-item label="结束时间" prop="endTime">
                        <el-date-picker v-model="editData.endTime" placeholder="为空表示无结束时间" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" type="datetime" />
                    </el-form-item>
                    <el-form-item label="匿名提交" prop="anonymous">
                        <el-switch v-model="editData.anonymous" />
                    </el-form-item>
                    <el-form-item label="备注说明" prop="note">
                        <el-input v-model="editData.note" clearable />
                    </el-form-item>
                    <el-form-item>
                        <el-button v-if="editData.status==0" :disabled="butDisabled" @click="save(ruleFormRef)" type="primary">保存</el-button>
                        <el-button :disabled="butDisabled" @click="dialogShow=false">关闭</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!--选题窗口-->
            <el-dialog v-model="dialogSubjectShow" :title="dialogSubjectTitle" destroy-on-close width="1000px" draggable :close-on-click-modal="false">
                <component :is="dialogSubjectPage" :query="dialogSubjectQuery"></component>
            </el-dialog>
        </div>
    </div>
</template>

<script setup>
    import SubjectList from './subjectlist.vue';
    import SubjectAdd from './subjectadd.vue';
    import { ref, inject, computed, onMounted, shallowRef, provide } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const ElSelectorg = inject('ElSelectorg');

    const butDisabled = ref(false);
    const loading = ref(false);
    const formData = ref({});
    const formDataDateRange = ref([]);

    const tableData = ref([]);
    const defaultOrder = ref({ prop: 'addtime', order: 'descending' });
    const pager = ref(utils.getPager(defaultOrder.value));

    //得到状态标题 状态 0编辑中 1已发布 2已有结果 3已完成(所有人提交)
    const getStatusTitle = computed(() => (status) => {
        switch (status) {
            case 0:
                return '编辑中';
            case 1:
                return '已发布';
            case 2:
                return '已有结果';
            case 3:
                return '已完成';
            default:
                return '未知';
        }
    });
    //得到状态标签颜色
    const getStatusColor = computed(() => (status) => {
        switch (status) {
            case 0:
                return 'info';
            case 1:
                return '';
            case 2:
                return 'warning';
            case 3:
                return 'success';
            default:
                return '';
        }
    });

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
        ajax.post('/Questionnaire/GetMyList', qs.stringify(formData.value)).then((res) => {
            tableData.value = res.data.rows;
            pager.value.total = res.data.total;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; });
    };
    //添加
    const dialogShow = ref(false);
    const dialogTitle = ref('');
    const editData = ref({});
    const ruleFormRef = ref(null);
    const rules = {
        subject: [{ required: true, message: '主题不能为空', trigger: 'blur', },],
        participants: [{ required: true, message: '参与人员不能为空', trigger: 'blur', },],
    };
    const add = () => {
        editData.value = { status: 0 };
        dialogTitle.value = '添加问卷';
        dialogShow.value = true;
    };
    const edit = (row) => {
        butDisabled.value = true;
        ajax.post('/Questionnaire/Get?id=' + row.id).then((res) => {
            if (res.success) {
                editData.value = res.data;
                dialogTitle.value = '编辑问卷';
                dialogShow.value = true;
            } else {
                let msg = res.msg;
                if (utils.length(msg) === 0) {
                    if (res.code == 1) {
                        msg = '未找到问卷信息！';
                    } else {
                        msg = '获取问卷信息失败！';
                    }
                }
                utils.msg(msg, res.success);
            }
            butDisabled.value = false;
        }).catch(() => {
            butDisabled.value = false;
        });
    };
    const save = async (formEl) => {
        if (!formEl) {
            return;
        }
        await formEl.validate((valid) => {
            if (valid) {
                butDisabled.value = true;
                ajax.post('/Questionnaire/Save?id=' + (editData.value.id || ''), qs.stringify(editData.value)).then((res) => {
                    butDisabled.value = false;
                    let msg = res.msg;
                    if (utils.length(msg) === 0) {
                        if (res.success) {
                            msg = '保存成功！';
                        } else if (res.code == 1) {
                            msg = '数据验证错误！';
                        } else {
                            msg = '保存失败！';
                        }
                    }
                    utils.msg(msg, res.success);
                    if (res.success) {
                        dialogShow.value = false;
                        loadTableData(false);
                    }
                }).catch(() => {
                    butDisabled.value = false;
                });
            }
        });
    };
    const del = (row) => {
        utils.confirm('此操作将删除该调查问卷所有数据，并且不可恢复，您确定要删除吗？', () => {
            butDisabled.value = true;
            ajax.post('/Questionnaire/Delete?id=' + row.id).then((res) => {
                butDisabled.value = false;
                let msg = res.msg;
                if (utils.length(msg) === 0) {
                    if (res.success) {
                        msg = '删除成功！';
                    } else if (res.code == 1) {
                        msg = '问卷已经有提交结果，不能删除！';
                    } else {
                        msg = '删除失败！';
                    }
                }
                utils.msg(msg, res.success);
                if (res.success) {
                    loadTableData(false);
                }
            }).catch(() => {
                butDisabled.value = false;
            });
        });
    };

    //发布
    const publish = (row, status) => {
        const opation = status == 1 ? '发布' : '取消';
        utils.confirm('您确定要' + opation + '吗？', () => {
            butDisabled.value = true;
            ajax.post('/Questionnaire/Publish?id=' + row.id + '&status=' + status).then((res) => {
                butDisabled.value = false;
                let msg = res.msg;
                if (utils.length(msg) === 0) {
                    if (res.success) {
                        msg = opation + '成功！';
                    } else if (res.code == 1) {
                        msg = '未找到要' + opation + '的问卷信息！';
                    } else if (res.code == 2) {
                        msg = '问卷没有选题，不能发布！';
                    } else if (res.code == 3) {
                        msg = '问卷已经有提交结果，不能取消！';
                    } else {
                        msg = opation + '失败！';
                    }
                }
                utils.msg(msg, res.success);
                if (res.success) {
                    loadTableData(false);
                }
            }).catch(() => {
                butDisabled.value = false;
            });
        });
    };

    //选题
    const dialogSubjectShow = ref(false);
    const dialogSubjectTitle = ref('');
    const dialogSubjectPage = shallowRef(null);
    const dialogSubjectQuery = ref('');
    const subject = (row) => {
        dialogSubjectPage.value = SubjectList;
        dialogSubjectQuery.value = '?questionnaireid=' + row.id;
        dialogSubjectTitle.value = '选题';
        dialogSubjectShow.value = true;
    };
    //添加选题 questionnaireId问卷id；subjectId选项ID,新增为空；sort选题排序
    const addSubject = (questionnaireId, subjectId, sort) => {
        dialogSubjectPage.value = SubjectAdd;
        dialogSubjectQuery.value = '?questionnaireid=' + questionnaireId + '&subjectid=' + subjectId + '&sort=' + sort;
        dialogSubjectTitle.value = '选题';
        dialogSubjectShow.value = true;
    };

    provide('questionnaire_subject', subject);
    provide('questionnaire_addsubject', addSubject);
</script>