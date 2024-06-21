CKEDITOR.plugins.add('rf_saveas', {
    requires: ['dialog'],
    init: function (editor) {
        var pluginName = 'rf_saveas';
        //给自定义插件注册一个调用命令
        editor.addCommand(pluginName, new CKEDITOR.dialogCommand(pluginName));
        //editor.addCommand(pluginName + "_delete", {
        //    exec: function (editor) {
        //        CKEDITOR.rf_remove(editor);
        //    }
        //});

        
        //注册一个按钮，来调用自定义插件
        editor.ui.addButton(pluginName, {
            label: "表单另存为",
            command: pluginName,
            icon: this.path + "saveas.png",
            toolbar: 'rf_plugins1,15'
        });
        
        CKEDITOR.dialog.add(pluginName, function (editor) {
            return {
                title: '表单另存为',
                minWidth: 500,
                minHeight: 200,
                contents: [{
                    id: pluginName + '_attr',
                    label: '表单另存为',
                    title: '表单另存为',
                    elements:
                        [
                            {
                                id: pluginName + '_attr',
                                type: 'html',
                                html: '<iframe style="width:100%;height:200px;border:0;" frameborder="0" src="index.html?loadurl=' + encodeURIComponent('/form/plugins/saveas.vue?editorname=' + editor.name) + editor.iframeQueryString + '"></iframe>'
                            }
                        ]
                }],
               
                onOk: function () {
                    var attJSON = editor.formAttributeJSON;
                    if (!attJSON) {
                        editor.utils.msg("未找到表单属性！", false);
                        return false;
                    }
                    if (editor.utils.length(editor["saveAsName"]) === 0) {
                        editor.utils.msg('表单名称不能为空！', false);
                        return false;
                    }
                    editor.roaduiTools.loading.value = true;
                    editor.roaduiTools.loadingText.value = '正在另存为…';
                    editor.roaduiTools.ajax.post('/Form/SaveAs?1=1' + editor.iframeQueryString, editor.roaduiTools.qs.stringify({ id: attJSON.id, name: editor["saveAsName"] })).then(function (res) {
                        let msg = '';
                        switch (res.code) {
                            case 0:
                                msg = '另存成功！';
                                break;
                            case 1:
                                msg = '表单id错误！';
                                break;
                            case 2:
                                msg = '表单名称为空！';
                                break;
                            case 3:
                                msg = '未找到源表单！';
                                break;
                            case 4:
                                msg = '未找到当前用户！';
                                break;
                            case 5:
                                msg = '表单属性解析错误！';
                                break;
                        }
                        editor.utils.msg(msg, res.success);
                        editor.roaduiTools.loading.value = false;
                        editor.roaduiTools.loadingText.value = '';
                        return res.success;
                    });
                }
            }
        });

    }
});