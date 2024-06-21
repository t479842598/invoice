<template>
    <el-select v-if="status === 0" popper-class="roadui_selectorg" ref="selectOrgRef" :placeholder="placeholder"
        :multiple="multiple" :multiple-limit="multipleLimit" :disabled="disabled" @remove-tag="removeTag" @clear="clear"
        v-model="selectValue" clearable>
        <el-option value="" label="" style="height:0;padding:0;display:none;"></el-option>
        <el-option v-for="org in selectOrgs" :key="org.value" :value="org.value" :label="org.title"
            style="height:0;padding:0;display:none;"></el-option>
        <div>
            <el-tabs v-model="showType" @tab-click="tabClick" :before-leave="beforeLeave">
                <el-tab-pane v-if="showOrganize" label="组织架构" name="0">
                    <template #label>
                        <el-icon class="roadui_main_tabsvg">
                            <OfficeBuilding />
                        </el-icon>组织架构
                    </template>
                    <div style="height: 268px; overflow: auto;">
                        <div v-if="showSearch && isMobile" v-show="showType === '0'">
                            <el-input size="small" v-model="searchKey" placeholder="输入关键字搜索" clearable
                                class="roadui_selectorg_searchinput" style="width:60%;"></el-input>
                            <el-button size="small" type="primary" style="vertical-align:middle;"
                                @click="isSearch = true; loadTreeNode({ level: 0 })">搜索</el-button>
                        </div>
                        <el-tree :data="treeData" :props="defaultProps" node-key="id" :load="loadTreeNode" lazy
                            ref="orgTreeRef" highlight-current :default-expanded-keys="defaultExpandedKeys" style=""
                            :expand-on-click-node="false" show-checkbox check-on-click-node check-strictly
                            :default-checked-keys="checkedKeys" @check="handleCheckChange">
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
                                        v-if="scope.data.type === 5" class="roadui_note" style="margin-left:3px">[兼任]</span>
                                </div>
                            </template>
                        </el-tree>
                    </div>
                </el-tab-pane>
                <el-tab-pane v-if="showWorkgroup" label="工作组" name="1" style="height:100%">
                    <template #label>
                        <el-icon class="roadui_main_tabsvg">
                            <Collection />
                        </el-icon>工作组
                    </template>
                    <div style="height: 268px; overflow: auto;">
                        <div v-if="showSearch && isMobile" v-show="showType === '1'">
                            <el-input size="small" v-model="wgSearchKey" placeholder="输入关键字搜索" clearable
                                class="roadui_selectorg_searchinput" style="width:60%;"></el-input>
                            <el-button size="small" type="primary" style="vertical-align:middle;"
                                @click="wgIsSearch = true; wgLoadTreeNode({ level: 0 })">搜索</el-button>
                        </div>
                        <el-tree :data="wgTreeData" :props="defaultProps" node-key="id" :load="wgLoadTreeNode" lazy
                            ref="wgTreeRef" highlight-current :default-expanded-keys="wgDefaultExpandedKeys" style=""
                            :expand-on-click-node="false" show-checkbox check-on-click-node check-strictly
                            :default-checked-keys="checkedKeys" @check="handleCheckChange">
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
                                        v-if="scope.data.type === 5" class="roadui_note" style="margin-left:3px">[兼任]</span>
                                </div>
                            </template>
                        </el-tree>
                    </div>
                </el-tab-pane>
                <el-tab-pane v-if="showSearch && !isMobile" label="" name="2" style="height:100%">
                    <template #label>
                        <div v-show="showType === '0'">
                            <el-input size="small" v-model="searchKey" placeholder="输入关键字搜索" clearable
                                class="roadui_selectorg_searchinput"></el-input>
                            <el-button size="small" type="primary" style="vertical-align:middle;"
                                @click="isSearch = true; loadTreeNode({ level: 0 })">搜索</el-button>
                        </div>
                        <div v-show="showType === '1'">
                            <el-input size="small" v-model="wgSearchKey" placeholder="输入关键字搜索" clearable
                                class="roadui_selectorg_searchinput"></el-input>
                            <el-button size="small" type="primary" style="vertical-align:middle;"
                                @click="wgIsSearch = true; wgLoadTreeNode({ level: 0 })">搜索</el-button>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </el-select>
    <span v-else-if="status === 1" class="roadui_fromreadonly">{{ selectTitle.join('；') }}</span>
</template>

<script>
export default {
    name: 'ElSelectorg'
}
</script>

