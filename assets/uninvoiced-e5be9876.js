import{a as ul,_ as il}from"./index-823f4b27.js";import{M as dl,R as cl,U as Ce}from"./_@element-plus-ad4c9002.js";import{cC as se}from"./__vendor-5e6ac033.js";import xe from"./Transfer-49f22145.js";import{d as vl,ai as y,aT as o,aF as fl,by as pl,b5 as ml,c as D,a as I,W as t,bD as n,bF as gl,H as P,au as bl,aX as c,aY as _l,aN as Ve,o as p,U as m,bi as A,F as B,aV as W,b9 as hl,I as X,Y as yl,aP as wl,aM as kl}from"./_@vue-5ba92de9.js";import"./_crypto-js-0812dcff.js";import"./_element-plus-8c7ce171.js";import"./_@popperjs-c75af06c.js";import"./_pdfjs-dist-c04561eb.js";import"./_@microsoft-43c4e133.js";import"./_vue-codemirror-50da885a.js";const Cl=G=>(wl("data-v-c2b8875e"),G=G(),kl(),G),xl={class:"form-container"},Vl={class:"table-container"},Sl={class:"roadui_pagerdiv"},Dl={class:"detail-container"},Il=Cl(()=>I("h3",{class:"before"},"商品明细",-1)),zl={class:"table-bottom"},Ul={class:"roadui_pagerdiv"},Tl=vl({__name:"uninvoiced",setup(G){const re=yl(()=>ul(()=>import("./tasknoflow-2e835abc.js"),["./tasknoflow-2e835abc.js","./index-823f4b27.js","./__vendor-5e6ac033.js","./_@vue-5ba92de9.js","./__vendor-693c365c.css","./_@element-plus-ad4c9002.js","./_crypto-js-0812dcff.js","./_element-plus-8c7ce171.js","./_@popperjs-c75af06c.js","./_element-plus-7d03f811.css","./_pdfjs-dist-c04561eb.js","./_@microsoft-43c4e133.js","./_vue-codemirror-50da885a.js","./index-2ccff9e2.css","./tasknoflow-0d08588d.css"],import.meta.url)),g=y("ajax"),v=y("utils");y("config"),y("index_userinfo");const w=y("qs");y("index_openmenu"),y("index_removetab");const Se=y("index_refreshtab"),z=o(!1),O=o(!1),k=o(!1),U=o(!1),Q=o({prop:"日期",order:"descending"}),ue=o({prop:"商品编号",order:"ascending"}),u=o(v.getPager(Q.value)),i=o(v.getPager(ue.value)),_=o("");localStorage.getItem("sobInfo")!=""&&(_.value=JSON.parse(localStorage.getItem("sobInfo")));const C=o([]),L=o(!1),De=o(0),Ie=o(0),Z=o("");o(!1);const M=o(""),ee=o(!1),le=o(!1),ie=o({}),Y=o(!1),E=o(!1),ae=o("待开票"),x=o({no:""}),ze=o(""),R=o("");fl(()=>{h(!1),Ue()});const Ue=async()=>{try{const l=await g.post("/Systemset/Get?srcorgid="+_.value.id,{});ze.value=l.data.invoicesystemset,R.value=l.data.invoicesystemset.默认发票类型}catch{}},d=o({单据号:"",客户名称:"",日期:v.getMonth(),制单人:""}),b=o(),de=o([]),Te=o([{id:"01",label:"全电专用发票"},{id:"02",label:"全电普通发票"}]);pl(b,(l,e)=>{h(!0)});const V=o([]),S=o([]),te=o(),oe=o(),ce=o([]),ne=o([]),h=async l=>{try{l&&(u.value.number=1),k.value=!0,U.value=!0,z.value=!0,d.value.size=u.value.size,d.value.number=u.value.number,d.value.order=u.value.order,d.value.connid=b.value;const e=await g.post("/SaleInvoice/GetSaleMain",w.stringify(d.value));ce.value=e.data.rows,u.value.total=e.data.total,i.value.total=e.data.total,k.value=!1,U.value=!1,e.data.total==0?(z.value=!0,O.value=!0):(z.value=!1,O.value=!1),e.data.rows.length>0&&(Z.value=e.data.rows[0].id,$()),await Ne()}catch{z.value=!1,k.value=!1}},ve=o([]),fe=o([]),T=o([]),N=o([]),Ne=async()=>{try{k.value=!0,U.value=!0;const l=await g.post("/cn_columns/Get",w.stringify({connid:b.value}));V.value=l.data.maincolumns,S.value=l.data.detailcolumns,ve.value=l.data.maincolumns.filter(e=>e.isvisible===!1),T.value=l.data.maincolumns.filter(e=>e.isvisible===!0),te.value=V.value.map(e=>e.label),fe.value=l.data.detailcolumns.filter(e=>e.isvisible===!1),N.value=l.data.detailcolumns.filter(e=>e.isvisible===!0),oe.value=S.value.map(e=>e.label),te.value=te.value.filter(e=>{const s=V.value.find(r=>r.label===e);return s&&s.isvisible}),oe.value=oe.value.filter(e=>{const s=S.value.find(r=>r.label===e);return s&&s.isvisible}),k.value=!1,U.value=!1}catch{z.value=!1,k.value=!1}},pe=o(""),Pe=ml(null),H=o(!1),me=o(0);function Be(){se.debounce(()=>{if(!C.value.length)return v.msg("没有选择任何数据","error",!1);if(C.value.length>1&&!C.value.every(l=>l.客户名称===C.value[0].客户名称))return v.msg("请选择批量开票","warning",!1);ge(me.value=0)},300)()}function Oe(){se.debounce(()=>{if(!C.value.length)return v.msg("没有选择任何数据","error",!1);ge(me.value=1)},300)()}async function ge(l){try{const e=await g.post("/Invoice/SaveFromSaleBill?srcorgid="+_.value.id,w.stringify({connid:b.value,invoiceTypeCode:R.value,invoiceJSON:JSON.stringify(C.value),pl:l,sellerBankName:_.value.openbank,sellerBankNumber:_.value.bankaccount,sellerAddress:_.value.address,sellerPhone:_.value.phone}));e.code===0?(M.value=e.data,pe.value=l.value===0?"合并开票":"批量开票",[Pe.value,H.value]=[re,!0]):e.code===-1&&v.msg(e.msg,"error",!1)}catch(e){e.message==="Network Error"?v.msg("网络请求失败，请检查你的网络连接","error",!1):v.msg(e.message,"error",!1)}}const Me=()=>{L.value=!0},Fe=()=>{h(!0),L.value=!1},Je=()=>{se.debounce(()=>{d.value={单据号:"",客户名称:"",日期:""},h(!0)},300)()},Ae=()=>{d.value={单据号:"",客户名称:"",日期:""}},Ge=async()=>{try{const l=await g.post("user/GetUserAccountByUser?srcorgid="+_.value.id,w.stringify({userid:ie.value.userId}));l.success&&l.data.length>0&&(b.value=l.data[0].id,de.value=l.data)}catch{}};(()=>{g.post("/Home/GetIndexInfo").then(l=>{l.success&&(ie.value=l.data.userInfo,Ge())}).catch(()=>{})})();const Le=async()=>{try{(await g.post("/cn_columns/Save",w.stringify({maincolumnsJSON:JSON.stringify(V.value),detailcolumnsJSON:JSON.stringify(S.value)}))).success&&(v.msg("保存成功","success",!1),Se())}catch(l){v.msg(l.message,"error",!1)}},Ye=l=>{u.value.size=l,h(!1)},Ee=l=>{u.value.number=l,h(!1)},Re=l=>{i.value.size=l,$()},He=l=>{i.value.number=l,$()},$e=(l,e)=>{l!=null&&(Z.value=l.id,i.value.number=1,$())},be=o({}),$=async()=>{U.value=!0,be.value={saleid:Z.value,connid:b.value,size:i.value.size,number:i.value.number,order:i.value.order};try{const l=await g.post("/SaleInvoice/GetSaleDetailMain",w.stringify(be.value));ne.value=l.data.rows,i.value.total=l.data.total,l.data.total==0?O.value=!0:O.value=!1}catch(l){v.msg(l.message,"error",!1)}finally{U.value=!1}},je=l=>{C.value=l};function _e({row:l,column:e,rowIndex:s,columnIndex:r}){return{color:"#000",textAlign:"center"}}const he=()=>{x.value.no="",Y.value=!1},qe=(l,e)=>{x.value.no=l,x.value.no==""?ae.value="待开票":ae.value="已开票",M.value=e,Y.value=!0},Ke=async()=>{try{(await g.post("/SaleInvoice/UpdateInvoiceNo",w.stringify({id:M.value,invoiceno:x.value.no,connid:b.value,type:ae.value}))).success&&(v.msg("保存成功","success",!1),he(),h(!1))}catch(l){v.msg(l.message,"error",!1)}};function We(){ne.value=[]}const Xe=()=>{ee.value=!0},Qe=()=>{le.value=!0};function Ze(l){V.value=V.value.map(e=>{const s={...e},r=l.find(f=>f.label===s.label);if(r)s.isvisible=!0,r.label===s.label&&!T.value.some(f=>f.label===s.label)&&T.value.push(s);else{s.isvisible=!1;const f=T.value.findIndex(F=>F.label===s.label);f!==-1&&T.value.splice(f,1)}return s})}function el(l){S.value=S.value.map(e=>{const s={...e},r=l.find(f=>f.label===s.label);if(r)s.isvisible=!0,r.label===s.label&&!N.value.some(f=>f.label===s.label)&&N.value.push(s);else{s.isvisible=!1;const f=N.value.findIndex(F=>F.label===s.label);f!==-1&&N.value.splice(f,1)}return s})}const ll=l=>{u.value.order=v.getOrder(l),h(!1)};return Ve("view_dialogshow",H),Ve("Savecolum",Le),(l,e)=>{const s=c("el-button"),r=c("el-form-item"),f=c("el-option"),F=c("el-select"),al=c("el-radio"),tl=c("el-radio-group"),ye=c("el-popover"),j=c("el-form"),q=c("el-table-column"),we=c("el-table"),ke=c("el-pagination"),ol=c("FullScreen"),nl=c("el-icon"),J=c("el-dialog"),K=c("el-input"),sl=c("el-date-picker"),rl=_l("loading");return p(),D("div",null,[I("div",xl,[t(j,{inline:!0},{default:n(()=>[t(r,null,{default:n(()=>[t(s,{type:"primary",onClick:Be},{default:n(()=>[m("合并开票")]),_:1}),t(s,{type:"primary",onClick:Oe},{default:n(()=>[m("批量开票")]),_:1})]),_:1}),t(r,null,{default:n(()=>[t(s,{type:"primary",onClick:Me,icon:A(dl)},{default:n(()=>[m("查询")]),_:1},8,["icon"]),t(s,{type:"success",onClick:Je,icon:A(cl)},{default:n(()=>[m("刷新")]),_:1},8,["icon"])]),_:1}),t(r,{label:"账套选择"},{default:n(()=>[t(F,{modelValue:b.value,"onUpdate:modelValue":e[0]||(e[0]=a=>b.value=a),onChange:We,placeholder:"请选择账套",style:{width:"200px"}},{default:n(()=>[(p(!0),D(B,null,W(de.value,a=>(p(),P(f,{key:a.id,label:a.label,value:a.id},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),t(r,{label:"发票类型"},{default:n(()=>[t(tl,{modelValue:R.value,"onUpdate:modelValue":e[1]||(e[1]=a=>R.value=a)},{default:n(()=>[(p(!0),D(B,null,W(Te.value,a=>(p(),P(al,{label:a.id,border:""},{default:n(()=>[m(hl(a.label),1)]),_:2},1032,["label"]))),256))]),_:1},8,["modelValue"])]),_:1}),t(r,{style:{float:"right"}},{default:n(()=>[t(ye,{placement:"top-start",title:"列设置",width:"150",trigger:"hover",content:"点击打开"},{reference:n(()=>[t(s,{icon:A(Ce),style:{"text-align":"right"},circle:"",onClick:Xe},null,8,["icon"])]),_:1})]),_:1})]),_:1})]),I("div",Vl,[gl((p(),P(we,bl({data:ce.value,key:De.value,stripe:u.value.tableStripe,border:"","highlight-current-row":u.value.tableHighlightCurrentRow,style:{width:"100%",color:"#000"},"max-height":"300","header-cell-style":_e,"default-sort":Q.value,onSelectionChange:je},l.$attrs,{onCurrentChange:$e,onSortChange:ll}),{default:n(()=>[X("",!0),t(q,{type:"selection",width:"55",align:"center"}),(p(!0),D(B,null,W(V.value,a=>(p(),D(B,null,[a.isvisible?(p(),P(q,{key:a.prop,prop:a.label,label:a.label,align:"center","min-width":"210%","default-sort":Q.value,sortable:a.sortable,fit:"","show-overflow-tooltip":""},null,8,["prop","label","default-sort","sortable"])):X("",!0)],64))),256)),t(q,{label:"操作",align:"center",width:"120",fixed:"right"},{default:n(a=>[t(s,{type:"primary",size:"small",onClick:Pl=>qe(a.row.发票号,a.row.id)},{default:n(()=>[m("回写发票号")]),_:2},1032,["onClick"])]),_:1})]),_:1},16,["data","stripe","highlight-current-row","default-sort"])),[[rl,k.value]])]),I("div",Sl,[t(ke,{currentPage:u.value.number,"onUpdate:currentPage":e[2]||(e[2]=a=>u.value.number=a),"page-size":u.value.size,"onUpdate:pageSize":e[3]||(e[3]=a=>u.value.size=a),"page-sizes":u.value.sizes,background:u.value.background,layout:u.value.layout,total:u.value.total,disabled:z.value,onSizeChange:Ye,onCurrentChange:Ee},null,8,["currentPage","page-size","page-sizes","background","layout","total","disabled"])]),I("div",Dl,[t(j,{inline:!0},{default:n(()=>[t(r,null,{default:n(()=>[Il]),_:1}),t(r,{style:{float:"right","margin-top":"10px"}},{default:n(()=>[t(ye,{placement:"top-start",title:"列设置",width:"150",trigger:"hover",content:"点击打开"},{reference:n(()=>[t(s,{icon:A(Ce),style:{"text-align":"right"},circle:"",onClick:Qe},null,8,["icon"])]),_:1})]),_:1})]),_:1})]),I("div",zl,[(p(),P(we,{data:ne.value,key:Ie.value,align:"center",stripe:u.value.tableStripe,border:"","highlight-current-row":u.value.tableHighlightCurrentRow,style:{width:"100%",color:"#000"},"max-height":"280","header-cell-style":_e,"default-sort":ue.value},{default:n(()=>[X("",!0),(p(!0),D(B,null,W(S.value,a=>(p(),D(B,null,[a.isvisible?(p(),P(q,{prop:a.prop,label:a.label,width:a.width,key:a.prop,align:"center"},null,8,["prop","label","width"])):X("",!0)],64))),256))]),_:1},8,["data","stripe","highlight-current-row","default-sort"]))]),I("div",Ul,[t(ke,{currentPage:i.value.number,"onUpdate:currentPage":e[4]||(e[4]=a=>i.value.number=a),"page-size":i.value.size,"onUpdate:pageSize":e[5]||(e[5]=a=>i.value.size=a),"page-sizes":i.value.sizes,background:i.value.background,layout:i.value.layout,total:i.value.total,disabled:O.value,onSizeChange:Re,onCurrentChange:He},null,8,["currentPage","page-size","page-sizes","background","layout","total","disabled"])]),t(J,{modelValue:H.value,"onUpdate:modelValue":e[8]||(e[8]=a=>H.value=a),fullscreen:E.value,style:{position:"relative"},title:pe.value,"align-center":"","destroy-on-close":"",width:"1300px",onClose:e[9]||(e[9]=a=>E.value=!1),draggable:"","close-on-click-modal":!1},{default:n(()=>[t(A(re),{id:M.value,"onUpdate:id":e[6]||(e[6]=a=>M.value=a)},null,8,["id"]),t(nl,{onClick:e[7]||(e[7]=a=>E.value=!E.value),style:{position:"absolute",right:"45px",top:"24px",cursor:"pointer","font-size":"14px"}},{default:n(()=>[t(ol)]),_:1})]),_:1},8,["modelValue","fullscreen","title"]),t(J,{modelValue:L.value,"onUpdate:modelValue":e[14]||(e[14]=a=>L.value=a),title:"查询","align-center":"","destroy-on-close":"",width:"800px",draggable:"","close-on-click-modal":!1},{default:n(()=>[t(j,{inline:"",model:d.value,class:"inline","label-width":"100px"},{default:n(()=>[t(r,{label:"单据号"},{default:n(()=>[t(K,{modelValue:d.value.单据号,"onUpdate:modelValue":e[10]||(e[10]=a=>d.value.单据号=a)},null,8,["modelValue"])]),_:1}),t(r,{label:"客户名称"},{default:n(()=>[t(K,{modelValue:d.value.客户名称,"onUpdate:modelValue":e[11]||(e[11]=a=>d.value.客户名称=a)},null,8,["modelValue"])]),_:1}),t(r,{label:"制单人"},{default:n(()=>[t(K,{modelValue:d.value.制单人,"onUpdate:modelValue":e[12]||(e[12]=a=>d.value.制单人=a)},null,8,["modelValue"])]),_:1}),t(r,{label:"日期"},{default:n(()=>[t(sl,{modelValue:d.value.日期,"onUpdate:modelValue":e[13]||(e[13]=a=>d.value.日期=a),style:{width:"200px"},type:"daterange","value-format":"YYYY-MM-DD",clearable:""},null,8,["modelValue"])]),_:1}),t(r,{style:{"margin-left":"50px"}},{default:n(()=>[t(s,{type:"primary",onClick:Fe},{default:n(()=>[m("查询")]),_:1}),t(s,{type:"success",onClick:Ae},{default:n(()=>[m("重置")]),_:1})]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"]),t(J,{modelValue:ee.value,"onUpdate:modelValue":e[15]||(e[15]=a=>ee.value=a),title:"列设置","align-center":"","destroy-on-close":"",width:"800px",draggable:"","close-on-click-modal":!1},{default:n(()=>[t(xe,{class:"box-width",titles:["已隐藏列表","已显示列表"],filterable:!0,filterPlaceholder:"请输入",leftTransferData:ve.value,rightTransferData:T.value,onTransferChange:Ze},null,8,["leftTransferData","rightTransferData"])]),_:1},8,["modelValue"]),t(J,{modelValue:le.value,"onUpdate:modelValue":e[16]||(e[16]=a=>le.value=a),title:"列设置","align-center":"","destroy-on-close":"",width:"800px",draggable:"","close-on-click-modal":!1},{default:n(()=>[t(xe,{class:"box-width",titles:["已隐藏列表","已显示列表"],filterable:!0,filterPlaceholder:"请输入",leftTransferData:fe.value,rightTransferData:N.value,onTransferChange:el},null,8,["leftTransferData","rightTransferData"])]),_:1},8,["modelValue"]),t(J,{modelValue:Y.value,"onUpdate:modelValue":e[18]||(e[18]=a=>Y.value=a),title:"发票号修改","align-center":"","destroy-on-close":"",width:"500px"},{default:n(()=>[t(j,{model:x.value,class:"inline","label-width":"100px"},{default:n(()=>[t(r,{label:"发票号"},{default:n(()=>[t(K,{modelValue:x.value.no,"onUpdate:modelValue":e[17]||(e[17]=a=>x.value.no=a),style:{width:"300px"}},null,8,["modelValue"])]),_:1}),t(r,null,{default:n(()=>[t(s,{type:"primary",onClick:Ke},{default:n(()=>[m("保存")]),_:1}),t(s,{type:"success",onClick:he},{default:n(()=>[m("取消")]),_:1})]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"])])}}});const Hl=il(Tl,[["__scopeId","data-v-c2b8875e"]]);export{Hl as default};
