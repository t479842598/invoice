<template>
    <splitpanes class="default-theme" style="height:inherit;">
        <pane :size="28" min-size="28" max-size="50" style="overflow:auto; background:#fff;">
            <div>
                <!--搜索组织架构-->
                <div v-if="showType == 0">
                    <el-input v-model="searchKey" clearable style="width:200px;margin-right:12px;vertical-align:middle;"
                        placeholder="输入关键字搜索"></el-input>
                    <el-button type="primary" style="vertical-align:middle;"
                        @click="isSearch = true; loadTreeNode({ level: 0 })">搜索</el-button>
                </div>
                <!--搜索工作组-->
                <div v-if="showType == 1">
                    <el-input v-model="wgSearchKey" clearable
                        style="width:200px;margin-right:12px;vertical-align:middle;" placeholder="输入关键字搜索"></el-input>
                    <el-button type="primary" style="vertical-align:middle;"
                        @click="isSearch = true; wgLoadTreeNode({ level: 0 })">搜索</el-button>
                </div>
            </div>
            <el-tabs v-model="showType" @tab-click="tabClick" style="height: calc(100% - 45px)">
                <el-tab-pane label="组织架构" name="0" style="height:100%">
                    <template #label>
                        <el-icon class="roadui_main_tabsvg">
                            <OfficeBuilding />
                        </el-icon>组织架构
                    </template>
                    <el-tree :data="treeData" :props="defaultProps" node-key="id" :load="loadTreeNode" lazy
                        ref="orgTreeRef" highlight-current :default-expanded-keys="defaultExpandedKeys"
                        style="padding-right: 14px; height: 100%; overflow: auto; " :expand-on-click-node="false"
                        @node-click="handleNodeClick">
                        <template #default="scope">
                            <div class="roadui_treenode">
                                <el-icon v-if="!scope.node.isLeaf" class="roadui_main_tabico">
                                    <folder />
                                </el-icon>
                                <el-icon v-else-if="scope.data.type === 4 || scope.data.type === 5"
                                    class="roadui_main_tabico">
                                    <user />
                                </el-icon>
                                <el-icon v-else class="roadui_main_tabico">
                                    <document />
                                </el-icon>
                                <span>{{ scope.node.label }}</span><span v-if="scope.data.status === 1"
                                    class="roadui_note" style="margin-left:3px">[冻结]</span><span
                                    v-if="scope.data.type === 5" class="roadui_note" style="margin-left:3px">{{
                                        utils.replaceWildcard('{<partTime>}') }}</span>
                            </div>
                        </template>
                    </el-tree>
                </el-tab-pane>
                <el-tab-pane label="工作组" name="1" style="height:100%">
                    <template #label>
                        <el-icon class="roadui_main_tabsvg">
                            <Collection />
                        </el-icon>工作组
                    </template>
                    <el-tree :data="wgTreeData" :props="defaultProps" node-key="id" :load="wgLoadTreeNode" lazy
                        ref="wgTreeRef" highlight-current :default-expanded-keys="wgDefaultExpandedKeys"
                        style="padding-right: 14px; height: 100%; overflow: auto;" :expand-on-click-node="false"
                        @node-click="handleNodeClick">
                        <template #default="scope">
                            <div class="roadui_treenode">
                                <el-icon v-if="!scope.node.isLeaf" class="roadui_main_tabico">
                                    <Folder />
                                </el-icon>
                                <el-icon v-else-if="scope.data.type === 4 || scope.data.type === 5"
                                    class="roadui_main_tabico">
                                    <user />
                                </el-icon>
                                <el-icon v-else class="roadui_main_tabico">
                                    <Folder />
                                </el-icon>
                                <span>{{ scope.node.label }}</span><span v-if="scope.data.status === 1"
                                    class="roadui_note" style="margin-left:3px">[冻结]</span><span
                                    v-if="scope.data.type === 5" class="roadui_note" style="margin-left:3px">{{
                                        utils.replaceWildcard('{<partTime>}') }}</span>
                            </div>
                        </template>
                    </el-tree>
                </el-tab-pane>
            </el-tabs>
        </pane>
        <pane :size="72" style="background: #fff; overflow: auto; padding-left: 5px;">
            <component v-if="utils.isDef(componentPage)" :is="componentPage" :query="componentQuery" />
            <div v-else>
                <el-empty description="请在左边选择要操作的组织" />
            </div>
        </pane>
    </splitpanes>
</template>

