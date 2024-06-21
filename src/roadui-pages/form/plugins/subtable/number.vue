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
                        <th>宽度</th>
                        <td>
                            <el-input v-model="setJson.width" placeholder="%或px" style="width:140px;margin-right:12px;" clearable></el-input>
                            背景文字
                            <el-input v-model="setJson.placeholder" placeholder="placeholder" style="width:203px;margin-left:12px;" clearable></el-input>
                            <span style="margin-left:12px;"><el-checkbox v-model="setJson.disabled" label="禁用" style="vertical-align:middle"></el-checkbox></span>
                            <span style="margin-left:12px;"><el-checkbox v-model="setJson.readonly" label="只读" style="vertical-align:middle"></el-checkbox></span>
                            <span style="margin-left:12px;"><el-checkbox v-model="setJson.stepstrictly" label="只能输入步长的倍数" style="vertical-align:middle"></el-checkbox></span>
                            <span style="margin-left:12px;"><el-checkbox v-model="setJson.controls" label="显示控制按钮" style="vertical-align:middle"></el-checkbox></span>
                            <span style="margin-left:12px;" v-show="setJson.controls"><el-checkbox v-model="setJson.controlsposition" label="按钮在右边" style="vertical-align:middle"></el-checkbox></span>
                        </td>
                    </tr>
                    <tr>
                        <th>步长</th>
                        <td>
                            <el-input-number v-model="setJson.step" style="width:120px;margin-right:12px;" clearable controls-position="right"></el-input-number>
                            小数位
                            <el-input-number v-model="setJson.precision" style="width:120px;margin:0 12px;" clearable controls-position="right"></el-input-number>
                            <span style="margin-left:12px;">最小值<el-input-number v-model="setJson.min" style="width:100px;margin-left:12px;" clearable controls-position="right"></el-input-number></span>
                            <span style="margin-left:12px;">最大值<el-input-number v-model="setJson.max" style="width:100px;margin-left:12px;" clearable controls-position="right"></el-input-number></span>
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
        //设置默认选项
        if (!utils.hasKey(setJson.value, 'controls')) {
            setJson.value.controls = true;
        }
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