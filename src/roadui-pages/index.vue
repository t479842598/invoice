<template>
    <div style="height:inherit">
        <div v-if="utils.length(loadUrl) === 0" style="height:inherit">
            <el-container style="height:inherit">
                <!--2023-2-16新增v-if themeSet.homeType===0时不显示header-设置首页布局-->
                <el-header v-if="themeSet.homeType === 0" style="height:50px;padding:0;">
                    <div class="roadui_header">
                        <div v-show="!menuCollapse"
                            :class="themeSet.style == 0 ? 'roadui_header_logo' : themeSet.menu == 0 ? 'roadui_header_logo2' : 'roadui_header_logo1'"
                            :style="{ 'width': menuCollapse ? '64px' : '219px' }">
                            <span v-show="!menuCollapse" class="roadui_header_logo_logo">
                                <img style="width:220px;height: 50px;margin-left: -15px;" :src="logoImg"
                                    class="roadui_header_logo_logo_img" />
                                <!-- <img style="width:220px;height: 50px;margin-left: -15px;" :src="logoUrl"
                                    class="roadui_header_logo_logo_img" /> -->
                            </span>
                            <!-- <span
                                :class="themeSet.menu == 0 && themeSet.style == 1 ? 'roadui_header_logo_title1' : 'roadui_header_logo_title'">{{
                                    config.SYSTEM_NAME }}</span> -->
                        </div>
                        <div v-show="menuCollapse"
                            :class="themeSet.style == 0 ? 'roadui_header_logo3' : themeSet.menu == 0 ? 'roadui_header_logo3' : 'roadui_header_logo3'"
                            :style="{ 'width': menuCollapse ? '64px' : '219px' }">
                            <span v-show="menuCollapse" class="roadui_header_logo_logos">
                                <img :src="logoImgs" class="roadui_header_logo_logo_imgs" />
                                <!-- <img :src="logo1Url" class="roadui_header_logo_logo_imgs" /> -->
                            </span>
                        </div>
                        <div :class="themeSet.style == 0 ? 'roadui_header_banner' : 'roadui_header_banner1'">
                            <div :class="themeSet.style == 0 ? 'roadui_header_ico' : 'roadui_header_ico1'">
                                <!--折叠菜单-->
                                <el-icon @click="menuCollapse = !menuCollapse">
                                    <fold v-if="!menuCollapse" />
                                    <expand v-else />
                                </el-icon>
                                <!--刷新-->
                                <el-icon @click="refreshTab(activeTab)"><refresh-right /></el-icon>
                            </div>
                            <!--快捷菜单-->
                            <div :class="themeSet.style == 0 ? 'roadui_header_shortuct' : 'roadui_header_shortuct1'">
                                <span v-for="shortuct in shortucts" :key="shortuct.id" @click="openMenu(shortuct)"
                                    :class="activeTab === shortuct.id ? themeSet.style == 0 ? 'roadui_header_shortuct2' : 'roadui_header_shortuct3' : ''">
                                    <component :is="shortuct.ico" class="roadui_main_tabico"></component>
                                    <label>{{ shortuct.title }}</label>
                                </span>
                                <el-dropdown v-if="shortuctsMore.length > 0"
                                    :class="themeSet.style == 0 ? 'roadui_header_shortuctmore' : 'roadui_header_shortuctmore1'">
                                    <span>
                                        <el-icon class="el-icon--right">
                                            <arrow-down />
                                        </el-icon>
                                    </span>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item v-for="shortuct in shortuctsMore" :key="shortuct.id"
                                                @click="openMenu(shortuct)">
                                                <component :is="shortuct.ico" class="roadui_main_tabico"></component>
                                                <label>{{ shortuct.title }}</label>
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </div>
                            <!-- <div style="color: #fff;font-size: 12px;display: inline-block;">
                                {{ sobInfo.accountname }}
                            </div> -->
                            <!--头像-->
                            <div class="roadui_header_right">
                                <span
                                    :class="themeSet.style == 0 ? 'roadui_header_right_header' : 'roadui_header_right_header1'">
                                    <el-dropdown style="vertical-align:middle;">
                                        <span v-if="sobInfo != ''" style="outline:none;display: flex;">
                                            <img :src="utils.length(userInfo.headerImg) > 0 ? userInfo.headerImg : userInfo.gender === 0 ? headerImg0 : headerImg1"
                                                class="roadui_header_right_headerimg" />
                                            <label
                                                style="cursor: pointer; margin-left:12px;position: relative;margin-top: 3px;">
                                                <div>
                                                    {{ userInfo.userName }}
                                                </div>
                                                <div
                                                    style="color: #fff;font-size: 12px;margin-top: 6px;margin-right: 20px;">
                                                    {{ sobInfo.accountname }}
                                                </div>
                                                <el-icon
                                                    style="font-size:14px; cursor:pointer;margin-left:3px;position: absolute;right: 0;bottom: 10px;">
                                                    <arrow-down />
                                                </el-icon>
                                            </label>
                                        </span>
                                        <span v-if="sobInfo == ''" style="outline:none">
                                            <img :src="utils.length(userInfo.headerImg) > 0 ? userInfo.headerImg : userInfo.gender === 0 ? headerImg0 : headerImg1"
                                                class="roadui_header_right_headerimg" />
                                            <label style="cursor: pointer; vertical-align: middle; margin-left:12px;">
                                                {{ userInfo.userName }}
                                                <el-icon style="font-size:14px; cursor:pointer;margin-left:3px;">
                                                    <arrow-down />
                                                </el-icon>
                                            </label>
                                        </span>
                                        <template #dropdown>
                                            <div class="roadui_header_set">
                                                <!--2023-2-16新增-设置首页布局-->
                                                <div>
                                                    <div><el-icon>
                                                            <Monitor />
                                                        </el-icon>首页布局</div>
                                                    <div class="roadui_header_setdiv">
                                                        <el-space :size="32">
                                                            <div @click="setThemeHomeType(1)"><img
                                                                    :class="themeSet.homeType == 1 ? 'roadui_header_setdiv_imgdiv1' : 'roadui_header_setdiv_imgdiv'"
                                                                    src="../roadui-assets/hometype1.png" /></div>
                                                            <div @click="setThemeHomeType(0)"><img
                                                                    :class="themeSet.homeType == 0 ? 'roadui_header_setdiv_imgdiv1' : 'roadui_header_setdiv_imgdiv'"
                                                                    src="../roadui-assets/hometype0.png" /></div>
                                                        </el-space>
                                                    </div>
                                                </div>
                                                <!-- <div style="margin-top:20px">
                                                    <div><el-icon>
                                                            <Mouse />
                                                        </el-icon>导航颜色</div>
                                                    <div class="roadui_header_setdiv">
                                                        <el-radio border v-model="themeSet.style"
                                                            @change="setThemeStyle(0)" :label="0">主题色</el-radio>
                                                        <el-radio border v-model="themeSet.style"
                                                            @change="setThemeStyle(1)" :label="1">白色</el-radio>
                                                    </div>
                                                </div> -->
                                                <div style="margin-top:20px">
                                                    <!-- <div> -->
                                                    <div>
                                                        <el-icon>
                                                            <Menu />
                                                        </el-icon>
                                                        菜单颜色
                                                    </div>
                                                    <div class="roadui_header_setdiv">
                                                        <el-radio border v-model="themeSet.menu" @change="setThemeMenu"
                                                            :label="0">浅色</el-radio>
                                                        <el-radio border v-model="themeSet.menu" @change="setThemeMenu"
                                                            :label="1">深色</el-radio>
                                                    </div>
                                                </div>
                                                <div style="margin-top:20px">
                                                    <div>
                                                        <el-icon>
                                                            <PictureRounded />
                                                        </el-icon>
                                                        主题颜色
                                                    </div>
                                                    <div class="roadui_header_setdiv">
                                                        <el-space style="margin-top:8px" size="large">
                                                            <span v-for="color in themeColors" :key="color.key"
                                                                :style="{ 'background-color': color.key }"
                                                                @click="setThemeColor(color.key)"
                                                                class="roadui_header_setcolor">
                                                                <component is="Select"
                                                                    :style="{ 'color': color.key === themeSet.color ? '#fff' : color.key }">
                                                                </component>
                                                            </span>
                                                        </el-space>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </el-dropdown>
                                </span>
                                <span @click="logout"
                                    :class="themeSet.style == 0 ? 'roadui_header_right_logout' : 'roadui_header_right_logout1'">
                                    <el-icon><switch-button /></el-icon>
                                    <label>退出系统</label>
                                </span>
                            </div>
                            <div style="clear:both"></div>
                        </div>
                    </div>
                </el-header>
                <el-container style="height: inherit;">
                    <!--2023-2-16新增el-aside-设置首页布局-->
                    <el-aside width="80px" v-if="themeSet.homeType === 1" class="roadui_hometype1_aside">
                        <el-container style="height: inherit;">
                            <el-header>
                                <div>
                                    <!--头像-->
                                    <div style="margin-top:6px;">
                                        <img :src="utils.length(userInfo.headerImg) > 0 ? userInfo.headerImg : userInfo.gender === 0 ? headerImg0 : headerImg1"
                                            class="roadui_header_right_headerimg" />
                                    </div>
                                    <div style="margin-top:6px;font-size:12px;">{{ userInfo.userName }}</div>
                                </div>
                            </el-header>
                            <el-main style="padding:0 3px; margin-top:20px;">
                                <el-scrollbar>
                                    <div v-for="shortuct in shortucts" :key="shortuct.id"
                                        :class="activeTab === shortuct.id ? 'roadui_hometype1_shortuct1' : 'roadui_hometype1_shortuct'"
                                        @click="openMenu(shortuct)">
                                        <div>
                                            <component :is="shortuct.ico" class="roadui_hometype1_shortuctico">
                                            </component>
                                        </div>
                                        <div style="font-size:12px;margin-top:4px;">{{ shortuct.title }}</div>
                                    </div>
                                </el-scrollbar>
                            </el-main>
                            <el-footer height="108px">
                                <div class="roadui_hometype1_footerico" @click="logout()">
                                    <el-tooltip effect="dark" content="退出系统" placement="right">
                                        <el-icon><switch-button /></el-icon>
                                    </el-tooltip>
                                </div>
                                <div class="roadui_hometype1_footerico" @click="setThemeMenuHide">
                                    <el-tooltip v-if="themeSet.menuHide" effect="dark" content="展开菜单" placement="right">
                                        <el-icon>
                                            <Expand />
                                        </el-icon>
                                    </el-tooltip>
                                    <el-tooltip v-else effect="dark" content="关闭菜单" placement="right">
                                        <el-icon>
                                            <Fold />
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                                <div>
                                    <el-dropdown style="vertical-align:middle;" placement="right">
                                        <div style="outline:none" class="roadui_hometype1_footerico">
                                            <el-icon>
                                                <Setting />
                                            </el-icon>
                                        </div>
                                        <template #dropdown>
                                            <div class="roadui_header_set">
                                                <div>
                                                    <div><el-icon>
                                                            <Monitor />
                                                        </el-icon>首页布局</div>
                                                    <div class="roadui_header_setdiv">
                                                        <el-space :size="32">
                                                            <div @click="setThemeHomeType(1)"><img
                                                                    :class="themeSet.homeType == 1 ? 'roadui_header_setdiv_imgdiv1' : 'roadui_header_setdiv_imgdiv'"
                                                                    src="../roadui-assets/hometype1.png" /></div>
                                                            <div @click="setThemeHomeType(0)"><img
                                                                    :class="themeSet.homeType == 0 ? 'roadui_header_setdiv_imgdiv1' : 'roadui_header_setdiv_imgdiv'"
                                                                    src="../roadui-assets/hometype0.png" /></div>
                                                        </el-space>
                                                    </div>
                                                </div>
                                                <div style="margin-top:20px" v-if="themeSet.homeType == 0">
                                                    <div><el-icon>
                                                            <Mouse />
                                                        </el-icon>导航颜色</div>
                                                    <div class="roadui_header_setdiv">
                                                        <el-radio border v-model="themeSet.style" @change="setThemeStyle(0)"
                                                            :label="0">主题色</el-radio>
                                                        <el-radio border v-model="themeSet.style" @change="setThemeStyle(1)"
                                                            :label="1">白色</el-radio>
                                                    </div>
                                                </div>
                                                <div style="margin-top:20px">
                                                    <div><el-icon>
                                                            <Menu />
                                                        </el-icon>菜单颜色</div>
                                                    <div class="roadui_header_setdiv">
                                                        <el-radio border v-model="themeSet.menu" @change="setThemeMenu"
                                                            :label="0">浅色</el-radio>
                                                        <el-radio border v-model="themeSet.menu" @change="setThemeMenu"
                                                            :label="1">深色</el-radio>
                                                    </div>
                                                </div>
                                                <div style="margin-top:20px">
                                                    <div><el-icon>
                                                            <PictureRounded />
                                                        </el-icon>主题颜色</div>
                                                    <div class="roadui_header_setdiv">
                                                        <el-space style="margin-top:8px" size="large">
                                                            <span v-for="color in themeColors" :key="color.key"
                                                                :style="{ 'background-color': color.key }"
                                                                @click="setThemeColor(color.key)"
                                                                class="roadui_header_setcolor">
                                                                <component is="Select"
                                                                    :style="{ 'color': color.key === themeSet.color ? '#fff' : color.key }">
                                                                </component>
                                                            </span>
                                                        </el-space>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </el-dropdown>
                                </div>
                            </el-footer>
                        </el-container>
                    </el-aside>
                    <!--2023-2-16修改了themeSet.homeType等相关判断-->
                    <transition name="el-fade-in">
                        <el-aside v-show="themeSet.homeType === 0 || (themeSet.homeType === 1 && !themeSet.menuHide)"
                            :width="menuCollapse ? 'auto' : themeSet.homeType === 1 ? '200px' : '220px'"
                            :class="themeSet.menu === 0 ? '' : ' el-menu-drak'" :style="{
                                'border-right': themeSet.menu === 0 ? '1px solid var(--el-border-color-light)' : '1px solid rgb(48, 65, 86)',
                                'background-color': themeSet.menu === 0 ? '' : 'rgb(48, 65, 86)',
                                'height': themeSet.homeType === 1 ? 'inherit' : (menuHeight + 17) + 'px'
                            }">
                            <el-scrollbar>
                                <div v-if="themeSet.homeType === 1"
                                    :class="themeSet.menu === 1 ? 'roadui_hometype1_title1' : 'roadui_hometype1_title'">
                                    <span>{{ config.SYSTEM_NAME }}</span>
                                </div>
                                <el-menu :collapse="menuCollapse" style="border-right:none"
                                    :active-text-color="themeSet.menu === 0 ? '' : 'var(--el-color-primary)'"
                                    :background-color="themeSet.menu === 0 ? '' : 'rgb(48, 65, 86)'"
                                    :text-color="themeSet.menu === 0 ? '' : 'rgb(191, 203, 217)'">
                                    <sub-menu v-for="menu in menus" @menuclick="openMenu" :key="menu.id"
                                        :menus="menu"></sub-menu>
                                </el-menu>
                            </el-scrollbar>
                        </el-aside>
                    </transition>
                    <el-main style="height:inherit;overflow:hidden;padding:0;">
                        <div style="height:inherit;background-color:var(--el-fill-color);">
                            <div style="background-color: #fff; padding: 0;">
                                <el-tabs v-model="activeTab" type="card" @tab-change="changeTab" @tab-remove="removeTab"
                                    @contextmenu="tabContextMenu" class="roadui_indextab">
                                    <el-tab-pane v-for="item in tabs" :key="item.id" :label="item.title" :name="item.id"
                                        :closable="item.closable">
                                        <template #label>
                                            <span :title="utils.length(item.title) > 10 ? item.title : ''"
                                                style="user-select:none" @dblclick="removeTab(item.id)">
                                                <component v-if="utils.length(item.ico) > 0" :is="item.ico"
                                                    class="roadui_main_tabico"></component>
                                                <span>{{ utils.length(item.title) > 10 ? item.title.substr(0, 10) + '…'
                                                    :
                                                    item.title }}</span>
                                            </span>
                                        </template>
                                    </el-tab-pane>
                                </el-tabs>
                                <!--tab右键菜单-->
                                <el-card v-show="contextMenuVisible" :body-style="{ 'padding': '8px 12px' }"
                                    :style="'position:absolute;z-index:99999999;width:160px;left:' + contextMenuLeft">
                                    <div>
                                        <div class="roadui_hometab_contextmenuitem"
                                            @click="refreshTab(activeTab); contextMenuVisible = false;">
                                            <el-icon>
                                                <RefreshRight />
                                            </el-icon>
                                            <span>刷新</span>
                                        </div>
                                        <el-divider style="margin:5px 0" />
                                        <div class="roadui_hometab_contextmenuitem"
                                            @click="removeTab(); contextMenuVisible = false;">
                                            <el-icon>
                                                <Close />
                                            </el-icon>
                                            <span>关闭当前</span>
                                        </div>
                                        <div class="roadui_hometab_contextmenuitem"
                                            @click="removeOther(); contextMenuVisible = false;">
                                            <el-icon>
                                                <CircleCloseFilled />
                                            </el-icon>
                                            <span>关闭其他</span>
                                        </div>
                                        <div class="roadui_hometab_contextmenuitem"
                                            @click="removeAllTab(); contextMenuVisible = false;">
                                            <el-icon>
                                                <CircleClose />
                                            </el-icon>
                                            <span>关闭所有</span>
                                        </div>
                                        <div class="roadui_hometab_contextmenuitem" @click="contextMenuVisible = false;">
                                            <el-icon>
                                                <Remove />
                                            </el-icon>
                                            <span>取消</span>
                                        </div>
                                    </div>
                                </el-card>
                            </div>
                            <!--2023-2-16修改了themeSet.homeType===0时的height-->
                            <div
                                :style="{ 'height': themeSet.homeType === 1 ? 'calc(100% - 69px)' : (menuHeight - 59) + 'px', 'background-color': 'var(--el-fill-color)', 'padding': '14px 10px 0 10px' }">
                                <div v-show="!tabIsIframe"
                                    style="height:100%;background-color:#fff;padding:12px 10px 10px 10px;border-radius:var(--el-border-radius-base);overflow:auto;">
                                    <Transition name="slide-fade">
                                        <keep-alive>
                                            <component :is="tabComponentId" :query="tabComponentQuery"></component>
                                        </keep-alive>
                                    </Transition>
                                </div>
                                <div v-show="tabIsIframe"
                                    style="width: 100%; height: 100%; background-color: #fff; padding: 12px 10px 10px 10px; border-radius: var(--el-border-radius-base); overflow: auto;">
                                    <iframe v-for="iframe in tabIframes" :id="'iframe_' + iframe.id" :key="iframe.id"
                                        v-show="activeTab === iframe.id" frameborder="0"
                                        style="width: 100%; height: 100%; border: 0;" :src="iframe.url"></iframe>
                                </div>
                            </div>
                        </div>
                    </el-main>
                </el-container>
            </el-container>
        </div>
        <!--打开loadurl参数中的页面-->
        <div v-else style="height:inherit">
            <component :is="loadComponentId" :query="loadComponentQuery"></component>
        </div>
        <!--打开弹出窗口应用-->
        <el-dialog v-model="dialogShow" :top="dialogTop" :align-center="dialogCenter"
            :class="utils.length(dialogCustomClass) > 0 ? dialogCustomClass : dialogIsShowFile ? 'el-dialog__filepadding' : ''"
            destroy-on-close :width="dialogWidth" :draggable="dialogDraggable" :close-on-click-modal="dialogClickClose"
            :close-on-press-escape="dialogEscapeClose" :show-close="dialogCloseButton">
            <template #header>
                <div @dblclick="dialogShow = false">
                    <span
                        style="width:calc(100% - 80px);display:inline-block;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;vertical-align:middle;"
                        class="el-dialog__title">{{ dialogTitle }}</span>
                    <span style="width: 80px; display: inline-block; vertical-align: middle;">
                        <a v-if="dialogIsShowFile && utils.query('isminiprogram', dialogFileUrl) != 1" class="roaduia"
                            onclick="javascript:;" @click="utils.openNew(dialogFileUrl + '&download=1')"
                            style="margin-left:12px">下载文件</a>
                    </span>
                </div>
            </template>
            <div v-if="dialogIsIframe" style="overflow: hidden;">
                <!--移动端显示pdf-->
                <span
                    v-if="utils.query('ismobile', dialogFileUrl) == 1 && (utils.isPdfFile(dialogTitle) || utils.isOfficeFile(dialogTitle))">
                    <VuePdf :src="dialogFileUrl" :style="`width:100%;height:${dialogHeight};border:0;`"></VuePdf>
                </span>
                <img v-else-if="utils.isImageFile(dialogTitle)" :src="dialogFileUrl" style="display:block;margin:0 auto;" />
                <iframe v-else :src="dialogIsShowFile ? dialogFileUrl : dialogComponentId"
                    :style="`width:100%;height:${dialogHeight};border:0;`" frameborder="0"></iframe>
            </div>
            <div v-else :style="`width:100%;height:${dialogHeight};overflow:auto;`">
                <component :is="dialogComponentId" :query="dialogComponentQuery"></component>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { HubConnectionBuilder } from "@microsoft/signalr";
