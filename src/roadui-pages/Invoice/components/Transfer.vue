<template>
    <div class="transfer">
        <!-- 左侧框 -->
        <div class="left-box card-box">
            <div class="box-top">
                <!-- 下拉菜单，包含全选所有、全选当页、反选当页选项 -->
                <el-dropdown placement="bottom-start">
                    <span class="el-dropdown-link">
                        <el-icon>
                            <ArrowDown />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="chooseAll('left')">全选所有</el-dropdown-item>
                            <el-dropdown-item @click="chooseCurrentAll('left')">全选当页</el-dropdown-item>
                            <el-dropdown-item @click="chooseReverse('left')">反选当页</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <!-- 显示选中数量和总数量 -->
                <span class="total-tip">{{ `${leftCheckList.length}/${leftTotal}` }}</span>
                <!-- 显示标题 -->
                <span class="title-tip">{{ titles[0] }}</span>
            </div>
            <div class="box-content">
                <!-- 搜索框 -->
                <div class="search-margin">
                    <el-input :placeholder="filterPlaceholder" prefix-icon="el-icon-search" size="small"
                        v-model="leftSearch" clearable @input="searchClick($event, 'left')"></el-input>
                </div>
                <!-- 复选框组 -->
                <div class="checkbox-group">
                    <el-checkbox-group v-model="leftCheckKeys">
                        <el-checkbox class="wrap-text" v-for="item in leftTransferDataList"
                            @change="handleCheck($event, item, 'left')" :key="item.value" :label="item.label"></el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <!-- 分页组件 -->
            <div class="box-bottom">
                <el-pagination small slot="left-footer" @current-change="handleCurrentChange($event, 'left')"
                    :current-page="leftPageOption.currentPage" :page-size="leftPageOption.pageSize"
                    layout="prev, pager, next, jumper" :total="leftPageOption.total"></el-pagination>
            </div>
        </div>
        <!-- 中间的操作按钮 -->
        <div class="buttons-box">
            <el-button type="primary" @click="Savecolum()">保存</el-button>
            <el-button type="primary" :disabled="leftCheckList.length < 1" @click="transferData('toRight')">显示</el-button>
            <el-button type="primary" :disabled="rightCheckList.length < 1" @click="transferData('toLeft')">隐藏</el-button>
        </div>
        <!-- 右侧框，结构与左侧框类似 -->
        <div class="right-box card-box">
            <div class="box-top">
                <el-dropdown placement="bottom-start">
                    <span class="el-dropdown-link">
                        <el-icon>
                            <ArrowDown />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click.native="chooseAll('right')">全选所有</el-dropdown-item>
                            <el-dropdown-item @click.native="chooseCurrentAll('right')">全选当页</el-dropdown-item>
                            <el-dropdown-item @click.native="chooseReverse('right')">反选当页</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <span class="total-tip">{{ `${rightCheckList.length}/${rightTotal}` }}</span>
                <span class="title-tip">{{ titles[1] }}</span>
            </div>
            <div class="box-content">
                <div class="search-margin">
                    <el-input :placeholder="filterPlaceholder" prefix-icon="el-icon-search" size="small"
                        v-model="rightSearch" clearable @input="searchClick($event, 'right')"></el-input>
                </div>
                <div class="checkbox-group">
                    <el-checkbox-group v-model="rightCheckKeys">
                        <el-checkbox class="wrap-text" v-for="item in rightTransferDataList" :key="item.value"
                            :label="item.label" @change="handleCheck($event, item, 'right')"></el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <div class="box-bottom">
                <el-pagination small slot="right-footer" @current-change="handleCurrentChange($event, 'right')"
                    :current-page="rightPageOption.currentPage" :page-size="rightPageOption.pageSize"
                    layout="prev, pager, next, jumper" :total="rightPageOption.total"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, inject, onMounted, shallowRef, provide, reactive, nextTick, watch, defineAsyncComponent } from 'vue'
