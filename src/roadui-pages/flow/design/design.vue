<template>
    <div class="roadui_page">
        <div class="roadui_toolbar">
            <div><button :disabled="butDisabled" @click="attrSet()" type="button"><el-icon><Operation /></el-icon>属性</button></div>
            <div><span>|</span></div>
            <div><button :disabled="butDisabled" @click="addStep()" type="button"><el-icon><Folder /></el-icon>步骤</button></div>
            <div><button :disabled="butDisabled" @click="addSubFlow()" type="button"><el-icon><Files /></el-icon>子流程</button></div>
            <div><button :disabled="butDisabled" @click="addConn(0)" type="button"><el-icon><Switch /></el-icon>直线</button></div>
            <div><button :disabled="butDisabled" @click="addConn(1)" type="button"><el-icon><Finished /></el-icon>折线</button></div>
            <div><span>|</span></div>
            <div><button :disabled="butDisabled" @click="copyStep()" type="button"><el-icon><DocumentCopy /></el-icon>复制</button></div>
            <div><button :disabled="butDisabled" @click="removeObj()" type="button"><el-icon><Close /></el-icon>删除</button></div>
            <div><span>|</span></div>
            <div><button :disabled="butDisabled" @click="saveFlow('save')" type="button"><el-icon><PriceTag /></el-icon>保存</button></div>
            <div><button :disabled="butDisabled" @click="saveAs()" type="button"><el-icon><Discount /></el-icon>另存为</button></div>
            <div><button :disabled="butDisabled" @click="saveFlow('uninstall')" type="button"><el-icon><Delete /></el-icon>卸载</button></div>
            <div><button :disabled="butDisabled" @click="saveFlow('install')" type="button"><el-icon><document-checked /></el-icon>发布</button></div>
        </div>
        <div id="flowDesignDiv_" v-loading="loading" :element-loading-text="loadingText" ref="flowDesignDivRef" style="height:calc(100% - 35px)"></div>
        <!--设置窗口-->
        <el-dialog v-model="dialogShow" :title="dialogTitle" :width="dialogWidth" class="el-dialog__padding" destroy-on-close draggable :close-on-click-modal="false">
            <component :is="dialogPage" :query="dialogQuery"></component>
            <!--<template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogShow=false">关闭</el-button>
                </span>
            </template>-->
        </el-dialog>
        <!--另存为窗口-->
        <el-dialog v-model="showSaveAsModal" title="另存为" width="500px" align-center destroy-on-close draggable :close-on-click-modal="false">
            <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-position="top" label-width="150px">
                <el-form-item label="新的流程名称" prop="newName">
                    <el-input v-model="formData.newName" clearable />
                </el-form-item>
                <!--<el-form-item label="" prop="saveOpen">
                    <el-checkbox v-model="formData.saveOpen" label="保存后立即打开" />
                </el-form-item>-->
            </el-form>
            <template #footer>
                <el-button :disabled="butDisabled" type="primary" @click="saveAsOk(ruleFormRef)">保存</el-button>
                <el-button :disabled="butDisabled" @click="showSaveAsModal=false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
    import Raphael from 'raphael';
    import Set_Attr from './attr.vue';
    import Set_Step from './step.vue';
    import Set_Line from './line1.vue';
    import { ref, shallowRef, inject, provide, onMounted, nextTick } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    //const index_removetab = inject('index_removetab');//首页关闭标签方法，另存为后如果立即打开要先关闭再打开。
    //const index_openmenu = inject('index_openmenu');//首页打开菜单方法，另存为后如果立即打开要调用。
    //const index_tabs = inject('index_tabs');//首页tabs

    const butDisabled = ref(false);//按钮禁用状态
    const loading = ref(false);//显示保存安装等状态
    const loadingText = ref('');//显示保存安装等状态标题
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const isNew = utils.query('isnew', props.query);//是否是新建
    const flowId = utils.query('flowid', props.query);//流程id
    const typeId = utils.query('typeid', props.query);//分类id

    const flowDesignDivRef = ref(null);
    let flowJson = ref({});//流程json
    let wf_r = null; //画板对象
    let wf_steps = []; //步骤数组
    let wf_texts = []; //文本数组
    let wf_conns = []; //连线数组
    let wf_imgs = []; //图标数组
    let wf_option = ""; //当前操作
    let wf_focusObj = null; //当前焦点对象
    let wf_width = 108; //步骤宽度
    let wf_height = 50; //步骤高度
    let wf_rect = 10; //圆角大小
    let wf_designer = true;//是否是设计模式(查看流程图时不绑定双击事件）
    let wf_connColor = "#0188fb";//连线的常规颜色
    let wf_nodeBorderColor = "#0188fb"; //节点边框颜色
    let wf_noteColor = "#0188fb";//节点填充颜色
    let wf_nodeTextColor = "#ffffff"; //节点字颜色
    let wf_nodeTextSize = 14;//节点字大小
    let wf_focusColor = "#ffb526"; //当前焦点颜色
    let wf_stepDefaultName = "步骤";//默认步骤名称
    let wf_lineType = 0; //当前连线类型
    let mouseX = 0;
    let mouseY = 0;
    let wf_json = {}; //设计json
    let tempArrPath = [];//临时连线

    const dialogShow = ref(false);//是否显示设置窗口
    const dialogTitle = ref('');//设置窗口标题
    const dialogWidth = ref('600px');//设置窗口宽度
    const dialogPage = shallowRef('');//窗口页面
    const dialogQuery = ref('');//窗口页面参数

    const workRoles = ref([]);//工作角色选项，步骤策略设置时调用
    const buttons = ref([]);//流程按钮，步骤按钮设置时调用
    const flows = ref([]);//子流程流程选项，步骤子流程设置时调用
    const appTypes = ref([]);//载入应用分类，步骤设置表单时用

    const showSaveAsModal = ref(false);//显示另存为窗口
    const formData = ref({ newName: '', saveOpen: false, });//另存为表单数据
    const ruleFormRef = ref(null);
    const rules = { newName: [{ required: true, message: '请输入新流程名称', trigger: 'blur', },], };//另存为表单名称验证

    provide('flowJson', flowJson);
    provide('appTypes', appTypes);
    provide('workRoles', workRoles);
    provide('buttons', buttons);

    onMounted(() => {
        nextTick(() => {
            loadFlow();
        });
    });

    //初始化画板 flowJson流程JSON，如果是打开流程时要获取最大步骤的x,y坐标，解决在分辩率大的浏览器上设置的流程，在分辩率小的浏览器打开显示不全的问题。
    function initR(flowJson) {
        const maxStepXY = utils.getFlowMaxXY(flowJson.steps);
        let w = flowDesignDivRef.value.offsetWidth - 25;
        let h = flowDesignDivRef.value.offsetHeight - 25;
        if (maxStepXY.x > w) {
            w = maxStepXY.x + 180;
        }
        if (maxStepXY.y > h) {
            h = maxStepXY.y + 50;
        }
        //根据主题得到colorObj
        let theme = utils.getTheme();
        let colorObj = undefined;
        if (utils.isDef(theme) && utils.length(theme.color) > 0) {
            colorObj = { line: theme.color, step: theme.color, focus: wf_focusColor, fontSize: wf_nodeTextSize, stepText: wf_nodeTextColor };
        }
        init('flowDesignDiv_', w, h, colorObj);
    }

    //打开设置窗口
    function openModal(title, page, query, width) {
        dialogPage.value = page;
        dialogQuery.value = query;
        dialogWidth.value = width || '500px';
        dialogTitle.value = title || '';
        dialogShow.value = true;
    }
    //打开流程
    function loadFlow() {
        loading.value = true;
        loadingText.value = '正在加载…';
        butDisabled.value = true;
        ajax.post('/Flow/GetFlowDesignJson?isdesign=1&isnew=' + isNew + '&typeid=' + typeId + '&flowid=' + flowId).then((res) => {
            if (!res.success) {
                let msg = res.msg;
                if (res.code == 2) {
                    msg = '未找到流程！';
                } else if (res.code == 3) {
                    msg = '您没有权限管理该流程！';
                } else {
                    msg = '打开失败！';
                }
                utils.msg(msg, res.success);
            } else {
                flowJson.value = res.data;
                initR(flowJson.value);
                if (!utils.isArray(flowJson.value.type)) {
                    flowJson.value['type'] = [];
                }
                if ('1' === isNew) {
                    attrSet();
                }
                openFlow(flowJson.value);
            }
            loading.value = false;
            loadingText.value = '';
            butDisabled.value = false;
        }).catch(() => { });
    }
    //流程属性
    function attrSet() {
        openModal('流程属性', Set_Attr, '', '800px');
    }
    //另存为
    function saveAs() {
        if (utils.length(flowJson.value.id) <= 0) {
            utils.msg("请先新建或打开一个流程！", false);
            return false;
        }
        formData.value = { newName: flowJson.value && flowJson.value.name ? flowJson.value.name : '', saveOpen: false, };
        showSaveAsModal.value = true;
    }
    //确定另存为
    async function saveAsOk(formEl) {
        if (!formEl) {
            return;
        }
        await formEl.validate((valid) => {
            if (valid) {
                butDisabled.value = true;
                formData.value.id = flowJson.value.id;
                ajax.post('/Flow/SaveAs', qs.stringify(formData.value)).then((res) => {
                    if (res.success) {
                        utils.msg('另存成功！', true);
                        //如果要立即打开
                        //if (formData.value.saveOpen) {
                        //    index_removetab('flowdesign_' + flowId);//先关闭
                        //    const tabIndex = index_tabs.value.findIndex(item => item.id.indexOf('flowdesign_') >= 0);
                        //    if (tabIndex >= 0) {
                        //        utils.msg('当前有流程正在设计中，请先关闭设计中的流程再打开该流程！', false);
                        //        return;
                        //    }
                        //    const menu = {
                        //        id: 'flowdesign_' + res.data,
                        //        title: '设计流程-' + formData.value.newName,
                        //        ico: 'Edit',
                        //        openMode: 0,
                        //        url: '/flow/design/design?isnew=0&typeid=' + typeId + '&flowid=' + res.data,
                        //    };
                        //    index_openmenu(menu);
                        //}
                        //关闭窗口
                        showSaveAsModal.value = false;
                    } else {
                        let msg = res.msg;
                        if (utils.length(msg) === 0) {
                            if (res.code == 1) {
                                msg = '未找到要另存的流程！';
                            } else if (res.code == 2) {
                                msg = '流程id或流程名称或用户id错误！';
                            } else {
                                msg = '另存失败！';
                            }
                        }
                        utils.msg(msg, false);
                    }
                    butDisabled.value = false;
                }).catch(() => { });
            }
        });
    }
    //保存流程
    function saveFlow(op) {
        if (!flowJson.value) {
            utils.msg("未设置流程！", false);
            return false;
        } else if (utils.length(flowJson.value.id) <= 0) {
            utils.msg("请先新建或打开流程！", false);
            return false;
        } else if (utils.length(flowJson.value.name) <= 0) {
            utils.msg("流程名称不能为空，请在属性中设置！", false);
            return false;
        } else if (utils.length(flowJson.value.type) <= 0) {
            utils.msg("流程分类不能为空，请在属性中设置！", false);
            return false;
        }

        var title = "";
        if (op == "save") title = "保存";
        else if (op == "install") title = "发布";
        else if (op == "uninstall") title = "卸载";
        else if (op == "delete") title = "删除";
        loading.value = true;
        loadingText.value = '正在' + title + '…';
        butDisabled.value = true;
        ajax.post('/Flow/SaveFlow', qs.stringify({ opation: op, id: flowId, json: JSON.stringify(flowJson.value) })).then((res) => {
            let msg = res.msg;
            //-1：未知错误 1：json解析错误 2：id错误 3：名称错误 4：分类错误 5：没有找到流程 6：流程至少需要一个步骤
            if (utils.length(msg) === 0) {
                switch (res.code) {
                    case 0:
                        msg = title + '成功！';
                        break;
                    case 1:
                        msg = 'Json解析错误！';
                        break;
                    case 2:
                        msg = '流程id错误！';
                        break;
                    case 3:
                        msg = '流程名称不能为空，请在属性中设置！';
                        break;
                    case 4:
                        msg = '流程分类不能为空，请在属性中设置！';
                        break;
                    case 5:
                        msg = '未找到流程！';
                        break;
                    case 6:
                        msg = '流程至少需要一个步骤！';
                        break;
                    default:
                        msg = title + '失败！';
                        break;
                }
            }
            utils.msg(msg, res.success);
            butDisabled.value = false;
            loading.value = false;
            loadingText.value = '';
        });
    }

    //=============流程设计器==================
    //初始化，id 画布的div id, width：宽度 height:高度 colorObj：颜色设置 isDesign：是否是设计模式
    function init(id, width, height, colorObj) {
        if (colorObj) {
            wf_connColor = colorObj.line;
            wf_nodeBorderColor = colorObj.step;
            wf_noteColor = colorObj.step;
            wf_focusColor = colorObj.focus;
            wf_nodeTextSize = colorObj.fontSize;
            wf_nodeTextColor = colorObj.stepText;
        }
        wf_r = Raphael(id, width, height);
        wf_r.customAttributes.type1 = function () { };
        wf_r.customAttributes.fromid = function () { };
        wf_r.customAttributes.toid = function () { };

        //随着节点位置的改变动态改变箭头
        Raphael.fn.drawArr = function (obj, lineType) {
            if (!obj || !obj.obj1) {
                return;
            }

            lineType = lineType || (wf_lineType || 0);

            if (!obj.obj2) {
                var point1 = getStartEnd(obj.obj1, obj.obj2);
                var path2 = getArr(point1.start.x, point1.start.y, mouseX, mouseY, 8, lineType);
                for (var ij = 0; ij < tempArrPath.length; ij++) {
                    tempArrPath[ij].arrPath.remove();
                }
                tempArrPath = [];
                obj.arrPath = this.path(path2);
                obj.arrPath.attr({ "stroke-width": 2, "stroke": wf_connColor, "fill": wf_connColor });
                tempArrPath.push(obj);
                return null;
            }

            var point = getStartEnd(obj.obj1, obj.obj2);
            var path1 = getArr(point.start.x, point.start.y, point.end.x, point.end.y, 8, lineType);
            if (obj.arrPath) {
                obj.arrPath.attr({ "path": path1 });
            } else {
                obj.arrPath = this.path(path1);
                obj.arrPath.attr({ "stroke-width": 2, "stroke": wf_connColor, "fill": wf_connColor });
                let isTrue = true;
                if (isTrue) {
                    obj.arrPath.id = obj.id;
                    obj.arrPath.fromid = obj.obj1.id;
                    obj.arrPath.toid = obj.obj2.id;
                    obj.arrPath.click(function connClick() {
                        for (var i = 0; i < wf_conns.length; i++) {
                            if (wf_conns[i].arrPath.id == this.id) {
                                wf_conns[i].arrPath.attr({ "stroke": wf_focusColor, "fill": wf_focusColor });
                            } else {
                                wf_conns[i].arrPath.attr({ "stroke": wf_connColor, "fill": wf_connColor });
                            }
                        }
                        //for (var i = 0; i < wf_steps.length; i++) {
                        //    wf_steps[i].attr("fill", "#efeff0");
                        //    wf_steps[i].attr("stroke", "#23508e");
                        //}
                        wf_focusObj = this;
                    });
                    obj.arrPath.dblclick(function connSet() {
                        openModal('流转条件', Set_Line, '?lineid=' + obj.id + '&flowid=' + flowId + '&fromstepid=' + obj.obj1.id + '&tostepid=' + obj.obj2.id, '850px');
                    });
                }
            }
            wf_lineType = undefined;
            if (tempArrPath && tempArrPath.length > 0) {
                for (var ii = 0; ii < tempArrPath.length; ii++) {
                    tempArrPath[ii].arrPath.remove();
                }
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
    }
    //节点鼠标拖动事件
    function mouseMove(ev) {
        ev = ev || window.event;
        var mousePos = mouseCoords(ev);
        mouseX = mousePos.x;
        mouseY = mousePos.y;
        var obj = { obj1: wf_focusObj, obj2: null };
        wf_r.drawArr(obj);
    }
    function mouseCoords(ev) {
        if (ev.layerX && ev.layerY && ev.layerX > 0 && ev.layerY > 0) {
            return { x: ev.layerX - 5, y: ev.layerY - 5 };
        }
        if (ev.offsetX && ev.offsetY && ev.offsetX > 0 && ev.offsetY > 0) {
            return { x: ev.offsetX - 5, y: ev.offsetY - 5 };
        }
        return {
            x: ev.offsetX + document.body.scrollLeft - document.body.clientLeft,
            y: ev.offsetY + document.body.scrollTop - document.body.clientTop
        };
    }
    //添加步骤，判断id，没有先生成id。
    function addStep(x, y, text, id, addToJSON, type1, bordercolor, bgcolor, filletSize, imgSrc) {
        if (utils.length(id) === 0) {
            //如果新增步骤没有ID,要先获取ID。
            utils.getLongId().then((longId) => {
                addStep11(x, y, text, longId, addToJSON, type1, bordercolor, bgcolor, filletSize, imgSrc);
            });
        } else {
            addStep11(x, y, text, id, addToJSON, type1, bordercolor, bgcolor, filletSize, imgSrc);
        }
    }
    //添加一个步骤 filletSize圆角大小
    function addStep11(x, y, text, id, addToJSON, type1, bordercolor, bgcolor, filletSize, imgSrc) {
        if (utils.length(id) === 0) {
            console.log('id error');
            return;
        }
        //var guid = this.getGuid();
        var xy = getNewXY();
        x = x || xy.x;
        y = y || xy.y;
        text = text || wf_stepDefaultName;
        id = id + '';
        var rect = wf_r.rect(x, y, wf_width, wf_height, filletSize || wf_rect);
        var step_color = bgcolor || wf_noteColor;
        rect.attr({
            "fill": step_color,
            "stroke": bordercolor || wf_nodeBorderColor,
            "stroke-width": 0,
            "title": text,
            "cursor": "default",
        });
        rect.id = id;
        rect.type1 = type1 ? type1 : "normal";
        rect.drag(
            function move(dx, dy) {
                var x = this.ox + dx;
                var y = this.oy + dy;
                if (x < 10) {
                    x = 10;
                } else if (x > wf_r.width - wf_width) {
                    x = wf_r.width - wf_width;
                }
                if (y < 10) {
                    y = 10;
                } else if (y > wf_r.height - wf_height) {
                    y = wf_r.height - wf_height;
                }
                this.attr("x", x);
                this.attr("y", y);
                if (this.id) {
                    var img = wf_r.getById("img_" + this.id);
                    if (img != null) {
                        img.attr("x", x + 42);
                        img.attr("y", y + 7);
                    }
                    var text = wf_r.getById('text_' + this.id);
                    if (text != null) {
                        text.attr("x", x + 52);
                        text.attr("y", y + (img ? 32 : 25));
                    }
                }
                for (var j = wf_conns.length; j--;) {
                    if (wf_conns[j].obj1.id == this.id || wf_conns[j].obj2.id == this.id) {
                        var lineType = 0;
                        for (var n = 0; n < wf_json.lines.length; n++) {
                            if (wf_json.lines[n].id == wf_conns[j].arrPath.id) {
                                setLineText(wf_json.lines[n].id, wf_json.lines[n].text);
                                lineType = wf_json.lines[n].lineType;
                                break;
                            }
                        }
                        wf_r.drawArr(wf_conns[j], lineType);
                    }
                }
                //wf_r.safari();
            },
            function dragger() {
                this.ox = this.attr("x");
                this.oy = this.attr("y");
                changeStyle(this);
            },
            function up() {
                changeStyle(this);
                //记录移动后的位置
                if (isStepObj(this)) {
                    var bbox = this.getBBox();
                    if (bbox) {
                        var steps = wf_json.steps;
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
            });
        rect.click(function click() {
            switch (wf_option) {
                case "line":
                    utils.getLongId().then((longId) => {
                        var obj = { id: longId + '', obj1: wf_focusObj, obj2: this };
                        connObj(obj);
                        wf_option = "";
                        wf_lineType = undefined;
                        wf_focusObj = this;
                    });
                    break;
                default:
                    changeStyle(this);
                    wf_option = "";
                    wf_lineType = undefined;
                    wf_focusObj = this;
                    break;
            }
        });
        if ("normal" == rect.type1) {
            rect.dblclick(function stepSet() {
                openModal('流程步骤' + ' - ' + text, Set_Step, '?stepid=' + id, '950px');
            });
        }
        else if ("subflow" == rect.type1) {
            rect.dblclick(function subflowSet() {
                openModal('子流程步骤' + ' - ' + text, Set_Step, '?stepid=' + id, '950px');
            });
        }
        wf_steps.push(rect);
        var hasImg = imgSrc && imgSrc.toString().trim().length > 0;//是否有图标
        var text2 = getNtext(text);
        var text1 = wf_r.text(x + 52, y + (hasImg ? 32 : 25), text2);
        text1.attr({ "font-size": wf_nodeTextSize.toString() + "px", "font-family": "sans-serif", "fill": wf_nodeTextColor });
        text1.id = "text_" + id;
        text1.type1 = "text";
        //给text1绑定事件，在步骤名称上双击也能弹出步骤设置框。
        text1.click(function click() {
            switch (wf_option) {
                case "line":
                    utils.getLongId().then((longId) => {
                        var obj = { id: longId + '', obj1: wf_focusObj, obj2: rect };
                        connObj(obj);
                        wf_option = "";
                        wf_lineType = undefined;
                        wf_focusObj = rect;
                    });
                    break;
                default:
                    changeStyle(rect);
                    wf_option = "";
                    wf_lineType = undefined;
                    wf_focusObj = rect;
                    break;
            }
        });
        if ("normal" == rect.type1) {
            text1.dblclick(function stepSet() {
                openModal('流程步骤' + ' - ' + text, Set_Step, '?stepid=' + id, '950px');
            });
        }
        else if ("subflow" == rect.type1) {
            text1.dblclick(function subflowSet() {
                openModal('子流程步骤' + ' - ' + text, Set_Step, '?stepid=' + id, '950px');
            });
        }
        //==========================
        wf_texts.push(text1);
        if (hasImg) {
            var img = wf_r.image(imgSrc, x + 42, y + 7, 16, 16);
            img.id = "img_" + id;
            img.type1 = "image";
            wf_imgs.push(img);
        }
        if (addToJSON == undefined || addToJSON == null) addToJSON = true;
        if (addToJSON) {
            var step = {};
            step.id = id;
            step.type = type1 ? type1 : "normal";
            step.name = text;
            step.position = { x: x, y: y, width: wf_width, height: wf_height };
            step.opinionDisplay = true;
            step.expiredPrompt = false;
            step.signatureType = "0";
            step.workTime = "";
            step.limitTime = "";
            step.otherTime = "";
            step.batch = false;
            step.archives = false;
            step.archivesParams = "";
            step.note = "";
            step.dataToDb = true;
            step.behavior = { flowType: "0", hanlderModel: "0", backModel: "1", countersignature: "0", backType: "0", runSelect: true };
            step.copyFor = { time: 0 };
            step.forms = [];
            step.buttons = [];
            step.fieldStatus = [];
            step.event = {};
            step.subflow = {};
            addStep1(step);
        }
    }
    //得到换行的节点名称
    function getNtext(text) {
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
    }
    //添加子流程节点
    function addSubFlow() {
        addStep(null, null, "子流程步骤", null, null, "subflow", null, null)
    }
    //克隆一个对象
    function clone(obj) {
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
                            o.push(clone(obj[i]));
                        }
                    } else {
                        o = {};
                        for (var k in obj) {
                            o[k] = clone(obj[k]);
                        }
                    }
                }
                break;
            default:
                o = obj;
                break;
        }
        return o;
    }
    //复制当前选中步骤
    function copyStep() {
        if (wf_focusObj == null || !isStepObj(wf_focusObj)) {
            utils.msg("请选择要复制的步骤！", false);
            return;
        }
        var json = {};
        var text = "";
        utils.getLongId().then((longId) => {
            var id = longId + '';//this.getGuid();
            if (wf_json && wf_json.steps) {
                for (var i = 0; i < wf_json.steps.length; i++) {
                    if (wf_json.steps[i].id == wf_focusObj.id) {
                        json = clone(wf_json.steps[i]);
                        json.forms = wf_json.steps[i].forms;
                        json.buttons = wf_json.steps[i].buttons;
                        json.fieldStatus = wf_json.steps[i].fieldStatus;
                        json.id = id;
                        text = json.name;
                        addStep1(json);
                        addStep(undefined, undefined, text, id, false);
                        break;
                    }
                }
            }
        });
    }
    //设置步骤文本
    function setStepText(id, txt) {
        var stepText = wf_r.getById("text_" + id);
        if (stepText != null) {
            stepText.attr({ "text": getNtext(txt) });
        }
    }
    //设置步骤图标
    function setStepIco(id, x, y, imgSrc) {
        var stepIco = wf_r.getById("img_" + id);
        if (stepIco != null) {
            if (!imgSrc || imgSrc.toString().trim().length == 0) {
                for (var i = 0; i < wf_imgs.length; i++) {
                    if (wf_imgs[i].id == "img_" + id) {
                        wf_imgs.remove(i);
                    }
                }
                for (var j = 0; j < wf_texts.length; j++) {
                    if (wf_texts[j].id == "text_" + id) {
                        wf_texts[j].attr("y", parseFloat(wf_texts[j].attr("y")) - 7);
                    }
                }
            }
            stepIco.attr({ "src": imgSrc });
        } else {
            if (!imgSrc || imgSrc.toString().trim().length == 0) {
                return;
            }
            var img = wf_r.image(imgSrc, x + 42, y + 7, 16, 16);
            img.id = "img_" + id;
            img.type1 = "image";
            this.wf_imgs.push(img);
            var stepText = wf_r.getById("text_" + id);
            if (stepText) {
                stepText.attr({ "y": y + 32 });
            }
        }
    }
    //设置步骤样式 color 颜色 shape 形状 0炬型 1椭圆 2圆
    function setStepStyle(id, color, shape) {
        var step = wf_r.getById(id);
        if (step) {
            var stepcolor = "";
            if (color) {
                stepcolor = color;
            } else {
                stepcolor = wf_noteColor;
            }
            step.attr("fill", stepcolor);
            step.data("stepcolor", stepcolor);
            if (shape) {
                if ("0" == shape) {
                    step.attr("r", wf_rect);
                } else if ("1" == shape) {
                    step.attr({ "r": wf_height })
                } else if ("2" == shape) {
                    step.attr({ "width": wf_height + 25, "height": wf_height + 25, "r": wf_height + 25 });
                    var text = wf_r.getById("text_" + id);
                    if (text) {
                        var text_x = text.attr("x");
                        text.attr({ "x": parseFloat(text_x) + 15 - ((wf_height + 50) / 2) });
                    }
                }
            }
        }
    }
    //得到新步骤的XY
    function getNewXY() {
        var x = 10, y = 50;
        if (wf_steps.length > 0) {
            var step = wf_steps[wf_steps.length - 1];
            x = parseInt(step.attr("x")) + 170;
            y = parseInt(step.attr("y"));
            if (x > wf_r.width - wf_width) {
                x = 10;
                y = y + 100;
            }
            if (y > wf_r.height - wf_height) {
                y = wf_r.height - wf_height;
            }
        }
        return { x: x, y: y };
    }
    //添加连线
    function addConn(lineType) {
        if (!wf_focusObj || !isStepObj(wf_focusObj)) {
            utils.msg("请选择要连接的步骤！", false);
            return false;
        }
        wf_option = "line";
        wf_lineType = lineType;
        document.body.onmousemove = mouseMove;
        document.body.onmousedown = function () {
            for (var i = 0; i < tempArrPath.length; i++) {
                tempArrPath[i].arrPath.remove();
            }
            tempArrPath = [];
            document.body.onmousemove = null;
        };
    }
    //连接对象
    function connObj(obj, addToJSON, title, lineType) {
        if (addToJSON == undefined || addToJSON == null) addToJSON = true;
        if (isLine(obj)) {
            lineType = lineType == undefined || lineType == null ? wf_lineType : lineType;
            var newline = wf_r.drawArr(obj, lineType);
            wf_conns.push(newline);
            if (addToJSON) {
                var line = {};
                line.id = obj.id;
                line.from = obj.obj1.id;
                line.to = obj.obj2.id;
                line.customMethod = "";
                line.sql = "";
                line.noaccordMsg = "";
                line.text = title || "";
                line.lineType = lineType;
                addLine(line);
            } else {
                if (title) {
                    setLineText(obj.id, title);
                }
            }
        }
    }
    //判断一个节点与另一个节点之间是否可以连线
    function isLine(obj) {
        if (!obj || !obj.obj1 || !obj.obj2) {
            return false;
        }
        if (obj.obj1 === obj.obj2) {
            return false;
        }
        if (!isStepObj(obj.obj1) || !isStepObj(obj.obj2)) {
            return false;
        }
        for (var i = 0; i < wf_conns.length; i++) {
            if (obj.obj1 === obj.obj2 || (wf_conns[i].obj1 === obj.obj1 && wf_conns[i].obj2 === obj.obj2)) {
                return false;
            }
        }
        return true;
    }
    //判断一个对象是否是步骤对象
    function isStepObj(obj) {
        return obj && obj.type1 && (obj.type1.toString() == "normal" || obj.type1.toString() == "subflow");
    }
    function setLineText(id, txt) {
        var line;
        for (var i = 0; i < wf_conns.length; i++) {
            if (wf_conns[i].id == id) {
                line = wf_conns[i];
                break;
            }
        }
        if (!line) {
            return;
        }
        var bbox = line.arrPath.getBBox();
        var txt_x = (bbox.x + bbox.x2) / 2;
        var txt_y = (bbox.y + bbox.y2) / 2;
        var lineText = wf_r.getById("line_" + id);
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
            var textObj = wf_r.text(txt_x, txt_y, txt);
            textObj.type1 = "line";
            textObj.id = "line_" + id;
            textObj.attr({ "font-size": "14px" });
            wf_texts.push(textObj);
        }
        //line.arrPath.attr("title", txt);
    }
    //删除当前焦点及其附属对象
    function removeObj() {
        if (!wf_focusObj) {
            utils.msg("请选择要删除的对象！", false);
            return false;
        }
        utils.confirm('您确认要删除选定对象吗？', () => {
            if (isStepObj(wf_focusObj))//如果选中的是步骤
            {
                if (wf_focusObj.id) {
                    for (var i = 0; i < wf_texts.length; i++) {
                        if (wf_texts[i].id == "text_" + wf_focusObj.id) {
                            wf_texts.remove(i);
                            var text = wf_r.getById("text_" + wf_focusObj.id);
                            if (text) text.remove();
                        }
                    }
                    for (var ii = 0; ii < wf_imgs.length; ii++) {
                        if (wf_imgs[ii].id == "img_" + wf_focusObj.id) {
                            wf_imgs.remove(ii);
                            var img = wf_r.getById("img_" + wf_focusObj.id);
                            if (img) img.remove();
                        }
                    }
                }
                var deleteConnIndex = new Array();
                for (var j = 0; j < wf_conns.length; j++) {
                    if (wf_conns[j].arrPath && (wf_conns[j].obj1.id == wf_focusObj.id || wf_conns[j].obj2.id == wf_focusObj.id)) {
                        deleteLine(wf_conns[j].id, wf_conns[j].arrPath.id);
                        deleteConnIndex.push(j);
                        wf_conns[j].arrPath.remove();
                    }
                }
                for (var m = deleteConnIndex.length; m--;) {
                    wf_conns.remove(deleteConnIndex[m]);
                }
                deleteConnIndex = new Array();

                for (var k = 0; k < wf_steps.length; k++) {
                    if (wf_steps[k].id == wf_focusObj.id) {
                        wf_steps.remove(k);
                        deleteStep(wf_focusObj.id);
                    }
                }
                wf_focusObj.remove();
            } else//如果选中的是线
            {
                for (var jj = 0; jj < wf_conns.length; jj++) {
                    if (wf_conns[jj].arrPath && wf_conns[jj].arrPath.id == wf_focusObj.id) {
                        deleteLine(wf_conns[jj].id, wf_conns[jj].arrPath.id);
                        wf_conns.remove(jj);
                    }
                }
                wf_focusObj.remove();
            }
            wf_focusObj = undefined;
        });
    }
    //改变节点样式
    function changeStyle(obj) {
        if (!obj || !wf_designer) {
            return;
        }
        for (var i = 0; i < wf_steps.length; i++) {
            var noteColor = wf_noteColor;
            if (wf_steps[i].id == obj.id) {
                wf_steps[i].attr("fill", wf_focusColor);
                wf_steps[i].attr("stroke", wf_focusColor);
            } else {
                wf_steps[i].attr("fill", noteColor);
                wf_steps[i].attr("stroke", wf_nodeBorderColor);
            }
        }
        //for (var i = 0; i < wf_conns.length; i++) {
        //    if (wf_conns[i].arrPath) {
        //        wf_conns[i].arrPath.attr({"stroke": wf_connColor, "fill": wf_connColor});
        //    }
        //}
        //obj.animate({ }, 500);
    }
    function getStartEnd(obj1, obj2) {
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
    }
    //曲线
    function getStartEnd1(obj1, obj2) {
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
    }
    function getArr(x1, y1, x2, y2, size, lineType) {
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
            var a46 = Raphael.rad(angle1 - 28);
            var a46m = Raphael.rad(angle1 + 28);
            var x3a = x2 + Math.cos(a46) * size;
            var y3a = y2 + Math.sin(a46) * size;
            var x3b = x2 + Math.cos(a46m) * size;
            var y3b = y2 + Math.sin(a46m) * size;
            return ["M", x1, y1, "L", x11, y1, "M", x11, y1, "L", x11, y2, "M", x11, y2, "L", x2, y2, "M", x2, y2, "L", x3b, y3b, "L", x3a, y3a, "Z"].join(",");
        }
        return "";
    }
    function removeArray(array, n) {
        if (isNaN(n) || n > array.length) {
            return false;
        }
        array.splice(n, 1);
    }
    //添加步骤
    function addStep1(step) {
        if (!step) return;
        if (!wf_json.steps) wf_json.steps = [];
        var isup = false;
        for (var i = 0; i < wf_json.steps.length; i++) {
            if (wf_json.steps[i].id == step.id) {
                wf_json.steps[i] = step;
                setStepStyle(step.id, step.stepColor, step.stepShape);
                isup = true;
            }
        }
        if (!isup) {
            wf_json.steps.push(step);
        }
    }
    //添加线
    function addLine(line) {
        if (!line || !line.from || !line.to) return;
        if (!wf_json.lines) wf_json.lines = [];
        var isup = false;
        for (var i = 0; i < wf_json.lines.length; i++) {
            if (wf_json.lines[i].id == line.id) {
                line.lineType = wf_json.lines[i].lineType;
                wf_json.lines[i] = line;
                isup = true;
            }
        }
        if (!isup) {
            wf_json.lines.push(line);
        }
        setLineText(line.id, line.text);
    }
    //根据当前JSON重载入流程
    function reloadFlow(json) {
        if (!json || !json.id || json.id.toString().trim() === '') return false;
        wf_json = json;
        wf_r.clear();
        wf_steps = [];
        wf_conns = [];
        wf_texts = [];
        var steps = wf_json.steps;
        if (steps && steps.length > 0) {
            for (var i = 0; i < steps.length; i++) {
                addStep(steps[i].position.x, steps[i].position.y, steps[i].name, steps[i].id, false, steps[i].type, "", steps[i].stepColor, steps[i].stepShape == 1 ? wf_height : wf_rect, steps[i].ico);
            }
        }
        var lines = wf_json.lines;
        if (lines && lines.length > 0) {
            for (var ii = 0; ii < lines.length; ii++) {
                connObj({
                    id: lines[ii].id,
                    obj1: wf_r.getById(lines[ii].from),
                    obj2: wf_r.getById(lines[ii].to)
                }, false, lines[ii].text, lines[ii].lineType);
            }
        }
    }
    //从json中删除步骤
    function deleteStep(stepid) {
        var steps = wf_json.steps;
        if (steps && steps.length > 0) {
            for (var i = 0; i < steps.length; i++) {
                if (steps[i].id == stepid) {
                    removeArray(steps, i);
                }
            }
        }
    }
    //从json中删除线
    function deleteLine(lineid, textid) {
        var lines = wf_json.lines;
        if (lines && lines.length > 0) {
            for (var i = 0; i < lines.length; i++) {
                if (lines[i].id == lineid) {
                    removeArray(lines, i);
                }
            }
        }
        if (textid) {
            if (wf_texts && wf_texts.length > 0) {
                for (var ii = 0; ii < wf_texts.length; ii++) {
                    if (wf_texts[ii].id == "line_" + textid) {
                        wf_texts[ii].remove();
                    }
                }
            }
        }
    }
    //打开流程
    function openFlow(json) {
        reloadFlow(json);
    }
    //=============流程设计器完================

    //注入设置连线标签方法，供子页面调用。
    provide('design_setLineText', setLineText);
    provide('desing_setStepText', setStepText);
</script>