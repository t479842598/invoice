<template>
    <div class="roadui_formdesign_subtablediv">
        <el-tabs>
            <el-tab-pane name="0" :label="attrTitle" style="height:100%">
                <table class="roadui_formtable" style="width:98%; margin: 0 auto;">
                    <tr>
                        <th>宽度</th>
                        <td>
                            <el-input v-model="setJson.width" style="width:260px;margin-right:12px;" clearable placeholder="px或%"></el-input>
                            背景文字<el-input v-model="setJson.placeholder" style="width:257px;margin-left:12px;" clearable placeholder="placeholder"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <th>文件类型</th>
                        <td>
                            <el-input v-model="setJson.fileType" style="width:260px;margin-right:12px;" clearable placeholder="可上传的文件类型，例：.jpg,.png,.docx等。"></el-input>
                            文件数量<el-input-number v-model="setJson.limit" style="width:100px;margin-left:12px;" :min="1" controls-position="right" clearable></el-input-number>
                        </td>
                    </tr>
                    <tr>
                        <th>显示类型</th>
                        <td>
                            <el-radio-group v-model="setJson.showType" style="vertical-align: middle;">
                                <el-radio value="link" label="链接"></el-radio>
                                <el-radio value="linkbr" label="链接换行"></el-radio>
                            </el-radio-group>
                            <el-checkbox style="margin-left:22px;vertical-align:middle;" v-model="setJson.showImg" label="显示图片"></el-checkbox>
                            <el-checkbox v-model="setJson.showIndex" style="vertical-align:middle;" label="显示序号"></el-checkbox>
                            <span class="roadui_note" style="margin-left:12px;vertical-align:middle;">只读时的显示方式</span>
                        </td>
                    </tr>
                    <tr>
                        <th>控件类型</th>
                        <td>
                            <el-radio-group v-model="setJson.controlType" style="vertical-align: middle;">
                                <el-radio label="0">弹出层</el-radio>
                                <el-radio label="1">Element</el-radio>
                            </el-radio-group>
                            <span style="margin-left: 12px; vertical-align: middle;">显示样式</span><el-input v-model="setJson.showStyle" style="width: 560px; margin-left: 12px; vertical-align: middle;" clearable placeholder="显示时的css样式"></el-input>
                        </td>
                    </tr>
                    <tr v-show="setJson.controlType=='1'">
                        <th>显示方式</th>
                        <td>
                            <el-radio-group v-model="setJson.controlShowType" style="vertical-align: middle;">
                                <el-radio label="0">列表</el-radio>
                                <el-radio label="1">头像</el-radio>
                                <el-radio label="2">照片墙</el-radio>
                            </el-radio-group>
                            <span style="margin-left:12px">
                                提示<el-input v-model="setJson.tip" style="margin-left:12px;width:280px;" placeholder="对上传文件的要求说明等提示"></el-input>
                            </span>
                            <span style="margin-left:12px">
                                按钮文字<el-input v-model="setJson.buttonText" style="margin-left:12px;width:180px;" placeholder=""></el-input>
                            </span>
                        </td>
                    </tr>
                </table>
            </el-tab-pane>
            <el-tab-pane name="1" label="事件" style="height:100%">
                <table class="roadui_formtable" style="width:98%; margin: 0 auto;">
                    <tr>
                        <th style="width:50px">事件</th>
                        <td>
                            <el-select v-model="eventName">
                                <el-option v-for="event in setJson.events" :key="event.name" :value="event.name">{{event.name}}</el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <th>脚本</th>
                        <td>
                            <!--<el-input type="textarea" v-for="event in setJson.events" :key="'script_'+event.name" v-show="eventName==event.name" v-model="event.script" :rows="11" clearable></el-input>-->
                            <div style="width:1040px" v-for="event in setJson.events" :key="'script_'+event.name" v-show="eventName==event.name">
                                <el-codemirror v-model="event.script" height="250px"></el-codemirror>
                            </div>
                        </td>
                    </tr>
                </table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const utils = inject('utils');
    const setEditRecord = inject('setEditRecord');
    const setJson = ref({});
    const eventName = ref('');
    const attrTitle = ref('属性');//属性标签标题
    const ElCodemirror = inject('ElCodemirror');

    onMounted(() => {
        setJson.value = setEditRecord.value.set;
        if (utils.length(setJson.value.events) > 0) {
            eventName.value = setJson.value.events[0].name;
        }
        if (utils.length(setEditRecord.value.title) > 0) {
            attrTitle.value = setEditRecord.value.title;
        }
    });

    //设置默认值
    const setDefault = (v) => {
        if (utils.length(v) === 0) {
            return;
        }
        if (!utils.hasKey(setJson.value, 'defaultValue')) {
            setJson.value.defaultValue = '';
        }
        setJson.value.defaultValue += v[v.length - 1];
    };
</script>