<template>
    <div>
        <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="70px">
            <el-form-item label="接收人" prop="receiver">
                <el-selectorg v-if="!butDisabled" placeholder="选择加签接收人" style="width:100%" :select-range="selectRange" :show-search="isMobile!='1'" v-model="formData.receiver"></el-selectorg>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="butDisabled" @click="ok()">确定</el-button>
                <el-button :disabled="butDisabled" @click="dialogShow=false">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const ElSelectorg = inject('ElSelectorg');
    const addWriteOk = inject('flowrun_addwriteok');
    const dialogShow = inject('flowrun_dialogshow');//控制窗口显示

    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const queryString = utils.getQuery(props.query);
    const stepId = utils.query('stepid', props.query);//步骤id
    const isMobile = utils.query('ismobile', props.query);
    const ruleFormRef = ref(null);
    const formData = ref({});
    const selectRange = ref('');
    const butDisabled = ref(false);
    const rules = {
        receiver: [{ required: true, message: '请选择接收人', trigger: 'blur' }],
    };

    onMounted(() => {
        loadData();
    });

    //载入组织架构选择范围
    const loadData = () => {
        butDisabled.value = true;
        ajax.post('/Flow/GetAddWriteSelectRange?' + queryString).then((res) => {
            selectRange.value = res.data.range;
            butDisabled.value = false;
        }).catch(() => { butDisabled.value = false; });
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
                let selectSteps = [{ id: stepId, members: formData.value.receiver, addWriteType: 0, addWriteHandleType: 0 }];
                //调用父页面方法
                addWriteOk(selectSteps);
                butDisabled.value = false;
                dialogShow.value = false;
            }
        });
    };
</script>