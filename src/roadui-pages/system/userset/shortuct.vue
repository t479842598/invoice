<template>
    <div class="roadui_setshortuctdiv">
        <div class="roadui_note" style="margin-bottom:12px;">提示：不能设置没有绑定应用的菜单为快捷菜单。已选择快捷菜单拖拽可排序。</div>
        <table cellpadding="0" cellspacing="0" border="0">
            <tbody>
                <tr>
                    <td style="width:50%" valign="top">
                        <div class="roadui_setshortuctlist">
                            <el-scrollbar style="height:inherit">
                                <el-tree :data="treeData"
                                         :props="defaultProps"
                                         node-key="id"
                                         ref="menuTreeRef"
                                         highlight-current
                                         style="height:100%;"
                                         :expand-on-click-node="false"
                                         @node-click="handleNodeClick">
                                    <template #default="scope">
                                        <div class="roadui_treenode">
                                            <el-icon v-if="utils.length(scope.data.ico)===0&&scope.node.isLeaf" class="roadui_main_tabico"><document /></el-icon>
                                            <el-icon v-else-if="utils.length(scope.data.ico)===0&&!scope.node.isLeaf" class="roadui_main_tabico"><folder /></el-icon>
                                            <component v-else :is="scope.data.ico" class="roadui_main_tabico"></component>
                                            <span>{{scope.node.label}}</span>
                                        </div>
                                    </template>
                                </el-tree>
                            </el-scrollbar>
                        </div>
                    </td>
                    <td class="roadui_setshortuctbuttd" valign="middle">
                        <div>
                            <div><el-button type="primary" :disabled="buttonDisabled" @click="add">添加</el-button></div>
                            <div><el-button type="danger" :disabled="buttonDisabled" @click="remove">移出</el-button></div>
                            <div><el-button type="primary" :disabled="buttonDisabled" @click="save">保存</el-button></div>
                        </div>
                    </td>
                    <td valign="top">
                        <div class="roadui_setshortuctlist">
                            <draggable :list="shortucts" item-key="id" :animation="200" :group="{name:'shortuct',pull:true}">
                                <template #item="{element}">
                                    <div :class="`roadui_draggable_item${element.id==currentSelectNode['id']?' roadui_draggable_itemhover':''}`" 
                                         @dblclick="selectClick(element);remove();"
                                         @click="selectClick(element)">
                                        <div>{{element.title}}</div>
                                    </div>
                                </template>
                            </draggable>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
    import Draggable from 'vuedraggable';
    import { ref, onMounted, onUnmounted, inject } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');

    onMounted(() => {
        //解决拖拽排序时会打开新页搜索问题。
        document.body.ondrop = function (event) {
            try {
                event.preventDefault();
                event.stopPropagation();
            } catch (e) { console.log(e) }
        }
        loadTreeNode();
    });
    onUnmounted(() => {
        document.body.ondrop = null;
    });

    //菜单树
    const treeData = ref([]);
    const defaultProps = { children: 'children', label: 'title', isLeaf: 'isLeaf' };
    let currentNode = null;//当前节点
    const currentSelectNode = ref({ id: '' });//已选择的当前节点
    const shortucts = ref([]);//已设置快捷菜单

    //加载菜单树
    const loadTreeNode = () => {
        ajax.post('/Menu/GetUserTree').then((res) => {
            treeData.value = res.data;
            loadData();
        }).catch(() => { });
    };
    //树点击
    const handleNodeClick = (data) => {
        currentNode = data;
    };
    //已选择列表点击
    const selectClick = (data) => {
        currentSelectNode.value = data;
    };
    //添加
    const add = () => {
        if (currentNode === null) {
            utils.msg('请选择要添加的菜单！', false);
            return;
        }
        if (utils.length(currentNode.url) === 0) {
            utils.msg('不能设置没有绑定应用的菜单为快捷菜单！', false);
            return;
        }
        if (utils.inArray(shortucts.value, currentNode.id, 'id')) {
            utils.msg('当前菜单已经选择了！', false);
            return;
        }
        shortucts.value.push({ id: currentNode.id, title: currentNode.title, title_en: currentNode.title_en, title_tw: currentNode.title_tw });
    };
    //移出
    const remove = () => {
        if (utils.length(currentSelectNode.value.id) === 0) {
            utils.msg('请选择要移出的快捷菜单！', false);
            return;
        }
        utils.removeArrayObj(shortucts.value, currentSelectNode.value.id, 'id');
        currentSelectNode.value = { id: '' };
    };
    //载入已设置的快捷菜单
    const buttonDisabled = ref(false);
    const loadData = () => {
        buttonDisabled.value = true;
        ajax.post('/User/GetShortuct').then((res) => {
            shortucts.value = res.data;
            buttonDisabled.value = false;
        }).catch(() => { buttonDisabled.value = false; });
    };
    //保存
    const save = () => {
        buttonDisabled.value = true;
        let ids = [];
        for (let i = 0; i < shortucts.value.length; i++) {
            ids.push(shortucts.value[i].id);
        }
        ajax.post('/User/SaveShortuct', qs.stringify({ ids: ids.join(',') })).then((res) => {
            utils.msg(res.success ? '保存成功！' : '保存失败！', res.success);
            buttonDisabled.value  = false;
        }).catch(() => { buttonDisabled.value = false; });
    }
</script>