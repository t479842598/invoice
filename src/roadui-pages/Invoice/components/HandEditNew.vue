<style scoped>
@import '../../../roadui-assets/required.css';
@import '../../main/Customsubmit.css';

.vertical-text {
    writing-mode: vertical-rl;
    letter-spacing: 10px;
    padding-top: 10px;
}

:deep(.el-table__border-left-patch) {
    background-color: #99938f;
    width: 0.5px;
}

:deep(.el-table--border::after) {
    background-color: #99938f;
    /* width: 0.5px; */
}

:deep(.el-table__inner-wrapper::before) {
    background-color: #99938f;
    height: 0.5px;
}

:deep(.el-table) {
    border-color: #99938f !important;
}

:deep(.el-form-item__label) {
    color: #6f4946
}

:deep(.AddZK .el-form-item__label) {
    color: #191919 !important;
}

:deep(.AddZK .el-radio__label) {
    color: #191919 !important;
}

:deep(.AddZK .el-form-item) {
    margin-bottom: 25px !important;
}

:deep(.AddZK) {
    padding: 0 15px;
}

:deep(.AddZK .el-input-number .el-input__inner) {
    text-align: left;
}

:deep(.remarkTable) td {
    padding: 0 !important;
}

:deep(.remarkTable .el-textarea__inner) {
    height: 115px !important;
    border-radius: 0 !important;
    width: 100%;
}

:deep(.eltable .el-scrollbar__wrap, .el-scrollbar__wrap--hidden-default) {
    min-height: 300px !important;
}

:deep(.maintable .el-form-item .el-form-item__label) {
    display: block !important;
    text-align: justify !important;
    text-align-last: justify !important;
}

:deep(.maintable .selectBtn) {
    border-radius: 0 !important;
}

:deep(.maintable .el-form-item__content .el-input .el-input__wrapper) {
    border-radius: 0 !important;
}

:deep(.remarkTable .el-form-item__content .el-input .el-input__wrapper) {
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 0 !important;
}

:deep(.remarkTable .el-form-item__content .el-input, .el-input__inner) {
    border: 0 !important;
    max-width: 60% !important;
}

:deep(.remarkTable .el-form-item) {
    width: 100% !important;
}

:deep(.remarkTable .el-form-item:first-child) {
    margin: 0 !important;
}

:deep(.el-form-item) {
    margin-bottom: 10px !important;
}

:deep(.maintable .type div) {
    margin: 0 !important;
}

:deep(.maintable .show) {
    padding: 0 !important;
    overflow: hidden;
    margin-left: -5px;
}

:deep(.maintable .show .el-form-item__content) {
    margin: 0 !important;
}

:deep(.maintable .show .el-checkbox__label) {
    padding-left: 3px !important;
    font-size: 12px !important;
}

:deep(.amountshow span) {
    margin-left: 12px;
}

:deep(.el-input.is-disabled .el-input__inner) {
    background-color: #ffffff !important;
    color: #303133 !important;
    -webkit-text-fill-color: #000000 !important;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
    background-color: #ffffff !important;
    color: #303133 !important;
}

.black {
    color: #000 !important;
}


:deep(.colschange .el-form-item__content .black) {
    overflow: hidden;
    word-wrap: break-word !important;
    word-break: normal !important;
}

:deep(.el-affix--fixed) {
    background-color: #ffffff !important;
}


:deep(.cell) {
    padding: 5px 2px !important;
}

:deep(.el-table__cell) {
    padding: 0px 0 !important;
}

:deep(.el-dropdown .el-button) {
    padding: 0px 0px
}

:deep(.el-table__cell) {
    height: 45px !important;
}

:deep(.el-table__cell .el-input .el-input__wrapper) {
    border-radius: 0 !important;
    /* box-shadow: none !important; */
    padding: 0;
    padding-left: 2px;
    height: 35px;
}

:deep(.el-table__cell .el-input .el-input__wrapper .el-input__inner) {
    height: 35px;
}

