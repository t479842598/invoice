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
                            <el-input v-model="setJson.width" placeholder="%或px" style="width:116px;margin-right:12px;" clearable></el-input>
                            背景文字<el-input v-model="setJson.placeholder" placeholder="placeholder" style="width:155px;margin:0 12px;" clearable></el-input>
                            <span style="margin-right:12px">
                                <el-checkbox v-model="setJson.multiple" label="多选" style="vertical-align:middle;margin-right:12px"></el-checkbox>
                                <span v-show="setJson.multiple">
                                    选择个数
                                    <el-input-number v-model="setJson.selectSize" style="width:90px;margin-left:12px;vertical-align:middle" clearable controls-position="right"></el-input-number>
                                </span>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th>选择类型</th>
                        <td>
                            <el-checkbox-group v-model="setJson.selectType">
                                <el-checkbox label="unit">单位</el-checkbox>
                                <el-checkbox label="dept">部门</el-checkbox>
                                <el-checkbox label="station">岗位</el-checkbox>
                                <el-checkbox label="user">用户</el-checkbox>
                                <el-checkbox label="workgroup">工作组</el-checkbox>
                            </el-checkbox-group>
                        </td>
                    </tr>
                    <tr>
                        <th>选择范围</th>
                        <td>
                            <el-checkbox-group v-model="setJson.selectRange">
                                <el-checkbox label="{<initiatorDeptId>}">发起者部门</el-checkbox>
                                <el-checkbox label="{<initiatorUnitId>}">发起者单位</el-checkbox>
                                <el-checkbox label="{<senderDeptId>}">处理者部门</el-checkbox>
                                <el-checkbox label="{<senderUnitId>}">处理者单位</el-checkbox>
                            </el-checkbox-group>
                        </td>
                    </tr>
                    <tr>
                        <th>指定范围</th>
                        <td>
                            <el-selectorg ref="selectOrgRef" v-model="setJson.range" style="width:100%" clearable />
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
    const ElSelectorg = inject('ElSelectorg');//组织架构选择控件
    const ElCodemirror = inject('ElCodemirror');
    const selectOrgRef = ref(null);
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
        //初始化选择范围组织架构控件标题
        selectOrgRef.value.initTitle(setJson.value.range);
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