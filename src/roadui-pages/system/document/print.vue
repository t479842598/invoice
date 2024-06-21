<template>
    <div>
        <div class="roadui_noprint" style="margin:10px 0 12px 10px">
            <el-button type="primary" @click="print1">打印</el-button>
            <el-button @click="close1">关闭</el-button>
        </div>
        <table cellpadding="0" cellspacing="0" border="0" style="width:99%;margin:0 auto;">
            <tr>
                <td align="center" class="roadui_showdoc_title">{{showDocData.title}}</td>
            </tr>
            <tr>
                <td align="center" class="roadui_showdoc_title1">
                    <el-space :size="20">
                        <span><span style="margin-right:12px">栏目</span>{{showDocData.dirName}}</span>
                        <span><span style="margin-right:12px">发布时间</span>{{showDocData.editTime1}}</span>
                        <span><span style="margin-right:12px">发布人</span>{{showDocData.editUserName}}</span>
                        <span v-if="utils.length(showDocData.source)>0"><span style="margin-right:12px">来源</span>{{showDocData.source}}</span>
                        <span v-if="utils.length(showDocData.docRank)>0"><span style="margin-right:12px">等级</span>{{showDocData.docRank}}</span>
                    </el-space>
                </td>
            </tr>
            <tr>
                <td>
                    <div style="word-wrap: break-word;word-break:break-all;overflow:auto;" v-html="showDocData.contents"></div>
                </td>
            </tr>
            <tr v-if="utils.length(showDocData.files)>0">
                <td class="roadui_showdoc_files">
                    附件：
                    <span style="margin-right:12px" v-for="(file,index) in showDocData.files" :key="file.id">
                        <el-link  @click="utils.showFile(index_openmenu,file,sysConfig.SERVER_WEBADDRESS)">{{(++index)+'、'+file.name}}</el-link>
                    </span>
                </td>
            </tr>
        </table>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const index_openmenu = inject('index_openmenu');
    const sysConfig = inject('config');
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const docId = utils.query('docid', props.query);
    const showDocData = ref({});

    onMounted(() => {
        loadData();
    });

    const loadData = () => {
        ajax.post('/Doc/GetDocShow?docid=' + docId).then((res) => {
            if (res.code == 1) {
                utils.msg('加载文档数据失败！', false);
                return;
            }
            showDocData.value = res.data;
        }).catch(() => { });
    };
    const print1 = () => {
        window.print();
    };
    const close1 = () => {
        window.close();
    };
</script>