:deep(.btn-footer .el-button) {
    border-radius: 3px;
}
</style>
<template>
    <div style="height: 86.7vh;overflow: hidden;overflow-y:scroll;" class="topdiv">
        <el-form inline style="display: flex;justify-content: space-between;">
            <!-- <el-affix target=".topdiv" :offset="105" style="width: 80vw;background-color: #fff !important;"> -->
            <el-form-item v-if="!isflow">
                <el-button type="primary" icon="Plus" @click="Select">增行</el-button>
                <el-button type="primary" @click="SelectZK">添加折扣行</el-button>
                <el-button type="danger" :disabled="!isSelect" @click="Deleteline">删除行</el-button>
                <el-upload ref="upload" :limit="1" style="margin-left: 15px;margin-bottom: 2px;" :on-change="changeFn"
                    :on-exceed="handleExceed" accept=".xlsx,.xls" :auto-upload="false" :before-upload="beforeAvatarUpload"
                    :show-file-list="false">
                    <template #trigger>
                        <el-button icon="Upload" type="warning">导入Excel数据</el-button>
                    </template>
                </el-upload>
                <el-button type="primary" link @click="Download()">下载导入模板</el-button>
            </el-form-item>
            <el-form-item v-if="!isflow" style="float: right;">
                <el-button type="primary" icon="DocumentAdd" @click="Save()">暂存</el-button>
                <el-button type="primary" icon="DocumentCopy" @click="ticketstart">立即开票</el-button>
                <el-button icon="Delete" type="danger" v-if="isnew == false" @click="DeleteAll">作废</el-button>
                <!-- <el-form-item> -->
            </el-form-item>
            <!-- </el-affix> -->
        </el-form>
        <table border="1" cellpadding="1" cellspacing="1"
            style="line-height: 50px;border-color: #99938f;border-width: 1px;color: #6f4946;width: 100%;margin-bottom: 0;"
            class="table maintable">
            <tbody>
                <tr>
                    <td class="type" colspan="4" height="50" style="padding-left: 5px;font-weight: bold;color: #6f4946;">
                        <el-form :model="formData" ref="ruleFormRef">
                            <el-form-item style="margin: auto;" label="发票类型:" prop="invoiceTypeCode">
                                <el-radio-group v-show="!readonly" v-model="formData.invoiceTypeCode">
                                    <el-radio v-for="item in ticketList" :label="item.id">{{ item.label }}</el-radio>
                                </el-radio-group>
                                <span v-show="readonly">{{ formData.invoiceTypeName }}</span>
                            </el-form-item>
                        </el-form>
                    </td>
                    <td colspan="4" height="50" class="type" style="padding-left: 5px;font-weight: bold;color: #6f4946;">
                        <el-form-item style="margin: auto;" label="开票流水号:">
                            <span>{{ formData.serialNo }}</span>
                        </el-form-item>
                    </td>
                </tr>
                <tr style="height: 100px !important;">
                    <!-- 左侧 -->
                    <td width="26" class="center vertical-text" style="font-weight: bolder;">购买方</td>
                    <td colspan="3" width="250" style="padding: 15px 10px 0px 10px;">
                        <el-form :model="formData" ref="ruleFormRef" label-width="100px">
                            <el-row :gutter="20">
                                <el-col :span="13.5" style="padding-right: 0;">
                                    <el-form-item label="名称" prop="buyerName">
                                        <el-autocomplete style="width: 250px;" trigger-on-focus="true"
                                            :fetch-suggestions="querySearch" v-model="formData.buyerName"
                                            @select="handleSelect" clearable @clear="blurForBug()">
                                        </el-autocomplete>
                                        <!-- <el-select v-model="formData.buyerName" filterable placeholder=""
                                            style="width: 300px" @change="handleSelect">
                                            <el-option v-for="item in options" :key="item.id" :label="item.value"
                                                :value="item.id" />
                                        </el-select> -->
                                        <el-button style="display: inline-block;" class="selectBtn" type="default"
                                            icon="Operation" @click="showmodel" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" style="line-height: 30px;">
                                    <div v-show="formData.buyerNaturalPerson == 'Y'"
                                        style="display: inline-block;width: 40px">
                                        (个人)
                                    </div>
                                </el-col>
                                <el-col :span="5" style="line-height: 30px;">
                                    <el-checkbox true-label="Y" false-label="N" v-model="formData.buyerNaturalPerson"
                                        label="是否开票给自然人" />
                                </el-col>
                            </el-row>
                            <el-form-item label="纳税人识别号" prop="buyerTaxNo">
                                <el-input v-show="!readonly" v-model="formData.buyerTaxNo"></el-input>
                                <span v-show="readonly">
                                    {{ formData.buyerTaxNo }}
                                </span>
                            </el-form-item>
                            <el-row :gutter="20">
                                <el-col :span="11">
                                    <el-form-item label="地址" prop="buyerAddress">
                                        <el-input v-show="!readonly" v-model="formData.buyerAddress"></el-input>
                                        <span v-show="readonly">
                                            {{ formData.buyerAddress }}
                                        </span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="电话" prop="buyerPhone">
                                        <el-input v-show="!readonly" v-model="formData.buyerPhone"></el-input>
                                        <span v-show="readonly">
                                            {{ formData.buyerPhone }}
                                        </span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" class="show">
                                    <el-form-item prop="show">
                                        <el-checkbox style="font-size: 12px;" @change="buyerAddshow()"
                                            v-model="formData.buyerAddshow" label="展示" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="11">
                                    <el-form-item label="开户银行" prop="buyerBankName">
                                        <el-input v-show="!readonly" v-model="formData.buyerBankName"></el-input>
                                        <span v-show="readonly">
                                            {{ formData.buyerBankName }}
                                        </span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="银行账号" prop="buyerBankNumber">
                                        <el-input v-show="!readonly" v-model="formData.buyerBankNumber"></el-input>
                                        <span v-show="readonly">
                                            {{ formData.buyerBankNumber }}
                                        </span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" class="show">
                                    <el-form-item prop="show">
                                        <el-checkbox style="font-size: 12px;" @change="buyershow()"
                                            v-model="formData.buyershow" label="展示" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </td>
                    <!-- 右侧 -->
                    <td width="26" class="center vertical-text" style="font-weight: bolder;">销售方</td>
                    <td colspan="3" width="250" style="padding: 15px 10px 0px 10px;">
                        <el-form :model="formData" ref="ruleFormRef" label-width="110px">
                            <el-form-item label="名称" prop="sellerid">
                                <span class="black">
                                    {{ formData.sellerName }}
                                </span>
                            </el-form-item>
                            <el-form-item label="纳税人识别号" prop="sellerTaxNo">
                                <span class="black">
                                    {{ formData.sellerTaxNo }}
                                </span>
                            </el-form-item>
                            <el-row :gutter="20">
                                <el-col :span="11">
                                    <el-form-item label="地址" prop="sellerAddress">
                                        <span class="black">
                                            {{ formData.sellerAddress }}
                                        </span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="电话" prop="sellerPhone">
                                        <span class="black">
                                            {{ formData.sellerPhone }}
                                        </span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" class="show">
                                    <el-form-item prop="sellershow">
                                        <el-checkbox style="font-size: 12px;" @change="sellerAddshow()"
                                            v-model="formData.sellerAddshow" label="展示" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="11">
                                    <el-form-item label="开户银行" prop="sellerBankName">
                                        <span class="black">
                                            {{ formData.sellerBankName }}
                                        </span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="银行账号" class="colschange" prop="sellerBankNumber">
                                        <span class="black">
                                            {{ formData.sellerBankNumber }}
                                        </span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" class="show">
                                    <el-form-item prop="sellershow">
                                        <el-checkbox style="font-size: 12px;" @change="sellershow()"
                                            v-model="formData.sellershow" label="展示" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </td>
                </tr>
            </tbody>
        </table>
        <div>
            <el-table class="eltable" :row-key="getRowKeys" ref="multipleTableRef" :data="detailData" height="370"
                v-loading="loading" :stripe="pager.tableStripe" :highlight-current-row="pager.tableHighlightCurrentRow"
                style="width: 100%; color: #000;" :header-cell-style="headerCellStyle" :default-sort="defaultOrder"
                @selection-change="handleSelectionChange" :row-style="changRed" @row-click="showUnitInput">
                <el-table-column type="selection" width="55" align="center" :reserve-selection="true" />
                <el-table-column label="" width="25">
                    <template #default="scope">
                        <el-dropdown placement="bottom-start" size="small" :hide-on-click='true'>
                            <el-button type="primary" size="small" icon="DCaret" />
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item icon="CaretTop"
                                        @click="up(scope.$index, scope.row)">上移</el-dropdown-item>
                                    <el-dropdown-item icon="CaretBottom" divided
                                        @click="down(scope.$index, scope.row)">下移</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </template>
                </el-table-column>
                <el-table-column prop="goodsLineNo" label="序号" width="55" align="center" />
                <template v-for="item in tableDetails">
                    <el-table-column v-if="item.show" fit show-overflow-tooltip :prop="item.prop" :min-width="item.width"
                        :label="item.label" :align="item.align" sortable>
                        <template v-slot="scope">
                            <el-tag type="danger" effect="dark"
                                v-if="scope.row.invoiceLineNature == '1' && item.useTag">折扣</el-tag>
                            <!-- <div style="color: red;" v-if="scope.row.invoiceLineNature === '1'"></div> -->
                            <el-input
                                v-if="item.useTemplate && !isflow && (scope.row.invoiceLineNature != '1' && scope.row.invoiceLineNature != '2')"
                                v-model="scope.row[item.prop]" @blur="blurValueInput(scope.row, scope.column)"
                                @keyup.enter="blurValueInput(scope.row, scope.column)"></el-input>
                            <span v-else-if="scope.row.invoiceLineNature == '1'" style="color: red;">{{
                                scope.row[item.prop] }}</span>
                            <span v-else>{{ scope.row[item.prop] }}</span>
                        </template>
                    </el-table-column>
                </template>

            </el-table>
        </div>
        <table border="1" cellpadding="1" cellspacing="1"
            style="line-height: 50px;border-color: #99938f;border-width: 1px;color: #6f4946;width: 100%;margin-bottom: 0;"
            class="table remarkTable">
            <tbody>
                <tr>
                    <td colspan="8" height="40" class="amountshow">
                        <div style="display: flex;justify-content: space-around;">
                            <span>价税合计:{{ formData.invoiceTotalPriceTax }}</span>
                            <span>无税金额:{{ formData.invoiceTotal }}</span>
                            <span>税额:{{ formData.invoiceTotalTax }}</span>
                        </div>
                    </td>
                </tr>
                <!-- 左侧 -->
                <tr style="height: 100px !important;">
                    <td width="26" class="center vertical-text" style="font-weight: bolder;">备注</td>
                    <td colspan="3" width="270" style="padding: 0;">
                        <el-form style="height: 100%;" :model="formData" ref="ruleFormRef">
                            <el-form-item style="margin: 0px 0px 0px !important;padding: 0 !important;" prop="remarks">
                                <el-input type="textarea" v-model="formData.remarks"></el-input>
                            </el-form-item>
                        </el-form>
                    </td>
                    <!-- 右侧 -->
                    <td width="26" class="center vertical-text" style="font-weight: bolder;">交付到</td>
                    <td colspan="3" width="250" style="padding: 15px 10px 0px 10px !important;">
                        <el-form :model="formData" :rules="rules" ref="ruleFormRef">
                            <el-form-item label="手机号码:" prop="phone">
                                <el-input v-show="!readonly" placeholder="请输入手机号码" v-model="formData.phone"></el-input>
                                <span v-show="readonly">
                                    {{ formData.phone }}
                                </span>
                            </el-form-item>
                            <el-form-item label="邮箱地址:" prop="buyerEmail">
                                <el-input v-show="!readonly" placeholder="请输入邮箱地址" v-model="formData.buyerEmail"></el-input>
                                <span v-show="readonly">
                                    {{ formData.buyerEmail }}
                                </span>
                            </el-form-item>
                        </el-form>
                    </td>
                </tr>
            </tbody>
        </table>

        <el-dialog title="选择购买方" style="min-height: 637px;" v-model="Modelvisible" align-center @open="open" @close="closed"
            destroy-on-close width="1200px" draggable :close-on-click-modal="false">
            <el-form :inline="true" :model="selectName" class="inline">
                <el-form-item>
                    <el-input placeholder="请输入购买方名称" style="min-width: 300px;" v-model="selectName.customername" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadAll">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table class="eltable" :data="SelectTable" :stripe="pagers.tableStripe" border
                :highlight-current-row="pagers.tableHighlightCurrentRow" max-height="460" style="color: #000;"
                :header-cell-style="headerCellStyle" :default-sort="defaultOrder" @selection-change="handleSelectionChange">
                <template v-for="item in SelectTableColumn">
                    <el-table-column v-if="item.show" :prop="item.prop" :fixed="item.fixed" :label="item.label"
                        :align="item.align" :width="item.width">
                        <template v-if="item.useTemplate" #default="scope">
                            <el-button type="primary" size="small" @click="openSelect(scope.row)">选择</el-button>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
            <div class="roadui_pagerdiv">
                <el-pagination v-model:currentPage="pagers.number" v-model:page-size="pagers.size"
                    :page-sizes="pagers.sizes" :background="pagers.background" :layout="pagers.layout" :total="pagers.total"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </el-dialog>
        <el-dialog title="选择产品" style="height: 637px;" v-model="Productvisible" align-center @open="Productopen"
            @close="Productclosed" destroy-on-close width="1200px" draggable :close-on-click-modal="false">
            <el-form :inline="true" :model="Productselect" class="inline">
                <el-form-item>
                    <el-input placeholder="请输入商品名称" v-model="Productselect.productname" style="width: 250px;" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="ProjectAll">查询</el-button>
                    <el-button type="primary" @click="ProductSelect">选择商品</el-button>
                </el-form-item>
            </el-form>
            <el-table class="eltable" :data="ProductTable" :stripe="Productpagers.tableStripe" border
                :highlight-current-row="Productpagers.tableHighlightCurrentRow" height="460" style="color: #000;"
                :header-cell-style="headerCellStyle" :default-sort="defaultOrder"
                @selection-change="ProductSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <template v-for="item in SelectProductColumn">
                    <el-table-column v-if="item.show" :prop="item.prop" :fixed="item.fixed" :label="item.label"
                        :align="item.align" :min-width="item.width">
                        <!-- <template v-if="item.useTemplate" #default="scope">
                            <el-button type="primary" size="small" @click="ProductSelect(scope.row)">选择</el-button>
                        </template> -->
                    </el-table-column>
                </template>
            </el-table>
            <div class="roadui_pagerdiv">
                <el-pagination v-model:currentPage="Productpagers.number" v-model:page-size="Productpagers.size"
                    :page-sizes="Productpagers.sizes" :background="Productpagers.background" :layout="Productpagers.layout"
                    :total="Productpagers.total" @size-change="ProductSizeChange" @current-change="ProductCurrentChange" />
            </div>
        </el-dialog>
        <el-dialog title="添加折扣" style="height: auto;" class="AddZK" v-model="AddZKshow" @close="ZKclosedDio" align-center
            destroy-on-close width="550px" :close-on-click-modal="false">
            <div style="width: auto;height: 80px;padding: 30px 30px 50px 20px;">
                <div style="background-color:#F9FAFD;width: 100%;height: 100%;padding: 20px 0 0 20px;">
                    <div style="font-weight: 400;font-size: 12px;">商品税额（含税）</div>
                    <div style="font-size: 35px;display: inline-block;margin-right: 5px;">{{ totalPriceTax }}</div><span
                        style="font-weight: 400;font-size: 12px;">共{{ totalcols }}行</span>
                </div>
            </div>
            <el-form ref="ZKFormRef" :rules="ZKrules" :model="formZK" label-position="top" label-width="80px">
                <el-form-item label="折扣方式">
                    <el-radio-group v-model="formZK.折扣方式">
                        <el-radio label="按金额折扣">按金额折扣</el-radio>
                        <el-radio label="按比例折扣">按比例折扣</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="折扣录入方式">
                    <el-radio-group v-model="formZK.折扣录入方式">
                        <el-radio label="批量折扣录入">批量折扣录入</el-radio>
                        <el-radio label="逐条折扣录入">逐条折扣录入</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="formZK.折扣录入方式 == '批量折扣录入'" prop="折扣比例" label="折扣比例(%）（含税）">
                    <el-input-number v-model="formZK.折扣比例" :controls="false" style="width: 100%;" @input="ZKinput"
                        placeholder="必填项" />
                </el-form-item>
                <el-form-item v-if="formZK.折扣录入方式 == '逐条折扣录入'" label="折扣金额 (含税）">
                    <el-table :data="selectrow" style="width: 100%" max-height="185px" size="small" table-layout="fixed">
                        <el-table-column prop="goodsName" label="项目名称" fit show-overflow-tooltip />
                        <el-table-column prop="goodsTotalPrice" label="金额" width="100px" />
                        <el-table-column prop="折扣" label="折扣比例(%)" width="100px">
                            <template #default="scope">
                                <el-input-number v-model="scope.row.折扣" @change="ZKinputs(scope.row)" :controls="false"
                                    style="width: 100%;" placeholder="必填项" />
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <div class="btn-footer" style="text-align: right;margin-top: 45px;">
                <el-button @click="ZKclosed(ZKFormRef)">取消</el-button>
                <el-button type="primary" v-if="formZK.折扣录入方式 == '批量折扣录入'" @click="ZKsubmit(ZKFormRef)">确定</el-button>
                <el-button type="primary" v-if="formZK.折扣录入方式 == '逐条折扣录入'" @click="ZKsubmits(selectrow)">确定</el-button>
            </div>
        </el-dialog>
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
import { ref, computed, onMounted, inject, watch, getCurrentInstance, nextTick, shallowRef, provide } from 'vue';
import { DocumentCopy, DocumentAdd, Upload, Operation, Delete } from '@element-plus/icons-vue'
// import { excelExportUseJson, excelImport } from "../../../roadui-assets/excel";
import { excelExportUseJson, excelImport } from "../../../roadui-assets/excel copy";
import { ElMessage, ElMessageBox } from 'element-plus'
const { proxy } = getCurrentInstance();
const ajax = inject('ajax');
const utils = inject('utils');
const qs = inject('qs');
const config = inject('config');
const index_openmenu = inject('index_openmenu');//首页打开菜单
const index_removetab = inject('index_removetab');//首页关闭标签方法
const index_refreshtab = inject('index_refreshtab');//首页刷新标签方式
const index_dialogshow = inject('index_dialogshow');//首页弹出modal显示
const index_regcomponent = inject('index_regcomponent');//首页注册组件
const index_userinfo = inject('index_userinfo');//首页用户信息
const sobInfo = ref('')//账套信息
const isSelect = ref(false);//是否选中
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const defaultOrder = ref({ prop: 'goodsLineNo', order: 'ascending' });
const pager = ref(utils.getPager(defaultOrder.value));
const pagers = ref(utils.getPager(defaultOrder.value));
const Productpagers = ref(utils.getPager(defaultOrder.value));
const selectrow = ref<any>([]);//多选
const Productselectrow = ref([]);//多选
const checkList = ref([])//单位选择
const isflow = ref(false);//是否是流程
const addnewid = ref('');//新增id
const Modelvisible = ref(false);//弹出框
const SelectTable = ref();//弹出框表格数据
const ProductTable = ref([]);//产品弹出框表格数据
const sobItems = ref();//开票单位
const finishprogress = ref(false);//完成进度
const Productvisible = ref(false);//产品弹出框
const invoiceLineNature = ref(0);//发票行性质
let tableRowEditId = ref(null) // 控制可编辑的每一行
let tableColumnEditIndex = ref(null) //控制可编辑的每一列
const multipleTableRef = ref()
const AddZKshow = ref(false);//折扣弹出框
const ZKFormRef = ref()//折扣弹出框
const ZKdata = ref<any>([])//折扣数据
const totalPriceTax = ref(0)//价税合计
const totalTax = ref(0)//税额
const totalcols = ref(0)//共几行
const ZKtableData = ref<any>([])//折扣弹出框数据