import { View, Edit, Search, Plus, Refresh, Tools, ArrowDown } from '@element-plus/icons-vue'
// const Save = inject('Savecolum');
export default {
    name: "transferPage",
    inject: ['Savecolum'],
    props: {
        titles: {
            type: Array,
            default: () => ["待选列表", "已选列表"],
        },
        filterPlaceholder: {
            type: String,
            default: '请输入内容',
        },
        // 可筛选
        filterable: {
            type: Boolean,
            default: false,
        },
        // 左侧数据
        leftTransferData: {
            type: Array,
            default: () => []
        },
        // 右侧数据
        rightTransferData: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            leftOriginDataList: [], // 源数据(未经过搜索过滤)
            leftAllDataList: [], // 分页前的数据
            leftTransferDataList: [], // 左侧展示列表（当前页）
            leftCheckKeys: [], // 左侧被选中数据的label
            leftCheckList: [], // 左侧被选中的数据列表
            leftSearch: '', // 左侧搜索数据
            leftPageOption: {
                currentPage: 1, //当前页
                pageSize: 10, //默认的每页显示条数
                total: 0 //总条目数
            },

            rightOriginDataList: [], // 源数据
            rightAllDataList: [], // 分页前的数据
            rightTransferDataList: [],
            rightCheckKeys: [],
            rightCheckList: [],
            rightSearch: '',
            rightPageOption: {
                currentPage: 1, //当前页
                pageSize: 10, //默认的每页显示条数
                total: 0 //总条目数
            },
            search: {
                code: "",
                name: "",
            }, //存储搜索框中填入的内
            stashSearch: {
                code: "",
                name: "",
            }, //暂存的搜索列表

        }
    },
    created() {
    },
    computed: {
        leftTotal() {
            return this.leftOriginDataList.length
        },
        rightTotal() {
            return this.rightOriginDataList.length
        },
    },
    watch: {
        // 源数据改变
        leftTransferData: {
            handler() {
                this.leftOriginDataList = JSON.parse(JSON.stringify(this.leftTransferData))
                this.rightOriginDataList = JSON.parse(JSON.stringify(this.rightTransferData))
                this.leftAllDataList = JSON.parse(JSON.stringify(this.leftTransferData))
                this.rightAllDataList = JSON.parse(JSON.stringify(this.rightTransferData))
                this.init()
            },
            deep: true,
            immediate: true,
        },
        // 源数据改变,重新分页
        rightOriginDataList: {
            handler() {
                this.$emit('transferChange', this.rightOriginDataList)
            },
            deep: true,
        },
    },
    methods: {
        init() {
            this.leftOriginDataList = JSON.parse(JSON.stringify(this.leftTransferData))
            this.rightOriginDataList = JSON.parse(JSON.stringify(this.rightTransferData))
            this.leftAllDataList = JSON.parse(JSON.stringify(this.leftTransferData))
            this.rightAllDataList = JSON.parse(JSON.stringify(this.rightTransferData))
            this.handleDataChange()
        },
        // 全选所有
        chooseAll(type) {
            this[`${type}CheckList`] = this[`${type}AllDataList`]
            this[`${type}CheckKeys`] = this[`${type}AllDataList`].map(item => item.label)
        },
        // 全选当页
        chooseCurrentAll(type) {
            this[`${type}CheckList`] = this[`${type}TransferDataList`]
            this[`${type}CheckKeys`] = this[`${type}TransferDataList`].map(item => item.label)
            this.$forceUpdate()
        },
        // 反选当页
        chooseReverse(type) {
            let currentCheck = this[`${type}CheckKeys`]
            this[`${type}CheckList`] = this[`${type}TransferDataList`].filter(item => !currentCheck.includes(item.label)
            )
            this[`${type}CheckKeys`] = this[`${type}CheckList`].map(item => item.label)
        },
        // 选中回调
        handleCheck(event, data, type) {
            if (event) {
                // 如果是选中
                this[`${type}CheckList`].push(data)
            } else {
                // 如果是取消
                this[`${type}CheckList`].splice(this[`${type}CheckList`].map(item => item.label).indexOf(data.label), 1)
            }
        },
        transferData(type) {
            // 定义变量用于存储要操作的列表和键
            let checkList, checkKeys;

            // 如果操作类型是'toLeft'
            if (type == 'toLeft') {
                // 获取右侧选中的列表和键
                checkList = this.rightCheckList;
                checkKeys = this.rightCheckKeys;

                // 遍历选中的列表，将每个项目的'isvisible'属性取反
                checkList.forEach(item => item.isvisible = !item.isvisible);

                // 将选中的项目添加到左侧的原始数据列表的开头
                this.leftOriginDataList.unshift(...checkList);

                // 从右侧的原始数据列表中移除选中的项目
                this.rightOriginDataList = this.rightOriginDataList.filter(item => !checkKeys.includes(item.label));
            }
            // 如果操作类型是'toRight'
            else if (type == 'toRight') {
                // 获取左侧选中的列表和键
                checkList = this.leftCheckList;
                checkKeys = this.leftCheckKeys;

                // 遍历选中的列表，将每个项目的'isvisible'属性取反
                checkList.forEach(item => item.isvisible = !item.isvisible);

                // 将选中的项目添加到右侧的原始数据列表的开头
                this.rightOriginDataList.unshift(...checkList);

                // 从左侧的原始数据列表中移除选中的项目
                this.leftOriginDataList = this.leftOriginDataList.filter(item => !checkKeys.includes(item.label));
            }

            // 清空右侧的选中列表和键
            this.rightCheckList = [];
            this.rightCheckKeys = [];

            // 清空左侧的选中列表和键
            this.leftCheckList = [];
            this.leftCheckKeys = [];

            // 调用handleDataChange方法，处理数据变化
            this.handleDataChange();
        },
        // 数据穿梭后及数据初始化的数据处理
        handleDataChange() {
            // 1. origin源数据发生变化,根据搜索条件,让allDataList随之变化
            // 搜索过滤会做的事: 根据搜索框内容过滤源数据, 分页(此处多了一次无用的分页)
            this.searchFilter('left')
            this.searchFilter('right')
            // 2. 拿到正确的allDataList,处理分页数据:total,currentPage
            this.leftPageOption.total = this.leftAllDataList.length
            this.rightPageOption.total = this.rightAllDataList.length
            // 穿梭后,如果当前框内数据不足currentPage页,则后退一页
            if (this.leftPageOption.total !== 0 && this.leftPageOption.total <= ((this.leftPageOption.currentPage - 1) * this.leftPageOption.pageSize)) {
                this.leftPageOption.currentPage--
            }
            // 穿梭后,如果当前框内数据不足currentPage页,则后退一页
            if (this.rightPageOption.total !== 0 && this.rightPageOption.total <= ((this.rightPageOption.currentPage - 1) * this.rightPageOption.pageSize)) {
                this.rightPageOption.currentPage--
            }
            // 3. 分页,也就是拿到正确的TransferDataList
            this.leftTransferDataList = this.handleData(this.leftAllDataList, this.leftPageOption)
            this.rightTransferDataList = this.handleData(this.rightAllDataList, this.rightPageOption)
            // this.$forceUpdate()
        },
        //搜索功能 
        searchFilter(type) {
            this[`${type}Search`] = this[`${type}Search`] ? this[`${type}Search`].trim() : ""
            let filterList = []
            // 没有搜索内容时,让未分页的经过筛选数据等于源数据
            if (!this[`${type}Search`]) {
                filterList = JSON.parse(JSON.stringify(this[`${type}OriginDataList`]))
            } else {
                filterList = this[`${type}OriginDataList`].filter((item) =>
                    item.label?.includes(this[`${type}Search`])
                )
            }
            this[`${type}PageOption`].total = filterList.length
            this[`${type}AllDataList`] = filterList
            // 对过滤后的数据,分页
            this[`${type}TransferDataList`] = this.handleData(this[`${type}AllDataList`], this[`${type}PageOption`])
        },
        //搜索点击
        searchClick(value, type) {
            this[`${type}PageOption`].currentPage = 1
            this[`${type}Search`] = value
            this.searchFilter(type)
        },
        // 处理数据分页 allDataList-经过筛选的数据列表,pageOption-分页数据
        handleData(allDataList, pageOption) {
            let start = (pageOption.currentPage - 1) * pageOption.pageSize
            let end = (start + pageOption.pageSize)
            // >pageOption.total?pageOption.total:(start + pageOption.pageSize)
            let currentPageList = []
            currentPageList = allDataList.slice(start, end)
            return currentPageList
        },
        //跳页回调
        handleCurrentChange(val, type) {
            this[`${type}PageOption`].currentPage = val
            this[`${type}TransferDataList`] = this.handleData(this[`${type}AllDataList`], this[`${type}PageOption`])
        },
    }
}
</script>
<style lang="scss" scoped>
:deep(.el-dropdown-menu__item) {
    span {
        width: 100%;
        height: 100%;
    }
}

