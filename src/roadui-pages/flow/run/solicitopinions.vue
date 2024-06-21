<template>
    <div>
        <el-tabs @tab-change="tabChange">
            <el-tab-pane name="0" label="征求意见">
                <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="70px">
                    <el-form-item label="接收人" prop="receiver">
                        <el-selectorg placeholder="选择接收人" style="width:100%" :show-search="isMobile!='1'" v-model="formData.receiver"></el-selectorg>
                    </el-form-item>
                    <el-form-item label="可见性" prop="visibility">
                        <el-radio-group v-model="formData.visibility">
                            <el-radio :label="0">仅自己可见</el-radio>
                            <el-radio :label="1">流程参与人可见</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="说明" prop="note">
                        <el-input type="textarea" :rows="3" placeholder="接收人可看见您在这里输入的说明" v-model="formData.note"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :disabled="butDisabled" @click="ok()">确定</el-button>
                        <el-button :disabled="butDisabled" @click="dialogShow=false">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane name="1" label="查看回复">
                <div v-loading="loading" class="roadui_flowsolicitopinions" v-for="(comment,index) in comments" :key="'comment_'+index">
                    <table border="0" cellpadding="0" cellspacing="0" style="width:100%">
                        <tr>
                            <td style="padding:8px 0;width:28%;" valign="top">
                                <span style="margin-right:12px">接收人</span>
                                <el-tooltip placement="top">
                                    <template #content>
                                        {{utils.replaceWildcard(comment.receiverOrganize)}}
                                    </template>
                                    <el-tag>{{comment.receiverName}}</el-tag>
                                </el-tooltip>
                            </td>
                            <td style="padding:8px 0;width:36%;" valign="top"><span style="margin-right:12px">接收时间</span>{{comment.receiveTime}}</td>
                            <td style="padding:8px 0;width:36%;" valign="top"><span v-if="utils.length(comment.completedTime)>0"><span style="margin-right:12px">回复时间</span>{{comment.completedTime}}</span><el-tag v-else type="info">未回复</el-tag></td>
                        </tr>
                        <tr v-if="utils.length(comment.note)>0">
                            <td colspan="3" style="padding:8px 0;"><span style="margin-right:12px"><span style="margin-right:12px">说明</span>{{comment.note}}</span><span class="roadui_note">{{comment.visibility==10?'仅自己可见':'参与人可见'}}</span></td>
                        </tr>
                        <tr v-if="utils.length(comment.comment)>0">
                            <td colspan="3" style="padding:8px 0;"><span style="margin-right:12px">回复</span>{{comment.comment}}</td>
                        </tr>
                    </table>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const ElSelectorg = inject('ElSelectorg');
    const solicitOpinionsOk = inject('flowrun_solicitopinionsok');
    const dialogShow = inject('flowrun_dialogshow');//控制窗口显示
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const queryString = utils.getQuery(props.query);
    const stepId = utils.query('stepid', props.query);//步骤id
    const isMobile = utils.query('ismobile', props.query);

    const butDisabled = ref(false);
    const loading = ref(false);
    const ruleFormRef = ref(null);
    const formData = ref({});
    const rules = {
        receiver: [{ required: true, message: '请选择接收人', trigger: 'blur' }],
        visibility: [{ required: true, message: '请选择可见性', trigger: 'blur', },],
    };

    //加载已征求意见
    const comments = ref([]);
    const loadData = () => {
        butDisabled.value = true;
        loading.value = true;
        ajax.post('/Flow/GetSolicitOpinions?' + queryString).then((res) => {
            comments.value = res.data;
            butDisabled.value = false;
            loading.value = false;
        }).catch(() => { butDisabled.value = false; loading.value = false; });
    };
    //tab切换，切换到查看意见时加载已征求意见。
    const tabChange = (activeName) => {
        if (activeName == '1') {
            loadData();
        }
    };
    //确定
    const ok = async () => {
        if (utils.length(stepId) === 0) {
            utils.msg('未找到步骤！', false);
            return;
        }
        await ruleFormRef.value.validate((valid) => {
            if (valid) {
                butDisabled.value = true;
                let selectSteps = [{ id: stepId, members: formData.value.receiver, visibility: formData.value.visibility, note: formData.value.note }];
                //调用父页面方法
                solicitOpinionsOk(selectSteps);
                butDisabled.value = false;
                dialogShow.value = false;
            }
        });
    };
</script>