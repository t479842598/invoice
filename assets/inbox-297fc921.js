import{ai as f,aT as d,aF as A,c as E,a as p,W as o,bD as n,bF as G,H as S,aX as i,aY as L,o as h,bi as M,U as m,I as B,b9 as y,ay as W}from"./_@vue-5ba92de9.js";const X={class:"roadui_page"},J=["onClick"],K={class:"roadui_note"},Q={class:"roadui_pagerdiv"},te={__name:"inbox",setup(Z){const x=f("ajax"),s=f("utils"),z=f("qs"),U=f("index_openmenu"),u=d({}),c=d([]),r=d(!1),w=d(!1),D=d([]);let b=[];const j=d({prop:"isread,id",order:"descending"}),t=d(s.getPager(j.value));A(()=>{v(!1)});const Y=l=>{b=l},I=l=>{t.value.size=l,v(!1)},N=l=>{t.value.number=l,v(!1)},P=l=>{t.value.order=s.getOrder(l),v(!1)},v=l=>{l&&(t.value.number=1),w.value=!0,r.value=!0,u.value.size=t.value.size,u.value.number=t.value.number,u.value.order=t.value.order,u.value.date1=s.length(c.value)>0?c.value[0]:"",u.value.date2=s.length(c.value)>1?c.value[1]:"",x.post("/Mail/GetInList",z.stringify(u.value)).then(e=>{D.value=e.data.rows,t.value.total=e.data.total,r.value=!1,w.value=!1}).catch(()=>{r.value=!1})},V=l=>{if(b.length===0){s.msg("请选择要删除的邮件！","error");return}s.confirm("您确定要"+(l==1?"彻底":"")+"删除所选邮件吗？",()=>{r.value=!0,x.post("/Mail/DeleteIn",z.stringify({ids:s.getArrayValues(b,"id").join(","),type:l})).then(e=>{let g=e.msg;s.length(g)===0&&(g=e.success?"删除成功！":"删除失败！"),s.msg(g,e.success),r.value=!1,e.success&&(b=[],v(!1))}).catch(()=>{r.value=!1})})},R=l=>{const e={title:l.mailSubject,id:"mail_view_"+l.id,url:"/system/mail/view?id="+l.id+"&source=inbox",ico:"Message",openMode:0};U(e)};return(l,e)=>{const g=i("el-input"),C=i("el-form-item"),$=i("el-date-picker"),k=i("el-button"),O=i("el-form"),_=i("el-table-column"),T=i("el-tag"),q=i("el-table"),F=i("el-pagination"),H=L("loading");return h(),E("div",X,[p("div",null,[o(O,{inline:!0},{default:n(()=>[o(C,{label:"主题"},{default:n(()=>[o(g,{modelValue:u.value.mailSubject,"onUpdate:modelValue":e[0]||(e[0]=a=>u.value.mailSubject=a),style:{width:"200px"},clearable:""},null,8,["modelValue"])]),_:1}),o(C,{label:"日期"},{default:n(()=>[o($,{modelValue:c.value,"onUpdate:modelValue":e[1]||(e[1]=a=>c.value=a),style:{width:"220px"},type:"daterange","value-format":"YYYY-MM-DD","unlink-panels":"","start-placeholder":"开始日期","end-placeholder":"结束日期",shortcuts:M(s).dateShortucts},null,8,["modelValue","shortcuts"])]),_:1}),o(C,null,{default:n(()=>[o(k,{type:"primary",disabled:r.value,onClick:e[2]||(e[2]=a=>v(!0))},{default:n(()=>[m("查询")]),_:1},8,["disabled"]),o(k,{type:"danger",disabled:r.value,onClick:e[3]||(e[3]=a=>V(0))},{default:n(()=>[m("删除")]),_:1},8,["disabled"]),o(k,{type:"danger",disabled:r.value,onClick:e[4]||(e[4]=a=>V(1))},{default:n(()=>[m("彻底删除")]),_:1},8,["disabled"])]),_:1})]),_:1})]),p("div",null,[G((h(),S(q,{data:D.value,stripe:t.value.tableStripe,border:t.value.tableBorder,style:{width:"100%"},"highlight-current-row":t.value.tableHighlightCurrentRow,"default-sort":j.value,onSortChange:P,onSelectionChange:Y},{default:n(()=>[o(_,{type:"selection",width:"45"}),o(_,{prop:"mailSubject",label:"主题",sortable:"custom","show-overflow-tooltip":""},{default:n(a=>[a.row.isRead===0?(h(),S(T,{key:0,effect:"dark",type:"warning",style:{"margin-right":"8px","border-width":"0","vertical-align":"middle"}},{default:n(()=>[m("未读")]),_:1})):B("",!0),a.row.mailType>1?(h(),S(T,{key:1,effect:"dark",style:{"margin-right":"8px","border-width":"0","vertical-align":"middle"},type:a.row.mailType===2?"":"success"},{default:n(()=>[m(y(a.row.mailType===2?"抄送":"密送"),1)]),_:2},1032,["type"])):B("",!0),p("a",{class:"roaduia",href:"javascript:;",onClick:ee=>R(a.row),style:W(M(s).length(a.row.subjectColor)>0?"color:"+a.row.subjectColor:"")},y(a.row.mailSubject),13,J)]),_:1}),o(_,{prop:"senderId",label:"发件人",width:"350",sortable:"custom"},{default:n(a=>[m(y(a.row.sender),1),p("span",K," - "+y(a.row.senderOrg),1)]),_:1}),o(_,{prop:"receiveTime",label:"日期",width:"180",sortable:"custom"})]),_:1},8,["data","stripe","border","highlight-current-row","default-sort"])),[[H,w.value]])]),p("div",Q,[o(F,{currentPage:t.value.number,"onUpdate:currentPage":e[5]||(e[5]=a=>t.value.number=a),"page-size":t.value.size,"onUpdate:pageSize":e[6]||(e[6]=a=>t.value.size=a),"page-sizes":t.value.sizes,background:t.value.background,layout:t.value.layout,total:t.value.total,disabled:r.value,onSizeChange:I,onCurrentChange:N},null,8,["currentPage","page-size","page-sizes","background","layout","total","disabled"])])])}}};export{te as default};