// 折扣弹出框
const SelectZK = () => {
    if (selectrow.value.length === 0) {
        utils.msg('请选择要添加折扣的数据', 'warning', false);
        return;
    } else
        // 如果选择的数据价税合计有为空的提示并return
        if (selectrow.value.some(item => item.goodsTotalPrice === '')) {
            utils.msg('价税合计不能为空', 'error', false);
            return;
        } else if (selectrow.value.some(item => item.invoiceLineNature === '1') || selectrow.value.some(item => item.invoiceLineNature === '2')) {
            utils.msg('选中的数据中包含【折扣行】请重新选择', 'error', false);
            return;
        } else
            // 检查选中的行在detailData中是否是连续的行，不是就提示,通过goodsLineNo来判断
            if (selectrow.value.length > 1) {
                // 先按照goodsLineNo对选中行进行排序
                selectrow.value.sort((a, b) => a.goodsLineNo - b.goodsLineNo);

                // 获取首个和最后一个元素的goodsLineNo
                let firstGoodsLineNo = selectrow.value[0].goodsLineNo;
                let lastGoodsLineNo = selectrow.value[selectrow.value.length - 1].goodsLineNo;

                // 判断每项的goodsLineNo是否连续
                let isContinuous = selectrow.value.every((item, index) => {
                    // 计算当前index应有的goodsLineNo并与实际比较
                    return item.goodsLineNo === firstGoodsLineNo + index;
                });

                // 根据连续性结果给出反馈
                if (!isContinuous) {
                    utils.msg('选中的行数据不连续，请确保选择的是连续的行', 'error', false);
                    return;
                    // 可能需要的其他处理，如返回、取消操作等
                }
                ZKtableData.value = selectrow.value
                for (let i = 0; i < ZKtableData.value.length; i++) {
                    ZKtableData.value[i].折扣 = ''
                }
                // 这里可以添加针对isContinuous为true时的处理逻辑
            } else {
                // 考虑到当只选择一行时，无需检查连续性，可添加相应处理或注释说明
            }


    // totalPriceTax等于选中数据的价税合计的和
    totalPriceTax.value = selectrow.value.reduce((pre, cur) => {
        return pre + Number(cur.goodsTotalPrice);
    }, 0).toFixed(2);

    //totalTax等于选中数据的税额的和
    totalTax.value = selectrow.value.reduce((pre, cur) => {
        return pre + Number(cur.goodsTotalTax);
    }, 0).toFixed(2);

    // totalcols等于选中的数据的长度
    totalcols.value = selectrow.value.length;
    // // 把selectrow.value中每一行的invoiceLineNature值改为字符串2
    // selectrow.value.forEach(item => {
    //     item.invoiceLineNature = "2";
    // });
    // 取出selectrow.value中数据的id赋给新的字段，创建新的对象，赋值给对象中disdiscountid字段，每一条生成一个对象,插入到ZKdata中
    selectrow.value.forEach(item => {
        ajax.post("/Flow/GetLongId").then((res) => {
            addnewid.value = res.data;
            let obj = {
                id: addnewid.value,
                discountid: item.id,// 折扣id
                goodsCode: item.goodsCode,// 商品编码
                goodsName: item.goodsName,// 商品名称
                goodsTaxRate: item.goodsTaxRate,// 税率
                goodsTotalTax: '',// 税额
                goodsTotalPrice: '',// 价税合计
                invoiceLineNature: '1',// 发票行性质:1为折扣行，2为被折扣行
            };
            ZKdata.value.push(obj);
        })
    })
    formZK.value.折扣比例 = ''
    for (let i = 0; i < selectrow.value.length; i++) {
        selectrow.value[i].折扣 = ''
    }
    ZKdata.value = []
    // 循环生成折扣数据
    AddZKshow.value = true;
}
//选中的list
const getRowKeys = (row) => {
    //记录每行的key值
    return row.id;
}
// 折扣
const formZK = ref({
    折扣方式: '按金额折扣',//折扣方式
    折扣录入方式: '批量折扣录入',//折扣录入方式
    折扣比例: '',//折扣比例(%）（含税）
})
// 折扣规则
const ZKrules = ref({
    折扣比例: [
        { required: true, message: '请输入折扣比例', trigger: 'blur' },
    ],
})
// 批量折扣录入
const ZKinput = (e) => {
    if (e == null || e < 0 || e == undefined) {
        return ''
    }
    // 定义一个折扣场景数组，每个场景包含折扣方式、录入方式及相应的处理逻辑
    const discountScenarios = [
        // 场景1：按金额折扣且批量折扣录入
        {
            折扣方式: '按金额折扣', 录入方式: '批量折扣录入', action: () => {
                //selectrow.value遍历每一行的goodsTotalPrice除以totalPriceTax.value,并把求出来的值赋给ZKdata.value中discountid和selectrow.value.id相同的那一行的goodsTotalPrice上面
                // 遍历selectrow中的每一项
                selectrow.value.forEach(item => {
                    // 对于selectrow中的每一项，遍历ZKdata以查找匹配的discountid
                    ZKdata.value.forEach(item2 => {
                        // 当找到ZKdata中discountid与selectrow当前项id匹配时
                        if (item2.discountid === item.id) {
                            // 计算并更新goodsTotalPrice和goodsTotalTax，结果保留两位小数
                            // 注意：此处注释说明了计算逻辑，但实际代码中未直接进行两位小数的格式化，
                            // 如需保留两位小数，可使用toFixed(2)方法进行调整。
                            item2.goodsTotalPrice = (-(item.goodsTotalPrice / totalPriceTax.value) * e).toFixed(2);
                            item2.goodsTotalTax = (-(item.goodsTotalTax / totalTax.value) * e).toFixed(2);
                        }
                    });
                });
            }
        },
        // 场景2：按比例折扣且批量折扣录入
        {
            折扣方式: '按比例折扣', 录入方式: '批量折扣录入', action: () => {
                selectrow.value.forEach(item => {
                    // 对于selectrow中的每一项，遍历ZKdata以查找匹配的discountid
                    ZKdata.value.forEach(item2 => {
                        // 当找到ZKdata中discountid与selectrow当前项id匹配时
                        if (item2.discountid === item.id) {
                            // 计算并更新goodsTotalPrice和goodsTotalTax，结果保留两位小数
                            // 注意：此处注释说明了计算逻辑，但实际代码中未直接进行两位小数的格式化，
                            // 如需保留两位小数，可使用toFixed(2)方法进行调整。
                            item2.goodsTotalPrice = (-item.goodsTotalPrice * e / 100).toFixed(2);
                            item2.goodsTotalTax = (-item.goodsTotalTax * e / 100).toFixed(2);
                        }
                    });
                });

            }
        },
    ];

    // 遍历折扣场景数组
    discountScenarios.forEach(scenario => {
        // 检查当前遍历到的场景是否与用户选择的折扣方式和录入方式相匹配
        if (
            scenario.折扣方式 === formZK.value.折扣方式 &&
            scenario.录入方式 === formZK.value.折扣录入方式
        ) {
            // 如果匹配，则执行该场景对应的处理逻辑
            scenario.action();
        }
    });
}
// 逐条折扣录入
const ZKinputs = (row) => {
    if (row.折扣 == null || row.折扣 < 0 || row.折扣 == undefined || row.折扣 == 0) {
        return ''
    }
    // 定义一个折扣场景数组，每个场景包含折扣方式、录入方式及相应的处理逻辑
    const discountScenarios = [
        // 场景1：按金额折扣且逐条折扣录入
        {
            折扣方式: '按金额折扣', 录入方式: '逐条折扣录入', action: () => {
                selectrow.value.forEach(item => {
                    ZKdata.value.forEach(item2 => {
                        // 当找到ZKdata中discountid与selectrow当前项id匹配时
                        if (item2.discountid === row.id) {
                            // 计算并更新goodsTotalPrice和goodsTotalTax，结果保留两位小数
                            // 注意：此处注释说明了计算逻辑，但实际代码中未直接进行两位小数的格式化，
                            // 如需保留两位小数，可使用toFixed(2)方法进行调整。
                            item2.goodsTotalPrice = (-row.折扣).toFixed(2);
                            item2.goodsTotalTax = (-row.折扣).toFixed(2);
                        }
                    });
                });
            }
        },
        // 场景2：按比例折扣且逐条折扣录入
        {
            折扣方式: '按比例折扣', 录入方式: '逐条折扣录入', action: () => {
                // 直接在ZKdata.value中查找与当前操作行ID匹配的项
                const matchedItemInZKdata = ZKdata.value.find(item => item.discountid === row.id);
                if (matchedItemInZKdata) {
                    // 只计算当前行，根据比例更新价格和税
                    matchedItemInZKdata.goodsTotalPrice = (-row.goodsTotalPrice * row.折扣 / 100).toFixed(2);
                    // 假设税费计算也是基于调整后的商品总价，根据实际情况调整
                    matchedItemInZKdata.goodsTotalTax = (matchedItemInZKdata.goodsTotalPrice * row.折扣 / 100).toFixed(2);
                    // 这里taxRate是假设存在的税率变量，根据实际情况定义
                }
                // selectrow.value.forEach(item => {
                //     ZKdata.value.forEach(item2 => {
                //         // 当找到ZKdata中discountid与selectrow当前项id匹配时
                //         // if (item2.discountid === item.id) {
                //         if (item2.discountid === item.id) {
                //             // 计算并更新goodsTotalPrice和goodsTotalTax，结果保留两位小数
                //             // 注意：此处注释说明了计算逻辑，但实际代码中未直接进行两位小数的格式化，
                //             // 如需保留两位小数，可使用toFixed(2)方法进行调整。
                //             item2.goodsTotalPrice = (-item.goodsTotalPrice * row.折扣 / 100).toFixed(2);
                //             item2.goodsTotalTax = (-item.goodsTotalPrice * row.折扣 / 100).toFixed(2);
                //         }
                //     });
                // });
            }
        },
    ];
    // 遍历折扣场景数组
    discountScenarios.forEach(scenario => {
        // 检查当前遍历到的场景是否与用户选择的折扣方式和录入方式相匹配
        if (
            scenario.折扣方式 === formZK.value.折扣方式 &&
            scenario.录入方式 === formZK.value.折扣录入方式
        ) {
            // 如果匹配，则执行该场景对应的处理逻辑
            scenario.action();
        }
    });
}
// 折扣关闭
const ZKclosed = (ZKFormRef) => {
    AddZKshow.value = false
    ZKFormRef.value.resetFields()
}
// 折扣提交
const ZKsubmit = async (formEl) => {
    if (!formEl) return
    if (formZK.value.折扣比例 == 0 || formZK.value.折扣比例 < 0 || formZK.value.折扣比例 == '' || formZK.value.折扣比例 == null || formZK.value.折扣比例 == undefined) {
        return ElMessage.error('请输入正确的折扣比例')
    }
    await formEl.validate((valid, fields) => {
        if (valid) {
            // 遍历ZKdata中的每个元素，去除重复的id的元素
            for (let i = 0; i < ZKdata.value.length; i++) {
                for (let j = i + 1; j < ZKdata.value.length; j++) {
                    if (ZKdata.value[i].discountid === ZKdata.value[j].discountid) {
                        ZKdata.value.splice(j, 1);
                        j--;
                    }
                }
            }
            // 遍历ZKdata中的每个元素，尝试在detailData中找到匹配的元素
            for (let i = 0; i < ZKdata.value.length; i++) {
                let foundIndex = -1;

                // 在detailData中查找与当前ZKdata元素匹配的元素
                for (let j = 0; j < detailData.value.length; j++) {
                    if (ZKdata.value[i].discountid === detailData.value[j].id) {
                        foundIndex = j;
                        break;
                    }
                }
                // 如果找到了匹配项，但该匹配项在detailData中不存在，则将其插入到detailData的相应位置
                if (foundIndex != -1) {
                    detailData.value[foundIndex].invoiceLineNature = '2';
                    detailData.value.splice(foundIndex + 1, 0, ZKdata.value[i]);
                    detailData.value[foundIndex + 1].invoiceLineNature = '1';
                    detailData.value[foundIndex + 1].goodsLineNo = detailData.value[foundIndex].goodsLineNo + 1;
                    // detailData.value通过goodsLineNo重新安排序号
                    for (let i = 0; i < detailData.value.length; i++) {
                        detailData.value[i].goodsLineNo = i + 1;
                    }
                }
            }
            // 重新排序

            ZKdata.value = []
            selectrow.value = []
            // nextTick(() => {
            //     multipleTableRef.value.clearSelection()
            // })
            proxy.$refs.multipleTableRef.clearSelection()//清除选中
            AddZKshow.value = false
        } else {

        }
    })
}
const ZKsubmits = (data) => {
    for (let i = 0; i < data.length; i++) {
        // 折扣比例不能为空，为0，为负数
        if (data[i].折扣 == '' || data[i].折扣 == null || data[i].折扣 == undefined) {
            return ElMessage.error('第' + (i + 1) + '行折扣比例输入不正确')
        } else if (data[i].折扣 == 0 || data[i].折扣 < 0) {
            return ElMessage.error('第' + (i + 1) + '行折扣比例不能为0，为负数')
        }
    }
    // 遍历ZKdata中的每个元素，尝试在detailData中找到匹配的元素
    for (let i = 0; i < ZKdata.value.length; i++) {
        let foundIndex = -1;

        // 在detailData中查找与当前ZKdata元素匹配的元素
        for (let j = 0; j < detailData.value.length; j++) {
            if (ZKdata.value[i].discountid === detailData.value[j].id) {
                foundIndex = j;
                break;
            }
        }
        // 如果找到了匹配项，但该匹配项在detailData中不存在，则将其插入到detailData的相应位置
        if (foundIndex != -1) {
            detailData.value[foundIndex].invoiceLineNature = '2';
            detailData.value.splice(foundIndex + 1, 0, ZKdata.value[i]);
            detailData.value[foundIndex + 1].invoiceLineNature = '1';
            detailData.value[foundIndex + 1].goodsLineNo = detailData.value[foundIndex].goodsLineNo + 1;
            // detailData.value通过goodsLineNo重新安排序号
            for (let i = 0; i < detailData.value.length; i++) {
                detailData.value[i].goodsLineNo = i + 1;
            }
        }
    }
    ZKdata.value = []
    selectrow.value = []
    // nextTick(() => {
    //     multipleTableRef.value.clearSelection()
    // })
    proxy.$refs.multipleTableRef.clearSelection()//清除选中
    AddZKshow.value = false
}






