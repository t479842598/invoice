<template>
    <div style="height:inherit;">
        <splitpanes class="default-theme" style="height:inherit;">
            <pane :size="16" min-size="16" max-size="50" style="overflow:auto; background:#fff;">
                <el-tree :data="treeData" :props="defaultProps" :load="loadTreeNode" lazy node-key="id" highlight-current
                    :default-expanded-keys="defaultExpandedKeys" :expand-on-click-node="false"
                    style="height:inherit; padding-right: 14px;" @node-click="handleNodeClick">
                    <template #default="scope">
                        <div class="roadui_treenode">
                            <el-icon v-if="scope.node.isLeaf">
                                <document />
                            </el-icon>
                            <el-icon v-else>
                                <folder />
                            </el-icon>
                            <span>{{ scope.node.label }}</span>
                        </div>
                    </template>
                </el-tree>
            </pane>
            <pane :size="84" style="background: #fff; overflow: auto; padding-left: 5px;">
                <div>
                    <el-form :inline="true">
                        <el-form-item label="标题">
                            <el-input v-model="formData.title" placeholder="应用标题" clearable style="width:180px" />
                        </el-form-item>
                        <el-form-item label="地址">
                            <el-input v-model="formData.address" placeholder="应用地址" clearable style="width:180px" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" :disabled="butDisabled" @click="loadTableData(true)">查询</el-button>
                            <el-button type="primary" :disabled="butDisabled" @click="edit()">添加</el-button>
                            <el-button type="danger" :disabled="butDisabled" @click="delTableData">删除</el-button>
                            <el-button :disabled="butDisabled" @click="export1">导出</el-button>
                            <el-button :disabled="butDisabled" @click="import1">导入</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div>
                    <el-table :data="tableData" v-loading="loading" :stripe="pager.tableStripe" :border="pager.tableBorder"
                        style="width:100%" :highlight-current-row="pager.tableHighlightCurrentRow"
                        :default-sort="defaultOrder" @sort-change="sortChange" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="45" />
                        <el-table-column prop="title" label="标题" width="220" show-overflow-tooltip sortable="custom" />
                        <el-table-column prop="address" label="地址" show-overflow-tooltip sortable="custom" />
                        <el-table-column prop="type" label="分类" width="220" sortable="custom" />
                        <el-table-column width="150">
                            <template #header>
                                <span>操作</span>
                            </template>
                            <template #default="scope">
                                <el-button size="small" :disabled="butDisabled" type="primary"
                                    @click="edit(scope.row)">编辑</el-button>
                                <el-button size="small" :disabled="butDisabled" type="info"
                                    @click="editBut(scope.row)">按钮</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="roadui_pagerdiv">
                    <el-pagination v-model:currentPage="pager.number" v-model:page-size="pager.size"
                        :page-sizes="pager.sizes" :background="pager.background" :layout="pager.layout" :total="pager.total"
                        :disabled="butDisabled" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </div>
            </pane>
        </splitpanes>
        <!--编辑窗口-->
        <el-dialog v-model="dialogShow" :title="dialogTitle" align-center destroy-on-close width="700px" draggable
            :close-on-click-modal="false">
            <el-form :model="editData" ref="ruleFormRef" :rules="rules" label-width="80px">
                <el-form-item v-if="utils.length(editData.id) > 0 && editData.id > utils.emptyLong" label="应用id">
                    {{ editData.id }}
                </el-form-item>
                <el-form-item label="应用标题" prop="title">
                    <el-input v-model="editData.title" clearable />
                </el-form-item>
                <el-form-item label="应用地址" prop="address">
                    <el-input v-model="editData.address" clearable />
                </el-form-item>
                <el-form-item label="应用分类" prop="type1">
                    <el-cascader v-model="editData.type1" :options="typeOptions" style="width:100%"
                        :props="{ expandTrigger: 'hover' }" />
                </el-form-item>
                <el-form-item label="打开方式" prop="openMode">
                    <el-radio-group v-model="editData.openMode">
                        <el-radio v-for="opt in openModeOptions" :key="opt.value" :label="opt.value">{{ opt.label
                        }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-show="editData.openMode == 1 || editData.openMode == 2" label="窗口宽度" prop="width">
                    <el-input-number v-model="editData.width" style="width:150px" controls-position="right" />
                    <span style="margin-left:12px">
                        窗口高度<el-input-number v-model="editData.height" style="width:150px;margin-left:12px;"
                            controls-position="right" />
                    </span>
                </el-form-item>
                <el-form-item label="备注" prop="note">
                    <el-input v-model="editData.note" clearable />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button :disabled="butDisabled" type="primary" @click="save(ruleFormRef)">保存</el-button>
                    <el-button :disabled="butDisabled" @click="dialogShow = false">关闭</el-button>
                </span>
            </template>
        </el-dialog>
        <!--编辑按钮窗口-->
        <el-dialog v-model="dialogButShow" title="编辑应用按钮" align-center destroy-on-close width="1200px" draggable
            :close-on-click-modal="false">
            <el-table :data="buttonData" :stripe="pager.tableStripe" :border="pager.tableBorder" style="width:100%">
                <el-table-column prop="select" label="选择" width="150">
                    <template #default="scope">
                        <el-select v-model="scope.row.buttonId" @change="butSelect($event, scope.row)" clearable>
                            <el-option v-for="item in buttonOptions" :key="item.id" :label="item.name" :value="item.id">
                                <span>{{ item.name }}<span style="color:var(--el-text-color-placeholder)"> -
                                        {{ item.note }}</span></span>
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称" width="130">
                    <template #default="scope">
                        <el-input v-model="scope.row.name" clearable></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="scripts" label="脚本">
                    <template #default="scope">
                        <el-input type="textarea" v-model="scope.row.scripts" clearable></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="ico" label="图标" width="145">
                    <template #default="scope">
                        <el-selectico v-model="scope.row.ico" clearable></el-selectico>
                    </template>
                </el-table-column>
                <el-table-column prop="showType" label="类型" width="130">
                    <template #default="scope">
                        <el-select v-model="scope.row.showType" style="width:100px" clearable>
                            <el-option :value="1" label="常规按钮" />
                            <el-option :value="2" label="列表按钮" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="地址">
                    <template #default="scope">
                        <el-input v-model="scope.row.address" clearable></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="125">
                    <template #default="scope">
                        <el-input-number v-model="scope.row.sort" :step="5" :min="0" style="width:100px;"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column width="80">
                    <template #header>
                        <el-button size="small" type="primary" @click="addBut">
                            添加
                        </el-button>
                    </template>
                    <template #default="scope">
                        <el-button size="small" type="primary" @click="removeBut(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <template #footer>
                <span class="dialog-footer">
                    <el-button :disabled="butButDisabled" @click="saveBut" type="primary">保存</el-button>
                    <el-button :disabled="butButDisabled" @click="dialogButShow = false">关闭</el-button>
                </span>
            </template>
        </el-dialog>
        <!--导入-->
        <el-dialog v-model="dialogImportShow" title="导入" class="el-dialog__padding1" align-center destroy-on-close
            width="350px" draggable :close-on-click-modal="false">
            <el-upload :action="config.SERVER_WEBADDRESS + '/Files/SaveFiles'" :show-file-list="false" accept=".json"
                :headers="{ 'nroadflow-token': utils.getToken() }" with-credentials
                :data="{ filetype: '.json', uploadtype: 0 }" :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <el-button type="primary">选择文件</el-button>
            </el-upload>
            <template #footer>
                <span class="dialog-footer">

                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
const ajax = inject('ajax');
const utils = inject('utils');
const qs = inject('qs');
const config = inject('config');
const ElSelectico = inject('ElSelectico');//图标选择控件
const formData = ref({});
const butDisabled = ref(false);

//应用分类
const treeData = ref([]);
const defaultExpandedKeys = ref([]);
//树点击，加载分类下的应用列表。
const handleNodeClick = (data) => {
    formData.value.type = data.id;
    loadTableData(false);
};
const defaultProps = { children: 'children', label: 'title', isLeaf: 'isLeaf' };
//加载分类树
const loadTreeNode = (node, resolve) => {
    //如果是首次加载
    if (node.level === 0) {
        ajax.post('/Dictionary/GetTreeJson?root=system_applibrary_type').then((res) => {
            treeData.value = res.data;
            if (utils.length(res.data) > 0) {
                defaultExpandedKeys.value.push(res.data[0].id);
            }
            loadTableData(false);
        }).catch(() => { });
    } else {
        //二次加载
        if (utils.length(node.data.children) > 0) {
            resolve(node.data.children);
            return;
        }
        ajax.post('/Dictionary/GetTreeChildsJson?parentid=' + node.data.id).then((res) => {
            resolve(res.data);
        }).catch(() => { });
    }
};

//应用列表
const loading = ref(false);//数据加载状态
const tableData = ref([]);
let selectRows = [];//保存选择的行
const defaultOrder = ref({ prop: 'title', order: 'ascending' });
const pager = ref(utils.getPager(defaultOrder.value));
//选择行
const handleSelectionChange = (val) => {
    selectRows = val;
};
//每页条数改变
const handleSizeChange = (size) => {
    pager.value.size = size;
    loadTableData(false);
};
//页码改变
const handleCurrentChange = (number) => {
    pager.value.number = number;
    loadTableData(false);
};
//排序
const sortChange = (order) => {
    pager.value.order = utils.getOrder(order);
    loadTableData(false);
};
//加载列表，isQuery 点查询按钮为true，初始加载为false，为了区分点查询按钮时要将页number置为1。
const loadTableData = (isQuery) => {
    if (isQuery) {
        pager.value.number = 1;
    }
    loading.value = true;
    butDisabled.value = true;
    formData.value.size = pager.value.size;
    formData.value.number = pager.value.number;
    formData.value.order = pager.value.order;
    ajax.post('/Applibrary/GetList', qs.stringify(formData.value)).then((res) => {
        tableData.value = res.data.rows;
        pager.value.total = res.data.total;
        butDisabled.value = false;
        loading.value = false;
    }).catch(() => { butDisabled.value = false; });
};
//删除选择行
const delTableData = () => {
    if (selectRows.length === 0) {
        utils.msg('请选择要删除的应用！', 'error');
        return;
    }
    utils.confirm('您确定要删除所选应用吗？', () => {
        butDisabled.value = true;
        ajax.post('/Applibrary/Delete', qs.stringify({ ids: utils.getArrayValues(selectRows, 'id').join(',') })).then((res) => {
            let msg = res.msg;
            if (utils.length(msg) === 0) {
                msg = res.success ? "删除成功！" : "删除失败！";
            }
            utils.msg(msg, res.success);
            butDisabled.value = false;
            if (res.success) {
                selectRows = [];
                loadTableData(false);
            }
        }).catch(() => { butDisabled.value = false; });
    });
};

//编辑
const editData = ref({});
const dialogTitle = ref('添加应用');
const dialogShow = ref(false);
const typeOptions = ref([]);//分类选项
const openModeOptions = ref([]);//打开方式选项
const ruleFormRef = ref(null);
const rules = {
    title: [{ required: true, message: '请输入应用标题', trigger: 'blur' }],
    address: [{ required: true, message: '请输入应用地址', trigger: 'blur' }],
    type1: [{ required: true, message: '请选择应用分类', trigger: 'blur' }],
    openMode: [{ required: true, message: '请选择应用打开方式', trigger: 'change' }],
};
//载入分类和打开方式选项
const loadOptions = () => {
    if (utils.length(typeOptions.value) === 0 || utils.length(openModeOptions.value) == 0) {
        const params = [
            { id: 'system_applibrary_openmode', key: 'openMode', children: false, valueField: 'value' },
            { id: 'system_applibrary_type', key: 'type', children: true, valueField: 'id' }
        ];
        ajax.post('/Dictionary/GetMultipleOptions', qs.stringify({ json: JSON.stringify(params) })).then((res) => {
            openModeOptions.value = res.data['openMode'];
            typeOptions.value = res.data['type'];
        }).catch(() => { });
    }
};
//编辑
const edit = (row) => {
    loadOptions();
    if (utils.isDef(row) && utils.length(row.id) > 0) {
        ajax.post('/Applibrary/Get?appid=' + row.id).then((res) => {
            if (!res.success) {
                utils.msg('获取应用程序数据失败！', res.success);
                return;
            }
            editData.value = res.data;
            editData.value.openMode = '' + res.data.openMode;
            if (res.data.width == 0) {
                delete editData.value.width;
            }
            if (res.data.height == 0) {
                delete editData.value.height;
            }
            dialogTitle.value = '编辑应用 - ' + res.data.title;
            dialogShow.value = true;
        }).catch(() => { });
    } else {
        //请求得到分类选择值["parentid","id"]
        ajax.post('/Dictionary/GetCascaderTypes?dictid=' + (formData.value['type'] || '') + '&root=system_applibrary_type').then((res) => {
            editData.value = { id: utils.emptyLong, openMode: '0', type1: res.data };
            dialogShow.value = true;
        }).catch(() => { });
    }
};
//保存
const save = async (formEl) => {
    if (!formEl) {
        return;
    }
    await formEl.validate((valid) => {
        if (valid) {
            butDisabled.value = true;
            editData.value.type = editData.value.type1[editData.value.type1.length - 1];
            delete editData.value.type1;
            if (utils.length(editData.value.width) === 0) {
                editData.value.width = 0;
            }
            if (utils.length(editData.value.height) === 0) {
                editData.value.height = 0;
            }
            ajax.post('/Applibrary/Save?appid=' + (editData.value.id || ''), qs.stringify(editData.value)).then((res) => {
                butDisabled.value = false;
                let msg = res.msg;
                if (utils.length(msg) === 0) {
                    if (res.success) {
                        msg = '保存成功！';
                    } else if (res.code == 1) {
                        msg = '数据验证错误！';
                    } else {
                        msg = '保存失败！';
                    }
                }
                utils.msg(msg, res.success);
                if (res.success) {
                    dialogShow.value = false;
                    loadTableData(false);
                }
            }).catch(() => { butDisabled.value = false; });
        }
    });
};

//编辑按钮
const dialogButShow = ref(false);
const buttonData = ref([]);
const buttonOptions = ref([]);//按钮库选择项
const butButDisabled = ref(false);
var applibraryId = 0;//保存当前行应用id，保存按钮时要传。
const editBut = (row) => {
    if (utils.length(row.id) === 0) {
        return;
    }
    applibraryId = row.id;
    ajax.post('/Applibrary/GetButtons?appid=' + applibraryId).then((res) => {
        if (!res.success) {
            utils.msg('获取应用程序按钮失败！', res.success);
            return;
        }
        for (let i = 0; i < res.data['rows'].length; i++) {
            //如果没有选择按钮buttonId为0，要设置为''，不然选择框会显示0
            if (res.data['rows'][i].buttonId == 0) {
                res.data['rows'][i].buttonId = '';
            }
        }
        buttonData.value = res.data['rows'];
        buttonOptions.value = res.data['buttonOptions'];
        dialogButShow.value = true;
    }).catch(() => { });
};
//选择按钮后填充值
const butSelect = (val, row) => {
    const but = utils.getArrayObj(buttonOptions.value, val, 'id');
    row.name = but === null ? '' : but.name;
    row.scripts = but === null ? '' : but.scripts;
    row.ico = but === null ? '' : but.ico;
};
//保存按钮
const saveBut = () => {
    butButDisabled.value = true;
    const data = { total: buttonData.value.length, button: buttonData.value };
    ajax.post('/Applibrary/SaveButtons?appid=' + applibraryId, qs.stringify(data)).then((res) => {
        let msg = res.msg;
        if (utils.length(msg) === 0) {
            msg = res.success ? '保存成功！' : '保存失败！';
        }
        utils.msg(msg, res.success);
        butButDisabled.value = false;
        if (res.success) {
            dialogButShow.value = false;
        }
    }).catch(() => { });
};
//添加按钮
const addBut = () => {
    buttonData.value.push({
        key: utils.createGuid(false),
        applibraryId: applibraryId,
        name: '', scripts: '', ico: '', showType: 1, isValidate: 1, note: '', address: '',
        sort: utils.getArrayMax(buttonData.value, 'sort') + 5
    });
};
//删除按钮
const removeBut = (row) => {
    const hasId = utils.hasKey(row, 'id');
    utils.removeArrayObj(buttonData.value, hasId ? row.id : row.key, hasId ? 'id' : 'key');
};

//导出
const export1 = () => {
    let selectIds = utils.getArrayValues(selectRows, 'id');
    if (selectIds.length === 0) {
        utils.msg('您没有选择要导出的应用！', false);
        return;
    }
    const url = config.SERVER_WEBADDRESS + '/Export/ApplibraryExport?appid=' + selectIds.join(',');
    //utils.open(url, 300, 200, '导出');
    window.location.href = url;
};
//导入
const dialogImportShow = ref(false);
const import1 = () => {
    dialogImportShow.value = true;
};
//导入上传前检查文件格式。
const beforeAvatarUpload = (rawFile) => {
    if (rawFile.type !== 'application/json') {
        utils.msg('要导入的文件必须是json格式文件!', false);
        return false;
    }
    return true;
};
//导入上传成功
const handleAvatarSuccess = (response, uploadFile) => {
    if (uploadFile.status === 'success') {
        let code = response.code;
        if (code == 401) {
            //登录失效

        }
        if (code != 0) {
            utils.msg('文件上传失败！', false);
            return;
        }
        const fileId = response.data.id;
        ajax.post('/Applibrary/ImportApp', qs.stringify({ files: fileId })).then((res) => {
            let msg = res.msg;
            if (utils.length(msg) === 0) {
                if (res.success) {
                    msg = '导入成功！';
                } else if (res.code == 1) {
                    msg = '要导入的文件不存在！';
                } else if (res.code == 2) {
                    msg = '要导入的文件不是有效的json格式文件！';
                } else {
                    msg = '导入失败！';
                }
            }
            utils.msg(msg, res.success);
            if (res.success) {
                dialogImportShow.value = false;
                loadTableData(false);//刷新
            }
        }).catch(() => { });
    } else if (uploadFile.status === 'error') {
        utils.msg('文件上传失败！', false);
    }
};
</script>