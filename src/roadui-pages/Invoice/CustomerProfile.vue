<template>
    <div>
        <form v-show="false" ref="formref" action="" method="post"></form>
        <!-- 客户档案管理 -->
        <div class="form-container">
            <el-form :inline="true" :model="formData">
                <el-form-item label="客户名称">
                    <el-input v-model="formData.customername" style="width: 230px;" clearable></el-input>
                </el-form-item>
                <el-form-item label="纳税人识别号">
                    <el-input v-model="formData.taxno" style="width: 230px;" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadTableData(true)" icon="Search">查询</el-button>
                    <el-button type="success" @click="addNew" icon="Plus">新增</el-button>
                    <el-button type="primary" @click="exportfiles" icon="Download">导出</el-button>
                    <el-upload ref="upload" :limit="1" style="margin-left: 10px;margin-bottom: 2px;" :on-change="changeFn"
                        :on-exceed="handleExceed" accept=".xlsx,.xls" :auto-upload="false"
                        :before-upload="beforeAvatarUpload" :show-file-list="false">
                        <template #trigger>
                            <el-button icon="Upload" type="warning">导入Excel</el-button>
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <!-- <el-button icon="Close" type="success" @click="closed">关闭</el-button> -->
                    <!-- <el-button type="primary" link @click="Download()">下载导入模板</el-button> -->
                </el-form-item>
            </el-form>
        </div>
        <div class="table-container">
            <el-table :data="tableData" v-loding="loading" :height="height" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" style="width: 100%; color: #000 "
                :header-cell-style="headerCellStyle" v-bind="$attrs" @current-change="tableCurrentChange">
                >
                <el-table-column prop="id" v-if="false" width="1" />
                <el-table-column prop="customercode" label="客户编号" v-if="false" width="1" />
                <el-table-column v-for="(item, index) in tableColumns" fit show-overflow-tooltip :key="index"
                    :prop="item.prop" :label="item.label" align="center" :min-width="item.width">
                </el-table-column>
                <el-table-column label="操作" align="center" width="140" fixed="right">
                    <template #default="scope">
                        <!-- <el-button type="success" size="small" @click="onDetail(scope.row)">详情</el-button> -->
                        <el-button size="small" type="primary" @click="onEdit(scope.row)">修改</el-button>
                        <el-button size="small" type="danger" @click="Delete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="roadui_pagerdiv">
                <el-pagination v-model:currentPage="pager.number" v-model:page-size="pager.size" :page-sizes="pager.sizes"
                    :background="pager.background" :layout="pager.layout" :total="pager.total" :disabled="butDisabled"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
            <!--提交窗口-->
            <el-dialog v-model="dialogShow" :title="dialogTitle" align-center destroy-on-close width="600px" draggable
                :close-on-click-modal="false">
                <Add v-model:id="id" v-model="rowdata"></Add>
            </el-dialog>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, shallowRef, provide, reactive, nextTick, watch, computed, defineAsyncComponent } from 'vue'
import { View, Edit, Search, Plus, Refresh, Tools, Upload } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { excelExportUseJson, excelImport } from "../../roadui-assets/excel";
import axios from 'axios';
import { debounce } from 'lodash';
const Add = defineAsyncComponent(() => import('./CustomerProfileEdit.vue'))
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
const formref = ref()//ref
const qs = inject('qs');
const openmenu = inject('index_openmenu');//首页打开菜单
const removetab = inject('index_removetab');//首页关闭标签方法
const refreshtab = inject('index_refreshtab');//首页刷新标签方式
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const butDisabled = ref(false);//按钮是否可用
const loading = ref(false);//加载状态
let selectRows = [];//保存选择的行
const defaultOrder = ref({ prop: '', order: 'ascending' });
const pager = ref(utils.getPager(defaultOrder.value));
const tableData = ref([]);//表格数据
const rowdata = ref({});//表格选中行数据
const id = ref('');//id
onMounted(() => {
    loadTableData(false);
});
const height = ref(document.documentElement.clientHeight - 250);//表格高度
window.onresize = function () {
    height.value = document.documentElement.clientHeight - 250;
};

