<template>
    <!-- 客户管理平台新增，修改，详情 -->
    <div class="custom-submit" style="height: 72vh;overflow: hidden;overflow-y: scroll;">
        <el-card class="box-card" shadow="never">
            <el-form ref="formbutton" inline label-width="120px">
                <el-form-item>
                    <el-button type="primary" @click="save">保存</el-button>
                    <el-button type="default" @click="close">关闭</el-button>
                    <el-button type="danger" @click="DeleAll">删除</el-button>
                </el-form-item>
            </el-form>
            <!-- 基本信息 -->
            <table border="0" cellpadding="1" cellspacing="1" width="890" class="table">
                <tbody>
                    <tr>
                        <td width="100" class="center">客户编号</td>
                        <td>
                            {{ form.customercode }}
                        </td>
                        <td width="100" class="center">客户名称</td>
                        <td colspan="3">
                            <el-input v-model="form.customername"></el-input>
                        </td>
                        <td width="100" class="center">状态</td>
                        <td>
                            <el-select style="width: 160px;" v-model="form.status" placeholder="请选择">
                                <el-option label="启用" value="enabled"></el-option>
                                <el-option label="未启用" value="disabled"></el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td width="100" class="center">联系人</td>
                        <td width="150">
                            <el-input v-model="form.customerlinker"></el-input>
                        </td>
                        <td width="100" class="center">联系电话</td>
                        <td width="150">
                            <el-input v-model="form.customerphone"></el-input>
                        </td>
                        <td width="100" class="center">邮箱</td>
                        <td width="150">
                            <el-input v-model="form.customeremail"></el-input>
                        </td>
                        <td width="100" class="center">业务员</td>
                        <td width="150">
                            <el-tree-select v-model="form.customersalesperson" class="tree" clearable filterable
                                :data="customersalesperson" @node-click="nodeinfo" check-strictly=true
                                :render-after-expand="false" />
                        </td>
                    </tr>
                    <tr>
                        <td width="100" class="center">备注</td>
                        <td colspan="7">
                            <el-input type="textarea" autosize v-model="form.remarks"></el-input>
                        </td>
                    </tr>
                </tbody>
            </table>
        </el-card>
        <!-- 标签页 -->
        <el-tabs v-model="activeName" @tab-click="handleclick" type="card" editable @edit="getaddinvoicedepartment">
            <el-tab-pane v-for="(tab, index) in tabs" :key="index" :label="'开票单位' + tab" :name="'开票单位' + tab">
                <table border="0" cellpadding="1" cellspacing="1" style="margin-left: 10px;" width="900" class="table">
                    <tbody>
                        <tr>
                            <td width="100" class="center">开票单位</td>
                            <td colspan="3">
                                <span v-if="false">{{ forms[index].id }}</span>
                                <span v-if="false">{{ forms[index].customerid }}</span>
                                <span v-if="false">{{ forms[index].invoicedepartid }}</span>
                                <el-input v-model="forms[index].invoicedepartname"></el-input>
                            </td>
                            <td width="135" class="center">纳税人识别号</td>
                            <td colspan="3">
                                <el-input v-model="forms[index].taxno"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td width="100" class="center">开票地址</td>
                            <td width="160">
                                <el-input v-model="forms[index].address"></el-input>
                            </td>
                            <td width="120" class="center">联系电话</td>
                            <td width="160">
                                <el-input v-model="forms[index].phone"></el-input>
                            </td>
                            <td width="135" class="center">开户银行</td>
                            <td width="160">
                                <el-input v-model="forms[index].openbank"></el-input>
                            </td>
                            <td width="100" class="center">银行账号</td>
                            <td width="160">
                                <el-input v-model="forms[index].bankaccount"></el-input>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div style="margin-left: 10px;">
                    <el-button type="primary" @click="getaddpayrecords(tab, 1)">续费一年</el-button>
                    <el-button type="primary" @click="getaddpayrecords(tab, 2)">续费两年</el-button>
                    <el-button type="primary" @click="getaddpayrecords(tab, 3)">续费三年</el-button>
                </div>
                <!-- <el-button type="success" @click="addTab">新增标签页</el-button> -->
                <el-table :data="tableData[tab]" :stripe="pager.tableStripe" border max-height="235"
                    style="width:98%;color: #000;margin: 10px auto;" :header-cell-style="headerCellStyle">
                    <el-table-column prop="id" v-if="false" align="center" />
                    <el-table-column prop="invoicedepartid" v-if="false" align="center" />
                    <el-table-column prop="customerid" v-if="false" align="center" />
                    <el-table-column prop="billdate" label="续费日期" align="center" />
                    <el-table-column prop="servicestartdate" label="服务开始日期" align="center">
                        <template #default="scope">
                            <el-date-picker style="width: 100%;" v-model="scope.row.servicestartdate" type="date"
                                placeholder="选择日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
                        </template>
                    </el-table-column>
                    <el-table-column prop="serviceenddate" label="服务到期日期" align="center">
                        <template #default="scope">
                            <el-date-picker style="width: 100%;" v-model="scope.row.serviceenddate" type="date"
                                placeholder="选择日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态" align="center">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button size="small" type="warning" v-if="!newdata"
                                @click="Renewal(scope.row)">续费</el-button>
                            <!-- <el-button size="small" type="danger" @click="dele(scope.row)">删除</el-button> -->
                            <el-popconfirm @confirm="dele(scope.row)" title="确定删除该行吗?">
                                <template #reference>
                                    <el-button size="small" type="danger">删除</el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, shallowRef, provide, reactive, nextTick, watch, computed } from 'vue'
