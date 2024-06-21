<template>
    <el-select v-if="status===0&&controlType===0" :placeholder="placeholder1"
               popper-class="roadui_selectfile"
               :disabled="disabled"
               v-model="selectValue"
               fit-input-width
               @clear="clear"
               @visible-change="visibleChange"
               ref="selectFileRef">
        <el-option value="" label="" style="height:0;padding:0;display:none;"></el-option>
        <div @click.stop>
            <div>
                <el-upload :action="config.SERVER_WEBADDRESS+'/Files/SaveFiles'"
                           ref="upload_0_ref"
                           :headers="{'nroadflow-token': token}"
                           :data="{filetype:accept,uploadtype:0}"
                           with-credentials
                           :show-file-list="false"
                           :accept="accept"
                           :on-success="handleSuccess"
                           :on-error="handleError"
                           multiple
                           :limit="limit"
                           :on-exceed="handleExceed"
                           :before-upload="beforeUpload">
                    <el-button type="primary">上传</el-button>
                </el-upload>
                <el-button @click="selectFileRef.blur()" style="margin-left:12px">关闭</el-button>
                <div style="clear:both"></div>
            </div>
            <div style="padding:12px 0 0 0; height:225px; overflow:auto;">
                <el-space :size="20" wrap>
                    <div v-for="file in fileList" class="roadui_roadui_selectfilelist" @click.stop="showFile(file)" :style="utils.isImageFile(file.name)?'background-image:url('+config.SERVER_WEBADDRESS+'/Files/show?id='+file.id+'&nroadflow-token='+token+')':'' ">
                        <div class="roadui_roadui_selectfilesize">
                            <div :title="file.name">{{getFileName(file.name)}}</div>
                            <div>{{file.size}}</div>
                            <el-popconfirm title="您确定要删除吗？" width="auto" :teleported="false" @cancel="handleCancel" @confirm="handleRemove(file.id,$event);" @click.stop>
                                <template #reference>
                                    <div slot="reference" @click.stop><el-icon><delete /></el-icon></div>
                                </template>
                            </el-popconfirm>
                        </div>
                    </div>
                </el-space>
            </div>
        </div>
    </el-select>
    <el-upload v-else-if="status===0&&controlType===1"
               ref="upload_1_ref"
               v-model:file-list="ctlFileList"
               :action="config.SERVER_WEBADDRESS+'/Files/SaveFiles'"
               :headers="{'nroadflow-token': token}"
               :data="{filetype:accept,uploadtype:0}"
               with-credentials
               :accept="accept"
               :on-success="handleSuccess"
               :on-error="handleError"
               :multiple="controlShowType!==1&&(utils.isUndef(limit)||limit>1)"
               :limit="limit"
               :show-file-list="showFileList"
               :list-type="listType"
               :class="controlShowType===1||controlShowType===2?'avatar-uploader':''"
               :on-exceed="handleExceed"
               :on-remove="handleRemove"
               :before-remove="handleRemove1"
               :on-preview="showFile"
               :before-upload="beforeUpload">
        <el-button v-if="controlShowType===0" type="primary">{{buttonText}}</el-button>
        <img v-if="imageUrl" :src="imageUrl" class="avatar" :style="showStyle" />
        <el-icon v-else-if="controlShowType!==0" class="avatar-uploader-icon" :style="showStyle"><Plus /></el-icon>
        <template #tip>
            <div v-if="showFileList" class="el-upload__tip" style="clear:both">
                {{tip}}
            </div>
        </template>
    </el-upload>
    <div v-else-if="status===1">
        <el-space :direction="showType==='link'?'horizontal':'vertical'" alignment="left">
            <span v-for="(file,index) in fileList" :key="file.id+index">
                <span v-if="showImg&&utils.isImageFile(file.name)" @click="showFile(file)" :style="showStyle +';background-image:url('+config.SERVER_WEBADDRESS+'/Files/show?id='+file.id+'&nroadflow-token='+token+');'" class="roadui_file_img_span">
                    <span :style="showStyle"><el-icon><ZoomIn /></el-icon></span>
                </span>
                <a v-else class="roaduia" href="javascript:;" @click="showFile(file)" :style="showStyle">{{showIndex?++index+'. ':''}}{{file.name}}</a>
            </span>
        </el-space>
    </div>
</template>

<script>
    export default {
        name: 'ElSelectfile'
    }
