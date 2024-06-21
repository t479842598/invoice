<template>
    <!-- 客户管理平台新增，修改，详情 -->
    <div class="custom-submit" style="max-height: 90vh;overflow: hidden;overflow-y: scroll;">
        <el-affix target=".custom-submit" :offset="69">
            <el-form ref="formbutton" class="formbutton" inline style="background-color: #ffffff">
                <el-form-item>
                    <el-button type="primary" :disabled="buttonable" @click="save(ruleFormRef, ruleFormRefs)">保存</el-button>
                    <el-button type="default" :disabled="buttonable" @click="close">关闭</el-button>
                    <!-- <span class="usedetail">配置说明</span> -->
                    <el-button link :disabled="buttonable" class="usedetail">配置说明</el-button>
                </el-form-item>
            </el-form>
        </el-affix>
        <!-- 标签页 -->
        <el-tabs v-model="activeName" type="card" v-loading="loading" element-loading-text="正在保存，请稍等...">
            <el-tab-pane label="基本信息" name="基本信息">
                <!-- 基本信息 -->
                <el-form :model="editData" ref="ruleFormRef" :rules="rules" label-width="100px">
                    <el-form-item label="账套编号" prop="accountcode">
                        <el-input v-model="editData.accountcode" clearable />
                    </el-form-item>
                    <el-form-item label="账套名称" prop="accountname">
                        <el-input v-model="editData.accountname" clearable />
                    </el-form-item>
                    <el-form-item label="连接类型" prop="type">
                        <el-radio-group v-model="editData.type">
                            <el-radio v-for="opt in connTypes" :key="opt.value" :label="opt.title">{{ opt.title
                            }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item class="url" label="连接字符串" prop="url">
                        <el-input v-model="editData.url" :autosize="{ minRows: 2 }" type="textarea" clearable />
                        <el-button type="primary" @click="testmain">测试连接</el-button>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="editData.status" placeholder="请选择">
                            <el-option label="未启用" value="未启用"></el-option>
                            <el-option label="启用" value="启用"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" prop="remarks">
                        <el-input v-model="editData.remarks"></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane class="tabpane" label="导入设置" name="导入设置">
                <el-form :model="importData" ref="ruleFormRefs" :rules="ruless" label-position="top">
                    <!-- <div class="formspan">主表（销售单号、日期、名称、金额、折扣、操作员、备注、[…]）：</div> -->
                    <el-form-item label="主表（销售单号、日期、名称、金额、折扣、操作员、备注、[…]）：" prop="mainsqlstring">
                        <el-input v-model="importData.mainsqlstring" :autosize="{ minRows: 2 }" type="textarea" clearable />
                        <table border class="table" style="width: 100%;">
                            <tr>
                                <td width="10%" align="center">
                                    <el-button type="primary" @click="maintable">测试连接</el-button>
                                </td>
                                <td width="90%">
                                    <input type="text" ref="maintablebackref" disabled placeholder="测试结果"
                                        v-model="maintableback">
                                </td>
                            </tr>
                        </table>
                    </el-form-item>
                    <el-form-item label="主表排序：" prop="mainorderby">
                        <el-input v-model="importData.mainorderby" :autosize="{ minRows: 2 }" type="textarea" clearable />
                        <!-- <table border class="table" style="width: 100%;">
                            <tr>
                                <td width="10%" align="center">
                                    <el-button type="primary" @click="maintable">测试连接</el-button>
                                </td>
                                <td width="90%">
                                    <input type="text" ref="maintablebackref" disabled placeholder="测试结果"
                                        v-model="maintableback">
                                </td>
                            </tr>
                        </table> -->
                    </el-form-item>
                    <!-- <div class="formspan">已开单据列表：</div> -->
                    <el-form-item label="已开单据列表：" prop="mainopensqlstring">
                        <el-input v-model="importData.mainopensqlstring" :autosize="{ minRows: 2 }" type="textarea"
                            clearable />
                        <table border class="table" style="width: 100%;">
                            <tr>
                                <td width="10%" align="center">
                                    <el-button type="primary" @click="mainopen">测试连接</el-button>
                                </td>
                                <td width="90%">
                                    <input type="text" ref="mainopenbackref" disabled placeholder="测试结果"
                                        v-model="mainopenback">
                                </td>
                            </tr>
                        </table>
                    </el-form-item>
                    <!-- <div class="formspan">明细表（商品名称、规格型号、计量单位、数量、单价、含税、金额、税率、税额、折扣、折扣税额、分类编码、[…]）：</div> -->
                    <el-form-item label="明细表（商品名称、规格型号、计量单位、数量、单价、含税、金额、税率、税额、折扣、折扣税额、分类编码、[…]）：" prop="detailsqlstring">
                        <el-input v-model="importData.detailsqlstring" :autosize="{ minRows: 2 }" type="textarea"
                            clearable />
                        <table border class="table" style="width: 100%;">
                            <tr>
                                <td width="10%" align="center">
                                    <el-button type="primary" @click="detailtable">测试连接</el-button>
                                </td>
                                <td width="90%">
                                    <input type="text" disabled ref="detailtablebackref" placeholder="测试结果"
                                        v-model="detailtableback">
                                </td>
                            </tr>
                        </table>
                    </el-form-item>
                    <!-- <div class="formspan">客户档案（客户名称、客户代码、客户类型、客户地址、联系人、电话、邮箱....）：</div> -->
                    <el-form-item label="客户档案（客户名称、客户代码、客户类型、客户地址、联系人、电话、邮箱....）：" prop="customerquerysql">
                        <el-input v-model="importData.customerquerysql" :autosize="{ minRows: 2 }" type="textarea"
                            clearable />
                        <table border class="table" style="width: 100%;">
                            <tr>
                                <td width="10%" align="center">
                                    <el-button type="primary" @click="customertable">测试连接</el-button>
                                </td>
                                <td width="90%">
                                    <input type="text" disabled ref="customertablebackref" placeholder="测试结果"
                                        v-model="customertableback">
                                </td>
                            </tr>
                        </table>
                    </el-form-item>
                    <!-- <div class="formspan">明细表合并：</div> -->
                    <!-- <el-form-item label="明细表合并：">
                        <el-input v-model="importData.detailquerysqlstring" :autosize="{ minRows: 2 }" type="textarea"
                            clearable />
                        <table border class="table" style="width: 100%;">
                            <tr>
                                <td width="10%" align="center">
                                    <el-button type="primary" @click="detailschedules">测试连接</el-button>
                                </td>
                                <td width="90%">
                                    <input type="text" ref="detailschedulesbackref" disabled placeholder="测试结果"
                                        v-model="detailschedulesback">
                                </td>
                            </tr>
                        </table>
                    </el-form-item> -->
                    <!-- <div class="formdiv">固定备注内容：</div> -->
                    <el-form-item label="固定备注内容：" prop="mainremaks">
                        <el-input v-model="importData.mainremaks" :autosize="{ minRows: 2 }" type="textarea" clearable />
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane class="tabpane" label="导入完成后事件设置" name="导入完成后事件设置">
                <el-form :model="completeData" ref="ruleFormRef" :rules="rules" label-position="top">
                    <!-- <div class="formdiv">开票流水号更新：</div> -->
                    <el-form-item label="开票流水号更新：" prop="salemainupdateserinosql">
                        <el-input v-model="completeData.salemainupdateserinosql" :autosize="{ minRows: 2 }" type="textarea"
                            clearable />
                        <table border class="table" style="width: 100%;">
                            <tr>
                                <td width="10%" align="center">
                                    <el-button type="primary" @click="updatedatemain">测试连接</el-button>
                                </td>
                                <td width="90%">
                                    <input type="text" ref="updatedatemainref" disabled class="updatetable"
                                        placeholder="测试结果" v-model="updatedatemainback">
                                </td>
                            </tr>
                        </table>
                    </el-form-item>
                    <!-- <div class="formdiv">开票日期更新：</div> -->
                    <el-form-item label="开票日期更新：" prop="updateinvoicedatesql">
                        <el-input v-model="completeData.updateinvoicedatesql" :autosize="{ minRows: 2 }" type="textarea"
                            clearable />
                        <table border class="table" style="width: 100%;">
                            <tr>
                                <td width="10%" align="center">
                                    <el-button type="primary" @click="updatesalemain">测试连接</el-button>
                                </td>
                                <td width="90%">
                                    <input type="text" ref="updatesalemainref" disabled class="updatetable"
                                        placeholder="测试结果" v-model="updatesalemainback">
                                </td>
                            </tr>
                        </table>
                    </el-form-item>
                    <!-- <div class="formdiv">销售单更新（开票后更新、可用字段：开票日期、发票代码、发票号码、开票人、发票金额、发票税额、发票税率、购方名称、购方税号及回写单据）：</div> -->
                    <el-form-item label="销售单更新（开票后更新、可用字段：开票日期、发票代码、发票号码、开票人、发票金额、发票税额、发票税率、购方名称、购方税号及回写单据）："
                        prop="salemainupdatesql">
                        <el-input v-model="completeData.salemainupdatesql" :autosize="{ minRows: 2 }" type="textarea"
                            clearable />
                        <table border class="table" style="width: 100%;">
                            <tr>
                                <td width="10%" align="center">
                                    <el-button type="primary" @click="updatetable">测试连接</el-button>
                                </td>
                                <td width="90%">
                                    <input type="text" ref="updatetablebackref" disabled class="updatetable"
                                        placeholder="测试结果" v-model="updatetableback">
                                </td>
                            </tr>
                        </table>
                    </el-form-item>
                    <!-- <div class="formdiv">销售明细表更新（用开票日期、发票代码、发票号码及回写单据更新管理系统）：</div> -->
                    <el-form-item label="销售明细表更新（用开票日期、发票代码、发票号码及回写单据更新管理系统）：" prop="saledetailupdatesql">
                        <el-input v-model="completeData.saledetailupdatesql" :autosize="{ minRows: 2 }" type="textarea"
                            clearable />
                        <table border class="table" style="width: 100%;">
                            <tr>
                                <td width="10%" align="center">
                                    <el-button type="primary" @click="updatedetails">测试连接</el-button>
                                </td>
                                <td width="90%">
                                    <input type="text" ref="updatedetailsbackref" disabled placeholder="测试结果"
                                        v-model="updatedetailsback">
                                </td>
                            </tr>
                        </table>
                    </el-form-item>
                    <!-- <div class="formdiv">开票税额的回写：</div> -->
                    <el-form-item label="开票税额的回写：" prop="updatetaxsql">
                        <el-input v-model="completeData.updatetaxsql" :autosize="{ minRows: 2 }" type="textarea"
                            clearable />
                        <table border class="table" style="width: 100%;">
                            <tr>
                                <td width="10%" align="center">
                                    <el-button type="primary" @click="updatetaxsqldetails">测试连接</el-button>
                                </td>
                                <td width="90%">
                                    <input type="text" ref="updatetaxsqlbackref" disabled placeholder="测试结果"
                                        v-model="updatetaxsqlback">
                                </td>
                            </tr>
                        </table>
                    </el-form-item>
                    <el-checkbox v-model="completeData.isUpdate" style="display: block;" label="发票金额修改后停止更新" />
                    <el-checkbox v-model="completeData.isDelete" label="删除销售单据" />
                    <el-form-item label="" prop="deletesalesql">
                        <el-input v-model="completeData.deletesalesql" :autosize="{ minRows: 2 }" type="textarea"
                            clearable />
                        <table border class="table" style="width: 100%;">
                            <tr>
                                <td width="10%" align="center">
                                    <el-button type="primary" @click="deletedetails">测试连接</el-button>
                                </td>
                                <td width="90%">
                                    <input type="text" disabled ref="deletedetailsbackref" placeholder="测试结果"
                                        v-model="deletedetailsback">
                                </td>
                            </tr>
                        </table>
                    </el-form-item>
                    <!-- <div class="formdiv">税号更新：</div> -->
                    <el-form-item label="税号更新：" prop="updatetaxnosql">
                        <el-input v-model="completeData.updatetaxnosql" :autosize="{ minRows: 2 }" type="textarea"
                            clearable />
                        <table border class="table" style="width: 100%;">
                            <tr>
                                <td width="10%" align="center">
                                    <el-button type="primary" @click="updatetaxno">测试连接</el-button>
                                </td>
                                <td width="90%">
                                    <input type="text" ref="updatetaxnobackref" disabled placeholder="测试结果"
                                        v-model="updatetaxnoback">
                                </td>
                            </tr>
                        </table>
                    </el-form-item>
                    <!-- <div class="formdiv">邮箱更新：</div> -->
                    <el-form-item label="邮箱更新：" prop="updatetaxnosql">
                        <el-input v-model="completeData.updateemailsql" :autosize="{ minRows: 2 }" type="textarea"
                            clearable />
                        <table border class="table" style="width: 100%;">
                            <tr>
                                <td width="10%" align="center">
                                    <el-button type="primary" @click="updateemail">测试连接</el-button>
                                </td>
                                <td width="90%">
                                    <input type="text" ref="updateemailbackref" disabled placeholder="测试结果"
                                        v-model="updateemailback">
                                </td>
                            </tr>
                        </table>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane class="tabpane" label="导出设置" name="导出设置">
                <el-form :model="exportData" ref="ruleFormRef" :rules="rules" label-position="top">
                    <el-checkbox v-model="exportData.isSaveData" label="开票后实时保存发票数据" />
                    <el-form-item label="保存编码：编码规则（yy年mm月dd日三位流水号）" prop="Encodingrules">
                        <el-input v-model="exportData.Encodingrules" clearable />
                    </el-form-item>
                    <!-- <div class="formdiv mainuse">
                        主表可用字段（销售单号、保存编号、发票代码、发票号码、发票类型、开票日期、客户编码、购方名称、购方税号、购方地址电话、购方地址电话、购方银行账号、不含税金额、税率、税额、备注、开票人、商品明细数）
                    </div> -->
                    <el-form-item
                        label="主表可用字段（销售单号、保存编号、发票代码、发票号码、发票类型、开票日期、客户编码、购方名称、购方税号、购方地址电话、购方地址电话、购方银行账号、不含税金额、税率、税额、备注、开票人、商品明细数）"
                        prop="SaleMainExportSql">
                        <el-input v-model="exportData.SaleMainExportSql" :autosize="{ minRows: 2 }" type="textarea"
                            clearable />
                        <table border class="table" style="width: 100%;">
                            <tr>
                                <td width="10%" align="center">
                                    <el-button type="primary" @click="maintableuse">测试连接</el-button>
                                </td>
                                <td width="90%">
                                    <input type="text" disabled ref="maintableusebackref" placeholder="测试结果"
                                        v-model="maintableuseback">
                                </td>
                            </tr>
                        </table>
                    </el-form-item>
                    <!-- <div class="formdiv">明细表可用字段（销售单号、保存编号、发票代码、发票号码、商品名称、规格型号、计量单位、数量、单价、金额、税率、税额、序号、商品编号）</div> -->
                    <el-form-item label="明细表可用字段（销售单号、保存编号、发票代码、发票号码、商品名称、规格型号、计量单位、数量、单价、金额、税率、税额、序号、商品编号）"
                        prop="SaleDetalExportSql">
                        <el-input v-model="exportData.SaleDetalExportSql" :autosize="{ minRows: 2 }" type="textarea"
                            clearable />
                        <table border class="table" style="width: 100%;">
                            <tr>
                                <td width="10%" align="center">
                                    <el-button type="primary" @click="detailuse">测试连接</el-button>
                                </td>
                                <td width="90%">
                                    <input type="text" ref="detailusebackref" disabled placeholder="测试结果"
                                        v-model="detailuseback">
                                </td>
                            </tr>
                        </table>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, shallowRef, provide, reactive, nextTick, watch, computed } from 'vue'
