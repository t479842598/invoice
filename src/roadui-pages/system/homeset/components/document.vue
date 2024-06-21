<template>
    <div>
        <div class="roadui_home_leftdivtitle">
            <span class="roadui_home_leftdivtitle1"><el-icon><Document /></el-icon>文档中心</span>
            <el-link class="roadui_home_leftdivtitlemore" @click="openMore()">更多…</el-link>
        </div>
        <div class="roadui_home_leftdivitem" v-for="doc in docList" :key="doc.id" @click="openDoc(doc)">
            <div>
                <el-tag v-if="doc.isRead==0" effect="dark">未读</el-tag>
                {{doc.title}}
            </div>
            <div class="roadui_note" style="margin-top:6px;">
                <el-space :size="18">
                    <span><el-icon style="margin-right:8px;vertical-align:-1px"><User /></el-icon>{{doc.editUserName}}</span>
                    <span>{{utils.replaceTime(doc.editTime)}}</span>
                </el-space>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const index_openmenu = inject('index_openmenu');
    const docList = ref([]);

    onMounted(() => {
        loadData();
    });

    const loadData = () => {
        const formData = { size: 5, number: 1, order: 'isread asc,writetime desc' };
        ajax.post('/Doc/GetList', qs.stringify(formData)).then((res) => {
            docList.value = res.data.rows;
        }).catch(() => { });
    };

    const openDoc = (doc) => {
        const item = {
            title: doc.title,
            id: 'doc_' + doc.id,
            url: '/system/document/view.vue?id=' + doc.id,
            ico: 'Document',
            openMode: 0,

        };
        index_openmenu(item);
    };

    const openMore = () => {
        const item = {
            title: '文档中心',
            id: 'document_' + utils.createGuid(false),
            url: '/system/document/index',
            ico: 'Document',
            openMode: 0,
        };
        index_openmenu(item);
    };
</script>