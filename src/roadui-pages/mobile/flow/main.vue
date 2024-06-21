<style lang="scss" scoped>
.rf_user_body {
    padding: 0 0rpx 100rpx 0rpx;
}

.custom-title {
    margin-right: 60px;
    vertical-align: middle;
    font-weight: bolder;
    font-size: 16px;
}

.addtitle {
    text-align: center;
    color: #409eff;
    font-weight: normal;
    font-size: 16px;
    flex: 0.75;
    height: 25px;
    line-height: 25px;
    vertical-align: middle;
    cursor: pointer;
}

.subbtn {
    position: fixed;
    bottom: 0px;
    left: 0;
    width: 100vw;
    display: flex;
    flex-wrap: wrap;
    z-index: 999;
    // height: 30px;
}
</style>
<template>
    <div style="background-color: #f7f8fa">
        <van-nav-bar title="开票流程申请" left-text="返回" left-arrow @click-left="onClickright">
            <!-- <template #right>
                <van-icon name="wap-home-o" size="18" @click="onClickright" />
            </template> -->
        </van-nav-bar>
        <van-form ref="formref">
            <van-cell-group>
                <!-- <van-field v-model="formData.invoiceTypeName" label="发票类型" readonly /> -->
                <!-- 发票类型 -->
                <van-field v-model="formData.invoiceTypeName" is-link readonly name="picker" label="发票类型"
                    placeholder="选择发票类型" @click="invoiceTypeNameshow = true" required show-error show-error-message
                    :rules="rules" />
                <van-action-sheet v-model:show="invoiceTypeNameshow" :actions="invoicecolumns" description="发票类型"
                    @select="invoiceTypeNameConfirm" cancel-text="取消" @cancel="invoiceTypeNameshow = false" />

                <!-- 特定业务类型 -->
                <van-field v-model="formData.invoiceSpecialMarkName" is-link readonly name="picker" label="特定业务"
                    placeholder="选择特定业务类型" @click="Specialshow = true" />
                <van-popup v-model:show="Specialshow" position="bottom">
                    <!-- 增加搜索框 -->
                    <van-search v-model.trim="keyvalue" placeholder="特定业务搜索" @update:model-value="Specialsearch" />
                    <van-picker :columns="filterdepartments" @confirm="SpecialConfirm" @cancel="Specialshow = false" />
                </van-popup>

                <!-- 差额征税类型 -->
                <van-field v-model="formData.taxation" is-link readonly name="picker" label="差额征税" placeholder="选择差额征税类型"
                    @click="taxationshow = true" />
                <van-action-sheet v-model:show="taxationshow" :actions="taxationcolumns" description="差额征税类型"
                    @select="taxationConfirm" cancel-text="取消" @cancel="taxationshow = false" />

                <!-- 减按征税类型 -->
                <van-field v-model="formData.JAZS" is-link readonly name="picker" label="减按征税" placeholder="选择减按征税类型"
                    @click="JAZSshow = true" />
                <van-action-sheet v-model:show="JAZSshow" :actions="JAZScolumns" description="差额征税类型"
                    @select="JAZSshowConfirm" cancel-text="取消" @cancel="JAZSshow = false" />

                <van-field v-model="formData.serialNo" label="流水号" readonly />
                <van-field v-model="formData.sellerName" label="销方名称" readonly />
                <van-field v-model="formData.sellerTaxNo" label="税号" readonly />

                <van-field v-model="formData.buyerName" is-link readonly name="picker" label="购方名称" placeholder="请选择购方名称"
                    @click="buyerNameshow = true" required show-error show-error-message :rules="[
                        {
                            required: true,
                            message: '购方名称不能为空',
                            trigger: 'onChange',
                        },
                    ]" />
                <van-popup v-model:show="buyerNameshow" position="bottom">
                    <!-- 增加搜索框 -->
                    <van-search v-model.trim="buyerNamevalue" placeholder="购方名称" @update:model-value="buyerNamesearch" />
                    <van-picker :columns="filterbuyerName" @confirm="buyerNameConfirm" @cancel="buyerNameshow = false" />
                </van-popup>

                <van-field v-model="formData.buyerTaxNo" label="购方税号" required show-error show-error-message
                    :rules="[[{ required: true, message: '购方税号' }]]" />
                <van-field v-model="formData.buyerEmail" label="邮箱" />
                <van-field v-model="formData.invoiceTotalPriceTax" label="价税合计" readonly />
                <van-field v-model="formData.remarks" rows="1" autosize label="备注" type="textarea" placeholder="" />
            </van-cell-group>
        </van-form>
        <!-- <van-cell is-link> -->
        <van-cell>
            <template #title>
                <span class="custom-title">商品明细</span>
                <div style="display: inline-flex; cursor: pointer" @click="Addline" v-if="detailData.length == 0">
                    <div style="display: inline-block">
                        <van-icon name="plus" color="#409EFF" />
                    </div>
                    <span style="color: #409eff; vertical-align: middle">点击增加明细行</span>
                </div>
            </template>
            <template #right-icon> </template>
        </van-cell>
        <view v-for="(items, indexs) in detailData" :key="indexs" style="border-radius: 5px; width: 100%">
            <view style="min-height: 400rpx; padding-right: 10px; width: 100%">
                <view
                    style="background-color: #f8f8f8;width: 100%;display: flex;align-items: center;justify-content: space-between;">
                    <span style="padding: 5px; font-size: 12px">商品明细{{ indexs + 1 }}</span>
                    <view style="width: 50px; padding-left: 5px">
                        <!-- <van-button plain hairline  type="danger" size="mini" iconColor="#ffffff"
                            text=""></van-button> -->
                        <el-popconfirm :title="'确定要删除商品明细' + (indexs + 1) + '吗？'" @confirm="Deleteline(indexs)">
                            <template #reference>
                                <el-button type="danger" size="small" link>删除 </el-button>
                            </template>
                        </el-popconfirm>
                    </view>
                </view>
                <view style="background-color: #ffffff; margin-top: 5px">
                    <van-form ref="detailRef">
                        <van-cell-group>
                            <van-field v-model="detailData[indexs].goodsName" is-link readonly name="picker" label="商品名称"
                                placeholder="请选择商品名称" @click="goodsNameshow = true" :rules="[
                                    {
                                        required: true,
                                        message: '商品名称不能为空',
                                        trigger: 'onChange',
                                    },
                                ]" />
                            <van-popup v-model:show="goodsNameshow" position="bottom">
                                <!-- 增加搜索框 -->
                                <van-search v-model.trim="goodsNamevalue" placeholder="购方名称"
                                    @update:model-value="goodsNamesearch" />
                                <van-picker :columns="filtergoodsName" ref="pickerref" @confirm="goodsNameConfirm"
                                    @change="goodsNameChange(indexs)" @cancel="goodsNameshow = false" />
                            </van-popup>

                            <van-field v-model.trim="detailData[indexs].goodsQuantity" @change="Calculate" type="number"
                                label="数量" />
                            <van-field v-model.trim="detailData[indexs].goodsPrice" @change="Calculate" type="number"
                                label="单价" />
                            <van-field v-model.trim="detailData[indexs].goodsTotalPrice" @change="Calculate" label="价税合计"
                                readonly />
                        </van-cell-group>
                    </van-form>
                </view>
            </view>
        </view>
        <div v-if="detailData.length > 0" style="display: flex;
        line-height: 10px;
        margin-top: -10px;
        margin-bottom: 50px;">
            <view style="background-color: #f8f8f8; font-size: 12px">
                <span>价税合计(元)：{{ formData.invoiceTotalPriceTax }}</span>
            </view>
            <view @click="Addline" class="addtitle">
                <van-icon name="plus" color="#409EFF" size="16" />
                增加商品明细
                <!-- <div style="display: inline-block;">
                    <van-icon name="plus" color="#409EFF" />
                </div>
                <span style="color: #409EFF;vertical-align: middle;font-weight: normal;">增加明细行</span> -->
            </view>
        </div>
        <view class="subbtn">
            <van-button type="primary" v-show="jumpId == 0" style="border-radius: 0; width: 100vw"
                @click="submit">保存</van-button>
            <van-button type="primary" v-show="jumpId != 0" style="border-radius: 0; width: 61.8vw"
                @click="submit">保存</van-button>
            <van-button type="danger" v-show="jumpId != 0" style="border-radius: 0; width: 38.2vw" @click="">删除</van-button>

        </view>
    </div>
