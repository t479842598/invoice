<template>
    <div style="padding: 10px 0;">
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
            <tr>
                <td>
                    <el-upload :action="config.SERVER_WEBADDRESS+'/Files/SaveFiles'"
                               :show-file-list="false"
                               with-credentials
                               accept=".jpg,.jpeg,.png,.gif"
                               :data="{filetype:'.jpg,.jpeg,.png,.gif',uploadtype:0}"
                               :on-success="handleAvatarSuccess"
                               :before-upload="beforeAvatarUpload">
                        <el-button type="primary">上传</el-button>
                    </el-upload>
                    <el-button type="primary" @click="reset()" style="margin-left:14px">恢复默认</el-button>
                </td>
            </tr>
            <tr>
                <td style="padding-top:40px">
                    <el-usersign :sign="sign"></el-usersign>
                </td>
            </tr>
        </table>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const qs = inject('qs');
    const config = inject('config');
    const ElUsersign = inject('ElUsersign');
    const index_userinfo = inject('index_userinfo');
    const sign = ref('');
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const userId = utils.query("userid", props.query);//组织架构管理中传入的userid
    const userInfo = utils.length(userId) > 0 ? inject('user_info') : null;//组织架构中注入的人员信息
    const user_dialogsignshow = utils.length(userId) > 0 ? inject('user_dialogsignshow') : null;//组织架构中注入弹出窗口是否显示
    const user_loadformdata = utils.length(userId) > 0 ? inject('user_loadformdata') : null;//组织架构中注入的加载人员信息

    onMounted(() => {
        setSign();
    });

    const setSign = () => {
        //如果是组织架构管理中打开的设置人员签章
        if (utils.length(userId) > 0) {
            sign.value = utils.length(userInfo.value.sign) > 0 ? userInfo.value.sign : userInfo.value.name;
        } else {
            sign.value = utils.length(index_userinfo.value.signImg) > 0 ? index_userinfo.value.signImg : index_userinfo.value.userName;
        }
    }

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    //上传前检查文件格式和大小。
    const beforeAvatarUpload = (rawFile) => {
        if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/gif') {
            utils.msg('签章必须是图片格式!', false);
            return false;
        } else if (rawFile.size / 1024 / 1024 > 2) {
            utils.msg('上传的图片文件不能大于2M!', false);
            return false;
        }
        return true;
    };

    //上传成功
    const handleAvatarSuccess = (response, uploadFile) => {
        getBase64(uploadFile.raw, (imageUrl) => {
            ajax.post('/User/' + (utils.length(userId) > 0 ? 'SaveSignAdmin' : 'SaveSign'), qs.stringify({ img: imageUrl, userId: userId })).then((res) => {
                utils.msg(res.success ? '保存成功！' : '保存失败！', res.success);
                if (res.success) {
                    if (utils.length(userId) > 0) {
                        user_loadformdata();
                        user_dialogsignshow.value = false;
                    } else {
                        index_userinfo.value.signImg = imageUrl;
                        setSign();
                    }
                }
            }).catch(() => { });
        });
    };

    //恢复默认签章
    const reset = () => {
        ajax.post('/User/' + (utils.length(userId) > 0 ? 'ResetSignAdmin' : 'ResetSign'), qs.stringify({ userId: userId })).then((res) => {
            utils.msg(res.success ? '恢复成功！' : '恢复失败！', res.success);
            if (res.success) {
                if (utils.length(userId) > 0) {
                    user_loadformdata();
                    user_dialogsignshow.value = false;
                } else {
                    index_userinfo.value.signImg = '';
                    setSign();
                }
            }
        }).catch(() => { });
    }
</script>