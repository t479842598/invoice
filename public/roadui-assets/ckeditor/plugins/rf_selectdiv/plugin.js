CKEDITOR.plugins.add('rf_selectdiv', {
    requires: ['dialog'],
    init: function (editor) {
        var pluginName = 'rf_selectdiv';
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
                var type = element.getAttribute('data-type');
                if (type == 'selectdiv') {
                    editor.currentSelectEditorElement = element;//保存当前焦点对象 currentSelectEditorElement
                    evt.data.dialog = pluginName;
                }
            }
        });
        //注册一个按钮，来调用自定义插件
        editor.ui.addButton(pluginName, {
            label: "弹出选择",
            command: pluginName,
            icon: this.path + "selectdiv.png",
            toolbar: 'rf_plugins,90'
        });
        if (editor.contextMenu) {
            editor.addMenuGroup('rf_plugins');
            editor.addMenuItem(pluginName, {
                label: '弹出选择属性',
                command: pluginName,
                group: 'rf_plugins'
            });
            editor.addMenuItem(pluginName + '_delete', {
                label: '删除弹出选择',
                command: pluginName + '_delete',
                group: 'rf_plugins'
            });

            //右键菜单的监听器，判断是否显示菜单
            editor.contextMenu.addListener(function (element) {
                if (element && !element.isReadOnly()) {
                    var name = element.getName();
                    if (name == 'input') {
                        var type = element.getAttribute('data-type');
                        if (type == 'selectdiv') {
                            editor.currentSelectEditorElement = element;//保存当前焦点对象 currentSelectEditorElement
                            return { rf_selectdiv: CKEDITOR.TRISTATE_OFF, rf_selectdiv_delete: CKEDITOR.TRISTATE_OFF };
                        }
                    }
                }
            });
        }
        CKEDITOR.dialog.add(pluginName, function (editor) {
            return {
                title: '弹出选择',
                minWidth: 700,
                minHeight: 515,
                contents: [{
                    id: pluginName + '_attr',
                    label: '属性',
                    title: '属性',
                    elements:
                        [
                            {
                                id: pluginName + '_attr',
                                type: 'html',
                                html: '<iframe style="width:100%;height:515px;border:0;" frameborder="0" src="index.html?loadurl=' + encodeURIComponent('/form/plugins/selectdiv?editorname=' + editor.name) + editor.iframeQueryString + '"></iframe>'
                            }
                        ]
                }],
                onShow: function () {
                    if (editor.initFunction_selectdiv) {
                        editor.initFunction_selectdiv(editor.currentSelectEditorElement);
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
                    var bindField = editor.utils.length(json.field) === 0 ? '' : json.field;
                    var id = editor.designjs.getId(table, bindField, json.id);
                    input.setAttribute("type", "text");
                    input.setAttribute("data-type", "selectdiv");
                    input.setAttribute("data-isflow", "1");
                    input.setAttribute("value", (json.label || '弹出选择') + (bindField.length === 0 ? "" : "(" + bindField + ")"));
                    input.setStyle("color", editor.designjs.ctlColor);
                    input.setAttribute("data-id", id);
                    input.setAttribute("data-label", json.label || '');
                    input.setAttribute("data-bindfiled", json.field || '');
                    input.setAttribute("data-defaultvalue", editor.utils.encodeURI(json.defaultValue || ''));
                    input.setAttribute("data-applibrarytypeid", JSON.stringify(json.applibraryTypeId || ''));
                    input.setAttribute("data-applibraryid", editor.utils.encodeURI(json.applibraryId || ''));
                    input.setAttribute("data-applibraryaddress", editor.utils.encodeURI(json.applibraryAddress || ''));
                    input.setAttribute("data-valuefield", json.valueField || '');
                    input.setAttribute("data-titlefield", json.titleField || '');
                    input.setAttribute("data-valueseparator", json.valueSeparator || '');
                    input.setAttribute("data-titleseparator", json.titleSeparator || '');
                    input.setAttribute("data-modaltitle", json.modalTitle || '');
                    input.setAttribute("data-placeholder", json.placeholder || '');
                    input.setAttribute("data-width", json.width || '');
                    input.setAttribute("data-modalwidth", json.modalWidth || '');
                    //input.setAttribute("data-modalheight", json.modalHeight || '');
                    input.setAttribute("data-params", editor.utils.encodeURI(json.params || ''));

                    //if (json.width && parseInt(json.width) > 0) {
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