<script setup>
import { ref, inject, onMounted, watch } from 'vue';
const ajax = inject('ajax');
const utils = inject('utils');
const qs = inject('qs');
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const props = defineProps({
    //背景文字
    placeholder: { type: String, default: () => { return '请选择'; } },
    //值
    modelValue: { type: String, default: () => { return ''; } },
    //是否多选
    multiple: { type: Boolean, default: () => { return true; } },
    //选择数量，默认0为不限制。
    multipleLimit: { type: Number, default: () => { return 0; } },
    //可以选择的类型
    selectType: { type: String, default: () => { return 'unit,dept,station,user,workgroup'; } },
    //选择范围
    selectRange: { type: String, default: () => { return ''; } },
    //是否禁用
    disabled: { type: Boolean, default: () => { return false; } },
    //是否显示搜索
    showSearch: { type: Boolean, default: () => { return true; } },
    //状态 0编辑 1只读
    status: { type: Number, default: () => { return 0; } },
    //是否移动端
    isMobile: { type: Boolean, default: () => { return false; } },
});

const selectOrgRef = ref(null);
const orgTreeRef = ref(null);
const selectOrgs = ref([]);//选择的值
const selectTitle = ref([]);//选择的标题
const selectValue = ref([]);
const defaultProps = { children: 'children', label: 'title', isLeaf: 'isLeaf', disabled: 'disableCheckbox' };
const treeData = ref([]);
const defaultExpandedKeys = ref([]);
const checkedKeys = ref([]);//树默认选中节点
const searchKey = ref('');
const isSearch = ref(false);
const showType = ref('0');//显示类型 0组织架构 1工作组
const emit = defineEmits(['update:modelValue', 'change']);
let updateModelValue = props.modelValue;//更新值，用于在watch中比较是否是update:modelValue后又触发
const showOrganize = utils.length(props.selectType, true) === 0
    || (',' + props.selectType + ',').indexOf(',unit,') >= 0
    || (',' + props.selectType + ',').indexOf(',dept,') >= 0
    || (',' + props.selectType + ',').indexOf(',station,') >= 0
    || (',' + props.selectType + ',').indexOf(',user,') >= 0;
const showWorkgroup = utils.length(props.selectType, true) === 0
    || (',' + props.selectType + ',').indexOf(',workgroup,') >= 0;

onMounted(() => {
    // if (!showOrganize) {
    //     showType.value = '1';
    // }
    //判断如果选择范围只指定了工作组，选择类型选择了人员的情况也应该不显示组织架构选择，只显示工作组。
    if (showOrganize) {
        const rangeArray = (props.selectRange || '').split(',');
        let isOrg = false;
        for (let i = 0; i < rangeArray.length; i++) {
            if (utils.trim(rangeArray[i]).indexOf('w_') < 0) {
                isOrg = true;
                break;
            }
        }
        if (!isOrg) {
            showOrganize = false;
        }
    }
    initTitle(props.modelValue);
});

//2022-9-28增加watch，修正了某些情况控件有初始值时不会加载名称的问题。
watch(() => props.modelValue, (val) => {
    if (utils.length(updateModelValue) === 0 && utils.length(val) > 0) {
        updateModelValue = val;
        initTitle(val);
    }
});

