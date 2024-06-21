<template>
    <div style="height:inherit;">
        <splitpanes class="default-theme" style="height:inherit;">
            <pane :size="20" min-size="20" max-size="50" style="overflow:auto; background:#fff;">
                <el-tree :data="treeData"
                         :props="defaultProps"
                         node-key="id"
                         :load="loadTreeNode"
                         lazy
                         ref="menuTreeRef"
                         highlight-current
                         :default-expanded-keys="defaultExpandedKeys"
                         style="height:inherit; padding-right: 14px;"
                         :expand-on-click-node="false"
                         @node-click="handleNodeClick">
                    <template #default="scope">
                        <div class="roadui_treenode">
                            <el-icon v-if="utils.length(scope.data.ico)===0&&scope.node.isLeaf" class="roadui_main_tabico"><document /></el-icon>
                            <el-icon v-else-if="utils.length(scope.data.ico)===0&&!scope.node.isLeaf" class="roadui_main_tabico"><folder /></el-icon>
                            <component v-else :is="scope.data.ico" class="roadui_main_tabico" :style="utils.length(scope.data.icoColor)>0?'color:'+scope.data.icoColor:''"></component>
                            <span>{{scope.node.label}}</span>
                        </div>
                    </template>
                </el-tree>
            </pane>
            <pane :size="80" style="background: #fff; overflow: auto; padding-left: 5px;">
                <div v-if="utils.length(formData)>0&&formData.id>utils.emptyLong" style="width:700px; padding: 0 0 0 20px;">
                    <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="80px">
                        <el-form-item label="菜单id">
                            {{formData.id}}
                        </el-form-item>
                        <el-form-item label="菜单名称" prop="title">
                            <el-input v-model="formData.title" clearable />
                        </el-form-item>
                        <el-form-item label="关联应用">
                            <el-cascader v-model="formData.applibraryTypeId"
                                         :options="apptypeOptions"
                                         :props="{expandTrigger:'hover'}"
                                         @change="typeSelect"
                                         style="width:320px" clearable />
                            <el-select v-model="formData.applibraryId" @change="appSelect" clearable style="margin-left:12px;width:288px">
                                <el-option v-for="item in appOptions"
                                           :key="item.id"
                                           :label="item.label"
                                           :value="item.id" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="菜单图标">
                            <el-selectico v-model="formData.ico" clearable></el-selectico>
                        </el-form-item>
                        <el-form-item label="App图标">
                            <el-input v-model="formData.appIco" placeholder="填写uniapp中的图标名称" clearable style="width:222px" />
                        </el-form-item>
                        <el-form-item label="图标颜色">
                            <el-color-picker v-model="formData.icoColor" />
                        </el-form-item>
                        <el-form-item label="">
                            <el-button type="primary" :disabled="butDisabled" @click="clearable">清空</el-button>
                            <el-button type="primary" :disabled="butDisabled" @click="save(ruleFormRef,0)">保存</el-button>
                            <el-button type="primary" :disabled="butDisabled" @click="save(ruleFormRef,1)">保存为下级</el-button>
                            <el-button type="danger" :disabled="butDisabled" @click="remove">删除</el-button>
                            <el-button type="info" :disabled="butDisabled" @click="sortChilds">下级排序</el-button>
                            <el-button type="primary" v-if="formData.parentId<=utils.emptyLong" :disabled="butDisabled" @click="upMenuAuth">更新菜单权限</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div v-else>
                    <el-empty description="请点击左边菜单进行操作" />
                    <div style="text-align:center">
                        <el-button type="primary" :disabled="butDisabled" @click="upMenuAuth">更新菜单权限</el-button>
                    </div>
                </div>
            </pane>
        </splitpanes>
        <!--排序-->
        <el-dialog v-model="dialogShow" title="排序" align-center destroy-on-close width="550px" draggable :close-on-click-modal="false">
            <draggable :list="sortMenus" item-key="id" :animation="200" :group="{name:'menu',pull:true}" class="roadui_draggable_chosen">
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
    </div>
</template>

