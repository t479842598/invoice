<template>
    <div style="height: inherit;">
        <el-container style="height:inherit;">
            <el-main class="roaduim_main" style="padding:0;">
                <component :is="componentPage" :query="componentQuery"></component>
            </el-main>
            <el-footer class="roaduim_footer" v-show="showfooter">
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
                    <tr>
                        <td v-for="footer in footers" :key="footer.id" style="text-align:center;">
                            <div v-show="footer.show"
                                :class="footer.current ? 'roaduim_footeritem_current' : 'roaduim_footeritem'"
                                @click="openPage(footer, true)">
                                <div>
                                    <component :is="footer.ico"></component>
                                </div>
                                <div>{{ footer.title }}</div>
                            </div>
                        </td>
                    </tr>
                </table>
            </el-footer>
        </el-container>
    </div>
</template>

<script setup>
import Component_Loading from '../loading.vue';
import Component_Error from '../error.vue';
import { ref, inject, provide, defineAsyncComponent, onMounted } from 'vue';
const ajax = inject('ajax');
const utils = inject('utils');
const qs = inject('qs');
const app = inject('app');

const componentPage = ref(null);
const componentQuery = ref('');
const currentPage = ref([]);//保存当前页面id和url用于刷新。
const userInfo = ref({});

const showfooter = ref(true);//显示底部菜单


const footers = ref([
    { id: 'index_home', title: '首页', ico: 'HomeFilled', current: false, url: '/mobile/home.vue', show: true },
    { id: 'index_todo', title: '待办', ico: 'WalletFilled', current: false, url: '/mobile/flow/todo.vue', show: true },
    { id: 'index_completed', title: '已办', ico: 'FolderChecked', current: false, url: '/mobile/flow/completed.vue', show: true },
    { id: 'index_document', title: '文档', ico: 'Briefcase', current: false, url: '/mobile/document/index.vue', show: true },
    { id: 'shortuct_mystarts', title: '我的流程', ico: 'FolderAdd', current: false, url: '/mobile/flow/mystarts.vue', show: false },
    { id: 'shortuct_starts', title: '发起流程', ico: 'Promotion', current: false, url: '/mobile/flow/starts.vue', show: false },
]);

onMounted(() => {
    //加载首页
    openPage(footers.value[0]);
});

//打开页面 isHomeFooter：是否是首页底部菜单
const openPage = (page, isHomeFooter) => {
    console.log(page);
    if (utils.length(page.url) === 0) {
        return;
    }
    openUrl(page.id, page.url);
    if (isHomeFooter) {
        for (let i = 0; i < footers.value.length; i++) {
            footers.value[i].current = false;//清除底部菜单选中
        }
        page.current = true;
    }
};

//打开url页面
const openUrl = (id, url) => {
    if (utils.length(url) === 0) {
        return;
    }
    const urlArray = url.split('?');
    const url1 = urlArray[0];
    const param = urlArray.length > 1 ? urlArray[1] : '';
    const comId = utils.length(id) > 0 ? id : "c_" + utils.createGuid(false);
    componentPage.value = Component_Loading;
    regComponent(comId, url1);
    componentQuery.value = param;
    componentPage.value = comId;

    // 如果url的值不在footers中，则不显示底部菜单
    showfooter.value = footers.value.some(item => item.url === url);

    currentPage.value.push({ id: id, url: url });
};

//注册组件
const regComponent = (id, url) => {
    if (utils.length(url) === 0 || utils.length(id) === 0) {
        return;
    }
    let url1 = utils.trim(url);
    const isComponent = utils.isDef(app._context.components[id]);//检查是否已经注册
    if (!isComponent) {
        url1 = './roadui-pages' + (utils.startWith(url1, '/') ? '' : '/') + url1 + (utils.endWith(url1, '.vue') ? '' : '.vue');
        const c = defineAsyncComponent({
            loader: utils.systemModules[url1],//() => import(/*@vite-ignore*/`${url1}`), //加载函数 /*@vite-ignore*/这个是为了消除vite警告：then above dynamic import cannot be analyzed by vite
            loadingComponent: Component_Loading,//加载异步组件时使用的组件
            delay: 200,//展示加载组件前的延迟时间，默认为 200ms
            errorComponent: Component_Error,//加载失败后展示的组件
        });
        app.component(id, c);
    }
};

//移出已注册的全局组件
const unRegComponent = (id) => {
    let components = app._context.components;
    for (let key in components) {
        if (key == id || utils.startWith(key, id + '_')) {
            delete components[key];
        }
    }
};

//刷新当前页面
const refreshPage = (id, url) => {
    const id1 = utils.length(id) > 0 ? id : currentPage.value.length > 0 ? currentPage.value[currentPage.value.length - 1].id : '';
    const url1 = utils.length(url) > 0 ? url : currentPage.value.length > 0 ? currentPage.value[currentPage.value.length - 1].url : '';
    if (utils.length(id1) === 0 || utils.length(url1) === 0) {
        return;
    }
    unRegComponent(id1);
    openUrl(id1, url1);
};

//返回上一页
const backPage = () => {
    const pageLength = currentPage.value.length;
    let id = pageLength > 1 ? currentPage.value[pageLength - 2].id : pageLength > 0 ? currentPage.value[0].id : 'index_home';
    let url = pageLength > 1 ? currentPage.value[pageLength - 2].url : pageLength > 0 ? currentPage.value[0].url : '/mobile/home.vue';
    unRegComponent(id);
    openUrl(id, url);
};

provide('indexm_openurl', openUrl);
provide('indexm_refreshpage', refreshPage);
provide('indexm_backpage', backPage);
provide('indexm_userinfo', userInfo);//用户信息
</script>