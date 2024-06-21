<template>
    <div>
        <!-- 开票单位管理新增修改 -->
        <el-form :model="formData" class="inline" label-width="130px">
            <el-form-item v-for="(item, index) in formItems" :key="index" :label="item.label">
                <el-input :autosize="item.auto" :type="item.type" style="width: 300px;"
                    v-model="formData[item.model]"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="formData.status" placeholder="请选择">
                    <el-option label="启用" value="启用"></el-option>
                    <el-option label="未启用" value="未启用"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="SaveData">保存</el-button>
                <el-button type="default" @click="resets">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, nextTick, computed, provide, watch, defineAsyncComponent } from 'vue'
import { View, Edit, Search, Plus, Refresh, Tools } from '@element-plus/icons-vue'
import axios from 'axios';
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
const qs = inject('qs');
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
})
// 表单数据
const formData = ref({
    invoicedepartname: '',//单位名称
    taxno: '',//纳税人识别号
    address: '',//单位地址
    phone: '',//联系电话
    openbank: '',//银行账号
    bankaccount: '',//开户银行
    status: '',//状态
})
// 表单行循环
const formItems = [
    { label: '单位名称', model: 'invoicedepartname', type: '', auto: false },
    { label: '纳税人识别号', model: 'taxno', type: '', auto: false },
    { label: '开户银行', model: 'openbank', type: '', auto: false },
    { label: '银行账号', model: 'bankaccount', type: '', auto: false },
    { label: '单位地址', model: 'address', type: 'textarea', auto: true },
    { label: '联系电话', model: 'phone', type: '', auto: false },
    { label: '联系邮箱', model: 'email', type: '', auto: false },
]
// 获取页面数据
const GetPageData = async () => {
    try {
        // 使用async/await替代.then和.catch
        const res = await ajax.post('/InvoiceDepartment/Get', qs.stringify({ id: id.value }));
        formData.value = res.data.customer;
    } catch (error) {
        // 处理错误
        console.error("Error occurred while fetching page data: ", error);
    }
}
//保存
const SaveData = async () => {
    try {
        const res = await ajax.post('/InvoiceDepartment/Save', qs.stringify({ customerJSON: JSON.stringify(formData.value) }));
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
:deep(.el-input) {
    width: 300px;
    border-radius: 0;
}
</style>