</template>

<script setup>
import { ref, inject, onMounted, getCurrentInstance } from "vue";
// import { NavBar, Form, Field, CellGroup, Picker, Button } from 'vant';
const { proxy } = getCurrentInstance(); //全局变量
const indexm_openurl = inject("indexm_openurl");
const indexm_backpage = inject("indexm_backpage");
const indexm_refreshpage = inject("indexm_refreshpage");
const userinfo = inject("indexm_userinfo");
const sobInfo = ref("");
if (localStorage.getItem("sobInfo") != "") {
    sobInfo.value = JSON.parse(localStorage.getItem("sobInfo"));
}
const ajax = inject("ajax");
const utils = inject("utils");
const config = inject("config");
const qs = inject("qs");
const app = inject("app");
const props = defineProps({
    query: {
        type: String,
        default: () => {
            return "";
        },
    },
});

const queryString = utils.getQuery(props.query); //获取url参数
// const type = ref(utils.query("type", props.query));
// const code = ref(utils.query("code", props.query));
// const taxation = ref(utils.query("taxation", props.query));
// const invoiceSpecialMark = ref(utils.query("invoiceSpecialMark", props.query));
// const invoiceSpecialMarkName = ref(
//     utils.query("invoiceSpecialMarkName", props.query),
// );
const JAZS = ref(utils.query("JAZS", props.query));
const taxationshow = ref(false);//减按征税
const id = ref(0);
// const id = ref(utils.query("id", props.query));
const jumpId = ref(utils.query("id", props.query));
const buyerNameshow = ref(false); //购方名称
const goodsNameshow = ref(false); //商品名称
const invoiceTypeNameshow = ref(false); //发票类型
const Specialshow = ref(false);//特殊发票
const JAZSshow = ref(false);//减按征税
const keyvalue = ref('');//特定业务搜索
const buyerNamevalue = ref(""); //购方名称
const goodsNamevalue = ref(""); //商品名称
const filterdepartments = ref([]);//特定业务过滤
const filterbuyerName = ref([]); //购方名称筛选
const filtergoodsName = ref([]); //商品名称筛选
const buyeroptions = ref([]); //购方名称选项
const detailData = ref([]); // 明细表数据
const goodsoptions = ref([]); //商品选项
const addnewid = ref(""); //明细表id
const pickerref = ref(null); //弹窗
//  特定业务
const Specialcolumns = ref([]);
const formData = ref({
    invoiceTypeName: "", //发票类型名称
    serialNo: "", //发票流水号
    sellerName: "", //销方名称
    sellerTaxNo: "", //销方税号
    buyerName: "", //购方名称
    buyerTaxNo: "", //购方税号
    buyerEmail: "", //邮箱
    invoiceTotalPriceTax: "", //价税合计
    remarks: "", //备注
});
// 差额征税
const taxationcolumns = [
    { name: '差额征税-全额开票' },
    { name: '差额征税-差额开票' }
];
//  发票类型
const invoicecolumns = [
    { name: "全电专用发票", value: "01" },
    { name: "全电普通发票", value: "02" },
];
const JAZScolumns = [
    { name: "销售自己使用过的固定资产" },
    { name: "住房租赁" },
]
// 页面加载
onMounted(() => {
    getformdata(id.value, sobInfo.value);
    getProduct();
    getBuyer();
    getSpecial()
});
// 获取特定业务
function getSpecial() {
    ajax.post('/invoice_BaseInfo/GetAll', qs.stringify({ classtype: 'invoiceSpecial' })).then((res) => {
        if (res.success) {
            // 将res.data.main里面的code转换为value，name转换成text
            Specialcolumns.value = res.data.main
                .map((item) => {
                    return {
                        text: item.name,
                        value: item.code
                    };
                });
            filterdepartments.value = Specialcolumns.value
        } else {
            utils.msg(res.msg, 'warning', false);
        }
    }).catch((err) => {
    });
}
// 选择差额征税
const JAZSshowConfirm = (item) => {
    formData.value.JAZS = item.name;
    JAZSshow.value = false;
};
// 选择差额征税
const taxationConfirm = (item) => {
    formData.value.taxation = item.name;
    taxationshow.value = false;
};
function Specialsearch() {
    // 对过滤数组进行操作，返回符合条件的数组
    filterdepartments.value = Specialcolumns.value.filter((params) => {
        console.log(params.text.includes(keyvalue.value))
        return params.text.includes(keyvalue.value);
    });
}
// 选择发票类型
const invoiceTypeNameConfirm = (item) => {
    formData.value.invoiceTypeName = item.name;
    formData.value.invoiceTypeCode = item.value;
    invoiceTypeNameshow.value = false;
};
// 选择特定业务
const SpecialConfirm = ({ selectedOptions }) => {
    formData.value.invoiceSpecialMarkName = selectedOptions[0].text;
    formData.value.invoiceSpecialMark = selectedOptions[0].value;
    Specialshow.value = false;
};
// 购方名称
const buyerNameConfirm = ({ selectedOptions }) => {
    formData.value.buyerName = selectedOptions[0].text;
    buyerNameshow.value = false;
};
const goodnameindex = ref("");
// 商品名称
const goodsNameConfirm = ({ selectedOptions, selectedIndexes }) => {
    // console.log(selectedOptions)
    // console.log(selectedIndexes)
    detailData.value[goodnameindex.value].goodsName = selectedOptions[0].text;
    goodsNameshow.value = false;
};
const goodsNameChange = (index) => {
    goodnameindex.value = index;
};
// 获取表单数据
const getProduct = () => {
    ajax
        .post("/invoiceproduct/GetAll?srcorgid=" + sobInfo.value.id, {})
        .then((res) => {
            if (res.success) {
                goodsoptions.value = res.data.product.map((item) => {
                    return {
                        id: item.id,
                        value: item.goodsName,
                        label: item.goodsName,
                        text: item.goodsName,
                    };
                });
                filtergoodsName.value = goodsoptions.value;
            } else {
                utils.msg(res.msg, "warning", false);
            }
        })
        .catch((err) => { });
};
// 购方名称获取
const getBuyer = () => {
    ajax
        .post("/Customer/GetAllCustomer?srcorgid=" + sobInfo.value.id, {})
        .then((res) => {
            if (res.success) {
                // formData.value.invoiceTypeName = type.value
                // 将res.data.main里面的code转换为value，name转换成text
                buyeroptions.value = res.data.customer.map((item) => {
                    return {
                        value: item.buyerName,
                        label: item.buyerName,
                        text: item.buyerName,
                        buyerEmail: item.Email,
                        buyerTaxno: item.buyerTaxno,
                        buyerBankNumber: item.BankAccount,
                        buyerBankName: item.BankName,
                        buyerPhone: item.Phone,
                        buyerAddress: item.buyerAddress,
                    };
                });
                filterbuyerName.value = buyeroptions.value;
            } else {
                utils.msg(res.msg, "warning", false);
            }
        })
        .catch((err) => { });
};
function buyerNamesearch() {
    // 对过滤数组进行操作，返回符合条件的数组
    filterbuyerName.value = buyeroptions.value.filter((params) => {
        return params.text.includes(buyerNamevalue.value);
    });
}
function goodsNamesearch() {
    // 对过滤数组进行操作，返回符合条件的数组
    filtergoodsName.value = goodsoptions.value.filter((params) => {
        return params.text.includes(goodsNamevalue.value);
    });
}
// 获取表单数据
const getformdata = (ids, sobInfo) => {
    ajax
        .post(
            "/Invoice/GetInvoiceApply?srcorgid=" + sobInfo.id,
            qs.stringify({
                id: ids,
                type: "手工开票",
                // invoiceTypeName: type.value,
                // invoiceTypeCode: code.value,
                // taxation: taxation.value,
                // invoiceSpecialMark: invoiceSpecialMark.value,
                // JAZS: JAZS.value,
                sellerName: sobInfo.accountname,
                sellerTaxNo: sobInfo.taxno,
                sellerAddress: sobInfo.address,
                sellerPhone: sobInfo.phone,
                sellerBankName: sobInfo.openbank,
                sellerBankNumber: sobInfo.bankaccount,
            }),
        )
        .then((res) => {
            if (res.success) {
                formData.value = res.data.invoicemain;
                id.value = res.data.invoicemain.id;
                detailData.value = res.data.invoicedetail;
                formData.value.sellerName = sobInfo.accountname;
                formData.value.sellerTaxNo = sobInfo.taxno;
            } else {
                utils.msg(res.msg, "warning", false);
            }
        })
        .catch((err) => { });
};
// 提交
const submit = () => { };

