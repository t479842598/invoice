import{ai as o,aT as c,aF as p,c as d,W as m,bi as f,o as v}from"./_@vue-5ba92de9.js";const h={style:{margin:"0 auto",width:"98%"}},g={__name:"scripts",props:{query:{type:String,default:()=>""}},setup(a){const t=o("utils"),s=a,n=o("ElCodemirror"),i=t.query("editorname",s.query),l=window.parent.CKEDITOR.instances[i],e=c(l.formAttributeJSON);return p(()=>{(!t.hasKey(e.value,"script")||t.length(e.value.script)===0)&&(e.value.script="")}),(y,r)=>(v(),d("div",h,[m(f(n),{modelValue:e.value.script,"onUpdate:modelValue":r[0]||(r[0]=u=>e.value.script=u),height:"390px",placeholder:"javascript vue脚本，在mounted中执行。"},null,8,["modelValue"])]))}};export{g as default};
