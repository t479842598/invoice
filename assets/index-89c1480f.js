import{ai as b,aT as r,aF as O,c as P,a as V,W as e,bD as t,bI as W,aX as c,aY as X,o as B,U as v,bF as Y,H as q,aZ as Z,bi as E}from"./_@vue-5ba92de9.js";const J={class:"roadui_page"},K={style:{height:"calc(100% - 60px)",overflow:"auto"}},Q=V("span",null,"操作",-1),ee={class:"dialog-footer"},oe={__name:"index",setup(le){const g=b("ajax"),u=b("utils"),y=b("qs"),R=b("ElSelectico"),T=b("ElCodemirror"),o=r(!1),w=r(!1),C=r([]),x=r({}),n=r({});let _=[];const U=r({prop:"sort",order:"ascending"}),k=r(u.getPager(U.value)),F=r(null),m=r(!1),D=r(""),$={name:[{required:!0,message:"请输入名称",trigger:"blur"}],scripts:[{required:!0,message:"请输入脚本",trigger:"blur"}]};O(()=>{h()});const M=s=>{_=s},h=()=>{w.value=!0,o.value=!0,g.post("/FlowButton/GetList",y.stringify({findname:x.value.name})).then(s=>{C.value=s.data,o.value=!1,w.value=!1}).catch(()=>{o.value=!1})},S=s=>{if(u.isUndef(s)||u.length(s.id)===0){n.value={id:u.emptyLong+"",name:"",scripts:"",sort:u.getArrayMax(C.value,"sort")+5},D.value="添加",m.value=!0;return}u.length(s.id)>0&&g.post("/FlowButton/Get?buttonid="+s.id).then(l=>{l.success?(n.value=l.data,D.value="编辑 - "+l.data.name,m.value=!0):u.msg("获取数据失败！",!1)}).catch(()=>{})},N=async s=>{s&&await s.validate(l=>{if(l){o.value=!0;const f=n.value.id||"";g.post("/FlowButton/Save?buttonid="+f,y.stringify(n.value)).then(i=>{let d=i.msg;u.length(d)===0&&(d=i.success?"保存成功！":"保存失败！"),u.msg(d,i.success),o.value=!1,i.success&&(m.value=!1,h()),o.value=!1}).catch(()=>{o.value=!1})}})},A=()=>{if(_.length===0){u.msg("您没有选择要删除的按钮！",!1);return}u.confirm("您确定要删除所选按钮吗？",()=>{o.value=!0,g.post("/FlowButton/Delete",y.stringify({ids:u.getArrayValues(_,"id").join(",")})).then(s=>{u.msg(s.success?"删除成功！":"删除失败！",s.success),o.value=!1,s.success&&(_=[],h())}).catch(()=>{o.value=!1})})};return(s,l)=>{const f=c("el-input"),i=c("el-form-item"),d=c("el-button"),j=c("el-form"),p=c("el-table-column"),G=c("el-table"),H=c("el-scrollbar"),I=c("el-input-number"),L=c("el-dialog"),z=X("loading");return B(),P("div",J,[V("div",null,[e(j,{inline:!0,onSubmit:l[2]||(l[2]=W(()=>{},["prevent"]))},{default:t(()=>[e(i,{label:"名称"},{default:t(()=>[e(f,{modelValue:x.value.name,"onUpdate:modelValue":l[0]||(l[0]=a=>x.value.name=a),placeholder:"按钮名称",style:{width:"200px"},clearable:""},null,8,["modelValue"])]),_:1}),e(i,null,{default:t(()=>[e(d,{type:"primary",disabled:o.value,onClick:h},{default:t(()=>[v("查询")]),_:1},8,["disabled"]),e(d,{type:"primary",disabled:o.value,onClick:l[1]||(l[1]=a=>S(null))},{default:t(()=>[v("添加")]),_:1},8,["disabled"]),e(d,{type:"danger",disabled:o.value,onClick:A},{default:t(()=>[v("删除")]),_:1},8,["disabled"])]),_:1})]),_:1})]),V("div",K,[e(H,null,{default:t(()=>[Y((B(),q(G,{data:C.value,stripe:k.value.tableStripe,border:k.value.tableBorder,style:{width:"100%"},"highlight-current-row":k.value.tableHighlightCurrentRow,onSelectionChange:M,"default-sort":U.value},{default:t(()=>[e(p,{type:"selection",width:"45"}),e(p,{prop:"name",label:"名称",width:"300",sortable:""}),e(p,{prop:"ico",label:"图标",width:"120"},{default:t(a=>[(B(),q(Z(a.row.ico)))]),_:1}),e(p,{prop:"note",label:"备注"}),e(p,{prop:"sort",label:"排序",width:"90",sortable:""}),e(p,{width:"90"},{header:t(()=>[Q]),default:t(a=>[e(d,{size:"small",disabled:o.value,type:"primary",onClick:te=>S(a.row)},{default:t(()=>[v("编辑")]),_:2},1032,["disabled","onClick"])]),_:1})]),_:1},8,["data","stripe","border","highlight-current-row","default-sort"])),[[z,w.value]])]),_:1})]),e(L,{modelValue:m.value,"onUpdate:modelValue":l[10]||(l[10]=a=>m.value=a),title:D.value,"align-center":"","destroy-on-close":"",width:"700px",draggable:"","close-on-click-modal":!1},{footer:t(()=>[V("span",ee,[e(d,{disabled:o.value,type:"primary",onClick:l[8]||(l[8]=a=>N(F.value))},{default:t(()=>[v("保存")]),_:1},8,["disabled"]),e(d,{disabled:o.value,onClick:l[9]||(l[9]=a=>m.value=!1)},{default:t(()=>[v("关闭")]),_:1},8,["disabled"])])]),default:t(()=>[e(j,{model:n.value,ref_key:"ruleFormRef",ref:F,rules:$,"label-width":"80px"},{default:t(()=>[e(i,{label:"名称",prop:"name"},{default:t(()=>[e(f,{modelValue:n.value.name,"onUpdate:modelValue":l[3]||(l[3]=a=>n.value.name=a),clearable:""},null,8,["modelValue"])]),_:1}),e(i,{label:"脚本",prop:"scripts"},{default:t(()=>[e(E(T),{modelValue:n.value.scripts,"onUpdate:modelValue":l[4]||(l[4]=a=>n.value.scripts=a),height:"120px"},null,8,["modelValue"])]),_:1}),e(i,{label:"图标",prop:"ico"},{default:t(()=>[e(E(R),{modelValue:n.value.ico,"onUpdate:modelValue":l[5]||(l[5]=a=>n.value.ico=a),clearable:""},null,8,["modelValue"])]),_:1}),e(i,{label:"备注",prop:"note"},{default:t(()=>[e(f,{modelValue:n.value.note,"onUpdate:modelValue":l[6]||(l[6]=a=>n.value.note=a)},null,8,["modelValue"])]),_:1}),e(i,{label:"排序",prop:"sort"},{default:t(()=>[e(I,{modelValue:n.value.sort,"onUpdate:modelValue":l[7]||(l[7]=a=>n.value.sort=a),step:5,min:0},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue","title"])])}}};export{oe as default};
