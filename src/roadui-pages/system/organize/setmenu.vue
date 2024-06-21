<template>
    <div class="roadui_page">
        <div style="margin-bottom:8px">
            <el-space>
                <el-button :disabled="butDisabled" type="primary" @click="save">保存</el-button>
                <el-button :disabled="butDisabled" type="primary" @click="upMenuAuth">更新菜单权限</el-button>
                <el-button :disabled="butDisabled" @click="toBack">返回</el-button>
            </el-space>
        </div>
        <el-table :data="tableData"
                  ref="tableRef"
                  style="width:100%;"
                  row-key="id"
                  v-loading="loading"
                  @select="selectRow"
                  @selection-change="selectionChange"
                  @select-all="checkAll=!checkAll;selectAll(tableData)"
                  :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <el-table-column type="selection" width="45" reserve-selection/>
            <el-table-column prop="title" label="菜单名称" width="320">
                <template #default="scope">
                    <component class="roadui_org_setmenuico" v-if="utils.length(scope.row.ico)>0" :is="scope.row.ico"></component>
                    {{scope.row.title}}
                </template>
            </el-table-column>
            <el-table-column prop="buttons" label="按钮">
                <template #default="scope">
                    <el-checkbox-group v-model="scope.row.buttons1">
                        <el-checkbox v-for="but in scope.row.buttons" :key="but.id" :label="but.id">{{but.name}}</el-checkbox>
                    </el-checkbox-group>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
    import { ref, onMounted, inject, nextTick } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const parentOpenPage = inject('openPage');//父节点打开页面

    const butDisabled = ref(false);
    const loading = ref(false);
    const tableData = ref([]);
    const tableRef = ref(null);
    const checkAll = ref(false);//是否全选，用于判断全选或取消全选
    let selectionRows = [];//选择的行
    const organizeId = utils.query('organizeid', props.query);
    const organizeType = utils.query('organizetype', props.query);
    const returnUrl = utils.query('returnurl', props.query);

    onMounted(() => {
        loadTableData();
    });

    //加载表格数据
    const loadTableData = () => {
        loading.value = true;
        ajax.post('/Menu/GetTableTree?organizeid=' + organizeId + '&organizetype=' + organizeType).then((res) => {
            if (!res.success) {
                utils.msg('加载数据失败！', false);
                loading.value = false;
                return;
            }
            tableData.value = res.data;
            nextTick(() => {
                initSelection(res.data);
                loading.value = false;
            });
        }).catch(() => { loading.value = false; });
    };

    //当用户手动勾选数据行的Checkbox时触发的事件
    const selectRow = (selection, row) => {
        let parentRows = [];
        getParents(row, parentRows);
        const checked = selection.findIndex(item => {
            return item.id === row.id;
        }) >= 0;
        for (let i = 0; i < parentRows.length; i++) {
            let children = [];
            getAllChildren(parentRows[i], children);
            if (checked) {
                tableRef.value.toggleRowSelection(parentRows[i], true);//设置父级被选中
                //设置所有下级，如果原来是选中就选中，没有选中就没有选中。不然设置了上级选中，所有下级都会被选中。
                for (let j = 0; j < children.length; j++) {
                    if (parentRows.findIndex(item => {
                        return item.id === children[j].id
                    }) >= 0) {
                        continue;//如果下级是选中行的上级则跳过
                    }
                    const childrenCheck = selection.findIndex(item => {
                        return item.id === children[j].id;
                    }) >= 0;
                    tableRef.value.toggleRowSelection(children[j], childrenCheck);
                }
            } else {
                let isChecked = false;//判断是否有下级被选中
                const selection1 = tableRef.value.getSelectionRows();
                for (let j = 0; j < children.length; j++) {
                    const childrenCheck = selection1.findIndex(item => {
                        return item.id === children[j].id;
                    }) >= 0;
                    if (childrenCheck) {
                        isChecked = true;
                        break;
                    }
                }
                //如果没有下级选中，则取消上级选中。
                if (!isChecked) {
                    tableRef.value.toggleRowSelection(parentRows[i], false);
                }
            }
        }
    };

    //得到一行的所有上级行
    const getParents = (row, parentRows) => {
        let pRows = [];
        getParent(row, tableData.value, pRows);
        if (pRows.length > 0) {
            parentRows.push(pRows[0]);
            getParents(pRows[0], parentRows);
        }
    };

    const getParent = (row, rows, pRows) => {
        for (let i = 0; i < rows.length; i++) {
            if (row.parentId === rows[i].id) {
                pRows.push(rows[i]);
                return;
            }
            if (rows[i].children) {
                getParent(row, rows[i].children, pRows);
            }
        }
    };

    //得到一行的所有下级行
    const getAllChildren = (row, childrenRows) => {
        if (row.children) {
            for (let i = 0; i < row.children.length; i++) {
                childrenRows.push(row.children[i]);
                getAllChildren(row.children[i], childrenRows);
            }
        }
    };


    //表格选择发生变化事件
    const selectionChange = (selection) => {
        selectionRows = selection;
    };
    //初始化选项
    const initSelection = (rows) => {
        for (let i = 0; i < rows.length; i++) {
            tableRef.value.toggleRowSelection(rows[i], rows[i].selected);
            if (utils.length(rows[i]['children']) > 0) {
                initSelection(rows[i]['children']);
            }
        }
    };
    //全选时
    const selectAll = (rows) => {
        for (let i = 0; i < rows.length; i++) {
            tableRef.value.toggleRowSelection(rows[i], checkAll.value);
            if (utils.length(rows[i]['children']) > 0) {
                selectAll(rows[i]['children']);
            }
        }
    };
    //保存
    const save = () => {
        let values = [];
        for (let i = 0; i < selectionRows.length; i++) {
            values.push({ id: selectionRows[i].id, buttons: selectionRows[i].buttons1.join(',') });
        }
        butDisabled.value = true;
        let postData = { organizeid: organizeId, organizetype: organizeType, count: values.length, menus: values };
        ajax.post('/Organize/SaveSetMenu', qs.stringify(postData)).then((res) => {
            let msg = res.msg;
            if (utils.length(msg) === 0) {
                msg = res.success ? '保存成功！' : '保存失败！';
            }
            utils.msg(msg, res.success);
            butDisabled.value = false;
        }).catch(() => { butDisabled.value = false; });
    };
    //返回
    const toBack = () => {
        parentOpenPage({ type: organizeType }, returnUrl);
    };
    //更新菜单权限
    const upMenuAuth = () => {
        butDisabled.value = true;
        ajax.post('/Menu/UpMenuAuth').then((res) => {
            utils.msg(res.success ? '更新成功！' : '更新失败！', res.success);
            butDisabled.value = false;
        }).catch(() => { butDisabled.value = false; });
    };
</script>