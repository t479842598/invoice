<template>
    <div>
        <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="80px" v-loading="loading">
            <el-form-item label="显示设置" prop="name">
                <el-select v-model="formData.showType" clearable style="width:180px;">
                    <el-option :value="0" label="只显示列表"></el-option>
                    <el-option :value="1" label="只显示图表"></el-option>
                    <el-option :value="2" label="列表和图表-默认列表"></el-option>
                    <el-option :value="3" label="列表和图表-默认图表"></el-option>
                </el-select>
                <el-form-item label="列表标题" prop="listLabel">
                    <el-input v-model="formData.listLabel" clearable style="width:130px;"></el-input>
                </el-form-item>
                <el-form-item label="图表标题" prop="chartLabel">
                    <el-input v-model="formData.chartLabel" clearable style="width:130px;"></el-input>
                </el-form-item>
                <el-form-item label="" prop="dark">
                    <el-checkbox v-model="formData.dark" :true-label="1" :false-label="0" style="margin-left:12px;">深色模式</el-checkbox>
                </el-form-item>
            </el-form-item>
            <el-form-item label="图表设置" prop="name">
                <el-codemirror v-model="formData.option" type="json" :autofocus="false" height="430px" width="99%"></el-codemirror>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="butDisabled" @click="save(ruleFormRef)">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const ElCodemirror = inject('ElCodemirror');
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const programId = utils.query('programid', props.query);
    const rules = {
        
    };
    const ruleFormRef = ref(null);
    const butDisabled = ref(false);
    const loading = ref(false);

    const formData = ref({});

    onMounted(() => {
        loadData();
    });

    const loadData = () => {
        if (utils.length(programId) > 0) {
            butDisabled.value = true;
            ajax.post('/Program/GetChart?programid=' + programId).then((res) => {
                if (res.code == 1) {
                    utils.msg('加载数据失败！', res.success);
                } else {
                    formData.value = res.data;
                }
                butDisabled.value = false;
                loading.value = false;
            }).catch(() => { butDisabled.value = false; loading.value = false; });
        } else {
            loading.value = false;
        }
    };

    //保存
    const save = async (formEl) => {
        if (!formEl) {
            return;
        }
        await formEl.validate((valid) => {
            if (valid) {
                butDisabled.value = true;
                ajax.post('/Program/SaveChart' + props.query, qs.stringify(formData.value)).then((res) => {
                    let msg = res.msg;
                    if (utils.length(msg) === 0) {
                        msg = res.success ? '保存成功！' : '保存失败！';
                    }
                    utils.msg(msg, res.success);
                    butDisabled.value = false;
                }).catch(() => { butDisabled.value = false; });
            }
        });
    };
</script>