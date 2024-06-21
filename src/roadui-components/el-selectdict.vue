<template>
    <el-select v-if="status===0" :placeholder="placeholder"
               ref="selectDictRef"
               popper-class="roadui_selectdict"
               :disabled="disabled"
               @remove-tag="removeTag"
               @clear="clear"
               v-model="selectValue"
               :multiple="multiple"
               :multiple-limit="multipleLimit">
        <el-option value="" style="height:0;padding:0;display:none;"></el-option>
        <el-option v-for="dict in selectDicts" :key="dict.id" :value="getValue(dict)" :label="dict.title" style="height:0;padding:0;display:none;"></el-option>
        <el-tree :data="treeData"
                 :props="defaultProps"
                 node-key="id"
                 :load="loadTreeNode"
                 lazy
                 ref="dictTreeRef"
                 highlight-current
                 :default-expanded-keys="defaultExpandedKeys"
                 :expand-on-click-node="false"
                 show-checkbox
                 check-on-click-node
                 check-strictly
                 :default-checked-keys="checkedKeys"
                 @check="handleCheckChange">
            <template #default="scope">
                <div class="roadui_treenode">
                    <el-icon v-if="!scope.node.isLeaf" class="roadui_main_tabico"><folder /></el-icon>
                    <el-icon v-else class="roadui_main_tabico"><document /></el-icon>
                    <span>{{scope.node.label}}</span>
                </div>
            </template>
        </el-tree>
    </el-select>
    <span v-else-if="status===1" class="roadui_fromreadonly">{{selectTitle.join('；')}}</span>
</template>

<script>
    export default {
        name: 'ElSelectdict'
    }
