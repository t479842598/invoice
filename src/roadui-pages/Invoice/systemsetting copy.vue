<template>
    <!-- 系统设置 -->
    <div class="system-setting">
        <el-card class="box-card card" shadow="never">
            <el-form-item>
                <el-button type="primary" style="width: 100px;" @click="save">保存</el-button>
            </el-form-item>
            <div style="display: flex;width: 82vw;align-items:stretch;">
                <!-- 单位信息 -->
                <div style="display: block;border: 1px solid #eee;padding: 0 10px;flex-grow:1;">
                    <h3 class="before">单位信息</h3>
                    <el-form ref="topform" style="margin-top: 20px;" :model="formData">
                        <el-form-item label="单位编号">
                            <el-input style="width: 80%;" v-model="formData.departcode"></el-input>
                        </el-form-item>
                        <el-form-item label="单位名称">
                            <el-input style="width: 80%;" v-model="formData.departname"></el-input>
                        </el-form-item>
                    </el-form>
                    <div style="margin-top: 20px;">
                        <div>
                            <h3 class="before">系统设置</h3>
                            <div style="width: 100%;text-align: center;">
                                <el-form ref="topform" :model="formData">
                                    <el-form-item label="系统名称">
                                        <el-input style="width: 80%;" v-model="formData.systemname"></el-input>
                                    </el-form-item>
                                </el-form>
                                <table cellpadding="0" cellspacing="0" border="0" style="width:40%;">
                                    <tr>
                                        <td>
                                            <div style="padding-left: 50px;">
                                                <el-upload :action="config.SERVER_WEBADDRESS + '/Files/SaveFiles'"
                                                    :show-file-list="false" with-credentials
                                                    accept=".jpg,.jpeg,.png,.gif"
                                                    :data="{ filetype: '.jpg,.jpeg,.png,.gif', uploadtype: 4 }"
                                                    :on-success="handleAvatarSuccess"
                                                    :before-upload="beforeAvatarUpload">
                                                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                                                    <el-icon v-else class="avatar-uploader-icon">
                                                        <Plus />
                                                    </el-icon>
                                                </el-upload>
                                                <div
                                                    style="width:210px;height:178px;margin-left: 5px;text-align: center;">
                                                    <vueCropper ref="cropper" :img="option.img"
                                                        :autoCrop="option.autoCrop"
                                                        :autoCropWidth="option.autoCropWidth"
                                                        :autoCropHeight="option.autoCropHeight"
                                                        :centerBox="option.centerBox" :outputType="option.outputType">
                                                    </vueCropper>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top:5px;">
                                            <div style="display: block;text-align: center;">
                                                <el-button style="width: 100px;" type="primary" :disabled="saveDisabled"
                                                    @click="saveImg()">保存LOGO</el-button>
                                                <el-button style="width: 100px;" type="primary" :disabled="saveDisabled"
                                                    @click="reset()">恢复默认</el-button>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <div style="margin-left: 1%;">
                            <h3 class="before">邮件模板设置</h3>
                            <el-form ref="topform" :model="formData">
                                <el-form-item label="邮件标题">
                                    <el-input style="width: 80%;" v-model="formData.emailtitle"></el-input>
                                </el-form-item>
                                <el-form-item label="底部内容">
                                    <el-input type="textarea" :rows="6" style="width: 80%;"
                                        v-model="formData.emailtext">
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
                <!-- 导入发票设置 -->
                <div class="cardsetting" style="display: block;border: 1px solid #eee;padding-left:10px;flex-grow:1;">
                    <div class="box-card1">
                        <div>
                            <h3 class="before">导入发票设置</h3>
                            <el-row>
                                <el-col>
                                    <el-form :model="formData" inline>
                                        <el-checkbox v-model="formData.不排除负数量项目"
                                            label="不排除负数量项目">不排除负数量项目</el-checkbox><br>
                                        <el-checkbox v-model="formData.自动截取超长字段"
                                            label="自动截取超长字段">自动截取超长字段</el-checkbox><br>
                                        <el-checkbox v-model="formData.赠品方式折扣" label="导入折扣">赠品方式折扣</el-checkbox><br>
                                        <el-checkbox v-model="formData.导入折扣" label="导入折扣">导入折扣</el-checkbox><br>
                                        <div>
                                            <el-checkbox v-model="formData.按比例折扣" label="按比例折扣">按比例折扣</el-checkbox>
                                            <el-input-number v-model="formData.折扣比例" :min="0" :max="100"
                                                :controls="false" size="small" style="width: 50px;margin-top: -10px;" />
                                        </div>
                                        <el-checkbox v-model="formData.允许多行折扣" style="margin-left: 22px;"
                                            label="允许多行折扣">允许多行折扣</el-checkbox><br>
                                        <el-checkbox v-model="formData.不显示确认开票对话框"
                                            label="不显示确认开票对话框">不显示确认开票对话框</el-checkbox><br>
                                    </el-form>
                                </el-col>
                            </el-row>
                        </div>
                        <!-- 利用开票系统客户数据 -->
                        <div>
                            <h3 class="before">发票明细合并规则</h3>
                            <el-row>
                                <el-col>
                                    <el-form :model="formData" inline>
                                        <el-checkbox v-model="formData.不合并" label="不合并">不合并</el-checkbox><br>
                                        <el-checkbox v-model="formData.存货单价税率相同者合并"
                                            label="存货单价税率相同者合并">存货单价税率相同者合并</el-checkbox><br>
                                        <el-checkbox v-model="formData.存货税率相同者合并"
                                            label="存货税率相同者合并">存货税率相同者合并</el-checkbox><br>
                                        <el-checkbox v-model="formData.存货相同者合并"
                                            label="存货相同者合并">存货相同者合并</el-checkbox><br>
                                    </el-form>
                                </el-col>
                            </el-row>
                        </div>
                        <div>
                            <h3 class="before">发票明细合并方式</h3>
                            <el-row>
                                <el-col>
                                    <el-form :model="formData" inline>
                                        <el-checkbox v-model="formData.按价税合计合并"
                                            label="按价税合计合并">按价税合计合并（调整金额税额）</el-checkbox><br>
                                        <el-checkbox v-model="formData.按金额合并"
                                            label="按金额合并">按金额合并（调整税额价税合计）</el-checkbox><br>
                                        <el-checkbox v-model="formData.推送客户邮箱" label="推送客户邮箱">推送客户邮箱</el-checkbox><br>
                                        <el-checkbox v-model="formData.是否抄送公司邮箱"
                                            label="是否抄送公司邮箱">是否抄送公司邮箱</el-checkbox><br>
                                    </el-form>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
                <!-- 优惠政策设置 -->
                <div style="display: block;flex-grow:1;border: 1px solid #eee;">
                    <h3 class="before">优惠政策设置</h3>
                    <el-form :model="formData" style="margin-top: 20px;padding: 0 10px;">
                        <el-form-item label="优惠政策类型">
                            <el-select v-model="formData.vatSpecialManagement" style="width: 80%;"
                                placeholder="请选择优惠政策类型">
                                <el-option label="不征税" value="不征税" />
                                <el-option label="免税" value="免税" />
                                <el-option label="先征后退" value="先征后退" />
                                <el-option label="100%先征后退" value="100%先征后退" />
                                <el-option label="50%先征后退" value="50%先征后退" />
                                <el-option label="简易征收" value="简易征收" />
                                <el-option label="即征即退30%" value="即征即退30%" />
                                <el-option label="即征即退50%" value="即征即退50%" />
                                <el-option label="即征即退70%" value="即征即退70%" />
                                <el-option label="即征即退100%" value="即征即退100%" />
                                <el-option label="超税负3%即征即退" value="超税负3%即征即退" />
                                <el-option label="超税负6%即征即退" value="超税负6%即征即退" />
                                <el-option label="超税负8%即征即退" value="超税负8%即征即退" />
                                <el-option label="超税负12%即征即退" value="超税负12%即征即退" />
                                <el-option label="稀土产品" value="稀土产品" />
                                <el-option label="按5%简易征收减按1.5%计征" value="按5%简易征收减按1.5%计征" />
                                <el-option label="按5%简易征收" value="按5%简易征收" />
                                <el-option label="按3%简易征收" value="按3%简易征收" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="优惠政策税率">
                            <el-select v-model="formData.taxrate" style="width: 80%;" placeholder="请选择优惠政策税率">
                                <el-option label="无" value="无" />
                                <el-option label="0" value="0" />
                                <el-option label="1%" value="0.01" />
                                <el-option label="3%" value="0.03" />
                                <el-option label="6%" value="0.06" />
                                <el-option label="9%" value="0.09" />
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <h3 class="before">发票类型显示设置</h3>
                    <el-form :model="formData" style="margin-top: 20px;padding: 0 10px;">
                        <el-form-item>
                            <el-checkbox v-model="formData.是否默认选中购买方" label="是否默认选中购买方">是否默认选中购买方</el-checkbox>
                            <el-checkbox v-model="formData.是否默认选中销售方" label="自动截取超长字段">是否默认选中销售方</el-checkbox>
                        </el-form-item>
                        <el-form-item label="默认发票类型">
                            <el-select v-model="formData.默认发票类型" style="width: 80%;" placeholder="默认发票类型">
                                <el-option label="全电专用发票" value="01" />
                                <el-option label="全电普通发票" value="02" />
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
import { View, Edit, Search, Plus, Refresh, Tools } from '@element-plus/icons-vue'
import 'vue-cropper/dist/index.css';
const ajax = inject('ajax');
const utils = inject('utils');
const sobInfo = ref('')//账套信息
if (localStorage.getItem('sobInfo') != '') {
    sobInfo.value = JSON.parse(localStorage.getItem('sobInfo'));
}
const qs = inject('qs');
const config = inject('config');
const index_userinfo = inject('index_userinfo');//首页用户信息
const cropper = ref(null);
const saveDisabled = ref(false);
const option = ref({ img: '', outputType: 'png', autoCrop: true, autoCropWidth: 200, autoCropHeight: 200, centerBox: true });
const ElSelectflow = inject('ElSelectflow');
const index_openmenu = inject('index_openmenu');//首页打开菜单
const index_removetab = inject('index_removetab');//首页关闭标签方法
const index_refreshtab = inject('index_refreshtab');//首页刷新标签方式
const defaultOrder = ref({ prop: 'taxUnit', order: 'descending' });
const pager = ref(utils.getPager(defaultOrder.value));
const props = defineProps({ query: { type: String, default: () => { return ''; } } });
const loading = ref(false);//加载
const id = ref('');//ids

