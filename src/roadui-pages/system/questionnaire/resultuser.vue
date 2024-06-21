<template>
    <div class="roadui_page">
        <el-table :data="tableData"
                  v-loading="loading"
                  :stripe="pager.tableStripe"
                  :border="pager.tableBorder"
                  style="width: 100%"
                  :highlight-current-row="pager.tableHighlightCurrentRow"
                  :default-sort="defaultOrder"
                  @sort-change="sortChange">
            <el-table-column prop="userName" label="姓名" sortable="custom" width="150"></el-table-column>
            <el-table-column prop="userOrganize" label="所在组织" sortable="custom"></el-table-column>
            <el-table-column prop="submitTime" label="提交时间" sortable="custom" width="150">
                <template #default="scope">
                    <el-tag v-if="scope.row.status==0" type="info">未提交</el-tag>
                    <span v-else>{{scope.row.submitTime}}</span>
                </template>
            </el-table-column>
            <el-table-column width="75">
                <template #default="scope">
                    <el-button v-if="questionnaireData.anonymous==0&&scope.row.status==1" size="small" type="primary" @click="view(scope.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--查看窗口-->
        <el-dialog v-model="dialogShow" :title="dialogTitle" destroy-on-close width="1000px" draggable :close-on-click-modal="false">
            <component :is="dialogPage" :query="dialogQuery"></component>
        </el-dialog>
    </div>
</template>

<script setup>
    import ResultUserShow from './resultusershow.vue';
    import { ref, inject, onMounted, shallowRef, provide } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const questionnaireId = utils.query('questionnaireid', props.query);

    const formData = ref({});
    const tableData = ref([]);
    const questionnaireData = ref({});
    const loading = ref(false);
    const defaultOrder = ref({ prop: 'submittime', order: 'descending' });
    const pager = ref(utils.getPager(defaultOrder.value));

    onMounted(() => {
        loadData();
    });

    //排序
    const sortChange = (order) => {
        pager.value.order = utils.getOrder(order);
        loadData();
    };

    const loadData = () => {
        loading.value = true;
        formData.value.order = pager.value.order;
        ajax.post('/Questionnaire/GetResultUsers' + props.query, qs.stringify(formData.value)).then((res) => {
            tableData.value = res.data.rows;
            questionnaireData.value = res.data;
            loading.value = false;
        }).catch(() => { });
    };

    //查看
    const dialogShow = ref(false);
    const dialogTitle = ref('');
    const dialogPage = shallowRef(null);
    const dialogQuery = ref('');
    const view = (row) => {
        dialogQuery.value = '?questionnaireid=' + questionnaireId + '&userid=' + row.userId;
        dialogTitle.value = '';
        dialogPage.value = ResultUserShow;
        dialogShow.value = true;
    };

    provide('resultuser_dialogshow', dialogShow);
</script>