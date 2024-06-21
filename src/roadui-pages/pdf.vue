<template>
    <div style="height:100%;width:100%;" v-loading="loading">
        <div style="height: 100%; width: 100%; overflow: auto; ">
            <canvas :id="`pdfCanvas${page}`" v-for="page in data.pdfPages" :key="page"></canvas>
        </div>
    </div>
</template>

<script setup>
    import {ref, reactive, onMounted, nextTick } from "vue";
    import * as PDF from "pdfjs-dist";
    
    const props = defineProps({ src: { type: String, default: () => { return ''; } } });

    const data = reactive({
        pdfPath: props.src, //本地PDF文件路径放在/public中
        pdfPages: [], // 页数
        pdfWidth: "", // 宽度
        pdfSrc: "", // 地址
        pdfDoc: "", // 文档内容
        pdfScale: 1.0, // 放大倍数
    });
    const loading = ref(false);

    onMounted(() => {
        nextTick(() => {
            PDF.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';
            loadFile(data.pdfPath);
        });
    })

    const loadFile = (url) => {
        loading.value = true;
        let loadingTask = PDF.getDocument(url);
        loadingTask.promise.then((pdf) => {
            data.pdfDoc = pdf;
            data.pdfPages = pdf.numPages;
            nextTick(() => {
                renderPage(1);
            });
        });
    }

    const renderPage = (num) => {
        loading.value = true;
        data.pdfDoc.getPage(num).then((page) => {
            let canvas = document.getElementById("pdfCanvas" + num);
            let ctx = canvas.getContext("2d");
            let dpr = window.devicePixelRatio || 1;
            let bsr =
                ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio ||
                1;
            let ratio = dpr / bsr;
            let viewport = page.getViewport({ scale: data.pdfScale });
            canvas.width = viewport.width * ratio;
            canvas.height = viewport.height * ratio;
            canvas.style.width = (document.body.clientWidth - 0) + 'px'; //viewport.width + "px";
            //canvas.style.height = document.body.clientHeight + 'px'; //viewport.height + "px";
            //canvas.style.width = "100%";
            //canvas.style.height = "100%";
            data.pdfWidth = viewport.width + "px";
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            // 将 PDF 页面渲染到 canvas 上下文中
            let renderContext = {
                canvasContext: ctx,
                viewport: viewport,
            };
            page.render(renderContext);
            if (data.pdfPages > num) {
                renderPage(num + 1);
            }
            loading.value = false;
        });
    }
</script>