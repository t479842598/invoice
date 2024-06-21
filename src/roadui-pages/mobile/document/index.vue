<template>
    <div style="height:inherit;">
        <div class="roaduim_title">
            <el-icon><Briefcase /></el-icon>
            <span>文档中心</span>
        </div>
        <div>
            <el-drawer v-model="drawer"
                       title=""
                       size="90%"
                       :show-close="false"
                       class="roaduim_doc_drawer"
                       direction="ltr">
                <template #header="{ close, titleId, titleClass }">
                    <h4>文档目录</h4>
                    <el-button type="primary" @click="drawer=false">关闭</el-button>
                </template>
                <el-tree :data="treeData"
                         :props="defaultProps"
                         :load="loadTreeNode"
                         lazy
                         ref="dirTreeRef"
                         node-key="id"
                         highlight-current
                         :default-expanded-keys="defaultExpandedKeys"
                         :expand-on-click-node="false"
                         style="height:inherit; padding-right: 14px;"
                         @node-click="handleNodeClick">
                    <template #default="scope">
                        <div class="roadui_treenode">
                            <el-icon v-if="scope.node.isLeaf"><document /></el-icon>
                            <el-icon v-else><folder /></el-icon>
                            <span>{{scope.node.label}}</span>
                        </div>
                    </template>
                </el-tree>
            </el-drawer>
            <div style="padding:0 12px">
                <el-form :inline="true">
                    <el-form-item label="" style="margin:0 12px 0 0;width:150px;">
                        <el-input v-model="formData.title"  clearable />
                    </el-form-item>
                    <el-form-item style="margin:0">
                        <el-button type="primary" @click="loadData(true)">查询</el-button>
                        <el-button type="primary" @click="drawer=!drawer">显示目录</el-button>
                    </el-form-item>
                </el-form>
                <div v-infinite-scroll="loadMore" :infinite-scroll-disabled="butDisabled" :infinite-scroll-immediate="true">
                    <div v-for="doc in docList" :key="doc.id" @click="openDoc(doc)" class="roaduim_main_todoitem">
                        <div>{{doc.title}}</div>
                        <div class="roaduim_main_todonote">
                            <el-space :size="15" wrap>
                                <span><el-icon><User /></el-icon>{{doc.writeUserName}}</span>
                                <span>{{doc.dirName}}</span>
                                <span>{{doc.writeTime}}</span>
                            </el-space>
                        </div>
                    </div>
                    <div class="roadui_note" style="text-align:center;padding:10px 0;" v-show="butDisabled">没有更多了</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    .roaduim_doc_drawer { padding:0; }
    .roaduim_doc_drawer > .el-drawer__header { margin-bottom:0; }
    .roaduim_doc_drawer > .el-drawer__body { padding: 0 12px; }
</style>

<script setup>
    import { ref, inject } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const indexm_openurl = inject('indexm_openurl');

    const formData = ref({});

    const drawer = ref(false);//是否显示文档目录
    //文档分类
    const dirName = ref('');//当前栏目名称
    const treeData = ref([]);
    const defaultExpandedKeys = ref([]);
    const defaultProps = { children: 'children', label: 'title', isLeaf: 'isLeaf' };
    const dirTreeRef = ref(null);
    //树点击，加载分类下的应用列表。
    const handleNodeClick = (data) => {
        formData.value['dirId'] = data.id;
        dirName.value = data['title'];
        drawer.value = false;
        loadData(true);
    };
    //加载分类树
    const loadTreeNode = (node, resolve) => {
        //如果是首次加载
        if (node.level === 0) {
            ajax.post('/Doc/GetDirTreeJson').then((res) => {
                treeData.value = res.data;
                if (utils.length(res.data) > 0) {
                    defaultExpandedKeys.value.push(res.data[0].id);
                    formData.value['dirId'] = res.data[0].id;
                    dirName.value = res.data[0]['title'];
                }
                loadData(true);
            }).catch(() => { });
        } else {
            //二次加载
            if (utils.length(node.data.children) > 0) {
                resolve(node.data.children);
                return;
            }
            ajax.post('/Doc/GetDirTreeChildsJson?parentid=' + node.data.id).then((res) => {
                resolve(res.data);
            }).catch(() => { });
        }
    };

    //文档列表
    const loading = ref(false);//数据加载状态
    const butDisabled = ref(false);
    const docList = ref([]);
    let currentNumber = 0;

    const loadMore = () => {
        if (butDisabled.value) {
            return;
        }
        currentNumber++;
        loadData(false);
    };

    const loadData = (isQuery) => {
        if (isQuery) {
            docList.value = new Array();
            currentNumber = 1;
        }
        loading.value = true;
        butDisabled.value = true;
        formData.value.size = 8;
        formData.value.number = currentNumber;
        formData.value.order = '';
        ajax.post('/Doc/GetList', qs.stringify(formData.value)).then((res) => {
            docList.value = docList.value.concat(res.data.rows);
            butDisabled.value = currentNumber >= Math.ceil(res.data.total / 8);
            loading.value = false;
        }).catch(() => { loading.value = false; });
    };

    //查看文档
    const openDoc = (doc) => {
        const url = '/mobile/document/show.vue?id=' + doc.id;
        indexm_openurl('doc_m_' + doc.id, url);
    };
</script>