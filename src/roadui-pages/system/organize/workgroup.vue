<template>
    <div>
        <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="100px">
            <el-form-item label="工作组id" v-if="utils.length(formData.id)>0&&formData.id!=utils.emptyLong" class="roadui_formfont">
                {{formData.id}}
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="formData.name" clearable></el-input>
            </el-form-item>
            <el-form-item label="成员" prop="members">
                <el-selectorg v-model="formData.members" ref="orgRef" style="width:100%" select-type="unit,dept,station,user" clearable></el-selectorg>
            </el-form-item>
            <el-form-item label="备注" prop="note">
                <el-input v-model="formData.note" type="textarea" :rows="3" clearable></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" :disabled="butDisabled" @click="clearable">清空</el-button>
                <el-button type="primary" :disabled="butDisabled" @click="save(ruleFormRef,0)">保存</el-button>
                <el-button type="primary" :disabled="butDisabled" @click="save(ruleFormRef,1)">保存为下级</el-button>
                <el-button type="danger" v-if="formData.parentId>utils.emptyLong" :disabled="butDisabled" @click="remove">删除</el-button>
                <el-button type="info" v-if="formData.parentId>utils.emptyLong" :disabled="butDisabled" @click="showSort">排序</el-button>
                <el-button type="primary" v-if="formData.parentId>utils.emptyLong" :disabled="butDisabled" @click="menuAuth">菜单授权</el-button>
            </el-form-item>
        </el-form>
        <!--排序窗口-->
        <el-dialog v-model="dialogShow" title="排序" align-center destroy-on-close width="550px" draggable :close-on-click-modal="false">
            <draggable :list="sortItems" item-key="id" :animation="200" :group="{name:'orgsort',pull:true}" class="roadui_draggable_chosen">
                <template #item="{element}">
                    <div class="roadui_draggable_item">
                        <div>{{element.name}}</div>
                    </div>
                </template>
            </draggable>
            <template #footer>
                <span class="dialog-footer">
                    <el-button :disabled="butDisabled" type="primary" @click="saveSort">保存</el-button>
                    <el-button :disabled="butDisabled" @click="dialogShow=false">关闭</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
    import Draggable from 'vuedraggable';
    import { ref, inject, onMounted, onUnmounted, watch } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const ElSelectorg = inject('ElSelectorg');//组织架构选择控件
    const parentOpenPage = inject('openPage');//父节点打开页面
    const updateWgTreeNode = inject('updateWgTreeNode');//父节点刷新工作组

    const ruleFormRef = ref(null);
    const formData = ref({ status: 0 });
    const rules = {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    };
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const butDisabled = ref(false);
    let workgroupId = utils.query('workgroupid', props.query);
    const orgRef = ref(null);

    onMounted(() => {
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
        workgroupId = utils.query('workgroupid', val);
        loadFormData();
    });
    //加载人员数据
    const loadFormData = () => {
        if (utils.length(workgroupId) === 0) {
            return;
        }
        ajax.post('/Workgroup/Get?workgroupid=' + workgroupId).then((res) => {
            if (res.code == -1) {
                utils.msg('未找到工作组！', res.success);
                parentOpenPage({ type: -1 }, '');
                return;
            }
            formData.value = res.data;
            orgRef.value.initTitle(res.data.members);
        }).catch(() => { });
    };

    //清空
    const clearable = () => {
        formData.value = { id: formData.value.id };
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
                    ajax.post('/Workgroup/Save?workgroupid=' + (workgroupId || '') + '&savetype=' + (type || '0'), qs.stringify(formData.value)).then((res) => {
                        butDisabled.value = false;
                        let msg = res.msg;
                        if (utils.length(msg) === 0) {
                            msg = res.code == 1 ? '数据验证错误！' : res.success ? '保存成功！' : '保存失败！';
                        }
                        utils.msg(msg, res.success);
                        if (res.success) {
                            //调用上级vue刷新
                            updateWgTreeNode(1 === type ? formData.value.id : formData.value.parentId);
                        }
                    }).catch(() => { butDisabled.value = false; });
                });
            }
        });
    };
    //删除
    const remove = () => {
        utils.confirm('您确定要删除吗？', () => {
            butDisabled.value = true;
            ajax.post('/Workgroup/Delete', qs.stringify({ workgroupid: workgroupId })).then((res) => {
                let msg = res.msg;
                if (utils.length(msg) === 0) {
                    if (res.success) {
                        msg = '删除成功！';
                    } else if (res.code == 1) {
                        msg = 'id错误！';
                    } else if (res.code == 2) {
                        msg = '未找到要删除的工作组！';
                    } else if (res.code == 3) {
                        msg = '不能删除根工作组！';
                    }
                }
                utils.msg(msg, res.success);
                if (res.success) {
                    //调用上级vue刷新
                    updateWgTreeNode(formData.value.parentId);
                }
                butDisabled.value = false;
            }).catch(() => { butDisabled.value = false; });
        });
    };
    //排序
    const dialogShow = ref(false);
    const sortItems = ref([]);
    //加载排序窗口
    const showSort = () => {
        ajax.post('/Workgroup/GetSortItems?workgroupid=' + workgroupId).then((res) => {
            if (res.success) {
                sortItems.value = res.data;
                dialogShow.value = true;
            } else {
                utils.msg('加载工作组错误！', false);
            }
        }).catch(() => { });
    };
    //保存排序
    const saveSort = () => {
        let childs = [];
        for (let i = 0; i < sortItems.value.length; i++) {
            childs.push(sortItems.value[i].id);
        }
        ajax.post('/Workgroup/SaveSort', qs.stringify({ workgroups: childs.join(',') })).then((res) => {
            let msg = res.msg;
            if (utils.length(msg) === 0) {
                msg = res.success ? '保存成功！' : '保存失败！';
            }
            utils.msg(msg, res.success);
            if (res.success) {
                dialogShow.value = false;
                //调用上级vue刷新
                updateWgTreeNode(formData.value.parentId);
            }
        }).catch(() => { });
    };
    //菜单授权
    const menuAuth = () => {
        parentOpenPage({ type: 0 }, '?organizeid=w_' + workgroupId + '&organizetype=' + 6 + '&returnurl=' + encodeURIComponent(props.query));
    };
</script>