<script setup>
//import Empty from './empty.vue';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import Organize from './organize.vue';
import OrgUser from './user.vue';
import OrgWorkgroup from './workgroup.vue';
import OrgSetMenu from './setmenu.vue';
import OrgShowMenu from './showmenu.vue';
import { ref, shallowRef, inject, provide } from 'vue';
const ajax = inject('ajax');
const utils = inject('utils');
const qs = inject('qs');
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const componentPage = shallowRef(null);
const componentQuery = ref('');
const butDisabled = ref(false);
const orgTreeRef = ref(null);
const treeData = ref([]);
const searchKey = ref('');
const isSearch = ref(false);//标记是否是点的搜索按钮
const defaultExpandedKeys = ref([]);
const defaultProps = { children: 'children', label: 'title', isLeaf: 'isLeaf' };
const showType = ref('0');//显示类型0：组织架构 1：工作组
//加载树
const loadTreeNode = (node, resolve) => {
    //如果是首次加载
    if (node.level === 0 || isSearch.value) {
        ajax.post('/Organize/GetTree?srcorgid=' + sobInfo.value.id, qs.stringify({ selecttype: "unit,dept,station,user,workgroup", keyword: searchKey.value })).then((res) => {
            if (isSearch.value && utils.length(searchKey.value) > 0) {
                //如果是搜索，加上根节点标题
                const searchRootNode = {
                    id: utils.emptyLong + '',
                    parentId: '0',
                    title: res.data.length === 0 ? '未搜索到与“' + searchKey.value + '”相关的结果' : '搜索“' + searchKey.value + '”的结果',
                    type: '-1',
                    checkable: false,
                    disableCheckbox: true,
                    selectable: false,
                    isLeaf: res.data.length === 0,
                    children: res.data
                };
                treeData.value = [searchRootNode];
                isSearch.value = false;
                defaultExpandedKeys.value = [utils.emptyLong + ''];
            } else {
                treeData.value = res.data;
                isSearch.value = false;
                if (res.data.length > 0) {
                    defaultExpandedKeys.value = [res.data[0]['id']];
                }
            }
        }).catch(() => { });
    } else {
        //二次加载
        if (utils.isUndef(node.data)) {
            return;
        }
        if (utils.length(node.data.children) > 0) {
            resolve(node.data.children);
            return;
        }
        ajax.post('/Organize/GetTreeChilds?parentid=' + node.data.id).then((res) => {
            resolve(res.data);
        }).catch(() => { });
    }
};
//更新节点,id：要刷新的节点id，expandedId：刷新后展开节点的id
const updateTreeNode = (id, expandedId) => {
    if (utils.length(id) === 0) {
        return;
    }
    ajax.post('/Organize/GetTreeChilds?parentid=' + id).then((res) => {
        orgTreeRef.value.updateKeyChildren(id, res.data);
        if (utils.length(expandedId) > 0) {
            defaultExpandedKeys.value.push(expandedId);
        }
    }).catch(() => { });
};
//树点击
const handleNodeClick = (data) => {
    openPage(data, '');
};
//得到树节点数据
const getTreeNode = (id) => {
    return orgTreeRef.value.getNode(id);
};
//打开对应的页面;data：组织节点数据 query：参数
//data.type -2查看菜单授权 -1打开空页面 0设置菜单 1单位 2部门 3岗位 4人员 5兼职人员 6工作组
const openPage = (data, query) => {
    const dataType = data.type + '';
    switch (dataType) {
        case '-1':
            componentPage.value = null;
            componentQuery.value = query;
            break;
        case '-2':
            componentPage.value = OrgShowMenu;
            componentQuery.value = query;
            break;
        case '0':
            componentPage.value = OrgSetMenu;
            componentQuery.value = query;
            break;
        case '1':
        case '2':
        case '3':
            componentPage.value = Organize;
            componentQuery.value = utils.length(query) === 0 ? '?organizeid=' + data.id + '&organizetype=' + data.type : query;
            break;
        case '4':
        case '5':
            componentPage.value = OrgUser;
            componentQuery.value = utils.length(query) === 0 ? '?userid=' + data.id + '&organizeid=' + data.parentId + '&organizetype=' + data.type : query;
            break;
        case '6':
            componentPage.value = OrgWorkgroup;
            componentQuery.value = utils.length(query) === 0 ? '?workgroupid=' + data.id : query;
            break;
    }
}
//标签点击
const tabClick = (tab) => {
    showType.value = tab.index;
};

//工作组
const wgSearchKey = ref('');//搜索关键字
const wgTreeRef = ref(null);
const wgTreeData = ref([]);
const wgDefaultExpandedKeys = ref([]);
//加载工作组树
const wgLoadTreeNode = (node, resolve) => {
    //如果是首次加载
    if (node.level === 0 || isSearch.value) {
        ajax.post('/Workgroup/GetTree', qs.stringify({ selecttype: "unit,dept,station,user,workgroup", keyword: wgSearchKey.value })).then((res) => {
            if (isSearch.value && utils.length(wgSearchKey.value) > 0) {
                //如果是搜索，加上根节点标题
                const searchRootNode = {
                    id: utils.emptyLong + '',
                    parentId: '0',
                    title: res.data.length === 0 ? '未搜索到与“' + wgSearchKey.value + '”相关的结果' : '搜索“' + wgSearchKey.value + '”的结果',
                    type: '-1',
                    checkable: false,
                    disableCheckbox: true,
                    selectable: false,
                    isLeaf: res.data.length === 0,
                    children: res.data
                };
                wgTreeData.value = [searchRootNode];
                isSearch.value = false;
                wgDefaultExpandedKeys.value = [utils.emptyLong + ''];
            } else {
                wgTreeData.value = res.data;
                isSearch.value = false;
                if (res.data.length > 0) {
                    wgDefaultExpandedKeys.value = [res.data[0]['id']];
                }
            }
        }).catch(() => { });
    } else {
        //二次加载
        if (utils.isUndef(node.data)) {
            return;
        }
        if (utils.length(node.data.children) > 0) {
            resolve(node.data.children);
            return;
        }
        ajax.post('/Workgroup/GetChildTree?workgroupid=' + node.data.id).then((res) => {
            resolve(res.data);
        }).catch(() => { });
    }
};
//更新作组节点
const updateWgTreeNode = (id) => {
    ajax.post('/Workgroup/GetChildTree?workgroupid=' + id).then((res) => {
        wgTreeRef.value.updateKeyChildren(id, res.data);
    }).catch(() => { });
};

//注入方法供子页面调用
provide('openPage', openPage);
provide('updateTreeNode', updateTreeNode);
provide('updateWgTreeNode', updateWgTreeNode);
provide('getTreeNode', getTreeNode);
provide('showType', showType);
</script>