<template>
    <div style="margin: 0 auto; width: 98%; ">
        <!--<el-input type="textarea" v-model="attrJson.script" placeholder="javascript vue脚本，在mounted中执行。" :rows="18" style="width:100%;"></el-input>-->
        <el-codemirror v-model="attrJson.script" height="390px" placeholder="javascript vue脚本，在mounted中执行。"></el-codemirror>
    </div>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    const utils = inject('utils');
    const props = defineProps({ query: { type: String, default: () => { return ''; } } });
    const ElCodemirror = inject('ElCodemirror');
    const editorName = utils.query('editorname', props.query);
    const editor = window.parent.CKEDITOR.instances[editorName];
    const attrJson = ref(editor.formAttributeJSON);
   
    onMounted(() => {
        if (!utils.hasKey(attrJson.value, 'script') || utils.length(attrJson.value.script) === 0) {
            attrJson.value.script = '';
        }
    });
</script>