import type { TabPaneName } from 'element-plus'
import { debounce } from 'lodash';
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
const submit_dialogshow = inject('submit_dialogshow');
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
//当前日期
const nowDate = new Date().toISOString().split('T')[0];
const activeName = ref('基本信息')
const connTypes = ref([]);//数据库类型选项
const ruleFormRef = ref(null);//表单验证
const ruleFormRefs = ref(null);//表单验证
const maintableback = ref('')//主表返回值
const mainopenback = ref('')//已开单据列表
const detailtableback = ref('')//明细表
const customertableback = ref('')//客户档案
const detailschedulesback = ref('')//明细表合并
const updatetableback = ref('')//销售单更新
const updatesalemainback = ref('')//开票流水号更新
const updatedatemainback = ref('')//开票日期更新
const updatedetailsback = ref('')//销售明细表更新
const updatetaxsqlback = ref('')//开票日期更新
const deletedetailsback = ref('')//销售明细表更新
const maintableuseback = ref('')//主表可用字段
const detailuseback = ref('')//明细表可用字段
const loading = ref(false);//加载中
const buttonable = ref(false);//按钮是否可用
// 创建emits
const emits = defineEmits(['update:id'])
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
// 表单数据
// 基础数据
const editData = ref({
    accountcode: '',//账套编号
    accountname: '',//账套名称
    type: '',//数据库类型
    remarks: '',//备注
    url: '',//连接字符串
    status: '',//状态
});
// 导入设置
const importData = ref({
    mainsqlstring: '',//主表字符串
    mainorderby: '',//主表排序
    mainopensqlstring: '',//已开单据列表
    customertaxnosqlstring: '',//购货单位
    detailsqlstring: '',//明细表
    customerquerysql: '',//客户档案
    detailquerysqlstring: '',//明细表合并
    mainremaks: '',//固定备注内容
});
// 导入完成后事件设置
const completeData = ref({
    salemainupdatesql: '',//销售单更新
    updateinvoicedatesql: '',//开票流水号更新
    salemainupdateserinosql: '',//开票日期更新
    saledetailupdatesql: '',//销售明细表更新
    updatetaxsql: '',//开票税额的回写
    deletesalesql: '',//删除销售单据
    isUpdate: false,//销售明细表停止更新
    isDelete: false,//删除销售单据
    updatetaxnosql: '',//购货单位
    updateemailsql: '',//邮箱更新
});
// 导出设置
const exportData = ref({
    isSaveData: false,//开票后实时保存发票数据
    Encodingrules: '',//保存编码：编码规则（yy年mm月dd日三位流水号）
    SaleMainExportSql: '',//主表可用字段
    SaleDetalExportSql: '',//明细表可用字段
});
// 表单验证规则
const rules = {
    accountcode: [{ required: true, message: '请输入账套编号', trigger: 'blur' }],
    accountname: [{ required: true, message: '请输入账套名称', trigger: 'blur' }],
    type: [{ required: true, message: '请选择连接类型', trigger: 'change' }],
    url: [{ required: true, message: '请输入连接字符串', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};
const ruless = {
    mainsqlstring: [{ required: true, message: '请输入主表字符串', trigger: 'blur' }],
    // mainorderby: [{ required: true, message: '请输入主表排序', trigger: 'blur' }],
    mainopensqlstring: [{ required: true, message: '请输入已开单据列表', trigger: 'blur' }],
    detailsqlstring: [{ required: true, message: '请输入明细表', trigger: 'blur' }],
    customerquerysql: [{ required: true, message: '请输入客户档案', trigger: 'blur' }],
    // detailquerysqlstring: [{ required: true, message: '请输入明细表合并', trigger: 'blur' }],
};

onMounted(() => {
    database();
    getData();
});
// 获取数据
const getData = () => {
    ajax.post('/cn_account/Get', qs.stringify({ id: id.value })).then((res) => {
        editData.value = res.data.account;
        importData.value = res.data.ImportConfig;
        completeData.value = res.data.UpdateConfig;
        exportData.value = res.data.SaveConfig;
    }).catch(() => { });
};
// 保存
const save = async (formEl, formEls) => {
    if (!formEl || !formEls) {
        return;
    }
    await formEl.validate((valid) => {
        if (valid) {
            debounce(() => {
                buttonable.value = true;
                loading.value = true;
                ajax.post('/cn_account/Save?srcorgid=' + sobInfo.value.id, qs.stringify({
                    accountJSON: JSON.stringify(editData.value),
                    ImportConfigJSON: JSON.stringify(importData.value),
                    UpdateConfigJSON: JSON.stringify(completeData.value),
                    SaveConfigJSON: JSON.stringify(exportData.value)
                })).then((res) => {
                    buttonable.value = false;
                    loading.value = false;
                    if (res.success) {
                        ElMessage.success(res.msg);
                        index_refreshtab();
                    } else {
                        ElMessage.error(res.msg);
                    }
                }).catch((err) => { ElMessage.error(err.msg) });
            }, 1000)();
        }
    });

};
// 数据库类型
const database = () => {
    ajax.post('/DbConnection/GetDbConnTypeOptions').then((res) => {
        connTypes.value = res.data;
    }).catch(() => { });
}
// 测试连接
const url = ref()
// 基本信息测试连接
const testmain = () => {
    url.value = editData.value.url;
    testUrl(url.value)
}
// 连接字符串测试
const testUrl = (url) => {
    ajax.post('/cn_account/TestConn', qs.stringify({ connid: id.value, type: editData.value.type, url: url })).then((res) => {
        if (res.success) {
            ElMessage.success(res.msg);
        } else {
            ElMessage.error(res.msg);
        }
    }).catch((err) => { ElMessage.error(err.msg) });
}
// 测试SQL
// 主表
const updateemailbackref = ref()//主表查询返回值
const maintablebackref = ref()//主表返回值
const mainopenbackref = ref()//已开单据列表
const updatetaxnobackref = ref()//购货单位
const detailtablebackref = ref()//明细表
const customertablebackref = ref()//客户档案
const detailschedulesbackref = ref()//明细表合并
const updatetablebackref = ref()//销售单更新
const updatetaxsqlbackref = ref()//开票税额的回写
const updatesalemainref = ref()//开票流水号更新
const updatedatemainref = ref()//开票日期更新
const updatedetailsbackref = ref()//销售明细表更新
const deletedetailsbackref = ref()//销售明细表更新
const updateemailback = ref()//邮箱更新
const updatetaxnoback = ref()//税号更新
const maintableusebackref = ref()//主表可用字段
const detailusebackref = ref()//明细表可用字段
const executeSQL = (sqlString, resultRef, inputRef) => {
    const back = ref('') // 将back定义在函数内部，使其成为局部变量

    testSQL(sqlString, back, inputRef) // 将back和inputRef作为参数传递给testSQL

    // 使用watch来监听back.value的变化
    watch(() => back.value, (newValue) => {
        // 当back.value发生改变时，更新resultRef.value的值
        resultRef.value = newValue;
    });
}

const maintable = () => executeSQL(importData.value.mainsqlstring, maintableback, maintablebackref)
const maintablemainorderby = () => executeSQL(importData.value.mainorderby, maintablemainorderbyback, maintablemainorderbybackref)
const mainopen = () => executeSQL(importData.value.mainopensqlstring, mainopenback, mainopenbackref)
const detailtable = () => testSQL(importData.value.detailsqlstring, detailtableback, detailtablebackref)
const customertable = () => executeSQL(importData.value.customerquerysql, customertableback, customertablebackref)
const detailschedules = () => executeSQL(importData.value.detailquerysqlstring, detailschedulesback, detailschedulesbackref)
const updateemail = () => executeSQL(completeData.value.updateemailsql, updateemailback, updateemailbackref)
const updatetaxno = () => executeSQL(completeData.value.updatetaxnosql, updatetaxnoback, updatetaxnobackref)
const updatetable = () => executeSQL(completeData.value.salemainupdatesql, updatetableback, updatetablebackref)
const updatesalemain = () => executeSQL(completeData.value.updateinvoicedatesql, updatesalemainback, updatesalemainref)
const updatedatemain = () => executeSQL(completeData.value.salemainupdateserinosql, updatedatemainback, updatedatemainref)
const updatedetails = () => executeSQL(completeData.value.saledetailupdatesql, updatedetailsback, updatedetailsbackref)
const updatetaxsqldetails = () => executeSQL(completeData.value.updatetaxsql, updatetaxsqlback, updatetaxsqlbackref)
const deletedetails = () => executeSQL(completeData.value.deletesalesql, deletedetailsback, deletedetailsbackref)
const maintableuse = () => executeSQL(exportData.value.SaleMainExportSql, maintableuseback, maintableusebackref)
const detailuse = () => executeSQL(exportData.value.SaleDetalExportSql, detailuseback, detailusebackref)

const testSQL = (url, back, inputRef) => { // 在testSQL中接收back和inputRef作为参数
    back.value = '';
    return ajax.post('/cn_account/TestConnSql', qs.stringify({ connid: id.value, sql: url })).then((res) => {
        if (res.success) {
            ElMessage.success(res.msg);
            inputRef.value.style.color = 'green'; // 如果成功，将输入框的字体颜色设置为黑色
            back.value = res.msg;
        } else {
            ElMessage.error(res.msg);
            inputRef.value.style.color = 'red'; // 如果失败，将输入框的字体颜色设置为红色
            back.value = res.msg;
        }
        back.value = res.msg;
        return res.msg;
    }).catch((err) => {
        ElMessage.error(err.msg);
        inputRef.value.style.color = 'red'; // 如果请求失败，将输入框的字体颜色设置为红色
        back.value = err.msg;
    });
}

// 关闭弹窗
const close = () => {
    submit_dialogshow.value = false;
};

</script>

<style scoped>
@import './css/basicadd.css';
</style>
