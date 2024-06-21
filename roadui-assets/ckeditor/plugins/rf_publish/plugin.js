CKEDITOR.plugins.add('rf_publish', {
    init: function (editor) {
        var pluginName = 'rf_publish';
        //给自定义插件注册一个调用命令
        editor.addCommand(pluginName, {
            exec: function () {
                editor.roaduiTools.loading.value = true;
                editor.roaduiTools.loadingText.value = '正在发布…';
                var attJSON = editor.formAttributeJSON;
                var eventJSON = editor.formEventsJSON;
                var subtableJSON = editor.formSubtabsJSON;
                var html = editor.getData();

                var runHtml = editor.designjs.compile(html, attJSON, eventJSON, subtableJSON);
                var eventJSON1 = eventJSON.filter(function (item) {
                    return item !== null && item !== undefined;
                });
                var subtableJSON1 = subtableJSON.filter(function (item) {
                    return item !== null && item !== undefined;
                });
                //eventJSON = [];
                //如果编译有错误信息，提示错误，不提交。
                if (editor.designjs.formCompileErrMsg.length > 0) {
                    for (var i = 0; i < editor.designjs.formCompileErrMsg.length; i++) {
                        editor.utils.msg(editor.designjs.formCompileErrMsg[i], false);
                    }
                    editor.roaduiTools.loading.value = false;
                    editor.roaduiTools.loadingText.value = '';
                    return false;
                }
                editor.roaduiTools.ajax.post('/Form/Save?publish=1' + editor.iframeQueryString,
                    editor.roaduiTools.qs.stringify({
                        isnew: editor.roaduiTools.isNew && editor.utils.length(attJSON.id) <= 0 ? '1' : '0'
                        , attJSON: JSON.stringify(attJSON)
                        , eventJSON: JSON.stringify(eventJSON1)
                        , subtableJSON: JSON.stringify(subtableJSON1)
                        , defaultValueJSON: JSON.stringify(editor.designjs.formDefaultValues)
                        , selectOptionsJSON: JSON.stringify(editor.designjs.formSelectOptions)
                        , fieldsJSON: JSON.stringify(editor.designjs.formFields)
                        , html: html
                        , runHtml: runHtml
                    })).then(function (res) {
                        if (res.success) {
                            editor.utils.msg('发布成功！', true);
                            attJSON.id = res.data;
                        } else {
                            let msg = '发布失败！';
                            if (res.code == 1) {
                                msg = '表单名称为空！';
                            } else if (res.code == 2) {
                                msg = '未找到表单！';
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
            label: "发布表单",
            command: pluginName,
            icon: this.path + "publish.png",
            toolbar: 'rf_plugins1,20'
        });
    }
});