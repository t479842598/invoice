<template>
    <div>
        <div class="roadui_noprint" style="margin:10px 0 12px 10px">
            <el-space>
                <el-button type="primary" @click="print1">打印</el-button>
                <el-button @click="close1">关闭</el-button>
            </el-space>
        </div>
        <table cellpadding="0" cellspacing="0" class="roadui_printtable" style="width:98%">
            <tr>
                <th>日志标题</th>
                <td colspan="3">{{log.title}}</td>
            </tr>
            <tr>
                <th style="width:110px">日志类型</th>
                <td>{{getTypeTitle(log.type)}}</td>
                <th style="width:110px">发生ip</th>
                <td>{{log.ipAddress=='::1'?'127.0.0.1':log.ipAddress}}</td>
            </tr>
            <tr>
                <th>发生时间</th>
                <td>{{log.writeTime}}</td>
                <th>操作人员</th>
                <td>{{log.userName}}</td>
            </tr>
            <tr>
                <th>来源URL</th>
                <td colspan="3">{{log.referer}}</td>
            </tr>
            <tr>
                <th>操作URL</th>
                <td colspan="3">{{log.url}}</td>
            </tr>
            <tr>
                <th>浏览器</th>
                <td colspan="3">{{log.agent}}</td>
            </tr>
            <tr v-if="utils.length(log.contents)>0">
                <th>日志内容</th>
                <td colspan="3">{{log.contents}}</td>
            </tr>
            <tr v-if="utils.length(log.oldContents)>0">
                <th>操作前</th>
                <td colspan="3">{{log.oldContents}}</td>
            </tr>
            <tr v-if="utils.length(log.newContents)>0">
                <th>操作后</th>
                <td colspan="3">{{log.newContents}}</td>
            </tr>
            <tr v-if="utils.length(log.others)>0">
                <th>其他内容</th>
                <td colspan="3">{{log.others}}</td>
            </tr>
        </table>
    </div>
</template>

<script setup>
    import { ref, onMounted, inject, computed } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');

    const props = defineProps({
        query: { type: String, default: () => { return ''; } }
    });

    let logId = utils.query('logid', props.query);
    const log = ref({});
    //日志类型选项
    const types = [
        { value: '0', title: '登录日志' },
        { value: '1', title: '系统管理' },
        { value: '2', title: '流程管理' },
        { value: '3', title: '流程运行' },
        { value: '4', title: '表单管理' },
        { value: '100', title: '其他类型' },
        { value: '500', title: '系统异常' },
    ];
    //根据日志类型得到标题
    const getTypeTitle = computed(() => (type) => {
        const typeObj = utils.getArrayObj(types, type, 'value');
        return typeObj == null ? type : typeObj.title;
    });

    onMounted(() => {
        loadData();
    });

    const loadData = () => {
        if (utils.length(logId) > 0) {
            ajax.post('/Log/Get?logid=' + logId).then((res) => {
                if (res.code == -1) {
                    utils.msg('未找到日志！', res.success);
                    return;
                }
                log.value = res.data;
            }).catch(() => { });
        }
    };
    const print1 = () => {
        window.print();
    };
    const close1 = () => {
        window.close();
    };
</script>