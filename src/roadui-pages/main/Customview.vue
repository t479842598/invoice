<template>
    <!-- 客户管理平台新增，修改，详情 -->
    <div class="custom-submit" style="height: 72vh;overflow: hidden;overflow-y: scroll;">
        <el-card class="box-card" shadow="never">
            <!-- <el-form ref="formbutton" inline label-width="120px">
                <el-form-item>
                    <el-button type="default" @click="close">关闭</el-button>
                </el-form-item>
            </el-form> -->
            <!-- 基本信息 -->
            <table border="1" cellpadding="1" cellspacing="1" width="890" class="table" style="color: #000;">
                <tbody>
                    <tr>
                        <td width="100" class="center">客户编号</td>
                        <td>{{ form.customercode }}</td>
                        <td width="100" class="center">客户名称</td>
                        <td colspan="3">{{ form.customername }}</td>
                        <td width="100" class="center">状态</td>
                        <td style="color: red;">{{ form.status }}</td>
                    </tr>
                    <tr>
                        <td width="100" class="center">联系人</td>
                        <td width="150">{{ form.customerlinker }}</td>
                        <td width="100" class="center">联系电话</td>
                        <td width="150">{{ form.customerphone }}</td>
                        <td width="100" class="center">邮箱</td>
                        <td width="150">{{ form.customeremail }}</td>
                        <td width="100" class="center">业务员</td>
                        <td width="150">{{ form.customersalespersonname }}</td>
                    </tr>
                    <tr>
                        <td width="100" class="center">备注</td>
                        <td colspan="7">{{ form.remarks }}</td>
                    </tr>
                </tbody>
            </table>
        </el-card>
        <!-- 标签页 -->
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane v-for="(tab, index) in tabs" :key="index" :label="'税务单位信息' + tab" :name="'税务单位信息' + tab">
                <table border="1" cellpadding="1" cellspacing="1" style="margin-left: 10px;color: #000;" width="900"
                    class="table">
                    <tbody>
                        <tr>
                            <td width="100" class="center">开票单位</td>
                            <td colspan="3">{{ forms[index].invoicedepartname }}</td>
                            <td width="135" class="center">纳税人识别号</td>
                            <td colspan="3">{{ forms[index].taxno }}</td>
                        </tr>
                        <tr>
                            <td width="100" class="center">单位地址</td>
                            <td width="160">{{ forms[index].address }}</td>
                            <td width="120" class="center">联系电话</td>
                            <td width="160">{{ forms[index].phone }}</td>
                            <td width="135" class="center">开户银行</td>
                            <td width="160">{{ forms[index].openbank }}</td>
                            <td width="100" class="center">银行账号</td>
                            <td width="160">{{ forms[index].bankaccount }}</td>
                        </tr>
                    </tbody>
                </table>
                <el-table :data="tableData[tab]" v-loading="loading" border :stripe="pager.tableStripe" max-height="235"
                    style="width: 98%;color: #000;margin: auto;" :header-cell-style="headerCellStyle">
                    <el-table-column prop="billdate" fit show-overflow-tooltip label="续费日期" align="center" width="218">
                    </el-table-column>
                    <el-table-column prop="servicestartdate" fit show-overflow-tooltip label="服务开始日期" align="center"
                        width="225">
                    </el-table-column>
                    <el-table-column prop="serviceenddate" fit show-overflow-tooltip label="服务到期日期" align="center"
                        width="225">
                    </el-table-column>
                    <el-table-column prop="status" fit show-overflow-tooltip label="状态" align="center" width="225">
                    </el-table-column>
                    <!-- <el-table-column label="操作" align="center">
                        <template #default="scope">
                            <el-button size="small" type="warning" @click="renew(tab, 1, scope.$index)">续费</el-button>
                        </template>
                    </el-table-column> -->
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, shallowRef, provide, reactive, nextTick, watch, computed } from 'vue'
import type { TabPaneName } from 'element-plus'
import { View, Edit, Search, Plus, Refresh, Tools } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios';
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
const qs = inject('qs');
const index_openmenu = inject('index_openmenu');//首页打开菜单
const index_removetab = inject('index_removetab');//首页关闭标签方法
const index_refreshtab = inject('index_refreshtab');//首页刷新标签方式
const dialogshow = inject('view_dialogshow');
const defaultOrder = ref({ prop: 'startDate', order: 'ascending' });
const pager = ref(utils.getPager(defaultOrder.value));
const loading = ref(false);//加载状态
const nowDate = new Date().toISOString().split('T')[0];//当前日期
const tabs = ref([1]);//标签页
const activeName = ref('税务单位信息1')//当前标签页
// 创建emits
const emits = defineEmits(['update:id'])
// 创建props
const props = defineProps({
    modelValue: { type: Boolean, default: false },
    id: { type: String, default: "" },
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
onMounted(() => {
    getdata();
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
const Data = ref('') //数据
// 获取数据
const getdata = () => {
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
            forms.value[i].invoicedepartname = res.data.invoicedepartment[i].invoicedepartname;
            forms.value[i].taxno = res.data.invoicedepartment[i].taxno;
            forms.value[i].address = res.data.invoicedepartment[i].address;
            forms.value[i].phone = res.data.invoicedepartment[i].phone;
            forms.value[i].openbank = res.data.invoicedepartment[i].openbank;
            forms.value[i].bankaccount = res.data.invoicedepartment[i].bankaccount;
            tabs.value.push(i + 2);
            Data.value += JSON.stringify(res.data.invoicedepartment[i].payrecords) + ';';
        }
        // 删掉最后的逗号
        Data.value = Data.value.slice(0, -1);
        // console.log(Data.value);
        if (res.data.invoicedepartment.length > 1) {
            handleString(Data.value);
        } else {
            tableData.value = res.data.invoicedepartment[0].payrecords
        }
        // 处理多标签页问题
        if (forms.value.length > res.data.invoicedepartment.length) {
            // tabs.value 就小一位
            tabs.value.splice(forms.value.length - 1, 1);
        }
    }).catch(() => { });
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


// 重置
const reset = () => {
    dialogshow.value = false;
};
// 关闭弹窗
const close = () => {
    dialogshow.value = false;
};
//表头单元格样式
function headerCellStyle() {
    return {
        color: '#000',
    }
}


</script>

<style  scoped>
@import './Customsubmit.css';

.el-table :deep(.el-table__header th) {
    border-left: solid 1px #808080;
}

.el-table :deep(.el-table__inner-wrapper) {
    border: solid 1px #808080;
}

.el-table :deep(.el-table__cell) {
    border: solid 1px #808080;
}

:deep(.el-table__border-left-patch) {
    border-left: solid 1px #808080;
}

:deep(.el-table--border::after) {
    border-left: #808080 solid 1px !important;
}
</style>
