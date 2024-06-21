<template>
    <div>
        <el-form ref="formbutton" inline>
            <el-form-item style="margin-right: 15px;">
                <!-- <el-button type="primary" icon="DocumentCopy" @click="ticketstart">开票</el-button> -->
                <el-button icon="Select" type="primary" @click="Save">保存</el-button>
            </el-form-item>
            <el-form-item>
                <el-upload ref="upload" :limit="1" style="margin-right: 15px;margin-bottom: 2px;" :on-change="changeFn"
                    :on-exceed="handleExceed" accept=".xlsx,.xls" :auto-upload="false" :before-upload="beforeAvatarUpload"
                    :show-file-list="false">
                    <template #trigger>
                        <el-button icon="Upload" type="warning">导入Excel</el-button>
                    </template>
                </el-upload>
                <!-- <el-button icon="Close" type="success" @click="closed">关闭</el-button> -->
                <!-- <el-button type="primary" link @click="Download()">下载导入模板</el-button> -->
            </el-form-item>
            <el-form-item label="开票单位" prop="sobItemsName">
                <!-- <el-select v-model="sobItems" placeholder="请选择开票单位" style="width: 260px;">
                        <el-option v-for="item in checkList" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select> -->
                {{ sobInfo.accountname }}
            </el-form-item>
            <el-form-item label="税号" prop="sobTaxno">
                <!-- <el-select v-model="sobItems" placeholder="请选择开票单位" style="width: 260px;">
                        <el-option v-for="item in checkList" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select> -->
                {{ sobInfo.taxno }}
            </el-form-item>
        </el-form>
        <div class="table-container">
            <el-table :data="tableData" v-loading="loading" :summary-method="getSummaries" show-summary
                :stripe="pager.tableStripe" border :highlight-current-row="pager.tableHighlightCurrentRow" max-height="600"
                style="width:100%; color: #000;" :header-cell-style="headerCellStyle"
                @selection-change="handleSelectionChange" v-bind="$attrs" :default-sort="defaultOrder">
                <el-table-column prop="id" v-if="false" width="1" />
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column prop="salebillid" v-if="false" width="1" />
                <el-table-column v-for="(column, index) in maincolumns" :key="index" :prop="column.prop"
                    :label="column.label" :align="column.align" :width="column.width">
                </el-table-column>
            </el-table>
        </div>
        <!-- 完成进度条 -->
        <el-dialog v-model="finishprogress" top="5vh" title="完成进度" align-center @closed="taskclose" destroy-on-close
            width="600px" draggable :close-on-click-modal="false">
            <el-form style="width: 100%;">
                <div style="margin:auto;width: 80%;">
                    <el-progress :text-inside="true" :stroke-width="18" :color="customColorMethod" :percentage="percentage"
                        striped striped-flow>
                        <span>正在开票中</span>
                        <span>{{ percentage }}%</span>
                    </el-progress>
                    <div style="margin-top: 10px;margin: 10px auto;display: flex;justify-content: space-around;">
                        <div class="successfa">
                            <el-statistic :value="successCount">
                                <template #title>
                                    <div style="display: inline-flex; align-items: center;font-size: 14px;">
                                        已开票
                                    </div>
                                </template>
                                <template #suffix>/{{ selectrow.length }}张</template>
                            </el-statistic>
                        </div>
                        <div class="errorfa">
                            <el-statistic :value="errorcount">
                                <template #title>
                                    <div style="display: inline-flex; align-items: center;font-size: 14px;">
                                        开票失败
                                    </div>
                                </template>
                                <template #suffix>张</template>
                            </el-statistic>
                        </div>
                    </div>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, shallowRef, provide, reactive, nextTick, watch, defineAsyncComponent, computed } from 'vue'
