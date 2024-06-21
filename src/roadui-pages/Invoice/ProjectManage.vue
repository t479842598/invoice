<style scoped>
:deep(.el-drawer__header) {
    margin-bottom: 5px;
    border-bottom: 1px solid #e6e6e6;
    padding-top: 10px;
}

:deep(.el-drawer__footer) {
    border-top: 1px solid #e6e6e6;
    padding-bottom: 10px;
}

:deep(.el-form-item) {
    margin-bottom: 20px;
}
</style>
<template>
    <div>
        <!-- 项目档案管理 -->
        <div class="form-container">
            <el-form :inline="true" :model="formData">
                <el-form-item label=" 项目名称">
                    <el-input v-model="formData.productname"></el-input>
                </el-form-item>
                <el-form-item label="税率/征收率">
                    <!-- <el-input v-model="formData.taxno" style="width: 230px;" clearable></el-input> -->
                    <el-select v-model="formData.taxrate" placeholder="">
                        <el-option v-for="item in checkList" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadTableData(true)" :disabled="butDisabled"
                        icon="Search">查询</el-button>
                    <el-button type="primary" @click="addNew" icon="Plus" :disabled="butDisabled">新增</el-button>
                    <el-upload ref="upload" :limit="1" style="margin-left: 10px;margin-bottom: 2px;" :on-change="changeFn"
                        :on-exceed="handleExceed" accept=".xlsx,.xls" :auto-upload="false"
                        :before-upload="beforeAvatarUpload" :show-file-list="false">
                        <template #trigger>
                            <el-button icon="Upload" type="warning">导入Excel</el-button>
                        </template>
                    </el-upload>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-container">
            <el-table :data="tableData" v-loding="loading" :height="height" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" style="width: 100%; color: #000 "
                :header-cell-style="headerCellStyle" v-bind="$attrs" @current-change="tableCurrentChange">
                >
                <el-table-column prop="id" v-if="false" width="1" />
                <el-table-column v-for="(item, index) in tableColumns" :key="index" :prop="item.prop" :label="item.label"
                    :align="item.align" :min-width="item.width" fit show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作" align="left" width="200" fixed="right">
                    <template #default="scope">
                        <el-button size="small" type="success" @click="onView(scope.row)">详情</el-button>
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
            <!-- <el-dialog v-model="dialogShow" :title="dialogTitle" align-center destroy-on-close width="600px" draggable
                :close-on-click-modal="false">
                <Add v-model:id="id" v-model="rowdata"></Add>
            </el-dialog> -->
            <el-drawer v-model="dialogShow" direction="rtl" @opened="draweOpen" size="35%" @closed="draweClose(ruleFormRef)"
                destroy-on-close close-on-click-modal="false">
                <template #header>
                    <h3 style="color: #333333;font-weight: 500;">{{ dialogTitle }}</h3>
                </template>
                <template #default>
                    <!-- <div style="padding: 0px 20px;"> -->
                    <div style="padding-left: 40px;" v-loading="draweloading" element-loading-text="加载中...">
                        <el-form :model="draweData" ref="ruleFormRef" :rules="rules" inline label-position="top"
                            label-width="100px">
                            <el-form-item prop="goodsName" label="项目名称">
                                <el-input v-if="!isview" v-model="draweData.goodsName" clearable style="width: 390px"
                                    placeholder="请输入"></el-input>
                                <div v-else style="width: 390px">{{ draweData.goodsName }}</div>
                            </el-form-item>
                            <el-form-item prop="goodsCode" label="商品和服务税收分类编码">
                                <el-input v-if="!isview" v-model="draweData.goodsCode" clearable style="width: 390px"
                                    placeholder="请输入"></el-input>
                                <div v-else style="width: 390px">{{ draweData.goodsCode }}</div>
                            </el-form-item>
                            <el-form-item prop="goodsSimpleName" label="商品和服务分类简称">
                                <el-input v-if="!isview" v-model="draweData.goodsSimpleName" clearable style="width: 390px"
                                    placeholder="请输入"></el-input>
                                <div v-else style="width: 390px">{{ draweData.goodsSimpleName }}</div>
                            </el-form-item>
                            <el-form-item prop="preferentialMarkFlag" label="优惠政策及简易计税">
                                <el-radio-group :disabled="isview" v-model="draweData.preferentialMarkFlag">
                                    <el-radio label="1">是</el-radio>
                                    <el-radio label="0">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="优惠政策类型">
                                <el-select :disabled="isview" v-model="draweData.vatSpecialManagement" clearable
                                    placeholder="请选择优惠政策类型">
                                    <el-option label="不征税" value="不征税" />
                                    <el-option label="免税" value="免税" />
                                    <el-option label="先征后退" value="先征后退" />
                                    <el-option label="100%先征后退" value="100%先征后退" />
                                    <el-option label="50%先征后退" value="50%先征后退" />
                                    <el-option label="简易征收" value="简易征收" />
                                    <el-option label="即征即退30%" value="即征即退30%" />
                                    <el-option label="即征即退50%" value="即征即退50%" />
                                    <el-option label="即征即退70%" value="即征即退70%" />
                                    <el-option label="即征即退100%" value="即征即退100%" />
                                    <el-option label="超税负3%即征即退" value="超税负3%即征即退" />
                                    <el-option label="超税负6%即征即退" value="超税负6%即征即退" />
                                    <el-option label="超税负8%即征即退" value="超税负8%即征即退" />
                                    <el-option label="超税负12%即征即退" value="超税负12%即征即退" />
                                    <el-option label="稀土产品" value="稀土产品" />
                                    <el-option label="按5%简易征收减按1.5%计征" value="按5%简易征收减按1.5%计征" />
                                    <el-option label="按5%简易征收" value="按5%简易征收" />
                                    <el-option label="按3%简易征收" value="按3%简易征收" />
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="freeTaxMark" label="是否选择普通零税率">
                                <el-radio-group :disabled="isview" v-model="draweData.freeTaxMark">
                                    <el-radio label="1">是</el-radio>
                                    <el-radio label="0">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item prop="taxrate" label="税率/征收率">
                                <el-select :disabled="isview" v-model="draweData.taxrate" placeholder="" clearable>
                                    <el-option v-for="item in checkList" :key="item.id" :label="item.label"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="priceTaxMark" label="是否含税">
                                <el-radio-group :disabled="isview" v-model="draweData.priceTaxMark">
                                    <el-radio label="0">不含税</el-radio>
                                    <el-radio label="1">含税</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <div style="margin-left: 10px;">
                                <el-form-item prop="price" label="单价">
                                    <el-input v-if="!isview" v-model="draweData.price" style="width: 220px;" clearable
                                        placeholder="请输入"></el-input>
                                    <div v-else style="width: 220px;">{{ draweData.price }}</div>
                                </el-form-item>
                            </div>
                            <el-form-item prop="unitname" label="单位">
                                <el-input v-if="!isview" v-model="draweData.unitname" clearable style="width: 140px;"
                                    placeholder="请输入"></el-input>
                                <div v-else style="width: 140px;">{{ draweData.unitname }}</div>
                            </el-form-item>
                            <el-form-item prop="spec" label="规格型号">
                                <el-input v-if="!isview" v-model="draweData.spec" clearable style="width: 220px;"
                                    placeholder="请输入"></el-input>
                                <div v-else style="width: 220px;">{{ draweData.unitname }}</div>
                            </el-form-item>
                        </el-form>
                    </div>
                </template>
                <template #footer>
                    <div style="flex: auto;text-align: left;">
                        <el-button type="primary" v-if="!isview" @click="submitForm(ruleFormRef)">保存</el-button>
                        <el-button v-if="!isview" @click="resetForm(ruleFormRef)">取消</el-button>
                        <el-button v-else @click="resetForm(ruleFormRef)">关闭</el-button>
                    </div>
                </template>
            </el-drawer>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, shallowRef, provide, reactive, nextTick, watch, computed, defineAsyncComponent } from 'vue'
