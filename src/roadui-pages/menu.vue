<template>
    <el-sub-menu v-if="menus.children.length" :index="menus.id" @click="clickMenu(menus)">
        <template #title>
            <component :is="utils.length(menus.ico)>0?menus.ico:'document'" 
                       class="roadui_main_tabico"
                       :style="utils.length(menus.icoColor)>0?'color:'+menus.icoColor:''"></component>
            <span>{{menus.title}}</span>
        </template>
        <layout-menu v-if="menus.children.length>0" v-for="m in menus.children" :key="m.id" :menus="m" @menuclick="clickMenu" />
    </el-sub-menu>
    <el-menu-item v-else :index="menus.id" @click="clickMenu(menus)" style="height: 45px;">
        <component :is="utils.length(menus.ico)>0?menus.ico:'document'" 
                   class="roadui_main_tabico" 
                   :style="utils.length(menus.icoColor)>0?'color:'+menus.icoColor:''"></component>
        <template #title>
            {{menus.title}}
        </template>
    </el-menu-item>
</template>

<script>
    import { inject } from 'vue';
    export default {
        name: 'LayoutMenu',
        props: {
            menus: {
                type: Object, default: () => { }
            }
        },
        setup(_, ctx) {
            const utils = inject('utils');
            const clickMenu = (menu) => {
                (event || e).stopPropagation();
                ctx.emit('menuclick', menu);
            }
            return { utils, clickMenu }
        }
    }
</script>

