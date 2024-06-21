/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
    config.enterMode = CKEDITOR.ENTER_BR;
	config.font_names = '宋体/宋体;黑体/黑体;仿宋/仿宋_GB2312;楷体/楷体_GB2312;隶书/隶书;幼圆/幼圆;微软雅黑/微软雅黑;' + config.font_names;
};

//删除控件
CKEDITOR.rf_remove = function (editor) {
    if (!editor.currentSelectEditorElement) {
        editor.currentSelectEditorElement = editor.getSelection().getStartElement();
    }
    var element = CKEDITOR.dom.element.get(editor.currentSelectEditorElement);
    if (element) {
        element.setHtml('');
        element.removeAttributes(element.getAttributes());
        element.renameNode('span');
    }
    editor.currentSelectEditorElement = null;
};
