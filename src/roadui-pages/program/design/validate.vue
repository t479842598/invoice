<template>
    <div>
        <div style="margin-bottom:15px">
            将字段状态设置为
            <el-select v-model="allStatus" style="width: 120px; margin: 0 12px; vertical-align: middle;" @change="setStatus">
                <el-option v-for="op in statusOptions" :key="op.value" :value="op.value" :label="op.label"></el-option>
            </el-select>
            将字段检查设置为
            <el-select v-model="allCheck" style="width:120px;margin:0 12px;vertical-align:middle;" @change="setCheck">
                <el-option v-for="op in checkOptions" :key="op.value" :value="op.value" :label="op.label"></el-option>
            </el-select>
            <el-button type="primary" :disabled="butDisabled" @click="save()">保存设置</el-button>
        </div>
        <el-table :data="tableData"
                  v-loading="loading"
                  :stripe="pager.tableStripe"
                  :border="pager.tableBorder"
                  style="width:100%"
                  :highlight-current-row="pager.tableHighlightCurrentRow">
            <el-table-column prop="table" label="表名" />
            <el-table-column prop="field" label="字段名" />
            <el-table-column prop="fieldNote" label="字段说明" />
            <el-table-column prop="status" label="字段状态" width="120">
                <template #default="scope">
                    <el-select v-model="scope.row.status">
                        <el-option v-for="op in statusOptions" :key="op.value" :value="op.value" :label="op.label"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column prop="check" label="验证类型" width="120">
                <template #default="scope">
                    <el-select v-model="scope.row.check">
                        <el-option v-for="op in checkOptions" :key="op.value" :value="op.value" :label="op.label"></el-option>
                    </el-select>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const program_attr_formid = inject('program_attr_formid');

    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const programId = utils.query('programid', props.query);
    const butDisabled = ref(false);
    const loading = ref(false);
    const tableData = ref([]);
    const defaultOrder = ref({});
    const pager = ref(utils.getPager(defaultOrder.value));
    //字段状态选项
    const statusOptions = ref([{ value: 0, label: '编辑' }, { value: 1, label: '只读' }, { value: 2, label: '隐藏' }]);
    //字段检查选项
    const checkOptions = ref([{ value: 0, label: '不检查' }, { value: 2, label: '检查' }]);
    const allStatus = ref(null);
    const allCheck = ref(null);

    onMounted(() => {
        loadData();
    });

    //加载应用对应的编辑表单对应的字段状态
    const loadData = () => {
        loading.value = true;
        butDisabled.value = true;
        ajax.post('/Program/Get?programid=' + programId).then((res) => {
            const fieldStatus = JSON.parse(res.data.fieldValidate || '{}') || {};
            utils.getFromFields('', '', program_attr_formid.value, programId).then((tables) => {
                for (let i = 0; i < tables.length; i++) {
                    for (let j = 0; j < tables[i].fields.length; j++) {
                        if (tables[i].type == 'main') {
                            let mainid = tables[i].fields[j].id;
                            let status = 1, check = 0;
                            if (utils.isDef(fieldStatus[mainid])) {
                                status = fieldStatus[mainid].status;
                                check = fieldStatus[mainid].check;
                            }
                            tableData.value.push({
                                id: tables[i].fields[j].id,
                                table: tables[i].fields[j].tableName || tables[i].label,
                                field: tables[i].fields[j].id,
                                fieldNote: tables[i].fields[j].label,
                                status: status,
                                check: check
                            });
                        } else if (tables[i].type == 'subtable') {
                            let subid = tables[i].id + "." + tables[i].fields[j].id;
                            let status = 1, check = 0;
                            if (utils.isDef(fieldStatus[subid])) {
                                status = fieldStatus[subid].status;
                                check = fieldStatus[subid].check;
                            }
                            tableData.value.push({
                                id: subid,
                                table: tables[i].fields[j].tableName || (tables[i].tableName || tables[i].label),
                                field: tables[i].fields[j].id,
                                fieldNote: tables[i].fields[j].label,
                                status: status,
                                check: check
                            });
                        }
                    }
                }
                loading.value = false;
                butDisabled.value = false;
            });
        }).catch(() => { loading.value = false; butDisabled.value = false; });
    };
    const setStatus = (v) => {
        for (let i = 0; i < tableData.value.length; i++) {
            tableData.value[i].status = v;
        }
    };
    const setCheck = (v) => {
        for (let i = 0; i < tableData.value.length; i++) {
            tableData.value[i].check = v;
        }
    };
    const save = () => {
        let fieldStatus = {};
        for (let i = 0; i < tableData.value.length; i++) {
            fieldStatus[tableData.value[i].id] = {};
            fieldStatus[tableData.value[i].id]['status'] = tableData.value[i].status;
            fieldStatus[tableData.value[i].id]['check'] = tableData.value[i].check;
        }
        butDisabled.value = true;
        ajax.post('/Program/SaveValidate?programid=' + programId, qs.stringify({ fieldValidate: JSON.stringify(fieldStatus) })).then((res) => {
            utils.msg(res.success ? '保存成功！' : res.code == 1 ? '未找到应用程序设计！' : '保存失败！', res.success);
            butDisabled.value = false;
        }).catch(() => { butDisabled.value = false; });
    };
</script>