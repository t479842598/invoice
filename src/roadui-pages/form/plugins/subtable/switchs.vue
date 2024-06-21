<template>
    <div class="roadui_formdesign_subtablediv">
        <el-tabs>
            <el-tab-pane name="0" :label="attrTitle" style="height:100%">
                <table class="roadui_formtable" style="width:98%; margin: 0 auto;">
                    <tr>
                        <th>默认值</th>
                        <td>
                            <el-cascader placeholder="选择默认值" :options="defaultValueOptions" :props="{expandTrigger:'hover',checkStrictly:false}" clearable @change="setDefault" style="width:260px;margin-right:18px" />
                            <el-input v-model="setJson.defaultValue" style="width:730px;" clearable></el-input>
                        </td>
                    </tr>
                    <tr>
                        <th>选中文本</th>
                        <td>
                            <el-input v-model="setJson.checkedChildren" clearable style="width:140px;margin-right:12px"></el-input>
                            <span>
                                非选中文本
                                <el-input v-model="setJson.unCheckedChildren" clearable style="width:140px;margin:0 12px"></el-input>
                            </span>
                            <span>
                                选中时值
                                <el-input v-model="setJson.checkedValue" clearable style="width:140px;margin:0 12px"></el-input>
                            </span>
                            <span>
                                非选中时值
                                <el-input v-model="setJson.unCheckedValue" clearable style="width:140px;margin-left:12px"></el-input>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th>选中颜色</th>
                        <td>
                            <el-color-picker v-model="setJson.checkedColor"></el-color-picker>
                            <span style="margin-left:12px">
                                非选中颜色
                                <span style="margin-left:12px">
                                    <el-color-picker v-model="setJson.unCheckedColor"></el-color-picker>
                                </span>
                            </span>
                            <el-checkbox v-model="setJson.defaultChecked" label="默认是否选中" style="margin-left:24px;vertical-align:middle;"></el-checkbox>
                            <el-checkbox v-model="setJson.inlinePrompt" label="是否显示在点内" style="vertical-align:middle;"></el-checkbox>
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
    import designjs from '../../form-design.js';
    import { ref, inject, onMounted } from 'vue';
    const utils = inject('utils');
    const setEditRecord = inject('setEditRecord');
    const setJson = ref({});
    const defaultValueOptions = designjs.defaultValueOptions();
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