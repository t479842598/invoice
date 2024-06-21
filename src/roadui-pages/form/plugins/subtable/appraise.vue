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
                        <th>图标</th>
                        <td>
                            <el-selectico v-model="setJson.customIcon" clearable style="margin-right:12px;width:190px;" />
                            <span>
                                总数
                                <el-input-number v-model="setJson.count" controls-position="right" style="margin:0 20px 0 12px;width:100px;"></el-input-number>
                            </span>
                            <el-checkbox v-model="setJson.allowHalf" label="允许半选" style="vertical-align:middle;"></el-checkbox>
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
    const ElSelectico = inject('ElSelectico');//图标选择控件
    const ElCodemirror = inject('ElCodemirror');
    const setEditRecord = inject('setEditRecord');
    const setJson = ref({});
    const defaultValueOptions = designjs.defaultValueOptions();
    const eventName = ref('');
    const attrTitle = ref('属性');//属性标签标题

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