// 发票类型
const ticketList = ref([
    { id: '01', label: '全电专用发票' },
    { id: '02', label: '全电普通发票' },
])
const selectName = ref({
    customername: '',
})
// 选择产品
const Productselect = ref({
    projectname: '',
})
// 控制单元格可编辑
const showUnitInput = (row: any, column: any) => {
    //赋值给定义的变量
    tableRowEditId.value = row.id //确定点击的单元格在哪行 如果数据中有ID可以用ID判断，没有可以使用其他值判断，只要能确定是哪一行即可
    tableColumnEditIndex.value = column.id //确定点击的单元格在哪列 
}
const blurValueInput = (row, column) => {
    tableRowEditId.value = null
    tableColumnEditIndex.value = null
    //在此处调接口传数据
}

// 创建emits
const emits = defineEmits(['update:id', 'update:serialNo', 'update:buyerTaxNo', 'update:buyerName', 'update:invoiceTotalPrice', 'update:invoiceTotalTax', 'update:billcode'])
// 创建props
const props = defineProps({
    query: { type: String, default: () => { return ''; } },
    modelValue: { type: Boolean, default: false },
    id: { type: String, default: "0" },
    serialNo: { type: String, default: "" },
    buyerTaxNo: { type: String, default: "" },
    buyerName: { type: String, default: "" },
    invoiceTotalPrice: { type: String, default: "" },
    invoiceTotalTax: { type: String, default: "" },
    billcode: { type: String, default: "" },
})
// 创建计算属性
function createComputed(propName) {
    return computed({
        get: () => props[propName],
        set: (val) => {
            emits(`update:${propName}`, val)
        }
    })
}
const id = createComputed('id')
const serialNo = createComputed('serialNo')
const buyerTaxNo = createComputed('buyerTaxNo')
const buyerName = createComputed('buyerName')
const billcode = createComputed('billcode')
onMounted(() => {
    getformdata(id.value);
    getsobItems()
    getSysinfo();
})
const ruleFormRef = ref()
const readonly = ref(false)
const loading = ref(false);
const dataprovide = ref({ Id: '', invoicedepartname: '', taxno: '' })
// 选中行
const successCount = ref<number>(0);//开票成功数量
const percentage = ref<number>(0);//进度条百分比
const errorcount = ref<number>(0);//开票失败数量
// 开票
const ticketstart = () => {
    ajax.post('/Invoice/Save?srcorgid=' + sobInfo.value.id, qs.stringify({ invoiceJSON: JSON.stringify(formData.value), invoicedetailsJSON: JSON.stringify(detailData.value) })).then((res) => {
        if (res.success) {
            // utils.msg(res.msg, 'success', false);
            finishprogress.value = true;
            dataprovide.value.invoicedepartname = sobInfo.value.accountname;
            dataprovide.value.taxno = sobInfo.value.taxno;
            dataprovide.value.Id = formData.value.id;
            openticket();
        } else {
            utils.msg(res.msg, 'error', false);
        }
    }).catch(() => { });
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
// 明细表数据
const detailData = ref<any>([])
// 上移
function up(index, row) {
    if (index === 0) {
        utils.msg('已经是第一行了', 'warning', false);
        return;
    } else if (row.invoiceLineNature == '1' || row.invoiceLineNature == '2') {
        utils.msg('该行是折扣行，不能上移', 'warning', false);
        return;
    } else if (detailData.value[index - 1].invoiceLineNature == '1' || detailData.value[index + 1].invoiceLineNature == '2') {
        utils.msg('上一行是折扣行，不能上移', 'warning', false);
        return;
    }
    const temp = detailData.value[index - 1];//上一行
    detailData.value[index - 1] = detailData.value[index];//当前行
    detailData.value[index] = temp;//上一行
    // 重新排序
    detailData.value.forEach((item, index) => {
        item.goodsLineNo = index + 1;
    })
    utils.notify('', '操作成功', 'success');
}
// 下移
function down(index, row) {
    if (index === detailData.value.length - 1) {
        utils.msg('已经是最后一行了', 'warning', false);
        return;
    } else if (row.invoiceLineNature == '1' || row.invoiceLineNature == '2') {
        utils.msg('该行是折扣行，不能下移移', 'warning', false);
        return;
    } else if (detailData.value[index + 1].invoiceLineNature == '1' || detailData.value[index + 1].invoiceLineNature == '2') {
        utils.msg('下一行是折扣行，不能下移', 'warning', false);
        return;
    }
    const temp = detailData.value[index + 1];//下一行
    detailData.value[index + 1] = detailData.value[index];//当前行
    detailData.value[index] = temp;//下一行
    // 重新排序
    detailData.value.forEach((item, index) => {
        item.goodsLineNo = index + 1;
    })
    utils.notify('', '操作成功', 'success');
}
// 开票
const openticket = async () => {
    const res = await ajax.post('/Invoice/OpenInvoice?srcorgid=' + sobInfo.value.id, qs.stringify(dataprovide.value));
    if (res.code == 0) {
        successCount.value++;
        utils.notify('第' + successCount.value + '张', res.msg, 'success');
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

    } else {
        errorcount.value++;
        utils.notify('', res.msg, 'error');
    }
}

const taskclose = () => {
    percentage.value = 0
    successCount.value = 0
    errorcount.value = 0
    selectrow.value = []
    index_refreshtab()
}

// 表单信息
const formData = ref({
    // invoiceTypeCode: ticketItems.value,//发票类型
    invoiceTypeCode: '',//发票类型
    serialNo: '',//开票流水号
    buyerName: '',//购方名称
    buyerTaxNo: '',//购方税号
    buyerEmail: '',//购方邮箱
    buyerAddress: '',//购方地址
    buyerBankName: '',//购方开户银行
    buyerBankNumber: '',//购方银行账号
    buyerPhone: '',//购方电话
    sellerName: '',//销方名称
    sellerid: '',//销方id
    sellerTaxNo: '',//销方税号
    sellerAddress: '',//销方地址
    sellerPhone: '',//销方电话
    sellerBankName: '',//销方开户银行
    sellerBankNumber: '',//销方银行账号
    remarks: '',//备注
    invoiceTotalPriceTax: 0,//价税合计
    invoiceTotalTax: 0,//税额
    buyerNaturalPerson: 'N',//是否是自然人
});
function querySearch(queryString, cb) { // queryString是用户输入的想要查询的内容，cb是回调函数（可以发请求获取数据）
    if (queryString == "") {
        cb([]); // 当然这里的历史记录是后端返给我们的，应该为接口返回的数据
    } else {
        let apiResult = [];
        // 这里我们模拟从后端的接口异步获取的数据
        // setTimeout(() => {
        //     // cb([])    cb函数如果返回一个空数组的话，那个模糊搜索输入建议的下拉选项因为length为0就会消失了
        //     cb(apiResult);
        // }, 500);
        ajax.post('/Customer/GetAllCustomer?srcorgid=' + sobInfo.value.id, {}).then((res) => {
            if (res.success) {
                apiResult = res.data.customer;
                // 这里的result是后端返回的数据，我们需要根据用户输入的内容进行模糊搜索
                apiResult = apiResult.filter(item => {
                    return item.customername.toLowerCase().indexOf(queryString.toLowerCase()) > -1;
                });
                cb(apiResult);
            }
        }).catch(() => { });
    }
}
function handleSelect(item) { // 参数
    formData.value.buyerTaxNo = item.buyerTaxno;
    formData.value.buyerAddress = item.Address;
    formData.value.buyerPhone = item.Phone;
    formData.value.buyerBankName = item.BankName;
    formData.value.buyerEmail = item.Email;
    formData.value.buyerAddress = item.Address;
    formData.value.buyerBankName = item.BankName;
    formData.value.buyerBankNumber = item.Account;
}
// 点击clearable清空小图标按钮以后，继续重新在输入框中输入数据，querySearch会触发，但是cb函数不会触发
// 这样的话就会出现发请求了，也获取数据了，但是input框的输入建议下拉框不呈现在页面上的问题，所以解决方法就是
// 只要用户点击了
function blurForBug() {
    document.activeElement.blur()
    formData.value.buyerTaxNo = '';
    formData.value.buyerAddress = '';
    formData.value.buyerPhone = '';
    formData.value.buyerBankName = '';
    formData.value.buyerBankNumber = '';
    formData.value.buyerEmail = '';
}

// 下载导入模板
const Download = () => {
    utils.showFileName(index_openmenu, { name: '手工开票模板' }, config.SERVER_WEBADDRESS);
}
// 表单验证
const rules = {
    buyerName: [
        {
            required: true,
            message: '请输入购方名称',
            trigger: 'blur'
        },
    ],
    // buyerTaxNo: [
    //     {
    //         required: true,
    //         message: '请输入纳税人识别号',
    //         trigger: 'blur'
    //     },
    // ],
}
// 明细表格循环
const tableDetails = ref([
    { prop: 'id', align: 'center', show: false, useTemplate: false },
    // { prop: 'goodsLineNo', label: '序号', align: 'center', useTemplate: false, show: true, width: '75', },
    { prop: 'goodsCode', label: '商品编号', show: true, useTemplate: true, align: 'left', width: '180', },
    { prop: 'goodsName', label: '商品名称', show: true, useTemplate: true, align: 'left', width: '180', useTag: true },
    { prop: 'goodsSpecification', label: '规格型号', show: true, useTemplate: true, align: 'left', width: '130', },
    { prop: 'goodsUnit', label: '单位', show: true, align: 'left', useTemplate: true, width: '100', },
    { prop: 'goodsQuantity', label: '数量', show: true, align: 'left', useTemplate: true, width: '90', },
    { prop: 'goodsPrice', label: '单价', show: true, align: 'left', useTemplate: false, width: '130', },
    { prop: 'goodsTotalPrice', label: '价税合计', show: true, align: 'left', useTemplate: true, width: '120', },
    { prop: 'notaxamount', label: '无税金额', show: true, align: 'left', useTemplate: false, width: '120', },
    { prop: 'goodsTotalTax', label: '税额', show: true, useTemplate: false, align: 'left', width: '120' },
    { prop: 'goodsTaxRate', label: '税率(%)', show: true, align: 'left', useTemplate: true, width: '120' },
    { prop: 'invoiceLineNature', label: '发票行性质', show: false, align: 'left', useTemplate: true, width: '200', },
    { prop: 'discountRate', label: '折扣率', show: false, align: 'left', useTemplate: true, width: '200', },
    { prop: 'discountAmount', label: '折扣额', show: false, align: 'left', useTemplate: true, width: '200', },
])
//弹出框表格列
const SelectTableColumn = ref([
    { prop: 'id', align: 'center', show: false, useTemplate: false },
    { prop: 'customername', label: '购买方名称', show: true, align: 'center', useTemplate: false, width: '240', },
    { prop: 'customercode', label: '购买方编号', show: false, align: 'center', useTemplate: false, width: '200', },
    { prop: 'Taxno', label: '税号', show: true, align: 'center', useTemplate: false, width: '180', },
    { prop: 'Phone', label: '电话', show: true, align: 'center', useTemplate: false, width: '140', },
    { prop: 'Email', label: '邮箱', show: true, align: 'center', useTemplate: false, width: '140', },
    { prop: 'Address', label: '地址', show: true, align: 'center', useTemplate: false, width: '200', },
    { prop: 'BankName', label: '开户行', show: true, align: 'center', useTemplate: false, width: '170', },
    { prop: 'Account', label: '银行账号', show: true, align: 'center', useTemplate: false, width: '200', },
    { prop: 'BankAccount', label: '银行账号', show: true, align: 'center', useTemplate: false, width: '200', },
    { prop: 'AddressPhone', label: '地址电话', show: true, align: 'center', useTemplate: false, width: '200', },
    { label: '操作', show: true, align: 'center', useTemplate: true, width: '100', fixed: 'right' },
])
const SelectProductColumn = ref([
    { prop: 'id', align: 'center', show: false, useTemplate: false },
    { prop: 'goodsLineNo', label: '序号', align: 'center', useTemplate: false, show: false, width: '60', },
    { prop: 'goodsCode', label: '商品编号', show: true, useTemplate: false, align: 'center', width: '150', },
    { prop: 'goodsName', label: '商品名称', show: true, useTemplate: false, align: 'center', width: '200', },
    { prop: 'spec', label: '规格型号', show: true, useTemplate: false, align: 'center', width: '160', },
    { prop: 'unitname', label: '单位', show: true, align: 'center', useTemplate: false, width: '100', },
    { prop: 'taxrate', label: '税率(%)', show: true, align: 'center', useTemplate: false, minWidth: '150%' },
    { prop: 'goodsQuantity', label: '数量', show: false, align: 'center', useTemplate: false, width: '120', },
    { prop: 'goodsPrice', label: '单价', show: false, align: 'center', useTemplate: false, width: '120', },
    { prop: 'goodsTotalPrice', label: '价税合计', show: false, align: 'right', useTemplate: false, width: '120', },
    { prop: 'notaxamount', label: '无税金额', show: false, align: 'right', useTemplate: false, width: '120', },
    { prop: 'goodsTotalTax', label: '税额', show: false, useTemplate: false, align: 'center', width: '120' },
    { prop: 'priceTaxMark', label: '发票行性质', show: false, align: 'center', useTemplate: false, width: '200', },
    { prop: 'preferentialMarkFlag', label: '', show: false, align: 'center', useTemplate: false, width: '200', },
    { prop: 'vatSpecialManagement', label: '', show: false, align: 'center', useTemplate: false, width: '200', },
    { prop: 'freeTaxMark ', label: '', show: false, align: 'center', useTemplate: false, width: '200', },
])
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
// 打开页面
function open() {
    loadAll();
}
// 打开页面
function Productopen() {
    ProjectAll();
}
// 折扣关闭
function ZKclosedDio() {
    // 清空
    ZKtableData.value = [];
    formZK.value = {
        折扣方式: '按金额折扣',//折扣方式
        折扣录入方式: '批量折扣录入',//折扣录入方式
        折扣比例: '',//折扣比例(%）（含税）
    }
}

// 获取全部商品
const ProjectAll = () => {
    Productselect.value.size = Productpagers.value.size;
    Productselect.value.number = Productpagers.value.number;
    ajax.post('/invoiceproduct/GetAllProduct?srcorgid=' + sobInfo.value.id, qs.stringify(Productselect.value)).then((res) => {
        if (res.success) {
            ProductTable.value = res.data.product;
            Productpagers.value.total = res.data.total;
        }
    }).catch(() => { });
}
// 获取数据
const loadAll = () => {
    selectName.value.size = pagers.value.size;
    selectName.value.number = pagers.value.number;
    ajax.post('/Customer/GetList?srcorgid=' + sobInfo.value.id, qs.stringify(selectName.value)).then((res) => {
        if (res.success) {
            SelectTable.value = res.data.rows;
            pagers.value.total = res.data.total;
        }
    }).catch(() => { });
}
//获取系统设置数据
const getSysinfo = async () => {
    try {
        const res = await ajax.post('/Systemset/Get?srcorgid=' + sobInfo.value.id, {});
        systemInfo.value = res.data.invoicesystemset;
        // ticketItems.value = res.data.invoicesystemset.默认发票类型;
        formData.value.invoiceTypeCode = res.data.invoicesystemset.默认发票类型;
        formData.value.buyershow = res.data.invoicesystemset.是否默认选中购买方;
        formData.value.sellershow = res.data.invoicesystemset.是否默认选中销售方;
        buyershow()
        sellershow()
        sellerAddshow()
        buyerAddshow()
    } catch (error) {
    }
};
function closed() {
    selectName.value.customername = '';
    loadAll();
}
function Productclosed() {
    Productselect.value.goodsName = '';
    loadAll();
}
// 销售方名称查询
function changeSob(row) {
    // 假设checklist是在当前组件的data属性中定义的
    let checklistItem = checkList.value.find(item => item.id === row);
    if (checklistItem) {
        formData.value.sellerName = checklistItem.label;
        formData.value.sellerTaxNo = checklistItem.taxno;
    } else {
    }
}





// 获取表单数据
const getformdata = async (ids) => {
    loading.value = true;
    try {
        const res = await ajax.post('/Invoice/GetInvoiceApply', qs.stringify({ id: ids, type: '手工开票' }));
        formData.value = res.data.invoicemain
        id.value = res.data.invoicemain.id
        detailData.value = res.data.invoicedetail
        formData.value.sellerName = sobInfo.value.accountname;
        formData.value.sellerTaxNo = sobInfo.value.taxno;
        formData.value.sellerid = sobInfo.value.id;
        formData.value.sellerAddress = sobInfo.value.address;
        formData.value.sellerPhone = sobInfo.value.phone;
        formData.value.sellerBankName = sobInfo.value.openbank;
        formData.value.sellerBankNumber = sobInfo.value.bankaccount;
        // formData.value.buyerNaturalPerson = 'N';
        // formData.value.buyershow = systemInfo.value.是否默认选中购买方;
        // formData.value.sellershow = systemInfo.value.是否默认选中销售方;
        getSysinfo();
    } catch (error) {
        // 这里可以添加你的错误处理逻辑
    } finally {
        loading.value = false;
    }
}
// 保存
const Save = () => {
    if (formData.value.buyerName == '') {
        utils.msg('购方名称不能为空', 'warning', false);
        return;
    }
    // if (formData.value.buyerTaxNo == '') {
    //     utils.msg('纳税人识别号不能为空', 'warning', false);
    //     return;
    // }

    ajax.post('/Invoice/Save?srcorgid=' + sobInfo.value.id, qs.stringify({ invoiceJSON: JSON.stringify(formData.value), invoicedetailsJSON: JSON.stringify(detailData.value) })).then((res) => {
        if (res.success) {
            utils.msg(res.msg, 'success', false);
            // index_refreshtab();
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
            utils.msg(res.msg, 'error', false);
        }
    }).catch(() => { });
}
//多选
const ProductSelectionChange = (val) => {
    // 将val中Proxy(Object)转为普通对象，然后将Proxy(Array)转为普通数组
    Productselectrow.value = JSON.parse(JSON.stringify(val))
}
const ProductSelect = () => {
    if (Productselectrow.value.length === 0) {
        utils.msg('请选择要添加的行', 'warning', false);
        return;
    }
    for (let i = 0; i < Productselectrow.value.length; i++) {
        ajax.post("/Flow/GetLongId").then((res) => {
            addnewid.value = res.data;
            const row = {
                goodsLineNo: detailData.value.length + 1,//序号
                id: addnewid.value,
                mainid: id.value,
                goodsCode: Productselectrow.value[i].goodsCode,//商品编号
                goodsName: Productselectrow.value[i].goodsName,//商品名称
                goodsSpecification: Productselectrow.value[i].spec,//规格型号
                goodsUnit: Productselectrow.value[i].unitname,//单位
                goodsQuantity: '',//数量
                goodsPrice: '0',//单价
                goodsTotalPrice: '',//价税合计
                goodsTaxRate: Productselectrow.value[i].taxrate,//税率/征收率
                goodsTotalTax: '',//税额
                invoiceLineNature: invoiceLineNature.value,//发票行性质
                discountRate: '0',//折扣率
                discountAmount: '0',//折扣额
                priceTaxMark: '1',
                preferentialMarkFlag: Productselectrow.value[i].preferentialMarkFlag,//优惠标记
                vatSpecialManagement: Productselectrow.value[i].vatSpecialManagement,//专票管理
            }
            detailData.value.push(row);
        }).catch(() => { });
    }
    Productvisible.value = false;
}


// 选择购方名称
const showmodel = () => {
    Modelvisible.value = true;
}
// 选择产品
const Select = () => {
    invoiceLineNature.value = 0;
    Productvisible.value = true;
}


// 删除行
function Deleteline() {
    const rows = selectrow.value;
    if (rows.length === 0) {
        utils.msg('请选择要删除的行', 'warning', false);
        return;
    }
    // 循环判断删除的行是否为折扣行，删除折扣行对应的被折扣行invoiceLineNature状态改为0,然后删除该折扣行
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].invoiceLineNature == 1) {
            for (let j = 0; j < detailData.value.length; j++) {
                if (detailData.value[j].id == rows[i].discountid) {
                    // 找到detailData.value中discountid和rows[i].discountid相等的那一行，返回序列号
                    const index = detailData.value.indexOf(rows[i]);
                    detailData.value.splice(index, 1);
                    detailData.value[j].invoiceLineNature = '0';
                }
            }
        } else if (rows[i].invoiceLineNature == 2) {
            // 被折扣行删除也删除对应的折扣行
            for (let j = 0; j < detailData.value.length; j++) {
                if (detailData.value[j].discountid == rows[i].id) {
                    detailData.value.splice(j, 1);
                    detailData.value.splice(i, 1);
                }
            }
        } else {
            const index = detailData.value.indexOf(rows[i]);
            detailData.value.splice(index, 1);
        }
    }
    // 最后清空已选择的行
    proxy.$refs.multipleTableRef.clearSelection()//清除选中

    // 重新排序
    for (let i = 0; i < detailData.value.length; i++) {
        detailData.value[i].goodsLineNo = i + 1;
    }
}

