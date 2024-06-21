<template>
    <el-config-provider :locale="locale">
        <Index :query="query" />
    </el-config-provider>
</template>

<script setup>
    import { ref, inject } from 'vue';
    import Index from './roadui-pages/index.vue';
    //import zhCn from 'element-plus/lib/locale/lang/zh-cn';
    import zhCn from 'element-plus/dist/locale/zh-cn';
    const utils = inject('utils');
    const query = utils.getQuery();
    const locale = ref(zhCn);
</script>