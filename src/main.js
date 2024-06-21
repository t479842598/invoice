import { createApp } from 'vue/dist/vue.esm-bundler.js'
import Cookie from 'js-cookie';
import QS from 'qs';
import Axios from 'axios';
import * as ElementIcons from '@element-plus/icons-vue';
import ElementPlus from 'element-plus';
import RoaduiUtils from './roadui-assets/utils.js';//roadui常用js函数
import RoaduiConfig from './roadui-assets/config.js';//roadui配置
import App from './App.vue';
import ElSelectico from './roadui-components/el-selectico.vue';//图标选择控件
import ElSelectorg from './roadui-components/el-selectorg.vue';//组织架构选择控件
import ElSelectdict from './roadui-components/el-selectdict.vue';//数据字典选择控件
import ElCkeditor from './roadui-components/el-ckeditor.vue';//HTML编辑器控件
import ElSelectfile from './roadui-components/el_selectfile.vue';//附件管理控件
import ElUsersign from './roadui-components/el_usersign.vue';//用户签章控件
import ElSelectflow from './roadui-components/el_selectflow.vue';//流程选择控件
import ElSelectdiv from './roadui-components/el_selectdiv.vue';//弹出选择控件
import ElCodemirror from './roadui-components/el_codemirror.vue';//codemirror控件
import 'element-plus/theme-chalk/el-message.css';//按需导入没有message样式，所以这里单独引入。
import 'element-plus/theme-chalk/el-message-box.css';
import 'element-plus/dist/index.css';
import './roadui-assets/share.css';//引入全局样式
import 'vant/lib/index.css';
import Vant from 'vant';
// import Print from 'vue3-print-nb'

/**设置系统配置 */
const IS_DEV = process.env.NODE_ENV === 'development';
RoaduiConfig['IS_DEV'] = IS_DEV;
RoaduiConfig['BASE_URL'] = IS_DEV ? RoaduiConfig.SERVER_DEV_BASEURL : RoaduiConfig.SERVER_PRO_BASEURL;
RoaduiConfig['SERVER_ADDRESS'] = IS_DEV ? RoaduiConfig.SERVER_DEV_ADDRESS : RoaduiConfig.SERVER_PRO_ADDRESS;
RoaduiConfig['SERVER_APIADDRESS'] = IS_DEV ? RoaduiConfig.SERVER_DEV_APIADDRESS : RoaduiConfig.SERVER_PRO_APIADDRESS;
RoaduiConfig['SERVER_WEBADDRESS'] = IS_DEV ? RoaduiConfig.SERVER_DEV_WEBADDRESS : RoaduiConfig.SERVER_PRO_WEBADDRESS;

/**设置axios请求 */
Axios.defaults.timeout = 100000;// 请求超时时间配置
Axios.defaults.baseURL = RoaduiConfig['SERVER_APIADDRESS'];//api地址配置
Axios.defaults.withCredentials = true;//开启跨域访问时携带cookie数据

const app = createApp(App);
//加载系统所有模块
RoaduiUtils.systemModules = import.meta.glob('./roadui-pages/**/*.vue');

//注册图标组件
for (const [key, component] of Object.entries(ElementIcons)) {
    app.component(key, component);
    RoaduiUtils.icons.push(key);
}

app.provide('cookie', Cookie);
app.provide('config', RoaduiConfig);
app.provide('utils', RoaduiUtils);
app.provide('qs', QS);

//请求拦截器
Axios.interceptors.request.use((config) => {
    //如果前后端跨域就要启用下面代码，把token放到headers中
    let roadflowToken = RoaduiUtils.getToken();
    if (RoaduiUtils.length(roadflowToken) > 0) {
        config.headers['nroadflow-token'] = roadflowToken;
    }

    //企业微信token
    let roadflowQyWechatToken = RoaduiUtils.getQyWechatToken();
    if (RoaduiUtils.length(roadflowQyWechatToken) > 0) {
        config.headers['nroadflow-token-qywechat'] = roadflowQyWechatToken;
    }

    //客户端id-单点登录用
    let roadflowClientId = RoaduiUtils.getClientId();
    if (RoaduiUtils.length(roadflowClientId) > 0) {
        config.headers['nroadflow-clientid'] = roadflowClientId;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

//响应拦截器
Axios.interceptors.response.use((response) => {
    let errorCode = 0;
    if ((typeof response['data']) == 'object') {
        errorCode = response.data['code'];
    }
    switch (errorCode) {
        case 401:
            //登录失效或没有登录
            window.location.href = RoaduiConfig.BASE_URL + '?loadurl=login';
            return null;
        case 402:
            //在其他地方登录
            var ip = response.data.data['loginIp'];
            var msg = '您的帐号已在' + (RoaduiUtils.length(ip) > 0 ? ip : '其他地方') + '登录，您被迫下线！';
            RoaduiUtils.alert(msg, '', '', false, () => { window.location.href = RoaduiConfig.BASE_URL + '?loadurl=login'; });
            //window.location.href = RoaduiConfig.BASE_URL + '?loadurl=login';
            return null;
        case 403:
            //token刷新延期
            var delayToken = response.data['msg'];
            if (RoaduiUtils.length(delayToken) === 0) {
                window.location.href = RoaduiConfig.BASE_URL + '?loadurl=login';
            }
            RoaduiUtils.setToken(delayToken);
            var config = response.config;
            config.headers['nroadflow-token'] = delayToken;
            return RoaduiUtils.doRequest(Axios, config);
        case 405:
            RoaduiUtils.msg('您没有访问权限！', false);
            return null;
        case 406:
            //406跳转到指定地址
            top.location.href = response.data['msg'];
            return null;
        default:
            return Promise.resolve(response.data);
    }
}, (error) => {
    try {
        RoaduiUtils.msg(error, false);
    } catch (e) { console.log(e); }
    //console.log(error);
    //return Promise.reject(error);
});
app.provide('ajax', Axios);
app.provide('app', app);

//扩展组件
app.provide('ElSelectico', ElSelectico);
app.provide('ElSelectorg', ElSelectorg);
app.provide('ElSelectdict', ElSelectdict);
app.provide('ElCkeditor', ElCkeditor);
app.provide('ElSelectfile', ElSelectfile);
app.provide('ElUsersign', ElUsersign);
app.provide('ElSelectflow', ElSelectflow);
app.provide('ElSelectdiv', ElSelectdiv);
app.provide('ElCodemirror', ElCodemirror);

app.use(ElementPlus);
app.use(Vant);
// app.use(Print)
app.mount('#app');