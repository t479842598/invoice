import{ai as V,aT as c,aF as I,c as b,a as L,U as S,W as d,bD as v,bF as M,H as g,aX as _,aY as R,o as r,F as y,aV as w}from"./_@vue-5ba92de9.js";const W={style:{"margin-bottom":"15px"}},Y={__name:"validate",props:{query:{type:String,default:()=>""}},setup(B){const C=V("ajax"),h=V("utils"),O=V("qs"),j=V("program_attr_formid"),P=B,x=h.query("programid",P.query),f=c(!1),k=c(!1),o=c([]),H=c({}),N=c(h.getPager(H.value)),D=c([{value:0,label:"编辑"},{value:1,label:"只读"},{value:2,label:"隐藏"}]),U=c([{value:0,label:"不检查"},{value:2,label:"检查"}]),F=c(null),q=c(null);I(()=>{J()});const J=()=>{k.value=!0,f.value=!0,C.post("/Program/Get?programid="+x).then(i=>{const e=JSON.parse(i.data.fieldValidate||"{}")||{};h.getFromFields("","",j.value,x).then(a=>{for(let l=0;l<a.length;l++)for(let s=0;s<a[l].fields.length;s++)if(a[l].type=="main"){let u=a[l].fields[s].id,m=1,p=0;h.isDef(e[u])&&(m=e[u].status,p=e[u].check),o.value.push({id:a[l].fields[s].id,table:a[l].fields[s].tableName||a[l].label,field:a[l].fields[s].id,fieldNote:a[l].fields[s].label,status:m,check:p})}else if(a[l].type=="subtable"){let u=a[l].id+"."+a[l].fields[s].id,m=1,p=0;h.isDef(e[u])&&(m=e[u].status,p=e[u].check),o.value.push({id:u,table:a[l].fields[s].tableName||a[l].tableName||a[l].label,field:a[l].fields[s].id,fieldNote:a[l].fields[s].label,status:m,check:p})}k.value=!1,f.value=!1})}).catch(()=>{k.value=!1,f.value=!1})},T=i=>{for(let e=0;e<o.value.length;e++)o.value[e].status=i},E=i=>{for(let e=0;e<o.value.length;e++)o.value[e].check=i},G=()=>{let i={};for(let e=0;e<o.value.length;e++)i[o.value[e].id]={},i[o.value[e].id].status=o.value[e].status,i[o.value[e].id].check=o.value[e].check;f.value=!0,C.post("/Program/SaveValidate?programid="+x,O.stringify({fieldValidate:JSON.stringify(i)})).then(e=>{h.msg(e.success?"保存成功！":e.code==1?"未找到应用程序设计！":"保存失败！",e.success),f.value=!1}).catch(()=>{f.value=!1})};return(i,e)=>{const a=_("el-option"),l=_("el-select"),s=_("el-button"),u=_("el-table-column"),m=_("el-table"),p=R("loading");return r(),b("div",null,[L("div",W,[S(" 将字段状态设置为 "),d(l,{modelValue:F.value,"onUpdate:modelValue":e[0]||(e[0]=t=>F.value=t),style:{width:"120px",margin:"0 12px","vertical-align":"middle"},onChange:T},{default:v(()=>[(r(!0),b(y,null,w(D.value,t=>(r(),g(a,{key:t.value,value:t.value,label:t.label},null,8,["value","label"]))),128))]),_:1},8,["modelValue"]),S(" 将字段检查设置为 "),d(l,{modelValue:q.value,"onUpdate:modelValue":e[1]||(e[1]=t=>q.value=t),style:{width:"120px",margin:"0 12px","vertical-align":"middle"},onChange:E},{default:v(()=>[(r(!0),b(y,null,w(U.value,t=>(r(),g(a,{key:t.value,value:t.value,label:t.label},null,8,["value","label"]))),128))]),_:1},8,["modelValue"]),d(s,{type:"primary",disabled:f.value,onClick:e[2]||(e[2]=t=>G())},{default:v(()=>[S("保存设置")]),_:1},8,["disabled"])]),M((r(),g(m,{data:o.value,stripe:N.value.tableStripe,border:N.value.tableBorder,style:{width:"100%"},"highlight-current-row":N.value.tableHighlightCurrentRow},{default:v(()=>[d(u,{prop:"table",label:"表名"}),d(u,{prop:"field",label:"字段名"}),d(u,{prop:"fieldNote",label:"字段说明"}),d(u,{prop:"status",label:"字段状态",width:"120"},{default:v(t=>[d(l,{modelValue:t.row.status,"onUpdate:modelValue":n=>t.row.status=n},{default:v(()=>[(r(!0),b(y,null,w(D.value,n=>(r(),g(a,{key:n.value,value:n.value,label:n.label},null,8,["value","label"]))),128))]),_:2},1032,["modelValue","onUpdate:modelValue"])]),_:1}),d(u,{prop:"check",label:"验证类型",width:"120"},{default:v(t=>[d(l,{modelValue:t.row.check,"onUpdate:modelValue":n=>t.row.check=n},{default:v(()=>[(r(!0),b(y,null,w(U.value,n=>(r(),g(a,{key:n.value,value:n.value,label:n.label},null,8,["value","label"]))),128))]),_:2},1032,["modelValue","onUpdate:modelValue"])]),_:1})]),_:1},8,["data","stripe","border","highlight-current-row"])),[[p,k.value]])])}}};export{Y as default};