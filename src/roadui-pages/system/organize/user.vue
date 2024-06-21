<template>
    <div>
        <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="100px">
            <el-form-item label="人员id" v-if="utils.length(formData.id) > 0 && formData.id != utils.emptyLong"
                class="roadui_formfont">
                {{ formData.id }}
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="formData.name" @blur="getAccount" clearable></el-input>
            </el-form-item>
            <el-form-item label="登录帐号" prop="account">
                <el-input v-model="formData.account" clearable></el-input>
            </el-form-item>
            <el-form-item label="开票帐号" prop="invoiceaccount">
                <el-input v-model="formData.invoiceaccount" clearable></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="formData.gender">
                    <el-radio :label="0">男</el-radio>
                    <el-radio :label="1">女</el-radio>
                </el-radio-group>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="formData.status">
                        <el-radio :label="0">正常</el-radio>
                        <el-radio :label="1">冻结</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form-item>
            <div style="display: flex;">
                <!-- <div>
                    <el-form-item label="开票公司" prop="CompanyItems">
                        <el-checkbox-group v-model="CompanyItemss" style="display: flex; flex-direction: column;">
                            <el-checkbox v-for="item in CompanyItems" :key="item.id" :label="item.id">{{ item.label
                            }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </div> -->
                <div>
                    <el-form-item label="账套选择" prop="sobItems">
                        <el-checkbox-group v-model="checkList" style="display: flex; flex-direction: column;">
                            <el-checkbox v-for="item in sobItems" :key="item.id" :label="item.id">{{
                                item.label }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </div>
            </div>
            <el-form-item label="手机" prop="phone">
                <el-input v-model="formData.phone" style="width:280px" clearable></el-input>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="formData.email" style="width: 280px" clearable></el-input>
                </el-form-item>
            </el-form-item>
            <el-form-item label="办公电话" prop="tel">
                <el-input v-model="formData.tel" style="width: 280px" clearable></el-input>
                <el-form-item label="生日" prop="birthDay">
                    <el-date-picker v-model="formData.birthDay" value-format="YYYY-MM-DD" type="date"
                        :disabled-date="(time) => { return time.getTime() > Date.now(); }" />
                </el-form-item>
            </el-form-item>
            <el-form-item label="工号" prop="jobNumber">
                <el-input v-model="formData.jobNumber" style="width: 280px" clearable></el-input>
                <el-form-item label="身份证号" prop="idCard">
                    <el-input v-model="formData.idCard" :maxlength="18" style="width: 280px" clearable></el-input>
                </el-form-item>
            </el-form-item>
            <el-form-item label="调动到" v-if="transferToShow">
                <el-selectorg v-model="transferToId" select-type="unit,dept,station" placeholder="请选择要调往的组织"
                    :multiple-limit="1" style="width:280px;margin-right:12px;" clearable></el-selectorg>
                <el-checkbox v-model="transferToPartTime" label="兼任" size="large" style="margin-right:12px" />
                <el-button type="primary" :disabled="butDisabled" @click="transferToOk">确定调动</el-button>
            </el-form-item>
            <el-form-item label="签章" v-if="!isAdd">
                <el-usersign :sign="utils.length(formData.sign) > 0 ? formData.sign : formData.name"></el-usersign>
                <span style="margin-left:12px">
                    <el-button type="primary" @click="setSign(formData)">设置</el-button>
                </span>
            </el-form-item>
            <el-form-item label="所在组织" v-if="!isAdd">
                <el-space direction="vertical" alignment="left" :size="0">
                    <div v-for="(org, index) in formData.organizes" :key="index" class="roadui_formfont">
                        {{ utils.replaceWildcard(org) }}</div>
                </el-space>
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" :disabled="butDisabled" @click="save(ruleFormRef)">保存</el-button>
                <!-- <el-button type="primary" :disabled="butDisabled" @click="check">测试</el-button> -->
                <el-button type="primary" :disabled="butDisabled" v-if="isAdd" @click="returnPrev">返回</el-button>
                <el-button type="danger" :disabled="butDisabled" v-if="!isAdd" @click="remove">删除</el-button>
                <el-button type="warning" :disabled="butDisabled" v-if="!isAdd"
                    @click="transferToShow = !transferToShow">调动</el-button>
                <el-button type="warning" :disabled="butDisabled" v-if="!isAdd" @click="initPassword">初始密码</el-button>
                <el-button type="info" :disabled="butDisabled" v-if="!isAdd && showType == 0"
                    @click="showSortUsers">排序</el-button>
                <el-button type="primary" :disabled="butDisabled" v-if="!isAdd" @click="menuAuth">菜单授权</el-button>
                <el-button :disabled="butDisabled" v-if="!isAdd" @click="showMenuAuth">查看菜单授权</el-button>
            </el-form-item>
        </el-form>
        <!--排序-->
        <el-dialog v-model="dialogShow" title="排序" align-center destroy-on-close width="550px" draggable
            :close-on-click-modal="false">
            <draggable :list="sortUsers" item-key="id" :animation="200" :group="{ name: 'menu', pull: true }"
                class="roadui_draggable_chosen">
                <template #item="{ element }">
                    <div class="roadui_draggable_item">
                        <div>{{ element.name }}</div>
                    </div>
                </template>
            </draggable>
            <template #footer>
                <span class="dialog-footer">
                    <el-button :disabled="butDisabled" type="primary" @click="saveUserSort">保存</el-button>
                    <el-button :disabled="butDisabled" @click="dialogShow = false">关闭</el-button>
                </span>
            </template>
        </el-dialog>
        <!--设置签章-->
        <el-dialog v-model="dialogSignShow" title="签章" class="el-dialog__padding" align-center destroy-on-close
            width="500px" draggable :close-on-click-modal="false">
            <component :is="signPage" :query="signQuery"></component>
        </el-dialog>
    </div>
</template>

<script setup>
import Draggable from 'vuedraggable';
import { ref, provide, inject, onMounted, onUnmounted, watch, shallowRef } from 'vue';
const ajax = inject('ajax');
const utils = inject('utils');
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const qs = inject('qs');
const ElSelectorg = inject('ElSelectorg');//组织架构选择控件
const ElUsersign = inject('ElUsersign');
const parentOpenPage = inject('openPage');//父节点打开页面
const updateTreeNode = inject('updateTreeNode');//父节点更新节点
const showType = inject('showType');//组织显示类型 0:组织架构 1:工作组

const props = defineProps({ query: { type: String, default: () => { return ''; } } });//参数
const isAdd = utils.query('isadd', props.query);//是否新增

const ruleFormRef = ref(null);//表单引用
const checkList = ref([])//账套数据
const formData = ref({ status: 0 });//表单数据
const rules = {
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    account: [{ required: true, message: '请输入登录帐号', trigger: 'blur' }],
    invoiceaccount: [{ required: true, message: '请输入开票帐号', trigger: 'blur' }],
    gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
};
const butDisabled = ref(false);
const transferToShow = ref(false);//显示调动到
let userId = utils.query('userid', props.query);
let organizeId = utils.query('organizeid', props.query);
let organizeType = utils.query('organizetype', props.query);
// 开票公司数据
const CompanyItemss = ref([]);
// 开票公司
const CompanyItems = ref([]);
// 账套选择
const sobItems = ref([]);
onMounted(() => {
    // getCompanyItems();
    getsobItems();
    loadFormData();
    //解决拖拽排序时会打开新页搜索问题。
    document.body.ondrop = function (event) {
        try {
            event.preventDefault();
            event.stopPropagation();
        } catch (e) { console.log(e) }
    }
});
onUnmounted(() => {
    document.body.ondrop = null;
});
//监听参数变化时重新加载
watch(() => props.query, (val) => {
    userId = utils.query('userid', val);
    organizeId = utils.query('organizeid', val);
    organizeType = utils.query('organizetype', val);
    loadFormData();
});
// const check = () => {
//     console.log(checkList.value);
// }
//加载人员数据
const loadFormData = () => {
    if (utils.length(userId) === 0) {
        return;
    }
    ajax.post('/User/Get?userid=' + userId + '&organizetype=' + organizeType).then((res) => {
        if (res.success) {
            checkList.value = [];
            CompanyItemss.value = [];
            formData.value = res.data;
            for (let i = 0; i < res.data.accoutlist.length; i++) {
                checkList.value.push(Number(res.data.accoutlist[i].id))
            }
            for (let i = 0; i < res.data.invoicedepartment.length; i++) {
                CompanyItemss.value.push(Number(res.data.invoicedepartment[i].id))
            }
        } else {
            utils.msg('未找到人员！', false);
        }
    }).catch(() => { });
};
// // 账套选择
const getsobItems = () => {
    ajax.post('user/GetUserAccount?srcorgid=' + sobInfo.value.id).then((res) => {
        if (res.success) {
            sobItems.value = res.data;
            // loadFormData();
        }
    }).catch(() => { });
};
// // 开票公司
// const getCompanyItems = () => {
//     ajax.post('user/GetUserInvoiceDepart').then((res) => {
//         if (res.success) {
//             CompanyItems.value = res.data;
//             // loadFormData();
//         }
//     }).catch(() => { });
// };
//返回
const returnPrev = () => {
    let organizeType = utils.query('organizetype', props.query);
    let returnUrl = utils.query('returnurl', props.query);
    parentOpenPage({ type: organizeType }, returnUrl);
};
//输入姓名时获取帐号
const getAccount = () => {
    const name = formData.value.name;
    if (utils.length(formData.value.name) === 0 || utils.length(formData.value.account) > 0) {
        return;
    }
    ajax.post('/User/GetAccount?srcorgid=' + sobInfo.value.id, qs.stringify({ name: name })).then((res) => {
        if (res.success) {
            formData.value.account = res.data;
        }
    }).catch(() => { });
};
//保存 type
const save = async (formEl) => {
    if (!formEl) {
        return;
    }
    await formEl.validate((valid) => {
        if (valid) {
            formData.value.accountlist = checkList.value.join(',');
            formData.value.invoicedepartlist = CompanyItemss.value.join(',');
            butDisabled.value = true;
            ajax.post('/User/Save?userid=' + userId + '&organizeid=' + organizeId + '&organizetype=' + organizeType + '&srcorgid=' + sobInfo.value.id, qs.stringify(formData.value)).then((res) => {
                butDisabled.value = false;
                let msg = res.msg;
                if (utils.length(msg) === 0) {
                    if (res.code == 1) {
                        msg = '数据验证错误！';
                    } else if (res.code == 2) {
                        msg = '帐号已经被使用！';
                    } else {
                        msg = res.success ? '保存成功！' : '保存失败！';
                    }
                }
                utils.msg(msg, res.success);
                butDisabled.value = false;
                if (res.success) {
                    //返回
                    if (isAdd) {
                        returnPrev();
                    }
                    //调用上级刷新
                    updateTreeNode(organizeId);
                }
            }).catch(() => {
                butDisabled.value = false;
            });
        }
    });
};
//删除
const remove = () => {
    utils.confirm('您确定要删除吗？', () => {
        butDisabled.value = true;
        ajax.post('/User/Delete', qs.stringify({ userid: userId })).then((res) => {
            let msg = res.msg;
            if (utils.length(msg) === 0) {
                if (res.success) {
                    msg = '删除成功！';
                } else if (res.code == 1) {
                    msg = '当前人员存在流程任务，不能删除！';
                } else {
                    msg = res.code == -1 ? '未找到要删除的人员！' : '删除失败！';
                }
            }
            utils.msg(msg, res.success);
            if (res.success) {
                //调用上级刷新
                updateTreeNode(organizeId);
            }
            butDisabled.value = false;
        }).catch(() => {
            butDisabled.value = false;
        });
    });
};
//初始密码
const initPassword = () => {
    utils.confirm('您确定要初始化密码吗？', () => {
        butDisabled.value = true;
        ajax.post('/User/InitPassword?userid=' + userId + '&organizetype=' + organizeType).then((res) => {
            if (res.success) {
                utils.alert('密码已初始化为：' + res.data.password, '', '', true);
            } else {
                let msg = res.msg;
                if (utils.length(msg) === 0) {
                    msg = res.code == -1 ? '未找到人员！' : '初始化密码失败！';
                    utils.msg(msg, false);
                }
            }
            butDisabled.value = false;
        }).catch(() => { butDisabled.value = false; });
    });
};
//排序
const dialogShow = ref(false);//显示排序窗口
const sortUsers = ref([]);//排序的人员
const showSortUsers = () => {
    //得到一个机构下的人员，进行排序。
    ajax.post('/User/GetSortItems?organizeid=' + organizeId).then((res) => {
        if (res.success) {
            if (res.data.length === 1) {
                utils.msg('当前组织下只有一个人员，勿需排序！', false);
                return;
            }
            sortUsers.value = res.data;
            dialogShow.value = true;
        } else {
            utils.msg('加载人员错误！', false);
        }
    }).catch(() => { });
};
//保存排序
const saveUserSort = () => {
    let childs = [];
    for (let i = 0; i < sortUsers.value.length; i++) {
        childs.push(sortUsers.value[i].id);
    }
    ajax.post('/User/SaveSort?organizeid=' + organizeId, qs.stringify({ organizeusers: childs.join(',') })).then((res) => {
        let msg = res.msg;
        if (utils.length(msg) === 0) {
            msg = res.success ? '保存成功！' : '保存失败！';
        }
        utils.msg(msg, res.success);
        if (res.success) {
            dialogShow.value = false;
            //调用上级刷新
            updateTreeNode(organizeId);
        }
    }).catch(() => { });
};
//调动
const transferToId = ref('');//调动到的组织
const transferToPartTime = ref(false);//是否兼任调动
//保存调动
const transferToOk = () => {
    if (utils.length(transferToId.value) === 0) {
        utils.msg('请选择要调往的组织！', false);
        return;
    }
    utils.confirm('您确定要调动吗？', () => {
        butDisabled.value = true;
        ajax.post('/User/TransferTo', qs.stringify({ userid: formData.value.id, toorg: transferToId.value, parttime: transferToPartTime.value })).then((res) => {
            utils.msg(res.success ? '调动成功！' : '调动失败！', res.success);
            butDisabled.value = false;
            if (res.success) {
                //调用上级vue刷新
                updateTreeNode(organizeId);
                updateTreeNode(transferToId.value);

                transferToId.value = '';
                transferToPartTime.value = false;
            }
        }).catch(() => { butDisabled.value = false; });
    });
};

//菜单授权
const menuAuth = () => {
    parentOpenPage({ type: 0 }, '?organizeid=u_' + formData.value.id + '&organizetype=' + organizeType + '&returnurl=' + encodeURIComponent(props.query));
};
//查看授权菜单
const showMenuAuth = () => {
    parentOpenPage({ type: -2 }, '?userid=' + formData.value.id + '&organizetype=4' + '&returnurl=' + encodeURIComponent(props.query));
};

//设置签章
import sign from '../userset/sign.vue';
const dialogSignShow = ref(false);
const signPage = shallowRef(sign);
const signQuery = ref('');
const setSign = (data) => {
    signQuery.value = '?userid=' + data.id;
    dialogSignShow.value = true;
};
provide('user_info', formData);
provide('user_dialogsignshow', dialogSignShow);
provide('user_loadformdata', loadFormData);
</script>