:deep(.el-pager li.active) {
    color: #004BAA;
}

:deep(.el-pager li:hover),
:deep(.el-pagination button:hover) {
    color: #407ecf;
}

:deep(.el-dropdown-menu__item:focus,
    .el-dropdown-menu__item:not(.is-disabled):hover) {
    background-color: #F5F7FA;
    color: #303133;
}

// 按钮禁用样式
:deep(button.el-button.el-button--primary.el-button--small.is-disabled) {
    background-color: #EFEFEF;
    border: 1px solid #CCC;
    color: #303133;
}

:deep(button.el-button.el-button--primary.el-button--small.is-disabled:hover) {
    background-color: #EFEFEF !important;
    border: 1px solid #CCC !important;
    color: #303133 !important;
}

.transfer {
    width: 100%;
    min-width: 680px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .card-box {
        width: 40%;
        min-width: 300px;
        border: 1px solid #EBEEF5;
        border-radius: 4px;
        overflow: hidden;
        background: #FFF;
    }

    .box-top {
        display: flex;
        align-items: center;
        height: 40px;
        line-height: 40px;
        padding: 8px 12px 9px;
        background: #F5F7FA;
        border-bottom: 1px solid #EBEEF5;

        .icon-margin {
            font-size: 16px;
        }

        .total-tip {
            padding: 0 5px;
        }

        .title-tip {
            font-size: 16px;
            color: #303133;
            font-weight: 400;
        }
    }

    .box-content {
        width: 100%;
        border-bottom: 1px solid #EBEEF5;

        .search-margin {
            margin: 15px;
        }

        .checkbox-group {
            padding: 0 15px;
            height: 300px;
            overflow-x: hidden;
            overflow-y: auto;

            :deep(.el-checkbox) {
                width: 100%;
                height: 30px;
                line-height: 30px;
                display: flex;
                align-items: center;
            }

            :deep(.el-checkbox__label) {
                width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    .box-bottom {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 40px;
        padding-right: 15px;
    }

    .buttons-box {
        width: 18%;
        min-width: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        button {
            margin: 0 0 15px 0;
        }
    }
}
</style>