import { ref, onMounted, onUnmounted, provide, inject, watch, defineAsyncComponent } from 'vue';

import SubMenu from './menu.vue';
import Loading from './loading.vue';
import Error from './error.vue';
const props = defineProps({ query: { type: String, default: () => { return ''; } } });
import headerImg0 from '../roadui-assets/header0.png';//默认头像男
import headerImg1 from '../roadui-assets/header1.png';//默认头像女
import logoImg from '../roadui-assets/logo.png';//Logo
import logoImgs from '../roadui-assets/logo1.png';//Logo
import VuePdf from './pdf.vue';
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const accountname = ref('');
const logoUrl = ref('')
const logo1Url = ref('')
const app = inject('app');
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
const loadUrl = utils.query('loadurl', props.query);
const shortucts = ref([]);//用户设置的快捷菜单
const shortuctsMore = ref([]);//如果用户设置的快捷菜单大于7个，多余的放到这里。banner最多只放7个快捷菜单。
const userInfo = ref({});//用户信息
const menus = ref([]);//菜单
const menuHeight = ref(500);//菜单高度
const menuCollapse = ref(false);//是否收起菜单
const tabs = ref([]);
const activeTab = ref('Tab_Home');//当前活动tab id
const prevActiveTab = ref('');//上一个活动标签id