// 多选
const handleSelectionChange = (val) => {
    selectrow.value = val
    if (selectrow.value.length > 0) { isSelect.value = true; } else { isSelect.value = false; }
}

// 表头单元格样式
function headerCellStyle({ row, column, rowIndex, columnIndex }) {
    return {
        color: '#000',
        textAlign: 'center',
        // borderColor: '#6f4946',
    }
}
// 表格行样式
function changRed({ row }) {
    if (row.goodsTotalPrice === 0) { // 变颜色的条件
        return {
            backgroundColor: "yellow"  // 这个return的就是样式 可以是color 也可以是backgroundColor
        }
    }
}
// 每页条数改变
const handleSizeChange = (size) => {
    pagers.value.size = size;
    loadAll();
};

//页码改变
const handleCurrentChange = (number) => {
    pagers.value.number = number;
    loadAll();
};


// 每页条数改变
const ProductSizeChange = (size) => {
    Productpagers.value.size = size;
    ProjectAll();
};

//页码改变
const ProductCurrentChange = (number) => {
    Productpagers.value.number = number;
    ProjectAll();
};

// 使用 watch 函数监听 detailData.value 的变化
watch(() => detailData.value, (newVal) => {
    // 初始化含税金额和税额的总计
    let totalInvoicePriceTax = 0;//价税合计
    let totalInvoiceTax = 0;//税额
    let totalnotaxamount = 0;//无税金额
    const notaxamount = ref(0);
    // 遍历 newVal（即新的 detailData.value）
    newVal.forEach(row => {
        // 计算含税金额的总计
        totalInvoicePriceTax += Number(row.goodsTotalPrice);
        // 计算税额的总计
        totalInvoiceTax += Number(row.goodsTotalTax);
        // 计算单价，等于金额/数量
        if (row.goodsQuantity == '' || row.goodsQuantity == null) {
            row.goodsPrice = 0;
        } else {
            let price = (Number(row.goodsTotalPrice) / Number(row.goodsQuantity)).toFixed(8);
            row.goodsPrice = isNaN(price) ? 0 : price;
        }
        // 计算税额，等于价税合计*税率/（1+税率）
        // row.goodsTotalTax = (row.goodsTotalPrice * row.goodsTaxRate / (1 + row.goodsTaxRate)).toFixed(2);
        // 计算无税金额，等于价税合计/（1+税率）
        const goodsTaxRate = 1 + Number(row.goodsTaxRate / 100);//税率
        // 计算税额，等于税额=价税合计-价税合计/（1+税率）

        notaxamount.value = (Number(row.goodsTotalPrice) / Number(goodsTaxRate)).toFixed(2);//无税金额

        row.goodsTotalTax = (Number(row.goodsTotalPrice) - notaxamount.value).toFixed(2);
        // 计算无税金额
        row.notaxamount = notaxamount.value;

        totalnotaxamount += Number(row.notaxamount)
    })
    // 更新 formData.value 的含税金额和税额
    formData.value.invoiceTotalPriceTax = Number(totalInvoicePriceTax.toFixed(2));//价税合计
    formData.value.invoiceTotalTax = Number(totalInvoiceTax.toFixed(2));//税额
    formData.value.invoiceTotal = Number(totalnotaxamount.toFixed(2));//无税金额
}, { deep: true }) // 使用 deep: true 以便在 detailData.value 的内部值变化时也能触发 watch 函数

