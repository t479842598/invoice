<template>
    <div>
        <!-- 客户管理平台 -->
        <!-- 表单 -->
        <el-form ref="form" :model="formData" inline class="inline">
            <el-form-item label="客户编号">
                <el-input v-model="formData.customercode"></el-input>
            </el-form-item>
            <el-form-item label="客户名称">
                <el-input v-model="formData.customername"></el-input>
            </el-form-item>
            <el-form-item label="业务员">
                <el-input v-model="formData.customersalesperson"></el-input>
            </el-form-item>
            <!-- <el-form-item label="服务开通时间">
                <el-date-picker v-model="formData.serviceStartTime" type="daterange" value-format="YYYY-MM-DD" clearable />
            </el-form-item>
            <el-form-item label="服务截止时间">
                <el-date-picker v-model="formData.serviceEndTime" type="daterange" value-format="YYYY-MM-DD" clearable />
            </el-form-item> -->
            <el-form-item>
                <el-button type="primary" @click="loadTableData(true)" :icon="Search">查询</el-button>
                <!-- <el-button type="default" @click="reset" :icon="Refresh">重置</el-button> -->
                <el-button type="success" @click="addNew" :icon="Plus">新增</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格 -->
        <el-table :data="tableData" v-loading="loading" :stripe="pager.tableStripe" border style="width: 940px;"
            max-height="500" :highlight-current-row="pager.tableHighlightCurrentRow" :header-cell-style="headerCellStyle"
            :default-sort="defaultOrder">
            <el-table-column prop="customercode" label="客户编号" align="center" width="200"></el-table-column>
            <el-table-column prop="customername" label="客户名称" align="center" width="200"></el-table-column>
            <el-table-column prop="customerlinker" label="联系人" align="center" width="120"></el-table-column>
            <el-table-column prop="customerphone" label="联系电话" align="center" width="120"></el-table-column>
            <el-table-column prop="customersalesperson" label="业务员" align="center" width="120"></el-table-column>
            <!-- <el-table-column prop="serviceStartTime" label="服务开通时间" align="center" width="150"></el-table-column>
            <el-table-column prop="serviceEndTime" label="服务截止时间" align="center" width="150"></el-table-column> -->
            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="onEdit(scope.row)">修改</el-button>
                    <el-button type="success" size="small" @click="onDetail(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="roadui_pagerdiv" style="text-align: left;padding-left: 180px;">
            <el-pagination v-model:currentPage="pager.number" v-model:page-size="pager.size" :page-sizes="pager.sizes"
                :background="pager.background" :layout="pager.layout" :total="pager.total" :disabled="butDisabled"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
        <!--提交窗口-->
        <el-dialog v-model="dialogShow" :title="dialogTitle" align-center destroy-on-close width="1000px" draggable
            :close-on-click-modal="false" @close="closed">
            <!-- <component :is="dialogPage" :query="dialogQuery"></component> -->
            <Submit ref="GetSub" v-model:id="id" v-model:new="newdata"></Submit>
        </el-dialog>
        <!-- 查看窗口 -->
        <el-dialog v-model="dialogShows" :title="dialogTitles" align-center destroy-on-close width="1000px" draggable
            :close-on-click-modal="false">
            <!-- <component :is="dialogPages" :query="dialogQuerys"></component> -->
            <Views v-model:id="id"></Views>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, inject, onMounted, shallowRef, provide } from 'vue'
import { View, Edit, Search, Plus, Refresh, Tools } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios';
import { nextTick } from 'process'
import Submit from './Customsubmit.vue'
import Views from './Customview.vue'
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
const qs = inject('qs');
const openmenu = inject('index_openmenu');//首页打开菜单
const removetab = inject('index_removetab');//首页关闭标签方法
const refreshtab = inject('index_refreshtab');//首页刷新标签方式
const butDisabled = ref(false);//按钮是否可用
const loading = ref(false);//加载状态
let selectRows = [];//保存选择的行
const defaultOrder = ref({ prop: 'customercode', order: 'ascending' });//默认排序
const pager = ref(utils.getPager(defaultOrder.value));//分页
const formDataDateRange = ref([]);//日期范围
const id = ref('');//保存id
const GetSub = ref();//提交组件
const newdata = ref(false);//是否新增
//表单数据
const formData = ref({
    customercode: '',
    customername: '',
    customersalesperson: '',
    // serviceStartTime: '',
    // serviceEndTime: ''
})
//表格数据
const tableData = ref([
])
onMounted(() => {
    loadTableData(false);
});
//加载列表，isQuery 点查询按钮为true，初始加载为false，为了区分点查询按钮时要将页number置为1。
const loadTableData = (isQuery) => {
    if (isQuery) {
        pager.value.number = 1;
    }
    loading.value = true;
    butDisabled.value = true;
    formData.value.size = pager.value.size;
    formData.value.number = pager.value.number;
    formData.value.order = pager.value.order;
    // formData.value['date1'] = utils.length(formDataDateRange.value) > 0 ? formDataDateRange.value[0] : '';
    // formData.value['date2'] = utils.length(formDataDateRange.value) > 1 ? formDataDateRange.value[1] : '';
    ajax.post('/yun_customer/GetList', qs.stringify(formData.value)).then((res) => {
        tableData.value = res.data.rows;
        pager.value.total = res.data.total;
        butDisabled.value = false;
        loading.value = false;
    }).catch(() => { butDisabled.value = false; });
};

//重置
const reset = () => {
    form.value = {
        customercode: '',
        customername: '',
        customersalesperson: '',
        // serviceStartTime: '',
        // serviceEndTime: ''
    }
    // loadTableData(true);
};



// 新增
const dialogTitle = ref('');//窗口标题
const dialogPage = shallowRef(null);//窗口组件
const dialogShow = ref(false);//是否显示窗口
const addNew = () => {
    id.value = '';
    newdata.value = true;
    dialogPage.value = Submit;
    dialogTitle.value = '新增';
    dialogShow.value = true;
};
// 修改
const onEdit = (row) => {
    id.value = row.id;
    newdata.value = false;
    dialogPage.value = Submit;
    dialogTitle.value = '修改';
    dialogShow.value = true;
};
// 查看
const dialogTitles = ref('');//窗口标题
const dialogPages = shallowRef(null);//窗口组件
const dialogShows = ref(false);//是否显示窗口
// 查看
const onDetail = (row) => {
    id.value = row.id;
    dialogPages.value = Views;
    dialogTitles.value = '查看';
    dialogShows.value = true;
};
// 关闭
const closed = () => {
    // GetSub.value.clear()
};
// 表头单元格样式
function headerCellStyle({ row, column, rowIndex, columnIndex }) {
    return {
        color: '#000',
        textAlign: 'center',
    }
}

provide('submit_dialogshow', dialogShow);
provide('view_dialogshow', dialogShows);

// index_openmenu({

// id:id-不重复ID,

// title:标题,

// url:应用地址,

// ico:图标,

// closeable: 是否可以关闭true|false 默认true,

// openMode:打开方式0标签 1弹出层 2弹出窗口 3新窗口,

// isShowFile:是否是查看文件true|false,

// draggable:打开方式为弹出层时是否可以拖动true|false,

// width:打开方式为弹出时的层或窗口高度,

// height:打开方式为弹出时的层或窗口宽度,

// top:打开方式为弹出时的top位置

// customClass:打开方式为弹出时的自定义样式类,

// });

</script>

<style scoped>
:deep(.inline .el-input) {
    width: 180px;
}
</style>
