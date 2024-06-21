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
                            <el-input v-model="setJson.width" placeholder="%或px" style="width:260px;margin-right:12px;"></el-input>
                            背景文字<el-input v-model="setJson.placeholder" placeholder="placeholder" style="width:260px;margin-left:12px;"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <th>选择设置</th>
                        <td>
                            <el-checkbox v-model="setJson.showRoot" label="显示根" style="vertical-align:middle"></el-checkbox>
                            <el-checkbox v-model="setJson.selectRoot" label="选择根" style="vertical-align:middle"></el-checkbox>
                            <el-checkbox v-model="setJson.selectParent" label="选择父节点" style="vertical-align:middle"></el-checkbox>
                            <el-checkbox v-model="setJson.multiple" label="多选" style="vertical-align:middle;"></el-checkbox>
                        </td>
                    </tr>
                    <tr>
                        <th>选择范围</th>
                        <td>
                            <el-selectdict ref="selectDictRef" v-model="setJson.range" multiple style="width:601px;margin-right:12px"></el-selectdict>
                            选择个数
                            <el-input-number v-model="setJson.selectSize" style="width:90px;margin-left:12px;vertical-align:middle" clearable controls-position="right"></el-input-number>
                            <span class="roadui_note" style="margin-left:12px">0或空不限制</span>
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
    const ElSelectdict = inject('ElSelectdict');//数据字典选择控件
    const ElCodemirror = inject('ElCodemirror');
    const selectDictRef = ref(null);
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
        selectDictRef.value.initTitle(setJson.value.range);
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