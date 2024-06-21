<template>
    <table class="roadui_formtable" style="width:90%; margin: 0 auto;">
        <tr>
            <td>
                表单名称
            </td>
        </tr>
        <tr>
            <td>
                <el-input v-model="formName" @change="setName" placeholder="要另存为的表单名称" />
            </td>
        </tr>
    </table>
</template>

<script setup>
    import { ref, inject } from 'vue';
    const utils = inject('utils');
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });

    const editorName = utils.query('editorname', props.query);
    const editor = window.parent.CKEDITOR.instances[editorName];
    const formName = ref('');
    const setName = () => {
        editor["saveAsName"] = formName.value;
    }

</script>