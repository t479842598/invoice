<template>
    <div>
        <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="100px">
            <el-form-item label="组织id" class="roadui_formfont">
                {{ formData.id }}
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="formData.name" clearable></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-radio-group v-model="formData.type">
                    <el-radio :label="1">单位</el-radio>
                    <el-radio :label="2">部门</el-radio>
                    <el-radio :label="3">岗位</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-radio-group v-model="formData.status">
                    <el-radio :label="0">正常</el-radio>
                    <el-radio :label="1">冻结</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- <div style="display: flex;">
                <div>
                    <el-form-item label="开票公司" prop="CompanyItems">
                        <el-checkbox-group v-model="formData.CompanyItems" style="display: flex; flex-direction: column;">
                            <el-checkbox v-for="item in CompanyItems" :key="item.id" :label="item.label">{{ item.label
                            }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="账套选择" prop="sobItems">
                        <el-checkbox-group v-model="formData.sobItems" style="display: flex; flex-direction: column;">
                            <el-checkbox @change="sobchange" v-for="item in sobItems" :key="item.id" :label="item.label">{{
                                item.label }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </div>
            </div> -->
            <!--工作角色-->
            <el-form-item v-for="workrole in formData.workroleItems" :key="workrole.key" :label="workrole.title"
                prop="note">
                <el-selectorg v-model="workrole.members" :ref="(el) => setOrgRef(el, workrole.key)" style="width:600px"
                    clearable></el-selectorg>
            </el-form-item>
            <el-form-item label="备注" prop="note">
                <el-input v-model="formData.note" clearable></el-input>
            </el-form-item>
            <el-form-item label="导入人员" prop="note">
                <el-upload :action="config.SERVER_WEBADDRESS + '/Files/SaveFiles'" :show-file-list="false"
                    accept=".xlsx" :headers="{ 'nroadflow-token': utils.getToken() }" with-credentials
                    :data="{ filetype: '.xlsx', uploadtype: 0 }" :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <el-button type="primary">选择文件</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="移动到" v-if="moveToShow">
                <el-selectorg v-model="moveToId" select-type="unit,dept,station" placeholder="请选择要移动到的组织"
                    :multiple-limit="1" style="width:500px;margin-right:12px;" clearable></el-selectorg>
                <el-button type="primary" :disabled="butDisabled" @click="moveToOk">确定移动</el-button>
            </el-form-item>
            <el-form-item label="">
                <el-space wrap>
                    <el-button type="primary" :disabled="butDisabled" @click="clearable">清空</el-button>
                    <el-button type="primary" :disabled="butDisabled" @click="save(ruleFormRef, 0)">保存</el-button>
                    <el-button type="primary" :disabled="butDisabled" @click="save(ruleFormRef, 1)">保存为下级</el-button>
                    <el-button type="primary" :disabled="butDisabled" @click="addUser">添加人员</el-button>
                    <el-button type="danger" :disabled="butDisabled" @click="remove">删除</el-button>
                    <el-button type="warning" :disabled="butDisabled" @click="moveToShow = !moveToShow">移动</el-button>
                    <el-button type="info" :disabled="butDisabled" @click="srotChilds">下级排序</el-button>
                    <el-button type="primary" :disabled="butDisabled" @click="setMenu">菜单授权</el-button>
                    <el-button :disabled="butDisabled" @click="syncToWeChat">同步到企微</el-button>
                </el-space>
            </el-form-item>
        </el-form>
        <!--排序窗口-->
        <el-dialog v-model="dialogShow" title="排序" align-center destroy-on-close width="550px" draggable
            :close-on-click-modal="false">
            <draggable :list="sortItems" item-key="id" :animation="200" :group="{ name: 'orgsort', pull: true }"
                class="roadui_draggable_chosen">
                <template #item="{ element }">
                    <div class="roadui_draggable_item">
                        <div>{{ element.name }}</div>
                    </div>
                </template>
            </draggable>
            <template #footer>
                <span class="dialog-footer">
                    <el-button :disabled="butDisabled" type="primary" @click="saveSort">保存</el-button>
                    <el-button :disabled="butDisabled" @click="dialogShow = false">关闭</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import Draggable from 'vuedraggable';
import { ref, onMounted, onUnmounted, inject, watch } from 'vue';
const ajax = inject('ajax');
const utils = inject('utils');
const qs = inject('qs');
const ElSelectorg = inject('ElSelectorg');//组织架构选择控件
const parentOpenPage = inject('openPage');//上级页面打开页面方法。
const updateTreeNode = inject('updateTreeNode');//上级页面更新组织树节点方法。
//const updateWgTreeNode = inject('updateWgTreeNode');//上级页面更新工作组树节点方法。
const getTreeNode = inject('getTreeNode');//得到组织架构树节点
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const props = defineProps({ query: { type: String, default: () => { return ''; } } });

const butDisabled = ref(false);
let organizeId = utils.query('organizeid', props.query);
const moveToShow = ref(false);//显示移动到
const moveToId = ref('');//移动到组织id
const ruleFormRef = ref(null);//表单验证
const formData = ref({
    id: '',
    name: '',
    type: '',
    status: '',
    note: '',
    CompanyItems: [],
    sobItems: [],
});//表单数据
const rules = {
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
    // CompanyItems: [{ required: true, message: '请选择开票公司', trigger: 'blur' }],
    // sobItems: [{ required: true, message: '请选择账套', trigger: 'blur' }],
};
// // 开票公司选择
// const CompanyItems = ref([
//     { id: 1, label: '济南好助手' },
//     { id: 2, label: '青岛好助手' },
//     { id: 3, label: '北京好助手' },
//     { id: 4, label: '上海好助手' },
//     { id: 5, label: '天津好助手' },
//     { id: 6, label: '重庆好助手' },
// ]);
// // 账套选择
// const sobItems = ref([
//     { id: 1, label: 'A账套' },
//     { id: 2, label: 'B账套' },
//     { id: 3, label: 'C账套' },
// ]);
// const sobchange = (val) => {
//     console.log(sobItems.value);
//     console.log(val);
// }


const orgRefs = {};//组织架构选择控件
const setOrgRef = (el, key) => {
    if (el) {
        orgRefs[key] = el;
    }
}

onMounted(() => {
    //解决拖拽排序时会打开新页搜索问题。
    document.body.ondrop = function (event) {
        try {
            event.preventDefault();
            event.stopPropagation();
        } catch (e) { console.log(e) }
    }
    loadFormData();
});
onUnmounted(() => {
    document.body.ondrop = null;
});
//监听参数变化时重新加载
watch(() => props.query, (val) => {
    organizeId = utils.query('organizeid', val);
    loadFormData();
});
//加载数据
const loadFormData = () => {
    if (utils.length(organizeId) > 0) {
        ajax.post('/Organize/Get?organizeid=' + organizeId).then((res) => {
            if (res.code == -1) {
                utils.msg('未找到组织架构！', res.success);
                return;
            }
            formData.value = res.data;
            //初始化工作角色组织架构选择控件标题
            for (let i = 0; i < res.data.workroleItems.length; i++) {
                let orgRef = orgRefs[res.data.workroleItems[i].key];
                if (utils.isDef(orgRef)) {
                    orgRef.initTitle(res.data.workroleItems[i].members);
                }
            }
        }).catch(() => { });
    }
};
//清空
const clearable = () => {
    if (utils.isUndef(formData.value)) {
        return;
    }
    //清除工作角色
    for (let i = 0; i < formData.value.workroleItems.length; i++) {
        formData.value.workroleItems[i].members = '';
    }
    formData.value = {
        id: formData.value.id,
        parentId: formData.value.parentId,
        status: 0,
        workRole: '',
        workroleItems: formData.value.workroleItems
    };
    moveToId.value = '';
};
//保存 type 0保存 1保存为下级
const save = async (formEl, type) => {
    if (!formEl) {
        return;
    }
    await formEl.validate((valid) => {
        if (valid) {
            utils.confirm('您确定要保存' + (type === 1 ? '为下级' : '') + '吗？', () => {
                butDisabled.value = true;
                formData.value.workRole = JSON.stringify(formData.value.workroleItems);
                ajax.post('/Organize/Save?organizeid=' + (organizeId || '') + '&savetype=' + (type || 0) + '&srcorgid=' + sobInfo.value.id, qs.stringify(formData.value)).then((res) => {
                    butDisabled.value = false;
                    let msg = res.msg;
                    if (utils.length(msg) === 0) {
                        msg = res.code == 1 ? '数据验证错误！' : res.success ? '保存成功！' : '保存失败！';
                    }
                    utils.msg(msg, res.success);
                    if (res.success) {
                        //调用上级vue刷新
                        const treeNode = getTreeNode(formData.value.id);
                        const isLeaf = utils.isDef(treeNode) && treeNode.isLeaf;
                        const refreshId = 1 === type && !isLeaf ? formData.value.id : formData.value.parentId;
                        updateTreeNode(refreshId, isLeaf ? formData.value.id : '');
                    }
                }).catch(() => {
                    butDisabled.value = false;
                });
            });
        }
    });
};
//删除
const remove = () => {
    utils.confirm('此操作将会删除该组织及其所有下级组织，您确定要删除吗？', () => {
        butDisabled.value = true;
        ajax.post('/Organize/Delete', qs.stringify({ organizeid: formData.value.id })).then((res) => {
            let msg = res.msg;
            if (utils.length(msg) === 0) {
                if (res.success) {
                    msg = '删除成功！';
                } else {
                    msg = res.code == -1 ? '不能删除组织架构根！' : '删除失败！';
                }
            }
            utils.msg(msg, res.success);
            if (res.success) {
                //调用上级vue刷新
                updateTreeNode(formData.value.parentId);
                //转到空页面
                parentOpenPage({ type: -1 }, '');
            }
            butDisabled.value = false;
        }).catch(() => {
            butDisabled.value = false;
        });
    });
};
//添加人员
const addUser = () => {
    parentOpenPage({ id: '', type: 4 }, '?userid=&organizeid=' + organizeId + '&organizetype=' + (formData.value.type) + '&isadd=1&returnurl=' + encodeURIComponent(props.query));
};
//确定移动
const moveToOk = () => {
    if (utils.length(moveToId.value) === 0) {
        utils.msg('请选择要移动到的组织！', false);
        return;
    }
    utils.confirm('您确定要移动吗？', () => {
        butDisabled.value = true;
        ajax.post('/Organize/MoveTo', qs.stringify({ organizeid: organizeId, moveto: moveToId.value })).then((res) => {
            //返回 0：移动成功 1：要移动的组织为空 2：不能移动到自己的下级组织
            let msg = res.msg;
            if (utils.length(msg) === 0) {
                if (res.code == 0) {
                    msg = '移动成功！';
                } else if (res.code == 1) {
                    msg = '要移动的组织为空！';
                } else if (res.code == 2) {
                    msg = '不能移动到自己或自己的下级组织！';
                }
            }
            utils.msg(msg, res.success);
            butDisabled.value = false;
            if (res.success) {
                //调用上级vue刷新
                updateTreeNode(formData.value.parentId);
                updateTreeNode(moveToId.value, moveToId.value);
                moveToId.value = '';
            }
        }).catch(() => { butDisabled.value = false; });
    });
};
//下级排序
const dialogShow = ref(false);
const sortItems = ref([]);
const srotChilds = () => {
    ajax.post('/Organize/LoadChilds?organizeid=' + organizeId).then((res) => {
        if (!res.success || utils.length(res.data) <= 1) {
            utils.msg(utils.length(res.data) === 0
                ? '当前组织没有下级组织，勿需排序！如要对人员排序，请点击人员！'
                : '当前组织只有一个下级组织，勿需排序！如要对人员排序，请点击人员！', false);
            showSortModal = false;
            return;
        }
        sortItems.value = res.data;
        dialogShow.value = true;
    }).catch(() => { });
};
//保存下级排序
const saveSort = () => {
    let childs = [];
    for (let i = 0; i < sortItems.value.length; i++) {
        childs.push(sortItems.value[i].id);
    }
    butDisabled.value = true;
    ajax.post('/Organize/SaveSort?organizeid=' + formData.value.id, qs.stringify({ organizes: childs.join(',') })).then((res) => {
        let msg = res.msg;
        if (utils.length(msg) === 0) {
            msg = res.success ? '保存成功！' : '保存失败！';
        }
        utils.msg(msg, res.success);
        if (res.success) {
            dialogShow.value = false;
            //调用上级vue刷新
            updateTreeNode(formData.value.id);
        }
        butDisabled.value = false;
    }).catch(() => { butDisabled.value = false; });
};
//菜单授权
const setMenu = () => {
    parentOpenPage({ type: 0 }, '?organizeid=' + organizeId + '&organizetype=' + formData.value.type + '&returnurl=' + encodeURIComponent(props.query));
};
//同步企业微信
const syncToWeChat = () => {
    utils.confirm('您确定要同步整个组织架构到企业微信吗？', () => {
        butDisabled.value = true;
        ajax.post('/Organize/SyncToWeChat').then((res) => {
            let msg = res.code == 0 ? '同步完成！' : '同步失败！';
            utils.msg(msg, res.success);
            butDisabled.value = false;
        }).catch(() => { butDisabled.value = false; });
    });
};

//================================
//导入人员
//================================
const config = inject('config');
//导入上传前检查文件格式。
const beforeAvatarUpload = (rawFile) => {
    if (rawFile.name.substr(rawFile.name.lastIndexOf('.')) !== '.xlsx') {
        utils.msg('要导入的文件必须是xlsx格式文件!', false);
        return false;
    }
    return true;
};
//导入上传成功
const handleAvatarSuccess = (response, uploadFile) => {
    if (uploadFile.status === 'success') {
        let code = response.code;
        if (code != 0) {
            utils.msg('文件上传失败！', false);
            return;
        }
        const fileId = response.data.id;
        ajax.post('/Organize/ImportUser?srcorgid=' + sobInfo.value.id, qs.stringify({ files: fileId, deptId: organizeId })).then((res) => {
            let msg = res.msg;
            if (utils.length(msg) === 0) {
                if (res.success) {
                    msg = '导入成功！';
                    updateTreeNode(organizeId);
                } else if (res.code == 1) {
                    msg = '要导入的文件不存在！';
                } else {
                    msg = '导入失败！';
                }
            }
            utils.msg(msg, res.success);
        }).catch(() => { });
    } else if (uploadFile.status === 'error') {
        utils.msg('文件上传失败！', false);
    }
};
</script>