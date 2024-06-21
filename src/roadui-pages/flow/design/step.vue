<template>
    <el-tabs>
        <el-tab-pane name="0" style="height:100%">
            <template #label>
                <el-icon class="roadui_main_tabsvg">
                    <Setting />
                </el-icon>基本
            </template>
            <table cellpadding="0" cellspacing="0" border="0" class="roadui_fromtable">
                <tr>
                    <th style="width:80px">步骤名称</th>
                    <td style="width:39%">
                        <el-input v-model="stepJson.name" @input="setStepText"></el-input>
                    </td>
                    <th style="width:80px;padding-left:20px;">步骤id</th>
                    <td>{{ stepJson.id }}</td>
                </tr>
                <tr>
                    <th>意见显示</th>
                    <td>
                        <el-switch v-model="stepJson.opinionDisplay" style="margin-right:12px;" />
                        <el-tooltip content="填写处理意见时是否可以上传附件" placement="top-start">
                            <el-checkbox v-model="stepJson.attachment" label="可传附件" style="vertical-align:middle" />
                        </el-tooltip>
                        <el-tooltip content="下一步有默认处理人时直接发送，不弹出发送确认窗口。" placement="top-start">
                            <el-checkbox v-model="stepJson.autoConfirm" label="有处理人直接发送" style="vertical-align:middle" />
                        </el-tooltip>
                    </td>
                    <th style="padding-left:20px;">工时(天)</th>
                    <td>
                        <el-input-number v-model="stepJson.workTime" style="width:100px;margin-right:12px;"
                            controls-position="right"></el-input-number>
                        <el-checkbox v-model="stepJson.sendSetWorkTime" label="发送时指定完成时间" style="vertical-align:middle" />
                    </td>
                </tr>
                <tr>
                    <th>审签类型</th>
                    <td>
                        <el-select v-model="stepJson.signatureType" style="width:100%">
                            <el-option value="0" label="无签批意见栏"></el-option>
                            <el-option value="1" label="有签批意见 - 无签章"></el-option>
                            <el-option value="2" label="有签批意见 - 须签章"></el-option>
                            <el-option value="3" label="有签批意见 - 须密码签章"></el-option>
                        </el-select>
                    </td>
                    <th style="padding-left:20px;">超期提醒</th>
                    <td>
                        <el-switch v-model="stepJson.expiredPrompt" style="margin-right:12px;" />
                        <span>提前 <el-input-number v-model="stepJson.expiredPromptDays" style="width: 90px"
                                controls-position="right"></el-input-number> 天</span>
                        <span style="margin-left:12px">间隔 <el-input-number v-model="stepJson.intervalPromptDays"
                                style="width: 90px" controls-position="right"></el-input-number> 天</span>
                    </td>
                </tr>
                <tr>
                    <th>是否归档</th>
                    <td>
                        <el-switch v-model="stepJson.archives" style="margin-right:12px;" />
                        <el-tooltip content="设置开启该步骤任务才在批量处理列表中显示" placement="top-start">
                            <el-checkbox v-model="stepJson.batch" label="批量处理" style="vertical-align:middle" />
                        </el-tooltip>
                        <el-tooltip content="步骤有多人处理时，是否同时只能有一人处理。" placement="top-start">
                            <el-checkbox v-model="stepJson.concurrentModel" label="并发控制" style="vertical-align:middle" />
                        </el-tooltip>
                    </td>
                    <th style="padding-left:20px;">超时处理</th>
                    <td>
                        <el-radio-group v-model="stepJson.timeOutModel">
                            <el-radio :label="0">不处理</el-radio>
                            <el-radio :label="1">自动提交</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr>
                    <th>发送提示语</th>
                    <td>
                        <el-input v-model="stepJson.sendShowMsg"></el-input>
                    </td>
                    <th style="padding-left:20px;">退回提示语</th>
                    <td>
                        <el-input v-model="stepJson.backShowMsg"></el-input>
                    </td>
                </tr>
                <tr>
                    <th>表单</th>
                    <td colspan="3">
                        <el-cascader v-model="stepJson.formType" :options="appTypes" style="width:341px;margin-right:19px;"
                            @change="appTypeSelect" :props="{ expandTrigger: 'hover', checkStrictly: true }" clearable />
                        <el-select v-model="stepJson.formId" style="width:458px;" clearable>
                            <el-option v-for="opt in appOptions" :key="opt.id" :value="opt.id"
                                :label="opt.label"></el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <th>移动端表单</th>
                    <td colspan="3">
                        <el-cascader v-model="stepJson.formType_mobile" :options="appTypes"
                            style="width:341px; margin-right: 19px;" @change="appTypeSelectMobile"
                            :props="{ expandTrigger: 'hover', checkStrictly: true }" clearable />
                        <el-select v-model="stepJson.formId_mobile" style="width:458px;" clearable>
                            <el-option v-for="opt in appOptionsMobile" :key="opt.id" :value="opt.id"
                                :label="opt.label"></el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <th>备注</th>
                    <td colspan="3">
                        <el-input v-model="stepJson.note"></el-input>
                    </td>
                </tr>
            </table>
        </el-tab-pane>
        <el-tab-pane name="1" style="height:100%">
            <template #label>
                <el-icon class="roadui_main_tabsvg">
                    <Cpu />
                </el-icon>策略
            </template>
            <table cellpadding="0" cellspacing="0" border="0" class="roadui_fromtable">
                <tr>
                    <th style="width:80px">流转类型</th>
                    <td style="width:38%">
                        <el-select v-model="behavior.flowType" style="width:100%" clearable>
                            <el-option value="0" label="单选一个步骤"></el-option>
                            <el-option value="1" label="多选几个步骤 - 默认选中第一个"></el-option>
                            <el-option value="2" label="多选几个步骤 - 默认全部选中"></el-option>
                            <el-option value="3" label="多选几个步骤 - 默认全部选中不能取消"></el-option>
                            <el-option value="4" label="根据条件判断 - 无后续步骤时提示"></el-option>
                            <el-option value="5" label="根据条件判断 - 无后续步骤时完成"></el-option>
                        </el-select>
                    </td>
                    <th style="width:80px;padding-left:20px;">选择类型</th>
                    <td>
                        <el-select placeholder="组织选择类型" v-model="behavior.selectType" multiple style="width:181px"
                            clearable>
                            <el-option value="unit" label="单位"></el-option>
                            <el-option value="dept" label="部门"></el-option>
                            <el-option value="station" label="岗位"></el-option>
                            <el-option value="user" label="人员"></el-option>
                            <el-option value="workgroup" label="工作组"></el-option>
                        </el-select>
                        <span style="margin-left:12px">
                            <el-tooltip content="是否允许发送人在处理时自己选择该步骤的接收人" placement="top-start">
                                <el-checkbox v-model="behavior.runSelect" label="允许选择" style="vertical-align:middle" />
                            </el-tooltip>
                        </span>
                        <span style="margin-left:12px">
                            <el-tooltip content="发送时允许选择的组织人员数量，0或空表示不限制。" placement="top-start">
                                <el-input-number v-model="behavior.selectQuantity" placeholder="数量" style="width:86px"
                                    controls-position="right" />
                            </el-tooltip>
                        </span>
                    </td>
                </tr>
                <tr>
                    <th>处理者类型</th>
                    <td>
                        <el-select multiple v-model="behavior.handlerType" style="width:100%" clearable>
                            <el-option v-for="opt in handlerType" :key="opt.value" :value="opt.value"
                                :label="opt.title"></el-option>
                        </el-select>
                    </td>
                    <th style="padding-left:20px;">选择范围</th>
                    <td>
                        <el-select v-model="behavior.selectRangeForDefaultHandler" style="width:155px" clearable>
                            <el-option value="1" label="默认处理者选中"></el-option>
                            <el-option value="2" label="默认处理者不选中"></el-option>
                        </el-select>
                        <el-selectorg v-model="behavior.selectRange" placeholder="指定选择范围"
                            style="width:205px;margin-left:12px;"></el-selectorg>
                    </td>
                </tr>
                <tr>
                    <th>处理者步骤</th>
                    <td>
                        <el-select v-model="behavior.handlerStep" style="width: 100%" clearable>
                            <el-option v-for="opt in handlerSteps" :key="opt.value" :value="opt.value"
                                :label="opt.title"></el-option>
                        </el-select>
                    </td>
                    <th style="padding-left:20px;">加签范围</th>
                    <td>
                        <el-selectorg v-model="behavior.addWriteRange" placeholder="指定加签选择范围"
                            style="width:265px;"></el-selectorg>
                        <span style="margin-left:12px">
                            <el-tooltip content="将该步骤的默认处理人作为加签选择范围" placement="top-start">
                                <el-checkbox v-model="behavior.addWriteDefaultIsRange" label="默认处理人"
                                    style="vertical-align:middle"></el-checkbox>
                            </el-tooltip>
                        </span>
                    </td>
                </tr>
                <tr>
                    <th>值字段</th>
                    <td>
                        <el-select v-model="behavior.valueField" style="width:220px" filterable clearable>
                            <el-option v-for="opt in valueFields" :key="opt.value" :value="opt.value" :label="opt.label">
                                <span>{{ opt.label }}</span>
                                <span class="roadui_note1">{{ utils.length(opt.comment) > 0 ? ' - ' + opt.comment : ''
                                }}</span>
                            </el-option>
                        </el-select>
                        <el-tooltip content="如果没有找到默认处理者，则读取步骤上次的处理人作为默认处理者。" placement="top-start">
                            <el-checkbox v-model="behavior.lastHandler" style="margin-left:12px"
                                label="上次处理者"></el-checkbox>
                        </el-tooltip>
                    </td>
                    <th style="padding-left:20px;" rowspan="2">默认处理者<br />SQL或方法</th>
                    <td rowspan="2">
                        <el-input v-model="behavior.defaultHandlerSqlOrMethod" style="width:100%" type="textarea" :rows="4"
                            placeholder="[sql]开头的字符串表示为sql语句，否则表示为方法。" clearable></el-input>
                    </td>
                </tr>
                <tr>
                    <th>默认处理者</th>
                    <td>
                        <el-selectorg v-model="behavior.defaultHandler" placeholder="指定默认处理者" style="width:100%"
                            clearable></el-selectorg>
                    </td>
                </tr>
                <tr>
                    <th>处理策略</th>
                    <td>
                        <el-select v-model="behavior.hanlderModel" style="width:190px" clearable>
                            <el-option value="0" label="所有人同意"></el-option>
                            <el-option value="1" label="一人同意即可"></el-option>
                            <el-option value="2" label="依据人数比例"></el-option>
                            <el-option value="3" label="按选择人员顺序处理"></el-option>
                            <el-option value="4" label="独立处理"></el-option>
                        </el-select>
                        <span style="margin-left:12px">百分比<el-input v-model="behavior.percentage"
                                style="width: 54px; margin-left: 12px"></el-input> %</span>
                    </td>
                    <th style="padding-left:20px;">退回策略</th>
                    <td>
                        <el-select v-model="behavior.backModel" style="width:185px" clearable>
                            <el-option value="1" label="根据处理策略退回"></el-option>
                            <el-option value="2" label="一人退回全部退回"></el-option>
                            <el-option value="3" label="所有人退回才退回"></el-option>
                            <el-option value="4" label="独立退回"></el-option>
                            <el-option value="0" label="不能退回"></el-option>
                        </el-select>
                        <el-tooltip content="退回时处理人自己选择接收人" placement="top-start">
                            <el-checkbox v-model="behavior.backSelectUser" style="margin-left:12px"
                                label="选择退回接收人"></el-checkbox>
                        </el-tooltip>
                    </td>
                </tr>
                <tr>
                    <th>会签策略</th>
                    <td>
                        <el-select v-model="behavior.countersignature" style="width:190px" clearable>
                            <el-option value="0" label="不会签"></el-option>
                            <el-option value="1" label="所有步骤同意"></el-option>
                            <el-option value="2" label="一个步骤同意即可"></el-option>
                            <el-option value="3" label="依据比例"></el-option>
                        </el-select>
                        <span style="margin-left:12px">百分比<el-input v-model="behavior.countersignaturePercentage"
                                style="width: 54px; margin-left: 12px"></el-input> %</span>
                    </td>
                    <th style="padding-left:20px;">退回类型</th>
                    <td>
                        <el-select v-model="behavior.backType" style="width:185px" clearable>
                            <el-option value="0" label="退回前一步"></el-option>
                            <el-option value="1" label="退回第一步"></el-option>
                            <el-option value="2" label="退回某一步"></el-option>
                        </el-select>
                        <el-tooltip content="如果是退回任务时直接发送到退回的步骤" placement="top-start">
                            <el-checkbox v-model="behavior.sendToBackStep" style="margin-left:12px">发送到退回步骤</el-checkbox>
                        </el-tooltip>
                    </td>
                </tr>
                <tr>
                    <th>会签起点</th>
                    <td>
                        <el-select v-model="behavior.countersignatureStartStep" style="width:100%" clearable>
                            <el-option v-for="opt in handlerSteps" :key="opt.value" :value="opt.value"
                                :label="opt.title"></el-option>
                        </el-select>
                    </td>
                    <th style="padding-left:20px;">退回步骤</th>
                    <td>
                        <el-select multiple v-model="behavior.backStep" placeholder='选择退回类型为"退回某一步"时的步骤' style="width:100%"
                            clearable>
                            <el-option v-for="opt in handlerSteps" :key="opt.value" :value="opt.value"
                                :label="opt.title"></el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <th>跳过策略</th>
                    <td colspan="3">
                        <el-tooltip content="上一步发送人和该步接收人为同一人时跳过" placement="top-start">
                            <el-checkbox style="margin-right:12px;vertical-align:middle;"
                                v-model="behavior.skipIdenticalUser" label="同一处理人"></el-checkbox>
                        </el-tooltip>
                        <el-tooltip content="没有找到默认处理人时跳过" placement="top-start">
                            <el-checkbox style="margin-right: 12px; vertical-align: middle;"
                                v-model="behavior.skipNoHandler" label="无默认处理人"></el-checkbox>
                        </el-tooltip>
                        <span>方法<el-input v-model="behavior.skipMethod" placeholder='方法返回布尔true或字符串"1"或"true"时跳过'
                                style="width:554px;margin-left:12px;"></el-input> </span>
                    </td>
                </tr>
            </table>
        </el-tab-pane>
        <el-tab-pane name="2" style="height:100%">
            <template #label>
                <el-icon class="roadui_main_tabsvg">
                    <TurnOff />
                </el-icon>按钮
            </template>
            <div class="roadui_setshortuctdiv" style="width:100%">
                <table cellpadding="0" cellspacing="0" border="0">
                    <tbody>
                        <tr>
                            <td style="width:30%;height:507px" valign="top">
                                <div class="roadui_setshortuctlist" style="padding:0 0 0 12px">
                                    <el-scrollbar style="height:100%">
                                        <div style="padding-right:12px">
                                            <div v-for="but in buttons" :key="but.id"
                                                :class="`roadui_draggable_item${but.id == currentSelectButton['id'] ? ' roadui_draggable_itemhover' : ''}`"
                                                @dblclick="stepButtonClick(but); addButton();"
                                                @click="stepButtonClick(but)">
                                                <component v-if="utils.length(but.ico) > 0" :is="but.ico"></component>
                                                {{ but.name }}
                                            </div>
                                        </div>
                                    </el-scrollbar>
                                </div>
                            </td>
                            <td class="roadui_setshortuctbuttd" valign="middle">
                                <div>
                                    <div><el-button type="primary" @click="addButton()">添加</el-button></div>
                                    <div><el-button type="primary" @click="removeButton()">移出</el-button></div>
                                </div>
                            </td>
                            <td valign="top" style="width:30%">
                                <div class="roadui_setshortuctlist" style="padding-right:12px">
                                    <draggable :list="stepButtons" @sort="updateButtons" item-key="key" :animation="200"
                                        :group="{ name: 'stepButton', pull: true }">
                                        <template #item="{ element }">
                                            <div :class="`roadui_draggable_item${element.id == currentSelectButton['id'] ? ' roadui_draggable_itemhover' : ''}`"
                                                @dblclick="stepButtonClick(element); removeButton();"
                                                @click="stepButtonClick(element)">
                                                <div>
                                                    <component v-if="utils.length(element.ico) > 0" :is="element.ico">
                                                    </component>
                                                    {{ element.name }}
                                                </div>
                                            </div>
                                        </template>
                                    </draggable>
                                </div>
                            </td>
                            <td valign="top" style="padding-left:30px">
                                <div class="roadui_setshortuctlist" style="padding-right:12px">
                                    <div style="margin-bottom:10px">操作提示</div>
                                    <div class="roadui_note">在按钮上双击可快速添加和移出按钮。</div>
                                    <div class="roadui_note" style="margin-top:5px">在已选择按钮上拖动可排序。</div>
                                    <div style="margin:20px 0 15px 0">按钮显示</div>
                                    <div><el-input v-model="currentSelectButton.showTitle"
                                            @change="updateButtons"></el-input></div>
                                    <div style="margin:20px 0 10px 0">按钮说明</div>
                                    <div class="roadui_note">{{ currentSelectButton.note }}</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </el-tab-pane>
        <el-tab-pane name="3" style="height:100%">
            <template #label>
                <el-icon class="roadui_main_tabsvg">
                    <Coin />
                </el-icon>数据
            </template>
            <div style="margin-bottom:15px">
                <span>
                    数据表
                    <el-select style="width:200px;margin-left:6px;" v-model="statusCheck.table" @change="data_table_select"
                        clearable>
                        <el-option v-for="option in tableArray" :key="option.value" :value="option.value"
                            :label="option.title">
                            <span>{{ option.title }}</span>
                            <span v-if="utils.length(option.tableName) > 0" class="roadui_note"> ({{ option.tableName
                            }})</span>
                        </el-option>
                    </el-select>
                </span>
                <span style="margin-left:10px">
                    状态
                    <el-select style="width:86px;margin-left:6px;" v-model="statusCheck.status"
                        @change="data_status_select">
                        <el-option :value="0" label="编辑"></el-option>
                        <el-option :value="1" label="只读"></el-option>
                        <el-option :value="2" label="隐藏"></el-option>
                    </el-select>
                </span>
                <span style="margin-left:10px">
                    数据验证
                    <el-select style="width:90px;margin-left:6px;" v-model="statusCheck.check" @change="data_check_select">
                        <el-option :value="0" label="不验证"></el-option>
                        <!--<el-option :value="1">非空时验证</el-option>-->
                        <el-option :value="2" label="验证"></el-option>
                    </el-select>
                </span>
                <span style="margin-left:20px">
                    <el-tooltip content="此步骤执行流程时是否将表单数据同步更新到绑定的数据表" placement="top-start">
                        <el-checkbox v-model="stepJson.dataToDb" label="更新表" />
                    </el-tooltip>
                </span>
                <span v-show="tableArray.length > 1" style="margin-left:20px">
                    <el-input v-model="stepJson.subtableWhere" style="width:240px;" placeholder="子表数据过滤条件"></el-input>
                </span>
            </div>
            <el-table :data="rows1" style="width:100%;" height="468px">
                <el-table-column label="数据表" prop="tableName"></el-table-column>
                <el-table-column label="字段" prop="field">
                    <template #default="scope">
                        <span>{{ scope.row.comment }}</span>
                        <span :class="utils.length(scope.row.comment) > 0 ? 'roadui_note' : ''">{{
                            utils.length(scope.row.comment) > 0 ? '(' + scope.row.field + ')' : scope.row.field }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="字段状态" width="110">
                    <template #default="scope">
                        <el-select v-model="scope.row.fieldStatus" @change="update_data(scope.row)">
                            <el-option :value="0" label="编辑"></el-option>
                            <el-option :value="1" label="只读"></el-option>
                            <el-option :value="2" label="隐藏"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="数据验证" width="110">
                    <template #default="scope">
                        <el-select v-model="scope.row.check" @change="update_data(scope.row)">
                            <el-option :value="0" label="不验证"></el-option>
                            <!--<el-option :value="1">非空时验证</el-option>-->
                            <el-option :value="2" label="验证"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane name="4" style="height:100%">
            <template #label>
                <el-icon class="roadui_main_tabsvg">
                    <Edit />
                </el-icon>抄送
            </template>
            <table cellpadding="0" cellspacing="0" border="0" class="roadui_fromtable">
                <tr>
                    <th style="width:90px">指定接收人</th>
                    <td>
                        <el-selectorg v-model="copyFor.memberId" placeholder="抄送给指定的接收人" style="width:100%"
                            clearable></el-selectorg>
                    </td>
                </tr>
                <tr>
                    <th>类型</th>
                    <td>
                        <el-select v-model="copyFor.handlerType" multiple style="width:100%" clearable>
                            <el-option v-for="option in copyForHandlerType" :key="option.value" :value="option.value"
                                :label="option.title"></el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <th>步骤处理人员</th>
                    <td>
                        <el-select v-model="copyFor.steps" placeholder="抄送给某一步骤的处理人员" multiple style="width:100%" clearable>
                            <el-option v-for="option in handlerSteps" :key="option.value" :value="option.value"
                                :label="option.title"></el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <th>SQL或方法</th>
                    <td>
                        <el-input type="textarea" :rows="3" placeholder="通过sql或方法返回接收人，[sql]开头表示sql语句，否则表示方法。"
                            v-model="copyFor.methodOrSql"></el-input>
                    </td>
                </tr>
                <tr>
                    <th>抄送时间</th>
                    <td>
                        <el-radio-group v-model="copyFor.time">
                            <el-radio :label="0">步骤接收时</el-radio>
                            <el-radio :label="1">步骤完成时</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr>
                    <th>待办通知</th>
                    <td>
                        <el-checkbox-group v-model="copyFor.messageType">
                            <el-checkbox :label="0">站内消息</el-checkbox>
                            <el-checkbox :label="1">手机短信</el-checkbox>
                            <el-checkbox :label="2">微信</el-checkbox>
                            <el-checkbox :label="4">邮件</el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <th>消息模板</th>
                    <td>
                        <el-input type="textarea" :rows="3" v-model="copyFor.messageTemplate"></el-input>
                    </td>
                </tr>
            </table>
        </el-tab-pane>
        <el-tab-pane name="5" style="height:100%">
            <template #label>
                <el-icon class="roadui_main_tabsvg">
                    <Mouse />
                </el-icon>事件
            </template>
            <table cellpadding="0" cellspacing="0" border="0" class="roadui_fromtable">
                <tr>
                    <th style="width:90px">提交前事件</th>
                    <td>
                        <el-input type="textarea" v-model="eventJson.submitBefore"
                            placeholder="方法返回字符串1、true以外的其他字符，表示为错误信息，返回客户端提示，任务不提交。"></el-input>
                    </td>
                </tr>
                <tr>
                    <th>提交后事件</th>
                    <td>
                        <el-input type="textarea" v-model="eventJson.submitAfter" placeholder="任务提交后执行"></el-input>
                    </td>
                </tr>
                <tr>
                    <th>步骤提交通过后事件</th>
                    <td>
                        <el-input type="textarea" v-model="eventJson.submitPassAfter" placeholder="步骤提交通过后执行"></el-input>
                    </td>
                </tr>
                <tr>
                    <th>退回前事件</th>
                    <td>
                        <el-input type="textarea" v-model="eventJson.backBefore"
                            placeholder="方法返回字符串1、true以外的其他字符，表示为错误信息，返回客户端提示，任务不退回。"></el-input>
                    </td>
                </tr>
                <tr>
                    <th>退回后事件</th>
                    <td>
                        <el-input type="textarea" v-model="eventJson.backAfter" placeholder="任务退回后执行"></el-input>
                    </td>
                </tr>
                <tr>
                    <th>步骤退回通过后事件</th>
                    <td>
                        <el-input type="textarea" v-model="eventJson.backPassAfter" placeholder="步骤退回通过后执行"></el-input>
                    </td>
                </tr>
                <!-- <tr>
                    <th>保存后事件</th>
                    <td>
                        <el-input type="textarea" v-model="eventJson.saveAfter" placeholder="任务保存后执行"></el-input>
                    </td>
                </tr> -->
                <tr>
                    <th>数据保存前事件</th>
                    <td>
                        <el-input type="textarea" v-model="eventJson.dataSaveBefore"
                            placeholder="表单数据保存前执行。方法返回字符串1、true以外的其他字符，表示为错误信息，返回客户端提示，任务不提交。"></el-input>
                    </td>
                </tr>
            </table>
        </el-tab-pane>
        <el-tab-pane name="6" v-if="stepJson.type === 'subflow'" style="height:100%">
            <template #label>
                <el-icon class="roadui_main_tabsvg">
                    <Files />
                </el-icon>子流程
            </template>
            <table cellpadding="0" cellspacing="0" border="0" class="roadui_fromtable">
                <tr>
                    <th style="width:90px">子流程</th>
                    <td>
                        <el-selectflow style="width:100%" v-model="subFlow.flowId"></el-selectflow>
                    </td>
                </tr>
                <tr>
                    <th>子流程策略</th>
                    <td>
                        <el-radio-group v-model="subFlow.flowStrategy">
                            <el-radio :label="0">子流程完成才能提交</el-radio>
                            <el-radio :label="1">子流程发起即可提交</el-radio>
                            <el-radio :label="2">子流程发起后自动提交</el-radio>
                            <el-radio :label="3">子流程完成后自动提交</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr>
                    <th>实例类型</th>
                    <td>
                        <el-radio-group v-model="subFlow.taskType">
                            <el-radio :label="0">所有人同一实例</el-radio>
                            <el-radio :label="1">每个人单独实例</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr>
                    <th>激活前事件</th>
                    <td><el-input type="textarea" :rows="3" placeholder="发起子流程任务前设置子流程业务数据，任务标题等操作。"
                            v-model="subFlow.activationBeforeEvent"></el-input></td>
                </tr>
            </table>
        </el-tab-pane>
    </el-tabs>
</template>

<script setup>
import Draggable from 'vuedraggable';
import { ref, inject, onMounted, onUnmounted } from 'vue';
const ajax = inject('ajax');
const utils = inject('utils');
const qs = inject('qs');
const ElSelectorg = inject('ElSelectorg');//组织架构选择控件
const ElSelectflow = inject('ElSelectflow');
const props = defineProps({ query: { type: String, default: () => { return ''; } } });
const desing_setStepText = inject('desing_setStepText');

const flowJson = inject('flowJson');
const stepId = utils.query('stepid', props.query);
const stepJson = ref({});
const appTypes = inject('appTypes');//表单分类选项
const appOptions = ref([]);//表单分类下的应用
const appOptionsMobile = ref([]);//移动端表单分类下的应用

onMounted(() => {
    stepJson.value = utils.getArrayObj(flowJson.value.steps, stepId, 'id');
    if (stepJson.value === null) {
        utils.msg('没有找到步骤！', false);
        return;
    }

    //解决拖拽排序时会打开新页搜索问题。
    document.body.ondrop = function (event) {
        try {
            event.preventDefault();
            event.stopPropagation();
        } catch (e) { console.log(e) }
    }

    //检查工时数据类型必须是数字
    if (!utils.isNumber(stepJson.value.workTime)) {
        delete stepJson.value.workTime;
    }
    //检查超期提醒数据类型必须是数字
    if (!utils.isNumber(stepJson.value.expiredPrompt)) {
        delete stepJson.value.expiredPrompt;
    }
    //检查超期提醒间隔天数数据类型必须是数字
    if (!utils.isNumber(stepJson.value.expiredPromptDays)) {
        delete stepJson.value.expiredPromptDays;
    }

    behavior.value = stepJson.value.behavior || {};

    //初始化处理者步骤选项
    if (utils.isDef(flowJson.value) && utils.length(flowJson.value.steps) > 0) {
        for (let i = 0; i < flowJson.value.steps.length; i++) {
            if (flowJson.value.steps[i].id == stepJson.value.id) {
                continue;
            }
            handlerSteps.value.push({ value: flowJson.value.steps[i].id, title: utils.replace(flowJson.value.steps[i].name, "\\\\n", "") });
        }
    }

    //字段状态
    fieldStatus.value = stepJson.value.fieldStatus;
    //抄送
    copyFor.value = stepJson.value.copyFor || {};
    //事件
    eventJson.value = stepJson.value.event || {};
    //子流程
    subFlow.value = stepJson.value.subflow || {};

    loadAppTypeOptions();
    loadWorkRole();//加载工作角色
    loadStepFormFields();//加载表单对应的表字段状态
    loadButtons();//加载流程按钮
});
onUnmounted(() => {
    document.body.ondrop = null;
});

//基本================================
//载入应用分类(选择表单)
const loadAppTypeOptions = () => {
    //如果已加载，则不加载。
    if (utils.length(appTypes.value) > 0) {
        appTypeSelect(stepJson.value.formType);
        return;
    }
    const params = [{ id: 'system_applibrary_type', key: 'type', children: true, valueField: 'id' }];
    ajax.post('/Dictionary/GetMultipleOptions', qs.stringify({ json: JSON.stringify(params) })).then((res) => {
        appTypes.value = res.data['type'];
        appTypeSelect(stepJson.value.formType);
    }).catch(() => { });
};
//表单分类改变时加载分类下的应用
const appTypeSelect = (val) => {
    if (utils.length(val) > 0) {
        ajax.post('/Applibrary/GetOptions?typeid=' + val[val.length - 1]).then((res) => {
            appOptions.value = res.data;
            appTypeSelectMobile(stepJson.value.formType_mobile);
        }).catch(() => { });
    } else {
        stepJson.value.formId = '';
        appOptions.value = [];
        appTypeSelectMobile(stepJson.value.formType_mobile);
    }
};
//移动端表单分类改变时加载分类下的应用
const appTypeSelectMobile = (val) => {
    if (utils.length(val) > 0) {
        ajax.post('/Applibrary/GetOptions?typeid=' + val[val.length - 1]).then((res) => {
            appOptionsMobile.value = res.data;
        }).catch(() => { });
    } else {
        stepJson.value.formId_mobile = '';
        appOptionsMobile.value = [];
    }
};
//步骤名称变化时更新流程图上的步骤名称
const setStepText = (val) => {
    desing_setStepText(stepJson.value.id, val);
};

//策略==================================
const behavior = ref({});
const workRoles = inject('workRoles');//工作角色，处理者类型选项用。
const handlerSteps = ref([]);//处理者步骤选项
const valueFields = ref([]);//值字段选项
//处理者类型选项
const handlerType = ref([
    { value: '0', title: '发起者' },
    { value: '1', title: '某一步骤处理者' },
    { value: '2', title: '字段值' },
    { value: '3', title: '发起者 - 部门' },
    { value: '4', title: '发起者 - 单位' },
    { value: '5', title: '前一步处理者 - 部门' },
    { value: '6', title: '前一步处理者 - 单位' },
]);
//加载工作角色选项
const loadWorkRole = () => {
    if (utils.length(workRoles.value) > 0) {
        //已经加载过工作角色选项，判断不重复加载。在design.vue中定义。
        let j = 0, k = 0;
        for (let i = 0; i < workRoles.value.length; i++) {
            if (utils.startWith(workRoles.value[i].value, 'initiator_')) {
                handlerType.value.splice(j + 5, 0, workRoles.value[i]);
                copyForHandlerType.value.splice(j + 2, 0, workRoles.value[i]);
                j++;
            } else if (utils.startWith(workRoles.value[i].value, 'parents_initiator_')) {
                handlerType.value.splice(k + 5 + j, 0, workRoles.value[i]);
                copyForHandlerType.value.splice(k + 2 + j, 0, workRoles.value[i]);
                k++;
            } else {
                handlerType.value.push(workRoles.value[i]);
                copyForHandlerType.value.push(workRoles.value[i]);
            }
        }
    } else {
        const params = [{ id: 'system_organize_workrole', key: 'workrole', children: false, valueField: 'value' }];
        ajax.post('/Dictionary/GetMultipleOptions', qs.stringify({ json: JSON.stringify(params) })).then((res) => {
            let workRoles1 = [];
            let workRolesArray = res.data['workrole'];
            for (let i = 0; i < workRolesArray.length; i++) {
                let op = { value: 'initiator_' + workRolesArray[i].value, title: '发起者 - ' + workRolesArray[i].label };
                workRoles1.push(op);
                handlerType.value.splice(i + 5, 0, op);
                copyForHandlerType.value.splice(i + 2, 0, op);
            }
            for (let i = 0; i < workRolesArray.length; i++) {
                let op = { value: 'parents_initiator_' + workRolesArray[i].value, title: '发起者 - 所有上级' + workRolesArray[i].label };
                workRoles1.push(op);
                handlerType.value.splice(i + 5 + workRolesArray.length, 0, op);
                copyForHandlerType.value.splice(i + 2 + workRolesArray.length, 0, op);
            }
            for (let i = 0; i < workRolesArray.length; i++) {
                let op = { value: 'sender_' + workRolesArray[i].value, title: '前一步处理者 - ' + workRolesArray[i].label };
                workRoles1.push(op);
                handlerType.value.push(op);
                copyForHandlerType.value.push(op);
            }
            for (let i = 0; i < workRolesArray.length; i++) {
                let op = { value: 'parents_sender_' + workRolesArray[i].value, title: '前一步处理者 - 所有上级' + workRolesArray[i].label };
                workRoles1.push(op);
                handlerType.value.push(op);
                copyForHandlerType.value.push(op);
            }
            workRoles.value = workRoles1;//保存到上级VUE中，下次直接获取，不再远程请求。
        }).catch(() => { });
    }
};
//加载表单字段
const loadStepFormFields = () => {
    utils.getFromFields(flowJson.value.id, stepId, stepJson.value.formId).then((tables) => {
        for (let i = 0; i < tables.length; i++) {
            tableArray.value.push({ value: tables[i].id, title: (utils.length(tables[i].label) > 0 ? tables[i].label + ' - ' : '') + tables[i].id, tableName: tables[i].tableName || '' });
            //策略里的值字段选项
            if (tables[i].type === 'main') {
                for (let m = 0; m < tables[i].fields.length; m++) {
                    valueFields.value.push({
                        value: tables[i].fields[m].id,
                        label: tables[i].fields[m].id,
                        comment: tables[i].fields[m].label,
                    });
                }
            }
            for (let j = 0; j < tables[i].fields.length; j++) {
                let status = 0, check = 0, tableName = '';
                if (utils.length(fieldStatus.value) > 0) {
                    for (let k = 0; k < fieldStatus.value.length; k++) {
                        let fieldKey = tables[i].type == 'subtable' ? (tables[i].id + '.' + tables[i].fields[j].id).toLowerCase() : tables[i].fields[j].id.toLowerCase();
                        if (fieldStatus.value[k].field.toLowerCase() === fieldKey) {
                            status = fieldStatus.value[k].status;
                            check = fieldStatus.value[k].check;
                            break;
                        }
                    }
                }
                //如果字段ID是-线分隔的，表示是绑定的表字段，表名取-线前字符串。
                let idArray = tables[i].fields[j].id.split('-');
                if (idArray.length === 2) {
                    tableName = idArray[0];
                }
                tableName = tableName || (tables[i].label || tables[i].id);
                rows.push({ table: tables[i].id, tableName: tableName, type: tables[i].type, field: tables[i].fields[j].id, comment: tables[i].fields[j].label, fieldStatus: status, check: check });
                rows1.value.push({ table: tables[i].id, tableName: tableName, type: tables[i].type, field: tables[i].fields[j].id, comment: tables[i].fields[j].label, fieldStatus: status, check: check });
            }
        }
    });
};

//按钮==================================
const buttons = inject('buttons');//可供选择的流程按钮
const stepButtons = ref([]);//已选择的步骤按钮
const currentSelectButton = ref({ id: '', name: '', showTitle: '', note: '' });//当前选择按钮
const statusCheck = ref({});//批量设置状态和检查的绑定对象。
//载入按钮
const loadButtons = () => {
    //如果已经加载，则不重复加载。在design.vue中定义。
    if (utils.length(buttons.value) > 0) {
        //初始化已选择按钮
        let selectButtons = stepJson.value.buttons || [];
        for (let i = 0; i < selectButtons.length; i++) {
            let button = utils.getArrayObj(buttons.value, selectButtons[i].id, 'id');
            if (button === null) {
                continue;
            }
            let showTitle = utils.hasKey(selectButtons[i], 'showTitle') ? selectButtons[i].showTitle : '';
            stepButtons.value.push({ id: button.id, key: utils.createGuid(false), name: button.name, showTitle: showTitle, ico: button.ico, note: button.note, current: false });
        }
    } else {
        ajax.post('/FlowButton/getList').then((res) => {
            //添加分隔线按钮
            res.data.splice(0, 0, { id: utils.emptyLong + '', name: "分隔线", scripts: "", ico: "Minus", note: "", sort: 0 })
            buttons.value = res.data;
            //初始化已选择按钮
            let selectButtons = stepJson.value.buttons || [];
            for (let i = 0; i < selectButtons.length; i++) {
                let button = utils.getArrayObj(res.data, selectButtons[i].id, 'id');
                if (button === null) {
                    continue;
                }
                let showTitle = utils.hasKey(selectButtons[i], 'showTitle') ? selectButtons[i].showTitle : '';
                stepButtons.value.push({ id: button.id, key: utils.createGuid(false), name: button.name, showTitle: showTitle, ico: button.ico, note: button.note, current: false });
            }
        }).catch(() => { });
    }
}
//按钮点击
const stepButtonClick = (but) => {
    currentSelectButton.value = but;
};
//添加按钮
const addButton = () => {
    if (utils.length(currentSelectButton.value.id) === 0) {
        utils.msg('请选择要添加的按钮！', false);
        return;
    }
    if (currentSelectButton.value.id !== utils.emptyLong + '' && utils.inArray(stepButtons.value, currentSelectButton.value.id, 'id')) {
        utils.msg(currentSelectButton.value.name + '按钮已经选择了！', false);
        return;
    }
    stepButtons.value.push({ id: currentSelectButton.value.id, key: utils.createGuid(false), name: currentSelectButton.value.name, showTitle: '', ico: currentSelectButton.value.ico, note: currentSelectButton.value.note, current: false });
    updateButtons();
};
//移出按钮
const removeButton = () => {
    if (utils.length(currentSelectButton.value.id) === 0) {
        utils.msg('请选择要移出的按钮！', false);
        return;
    }
    for (let i = 0; i < stepButtons.value.length; i++) {
        if (stepButtons.value[i] === currentSelectButton.value || (currentSelectButton.value.id != utils.emptyLong.toString() && currentSelectButton.value.id == stepButtons.value[i].id)) {
            stepButtons.value.splice(i, 1);
        }
    }
    updateButtons();
};
//更新按钮到流程设计json
const updateButtons = () => {
    let buttons1 = [];
    for (let i = 0; i < stepButtons.value.length; i++) {
        buttons1.push({ id: stepButtons.value[i].id, sort: (i + 1) * 5, showTitle: utils.hasKey(stepButtons.value[i], 'showTitle') && utils.length(stepButtons.value[i].showTitle) > 0 ? stepButtons.value[i].showTitle : '' });
    }
    stepJson.value.buttons = buttons1;
};

//抄送==================================
const copyFor = ref([]);
const copyForHandlerType = ref([]);//抄送接收者类型

//数据==================================
const tableArray = ref([]);//数据表
const fieldStatus = ref([]);//字段状态
const rows = [];
const rows1 = ref([]);
//数据表改变时
const data_table_select = (val) => {
    rows1.value = utils.length(val) === 0 ? [...rows] : [...rows].filter(item => item.table == val);
    for (let i = 0; i < rows1.value.length; i++) {
        let id = rows1.value[i].type == 'subtable' ? rows1.value[i].table + '.' + rows1.value[i].field : rows1.value[i].field;
        let statusObj = utils.getArrayObj(stepJson.value.fieldStatus, id.toLowerCase(), 'field');
        if (statusObj !== null) {
            rows1.value[i].check = statusObj.check;
            rows1.value[i].fieldStatus = statusObj.status;
        }
    }
};
//字段状态改变时
const data_status_select = (val) => {
    for (let i = 0; i < rows1.value.length; i++) {
        rows1.value[i]['fieldStatus'] = val;
        for (let j = 0; j < rows.length; j++) {
            if (rows[j].table == rows1.value[i].table && rows[j].field == rows1.value[i].field) {
                rows[j]['fieldStatus'] = val;
                break;
            }
        }
    }
    update_data();
};
//数据验证改变时
const data_check_select = (val) => {
    for (let i = 0; i < rows1.value.length; i++) {
        rows1.value[i]['check'] = val;
        for (let j = 0; j < rows.length; j++) {
            if (rows[j].table == rows1.value[i].table && rows[j].field == rows1.value[i].field) {
                rows[j]['check'] = val;
                break;
            }
        }
    }
    update_data();
};
//更新数据设置到json
const update_data = (record) => {
    let dataRows = [];
    for (let i = 0; i < rows.length; i++) {
        if (utils.isDef(record)) {
            if (rows[i].table == record.table && rows[i].field == record.field) {
                rows[i].fieldStatus = record.fieldStatus;
                rows[i].check = record.check;
            }
        }
        let field = rows[i].type == 'subtable' ? rows[i].table + '.' + rows[i].field : rows[i].field;
        dataRows.push({ field: field.toLowerCase(), status: rows[i].fieldStatus, check: rows[i].check })
    }
    stepJson.value.fieldStatus = dataRows;
};

//事件==================================
const eventJson = ref({});

//子流程================================
const subFlow = ref({});

</script>