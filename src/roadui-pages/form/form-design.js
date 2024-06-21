import utils from "../../roadui-assets/utils.js";
import $ from "jquery";
export default {
    //JQuery
    jquery: $,
    //默认值选项
    defaultValueOptions() {
        return [
            {
                value: "organize",
                label: "组织架构相关选项",
                children: [
                    { value: "{<UserId>}", label: "当前用户id" },
                    { value: "{<UserName>}", label: "当前用户姓名" },
                    { value: "{<UserAccount>}", label: "当前用户帐号" },
                    { value: "{<UserDeptId>}", label: "当前用户所在部门id" },
                    { value: "{<UserDeptName>}", label: "当前用户所在部门名称" },
                    { value: "{<UserStationId>}", label: "当前用户所在岗位id" },
                    { value: "{<UserStationName>}", label: "当前用户所在岗位名称" },
                    { value: "{<UserCompanyId>}", label: "当前用户所在单位id" },
                    { value: "{<UserCompanyName>}", label: "当前用户所在单位名称" },
                    { value: "{<UserOrganize>}", label: "当前用户组织架构关系" },
                    {
                        value: "{<UserOrganizeRoot>}",
                        label: "当前用户组织架构关系包含根",
                    },
                    { value: "{<UserJobNumber>}", label: "当前用户工号" },
                    { value: "{<UserIdCard>}", label: "当前用户身份证号" },
                ],
            },
            {
                value: "dateTime",
                label: "日期时间相关选项",
                children: [
                    { value: "{<ShortDate>}", label: "日期(yyyy-MM-dd)" },
                    { value: "{<LongDate>}", label: "日期(yyyy年M月d日)" },
                    { value: "{<ShortDateTime>}", label: "日期时间(yyyy-MM-dd HH:mm)" },
                    { value: "{<LongDateTime>}", label: "日期时间(yyyy年M月d日 H时m分)" },
                    {
                        value: "{<ShortDateTimeSecond>}",
                        label: "日期时间(yyyy-MM-dd HH:mm:ss)",
                    },
                    {
                        value: "{<LongDateTimeSecond>}",
                        label: "日期时间(yyyy年M月d日 H时m分s秒)",
                    },
                ],
            },
            {
                value: "flowInstance",
                label: "流程相关选项",
                children: [
                    { value: "{<FlowId>}", label: "当前流程id" },
                    { value: "{<FlowName>}", label: "当前流程名称" },
                    { value: "{<StepId>}", label: "当前步骤id" },
                    { value: "{<StepName>}", label: "当前步骤名称" },
                    { value: "{<TaskId>}", label: "当前任务id" },
                    { value: "{<TaskTitle>}", label: "当前任务标题" },
                    { value: "{<InstanceId>}", label: "当前实例id（业务数据id）" },
                    { value: "{<GroupId>}", label: "当前审批分组id（GroupId）" },
                    { value: "{<TaskRecevierId>}", label: "当前任务接收者id" },
                    { value: "{<TaskRecevierName>}", label: "当前任务接收者姓名" },
                ],
            },
        ];
    },
    //控件值类型选项
    valueTypeOptions() {
        return [
            { value: "string", label: "字符" },
            { value: "decimal", label: "数字" },
        ];
    },
    //格式选项
    formatOptions() {
        return [
            { value: "thousand", label: "千分符" },
            { value: "percentage", label: "百分比" },
        ];
    },
    //数据字典值字段选项
    dictValueFieldOptions() {
        return [
            { value: "id", label: "id" },
            { value: "title", label: "标题" },
            { value: "value", label: "值" },
            { value: "code", label: "唯一代码" },
            { value: "note", label: "备注" },
            { value: "other", label: "其他" },
        ];
    },
    //选项来源选项
    dataSourceOptions() {
        return [
            { value: "dict", label: "数据字典" },
            { value: "string", label: "字符串" },
            { value: "sql", label: "SQL" },
            { value: "url", label: "URL" },
        ];
    },
    //转义html脚本
    escapeHTML(a) {
        a = "" + a;
        return a
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
    },
    //还原html脚本
    unescapeHTML(a) {
        a = "" + a;
        return a
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'");
    },
    //得到控件id
    getId(table, field, id) {
        if (utils.length(table) === 0 || utils.length(field) === 0) {
            return utils.length(id) > 0 && utils.startWith(id, "field_")
                ? id
                : "field_" + new Date().getTime();
        } else {
            return (table + "-" + field).toLowerCase();
        }
    },
    //控件后插入的html
    ctlAfterHtml: "",
    //控件文字颜色
    ctlColor: "#999",

    formDefaultValues: [], //表单控件默认值
    formFields: [], //表单包含字段
    formSelectOptions: [], //表单下拉选项
    formCompileErrMsg: [], //表单编译错误信息
    formSubTableIds: [], //记录下表单中有的子表ID，用于清除subtableJSON中多余的子表。

    //编译表单
    compile(html, attJSON, eventJSON, subtableJSON) {
        this.formDefaultValues = new Array();
        this.formFields = new Array();
        this.formSelectOptions = new Array();
        this.formCompileErrMsg = new Array();
        this.formSubTableIds = new Array();
        attJSON["hasCkeditor"] = 0;
        attJSON["serialNumber"] = []; //表单流水号

        var $html = $("<div>" + html + "</div>");
        //给table加上样式表
        $("table", $html).each(function () {
            //如果表格属性中设置有样式，则不自动加样式。
            if (utils.length($(this).attr("class")) === 0) {
                $(this).attr(
                    "class",
                    attJSON["tableBorder"]
                        ? "roadui_formruntable1"
                        : "roadui_formruntable",
                );
            }
        });

        //去除脚本为空的事件
        if (utils.isArray(eventJSON)) {
            let spliceEventJSON = [];
            for (let i = 0; i < eventJSON.length; i++) {
                if (
                    utils.isUndef(eventJSON[i]) ||
                    !utils.hasKey(eventJSON[i], "events") ||
                    !utils.isArray(eventJSON[i].events) ||
                    utils.length(eventJSON[i].id) === 0
                ) {
                    spliceEventJSON.push(i);
                    continue;
                }
                let spliceEvent = [];
                for (let j = 0; j < eventJSON[i].events.length; j++) {
                    if (utils.length(eventJSON[i].events[j].script) === 0) {
                        spliceEvent.push(j);
                    }
                }
                for (let k = 0; k < spliceEvent.length; k++) {
                    eventJSON[i].events.splice(spliceEvent[k], 1);
                }
                if (utils.length(eventJSON[i].events) == 0) {
                    spliceEventJSON.push(i);
                }
            }
            for (let i = 0; i < spliceEventJSON.length; i++) {
                delete eventJSON[spliceEventJSON[i]];
            }
        }

        //清除子表事件，先清除编译控件时再添加。
        let removeEventIndex = [];
        for (let i = 0; i < eventJSON.length; i++) {
            if (
                utils.isUndef(eventJSON[i]) ||
                eventJSON[i].id.substr(0, 15) === "subtable_event_"
            ) {
                removeEventIndex.push(i);
            }
        }
        for (let i = 0; i < removeEventIndex.length; i++) {
            delete eventJSON[removeEventIndex[i]];
        }

        var $elements = $("[data-isflow='1']", $html);
        for (let i = 0; i < $elements.length; i++) {
            var $element = $elements.eq(i);
            var type = $element.attr("data-type");
            switch (type) {
                case "text":
                    this.compile_text($element, eventJSON);
                    break;
                case "textarea":
                    this.compile_textarea($element, eventJSON);
                    break;
                case "number":
                    this.compile_number($element, eventJSON);
                    break;
                case "select":
                    this.compile_select($element, eventJSON);
                    break;
                case "cascader":
                    this.compile_cascader($element, eventJSON);
                    break;
                case "radio":
                    this.compile_radio($element, eventJSON);
                    break;
                case "checkbox":
                    this.compile_checkbox($element, eventJSON);
                    break;
                case "switch":
                    this.compile_switch($element, eventJSON);
                    break;
                case "hidden":
                    this.compile_hidden($element);
                    break;
                case "datetime":
                    this.compile_datetime($element, eventJSON);
                    break;
                case "dictionary":
                    this.compile_dictionary($element, eventJSON);
                    break;
                case "organize":
                    this.compile_organize($element, eventJSON);
                    break;
                case "appraise":
                    this.compile_appraise($element, eventJSON);
                    break;
                case "html":
                    attJSON["hasCkeditor"] = 1;
                    this.compile_html($element);
                    break;
                case "label":
                    this.compile_label($element);
                    break;
                case "button":
                    this.compile_button($element, attJSON, eventJSON);
                    break;
                case "datatable":
                    this.compile_datatable($element, attJSON);
                    break;
                case "signature":
                    this.compile_signature($element);
                    break;
                case "serialnumber":
                    this.compile_serialnumber($element, attJSON);
                    break;
                case "files":
                    this.compile_files($element, eventJSON);
                    break;
                case "selectdiv":
                    this.compile_selectdiv($element, eventJSON);
                    break;
                case "subtable":
                    this.compile_subtable($element, attJSON, subtableJSON, eventJSON);
                    break;
            }
        }

        //清理多余子表
        let splicesubtableJSON = [];
        for (let i = 0; i < subtableJSON.length; i++) {
            if (
                utils.isUndef(subtableJSON[i]) ||
                utils.getArrayObj(this.formSubTableIds, subtableJSON[i].id) == null
            ) {
                //utils.removeArray(subtableJSON, subtableJSON[i].id, 'id');
                splicesubtableJSON.push(i);
            }
        }
        for (let i = 0; i < splicesubtableJSON.length; i++) {
            delete subtableJSON[splicesubtableJSON[i]];
        }

        //设置字段中的表名。
        let mainTableName = attJSON["dbTable"];
        for (let i = 0; i < this.formFields.length; i++) {
            //this.formFields[i].id.indexOf('field_') !== 0 字段id是field_开头的说明没有绑定字段，不设置表名。
            if (
                this.formFields[i].type !== "subtable" &&
                this.formFields[i].id.indexOf("field_") !== 0
            ) {
                this.formFields[i]["tableName"] = mainTableName;
            }
        }

        var labelCol =
            utils.toNumber(attJSON.labelCol, 0) > 0
                ? utils.toNumber(attJSON.labelCol, 0) + "px"
                : "auto"; //标签的长度，例如 '50px'。作为Form直接子元素的form-item会继承该值。可以使用auto。
        var labelSuffix = attJSON.labelSuffix; //表单域标签的后缀
        var showMessage = attJSON.showMessage; //是否显示校验错误信息
        var inlineMessage = attJSON.inlineMessage; //是否以行内形式展示校验信息
        var statusIcon = attJSON.statusIcon; //是否在输入框中显示校验结果反馈图标

        return (
            '<div><el-form ref="roadflowFormRef" :model="formData" :rules="formRules" label-width="' +
            labelCol +
            '"' +
            (utils.length(labelSuffix) > 0
                ? ' label-suffix="' + labelSuffix + '"'
                : "") +
            (!showMessage ? ' :show-message="false"' : "") +
            (inlineMessage ? " inline-message" : "") +
            (statusIcon ? " status-icon" : "") +
            ">" +
            this.unescapeHTML($html.html()) +
            "</el-form></div>"
        );
    },
    //编译文本框
    compile_text($element, eventJSON) {
        if (utils.isUndef($element)) {
            return;
        }
        var id = $element.attr("data-id");
        var label = $element.attr("data-label");
        var defaultValue = utils.decodeURI($element.attr("data-defaultvalue"));
        var align = $element.attr("data-align");
        var placeholder = $element.attr("data-placeholder");
        var maxlength = $element.attr("data-maxlength");
        var width = $element.attr("data-width");
        var disabled = $element.attr("data-disabled") == "true";
        var readonly = $element.attr("data-readonly") == "true";
        var allowclear = $element.attr("data-allowclear") == "true";
        var inputtype = $element.attr("data-inputtype");
        var prefix = $element.attr("data-prefix");
        var suffix = $element.attr("data-suffix");
        var dataType = "string"; //字段数据类型

        var html =
            "<el-form-item v-if=\"getFieldStatus('" +
            id +
            '\')!=2" label="' +
            label +
            '" prop="' +
            id +
            '">';
        html += "<el-input";

        if ("password" === inputtype) {
            html += ' type="password" show-password';
        }
        html += " v-if=\"getFieldStatus('" + id + "')==0\"";
        html += " v-model=\"formData['" + id + "']\"";
        html += ' ref="formRef_' + utils.replace(id, "-", "_") + '"';
        var style = "";
        if (utils.length(width) > 0) {
            style += "width:" + width + ";";
        }
        if (utils.length(style) > 0) {
            html += ' style="' + style + '"';
        }
        if (utils.length(align) > 0) {
            html += " :input-style=\"{'text-align':'" + align + "'}\"";
        }
        if (utils.length(placeholder, false) > 0) {
            html += ' placeholder="' + placeholder + '"';
        }
        if (parseInt(maxlength) && parseInt(maxlength) > 0) {
            html += ' :maxlength="' + parseInt(maxlength) + '"';
        }
        if (utils.length(defaultValue) > 0) {
            this.formDefaultValues.push({
                id: id,
                type: "string",
                defaultValue: defaultValue,
            });
        }
        if (allowclear) {
            html += " clearable";
        }
        if (disabled) {
            html += " disabled";
        }
        if (readonly) {
            html += " readonly";
        }
        if (utils.length(prefix) > 0) {
            html += ' prefix-icon="' + prefix + '"';
        }
        if (utils.length(suffix) > 0) {
            html += ' suffix-icon="' + suffix + '"';
        }

        //事件
        let events = utils.getArrayObj(eventJSON, id, "id");
        if (utils.isDef(events) && utils.length(events) > 0) {
            for (let i = 0; i < events.events.length; i++) {
                if (utils.length(events.events[i].script) > 0) {
                    html +=
                        " @" +
                        events.events[i].name +
                        "=\"execFormEvent('" +
                        id +
                        "','" +
                        events.events[i].name +
                        "',$event)\"";
                }
            }
        }
        html += ">";
        html += "</el-input>";
        html +=
            '<span class="roadui_fromreadonly" v-else-if="getFieldStatus(\'' +
            id +
            "')==1\">{{getText('" +
            id +
            "')}}</span>";
        if (inputtype === 'url') {
            html += '<span class="roadui_fromreadonly" v-else-if="getFieldStatus(\'' + id + '\')==1"><a class="roaduia_" :href="getText(\'' + id + '\')" target="_blank">{{getText(\'' + id + '\')}}</a></span>'
        }
        else {
            html += '<span class="roadui_fromreadonly" v-else-if="getFieldStatus(\'' + id + '\')==1">{{getText(\'' + id + '\')}}</span>'
        }
        html += "</el-form-item>";

        $element.after(this.escapeHTML(html));
        $element.remove();
        if (utils.inArray(this.formFields, id, "id")) {
            this.formCompileErrMsg.push("控件id：" + id + " 重复！");
        } else {
            this.formFields.push({ id: id, type: dataType, label: label });
        }
    },
    //编译文本域
    compile_textarea($element, eventJSON) {
        if (utils.isUndef($element)) {
            return;
        }
        var id = $element.attr("data-id");
        var label = $element.attr("data-label");
        var defaultValue = utils.decodeURI($element.attr("data-defaultvalue"));
        var placeholder = $element.attr("data-placeholder");
        var maxlength = $element.attr("data-maxlength");
        var width = $element.attr("data-width");
        var align = $element.attr("data-align");
        var disabled = $element.attr("data-disabled") == "true";
        var allowclear = $element.attr("data-allowclear") == "true";
        var readonly = $element.attr("data-readonly") == "true";
        var rows = $element.attr("data-rows");
        var dataType = "string"; //字段数据类型

        var html =
            "<el-form-item v-if=\"getFieldStatus('" +
            id +
            '\')!=2" label="' +
            label +
            '" prop="' +
            id +
            '">';
        html += '<el-input type="textarea"';
        html += " v-if=\"getFieldStatus('" + id + "')==0\"";
        html += " v-model=\"formData['" + id + "']\"";
        html += ' ref="formRef_' + utils.replace(id, "-", "_") + '"';
        var style = "";
        if (utils.length(width) > 0) {
            style += "width:" + width + ";";
        }
        if (utils.length(style) > 0) {
            html += ' style="' + style + '"';
        }
        if (utils.length(align) > 0) {
            html += " :input-style=\"{'text-align':'" + align + "'}\"";
        }
        if (utils.length(placeholder, false) > 0) {
            html += ' placeholder="' + placeholder + '"';
        }
        if (parseInt(maxlength) && parseInt(maxlength) > 0) {
            html += ' :maxlength="' + parseInt(maxlength) + '"';
        }
        if (parseInt(rows) && parseInt(rows) > 0) {
            html += ' :rows="' + parseInt(rows) + '"';
        }
        if (utils.length(defaultValue) > 0) {
            this.formDefaultValues.push({
                id: id,
                type: "string",
                defaultValue: defaultValue,
            });
        }
        if (allowclear) {
            html += " clearable";
        }
        if (disabled) {
            html += " disabled";
        }
        if (readonly) {
            html += " readonly";
        }

        //事件
        let events = utils.getArrayObj(eventJSON, id, "id");
        if (utils.isDef(events) && utils.length(events) > 0) {
            for (let i = 0; i < events.events.length; i++) {
                if (utils.length(events.events[i].script) > 0) {
                    html +=
                        " @" +
                        events.events[i].name +
                        "=\"execFormEvent('" +
                        id +
                        "','" +
                        events.events[i].name +
                        "',$event)\"";
                }
            }
        }
        html += ">";
        html += "</el-input>";
        html +=
            '<pre class="roadui_fromreadonly" v-else-if="getFieldStatus(\'' +
            id +
            "')==1\">{{getText('" +
            id +
            "')}}</pre>";
        html += "</el-form-item>";

        $element.after(this.escapeHTML(html));
        $element.remove();
        if (utils.inArray(this.formFields, id, "id")) {
            this.formCompileErrMsg.push("控件id：" + id + " 重复！");
        } else {
            this.formFields.push({ id: id, type: dataType, label: label });
        }
    },
    //编译数字输入框
    compile_number($element, eventJSON) {
        if (utils.isUndef($element)) {
            return;
        }
        var id = $element.attr("data-id");
        var label = $element.attr("data-label");
        var defaultValue = utils.decodeURI($element.attr("data-defaultvalue"));
        var placeholder = $element.attr("data-placeholder");
        var width = $element.attr("data-width");
        var disabled = $element.attr("data-disabled") == "true";
        var readonly = $element.attr("data-readonly") == "true";
        var step = $element.attr("data-step");
        var stepstrictly = $element.attr("data-stepstrictly") == "true"; //是否只能输入 step 的倍数
        var precision = $element.attr("data-precision");
        var min = $element.attr("data-min");
        var max = $element.attr("data-max");
        var controls = $element.attr("data-controls") == "true"; //是否显示控制按钮
        var controlsposition = $element.attr("data-controlsposition") == "true"; //在右边显示控制按钮
        var dataType = "number"; //字段数据类型

        var html =
            "<el-form-item v-if=\"getFieldStatus('" +
            id +
            '\')!=2" label="' +
            label +
            '" prop="' +
            id +
            '">';
        html += "<el-input-number";
        html += " v-if=\"getFieldStatus('" + id + "')==0\"";
        html += " v-model=\"formData['" + id + "']\"";
        html += ' ref="formRef_' + utils.replace(id, "-", "_") + '"';
        var style = "";
        if (utils.length(width) > 0) {
            style += "width:" + width + ";";
        }
        if (utils.length(style) > 0) {
            html += ' style="' + style + '"';
        }
        if (utils.length(placeholder, false) > 0) {
            html += ' placeholder="' + placeholder + '"';
        }
        if (utils.length(min) > 0) {
            html += ' :min="' + parseFloat(min) + '"';
        }
        if (utils.length(max) > 0) {
            html += ' :max="' + parseFloat(max) + '"';
        }
        if (utils.length(step) > 0) {
            html += ' :step="' + parseFloat(step) + '"';
        }
        if (utils.length(precision) > 0) {
            html += ' :precision="' + parseFloat(precision) + '"';
        }
        if (stepstrictly) {
            html += " step-strictly";
        }
        if (!controls) {
            html += ' :controls="false"';
        }
        if (controlsposition) {
            html += ' controls-position="right"';
        }
        if (utils.length(defaultValue) > 0) {
            this.formDefaultValues.push({
                id: id,
                type: "number",
                defaultValue: defaultValue,
            });
        }
        if (disabled) {
            html += " disabled";
        }
        if (readonly) {
            html += " readonly";
        }

        //事件
        let events = utils.getArrayObj(eventJSON, id, "id");
        if (utils.isDef(events) && utils.length(events) > 0) {
            for (let i = 0; i < events.events.length; i++) {
                if (utils.length(events.events[i].script) > 0) {
                    html +=
                        " @" +
                        events.events[i].name +
                        "=\"execFormEvent('" +
                        id +
                        "','" +
                        events.events[i].name +
                        "',$event)\"";
                }
            }
        }
        html += ">";
        html += "</el-input-number>";
        html +=
            '<span class="roadui_fromreadonly" v-else-if="getFieldStatus(\'' +
            id +
            "')==1\">{{getText('" +
            id +
            "')}}</span>";
        html += "</el-form-item>";

        $element.after(this.escapeHTML(html));
        $element.remove();
        if (utils.inArray(this.formFields, id, "id")) {
            this.formCompileErrMsg.push("控件id：" + id + " 重复！");
        } else {
            this.formFields.push({ id: id, type: dataType, label: label });
        }
    },
    //编译下拉选择
    compile_select($element, eventJSON) {
        if (utils.isUndef($element)) {
            return;
        }
        var id = $element.attr("data-id");
        var label = $element.attr("data-label");
        var defaultValue = utils.decodeURI($element.attr("data-defaultvalue"));
        var placeholder = $element.attr("data-placeholder");
        var width = $element.attr("data-width");
        var dataSource = $element.attr("data-dataSource");
        var search = $element.attr("data-search") == "true";
        var allowClear = $element.attr("data-allowclear") == "true";
        var multiple = $element.attr("data-multiple") == "true";
        var sqlConn = $element.attr("data-datasourcesqlconn");
        var linkageId = $element.attr("data-linkageid");
        var linkageDataSource = $element.attr("data-linkagedatasource");
        var linkageText = utils.replace(
            $element.attr("data-linkagetext"),
            "'",
            "%27",
        );
        var html =
            "<el-form-item v-if=\"getFieldStatus('" +
            id +
            '\')!=2" label="' +
            label +
            '" prop="' +
            id +
            '"';
        //如果没有设置标签宽度，则设置为0px，不留标签宽度位置。不然下拉选择级联时第二个下拉会留空。
        if (utils.length(label) === 0) {
            html += ' label-width="0px"';
        }
        html += ">";
        html += "<el-select";
        html +=
            " v-if=\"getFieldStatus('" +
            id +
            "')==0\" v-model=\"formData['" +
            id +
            "']\"";
        html += ' ref="formRef_' + utils.replace(id, "-", "_") + '"';
        if (utils.length(placeholder, false) > 0) {
            html += ' placeholder="' + placeholder + '"';
        }
        if (utils.length(defaultValue) > 0) {
            this.formDefaultValues.push({
                id: id,
                type: multiple ? "array" : "string",
                defaultValue: defaultValue,
            });
        }
        if (search) {
            html += " filterable";
        }
        if (allowClear) {
            html += " clearable";
        }
        if (multiple) {
            html += " multiple";
        }
        var style = "";
        if (utils.length(width) > 0) {
            style += "width:" + width + ";";
        }
        if (utils.length(style) > 0) {
            html += ' style="' + style + '"';
        }
        //事件
        let events = utils.getArrayObj(eventJSON, id, "id");
        let isLinkage =
            utils.length(linkageId) > 0 && utils.length(linkageDataSource) > 0;
        if (isLinkage) {
            html +=
                " @change=\"linkageAddChilds('" +
                id +
                "','" +
                linkageId +
                "','" +
                linkageDataSource +
                "','" +
                linkageText +
                "', '" +
                sqlConn +
                "')";

            if (utils.isDef(events) && utils.length(events.events) > 0) {
                let eventChange = utils.getArrayObj(events.events, "change", "name");
                if (utils.isDef(eventChange) && utils.length(eventChange.script) > 0) {
                    html += ";execFormEvent('" + id + "','change',$event)";
                }
            }
            html += '"';
            this.formSelectOptions.push({
                id: linkageId,
                source: "linkage",
                linkageSourceId: id,
                linkageDataSource: linkageDataSource,
                linkageText: linkageText,
                linkageConnId: sqlConn,
            });
        }
        switch (dataSource) {
            case "dict":
                var dataSourceDict = $element.attr("data-datasourcedict");
                var dataSourceDictValueField = $element.attr(
                    "data-datasourcedictvaluefield",
                );
                this.formSelectOptions.push({
                    id: id,
                    source: "dict",
                    dictId: dataSourceDict,
                    valueField: dataSourceDictValueField,
                });
                break;
            case "string":
                this.formSelectOptions.push({
                    id: id,
                    source: "string",
                    string: utils.decodeURI($element.attr("data-datasourcestring")),
                });
                break;
            case "sql":
                var sql = utils.decodeURI($element.attr("data-datasourcesql"));
                this.formSelectOptions.push({
                    id: id,
                    source: "sql",
                    connId: sqlConn,
                    sql: sql,
                });
                break;
            case "url":
                var url = utils.decodeURI($element.attr("data-datasourceurl"));
                this.formSelectOptions.push({ id: id, source: "url", url: url });
                break;
        }
        if (utils.isDef(events) && utils.length(events.events) > 0) {
            for (let i = 0; i < events.events.length; i++) {
                //如果是连动，不加change事件，change事件在联动时已经加了。
                if (isLinkage && events.events[i].name == "change") {
                    continue;
                }
                if (utils.length(events.events[i].script) > 0) {
                    html +=
                        " @" +
                        events.events[i].name +
                        "=\"execFormEvent('" +
                        id +
                        "','" +
                        events.events[i].name +
                        "',$event)\"";
                }
            }
        }

        html += ">";
        html +=
            "<el-option v-for=\"opt in formSelectOptions['" +
            id +
            '\']" :key="opt.value" :value="opt.value" :label="opt.label">';
        html += "</el-option>";
        html += "</el-select>";
        html +=
            "<span v-else-if=\"getFieldStatus('" +
            id +
            '\')==1" class="roadui_fromreadonly">{{getSelectTitle(\'' +
            id +
            "',formData['" +
            id +
            "'])}}</span>";
        html += "</el-form-item>";

        $element.after(this.escapeHTML(html));
        $element.remove();
        if (utils.inArray(this.formFields, id, "id")) {
            this.formCompileErrMsg.push("控件id：" + id + " 重复！");
        } else {
            this.formFields.push({
                id: id,
                type: multiple ? "json" : "string",
                label: label,
            });
        }
    },
    //编译级联选择
    compile_cascader($element, eventJSON) {
        if (utils.isUndef($element)) {
            return;
        }
        var id = $element.attr("data-id");
        var label = $element.attr("data-label");
        var defaultValue = utils.decodeURI($element.attr("data-defaultvalue"));
        var placeholder = $element.attr("data-placeholder") || "";
        var width = $element.attr("data-width");
        var expandTrigger = $element.attr("data-expandtrigger") || "click";
        var dataSource = $element.attr("data-dataSource");
        var search = $element.attr("data-search") == "true";
        var allowClear = $element.attr("data-allowclear") == "true";
        var sqlConn = $element.attr("data-datasourcesqlconn");
        var emitPath = $element.attr("data-emitPath");
        var html =
            "<el-form-item v-if=\"getFieldStatus('" +
            id +
            '\')!=2" label="' +
            label +
            '" prop="' +
            id +
            '">';
        html += "<el-cascader v-if=\"getFieldStatus('" + id + "')==0\"";
        html += " v-model=\"formData['" + id + "']\"";
        html += ' ref="formRef_' + utils.replace(id, "-", "_") + '"';
        if (utils.length(placeholder, false) > 0) {
            html += ' placeholder="' + placeholder + '"';
        }
        var props = "";
        if (emitPath == "1") {
            props += "emitPath:false,";
        }
        if (expandTrigger === "hover") {
            props += "expandTrigger:'hover',";
        }
        if (utils.length(props) > 0) {
            html += ' :props="{' + props + '}"';
        }
        if (utils.length(defaultValue) > 0) {
            this.formDefaultValues.push({
                id: id,
                type: "array",
                defaultValue: defaultValue,
            });
        }
        if (search) {
            html += " filterable";
        }
        if (allowClear) {
            html += " clearable";
        }
        var style = "";
        if (utils.length(width) > 0) {
            style += "width:" + width + ";";
        }
        if (utils.length(style) > 0) {
            html += ' style="' + style + '"';
        }
        switch (dataSource) {
            case "dict":
                var dataSourceDict = $element.attr("data-datasourcedict");
                var dataSourceDictValueField = $element.attr(
                    "data-datasourcedictvaluefield",
                );
                this.formSelectOptions.push({
                    id: id,
                    source: "cascader_dict",
                    dictId: dataSourceDict,
                    valueField: dataSourceDictValueField,
                });
                break;
            case "string":
                var dataSourceString = utils.decodeURI(
                    $element.attr("data-datasourcestring"),
                );
                this.formSelectOptions.push({
                    id: id,
                    source: "cascader_string",
                    string: dataSourceString,
                });
                break;
            case "sql":
                var sql = utils.decodeURI($element.attr("data-datasourcesql"));
                this.formSelectOptions.push({
                    id: id,
                    source: "cascader_sql",
                    connId: sqlConn,
                    sql: sql,
                });
                break;
            case "url":
                var url = utils.decodeURI($element.attr("data-datasourceurl"));
                this.formSelectOptions.push({
                    id: id,
                    source: "cascader_url",
                    url: url,
                });
                break;
        }
        html += " :options=\"formSelectOptions['" + id + "']\"";

        //事件
        let events = utils.getArrayObj(eventJSON, id, "id");
        if (utils.isDef(events) && utils.length(events) > 0) {
            for (let i = 0; i < events.events.length; i++) {
                if (utils.length(events.events[i].script) > 0) {
                    html +=
                        " @" +
                        events.events[i].name +
                        "=\"execFormEvent('" +
                        id +
                        "','" +
                        events.events[i].name +
                        "',$event)\"";
                }
            }
        }

        html += ">";
        html += "</el-cascader>";
        html +=
            "<span v-else-if=\"getFieldStatus('" +
            id +
            '\')==1" class="roadui_fromreadonly">{{getCascaderTitle(\'' +
            id +
            "',formData['" +
            id +
            "'])}}</span>";
        html += "</el-form-item>";

        $element.after(this.escapeHTML(html));
        $element.remove();
        if (utils.inArray(this.formFields, id, "id")) {
            this.formCompileErrMsg.push("控件id：" + id + " 重复！");
        } else {
            this.formFields.push({ id: id, type: "json", label: label });
        }
    },
    //编译单选按钮
    compile_radio($element, eventJSON) {
        if (utils.isUndef($element)) {
            return;
        }
        var id = $element.attr("data-id");
        var label = $element.attr("data-label");
        var defaultValue = utils.decodeURI($element.attr("data-defaultvalue"));
        var buttonStyle = $element.attr("data-buttonstyle") || "normal";
        var dataSource = $element.attr("data-dataSource");
        var sqlConn = $element.attr("data-datasourcesqlconn");

        var html =
            "<el-form-item v-if=\"getFieldStatus('" +
            id +
            '\')!=2" label="' +
            label +
            '" prop="' +
            id +
            '">';
        html += "<el-radio-group v-if=\"getFieldStatus('" + id + "')==0\"";
        html += " v-model=\"formData['" + id + "']\"";
        html += ' ref="formRef_' + utils.replace(id, "-", "_") + '"';
        if (utils.length(defaultValue) > 0) {
            this.formDefaultValues.push({
                id: id,
                type: "string",
                defaultValue: defaultValue,
            });
        }
        switch (dataSource) {
            case "dict":
                var dataSourceDict = $element.attr("data-dataSourceDict");
                var dataSourceDictValueField = $element.attr(
                    "data-datasourcedictvaluefield",
                );
                this.formSelectOptions.push({
                    id: id,
                    source: "dict",
                    dictId: dataSourceDict,
                    valueField: dataSourceDictValueField,
                });
                break;
            case "string":
                this.formSelectOptions.push({
                    id: id,
                    source: "string",
                    string: utils.decodeURI($element.attr("data-datasourcestring")),
                });
                break;
            case "sql":
                var sql = utils.decodeURI($element.attr("data-datasourcesql"));
                this.formSelectOptions.push({
                    id: id,
                    source: "sql",
                    connId: sqlConn,
                    sql: sql,
                });
                break;
            case "url":
                var url = utils.decodeURI($element.attr("data-datasourceurl"));
                this.formSelectOptions.push({ id: id, source: "url", url: url });
                break;
        }

        //事件
        let events = utils.getArrayObj(eventJSON, id, "id");
        if (utils.isDef(events) && utils.length(events) > 0) {
            for (let i = 0; i < events.events.length; i++) {
                if (utils.length(events.events[i].script) > 0) {
                    html +=
                        " @" +
                        events.events[i].name +
                        "=\"execFormEvent('" +
                        id +
                        "','" +
                        events.events[i].name +
                        "',$event)\"";
                }
            }
        }

        html += ">";
        html +=
            "<el-radio" +
            (buttonStyle === "button" ? "-button" : "") +
            " v-for=\"(option,index) in formSelectOptions['" +
            id +
            '\']" :key="\'op_\'+index" :label="option.value"' +
            (buttonStyle === "border" ? " border" : "") +
            ">{{option.label}}</el-radio" +
            (buttonStyle === "button" ? "-button" : "") +
            ">";
        html += "</el-radio-group>";
        html +=
            "<span v-else-if=\"getFieldStatus('" +
            id +
            '\')==1" class="roadui_fromreadonly">{{getSelectTitle(\'' +
            id +
            "',formData['" +
            id +
            "'])}}</span>";
        html += "</el-form-item>";

        $element.after(this.escapeHTML(html));
        $element.remove();
        if (utils.inArray(this.formFields, id, "id")) {
            this.formCompileErrMsg.push("控件id：" + id + " 重复！");
        } else {
            this.formFields.push({ id: id, type: "string", label: label });
        }
    },
    //编译复选按钮
    compile_checkbox($element, eventJSON) {
        if (utils.isUndef($element)) {
            return;
        }
        var id = $element.attr("data-id");
        var label = $element.attr("data-label");
        var defaultValue = utils.decodeURI($element.attr("data-defaultvalue"));
        var buttonStyle = $element.attr("data-buttonstyle") || "normal";
        var dataSource = $element.attr("data-dataSource");
        var sqlConn = $element.attr("data-datasourcesqlconn");

        var html =
            "<el-form-item v-if=\"getFieldStatus('" +
            id +
            '\')!=2" label="' +
            label +
            '" prop="' +
            id +
            '">';
        html += "<el-checkbox-group v-if=\"getFieldStatus('" + id + "')==0\"";
        html += " v-model=\"formData['" + id + "']\"";
        html += ' ref="formRef_' + utils.replace(id, "-", "_") + '"';
        if (utils.length(defaultValue) > 0) {
            this.formDefaultValues.push({
                id: id,
                type: "array",
                defaultValue: defaultValue,
            });
        }
        switch (dataSource) {
            case "dict":
                var dataSourceDict = $element.attr("data-dataSourceDict");
                var dataSourceDictValueField = $element.attr(
                    "data-datasourcedictvaluefield",
                );
                this.formSelectOptions.push({
                    id: id,
                    source: "dict",
                    dictId: dataSourceDict,
                    valueField: dataSourceDictValueField,
                });
                break;
            case "string":
                this.formSelectOptions.push({
                    id: id,
                    source: "string",
                    string: utils.decodeURI($element.attr("data-datasourcestring")),
                });
                break;
            case "sql":
                var sql = utils.decodeURI($element.attr("data-datasourcesql"));
                this.formSelectOptions.push({
                    id: id,
                    source: "sql",
                    connId: sqlConn,
                    sql: sql,
                });
                break;
            case "url":
                var url = utils.decodeURI($element.attr("data-datasourceurl"));
                this.formSelectOptions.push({ id: id, source: "url", url: url });
                break;
        }

        //事件
        let events = utils.getArrayObj(eventJSON, id, "id");
        if (utils.isDef(events) && utils.length(events) > 0) {
            for (let i = 0; i < events.events.length; i++) {
                if (utils.length(events.events[i].script) > 0) {
                    html +=
                        " @" +
                        events.events[i].name +
                        "=\"execFormEvent('" +
                        id +
                        "','" +
                        events.events[i].name +
                        "',$event)\"";
                }
            }
        }

        html += ">";
        html +=
            "<el-checkbox" +
            (buttonStyle === "button" ? "-button" : "") +
            " v-for=\"(option,index) in formSelectOptions['" +
            id +
            '\']" :key="\'op_\'+index" :label="option.value"' +
            (buttonStyle === "border" ? " border" : "") +
            ">{{option.label}}</el-checkbox" +
            (buttonStyle === "button" ? "-button" : "") +
            ">";
        html += "</el-checkbox-group>";
        html +=
            "<span v-else-if=\"getFieldStatus('" +
            id +
            '\')==1" class="roadui_fromreadonly">{{getSelectTitle(\'' +
            id +
            "',formData['" +
            id +
            "'])}}</span>";
        html += "</el-form-item>";

        $element.after(this.escapeHTML(html));
        $element.remove();
        if (utils.inArray(this.formFields, id, "id")) {
            this.formCompileErrMsg.push("控件id：" + id + " 重复！");
        } else {
            this.formFields.push({ id: id, type: "json", label: label });
        }
    },
    //编译开关
    compile_switch($element, eventJSON) {
        if (utils.isUndef($element)) {
            return;
        }
        var id = $element.attr("data-id");
        var label = $element.attr("data-label");

        var defaultChecked = $element.attr("data-defaultchecked") == "true";
        var checkedChildren = utils.replace(
            utils.replace($element.attr("data-checkedchildren"), "'", ""),
            '"',
            "",
        ); //选中文本
        var unCheckedChildren = utils.replace(
            utils.replace($element.attr("data-uncheckedchildren"), "'", ""),
            '"',
            "",
        ); //非选中文本
        var checkedValue = $element.attr("data-checkedvalue"); //选中值
        var unCheckedValue = $element.attr("data-uncheckedvalue"); //非选中值
        var checkedColor = $element.attr("data-checkedcolor"); //选中颜色
        var unCheckedColor = $element.attr("data-uncheckedcolor"); //非选中颜色
        var inlinePrompt = $element.attr("data-inlineprompt") == "true"; //文档是否显示在点内

        var html =
            "<el-form-item v-if=\"getFieldStatus('" +
            id +
            '\')!=2" label="' +
            label +
            '" prop="' +
            id +
            '">';
        html += "<el-switch v-if=\"getFieldStatus('" + id + "')==0\"";
        html += " v-model=\"formData['" + id + "']\"";
        html += ' ref="formRef_' + utils.replace(id, "-", "_") + '"';
        if (defaultChecked) {
            this.formDefaultValues.push({
                id: id,
                type: utils.length(checkedValue) > 0 ? "string" : "boolean",
                defaultValue: utils.length(checkedValue) > 0 ? checkedValue : "true",
            });
        }
        if (utils.length(checkedChildren) > 0) {
            html += ' active-text="' + checkedChildren + '"';
        }
        if (utils.length(unCheckedChildren) > 0) {
            html += ' inactive-text="' + unCheckedChildren + '"';
        }
        if (utils.length(checkedValue) > 0) {
            //if (utils.isNumberString(checkedValue)) {
            //    html += ' :active-value="' + checkedValue + '"';
            //} else {
            html += ' active-value="' + checkedValue + '"';
            //}
        }
        if (utils.length(unCheckedValue) > 0) {
            //if (utils.isNumberString(unCheckedValue)) {
            //    html += ' :inactive-value="' + unCheckedValue + '"';
            //} else {
            html += ' inactive-value="' + unCheckedValue + '"';
            //}
        }
        if (utils.length(checkedColor) > 0) {
            html += ' active-color="' + checkedColor + '"';
        }
        if (utils.length(unCheckedColor) > 0) {
            html += ' inactive-color="' + unCheckedColor + '"';
        }
        if (inlinePrompt) {
            html += " inline-prompt";
        }

        //事件
        let events = utils.getArrayObj(eventJSON, id, "id");
        if (utils.isDef(events) && utils.length(events) > 0) {
            for (let i = 0; i < events.events.length; i++) {
                if (utils.length(events.events[i].script) > 0) {
                    html +=
                        " @" +
                        events.events[i].name +
                        "=\"execFormEvent('" +
                        id +
                        "','" +
                        events.events[i].name +
                        "',$event)\"";
                }
            }
        }

        html += ">";
        html += "</el-switch>";
        html +=
            "<span v-else-if=\"getFieldStatus('" +
            id +
            '\')==1" class="roadui_fromreadonly">{{getSwitchTitle(formData[\'' +
            id +
            "'],'" +
            unCheckedChildren +
            "','" +
            checkedChildren +
            "','" +
            checkedValue +
            "')}}</span>";
        html += "</el-form-item>";

        $element.after(this.escapeHTML(html));
        $element.remove();
        if (utils.inArray(this.formFields, id, "id")) {
            this.formCompileErrMsg.push("控件id：" + id + " 重复！");
        } else {
            this.formFields.push({ id: id, type: "string", label: label });
        }
    },
    //编译隐藏域
    compile_hidden($element) {
        if (utils.isUndef($element)) {
            return;
        }
        var id = $element.attr("data-id");
        var label = $element.attr("data-label");
        var defaultValue = utils.decodeURI($element.attr("data-defaultvalue"));

        var html = '<input type="hidden"';
        html += " v-model=\"formData['" + id + "']\"";
        html += ' ref="formRef_' + utils.replace(id, "-", "_") + '"';
        if (utils.length(defaultValue) > 0) {
            this.formDefaultValues.push({
                id: id,
                type: "string",
                defaultValue: defaultValue,
            });
        }
        html += "/>";

        $element.after(this.escapeHTML(html));
        $element.remove();
        if (utils.inArray(this.formFields, id, "id")) {
            this.formCompileErrMsg.push("控件id：" + id + " 重复！");
        } else {
            this.formFields.push({ id: id, type: "string", label: label });
        }
    },
    //编译日期时间
    compile_datetime($element, eventJSON) {
        if (utils.isUndef($element)) {
            return;
        }
        var id = $element.attr("data-id");
        var label = $element.attr("data-label");
        var defaultValue = utils.decodeURI($element.attr("data-defaultvalue"));
        var width = $element.attr("data-width");
        var placeholder = $element.attr("data-placeholder");
        var selectType = $element.attr("data-selecttype") || ""; //选择类型 year/month/date/dates/datetime/week/datetimerange/daterange/monthrange/time/timerange
        var shortcuts = $element.attr("data-shortcuts") == "true";
        var clearable = $element.attr("data-clearable") == "true";
        var format = $element.attr("data-format") || "";
        var valueFormat = $element.attr("data-valueformat") || "";
        var separator = $element.attr("data-separator") || "";
        var startTime = $element.attr("data-starttime") || "";
        var endTime = $element.attr("data-endtime") || "";
        var minTime = $element.attr("data-mintime") || "";
        var maxTime = $element.attr("data-maxtime") || "";
        var stepTime = $element.attr("data-steptime") || "";

        var html =
            "<el-form-item v-if=\"getFieldStatus('" +
            id +
            '\')!=2" label="' +
            label +
            '" prop="' +
            id +
            '">';
        if (selectType == "time") {
            //选择时间
            html +=
                "<el-time-select v-if=\"getFieldStatus('" +
                id +
                "')==0\" v-model=\"formData['" +
                id +
                "']\"";
            html += ' ref="formRef_' + utils.replace(id, "-", "_") + '"';
            html +=
                ' format="' + (utils.length(format) > 0 ? format : "HH:mm:ss") + '"';
            if (utils.length(startTime) > 0) {
                html += ' start="' + startTime + '"';
            }
            if (utils.length(endTime) > 0) {
                html += ' end="' + endTime + '"';
            }
            if (utils.length(minTime) > 0) {
                html += ' min-time="' + minTime + '"';
            }
            if (utils.length(maxTime) > 0) {
                html += ' max-time="' + maxTime + '"';
            }
            if (utils.length(stepTime) > 0) {
                html += ' step="' + stepTime + '"';
            }
            if (clearable) {
                html += " clearable";
            } else {
                html += ' :clearable="false"';
            }
            if (utils.length(placeholder, false) > 0) {
                html += ' placeholder="' + placeholder + '"';
            }
            var style = "";
            if (utils.length(width) > 0) {
                style += "width:" + width + ";";
                style += "max-width:" + width + ";";
            }
            if (utils.length(style) > 0) {
                html += ' style="' + style + '"';
            }

            //事件
            let events = utils.getArrayObj(eventJSON, id, "id");
            if (utils.isDef(events) && utils.length(events) > 0) {
                for (let i = 0; i < events.events.length; i++) {
                    if (utils.length(events.events[i].script) > 0) {
                        html +=
                            " @" +
                            events.events[i].name +
                            "=\"execFormEvent('" +
                            id +
                            "','" +
                            events.events[i].name +
                            "',$event)\"";
                    }
                }
            }

            html += ">";
            html += "</el-time-select>";
        } else {
            html +=
                "<el-date-picker v-if=\"getFieldStatus('" +
                id +
                "')==0\" v-model=\"formData['" +
                id +
                '\']" type="' +
                selectType +
                '"';
            html += ' ref="formRef_' + utils.replace(id, "-", "_") + '"';
            //增加如果是移动端，不能输入。
            html += ' :editable="!isMobile"';
            if (utils.length(defaultValue) > 0) {
                this.formDefaultValues.push({
                    id: id,
                    type: "string",
                    defaultValue: defaultValue,
                });
            }
            if (utils.length(placeholder, false) > 0) {
                html += ' placeholder="' + placeholder + '"';
            }
            if (utils.length(format) > 0) {
                html += ' format="' + format + '"';
            }
            if (utils.length(valueFormat) > 0) {
                html += ' value-format="' + valueFormat + '"';
            }

            var style = "";
            if (utils.length(width) > 0) {
                style += "width:" + width + ";";
                style += "max-width:" + width + ";";
            }
            if (utils.length(style) > 0) {
                html += ' style="' + style + '"';
            }
            //如果是选择快捷日期，并且是选择范围才显示快捷选择。
            if (
                shortcuts &&
                (selectType === "daterange" || selectType === "datetimerange")
            ) {
                html += ' :shortcuts="utils.dateShortucts"';
            }
            //选择范围分隔符
            if (utils.length(separator) > 0) {
                html += ' range-separator="' + separator + '"';
            }
            if (clearable) {
                html += " clearable";
            } else {
                html += ' :clearable="false"';
            }

            //事件
            let events = utils.getArrayObj(eventJSON, id, "id");
            if (utils.isDef(events) && utils.length(events) > 0) {
                for (let i = 0; i < events.events.length; i++) {
                    if (utils.length(events.events[i].script) > 0) {
                        html +=
                            " @" +
                            events.events[i].name +
                            "=\"execFormEvent('" +
                            id +
                            "','" +
                            events.events[i].name +
                            "',$event)\"";
                    }
                }
            }

            html += ">";
            html += "</el-date-picker>";
        }

        html +=
            "<span v-else-if=\"getFieldStatus('" +
            id +
            '\')==1" class="roadui_fromreadonly">' +
            (selectType == "time"
                ? "{{getText('" + id + "')}}"
                : "{{getDateTimeTitle(formData['" +
                id +
                "'],'" +
                format +
                "','" +
                separator +
                "')}}") +
            "</span>";
        html += "</el-form-item>";

        $element.after(this.escapeHTML(html));
        $element.remove();
        if (utils.inArray(this.formFields, id, "id")) {
            this.formCompileErrMsg.push("控件id：" + id + " 重复！");
        } else {
            this.formFields.push({
                id: id,
                type:
                    selectType == "time"
                        ? "string"
                        : selectType.indexOf("range") > 0
                            ? "json"
                            : "datetime",
                format: selectType == "time" ? "" : format,
                label: label,
            });
        }
    },
    //编译数据字典
    compile_dictionary($element, eventJSON) {
        if (utils.isUndef($element)) {
            return;
        }
        var id = $element.attr("data-id");
        var label = $element.attr("data-label");
        var defaultValue = utils.decodeURI($element.attr("data-defaultvalue"));
        var width = $element.attr("data-width");
        var placeholder = $element.attr("data-placeholder");
        var range = $element.attr("data-range");
        var multiple = $element.attr("data-multiple") == "true";
        var showRoot = $element.attr("data-showroot") == "true";
        var selectRoot = $element.attr("data-selectroot") == "true";
        var selectParent = $element.attr("data-selectparent") == "true";
        var multiple = $element.attr("data-multiple") == "true"; //是否多选
        var selectSize = $element.attr("data-selectsize"); //选择个数

        var html =
            "<el-form-item v-if=\"getFieldStatus('" +
            id +
            '\')!=2" label="' +
            label +
            '" prop="' +
            id +
            '">';
        html +=
            "<el-selectdict :status=\"getFieldStatus('" +
            id +
            "')\" v-model=\"formData['" +
            id +
            "']\"";
        html += ' ref="formRef_' + utils.replace(id, "-", "_") + '"';

        if (utils.length(defaultValue) > 0) {
            this.formDefaultValues.push({
                id: id,
                type: "string",
                defaultValue: defaultValue,
            });
        }
        if (utils.length(placeholder, false) > 0) {
            html += ' placeholder="' + placeholder + '"';
        }
        if (utils.length(range) > 0) {
            html += ' root="' + range + '"';
        }
        if (multiple) {
            html += " multiple";
        }
        html += ' :show-root="' + (showRoot ? "true" : "false") + '"';
        html += ' :select-root="' + (selectRoot ? "true" : "false") + '"';
        html += ' :select-parent="' + (selectParent ? "true" : "false") + '"';
        if (utils.isNumberString(selectSize)) {
            html += ' :multiple-limit="' + selectSize + '"';
        }

        var style = "";
        if (utils.length(width) > 0) {
            style += "width:" + width + ";";
        }
        if (utils.length(style) > 0) {
            html += ' style="' + style + '"';
        }

        //事件
        let events = utils.getArrayObj(eventJSON, id, "id");
        if (utils.isDef(events) && utils.length(events) > 0) {
            for (let i = 0; i < events.events.length; i++) {
                if (utils.length(events.events[i].script) > 0) {
                    html +=
                        " @" +
                        events.events[i].name +
                        "=\"execFormEvent('" +
                        id +
                        "','" +
                        events.events[i].name +
                        "',$event)\"";
                }
            }
        }

        html += "></el-selectdict>";
        html += "</el-form-item>";

        $element.after(this.escapeHTML(html));
        $element.remove();
        if (utils.inArray(this.formFields, id, "id")) {
            this.formCompileErrMsg.push("控件id：" + id + " 重复！");
        } else {
            this.formFields.push({ id: id, type: "string", label: label });
        }
    },
    //编译组织架构
    compile_organize($element, eventJSON) {
        if (utils.isUndef($element)) {
            return;
        }
        var id = $element.attr("data-id");
        var label = $element.attr("data-label");
        var defaultValue = utils.decodeURI($element.attr("data-defaultvalue"));
        var width = $element.attr("data-width");
        var placeholder = $element.attr("data-placeholder");
        var range = $element.attr("data-range");
        var selectType = $element.attr("data-selecttype");
        var selectRange = $element.attr("data-selectrange");
        var selectSize = $element.attr("data-selectsize");
        var multiple = $element.attr("data-multiple") == "true";

        var html =
            "<el-form-item v-if=\"getFieldStatus('" +
            id +
            '\')!=2" label="' +
            label +
            '" prop="' +
            id +
            '">';
        html +=
            "<el-selectorg :status=\"getFieldStatus('" +
            id +
            "')\" v-model=\"formData['" +
            id +
            "']\"";
        html +=
            ' ref="formRef_' +
            utils.replace(id, "-", "_") +
            '" :is-mobile="\'1\'==isMobile"';

        if (utils.length(defaultValue) > 0) {
            this.formDefaultValues.push({
                id: id,
                type: "string",
                defaultValue: defaultValue,
            });
        }
        if (utils.length(placeholder, false) > 0) {
            html += ' placeholder="' + placeholder + '"';
        }
        if (!multiple) {
            html += ' :multiple="false"';
        }
        if (utils.isNumberString(selectSize)) {
            html += ' :multiple-limit="' + selectSize + '"';
        }
        html += " clearable";
        var sRange = [];
        if (utils.length(range) > 0) {
            sRange.push(range.split(","));
        }
        if (utils.length(selectRange) > 0) {
            sRange.push(selectRange);
        }
        if (utils.length(sRange) > 0) {
            html += ' select-range="' + sRange.join(",") + '"';
        }
        if (utils.length(selectType) > 0) {
            html += ' select-type="' + selectType + '"';
        }

        var style = "";
        if (utils.length(width) > 0) {
            style += "width:" + width + ";";
        }
        if (utils.length(style) > 0) {
            html += ' style="' + style + '"';
        }

        //事件
        let events = utils.getArrayObj(eventJSON, id, "id");
        if (utils.isDef(events) && utils.length(events) > 0) {
            for (let i = 0; i < events.events.length; i++) {
                if (utils.length(events.events[i].script) > 0) {
                    html +=
                        " @" +
                        events.events[i].name +
                        "=\"execFormEvent('" +
                        id +
                        "','" +
                        events.events[i].name +
                        "',$event)\"";
                }
            }
        }

        html += "></el-selectorg>";
        html += "</el-form-item>";

        $element.after(this.escapeHTML(html));
        $element.remove();
        if (utils.inArray(this.formFields, id, "id")) {
            this.formCompileErrMsg.push("控件id：" + id + " 重复！");
        } else {
            this.formFields.push({ id: id, type: "string", label: label });
        }
    },
    //编译评分
    compile_appraise($element, eventJSON) {
        if (utils.isUndef($element)) {
            return;
        }
        var id = $element.attr("data-id");
        var label = $element.attr("data-label");
        var defaultValue = utils.decodeURI($element.attr("data-defaultvalue"));
        var customIcon = $element.attr("data-customicon");
        var allowHalf = $element.attr("data-allowhalf") == "true";
        //var allowClear = $element.attr("data-allowclear") == 'true';
        var count = $element.attr("data-count");

        var html =
            "<el-form-item v-if=\"getFieldStatus('" +
            id +
            '\')!=2" label="' +
            label +
            '" prop="' +
            id +
            '">';
        html +=
            "<el-rate v-model=\"formData['" +
            id +
            "']\" :disabled=\"getFieldStatus('" +
            id +
            '\')==1" size="large"';
        html += ' ref="formRef_' + utils.replace(id, "-", "_") + '"';
        if (utils.length(defaultValue) > 0 && parseFloat(defaultValue) > 0) {
            this.formDefaultValues.push({
                id: id,
                type: "number",
                defaultValue: defaultValue,
            });
        }
        if (allowHalf) {
            html += " allow-half";
        }
        if (utils.length(count) > 0 && parseInt(count) > 0) {
            html += ' :max="' + count + '"';
        }
        if (utils.length(customIcon) > 0) {
            html +=
                " :icons=\"['" +
                customIcon +
                "','" +
                customIcon +
                "','" +
                customIcon +
                '\']" void-icon="' +
                customIcon +
                '"';
        }

        //事件
        let events = utils.getArrayObj(eventJSON, id, "id");
        if (utils.isDef(events) && utils.length(events) > 0) {
            for (let i = 0; i < events.events.length; i++) {
                if (utils.length(events.events[i].script) > 0) {
                    html +=
                        " @" +
                        events.events[i].name +
                        "=\"execFormEvent('" +
                        id +
                        "','" +
                        events.events[i].name +
                        "',$event)\"";
                }
            }
        }

        html += ">";
        html += "</el-rate>";
        html += "</el-form-item>";

        $element.after(this.escapeHTML(html));
        $element.remove();
        if (utils.inArray(this.formFields, id, "id")) {
            this.formCompileErrMsg.push("控件id：" + id + " 重复！");
        } else {
            this.formFields.push({ id: id, type: "number", label: label });
        }
    },
    //编译Html编辑器
    compile_html($element) {
        if (utils.isUndef($element)) {
            return;
        }
        var id = $element.attr("data-id");
        var label = $element.attr("data-label");
        var defaultValue = utils.decodeURI($element.attr("data-defaultvalue"));
        var toolbar = $element.attr("data-toolbar");
        var width = $element.attr("data-width");
        var height = $element.attr("data-height");
        var placeholder = $element.attr("data-placeholder");

        var html =
            "<el-form-item v-if=\"getFieldStatus('" +
            id +
            '\')!=2" label="' +
            label +
            '" prop="' +
            id +
            '">';
        html +=
            "<el-ckeditor :status=\"getFieldStatus('" +
            id +
            "')\" v-model=\"formData['" +
            id +
            "']\"";
        html += ' ref="formRef_' + utils.replace(id, "-", "_") + '"';
        if (utils.length(defaultValue) > 0) {
            this.formDefaultValues.push({
                id: id,
                type: "string",
                defaultValue: defaultValue,
            });
        }
        if (utils.length(placeholder, false) > 0) {
            html += ' placeholder="' + placeholder + '"';
        }
        if (utils.isNumberString(toolbar)) {
            html += ' :toolbar="' + toolbar + '"';
        }
        if (utils.length(width) > 0) {
            html += ' width="' + width + '"';
        }
        if (utils.isNumberString(height) > 0) {
            html += ' :height="' + height + '"';
        }

        html += ">";
        html += "</el-ckeditor>";
        html += "</el-form-item>";

        $element.after(this.escapeHTML(html));
        $element.remove();
        if (utils.inArray(this.formFields, id, "id")) {
            this.formCompileErrMsg.push("控件id：" + id + " 重复！");
        } else {
            this.formFields.push({ id: id, type: "string", label: label });
        }
    },
    //编译label
    compile_label($element) {
        if (utils.isUndef($element)) {
            return;
        }
        var id = $element.attr("data-id");
        var label = $element.attr("data-label");
        var defaultValue = utils.decodeURI($element.attr("data-defaultvalue"));
        var cssStyle = utils.decodeURI($element.attr("data-style"));

        var html =
            "<el-form-item v-if=\"getFieldStatus('" +
            id +
            '\')!=2" label="' +
            label +
            '" prop="' +
            id +
            '">';
        html += "<label";
        html += ' ref="formRef_' + utils.replace(id, "-", "_") + '"';
        var style = "color:var(--el-text-color-regular);";
        if (utils.length(cssStyle) > 0) {
            style += utils.replace(cssStyle, '"', "");
        }
        html += ' style="' + style + '"';
        if (utils.length(defaultValue) > 0) {
            this.formDefaultValues.push({
                id: id,
                type: "string",
                isSet: $element.attr("data-isset") == "true" ? 1 : 0,
                defaultValue: defaultValue,
            });
        }

        html += ">";
        html += "{{formData['" + id + "']}}";
        html += "</label>";
        html += "</el-form-item>";

        $element.after(this.escapeHTML(html));
        $element.remove();
        if (utils.inArray(this.formFields, id, "id")) {
            this.formCompileErrMsg.push("控件id：" + id + " 重复！");
        } else {
            this.formFields.push({ id: id, type: "string", label: label });
        }
    },
    //编译按钮
    compile_button($element, attJSON, eventJSON) {
        if (utils.isUndef($element)) {
            return;
        }
        var id = $element.attr("data-id");
        var label = $element.attr("data-label");
        var width = $element.attr("data-width");
        var buttontype = $element.attr("data-buttontype");
        var icon = $element.attr("data-icon");

        var html = "<el-form-item v-if=\"getFieldStatus('" + id + "')!=2\">";
        html += "<el-button :disabled=\"getFieldStatus('" + id + "')==1\"";
        html += ' ref="formRef_' + utils.replace(id, "-", "_") + '"';
        if (utils.length(buttontype) > 0) {
            html += buttontype === "text" ? " text" : ' type="' + buttontype + '"';
        }
        if (utils.length(width) > 0) {
            html += ' style="width:' + width + ';"';
        }
        if (utils.length(icon) > 0) {
            html += ' icon="' + icon + '"';
        }

        //事件
        let events = utils.getArrayObj(eventJSON, id, "id");
        if (utils.isDef(events) && utils.length(events) > 0) {
            for (let i = 0; i < events.events.length; i++) {
                if (utils.length(events.events[i].script) > 0) {
                    html +=
                        " @" +
                        events.events[i].name +
                        "=\"execFormEvent('" +
                        id +
                        "','" +
                        events.events[i].name +
                        "',$event)\"";
                }
            }
        }

        html += ">";
        html += label;
        html += "</el-button>";
        html += "</el-form-item>";

        $element.after(this.escapeHTML(html));
        $element.remove();
        if (utils.inArray(this.formFields, id, "id")) {
            this.formCompileErrMsg.push("控件id：" + id + " 重复！");
        } else {
            this.formFields.push({ id: id, type: "string", label: label });
        }
    },
    //编译数据表格
    compile_datatable($element, attJSON) {
        if (utils.isUndef($element)) {
            return;
        }
        var id = $element.attr("data-id");
        var label = $element.attr("data-label");
        var width = $element.attr("data-width");
        var height = $element.attr("data-height");
        var border = $element.attr("data-border") == "true";
        var stripe = $element.attr("data-stripe") == "true"; //是否是斑马纹表格
        var size = $element.attr("data-size"); //default large small
        var columns = utils.decodeURI($element.attr("data-columns"));
        var dataSource = $element.attr("data-datasource");
        var dataSourceSqlConn = $element.attr("data-datasourcesqlconn");
        var dataSourceText = utils.decodeURI($element.attr("data-datasourcetext"));

        if (utils.length(dataSource) > 0 && utils.length(dataSourceText) > 0) {
            this.formDefaultValues.push({
                id: id,
                type: "datatable",
                dataSource: dataSource,
                dataSourceText: dataSourceText,
                dataSourceSqlConn: dataSourceSqlConn,
            });
        }

        var html = "<el-form-item";
        if (utils.length(label) > 0) {
            html += ' label="' + label + '"';
        }
        html += ">";
        html += "<el-table :data=\"formData['" + id + "']\"";
        html += ' ref="formRef_' + utils.replace(id, "-", "_") + '"';
        if (utils.length(size) > 0) {
            html += ' size="' + size + '"';
        }
        if (border) {
            html += " border";
        }
        if (stripe) {
            html += " stripe";
        }

        var style = "width:" + (utils.length(width) > 0 ? width : "100%");
        html += ' style="' + style + '"';

        if (utils.length(height) > 0) {
            html += utils.isNumberString(height)
                ? ' :height="' + height + '"'
                : ' height="' + height + '"';
        }
        html += ">";
        if (utils.length(columns) > 0) {
            html += columns;
        }
        html += "</el-table>";
        html += "</el-form-item>";

        $element.after(this.escapeHTML(html));
        $element.remove();
        if (utils.inArray(this.formFields, id, "id")) {
            this.formCompileErrMsg.push("控件id：" + id + " 重复！");
        } else {
            this.formFields.push({ id: id, type: "string", label: label });
        }
    },
    //编译签章
    compile_signature($element) {
        if (utils.isUndef($element)) {
            return;
        }
        var id = $element.attr("data-id");
        var label = $element.attr("data-label");
        var buttontype = $element.attr("data-buttontype") || "";
        var sign = $element.attr("data-sign") == "true"; //是否默认已签

        this.formDefaultValues.push({
            id: id,
            type: "string",
            defaultValue: sign ? "{<UserSign>}" : "",
        });

        var html =
            "<el-form-item v-if=\"getFieldStatus('" +
            id +
            '\')!=2" label="' +
            label +
            '" prop="' +
            id +
            '">';
        html +=
            "<el-button v-if=\"getFieldStatus('" +
            id +
            "')==0\"" +
            (buttontype === "text" ? " text" : ' type="' + buttontype + '"') +
            ' style="margin-right:12px" @click="formData[\'' +
            id +
            "']=utils.length(formData['" +
            id +
            "'])===0?formSign:'';\">{{utils.length(formData['" +
            id +
            "'])===0?'签章':'取消签章'}}</el-button>";
        html += "<el-usersign :sign=\"formData['" + id + "']\"";
        html += ' ref="formRef_' + utils.replace(id, "-", "_") + '"';
        html += ">";
        html += "</el-usersign>";
        html += "</el-form-item>";

        $element.after(this.escapeHTML(html));
        $element.remove();
        if (utils.inArray(this.formFields, id, "id")) {
            this.formCompileErrMsg.push("控件id：" + id + " 重复！");
        } else {
            this.formFields.push({ id: id, type: "string", label: label });
        }
    },
    //编译流水号
    compile_serialnumber($element, attJSON) {
        if (utils.isUndef($element)) {
            return;
        }
        var id = $element.attr("data-id");
        var label = $element.attr("data-label");
        var serial =
            JSON.parse(utils.decodeURI($element.attr("data-serial"))) || []; //$element.attr("data-serial") || '';
        var placeholder = $element.attr("data-placeholder") || "自动生成流水号";

        var html =
            "<el-form-item v-if=\"getFieldStatus('" +
            id +
            '\')!=2" label="' +
            label +
            '" prop="' +
            id +
            '">';
        html += '<span class="roadui_note">';
        html +=
            "{{utils.length(formData['" +
            id +
            "'])===0?'" +
            placeholder +
            "':formData['" +
            id +
            "']}}";
        html += "</span>";
        html += "</el-form-item>";

        attJSON["serialNumber"].push({ fieldId: id, serials: serial });

        $element.after(this.escapeHTML(html));
        $element.remove();
        if (utils.inArray(this.formFields, id, "id")) {
            this.formCompileErrMsg.push("控件id：" + id + " 重复！");
        } else {
            this.formFields.push({ id: id, type: "string", label: label });
        }
    },
    //编译附件
    compile_files($element, eventJSON) {
        if (utils.isUndef($element)) {
            return;
        }
        var id = $element.attr("data-id");
        var label = $element.attr("data-label");
        var width = $element.attr("data-width");
        var placeholder = $element.attr("data-placeholder") || "";
        var filetype = $element.attr("data-filetype") || "";
        var showtype = $element.attr("data-showtype") || "link";
        var showstyle = utils.decodeURI($element.attr("data-showstyle") || "");
        var showimg = $element.attr("data-showimg") == "true";
        var showindex = $element.attr("data-showindex") == "true";
        var limit = $element.attr("data-limit");
        var size = $element.attr("data-size") || ""; //单个文件大小限制，单位：mb
        var controlType = $element.attr("data-controlType") || "0"; //控件类型 0:弹出层的方式  1:ELEMENT自带样式
        var controlShowType = $element.attr("data-controlShowType") || "0"; //控件为ELEMENT自带样式时的显示类型 0:列表 1：照片墙 2：头像
        let controlShowType1 = utils.isNumberString(controlShowType)
            ? controlShowType
            : "0";
        var tip = utils.decodeURI($element.attr("data-tip") || ""); ////控件为ELEMENT自带样式时的提示文字
        var buttonText = utils.decodeURI($element.attr("data-buttonText") || ""); ////控件为ELEMENT自带样式时的上传按钮文字

        var html =
            "<el-form-item v-if=\"getFieldStatus('" +
            id +
            '\')!=2" label="' +
            label +
            '" prop="' +
            id +
            '">';
        html +=
            "<el-selectfile :status=\"getFieldStatus('" +
            id +
            "')\" v-model=\"formData['" +
            id +
            "']\"";
        html += ' :ismobile="isMobile"';
        html += ' ref="formRef_' + utils.replace(id, "-", "_") + '"';
        if (utils.length(placeholder, false) > 0) {
            html += ' placeholder="' + placeholder + '"';
        }
        if (utils.length(filetype) > 0) {
            html += ' accept="' + filetype + '"';
        }
        html += ' show-type="' + showtype + '"';
        if (showimg) {
            html += " show-img";
        }
        if (!showindex) {
            html += ' :show-index="false"';
        }
        if (utils.isNumberString(limit)) {
            html += ' :limit="' + limit + '"';
        }
        if (parseFloat(size)) {
            html += ' :size="' + parseFloat(size) + '"';
        }
        if (utils.length(tip) > 0) {
            html += ' tip="' + tip + '"';
        }
        if (utils.length(buttonText) > 0) {
            html += ' button-text="' + buttonText + '"';
        }
        html += ' :control-type="' + (controlType == "1" ? "1" : "0") + '"';

        html += ' :control-show-type="' + controlShowType1 + '"';
        html +=
            ' list-type="' +
            (controlShowType1 == "2" ? "picture-card" : "text") +
            '"';
        if (utils.length(showstyle) > 0) {
            html += ' show-style="' + showstyle + '"';
        }
        var style = "";
        if (utils.length(width) > 0) {
            style += "width:" + width + ";";
        }
        if (utils.length(style) > 0) {
            html += ' style="' + style + '"';
        }

        //事件
        let events = utils.getArrayObj(eventJSON, id, "id");
        if (utils.isDef(events) && utils.length(events) > 0) {
            for (let i = 0; i < events.events.length; i++) {
                if (utils.length(events.events[i].script) > 0) {
                    html +=
                        " @" +
                        events.events[i].name +
                        "=\"execFormEvent('" +
                        id +
                        "','" +
                        events.events[i].name +
                        "',$event)\"";
                }
            }
        }

        html += ">";
        html += "</el-selectfile>";
        html += "</el-form-item>";
        $element.after(this.escapeHTML(html));
        $element.remove();
        if (utils.inArray(this.formFields, id, "id")) {
            this.formCompileErrMsg.push("控件id：" + id + " 重复！");
        } else {
            this.formFields.push({ id: id, type: "string", label: label });
        }
    },
    //编译弹出选择
    compile_selectdiv($element, eventJSON) {
        if (utils.isUndef($element)) {
            return;
        }
        var id = $element.attr("data-id");
        var label = $element.attr("data-label");
        var defaultvalue = utils.decodeURI(
            $element.attr("data-defaultvalue") || "",
        );
        var applibraryid = $element.attr("data-applibraryid") || "";
        var applibraryAddress = utils.decodeURI(
            $element.attr("data-applibraryaddress") || "",
        );
        var valuefield = $element.attr("data-valuefield") || "";
        var titlefield = $element.attr("data-titlefield") || "";
        var valueseparator = $element.attr("data-valueseparator") || "";
        var titleseparator = $element.attr("data-titleseparator") || "";
        var modaltitle = $element.attr("data-modaltitle") || "";
        var placeholder = $element.attr("data-placeholder") || "";
        var width = $element.attr("data-width") || "";
        var modalwidth = $element.attr("data-modalwidth") || "";
        //var modalheight = $element.attr("data-modalheight") || '';
        var params = utils.decodeURI($element.attr("data-params") || "");

        var html =
            "<el-form-item v-if=\"getFieldStatus('" +
            id +
            '\')!=2" label="' +
            label +
            '" prop="' +
            id +
            '">';
        html +=
            "<el-selectdiv :status=\"getFieldStatus('" +
            id +
            "')\" v-model=\"formData['" +
            id +
            "']\"";
        html += ' ref="formRef_' + utils.replace(id, "-", "_") + '"';
        if (utils.length(placeholder, false) > 0) {
            html += ' placeholder="' + placeholder + '"';
        }
        if (utils.length(defaultvalue) > 0) {
            this.formDefaultValues.push({
                id: id,
                type: "string",
                defaultValue: defaultvalue,
            });
        }
        html += ' applibrary-id="' + applibraryid + '"';
        html += ' applibrary-address="' + applibraryAddress + '"';
        html += ' value-field="' + valuefield + '"';
        html += ' title-field="' + titlefield + '"';
        if (utils.length(valueseparator) > 0) {
            html += ' value-separator="' + valueseparator + '"';
        }
        if (utils.length(titleseparator) > 0) {
            html += ' title-separator="' + titleseparator + '"';
        }
        html += ' modal-title="' + modaltitle + '"';
        if (utils.length(modalwidth) > 0) {
            html += ' modal-width="' + modalwidth + 'px"';
        }
        if (utils.length(width) > 0) {
            html += ' style="width:' + width + ';"';
        }
        if (utils.length(params) > 0) {
            html += ' :query-params="' + params + '"';
        }

        //事件
        let events = utils.getArrayObj(eventJSON, id, "id");
        if (utils.isDef(events) && utils.length(events) > 0) {
            for (let i = 0; i < events.events.length; i++) {
                if (utils.length(events.events[i].script) > 0) {
                    html +=
                        " @" +
                        events.events[i].name +
                        "=\"execFormEvent('" +
                        id +
                        "','" +
                        events.events[i].name +
                        "',$event)\"";
                }
            }
        }

        html += ">";
        html += "</el-selectdiv>";
        html += "</el-form-item>";
        $element.after(this.escapeHTML(html));
        $element.remove();
        if (utils.inArray(this.formFields, id, "id")) {
            this.formCompileErrMsg.push("控件id：" + id + " 重复！");
        } else {
            this.formFields.push({ id: id, type: "string", label: label });
        }
    },

    //编译子表
    compile_subtable($element, attJSON, subtableJSON, eventJSON) {
        if (utils.isUndef($element)) {
            return;
        }
        var id = $element.attr("data-id");
        this.formSubTableIds.push(id); //记录子表ID，便于删除多余的子表设置。
        var subtableFields = new Array(); //记录子表字段
        var subtableSet = utils.getArrayObj(subtableJSON, id, "id");
        if (utils.isUndef(subtableSet)) {
            $element.remove();
            return;
        }
        var label = subtableSet.label || "";
        var columns = subtableSet.columns;
        var columnAddData = {}; //点添加一行时添加的初始数据

        var html = '<el-form-item label-width="auto" label="' + label + '"';
        html += ">";

        const buttonSize = "small"; //按钮大小
        //移动端子表
        html +=
            '<el-table v-if="\'1\'==isMobile" :row-key="function(row){return row.key;}"';
        if (subtableSet.pager) {
            html +=
                ' v-loading="subTableLoading" :data="utils.hasKey(formData,\'' +
                id +
                "')&&utils.isDef(formData['" +
                id +
                "'])?formData['" +
                id +
                "'].slice(utils.hasKey(subTablePagers,'" +
                id +
                "')&&utils.isDef(subTablePagers['" +
                id +
                "'])?subTablePagers['" +
                id +
                "'].start||0:0,utils.hasKey(subTablePagers,'" +
                id +
                "')&&utils.isDef(subTablePagers['" +
                id +
                "'])?subTablePagers['" +
                id +
                "'].end||10:10):[]\"";
        } else {
            html += " :data=\"formData['" + id + "']\"";
        }
        if (subtableSet.bordered) {
            html += " border";
        }
        if (subtableSet.stripe) {
            html += " stripe";
        }
        if (subtableSet.height) {
            html +=
                " " +
                (utils.isNumberString(subtableSet.height) ? ":" : "") +
                'height="' +
                subtableSet.height +
                '"';
        }
        if (utils.inArray(columns, true, "sum")) {
            html += " show-summary";
            html += ' :summary-method="getSubtableSummaries"';
        }
        html += ">";
        html += "<el-table-column";
        //用class-name属性来标识列要计算合计。
        //labelClassName来记录子表ID，用于子表分页的时候获取子表数据。子表分页时getSummaries参数传的是当前页数据。
        let mClassNames = [];
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].sum) {
                mClassNames.push(
                    columns[i].field + "," + utils.replace(columns[i].name, "'", ""),
                );
            }
        }
        html +=
            ' className="' + mClassNames.join(";") + '" labelClassName="' + id + '"';
        html += ">";

        html += "<template #header>";
        html +=
            "<el-button v-if=\"!getSubtableDisabled('" +
            id +
            '\')" type="primary" class="roadui_fromrunsubtable_button" size="' +
            buttonSize +
            '" @click="addSubtableRow(\'' +
            id +
            "')\"><el-icon><Plus /></el-icon></el-button>";
        html += "</template>";
        html += '<template #default="scope">';
        for (let i = 0; i < columns.length; i++) {
            let field = columns[i].field;
            if (utils.length(field) === 0) {
                field = "field_" + columns[i].key;
            }
            field = field.toLowerCase();
            let editType = columns[i].edit.type || "texts";
            let dataType = "string"; //子表字段数据类型
            let editSet = columns[i].edit.set || {};

            if (editType == "hidden") {
                continue;
            }
            html +=
                '<el-form-item label-width="auto" style="margin:14px 0;" :rules="formRulesSubtable[\'' +
                id +
                "." +
                field +
                "']\" :prop=\"'" +
                id +
                ".'+scope.$index+'." +
                field +
                "'\">";
            html += "<template #label>";
            html += utils.replace(columns[i].name, "'", "");
            html += "</template>";
            let subtableField = { id: field, type: dataType, label: columns[i].name };
            switch (editType) {
                case "texts":
                    html += this.compile_subtable_text(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "textareas":
                    html += this.compile_subtable_textarea(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "number":
                    html += this.compile_subtable_number(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "selects":
                    html += this.compile_subtable_select(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "selectdiv":
                    html += this.compile_subtable_selectdiv(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "cascader":
                    html += this.compile_subtable_cascader(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "radio":
                    html += this.compile_subtable_radio(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "checkbox":
                    html += this.compile_subtable_checkbox(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "switchs":
                    html += this.compile_subtable_switch(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "datetime":
                    html += this.compile_subtable_datetime(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "dictionary":
                    html += this.compile_subtable_dictionary(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "organize":
                    html += this.compile_subtable_organize(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "appraise":
                    html += this.compile_subtable_appraise(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "labels":
                    html += this.compile_subtable_label(id, field, editSet);
                    break;
                case "files":
                    html += this.compile_subtable_files(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
            }
            html += "</el-form-item>";
        }
        html += "<div v-if=\"!getSubtableDisabled('" + id + "')\">";
        html +=
            '<el-button type="primary" class="roadui_fromrunsubtable_button" size="' +
            buttonSize +
            '" @click="insertSubtableRow(\'' +
            id +
            "',scope.row)\"><el-icon><Plus /></el-icon></el-button>";
        html +=
            '<el-button type="primary" class="roadui_fromrunsubtable_button" style="margin-left:10px;" size="' +
            buttonSize +
            '" @click="delSubtableRow(\'' +
            id +
            "',scope.row)\"><el-icon><Minus /></el-icon></el-button>";
        html += "</div>";
        html += "</template>";
        html += "</el-table-column>";
        html += "</el-table>";

        //PC端子表
        html +=
            '<el-table v-else size="' +
            (subtableSet.size || "default") +
            '" :row-key="function(row){return row.key;}"';
        if (subtableSet.pager) {
            html +=
                ' v-loading="subTableLoading" :data="utils.hasKey(formData,\'' +
                id +
                "')&&utils.isDef(formData['" +
                id +
                "'])?formData['" +
                id +
                "'].slice(utils.hasKey(subTablePagers,'" +
                id +
                "')&&utils.isDef(subTablePagers['" +
                id +
                "'])?subTablePagers['" +
                id +
                "'].start||0:0,utils.hasKey(subTablePagers,'" +
                id +
                "')&&utils.isDef(subTablePagers['" +
                id +
                "'])?subTablePagers['" +
                id +
                "'].end||10:10):[]\"";
        } else {
            html += " :data=\"formData['" + id + "']\"";
        }
        if (subtableSet.bordered) {
            html += " border";
        }
        if (subtableSet.stripe) {
            html += " stripe";
        }
        if (subtableSet.height) {
            html +=
                " " +
                (utils.isNumberString(subtableSet.height) ? ":" : "") +
                'height="' +
                subtableSet.height +
                '"';
        }
        html +=
            ' style="width:' +
            (utils.length(subtableSet.width) > 0 ? subtableSet.width : "100%") +
            '"';
        if (utils.inArray(columns, true, "sum")) {
            html += " show-summary";
            html += ' :summary-method="getSummaries"';
        }
        html += ">";
        //序号列
        if (subtableSet.rowNumber) {
            html += '<el-table-column type="index" label="#" align="center"/>';
        }
        for (let i = 0; i < columns.length; i++) {
            let field = columns[i].field;
            if (utils.length(field) === 0) {
                field = "field_" + columns[i].key;
            }
            field = field.toLowerCase();
            let editType = columns[i].edit.type || "texts";
            let dataType = "string"; //子表字段数据类型
            let editSet = columns[i].edit.set || {};

            //设置默认值
            if (editType == "switchs") {
                //如果是开关控件，又设置了默认开启，设置默认值为true。
                if (editSet.defaultChecked) {
                    columnAddData[field] =
                        utils.length(editSet.defaultValue) > 0
                            ? editSet.defaultValue
                            : true;
                } else if (utils.length(editSet.defaultValue) > 0) {
                    columnAddData[field] = editSet.defaultValue;
                }
            } else if (editType == "appraise" || editType == "number") {
                //如果是评分控件或数字输入，默认值是数字。
                if (utils.isNumberString(editSet.defaultValue)) {
                    columnAddData[field] = utils.toNumber(editSet.defaultValue);
                }
            } else if (utils.length(editSet.defaultValue) > 0) {
                columnAddData[field] = editSet.defaultValue;
            }

            if (editType == "hidden") {
                continue;
            }

            html +=
                '<el-table-column prop="' +
                field +
                '" label="' +
                utils.replace(columns[i].name, "'", "") +
                '"';
            if (columns[i].order) {
                html += " sortable";
            }
            if (parseInt(columns[i].width)) {
                html += ' width="' + parseInt(columns[i].width) + '"';
            }
            if (utils.length(columns[i].align) > 0) {
                html += ' align="' + columns[i].align + '"';
            }
            //用class-name属性来标识列要计算合计。
            //labelClassName来记录子表ID，用于子表分页的时候获取子表数据。子表分页时getSummaries参数传的是当前页数据。
            if (columns[i].sum) {
                html += ' className="1" labelClassName="' + id + '"';
            }
            html += ">";
            html += '<template #default="scope">';
            html +=
                '<el-form-item style="margin:0;" :rules="formRulesSubtable[\'' +
                id +
                "." +
                field +
                "']\" :prop=\"'" +
                id +
                ".'+scope.$index+'." +
                field +
                "'\">";
            let subtableField = { id: field, type: dataType, label: columns[i].name };
            switch (editType) {
                case "texts":
                    html += this.compile_subtable_text(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "textareas":
                    html += this.compile_subtable_textarea(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "number":
                    html += this.compile_subtable_number(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "selects":
                    html += this.compile_subtable_select(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "selectdiv":
                    html += this.compile_subtable_selectdiv(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "cascader":
                    html += this.compile_subtable_cascader(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "radio":
                    html += this.compile_subtable_radio(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "checkbox":
                    html += this.compile_subtable_checkbox(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "switchs":
                    html += this.compile_subtable_switch(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "datetime":
                    html += this.compile_subtable_datetime(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "dictionary":
                    html += this.compile_subtable_dictionary(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "organize":
                    html += this.compile_subtable_organize(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "appraise":
                    html += this.compile_subtable_appraise(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
                case "labels":
                    html += this.compile_subtable_label(id, field, editSet);
                    break;
                case "files":
                    html += this.compile_subtable_files(
                        id,
                        field,
                        editSet,
                        eventJSON,
                        subtableField,
                    );
                    break;
            }
            html += "</el-form-item></template></el-table-column>";
            subtableFields.push(subtableField);
        }
        this.formDefaultValues.push({
            id: id,
            type: "subtable",
            defaultValue: columnAddData,
        });
        //子表按钮列
        html +=
            '<el-table-column width="114" v-if="!getSubtableDisabled(\'' +
            id +
            "')\">";
        html +=
            '<template #header><el-button type="primary" class="roadui_fromrunsubtable_button" style="padding:5px 8px;" size="' +
            buttonSize +
            '" @click="addSubtableRow(\'' +
            id +
            "')\"><el-icon><Plus /></el-icon></el-button></template>";
        html += '<template #default="scope">';
        html +=
            '<el-button type="primary" class="roadui_fromrunsubtable_button" style="padding:5px 8px;" size="' +
            buttonSize +
            '" @click="insertSubtableRow(\'' +
            id +
            "',scope.row)\"><el-icon><Plus /></el-icon></el-button>";
        html +=
            '<el-button type="primary" class="roadui_fromrunsubtable_button" style="padding:5px 8px;margin-left:10px;" size="' +
            buttonSize +
            '" @click="delSubtableRow(\'' +
            id +
            "',scope.row)\"><el-icon><Minus /></el-icon></el-button>";
        html += "</template>";
        html += "</el-table-column>";
        html += "</el-table>";

        //分页
        if (subtableSet.pager) {
            html +=
                '<div class="roadui_pagerdiv">' +
                '<el-pagination style="margin-bottom:10px;"' +
                " :currentPage=\"utils.hasKey(subTablePagers,'" +
                id +
                "')&&utils.isDef(subTablePagers['" +
                id +
                "'])?subTablePagers['" +
                id +
                "'].number:null\"" +
                " :page-size=\"utils.hasKey(subTablePagers,'" +
                id +
                "')&&utils.isDef(subTablePagers['" +
                id +
                "'])?subTablePagers['" +
                id +
                "'].size:null\"" +
                ' :page-sizes="[5,10,15,20,25,30]"' +
                ' :background="true"' +
                " :layout=\"'1'==isMobile?'total,sizes,prev,next':'total,sizes,prev,pager,next'\"" +
                " :total=\"utils.hasKey(formData,'" +
                id +
                "')&&utils.isDef(formData['" +
                id +
                "'])?formData['" +
                id +
                "'].length:0\"" +
                " hide-on-single-page" +
                ' :disabled="subTableLoading"' +
                " @size-change=\"handleSizeChange($event,'" +
                id +
                "')\"" +
                " @current-change=\"handleCurrentChange($event,'" +
                id +
                "')\" />" +
                " </div>";
        }

        html += "</el-form-item>";
        $element.after(this.escapeHTML(html));
        $element.remove();

        //子表事件
        if (subtableSet.events) {
            let subtableEvents = [];
            for (let i = 0; i < subtableSet.events.length; i++) {
                if (utils.length(subtableSet.events[i].script) > 0) {
                    subtableEvents.push({
                        name: subtableSet.events[i].value,
                        script: subtableSet.events[i].script,
                    });
                }
            }
            if (subtableEvents.length > 0) {
                eventJSON.push({ id: "subtable_event_" + id, events: subtableEvents });
            }
        }

        if (utils.inArray(this.formFields, id, "id")) {
            this.formCompileErrMsg.push("控件id：" + id + " 重复！");
        } else {
            this.formFields.push({
                id: id,
                type: "subtable",
                label: label,
                tableName: subtableSet.table || "",
                fields: subtableFields,
            });
        }
    },
    //编译子表输入框
    compile_subtable_text(id, field, editSet, eventJSON, subtableField) {
        var dataType = "string";
        var html =
            "<el-input v-if=\"getFieldStatus('" +
            id +
            "." +
            field +
            "')==0\" v-model=\"scope.row['" +
            field +
            "']\"";
        html += " :ref=\"'formRef_" + id + "_" + field + "_'+scope.row.key\"";
        var style = "";
        if (utils.length(editSet.width) > 0) {
            style += "width:" + editSet.width + ";";
        }
        if (utils.length(style) > 0) {
            html += ' style="' + style + '"';
        }
        if (utils.length(editSet.align) > 0) {
            html += " :input-style=\"{'text-align':'" + editSet.align + "'}\"";
        }
        if (editSet.disabled) {
            html += " disabled";
        }
        if (editSet.readonly) {
            html += " readonly";
        }
        if (editSet.allowClear) {
            html += " clearable";
        }
        if (utils.length(editSet.prefix) > 0) {
            html += ' prefix-icon="' + editSet.prefix + '"';
        }
        if (utils.length(editSet.suffix) > 0) {
            html += ' suffix-icon="' + editSet.suffix + '"';
        }
        if (utils.toNumber(editSet.maxLength) > 0) {
            html += ' :maxlength="' + utils.toNumber(editSet.maxLength) + '"';
        }
        if (utils.length(editSet.placeholder, false) > 0) {
            html += ' placeholder="' + editSet.placeholder + '"';
        }
        if (editSet.inputType == "password") {
            html += ' type="password" show-password';
        }
        //事件
        if (utils.length(editSet.events) > 0) {
            let subtableEvents = [];
            let eventId = "subtable_event_" + id + "_" + field; //修改事件id为固定id //'subtable_event_' + utils.createGuid(false);//编译时随机生成事件id
            for (let i = 0; i < editSet.events.length; i++) {
                if (
                    utils.length(editSet.events[i].name) === 0 ||
                    utils.length(editSet.events[i].script) === 0
                ) {
                    continue;
                }
                html +=
                    " @" +
                    editSet.events[i].name +
                    "=\"execFormEvent('" +
                    eventId +
                    "','" +
                    editSet.events[i].name +
                    "',$event,scope.row)\"";
                subtableEvents.push(editSet.events[i]);
            }
            if (subtableEvents.length > 0) {
                eventJSON.push({ id: eventId, events: subtableEvents });
            }
        }
        html += " />";
        html +=
            '<span class="roadui_fromreadonly" v-else-if="getFieldStatus(\'' +
            id +
            "." +
            field +
            "')==1\">{{scope.row['" +
            field +
            "']||''}}</span>";
        subtableField.type = dataType;
        subtableField.format = editSet.format || "";
        return html;
    },
    //编译子表数字输入框
    compile_subtable_number(id, field, editSet, eventJSON, subtableField) {
        var dataType = "number";
        var html =
            "<el-input-number v-if=\"getFieldStatus('" +
            id +
            "." +
            field +
            "')==0\" v-model=\"scope.row['" +
            field +
            "']\"";
        html += " :ref=\"'formRef_" + id + "_" + field + "_'+scope.row.key\"";
        var style = "";
        if (utils.length(editSet.width) > 0) {
            style += "width:" + editSet.width + ";";
        }
        if (utils.length(style) > 0) {
            html += ' style="' + style + '"';
        }
        if (editSet.disabled) {
            html += " disabled";
        }
        if (utils.length(editSet.min) > 0) {
            html += ' :min="' + parseFloat(editSet.min) + '"';
        }
        if (utils.length(editSet.max) > 0) {
            html += ' :max="' + parseFloat(editSet.max) + '"';
        }
        if (utils.length(editSet.step) > 0) {
            html += ' :step="' + parseFloat(editSet.step) + '"';
        }
        if (utils.length(editSet.precision) > 0) {
            html += ' :precision="' + parseFloat(editSet.precision) + '"';
        }
        if (editSet.stepstrictly) {
            html += " step-strictly";
        }
        if (!editSet.controls) {
            html += ' :controls="false"';
        }
        if (editSet.controlsposition) {
            html += ' controls-position="right"';
        }
        if (utils.length(editSet.placeholder, false) > 0) {
            html += ' placeholder="' + editSet.placeholder + '"';
        }
        //事件
        if (utils.length(editSet.events) > 0) {
            let subtableEvents = [];
            let eventId = "subtable_event_" + id + "_" + field; //修改事件id为固定id //'subtable_event_' + utils.createGuid(false);//编译时随机生成事件id
            for (let i = 0; i < editSet.events.length; i++) {
                if (
                    utils.length(editSet.events[i].name) === 0 ||
                    utils.length(editSet.events[i].script) === 0
                ) {
                    continue;
                }
                html +=
                    " @" +
                    editSet.events[i].name +
                    "=\"execFormEvent('" +
                    eventId +
                    "','" +
                    editSet.events[i].name +
                    "',$event,scope.row)\"";
                subtableEvents.push(editSet.events[i]);
            }
            if (subtableEvents.length > 0) {
                eventJSON.push({ id: eventId, events: subtableEvents });
            }
        }
        html += " />";
        html +=
            '<span class="roadui_fromreadonly" v-else-if="getFieldStatus(\'' +
            id +
            "." +
            field +
            "')==1\">{{scope.row['" +
            field +
            "']||''}}</span>";
        subtableField.type = dataType;
        subtableField.format = editSet.format || "";
        return html;
    },
    //编译子表文本域
    compile_subtable_textarea(id, field, editSet, eventJSON, subtableField) {
        var dataType = "string";
        var html =
            '<el-input type="textarea" v-if="getFieldStatus(\'' +
            id +
            "." +
            field +
            "')==0\" v-model=\"scope.row['" +
            field +
            "']\"";
        html += " :ref=\"'formRef_" + id + "_" + field + "_'+scope.row.key\"";
        var style = "";
        if (utils.length(editSet.width) > 0) {
            style += "width:" + editSet.width + ";";
        }
        if (utils.length(style) > 0) {
            html += ' style="' + style + '"';
        }
        if (utils.length(editSet.align) > 0) {
            html += " :input-style=\"{'text-align':'" + editSet.align + "'}\"";
        }
        if (editSet.disabled) {
            html += " disabled";
        }
        if (editSet.allowClear) {
            html += " clearable";
        }
        if (editSet.readOnly) {
            html += " readonly";
        }
        if (utils.toNumber(editSet.maxLength) > 0) {
            html += ' :maxlength="' + utils.toNumber(editSet.maxLength) + '"';
        }
        if (utils.length(editSet.placeholder, false) > 0) {
            html += ' placeholder="' + editSet.placeholder + '"';
        }
        if (parseInt(editSet.rows) && parseInt(editSet.rows) > 0) {
            html += ' :rows="' + parseInt(editSet.rows) + '"';
        }
        //事件
        if (utils.length(editSet.events) > 0) {
            let subtableEvents = [];
            let eventId = "subtable_event_" + id + "_" + field; //修改事件id为固定id //'subtable_event_' + utils.createGuid(false);//编译时随机生成事件id
            for (let i = 0; i < editSet.events.length; i++) {
                if (
                    utils.length(editSet.events[i].name) === 0 ||
                    utils.length(editSet.events[i].script) === 0
                ) {
                    continue;
                }
                html +=
                    " @" +
                    editSet.events[i].name +
                    "=\"execFormEvent('" +
                    eventId +
                    "','" +
                    editSet.events[i].name +
                    "',$event,scope.row)\"";
                subtableEvents.push(editSet.events[i]);
            }
            if (subtableEvents.length > 0) {
                eventJSON.push({ id: eventId, events: subtableEvents });
            }
        }
        html += " />";
        html +=
            '<span class="roadui_fromreadonly" v-else-if="getFieldStatus(\'' +
            id +
            "." +
            field +
            "')==1\">{{scope.row['" +
            field +
            "']||''}}</span>";
        subtableField.type = dataType;
        subtableField.format = editSet.format || "";
        return html;
    },
    //编译子表下拉选择
    compile_subtable_select(id, field, editSet, eventJSON, subtableField) {
        var html =
            "<el-select v-if=\"getFieldStatus('" +
            id +
            "." +
            field +
            "')==0\" v-model=\"scope.row['" +
            field +
            "']\"";
        html += " :ref=\"'formRef_" + id + "_" + field + "_'+scope.row.key\"";
        var style = "";
        if (utils.length(editSet.width) > 0) {
            style += "width:" + editSet.width + ";";
        }
        if (utils.length(style) > 0) {
            html += ' style="' + style + '"';
        }
        if (editSet.search) {
            html += " filterable";
        }
        if (editSet.allowClear) {
            html += " clearable";
        }
        if (editSet.multiple) {
            html += " multiple";
            subtableField.type = "json";
        }
        if (utils.length(editSet.placeholder, false) > 0) {
            html += ' placeholder="' + editSet.placeholder + '"';
        }

        switch (editSet.dataSource) {
            case "dict":
                this.formSelectOptions.push({
                    id: id + "__" + field,
                    source: "dict",
                    dictId: editSet.dataSourceDict,
                    valueField: editSet.dataSourceDictValueField,
                });
                break;
            case "string":
                this.formSelectOptions.push({
                    id: id + "__" + field,
                    source: "string",
                    string: editSet.dataSourceString,
                });
                break;
            case "sql":
                this.formSelectOptions.push({
                    id: id + "__" + field,
                    source: "sql",
                    connId: editSet.dataSourceSqlConn,
                    sql: editSet.dataSourceSql,
                });
                break;
            case "url":
                this.formSelectOptions.push({
                    id: id + "__" + field,
                    source: "url",
                    url: editSet.dataSourceUrl,
                });
                break;
        }

        //事件
        if (utils.length(editSet.events) > 0) {
            let subtableEvents = [];
            let eventId = "subtable_event_" + id + "_" + field; //修改事件id为固定id //'subtable_event_' + utils.createGuid(false);//编译时随机生成事件id
            for (let i = 0; i < editSet.events.length; i++) {
                if (
                    utils.length(editSet.events[i].name) === 0 ||
                    utils.length(editSet.events[i].script) === 0
                ) {
                    continue;
                }
                html +=
                    " @" +
                    editSet.events[i].name +
                    "=\"execFormEvent('" +
                    eventId +
                    "','" +
                    editSet.events[i].name +
                    "',$event,scope.row)\"";
                subtableEvents.push(editSet.events[i]);
            }
            if (subtableEvents.length > 0) {
                eventJSON.push({ id: eventId, events: subtableEvents });
            }
        }

        html += ">";
        html +=
            "<el-option v-for=\"opt in (formSelectOptions['" +
            id +
            "__" +
            field +
            "_'+scope.row['key']]||formSelectOptions['" +
            id +
            "__" +
            field +
            '\'])" :key="opt.value" :value="opt.value" :label="opt.label">';
        html += "</el-option>";
        html += "</el-select>";
        html +=
            "<span v-else-if=\"getFieldStatus('" +
            id +
            "." +
            field +
            '\')==1" class="roadui_fromreadonly">{{getSelectTitle(\'' +
            id +
            "__" +
            field +
            "',scope.row['" +
            field +
            "'],scope.row)}}</span>";
        return html;
    },
    //编译子表弹出选择
    compile_subtable_selectdiv(id, field, editSet, eventJSON) {
        var html =
            "<el-selectdiv append-tobody :status=\"getFieldStatus('" +
            id +
            "." +
            field +
            "')\" v-model=\"scope.row['" +
            field +
            "']\"";
        html += " :ref=\"'formRef_" + id + "_" + field + "_'+scope.row.key\"";
        if (utils.length(editSet.width) > 0) {
            html += ' style="width:' + editSet.width + ';"';
        }
        html += ' applibrary-id="' + editSet.applibraryId + '"';
        html += ' applibrary-address="' + editSet.applibraryAddress + '"';
        html += ' value-field="' + editSet.valueField + '"';
        html += ' title-field="' + editSet.titleField + '"';
        if (utils.length(editSet.valueSeparator) > 0) {
            html += ' value-separator="' + editSet.valueSeparator + '"';
        }
        if (utils.length(editSet.titleSeparator) > 0) {
            html += ' title-separator="' + editSet.titleSeparator + '"';
        }
        if (utils.length(editSet.modalTitle) > 0) {
            html += ' modal-title="' + editSet.modalTitle + '"';
        }
        if (utils.length(editSet.placeholder) > 0) {
            html += ' placeholder="' + editSet.placeholder + '"';
        }
        if (utils.toNumber(editSet.modalWidth, 0) > 0) {
            html += ' modal-width="' + utils.toNumber(editSet.modalWidth, 0) + 'px"';
        }
        if (utils.length(editSet.params) > 0) {
            html += ' :query-params="' + editSet.params + '"';
        }

        //事件
        if (utils.length(editSet.events) > 0) {
            let subtableEvents = [];
            let eventId = "subtable_event_" + id + "_" + field; //修改事件id为固定id //'subtable_event_' + utils.createGuid(false);//编译时随机生成事件id
            for (let i = 0; i < editSet.events.length; i++) {
                if (
                    utils.length(editSet.events[i].name) === 0 ||
                    utils.length(editSet.events[i].script) === 0
                ) {
                    continue;
                }
                html +=
                    " @" +
                    editSet.events[i].name +
                    "=\"execFormEvent('" +
                    eventId +
                    "','" +
                    editSet.events[i].name +
                    "',$event,scope.row)\"";
                subtableEvents.push(editSet.events[i]);
            }
            if (subtableEvents.length > 0) {
                eventJSON.push({ id: eventId, events: subtableEvents });
            }
        }

        html += " />";
        return html;
    },
    //编译子表级联选择
    compile_subtable_cascader(id, field, editSet, eventJSON, subtableField) {
        var html =
            "<el-cascader v-if=\"getFieldStatus('" +
            id +
            "." +
            field +
            "')==0\" v-model=\"scope.row['" +
            field +
            "']\"";
        html += " :ref=\"'formRef_" + id + "_" + field + "_'+scope.row.key\"";
        var props = "";
        if (editSet.emitPath == "1") {
            props += "emitPath:false,";
        }
        if (editSet.expandTrigger === "hover") {
            props += "expandTrigger:'hover',";
        }
        if (utils.length(props) > 0) {
            html += ' :props="{' + props + '}"';
        }
        var style = "";
        if (utils.length(editSet.width) > 0) {
            style += "width:" + editSet.width + ";";
        }
        if (utils.length(style) > 0) {
            html += ' style="' + style + '"';
        }
        if (editSet.allowClear) {
            html += " clearable";
        }
        if (editSet.search) {
            html += " filterable";
        }
        if (utils.length(editSet.placeholder, false) > 0) {
            html += ' placeholder="' + editSet.placeholder + '"';
        }

        switch (editSet.dataSource) {
            case "dict":
                this.formSelectOptions.push({
                    id: id + "__" + field,
                    source: "cascader_dict",
                    dictId: editSet.dataSourceDict,
                    valueField: editSet.dataSourceDictValueField,
                });
                break;
            case "string":
                this.formSelectOptions.push({
                    id: id + "__" + field,
                    source: "cascader_string",
                    string: editSet.dataSourceString,
                });
                break;
            case "sql":
                this.formSelectOptions.push({
                    id: id + "__" + field,
                    source: "cascader_sql",
                    connId: editSet.dataSourceSqlConn,
                    sql: editSet.dataSourceSql,
                });
                break;
            case "url":
                this.formSelectOptions.push({
                    id: id + "__" + field,
                    source: "cascader_url",
                    url: editSet.dataSourceUrl,
                });
                break;
        }
        html += " :options=\"formSelectOptions['" + id + "__" + field + "']\"";

        //事件
        if (utils.length(editSet.events) > 0) {
            let subtableEvents = [];
            let eventId = "subtable_event_" + id + "_" + field; //修改事件id为固定id //'subtable_event_' + utils.createGuid(false);//编译时随机生成事件id
            for (let i = 0; i < editSet.events.length; i++) {
                if (
                    utils.length(editSet.events[i].name) === 0 ||
                    utils.length(editSet.events[i].script) === 0
                ) {
                    continue;
                }
                html +=
                    " @" +
                    editSet.events[i].name +
                    "=\"execFormEvent('" +
                    eventId +
                    "','" +
                    editSet.events[i].name +
                    "',$event,scope.row)\"";
                subtableEvents.push(editSet.events[i]);
            }
            if (subtableEvents.length > 0) {
                eventJSON.push({ id: eventId, events: subtableEvents });
            }
        }

        html += " />";
        html +=
            "<span v-else-if=\"getFieldStatus('" +
            id +
            "." +
            field +
            '\')==1" class="roadui_fromreadonly">{{getCascaderTitle(\'' +
            id +
            "__" +
            field +
            "',scope.row['" +
            field +
            "'])}}</span>";
        subtableField.type = "json";
        return html;
    },
    //编译子表单选按钮
    compile_subtable_radio(id, field, editSet, eventJSON) {
        var html =
            "<el-radio-group v-if=\"getFieldStatus('" +
            id +
            "." +
            field +
            "')==0\" v-model=\"scope.row['" +
            field +
            "']\"";
        html += " :ref=\"'formRef_" + id + "_" + field + "_'+scope.row.key\"";
        switch (editSet.dataSource) {
            case "dict":
                this.formSelectOptions.push({
                    id: id + "__" + field,
                    source: "dict",
                    dictId: editSet.dataSourceDict,
                    valueField: editSet.dataSourceDictValueField,
                });
                break;
            case "string":
                this.formSelectOptions.push({
                    id: id + "__" + field,
                    source: "string",
                    string: editSet.dataSourceString,
                });
                break;
            case "sql":
                this.formSelectOptions.push({
                    id: id + "__" + field,
                    source: "sql",
                    connId: editSet.dataSourceSqlConn,
                    sql: editSet.dataSourceSql,
                });
                break;
            case "url":
                this.formSelectOptions.push({
                    id: id + "__" + field,
                    source: "url",
                    url: editSet.dataSourceUrl,
                });
                break;
        }

        //事件
        if (utils.length(editSet.events) > 0) {
            let subtableEvents = [];
            let eventId = "subtable_event_" + id + "_" + field; //修改事件id为固定id //'subtable_event_' + utils.createGuid(false);//编译时随机生成事件id
            for (let i = 0; i < editSet.events.length; i++) {
                if (
                    utils.length(editSet.events[i].name) === 0 ||
                    utils.length(editSet.events[i].script) === 0
                ) {
                    continue;
                }
                html +=
                    " @" +
                    editSet.events[i].name +
                    "=\"execFormEvent('" +
                    eventId +
                    "','" +
                    editSet.events[i].name +
                    "',$event,scope.row)\"";
                subtableEvents.push(editSet.events[i]);
            }
            if (subtableEvents.length > 0) {
                eventJSON.push({ id: eventId, events: subtableEvents });
            }
        }

        html += ">";

        html +=
            "<el-radio" +
            (editSet.buttonStyle === "button" ? "-button" : "") +
            " v-for=\"(option,index) in formSelectOptions['" +
            id +
            "__" +
            field +
            '\']" :key="\'op_\'+index" :label="option.value"' +
            (editSet.buttonStyle === "border" ? " border" : "") +
            ">{{option.label}}</el-radio" +
            (editSet.buttonStyle === "button" ? "-button" : "") +
            ">";
        html += "</el-radio-group>";
        html +=
            "<span v-else-if=\"getFieldStatus('" +
            id +
            "." +
            field +
            '\')==1" class="roadui_fromreadonly">{{getSelectTitle(\'' +
            id +
            "__" +
            field +
            "',scope.row['" +
            field +
            "'])}}</span>";
        return html;
    },
    //编译子表复选按钮
    compile_subtable_checkbox(id, field, editSet, eventJSON, subtableField) {
        var html =
            "<el-checkbox-group v-if=\"getFieldStatus('" +
            id +
            "." +
            field +
            "')==0\" v-model=\"scope.row['" +
            field +
            "']\"";
        html += " :ref=\"'formRef_" + id + "_" + field + "_'+scope.row.key\"";
        switch (editSet.dataSource) {
            case "dict":
                this.formSelectOptions.push({
                    id: id + "__" + field,
                    source: "dict",
                    dictId: editSet.dataSourceDict,
                    valueField: editSet.dataSourceDictValueField,
                });
                break;
            case "string":
                this.formSelectOptions.push({
                    id: id + "__" + field,
                    source: "string",
                    string: editSet.dataSourceString,
                });
                break;
            case "sql":
                this.formSelectOptions.push({
                    id: id + "__" + field,
                    source: "sql",
                    connId: editSet.dataSourceSqlConn,
                    sql: editSet.dataSourceSql,
                });
                break;
            case "url":
                this.formSelectOptions.push({
                    id: id + "__" + field,
                    source: "url",
                    url: editSet.dataSourceUrl,
                });
                break;
        }

        //事件
        if (utils.length(editSet.events) > 0) {
            let subtableEvents = [];
            let eventId = "subtable_event_" + id + "_" + field; //修改事件id为固定id //'subtable_event_' + utils.createGuid(false);//编译时随机生成事件id
            for (let i = 0; i < editSet.events.length; i++) {
                if (
                    utils.length(editSet.events[i].name) === 0 ||
                    utils.length(editSet.events[i].script) === 0
                ) {
                    continue;
                }
                html +=
                    " @" +
                    editSet.events[i].name +
                    "=\"execFormEvent('" +
                    eventId +
                    "','" +
                    editSet.events[i].name +
                    "',$event,scope.row)\"";
                subtableEvents.push(editSet.events[i]);
            }
            if (subtableEvents.length > 0) {
                eventJSON.push({ id: eventId, events: subtableEvents });
            }
        }

        html += ">";
        html +=
            "<el-checkbox" +
            (editSet.buttonStyle === "button" ? "-button" : "") +
            " v-for=\"(option,index) in formSelectOptions['" +
            id +
            "__" +
            field +
            '\']" :key="\'op_\'+index" :label="option.value"' +
            (editSet.buttonStyle === "border" ? " border" : "") +
            ">{{option.label}}</el-checkbox" +
            (editSet.buttonStyle === "button" ? "-button" : "") +
            ">";
        html += "</el-checkbox-group>";
        html +=
            "<span v-else-if=\"getFieldStatus('" +
            id +
            "." +
            field +
            '\')==1" class="roadui_fromreadonly">{{getSelectTitle(\'' +
            id +
            "__" +
            field +
            "',scope.row['" +
            field +
            "'])}}</span>";
        subtableField.type = "json";
        return html;
    },
    //编译子表开关
    compile_subtable_switch(id, field, editSet, eventJSON) {
        var html =
            "<el-switch v-if=\"getFieldStatus('" +
            id +
            "." +
            field +
            "')==0\" v-model=\"scope.row['" +
            field +
            "']\"";
        html += " :ref=\"'formRef_" + id + "_" + field + "_'+scope.row.key\"";
        if (utils.length(editSet.checkedChildren) > 0) {
            html += ' active-text="' + editSet.checkedChildren + '"';
        }
        if (utils.length(editSet.unCheckedChildren) > 0) {
            html += ' inactive-text="' + editSet.unCheckedChildren + '"';
        }
        if (utils.length(editSet.checkedValue) > 0) {
            //if (utils.isNumberString(editSet.checkedValue)) {
            //    html += ' :active-value="' + editSet.checkedValue + '"';
            //} else {
            html += ' active-value="' + editSet.checkedValue + '"';
            //}
        }
        if (utils.length(editSet.unCheckedValue) > 0) {
            //if (utils.isNumberString(editSet.unCheckedValue)) {
            //    html += ' :inactive-value="' + editSet.unCheckedValue + '"';
            //} else {
            html += ' inactive-value="' + editSet.unCheckedValue + '"';
            //}
        }
        if (utils.length(editSet.checkedColor) > 0) {
            html += ' active-color="' + editSet.checkedColor + '"';
        }
        if (utils.length(editSet.unCheckedColor) > 0) {
            html += ' inactive-color="' + editSet.unCheckedColor + '"';
        }
        if (editSet.inlinePrompt) {
            html += " inline-prompt";
        }

        //事件
        if (utils.length(editSet.events) > 0) {
            let subtableEvents = [];
            let eventId = "subtable_event_" + id + "_" + field; //修改事件id为固定id //'subtable_event_' + utils.createGuid(false);//编译时随机生成事件id
            for (let i = 0; i < editSet.events.length; i++) {
                if (
                    utils.length(editSet.events[i].name) === 0 ||
                    utils.length(editSet.events[i].script) === 0
                ) {
                    continue;
                }
                html +=
                    " @" +
                    editSet.events[i].name +
                    "=\"execFormEvent('" +
                    eventId +
                    "','" +
                    editSet.events[i].name +
                    "',$event,scope.row)\"";
                subtableEvents.push(editSet.events[i]);
            }
            if (subtableEvents.length > 0) {
                eventJSON.push({ id: eventId, events: subtableEvents });
            }
        }

        html += " />";
        html +=
            "<span v-else-if=\"getFieldStatus('" +
            id +
            "." +
            field +
            '\')==1" class="roadui_fromreadonly">{{getSwitchTitle(scope.row[\'' +
            field +
            "'],'" +
            editSet.unCheckedChildren +
            "','" +
            editSet.checkedChildren +
            "','" +
            editSet.checkedValue +
            "')}}</span>";
        return html;
    },
    //编译子表日期时间
    compile_subtable_datetime(id, field, editSet, eventJSON, subtableField) {
        var html = "";
        if (editSet.selectType != "time") {
            html +=
                "<el-date-picker v-if=\"getFieldStatus('" +
                id +
                "." +
                field +
                "')==0\" v-model=\"scope.row['" +
                field +
                '\']" type="' +
                editSet.selectType +
                '"';
            html += " :ref=\"'formRef_" + id + "_" + field + "_'+scope.row.key\"";
            //增加如果是移动端，不能输入。
            html += ' :editable="!isMobile"';
            if (utils.length(editSet.placeholder, false) > 0) {
                html += ' placeholder="' + editSet.placeholder + '"';
            }
            if (utils.length(editSet.format || "") > 0) {
                html += ' format="' + editSet.format + '"';
            }
            if (utils.length(editSet.valueFormat || "") > 0) {
                html += ' value-format="' + editSet.valueFormat + '"';
            }
            if (utils.length(editSet.separator || "") > 0) {
                html += ' range-separator="' + editSet.separator + '"';
            }

            var style = "";
            if (utils.length(editSet.width) > 0) {
                style += "width:" + editSet.width + ";";
                style += "max-width:" + editSet.width + ";";
            }
            if (utils.length(style) > 0) {
                html += ' style="' + style + '"';
            }
            //如果是选择快捷日期，并且是选择范围才显示快捷选择。
            if (
                editSet.shortcuts &&
                (editSet.selectType === "daterange" ||
                    editSet.selectType === "datetimerange")
            ) {
                html += ' :shortcuts="utils.dateShortucts"';
            }
            if (editSet.clearable) {
                html += " clearable";
            } else {
                html += ' :clearable="false"';
            }
        } else {
            html +=
                "<el-time-select v-if=\"getFieldStatus('" +
                id +
                "." +
                field +
                "')==0\" v-model=\"scope.row['" +
                field +
                "']\"";
            html += " :ref=\"'formRef_" + id + "_" + field + "_'+scope.row.key\"";
            if (utils.length(editSet.placeholder, false) > 0) {
                html += ' placeholder="' + editSet.placeholder + '"';
            }
            if (utils.length(editSet.format || "") > 0) {
                html += ' format="' + editSet.format + '"';
            }
            if (utils.length(editSet.startTime) > 0) {
                html += ' start="' + editSet.startTime + '"';
            }
            if (utils.length(editSet.endTime) > 0) {
                html += ' end="' + editSet.endTime + '"';
            }
            if (utils.length(editSet.minTime) > 0) {
                html += ' min-time="' + editSet.minTime + '"';
            }
            if (utils.length(editSet.maxTime) > 0) {
                html += ' max-time="' + editSet.maxTime + '"';
            }
            if (utils.length(editSet.stepTime) > 0) {
                html += ' step="' + editSet.stepTime + '"';
            }
            var style = "";
            if (utils.length(editSet.width) > 0) {
                style += "width:" + editSet.width + ";";
                style += "max-width:" + editSet.width + ";";
            }
            if (utils.length(style) > 0) {
                html += ' style="' + style + '"';
            }
            if (editSet.clearable) {
                html += " clearable";
            } else {
                html += ' :clearable="false"';
            }
        }

        //事件
        if (utils.length(editSet.events) > 0) {
            let subtableEvents = [];
            let eventId = "subtable_event_" + id + "_" + field; //修改事件id为固定id //'subtable_event_' + utils.createGuid(false);//编译时随机生成事件id
            for (let i = 0; i < editSet.events.length; i++) {
                if (
                    utils.length(editSet.events[i].name) === 0 ||
                    utils.length(editSet.events[i].script) === 0
                ) {
                    continue;
                }
                html +=
                    " @" +
                    editSet.events[i].name +
                    "=\"execFormEvent('" +
                    eventId +
                    "','" +
                    editSet.events[i].name +
                    "',$event,scope.row)\"";
                subtableEvents.push(editSet.events[i]);
            }
            if (subtableEvents.length > 0) {
                eventJSON.push({ id: eventId, events: subtableEvents });
            }
        }

        html += " />";

        html +=
            "<span v-else-if=\"getFieldStatus('" +
            id +
            "." +
            field +
            '\')==1" class="roadui_fromreadonly">' +
            (editSet.selectType == "time"
                ? "{{scope.row['" + field + "']||''}}"
                : "{{getDateTimeTitle(scope.row['" +
                field +
                "'],'" +
                (editSet.format || "") +
                "','" +
                (editSet.separator || "") +
                "')}}") +
            "</span>";
        subtableField.format =
            editSet.selectType == "time" ? "" : editSet.format || "";
        subtableField.type =
            editSet.selectType == "time"
                ? "string"
                : (editSet.selectType || "").indexOf("range") > 0
                    ? "json"
                    : "datetime";
        return html;
    },
    //编译子表数据字典
    compile_subtable_dictionary(id, field, editSet, eventJSON) {
        var html =
            "<el-selectdict :status=\"getFieldStatus('" +
            id +
            "." +
            field +
            "')\" v-model=\"scope.row['" +
            field +
            "']\"";
        html += " :ref=\"'formRef_" + id + "_" + field + "_'+scope.row.key\"";
        if (utils.length(editSet.placeholder, false) > 0) {
            html += ' placeholder="' + editSet.placeholder + '"';
        }
        if (utils.length(editSet.range) > 0) {
            html += ' root="' + editSet.range + '"';
        }
        if (editSet.multiple) {
            html += " multiple";
        }
        html += ' :show-root="' + (editSet.showRoot ? "true" : "false") + '"';
        html += ' :select-root="' + (editSet.selectRoot ? "true" : "false") + '"';
        html +=
            ' :select-parent="' + (editSet.selectParent ? "true" : "false") + '"';
        if (utils.isNumberString(editSet.selectSize)) {
            html += ' :multiple-limit="' + editSet.selectSize + '"';
        }

        var style = "";
        if (utils.length(editSet.width) > 0) {
            style += "width:" + editSet.width + ";";
        }
        if (utils.length(style) > 0) {
            html += ' style="' + style + '"';
        }

        //事件
        if (utils.length(editSet.events) > 0) {
            let subtableEvents = [];
            let eventId = "subtable_event_" + id + "_" + field; //修改事件id为固定id //'subtable_event_' + utils.createGuid(false);//编译时随机生成事件id
            for (let i = 0; i < editSet.events.length; i++) {
                if (
                    utils.length(editSet.events[i].name) === 0 ||
                    utils.length(editSet.events[i].script) === 0
                ) {
                    continue;
                }
                html +=
                    " @" +
                    editSet.events[i].name +
                    "=\"execFormEvent('" +
                    eventId +
                    "','" +
                    editSet.events[i].name +
                    "',$event,scope.row)\"";
                subtableEvents.push(editSet.events[i]);
            }
            if (subtableEvents.length > 0) {
                eventJSON.push({ id: eventId, events: subtableEvents });
            }
        }

        html += " />";
        return html;
    },
    //编译子表组织架构
    compile_subtable_organize(id, field, editSet, eventJSON) {
        var html =
            "<el-selectorg :status=\"getFieldStatus('" +
            id +
            "." +
            field +
            "')\" v-model=\"scope.row['" +
            field +
            "']\"";
        html +=
            " :ref=\"'formRef_" +
            id +
            "_" +
            field +
            "_'+scope.row.key\" :is-mobile=\"'1'==isMobile\"";
        if (utils.length(editSet.placeholder, false) > 0) {
            html += ' placeholder="' + editSet.placeholder + '"';
        }
        if (!editSet.multiple) {
            html += ' :multiple="false"';
        }
        if (utils.isNumberString(editSet.selectSize)) {
            html += ' :multiple-limit="' + editSet.selectSize + '"';
        }
        html += " clearable";
        var sRange = [];
        if (utils.length(editSet.range) > 0) {
            sRange.push(editSet.range.split(","));
        }
        if (utils.length(editSet.selectRange) > 0) {
            sRange.push(editSet.selectRange.join(","));
        }
        if (sRange.length > 0) {
            html += ' select-range="' + sRange.join(",") + '"';
        }
        if (utils.length(editSet.selectType) > 0) {
            html += ' select-type="' + editSet.selectType + '"';
        }

        var style = "";
        if (utils.length(editSet.width) > 0) {
            style += "width:" + editSet.width + ";";
        }
        if (utils.length(style) > 0) {
            html += ' style="' + style + '"';
        }

        //事件
        if (utils.length(editSet.events) > 0) {
            let subtableEvents = [];
            let eventId = "subtable_event_" + id + "_" + field; //修改事件id为固定id //'subtable_event_' + utils.createGuid(false);//编译时随机生成事件id
            for (let i = 0; i < editSet.events.length; i++) {
                if (
                    utils.length(editSet.events[i].name) === 0 ||
                    utils.length(editSet.events[i].script) === 0
                ) {
                    continue;
                }
                html +=
                    " @" +
                    editSet.events[i].name +
                    "=\"execFormEvent('" +
                    eventId +
                    "','" +
                    editSet.events[i].name +
                    "',$event,scope.row)\"";
                subtableEvents.push(editSet.events[i]);
            }
            if (subtableEvents.length > 0) {
                eventJSON.push({ id: eventId, events: subtableEvents });
            }
        }

        html += " />";
        return html;
    },
    //编译子表评分
    compile_subtable_appraise(id, field, editSet, eventJSON, subtableField) {
        var html =
            "<el-rate v-if=\"getFieldStatus('" +
            id +
            "." +
            field +
            "')!=2\" :disabled=\"getFieldStatus('" +
            id +
            "." +
            field +
            "')==1\" v-model=\"scope.row['" +
            field +
            "']\"";
        html += " :ref=\"'formRef_" + id + "_" + field + "_'+scope.row.key\"";
        if (editSet.allowHalf) {
            html += " allow-half";
        }
        if (utils.length(editSet.count) > 0 && parseInt(editSet.count) > 0) {
            html += ' :max="' + editSet.count + '"';
        }
        if (utils.length(editSet.customIcon) > 0) {
            html +=
                " :icons=\"['" +
                editSet.customIcon +
                "','" +
                editSet.customIcon +
                "','" +
                editSet.customIcon +
                '\']" void-icon="' +
                editSet.customIcon +
                '"';
        }

        //事件
        if (utils.length(editSet.events) > 0) {
            let subtableEvents = [];
            let eventId = "subtable_event_" + id + "_" + field; //修改事件id为固定id //'subtable_event_' + utils.createGuid(false);//编译时随机生成事件id
            for (let i = 0; i < editSet.events.length; i++) {
                if (
                    utils.length(editSet.events[i].name) === 0 ||
                    utils.length(editSet.events[i].script) === 0
                ) {
                    continue;
                }
                html +=
                    " @" +
                    editSet.events[i].name +
                    "=\"execFormEvent('" +
                    eventId +
                    "','" +
                    editSet.events[i].name +
                    "',$event,scope.row)\"";
                subtableEvents.push(editSet.events[i]);
            }
            if (subtableEvents.length > 0) {
                eventJSON.push({ id: eventId, events: subtableEvents });
            }
        }

        html += "/>";
        subtableField.type = "number";
        return html;
    },
    //编译子表label
    compile_subtable_label(id, field, editSet) {
        var html = "<label v-if=\"getFieldStatus('" + id + "." + field + "')!=2\"";
        html += " :ref=\"'formRef_" + id + "_" + field + "_'+scope.row.key\"";
        var style = "color:var(--el-text-color-regular);";
        if (utils.length(editSet.style) > 0) {
            style += utils.replace(editSet.style, '"', "");
        }
        html += ' style="' + style + '"';
        html += ">";
        html += "{{scope.row['" + field + "']}}";
        html += "</label>";
        return html;
    },
    //编译子表附件
    compile_subtable_files(id, field, editSet, eventJSON) {
        var html =
            "<el-selectfile :status=\"getFieldStatus('" +
            id +
            "." +
            field +
            "')\" v-model=\"scope.row['" +
            field +
            "']\"";
        html += " :ref=\"'formRef_" + id + "_" + field + "_'+scope.row.key\"";
        html += ' :ismobile="isMobile"';
        if (utils.length(editSet.placeholder, false) > 0) {
            html += ' placeholder="' + editSet.placeholder + '"';
        }
        if (utils.length(editSet.fileType) > 0) {
            html += ' accept="' + editSet.fileType + '"';
        }
        html += ' show-type="' + editSet.showType + '"';
        if (editSet.showImg) {
            html += " show-img";
        }
        if (!editSet.showIndex) {
            html += ' :show-index="false"';
        }
        if (utils.isNumberString(editSet.limit)) {
            html += ' :limit="' + editSet.limit + '"';
        }
        var style = "";
        if (utils.length(editSet.width) > 0) {
            style += "width:" + editSet.width + ";";
        }
        if (utils.length(style) > 0) {
            html += ' style="' + style + '"';
        }

        if (parseFloat(editSet.size)) {
            html += ' :size="' + parseFloat(editSet.size) + '"';
        }
        if (utils.length(editSet.tip) > 0) {
            html += ' tip="' + editSet.tip + '"';
        }
        if (utils.length(editSet.buttonText) > 0) {
            html += ' button-text="' + editSet.buttonText + '"';
        }
        html += ' :control-type="' + (editSet.controlType == "1" ? "1" : "0") + '"';
        let controlShowType1 = utils.isNumberString(editSet.controlShowType)
            ? editSet.controlShowType
            : "0";
        html += ' :control-show-type="' + controlShowType1 + '"';
        html +=
            ' list-type="' +
            (controlShowType1 == "2" ? "picture-card" : "text") +
            '"';
        if (utils.length(editSet.showStyle) > 0) {
            html += ' show-style="' + editSet.showStyle + '"';
        }

        //事件
        if (utils.length(editSet.events) > 0) {
            let subtableEvents = [];
            let eventId = "subtable_event_" + id + "_" + field; //修改事件id为固定id //'subtable_event_' + utils.createGuid(false);//编译时随机生成事件id
            for (let i = 0; i < editSet.events.length; i++) {
                if (
                    utils.length(editSet.events[i].name) === 0 ||
                    utils.length(editSet.events[i].script) === 0
                ) {
                    continue;
                }
                html +=
                    " @" +
                    editSet.events[i].name +
                    "=\"execFormEvent('" +
                    eventId +
                    "','" +
                    editSet.events[i].name +
                    "',$event,scope.row)\"";
                subtableEvents.push(editSet.events[i]);
            }
            if (subtableEvents.length > 0) {
                eventJSON.push({ id: eventId, events: subtableEvents });
            }
        }

        html += "/>";
        return html;
    },
};
