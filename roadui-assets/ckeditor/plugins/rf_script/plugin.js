CKEDITOR.plugins.add('rf_script', {
    requires: ['dialog'],
    init: function (editor) {
        var pluginName = 'rf_script';
        //给自定义插件注册一个调用命令
        editor.addCommand(pluginName, new CKEDITOR.dialogCommand(pluginName));
        //editor.addCommand(pluginName + "_delete", {
        //    exec: function (editor) {
        //        CKEDITOR.rf_remove(editor);
        //    }
        //});

        
        //注册一个按钮，来调用自定义插件
        editor.ui.addButton(pluginName, {
            label: "页面脚本",
            command: pluginName,
            icon: this.path + "script.png",
            toolbar: 'rf_plugins,110'
        });
        
        CKEDITOR.dialog.add(pluginName, function (editor) {
            return {
                title: '页面脚本',
                minWidth: 650,
                minHeight: 400,
                contents: [{
                    id: pluginName + '_attr',
                    label: '页面脚本',
                    title: '页面脚本',
                    elements:
                        [
                            {
                                id: pluginName + '_attr',
                                type: 'html',
                                html: '<iframe style="width:100%;height:400px;border:0;" frameborder="0" src="index.html?loadurl=' + encodeURIComponent('/form/plugins/scripts.vue?editorname=' + editor.name) + editor.iframeQueryString + '"></iframe>'
                            }
                        ]
                }],
                onShow: function () {
                   
                },
                onHide: function () {
                   
                },
                onOk: function () {
                   
                }
            }
        });

    }
});