// 表单信息
const formData = ref({
    departcode: '',//单位编号
    departname: '',//单位名称
    systemid: '',//系统id
    systemname: '',//系统名称
    emailtitle: '',//邮件标题
    emailtext: '',//邮件内容
    vatSpecialManagement: '',//优惠政策类型
    taxrate: '无',//税率
    默认发票类型: '',
    不排除负数量项目: false,
    自动截取超长字段: false,
    导入折扣: false,
    赠品方式折扣: false,
    按比例折扣: false,
    折扣比例: 0,
    允许多行折扣: false,
    不显示确认开票对话框: false,
    明细合并时金额税额调整: false,
    按价税合计合并: false,
    按金额合并: false,
    推送客户邮箱: false,
    是否抄送公司邮箱: false,
    是否默认选中购买方: false,
    是否默认选中销售方: false,
})

// 初始化
onMounted(() => {
    option.value.img = index_userinfo.value.headerImg;
    getData();
});

//获取数据
const getData = async () => {
    loading.value = true;
    try {
        const res = await ajax.post('/Systemset/Get?srcorgid=' + sobInfo.value.id, {});
        loading.value = false;
        formData.value = res.data.invoicesystemset
    } catch (error) {
        loading.value = false;
    }
};

//保存
const save = async () => {
    try {
        const res = await ajax.post('/Systemset/Save?srcorgid=' + sobInfo.value.id, qs.stringify({ systemsetJSON: JSON.stringify(formData.value) }));
        utils.msg(res.success ? '保存成功！' : '保存失败！', res.success, false);
        index_refreshtab()
    } catch (error) {
        utils.msg('保存失败！', false, false);
    }
};


