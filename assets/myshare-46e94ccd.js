import{ai as f,aT as p,aF as G,c as N,a as g,W as o,bD as n,bF as I,H as b,aX as s,aY as L,o as _,U as u,b9 as y}from"./_@vue-5ba92de9.js";const X=["onClick"],Y={key:1},J={class:"roadui_pagerdiv"},ee={__name:"myshare",setup(K){const C=f("ajax"),i=f("utils"),k=f("qs"),V=f("config"),c=p([]),S=p([]),r=p(!1),h=p(!1),z=p({prop:"sharetime",order:"ascending"}),e=p(i.getPager(z.value)),T=f("index_openmenu");let w=[];G(()=>{d(!1)});const d=a=>{a&&(e.value.number=1),h.value=!0,r.value=!0,c.value.size=e.value.size,c.value.number=e.value.number,c.value.order=e.value.order,C.post("/File/GetMyShareList",k.stringify(c.value)).then(t=>{S.value=t.data.rows,e.value.total=t.data.total,r.value=!1,h.value=!1}).catch(()=>{r.value=!1})},U=a=>{w=a},B=a=>{e.value.order=i.getOrder(a),d(!1)},F=a=>{e.value.size=a,d(!1)},j=a=>{e.value.number=a,d(!1)},E=a=>{i.showFile(T,{name:a.fileName,id:a.fileId},V.SERVER_WEBADDRESS,!1)},R=()=>{if(w.length===0){i.msg("请选择要取消分享的文件！",!1);return}i.confirm("您确定要取消分享吗？",()=>{C.post("/File/CancelShare",k.stringify({ids:i.getArrayValues(w,"id").join(",")})).then(a=>{let t=a.msg;i.length(t)===0&&(a.success?t="取消分享成功！":t="取消分享失败！"),i.msg(t,a.success),r.value=!1,a.success&&d(!1)}).catch(()=>{r.value=!1})})};return(a,t)=>{const P=s("el-input"),x=s("el-form-item"),D=s("el-button"),O=s("el-form"),m=s("el-table-column"),$=s("Document"),q=s("el-icon"),v=s("el-tag"),A=s("el-tooltip"),H=s("el-table"),M=s("el-pagination"),W=L("loading");return _(),N("div",null,[g("div",null,[o(O,{inline:!0},{default:n(()=>[o(x,{label:"名称"},{default:n(()=>[o(P,{modelValue:c.value.fileName,"onUpdate:modelValue":t[0]||(t[0]=l=>c.value.fileName=l),clearable:"",style:{width:"180px"}},null,8,["modelValue"])]),_:1}),o(x,null,{default:n(()=>[o(D,{type:"primary",disabled:r.value,onClick:t[1]||(t[1]=l=>d(!0))},{default:n(()=>[u("查询")]),_:1},8,["disabled"]),o(D,{type:"primary",disabled:r.value,onClick:t[2]||(t[2]=l=>R())},{default:n(()=>[u("取消分享")]),_:1},8,["disabled"])]),_:1})]),_:1})]),g("div",null,[I((_(),b(H,{data:S.value,stripe:e.value.tableStripe,border:e.value.tableBorder,style:{width:"100%"},"highlight-current-row":e.value.tableHighlightCurrentRow,"default-sort":z.value,onSortChange:B,onSelectionChange:U},{default:n(()=>[o(m,{type:"selection",width:"45"}),o(m,{prop:"fileName",label:"名称",sortable:"custom"},{default:n(l=>[g("a",{class:"roaduia",href:"javascript:;",onClick:Q=>E(l.row)},[o(q,{class:"roadui_main_tabico",style:{"vertical-align":"middle"}},{default:n(()=>[o($)]),_:1}),u(" "+y(l.row.fileName),1)],8,X)]),_:1}),o(m,{prop:"shareTime",label:"分享时间",width:"150",sortable:"custom"}),o(m,{prop:"expireTime",label:"失效时间",width:"150",sortable:"custom"},{default:n(l=>[l.row.expireTime==="0"?(_(),b(v,{key:0},{default:n(()=>[u("永久有效")]),_:1})):(_(),N("span",Y,y(l.row.expireTime),1))]),_:1}),o(m,{prop:"toUserName",label:"接收人",width:"120",sortable:"custom"},{default:n(l=>[o(A,{content:l.row.toUserOrg,placement:"top"},{default:n(()=>[o(v,{style:{"user-select":"none"}},{default:n(()=>[u(y(l.row.toUserName),1)]),_:2},1024)]),_:2},1032,["content"])]),_:1}),o(m,{prop:"isView",label:"查看",width:"80",sortable:"custom"},{default:n(l=>[l.row.isView===1?(_(),b(v,{key:0},{default:n(()=>[u("是")]),_:1})):(_(),b(v,{key:1,type:"info"},{default:n(()=>[u("否")]),_:1}))]),_:1})]),_:1},8,["data","stripe","border","highlight-current-row","default-sort"])),[[W,h.value]])]),g("div",J,[o(M,{currentPage:e.value.number,"onUpdate:currentPage":t[3]||(t[3]=l=>e.value.number=l),"page-size":e.value.size,"onUpdate:pageSize":t[4]||(t[4]=l=>e.value.size=l),"page-sizes":e.value.sizes,background:e.value.background,layout:e.value.layout,total:e.value.total,disabled:r.value,onSizeChange:F,onCurrentChange:j},null,8,["currentPage","page-size","page-sizes","background","layout","total","disabled"])])])}}};export{ee as default};
