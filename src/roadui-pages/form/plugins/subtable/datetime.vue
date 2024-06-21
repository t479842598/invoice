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
                            <el-input v-model="setJson.width" placeholder="%或px" clearable style="width:110px;margin-right:12px;"></el-input>
                            背景文字<el-input v-model="setJson.placeholder" placeholder="placeholder" clearable style="width:150px;margin-left:12px;"></el-input>
                            <span style="margin-left:12px">
                                选择类型
                                <el-select v-model="setJson.selectType" clearable style="width:240px;margin-left:12px;">
                                    <el-option value="date" label="日期 - date"></el-option>
                                    <el-option value="datetime" label="日期时间 - datetime"></el-option>
                                    <el-option value="daterange" label="日期范围 - daterange"></el-option>
                                    <el-option value="datetimerange" label="日期时间范围 - datetimerange"></el-option>
                                    <el-option value="year" label="年 - year"></el-option>
                                    <el-option value="month" label="月 - month"></el-option>
                                    <el-option value="monthrange" label="月范围 - monthrange"></el-option>
                                    <el-option value="week" label="周 - week"></el-option>
                                    <el-option value="dates" label="多个日期 - dates"></el-option>
                                    <el-option value="time" label="时间 - time"></el-option>
                                </el-select>
                            </span>
                            <span style="margin-left:12px;"><el-checkbox v-model="setJson.clearable" label="可清除"></el-checkbox></span>
                            <span style="margin-left:12px;" v-show="setJson.selectType==='daterange'||setJson.selectType==='datetimerange'"><el-checkbox v-model="setJson.shortcuts" label="快捷选项"></el-checkbox></span>
                            <span style="margin-left:12px;" v-show="setJson.selectType==='daterange'||setJson.selectType==='datetimerange'||setJson.selectType==='monthrange'">分隔符<el-input v-model="setJson.separator" style="width:104px;margin-left:12px;" placeholder="默认-"></el-input></span>
                        </td>
                    </tr>
                    <tr v-show="setJson.selectType==='time'">
                        <th>开始时间</th>
                        <td>
                            <el-input v-model="setJson.startTime" placeholder="" style="width: 75px;"></el-input>
                            <span style="margin-left:12px;">
                                <span style="margin-right:12px;">结束时间</span>
                                <el-input v-model="setJson.endTime" placeholder="" style="width: 75px;"></el-input>
                            </span>
                            <span style="margin-left:12px;">
                                <span style="margin-right:12px;">最早时间</span>
                                <el-input v-model="setJson.minTime" placeholder="" style="width: 75px;"></el-input>
                            </span>
                            <span style="margin-left:12px;">
                                <span style="margin-right:12px;">最晚时间</span>
                                <el-input v-model="setJson.maxTime" placeholder="" style="width: 75px;"></el-input>
                            </span>
                            <span style="margin-left:12px;">
                                <span style="margin-right:12px;">步长</span>
                                <el-input v-model="setJson.stepTime" placeholder="" style="width: 75px;"></el-input>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th>显示格式</th>
                        <td>
                            <el-input v-model="setJson.format" placeholder="例：YYYY-MM-DD" style="width:260px;margin-right:12px"></el-input>
                            <span>值格式</span>
                            <el-input v-model="setJson.valueFormat" placeholder="例：YYYY-MM-DD" style="width:275px;margin-left:12px;"></el-input>
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