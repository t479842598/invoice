import Raphael from 'raphael';
var tempArrPath = []; //临时连线
var _this_roadflow_show;//保存this,解决和drag中this冲突
export default {
    wf_r: null, //画板对象
    wf_steps: [], //步骤数组
    wf_texts: [], //文本数组
    wf_conns: [], //连线数组
    wf_imgs: [], //图标数组
    wf_option: "", //当前操作
    wf_focusObj: null, //当前焦点对象
    wf_width: 108, //步骤宽度
    wf_height: 50, //步骤高度
    wf_rect: 10, //圆角大小
    wf_designer: true, //是否是设计模式(查看流程图时不绑定双击事件）
    wf_connColor: "#11a983",//连线的常规颜色
    wf_nodeBorderColor: "#11a983", //节点边框颜色
    wf_noteColor: "#11a983",//节点填充颜色
    wf_nodeTextColor: "#ffffff", //节点字颜色
    wf_nodeTextSize: 14,//节点字大小
    wf_hoverColor: "#ed0404", //鼠标经过颜色
    wf_focusColor: "#E6A23C", //当前焦点颜色
    wf_stepDefaultName: "步骤",//默认步骤名称
    wf_lineType: 0, //当前连线类型

    mouseX: 0,
    mouseY: 0,

    wf_json: {}, //设计json
    wf_id: "",//当前流程ID
    pager_id: '',//画布ID

    dialogVisible: null,
    dialogRef: null,
    dialogData: [],
    roaduiUtils: {},

    //初始化，id 画布的div id, width：宽度 height:高度 colorObj：颜色设置 isDesign：是否是设计模式
    init(id, width, height, colorObj, isDesign) {
        this.wf_id = id;
        this.pager_id = 'flowShowDiv_' + id;
        this.wf_designer = isDesign;
        _this_roadflow_show = this;
        if (colorObj) {
            this.wf_connColor = colorObj.line;
            this.wf_nodeBorderColor = colorObj.step;
            this.wf_noteColor = colorObj.step;
            this.wf_focusColor = colorObj.focus;
            this.wf_nodeTextSize = colorObj.fontSize;
        }
        this.wf_r = Raphael(this.pager_id, width, height);
        this.wf_r.customAttributes.type1 = function () { };
        this.wf_r.customAttributes.fromid = function () { };
        this.wf_r.customAttributes.toid = function () { };

        //随着节点位置的改变动态改变箭头
        Raphael.fn.drawArr = function (obj, lineType) {
            if (!obj || !obj.obj1) {
                return;
            }

            lineType = lineType || (_this_roadflow_show.wf_lineType || 0);

            if (!obj.obj2) {
                var point1 = _this_roadflow_show.getStartEnd(obj.obj1, obj.obj2);
                var path2 = _this_roadflow_show.getArr(point1.start.x, point1.start.y, _this_roadflow_show.mouseX, _this_roadflow_show.mouseY, 0, lineType);
                for (var i = 0; i < tempArrPath.length; i++) {
                    tempArrPath[i].arrPath.remove();
                }
                tempArrPath = [];
                obj.arrPath = this.path(path2);
                obj.arrPath.attr({ "stroke-width": 2, "stroke-dasharray": "-", "arrow-end": "block-wide-long", "stroke": _this_roadflow_show.wf_connColor });
                tempArrPath.push(obj);
                return null;
            }

            var point = _this_roadflow_show.getStartEnd(obj.obj1, obj.obj2);
            var path1 = _this_roadflow_show.getArr(point.start.x, point.start.y, point.end.x, point.end.y, 8, lineType);
            if (obj.arrPath) {
                obj.arrPath.attr({ "path": path1 });
            } else {
                obj.arrPath = this.path(path1);
                obj.arrPath.attr({ "stroke-width": 2, "stroke": _this_roadflow_show.wf_connColor, "fill": _this_roadflow_show.wf_connColor });
                if (_this_roadflow_show.wf_designer) {
                    obj.arrPath.id = obj.id;
                    obj.arrPath.fromid = obj.obj1.id;
                    obj.arrPath.toid = obj.obj2.id;
                    obj.arrPath.click(_this_roadflow_show.connClick);
                    obj.arrPath.dblclick(_this_roadflow_show.connSet);
                }
            }
            _this_roadflow_show.wf_lineType = undefined;
            for (var j = 0; j < tempArrPath.length; j++) {
                tempArrPath[j].arrPath.remove();
            }
            tempArrPath = [];
            return obj;
        };

        //删除数组
        Array.prototype.remove = function (obj) {
            for (var i = 0; i < this.length; i++) {
                var temp = this[i];
                if (!isNaN(obj)) {
                    temp = i;
                }
                if (temp == obj) {
                    for (var j = i; j < this.length; j++) {
                        this[j] = this[j + 1];
                    }
                    this.length = this.length - 1;
                }
            }
        };
    },
    //节点鼠标拖动事件
    mouseMove(ev) {
        ev = ev || window.event;
        var mousePos = _this_roadflow_show.mouseCoords(ev);
        _this_roadflow_show.mouseX = mousePos.x;
        _this_roadflow_show.mouseY = mousePos.y;
        var obj = { obj1: _this_roadflow_show.wf_focusObj, obj2: null };
        _this_roadflow_show.wf_r.drawArr(obj);
    },
    mouseCoords(ev) {
        if (ev.offsetX || ev.offsetY) {
            return { x: ev.offsetX - 5, y: ev.offsetY - 5 };
        }
        return {
            x: ev.offsetX + document.body.scrollLeft - document.body.clientLeft,
            y: ev.offsetY + document.body.scrollTop - document.body.clientTop
        };
    },
    //得到GUID
    getGuid() {
        return Raphael.createUUID();
    },
    //添加一个步骤 filletSize圆角大小
    addStep(x, y, text, id, addToJSON, type1, bordercolor, bgcolor, filletSize, imgSrc, stepTasks) {
        var guid = this.getGuid();
        var xy = this.getNewXY();
        x = x || xy.x;
        y = y || xy.y;
        text = text || this.wf_stepDefaultName;
        id = id || guid;
        var rect = this.wf_r.rect(x, y, this.wf_width, this.wf_height, filletSize || this.wf_rect);
        var step_color = bgcolor || this.wf_noteColor;
        rect.attr({
            "fill": step_color,
            "stroke": bordercolor || this.wf_nodeBorderColor,
            "stroke-width": 0,
            "title": text,
            "cursor": "default",
        });
        rect.id = id;
        rect.type1 = type1 ? type1 : "normal";
        rect.data("stepcolor", step_color);
        //if (this.wf_designer) {
            //rect.drag(this.move, this.dragger, this.up);
            //rect.click(this.click);
            //if ("normal" == rect.type1) {
            //    rect.dblclick(this.stepSet);
            //}
            //else if ("subflow" == rect.type1) {
            //    rect.dblclick(this.subflowSet);
            //}
        //}
        //鼠标进入，显示节点处理过程
        if (stepTasks && stepTasks.length > 0) {
            rect.attr({ "cursor": "pointer" });
            rect.mouseover(function () {
                _this_roadflow_show.dialogVisible.value = true;
                _this_roadflow_show.dialogRef.value.style.top = (y + 180) + 'px';
                _this_roadflow_show.dialogRef.value.style.left = (x + 20) + 'px';
                _this_roadflow_show.dialogData.value = stepTasks;
            });
            rect.mouseout(function () {
                _this_roadflow_show.dialogVisible.value = false;
            });
        }
        this.wf_steps.push(rect);
        var hasImg = imgSrc && imgSrc.toString().trim().length > 0;//是否有图标
        var text2 = this.getNtext(text); //text.length > 8 ? text.substr(0, 7) + "…" : text;
        var text1 = this.wf_r.text(x + 52, y + (hasImg ? 32 : 25), text2);
        text1.attr({ "font-size": this.wf_nodeTextSize.toString() + "px", "font-family": "sans-serif", "fill": this.wf_nodeTextColor });
        text1.id = "text_" + id;
        text1.type1 = "text";
        //鼠标进入，显示节点处理过程
        if (stepTasks && stepTasks.length > 0) {
            text1.attr({ "cursor": "pointer" });
            text1.mouseover(function () {
                _this_roadflow_show.dialogVisible.value = true;
                _this_roadflow_show.dialogRef.value.style.top = (y + 180) + 'px';
                _this_roadflow_show.dialogRef.value.style.left = (x + 20) + 'px';
                _this_roadflow_show.dialogData.value = stepTasks;
            });
            text1.mouseout(function () {
                _this_roadflow_show.dialogVisible.value = false;
            });
        }
        this.wf_texts.push(text1);
        if (hasImg) {
            var img = this.wf_r.image(imgSrc, x + 42, y + 7, 16, 16);
            img.id = "img_" + id;
            img.type1 = "image";
            this.wf_imgs.push(img);
        }
        if (addToJSON == undefined || addToJSON == null) addToJSON = true;
        if (addToJSON) {
            var step = {};
            step.id = id;
            step.type = type1 ? type1 : "normal";
            step.name = text;
            step.position = { x: x, y: y, width: this.wf_width, height: this.wf_height };
            step.opinionDisplay = "";
            step.expiredPrompt = "";
            step.signatureType = "";
            step.workTime = "";
            step.limitTime = "";
            step.otherTime = "";
            step.archives = "";
            step.archivesParams = "";
            step.note = "";
            step.behavior = {};
            step.forms = [];
            step.buttons = [];
            step.fieldStatus = [];
            step.event = {};
            step.subflow = {};
            this.addStep1(step);
        }
    },
    //得到换行的节点名称
    getNtext(text) {
        text = (text || '').toString().trim();
        return text.replace(/\\n/g, '\n');//2023-8-20修改不截断步骤名称，自已输入\n换行。
        //if (text.length <= 6) {
        //    return text;
        //}
        var textArray = [];
        var text1 = text;
        while (text1.length > 0) {
            if (text1.length > 6) {
                textArray.push(text1.substr(0, 6));
                text1 = text1.substr(6, text1.length);
            } else {
                textArray.push(text1);
                text1 = '';
            }
        }
        return textArray.join('\n');
    },
    //添加子流程节点
    addSubFlow() {
        this.addStep(null, null, "子流程步骤", null, null, "subflow", null, null)
    },
    //克隆一个对象
    clone(obj) {
        var o;
        switch (typeof obj) {
            case 'undefined':
                break;
            case 'string':
                o = obj + '';
                break;
            case 'number':
                o = obj - 0;
                break;
            case 'boolean':
                o = obj;
                break;
            case 'object':
                if (obj === null) {
                    o = null;
                } else {
                    if (obj instanceof Array) {
                        o = [];
                        for (var i = 0, len = obj.length; i < len; i++) {
                            o.push(this.clone(obj[i]));
                        }
                    } else {
                        o = {};
                        for (var k in obj) {
                            o[k] = this.clone(obj[k]);
                        }
                    }
                }
                break;
            default:
                o = obj;
                break;
        }
        return o;
    },
    //设置步骤样式 color 颜色 shape 形状 0炬型 1椭圆 2圆
    setStepStyle(id, color, shape) {
        var step = this.wf_r.getById(id);
        if (step) {
            var stepcolor = "";
            if (color) {
                stepcolor = color;
            } else {
                stepcolor = this.wf_noteColor;
            }
            step.attr("fill", stepcolor);
            step.data("stepcolor", stepcolor);
            if (shape) {
                if ("0" == shape) {
                    step.attr("r", this.wf_rect);
                }
                else if ("1" == shape) {
                    step.attr({ "r": this.wf_height })
                }
                else if ("2" == shape) {
                    step.attr({ "width": this.wf_height + 25, "height": this.wf_height + 25, "r": this.wf_height + 25 });
                    var text = this.wf_r.getById("text_" + id);
                    if (text) {
                        var text_x = text.attr("x");
                        text.attr({ "x": parseFloat(text_x) + 15 - ((this.wf_height + 50) / 2) });
                    }
                }
            }
        }
    },
    //得到新步骤的XY
    getNewXY() {
        var x = 10, y = 50;
        if (this.wf_steps.length > 0) {
            var step = this.wf_steps[this.wf_steps.length - 1];
            x = parseInt(step.attr("x")) + 170;
            y = parseInt(step.attr("y"));
            if (x > this.wf_r.width - this.wf_width) {
                x = 10;
                y = y + 100;
            }

            if (y > this.wf_r.height - this.wf_height) {
                y = this.wf_r.height - this.wf_height;
            }
        }
        return { x: x, y: y };
    },
    //添加连线
    addConn(lineType) {
        if (!this.wf_focusObj || !this.isStepObj(this.wf_focusObj)) {
            alert("请选择要连接的步骤！");
            return false;
        }
        this.wf_option = "line";
        this.wf_lineType = lineType;
        document.body.onmousemove = this.mouseMove;
        document.body.onmousedown = function () {
            for (var i = 0; i < tempArrPath.length; i++) {
                tempArrPath[i].arrPath.remove();
            }
            tempArrPath = [];
            document.body.onmousemove = null;
        };
    },
    //连接对象
    connObj(obj, addToJSON, title, lineType) {
        if (addToJSON == undefined || addToJSON == null) addToJSON = true;
        if (this.isLine(obj)) {
            lineType = lineType == undefined || lineType == null ? this.wf_lineType : lineType;
            var newline = this.wf_r.drawArr(obj, lineType);
            this.wf_conns.push(newline);
            if (addToJSON) {
                var line = {};
                line.id = obj.id;
                line.from = obj.obj1.id;
                line.to = obj.obj2.id;
                line.customMethod = "";
                line.sql = "";
                line.noaccordMsg = "";
                line.text = title || "";
                line.lineType = lineType || (this.wf_lineType || 0);
                this.addLine(line);
            } else {
                if (title) {
                    this.setLineText(obj.id, title);
                }
            }
        }
    },
    //单击事件执行相关操作
    click() {
        switch (_this_roadflow_show.wf_option) {
            case "line":
                var obj = { id: _this_roadflow_show.getGuid(), obj1: _this_roadflow_show.wf_focusObj, obj2: this };
                _this_roadflow_show.connObj(obj);
                break;
            default:
                _this_roadflow_show.changeStyle(this);
                break;
        }
        _this_roadflow_show.wf_option = "";
        _this_roadflow_show.wf_lineType = undefined;
        _this_roadflow_show.wf_focusObj = this;
    },
    //连线单击事件
    connClick() {
        for (var i = 0; i < _this_roadflow_show.wf_conns.length; i++) {
            if (_this_roadflow_show.wf_conns[i].arrPath === this) {
                _this_roadflow_show.wf_conns[i].arrPath.attr({ "stroke": _this_roadflow_show.wf_focusColor, "fill": _this_roadflow_show.wf_focusColor });
            }
            else {
                _this_roadflow_show.wf_conns[i].arrPath.attr({ "stroke": _this_roadflow_show.wf_connColor, "fill": _this_roadflow_show.wf_connColor });
            }
        }
        //for (var i = 0; i < wf_steps.length; i++) {
        //    wf_steps[i].attr("fill", "#efeff0");
        //    wf_steps[i].attr("stroke", "#23508e");
        //}
        _this_roadflow_show.wf_focusObj = this;
    },
    //判断一个节点与另一个节点之间是否可以连线
    isLine(obj) {
        if (!obj || !obj.obj1 || !obj.obj2) {
            return false;
        }
        if (obj.obj1 === obj.obj2) {
            return false;
        }
        if (!this.isStepObj(obj.obj1) || !this.isStepObj(obj.obj2)) {
            return false;
        }
        for (var i = 0; i < this.wf_conns.length; i++) {
            if (obj.obj1 === obj.obj2 || (this.wf_conns[i].obj1 === obj.obj1 && this.wf_conns[i].obj2 === obj.obj2)) {
                return false;
            }
        }
        return true;
    },
    //判断一个对象是否是步骤对象
    isStepObj(obj) {
        return obj && obj.type1 && (obj.type1.toString() == "normal" || obj.type1.toString() == "subflow");
    },
    setLineText(id, txt) {
        var line;
        for (var i = 0; i < this.wf_conns.length; i++) {
            if (this.wf_conns[i].id == id) {
                line = this.wf_conns[i];
                break;
            }
        }
        if (!line) {
            return;
        }
        var bbox = line.arrPath.getBBox();
        var txt_x = (bbox.x + bbox.x2) / 2;
        var txt_y = (bbox.y + bbox.y2) / 2;

        var lineText = this.wf_r.getById("line_" + id);
        if (lineText != null) {
            if (!txt) {
                lineText.remove();
            }
            else {
                lineText.attr("x", txt_x);
                lineText.attr("y", txt_y);
                lineText.attr("text", txt || "");
                lineText.attr({ "font-size": "14px" });
            }
            return;
        }

        if (txt) {
            var textObj = this.wf_r.text(txt_x, txt_y, txt);
            textObj.type1 = "line";
            textObj.id = "line_" + id;
            textObj.attr({ "font-size": "14px" });
            this.wf_texts.push(textObj);
        }
        //line.arrPath.attr("title", txt);
    },
    //改变节点样式
    changeStyle(obj) {
        if (!obj || !this.wf_designer) {
            return;
        }
        for (var i = 0; i < this.wf_steps.length; i++) {
            var noteColor = this.wf_noteColor;
            if (this.wf_steps[i].data("stepcolor")) {
                noteColor = this.wf_steps[i].data("stepcolor");
            }
            if (this.wf_steps[i].id == obj.id) {
                this.wf_steps[i].attr("fill", this.wf_focusColor);
                this.wf_steps[i].attr("stroke", this.wf_focusColor);
            } else {
                this.wf_steps[i].attr("fill", noteColor);
                this.wf_steps[i].attr("stroke", this.wf_nodeBorderColor);
            }
        }
    },
    //拖动节点开始时的事件
    dragger() {
        this.ox = this.attr("x");
        this.oy = this.attr("y");
        _this_roadflow_show.changeStyle(this);
    },
    //拖动事件
    move(dx, dy) {
        var x = this.ox + dx;
        var y = this.oy + dy;
        if (x < 10) {
            x = 10;
        }
        else if (x > _this_roadflow_show.wf_r.width - _this_roadflow_show.wf_width) {
            x = _this_roadflow_show.wf_r.width - _this_roadflow_show.wf_width;
        }
        if (y < 10) {
            y = 10;
        }
        else if (y > _this_roadflow_show.wf_r.height - _this_roadflow_show.wf_height) {
            y = _this_roadflow_show.wf_r.height - _this_roadflow_show.wf_height;
        }
        this.attr("x", x);
        this.attr("y", y);
        if (this.id) {
            var img = _this_roadflow_show.wf_r.getById("img_" + this.id);
            if (img != null) {
                img.attr("x", x + 42);
                img.attr("y", y + 7);
            }
            var text = _this_roadflow_show.wf_r.getById('text_' + this.id);
            if (text != null) {
                text.attr("x", x + 52);
                text.attr("y", y + (img ? 32 : 25));
            }
        }
        for (var j = _this_roadflow_show.wf_conns.length; j--;) {
            if (_this_roadflow_show.wf_conns[j].obj1.id == this.id || _this_roadflow_show.wf_conns[j].obj2.id == this.id) {
                var lineType = 0;
                for (var n = 0; n < _this_roadflow_show.wf_json.lines.length; n++) {
                    if (_this_roadflow_show.wf_json.lines[n].id == _this_roadflow_show.wf_conns[j].arrPath.id) {
                        _this_roadflow_show.setLineText(_this_roadflow_show.wf_json.lines[n].id, _this_roadflow_show.wf_json.lines[n].text);
                        lineType = _this_roadflow_show.wf_json.lines[n].lineType;
                        break;
                    }
                }
                _this_roadflow_show.wf_r.drawArr(_this_roadflow_show.wf_conns[j], lineType);
            }
        }
        //wf_r.safari();
    },
    //拖动结束后的事件
    up() {
        _this_roadflow_show.changeStyle(this);
        //记录移动后的位置
        if (_this_roadflow_show.isStepObj(this)) {
            var bbox = this.getBBox();
            if (bbox) {
                var steps = _this_roadflow_show.wf_json.steps;
                if (steps && steps.length > 0) {
                    for (var i = 0; i < steps.length; i++) {
                        if (steps[i].id == this.id) {
                            steps[i].position = { "x": bbox.x, "y": bbox.y, "width": bbox.width, "height": bbox.height };
                            break;
                        }
                    }
                }

            }
        }
    },
    getStartEnd(obj1, obj2) {
        var bb1 = obj1 ? obj1.getBBox() : null;
        var bb2 = obj2 ? obj2.getBBox() : null;
        var p = [
            { x: bb1.x + bb1.width / 2, y: bb1.y - 1 },
            { x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1 },
            { x: bb1.x - 1, y: bb1.y + bb1.height / 2 },
            { x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2 },
            bb2 ? { x: bb2.x + bb2.width / 2, y: bb2.y - 1 } : {},
            bb2 ? { x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1 } : {},
            bb2 ? { x: bb2.x - 1, y: bb2.y + bb2.height / 2 } : {},
            bb2 ? { x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2 } : {}
        ];
        var d = {}, dis = [];
        for (var i = 0; i < 4; i++) {
            for (var j = 4; j < 8; j++) {
                var dx = Math.abs(p[i].x - p[j].x),
                    dy = Math.abs(p[i].y - p[j].y);
                if (
                    (i == j - 4) ||
                    (((i != 3 && j != 6) || p[i].x < p[j].x) &&
                        ((i != 2 && j != 7) || p[i].x > p[j].x) &&
                        ((i != 0 && j != 5) || p[i].y > p[j].y) &&
                        ((i != 1 && j != 4) || p[i].y < p[j].y))
                ) {
                    dis.push(dx + dy);
                    d[dis[dis.length - 1]] = [i, j];
                }
            }
        }
        if (dis.length == 0) {
            var res = [0, 4];
        } else {
            res = d[Math.min.apply(Math, dis)];
        }
        var result = {};
        result.start = {};
        result.end = {};
        result.start.x = p[res[0]].x;
        result.start.y = p[res[0]].y;
        result.end.x = p[res[1]].x;
        result.end.y = p[res[1]].y;
        return result;
    },
    //曲线
    getStartEnd1(obj1, obj2) {
        var bb1 = obj1.getBBox(),
            bb2 = obj2.getBBox(),
            p = [{ x: bb1.x + bb1.width / 2, y: bb1.y - 1 },
            { x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1 },
            { x: bb1.x - 1, y: bb1.y + bb1.height / 2 },
            { x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2 },
            { x: bb2.x + bb2.width / 2, y: bb2.y - 1 },
            { x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1 },
            { x: bb2.x - 1, y: bb2.y + bb2.height / 2 },
            { x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2 }],
            d = {}, dis = [];
        for (var i = 0; i < 4; i++) {
            for (var j = 4; j < 8; j++) {
                var dx = Math.abs(p[i].x - p[j].x),
                    dy = Math.abs(p[i].y - p[j].y);
                if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                    dis.push(dx + dy);
                    d[dis[dis.length - 1]] = [i, j];
                }
            }
        }
        if (dis.length == 0) {
            var res = [0, 4];
        } else {
            res = d[Math.min.apply(Math, dis)];
        }

        var x1 = p[res[0]].x,
            y1 = p[res[0]].y,
            x4 = p[res[1]].x,
            y4 = p[res[1]].y;
        dx = Math.max(Math.abs(x1 - x4) / 2, 10);
        dy = Math.max(Math.abs(y1 - y4) / 2, 10);
        var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
            y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
            x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
            y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
        var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
        //path = path + "," + this.getArr1(x1, y1, x4, y4, 8);
        return path;
    },
    getArr(x1, y1, x2, y2, size, lineType) {
        if (!lineType) {
            lineType = 0;//线类型 0直线，1曲线
        }
        if (0 == lineType) {
            var angle = Raphael.angle(x1, y1, x2, y2);
            var a45 = Raphael.rad(angle - 28);
            var a45m = Raphael.rad(angle + 28);
            var x2a = x2 + Math.cos(a45) * size;
            var y2a = y2 + Math.sin(a45) * size;
            var x2b = x2 + Math.cos(a45m) * size;
            var y2b = y2 + Math.sin(a45m) * size;
            return ["M", x1, y1, "L", x2, y2, "M", x2, y2, "L", x2b, y2b, "L", x2a, y2a, "Z"].join(",");
        } else if (1 == lineType) {
            var x11 = x1;
            var angle1 = y2 > y1 ? 270 : 90;
            if (x1 < x2) {
                x11 = (x2 - x1) / 2 + x1;
                angle1 = 180;
            } else if (x1 > x2) {
                x11 = (x1 - x2) / 2 + x2;
                angle1 = 0;
            }
            var a451 = Raphael.rad(angle1 - 28);
            var a45m1 = Raphael.rad(angle1 + 28);
            var x2a1 = x2 + Math.cos(a451) * size;
            var y2a1 = y2 + Math.sin(a451) * size;
            var x2b1 = x2 + Math.cos(a45m1) * size;
            var y2b1 = y2 + Math.sin(a45m1) * size;
            return ["M", x1, y1, "L", x11, y1, "M", x11, y1, "L", x11, y2, "M", x11, y2, "L", x2, y2, "M", x2, y2, "L", x2b1, y2b1, "L", x2a1, y2a1, "Z"].join(",");
        }
        return "";
    },
    //初始化画板
    initwf() {
        this.wf_json = {};
        this.wf_steps = new Array();
        this.wf_texts = new Array();
        this.wf_conns = new Array();
        this.wf_r.clear();
    },
    removeArray(array, n) {
        if (isNaN(n) || n > array.length) {
            return false;
        }
        array.splice(n, 1);
    },
    //添加步骤
    addStep1(step) {
        if (!step) return;
        if (!this.wf_json.steps) this.wf_json.steps = [];
        var isup = false;
        for (var i = 0; i < this.wf_json.steps.length; i++) {
            if (this.wf_json.steps[i].id == step.id) {
                this.wf_json.steps[i] = step;
                this.setStepStyle(step.id, step.stepColor, step.stepShape);
                isup = true;
            }
        }
        if (!isup) {
            this.wf_json.steps.push(step);
        }
    },
    //添加线
    addLine(line) {
        if (!line || !line.from || !line.to) return;
        if (!this.wf_json.lines) this.wf_json.lines = [];
        var isup = false;
        for (var i = 0; i < this.wf_json.lines.length; i++) {
            if (this.wf_json.lines[i].id == line.id) {
                line.lineType = this.wf_json.lines[i].lineType;
                this.wf_json.lines[i] = line;
                isup = true;
            }
        }
        if (!isup) {
            this.wf_json.lines.push(line);
        }
        this.setLineText(line.id, line.text);
    },
    //得到一个步骤的状态
    getStepStatus(stepId, tasks) {
        if (!stepId || !tasks || tasks.length === 0) {
            return { completed: false, ing: false, noin: true };
        }
        var stepTasks = [];
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].taskType == 5 || tasks[i].taskType == 11) {
                continue;//抄送和征求意见不判断
            }
            if (tasks[i].stepId == stepId) {
                stepTasks.push(tasks[i]);
            }
        }
        var isCompleted = stepTasks.length > 0;
        for (var j = 0; j < stepTasks.length; j++) {
            if (stepTasks[j].status == 0) {
                isCompleted = false;
                break;
            }
        }
        return { completed: isCompleted, noin: stepTasks.length === 0 };
    },
    //根据当前JSON重载入流程
    reloadFlow(json, tasks) {
        if (!json || !json.id || json.id.toString().trim() == "") return false;
        this.wf_json = json;
        this.wf_id = this.wf_json.id;
        this.wf_r.clear();
        this.wf_steps = [];
        this.wf_conns = [];
        this.wf_texts = [];
        var steps = this.wf_json.steps;
        if (steps && steps.length > 0) {
            for (var i = 0; i < steps.length; i++) {
                //判断步骤状态
                var stepColor = tasks == null ? this.wf_noteColor : '#909399';//参数传了tasks表示是显示处理过程，否则是显示流程图。
                if (tasks && tasks.length > 0) {
                    var stepStatus = this.getStepStatus(steps[i].id, tasks);
                    if (stepStatus.completed) {
                        stepColor = "#67C23A";//已处理步骤
                    } else if (stepStatus.noin) {
                        stepColor = '#909399';//未经过
                    } else {
                        stepColor = this.wf_focusColor;//当前步骤
                    }
                }
                this.wf_nodeBorderColor = stepColor;
                this.wf_noteColor = stepColor;

                var stepTasks = [];
                if (tasks) {
                    for (var j = 0; j < tasks.length; j++) {
                        if (tasks[j].stepId == steps[i].id) {
                            //if (tasks[j].taskType == 5) {
                            //    continue;
                            //}
                            stepTasks.push(tasks[j]);
                        }
                    }
                }
                this.addStep(steps[i].position.x, steps[i].position.y, steps[i].name, steps[i].id, false, steps[i].type, ""
                    , "", steps[i].stepShape == 1 ? this.wf_height : this.wf_rect, steps[i].ico, stepTasks);
            }
        }
        var lines = this.wf_json.lines;
        if (lines && lines.length > 0) {
            for (var j = 0; j < lines.length; j++) {
                var lineColor = tasks == null ? this.wf_connColor : '#909399';
                if (tasks && tasks.length > 0) {
                    var stepStatus0 = this.getStepStatus(lines[j].from, tasks);
                    var stepStatus1 = this.getStepStatus(lines[j].to, tasks);
                    if (!stepStatus0.noin && !stepStatus1.noin) {
                        lineColor = '#67C23A';//已经过连线颜色
                    } else {
                        lineColor = '#909399';
                    }
                }
                this.wf_connColor = lineColor;
                this.connObj({
                    id: lines[j].id,
                    obj1: this.wf_r.getById(lines[j].from),
                    obj2: this.wf_r.getById(lines[j].to)
                }, false, lines[j].text, lines[j].lineType);
            }
        }
    },
    //从json中删除步骤
    deleteStep(stepid) {
        var steps = this.wf_json.steps;
        if (steps && steps.length > 0) {
            for (var i = 0; i < steps.length; i++) {
                if (steps[i].id == stepid) {
                    this.removeArray(steps, i);
                }
            }
        }
    },
    //从json中删除线
    deleteLine(lineid, textid) {
        var lines = this.wf_json.lines;
        if (lines && lines.length > 0) {
            for (var i = 0; i < lines.length; i++) {
                if (lines[i].id == lineid) {
                    this.removeArray(lines, i);
                }
            }
        }
        if (textid) {
            if (this.wf_texts && this.wf_texts.length > 0) {
                for (var j = 0; j < this.wf_texts.length; j++) {
                    if (this.wf_texts[j].id == "line_" + textid) {
                        this.wf_texts[j].remove();
                    }
                }
            }
        }
    },
    replace(str, s1, s2) {
        return !str ? str : str.replace(new RegExp(s1, "gm"), s2);
    },
    //打开流程
    openFlow(json, tasks) {
        this.reloadFlow(json, tasks);
    },
};