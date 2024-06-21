import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  base: "./",
  define: {
    // enable hydration mismatch details in production build
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
  },
  plugins: [
    vue(),
    // AutoImport({
    //   resolvers: [VantResolver()],
    // }),
    // Components({
    //   resolvers: [VantResolver()],
    // }),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  resolve: {
    alias: {

    },
  },
  build: {
    target: 'modules', //modules || esnext
    minify: 'esbuild', //esbuild || terser 混淆器
    // minify: 'terser', //esbuild || terser 混淆器
    sourcemap: false,//是否生成 source map 文件
    manifest: false, // 是否产出maifest.json
    // outDir: '../后端/RoadFlow.Web/wwwroot', //指定输出路径
    outDir: './dist', //指定输出路径
    //assetsDir: 'static/img/', // 指定生成静态资源的存放路径
    brotliSize: true, //压缩报告
    assetsInlineLimit: 10240,//小于此阈值的导入或引用资源将内联为base64编码，以避免额外的http请求。设置为0可以完全禁用此项。4096 (4kb)
    reportCompressedSize: true,//启用/禁用 gzip 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。
    cssCodeSplit: true, //css 拆分
    chunkSizeWarningLimit: 1536,//显示警告的文件大小阈值（以 kb 为单位）。默认为 500kb
    // terserOptions: {//terser 混淆器，terser 配置 https://github.com/terser/terser
    //   compress: {
    //     drop_console: true,//删除console
    //     drop_debugger: true,//删除debugger
    //   },
    // },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const arr = id.toString().split('node_modules/')[1].split('/');
            switch (arr[0]) {
              case '@popperjs':
              case '@vue':
              case 'element-plus': //UI库
              case '@element-plus': //图标
              case '@microsoft'://office
              case 'crypto-js'://加密
              //case '@codemirror':
              case 'vue-codemirror'://代码编辑器
              case 'vue-cropper'://图片裁剪
              case 'vuedraggable':
              case 'raphael':
              case 'splitpanes':
              case 'echarts':
              case 'pdfjs-dist':
              case 'weixin-webview-jssdk':
              case 'jquery':
                //case 'js-cookie':
                return '_' + arr[0];
                break;
              default:
                return '__vendor';
                break;
            }
          }
        },
        // chunkFileNames: 'static/chunk/[name]-[hash].js',
        // entryFileNames: 'static/entry/[name]-[hash].js',
        // assetFileNames: 'static/assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  esbuild: {
    drop: [
      'console', // 如果线上需要打印，就把这行注释掉
      'debugger',
    ],
  },
});