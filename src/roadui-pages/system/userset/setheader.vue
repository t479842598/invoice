<template>
    <div>
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
            <tr>
                <td>
                    <el-upload
                               :action="config.SERVER_WEBADDRESS+'/Files/SaveFiles'"
                               :show-file-list="false"
                               with-credentials
                               accept=".jpg,.jpeg,.png,.gif"
                               :data="{filetype:'.jpg,.jpeg,.png,.gif',uploadtype:0}"
                               :on-success="handleAvatarSuccess"
                               :before-upload="beforeAvatarUpload">
                        <el-button type="primary">上传</el-button>
                    </el-upload>
                    <el-button style="margin-left:14px" type="primary" :disabled="saveDisabled" @click="saveImg()">保存头像</el-button>
                    <el-button type="primary" :disabled="saveDisabled" @click="reset()">恢复默认</el-button>
                </td>
            </tr>
            <tr>
                <td style="padding-top:20px">
                    <div style="width:700px;height:500px;">
                        <vueCropper ref="cropper"
                                    :img="option.img"
                                    :autoCrop="option.autoCrop"
                                    :autoCropWidth="option.autoCropWidth"
                                    :autoCropHeight="option.autoCropHeight"
                                    :centerBox="option.centerBox"
                                    :outputType="option.outputType">

                        </vueCropper>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</template>

<script setup>
    import { VueCropper } from 'vue-cropper';
    import 'vue-cropper/dist/index.css';
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const config = inject('config');
    const index_userinfo = inject('index_userinfo');
    const cropper = ref(null);
    const saveDisabled = ref(false);
    const option = ref({ img: '', outputType: 'png', autoCrop: true, autoCropWidth: 200, autoCropHeight: 200, centerBox: true });

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    onMounted(() => {
        option.value.img = index_userinfo.value.headerImg;
    });

    //上传前检查文件格式和大小。
    const beforeAvatarUpload = (rawFile) => {
        if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/gif') {
            utils.msg('头像必须是图片格式!', false);
            return false;
        } else if (rawFile.size / 1024 / 1024 > 1) {
            utils.msg('上传的图片文件不能大于1M!', false);
            return false;
        }
        return true;
    };

    //上传成功
    const handleAvatarSuccess = (response, uploadFile) => {
        getBase64(uploadFile.raw, (imageUrl) => {
            option.value.img = imageUrl;
        });
    };

    const saveImg = () => {
        if (utils.length(option.value.img) <= 0) {
            utils.msg('没有要保存的头像！', false);
            return;
        }
        //获取截图的blob数据
        cropper.value.getCropData((data) => {
            saveDisabled.value = true;
            ajax.post('/User/SaveHeader', qs.stringify({ img: data })).then((res) => {
                utils.msg(res.success ? '保存成功！' : '保存失败！', res.success);
                if (res.success) {
                    index_userinfo.value.headerImg = data;
                    saveDisabled.value = false;
                }
            }).catch(() => { saveDisabled.value = false; });
        });
    };

    //恢复默认头像
    const reset = () => {
        ajax.post('/User/ResetHeader').then((res) => {
            utils.msg(res.success ? '恢复成功！' : '恢复失败！', res.success);
            if (res.success) {
                option.value.img = '';
                index_userinfo.value.headerImg = '';
                saveDisabled.value = false;
            }
        }).catch(() => { saveDisabled.value = false; });
    };
</script>