const openSelect = (row) => {
    Modelvisible.value = false;
    formData.value.buyerName = row.customername;
    formData.value.buyerTaxNo = row.Taxno;
    formData.value.buyerEmail = row.Email;
    formData.value.buyerAddress = row.Address;
    formData.value.buyerBankName = row.BankName;
    formData.value.buyerBankNumber = row.Account;
    formData.value.buyerPhone = row.Phone;
}
// 自定义进度条颜色
const customColorMethod = (percentage: number) => {
    if (percentage < 34) {
        return '#409eff'
    }
    if (percentage < 60) {
        return '#e6a23c'
    }
    return '#67c23a'
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
                        const total = ref()
                        total.value = (parseFloat(prev) + parseFloat(curr)).toFixed(2)
                        return total.value
                    } else {
                        return parseFloat(prev).toFixed(2)
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
        detailData.value.length = 0
        arr.forEach((item) => {
            if (item["__EMPTY_8"] != 0 && item["__EMPTY_8"] != '' && item["__EMPTY_8"] != null) {
                detailData.value.push({
                    goodsLineNo: detailData.value.length + 1,
                    goodsName: item["__EMPTY"],
                    projectname: item["__EMPTY"],
                    goodsCode: item["__EMPTY_1"],
                    goodsSpecification: item["__EMPTY_2"],
                    goodsUnit: item["__EMPTY_3"],
                    goodsQuantity: item["__EMPTY_4"],
                    goodsPrice: item["__EMPTY_5"],
                    goodsTotalPrice: item["__EMPTY_6"],
                    goodsTaxRate: item["__EMPTY_7"] * 100,
                    goodsDiscountAmount: item["__EMPTY_8"],
                    vatSpecialManagement: item["__EMPTY_9"],
                    freeTaxMark: item["__EMPTY_9"] == '免税' ? '3' : item["__EMPTY_9"] == '不征税' ? '2' : '',
                    preferentialMarkFlag: item["__EMPTY_9"] != '' || item["__EMPTY_9"] != null ? '1' : '0',
                    invoiceLineNature: '2',
                    priceTaxMark: 1,
                });
                detailData.value.push({
                    goodsLineNo: detailData.value.length + 1,
                    goodsName: item["__EMPTY"],
                    projectname: item["__EMPTY"],
                    goodsCode: item["__EMPTY_1"],
                    goodsSpecification: '',
                    goodsUnit: '',
                    goodsQuantity: '',
                    goodsPrice: '',
                    goodsTotalPrice: -item["__EMPTY_8"],
                    goodsTaxRate: item["__EMPTY_7"] * 100,
                    goodsDiscountAmount: '',
                    vatSpecialManagement: '',
                    freeTaxMark: '',
                    preferentialMarkFlag: '0',
                    invoiceLineNature: '1',
                    priceTaxMark: 1,
                });
            } else {
                detailData.value.push({
                    goodsLineNo: detailData.value.length + 1,
                    goodsName: item["__EMPTY"],
                    projectname: item["__EMPTY"],
                    goodsCode: item["__EMPTY_1"],
                    goodsSpecification: item["__EMPTY_2"],
                    goodsUnit: item["__EMPTY_3"],
                    goodsQuantity: item["__EMPTY_4"],
                    goodsPrice: item["__EMPTY_5"],
                    goodsTotalPrice: item["__EMPTY_6"],
                    goodsTaxRate: item["__EMPTY_7"] * 100,
                    goodsDiscountAmount: item["__EMPTY_8"],
                    vatSpecialManagement: item["__EMPTY_9"],
                    freeTaxMark: item["__EMPTY_9"] == '免税' ? '3' : item["__EMPTY_9"] == '不征税' ? '2' : '',
                    preferentialMarkFlag: item["__EMPTY_9"] != '' || item["__EMPTY_9"] != null ? '1' : '0',
                    invoiceLineNature: 0,
                    priceTaxMark: 1,
                });
            }
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
// 作废
function DeleteAll() {
    ElMessageBox.confirm('确定要作废吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        ajax.post('/Invoice/DeleteAll', qs.stringify({ id: id.value, type: '手工开票' })).then((res) => {
            const messageType = res.success ? 'success' : 'error';
            utils.msg(res.msg, messageType, false);
            if (res.success) {
                index_refreshtab();
            }
        }).catch(() => { });
    }).catch(() => { });
}

