import{ai as b,aT as c,A as I,aF as j,c as L,a as v,W as a,bD as s,bI as q,bF as A,H as F,aX as u,aY as H,o as C,U as _,b9 as M}from"./_@vue-5ba92de9.js";const $={class:"roadui_page"},E=v("span",null,"操作",-1),G={class:"roadui_pagerdiv"},Y={__name:"onlineuser",setup(R){const f=b("ajax"),p=b("utils"),k=b("qs"),n=c(!1),m=c(!1),i=c({}),h=c([]),w=c({prop:"logintime",order:"descending"}),e=c(p.getPager(w.value)),T=I(()=>l=>{switch(l){case 0:return"电脑端";case 1:return"企业微信";case 3:return"钉钉";case 4:return"APP";case 5:return"微信小程序";default:return""}});j(()=>{d(!1)});const D=l=>{e.value.size=l,d(!1)},x=l=>{e.value.number=l,d(!1)},O=l=>{e.value.order=p.getOrder(l),d(!1)},d=l=>{l&&(e.value.number=1),m.value=!0,n.value=!0,i.value.size=e.value.size,i.value.number=e.value.number,i.value.order=e.value.order,f.post("/Organize/GetOnlineUserList",k.stringify(i.value)).then(t=>{h.value=t.data.rows,e.value.total=t.data.total,n.value=!1,m.value=!1}).catch(()=>{n.value=!1})},S=l=>{p.confirm("您确定要将该用户强制离线吗？",()=>{n.value=!0,f.post("/Organize/OnlineUserLogout?id="+l.id+"&userid="+l.userId+"&clientid="+l.clientId).then(t=>{let g=t.msg;p.length(g)===0&&(g=t.success?"操作成功！":"操作失败！"),p.msg(g,t.success),n.value=!1,t.success&&d()}).catch(()=>{})})};return(l,t)=>{const g=u("el-input"),z=u("el-form-item"),y=u("el-button"),N=u("el-form"),r=u("el-table-column"),P=u("el-tag"),U=u("el-table"),V=u("el-pagination"),B=H("loading");return C(),L("div",$,[v("div",null,[a(N,{inline:!0,onSubmit:t[2]||(t[2]=q(()=>{},["prevent"]))},{default:s(()=>[a(z,{label:"姓名"},{default:s(()=>[a(g,{modelValue:i.value.userName,"onUpdate:modelValue":t[0]||(t[0]=o=>i.value.userName=o),style:{width:"200px"},clearable:""},null,8,["modelValue"])]),_:1}),a(z,null,{default:s(()=>[a(y,{type:"primary",disabled:n.value,onClick:t[1]||(t[1]=o=>d(!0))},{default:s(()=>[_("查询")]),_:1},8,["disabled"])]),_:1})]),_:1})]),v("div",null,[A((C(),F(U,{data:h.value,stripe:e.value.tableStripe,border:e.value.tableBorder,style:{width:"100%"},"highlight-current-row":e.value.tableHighlightCurrentRow,"default-sort":w.value,onSortChange:O},{default:s(()=>[a(r,{prop:"userName",label:"姓名",width:"110",sortable:"custom"}),a(r,{prop:"userOrganize",label:"组织",width:"260",sortable:"custom"}),a(r,{prop:"loginTime",label:"登录时间",width:"145",sortable:"custom"}),a(r,{prop:"loginIp",label:"登录ip",width:"140",sortable:"custom"}),a(r,{prop:"lastTime",label:"活动时间",width:"145",sortable:"custom"}),a(r,{prop:"agent",label:"客户端信息",sortable:"custom","show-overflow-tooltip":""}),a(r,{prop:"loginType",label:"登录类型",width:"120",sortable:"custom"},{default:s(o=>[a(P,null,{default:s(()=>[_(M(T.value(o.row.loginType)),1)]),_:2},1024)]),_:1}),a(r,{width:"80"},{header:s(()=>[E]),default:s(o=>[a(y,{size:"small",disabled:n.value,type:"primary",onClick:W=>S(o.row)},{default:s(()=>[_("离线")]),_:2},1032,["disabled","onClick"])]),_:1})]),_:1},8,["data","stripe","border","highlight-current-row","default-sort"])),[[B,m.value]])]),v("div",G,[a(V,{currentPage:e.value.number,"onUpdate:currentPage":t[3]||(t[3]=o=>e.value.number=o),"page-size":e.value.size,"onUpdate:pageSize":t[4]||(t[4]=o=>e.value.size=o),"page-sizes":e.value.sizes,background:e.value.background,layout:e.value.layout,total:e.value.total,disabled:n.value,onSizeChange:D,onCurrentChange:x},null,8,["currentPage","page-size","page-sizes","background","layout","total","disabled"])])])}}};export{Y as default};
