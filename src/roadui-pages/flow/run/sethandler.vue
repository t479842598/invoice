<template>
    <div>
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
            <tr v-for="step in steps" :key="step.id">
                <td>
                    <div>{{step.name}}</div>
                    <div style="margin:12px 0 15px 0">
                        <el-selectorg style="width:100%" placeholder="选择处理人" :show-search="isMobile!='1'" v-model="step.members"></el-selectorg>
                    </div>
                </td>
            </tr>
            <tr>
                <td style="padding:10px 0 0 0">
                    <el-button :disabled="butDisabled" @click="save()" type="primary">保存</el-button>
                    <el-button @click="dialogShow=false">取消</el-button>
                </td>
            </tr>
        </table>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const ElSelectorg = inject('ElSelectorg');
    const dialogShow = inject('flowrun_dialogshow');//控制窗口显示

    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const steps = ref([]);
    const butDisabled = ref(false);
    const queryString = utils.getQuery(props.query);
    const isMobile = utils.query('ismobile', props.query);

    onMounted(() => {
        loadData();
    });

    const loadData = () => {
        butDisabled.value = true;
        ajax.post('/Flow/GetAllNextSteps?' + queryString).then((res) => {
            if (res.success) {
                steps.value = res.data;
            } else {
                utils.msg('加载步骤失败！', false);
            }
            butDisabled.value = false;
        }).catch(() => { butDisabled.value = false; });
    };
    //保存
    const save = () => {
        let json = [];
        for (let i = 0; i < steps.value.length; i++) {
            json.push({ id: steps.value[i].id, members: steps.value[i].members });
        }
        butDisabled.value = true;
        ajax.post('/Flow/SaveSetHandler?' + queryString, qs.stringify({ json: JSON.stringify(json) })).then((res) => {
            utils.msg(res.success ? '设置成功！' : '设置失败！', res.success);
            if (res.success) {
                dialogShow.value = false;
            }
            butDisabled.value = false;
        }).catch(() => { butDisabled.value = false; });
    };
</script>