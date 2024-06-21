<template>
    <div>
        <!-- 打印 -->
        <div style="height: 85vh;width: 100%;">
            <iframe id="print-iframe" :src="src" frameborder="0" style="width: 100%;height: 100%;"></iframe>
        </div>
    </div>
</template>

<script setup>
import { ref, inject, onMounted, shallowRef, provide, reactive, nextTick, watch, defineAsyncComponent } from 'vue'
import { Search, Refresh, Upload } from '@element-plus/icons-vue'

const src = ref('../../../public/print.html');

</script>

<style scoped></style>