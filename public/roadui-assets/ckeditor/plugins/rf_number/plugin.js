CKEDITOR.plugins.add('rf_number', {
    requires: ['dialog'],
    init: function (editor) {
        var pluginName = 'rf_number';
        //给自定义插件注册一个调用命令
        editor.addCommand(pluginName, new CKEDITOR.dialogCommand(pluginName));
        editor.addCommand(pluginName + "_delete", {
            exec: function (editor) {
                CKEDITOR.rf_remove(editor);
            }
        });

        //为文本框双击事件绑定一个事件，即显示弹出窗
        editor.on('doubleclick', function (evt) {
            var element = evt.data.element;
            if (element.is('input')) {
                var type = element.getAttribute('type') || 'text';
                if (type == 'text' && 'number' == element.getAttribute('data-type')) {
                    editor.currentSelectEditorElement = element;//保存当前焦点对象 currentSelectEditorElement
                    evt.data.dialog = pluginName;
                }
            }
        });
        //注册一个按钮，来调用自定义插件
        editor.ui.addButton(pluginName, {
            label: "数字输入框",
            command: pluginName,
            icon: this.path + "number.png",
            toolbar: 'rf_plugins,7'
        });
        if (editor.contextMenu) {
            editor.addMenuGroup('rf_plugins');
            editor.addMenuItem(pluginName, {
                label: '数字输入框属性',
                command: pluginName,
                group: 'rf_plugins'
            });
            editor.addMenuItem(pluginName + '_delete', {
                label: '删除数字输入框',
                command: pluginName + '_delete',
                group: 'rf_plugins'
            });

            //右键菜单的监听器，判断是否显示菜单
            editor.contextMenu.addListener(function (element) {
                if (element && !element.isReadOnly()) {
                    var name = element.getName();
                    if (name == 'input') {
                        var type = element.getAttribute('type');
                        if (type == 'text' && 'number' == element.getAttribute('data-type')) {
                            editor.currentSelectEditorElement = element;//保存当前焦点对象 currentSelectEditorElement
                            return { rf_number: CKEDITOR.TRISTATE_OFF, rf_number_delete: CKEDITOR.TRISTATE_OFF };
                        }
                    }
                }
            });
        }
        CKEDITOR.dialog.add(pluginName, function (editor) {
            return {
                title: '数字输入框',
                minWidth: 700,
                minHeight: 450,
                contents: [{
                    id: pluginName + '_attr',
                    label: '属性',
                    title: '属性',
                    elements:
                        [
                            {
                                id: pluginName + '_attr',
                                type: 'html',
                                html: '<iframe style="width:100%;height:450px;border:0;" frameborder="0" src="index.html?loadurl=' + encodeURIComponent('/form/plugins/number.vue?editorname=' + editor.name) + editor.iframeQueryString + '"></iframe>'
                            }
                        ]
                }],
                onShow: function () {
                    if (editor.initFunction_number) {
                        editor.initFunction_number(editor.currentSelectEditorElement);
                    }
                },
                onHide: function () {
                    editor.currentSelectEditorElement = null;
                },
                onOk: function () {
                    var json = editor.currentSelectEditorElementJson;
                    if (!json) {
                        return;
                    }
                    var add = false;
                    var input = editor.currentSelectEditorElement;
                    if (!input) {
                        input = editor.document.createElement("input");
                        add = true;
                    }

                    var table = editor.formAttributeJSON.dbTable;
                    //如果没有绑定字段，则生成id。
                    var bindField = editor.utils.length(json.field) === 0 ? '' : json.field;
                    var id = editor.designjs.getId(table, bindField, json.id);
                    input.setAttribute("type", "text");
                    input.setAttribute("data-type", "number");
                    input.setAttribute("value", (json.label || '数字输入框') + (bindField.length === 0 ? "" : "(" + bindField + ")"));
                    input.setStyle("color", editor.designjs.ctlColor);
                    input.setAttribute("data-id", id);
                    input.setAttribute("data-label", json.label || '');
                    input.setAttribute("data-bindfiled", bindField || '');
                    input.setAttribute("data-defaultvalue", editor.utils.encodeURI(json.defaultValue || ''));
                    input.setAttribute("data-width", json.width || '');
                    input.setAttribute("data-disabled", json.disabled || 'false');
                    input.setAttribute("data-placeholder", json.placeholder || '');
                    input.setAttribute("data-step", json.step);//计数器步长
                    input.setAttribute("data-stepstrictly", json.stepstrictly || 'false');//是否只能输入 step 的倍数
                    input.setAttribute("data-precision", json.precision);//数值精度
                    input.setAttribute("data-min", json.min);//设置计数器允许的最小值
                    input.setAttribute("data-max", json.max);//设置计数器允许的最大值
                    input.setAttribute("data-controls", json.controls);//是否显示控制按钮
                    input.setAttribute("data-controlsposition", json.controlsposition || 'false');//控制按钮位置在右边
                    input.setAttribute("data-isflow", "1");
                    input.setAttribute("data-readonly", json.readonly || 'false');

                    //if (json.width) {
                    //    input.setStyle("width", json.width);
                    //} else {
                    //    input.setStyle("width", '');
                    //}

                    if (add) {
                        editor.insertElement(input);
                        editor.insertHtml(editor.designjs.ctlAfterHtml);//插入&nbsp;为了鼠标点击单元格时得到焦点。
                    }
                    editor.currentSelectEditorElement = null;
                }
            }
        });
    }
});