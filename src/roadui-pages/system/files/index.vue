<template>
    <div style="height:inherit;">
        <splitpanes class="default-theme" style="height:inherit;">
            <pane :size="16" min-size="16" max-size="50" style="overflow:auto; background:#fff;">
                <el-tree :data="treeData" :props="defaultProps" node-key="id" ref="fileTreeRef" highlight-current
                    :default-expanded-keys="defaultExpandedKeys" style="height:inherit; padding-right: 14px;"
                    :expand-on-click-node="false" @node-click="handleNodeClick">
                    <template #default="scope">
                        <div class="roadui_treenode">
                            <component v-if="utils.length(scope.data.ico) > 0" :is="scope.data.ico"
                                class="roadui_main_tabico"></component>
                            <el-icon v-else>
                                <Folder />
                            </el-icon>
                            <span>{{ scope.node.label }}</span>
                        </div>
                    </template>
                </el-tree>
            </pane>
            <pane :size="84" style="background: #fff; overflow: auto; padding-left: 5px;">
                <div v-if="currentId === utils.emptyLong + ''">
                    <div class="roadui_toolbar">
                        <div>
                            <el-upload ref="uploadRef" style="display: inline-flex; margin: 0;"
                                :action="config.SERVER_WEBADDRESS + '/Files/SaveFiles'"
                                :headers="{ 'nroadflow-token': token }"
                                :data="{ filetype: '', path: getPath(), uploadtype: 2 }" with-credentials
                                :on-success="handleSuccess" :on-error="handleError" multiple :show-file-list="false">
                                <button type="button"><el-icon>
                                        <DocumentAdd />
                                    </el-icon>上传文件</button>
                            </el-upload>
                        </div>
                        <div><button @click="addFolder()" type="button"><el-icon>
                                    <FolderAdd />
                                </el-icon>新建文件夹</button></div>
                        <div><span>|</span></div>
                        <div><button @click="rename()" type="button"><el-icon>
                                    <EditPen />
                                </el-icon>重命名</button></div>
                        <div><button @click="moveto()" type="button"><el-icon>
                                    <Switch />
                                </el-icon>移动</button></div>
                        <div><button @click="share()" type="button"><el-icon>
                                    <Share />
                                </el-icon>分享</button></div>
                        <div><button @click="del()" type="button"><el-icon>
                                    <Delete />
                                </el-icon>删除</button></div>
                    </div>
                    <div>
                        <div style="margin:12px 0 8px 0;">
                            <div style="float:left;">
                                <span v-for="(dir, index) in currentDirs">
                                    <el-link @click="pathClick(index)">{{ dir.title }}</el-link>
                                    <el-icon v-if="dir !== currentDirs[currentDirs.length - 1]"
                                        style="font-size: 12px; margin:0 3px; vertical-align: -3px; color: var(--el-text-color-regular); ">
                                        <ArrowRight />
                                    </el-icon>
                                </span>
                            </div>
                            <div style="float:right;">
                                <el-input v-model="formData.name" size="small" placeholder="输入关键字搜索" clearable
                                    style="width:180px" />
                                <el-button type="primary" style="margin-left:12px;" size="small"
                                    @click="loadTableData(true)">搜索</el-button>
                            </div>
                            <div style="clear:both"></div>
                        </div>
                        <el-table :data="tableData" :stripe="pager.tableStripe" :border="pager.tableBorder"
                            style="width:100%" :highlight-current-row="pager.tableHighlightCurrentRow"
                            :default-sort="defaultOrder" @sort-change="sortChange"
                            @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="45" />
                            <el-table-column prop="name" label="名称" sortable="custom">
                                <template #default="scope">
                                    <a class="roaduia" href="javascript:;" @click="openFile(scope.row)">
                                        <el-icon v-if="scope.row.type === 0" class="roadui_main_tabico"
                                            style="vertical-align:middle">
                                            <Folder />
                                        </el-icon>
                                        <el-icon v-else class="roadui_main_tabico" style="vertical-align:middle">
                                            <Document />
                                        </el-icon>
                                        {{ scope.row.name }}
                                    </a>
                                </template>
                            </el-table-column>
                            <el-table-column prop="modifyTime" label="修改日期" width="150" sortable="custom" />
                            <el-table-column prop="type" label="类型" width="120" sortable="custom">
                                <template #default="scope">
                                    <span>{{ scope.row.type == 0 ? '文件夹' : scope.row.extName + '文件' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="size" label="大小" width="150" sortable="custom" />
                        </el-table>
                    </div>
                </div>
                <div v-else-if="currentId === 'share_my' || currentId === 'my_share'">
                    <component :is="componentPage" :query="componentQuery" />
                </div>
            </pane>
        </splitpanes>
        <!--移动窗口-->
        <el-dialog v-model="moveDialogShow" title="选择要移动到的文件夹" width="500px" class="el-dialog__padding1" align-center
            destroy-on-close draggable :close-on-click-modal="false">
            <el-tree :data="moveTreeData" :props="defaultProps" node-key="id" :load="loadDirTreeNode" lazy ref="moveTreeRef"
                highlight-current :default-expanded-keys="moveDefaultExpandedKeys"
                style="padding-right: 14px; height: 100%; overflow: auto; " :expand-on-click-node="false"
                @node-click="moveHandleNodeClick">
                <template #default="scope">
                    <div class="roadui_treenode">
                        <el-icon class="roadui_main_tabico">
                            <folder />
                        </el-icon>
                        <span>{{ scope.node.label }}</span><span v-if="scope.data.type === 5" class="roadui_note"
                            style="margin-left:3px">{{ utils.replaceWildcard('{<partTime>}') }}</span>
                    </div>
                </template>
            </el-tree>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="moveOk">确定</el-button>
                    <el-button @click="moveDialogShow = false;">取消</el-button>
                </span>
            </template>
        </el-dialog>
        <!--分享窗口-->
        <el-dialog v-model="shareDialogShow" title="文件分享" width="600px" class="el-dialog__padding1" align-center
            destroy-on-close draggable :close-on-click-modal="false">
            <el-form :model="shareFormData" ref="shareFormRef" label-position="top" :rules="shareRules" label-width="80px">
                <el-form-item label="接收人员" prop="toUserId">
                    <el-selectorg v-model="shareFormData.toUserId" clearable style="width:100%" />
                </el-form-item>
                <el-form-item label="过期时间" prop="expireTime">
                    <el-date-picker v-model="shareFormData.expireTime" value-format="YYYY-MM-DD HH:mm" type="datetime"
                        placeholder="为空表示不过期" style="width:100%" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="shareOk(shareFormRef)">确定</el-button>
                    <el-button @click="shareDialogShow = false;">取消</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import shareMy from './sharemy.vue';
import myShare from './myshare.vue';
import { ref, shallowRef, computed, onMounted, inject } from 'vue';
import { ElMessageBox } from 'element-plus';
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
const qs = inject('qs');
const index_openmenu = inject('index_openmenu');
const token = utils.getToken();
const currentId = ref(utils.emptyLong + '');//当前显示类型，用于控件显示文件列表还是分享的列表
const currentDirs = ref([{ title: '我的文件', dir: '' }]);//当前目录及所有上级目录
const componentPage = shallowRef(null);
const componentQuery = ref('');
onMounted(() => {
    loadTableData(false);
});
//树
const fileTreeRef = ref(null);
const treeData = ref([
    {
        id: utils.emptyLong + '',
        parentId: '0',
        title: '我的文件',
        ico: 'Folder',
        titleEn: '',
        titleTw: '',
        isLeaf: true
    },
    {
        id: 'share_my',
        parentId: '0',
        title: '分享给我的文件',
        ico: 'Wallet',
        titleEn: '',
        titleTw: '',
        isLeaf: true
    },
    {
        id: 'my_share',
        parentId: '0',
        title: '我分享的文件',
        ico: 'FolderChecked',
        titleEn: '',
        titleTw: '',
        isLeaf: true
    },

]);
const defaultExpandedKeys = ref([]);
const defaultProps = { children: 'children', label: 'title', isLeaf: 'isLeaf' };

//树点击
const handleNodeClick = (data) => {
    if (data.id === utils.emptyLong + '') {
        //我的文件
        currentDirs.value = [{ title: '我的文件', dir: '' }];
        loadTableData(false);
    } else if (data.id === 'share_my') {
        //分享给我的文件
        componentPage.value = shareMy;
    } else if (data.id === 'my_share') {
        //我分享的文件
        componentPage.value = myShare;
    }
    currentId.value = data.id;
};

//路径上点击
const pathClick = (index) => {
    let newDirs = [];
    for (let i = 0; i < currentDirs.value.length; i++) {
        if (i > index) {
            break;
        }
        newDirs.push(currentDirs.value[i]);
    }
    currentDirs.value = newDirs;
    loadTableData(false);
};

//列表上目录点击
const listClick = (name) => {
    currentDirs.value.push({ title: name, dir: name });
    loadTableData(false);
};

//得到当前路径字符串
const getPath = () => {
    let dirs = [];
    for (let i = 0; i < currentDirs.value.length; i++) {
        if (currentDirs.value[i].dir === '') {
            continue;
        }
        dirs.push(currentDirs.value[i].dir);
    }
    return dirs.join('/');
};

//更新节点
const updateTreeNode = (id) => {
    ajax.post('/File/GetTreeChildsJson?parentid=' + id).then((res) => {
        fileTreeRef.value.updateKeyChildren(id, res.data);
    }).catch(() => { });
};

//加载列表数据
const butDisabled = ref(false);
const loading = ref(false);//数据加载状态
const formData = ref({});
const tableData = ref([]);
let selectRows = [];//保存选择的行
const defaultOrder = ref({ prop: 'name', order: 'ascending' });
const pager = ref(utils.getPager(defaultOrder.value));
//选择行
const handleSelectionChange = (val) => {
    selectRows = val;
};
//排序
const sortChange = (order) => {
    pager.value.order = utils.getOrder(order);
    loadTableData(false);
};
//加载列表
const loadTableData = (isQuery) => {
    if (isQuery) {
        pager.value.number = 1;
    }
    loading.value = true;
    butDisabled.value = true;
    formData.value.size = pager.value.size;
    formData.value.number = pager.value.number;
    formData.value.order = pager.value.order;
    formData.value.path = getPath();
    ajax.post('/File/GetUserList', qs.stringify(formData.value)).then((res) => {
        tableData.value = res.data;
        pager.value.total = res.data.length;
        butDisabled.value = false;
        loading.value = false;
    }).catch(() => { butDisabled.value = false; });
};
//打开文件或目录
const openFile = (file) => {
    if (file.type === 0) {
        listClick(file.name);
    } else {
        utils.showFile(index_openmenu, { name: file.name, id: file.id }, config.SERVER_WEBADDRESS, false);
    }
};

//上传文件
//文件上传成功
const handleSuccess = (_, uploadFiles) => {
    const response = uploadFiles.response;
    if (response.code === 0) {
        loadTableData(false);
    } else if (response.code === 401 || response.code === 3) {
        //登录失效
        utils.msg('未找到用户登录信息！', false);
    } else if (response.code === 2) {
        utils.msg('不允许上传的文件类型！', false);
    }
};
//文件上传失败
const handleError = () => {
    utils.msg('文件上传失败！', false);
};

//新建文件夹
const addFolder = () => {
    ElMessageBox.prompt('请输入文件夹名称', '新建文件夹', {
        inputPattern: /\S/,
        inputErrorMessage: '文件夹名称不能为空！',
    }).then(({ value }) => {
        butDisabled.value = true;
        loading.value = true;
        ajax.post('/File/CreateFolder', qs.stringify({ name: value, path: getPath() })).then((res) => {
            butDisabled.value = false;
            loading.value = false;
            if (res.code === 0) {
                loadTableData(false);
            } else if (res.code === 1) {
                utils.msg('目录名称为空！', false);
            } else if (res.code === 2) {
                utils.msg('权限错误！', false);
            } else if (res.code === 3) {
                utils.msg('目录已经存在！', false);
            } else if (res.code === 4) {
                utils.msg(res.msg, false);
            }
        }).catch(() => { butDisabled.value = false; loading.value = false; });
    }).catch(() => { });
};
//重命名
const rename = () => {
    if (selectRows.length === 0) {
        utils.msg('请选择要重命名的文件或文件夹！', false);
        return;
    }
    let f = selectRows[0];
    let typeName = f.type === 0 ? '文件夹' : '文件';
    ElMessageBox.prompt('请输入新的' + typeName + '名称', '重命名', {
        inputPattern: /\S/,
        inputValue: f.name,
        inputErrorMessage: typeName + '名称不能为空！',
    }).then(({ value }) => {
        butDisabled.value = true;
        loading.value = true;
        ajax.post('/File/Rename', qs.stringify({ name: value, type: f.type, id: f.id })).then((res) => {
            butDisabled.value = false;
            loading.value = false;
            if (res.code === 0) {
                loadTableData(false);
            } else if (res.code === 1) {
                utils.msg(typeName + '为空！', false);
            } else if (res.code === 2) {
                utils.msg('名称为空！', false);
            } else if (res.code === 3) {
                utils.msg('没有登录！', false);
            } else if (res.code === 4) {
                utils.msg('没有权限！', false);
            } else if (res.code === 5) {
                utils.msg(res.msg, false);
            }
        }).catch(() => { butDisabled.value = false; loading.value = false; });
    }).catch(() => { });
};
//移动
const moveDialogShow = ref(false);//是否显示移动窗口
const moveTreeData = ref([]);
const moveTreeRef = ref(null);
const moveDefaultExpandedKeys = ref([]);
const moveCurrentNode = ref(null);
//加载移动目录树
const loadDirTreeNode = (node, resolve) => {
    //如果是首次加载
    if (node.level === 0) {
        ajax.post('/File/GetTreeJson').then((res) => {
            const rootNode = {
                id: utils.emptyLong + '',
                parentId: '0',
                title: '我的文件',
                ico: 'Folder',
                titleEn: '',
                titleTw: '',
                isLeaf: true
            };
            if (res.data.length > 0) {
                rootNode['children'] = res.data;
                moveDefaultExpandedKeys.value.push(rootNode.id);
            }
            moveTreeData.value = [];
            moveTreeData.value.push(rootNode);
        }).catch(() => { });
    } else {
        //二次加载
        if (utils.length(node.data.children) > 0) {
            resolve(node.data.children);
            return;
        }
        let nodePath = moveTreeRef.value.getNodePath(node);
        let dirs = [];
        for (let i = 0; i < nodePath.length; i++) {
            if (nodePath[i].parentId == '0') {
                continue;
            }
            dirs.push(nodePath[i].title);
        }
        ajax.post('/File/GetTreeChildsJson', qs.stringify({ id: node.data.id, path: dirs.join('/') })).then((res) => {
            resolve(res.data);
        }).catch(() => { });
    }
};
//移动目录树点击
const moveHandleNodeClick = (data) => {
    moveCurrentNode.value = data;
};
const moveto = () => {
    if (selectRows.length === 0) {
        utils.msg('请选择要移动的文件或文件夹！', false);
        return;
    }
    moveDialogShow.value = true;
};
const moveOk = () => {
    if (utils.isUndef(moveCurrentNode.value)) {
        utils.msg('请选择要移动到的文件夹！', false);
        return;
    }
    let f = selectRows[0];
    let nodePath = moveTreeRef.value.getNodePath(moveCurrentNode.value);
    let dirs = [];
    for (let i = 0; i < nodePath.length; i++) {
        if (nodePath[i].parentId == '0') {
            continue;
        }
        dirs.push(nodePath[i].title);
    }
    ajax.post('/File/MoveTo', qs.stringify({ id: f.id, dir: dirs.join('/'), type: f.type })).then((res) => {
        butDisabled.value = false;
        loading.value = false;
        if (res.code === 0) {
            moveDialogShow.value = false;
            loadTableData(false);
        } else if (res.code === 1) {
            utils.msg('文件或文件夹为空！', false);
        } else if (res.code === 2) {
            utils.msg('要移动到的文件或文件夹为空！', false);
        } else if (res.code === 3) {
            utils.msg('没有登录！', false);
        } else if (res.code === 4) {
            utils.msg('没有权限！', false);
        } else if (res.code === 5) {
            utils.msg(res.msg, false);
        }
    }).catch(() => { butDisabled.value = false; loading.value = false; });
};

//删除
const del = () => {
    if (selectRows.length === 0) {
        utils.msg('请选择要删除的文件或文件夹！', false);
        return;
    }
    utils.confirm('您确定要删除吗？', () => {
        let data = [];
        for (let i = 0; i < selectRows.length; i++) {
            data.push({ id: selectRows[i].id, type: selectRows[i].type });
        }
        ajax.post('/File/Delete1', qs.stringify({ files: data, length: selectRows.length })).then((res) => {
            butDisabled.value = false;
            loading.value = false;
            if (res.code === 0) {
                loadTableData(false);
            } else if (res.code === 1) {
                utils.msg(res.msg, false);
            }
        }).catch(() => { butDisabled.value = false; loading.value = false; });
    });
};

//分享
const ElSelectorg = inject('ElSelectorg');//组织架构选择控件
const shareDialogShow = ref(false);
const shareFormData = ref({});
const shareFormRef = ref(null);
const shareRules = {
    toUserId: [{ required: true, message: '请选择接收人', trigger: 'blur' }],
};
const share = () => {
    let files = [];
    for (let i = 0; i < selectRows.length; i++) {
        if (selectRows[i].type == 1) {
            files.push(selectRows[i]);
        } else if (selectRows[i].type == 0) {
            utils.msg('文件夹不能分享！', false);
        }
    }
    if (files.length === 0) {
        utils.msg('请选择要分享的文件！', false);
        return;
    }
    shareDialogShow.value = true;
};
const shareOk = async (formEl) => {
    if (!formEl) {
        return;
    }
    await formEl.validate((valid) => {
        if (valid) {
            butDisabled.value = true;
            let files = [];
            for (let i = 0; i < selectRows.length; i++) {
                if (selectRows[i].type == 1) {
                    files.push(selectRows[i].id);
                }
            }
            shareFormData.value['files'] = files.join('|');
            ajax.post('/File/SaveShare', qs.stringify(shareFormData.value)).then((res) => {
                let msg = res.msg;
                if (utils.length(msg) === 0) {
                    if (res.success) {
                        msg = '分享成功！';
                    } else {
                        msg = '分享失败！';
                    }
                }
                utils.msg(msg, res.success);
                butDisabled.value = false;
                if (res.success) {
                    shareFormData.value = {};
                    shareDialogShow.value = false;
                }
            }).catch(() => { butDisabled.value = false; });
        }
    });
};
</script>