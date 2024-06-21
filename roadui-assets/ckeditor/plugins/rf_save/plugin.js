CKEDITOR.plugins.add('rf_save', {
    init: function (editor) {
        var pluginName = 'rf_save';
        //给自定义插件注册一个调用命令
        editor.addCommand(pluginName, {
            exec: function () {
                editor.roaduiTools.loading.value = true;
                editor.roaduiTools.loadingText.value = '正在保存…';
                var attJSON = editor.formAttributeJSON;
                var eventJSON = editor.formEventsJSON;
                var subtableJSON = editor.formSubtabsJSON;

                var html = editor.getData();
                editor.roaduiTools.ajax.post('/Form/Save?1=1' + editor.iframeQueryString, editor.roaduiTools.qs.stringify({
                    isnew: editor.roaduiTools.isNew && editor.utils.length(attJSON.id) <= 0 ? '1' : '0'
                    , attJSON: JSON.stringify(attJSON)
                    , eventJSON: JSON.stringify(eventJSON)
                    , subtableJSON: JSON.stringify(subtableJSON), html: html
                })).then(function (res) {
                    if (res.success) {
                        attJSON.id = res.data;
                        editor.utils.msg('保存成功！', true);
                    } else {
                        let msg = '保存失败！';
                        if (res.code == 1) {
                            msg = '表单属性错误！';
                        } else if (res.code == 2) {
                            msg = '表单名称不能为空！';
                        } else if (res.code == 3) {
                            msg = '表单分类不能为空！';
                        } else if (res.code == 4) {
                            msg = '未找到当前登录用户信息！';
                        }
                        editor.utils.msg(msg, false);
                    }
                    editor.roaduiTools.loading.value = false;
                    editor.roaduiTools.loadingText.value = '';
                });
            }
        });
        //注册一个按钮，来调用自定义插件
        editor.ui.addButton(pluginName, {
            label: "保存表单",
            command: pluginName,
            icon: this.path + "save.png",
            toolbar: 'rf_plugins1,10'
        });
    }
});