let loadComponentId = ref(null);
let loadComponentQuery = ref(null);
let tabComponentId = ref(null);
let tabComponentQuery = ref(null);
let tabIsIframe = ref(false);
let tabIframes = ref([]);
let homeMenu = { id: 'Tab_Home', title: '系统首页', ico: 'monitor', url: 'home.vue', closable: false };//首页菜单json
let homeMenu1 = { id: 'Tab_Home', title: '开票确认', ico: 'monitor', url: 'Invoice/uninvoiced.vue', closable: false };//首页菜单json

//弹出窗口
const dialogShow = ref(false);//是否显示窗口
const dialogTitle = ref('');//窗口标题
const dialogWidth = ref('');//窗口宽度
const dialogHeight = ref('');//窗口高度
const dialogClickClose = ref(false);//是否可以通过点击 modal 关闭 Dialog 是否可以通过按下 ESC 关闭 Dialog也是这个设置。
const dialogEscapeClose = ref(true);//是否可以通过按esc键关闭
const dialogCloseButton = ref(true);//是否有关闭按钮
const dialogComponentId = ref('');//窗口组件id
const dialogComponentQuery = ref('');//窗口组件参数
const dialogIsIframe = ref(false);//窗口页面是否以iframe加载。
const dialogIsShowFile = ref(false);//是否是查看预览文件窗口
const dialogFileUrl = ref('');//是查看文件窗口时的文件地址，下载文件用。
const dialogDraggable = ref(true);//窗口是否可以拖动
const dialogCustomClass = ref('');//窗口自定义样式类
const dialogTop = ref('');//窗口top属性
const dialogCenter = ref(true);//窗口是否居中

