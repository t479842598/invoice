<template>
    <div class="roadui_page" style="padding: 0 12px;">
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
            <tr>
                <td align="center" class="roadui_showdoc_title">{{showDocData.title}}</td>
            </tr>
            <tr>
                <td align="center" class="roadui_showdoc_title1">
                    <el-space :size="20">
                        <span><span style="margin-right:12px">栏目</span>{{showDocData.dirName}}</span>
                        <span><span style="margin-right:12px">发布时间</span>{{utils.replaceTime(showDocData.editTime)}}</span>
                        <span><span style="margin-right:12px">发布人</span>{{showDocData.editUserName}}</span>
                        <span v-if="utils.length(showDocData.source)>0"><span style="margin-right:12px">来源</span>{{showDocData.source}}</span>
                        <span v-if="utils.length(showDocData.docRank)>0"><span style="margin-right:12px">等级</span>{{showDocData.docRank}}</span>
                        <span><el-button type="primary" @click="print1(showDocData.id)">打印</el-button></span>
                    </el-space>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="roadui_showdoc_contents1" v-html="showDocData.contents"></div>
                </td>
            </tr>
            <tr v-if="utils.length(showDocData.files)>0">
                <td class="roadui_showdoc_files">
                    附件：
                    <span style="margin-right:12px" v-for="(file,index) in showDocData.files" :key="file.id">
                        <el-link @click="utils.showFile(index_openmenu, file, sysConfig.SERVER_WEBADDRESS)">{{(++index)+'、'+file.name}}</el-link>
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
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const docId = utils.query('id', props.query);
    const index_openmenu = inject('index_openmenu');
    const sysConfig = inject('config');

    const showDocData = ref({});

    onMounted(() => {
        loadDoc();
    });

    const loadDoc = () => {
        ajax.post('/Doc/GetDocShow?docid=' + docId).then((res) => {
            if (res.code == 1) {
                utils.msg('加载文档数据失败！', false);
                return;
            }
            if (res.code == 2) {
                utils.msg('您无权查看该文档！', false);
                return;
            }
            showDocData.value = res.data;
        }).catch(() => { });
    };
    //打印
    const print1 = (id) => {
        utils.open('?loadurl=' + encodeURIComponent('/system/document/print?docid=' + id), 1000, 600, '打印文档');
    };
</script>