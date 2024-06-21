<template>
    <codemirror v-model="code"
                :tab-size="tabSize"
                :autofocus="autofocus"
                indent-with-tab
                :extensions="getExtensions(type)"
                :style="{width:width,height:height}" 
                :placeholder="placeholder" 
                @change="updateValue"></codemirror>
</template>

<script>
    export default {
        name: 'ElCodemirror'
    }
</script>

<script setup>
    import { Codemirror } from "vue-codemirror";
    import { javascript } from "@codemirror/lang-javascript";
    import { sql } from "@codemirror/lang-sql";
    import { html } from "@codemirror/lang-html";
    import { ref, inject, onMounted, watch } from 'vue';
    const utils = inject('utils');
    const props = defineProps({
        //值
        modelValue: { type: String, default: () => { return ''; } },
        //宽
        width: { type: String, default: () => { return '100%'; } },
        //高
        height: { type: String, default: () => { return 'auto'; } },
        //自动焦点
        autofocus: { type: Boolean, default() { return true; } },
        //代码类型
        type: { type: String, default: () => { return 'javascript'; } },
        //tabSize
        tabSize: { type: Number, default: () => { return 4; } },
        //placeholder
        placeholder: { type: String, default: () => { return ''; } },
    });
    const code = ref(props.modelValue);
    const emit = defineEmits(['update:modelValue']);
    watch(() => props.modelValue, (val) => {
        code.value = val;
    });
    onMounted(() => {
        
    });

    const getExtensions = (type) => {
        if (utils.length(type) === 0) {
            type = props.type;
        }
        switch (type.toLowerCase()) {
            case 'html':
                return [html()];
            case 'sql':
                return [sql()];
            default:
                return [javascript()];
        }
    };

    //更新值
    const updateValue = (val) => {
        emit('update:modelValue', val);
    };
</script>