<template>
    <div class="roadui_signdiv">
        <img class="roadui_signimg" v-if="utils.length(sign1)>0&&utils.startWith(sign1,'data:image')" :src="sign1" />
        <div class="roadui_signname" v-else-if="utils.length(sign1)>0">{{sign1}}</div>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted, watch } from 'vue';
    const utils = inject('utils');
    //const userInfo = inject('index_userinfo');
    const props = defineProps({
        //签章名字或图片
        sign: { type: String, default: () => { return ''; } },
    });

    //名称，如果参数没传则从首页用户信息中取。
    const sign1 = ref(props.sign);
    onMounted(() => {
        //if (utils.length(sign1.value) === 0 && utils.length(userInfo.value) > 0) {
        //    sign1.value = utils.length(userInfo.value.signImg) > 0 ? userInfo.value.signImg : userInfo.value.userName;
        //}
    });

    watch(() => props.sign, (val) => {
        sign1.value = val;
    });

</script>