let originalBuyerBankName = '';//购买方原始数据
let originalBuyerBankNumber = '';//购买方原始数据
let originalBuyerAddress = '';
let originalBuyerPhone = '';

let originalSellerBankName = '';//销售方原始数据
let originalSellerBankNumber = '';//销售方原始数据
let originalSellerAddress = '';//销售方原始数据
let originalSellerPhone = '';//销售方原始数据

// 购买方展示
function buyershow() {
    let remarks = formData.value.remarks
    if (formData.value.buyerBankName == null) formData.value.buyerBankName = ''
    if (formData.value.buyerBankNumber == null) formData.value.buyerBankNumber = ''
    if (formData.value.buyershow == true && formData.value.buyerBankName != '' && formData.value.buyerBankNumber != '') {
        originalBuyerBankName = formData.value.buyerBankName;
        originalBuyerBankNumber = formData.value.buyerBankNumber;
        if (remarks != undefined) {
            formData.value.remarks = "购买方开户银行:" + formData.value.buyerBankName + " " + "      " + " 银行账号:" + formData.value.buyerBankNumber + " " + "\n" + remarks
        } else {
            formData.value.remarks = "购买方开户银行:" + formData.value.buyerBankName + " " + "      " + " 银行账号:" + formData.value.buyerBankNumber + " " + "\n"
        }

    } else {
        // formData.value.remarks = formData.value.remarks.replace("购买方开户银行:" + originalBuyerBankName + " " + "      " + " 银行账号:" + originalBuyerBankNumber + " " + "\n", '');
    }
}
function buyerAddshow() {
    let remarks = formData.value.remarks
    originalBuyerAddress = formData.value.buyerAddress;
    originalBuyerPhone = formData.value.buyerPhone;
    if (formData.value.buyerAddress == null) formData.value.buyerAddress = ''
    if (formData.value.buyerPhone == null) formData.value.buyerPhone = ''
    if (formData.value.buyerAddshow == true && formData.value.buyerAddress != '' && formData.value.buyerPhone != '') {
        if (remarks != undefined) {
            formData.value.remarks = "购买方地址:" + formData.value.buyerAddress + ";" + "      " + "电话:" + formData.value.buyerPhone + ";" + "\n" + remarks
        } else {
            formData.value.remarks = "购买方地址:" + formData.value.buyerAddress + ";" + "      " + "电话:" + formData.value.buyerPhone + ";" + "\n"
        }

    } else {
        formData.value.remarks = formData.value.remarks.replace("购买方地址:" + originalBuyerAddress + ";" + "      " + "电话:" + originalBuyerPhone + ";" + "\n", '');
    }
}
// 销售方展示
function sellershow() {
    if (formData.value.sellershow == true) {
        originalSellerBankName = formData.value.sellerBankName;
        originalSellerBankNumber = formData.value.sellerBankNumber;
        if (formData.value.remarks != undefined) {
            formData.value.remarks += "销售方开户银行:" + formData.value.sellerBankName + ";" + "      " + " 银行账号:" + formData.value.sellerBankNumber + ";" + "\n"
        } else {
            formData.value.remarks = "销售方开户银行:" + formData.value.sellerBankName + ";" + "      " + " 银行账号:" + formData.value.sellerBankNumber + ";" + "\n"
        }
    } else {
        formData.value.remarks = formData.value.remarks.replace("销售方开户银行:" + originalSellerBankName + ";" + "      " + " 银行账号:" + originalSellerBankNumber + ";" + "\n", '');
    }
}
// 销售方地址电话
function sellerAddshow() {
    if (formData.value.sellerAddshow == true) {
        originalSellerAddress = formData.value.sellerAddress;
        originalSellerPhone = formData.value.sellerPhone;

        if (formData.value.remarks != undefined) {
            formData.value.remarks += "销售方地址:" + formData.value.sellerAddress + ";" + "      " + "电话:" + formData.value.sellerPhone + ";" + "\n"
        } else {
            formData.value.remarks = "销售方地址:" + formData.value.sellerAddress + ";" + "      " + "电话:" + formData.value.sellerPhone + ";" + "\n"
        }
    } else {
        formData.value.remarks = formData.value.remarks.replace("销售方地址:" + originalSellerAddress + ";" + "      " + "电话:" + originalSellerPhone + ";" + "\n", '');
    }
}


defineExpose({
    open,
    headerCellStyle,
})

</script>
