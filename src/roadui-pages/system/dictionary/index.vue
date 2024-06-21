<template>
    <div style="height:inherit;">
        <splitpanes class="default-theme" style="height:inherit;">
            <pane :size="20" min-size="20" max-size="50" style="overflow:auto; background:#fff;">
                <el-tree :data="treeData"
                         :props="defaultProps"
                         node-key="id"
                         :load="loadTreeNode"
                         lazy
                         ref="dictTreeRef"
                         highlight-current
                         :default-expanded-keys="defaultExpandedKeys"
                         style="height:inherit; padding-right: 14px;"
                         :expand-on-click-node="false"
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
            <pane :size="80" style="background: #fff; overflow: auto; padding-left: 5px;">
                <div v-if="utils.length(formData)>0&&formData.id>utils.emptyLong" style="width:750px; padding: 0 0 0 20px;">
                    <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="80px">
                        <el-form-item label="字典id" class="roadui_formfont">
                            {{formData.id}}
                        </el-form-item>
                        <el-form-item label="字典标题" prop="title">
                            <el-input v-model="formData.title" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="唯一代码" prop="code">
                            <el-input v-model="formData.code" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="字典值" prop="value">
                            <el-input v-model="formData.value" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="note">
                            <el-input v-model="formData.note" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="其他" prop="other">
                            <el-input v-model="formData.other" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-radio-group v-model="formData.status">
                                <el-radio :label="0">正常</el-radio>
                                <el-radio :label="1">作废</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button type="primary" :disabled="butDisabled" @click="clearable">清空</el-button>
                            <el-button type="primary" :disabled="butDisabled" @click="save(ruleFormRef,0)">保存</el-button>
                            <el-button type="primary" :disabled="butDisabled" @click="save(ruleFormRef,1)">保存为下级</el-button>
                            <el-button type="danger" :disabled="butDisabled" @click="remove">删除</el-button>
                            <el-button type="info" :disabled="butDisabled" @click="sortChilds">下级排序</el-button>
                            <el-button :disabled="butDisabled" @click="export1">导出</el-button>
                            <el-button :disabled="butDisabled" @click="import1">导入</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div v-else>
                    <el-empty description="请点击左边字典项进行操作" />
                </div>
            </pane>
        </splitpanes>
        <!--排序-->
        <el-dialog v-model="dialogShow" title="排序" destroy-on-close width="550px" align-center draggable :close-on-click-modal="false">
            <draggable :list="sortDicts" item-key="id" :animation="200" :group="{name:'menu',pull:true}" class="roadui_draggable_chosen">
                <template #item="{element}">
                    <div class="roadui_draggable_item">
                        <div>{{element.title}}</div>
                    </div>
                </template>
            </draggable>
            <template #footer>
                <span class="dialog-footer">
                    <el-button :disabled="butDisabled" type="primary" @click="saveSort">保存</el-button>
                    <el-button :disabled="butDisabled" @click="dialogShow=false">关闭</el-button>
                </span>
            </template>
        </el-dialog>
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
    import Draggable from 'vuedraggable';
    import { Splitpanes, Pane } from 'splitpanes';
    import 'splitpanes/dist/splitpanes.css';
    import { ref, onMounted, onUnmounted, inject } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const config = inject('config');
    const qs = inject('qs');

    onMounted(() => {
        //解决拖拽排序时会打开新页搜索问题。
        document.body.ondrop = function (event) {
            try {
                event.preventDefault();
                event.stopPropagation();
            } catch (e) { console.log(e) }
        }
    });
    onUnmounted(() => {
        document.body.ondrop = null;
    });

    //树
    const dictTreeRef = ref(null);
    const treeData = ref([]);
    const defaultExpandedKeys = ref([]);
    const defaultProps = { children: 'children', label: 'title', isLeaf: 'isLeaf' };

    //加载树
    const loadTreeNode = (node, resolve) => {
        //如果是首次加载
        if (node.level === 0) {
            ajax.post('/Dictionary/GetTreeJson').then((res) => {
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
    //树点击
    const handleNodeClick = (data) => {
        loadFormData(data.id);
    };
    //更新节点
    const updateTreeNode = (id) => {
        ajax.post('/Dictionary/GetTreeChildsJson?parentid=' + id).then((res) => {
            dictTreeRef.value.updateKeyChildren(id, res.data);
        }).catch(() => { });
    };

    //编辑
    const butDisabled = ref(false);
    const formData = ref({});
    const ruleFormRef = ref(null);
    const rules = {
        title: [{ required: true, message: '请输入字典标题', trigger: 'blur' }],
    };
    //树点击后加载字典数据
    const loadFormData = (id) => {
        butDisabled.value = true;
        ajax.post('/Dictionary/Get?dictid=' + id).then((res) => {
            if (res.code == -1) {
                utils.msg('未找到字典！', res.success);
                return;
            }
            formData.value = res.data;
            butDisabled.value = false;
        }).catch(() => { butDisabled.value = false; });
    };
    //清空
    const clearable = () => {
        formData.value = { 'id': formData.value['id'] || '', 'parentId': formData.value['parentId'] || '', 'status': 0 };
    };
    //保存 type:0保存 1保存为下级
    const save = async (formEl, type) => {
        if (!formEl) {
            return;
        }
        await formEl.validate((valid) => {
            if (valid) {
                utils.confirm('您确定要保存' + (type === 1 ? '为下级' : '') + '吗？', () => {
                    butDisabled.value = true;
                    ajax.post('/Dictionary/Save?dictid=' + (formData.value.id || '') + '&savetype=' + (type || 0).toString(), qs.stringify(formData.value)).then((res) => {
                        butDisabled.value = false;
                        let msg = res.msg;
                        if (utils.length(msg) === 0) {
                            if (res.success) {
                                msg = '保存成功！';
                            } else if (res.code == 1) {
                                msg = '数据验证错误！';
                            } else if (res.code == 2) {
                                msg = '唯一代码重复！';
                            } else {
                                msg = '保存失败！';
                            }
                        }
                        utils.msg(msg, res.success);
                        if (res.success) {
                            //刷新树节点
                            const treeNode = dictTreeRef.value.getNode(formData.value.id);
                            const isLeaf = utils.isDef(treeNode) && treeNode.isLeaf;
                            const refreshId = 1 === type && !isLeaf ? formData.value.id : formData.value.parentId;
                            updateTreeNode(refreshId);
                            if (isLeaf) {
                                //如果是在叶子节点保存了下级则展开叶子节点。
                                defaultExpandedKeys.value.push(formData.value.id);
                            }
                        }
                    }).catch(() => { butDisabled.value = false; });
                });
            }
        });
    };
    //删除
    const remove = () => {
        if (utils.length(formData.value.id) === 0) {
            utils.msg('请选择要删除的字典！', 'error');
            return;
        }
        utils.confirm('此操作将会删除该字典及其所有下级字典，您确定要删除吗？', () => {
            butDisabled.value = true;
            ajax.post('/Dictionary/Delete', qs.stringify({ dictid: formData.value.id })).then((res) => {
                let msg = res.msg;
                if (utils.length(msg) === 0) {
                    if (res.code == -1) {
                        msg = '未找到要删除的字典！';
                    } else if (res.code == 1) {
                        msg = '不能删除根节点！';
                    } else {
                        msg = res.success ? '删除成功！' : '删除失败！';
                    }
                }
                utils.msg(msg, res.success);
                if (res.success) {
                    //刷新树
                    const refreshId = formData.value.parentId;
                    updateTreeNode(refreshId);
                    formData.value = {};
                }
                butDisabled.value = false;
            }).catch(() => { butDisabled.value = false; });
        });
    };

    //下级排序
    const dialogShow = ref(false);
    const sortDicts = ref([]);
    //加载排序项
    const sortChilds = () => {
        butDisabled.value = true;
        ajax.post('/Dictionary/LoadChilds?dictid=' + formData.value.id).then((res) => {
            if (!res.success || utils.length(res.data) <= 1) {
                utils.msg(utils.length(res.data) === 0 ? '当前字典没有下级字典，勿需排序！' : '当前字典只有一个下级字典，勿需排序！', false);
                return;
            }
            sortDicts.value = res.data;
            dialogShow.value = true;
            butDisabled.value = false;
        }).catch(() => { butDisabled.value = false; });
    };
    //保存排序
    const saveSort = () => {
        let childs = [];
        for (let i = 0; i < sortDicts.value.length; i++) {
            childs.push(sortDicts.value[i].id);
        }
        butDisabled.value = true;
        ajax.post('/Dictionary/SaveSort?dictid=' + formData.value.id, qs.stringify({ dicts: childs.join(',') })).then((res) => {
            let msg = res.msg;
            if (utils.length(msg) === 0) {
                msg = res.success ? '保存成功！' : '保存失败！';
            }
            utils.msg(msg, res.success);
            if (res.success) {
                dialogShow.value = false;
                //刷新树
                const refreshId = formData.value.id;
                updateTreeNode(refreshId);
            }
            butDisabled.value = false;
        }).catch(() => { butDisabled.value = false; });
    };
    //导出
    const export1 = () => {
        if (utils.length(formData.value.id) === 0) {
            utils.alert('您没有选择要导出的字典！', '', '', false);
            return;
        }
        const url = config.SERVER_WEBADDRESS + '/Export/DictionaryExport?dictid=' + formData.value.id;
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
            ajax.post('/Dictionary/ImportDict', qs.stringify({ files: fileId })).then((res) => {
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
                    updateTreeNode(formData.value.id);//刷新
                }
            }).catch(() => { });
        } else if (uploadFile.status === 'error') {
            utils.msg('文件上传失败！', false);
        }
    };
</script>