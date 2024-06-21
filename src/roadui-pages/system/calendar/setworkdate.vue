<template>
    <div class="roadui_page">
        <div style="margin-bottom:20px">
            年份：<el-select @change="yearChange" v-model="year" style="margin-right:10px;width:120px">
                <el-option v-for="item in yearOptions"
                           :key="item.value"
                           :label="item.title"
                           :value="item.value" />
            </el-select>
            <span>共有工作日{{workDayCount}}天</span>
            <el-button @click="save()" type="primary" style="margin:0 10px" :disabled="buttionDisabled">保存设置</el-button>
            <span class="roadui_note">提示：点击单元格背景即设置为节假日</span>
        </div>
        <el-space wrap :size="40">
            <div v-for="(m,index) in monthDays" :key="'month_'+index">
                <div style="font-weight:bold;margin-bottom:8px;">{{m.month}}月</div>
                <table cellpadding="0" cellspacing="0" border="0" class="roadui_workdatetable">
                    <tr>
                        <td>一</td>
                        <td>二</td>
                        <td>三</td>
                        <td>四</td>
                        <td>五</td>
                        <td>六</td>
                        <td>日</td>
                    </tr>
                    <tr v-for="(d,index1) in m.days" :key="'day_'+index+index1">
                        <td v-for="(d1,index2) in d.days"
                            :key="'day1_'+index+index1+index2"
                            @click="setWork(d1)"
                            :class="utils.hasKey(d1,'iswork')&&d1.iswork==0?'roadui_workdatework':''">
                            {{d1.day}}
                        </td>
                    </tr>
                </table>
            </div>
        </el-space>
    </div>
</template>

<script setup>
    import { ref, onMounted, inject } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');

    const yearOptions = ref([]);
    const year = ref(new Date().getFullYear());
    const monthDays = ref([]);
    const buttionDisabled = ref(false);
    const workDayCount = ref(0);

    onMounted(() => {
        loadYearOptions();
    });
    //载入年份选项
    const loadYearOptions = () => {
        buttionDisabled.value = true;
        ajax.post('/Calendar/GetWorkDateYearOptions').then((res) => {
            yearOptions.value = res.data;
            buttionDisabled.value = false;
            loadYearDays();
        }).catch(() => { buttionDisabled.value = false; });
    };
    //载入年份对应的工作日设置
    const loadYearDays = () => {
        buttionDisabled.value = true;
        ajax.post('/Calendar/GetWorkDateDays?year=' + year.value).then((res) => {
            monthDays.value = res.data.days;
            workDayCount.value = res.data.workdaycount;
            buttionDisabled.value = false;
        }).catch(() => { buttionDisabled.value = false; });
    };
    //年改变时重新载入年工作日设置
    const yearChange = () => {
        loadYearDays();
    };
    //点击设置非工作日
    const setWork = (d) => {
        if (utils.length(d.day) <= 0) {
            return;
        }
        if (d.iswork == 0) {
            d.iswork = 1;
        } else {
            d.iswork = 0;
        }
    };
    //保存
    const save = () => {
        let days = [];
        for (let i = 0; i < monthDays.value.length; i++) {
            let m = monthDays.value[i].month;
            for (let j = 0; j < monthDays.value[i].days.length; j++) {
                for (let k = 0; k < monthDays.value[i].days[j].days.length; k++) {
                    let d = monthDays.value[i].days[j].days[k].day;
                    if (utils.length(d) <= 0) {
                        continue;
                    }
                    let iswork = monthDays.value[i].days[j].days[k].iswork;
                    days.push({
                        day: year.value + '-' + (utils.length(m) < 2 ? '0' + m : m) + '-' + (utils.length(d) < 2 ? '0' + d : d), iswork: iswork
                    });
                }
            }
        }
        buttionDisabled.value = true;
        ajax.post('/Calendar/SaveWorkDate', qs.stringify({ year: year.value, days: JSON.stringify(days) })).then((res) => {
            utils.msg(res.success ? '保存成功！' : '保存失败！', res.success);
            loadYearDays();
            buttionDisabled.value = false;
        }).catch(() => { buttionDisabled.value = false; });
    };
</script>