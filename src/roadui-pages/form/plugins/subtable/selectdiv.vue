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
                        <th>弹出页面</th>
                        <td>
                            <el-cascader v-model="setJson.applibraryTypeId" placeholder="请选择应用分类" :options="apptypeOptions" @change="typeSelect" :props="{expandTrigger:'hover',checkStrictly:false}" clearable style="width:260px;margin-right:18px"></el-cascader>
                            <el-select v-model="setJson.applibraryId" @change="appSelect" style="width:323px;" clearable>
                                <el-option v-for="type in appOptions" :key="type.id" :value="type.id" :label="type.label">
                                    <span>{{type.label+(utils.length(type.note)>0?' - '+type.note:'')}}</span>
                                </el-option>
                            </el-select>
                            <span style="margin-left:12px;">
                                <span>窗口标题</span>
                                <span style="margin-left:10px;"><el-input v-model="setJson.modalTitle" style="width:130px;" clearable></el-input></span>
                            </span>
                            <span style="margin-left:12px;">
                                <span>背景文字</span>
                                <span style="margin-left:10px;"><el-input v-model="setJson.placeholder" placeholder="placeholder" style="width:121px;" clearable></el-input></span>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th>值字段</th>
                        <td>
                            <el-select v-model="setJson.valueField" style="width:260px;" clearable>
                                <el-option v-for="op in valueFields" :key="op.value" :value="op.value" :label="op.title"></el-option>
                            </el-select>
                            <span style="margin-left:12px;">
                                标题字段<el-select v-model="setJson.titleField" :options="titleFields" style="width: 257px; margin-left: 12px;" clearable>
                                    <el-option v-for="op in titleFields" :key="op.value" :value="op.value" :label="op.title"></el-option>
                                </el-select>
                            </span>
                            <span style="margin-left:12px;">
                                <span>控件宽度</span>
                                <span style="margin-left:10px;"><el-input v-model="setJson.width" placeholder="px或%" style="width:130px;" allow-clear></el-input></span>
                            </span>
                            <span style="margin-left:12px;">
                                <span>窗口宽度</span>
                                <span style="margin-left:10px;"><el-input-number v-model="setJson.modalWidth" controls-position="right" style="width:121px;"></el-input-number></span>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th>值分隔符</th>
                        <td>
                            <el-input v-model="setJson.valueSeparator" placeholder="多选时多个值之间的分隔符" style="width:260px;" clearable></el-input>
                            <span style="margin-left:12px;">
                                标题分隔符<el-input v-model="setJson.titleSeparator" placeholder="多选时多个标题之间的分隔符" style="width: 243px; margin-left: 12px;" clearable></el-input>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th>参数</th>
                        <td>
                            <el-input v-model="setJson.params" style="width:601px;" allow-clear placeholder="js表达式，例'size=5&test='+this.formData['id']"></el-input>
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
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const ElCodemirror = inject('ElCodemirror');

    const setEditRecord = inject('setEditRecord');
    const setJson = ref({});
    const defaultValueOptions = designjs.defaultValueOptions();
    const eventName = ref('');
    const attrTitle = ref('属性');//属性标签标题
    const apptypeOptions = ref([]);//应用类型选项
    const appOptions = ref([]);//应用选项
    const valueFields = ref([]);//值字段选项
    const titleFields = ref([]);//标题字段选项

    onMounted(() => {
        setJson.value = setEditRecord.value.set;
        if (utils.length(setEditRecord.value.title) > 0) {
            attrTitle.value = setEditRecord.value.title;
        }
        loadOptions();
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
    //载入分类
    const loadOptions = () => {
        if (utils.length(apptypeOptions.value) > 0) {
            init();
            return;//如果已加载，则不加载。
        }
        const params = [{ id: 'system_applibrary_type', key: 'type', children: true, valueField: 'id' }];
        ajax.post('/Dictionary/GetMultipleOptions', qs.stringify({ json: JSON.stringify(params) })).then((res) => {
            apptypeOptions.value = res.data['type'];
            init();
        }).catch(() => { });
    };
    //类型选择时载入类型下的应用
    const typeSelect = (val) => {
        if (utils.length(val) > 0) {
            ajax.post('/Applibrary/GetOptions?typeid=' + val[val.length - 1]).then((res) => {
                appOptions.value = res.data;
            }).catch(() => { });
        } else {
            setJson.value.applibraryId = '';
            appOptions.value = [];
        }
    };
    //选择应用后加载应用对应的字段
    const appSelect = (val) => {
        //设置应用地址
        const appObj = utils.getArrayObj(appOptions.value, val, 'id');
        if (utils.isDef(appObj)) {
            setJson.value['applibraryAddress'] = appObj.address;
        }
        ajax.post('/Program/GetFieldOptionsByApplibraryId?applibraryid=' + val).then((res) => {
            valueFields.value = res.data;
            titleFields.value = res.data;
        }).catch(() => { });
    };
    //初始化弹出页面值
    const init = () => {
        //加载应用分类下的应用
        if (setJson.value.applibraryTypeId.length > 0) {
            typeSelect(setJson.value.applibraryTypeId);
        }
        //加载应用对应的字段
        if (utils.length(setJson.value.applibraryId) > 0) {
            appSelect(setJson.value.applibraryId);
        }
    };
</script>