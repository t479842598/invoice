<template>
    <el-select :placeholder="placeholder"
               filterable
               ref="selectFlowRef"
               :disabled="disabled"
               v-model="selectValue"
               :multiple="false"
               clearable
               @change="selectChange">
        <el-option-group v-for="type in flows"
                         :key="type.id"
                         :label="type.title">
            <el-option v-for="flow in type.children" :key="flow.id" :value="flow.id" :label="flow.name">
                <span class="roadui_selectflowico">
                    <component v-if="utils.length(flow.ico)>0" :is="flow.ico"></component>
                </span>
                <span>{{flow.name}}</span>
            </el-option>
        </el-option-group>
    </el-select>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const selectFlowRef = ref(null);
    const emit = defineEmits(['update:modelValue', 'change']);

    const props = defineProps({
        //值String
        modelValue: { type: String },
        //背景文字
        placeholder: { type: String, default: () => { return '请选择流程'; } },
        //是否禁用
        disabled: { type: Boolean, default: () => { return false; } },
        //加载选项权限判断 0不判断 1判断发起权限 2判断实例管理权限 3判断流程管理权限 4待办流程 5已办流程 6我的流程 7已委托 8批量待办
        authType: { type: Number, default: () => { return 0; } },
    });

    const flows = ref([]);
    const selectValue = ref(props.modelValue);
    onMounted(() => {
        loadFlow();
    });

    const loadFlow = () => {
        //如果utils.flows中有数据，说明已经加载过，不重复加载。 props.authType === 0表示只有不判断权限的时候才使用本地缓存。
        if (utils.flows.length > 0 && props.authType === 0) {
            flows.value = utils.flows;
            return;
        }
        ajax.post('/Flow/GetOptions', qs.stringify({ authType: props.authType })).then((res) => {
            if (res.success) {
                flows.value = res.data;
                //不判断权限，加载所有流程时把选项本地缓存。
                if (props.authType === 0) {
                    utils.flows = res.data;
                }
            }
        }).catch(() => { });
    };
    const selectChange = (val) => {
        updateModalValue(val);
    };
    //更新值
    const updateModalValue = (val) => {
        selectValue.value = val;
        emit('update:modelValue', val);
        emit('change', val);
    };
</script>