<template>
    <div>
        <form v-show="false" ref="formref" action="" method="post"></form>
        <!-- 开票任务 -->
        <div class="form-container">
            <el-form ref="formbutton" inline>
                <el-form-item>
                    <el-button type="primary" @click="creats()">合并生成</el-button>
                    <el-button type="danger" @click="dels()">批量删除</el-button>
                    <el-button type="primary" @click="Searchform" icon="Search">查询</el-button>
                    <el-button type="success" @click="reset" icon="Refresh">刷新</el-button>
                    <!-- <el-button type="warning" @click="exportfiles" icon="Upload">导出</el-button> -->
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="status" style="width: 200px;">
                        <el-option v-for="item in statusList" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <!-- <div>
            <h3 class="before">待开发票</h3>
        </div> -->
        <div class="table-container">
            <el-table :data="tableData" v-loading="loading" :stripe="pager.tableStripe" border
                :highlight-current-row="pager.tableHighlightCurrentRow" max-height="800" style="width:100%;color: #000;"
                :header-cell-style="headerCellStyle" @sort-change="sortChange"
                @selection-change="handleSelectionChange">
                <el-table-column prop="id" v-if="false" width="1" />
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column v-for="(column, index) in maincolumns" :key="index" :prop="column.prop"
                    :label="column.label" :align="column.align" :width="column.width">
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right" width="200">
                    <template #default="scope">
                        <el-button type="primary" v-if="scope.row.ino_id == '' || scope.row.ino_id == null" size="small"
                            @click="creat(scope.row)">生成凭证</el-button>
                        <el-button type="danger" v-if="scope.row.ino_id != '' && scope.row.ino_id != null" size="small"
                            @click="del(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="table-text">
            <table border="0" class="table" width="900">
                <tr>
                    <td width="300" align="center">
                        发票张数：{{ invoiceCount }}张
                    </td>
                    <td width="300" align="center">
                        价税合计：{{ invoiceTotalPrice }}元
                    </td>
                    <td width="300" align="left">
                        合计税额：{{ invoiceTotalTax }}元
                    </td>
                </tr>
            </table>
        </div>
        <div class="roadui_pagerdiv">
            <el-pagination v-model:currentPage="pager.number" v-model:page-size="pager.size" :page-sizes="pager.sizes"
                :background="pager.background" :layout="pager.layout" :total="pager.total" :disabled="butDisabled"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
        <!-- 查询 -->
        <el-dialog v-model="showserch" title="查询" align-center destroy-on-close width="800px" draggable
            :close-on-click-modal="false">
            <el-form :inline="true" :model="formData" class="inline" label-width="100px">
                <el-form-item label="开票流水号">
                    <el-input v-model="formData.serino"></el-input>
                </el-form-item>
                <el-form-item label="发票号">
                    <el-input v-model="formData.invoiceno"></el-input>
                </el-form-item>
                <el-form-item label="客户名称">
                    <el-input v-model="formData.customername"></el-input>
                </el-form-item>
                <el-form-item label="开票日期">
                    <el-date-picker v-model="formData.invoiceDate" type="daterange" value-format="YYYY-MM-DD" />
                </el-form-item>
                <el-form-item style="margin-left: 30px;">
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button type="success" @click="resets">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 生成凭证页面 -->
        <el-dialog v-model="creatvisible" :title="certificateTitle" :fullscreen="fullscreens"
            @close="fullscreens = false" align-center destroy-on-close width="1300px" draggable
            :close-on-click-modal="false">
            <CreateCert v-model:id="id" v-if="sobInfo.erptype == 'T3'" v-model:billcodes="billcodes"
                v-model:serino="serino">
            </CreateCert>
            <CreateCertU8 v-model:id="id" v-if="sobInfo.erptype == 'U8'" v-model:billcodes="billcodes"
                v-model:serino="serino">
            </CreateCertU8>
            <el-icon @click="fullscreens = !fullscreens"
                style="position: absolute;right: 45px;top: 24px;cursor: pointer;font-size: 14px;">
                <FullScreen />
            </el-icon>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, shallowRef, provide, reactive, nextTick, watch, defineAsyncComponent } from 'vue'
