<style lang="scss" scoped>
.rf_user_body {
    padding: 0 12px;
    width: 360px;
    margin: 150px auto;
}
</style>
<template>
    <div style="height:inherit;">
        <van-nav-bar title="发票信息" left-text="返回" left-arrow @click-left="onClickLeft" />
        <div class="rf_user_body">
            <van-form ref="formref">
                <van-cell-group inset>
                    <!-- 发票类型 -->
                    <van-field v-model="form.invoiceTypeName" is-link readonly name="picker" label="发票类型"
                        placeholder="选择发票类型" @click="invoiceTypeNameshow = true" required show-error show-error-message
                        :rules="rules" />
                    <van-action-sheet v-model:show="invoiceTypeNameshow" :actions="invoicecolumns" description="发票类型"
                        @select="invoiceTypeNameConfirm" cancel-text="取消" @cancel="invoiceTypeNameshow = false" />
                    <!-- <van-popup v-model:show="invoiceTypeNameshow" position="bottom">
                        <van-picker :columns="invoicecolumns" @confirm="invoiceTypeNameConfirm"
                            @cancel="invoiceTypeNameshow = false" />
                    </van-popup> -->


                    <!-- 特定业务类型 -->
                    <van-field v-model="form.invoiceSpecialMarkName" is-link readonly name="picker" label="特定业务"
                        placeholder="选择特定业务类型" @click="Specialshow = true" />
                    <van-popup v-model:show="Specialshow" position="bottom">
                        <!-- 增加搜索框 -->
                        <van-search v-model.trim="keyvalue" placeholder="特定业务搜索" @update:model-value="Specialsearch" />
                        <van-picker :columns="filterdepartments" @confirm="SpecialConfirm" @cancel="Specialshow = false" />
                    </van-popup>


                    <!-- 差额征税类型 -->
                    <van-field v-model="form.taxation" is-link readonly name="picker" label="差额征税" placeholder="选择差额征税类型"
                        @click="taxationshow = true" />
                    <van-action-sheet v-model:show="taxationshow" :actions="taxationcolumns" description="差额征税类型"
                        @select="taxationConfirm" cancel-text="取消" @cancel="taxationshow = false" />
                    <!-- <van-popup v-model:show="taxationshow" position="bottom">
                        <van-picker :columns="taxationcolumns" @confirm="taxationConfirm" @cancel="taxationshow = false" />
                    </van-popup> -->


                    <!-- 减按征税类型 -->
                    <van-field v-model="form.JAZS" is-link readonly name="picker" label="减按征税" placeholder="选择减按征税类型"
                        @click="JAZSshow = true" />
                    <van-action-sheet v-model:show="JAZSshow" :actions="JAZScolumns" description="差额征税类型"
                        @select="JAZSshowConfirm" cancel-text="取消" @cancel="JAZSshow = false" />
                    <!-- <van-popup v-model:show="JAZSshow" position="bottom">
                        <van-picker :columns="JAZScolumns" @confirm="JAZSshowConfirm" @cancel="JAZSshow = false" />
                    </van-popup> -->
                </van-cell-group>

                <div style="margin: 16px;">
                    <van-button block type="primary" size="small" @click="onSubmit">
                        提交
                    </van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>

