import{ai as a,aT as n,c as V,W as l,bD as t,aX as i,o as C,bi as b,U as y}from"./_@vue-5ba92de9.js";const E={__name:"redirect",props:{query:{type:String,default:()=>""}},setup(g){const r=a("utils"),w=a("ElSelectorg"),k=a("flowrun_redirectok"),d=a("flowrun_dialogshow"),c=g,f=r.query("stepid",c.query),h=r.query("ismobile",c.query),o=n(!1),m=n(null),s=n({}),q={receiver:[{required:!0,message:"请选择接收人",trigger:"blur"}]},x=async()=>{if(r.length(f)===0){r.msg("未找到步骤！",!1);return}await m.value.validate(p=>{if(p){o.value=!0;let e=[{id:f,members:s.value.receiver}];k(e),o.value=!1,d.value=!1}})};return(p,e)=>{const v=i("el-form-item"),_=i("el-button"),S=i("el-form");return C(),V("div",null,[l(S,{model:s.value,ref_key:"ruleFormRef",ref:m,rules:q,"label-width":"70px"},{default:t(()=>[l(v,{label:"接收人",prop:"receiver"},{default:t(()=>[l(b(w),{placeholder:"选择接收人",style:{width:"100%"},"show-search":b(h)!="1",modelValue:s.value.receiver,"onUpdate:modelValue":e[0]||(e[0]=u=>s.value.receiver=u)},null,8,["show-search","modelValue"])]),_:1}),l(v,null,{default:t(()=>[l(_,{type:"primary",disabled:o.value,onClick:e[1]||(e[1]=u=>x())},{default:t(()=>[y("确定")]),_:1},8,["disabled"]),l(_,{disabled:o.value,onClick:e[2]||(e[2]=u=>d.value=!1)},{default:t(()=>[y("取消")]),_:1},8,["disabled"])]),_:1})]),_:1},8,["model"])])}}};export{E as default};