import { Select, DocumentCopy, Upload } from '@element-plus/icons-vue'
import { excelExportUseJson, excelImport } from "../../../roadui-assets/excel";
import { debounce } from 'lodash';
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
const qs = inject('qs');
const index_openmenu = inject('index_openmenu');//首页打开菜单
const index_removetab = inject('index_removetab');//首页关闭标签方法
const index_refreshtab = inject('index_refreshtab');//首页刷新标签方式
const index_userinfo = inject('index_userinfo');//首页用户信息
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const defaultOrder = ref({ prop: 'goodsLineNo', order: 'ascending' });
const pager = ref(utils.getPager(defaultOrder.value));
const Importshow = inject('importshow');
const loading = ref(false);
const finishprogress = ref(false);//完成进度
const sobItems = ref();//开票单位
const checkList = ref([])//单位选择
// 选中行
const selectrow = ref<any>([]);
onMounted(async () => {
    // 获取开票单位信息
    await getsobItems();
})
const maincolumns = ref([
    { prop: 'serialNo', label: '开票流水号', align: 'center', width: '200' },
    { prop: 'buyerName', label: '客户名称', align: 'center', width: '250' },
    { prop: 'buyerTaxNo', label: '税号', align: 'center', width: '200' },
    { prop: 'invoiceTotalPriceTax', label: '含税总金额', align: 'right', width: '100' },
    { prop: 'invoiceTotalPrice', label: '无税总金额', align: 'right', width: '100' },
    { prop: 'invoiceTotalTax', label: '税额', align: 'center', width: '110' },
    { prop: 'remarks', label: '备注', align: 'center', width: '110' },
    { prop: 'goodsCode', label: '税收分类编码', show: true, align: 'center', width: '200', },
    { prop: 'goodsName', label: '商品名称', show: true, align: 'center', width: '160', },
    { prop: 'goodsSpecification', label: '规格型号', show: true, align: 'center', width: '180', },
    { prop: 'goodsUnit', label: '单位', show: true, align: 'center', width: '100', },
    { prop: 'goodsQuantity', label: '数量', show: true, align: 'center', width: '120', },
    { prop: 'goodsPrice', label: '单价', show: true, align: 'center', width: '120', },
    { prop: 'goodsTotalPrice', label: '价税合计', show: true, align: 'right', width: '120', },
    { prop: 'notaxamount', label: '无税金额', show: true, align: 'right', width: '120', },
    { prop: 'goodsTaxRate', label: '税率(%)', show: true, align: 'center', width: '150', },
    { prop: 'goodsTotalTax', label: '税额', show: true, align: 'center', },
])
// 主表数据
const tableData = ref<any>([]);