// 添加行
function Addline() {
    ajax.post("/Flow/GetLongId", {}).then((res) => {
        addnewid.value = res.data;
        const row = {
            goodsLineNo: detailData.value.length + 1, //序号
            id: addnewid.value,
            mainid: id.value,
            goodsCode: "", //商品编号
            goodsName: "", //商品名称
            goodsQuantity: "", //数量
            goodsTotalPrice: "", //价税合计
            goodsPrice: "", //单价
            goodsTaxRate: "", //税率
            notaxamount: "", //无税金额
            goodsTotalTax: "", //税额
        };
        detailData.value.push(row);
    });
}

// 删除行
function Deleteline(index) {
    detailData.value.splice(index, 1);
    for (let i = 0; i < detailData.value.length; i++) {
        detailData.value[i].goodsLineNo = i + 1;
    }
}

// 计算
function Calculate() {
    for (let item of detailData.value) {
        let quantity = Number(item.goodsQuantity);
        let price = Number(item.goodsPrice);
        if (quantity && price) {
            // 价税合计=单价*数量
            item.goodsTotalPrice = (quantity * price).toFixed(2);
            // 税额=价税合计*税率
            item.goodsTotalTax = (
                item.goodsTotalPrice * (1 + item.goodsTaxRate / 100) -
                item.goodsTotalPrice
            ).toFixed(2);
            // 无税金额=价税合计-税额
            item.notaxamount = (item.goodsTotalPrice - item.goodsTotalTax).toFixed(2);
        }
    }
    // 价税合计
    formData.value.invoiceTotalPriceTax = detailData.value
        .reduce((total, item) => {
            return total + Number(item.goodsTotalPrice);
        }, 0)
        .toFixed(2);
}
// 返回首页
const shortuct = {
    id: "index_home",
    url: "/mobile/home.vue",
    // id: "shortuct_localindex",
    // url: "/mobile/home.vue",
};
// 返回首页
function onClickright() {
    indexm_openurl(shortuct.id, shortuct.url);
}
// 存储数据
function savecontent() {
    localStorage.setItem('invoiceJSON', JSON.stringify(formData.value))
    localStorage.setItem('invoicedetailsJSON', JSON.stringify(detailData.value))
}
// // 返回上一级
// const indexshortuct = {
//     id: "index_localindex",
//     url:
//         "/mobile/flow/index.vue?type=" +
//         type.value +
//         "&code=" +
//         code.value +
//         "&taxation=" +
//         taxation.value +
//         "&invoiceSpecialMark=" +
//         invoiceSpecialMark.value +
//         "&invoiceSpecialMarkName=" +
//         invoiceSpecialMarkName.value +
//         "&JAZS=" +
//         JAZS.value +
//         "&id=0" +
//         "&classa=back",
// };
// // 返回上一级
// function onClickLeft() {
//     indexm_openurl(indexshortuct.id, indexshortuct.url);
// }
defineExpose({
    savecontent,
})
</script>