// 上传图片
// 定义一个函数，将图片转换为 Base64 格式
const getBase64 = (img, callback) => {
    // 创建一个新的 FileReader 对象
    const reader = new FileReader();
    // 当文件读取完成后，调用回调函数，并将读取的结果（即 Base64 格式的图片）作为参数传递给回调函数
    reader.addEventListener('load', () => callback(reader.result));
    // 开始读取图片，结果将是一个包含 Base64 编码的数据 URL
    reader.readAsDataURL(img);
};

// 定义一个函数，处理头像上传前的操作
const beforeAvatarUpload = (rawFile) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(rawFile.type)) {
        utils.msg('头像必须是图片格式!', false);
        return false;
    } else if (rawFile.size / 1024 / 1024 > 1) {
        utils.msg('上传的图片文件不能大于1M!', false);
        return false;
    }
    return true;
};

// 定义一个异步函数，处理头像上传成功后的操作
const handleAvatarSuccess = async (response, uploadFile) => {
    // 调用 getBase64 函数，将上传的文件转换为 Base64 格式
    // getBase64 函数接收两个参数：要转换的文件和一个回调函数
    // 当文件转换完成后，回调函数会被调用，并接收转换后的 Base64 字符串作为参数
    await getBase64(uploadFile.raw, (imageUrl) => {
        // 在回调函数中，将转换后的 Base64 字符串赋值给 option.value.img
        // 这样，option.value.img 就存储了用户上传的头像的 Base64 编码
        option.value.img = imageUrl;
    });
};

// 保存图片
const saveImg = async () => {
    if (utils.length(option.value.img) <= 0) {
        utils.msg('没有要保存的头像！', false);
        return;
    }
    try {
        saveDisabled.value = true;
        const data = await cropper.value.getCropData();
        const res = await ajax.post('/User/SaveHeader', qs.stringify({ img: data }));
        utils.msg(res.success ? '保存成功！' : '保存失败！', res.success);
        if (res.success) {
            index_userinfo.value.headerImg = data;
            saveDisabled.value = false;
        }
    } catch (error) {
        saveDisabled.value = false;
    }
};

// 恢复默认
const reset = async () => {
    try {
        const res = await ajax.post('/User/ResetHeader');
        utils.msg(res.success ? '恢复成功！' : '恢复失败！', res.success);
        if (res.success) {
            option.value.img = '';
            index_userinfo.value.headerImg = '';
            saveDisabled.value = false;
        }
    } catch (error) {
        saveDisabled.value = false;
    }
};

</script>

<style scoped>
@import './css/system.css';
@import '../../roadui-assets/before.css';

:deep(.el-upload) {
    border: 0.5px dotted #ccc;
}
</style>