import type { TabPaneName } from 'element-plus'
import { View, Delete, Search, Plus, Refresh, Upload } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const CreateCert = defineAsyncComponent(() => import('./Certificate.vue'))
const CreateCertU8 = defineAsyncComponent(() => import('./CertificateU8.vue'))
import axios from 'axios';
import { debounce } from 'lodash';
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
const qs = inject('qs');
const app = inject('app');
const index_openmenu = inject('index_openmenu');//首页打开菜单
const index_removetab = inject('index_removetab');//首页关闭标签方法
const index_refreshtab = inject('index_refreshtab');//首页刷新标签方式
const index_userinfo = inject('index_userinfo');//首页用户信息
const defaultOrder = ref({ prop: 'invoiceDate', order: 'ascending' });
const pager = ref(utils.getPager(defaultOrder.value));
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const butDisabled = ref(false);//按钮是否可用
const loading = ref(false);//加载状态
const showserch = ref(false);//查询弹窗
const saleid = ref('');//发票id
const sobItems = ref();//开票单位
const checkList = ref([])//单位选择
const statusList = ref([
    { id: '全部', label: '全部' },
    { id: '未生成', label: '未生成' },
    { id: '已生成', label: '已生成' },
])
const formref = ref()//ref
const creatvisible = ref(false)//生成凭证页面
const fullscreens = ref(false)//全屏
const status = ref('未生成')//状态
const serino = ref('')//销售单据号
const id = ref('')//发票id
// 选中行
const selectid = ref([]);
const billcodes = ref<any>([]);
const selectserino = ref([]);
// 发票张数
const invoiceCount = ref(0);
// 价税合计
const invoiceTotalPrice = ref(0);
// 总税额
const invoiceTotalTax = ref(0);
const delurl = ref('')//删除url
const certificateTitle = ref('生成凭证' + ' ' + sobInfo.value.erptype)
onMounted(() => {
    // 获取表格数据
    getTableData(false);
    // 获取开票单位信息
    getsobItems();
    // 导出
    // load();
})
// 主表格列
const maincolumns = ref([
    { prop: 'serialNo', label: '开票流水号', align: 'center', width: '200' },
    { prop: 'buyerName', label: '客户名称', align: 'center', width: '250' },
    { prop: 'invoiceTotalPriceTax', label: '价税合计', align: 'right', width: '100' },
    { prop: 'invoiceTotalPrice', label: '无税金额', align: 'right', width: '100' },
    { prop: 'invoiceTotalTax', label: '税额', align: 'center', width: '110' },
    { prop: 'ino_id', label: '凭证号', align: 'center', width: '180' },
    { prop: 'pzdate', label: '凭证日期', align: 'center', width: '170' },
    { prop: 'invoiceDate', label: '开票日期', align: 'center', width: '180' },
    // { prop: 'invoiceNo', label: '发票号', align: 'center', width: '250' },
]);
//表单数据
const formData = ref({
    serino: '',//销售单据号
    invoiceno: '',//发票号
    customername: '',//客户名称
    invoiceDate: utils.getMonth(),//单据日期
});
// 监听status变化，当status变化时，重新加载表格数据
watch(status, (newVal, oldVal) => {
    getTableData(true);
});
// 表格数据1
const tableData = ref([]);
// 获取表格数据
async function getTableData(isQuery) {
    loading.value = true;
    try {
        if (isQuery) {
            pager.value.number = 1;
        }
        formData.value.size = pager.value.size
        formData.value.number = pager.value.number
        formData.value.order = pager.value.order
        if (formData.value.invoiceDate != null) {
            formData.value.date1 = formData.value.invoiceDate[0]
            formData.value.date2 = formData.value.invoiceDate[1]
        } else {
            formData.value.date1 = ''
            formData.value.date2 = ''
        }
        // formData.value.date1 = formData.value.invoiceDate[0]
        // formData.value.date2 = formData.value.invoiceDate[1]
        formData.value.type = '已开票'
        formData.value.status = status.value
        const res = await ajax.post('/Accouch/GetList?srcorgid=' + sobInfo.value.id, qs.stringify(formData.value));
        if (res.data.rows.length > 0) {
            tableData.value = res.data.rows
            invoiceCount.value = res.data.total;
            saleid.value = res.data.rows[0].id;
            pager.value.total = res.data.total;
            invoiceTotalPrice.value = 0;
            invoiceTotalTax.value = 0;
            // 发票总金额等于res.data.invoicemain.invoiceTotalPrice的总和
            // 发票总税额等于res.data.invoicemain.invoiceTotalTax的总和
            for (let i = 0; i < res.data.rows.length; i++) {
                invoiceTotalPrice.value = Number((invoiceTotalPrice.value + Number(res.data.rows[i].invoiceTotalPriceTax)).toFixed(2))
                invoiceTotalTax.value = Number((invoiceTotalTax.value + Number(res.data.rows[i].invoiceTotalTax)).toFixed(2))
            }
        } else {
            tableData.value = res.data.rows
            invoiceCount.value = res.data.total;
            saleid.value = '0';
            pager.value.total = res.data.total;
            // 发票总金额等于res.data.invoicemain.invoiceTotalPrice的总和
            // 发票总税额等于res.data.invoicemain.invoiceTotalTax的总和
            for (let i = 0; i < res.data.rows.length; i++) {
                invoiceTotalPrice.value = Number((invoiceTotalPrice.value + Number(res.data.rows[i].invoiceTotalPriceTax)).toFixed(2))
                invoiceTotalTax.value = Number((invoiceTotalTax.value + Number(res.data.rows[i].invoiceTotalTax)).toFixed(2))
            }
        }
    } catch (error) {
        butDisabled.value = false;
        loading.value = false;
        // 这里可以添加你的错误处理逻辑
    } finally {
        loading.value = false;
    }
}
// 生成凭证
const creat = (row) => {
    id.value = row.id
    serino.value = row.serialNo
    billcodes.value = row.billcode
    creatvisible.value = true;
}
const creats = () => {
    if (selectid.value.length == 0) {
        ElMessage({
            message: '请选择发票信息',
            type: 'warning',
            duration: 2000,
            showClose: false,
        });
        return;
    }
    id.value = selectid.value
    serino.value = selectserino.value
    creatvisible.value = true;
}
// 查询
const Searchform = () => {
    showserch.value = true;
}
// 刷新
const reset = () => {
    debounce(() => {
        invoiceTotalTax.value = 0;
        invoiceTotalPrice.value = 0;
        formData.value = {
            serino: '',//销售单据号
            customername: '',//客户名称
            invoiceDate: '',//单据日期
            status: '开票完成',//状态
        }
        getTableData(true);
    }, 300)();
}
const resets = () => {
    debounce(() => {
        invoiceTotalTax.value = 0;
        invoiceTotalPrice.value = 0;
        formData.value = {
            serino: '',//销售单据号
            customername: '',//客户名称
            invoiceDate: '',//单据日期
            status: '开票完成',//状态
        }
        // getTableData(true);
    }, 300)();
}
// 获取开票单位信息
// 开票单位
const getsobItems = async () => {
    try {
        const res = await ajax.post('user/GetUserInvoiceDepartByUser', qs.stringify({ userid: index_userinfo.value.userId }));
        if (res.success) {
            checkList.value = res.data;
            if (res.data.length > 0) {
                sobItems.value = res.data[0].id;
            }
        }
    } catch (error) {
        // 这里可以添加你的错误处理逻辑
    }
}
// 查询
const search = () => {
    invoiceTotalTax.value = 0;
    invoiceTotalPrice.value = 0;
    pager.value.number = 1;
    getTableData(true);
    showserch.value = false;
}
// 批量删除
const dels = () => {
    if (selectid.value.length == 0) {
        ElMessage({
            message: '请选择发票信息',
            type: 'warning',
            duration: 2000,
            showClose: false,
        });
        return;
    }
    if (sobInfo.value.erptype == 'U8') {
        delurl.value = 'DeleteU8Vouch'
    } else if (sobInfo.value.erptype == 'T3') {
        delurl.value = 'DeleteT3Vouch'
    }
    dels1();
}
const dels1 = () => {
    ElMessageBox.confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        ajax.post('/Accouch/' + delurl.value, qs.stringify({ invoiceids: selectid.value, billcodes: billcodes.value })).then((res) => {
            if (res.success) {
                ElMessage({
                    message: res.msg,
                    type: 'success',
                    duration: 2000,
                    showClose: false,
                });
                getTableData(false);
            } else {
                ElMessage({
                    message: res.msg,
                    type: 'error',
                    duration: 2000,
                    showClose: false,
                });
            }
        }).catch((error) => {
            ElMessage({
                message: '删除失败',
                type: 'error',
                duration: 2000,
                showClose: false,
            });
        });
    }).catch(() => {
    });
}
// 删除
const del = (row) => {
    if (sobInfo.value.erptype == 'U8') {
        delurl.value = 'DeleteU8Vouch'
    } else if (sobInfo.value.erptype == 'T3') {
        delurl.value = 'DeleteT3Vouch'
    }
    ElMessageBox.confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        ajax.post('/Accouch/' + delurl.value, qs.stringify({ invoiceids: row.id, billcodes: row.billcode })).then((res) => {
            if (res.success) {
                ElMessage({
                    message: res.msg,
                    type: 'success',
                    duration: 2000,
                    showClose: false,
                });
                getTableData(false);
            } else {
                ElMessage({
                    message: res.msg,
                    type: 'error',
                    duration: 2000,
                    showClose: false,
                });
            }
        }).catch((error) => {
            ElMessage({
                message: '删除失败',
                type: 'error',
                duration: 2000,
                showClose: false,
            });
        });
    }).catch(() => {
    });
}
//每页条数改变
const handleSizeChange = (size) => {
    pager.value.size = size;
    getTableData(false);
};
//页码改变
const handleCurrentChange = (number) => {
    invoiceTotalTax.value = 0;
    invoiceTotalPrice.value = 0;
    pager.value.number = number;
    getTableData(false);
};
// 表头单元格样式
function headerCellStyle({ row, column, rowIndex, columnIndex }) {
    return {
        color: '#000',
        textAlign: 'center',
    }
}
//排序
const sortChange = (order) => {
    pager.value.order = utils.getOrder(order);
    getTableData(false);
};
// 多选
const handleSelectionChange = (val) => {
    // 选中行的id,用逗号隔开
    selectid.value = val.map((item) => item.id).join(',');
    billcodes.value = val.map((item) => item.billcode).join(',');
    // 选中行的销售单据号,用逗号隔开
    selectserino.value = val.map((item) => item.serialNo).join(',');
};



</script>

<style scoped>
@import './css/task.css';
@import './css/tasklist.css';
@import '../../roadui-assets/before.css';

#Iframe {
    border-width: 1px;
}
</style>