</script>
<style>
    .avatar-uploader .el-upload { border: 1px dashed var(--el-border-color); display:inline-flex; border-radius: 6px; cursor: pointer; position: relative; overflow: hidden; transition: var(--el-transition-duration-fast); }
    .avatar-uploader .el-upload:hover { border-color: var(--el-color-primary); }
    .el-icon.avatar-uploader-icon { font-size: 28px; color: #8c939d; width: 178px; height: 178px; text-align: center; }
</style>

<script setup>
    import { ref, inject, onMounted, computed } from 'vue';
    import { genFileId } from 'element-plus';
    const ajax = inject('ajax');
    const utils = inject('utils');
    const config = inject('config');
    const qs = inject('qs');
    const emit = defineEmits(['update:modelValue', 'change']);
    const indexOpenMenu = inject('index_openmenu');//首页打开菜单方法，查看文件弹出窗口时用。
    const indexDialogShow = inject('index_dialogshow');//首页查看文件窗口是否打开，用于控制在窗口中点击不关闭文件列表。
    const indexDialogIsShowFile = inject('index_dialogisshowfile');//首页打开的dialog窗口是否是查看文件。
    const token = utils.getToken();

    const props = defineProps({
        //值,多选为Array，单选为String
        modelValue: { type: [Array, String] },
        //状态 0编辑 1只读
        status: { type: Number, default: () => { return 0; } },
        //背景文字
        placeholder: { type: String, default: () => { return '共0个文件'; } },
        //接收的文件类型，例：.jpg,.jpeg,.png,.gif
        accept: { type: String, default: () => { return ''; } },
        //只读时显示类型 link：链接 linkbr：链接换行
        showType: { type: String, default: () => { return ''; } },
        //是否显示为图片
        showImg: { type: Boolean, default: () => { return false; } },
        //是否显示编号
        showIndex: { type: Boolean, default: () => { return true; } },
        //只读时显示css样式
        showStyle: { type: String, default: () => { return ''; } },
        //是否禁用
        disabled: { type: Boolean, default: () => { return false; } },
        //允许上传的文件数量
        limit: { type: Number },
        //单个文件大小限制
        size: { type: Number },
        //控件类型 0:弹出层的方式  1:ELEMENT自带样式
        controlType: { type: Number, default: () => { return 0; } },
        //控件为ELEMENT自带样式时的显示类型 0:列表 1:头像 2:照片墙
        controlShowType: { type: Number, default: () => { return 0; } },
        //控件为ELEMENT自带样式时的显示样式 text|picture-card
        listType: { type: String, default: () => { return 'text'; } },
        //只读时显示类型 link：链接 linkbr：链接换行
        tip: { type: String, default: () => { return ''; } },
        //只读时显示类型 link：链接 linkbr：链接换行
        buttonText: { type: String, default: () => { return '上传'; } },
        //是否是移动端
        ismobile: { type: Boolean, default: () => { return false; } },
    });

    const selectFileRef = ref(null);
    const selectValue = ref('');
    const placeholder1 = ref(props.placeholder);
    const fileList = ref([]);
    const selectLenght = ref(0);//本次选择的文件数量

    //显示方式为页面内时的变量
    const ctlFileList = ref([]);
    const showFileList = ref(true);
    const imageUrl = ref('');//类型为头像时的图片路径
    const upload_0_ref = ref(null);
    const upload_1_ref = ref(null);
    
    //得到文件名，多余的裁剪
    const getFileName = computed(() => (fileName) => {
        if (utils.length(fileName) > 10) {
            const extName = fileName.substr(fileName.lastIndexOf('.'));
            return fileName.substr(0, 10) + '‧‧‧' + extName;
        } else {
            return fileName;
        }
    });

    onMounted(() => {
        showFileList.value = props.controlShowType !== 1;
        init(props.modelValue);
        //console.log(props.showImg)
    });

    //初始化值
    const init = (val, up) => {
        if (utils.length(val) > 0) {
            ajax.post('/File/GetFileList', qs.stringify({ value: val })).then((res) => {
                if (res.success) {
                    fileList.value = res.data;
                    if (props.controlType !== 0) {
                        //类型为头像时设置图片路径
                        if (props.controlShowType === 1 && res.data.length > 0) {
                            imageUrl.value = config.SERVER_WEBADDRESS + '/Files/Show?id=' + res.data[res.data.length-1]['id'];
                        }
                        ctlFileList.value = res.data;
                        //设置文件url
                        if (ctlFileList.value.length > 0) {
                            for (let i = 0; i < ctlFileList.value.length; i++) {
                                ctlFileList.value[i]['url'] = config.SERVER_WEBADDRESS + '/Files/Show?id=' + ctlFileList.value[i]['id'];
                            }
                        }
                    }
                    updateValue(up);
                }
            }).catch(() => { });
        } else {
            updateValue(up);
        }
    };
    //文件上传成功
    const handleSuccess = (_, uploadFiles) => {
        const response = uploadFiles.response;
        if (response.code === 0) {
            const fileId = response.data.id || '';
            const size = response.data.size || '';
            const name = response.data.name || '';
            const type = uploadFiles.raw.type || '';
            if (props.controlType === 0) {
                fileList.value.push({ id: fileId, size: size, name: name, type: type, source: 0 });//source:来源 0上传 1从文件管理中选择
            }
            //类型为头像时设置图片路径
            if (props.controlShowType === 1) {
                imageUrl.value = config.SERVER_WEBADDRESS + '/Files/Show?id=' + fileId;
            }
            updateValue();
        }
        else if (response.code === 401) {
            //登录失效
            utils.msg('未找到用户登录信息！', false);
        } else if (response.code === 2) {
            if (utils.isDef(upload_0_ref.value)) {
                upload_0_ref.value.handleRemove(uploadFiles);
            }
            if (utils.isDef(upload_1_ref.value)) {
                upload_1_ref.value.handleRemove(uploadFiles);
            }
            utils.msg('不允许上传的文件类型！', false);
        }
        selectLenght.value = 0;
    };
    //文件上传失败
    const handleError = () => {
        selectLenght.value = 0;
        utils.msg('文件上传失败！', false);
    };
    //超出文件个数限制时
    const handleExceed = (files) => {
        //如果是头像模式，则替换前端一个。
        if (props.controlType === 1 && props.controlShowType === 1) {
            upload_1_ref.value.clearFiles();
            let f = files[0];
            f.uid = genFileId();
            upload_1_ref.value.handleStart(f);
            upload_1_ref.value.submit();
            return;
        }
        selectLenght.value = 0;
        utils.msg('当前设置最多只能添加' + props.limit + '个文件！', false);
    };
    //文件上传前检查上传数量。
    const beforeUpload = () => {
        if (utils.isUndef(props.limit) || props.limit == 0) {
            return true;
        }
        selectLenght.value++;
        if (fileList.value.length + selectLenght.value > props.limit) {
            utils.msg('当前设置最多只能添加' + props.limit + '个文件！', false);
            return false;
        }
        return true;
    };
    //清除
    const clear = () => {
        selectLenght.value = 0;
        handleRemove(props.modelValue);
    };
    //弹出删除文件确认框的取消事件，阻止事件冒泡。
    const handleCancel = (e) => {
        e.stopPropagation();
    };
    //删除文件
    const handleRemove = (fileIds, e) => {
        let ids = fileIds;
        if (props.controlType === 0) {
            selectLenght.value = 0;
            upload_0_ref.value.handleRemove(ids);
            e.stopPropagation();
        } else {
            ids = utils.hasKey(fileIds, 'response') ? fileIds['response']['data']['id'] : fileIds['id'];
        }
        if (utils.length(ids) === 0) {
            return;
        }
        ajax.post('/File/Delete', qs.stringify({ id: ids })).then((res) => {
            if (res.success) {
                utils.msg('文件删除成功！', true);
                if (props.controlType === 0) {
                    const fileIdArray = fileIds.split('|');
                    for (let i = 0; i < fileIdArray.length; i++) {
                        utils.removeArrayObj(fileList.value, fileIdArray[i], 'id');
                    }
                }
            } else {
                let msg = res.msg;
                if (utils.length(msg) === 0) {
                    switch (res.code) {
                        case 1:
                            msg = '参数为空！';
                            break;
                        case 2:
                            msg = '文件不存在！';
                            break;
                        case 3:
                            msg = '文件删除失败！';
                            break;
                        default:
                            msg = '未知错误！';
                            break;
                    }
                }
                utils.msg(msg, false);
            }
            updateValue();
        }).catch(() => { });
    };
    //element模式删除
    const handleRemove1 = async (uploadFile) => {
        //上传错误，移出文件列表不用确认。
        if (utils.hasKey(uploadFile, 'response') && uploadFile.response.code !== 0) {
            return true;
        }
        return await utils.confirm('您确定要删除吗？');
    };
    //更新值
    const updateValue = (up) => {
        let valueArray = [];
       
        if (props.controlType === 0) {
            selectLenght.value = 0;
            for (let i = 0; i < fileList.value.length; i++) {
                valueArray.push(fileList.value[i].id);
            }
        } else {
            for (let i = 0; i < ctlFileList.value.length; i++) {
                if (utils.hasKey(ctlFileList.value[i], 'response')) {
                    valueArray.push(ctlFileList.value[i]['response']['data']['id']);
                } else {
                    valueArray.push(ctlFileList.value[i].id);
                }
            }
            //如果是头像则只取最后一个
            if (props.controlShowType === 1 && valueArray.length > 1) {
                valueArray.splice(0, valueArray.length - 1);
            }
        }
        if (up !== false) {
            emit('update:modelValue', valueArray.join('|'));
            emit('change', valueArray.join('|'));
        }
        if (props.controlType === 0) {
            if (valueArray.length > 0) {
                placeholder1.value = '共' + valueArray.length + '个文件';
            } else {
                placeholder1.value = props.placeholder;
            }
        }
    };
    //要关闭时判断是否是查看文件模式，是查看模式不隐藏文件列表。
    const visibleChange = (val) => {
        if (!val && indexDialogShow.value && indexDialogIsShowFile.value) {
            selectFileRef.value.visible = true;
        }
    };
    //查看文件
    const showFile = (file) => {
        let file1 = file;
        if (utils.hasKey(file, 'response')) {
            file1 = file['response']['data'];
            file1['source'] = 0;
        }
        utils.showFile(indexOpenMenu, file1, config.SERVER_WEBADDRESS, props.ismobile);
    };

    //加载完成后设置值时更新显示
    const initTitle = (val) => {
        init(val, false);
    }

    //暴露方法给父组件调用
    defineExpose({ initTitle });
</script>