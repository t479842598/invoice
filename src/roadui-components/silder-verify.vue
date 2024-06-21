<template>
    <div :class="'silder-range'+(rangeStatus?' success':'')">
        <div @mousedown="rangeMove" ref="divRef">
            <el-icon v-if="rangeStatus"><Select /></el-icon>
            <el-icon v-else><ArrowRightBold /></el-icon>
        </div>
        {{rangeStatus?successText:startText}}
    </div>
</template>

<script>
    export default {
        name: 'SilderVerify'
    }
</script>

<script setup>
    import { ref } from 'vue';
    const props = defineProps({
        //成功图标
        successIcon: { type: String, default: () => { return 'Check' } },
        //成功文字
        successText: { type: String, default: () => { return '验证成功'; } },
        //开始的图标
        startIcon: { type: String, default: () => { return 'ArrowRight'; } },
        //开始的文字
        startText: { type: String, default: () => { return '拖动滑块到最右侧'; } },
    });
    const emit = defineEmits(['failed', 'success']);
    const rangeStatus = ref(false);
    const divRef = ref(null);
    
    const rangeMove = (e) => {
        let ele;
        if (e.target.tagName === 'path') {
            ele = e.target.parentElement.parentElement.parentElement;
        } else if (e.target.tagName === 'svg') {
            ele = e.target.parentElement.parentElement;
        } else if (e.target.tagName === 'i') {
            ele = e.target.parentElement;
        } else {
            ele = e.target
        }
        
        let startX = e.clientX;
        let eleWidth = ele.offsetWidth;
        let parentWidth = ele.parentElement.offsetWidth;
        let MaxX = parentWidth - eleWidth;
        let disX = 0;
        if (rangeStatus.value) {//不运行
            return false;
        }
        document.onmousemove = (e) => {
            let endX = e.clientX;
            disX = endX - startX;
            if (disX <= 0) {
                disX = 0;
            }
            if (disX >= MaxX - eleWidth) {//减去滑块的宽度,体验效果更好
                disX = MaxX;
            }
            ele.style.transition = '.1s all';
            ele.style.transform = 'translateX(' + disX + 'px)';
            e.preventDefault();
        }
        document.onmouseup = () => {
            if (disX !== MaxX) {
                ele.style.transition = '.5s all';
                ele.style.transform = 'translateX(0)';
                emit("failed", false);
            } else {
                rangeStatus.value = true;
                emit("success", true);
            }
            document.onmousemove = null;
            document.onmouseup = null;
        }
    };

    //重置状态
    const reset = () => {
        rangeStatus.value = false;
        divRef.value.style.transform = 'translateX(0)';
    };
    //暴露方法给父组件调用
    defineExpose({ reset });
</script>

<style scoped>
    .silder-range { width: 100%; border-radius: var(--el-border-radius-base); background-color: var(--el-fill-color-dark); position: relative; transition: 1s all; user-select: none; color: var(--el-text-color-regular); display: flex; justify-content: center; align-items: center; height: 32px; /*no*/ }
    .silder-range > div { position: absolute; border-radius: var(--el-border-radius-base) 0 0 var(--el-border-radius-base); left: 0; width: 44px; /*no*/ height: 30px; color: #919191; background-color: #fff; border: 1px solid var(--el-border-color); cursor: pointer; display: flex; justify-content: center; align-items: center; }
    .silder-range > div:hover { color: var(--el-color-primary); }
    .silder-range > div > i { font-size: 18px;  }
    .silder-range.success { background-color: #7AC23C; color: #fff; }
    .silder-range.success > div { border-radius: 0 var(--el-border-radius-base) var(--el-border-radius-base) 0; border: 1px solid #7AC23C; }
    .silder-range.success > div > i { color: #7AC23C; font-size: 18px; }
</style>