CKEDITOR.plugins.add('rf_checkbox', {
    requires: ['dialog'],
    init: function (editor) {
        var pluginName = 'rf_checkbox';
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
                if (type == 'checkbox') {
                    editor.currentSelectEditorElement = element;//保存当前焦点对象 currentSelectEditorElement
                    evt.data.dialog = pluginName;
                }
            }
        });
        //注册一个按钮，来调用自定义插件
        editor.ui.addButton(pluginName, {
            label: "复选按钮",
            command: pluginName,
            icon: this.path + "checkbox.png",
            toolbar: 'rf_plugins,25'
        });
        if (editor.contextMenu) {
            editor.addMenuGroup('rf_plugins');
            editor.addMenuItem(pluginName, {
                label: '复选按钮属性',
                command: pluginName,
                group: 'rf_plugins'
            });
            editor.addMenuItem(pluginName + '_delete', {
                label: '删除复选按钮',
                command: pluginName + '_delete',
                group: 'rf_plugins'
            });

            //右键菜单的监听器，判断是否显示菜单
            editor.contextMenu.addListener(function (element) {
                if (element && !element.isReadOnly()) {
                    var name = element.getName();
                    if (name == 'input') {
                        var type = element.getAttribute('data-type');
                        if (type == 'checkbox') {
                            editor.currentSelectEditorElement = element;//保存当前焦点对象 currentSelectEditorElement
                            return { rf_checkbox: CKEDITOR.TRISTATE_OFF, rf_checkbox_delete: CKEDITOR.TRISTATE_OFF };
                        }
                    }
                }
            });
        }
        CKEDITOR.dialog.add(pluginName, function (editor) {
            return {
                title: '复选按钮',
                minWidth: 700,
                minHeight: 470,
                contents: [{
                    id: pluginName + '_attr',
                    label: '属性',
                    title: '属性',
                    elements:
                        [
                            {
                                id: pluginName + '_attr',
                                type: 'html',
                                html: '<iframe style="width:100%;height:470px;border:0;" frameborder="0" src="index.html?loadurl=' + encodeURIComponent('/form/plugins/checkbox.vue?editorname=' + editor.name) + editor.iframeQueryString + '"></iframe>'
                            }
                        ]
                }],
                onShow: function () {
                    if (editor.initFunction_checkbox) {
                        editor.initFunction_checkbox(editor.currentSelectEditorElement);
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
                    input.setAttribute("data-type", "checkbox");
                    input.setAttribute("data-isflow", "1");
                    input.setAttribute("value", (json.label || '复选按钮') + (bindField.length === 0 ? "" : "(" + bindField + ")"));
                    input.setStyle("color", editor.designjs.ctlColor);
                    input.setAttribute("data-id", id);
                    input.setAttribute("data-label", json.label || '');
                    input.setAttribute("data-bindfiled", json.field || '');
                    input.setAttribute("data-defaultvalue", editor.utils.encodeURI(json.defaultValue || ''));
                    input.setAttribute("data-buttonstyle", json.buttonStyle || 'normal');

                    input.setAttribute("data-datasource", json.dataSource || '');
                    input.setAttribute("data-datasourcedict", json.dataSourceDict || '');
                    input.setAttribute("data-datasourcedictvaluefield", json.dataSourceDictValueField || "id");
                    input.setAttribute("data-datasourcestring", editor.utils.encodeURI(json.dataSourceString || ''));
                    input.setAttribute("data-datasourcesqlconn", json.dataSourceSqlConn || '');
                    input.setAttribute("data-datasourcesql", editor.utils.encodeURI(json.dataSourceSql || ''));
                    input.setAttribute("data-datasourceurl", editor.utils.encodeURI(json.dataSourceUrl || ''));

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