<template>
    <div>
        <table border="0" cellpadding="1" cellspacing="1"
            style="border-color: #eee;border-width: 1px;color: #000;width: 100%;margin-bottom: 0;" class="table">
            <tbody>
                <tr>
                    <td align="left">
                        开票流水号：
                        <!-- <el-input v-model="formData.serino"></el-input> -->
                        {{ formData.serino }}
                    </td>
                </tr>
            </tbody>
        </table>
        <table border="0" cellpadding="1" cellspacing="1"
            style="border-color: #eee;border-width: 1px;color: #000;width: 100%;margin-bottom: 0;" class="table">
            <tbody style="padding-left: 25px;">
                <tr style="margin-top:10px;">
                    <td align="right">
                        制单人：
                    </td>
                    <td>
                        <el-form-item prop="makername">
                            <el-input v-model="formData.makername"></el-input>
                        </el-form-item>
                    </td>
                    <td align="right">
                        凭证日期：
                    </td>
                    <td>
                        <el-form-item prop="billdate">
                            <el-date-picker v-model="formData.billdate" value-format="YYYY-MM-DD" type="date" />
                        </el-form-item>
                    </td>
                    <td align="right">
                        凭证类别：
                    </td>
                    <td>
                        <el-form-item prop="isignseq">
                            <el-select v-model="formData.isignseq" clearable @change="changeisignseq" placeholder="请选择">
                                <el-option v-for="item in isignseqlist" :key="item.isignseq" :label="item.csign"
                                    :value="item.isignseq" />
                            </el-select>
                        </el-form-item>
                    </td>
                    <td align="right">
                        单据张数：
                    </td>
                    <td>
                        <el-form-item prop="pagecount">
                            <el-input v-model="formData.pagecount"></el-input>
                        </el-form-item>
                    </td>
                </tr>
                <tr style="margin-top:10px">
                    <td align="right">
                    </td>
                    <td align="right">
                        <el-form-item>
                            <el-button type="primary" @click="createpz">生成凭证</el-button>
                        </el-form-item>
                    </td>
                </tr>
            </tbody>
        </table>
        <el-table class="eltable" :data="tableData" :summary-method="getSummaries" show-summary v-loading="loading"
            :stripe="pager.tableStripe" border :highlight-current-row="pager.tableHighlightCurrentRow" max-height="500"
            style="width: 100%; color: #000;margin-top: 10px;" :header-cell-style="headerCellStyle"
            :default-sort="defaultOrder" @selection-change="handleSelectionChange" :row-style="changRed">
            <el-table-column prop="projectcode" align="center" label="会计科目编号" width="120" />
            <el-table-column prop="projectname" align="center" label="会计科目名称" width="230" />
            <el-table-column label="操作" align="center" width="100">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="Selectproject(scope.row)">选择科目</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="md" label="借方金额" align="right" width="150" />
            <el-table-column prop="mc" label="贷方金额" align="right" width="150" />
            <el-table-column prop="cdigest" label="摘要" fit show-overflow-tooltip min-width="75%" />
            <el-table-column label="辅助核算" width="600">
                <el-table-column prop="customercode" label="客户编号" v-if="false" fit show-overflow-tooltip />
                <el-table-column prop="customername" label="客户" fit show-overflow-tooltip />
                <el-table-column align="center" label="选择客户" width="100">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="SelectCustomer(scope.row)">选择客户</el-button>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
        <!-- 选择科目 -->
        <el-dialog v-model="Selectpro" title="选择科目" @open="openSelectP" :fullscreen="fullscreen"
            @close="fullscreen = false" align-center destroy-on-close width="800px" draggable
            :close-on-click-modal="false">
            <el-icon @click="fullscreen = !fullscreen"
                style="position: absolute;right: 45px;top: 24px;cursor: pointer;font-size: 14px;">
                <FullScreen />
            </el-icon>
            <el-form :inline="true" :model="formproject">
                <el-form-item label="科目编号" prop="code" style="margin-left: 20px;">
                    <el-input v-model="formproject.code" clearable placeholder="请输入会计科目编号" />
                </el-form-item>
                <el-form-item label="科目名称" prop="name" style="margin-left: 20px;">
                    <el-input v-model="formproject.name" clearable placeholder="请输入会计科目名称" />
                </el-form-item>
                <el-form-item style="margin-left: 20px;">
                    <el-button type="primary" @click="getProjectData()">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table class="eltable" :data="tableDatas" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" max-height="500"
                style="width: 100%; color: #000;margin-top: 10px;" :header-cell-style="headerCellStyle"
                :default-sort="defaultOrder">
                <el-table-column prop="ccode" align="center" label="会计科目编号" min-width="200" />
                <el-table-column prop="ccode_name" align="center" label="会计科目名称" min-width="200" />
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="Select1(scope.row)">选择科目</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div class="roadui_pagerdiv">
                <el-pagination v-model:currentPage="pagers.number" v-model:page-size="pagers.size"
                    :page-sizes="pagers.sizes" :background="pagers.background" :layout="pagers.layout" :total="pagers.total"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div> -->
        </el-dialog>
        <!-- 选择客户 -->
        <el-dialog v-model="SelectCus" title="选择客户" @open="openSelectC" :fullscreen="fullscreens"
            @close="fullscreens = false" align-center destroy-on-close width="1000px" draggable
            :close-on-click-modal="false">
            <el-icon @click="fullscreens = !fullscreens"
                style="position: absolute;right: 45px;top: 24px;cursor: pointer;font-size: 14px;">
                <FullScreen />
            </el-icon>
            <el-form :inline="true" :model="formcustom">
                <el-form-item label="客户编号" prop="code" style="margin-left: 20px;">
                    <el-input v-model="formcustom.code" clearable placeholder="请输入客户编号" />
                </el-form-item>
                <el-form-item label="客户名称" prop="name" style="margin-left: 20px;">
                    <el-input v-model="formcustom.name" clearable placeholder="请输入客户名称" />
                </el-form-item>
                <el-form-item style="margin-left: 20px;">
                    <el-button type="primary" @click="getCustomData()">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table class="eltable" :data="tableDatass" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" max-height="500"
                style="width: 100%; color: #000;margin-top: 10px;" :header-cell-style="headerCellStyle"
                :default-sort="defaultOrder">
                <el-table-column prop="cCusCode" align="center" label="客户编号" min-width="200" />
                <el-table-column prop="cCusName" align="center" label="客户名称" min-width="200" />
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="Select2(scope.row)">选择客户</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, computed, onMounted, inject, watch, onUnmounted, nextTick, shallowRef, provide } from 'vue';
import { View, Edit, Search, Plus, Refresh, Tools, Delete, Files, Select, Close } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const ajax = inject('ajax');
const utils = inject('utils');
const qs = inject('qs');
const config = inject('config');
const index_openmenu = inject('index_openmenu');//首页打开菜单
const index_removetab = inject('index_removetab');//首页关闭标签方法
const index_refreshtab = inject('index_refreshtab');//首页刷新标签方式
const index_dialogshow = inject('index_dialogshow');//首页弹出modal显示
const index_regcomponent = inject('index_regcomponent');//首页注册组件
const index_userinfo = inject('index_userinfo');//首页用户信息
const defaultOrder = ref({ prop: '', order: 'ascending' });
const pager = ref(utils.getPager(defaultOrder.value));
const loading = ref(false);//加载中
const fullscreen = ref(false);//选择科目
const fullscreens = ref(false);//选择客户
const Selectpro = ref(false);//选择科目
const SelectCus = ref(false);//选择客户
const selectid = ref('');//选择当前行id
// 创建emits
const emits = defineEmits(['update:id', 'update:serino', 'update:billcodes', 'update:modelValue'])
// 创建props
const props = defineProps({
    query: { type: String, default: () => { return ''; } },
    modelValue: { type: Boolean, default: false },
    id: { type: String, default: "" },
    serino: { type: String, default: "" },
    billcodes: { type: String, default: "" },
})
// 创建计算属性
function createComputed(propName) {
    return computed({
        get: () => props[propName],
        set: (val) => {
            emits(`update:${propName}`, val)
        }
    })
}
const id = createComputed('id')
const serino = createComputed('serino')
const billcodes = createComputed('billcodes')

