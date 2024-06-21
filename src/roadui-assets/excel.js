// 此工具库是：excel的导入和导出

import * as XLSX from 'xlsx';
// import * as fs from 'file-saver';
import { saveAs } from "file-saver"
import { ElMessage, ElMessageBox } from 'element-plus'

// 一、excel的导出：
// 1、根据dom元素导出成excel文件：

// 自动分析dom元素导出excel
// 参数：
// table：表格的dom元素对象
// filename：导出的文件名（不用写扩展名）
export function excelExport(table, filename) {

    // workbook,
    const wb = XLSX.utils.table_to_book(table);

    /* Export to file (start a download) */
    const defaultCellStyle = {
        font: { name: 'Verdana', sz: 13, color: 'FF00FF88' },
        fill: { fgColor: { rgb: 'FFFFAA00' } },
    }
    const wopts = {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary',
        cellStyle: true,
        defaultCellStyle: defaultCellStyle,
        showGridLines: false,
    }
    const wbout = XLSX.write(wb, wopts)
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    saveAs(blob, filename + '.xlsx')
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
}

// 2、根据json数据（数组）导出成excel文件：

// 参数：
// data：json数组
// headers：excel的表头
// filename：导出的文件名（不用写扩展名）
export function excelExportUseJson(data, headers, filename) {
    // 使用深克隆不影响原table数据的展示
    const json = cloneDeep(data)

    json.forEach(item => {
        for (let key in item) {
            if (headers.hasOwnProperty(key)) {
                item[headers[key]] = item[key]
            }
            delete item[key]
        }
    })

    // excel 对象
    const wb = XLSX.utils.book_new()

    // 创建sheet
    const ws = XLSX.utils.json_to_sheet(json, { header: Object.values(headers) })
    // excel 添加sheet名称
    wb.SheetNames.push(filename)
    // excel 添加sheet
    wb.Sheets[filename] = ws

    const defaultCellStyle = {
        font: { name: 'Verdana', sz: 13, color: 'FF00FF88' },
        fill: { fgColor: { rgb: 'FFFFAA00' } },
    }
    const wopts = {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary',
        cellStyle: true,
        defaultCellStyle: defaultCellStyle,
        showGridLines: false,
    }
    const wbout = XLSX.write(wb, wopts)
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    saveAs(blob, filename + '.xlsx')
}


function cloneDeep(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    let clonedObj = Array.isArray(obj) ? [] : {};

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            clonedObj[key] = cloneDeep(obj[key]);
        }
    }

    return clonedObj;
}

// 二、从excel文件导入到项目里。

// 1、导入成dom元素：

// 参数：
// data：文件对象（用<input type=file /> 选择到file对象
// domId：导入的excel显示的容器

export function httpRequestToHTML(data, domId) {

    const file = data
    const types = file.name.split('.')[1]
    const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt'].some(
        (item) => item === types
    )
    if (!fileType) {
        ElMessage.error('格式错误！请重新选择')
        return
    }


    const reader = new FileReader()
    reader.readAsArrayBuffer(file, 'utf-8');
    return new Promise(function (resolve, reject) {

        reader.onloadend = function (e) {
            const data = e.target.result
            const wb = XLSX.read(data, {
                type: 'buffer'
            })

            const ws = wb.Sheets[wb.SheetNames[0]]

            const htmlStr = XLSX.utils.sheet_to_html(ws)
            resolve(htmlStr);

        }

    });
}


// 2、导入成json数据。
// 参数：
// data：文件对象（用<input type=file /> 选择到file对象

export function httpRequestToJSON(data) {

    const file = data
    const types = file.name.split('.')[1]
    const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt'].some(
        (item) => item === types
    )
    if (!fileType) {
        ElMessage.error('格式错误！请重新选择')
        return
    }

    const reader = new FileReader()
    reader.readAsArrayBuffer(file, 'utf-8');

    return new Promise(function (resolve, reject) {

        reader.onloadend = function (e) {
            const data = e.target.result
            const wb = XLSX.read(data, {
                type: 'buffer'
            })

            const ws = wb.Sheets[wb.SheetNames[0]]

            let arr = XLSX.utils.sheet_to_json(ws);

            resolve(arr);
        }

    });
}


// 封装：把excel转成html或者json。
// 参数：
//    file:(excel)文件对象
//    outtype:是导出的类型(取值：html，json)

// 调用示例：
// excelTo(文件对象，"html")
// excelTo(文件对象，"json")
export function excelImport(file, outtype = "json") {
    const fileNameParts = file.name.split('.');
    const types = fileNameParts.length > 1 ? fileNameParts[fileNameParts.length - 1] : 'unknown';
    const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt'].some(
        (item) => item === types
    )
    if (!fileType) {
        ElMessage.error('格式错误！请重新选择')
        return
    }

    const reader = new FileReader()
    reader.readAsArrayBuffer(file, 'utf-8');

    return new Promise(function (resolve, reject) {

        reader.onloadend = function (e) {
            const data = e.target.result
            const wb = XLSX.read(data, {
                type: 'buffer'
            })

            const ws = wb.Sheets[wb.SheetNames[0]];

            let result = "";
            switch (outtype.toLocaleLowerCase()) {
                case "html": result = XLSX.utils.sheet_to_html(ws); break;
                case "json": result = XLSX.utils.sheet_to_json(ws); break;
                default: ElMessage.error('输出类型错误，只能取值为 html或者json')
            }
            resolve(result);
        }
    });
}