import type { TabPaneName } from 'element-plus'
import { View, Edit, Search, Plus, Refresh, Tools } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios';
import { until } from '@vueuse/shared';
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
const qs = inject('qs');
const index_openmenu = inject('index_openmenu');//首页打开菜单
const index_removetab = inject('index_removetab');//首页关闭标签方法
const index_refreshtab = inject('index_refreshtab');//首页刷新标签方式
const submit_dialogshow = inject('submit_dialogshow');//弹窗显示
const defaultOrder = ref({ prop: 'startDate', order: 'ascending' });
const pager = ref(utils.getPager(defaultOrder.value));
const loading = ref(false);//加载状态
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
//当前日期
const nowDate = new Date().toISOString().split('T')[0];
const tabs = ref([1]);//标签页
const activeTab = ref('1');
const activeName = ref('开票单位1')
const parentid = ref('')
// 创建emits
const emits = defineEmits(['update:id', 'update:new'])
// 创建props
const props = defineProps({
    modelValue: { type: Boolean, default: false },
    id: { type: String, default: "" },
    new: { type: Boolean, default: false },
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
const newdata = createComputed('new')
// 初始化
onMounted(() => {
    getTree();
    if (newdata.value == true) {
        getnewdata();
    } else {
        getdata();
    }
});
// 表单数据
const form = ref({
    id: '',
    customercode: '',
    customername: '',
    customerlinker: '',
    customerphone: '',
    customeremail: '',
    customersalesperson: '',
    status: '',
    remarks: '',
    customersalespersoncode: '',
    OrganizeId: '',
    organname: "",
    userid: '',
    username: "",
});
// 表单数据2
const forms = ref([
    {
        // id: '',
        // customerid: '',
        // invoicedepartid: '',
        // invoicedepartname: '',
        // taxno: '',
        // address: '',
        // phone: '',
        // openbank: '',
        // bankaccount: '',
    },
]);
// 表格数据
const tableData = ref({
    1: [
        {
            id: '',
            invoicedepartid: '',
            customerid: '',
            billdate: '',
            servicestartdate: '',
            serviceenddate: '',
        },
    ]
});
// 获取数据
const getnewdata = () => {
    ajax.post('/yun_customer/Get', qs.stringify({ id: id.value })).then((res) => {
        form.value = res.data.customer;
        form.value.customersalesperson = form.value.customersalesperson;
        form.value.customersalespersoncode = form.value.userid;
        forms.value[0].address = res.data.invoicedepartment[0].address;
        forms.value[0].taxno = res.data.invoicedepartment[0].taxno;
        forms.value[0].openbank = res.data.invoicedepartment[0].openbank;
        forms.value[0].phone = res.data.invoicedepartment[0].phone;
        forms.value[0].customerid = res.data.invoicedepartment[0].customerid;
        forms.value[0].invoicedepartid = res.data.invoicedepartment[0].invoicedepartid;
        forms.value[0].id = res.data.invoicedepartment[0].invoicedepartid;
        forms.value[0].status = res.data.invoicedepartment[0].status;
        forms.value[0].id = res.data.invoicedepartment[0].invoicedepartid;
        tableData.value = res.data.invoicedepartment[0].payrecords;
    }).catch(() => { });
};
const getdata = () => {
    // debugger
    ajax.post('/yun_customer/Get', qs.stringify({ id: id.value })).then((res) => {
        form.value = res.data.customer;
        form.value.customersalesperson = form.value.customersalesperson;
        form.value.customersalespersoncode = form.value.userid;
        for (let i = 0; i < res.data.invoicedepartment.length; i++) {
            forms.value.push({
                id: '',
                customerid: '',
                invoicedepartid: '',
                invoicedepartname: '',
                taxno: '',
                address: '',
                phone: '',
                openbank: '',
                bankaccount: '',
            },)
            forms.value[i].id = res.data.invoicedepartment[i].invoicedepartid;
            forms.value[i].customerid = res.data.invoicedepartment[i].customerid;
            forms.value[i].invoicedepartid = res.data.invoicedepartment[i].invoicedepartid;
            forms.value[i].taxno = res.data.invoicedepartment[i].taxno;
            forms.value[i].address = res.data.invoicedepartment[i].address;
            forms.value[i].phone = res.data.invoicedepartment[i].phone;
            forms.value[i].openbank = res.data.invoicedepartment[i].openbank;
            forms.value[i].bankaccount = res.data.invoicedepartment[i].bankaccount;
            forms.value[i].invoicedepartname = res.data.invoicedepartment[i].invoicedepartname;
            // 如果forms的最后一条数据id为空，就删除该条数据‘
            tabs.value.push(i + 2);
        }

        getrenewData()
        // // 处理多标签页问题
        if (forms.value.length > res.data.invoicedepartment.length) {
            // tabs.value 就小一位
            tabs.value.splice(forms.value.length - 1, 1);
        }
        if (forms.value[forms.value.length - 1].id === '') {
            forms.value.splice(forms.value.length - 1, 1);
        }
    }).catch(() => { });
};
// 获取续费表格信息
const getrenewData = () => {
    const tableD = ref('')
    ajax.post('/yun_customer/Get', qs.stringify({ id: id.value })).then((res) => {
        for (let i = 0; i < res.data.invoicedepartment.length; i++) {
            tableD.value += JSON.stringify(res.data.invoicedepartment[i].payrecords) + ';';
        }

        // 删掉最后的逗号
        tableD.value = tableD.value.slice(0, -1);
        if (res.data.invoicedepartment.length > 1) {
            handleString(tableD.value);
        } else {
            tableData.value = res.data.invoicedepartment[0].payrecords
        }
    }).catch(() => { });
}
// 项目负责人树形数据
const customersalesperson = ref([
])
// 获取树形数据
const getTree = () => {
    ajax.post('Organize/GetTree?srcorgid=' + sobInfo.value.id, qs.stringify({ selecttype: 'unit', keyword: '' })).then((res) => {
        parentid.value = res.data[0].id
        if (parentid.value != '') {
            getTrees();
        }
    }).catch(() => { });
}
const getTrees = () => {
    ajax.post('Organize/GetUsersTree?parentid=' + parentid.value, qs.stringify({ selecttype: 2 })).then((res) => {
        customersalesperson.value = res.data
    }).catch(() => { });
}
// 获取选中节点的数据
const nodeinfo = (data) => {
    form.value.customersalespersoncode = data.id
    form.value.customersalesperson = data.id
    form.value.customersalespersonname = data.label
}
const tablerow = ref()//行
// 添加行
const getaddpayrecords = (tab, years, index) => {

    ajax.post('/yun_customer/addpayrecords', qs.stringify({ customerid: form.value.id, invoicedepartid: forms.value[tab - 1].id })).then((res) => {
        tablerow.value = res.data.payrecords[0];
        if (tablerow.value != undefined || tablerow.value != null || tablerow.value != [] || tablerow.value != "") {
            renew(tab, years, index);
        }
    }).catch(() => { });
}
// 删除表格行
const dele = (row) => {
    // ElMessageBox.confirm('确定删除该行吗?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    // }).then(() => {
    // 循环对比表格中的数据行，找到与当前行相同的数据行，删除该行
    let deletionOccurred = false;
    for (let r = 0; r < tabs.value.length; r++) {
        for (let i = 0; i < tableData.value[tabs.value[r]].length; i++) {
            if (JSON.stringify(tableData.value[tabs.value[r]][i]) === JSON.stringify(row)) {
                if (i === 0) {
                    tableData.value[tabs.value[r]][0].servicestartdate = null;
                    tableData.value[tabs.value[r]][0].serviceenddate = null
                    ElMessage({
                        type: 'warning',
                        message: '不能删除首行'
                    });
                    break;
                } else {
                    tableData.value[tabs.value[r]].splice(i, 1);
                    deletionOccurred = true;
                    break;
                }
            }
        }
    }
    if (deletionOccurred) {
        ElMessage({
            type: 'success',
            message: '删除成功!'
        });
    }
    // }).catch(() => {
    //     ElMessage({
    //         type: 'info',
    //         message: '已取消删除'
    //     });
    // });
};
// 删除该开票单位数据
const DeleAll = () => {
    ElMessageBox.confirm('确定删除客户信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        ajax.post('/yun_customer/DeleteAll', qs.stringify({ id: form.value.id })).then((res) => {
            if (res.success) {
                ElMessage.success(res.msg);
                index_refreshtab();
            } else {
                ElMessage.error(res.msg);
                index_refreshtab();
            }
        }).catch(() => { });
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '已取消删除'
        });
    });
};
// 新标签页信息
const newtabinfo = ref({
    id: '',
    customerid: '',
    invoicedepartid: '',
    invoicedepartname: '',
    taxno: '',
    address: '',
    phone: '',
    openbank: '',
    bankaccount: '',
})
var newtabtable = ''//新标签页表格数据
const tabindex = ref()//新标签页索引
// 添加标签页
const getaddinvoicedepartment = (
    targetName: TabPaneName | undefined,
    action: 'remove' | 'add'
) => {
    tabindex.value = tabs.value.length + 1
    ajax.post('/yun_customer/addinvoicedepartment', qs.stringify({ id: form.value.id, tabindex: tabindex.value })).then((res) => {
        newtabtable = res.data.invoicedepartment[0].payrecords;
        newtabinfo.value.id = res.data.invoicedepartment[0].invoicedepartid;
        newtabinfo.value.customerid = res.data.invoicedepartment[0].customerid;
        newtabinfo.value.invoicedepartid = res.data.invoicedepartment[0].invoicedepartid;
        newtabinfo.value.invoicedepartname = res.data.invoicedepartment[0].invoicedepartname;
        newtabinfo.value.taxno = res.data.invoicedepartment[0].taxno;
        newtabinfo.value.address = res.data.invoicedepartment[0].address;
        newtabinfo.value.phone = res.data.invoicedepartment[0].phone;
        newtabinfo.value.openbank = res.data.invoicedepartment[0].openbank;
        newtabinfo.value.bankaccount = res.data.invoicedepartment[0].bankaccount;
        // 添加标签页,跳转到最新标签页
        activeTab.value = (tabs.value.length + 1).toString();
        activeName.value = '开票单位' + activeTab.value

        handleTabsEdit(targetName, action);
    }).catch(() => { });
}
// 续费
const renew = (tab, years, index) => {
    // 续费逻辑
    // 1. 生成续费记录
    // 2. 更新服务到期日期
    // 3. 更新续费记录
    // 4. 更新续费记录状态
    // 5. 更新客户状态
    // 获取上一行的到期日期
    let lastEndDates = ''
    // 获取当前日期作为续费日期
    let renewDate = new Date();
    // 格式化日期
    let startDates = ''
    if (years === 4) {
        // 将新的数据行添加到表格数据中
        tableData.value[tab] = [{
            customerid: tablerow.value.customerid,
            invoicedepartid: tablerow.value.invoicedepartid,
            id: tablerow.value.id,
            billdate: formatDate(renewDate),
            servicestartdate: startDates,
            serviceenddate: lastEndDates,
            status: tablerow.value.status
        }];
    }
    let lastEndDate = new Date(tableData.value[tab][tableData.value[tab].length - 1].serviceenddate);// 上一行的到期日期
    // 格式化日期
    let startDate = formatDate(lastEndDate);// 服务开始日期
    // 如果年份为1
    if (years === 1) {
        // 如果第一行的服务开始日期或到期日期为空或者是underfined，将当前日期作为服务开始日期，替换第一行数据
        if (tableData.value[tab][0].servicestartdate === '' || tableData.value[tab][0].servicestartdate === null) {
            let endDate = new Date(tableData.value[tab][0].billdate);
            endDate.setFullYear(endDate.getFullYear() + 1);
            tableData.value[tab][0].servicestartdate = formatDate(renewDate);
            tableData.value[tab][0].serviceenddate = formatDate(endDate)
        } else {
            // 在到期日期上增加一年
            lastEndDate.setFullYear(lastEndDate.getFullYear() + 1);
            // 将新的数据行添加到表格数据中
            tableData.value[tab].push({
                customerid: tablerow.value.customerid,
                invoicedepartid: tablerow.value.invoicedepartid,
                id: tablerow.value.id,
                billdate: formatDate(renewDate),
                servicestartdate: startDate,
                serviceenddate: formatDate(lastEndDate),
                status: tablerow.value.status
            });
        }
    }
    // 如果年份为2
    else if (years === 2) {
        lastEndDate.setFullYear(lastEndDate.getFullYear() + 2);
        // 如果第一行的服务开始日期或到期日期为空或者是underfined，将当前日期作为服务开始日期，替换第一行数据
        if (tableData.value[tab][0].servicestartdate === '' || tableData.value[tab][0].servicestartdate === null) {
            let endDate = new Date(tableData.value[tab][0].billdate);
            endDate.setFullYear(endDate.getFullYear() + 2);
            tableData.value[tab][0].servicestartdate = formatDate(renewDate);
            tableData.value[tab][0].serviceenddate = formatDate(endDate)
        } else {
            // 在到期日期上增加两年
            // 将新的数据行添加到表格数据中
            tableData.value[tab].push({
                customerid: tablerow.value.customerid,
                invoicedepartid: tablerow.value.invoicedepartid,
                id: tablerow.value.id,
                billdate: formatDate(renewDate),
                servicestartdate: startDate,
                serviceenddate: formatDate(lastEndDate),
                status: tablerow.value.status
            });
        }
    }
    // 如果年份为3
    else if (years === 3) {
        // 在到期日期上增加三年
        lastEndDate.setFullYear(lastEndDate.getFullYear() + 3);
        // 如果第一行的服务开始日期或到期日期为空或者是underfined，将当前日期作为服务开始日期，替换第一行数据
        if (tableData.value[tab][0].servicestartdate === '' || tableData.value[tab][0].servicestartdate === null) {
            let endDate = new Date(tableData.value[tab][0].billdate);
            endDate.setFullYear(endDate.getFullYear() + 3);
            tableData.value[tab][0].servicestartdate = formatDate(renewDate);
            tableData.value[tab][0].serviceenddate = formatDate(endDate)
        } else {
            // 将新的数据行添加到表格数据中
            tableData.value[tab].push({
                customerid: tablerow.value.customerid,
                invoicedepartid: tablerow.value.invoicedepartid,
                id: tablerow.value.id,
                billdate: formatDate(renewDate),
                servicestartdate: startDate,
                serviceenddate: formatDate(lastEndDate),
                status: tablerow.value.status
            });
        }
    }
    // 定义一个函数，将日期转换为 "yyyy-mm-dd" 的格式
    function formatDate(date) {
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    if (years == 1 || years == 2 || years == 3) {
        ElMessage({
            type: 'success',
            message: '续费填写成功，请在表内继续操作！'
        });
    }
    // 如果索引不为undefined，从表格数据中删除该索引对应的数据行
    if (index !== undefined) {
        tableData.value[tab].splice(index, 1);
    }
    // }
};
// 行内续费
const Renewal = (row) => {
    //将row数据转换为json格式
    // 如果row.serviceenddate和row.servicestartdate为空，提示用户先填写服务开始日期和服务到期日期
    if (row.serviceenddate === '' || row.serviceenddate === null || row.servicestartdate === '' || row.servicestartdate === null) {
        ElMessage({
            type: 'warning',
            message: '请先填写服务开始日期和服务到期日期'
        });
        return;
    }
    // let rows = JSON.stringify(row)
    const success = ref(0)
    ajax.post('/yun_customer/SavePayRecord', qs.stringify({ paymentrecordsJSON: JSON.stringify(row) })).then((res) => {
        if (res.success) {
            success.value = 1
            ElMessage.success(res.data.paymentrecords[0].status);
        } else {
            success.value = 0
            ElMessage.error(res.msg);
        }
        if (success.value == 1) {
            getrenewData();
        }
    }).catch(() => { });
}
// 处理标签页编辑
const handleTabsEdit = (
    targetName: TabPaneName | undefined,
    action: 'remove' | 'add'
) => {
    if (action === 'add') {
        if (newtabinfo.value != '') {
            // 新增标签页
            tabs.value.push(tabs.value.length + 1);
            // 将新增的标签页设为当前标签页
            activeName.value = '开票单位' + activeTab.value
            // 如果forms.value 中最后一个数据id为空，则把newtabinfo.value的id赋值给它
            if (forms.value[forms.value.length - 1].id === '') {
                forms.value[forms.value.length - 1].id = newtabinfo.value.id;
                forms.value[forms.value.length - 1].invoicedepartid = newtabinfo.value.id;
                forms.value[forms.value.length - 1].customerid = newtabinfo.value.customerid;
            } else {
                // 新增标签页表单
                forms.value.push(newtabinfo.value);
            }
            // 新增标签页表格数据
            getaddpayrecords(tabindex.value, 4)
        }
    } else if (action === 'remove') {
        activeTab.value = targetName.slice(4)
        let activeNames = activeTab.value
        if (activeNames == targetName.slice(4)) {
            tabs.value.forEach((tab, index) => {
                if (tab == targetName.slice(4)) {
                    if (tab == 1) {
                        ElMessage({
                            message: '第一个标签页不能删除',
                            type: 'warning'
                        })
                        return
                    }
                    else {
                        ajax.post('/yun_customer/DeleteInvoiceDepartment', qs.stringify({ id: forms.value[index].id })).then((res) => {
                            if (res.code == -1) {
                                ElMessage.error(res.msg);
                            } else {
                                //删除标签页
                                tabs.value.splice(index, 1)
                                //删除标签页表单
                                forms.value.splice(index, 1)
                                //删除标签页表格数据
                                delete tableData.value[tab]
                                //删除标签页跳到上一个标签页
                                if (tabs.value.length > 0) {
                                    activeTab.value = tabs.value[tabs.value.length - 1].toString()
                                    activeName.value = '开票单位' + activeTab.value
                                }
                            }
                        }).catch(() => { });

                    }
                }
            })
        }
    }
}
// 保存
const save = () => {
    ajax.post('/yun_customer/save', qs.stringify({
        customerJSON: JSON.stringify(form.value)
        , invoicedepartmentJSON: JSON.stringify(forms.value)
        , paymentrecordsJSON: JSON.stringify(tableData.value)
    })).then(res => {
        if (res.success) {
            ElMessage.success(res.msg);
            index_refreshtab();
        } else {
            ElMessage.error(res.msg);
        }
    });
};








// 关闭弹窗
const close = () => {
    submit_dialogshow.value = false;
};

// 定义处理字符串的方法
const handleString = (str) => {
    // 分割字符串
    let objs = str.split('};{');

    // 处理每个对象
    for (let i = 0; i < objs.length; i++) {
        // 添加必要的括号
        let objStr = i === 0 ? objs[i] + '}' : i === objs.length - 1 ? '{' + objs[i] : '{' + objs[i] + '}';

        // 解析字符串
        let obj = JSON.parse(objStr);

        // 将解析出的对象添加到 tableData 中
        Object.keys(obj).forEach(key => {
            tableData.value[key] = obj[key];
        });
    }
}

// 点击事件
function handleclick(val) {

}
//表头单元格样式
function headerCellStyle({ row, column, rowIndex, columnIndex }) {
    return {
        color: '#000',
    }
}

// 暴露方法
// defineExpose({
//     // clear
// })

</script>

<style scoped>
@import './Customsubmit.css';
</style>