import { View, Edit, Search, Plus, Refresh, Tools } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { excelExportUseJson, excelImport } from "../../roadui-assets/excel";
import { ElLoading } from 'element-plus'
import axios from 'axios';
// const Add = defineAsyncComponent(() => import('./ProjectManageAdd.vue'))
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
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
const draweloading = ref(false);//抽屉加载状态
const ruleFormRef = ref()
const id = ref('');//id
const isview = ref(false);//是否查看
const height = ref(document.documentElement.clientHeight - 250);//表格高度
window.onresize = function () {
    height.value = document.documentElement.clientHeight - 250;
};
//表单验证
const rules = reactive({
    goodsName: [
        { required: true, message: '请输入项目名称', trigger: 'blur' },
    ],
    goodsCode: [
        { required: true, message: '商品和服务税收分类编码', trigger: 'blur' },
    ],
    goodsSimpleName: [
        { required: true, message: '商品和服务分类简称', trigger: 'blur' },
    ],
    taxrate: [
        {
            required: true,
            message: '请选择税率/征收率',
            trigger: 'change',
        },
    ],
})
onMounted(() => {
    loadTableData(false);
});
const checkList = ref([
    { id: '0', label: '0' },
    { id: '0.01', label: '1%' },
    { id: '0.03', label: '3%' },
    { id: '0.06', label: '6%' },
    { id: '0.09', label: '9%' },
    { id: '0.13', label: '13%' },
])//账套选择
// 表格循环列
const tableColumns = [
    // { prop: 'customercode', label: '客户编号', width: '200' },
    { prop: 'goodsName', label: '项目名称', width: '180', align: 'left' },
    { prop: 'taxratename', label: '税率/征收率', width: '120', align: 'center' },
    { prop: 'spec', label: '规格型号', width: '160', align: 'left' },
    { prop: 'price', label: '单价', width: '120', align: 'center' },
    { prop: 'priceTaxMark', label: '含税标志', width: '110', align: 'center' },
    { prop: 'goodsCode', label: '商品和服务税收分类编码', width: '180', align: 'center' },
    { prop: 'goodsSimpleName', label: '商品和服务分类简称', width: '180', align: 'left' },
    { prop: 'unitname', label: '单位', width: '100', align: 'center' },
]
// 导入配置
// 购置设备明细导入
const upload = ref();
const handleExceed = (files) => {
    upload.value!.clearFiles()
    const file = files[0]
    upload.value!.handleStart(file);
}
const addnewid = ref('');//新增ID
const newTableData = ref<any>([]);//表格数据
const changeFn = async (file) => {
    try {
        const res = await ajax.post("/Flow/GetLongId");
        addnewid.value = res.data; // 假设addnewid用于记录最近一次生成的ID，这里直接赋值
        const arr = await excelImport(file.raw as File);
        arr.forEach((item, index) => {
            newTableData.value.push({
                id: addnewid.value + index, // 确保每个item的id唯一，这里基于newId递增，但需注意这可能不适用于所有场景，特别是当每次请求返回的ID不连续时
                goodsName: item["项目名称"],
                projectName: item["项目名称"],
                spec: item["规格型号"],
                goodsCode: item["商品和服务税收分类编码"],
                price: item["单价"],
                priceTaxMark: 1,
                taxratename: Number(item["税率/征收率"]) * 100 + '%',
                taxrate: item["税率/征收率"],
                unitname: item["单位"],
                preferentialMarkFlag: item["是否使用优惠政策"] == '是' ? 1 : 0,
                vatSpecialManagement: item["优惠政策类型"],
            });
        });
        await saveData(newTableData.value);
    } catch (error) {
        // 可以在这里添加错误处理逻辑
    }
}
// 保存
const saveData = async (dataToSave) => {
    try {
        // 这里实现您的保存逻辑，比如发送一个包含dataToSave的POST请求到服务器
        const res = await ajax.post('/invoiceproduct/SaveAll?srcorgid=' + sobInfo.value.id, qs.stringify({ productJSON: JSON.stringify(dataToSave) }));
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
//表单数据
const formData = ref({
    productname: '',//项目名称
    taxrate: '',//税率/征收率
});
//弹框数据
const draweData = ref({
    goodsName: '',//项目名称
    goodsCode: '',//商品和服务税收分类编码
    goodsSimpleName: '',//商品和服务分类简称
    taxrate: '',//税率/征收率
    spec: '',//规格型号
    price: '',//单价
    priceTaxMark: '0',//含税标志
    unitname: '',//单位
    preferentialMarkFlag: '0',//是否是优惠政策
    vatSpecialManagement: '',//优惠政策分类
    freeTaxMark: '0',//是否是零税率
})
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
    ajax.post('/invoiceproduct/GetList?srcorgid=' + sobInfo.value.id, qs.stringify(formData.value)).then((res) => {
        tableData.value = res.data.rows;
        pager.value.total = res.data.total;
        butDisabled.value = false;
        loading.value = false;
    }).catch(() => { butDisabled.value = false; loading.value = false; });
};
// 打开抽屉回调
const draweOpen = async () => {
    try {
        draweloading.value = true;

        const response = await ajax.post('/invoiceproduct/Get', qs.stringify({ id: id.value }));

        draweData.value = response.data.invoice_product;
        draweloading.value = false; // 立即关闭加载动画
    } catch (error) {
    }
};
// 关闭抽屉回调
const draweClose = (formEl) => {
    // draweData.value = {}
    formEl.resetFields()
};
//新增
const dialogTitle = ref('');
// const dialogPage = shallowRef(null);
const dialogShow = ref(false);//是否显示窗口
const addNew = () => {
    id.value = '';
    dialogTitle.value = '新增';
    isview.value = false;
    // dialogPage.value = Add;
    dialogShow.value = true;
};
// 修改
const onEdit = (row) => {
    id.value = row.id;
    dialogTitle.value = '修改';
    isview.value = false;
    // dialogPage.value = Add;
    dialogShow.value = true;
};
//查看
const onView = (row) => {
    id.value = row.id;
    dialogTitle.value = '查看';
    isview.value = true;
    //dialogPage.value = Add;
    dialogShow.value = true;
}
//表单提交
const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            ajax.post('/invoiceproduct/Save?srcorgid=' + sobInfo.value.id, qs.stringify({ productJSON: JSON.stringify(draweData.value) })).then((res) => {
                const messageType = res.success ? 'success' : 'error';
                utils.msg(res.msg, messageType, false);
                if (res.success) {
                    dialogShow.value = false;
                    loadTableData(false);
                }
            }).catch(() => { });
        } else {
        }
    })
}

//重置表单
const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
    dialogShow.value = false;
}
// 删除
async function Delete(row) {
    try {
        await ElMessageBox.confirm('确定删除该项目吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        });
        const res = await ajax.post('/invoiceproduct/DeleteAll', qs.stringify({ id: row.id }));
        const messageType = res.success ? 'success' : 'error';
        utils.msg(res.msg, messageType, false);
        if (res.success) {
            formData.value.productname = ''
            formData.value.taxrate = ''
            loadTableData();
        }
    } catch (error) {
        if (error === 'cancel') {
            utils.msg('已取消删除', 'info', false);
        }
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

// provide('submit_dialogshow', dialogShow);
// provide('refreshtab', refreshtab); //刷新标签
// provide('removetab', removetab); //关闭标签
// provide('openmenu', openmenu); //打开菜单

</script>
