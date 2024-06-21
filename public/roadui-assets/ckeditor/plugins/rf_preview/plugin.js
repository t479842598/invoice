CKEDITOR.plugins.add('rf_preview', {
    requires: ['dialog'],
    init: function (editor) {
        var pluginName = 'rf_preview';
        //给自定义插件注册一个调用命令
        editor.addCommand(pluginName, new CKEDITOR.dialogCommand(pluginName));

        //注册一个按钮，来调用自定义插件
        editor.ui.addButton(pluginName, {
            label: "预览表单",
            command: pluginName,
            icon: this.path + "preview.png",
            toolbar: 'rf_plugins1,5'
        });

        CKEDITOR.dialog.add(pluginName, function (editor) {
            return {
                title: '预览表单',
                minWidth: 1200,
                minHeight: 550,
                contents: [{
                    id: pluginName + '_attr',
                    label: '表单',
                    title: '表单',
                    elements:
                        [
                            {
                                id: pluginName + '_attr',
                                type: 'html',
                                html: '<iframe style="width:100%;height:550px;border:0;" frameborder="0" src="index.html?loadurl=' + encodeURIComponent('/form/plugins/preview?editorname=' + editor.name) + editor.iframeQueryString + '"></iframe>'
                            }
                        ]
                }],
                onShow: function (event) {
                    if (editor.roaduiTools.isNew && editor.utils.length(editor.formAttributeJSON.id) <= 0) {
                        editor.utils.msg('请先保存表单，再预览！', false);
                        event.sender.hide();
                        return false;
                    }
                    if (editor.initFunction_preview) {
                        editor.initFunction_preview();
                    }
                },
            }
        });
    }
});