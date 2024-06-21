CKEDITOR.plugins.add('rf_subtable', {
    requires: ['dialog'],
    init: function (editor) {
        var pluginName = 'rf_subtable';
        //给自定义插件注册一个调用命令
        editor.addCommand(pluginName, new CKEDITOR.dialogCommand(pluginName));
        editor.addCommand(pluginName + "_delete", {exec: function (editor) {
            CKEDITOR.rf_remove(editor);
        }});

        //为文本框双击事件绑定一个事件，即显示弹出窗
        editor.on('doubleclick', function (evt) {
            var element = evt.data.element;
            if (element.is('input')) {
                if ('subtable' == element.getAttribute('data-type')) {
                    editor.currentSelectEditorElement = element;//保存当前焦点对象 currentSelectEditorElement
                    evt.data.dialog = pluginName;
                }
            }
        });
        //注册一个按钮，来调用自定义插件
        editor.ui.addButton(pluginName, {
            label: "子表",
            command: pluginName,
            icon: this.path + "subtable.png",
            toolbar: 'rf_plugins,100'
        });
        if (editor.contextMenu) {
            editor.addMenuGroup('rf_plugins');
            editor.addMenuItem(pluginName, {
                label: '子表属性',
                command: pluginName,
                group: 'rf_plugins'
            });
            editor.addMenuItem(pluginName + '_delete', {
                label: '删除子表',
                command: pluginName + '_delete',
                group: 'rf_plugins'
            });

            //右键菜单的监听器，判断是否显示菜单
            editor.contextMenu.addListener(function (element) {
                if (element && !element.isReadOnly()) {
                    var name = element.getName();
                    if (name == 'input') {
                        if ('subtable' == element.getAttribute('data-type')) {
                            editor.currentSelectEditorElement = element;//保存当前焦点对象 currentSelectEditorElement
                            return {rf_subtable: CKEDITOR.TRISTATE_OFF, rf_subtable_delete: CKEDITOR.TRISTATE_OFF};
                        }
                    }
                }
            });
        }
        CKEDITOR.dialog.add(pluginName, function (editor) {
            return {
                title: '子表',
                minWidth: 1200,
                minHeight: 560,
                contents: [{
                    id: pluginName + '_attr',
                    label: '属性',
                    title: '属性',
                    elements:
                        [
                            {
                                id: pluginName + '_attr',
                                type: 'html',
                                html: '<iframe style="width:100%;height:560px;border:0;" frameborder="0" src="index.html?loadurl=' + encodeURIComponent('/form/plugins/subtable?editorname=' + editor.name) + editor.iframeQueryString + '"></iframe>'
                            }
                        ]
                }],
                onShow: function () {
                    if (editor.initFunction_subtable) {
                        editor.initFunction_subtable(editor.currentSelectEditorElement);
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
                    var id = json.id;
                    input.setAttribute("type", "text");
                    input.setAttribute("data-type", "subtable");
                    input.setAttribute("data-isflow", "1");
                    input.setAttribute("value", "子表");
                    input.setStyle("color", editor.designjs.ctlColor);
                    input.setAttribute("data-id", id);

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