onMounted(() => {
    //如果地址中传了loadurl=地址，则直接加载地址参数中的页面。
    if (utils.length(loadUrl) > 0) {
        const urlArray = loadUrl.split('?');
        const url = urlArray[0];
        const query = urlArray.length > 1 ? urlArray[1] : '';
        const componentId = 'Component_' + utils.createGuid(false);
        loadComponentId.value = componentId;
        loadComponentQuery.value = query;
        regComponent(componentId, url);
    } else {
        window.addEventListener('resize', resize);
        //文档点击隐藏右键菜单
        document.body.onclick = () => {
            contextMenuVisible.value = false;
        };
        loadData();
        //打开首页
        if (localStorage.getItem('sobInfo') == '') {
            openMenu(homeMenu);
        } else {
            openMenu(homeMenu1);
        }
        //设置菜单高度
        resize();
    }
    //设置主题
    setThemeColor(themeSet.value.color);
    setThemeMenu(themeSet.value.menu);//设置菜单主题

    //signalr接收站内消息
    //2023-4-22加上的if (utils.length(loadUrl) === 0)判断，如果是loadurl不启动signalr
    if (utils.length(loadUrl) === 0) {
        const signalr = new HubConnectionBuilder().withUrl(config.SERVER_ADDRESS + "/SignalRHub").withAutomaticReconnect(5000).build();
        signalr.start().then(() => {
        }).catch((err) => {
        });
        signalr.onclose((err) => {
        });
        signalr.on('SendMessage', (_, message) => {
            showNotify(JSON.parse(message));
        });
    }
});
onUnmounted(() => {
    window.removeEventListener('resize', resize, false);
});
//监听打开新标签时保存上一个活动标签。
//watch(() => activeTab.value, (_, oldVal) => {
//    prevActiveTab.value = oldVal;
//});
// 获取logo地址
// const getLogoUrl = () => {
//     ajax.post('file/GetLOGO').then((res) => {
//         if (res.success) {
//             logoUrl.value = res.data.logo;
//             logo1Url.value = res.data.logo1;
//         }
//     });
// }