onMounted(() => {
    // 获取表格数据
    getData();
    // 获取凭证类别
    getisignseq();
    formData.value.makername = index_userinfo.value.userName
    formData.value.serino = serino.value
    formData.value.invoiceids = id.value
    formData.value.billcodes = billcodes.value
})

// 表单数据
const formData = ref({
    serino: '',//开票流水号
    makername: '',//制单人
    billdate: utils.getNowFormatDate(),//凭证日期
    isignseq: '',//凭证类别
    pagecount: '',//单据张数
    isignseq: '',//凭证类别编号
    csign: '',//凭证类别名称
})
const formproject = ref({
    code: '',//会计科目编号
    name: '',//会计科目名称
    databasetype: 'T3',
})
const formcustom = ref({
    code: '',//客户编号
    name: '',//客户名称
    databasetype: 'T3',
})
// 凭证类别
const isignseqlist = ref([])
// 凭证类别
const getisignseq = async () => {
    try {
        const res = await ajax.post('Accouch/GetSign', qs.stringify({ databasetype: 'T3' }));
        if (res.success) {
            isignseqlist.value = res.data.Sign;
        }
    } catch (error) {
        // 这里可以添加你的错误处理逻辑
    }
}
// 生成凭证
const createpz = async () => {
    if (formData.value.serino == '') {
        utils.confirm('请输入开票流水号');
        return;
    }
    if (formData.value.makername == '') {
        utils.confirm('请输入制单人');
        return;
    }
    if (formData.value.isignseq == '') {
        utils.confirm('请选择凭证类别');
        return;
    }
    if (formData.value.pagecount == '') {
        utils.confirm('请输入单据张数');
        return;
    }
    try {
        const res = await ajax.post('Accouch/CreateT3Vouch', qs.stringify({ isignseq: formData.value.isignseq, pagecount: formData.value.pagecount, csign: formData.value.csign, billdate: formData.value.billdate, invoiceids: formData.value.invoiceids, billcodes: formData.value.billcodes, accvouchJSON: JSON.stringify(tableData.value) }));
        if (res.success) {
            ElMessage.success(res.msg);
            index_refreshtab()
        } else {
            ElMessageBox.alert(res.msg, '提示', {
                // if you want to disable its autofocus
                // autofocus: false,
                confirmButtonText: 'OK',
                type: 'error',
                callback: (action) => {

                },
            })
        }
    } catch (error) {
        // 这里可以添加你的错误处理逻辑
    }
}
// 销售方名称查询
function changeisignseq(row) {
    // 假设checklist是在当前组件的data属性中定义的
    let isignseqlistItem = isignseqlist.value.find(item => item.isignseq === row);
    if (isignseqlistItem) {
        formData.value.isignseq = isignseqlistItem.isignseq;
        formData.value.csign = isignseqlistItem.csign;
    } else {
    }
}

