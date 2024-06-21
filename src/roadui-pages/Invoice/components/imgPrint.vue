<template>
    <div>
        <div style="width: 100%;max-height: 90vh;overflow: hidden;overflow-y: scroll;">
            <div style="margin-bottom: 20px;width: 100%;text-align: center;">
                <el-button type="primary" icon="Printer" @click="print()">打印</el-button>
                <el-button @click="close()" icon="CircleClose">关闭</el-button>
            </div>
            <div class="demo-image__preview">
                <el-image style="width: 950px; height: 680px" :src="srcList[0]" :zoom-rate="1.2" :max-scale="1.5"
                    :min-scale="0.2" :preview-src-list="srcList" :initial-index="4" fit="scale-down" infinite />
            </div>
            <div id="printme" style="display: none;">

            </div>
        </div>
    </div>
</template>

<script setup>
import { ajaxUpload } from 'element-plus/es/components/upload/src/ajax';
import { getCurrentInstance, inject, nextTick, onMounted, provide, ref, shallowRef, watch } from 'vue'
const { proxy } = getCurrentInstance();//全局变量
const curWwwPath = window.document.location.href;
const printImgUrl = ref(curWwwPath + 'upload/')
const imgshow = inject('imgshow')
const viewfileshow = inject('viewfileshow')
const index_refreshtab = inject('index_refreshtab');//首页刷新标签方式
const printme = ref(null)
const ruleForm = ref({})
const btnshow = ref(true)
const imgList = ref([])//图片列表
const selectListid = defineModel('selectListid')
const srcList = ref([])
// let dataURL = ''
onMounted(() => {
    // 循环生成图片链接，加入进数组中，格式为printImgUrl.value+imgshow.value中的imagename
    imgshow.value.forEach(item => {
        srcList.value.push(printImgUrl.value + item.imagename)
    })
    // 页面加载完调用打印
    document.querySelector('#printme').innerHTML =
        imgshow.value.map(item => {
            return `<div style="width:100%;text-align:center;"><img src="${printImgUrl.value + item.imagename}" style="width: 95%;" alt=""></div>`
        }).join(''); // 使用空字符串作为分隔符，这样就不会有逗号了
    // imgshow.value.map(item => {
    //     return `<img src="${printImgUrl.value + item.imagename}" style="width: 100%;" alt=""><div style="page-break-after:always;"><br /></div>`
    // }).join(''); // 使用空字符串作为分隔符，这样就不会有逗号了
})
const oldStr = ref('')//缓存页面内容
const newStr = ref('')//打印页面内容



/**
 * 打印指定类名的元素内容。
 * 该函数首先通过getElementsByClassName获取所有具有.detail-content类名的元素，
 * 然后将内容复制到一个隐藏的iframe中，对iframe中的内容进行样式调整和添加，
 * 最后通过iframe的contentWindow.print()方法进行打印。
 */
function print() {
    // 获取所有具有.detail-content类名的元素
    var el = document.getElementById("printme");
    // 创建一个隐藏的iframe
    var iframe = document.createElement('IFRAME');
    var doc = null;
    // 设置iframe的样式，使其在页面中不可见
    iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
    document.body.appendChild(iframe);
    // 获取iframe的document对象
    doc = iframe.contentWindow.document;
    // 将获取到的元素内容写入iframe的document中
    doc.write('<div class="detail-content content_wrap pl30">' + el.innerHTML + '</div>');
    doc.close();

    // 创建并插入自定义样式，解决打印时的一些样式问题
    var cssString = `.content_wrapxxx`;
    var style = iframe.contentWindow.document.createElement("style");
    style.setAttribute("type", "text/css");
    if (style.styleSheet) {
        // 适用于IE
        style.styleSheet.cssText = cssString;
    } else {
        // 适用于其他浏览器
        var cssText = iframe.contentWindow.document.createTextNode(cssString);
        style.appendChild(cssText);
    }
    var heads = iframe.contentWindow.document.getElementsByTagName("head");
    if (heads.length) {
        heads[0].appendChild(style);
    } else {
        iframe.contentWindow.document.documentElement.appendChild(style);
    }

    // 确保iframe加载完成后再进行打印
    iframe.contentWindow.focus();
    iframe.onload = function () {
        iframe.contentWindow.print();
    };
}

function close() {
    viewfileshow.value = false
}



</script>

<style lang="scss" >
@media print {

    /* 打印时不展示的内容添加此类名即可 */
    .no-print {
        display: none;
        visibility: hidden;
    }
}

.demo-image__error .image-slot {
    font-size: 30px;
}

.demo-image__error .image-slot .el-icon {
    font-size: 30px;
}

.demo-image__error .el-image {
    width: 100%;
    height: 200px;
}
</style>