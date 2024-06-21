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
                            对齐方式
                            <el-select v-model="setJson.align" style="width:100px;margin-left:12px;" clearable>
                                <el-option value="left" label="左对齐"></el-option>
                                <el-option value="center" label="居中"></el-option>
                                <el-option value="right" label="右对齐"></el-option>
                            </el-select>
                            <span style="margin-left:12px;">最大字符<el-input-number :min="0" v-model="setJson.maxLength" style="width:100px;margin-left:12px;" clearable controls-position="right"></el-input-number></span>
                            <span style="margin-left:12px;">行数<el-input-number :min="0" v-model="setJson.rows" style="width:100px;margin-left:12px;" clearable controls-position="right"></el-input-number></span>
                            <span style="margin-left:12px;"><el-checkbox v-model="setJson.disabled" label="禁用" style="vertical-align:middle"></el-checkbox></span>
                            <!--<span style="margin-left:12px;"><el-checkbox v-model="setJson.allowClear" label="可清除" style="vertical-align:middle"></el-checkbox></span>-->
                        </td>
                    </tr>
                    <tr>
                        <th>背景文字</th>
                        <td>
                            <el-input v-model="setJson.placeholder" placeholder="placeholder" style="width:328px;" clearable></el-input>
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