//标签点击
const tabClick = (tab) => {
    const tabIndex = tab.paneName;
    if (tabIndex === '2') {
        return;
    }
    showType.value = tabIndex;
};
//切换标签之前的钩子函数， 若返回 false 则阻止切换。
const beforeLeave = (activeName) => {
    return activeName !== '2';
};
//加载树
const loadTreeNode = (node, resolve) => {
    //如果是首次加载
    if (node.level === 0 || isSearch.value) {
        //检查如果不是搜索，并且没有限定选择类型，并且utils.organizeTree中有数据则表明已经加载过，不重复请求服务器。
        const isOrgCache = !isSearch.value && props.selectType === 'unit,dept,station,user,workgroup' && utils.length(props.selectRange) === 0 && utils.length(utils.organizeTree) > 0;
        if (isOrgCache) {
            treeData.value = utils.organizeTree;
            if (utils.organizeTree.length === 1) {
                defaultExpandedKeys.value = [utils.organizeTree[0]['id']];
            }
            return;
        }
        ajax.post('/Organize/GetTree?srcorgid=' + sobInfo.value.id, qs.stringify({ selecttype: props.selectType, range: props.selectRange, keyword: searchKey.value })).then((res) => {
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
                if (res.data.length === 1) {
                    defaultExpandedKeys.value = [res.data[0]['id']];
                }
                //将请求值赋值到utils.organizeTree，下次直接读取。避免重复请求。
                if (isOrgCache) {
                    utils.organizeTree = res.data;
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
        ajax.post('/Organize/GetTreeChilds?parentid=' + node.data.id, qs.stringify({ selecttype: props.selectType })).then((res) => {
            resolve(res.data);
        }).catch(() => { });
    }
};
//选择改变 共两个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
const handleCheckChange = (data, checkedObj) => {
    let obj = getValueTitile(data);
    if (obj === null) {
        return;
    }
    const checked = utils.inArray(checkedObj.checkedKeys, data.id);
    if (checked) {
        if (props.multiple) {
            //检查选择数量
            if (props.multipleLimit > 0 && selectOrgs.value.length >= props.multipleLimit) {
                if (utils.isDef(orgTreeRef.value)) {
                    orgTreeRef.value.setChecked(data, false, false);
                }
                if (utils.isDef(wgTreeRef.value)) {
                    wgTreeRef.value.setChecked(data, false, false);
                }
                utils.msg('当前设置最多只能选择' + props.multipleLimit + '项！', false);
                return;
            }
            //判断数组中没有再添加
            if (!utils.inArray(selectOrgs.value, obj.value, 'value')) {
                selectOrgs.value.push(obj);
            }
        } else {
            selectOrgs.value = [];
            selectOrgs.value.push(obj);
            //如果是单选，取消其他节点选择。
            if (utils.isDef(orgTreeRef.value)) {
                orgTreeRef.value.setCheckedKeys(getSelectIds(), true);
            }
            if (utils.isDef(wgTreeRef.value)) {
                wgTreeRef.value.setCheckedKeys(getSelectIds(), true);
            }
        }
    } else {
        utils.removeArrayObj(selectOrgs.value, obj.value, 'value');
    }

    //更新值
    updateModalValue();
};
//标签移出
const removeTag = (val) => {
    utils.removeArrayObj(selectOrgs.value, val, 'value');
    //设置树节点checkbox为不选中
    checkedKeys.value = getSelectIds();
    if (utils.isDef(orgTreeRef.value)) {
        orgTreeRef.value.setChecked(replaceId(val), false, false);
    }
    if (utils.isDef(wgTreeRef.value)) {
        wgTreeRef.value.setChecked(replaceId(val), false, false);
    }
    //更新值
    updateModalValue();
};
//根据节点数据得到选项
const getValueTitile = (data) => {
    let id = data.id;
    let title = data.title;
    if (utils.length(id) === 0) {
        return null;
    }
    //type 1单位 2部门 3岗位 4人员 5兼职人员 6工作组
    switch (data.type) {
        case 4:
            id = 'u_' + id;
            break;
        case 5:
            id = 'r_' + id;
            title = title + utils.replaceWildcard('{<partTime>}');
            break;
        case 6:
            id = 'w_' + id;
            break;
    }
    return { value: id, title: title };
};
//清除按钮事件
const clear = () => {
    //取消树节点前的checkbox状态
    if (utils.isDef(orgTreeRef.value)) {
        const orgCheckedKeys = orgTreeRef.value.getCheckedKeys();
        for (let i = 0; i < orgCheckedKeys.length; i++) {
            orgTreeRef.value.setChecked(orgCheckedKeys[i], false, false);
        }
    }
    if (utils.isDef(wgTreeRef.value)) {
        const wgCheckedKeys = wgTreeRef.value.getCheckedKeys();
        for (let i = 0; i < wgCheckedKeys.length; i++) {
            wgTreeRef.value.setChecked(wgCheckedKeys[i], false, false);
        }
    }
    selectOrgs.value = [];
    updateModalValue();
};
//根据值初始化标题
const initTitle = (val) => {
    //取消树节点前的checkbox状态
    if (utils.isDef(orgTreeRef.value)) {
        const orgCheckedKeys = orgTreeRef.value.getCheckedKeys();
        for (let i = 0; i < orgCheckedKeys.length; i++) {
            orgTreeRef.value.setChecked(orgCheckedKeys[i], false, false);
        }
    }
    if (utils.isDef(wgTreeRef.value)) {
        const wgCheckedKeys = wgTreeRef.value.getCheckedKeys();
        for (let i = 0; i < wgCheckedKeys.length; i++) {
            wgTreeRef.value.setChecked(wgCheckedKeys[i], false, false);
        }
    }
    selectOrgs.value = [];
    selectValue.value = props.multiple ? [] : '';
    checkedKeys.value = [];
    if (utils.length(val) === 0) {
        //2024-3-25修改if (utils.length(val) === 0)以上的代码以前在这里，移到了上面，解决一个页面多个组织架构选择控件时初始化树选择时问题。
        return;
    }
    ajax.post('/Organize/GetSelectOptions', qs.stringify({ ids: val })).then((res) => {
        const valArray = val.split(',');
        const resData = res.data;
        for (let i = 0; i < valArray.length; i++) {
            let optObj = { value: valArray[i] };
            const resObj = utils.getArrayObj(resData, valArray[i], 'key');
            if (resObj !== null) {
                optObj['title'] = utils.replaceWildcard(resObj.label);
            }
            if (!utils.inArray(selectOrgs.value, optObj.value, 'value')) {
                selectOrgs.value.push(optObj);
            }
            if (!utils.inArray(selectTitle.value, optObj['title'], 'title')) {
                selectTitle.value.push(optObj['title']);
            }
        }
        checkedKeys.value = getSelectIds();
        selectValue.value = props.multiple ? valArray : valArray[0];
    }).catch(() => { });
};
//得到选中的id数组，去掉前缀,u_,r_,w_
const getSelectIds = () => {
    let array = [];
    for (let i = 0; i < selectOrgs.value.length; i++) {
        array.push(replaceId(selectOrgs.value[i].value));
    }
    return array;
};
//移出id前缀
const replaceId = (id) => {
    return utils.replace(utils.replace(utils.replace(id, 'u_', ''), 'r_', ''), 'w_', '');
}
//更新值
const updateModalValue = () => {
    let values = [];
    let titles = [];
    selectValue.value = [];
    for (let i = 0; i < selectOrgs.value.length; i++) {
        if (!utils.inArray(values, selectOrgs.value[i].value, 'value')) {
            values.push(selectOrgs.value[i].value);
            titles.push(selectOrgs.value[i].title);
        }
        if (!utils.inArray(selectValue.value, selectOrgs.value[i].value, 'value')) {
            selectValue.value.push(selectOrgs.value[i].value);
        }
    }
    if (!props.multiple) {
        selectValue.value = selectValue.value.join(',');
        //如果是单选，选择后关闭弹出层。
        if (utils.isDef(selectOrgRef.value)) {
            selectOrgRef.value.blur();
        }
    }
    const val = values.join(',');
    emit('update:modelValue', val);
    emit('change', { value: val, title: titles });
};

//工作组
const wgTreeData = ref([]);
const wgTreeRef = ref(null);
const wgIsSearch = ref(false);
const wgSearchKey = ref('');
const wgDefaultExpandedKeys = ref([]);
//加载工作组
const wgLoadTreeNode = (node, resolve) => {
    //如果是首次加载
    if (node.level === 0 || wgIsSearch.value) {
        //检查如果不是搜索，并且没有限定选择类型，并且utils.workgroupTree中有数据则表明已经加载过，不重复请求服务器。
        const isWgCache = !wgIsSearch.value && props.selectType === 'unit,dept,station,user,workgroup' && utils.length(props.selectRange) === 0 && utils.length(utils.workgroupTree) > 0;
        if (isWgCache) {
            wgTreeData.value = utils.workgroupTree;
            if (utils.workgroupTree.length > 0) {
                wgDefaultExpandedKeys.value = [utils.workgroupTree[0]['id']];
            }
            return;
        }
        ajax.post('/Workgroup/GetTree', qs.stringify({ selecttype: props.selectType, range: props.selectRange, keyword: wgSearchKey.value })).then((res) => {
            if (wgIsSearch.value && utils.length(wgSearchKey.value) > 0) {
                //如果是搜索，加上根节点标题
                const searchRootNode = {
                    id: utils.emptyLong + '_wg',
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
                wgIsSearch.value = false;
                wgDefaultExpandedKeys.value = [utils.emptyLong + '_wg'];
            } else {
                wgTreeData.value = res.data;
                wgIsSearch.value = false;
                if (res.data.length > 0) {
                    wgDefaultExpandedKeys.value = [res.data[0]['id']];
                }
                //将请求值赋值到utils.workgroupTree，下次直接读取。避免重复请求。
                if (isWgCache) {
                    utils.workgroupTree = res.data;
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
        ajax.post('/Workgroup/GetChildTree?workgroupid=' + node.data.id, qs.stringify({ selecttype: props.selectType })).then((res) => {
            resolve(res.data);
        }).catch(() => { });
    }
};

//暴露方法给父组件调用
defineExpose({ initTitle });
</script>