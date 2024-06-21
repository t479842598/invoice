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
                        <th>选项来源</th>
                        <td>
                            <el-radio-group v-model="setJson.dataSource" style="vertical-align:middle">
                                <el-radio v-for="opt in dataSourceOptions" :key="opt.value" :label="opt.value">{{opt.label}}</el-radio>
                            </el-radio-group>
                            <span v-show="setJson.dataSource=='sql'" style="margin-left:12px">
                                数据连接
                                <el-select v-model="setJson.dataSourceSqlConn" placeholder="选择执行SQL的数据连接" clearable style="width:120px;margin-left:12px;vertical-align:middle">
                                    <el-option v-for="(conn,index) in connOptions" :key="'conn_'+index" :value="conn.id" :label="conn.title"></el-option>
                                </el-select>
                            </span>
                            <span style="margin-left:12px">
                                宽度<el-input v-model="setJson.width" placeholder="px或%" style="width:80px;margin-left:12px;" clearable></el-input>
                            </span>
                            <span style="margin-left:12px">
                                背景文字<el-input v-model="setJson.placeholder" placeholder="" style="width:88px;margin-left:12px" clearable></el-input>
                            </span>
                            <el-checkbox v-model="setJson.search" label="搜索" style="margin:0 12px;"></el-checkbox>
                            <el-checkbox v-model="setJson.allowClear" label="清空" style="margin-right:12px;"></el-checkbox>
                            <el-checkbox v-model="setJson.multiple" label="多选" style="margin-right:12px;"></el-checkbox>
                        </td>
                    </tr>
                    <tr v-show="setJson.dataSource=='dict'">
                        <th>字典项</th>
                        <td>
                            <el-selectdict v-model="setJson.dataSourceDict" ref="dataSourceDictRef" style="width:400px;margin-right:12px;" clearable></el-selectdict>
                            值字段
                            <el-select v-model="setJson.dataSourceDictValueField" style="width:127px;margin-left:12px" clearable>
                                <el-option v-for="opt in dictValueFieldOptions" :key="opt.value" :value="opt.value" :label="opt.label"></el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr v-show="setJson.dataSource=='string'">
                        <th>字符串</th>
                        <td>
                            <el-input type="textarea" :rows="3" v-model="setJson.dataSourceString" clearable placeholder="格式：选项1值,选项1标题;选项2值,选项2标题...（字符串不能有单引号)"></el-input>
                        </td>
                    </tr>
                    <tr v-show="setJson.dataSource=='sql'">
                        <th>SQL</th>
                        <td>
                            <el-input type="textarea" :rows="3" v-model="setJson.dataSourceSql" clearable placeholder="查询返回两个字段，选项值和选项标题。如果只返回一个字段，则选项值和选项标题一样。"></el-input>
                        </td>
                    </tr>
                    <tr v-show="setJson.dataSource=='url'">
                        <th>URL</th>
                        <td>
                            <el-input type="textarea" :rows="3" v-model="setJson.dataSourceUrl" clearable placeholder="post一个url地址，地址返回[{value:'值',label:'标题'},...]格式json字符串。"></el-input>
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
    import { ref, inject, onMounted, watch } from 'vue';
    const utils = inject('utils');
    const ElSelectdict = inject('ElSelectdict');//数据字典选择控件
    const ElCodemirror = inject('ElCodemirror');
    const setEditRecord = inject('setEditRecord');
    const dataSourceDictRef = ref(null);
    const setJson = ref({});
    const defaultValueOptions = designjs.defaultValueOptions();
    const eventName = ref('');
    const attrTitle = ref('属性');//属性标签标题
    const dataSourceOptions = designjs.dataSourceOptions();//选项来源选项
    const dictValueFieldOptions = designjs.dictValueFieldOptions();//数据字典值字段选项
    const connOptions = ref([]);//数据连接选项

    //如果数据源选择SQL，则加载数据连接选项。
    watch(() => setJson.value.dataSource, (val) => {
        if (val == 'sql') {
            utils.getConns().then((conns) => {
                connOptions.value = conns;
            });
        }
    });

    onMounted(() => {
        setJson.value = setEditRecord.value.set;
        if (utils.length(setJson.value.events) > 0) {
            eventName.value = setJson.value.events[0].name;
        }
        if (utils.length(setEditRecord.value.title) > 0) {
            attrTitle.value = setEditRecord.value.title;
        }
        dataSourceDictRef.value.initTitle(setJson.value.dataSourceDict);
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