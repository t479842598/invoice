<template>
    <div>
        <div style="margin-bottom:8px">
            <el-button type="primary" @click="toBack">返回</el-button>
        </div>
        <el-table :data="tableData"
                  style="width:100%;"
                  row-key="id"
                  v-loading="loading"
                  :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <el-table-column prop="title" label="菜单名称" width="320">
                <template #default="scope">
                    <component class="roadui_org_setmenuico" v-if="utils.length(scope.row.ico)>0" :is="scope.row.ico"></component>
                    {{scope.row.title}}
                </template>
            </el-table-column>
            <el-table-column prop="buttons" label="来源">
                <template #default="scope">
                    <el-space>
                       <el-tag v-for="(source,index) in scope.row.source" :key="index" type="info" >{{source}}</el-tag>
                    </el-space>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const parentOpenPage = inject('openPage');//父节点打开页面

    const loading = ref(false);
    const tableData = ref([]);
    const userId = utils.query('userid', props.query);
    const organizeType = utils.query('organizetype', props.query);
    const returnUrl = utils.query('returnurl', props.query);

    onMounted(() => {
        loadTableData();
    });

    //加载表格数据
    const loadTableData = () => {
        loading.value = true;
        ajax.post('/Menu/GetUserTree', qs.stringify({ userid: userId, showsource: 1 })).then((res) => {
            if (!res.success) {
                utils.msg('加载数据失败！', false);
                loading.value = false;
                return;
            }
            tableData.value = res.data;
            loading.value = false;
        }).catch(() => { loading.value = false; });
    };
    //返回
    const toBack = () => {
        parentOpenPage({ type: organizeType }, returnUrl);
    };
</script>