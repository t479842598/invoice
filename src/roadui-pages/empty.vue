<template>
    <div>
        <el-empty description="Empty" />
    </div>
</template>

<script setup>
    import { ref, inject } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
</script>