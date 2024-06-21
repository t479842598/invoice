<template>
    <div style="height:inherit;">
        <splitpanes class="default-theme" style="height:inherit;">
            <pane :size="16" min-size="16" max-size="50" style="overflow:auto; background:#fff;">
                <el-tree :data="treeData"
                         :props="defaultProps"
                         :load="loadTreeNode"
                         lazy
                         node-key="id"
                         highlight-current
                         :default-expanded-keys="defaultExpandedKeys"
                         :expand-on-click-node="false"
                         style="height:inherit; padding-right: 14px;"
                         @node-click="handleNodeClick">
                    <template #default="scope">
                        <div class="roadui_treenode">
                            <component v-if="utils.length(scope.data.ico)>0" :is="scope.data.ico" />
                            <el-icon v-else-if="scope.node.isLeaf"><document /></el-icon>
                            <el-icon v-else><folder /></el-icon>
                            <span>{{scope.node.label}}</span>
                        </div>
                    </template>
                </el-tree>
            </pane>
            <pane :size="84" style="background: #fff; overflow: auto; padding-left: 5px;">
                <div>
                    <el-form :inline="true" @submit.native.prevent>
                        <el-form-item label="表单名称">
                            <el-input v-model="formData.name" clearable style="width:180px" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" :disabled="butDisabled" @click="loadTableData(true)">查询</el-button>
                            <el-button type="primary" :disabled="butDisabled" v-if="formData.status===0" @click="edit(null)">新建</el-button>
                            <el-button type="danger" :disabled="butDisabled" v-if="formData.status===0" @click="remove">删除</el-button>
                            <el-button :disabled="butDisabled" v-if="formData.status===0" @click="export1">导出</el-button>
                            <el-button :disabled="butDisabled" v-if="formData.status===0" @click="import1">导入</el-button>
                            <el-button type="danger" :disabled="butDisabled" v-if="formData.status===1" @click="thoroughRemove">彻底删除</el-button>
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
                              @sort-change="sortChange"
                              @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="45" />
                        <el-table-column prop="name" label="表单名称" show-overflow-tooltip sortable="custom" />
                        <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                        <el-table-column prop="createUserName" label="创建人" width="140" sortable="custom" />
                        <el-table-column prop="status" label="状态" width="100" sortable="custom">
                            <template #default="scope">
                                <el-tag :type="getStatusColor(scope.row.status)" effect="dark">{{getStatusTitle(scope.row.status)}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column width="90">
                            <template #header>
                                <span>操作</span>
                            </template>
                            <template #default="scope">
                                <el-button size="small" v-if="formData.status===0" :disabled="butDisabled" type="primary" @click="edit(scope.row)">编辑</el-button>
                                <el-button size="small" v-else :disabled="butDisabled" type="primary" @click="recovery(scope.row)">恢复</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
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
            </pane>
        </splitpanes>
        <!--导入-->
        <el-dialog v-model="dialogImportShow" title="导入" class="el-dialog__padding1" align-center destroy-on-close width="350px" draggable :close-on-click-modal="false">
            <el-upload :action="config.SERVER_WEBADDRESS+'/Files/SaveFiles'"
                       :show-file-list="false"
                       accept=".json"
                       :headers="{'nroadflow-token': utils.getToken()}"
                       with-credentials
                       :data="{filetype:'.json',uploadtype:0}"
                       :on-success="handleAvatarSuccess"
                       :before-upload="beforeAvatarUpload">
                <el-button type="primary">选择文件</el-button>
            </el-upload>
            <template #footer>
                <span class="dialog-footer">

                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
    import { Splitpanes, Pane } from 'splitpanes';
    import 'splitpanes/dist/splitpanes.css';
    import { ref, inject, computed } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const config = inject('config');
    const index_openmenu = inject('index_openmenu');//首页打开菜单方法

    //流程分类树
    const treeData = ref([]);
    const defaultExpandedKeys = ref([]);
    const defaultProps = { children: 'children', label: 'title', isLeaf: 'isLeaf' };
    //树点击，加载分类下的应用列表。
    const handleNodeClick = (data) => {
        formData.value.type = data.id;
        //如果是点的已删除流程节点
        if (data.id === utils.emptyLong + '') {
            formData.value.status = 1;
            loadTableData(true);
            return;
        }
        formData.value.status = 0;
        loadTableData(false);
    };
    //加载分类树
    const loadTreeNode = (node, resolve) => {
        //如果是首次加载
        if (node.level === 0) {
            ajax.post('/Dictionary/GetTreeJson?root=system_applibrary_formtype').then((res) => {
                //添加一个已删除节点
                const deleteNode = {
                    id: utils.emptyLong + '',
                    parentId: '0',
                    title: '已删除表单',
                    ico: 'Delete',
                    titleEn: '',
                    titleTw: '',
                    isLeaf: true
                };
                res.data.push(deleteNode);
                treeData.value = res.data;
                if (utils.length(res.data) > 0) {
                    defaultExpandedKeys.value.push(res.data[0].id);
                }
                loadTableData(false);
            }).catch(() => { });
        } else {
            //二次加载
            if (utils.length(node.data.children) > 0) {
                resolve(node.data.children);
                return;
            }
            ajax.post('/Dictionary/GetTreeChildsJson?parentid=' + node.data.id).then((res) => {
                resolve(res.data);
            }).catch(() => { });
        }
    };

    //表单列表
    const formData = ref({ status: 0, type: '' });
    const loading = ref(false);//数据加载状态
    const butDisabled = ref(false);
    const tableData = ref([]);
    let selectRows = [];//保存选择的行
    const defaultOrder = ref({ prop: 'createtime', order: 'ascending' });
    const pager = ref(utils.getPager(defaultOrder.value));
    //得到状态标题
    const getStatusTitle = computed(() => (status) => {
        switch (status) {
            case 0:
                return '设计中';
            case 1:
                return '已发布';
            case 2:
                return '已删除';
            default:
                return '未知';
        }
    });
    //得到状态标签颜色
    const getStatusColor = computed(() => (status) => {
        switch (status) {
            case 0:
                return '';//设计中
            case 1:
                return 'success';//已发布
            default:
                return 'info';
        }
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
    //排序改变
    const sortChange = (order) => {
        pager.value.order = utils.getOrder(order);
        loadTableData(false);
    };
    //加载列表 isQuery 点查询按钮为true，初始加载为false，为了区分点查询按钮时要将页number置为1。
    const loadTableData = (isQuery) => {
        if (isQuery) {
            pager.value.number = 1;
        }
        loading.value = true;
        butDisabled.value = true;
        formData.value.size = pager.value.size;
        formData.value.number = pager.value.number;
        formData.value.order = pager.value.order;
        ajax.post('/Form/GetList', qs.stringify(formData.value)).then((res) => {
            tableData.value = res.data.rows;
            pager.value.total = res.data.total;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; });
    };
    //编辑
    const edit = (row) => {
        const isNew = row === null;
        const menu = {
            id: 'formdesign_' + (isNew ? utils.emptyLong + '' : row.id),
            title: isNew ? '新建表单' : '设计表单-' + row.name,
            ico: 'Edit',
            openMode: 0,
            url: '/form/design?isnew=' + (isNew ? '1' : '0') + '&typeid=' + formData.value.type + '&formid=' + (isNew ? '' : row.id),
        };
        index_openmenu(menu);
    };
    //删除
    const remove = () => {
        if (selectRows.length === 0) {
            utils.msg('您没有选择要删除的表单！', false);
            return;
        }
        utils.confirm('您确定要删除所选表单吗？', () => {
            butDisabled.value = true;
            ajax.post('/Form/DeleteForm', qs.stringify({ ids: utils.getArrayValues(selectRows, 'id').join(',') })).then((res) => {
                utils.msg(res.success ? '删除成功！' : '删除失败！', res.success);
                butDisabled.value = false;
                if (res.success) {
                    selectRows = [];
                    loadTableData(false);
                }
            }).catch(() => { butDisabled.value = false; });
        });
    };
    //彻底删除
    const thoroughRemove = () => {
        if (selectRows.length === 0) {
            utils.msg('您没有选择要彻底删除的表单！', false);
            return;
        }
        utils.confirm('您确定要彻底删除所选表单吗？', () => {
            butDisabled.value = true;
            ajax.post('/Form/ThoroughDeleteForm', qs.stringify({ ids: utils.getArrayValues(selectRows, 'id').join(',') })).then((res) => {
                utils.msg(res.success ? '彻底删除成功！' : '彻底删除失败！', res.success);
                selectRows = [];
                loadTableData(false);
                butDisabled.value = false;
            }).catch(() => { butDisabled.value = false; });
        });
    };
    //恢复
    const recovery = (row) => {
        utils.confirm('您确定要恢复该表单吗？', () => {
            butDisabled.value = true;
            ajax.post('/Form/RecoveryForm', qs.stringify({ id: row.id })).then((res) => {
                if (res.success) {
                    utils.msg('恢复成功！', true);
                    loadTableData(false);
                } else {
                    utils.msg('恢复失败！', false);
                }
                butDisabled.value = false;
            }).catch(() => { butDisabled.value = false; });
        });
    };

    //导出
    const export1 = () => {
        let selectIds = utils.getArrayValues(selectRows, 'id');
        if (selectIds.length === 0) {
            utils.msg('您没有选择要导出的表单！', false);
            return;
        }
        const url = config.SERVER_WEBADDRESS + '/Export/FormExport?formid=' + selectIds.join(',');
        //utils.open(url, 300, 200, '导出');
        window.location.href = url;
    };
    //导入
    const dialogImportShow = ref(false);
    const import1 = () => {
        dialogImportShow.value = true;
    };
    //导入上传前检查文件格式。
    const beforeAvatarUpload = (rawFile) => {
        if (rawFile.type !== 'application/json') {
            utils.msg('要导入的文件必须是json格式文件!', false);
            return false;
        }
        return true;
    };
    //导入上传成功
    const handleAvatarSuccess = (response, uploadFile) => {
        if (uploadFile.status === 'success') {
            let code = response.code;
            if (code == 401) {
                //登录失效

            }
            if (code != 0) {
                utils.msg('文件上传失败！', false);
                return;
            }
            const fileId = response.data.id;
            ajax.post('/Form/ImportForm', qs.stringify({ files: fileId })).then((res) => {
                let msg = res.msg;
                if (utils.length(msg) === 0) {
                    if (res.success) {
                        msg = '导入成功！';
                    } else if (res.code == 1) {
                        msg = '要导入的文件不存在！';
                    } else if (res.code == 2) {
                        msg = '要导入的文件不是有效的json格式文件！';
                    } else {
                        msg = '导入失败！';
                    }
                }
                utils.msg(msg, res.success);
                if (res.success) {
                    dialogImportShow.value = false;
                    loadTableData(false);//刷新
                }
            }).catch(() => { });
        } else if (uploadFile.status === 'error') {
            utils.msg('文件上传失败！', false);
        }
    };
</script>