// 关闭
const closed = () => {
    Importshow.value = false;
}
const dataprovide = ref({ Id: '', invoicedepartname: '', taxno: '' })
// 选中行
const successCount = ref<number>(0);//开票成功数量
const percentage = ref<number>(0);//进度条百分比
const errorcount = ref<number>(0);//开票失败数量
// 开票
const ticketstart = async () => {
    if (selectrow.value == '') {
        utils.msg('请选择要开票的数据', 'warning', false);
        return;
    }
    finishprogress.value = true;
    dataprovide.value.invoicedepartname = sobInfo.value.accountname;
    dataprovide.value.taxno = sobInfo.value.taxno;
    for (let i = 0; i < selectrow.value.length; i++) {
        dataprovide.value.Id = selectrow.value[i];
        try {
            ajax.post('Invoice/SaveExcel?srcorgid=' + sobInfo.value.id, qs.stringify({ excelJSON: JSON.stringify(tableData.value) })).then((res) => {
                if (res.success) {
                    // utils.msg(res.msg, true);
                    openticket();

                } else {
                    utils.msg(res.msg, false);
                }
            });
        } catch (error) {
            utils.msg('开票失败', 'error', false);
            errorcount.value++;
        }
    }
}
// 多选
const handleSelectionChange = (val) => {
    // 把每一行的id放到数组里面,有重复的只留一个
    selectrow.value = Array.from(new Set(val.map(item => item.id)));
}
// 监听进度
// 监听开票成功数量，计算进度条百分比，当百分比为100时，延迟800ms关闭进度条弹窗
watch(successCount, (val) => {
    percentage.value = Math.floor((successCount.value + errorcount.value) / Number(selectrow.value.length) * 100);
    if (successCount.value > 0) {
    }
    if (percentage.value === 100) {
        // 延迟800ms
        setTimeout(() => {
            finishprogress.value = false;
        }, 800);
    }
})
// 开票
const openticket = async () => {
    const res = await ajax.post('/Invoice/OpenInvoice?srcorgid=' + sobInfo.value.id, qs.stringify(dataprovide.value));
    if (res.code == 0) {
        successCount.value++;
        utils.notify('第' + successCount.value + '张', res.msg, 'success');
        if (successCount.value + errorcount.value == selectrow.value.length) {
            index_removetab();
            index_openmenu({
                appIco: "",
                children: [],
                closable: true,
                componentId: "492732716728389",
                height: 0,
                ico: "Tickets",
                icoColor: "",
                id: "492732716728389",
                openMode: 0,
                parentId: "485253976780869",
                scopedSlots: { icon: 'custom' },
                title: "已开票查询",
                title_en: "Menus",
                title_tw: "菜單",
                url: "/Invoice/Completedlist",
                width: 0,
            });
        }

    } else {
        errorcount.value++;
        utils.notify('', res.msg, 'error');
    }
}
// 导入配置
// 购置设备明细导入
const upload = ref();
const handleExceed = (files) => {
    upload.value!.clearFiles()
    const file = files[0]
    upload.value!.handleStart(file);
}
const changeFn = (file) => {
    excelImport(file.raw as File).then((arr) => {
        tableData.value.length = 0
        arr.forEach((item) => {
            tableData.value.push({
                serialNo: item["开票流水号"],
                buyerName: item["客户名称"],
                buyerTaxNo: item["税号"],
                invoiceTotalPriceTax: item["含税总金额"],
                invoiceTotalPrice: item["无税总金额"],
                invoiceTotalTax: item["税额"],
                remarks: item["备注"],
                goodsCode: item["税收分类编码"],
                goodsName: item["商品名称"],
                goodsSpecification: item["规格型号"],
                goodsUnit: item["单位"],
                goodsQuantity: item["数量"],
                goodsPrice: item["单价"],
                goodsTotalPrice: item["价税合计"],
                notaxamount: item["无税金额"],
                goodsTaxRate: item["税率(%)"],
                goodsTotalTax: item["税额"],
            });
        })
    })
}
//导入上传前检查文件格式。
function beforeAvatarUpload(rawFile) {
    if (rawFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        && rawFile.type !== 'application/vnd.ms-excel') {
        utils.msg('要导入的文件必须是excel格式文件!', false);
        return false;
    }
    return true;
}
// 保存
function Save() {
    debounce(() => {
        if (tableData.value.length == 0) {
            utils.msg('请先导入数据!', false);
            return;
        }
        ajax.post('/Invoice/SaveExcel?srcorgid=' + sobInfo.value.id, qs.stringify({ excelJSON: JSON.stringify(tableData.value) })).then((res) => {
            if (res.success) {
                utils.msg(res.msg, true);
                index_removetab();
                index_openmenu({
                    id: "492732745289797",
                    title: "开票任务列表",
                    closable: true,
                    componentId: "492732745289797",
                    height: 0,
                    ico: "Tickets",
                    icoColor: "",
                    openMode: 0,
                    parentId: "485253976780869",
                    scopedSlots: { icon: 'custom' },
                    title_en: "Menus",
                    title_tw: "菜單",
                    url: "/Invoice/tasklist",
                    width: 0,
                });
            } else {
                utils.msg(res.msg, false);
            }
        });
    }, 300)();
}
// 下载导入模板
const Download = () => {
    utils.showFileName(index_openmenu, { name: '批量导入模板' }, config.SERVER_WEBADDRESS);
}
// 获取开票单位信息
// 开票单位
const getsobItems = async () => {
    try {
        const res = await ajax.post('user/GetUserInvoiceDepartByUser', qs.stringify({ userid: index_userinfo.value.userId }));
        if (res.success) {
            checkList.value = res.data;
            sobItems.value = res.data[0].id;
        }
    } catch (error) {
        // 这里可以添加你的错误处理逻辑
    }
}
// 合计
const getSummaries = (param) => {
    const { columns, data } = param
    const sums = []
    const columnsToShowSum = ['goodsTotalPrice', 'goodsTotalTax', 'notaxamount']

    columns.forEach((column, index) => {
        if (index === 0) {
            sums[index] = '合计'
            return
        }
        if (columnsToShowSum.includes(column.property)) {
            const values = data.map((item) => Number(item[column.property]))
            if (!values.every((value) => Number.isNaN(value))) {
                sums[index] = ` ${values.reduce((prev, curr) => {
                    const value = Number(curr)
                    if (!Number.isNaN(value)) {
                        return prev + curr
                    } else {
                        return prev
                    }
                }, 0)}`
            } else {
                sums[index] = ''
            }
        } else {
            sums[index] = ''
        }
    })
    return sums
}


// 表头单元格样式
function headerCellStyle({ row, column, rowIndex, columnIndex }) {
    return {
        color: '#000',
        textAlign: 'center',
    }
}
</script>

<style lang="scss" scoped></style>