// 表格数据
const tableData = ref([]);
const tableDatas = ref([]);
const tableDatass = ref([]);
const getData = async () => {
    loading.value = true;
    try {
        const res = await ajax.post('Accouch/GetAccvouchT3', qs.stringify({ ids: id.value }));
        tableData.value = res.data.Accvouch;
        formData.value.isignseq = res.data.main.isignseq;
        formData.value.csign = res.data.main.csign;
        formData.value.pagecount = res.data.main.pagecount;
    } catch (err) {
        // 这里可以添加错误处理逻辑
    } finally {
        loading.value = false;
    }
}

// 合计
const getSummaries = (param) => {
    const { columns, data } = param
    const sums = []
    const columnsToShowSum = ['md', 'mc']

    columns.forEach((column, index) => {
        if (index === 0) {
            sums[index] = '合计'
            return
        }
        if (columnsToShowSum.includes(column.property)) {
            const values = data.map((item) => Number(item[column.property]))
            if (!values.every((value) => Number.isNaN(value))) {
                sums[index] = ` ${values.reduce((prev, curr) => {
                    const value = Number(curr)
                    if (!Number.isNaN(value)) {
                        return Number(prev) + Number(curr)
                    } else {
                        return Number(prev)
                    }
                }, 0).toFixed(2)}`
            } else {
                sums[index] = ''
            }
        } else {
            sums[index] = ''
        }
    })
    return sums
}

// 选择科目
const Selectproject = (row) => {
    selectid.value = row.id;
    Selectpro.value = true;
}
const Select1 = (row) => {
    tableData.value.forEach((item, index) => {
        if (item.id == selectid.value) {
            tableData.value[index].projectcode = row.ccode;
            tableData.value[index].projectname = row.ccode_name;
        }
    })
    Selectpro.value = false;
}
// 选择客户
const SelectCustomer = (row) => {
    selectid.value = row.id;
    SelectCus.value = true;
}
const Select2 = (row) => {
    tableData.value.forEach((item, index) => {
        if (item.id == selectid.value) {
            tableData.value[index].customercode = row.cCusCode;
            tableData.value[index].customername = row.cCusName;
        }
    })
    SelectCus.value = false;
}
// 打开选择科目页面调用
const openSelectP = () => {
    getProjectData()
    // getCustomData()
}
const openSelectC = () => {
    getCustomData()
}

async function getProjectData() {
    try {
        const res = await ajax.post('/Accouch/GetProject', qs.stringify(formproject.value));
        tableDatas.value = res.data.U8Project
    } catch (error) {
        // 这里可以添加你的错误处理逻辑
    } finally {
    }
}
async function getCustomData() {
    try {
        const res = await ajax.post('/Accouch/GetCustomer', qs.stringify(formcustom.value));
        tableDatass.value = res.data.U8Customer
    } catch (error) {
        // 这里可以添加你的错误处理逻辑
    } finally {
    }
}











// 多选
const handleSelectionChange = (val) => {
    selectrow.value = val
}

// 表头单元格样式
function headerCellStyle({ row, column, rowIndex, columnIndex }) {
    return {
        color: '#000',
        textAlign: 'center',
    }
}
</script>

<style lang="scss" scoped>
.table {
    border-collapse: collapse;
    line-height: 40px;
}

:deep(.el-form-item) {
    margin: 0px;
}

:deep(.el-table__border-left-patch) {
    background-color: #eee;
    width: 0.5px;
}

:deep(.el-table--border::after) {
    background-color: #eee;
    /* width: 0.5px; */
}

:deep(.el-table__inner-wrapper::before) {
    background-color: #eee;
    height: 0.5px;
}

:deep(.el-table) {
    border-color: #6f4946 !important;
}

:deep(.el-form-item__label) {
    color: #6f4946
}
</style>