<template>
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
            <!--列表页面-->
            <div v-if="showDesign===0">
                <div>
                    <el-form :inline="true" @submit.native.prevent>
                        <el-form-item label="名称">
                            <el-input v-model="formData.name" placeholder="应用名称" clearable style="width:180px" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" :disabled="butDisabled" @click="loadTableData(true)">查询</el-button>
                            <el-button type="primary" :disabled="butDisabled" @click="edit(null)" v-if="formData.status==0">添加</el-button>
                            <el-button type="danger" :disabled="butDisabled" @click="del" v-if="formData.status==0">删除</el-button>
                            <el-button type="danger" :disabled="butDisabled" @click="thoroughDel" v-if="formData.status==2">彻底删除</el-button>
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
                        <el-table-column prop="name" label="应用名称" sortable="custom"></el-table-column>
                        <el-table-column prop="type" label="应用分类" sortable="custom" />
                        <el-table-column prop="createTime" label="创建时间" width="150" sortable="custom" />
                        <el-table-column prop="createUserId" label="创建人" width="120" sortable="custom">
                            <template #default="scope">
                                <el-tag>{{scope.row.createUserId}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="状态" width="100" sortable="custom">
                            <template #default="scope">
                                <el-tag effect="dark" :type="getStatusColor(scope.row.status)">{{getStatusTitle(scope.row.status)}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column width="100">
                            <template #header>
                                <span>操作</span>
                            </template>
                            <template #default="scope">
                                <el-button size="small" v-if="formData.status==0" :disabled="butDisabled" type="primary" @click="edit(scope.row)">编辑</el-button>
                                <el-button size="small" v-if="formData.status==2" :disabled="butDisabled" type="primary" @click="recovery(scope.row)">恢复</el-button>
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
            </div>
            <!--应用设计页面-->
            <div v-else>
                <component :is="designPage" :query="designQuery"></component>
            </div>
        </pane>
    </splitpanes>
</template>

<script setup>
    import { Splitpanes, Pane } from 'splitpanes';
    import 'splitpanes/dist/splitpanes.css';
    import Design from './design.vue';
    import { ref, inject, computed, shallowRef, provide } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const formData = ref({ status: 0 });//status 0表示查询 2表示查询已删除列表
    const butDisabled = ref(false);

    //得到状态标题 //状态 0设计中 1已发布 2已卸载 3已删除
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
                return 'info';
            case 1:
                return 'success';
            case 2:
                return 'danger';
            default:
                return '';
        }
    });

    //应用分类
    const treeData = ref([]);
    const defaultExpandedKeys = ref([]);
    //树点击，加载分类下的应用列表。
    const handleNodeClick = (data) => {
        formData.value.type = data.id;
        //如果是点的已删除流程节点
        if (data.id === utils.emptyLong + '') {
            formData.value.status = 2;
            loadTableData(true);
            return;
        }
        formData.value.status = 0;
        loadTableData(false);
    };
    const defaultProps = { children: 'children', label: 'title', isLeaf: 'isLeaf' };
    //加载分类树
    const loadTreeNode = (node, resolve) => {
        //如果是首次加载
        if (node.level === 0) {
            ajax.post('/Dictionary/GetTreeJson?root=system_applibrary_type').then((res) => {
                //添加一个已删除节点
                const deleteNode = {
                    id: utils.emptyLong + '',
                    parentId: '0',
                    title: '已删除应用',
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

    //应用列表
    const loading = ref(false);//数据加载状态
    const tableData = ref([]);
    let selectRows = [];//保存选择的行
    const defaultOrder = ref({ prop: 'createtime', order: 'descending' });
    const pager = ref(utils.getPager(defaultOrder.value));
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
        ajax.post('/Program/GetList', qs.stringify(formData.value)).then((res) => {
            tableData.value = res.data.rows;
            pager.value.total = res.data.total;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; });
    };
    //删除
    const del = () => {
        if (selectRows.length === 0) {
            utils.msg('您没有选择要删除的应用！', false);
            return;
        }
        utils.confirm('您确定要删除所选应用吗？', () => {
            butDisabled.value = true;
            ajax.post('/Program/Delete', qs.stringify({ ids: utils.getArrayValues(selectRows, 'id').join(',') })).then((res) => {
                utils.msg(res.success ? '删除成功！' : '删除失败！', res.success);
                butDisabled.value = false;
                selectRows = [];
                loadTableData(false);
            }).catch(() => { butDisabled.value = false; });
        });
    };
    //删除
    const thoroughDel = () => {
        if (selectRows.length === 0) {
            utils.msg('您没有选择要彻底删除的应用！', false);
            return;
        }
        utils.confirm('您确定要彻底删除所选应用吗？', () => {
            butDisabled.value = true;
            ajax.post('/Program/ThoroughDelete', qs.stringify({ ids: utils.getArrayValues(selectRows, 'id').join(',') })).then((res) => {
                butDisabled.value = false;
                utils.msg(res.success ? '彻底删除成功！' : '彻底删除失败！', res.success);
                selectRows = [];
                loadTableData(false);
            }).catch(() => { butDisabled.value = false; });
        });
    };

    //编辑
    const showDesign = ref(0);
    const designPage = shallowRef(null);
    const designQuery = ref('');
    const edit = (row) => {
        designPage.value = Design;
        designQuery.value = '?programid=' + (utils.isDef(row) ? row.id : '');
        showDesign.value = 1;
    };

    //恢复
    const recovery = (row) => {
        utils.confirm('您确定要恢复该应用吗？', () => {
            butDisabled.value = true;
            ajax.post('/Program/Recovery', qs.stringify({ id: row.id })).then((res) => {
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

    //设计页面调用返回列表
    const returnList = () => {
        showDesign.value = 0;
        loadTableData(false);
    };
    provide('program_returnlist', returnList);
</script>