<script setup>
    import { Splitpanes, Pane } from 'splitpanes';
    import 'splitpanes/dist/splitpanes.css';
    import { ref, onMounted, onUnmounted, inject } from 'vue';
    import Draggable from 'vuedraggable';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const ElSelectico = inject('ElSelectico');

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
    const menuTreeRef = ref(null);
    const defaultExpandedKeys = ref([]);
    const treeData = ref([]);
    const defaultProps = { children: 'children', label: 'title', isLeaf: 'isLeaf' };
    //加载菜单树
    const loadTreeNode = (node, resolve) => {
        //如果是首次加载
        if (node.level === 0) {
            ajax.post('/Menu/GetTree?isall=0').then((res) => {
                treeData.value = res.data;
                if (utils.length(res.data) > 0) {
                    defaultExpandedKeys.value.push(res.data[0].id);
                }
            }).catch(() => { });
        } else {
            if (utils.length(node.data.children) > 0) {
                return resolve(node.data.children);
            }
            //二次加载
            ajax.post('/Menu/GetTreeChilds?parentid=' + (node.data.id || '')).then((res) => {
                return resolve(res.data);
            }).catch(() => { });
        }
    };
    //更新节点
    const updateTreeNode = (id) => {
        ajax.post('/Menu/GetTreeChilds?parentid=' + id).then((res) => {
            menuTreeRef.value.updateKeyChildren(id, res.data);
        }).catch(() => { });
    };
    //树点击
    const handleNodeClick = (data) => {
        loadMenuData(data);
    };

    //编辑
    const butDisabled = ref(false);
    const formData = ref({});
    const apptypeOptions = ref([]);//应用分类选项
    const appOptions = ref([]);//应用选项
    const ruleFormRef = ref(null);
    const rules = {
        title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
    };
    //载入分类
    const loadOptions = () => {
        if (utils.length(apptypeOptions.value) > 0) {
            return;//如果已加载，则不加载。
        }
        let params = [{ id: 'system_applibrary_type', key: 'type', children: true, valueField: 'id' }];
        ajax.post('/Dictionary/GetMultipleOptions', qs.stringify({ json: JSON.stringify(params) })).then((res) => {
            apptypeOptions.value = res.data['type'];
        }).catch(() => { });
    };
    //类型选择时载入类型下的应用
    const typeSelect = (val) => {
        if (utils.length(val) > 0) {
            ajax.post('/Applibrary/GetOptions?typeid=' + val[val.length - 1]).then((res) => {
                appOptions.value = res.data;
            }).catch(() => { });
        } else {
            formData.value.applibraryId = '';
            appOptions.value = [];
        }
    };
    //应用选择时设置标题
    const appSelect = (val) => {
        let op = utils.getArrayObj(appOptions.value, val, 'id');
        if (utils.isDef(op)) {
            formData.value.title = op.label;
        }
    };
    //加载菜单
    const loadMenuData = (menu) => {
        ajax.post('/Menu/Get?menuid=' + (menu.id || '')).then((res) => {
            if (!res.success) {
                utils.msg(res.code == -1 ? '未找到菜单！' : '加载数据失败！', res.success);
            } else {
                formData.value = res.data;
                //如果没有关联应用，置为空，不然会显示0
                formData.value.applibraryId = res.data.applibraryId == 0 ? '' : res.data.applibraryId + '';
                loadOptions();
                if (utils.length(res.data.applibraryTypeId) > 0) {
                    typeSelect(res.data.applibraryTypeId);
                }
            }
        }).catch(() => { });
    };
    //清空
    const clearable = () => {
        formData.value = { 'id': formData.value['id'] || '', 'parentId': formData.value['parentId'] };
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
                    if (utils.length(formData.value.applibraryId) === 0) {
                        delete formData.value.applibraryId; //如果值为空要删除这个属性，不然提交appLibraryId：""到后台保存会报错
                    }
                    ajax.post('/Menu/Save?menuid=' + (formData.value.id || '') + '&savetype=' + (type || 0), qs.stringify(formData.value)).then((res) => {
                        let msg = res.msg;
                        if (utils.length(msg) === 0) {
                            if (res.code == 1) {
                                msg = '数据验证错误！';
                            } else {
                                msg = res.success ? '保存成功！' : '保存错误！';
                            }
                        }
                        utils.msg(msg, res.success);
                        butDisabled.value = false;
                        if (res.success) {
                            //刷新树节点
                            const treeNode = menuTreeRef.value.getNode(formData.value.id);
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
            utils.msg('请选择要删除的菜单！', 'error');
            return;
        }
        utils.confirm('此操作将会删除该菜单及其所有下级菜单，您确定要删除吗？', () => {
            butDisabled.value = true;
            ajax.post('/Menu/Delete', qs.stringify({ menuid: formData.value.id })).then((res) => {
                let msg = res.msg;
                if (utils.length(msg) === 0) {
                    msg = res.success ? '删除成功！' : '删除失败！';
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
    //更新菜单权限
    const upMenuAuth = () => {
        butDisabled.value = true;
        ajax.post('/Menu/UpMenuAuth').then((res) => {
            utils.msg(res.success ? '更新成功！' : '更新失败！', res.success);
            butDisabled.value = false;
        }).catch(() => { butDisabled.value = false; });
    };

    //排序
    const dialogShow = ref(false);
    const sortMenus = ref([]);
    //加载要排序的下级菜单
    const sortChilds = () => {
        ajax.post('/Menu/LoadChilds?menuid=' + formData.value.id).then((res) => {
            if (!res.success || utils.length(res.data) <= 1) {
                utils.msg(utils.length(res.data) === 0 ? '当前菜单没有下级菜单，勿需排序！' : '当前菜单只有一个下级菜单，勿需排序！', false);
                dialogShow.value = false;
                return;
            }
            sortMenus.value = res.data;
            dialogShow.value = true;
        }).catch(() => { });
    };
    //保存排序
    const saveSort = () => {
        butDisabled.value = true;
        let childs = [];
        for (let i = 0; i < sortMenus.value.length; i++) {
            childs.push(sortMenus.value[i].id);
        }
        ajax.post('/Menu/SaveSort?menuid=' + formData.value.id, qs.stringify({ menus: childs.join(',') })).then((res) => {
            let msg = res.msg;
            if (utils.length(msg) === 0) {
                msg = res.success ? '保存排序成功！' : '保存排序失败！';
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

</script>