const resize = () => {
    menuHeight.value = window.innerHeight - 67;
};

//显示站内消息
const showNotify = (data) => {
    //{"type":0,"messageId":"308587672068166","message":"ww","sender":"路德","url":"","tabTitle":""}
    const title = data.type == 1 ? '待办事项' : '消息';
    const message = data.message;
    const sender = data.sender;
    utils.notify(message, title + ' - 来自' + sender, 'success');
};

//载入首页数据
const loadData = () => {
    ajax.post('/Home/GetIndexInfo').then((res) => {
        if (res.success) {
            // getLogoUrl()

            //检查是否修改过密码
            if (res.data.userInfo.initPassword == 1) {
                const menu = { id: utils.createGuid(false), title: '修改密码', url: '/system/userset/editpass', openMode: 1, width: 400, closeable: false }
                openMenu(menu);
            }
            userInfo.value = res.data.userInfo;
            menus.value = res.data.menus;
            //添加首页快捷菜单
            if (localStorage.getItem('sobInfo') == '') {
                res.data.shortucts.splice(0, 0, homeMenu);
            } else {
                getData();
                res.data.shortucts.splice(0, 0, homeMenu1);
            }

            //检查如果快捷菜单数大于7个，则将多余的放到shortuctsMore中。
            //themeSet.homeType === 0 2023-2-16新增判断，左右布局不判断个数。
            if (themeSet.homeType === 0 && res.data.shortucts.length > 7) {
                shortucts.value = res.data.shortucts.slice(0, 7);
                shortuctsMore.value = res.data.shortucts.slice(7);
            } else {
                shortucts.value = res.data.shortucts;
            }

        }
    }).catch(() => { });
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
            loader: utils.systemModules[url1], //() => import(/*@vite-ignore*/`${url1}`), //加载函数 /*@vite-ignore*/这个是为了消除vite警告：then above dynamic import cannot be analyzed by vite
            loadingComponent: Loading,//加载异步组件时使用的组件
            delay: 200,//展示加载组件前的延迟时间，默认为 200ms
            errorComponent: Error,//加载失败后展示的组件
            //timeout: 3000 // 如果提供了一个 timeout 时间限制，并超时了也会显示这里配置的报错组件，默认值是：Infinity
            //onError: () => {
            //    utils.msg('加载组件失败！', 'error');
            //},
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
//打开菜单
/*menu:{
id:菜单id,
title:标题,
url:应用地址,
ico:图标,
closeable: 是否可以关闭true|false 默认true,
openMode:打开方式0标签 1弹出层 2弹出窗口 3新窗口 4当前窗口 100js函数,
isShowFile:是否是查看文件true|false,
draggable:打开方式为弹出层时是否可以拖动true|false,
width:打开方式为弹出时的层或窗口高度,
height:打开方式为弹出时的层或窗口宽度,
top:打开方式为弹出时的top位置
customClass:打开方式为弹出时的自定义样式类,
center:如果打开方式为弹出层时是否居中，默认认true,
fun:如果打开方式为100时的js函数,
}*/
const openMenu = (menu) => {
    if (utils.isUndef(menu) || utils.length(menu.url) === 0) {
        return;
    }
    //如果没有指定不能关闭，则默认为可以关闭。
    if (!utils.hasKey(menu, 'closable')) {
        menu.closable = true;
    }
    const urlArray = menu.url.split('?');
    const url = urlArray[0];
    const componentId = menu.id;//载入的组件id
    menu.componentId = componentId;

    //判断是不是外部地址
    const isExternalAddress = utils.startWith(menu.url, 'http');
    const openMode = utils.toNumber(menu.openMode, 0);//打开方式 0标签 1弹出层 2弹出窗口 3新窗口 4当前窗口 100js函数
    let query = urlArray.length > 1 ? '?' + urlArray[1] : '?a=1';
    if (query.indexOf('openmode=') === -1) {
        query += '&openmode=' + openMode;
    }
    if (openMode === 0) {
        tabIsIframe.value = isExternalAddress;
        if (isExternalAddress) {
            let tab = utils.getArrayObj(tabs.value, menu.id, 'id');
            if (tab == null) {
                tabIframes.value.push(menu);
                tabs.value.push(menu);
            } else {
                //如果已打开，则刷新。
                refreshTab(tab.id);
            }
        } else {
            //先查找，如果tabs没有，则要重新注册。
            let tab = utils.getArrayObj(tabs.value, menu.id, 'id');
            if (tab == null) {
                tabs.value.push(menu);
                regComponent(componentId, url);
                tabComponentId.value = componentId;
                tabComponentQuery.value = query;
            } else {
                //如果已打开，则刷新。
                refreshTab(tab.id);
            }
        }
        prevActiveTab.value = activeTab.value;
        activeTab.value = menu.id;
    } else if (openMode === 1) {
        //弹出层
        dialogTitle.value = menu.title;
        dialogClickClose.value = menu.closeable;
        dialogEscapeClose.value = menu.closeable;
        dialogCloseButton.value = menu.closeable;
        dialogIsShowFile.value = menu.isShowFile;
        dialogDraggable.value = menu.draggable ? menu.draggable : true;
        dialogCustomClass.value = utils.length(menu.customClass) > 0 ? menu.customClass : '';
        dialogTop.value = utils.length(menu.top) > 0 ? menu.top : '';
        dialogCenter.value = menu.center ? true : utils.isUndef(menu.center);
        if (dialogIsShowFile.value) {
            dialogFileUrl.value = menu.url;
        }
        dialogIsIframe.value = isExternalAddress || dialogIsShowFile.value;
        if (isExternalAddress) {
            //如果是外部地址http开头的
            dialogWidth.value = menu.width ? utils.isNumber(menu.width) ? menu.width + 'px' : menu.width : '800px';
            dialogHeight.value = menu.height ? utils.isNumber(menu.height) ? menu.height + 'px' : menu.height : '';
            dialogComponentId.value = menu.url;
        } else {
            dialogWidth.value = menu.width ? utils.isNumber(menu.width) ? menu.width + 'px' : menu.width : '800px';
            dialogHeight.value = menu.height ? utils.isNumber(menu.height) ? menu.height + 'px' : menu.height : '';
            regComponent(componentId, url);
            dialogComponentId.value = componentId;
            dialogComponentQuery.value = query;
        }
        dialogShow.value = true;
    } else if (openMode === 2) {
        //弹出窗口
        utils.open(isExternalAddress ? menu.url : '?loadurl=' + encodeURIComponent(menu.url + (menu.url.indexOf('?') > 0 ? '&' : '?') + 'openmode=' + openMode), parseInt(menu.width) || 500, parseInt(menu.height) || 500, menu.title);
    } else if (openMode === 3) {
        //新窗口
        utils.openNew(isExternalAddress ? menu.url : '?loadurl=' + encodeURIComponent(menu.url + (menu.url.indexOf('?') > 0 ? '&' : '?') + 'openmode=' + openMode));
    } else if (openMode === 4) {
        //当前窗口打开
        window.location.href = isExternalAddress ? menu.url : '?loadurl=' + encodeURIComponent(menu.url + (menu.url.indexOf('?') > 0 ? '&' : '?') + 'openmode=' + openMode);
    } else if (openMode === 100) {
        //执行js方法
        if (utils.isFunction(menu.fun)) {
            menu.fun();
        } else {
            //执行js脚本
            eval(menu.url);
        }
    }
};
//切换tab
const changeTab = (id) => {
    let tab = utils.getArrayObj(tabs.value, id, 'id');
    if (tab == null) {
        return;
    }
    tabIsIframe.value = utils.startWith(tab.url, 'http');
    if (!tabIsIframe.value) {
        tabComponentId.value = tab.componentId;
    }
    prevActiveTab.value = activeTab.value;
    activeTab.value = id;
};
//移出所有tab
const removeAllTab = () => {
    let removeTabs = [];
    for (let i = 0; i < tabs.value.length; i++) {
        let currentTab = tabs.value[i];
        //如果当前tab设置的是不能关闭，则跳过。
        if (utils.isDef(currentTab) && (!utils.hasKey(currentTab, 'closable') || !currentTab.closable)) {
            continue;
        }
        removeTabs.push(currentTab);
    }
    for (let i = 0; i < removeTabs.length; i++) {
        utils.removeArrayObj(tabs.value, removeTabs[i]['id'], 'id');
        utils.removeArrayObj(tabIframes.value, removeTabs[i]['id'], 'id');
        unRegComponent(removeTabs[i]['id']);
    }
    if (tabs.value.length > 0) {
        let nextTab = tabs.value[tabs.value.length - 1];
        changeTab(nextTab.id);
        //tabComponentId.value = nextTab.componentId;
        //activeTab.value = nextTab.id;
    }
};
//当前当前活动标签外的标签
const removeOther = () => {
    let removeTabs = [];
    for (let i = 0; i < tabs.value.length; i++) {
        let currentTab = tabs.value[i];
        //如果当前tab设置的是不能关闭，则跳过。
        if (utils.isDef(currentTab) && (!utils.hasKey(currentTab, 'closable') || !currentTab.closable)) {
            continue;
        }
        if (currentTab.id !== activeTab.value) {
            removeTabs.push(currentTab);
        }
    }
    for (let i = 0; i < removeTabs.length; i++) {
        utils.removeArrayObj(tabs.value, removeTabs[i]['id'], 'id');
        utils.removeArrayObj(tabIframes.value, removeTabs[i]['id'], 'id');
        unRegComponent(removeTabs[i]['id']);
    }
};
//移出tab，id：要移出tab的id，如果为空则移出当前活动tab。
const removeTab = (id) => {
    const tabs1 = tabs.value;
    if (utils.isUndef(id)) {
        id = activeTab.value;
    }
    var currentTab = utils.getArrayObj(tabs1, id, 'id');
    //如果当前tab设置的是不能关闭，则直接返回。
    if (utils.isDef(currentTab) && (!utils.hasKey(currentTab, 'closable') || !currentTab.closable)) {
        return;
    }
    let nextTab = utils.length(prevActiveTab.value) > 0 ? utils.getArrayObj(tabs1, prevActiveTab.value, 'id') : null;
    if (utils.isUndef(nextTab) || nextTab.id === id) {
        for (let i = 0; i < tabs1.length; i++) {
            if (tabs1[i].id === id) {
                nextTab = tabs1[i + 1] || tabs1[i - 1];
                break;
            }
        }
    }
    if (utils.isDef(nextTab)) {
        //tabComponentId.value = nextTab.componentId;
        //activeTab.value = nextTab.id;
        changeTab(nextTab.id);
    }
    //tabs.value = tabs1.filter((tab) => tab.id !== id);
    //tabIframes.value = tabIframes.value.filter((tab) => tab.id !== id);
    utils.removeArrayObj(tabs.value, id, 'id');
    utils.removeArrayObj(tabIframes.value, id, 'id');
    unRegComponent(id);
};
//刷新tab, id：要刷新tab的id，为空则刷新当前tab； reloadUrl：要重新加载的url地址。
const refreshTab = (id, reloadUrl) => {
    if (utils.isUndef(id)) {
        id = activeTab.value;
    }
    let tab = utils.getArrayObj(tabs.value, id, 'id');
    if (tab == null) {
        return;
    }
    if (utils.length(reloadUrl) > 0) {
        tab.url = reloadUrl;
    }
    //外部地址，iframe刷新
    if (utils.startWith(tab.url, 'http')) {
        let iframe = document.getElementById('iframe_' + tab.id);
        if (utils.isDef(iframe)) {
            iframe.src = tab.url;
        }
        return;
    }
    unRegComponent(id);
    const componentId = tab.id;
    const urlArray = tab.url.split('?');
    const url = urlArray[0];
    const query = urlArray.length > 1 ? urlArray[1] : '';
    regComponent(componentId, url);
    tabComponentId.value = 'Loading';//改变一下component组件的is，再切换回来以达到刷新的效果。
    tabComponentId.value = componentId;
    tabComponentQuery.value = query;
};
//退出系统
const logout = () => {
    utils.confirm('您确定要退出系统吗？', () => {
        ajax.post('/Home/Logout').then((res) => {
            if (res.code == 0) {
                utils.removeToken();
                sobInfo.value = '';
                // localStorage.removeItem('sobInfo');
                localStorage.setItem('sobInfo', '');
                //utils.removeClientId();
                window.location.href = config.BASE_URL + '?loadurl=login';
            }
        }).catch(() => { });
    });
};

//主题设置
const themeColors = ref(utils.themeColors);
const themeSet = ref(utils.getTheme());//主题相关设置
const menuActiveTextColor = ref('');//当前活动菜单字体颜色
//设置菜单颜色
const setThemeMenu = (val) => {
    //themeSet.value.menu = val;
    utils.setTheme(themeSet.value);//保存到cookie
};
//设置主题颜色
const setThemeColor = (val) => {
    const style = document.documentElement.style;
    let color = utils.getArrayObj(themeColors.value, val, 'key');
    if (color === null && utils.length(themeColors.value) > 0) {
        color = themeColors.value[0];
    }
    if (color === null) {
        return;
    }
    themeSet.value.color = val;
    utils.setTheme(themeSet.value);//保存到cookie
    for (let key in color.value) {
        style.setProperty(key, color.value[key]);
    }
    //黑色主题当前菜单颜色为白色，不然为黑色就和背景色一样了。
    //menuActiveTextColor.value = val === '#161D22' ? '#fff' : 'var(--el-color-primary)';
};
//设置主题样式
const setThemeStyle = (val) => {
    themeSet.value.style = val;
    utils.setTheme(themeSet.value);
};
//设置首页布局2023-2-16新增方法，设置首页布局cookie。
const setThemeHomeType = (val) => {
    themeSet.value.homeType = val;
    if (val === 1) {
        //将菜单设置为展开
        menuCollapse.value = false;
    }
    utils.setTheme(themeSet.value);
};
//设置左右布局时菜单是否隐藏2023-2-16新增方法。
const setThemeMenuHide = () => {
    themeSet.value.menuHide = !themeSet.value.menuHide;
    utils.setTheme(themeSet.value);
};
//tab右键菜单
const contextMenuVisible = ref(false);
const contextMenuLeft = ref('0px');
const tabContextMenu = (e) => {
    e.preventDefault();
    const bodyWidth = document.body.clientWidth;
    contextMenuLeft.value = (e.clientX + 160) > bodyWidth ? (bodyWidth - 170) + 'px' : e.clientX + 'px';
    contextMenuVisible.value = true
};
const systemInfo = ref('')
//获取系统设置数据
const getData = async () => {
    try {
        const res = await ajax.post('/Systemset/Get?srcorgid=' + sobInfo.value.id, {});
        systemInfo.value = res.data.invoicesystemset;
    } catch (error) {
    }
};
//注入首页的一些方法供子页面调用。
provide('index_openmenu', openMenu);
provide('index_tabs', tabs);
provide('index_changetab', changeTab);
provide('index_removetab', removeTab);
provide('index_refreshtab', refreshTab);
provide('index_dialogcomponentId', dialogComponentId);
provide('index_dialogcomponentquery', dialogComponentQuery);
provide('index_dialogshow', dialogShow);//在其他页面关闭首页弹出层。
provide('index_dialogisshowfile', dialogIsShowFile);
provide('index_userinfo', userInfo);//用户信息。
provide('index_sobinfo', sobInfo);//账套信息。
provide('index_systemInfo', systemInfo);//系统设置信息。
provide('index_regcomponent', regComponent);
provide('index_themeset', themeSet);//主题设置，在其他页面（如流程中）读取主题样式计算高度用。
</script>