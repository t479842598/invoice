<template>
    <div>
        <el-form ref="formbutton" class="formbutton" inline>
            <el-form-item>
                <el-button type="primary" @click="SaveData">保存</el-button>
                <!-- <el-button type="default" @click="resets">重置</el-button> -->
            </el-form-item>
        </el-form>
        <!-- 开票账套维护新增修改 -->
        <el-tabs v-model="activeName" type="card" v-loading="loading" element-loading-text="正在保存，请稍等...">
            <el-tab-pane label="账套信息" name="账套信息">
                <!-- 基本信息 -->
                <el-form :model="editData" ref="ruleFormRef" :rules="rules" label-width="100px">
                    <el-form-item label="账套编号" prop="accountcode">
                        <el-input v-model="editData.accountcode" clearable style="width:100%;" />
                    </el-form-item>
                    <el-form-item label="账套名称" prop="accountname">
                        <el-input v-model="editData.accountname" clearable style="width:100%;" />
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
                    <el-form-item label="状态" prop="status" style="width:100%;">
                        <el-select v-model="editData.status" placeholder="请选择" style="width:100%;">
                            <el-option label="未启用" value="未启用"></el-option>
                            <el-option label="启用" value="启用"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="ERP类型" prop="erptype" style="width:100%;">
                        <el-select v-model="editData.erptype" placeholder="请选择" style="width:100%;">
                            <el-option label="T3" value="T3"></el-option>
                            <el-option label="U8" value="U8"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" prop="remarks">
                        <el-input v-model="editData.remarks" style="width:100%;"></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="基本信息" name="基本信息">
                <el-form :model="editData" class="inline" label-width="140px">
                    <el-form-item v-for="(item, index) in formItems" :key="index" :label="item.label">
                        <el-input :autosize="item.auto" :type="item.type" style="width: 300px;"
                            v-model="editData[item.model]"></el-input>
                    </el-form-item>
                    <!-- <el-form-item>
                        <el-button type="primary" @click="SaveData">保存</el-button>
                        <el-button type="default" @click="resets">重置</el-button>
                    </el-form-item> -->
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, nextTick, computed, provide, watch, defineAsyncComponent } from 'vue'
import { View, Edit, Search, Plus, Refresh, Tools } from '@element-plus/icons-vue'
import axios from 'axios';
import { ElMessage } from 'element-plus'
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
const qs = inject('qs');
const activeName = ref('账套信息')
const loading = ref(false);//加载中
const connTypes = ref([]);//数据库类型选项
const index_openmenu = inject('index_openmenu');//首页打开菜单
const index_removetab = inject('index_removetab');//首页关闭标签方法
const index_refreshtab = inject('index_refreshtab');//首页刷新标签方式
// 创建emits
const emits = defineEmits(['update:id'])
// 创建props
const props = defineProps({
    query: { type: String, default: () => { return ''; } },
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

//页面加载
onMounted(async () => {
    //获取开票单位信息
    await GetPageData();
    // 获取连接信息
    await database()
})
// 基础数据
const editData = ref({
    accountcode: '',//账套编号
    accountname: '',//账套名称
    taxno: '',//纳税人识别号
    address: '',//单位地址
    phone: '',//联系电话
    openbank: '',//银行账号
    bankaccount: '',//开户银行
    type: '',//数据库类型
    remarks: '',//备注
    url: '',//连接字符串
    status: '',//状态
    erptype: '',//ERP类型
});
// 表单行循环
const formItems = [
    { label: '单位名称', model: 'accountname', type: '', auto: false },
    { label: '纳税人识别号', model: 'taxno', type: '', auto: false },
    { label: '开户银行', model: 'openbank', type: '', auto: false },
    { label: '银行账号', model: 'bankaccount', type: '', auto: false },
    { label: '单位地址', model: 'address', type: 'textarea', auto: true },
    { label: '联系电话', model: 'phone', type: '', auto: false },
    { label: '联系邮箱', model: 'email', type: '', auto: false },
]
// 表单验证规则
const rules = {
    // accountcode: [{ required: true, message: '请输入账套编号', trigger: 'blur' }],
    // accountname: [{ required: true, message: '请输入账套名称', trigger: 'blur' }],
    // type: [{ required: true, message: '请选择连接类型', trigger: 'change' }],
    // url: [{ required: true, message: '请输入连接字符串', trigger: 'blur' }],
    // status: [{ required: true, message: '请选择状态', trigger: 'change' }],
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
// 获取页面数据
const GetPageData = async () => {
    try {
        // 使用async/await替代.then和.catch
        const res = await ajax.post('/SystemAccount/Get', qs.stringify({ id: id.value }));
        editData.value = res.data.customer;
    } catch (error) {
        // 处理错误
        console.error("Error occurred while fetching page data: ", error);
    }
}
//保存
const SaveData = async () => {
    try {
        const res = await ajax.post('/SystemAccount/Save', qs.stringify({ customerJSON: JSON.stringify(editData.value) }));
        const messageType = res.success ? 'success' : 'error';
        utils.msg(res.msg, messageType, false);
        if (res.success) {
            index_refreshtab();
        }
    } catch (error) {
        // 添加错误处理
        console.error("Error occurred while saving data: ", error);
        utils.msg('保存数据时出现错误', 'error', false);
    }
}

//重置
const resets = () => {
    formData.value = {
        invoicedepartname: '',//单位名称
        taxno: '',//纳税人识别号
        address: '',//单位地址
        phone: '',//联系电话
        openbank: '',//银行账号
        bankaccount: '',//开户银行
    }
}






</script>

<style scoped>
@import './css/basicadd.css';



:deep(.inline .el-input) {
    width: 300px;
    border-radius: 0;
}
</style>