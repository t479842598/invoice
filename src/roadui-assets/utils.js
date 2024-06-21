import cookies from "js-cookie";
import axios from "axios";
import config from "./config.js";
import cryptoJS from "crypto-js";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
export default {
  //保存系统所有模块
  systemModules: {},
  // 获取当前日期,格式YYYY-MM-DD
  getNowFormatDate() {
    const date = new Date();
    const seperator1 = "-";
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = `0${month}`;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = `0${strDate}`;
    }
    const currentdate = `${year}${seperator1}${month}${seperator1}${strDate}`;
    return currentdate;
  },
  //对象是否定义
  isDef(obj) {
    return undefined !== obj && null !== obj;
  },
  //对象是否定义
  isUndef(obj) {
    return undefined === obj || null === obj;
  },
  //空long
  emptyLong: 100000000000000,
  //从服务端获取long id
  async getLongId() {
    return await axios
      .post("/Flow/GetLongId")
      .then((res) => {
        return res.success ? res.data : this.emptyLong;
      })
      .catch(() => {
        return this.emptyLong;
      });
  },
  getId() {
    return axios
      .post("/Flow/GetLongId")
      .then((res) => {
        return res.data;
      })
      .catch(() => { });
  },
  //是否是字符串
  isString(obj) {
    return typeof obj === "string" || obj instanceof String;
  },
  //判断是否是一个数字类型
  isNumber(obj) {
    return Object.prototype.toString.call(obj) === "[object Number]";
  },
  //判断是否是一个数字类型，或者是一个数字字符串。
  isNumberString(obj) {
    return this.length(obj) > 0 && (this.isNumber(obj) || !isNaN(obj));
  },
  // 是否是邮箱格式
  isEmail(obj) {
    if (!obj || obj.length === 0) {
      return false;
    }
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(obj);
  },
  //转换为Number类型, defaultValue：转换失败时的默认值
  toNumber(obj, defaultValue) {
    const dv = this.isNumber(defaultValue) ? defaultValue : 0;
    if (this.isUndef(obj)) {
      return dv;
    }
    if (this.isNumber(obj)) {
      return obj;
    }
    var objString = String(obj);
    var f = parseFloat(objString);
    if (!isNaN(f)) {
      return f;
    }
    var i = parseInt(objString);
    if (!isNaN(i)) {
      return i;
    }
    return dv;
  },
  //是否是数组
  isArray(obj) {
    if (typeof Array.isArray === "undefined") {
      return Object.prototype.toString.call(obj) === "[object Array]";
    }
    return Array.isArray(obj);
  },
  //是否是对象
  isObject(obj) {
    return obj !== null && typeof obj === "object";
  },
  //转换为字符串
  toString(obj) {
    if (obj === null) {
      return "";
    }
    if (this.isObject(obj) || this.isArray(obj)) {
      return JSON.stringify(obj, null, 2);
    }
    return String(obj);
  },
  //判断是否是一个函数
  isFunction(fun) {
    return Object.prototype.toString.call(fun) === "[object Function]";
  },
  //对象的长度，如果是字符串返回字符串的长度，如果是数组返回数组长度，如果是JSON返回json的key数量 trim：是否要去除字符串的空格
  length(obj, trim) {
    const isTrim = this.isUndef(trim) ? true : trim;
    if (this.isUndef(obj)) {
      return 0;
    } else if (this.isString(obj)) {
      return isTrim ? obj.trim().length : obj.length;
    } else if (this.isArray(obj)) {
      return obj.length;
    } else if (this.isNumber(obj)) {
      return obj.toString().length;
    } else if (this.isObject(obj)) {
      let i = 0;
      for (let key in obj) {
        key;
        i++;
      }
      return i;
    }
    return 0;
  },
  //创建GUID isMiddline：是否有-线
  createGuid(isMiddline) {
    let guid = "";
    isMiddline = this.isUndef(isMiddline) ? true : isMiddline;
    for (let i = 1; i <= 32; i++) {
      let n = Math.floor(Math.random() * 16.0).toString(16);
      guid += n;
      if (isMiddline && (i == 8 || i == 12 || i == 16 || i == 20)) {
        guid += "-";
      }
    }
    return guid;
  },
  //URI编码
  encodeURI(uri) {
    if (this.length(uri) <= 0) {
      return "";
    }
    try {
      return encodeURIComponent(uri);
    } catch {
      return uri;
    }
  },
  //URI解码
  decodeURI(uri) {
    if (this.length(uri) <= 0) {
      return "";
    }
    try {
      return decodeURIComponent(uri);
    } catch {
      return uri;
    }
  },
  //aes加密 data要加密的字符串
  aes(data) {
    var key = cryptoJS.enc.Utf8.parse(config.AES_KEY);
    var InDkn4 = cryptoJS.enc.Utf8.parse(data);
    var b = cryptoJS.AES.encrypt(InDkn4, key, {
      mode: cryptoJS.mode.ECB,
      padding: cryptoJS.pad.Pkcs7,
    });
    return b["toString"]();
  },
  //获取地址栏参数
  query(name, search) {
    if (this.isUndef(search)) {
      search = document.location.search;
    }
    if (search.indexOf("?") === -1) {
      search = "?" + search;
    }
    let pattern = new RegExp("[?&]" + name + "\\=([^&]+)", "g");
    let matcher = pattern.exec(search);
    let items = "";
    if (null != matcher) {
      try {
        items = decodeURIComponent(decodeURIComponent(matcher[1]));
      } catch (e) {
        try {
          items = decodeURIComponent(matcher[1]);
        } catch (e) {
          items = matcher[1];
        }
      }
    }
    return this.isUndef(items) ? "" : items.trim();
  },
  //得到url地址?后面的参数不包含?号
  getQuery(url) {
    const urlEmpty = this.length(url) === 0;
    if (urlEmpty) {
      url = document.location.href;
    }
    let queryArray = this.toString(url).split("?");
    return queryArray.length > 1 ? queryArray[1] : urlEmpty ? "" : url;
  },

  //得到登录token，并保存
  //获取token
  getToken() {
    let token = cookies.get("nroadflow-token") || "";
    if (this.length(token) === 0) {
      token = this.query("nroadflow-token");
      if (this.length(token) === 0) {
        token = this.query("nroadflow-token", this.query("loadurl"));
      }
      if (this.length(token) > 0) {
        //如果是URL中获取的写入COOKIE
        this.setToken(token);
      }
    }
    return token;
  },
  //设置token
  setToken(token) {
    return cookies.set("nroadflow-token", token, { expires: 3560 });
  },
  //删除用户登录token
  removeToken() {
    cookies.remove("nroadflow-token");
  },
  //获取企业微信token
  getQyWechatToken() {
    let token = cookies.get("nroadflow-token-qywechat") || "";
    if (this.length(token) === 0) {
      token = this.query("nroadflow-token-qywechat");
      //如果是URL中获取的写入COOKIE
      if (this.length(token) > 0) {
        this.setQyWechatToken(token);
      }
    }
    return token;
  },
  setQyWechatToken(token) {
    return cookies.set("nroadflow-token-qywechat", token, { expires: 3560 });
  },
  //获取登录客户端id
  getClientId() {
    return cookies.get("nroadflow-clientid") || "";
  },
  //设置用户登录id
  setClientId(clientid) {
    return cookies.set("nroadflow-clientid", clientid, { expires: 3560 });
  },
  //删除用户登录id
  removeClientId() {
    cookies.remove("nroadflow-clientid");
  },

  //主题颜色
  themeColors: [
    {
      key: "#0188FB",
      name: "Blue",
      value: {
        "--el-color-primary": "#0188FB", //主颜色
        "--el-color-primary-light-3": "#40a9ff", //按钮鼠标移上颜色
        "--el-color-primary-light-5": "#a0cfff",
        "--el-color-primary-light-7": "#c6e2ff",
        "--el-color-primary-light-8": "#9dddff",
        "--el-color-primary-light-9": "#e6f7ff",
        "--el-color-primary-dark-2": "#015ca9", //logo背景色
      },
    },
    {
      key: "#67C23A",
      name: "Green",
      value: {
        "--el-color-primary": "#67C23A",
        "--el-color-primary-light-3": "#95d475",
        "--el-color-primary-light-5": "#b3e19d",
        "--el-color-primary-light-7": "#d1edc4",
        "--el-color-primary-light-8": "#e1f3d8",
        "--el-color-primary-light-9": "#f0f9eb",
        "--el-color-primary-dark-2": "#529b2e",
      },
    },
    {
      key: "#E6A23C",
      name: "Yellow",
      value: {
        "--el-color-primary": "#E6A23C",
        "--el-color-primary-light-3": "#eebe77",
        "--el-color-primary-light-5": "#f3d19e",
        "--el-color-primary-light-7": "#f8e3c5",
        "--el-color-primary-light-8": "#faecd8",
        "--el-color-primary-light-9": "#fdf6ec",
        "--el-color-primary-dark-2": "#b88230",
      },
    },
    {
      key: "#F56C6C",
      name: "Red",
      value: {
        "--el-color-primary": "#F56C6C",
        "--el-color-primary-light-3": "#f89898",
        "--el-color-primary-light-5": "#fab6b6",
        "--el-color-primary-light-7": "#fcd3d3",
        "--el-color-primary-light-8": "#fde2e2",
        "--el-color-primary-light-9": "#fef0f0",
        "--el-color-primary-dark-2": "#c45656",
      },
    },
    {
      key: "#909399",
      name: "Grey",
      value: {
        "--el-color-primary": "#909399",
        "--el-color-primary-light-3": "#b1b3b8",
        "--el-color-primary-light-5": "#c8c9cc",
        "--el-color-primary-light-7": "#dedfe0",
        "--el-color-primary-light-8": "#e9e9eb",
        "--el-color-primary-light-9": "#f4f4f5",
        "--el-color-primary-dark-2": "#73767a",
      },
    },
  ],
  //得到主题设置
  getTheme() {
    const themeCookie = cookies.get("nroadflow-theme");
    const defaultTheme = {
      menu: 1,//0浅色 1深色
      style: 0,
      color: "#0188FB",
      homeType: 0,//0：上下 1：左右
      menuHide: false,
    };
    if (this.isUndef(themeCookie)) {
      return defaultTheme;
    }
    try {
      const themeJson = JSON.parse(themeCookie);
      //menu 0浅色 1深色 style：主题样式 homeType-首页布局 0：上下 1：左右 menuHide-当首页布局为左右时菜单是否显示
      if (this.length(themeJson) === 0) {
        return {
          menu: 0,
          style: 0,
          color: "#0188FB",
          homeType: 1,
          menuHide: false,
        };
      }
      if (this.length(themeJson.color) === 0) {
        themeJson.color = "#0188FB";
      }
      if (this.isUndef(themeJson.menu)) {
        themeJson.menu = 0;
      }
      if (this.isUndef(themeJson.style)) {
        themeJson.style = 0;
      }
      if (this.isUndef(themeJson.homeType)) {
        themeJson.homeType = 1;
      }
      if (this.isUndef(themeJson.menuHide)) {
        themeJson.menuHide = false;
      }
      return themeJson;
    } catch (e) {
      return defaultTheme;
    }
  },
  //将主题设置保存到cookie
  setTheme(theme) {
    if (this.length(theme) === 0) {
      return;
    }
    return cookies.set("nroadflow-theme", JSON.stringify(theme), {
      expires: 3560,
    });
  },
  //token过期时二次请求
  async doRequest(axios, config) {
    const res = await axios.request(config);
    return res;
  },
  //去除字符串空格
  trim(str) {
    return this.isUndef(str) ? "" : this.toString(str).trim();
  },
  //替换字符串
  replace(str, s1, s2) {
    return !str ? str : str.replace(new RegExp(s1, "gm"), s2);
  },
  //替换字符串中的通配符
  replaceWildcard(str) {
    return this.replace(str, "{<partTime>}", "[兼任]");
  },
  //替换日期时间通配符
  replaceTime(time) {
    var time1 = this.replace(time, "{<minute>}", "分钟");
    time1 = this.replace(time1, "{<hour>}", "小时");
    time1 = this.replace(time1, "{<day>}", "天");
    time1 = this.replace(time1, "{<before>}", "前");
    time1 = this.replace(time1, "{<yesterday>}", "昨天");
    time1 = this.replace(time1, "{<today>}", "今天");
    return time1;
  },
  //判断字符串是否以某个字符串开头
  startWith(str, s1) {
    let reg = new RegExp("^" + s1);
    return reg.test(str);
  },
  //判断字符串是否以某个字符串结尾
  endWith(str, s1) {
    let reg = new RegExp(s1 + "$");
    return reg.test(str);
  },
  //判断JSON中是否有某个KEY childs是否判断子集
  hasKey(obj, key, childs) {
    if (
      this.isUndef(obj) ||
      typeof obj !== "object" ||
      typeof key !== "string"
    ) {
      return false;
    }
    return Object.keys(obj).some(
      (k) => k === key || (childs && this.hasKey(obj[k], key)),
    );
  },
  //从数组查找对象
  getArrayObj(array, value, key) {
    if (this.length(array) === 0) {
      return null;
    }
    for (let i = 0; i < array.length; i++) {
      if (this.length(key) > 0 && this.isObject(array[i])) {
        if (array[i][key] == value) {
          return array[i];
        }
      } else if (array[i] == value) {
        return array[i];
      }
    }
    return null;
  },
  //从数组排除对象
  spliceArrayObj(array, value, key) {
    if (this.length(array) === 0) {
      return array;
    }
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
      if (this.length(key) > 0 && this.isObject(array[i])) {
        if (array[i][key] !== value) {
          newArray.push(array[i]);
        }
      } else if (array[i] !== value) {
        newArray.push(array[i]);
      }
    }
    return newArray;
  },
  //得到数组中数字字段最大值
  getArrayMax(array, key) {
    if (this.length(array) === 0) {
      return 0;
    }
    let max = 0;
    for (let i = 0; i < array.length; i++) {
      const val = parseFloat(this.isDef(key) ? array[i][key] : array[i]);
      if (val > max) {
        max = val;
      }
    }
    return max;
  },
  //判断数组中是否存在某个对象
  inArray(array, value, key) {
    return this.getArrayObj(array, value, key) != null;
  },
  //删除数组中的某个对象，返回删除的对象。
  removeArrayObj(array, value, key) {
    if (this.length(array) === 0) {
      return null;
    }
    let removeIndex = -1;
    for (let i = 0; i < array.length; i++) {
      if (this.length(key) > 0 && this.isObject(array[i])) {
        if (array[i][key] === value) {
          removeIndex = i;
          break;
        }
      } else if (array[i] === value) {
        removeIndex = i;
        break;
      }
    }
    if (removeIndex !== -1) {
      let removeObj = array[removeIndex];
      array.splice(removeIndex, 1);
      return removeObj;
    }
    return null;
  },
  //获取一个JSON数据中的某个字段值作为一个新的数组返回。
  getArrayValues(array, key) {
    if (this.length(array) === 0) {
      return [];
    }
    let array1 = [];
    for (let i = 0; i < array.length; i++) {
      let value = array[i][key];
      if (this.isDef(value)) {
        array1.push(value);
      }
    }
    return array1;
  },
  addChildArray(array1, array, childs) {
    for (let i = 0; i < array.length; i++) {
      if (this.hasKey(array[i], childs) && this.length(array[i][childs]) > 0) {
        this.addChildArray(array1, array[i][childs], childs);
        array1.push(array[i]);
      } else {
        array1.push(array[i]);
      }
    }
  },
  //将一个多级数组转换为一级array要转换的数据 array1新的数组 childs下级字段
  getLevelArray(array, childs) {
    if (!this.isArray(array)) {
      return new Array();
    }
    if (this.isUndef(childs)) {
      childs = "childs";
    }
    var array1 = [];
    this.addChildArray(array1, array, childs);
    return array1;
  },
  //弹出浏览器窗口
  open(url, width, height, name, isMax) {
    //弹出窗口的宽度
    const iWidth = width || 800;
    //弹出窗口的高度
    const iHeight = height || 500;
    let y = (window.screen.availHeight - 30 - iHeight) / 2; //获得窗口的垂直位置;
    let x = (window.screen.availWidth - 10 - iWidth) / 2; //获得窗口的水平位置;
    if (y < 0) {
      y = 10;
    }
    if (x < 0) {
      x = 10;
    }
    const params =
      "height=" +
      iHeight +
      ",width=" +
      iWidth +
      ",top=" +
      y +
      ",left=" +
      x +
      ",toolbar=no,menubar=no,scrollbars=yes,location=no,status=no" +
      (isMax ? ",resizable=yes" : ",modal=yes,resizable=no");
    const win = window.open(url, name || "", params);
    //设置窗口标题
    if (this.length(name) > 0) {
      try {
        win.onload = function () {
          win.document.title = name;
        };
      } catch (e) {
      }
    }
    return win;
  },
  //弹出浏览器新窗口
  openNew(url) {
    return window.open(url);
  },
  //上方弹出消息提示 msg：消息内容，type:消息类型（'success'|'warning'|'info'|'error'），showClose：是否显示关闭按钮，icon：图标, duration：关闭时间
  // 定义一个名为 `msg` 的函数，接受五个参数：消息内容、消息类型、是否显示关闭按钮、图标和持续时间
  msg(msg, type, showClose, icon, duration) {
    // 创建一个对象 `opt`，用于存储消息的配置
    let opt = {
      // 如果 `showClose` 不是 `undefined`，则使用 `showClose` 的值，否则默认为 `true`
      showClose: showClose !== undefined ? showClose : true,
      // 将 `msg` 的值赋给 `message`，表示消息的内容
      message: msg,
      // 给消息添加一个自定义的 CSS 类 `roadui_msg`，用于添加阴影
      customClass: "roadui_msg",
      // 如果 `type` 是字符串，则使用 `type` 的值，否则如果 `type` 是 `undefined` 或者 `true`，则默认为 `success`，否则为 `error`
      type: this.isString(type)
        ? type
        : this.isUndef(type) || type
          ? "success"
          : "error",
    };
    // 如果 `icon` 的长度大于 0，那么将 `icon` 的值赋给 `opt.icon`
    if (this.length(icon) > 0) {
      opt.icon = icon;
    }
    // 如果 `duration` 是数字，那么将 `duration` 的值赋给 `opt.duration`
    if (this.isNumber(duration)) {
      opt.duration = duration;
    }
    // 使用 `ElMessage` 函数显示消息，配置为 `opt` 对象
    ElMessage(opt);
  },
  //弹出消息提示 msg：提示消息 title：标题，okText：确定按钮文本，type：消息类型，okFun：确认后执行的操作
  alert(msg, title, okText, type, okFun) {
    return ElMessageBox.alert(msg, title || "提示", {
      confirmButtonText: okText || "确定",
      draggable: true,
      type: this.isString(type)
        ? type
        : this.isUndef(type) || type
          ? "success"
          : "error",
      callback: () => {
        if (this.isFunction(okFun)) {
          okFun();
        }
      },
    });
  },
  //确认框 msg：提示内容，okFun：确认后执行的操作，title：标题，okText：确认按钮文字，cancelText：取消按钮文字
  async confirm(msg, okFun, title, okText, cancelText) {
    return await ElMessageBox.confirm(msg, title || "操作确认", {
      confirmButtonText: okText || "确认",
      cancelButtonText: cancelText || "取消",
      draggable: true,
      type: "warning",
    })
      .then(() => {
        if (this.isFunction(okFun)) {
          okFun();
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  },
  //消息通知 msg：消息内容 title：标题 type:类型["success", "info", "warning", "error", ""]
  notify(msg, title, type) {
    ElNotification({
      title: title || "",
      message: msg || "",
      type: type || "success",
      dangerouslyUseHTMLString: false,
      offset: 50,
      duration: 2000,
    });
  },
  //克隆json
  cloneJson(json) {
    return JSON.parse(JSON.stringify(json));
  },
  //分页设置 defaultOrder：默认排序
  getPager(defaultOrder) {
    const json = {
      size: 10,
      number: 1,
      total: 100,
      background: true,
      sizes: [10, 15, 20, 30, 40, 50],
      layout: "total,sizes,prev,pager,next,jumper",
      order: this.getOrder(defaultOrder),
      tableStripe: true, //表格是否显示斑马线
      tableBorder: false, //表格是否有边框
      tableHighlightCurrentRow: true, //表格是否高亮当前行
    };
    return this.cloneJson(json);
  },
  getPagerMore(defaultOrder) {
    const json = {
      size: 10,
      number: 1,
      total: 100,
      background: true,
      sizes: [10, 15, 20, 30, 40, 50, 100, 200, 300, 400, 500],
      layout: "total,sizes,prev,pager,next,jumper",
      order: this.getOrder(defaultOrder),
      tableStripe: true, //表格是否显示斑马线
      tableBorder: false, //表格是否有边框
      tableHighlightCurrentRow: true, //表格是否高亮当前行
    };
    return this.cloneJson(json);
  },
  //得到排序
  getOrder(order) {
    if (this.length(order.order) === 0) {
      if (this.hasKey(order, "column")) {
        order.column.order = "ascending";
        order.order = "ascending";
      }
    }
    const prop = order.prop || "";
    const orderBy = order.order || "";
    const orderBy1 = this.startWith(orderBy, "asc")
      ? "asc"
      : this.startWith(orderBy, "desc")
        ? "desc"
        : "asc";
    return this.length(prop) === 0 ? "" : prop + " " + orderBy1;
  },
  formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  },
  //日期范围选择快捷方式
  dateShortucts: [
    {
      text: "这一周",
      value: () => {
        var new_Date = new Date(); //获取本周一周日期
        var timesStamp = new_Date.getTime();
        var currenDay = new_Date.getDay();
        var dates = [];
        for (var i = 0; i < 7; i++) {
          var das = new Date(
            timesStamp + 24 * 60 * 60 * 1000 * (i - ((currenDay + 6) % 7)),
          );
          //if (das > new_Date) {
          //    break;
          //}
          dates.push(das);
        }
        return [dates[0], dates[dates.length - 1]];
      },
    },
    {
      text: "当前月",
      value: () => {
        var y = new Date().getFullYear(); //获取年份
        var m = new Date().getMonth() + 1; //获取月份
        var d = new Date(y, m, 0); //获取当月最后一日
        return [new Date(y, new Date().getMonth(), 1), d];
      },
    },
    {
      text: "近三月",
      value: () => {
        var year, month;
        var currDate = new Date();
        year = currDate.getFullYear();
        month = currDate.getMonth() + 1;
        var d = new Date(year, month, 0); //获取当月最后一日
        switch (month) {
          case 1:
          case 2:
          case 3:
            month += 9;
            year--;
            break;
          default:
            month -= 3;
            break;
        }
        return [new Date(year, month, 1), d];
      },
    },
  ],
  //日期范围选择快捷方式
  getDateShortucts() {
    return this.dateShortucts;
  },

  //系统图标，在main.js中赋值。
  icons: [],
  //组织架构tree数据，避免多次请求重复加载。
  organizeTree: [],
  //工作组tree数据，避免多次请求重复加载。
  workgroupTree: [],
  //判断一个文件是否是图片文件。
  isImageFile(fileName) {
    if (this.length(fileName) === 0) {
      return false;
    }
    let extName = fileName.substr(fileName.lastIndexOf(".") + 1).toLowerCase();
    return (
      extName === "jpg" ||
      extName === "jpeg" ||
      extName === "png" ||
      extName === "gif" ||
      extName === "bmp" ||
      extName === "webp"
    );
  },
  //判断一个文件是否是office文件。
  isOfficeFile(fileName) {
    if (this.length(fileName) === 0) {
      return false;
    }
    let extName = fileName.substr(fileName.lastIndexOf(".") + 1).toLowerCase();
    return (
      extName === "doc" ||
      extName === "docx" ||
      extName === "xls" ||
      extName === "xlsx" ||
      extName === "ppt" ||
      extName === "pptx" ||
      extName === "wps" ||
      extName === "dps" ||
      extName === "et" ||
      extName === "dot" ||
      extName === "docm" ||
      extName === "dotx" ||
      extName === "dotm" ||
      extName === "xlsm" ||
      extName === "xltm" ||
      extName === "xlsb" ||
      extName === "xlam" ||
      extName === "pptm" ||
      extName === "ppsx" ||
      extName === "potx" ||
      extName === "potm" ||
      extName === "ppam"
    );
  },
  //判断一个文件是PDF文件
  isPdfFile(fileName) {
    if (this.length(fileName) === 0) {
      return false;
    }
    let extName = fileName.substr(fileName.lastIndexOf(".") + 1).toLowerCase();
    return extName === "pdf";
  },
  //判断一个文件是否可以在线显示，如文本，PDF，图片等可以直接浏览器显示。
  isInlineFile(fileName) {
    if (this.length(fileName) === 0) {
      return false;
    }
    if (
      this.isImageFile(fileName) ||
      this.isOfficeFile(fileName) ||
      this.isPdfFile(fileName)
    ) {
      return true;
    }
    let extName = fileName.substr(fileName.lastIndexOf(".") + 1).toLowerCase();
    return (
      extName === "tiff" ||
      extName === "ico" ||
      extName === "icon" ||
      extName === "pdf" ||
      extName === "txt" ||
      extName === "inf" ||
      extName === "conf" ||
      extName === "ini" ||
      extName === "log" ||
      extName === "xps" ||
      extName === "json"
    );
  },
  //获取图片大小
  getImageSize(url) {
    return new Promise(function (resolve, reject) {
      let image = new Image();
      image.onload = function () {
        resolve({
          width: image.width,
          height: image.height,
        });
      };
      image.onerror = function () {
        reject({ width: 0, height: 0 });
      };
      image.src = url;
    });
  },
  //显示文件 openMenu：首页的openMenu方法；file：要显示的文件对象；serverAddress：服务器地址 isMobile：是否是移动端
  showFile(openMenu, file, serverAddress, isMobile) {
    const isInlineFile = this.isInlineFile(file.name);
    const contenTtype = isInlineFile ? "inline" : "attachment";
    const isminiprogram = this.query(
      "isminiprogram",
      this.decodeURI(this.getQuery()),
    );
    const url =
      serverAddress +
      "/Files/Show?id=" +
      file.id +
      "&contenttype=" +
      contenTtype +
      "&ismobile=" +
      (isMobile ? "1" : "0") +
      "&isminiprogram=" +
      isminiprogram +
      "&nroadflow-token=" +
      this.getToken();
    //如果可以在线预览
    if (isInlineFile) {
      const w = document.body.clientWidth - (isMobile ? 20 : 300);
      const h = document.body.clientHeight - (isMobile ? 160 : 180);
      let t = (document.body.clientHeight - h) / 2 - 30;
      if (t < 10) {
        t = 10;
      }
      //如果是图片，获取图片尺寸来设置窗口大小
      if (this.isImageFile(file.name)) {
        this.getImageSize(url).then((res) => {
          let w1 = res.width < w ? res.width + 50 : w;
          let h1 = res.height < h ? res.height : h;
          if (w1 < 250) {
            w1 = 250;
          }
          if (h1 < 200) {
            h1 = 200;
          }
          openMenu({
            id: file.id,
            url: url,
            title: file.name,
            openMode: 1,
            width: w1 + "px",
            height: h1 + "px",
            top: t + "px",
            isShowFile: true,
          });
        });
      } else {
        openMenu({
          id: file.id,
          url: url,
          title: file.name,
          openMode: 1,
          width: w + "px",
          height: h + "px",
          top: t + "px",
          isShowFile: true,
        });
      }
    } else {
      if (isMobile) {
        this.openNew(url);
      } else {
        this.open(url, 300, 200, file.name, false);
      }
    }
  },
  NewshowFile(openMenu, file, serverAddress, isMobile) {
    const isInlineFile = this.isInlineFile(file.name);
    const contenTtype = isInlineFile ? "inline" : "attachment";
    const isminiprogram = this.query(
      "isminiprogram",
      this.decodeURI(this.getQuery()),
    );
    const url =
      serverAddress +
      "/Files/Show?id=" +
      file.id +
      "&contenttype=" +
      contenTtype +
      "&ismobile=" +
      (isMobile ? "1" : "0") +
      "&isminiprogram=" +
      isminiprogram +
      "&nroadflow-token=" +
      this.getToken();
    //如果可以在线预览
    if (isInlineFile) {
      const w = document.body.clientWidth - (isMobile ? 20 : 300);
      const h = document.body.clientHeight - (isMobile ? 160 : 180);
      let t = (document.body.clientHeight - h) / 2 - 30;
      if (t < 10) {
        t = 10;
      }
      //如果是图片，获取图片尺寸来设置窗口大小
      if (this.isImageFile(file.name)) {
        this.getImageSize(url).then((res) => {
          let w1 = res.width < w ? res.width + 50 : w;
          let h1 = res.height < h ? res.height : h;
          if (w1 < 250) {
            w1 = 250;
          }
          if (h1 < 200) {
            h1 = 200;
          }
          this.openNew(url);
          return url;
        });
      } else {
        this.openNew(url);
        return url;
      }
    } else {
      if (isMobile) {
        this.openNew(url);
        return url;
      } else {
        this.openNew(url);
        return url;
      }
    }
  },
  NewFileUrl(openMenu, file, serverAddress, isMobile) {
    const isInlineFile = this.isInlineFile(file.name);
    const contenTtype = isInlineFile ? "inline" : "attachment";
    const isminiprogram = this.query(
      "isminiprogram",
      this.decodeURI(this.getQuery()),
    );
    const url =
      serverAddress +
      "/Files/Show?id=" +
      file.id +
      "&contenttype=" +
      contenTtype +
      "&ismobile=" +
      (isMobile ? "1" : "0") +
      "&isminiprogram=" +
      isminiprogram +
      "&nroadflow-token=" +
      this.getToken();
    //如果可以在线预览
    if (isInlineFile) {
      const w = document.body.clientWidth - (isMobile ? 20 : 300);
      const h = document.body.clientHeight - (isMobile ? 160 : 180);
      let t = (document.body.clientHeight - h) / 2 - 30;
      if (t < 10) {
        t = 10;
      }
      //如果是图片，获取图片尺寸来设置窗口大小
      if (this.isImageFile(file.name)) {
        this.getImageSize(url).then((res) => {
          let w1 = res.width < w ? res.width + 50 : w;
          let h1 = res.height < h ? res.height : h;
          if (w1 < 250) {
            w1 = 250;
          }
          if (h1 < 200) {
            h1 = 200;
          }
          // this.openNew(url);
          return url;
        });
      } else {
        // this.openNew(url);
        return url;
      }
    } else {
      if (isMobile) {
        // this.openNew(url);
        return url;
      } else {
        // this.openNew(url);
        return url;
      }
    }
  },
  showFileName(openMenu, file, serverAddress) {
    // const isInlineFile = this.isInlineFile(file.name);
    // const contenTtype = isInlineFile ? "inline" : "attachment";
    // const isminiprogram = this.query(
    //   "isminiprogram",
    //   this.decodeURI(this.getQuery()),
    // );
    const url =
      serverAddress +
      "/Files/Show0?filename=" +
      file.name + '&download=0'
    // +
    // "&contenttype=" +
    // contenTtype +
    // "&isminiprogram=" +
    // isminiprogram +
    // "&nroadflow-token=" +
    // this.getToken();
    this.openNew(url);
  },
  // 显示多个文件,批量下载
  showFileAll(filenames, fileids, serverAddress) {
    const url = serverAddress + "/Files/ShowAll?fileids=" + fileids + '&buyernames=' + filenames
    this.openNew(url);
  },
  // 取当前月1号到当前日期,格式为YYYY-MM-DD,不足两位补0
  getMonth() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return [`${year}-${month}-01`, `${year}-${month}-${day}`];
  },
  //按钮类型选项
  buttonTypes: [
    { value: "primary", label: "主要" },
    { value: "", label: "默认" },
    { value: "success", label: "成功" },
    { value: "warning", label: "警告" },
    { value: "danger", label: "危险" },
    { value: "info", label: "信息" },
    { value: "text", label: "文本" },
  ],
  //按钮类型选项
  getButtonTypes() {
    return this.buttonTypes;
  },
  //返回值：arg1除以arg2的精确结果
  accDiv(arg1, arg2) {
    var t1 = 0,
      t2 = 0,
      r1,
      r2;
    try {
      t1 = arg1.toString().split(".")[1].length;
    } catch (e) { }
    try {
      t2 = arg2.toString().split(".")[1].length;
    } catch (e) { }
    //with (Math) {
    //    r1 = Number(arg1.toString().replace(".", ""))
    //    r2 = Number(arg2.toString().replace(".", ""))
    //   return (r1 / r2) * pow(10, t2 - t1);
    //}
    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return (r1 / r2) * pow(10, t2 - t1);
  },
  //返回值：arg1乘以 arg2的精确结果
  accMul(arg1, arg2) {
    var m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length;
    } catch (e) { }
    try {
      m += s2.split(".")[1].length;
    } catch (e) { }
    return (
      (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
      Math.pow(10, m)
    );
  },
  // 返回值：arg1加上arg2的精确结果
  accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
      r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
      var cm = Math.pow(10, c);
      if (r1 > r2) {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", "")) * cm;
      } else {
        arg1 = Number(arg1.toString().replace(".", "")) * cm;
        arg2 = Number(arg2.toString().replace(".", ""));
      }
    } else {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
  },
  // 返回值：arg1减去arg2的精确结果
  accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
      r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    //last modify by deeka
    //动态控制精度长度
    n = r1 >= r2 ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
  },

  //得到流程状态标题 状态 0设计中 1已发布 2已卸载 3已删除
  getFlowStatusTitle(status) {
    let title = "未知状态";
    switch (status) {
      case 0:
        title = "设计中";
        break;
      case 1:
        title = "已发布";
        break;
      case 2:
        title = "已卸载";
        break;
      case 3:
        title = "已删除";
        break;
    }
    return title;
  },
  //得到流程任务类型对应的标题
  // 0常规 1指派 2委托 3转交 4退回 5抄送 6前加签 7后加签 8并签 9跳转 10自由发送 11征求意见
  getTaskTypeTitle(type) {
    let title = "常规";
    switch (type) {
      case 1:
        title = "指派";
        break;
      case 2:
        title = "委托";
        break;
      case 3:
        title = "转交";
        break;
      case 4:
        title = "退回";
        break;
      case 5:
        title = "抄送";
        break;
      case 6:
        title = "前加签";
        break;
      case 7:
        title = "后加签";
        break;
      case 8:
        title = "加签";
        break;
      case 9:
        title = "跳转";
        break;
      case 11:
        title = "征求意见";
        break;
    }
    return title;
  },
  //得到流程任务类型对应的颜色
  // 0常规 1指派 2委托 3转交 4退回 5抄送 6前加签 7后加签 8并签 9跳转 10自由发送 11征求意见
  getTaskTypeColor(type) {
    let color = "#108ee9";
    switch (type) {
      case 1:
        color = "#d49602";
        break;
      case 2:
        color = "#337ecc";
        break;
      case 3:
        color = "#b88230";
        break;
      case 4:
        color = "#909399";
        break;
      case 5:
        color = "#67C23A";
        break;
      case 6:
      case 7:
      case 8:
        color = "#E6A23C";
        break;
      case 9:
        color = "#d50";
        break;
      case 11:
        color = "#409EFF";
        break;
    }
    return color;
  },
  //得到任务处理类型标题
  //处理类型 0未处理 1处理中 2已完成 3他人已处理 4已退回 5他人已退回 6已转交 7已委托 8已阅知 9已指派 10已跳转 11已终止 12他人已终止 13已暂缓 14他人已暂缓 15已加签
  getTaskHadleTitle(type) {
    let title = "";
    switch (type) {
      case 0:
        title = "待处理";
        break;
      case 1:
        title = "处理中";
        break;
      case 2:
        title = "已完成";
        break;
      case 3:
        title = "他人已处理";
        break;
      case 4:
        title = "已退回";
        break;
      case 5:
        title = "他人已退回";
        break;
      case 6:
        title = "已转交";
        break;
      case 7:
        title = "已委托";
        break;
      case 8:
        title = "已阅知";
        break;
      case 9:
        title = "已指派";
        break;
      case 10:
        title = "已跳转";
        break;
      case 11:
        title = "已终止";
        break;
      case 12:
        title = "他人已终止";
        break;
      case 13:
        title = "已暂缓";
        break;
      case 14:
        title = "他人已暂缓";
        break;
      case 15:
        title = "已加签";
        break;
      case 16:
        title = "自动完成";
        break;
      case 17:
        title = "已回复";
        break;
    }
    return title;
  },
  //得到任务状态标题
  getTaskStatusTitle(status) {
    switch (status) {
      case 0:
        return "正常";
      case 1:
        return "即将超期";
      case 2:
        return "已超期";
      case 3:
        return "严重超期";
      case "启用":
        return "启用";
      case "停用":
        return "停用";
      default:
        return "正常";
    }
  },
  //得到任务状态标签颜色
  getTaskStatusColor(status) {
    switch (status) {
      case 0:
        return "#67C23A"; //正常
      case 1:
        return "#E6A23C"; //即将超期
      case 2:
        return "#F56C6C"; //已超期
      case 3:
        return "#c45656"; //已严重超期
      default:
        return "#909399";
    }
  },
  //得到流程图最大XY坐标
  getFlowMaxXY(steps) {
    if (this.length(steps) <= 0) {
      return { x: 0, y: 0 };
    }
    let x = 0,
      y = 0;
    for (let i = 0; i < steps.length; i++) {
      let x1 = steps[i]["position"]["x"];
      let y1 = steps[i]["position"]["y"];
      if (x1 > x) {
        x = x1;
      }
      if (y1 > y) {
        y = y1;
      }
    }
    return { x: x, y: y };
  },
  flows: [], //流程选项，保存用于避免重复加载

  dbConns: [], //数据连接 [{ value, title }]
  //得到数据连接
  async getConns() {
    if (this.length(this.dbConns) > 0) {
      return this.dbConns;
    } else {
      return await axios
        .post("/DbConnection/GetDbConnOptions")
        .then((res) => {
          if (res.success) {
            //设置系统连接标题。
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].id == this.emptyLong + "") {
                res.data[i].title = "系统连接";
                break;
              }
            }
            this.dbConns = res.data;
          }
          return this.dbConns;
        })
        .catch(() => {
          return [];
        });
    }
  },
  dbConnTables: {}, //连接对应的表{连接id:[{key,label}]}
  //得到数据连接对应的表
  async getConnTables(connId) {
    if (this.length(this.dbConnTables[connId + ""]) > 0) {
      return this.dbConnTables[connId + ""];
    }
    return await axios
      .post("/DbConnection/GetDbConnTables?connid=" + connId)
      .then((res) => {
        this.dbConnTables[connId + ""] = res.data;
        return res.data;
      })
      .catch(() => {
        return [];
      });
  },
  //表对应的字段[{id:f_连接id_表名,fields:[字段]}]
  dbConnTableFields: [],
  //得到数据连接一个表的字段
  async getConnTableFields(connId, table) {
    if (this.length(connId) <= 0 || this.length(table) <= 0) {
      return [];
    }
    let key = ("f_" + connId + "_" + table).toLowerCase();
    if (this.length(this.dbConnTableFields) > 0) {
      for (let i = 0; i < this.dbConnTableFields.length; i++) {
        if (this.dbConnTableFields[i].id === key) {
          return this.dbConnTableFields[i].fields;
        }
      }
    }
    return await axios
      .post(
        "/DbConnection/GetConnTableFields?connid=" + connId + "&table=" + table,
      )
      .then((res) => {
        this.dbConnTableFields.push({ id: key, fields: res.data });
        return res.data;
      })
      .catch(() => {
        return [];
      });
  },
  //得到一个步骤的表单字段 如果applibraryId不为空，用applibraryId查询对应的表单字段。
  formFields: {}, //缓存已加载的表单字段
  async getFromFields(flowId, stepId, applibraryId, programId) {
    let cacheId = "_" + applibraryId;
    if (this.isDef(this.formFields[cacheId])) {
      return this.formFields[cacheId];
    }
    return await axios
      .post(
        "/Form/GetFieldOptions?flowid=" +
        (flowId || "") +
        "&stepid=" +
        (stepId || "") +
        "&applibraryid=" +
        (applibraryId || "") +
        "&programid=" +
        (programId || ""),
      )
      .then((res) => {
        let tableFields = [];
        let subtables = []; //子表
        let maintableFields = []; //主表字段
        let mainName = "";
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].type === "subtable") {
            subtables.push(res.data[i]);
            continue;
          }
          if (this.length(res.data[i]["tableName"]) === 0) {
            let maintableName = "";
            let arr = res.data[i].id.split("-");
            if (arr.length === 2) {
              maintableName = arr[0];
            }
            res.data[i]["tableName"] =
              this.length(maintableName) > 0 ? maintableName : "主表";
          } else {
            if (mainName.length === 0) {
              mainName = res.data[i]["tableName"];
            }
          }
          maintableFields.push(res.data[i]);
        }
        tableFields.push({
          id: "main",
          label: "主表",
          type: "main",
          tableName: mainName,
          fields: maintableFields,
        });
        for (let i = 0; i < subtables.length; i++) {
          let subtableFields = [];
          let subtableName = "";
          for (let j = 0; j < subtables[i].fields.length; j++) {
            subtableFields.push(subtables[i].fields[j]);
            if (
              this.length(subtables[i]["tableName"]) > 0 &&
              subtableName.length === 0
            ) {
              subtableName = subtables[i]["tableName"];
            }
          }
          tableFields.push({
            id: subtables[i].id,
            label: subtables[i].label,
            type: "subtable",
            tableName: subtableName,
            fields: subtableFields,
          });
        }
        if (!programId && tableFields.length > 0) {
          this.formFields[cacheId] = tableFields;
        }
        return tableFields;
      })
      .catch(() => {
        return [];
      });
  },
};
