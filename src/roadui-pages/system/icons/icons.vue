<template>
    <div class="roadui_page">
        <div style="margin-bottom:20px;">
            <el-input v-model="keyWord" @input="searchIcon" :placeholder="`共${icons.length}个图标，输入图标名称可搜索。`" style="width:400px" clearable></el-input>
        </div>
        <div :style="{'height':'calc(100% - 72px)','overflow':'auto'}">
            <el-space wrap size="large">
                <div v-for="icon in icons" :title="icon" class="roadui_lconlist" @click="copyText(icon)">
                    <component :is="icon"></component>
                </div>
            </el-space>
        </div>
        <textarea class="roadui_icontextarea" ref="iconTextareaRef"></textarea>
    </div>
</template>

<script setup>
    import { ref, onMounted, inject } from 'vue';
    const utils = inject('utils');
    const icons = ref(utils.icons);
    const icons1 = [...utils.icons];
    const keyWord = ref('');
    const iconTextareaRef = ref(null);

    onMounted(() => {
        
    });
    //搜索图标
    const searchIcon = () => {
        icons.value = icons1;
        if (utils.length(keyWord.value) === 0) {
            return;
        }
        icons.value = icons.value.filter((icon) => icon.toLowerCase().indexOf(keyWord.value.toLowerCase()) >= 0);
    }
    //复制到剪贴板
    const copyText = (text) => {
        iconTextareaRef.value.value = '<el-icon><' + text + ' /></el-icon>';
        iconTextareaRef.value.select();
        document.execCommand('copy');
        utils.msg('已复制到剪贴板！', true);
    };
</script>