<template>
    <el-select ref="selectIcoRef"
               :placeholder="placeholder"
               filterable
               :filter-method="filterIcon"
               v-model="selectValue"
               @clear="clear"
               @visible-change="visibleChange"
               style="vertical-align:middle;">
        <template #prefix>
            <component v-if="utils.length(selectValue)>0" style="width:16px;height:16px;vertical-align:middle;" :is="selectValue"></component>
        </template>
        <el-option value="" label="" style="height:0;padding:0;display:none;"></el-option>
        <div class="roadui_selecticodiv">
            <el-space wrap size="large">
                <div class="roadui_selectico" v-for="icon in icons" :key="icon" :title="icon" @click="setIcon(icon)">
                    <component :is="icon" />
                </div>
            </el-space>
        </div>
    </el-select>
</template>

<script>
    export default {
        name:'ElSelectico'
    }
</script>

<script setup>
    import { ref, reactive, inject, watch } from 'vue';
    const utils = inject('utils');
    const props = defineProps({
        //背景文字
        placeholder: { type: String, default: () => { return '请选择图标'; } },
        //值
        modelValue: { type: String, default: () => { return ''; } }
    });
    const selectIcoRef = ref(null);
    const icons = ref(utils.icons);
    const icons1 = reactive([...utils.icons]);
    const selectValue = ref(props.modelValue);
    const emit = defineEmits(['update:modelValue']);
    let isClose = false;

    watch(() => props.modelValue, (val) => {
        if (selectValue.value !== val) {
            selectValue.value = val;
        }
    });

    //搜索图标
    const filterIcon = (keyWord) => {
        icons.value = icons1;
        if (utils.length(keyWord) === 0) {
            return;
        }
        icons.value = icons.value.filter((icon) => icon.toLowerCase().indexOf(keyWord.toLowerCase()) >= 0);
    };
    //选择图标
    const setIcon = (icon) => {
        selectIcoRef.value.blur();
        selectValue.value = icon;
        emit('update:modelValue', icon);
        isClose = true;
    };
    //清空
    const clear = () => {
        selectValue.value = '';
        emit('update:modelValue', '');
    };
    //当选择框隐藏时清除搜索图标
    const visibleChange = (val) => {
        if (val) {
            icons.value = icons1;
            if (isClose) {
                selectIcoRef.value.blur();
                isClose = false;
            }
        }
    };
</script>