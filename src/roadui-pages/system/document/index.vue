<template>
    <div style="height:inherit;">
        <splitpanes class="default-theme" style="height:inherit;">
            <pane :size="16" min-size="16" max-size="50" style="overflow:auto; background:#fff;">
                <el-tree :data="treeData"
                         :props="defaultProps"
                         :load="loadTreeNode"
                         lazy
                         ref="dirTreeRef"
                         node-key="id"
                         highlight-current
                         :default-expanded-keys="defaultExpandedKeys"
                         :expand-on-click-node="false"
                         style="height:inherit; padding-right: 14px;"
                         @node-click="handleNodeClick">
                    <template #default="scope">
                        <div class="roadui_treenode">
                            <el-icon v-if="scope.node.isLeaf"><document /></el-icon>
                            <el-icon v-else><folder /></el-icon>
                            <span>{{scope.node.label}}</span>
                        </div>
                    </template>
                </el-tree>
            </pane>
            <pane :size="84" style="background: #fff; overflow: auto; padding-left: 5px;">
                <div>
                    <el-form :inline="true">
                        <el-form-item label="标题">
                            <el-input v-model="formData.title" placeholder="文档标题" clearable style="width:120px" />
                        </el-form-item>
                        <el-form-item label="日期">
                            <el-date-picker v-model="formDataDateRange" style="width:200px;"
                                            type="daterange"
                                            value-format="YYYY-MM-DD"
                                            unlink-panels
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            :shortcuts="utils.dateShortucts" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" :disabled="butDisabled" @click="loadTableData(true)">查询</el-button>
                            <el-button type="primary" v-if="hasPublish" :disabled="butDisabled" @click="addDoc()">添加文档</el-button>
                            <el-button type="danger" v-if="hasPublish" :disabled="butDisabled" @click="delDoc(null)">删除</el-button>
                            <el-button type="primary" v-if="hasEdit" :disabled="butDisabled" @click="editDir()">编辑栏目</el-button>
                            <el-button type="primary" v-if="hasEdit" :disabled="butDisabled" @click="addDir()">添加子栏目</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div>
                    <el-table :data="tableData"
                              v-loading="loading"
                              :stripe="pager.tableStripe"
                              :border="pager.tableBorder"
                              style="width:100%"
                              :highlight-current-row="pager.tableHighlightCurrentRow"
                              :default-sort="defaultOrder"
                              @selection-change="handleSelectionChange"
                              @sort-change="sortChange">
                        <el-table-column type="selection" width="45" />
                        <el-table-column prop="title" label="标题" show-overflow-tooltip sortable="custom">
                            <template #default="scope">
                                <el-tag v-if="scope.row.isRead==0" effect="dark" style="margin-right:8px;vertical-align:middle;">未读</el-tag>
                                <a class="roaduia" href="javascript:;" @click="viewDoc(scope.row)">{{scope.row.title}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="dirName" label="栏目" width="200" show-overflow-tooltip sortable="custom" />
                        <el-table-column prop="editUserName" label="发布人" width="140" sortable="custom" />
                        <el-table-column prop="editTime1" label="发布时间" width="150" sortable="custom" />
                        <el-table-column prop="docRank" label="文档等级" width="130" sortable="custom">
                            <template #default="scope">
                                <el-tag>{{utils.length(scope.row.docRank)>0?scope.row.docRank:'普通'}}</el-tag>
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
            </pane>
        </splitpanes>
        <!--编辑文档窗口-->
        <el-dialog v-model="dialogShow" :title="dialogTitle" align-center destroy-on-close width="1200px" draggable :close-on-click-modal="false">
            <el-form :model="editData" ref="ruleFormRef" :rules="rules" label-width="60px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="editData.title" placeholder="文档标题" />
                </el-form-item>
                <el-form-item label="附件" prop="files">
                    <el-selectfile v-model="editData.files" style="width:300px" />
                    <span style="margin-left:12px">来源</span>
                    <el-input style="margin-left:12px;width:180px;" v-model="editData.source" placeholder="" />
                    <span style="margin-left:12px">等级</span>
                    <el-select style="margin-left:12px;width:180px;" v-model="editData.docRank">
                        <el-option v-for="opt in docRankOptions" :key="opt.value" :value="opt.value" :label="opt.label"></el-option>
                    </el-select>
                    <span style="margin-left:12px">栏目</span>
                    <el-input style="margin-left:12px;width:180px;" v-model="dirName" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="contents">
                    <el-ckeditor v-model="editData.contents" :height="300" />
                </el-form-item>
                <el-form-item>
                    <el-button :disabled="butDisabled" @click="saveDoc(ruleFormRef)" type="primary">保存</el-button>
                    <el-button :disabled="butDisabled" @click="editData={};dialogShow=false">关闭</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--查看文档-->
        <el-dialog v-model="showDocDialog" :show-close="false" class="el-dialog__padding" align-center destroy-on-close width="1200px" draggable :close-on-click-modal="false">
            <template #header>
                <div>
                    <el-button type="info" @click="print1(showDocData.id)">打印</el-button>
                    <el-button type="primary" v-if="showDocData.isPublish" @click="viewEdit(showDocData.id)">编辑</el-button>
                    <el-button type="danger" v-if="showDocData.isPublish" @click="delDoc(showDocData.id)">删除</el-button>
                    <el-button @click="showDocData={};showDocDialog=false">关闭</el-button>
                </div>
            </template>
            <div>
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
                    <tr>
                        <td align="center" class="roadui_showdoc_title">{{showDocData.title}}</td>
                    </tr>
                    <tr>
                        <td align="center" class="roadui_showdoc_title1">
                            <el-space :size="20">
                                <span><span style="margin-right:12px">栏目</span>{{showDocData.dirName}}</span>
                                <span><span style="margin-right:12px">发布时间</span>{{utils.replaceTime(showDocData.editTime)}}</span>
                                <span><span style="margin-right:12px">发布人</span>{{showDocData.editUserName}}</span>
                                <span v-if="utils.length(showDocData.source)>0"><span style="margin-right:12px">来源</span>{{showDocData.source}}</span>
                                <span v-if="utils.length(showDocData.docRank)>0"><span style="margin-right:12px">等级</span>{{showDocData.docRank}}</span>
                            </el-space>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="roadui_showdoc_contents" v-html="showDocData.contents"></div>
                        </td>
                    </tr>
                    <tr v-if="utils.length(showDocData.files)>0">
                        <td class="roadui_showdoc_files">
                            附件：
                            <span style="margin-right:12px" v-for="(file,index) in showDocData.files" :key="file.id">
                                <el-link @click="utils.showFile(index_openmenu, file, sysConfig.SERVER_WEBADDRESS)">{{(++index)+'、'+file.name}}</el-link>
                            </span>
                        </td>
                    </tr>
                </table>
            </div>
        </el-dialog>
        <!--编辑栏目-->
        <el-dialog v-model="showDirDialog" :title="dirDialogTitle" align-center destroy-on-close width="700px" draggable :close-on-click-modal="false">
            <el-form :model="editDirData" ref="dirRuleFormRef" :rules="dirRules" label-width="80px">
                <el-form-item label="栏目名称" prop="name">
                    <el-input v-model="editDirData.name" />
                </el-form-item>
                <el-form-item label="管理人员" prop="manageUsers">
                    <el-selectorg v-model="editDirData.manageUsers" style="width:100%" placeholder="可以修改栏目和添加下级子栏目" />
                </el-form-item>
                <el-form-item label="发布人员" prop="publishUsers">
                    <el-selectorg v-model="editDirData.publishUsers" style="width:100%" placeholder="可以发布和修改该栏目文档" />
                </el-form-item>
                <el-form-item label="阅读人员" prop="readUsers">
                    <el-selectorg v-model="editDirData.readUsers" style="width:100%" placeholder="可以阅读查看该栏目文档，为空表示所有人员都可阅读。" />
                </el-form-item>
                <el-form-item v-if="!editDirData.add" label="排序" prop="sort">
                    <el-input-number :step="5" :min="0" v-model="editDirData.sort" />
                </el-form-item>
                <el-form-item>
                    <el-button :disabled="butDisabled" @click="saveDir(dirRuleFormRef)" type="primary">保存</el-button>
                    <el-button :disabled="butDisabled" type="danger" @click="delDir()">删除</el-button>
                    <el-button :disabled="butDisabled" @click="editDirData={};showDirDialog=false">关闭</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup>
    import { Splitpanes, Pane } from 'splitpanes';
    import 'splitpanes/dist/splitpanes.css';
    import { ref, inject } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const index_openmenu = inject('index_openmenu');
    const sysConfig = inject('config');
    const ElSelectfile = inject('ElSelectfile');
    const ElCkeditor = inject('ElCkeditor');
    const ElSelectorg = inject('ElSelectorg');

    //文档分类
    const dirName = ref('');//当前栏目名称
    const treeData = ref([]);
    const defaultExpandedKeys = ref([]);
    const defaultProps = { children: 'children', label: 'title', isLeaf: 'isLeaf' };
    const dirTreeRef = ref(null);
    //树点击，加载分类下的应用列表。
    const handleNodeClick = (data) => {
        formData.value['dirId'] = data.id;
        dirName.value = data['title'];
        loadTableData(false);
    };
    //加载分类树
    const loadTreeNode = (node, resolve) => {
        //如果是首次加载
        if (node.level === 0) {
            ajax.post('/Doc/GetDirTreeJson').then((res) => {
                treeData.value = res.data;
                if (utils.length(res.data) > 0) {
                    defaultExpandedKeys.value.push(res.data[0].id);
                    formData.value['dirId'] = res.data[0].id;
                    dirName.value = res.data[0]['title'];
                }
                loadTableData(false);
            }).catch(() => { });
        } else {
            //二次加载
            if (utils.length(node.data.children) > 0) {
                resolve(node.data.children);
                return;
            }
            ajax.post('/Doc/GetDirTreeChildsJson?parentid=' + node.data.id).then((res) => {
                resolve(res.data);
            }).catch(() => { });
        }
    };
    //更新节点
    const updateTreeNode = (id) => {
        ajax.post('/Doc/GetDirTreeChildsJson?parentid=' + id).then((res) => {
            dirTreeRef.value.updateKeyChildren(id, res.data);
        }).catch(() => { });
    };

    //文档列表
    const hasEdit = ref(false); //是否有栏目编辑权限
    const hasPublish = ref(false); //是否有栏目发布权限
    const loading = ref(false);//数据加载状态
    const butDisabled = ref(false);
    const tableData = ref([]);
    let selectRows = [];//保存选择的行
    const formData = ref({});
    const formDataDateRange = ref([]);
    const defaultOrder = ref({});
    const pager = ref(utils.getPager(defaultOrder.value));
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
    //选择行
    const handleSelectionChange = (val) => {
        selectRows = val;
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
        ajax.post('/Doc/GetList', qs.stringify(formData.value)).then((res) => {
            if (!res.success) {
                let msg = '';
                switch (res.code) {
                    case 1:
                        msg = '未找到栏目！';
                        break;
                }
                utils.msg(msg, false);
                return;
            }
            tableData.value = res.data.rows;
            pager.value.total = res.data.total;
            hasEdit.value = res.data.hasEdit;
            hasPublish.value = res.data.hasPublish;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; loading.value = false; });
    };

    //载入文档等级选项
    const docRankOptions = ref([]);
    const loadOptions = (id) => {
        if (utils.length(docRankOptions.value) === 0) {
            const params = [{ id: 'system_doc_rank', key: 'docRank', children: false, valueField: 'value' },];
            ajax.post('/Dictionary/GetMultipleOptions', qs.stringify({ json: JSON.stringify(params) })).then((res) => {
                docRankOptions.value = res.data['docRank'];
                editDoc(id);
            }).catch(() => { });
        } else {
            editDoc(id);
        }
    }

    //编辑文档
    const dialogShow = ref(false);
    const dialogTitle = ref('');
    const editData = ref({});
    const ruleFormRef = ref(null);
    const rules = { title: [{ required: true, message: '请输入文档标题', trigger: 'blur', },], };
    //添加文档
    const addDoc = (id) => {
        loadOptions(id);
    };
    //编辑文档
    const editDoc = (id) => {
        if (utils.length(id) > 0) {
            ajax.post('/Doc/GetDoc?docid=' + id).then((res) => {
                if (res.code == 1) {
                    utils.msg('加载文档数据失败！', false);
                    return;
                }
                editData.value = res.data;
                if (res.data.docRank == -1) {
                    editData.value.docRank = '';
                } else {
                    editData.value.docRank = editData.value.docRank + '';
                }
                dialogTitle.value = '编辑文档';
                dialogShow.value = true;
            }).catch(() => { });
        } else {
            dialogTitle.value = '添加文档';
            dialogShow.value = true;
        }
    };
    //保存文档
    const saveDoc = async (formEl) => {
        if (!formEl) {
            return;
        }
        await formEl.validate((valid) => {
            if (valid) {
                butDisabled.value = true;
                editData.value['dirId'] = formData.value['dirId'];
                ajax.post('/Doc/SaveDoc', qs.stringify(editData.value)).then((res) => {
                    let msg = res.msg;
                    if (utils.length(msg) === 0) {
                        switch (res.code) {
                            case 0:
                                msg = '保存成功！';
                                break;
                            case 1:
                                msg = '文档栏目，标题，内容不能为空！';
                                break;
                            case 2:
                                msg = '您没有栏目发布文档权限！';
                                break;
                            default:
                                msg = '保存失败！';
                                break;
                        }
                    }
                    utils.msg(msg, res.success);
                    butDisabled.value = false;
                    if (res.success) {
                        dialogShow.value = false;
                        editData.value = {};
                        loadTableData(false);
                    }
                }).catch(() => { butDisabled.value = false; });
            }
        });
    };
    //查看文档
    const showDocData = ref({});
    const showDocDialog = ref(false);
    const viewDoc = (doc) => {
        ajax.post('/Doc/GetDocShow?docid=' + doc.id).then((res) => {
            if (res.code == 1) {
                utils.msg('加载文档数据失败！', false);
                return;
            }
            if (res.code == 2) {
                utils.msg('您无权查看该文档！', false);
                return;
            }
            showDocData.value = res.data;
            showDocDialog.value = true;
            return;
        }).catch(() => { });
    };
    //查看时编辑
    const viewEdit = (id) => {
        showDocDialog.value = false;
        loadOptions(id);
    };
    //删除文档
    const delDoc = (id) => {
        const ids = utils.isDef(id) ? id : utils.getArrayValues(selectRows, 'id').join(',');
        if (utils.length(ids) === 0) {
            utils.msg('请选择要删除的文档！', 'error');
            return;
        }
        console.log(ids)
        utils.confirm('您确定要删除文档吗？', () => {
            butDisabled.value = true;
            ajax.post('/Doc/DeleteDoc', qs.stringify({ id: ids })).then((res) => {
                let msg = res.msg;
                if (utils.length(msg) === 0) {
                    if (res.success) {
                        msg = "删除成功！";
                    } else {
                        if (res.code == 1) {
                            msg = "未找到文档！";
                        } else if (res.code == 2) {
                            msg = "没有权限删除文档！";
                        } else {
                            msg = "删除失败！";
                        }
                    }
                    //msg = res.success ? "删除成功！" : res.code == 1 ? "未找到文档！" : "删除失败！";
                }
                utils.msg(msg, res.success);
                butDisabled.value = false;
                if (res.success) {
                    showDocDialog.value = false;
                    loadTableData(false);
                }
            }).catch(() => { });
        });
    };
    //打印
    const print1 = (id) => {
        utils.open('?loadurl=' + encodeURIComponent('/system/document/print?docid=' + id), 1000, 600, '打印文档');
    };

    //编辑栏目
    const editDirData = ref({});
    const dirDialogTitle = ref('');
    const showDirDialog = ref(false);
    const dirRuleFormRef = ref(null);
    const dirRules = {
        name: [{ required: true, message: '请输入栏目名称', trigger: 'blur', },],
        manageUsers: [{ required: true, message: '请选择管理人员', trigger: 'blur', },],
        publishUsers: [{ required: true, message: '请选择发布人员', trigger: 'blur', },]
    };
    const editDir = () => {
        if (utils.length(formData.value['dirId']) === 0) {
            return;
        }
        butDisabled.value = true;
        ajax.post('/Doc/GetDir?dirid=' + formData.value['dirId']).then((res) => {
            if (utils.length(res.data) === 0) {
                utils.msg('请选择要编辑的栏目！', false);
                butDisabled.value = false;
                return;
            }
            editDirData.value = res.data;
            editDirData.value.add = false;
            dirDialogTitle.value = '编辑栏目 - ' + res.data.name;
            butDisabled.value = false;
            showDirDialog.value = true;
        }).catch(() => {
            butDisabled.value = false;
        });
    };
    //添加子栏目
    const addDir = () => {
        if (utils.length(formData.value['dirId']) === 0) {
            return;
        }
        editDirData.value = { add: true, parentId: formData.value['dirId'] };
        dirDialogTitle.value = '添加子栏目';
        showDirDialog.value = true;
    };
    //保存栏目
    const saveDir = async (formEl) => {
        if (editDirData.value.add) {
            saveAddDir(formEl);
            return;
        }
        if (!formEl) {
            return;
        }
        await formEl.validate((valid) => {
            if (valid) {
                butDisabled.value = true;
                ajax.post('/Doc/SaveDir', qs.stringify(editDirData.value)).then((res) => {
                    let msg = res.msg;
                    if (utils.length(msg) === 0) {
                        switch (res.code) {
                            case 0:
                                msg = '保存成功！';
                                break;
                            case 1:
                                msg = '数据验证错误！';
                                break;
                            case 2:
                                msg = '未找到该栏目！';
                                break;
                            case 3:
                                msg = '您没有栏目编辑权限！';
                                break;
                            default:
                                msg = '保存失败！';
                                break;
                        }
                    }
                    utils.msg(msg, res.success);
                    butDisabled.value = false;
                    if (res.success) {
                        showDirDialog.value = false;
                        if (editDirData.value.parentId <= utils.emptyLong) {
                            updateTreeNode(editDirData.value.id);
                        } else {
                            updateTreeNode(editDirData.value.parentId);
                        }
                        editDirData.value = {};
                    }
                }).catch(() => { butDisabled.value = false; });
            }
        });
    };
    //保存添加子栏目
    const saveAddDir = async (formEl) => {
        if (!formEl) {
            return;
        }
        await formEl.validate((valid) => {
            if (valid) {
                butDisabled.value = true;
                ajax.post('/Doc/SaveAddDir', qs.stringify(editDirData.value)).then((res) => {
                    let msg = res.msg;
                    if (utils.length(msg) === 0) {
                        switch (res.code) {
                            case 0:
                                msg = '保存成功！';
                                break;
                            case 1:
                                msg = '数据验证错误！';
                                break;
                            case 2:
                                msg = '您没有添加子栏目权限！';
                                break;
                            default:
                                msg = '保存失败！';
                                break;
                        }
                    }
                    utils.msg(msg, res.success);
                    butDisabled.value = false;
                    if (res.success) {
                        showDirDialog.value = false;
                        if (editDirData.value.parentId <= utils.emptyLong) {
                            updateTreeNode(editDirData.value.id);
                        } else {
                            updateTreeNode(editDirData.value.parentId);
                        }
                        editDirData.value = {};
                    }
                }).catch(() => { butDisabled.value = false; });
            }
        });
    };
    //删除栏目
    const delDir = () => {
        utils.confirm('您确定要删除该栏目吗？', () => {
            butDisabled.value = true;
            ajax.post('/Doc/DeleteDir', qs.stringify({ id: formData.value['dirId'] })).then((res) => {
                let msg = res.msg;
                if (utils.length(msg) === 0) {
                    switch (res.code) {
                        case 0:
                            msg = '删除成功！';
                            break;
                        case 1:
                            msg = '未找到栏目！';
                            break;
                        case 2:
                            msg = '没有栏目删除权限！';
                            break;
                        case 3:
                            msg = '该栏目下有文档，不能删除！';
                            break;
                        case 4:
                            msg = '不能删除根栏目！';
                            break;
                        default:
                            msg = '删除失败！';
                            break;
                    }
                }
                utils.msg(msg, res.success);
                butDisabled.value = false;
                if (res.success) {
                    showDirDialog.value = false;
                    if (editDirData.value.parentId <= utils.emptyLong) {
                        updateTreeNode(editDirData.value.id);
                    } else {
                        updateTreeNode(editDirData.value.parentId);
                    }
                    editDirData.value = {};
                }
            }).catch(() => { });
        });
    };
</script>