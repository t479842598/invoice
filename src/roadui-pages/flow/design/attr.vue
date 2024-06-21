<template>
    <div>
        <el-tabs>
            <el-tab-pane name="0" style="height:100%">
                <template #label>
                    <el-icon class="roadui_main_tabsvg"><Operation /></el-icon>流程属性
                </template>
                <table cellpadding="0" cellspacing="0" border="0" class="roadui_fromtable">
                    <tr>
                        <th style="width:80px">流程id</th>
                        <td>{{flowJson.id}}</td>
                    </tr>
                    <tr>
                        <th>流程名称</th>
                        <td>
                            <el-input v-model="flowJson.name" clearable></el-input>
                        </td>
                    </tr>
                    <tr>
                        <th>流程分类</th>
                        <td>
                            <el-cascader v-model="flowJson.type"
                                         :options="typeOptions"
                                         style="width:330px"
                                         :props="{expandTrigger:'hover'}" clearable/>
                            <span style="margin-left:12px;">
                                所属系统<el-select v-model="flowJson.systemId" clearable style="width:253px;margin-left:12px;">
                                    <el-option v-for="opt in systemOptions" :key="opt.value" :value="opt.value" :label="opt.title"></el-option>
                                </el-select>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th>流程管理</th>
                        <td>
                            <el-selectorg v-model="flowJson.manager" select-type="user" style="width: 330px" clearable></el-selectorg>
                            <span style="margin-left:12px">
                                实例管理<el-selectorg v-model="flowJson.instanceManager" select-type="user" style="width: 253px; margin-left: 12px;" clearable></el-selectorg>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th>调试模式</th>
                        <td>
                            <el-switch v-model="flowJson.debug" style="margin-right:12px;" active-value="1" inactive-value="0" />
                            调试人员<el-selectorg v-model="flowJson.debugUsers" style="margin-left:12px;width:543px"></el-selectorg>
                        </td>
                    </tr>
                    <tr>
                        <th>流程图标</th>
                        <td>
                            <el-selectico v-model="flowJson.ico" style="width:280px" clearable />
                            <span style="margin:0 12px">颜色</span><el-color-picker v-model="flowJson.color" />
                            <span class="roadui_note" style="margin-left:12px">流程发起页面显示的图标和颜色</span>
                        </td>
                    </tr>
                    <tr>
                        <th>备注</th>
                        <td>
                            <el-input v-model="flowJson.note" clearable style="width:100%"></el-input>
                        </td>
                    </tr>
                </table>
            </el-tab-pane>
            <el-tab-pane name="1" style="height:100%">
                <template #label>
                    <el-icon class="roadui_main_tabsvg"><Coin /></el-icon>数据连接
                </template>
                <el-table :data="dbList" :row-key="record=>record.key" style="width: 100%">
                    <el-table-column label="数据连接" width="160">
                        <template #default="scope">
                            <el-select v-model="scope.row.id" @change="connChange(scope.row);updateDBConn();">
                                <el-option v-for="conn in scope.row.conns" :key="conn.id" :value="conn.id" :label="conn.title"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="数据表" width="250">
                        <template #default="scope">
                            <el-select v-model="scope.row.table" @change="tableChange(scope.row);updateDBConn();" filterable>
                                <el-option v-for="table in scope.row.tables" :key="table.key" :value="table.key">
                                    <span>{{table.key}}</span>
                                    <span class="roadui_note1">{{utils.length(table.label)>0?' - '+table.label:''}}</span>
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="表主键" width="250">
                        <template #default="scope">
                            <el-select v-model="scope.row.primaryKey" @change="updateDBConn()" filterable>
                                <el-option v-for="field in scope.row.fields" :key="field.name" :value="field.name">
                                    <span>{{field.name}}</span>
                                    <span class="roadui_note1">{{utils.length(field.comment)>0?' - '+field.comment:''}}</span>
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column width="75">
                        <template #header>
                            <el-button size="small" type="primary" @click="addConn">添加</el-button>
                        </template>
                        <template #default="scope">
                            <el-button size="small" type="primary" @click="delConn(scope.row);updateDBConn()">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="2" style="height:100%">
                <template #label>
                    <el-icon class="roadui_main_tabsvg"><Discount /></el-icon>标识事件
                </template>
                <table cellpadding="0" cellspacing="0" border="0" class="roadui_fromtable">
                    <tr>
                        <th style="width:80px">标识字段</th>
                        <td>
                            <el-select v-model="titleField.field" filterable clearable style="width:100%">
                                <el-option v-for="field in titleFields" :disabled="field.isPrimaryKey" :key="field.name" :value="field.name">
                                    <span>{{field.name}}</span>
                                    <span class="roadui_note1">{{utils.length(field.comment)>0?' - '+field.comment:''}}</span>
                                </el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <th>标识值</th>
                        <td>
                            <el-input v-model="titleField.value" clearable></el-input>
                        </td>
                    </tr>
                    <tr>
                        <th>完成后事件</th>
                        <td>
                            <el-input v-model="titleField.eventCompleted" type="textarea" placeholder="流程审批结束后执行"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <th>暂缓后事件</th>
                        <td>
                            <el-input v-model="titleField.eventPostpone" type="textarea" placeholder="流程审批暂缓后执行"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <th>终止后事件</th>
                        <td>
                            <el-input v-model="titleField.eventStop" type="textarea" placeholder="流程审批终止后执行"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <th>作废后事件</th>
                        <td>
                            <el-input v-model="titleField.eventDelete" type="textarea" placeholder="流程作废后执行"></el-input>
                        </td>
                    </tr>
                </table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');

    const ElSelectorg = inject('ElSelectorg');//组织架构选择控件
    const ElSelectico = inject('ElSelectico');//图标选择控件
    const flowJson = inject('flowJson');
    const typeOptions = ref([]);//流程分类选项
    const systemOptions = ref([]);//所属系统选项

    onMounted(() => {
        loadApiSystemOptions();
    });
    //载入所属系统选项
    const loadApiSystemOptions = () => {
        ajax.post('/Flow/GetApiSystemOptions?flowtype=' + flowJson.value.type).then(((res) => {
            systemOptions.value = res.data['options'];
            //flowJson.value['type'] = res.data['type1'];//流程所属分类的值
            loadTypeOptions();
        })).catch(() => { });
    };
    //载入流程分类选项
    const loadTypeOptions = () => {
        const params = [{ id: 'system_applibrary_flowtype', key: 'type', children: true, valueField: 'id' }];
        ajax.post('/Dictionary/GetMultipleOptions', qs.stringify({ json: JSON.stringify(params) })).then((res) => {
            typeOptions.value = res.data['type'];
            loadConns();
        }).catch(() => { });
    };

    //数据连接标签
    const conns = ref([]);//数据库连接选项
    const dbList = ref([]);
    const titleFields = ref({});//标识字段(数据连接和表读取数据标签中设置的第一个)
    //添加数据连接
    const addConn = () => {
        dbList.value.push({ key: utils.createGuid(false), id: '', table: '', primaryKey: '', conns: [...conns.value], tables: [], fields: [] });
    };
    //删除数据连接
    const delConn = (conn) => {
        utils.removeArrayObj(dbList.value, conn.key, 'key');
    };
    //加载数据连接选项
    const loadConns = () => {
        //初始化数据连接选项
        utils.getConns().then((conns1) => {
            conns.value = [...conns1];
            //初始化已经选择的数据连接数据
            let dbs = utils.length(flowJson.value.databases) > 0 ? flowJson.value.databases : [];
            for (let i = 0; i < dbs.length; i++) {
                let record = {
                    key: utils.createGuid(false),
                    id: dbs[i].link,
                    table: dbs[i].table,
                    primaryKey: dbs[i].primaryKey,
                    conns: [...conns1],
                    tables: [],
                    fields: [],
                };
                if (utils.length(record.id) > 0) {
                    connChange(record, true);
                }
                dbList.value.push(record);
            }
            loadTitleField();//初始化标识字段
        });
    };
    //连接改变时重新加载表 isLoadFields：是否加载完表后加载字段
    const connChange = (record, isLoadFields) => {
        if (utils.isUndef(record)) {
            return;
        }
        utils.getConnTables(record.id).then((tables) => {
            record.tables = tables;
            if (isLoadFields) {
                tableChange(record);
            }
        });
    };
    //表改变获取字段
    const tableChange = (record) => {
        if (utils.isUndef(record)) {
            return;
        }
        utils.getConnTableFields(record.id, record.table).then((fields) => {
            record.fields = fields;
            //如果是第一个主表改变，要同步更新标识字段选项。
            if (dbList.value.length > 0 && dbList.value[0].key === record.key) {
                titleFields.value = fields;
            }
        });
    };
    //数组排序
    const arrayCompare = (property) => {
        return function (a, b) {
            var value1 = a[property] || 0;
            var value2 = b[property] || 0;
            return value1 - value2;
        }
    };
    //更新数据连接到flowJson.databases
    const updateDBConn = () => {
        let dbs = [];
        for (let i = 0; i < dbList.value.length; i++) {
            if (utils.length(dbList.value[i].id) === 0 || utils.length(dbList.value[i].table) === 0 || utils.length(dbList.value[i].primaryKey) === 0) {
                continue;
            }
            //查询连接名称
            let name = '';
            const conn = utils.getArrayObj(conns.value, dbList.value[i].id, 'id');
            if (utils.isDef(conn)) {
                name = conn.title;
            }
            dbs.push({ index: i, link: dbList.value[i].id, name: name, table: dbList.value[i].table, primaryKey: dbList.value[i].primaryKey });
        }
        flowJson.value.databases = dbs;
    };

    //标识事件标签
    //初始化标识字段
    const titleField = ref({});
    const loadTitleField = () => {
        if (utils.length(flowJson.value.titleField) > 0) {
            titleField.value = flowJson.value.titleField;
        } else {
            const field = { link: '', table: '', primaryKey: '', field: '', value: '', eventCompleted: '', eventStop: '' };
            flowJson.value.titleField = field;
            titleField.value = field;
        }
        //加载标识字段，连接和表取数据标签里的第一个设置。
        if (utils.length(flowJson.value.databases) > 0) {
            titleField.value.link = flowJson.value.databases[0].link;
            titleField.value.primaryKey = flowJson.value.databases[0].primaryKey;
            utils.getConnTableFields(titleField.value.link, titleField.value.table).then(fields => {
                titleFields.value = fields;
            });
        }
    };
</script>