</script>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');

    const props = defineProps({
        //值,多选为Array，单选为String
        modelValue: { type: [Array, String] },
        //状态 0编辑 1只读
        status: { type: Number, default: () => { return 0; } },
        //加载的根
        root: { type: String, default: () => { return ''; } },
        //背景文字
        placeholder: { type: String, default: () => { return '请选择'; } },
        //是否禁用
        disabled: { type: Boolean, default: () => { return false; } },
        //是否多选
        multiple: { type: Boolean, default: () => { return false; } },
        //多选选择数量
        multipleLimit: { type: Number, default: () => { return 0; } },
        //是否允许选择根节点
        selectRoot: { type: Boolean, default: () => { return true; } },
        //是否显示根节点
        showRoot: { type: Boolean, default: () => { return true; } },
        //是否允许选择有下级节点的节点
        selectParent: { type: Boolean, default: () => { return true; } },
        //值字段，选项：id,title-标题,code-唯一代码,value-值,note-备注,other-其他
        valueField: { type: String, default: () => { return 'id'; } },
    });

    const selectDictRef = ref(null);
    const dictTreeRef = ref(null);
    const defaultProps = { children: 'children', label: 'title', isLeaf: 'isLeaf', disabled: 'disableCheckbox' };
    
    const treeData = ref([]);
    const defaultExpandedKeys = ref([]);
    const checkedKeys = ref([]);//树默认选中节点
    const selectDicts = ref([]);//选择的值[{value:值,title:标题}]
    const selectValue = ref([]);
    const selectTitle = ref([]);//只读时显示的标题
    const emit = defineEmits(['update:modelValue','change']);

    onMounted(() => {
        initTitle(props.modelValue);
    });

    //加载树
    const loadTreeNode = (node, resolve) => {
        //如果是首次加载
        if (node.level === 0) {
            ajax.post('/Dictionary/GetTreeJson?root=' + props.root + '&showroot=' + (props.showRoot ? '1' : '0') + '&selectparent=' + (props.selectParent ? '1' : '0')).then((res) => {
                //设置根节点是否能选择
                if (!props.selectRoot) {
                    for (let i = 0; i < res.data.length; i++) {
                        res.data[i]['disableCheckbox'] = true;
                    }
                }
                treeData.value = res.data;
                if (res.data.length === 1) {
                    defaultExpandedKeys.value = [res.data[0]['id']];
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
            ajax.post('/Dictionary/GetTreeChildsJson?parentid=' + node.data.id + '&selectparent=' + (props.selectParent ? '1' : '0')).then((res) => {
                resolve(res.data);
            }).catch(() => { });
        }
    };
    //选择改变 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
    const handleCheckChange = (data, checkedObj) => {
        const checked = utils.inArray(checkedObj.checkedKeys, data.id);
        if (checked) {
            //如果是单选
            if (!props.multiple) {
                selectDicts.value = [];
                selectDicts.value.push(data);
            } else {
                //检查选择数量
                if (props.multipleLimit > 0 && selectDicts.value.length >= props.multipleLimit) {
                    dictTreeRef.value.setChecked(data, false, false);
                    utils.msg('当前设置最多只能选择' + props.multipleLimit + '项！', false);
                    return;
                }
                //判断数组中没有再添加
                if (!utils.inArray(selectDicts.value, data.id, 'id')) {
                    selectDicts.value.push(data);
                }
            }
        } else {
            utils.removeArrayObj(selectDicts.value, data.id, 'id');
        }
        //如果是单选要取消当前选择以外的其他节点的选中状态。
        if (!props.multiple) {
            dictTreeRef.value.setCheckedKeys(utils.getArrayValues(selectDicts.value, 'id'), true);
        }
        updateModalValue();
    };
    //标签移出
    const removeTag = (val) => {
        utils.removeArrayObj(selectDicts.value, val, props.valueField);
        //取消树节点选中，由于设置的选择值（val）不一定是id，所以这里要根据值去获取对应的节点。
        const checkedKeys = dictTreeRef.value.getCheckedKeys();
        for (let i = 0; i < checkedKeys.length; i++) {
            const node = dictTreeRef.value.getNode(checkedKeys[i]);
            if (utils.isDef(node) && utils.isDef(node.data) && val == getValue(node.data)) {
                dictTreeRef.value.setChecked(node, false, false);
            }
        }
        updateModalValue();
    };
    //得到值
    const getValue = (dict) => {
        const field = props.valueField.toLowerCase();
        return utils.isUndef(dict) || !utils.hasKey(dict, field) ? '' : dict[field];
    };
    //更新值
    const updateModalValue = () => {
        let checkeds = [];
        if (props.multiple) {
            let values = [];
            let titles = [];
            for (let i = 0; i < selectDicts.value.length; i++) {
                values.push(getValue(selectDicts.value[i]));
                titles.push(selectDicts.value[i]['title']);
                checkeds.push(selectDicts.value[i].id);
            }
            emit('update:modelValue', values);
            emit('change', { value: values, title: titles });
            selectValue.value = values;
        } else {
            const value = selectDicts.value.length > 0 ? getValue(selectDicts.value[0]) : '';
            const title = selectDicts.value.length > 0 ? selectDicts.value[0]['title'] : '';
            emit('update:modelValue', value);
            emit('change', { value: value, title: title });
            selectValue.value = value;
            if (selectDicts.value.length > 0) {
                checkeds.push(selectDicts.value[0].id);
            }
            //如果是单选，选择后关闭弹出层。
            selectDictRef.value.blur();
        }
        checkedKeys.value = checkeds;
    };
    //清除按钮事件
    const clear = () => {
        //取消树节点前的checkbox状态
        const checkedKeys = dictTreeRef.value.getCheckedKeys();
        for (let i = 0; i < checkedKeys.length; i++) {
            dictTreeRef.value.setChecked(checkedKeys[i], false, false);
        }
        selectDicts.value = [];
        updateModalValue();
    };
    //初始化标题
    const initTitle = (val) => {
        if (utils.length(val) === 0) {
            checkedKeys.value = [];
            selectDicts.value = [];
            return;
        }
        const valArray = props.multiple && utils.isArray(val) ? val : [val];
        ajax.post('/Dictionary/GetSelectedTitle', qs.stringify({ values: JSON.stringify(valArray), root: props.root, valuefield: props.valueField })).then((res) => {
            if (res.success) {
                selectDicts.value = [];
                for (let i = 0; i < valArray.length; i++) {
                    const titleObj = utils.getArrayObj(res.data, valArray[i], 'value');
                    if (utils.isDef(titleObj)) {
                        let dictObj = { id: titleObj.id, title: titleObj.title, titleEn: titleObj.title_en, titleTw: titleObj.title_tw };
                        dictObj[props.valueField] = valArray[i];
                        selectDicts.value.push(dictObj);
                    }
                }
                let values = [];
                let checkeds = [];
                for (let i = 0; i < selectDicts.value.length; i++) {
                    values.push(getValue(selectDicts.value[i]));
                    selectTitle.value.push(selectDicts.value[i].title);
                    checkeds.push(selectDicts.value[i].id);
                }
                //设置值
                if (props.multiple) {
                    selectValue.value = values;
                } else {
                    selectValue.value = values.length > 0 ? values[0] : '';
                }
                checkedKeys.value = checkeds;
            }
        }).catch(() => { });
    };

    //暴露方法给父组件调用
    defineExpose({ initTitle });
</script>