// 表格循环列
const tableColumns = [
    // { prop: 'customercode', label: '客户编号', width: '200' },
    { prop: 'customername', label: '客户名称', width: '300' },
    { prop: 'TaxNo', label: '纳税人识别号', width: '200' },
    { prop: 'Address', label: '地址', width: '260' },
    { prop: 'Phone', label: '电话', width: '180' },
    { prop: 'BankName', label: '开户行', width: '180' },
    { prop: 'Account', label: '银行账号', width: '180' },
    { prop: 'Email', label: '客户邮箱', width: '180' },
    { prop: 'Phone', label: '联系电话', width: '180' },
]
//表单数据
const formData = ref({
    customername: '',//单位名称
    taxno: '',//纳税人识别号
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
    ajax.post('/Customer/GetList?srcorgid=' + sobInfo.value.id, qs.stringify(formData.value)).then((res) => {
        tableData.value = res.data.rows;
        pager.value.total = res.data.total;
        butDisabled.value = false;
        loading.value = false;
    }).catch(() => { butDisabled.value = false; loading.value = false; });
};
//新增
const dialogTitle = ref('');
const dialogPage = shallowRef(null);
const dialogShow = ref(false);//是否显示窗口
const addNew = () => {
    id.value = '';
    dialogTitle.value = '新增';
    dialogPage.value = Add;
    dialogShow.value = true;
};
// 修改
const onEdit = (row) => {
    id.value = row.id;
    dialogTitle.value = '修改';
    dialogPage.value = Add;
    dialogShow.value = true;
};
//导出表格
function exportfiles() {
    nextTick(() => {
        exportfileexcel()
    })
}
function exportfileexcel() {
    debounce(() => {
        formref.value.action = config.SERVER_DEV_APIADDRESS + '/Report/ExportCustomer?' + qs.stringify({ whereJSON: JSON.stringify(formData.value.customername) });
        formref.value.submit();
    }, 300)();
}
// 导入配置
// 购置设备明细导入
const upload = ref();
const handleExceed = (files) => {
    upload.value!.clearFiles()
    const file = files[0]
    upload.value!.handleStart(file);
}
const addnewid = ref('');
const newTableData = ref<any>([]);//表格数据
const changeFn = async (file) => {
    try {
        const res = await ajax.post("/Flow/GetLongId");
        addnewid.value = res.data; // 假设addnewid用于记录最近一次生成的ID，这里直接赋值
        const arr = await excelImport(file.raw as File);
        // tableData.value = []; // 清空原有数据更简洁直观
        arr.forEach((item, index) => {
            newTableData.value.push({
                id: Number(addnewid.value) + index, // 确保每个item的id唯一，这里基于newId递增，但需注意这可能不适用于所有场景，特别是当每次请求返回的ID不连续时
                customercode: item["统一社会信用代码/纳税人识别号"],
                customername: item["客户名称"],
                TaxNo: item["统一社会信用代码/纳税人识别号"],
                Address: item["地址"],
                Phone: item["电话"],
                BankName: item["开户行名称"],
                Account: item["银行账号"],
            });
        });
        console.log(newTableData.value)
        saveData(newTableData.value);
    } catch (error) {
        // 可以在这里添加错误处理逻辑
    }
}
// 保存
const saveData = async (dataToSave) => {
    try {
        // 这里实现您的保存逻辑，比如发送一个包含dataToSave的POST请求到服务器
        const res = await ajax.post('/Customer/SaveAll?srcorgid=' + sobInfo.value.id, qs.stringify({ customerJSON: JSON.stringify(dataToSave) }));
        if (res.success) {
            utils.msg('导入成功', 'success', false);
            refreshtab();
        } else {

        }
    } catch (error) {
        // 处理保存失败的情况
    }
}
//导入上传前检查文件格式。
function beforeAvatarUpload(rawFile) {
    if (rawFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        && rawFile.type !== 'application/vnd.ms-excel') {
        utils.msg('要导入的文件必须是excel格式文件!', false);
        return false;
    }
    return true;
}
// 删除
async function Delete(row) {
    try {
        await ElMessageBox.confirm('确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        });
        const res = await ajax.post('/Customer/DeleteAll', qs.stringify({ id: row.id }));
        const messageType = res.success ? 'success' : 'error';
        utils.msg(res.msg, messageType, false);
        refreshtab();
    } catch (error) {
        if (error === 'cancel') {
            utils.msg('已取消删除', 'info', false);
        }
        // handle other errors
    }
}
//每页条数改变
const handleSizeChange = (size) => {
    pager.value.size = size;
    loadTableData(false);
};
//页码改变
const handleCurrentChange = (number) => {
    pager.value.number = number;
    loadTableData(false);
};
//排序
const sortChange = (order) => {
    pager.value.order = utils.getOrder(order);
    loadTableData(false);
};
// 表头单元格样式
function headerCellStyle({ row, column, rowIndex, columnIndex }) {
    return {
        color: '#000',
        textAlign: 'center',
    }
}

provide('submit_dialogshow', dialogShow);
// provide('refreshtab', refreshtab); //刷新标签
// provide('removetab', removetab); //关闭标签
// provide('openmenu', openmenu); //打开菜单

</script>

<style scoped>
@import './css/setting.css';
</style>
