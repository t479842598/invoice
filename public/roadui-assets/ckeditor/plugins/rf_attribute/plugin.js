CKEDITOR.plugins.add('rf_attribute', {
    requires: ['dialog'],
    init: function (editor) {
        var pluginName = 'rf_attribute';
        var iframeId = pluginName + '_' + editor.name;
        //给自定义插件注册一个调用命令
        editor.addCommand(pluginName, new CKEDITOR.dialogCommand(pluginName));
        //注册一个按钮，来调用自定义插件
        editor.ui.addButton(pluginName, {
            label: "表单属性",
            command: pluginName,
            icon: this.path + "attribute.png",
            toolbar: 'rf_plugins,1'
        });

        CKEDITOR.dialog.add(pluginName, function (editor) {

            return {
                title: '表单属性',
                minWidth: 700,
                minHeight: 480,
                resizable: CKEDITOR.DIALOG_RESIZE_WIDTH,
                contents: [{
                    id: pluginName,
                    label: '表单属性',
                    title: '表单属性',
                    elements:
                        [
                            {
                                id: pluginName,
                                type: 'html',
                                html: '<iframe id="' + iframeId + '" src="index.html?loadurl=' + encodeURIComponent('/form/plugins/attr.vue?editorname=' + editor.name) + editor.iframeQueryString + '" style="width:100%;height:480px;border:0;" frameborder="0"></iframe>'
                            }
                        ]
                }],
                onLoad: function () {

                },
                onShow: function () {

                },
                onOk: function () {
                    var attrJSON = editor.formAttributeJSON;
                    if (editor.utils.length(attrJSON.name) === 0) {
                        editor.utils.msg('表单名称不能为空！', false);
                        return false;
                    }
                    if (editor.utils.length(attrJSON.type) === 0) {
                        editor.utils.msg('表单分类不能为空！', false);
                        return false;
                    }
                    return true;
                }
            }
        });

    }
});