<script setup >
import { ref, inject, onMounted, getCurrentInstance } from 'vue';
// import { NavBar, Form, Field, CellGroup, Picker, Button } from 'vant';
const { proxy } = getCurrentInstance();//全局变量
const ajax = inject('ajax');
const utils = inject('utils');
const config = inject('config');
const qs = inject('qs');
const app = inject('app');
const indexm_openurl = inject('indexm_openurl');
const indexm_backpage = inject('indexm_backpage');
const indexm_refreshpage = inject('indexm_refreshpage');
const userinfo = inject('indexm_userinfo');
const invoiceTypeNameshow = ref(false);//发票类型
const taxationshow = ref(false);//减按征税
const Specialshow = ref(false);//特定业务
const JAZSshow = ref(false);//减按征税
const keyvalue = ref('');//特定业务搜索
const filterdepartments = ref([]);//特定业务过滤
const props = defineProps({ query: { type: String, default: () => { return ''; } } });
const queryString = utils.getQuery(props.query);//获取url参数
const classa = utils.query('classa', props.query);
const formref = ref()
const rules = [{
    required: true,
    message: '发票类型不能为空',
    trigger: 'onChange'
}]
const form = ref({
    invoiceTypeName: '',//发票类型
    invoiceTypeCode: '',//发票类型编码
    taxation: '',//差额征税
    invoiceSpecialMark: '',//特定业务编码
    invoiceSpecialMarkName: '',//特定业务
    JAZS: '',//减按征税
});
//  发票类型
const invoicecolumns = [
    { name: '全电专用发票', value: '01' },
    { name: '全电普通发票', value: '02' },
];
// const invoicecolumns = [
//     { text: '全电专用发票', value: '01' },
//     { text: '全电普通发票', value: '02' },
// ];
//  特定业务
const Specialcolumns = ref([]);
// 差额征税
const taxationcolumns = [
    { name: '差额征税-全额开票' },
    { name: '差额征税-差额开票' }
];
const JAZScolumns = [
    { name: "销售自己使用过的固定资产" },
    { name: "住房租赁" },
]
// 页面加载
onMounted(() => {
    getSpecial()
    if (classa == 'back') {
        form.value.JAZS = utils.query('JAZS', props.query)//减按征税
        form.value.taxation = utils.query('taxation', props.query)//差额征税
        form.value.invoiceTypeName = utils.query('type', props.query)
        form.value.invoiceTypeCode = utils.query('code', props.query)
        form.value.invoiceSpecialMark = utils.query('invoiceSpecialMark', props.query)
        form.value.invoiceSpecialMarkName = utils.query('invoiceSpecialMarkName', props.query)
    }
});




// 选择发票类型
const invoiceTypeNameConfirm = (item) => {
    form.value.invoiceTypeName = item.name;
    form.value.invoiceTypeCode = item.value;
    invoiceTypeNameshow.value = false;
};
// const invoiceTypeNameConfirm = ({ selectedOptions }) => {
//     form.value.invoiceTypeName = selectedOptions[0].text;
//     form.value.invoiceTypeCode = selectedOptions[0].value;
//     invoiceTypeNameshow.value = false;
// };

// 选择特定业务
const SpecialConfirm = ({ selectedOptions }) => {
    form.value.invoiceSpecialMarkName = selectedOptions[0].text;
    form.value.invoiceSpecialMark = selectedOptions[0].value;
    Specialshow.value = false;
};

// 选择差额征税
const taxationConfirm = (item) => {
    form.value.taxation = item.name;
    taxationshow.value = false;
};
// const taxationConfirm = ({ selectedOptions }) => {
//     form.value.taxation = selectedOptions[0].text;
//     taxationshow.value = false;
// };
// 选择差额征税
const JAZSshowConfirm = (item) => {
    form.value.JAZS = item.name;
    JAZSshow.value = false;
};
// const JAZSshowConfirm = ({ selectedOptions }) => {
//     form.value.JAZS = selectedOptions[0].text;
//     JAZSshow.value = false;
// };

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
function Specialsearch() {
    // 对过滤数组进行操作，返回符合条件的数组
    filterdepartments.value = Specialcolumns.value.filter((params) => {
        console.log(params.text.includes(keyvalue.value))
        return params.text.includes(keyvalue.value);
    });
}
// 提交
const onSubmit = (values) => {
    proxy.$refs.formref.validate().then((result) => {
        let mainpage = {
            id: 'mainpage_localindex',
            url: "/mobile/flow/main.vue?type=" + form.value.invoiceTypeName + "&code=" + form.value.invoiceTypeCode + "&taxation=" + form.value.taxation + "&invoiceSpecialMark=" + form.value.invoiceSpecialMark + "&JAZS=" + form.value.JAZS + "&invoiceSpecialMarkName=" + form.value.invoiceSpecialMarkName + "&id=0"
        }
        indexm_openurl(mainpage.id, mainpage.url);
    }).catch((err) => {
    });
};





// 返回
const shortuct = {
    id: 'shortuct_localindex',
    url: '/mobile/home.vue'
}
// 返回
function onClickLeft() {
    indexm_openurl(shortuct.id, shortuct.url);
}


</script>

