import{a as Re,_ as $e}from"./index-823f4b27.js";import{T as Oe,a as qe}from"./_@element-plus-ad4c9002.js";import{d as Ge,ai as c,aT as o,aF as He,b5 as Ye,by as Je,bF as ue,c as B,W as l,bD as i,a as s,au as Qe,b9 as g,H as O,A as We,aX as r,aY as Xe,aP as Ke,aM as Ze,aN as q,o as f,bi as G,U as m,I as H,F as Y,aV as ce,Y as et}from"./_@vue-5ba92de9.js";import"./__vendor-5e6ac033.js";import"./_crypto-js-0812dcff.js";import"./_element-plus-8c7ce171.js";import"./_@popperjs-c75af06c.js";import"./_pdfjs-dist-c04561eb.js";import"./_@microsoft-43c4e133.js";import"./_vue-codemirror-50da885a.js";const F=_=>(Ke("data-v-20d0e6e3"),_=_(),Ze(),_),tt={class:"table-container"},at={class:"table-text"},ot={border:"0",class:"table"},lt={width:"65%",align:"center"},nt={width:"17.5%"},it={width:"17.5%"},st=F(()=>s("div",null,[s("h3",{class:"before"},"发票明细")],-1)),rt={class:"table-container"},ut={class:"roadui_pagerdiv"},ct={style:{margin:"auto",width:"80%"}},dt=F(()=>s("span",null,"正在开票中",-1)),vt={style:{"margin-top":"10px",margin:"10px auto",display:"flex","justify-content":"space-around"}},pt={class:"successfa"},gt=F(()=>s("div",{style:{display:"inline-flex","align-items":"center","font-size":"14px"}}," 已开票 ",-1)),ft={class:"errorfa"},mt=F(()=>s("div",{style:{display:"inline-flex","align-items":"center","font-size":"14px"}}," 开票失败 ",-1)),ht=Ge({__name:"tasknoflow",props:{query:{type:String,default:()=>""},modelValue:{type:Boolean,default:!1},id:{type:String,default:""}},emits:["update:id"],setup(_,{emit:de}){const J=et(()=>Re(()=>import("./taskEdit-249c23b5.js"),["./taskEdit-249c23b5.js","./_@vue-5ba92de9.js","./__vendor-5e6ac033.js","./__vendor-693c365c.css","./index-823f4b27.js","./_@element-plus-ad4c9002.js","./_crypto-js-0812dcff.js","./_element-plus-8c7ce171.js","./_@popperjs-c75af06c.js","./_element-plus-7d03f811.css","./_pdfjs-dist-c04561eb.js","./_@microsoft-43c4e133.js","./_vue-codemirror-50da885a.js","./index-2ccff9e2.css","./taskEdit-c1526f24.css"],import.meta.url)),C=c("ajax"),d=c("utils");c("config");const k=c("qs");c("index_openmenu"),c("index_removetab");const ve=c("index_refreshtab"),pe=c("index_userinfo"),ge=c("view_dialogshow"),Q=o({prop:"goodsLineNo",order:"ascending"}),n=o(d.getPager(Q.value)),W=o(!1),h=o("");localStorage.getItem("sobInfo")!=""&&(h.value=JSON.parse(localStorage.getItem("sobInfo")));const v=o(!1),X=o(0),N=o(0),I=o(0),j=o(""),A=o(""),E=o(""),L=o(""),M=o(""),R=o(""),$=o(""),fe=o(),me=o([]),S=o(!1),P=o({Id:"",invoicedepartname:"",taxno:""}),z=o(!1),u=o([]),p=o(0),b=o(0),w=o(0),he=de,_e=_;function be(e){return We({get:()=>_e[e],set:t=>{he(`update:${e}`,t)}})}const we=be("id");He(async()=>{await Z(),await ke()});const y=o([]),K=o([]);async function Z(){v.value=!0;try{const e=await C.post("/Invoice/Get",k.stringify({ids:we.value}));W.value=!0,e.data.invoicemain.length>0&&(j.value=e.data.invoicemain[0].id,y.value=e.data.invoicemain,X.value=e.data.invoicemain.length),N.value=0,I.value=0;for(let t=0;t<e.data.invoicemain.length;t++)N.value=Number((N.value+Number(e.data.invoicemain[t].invoiceTotalPriceTax)).toFixed(2)),I.value=Number((I.value+Number(e.data.invoicemain[t].invoiceTotalTax)).toFixed(2));e.success&&x()}catch{W.value=!1,v.value=!1}finally{v.value=!1}}const ee=o(""),ye=Ye(null),D=o(!1),xe=o([{prop:"serialNo",label:"开票流水号",align:"center",width:"200"},{prop:"buyerName",label:"客户名称",align:"center",width:"250"},{prop:"buyerTaxNo",label:"税号",align:"center",width:"200"},{prop:"invoiceTotalPriceTax",label:"含税金额",align:"right",width:"110"},{prop:"invoiceTotalPrice",label:"无税金额",align:"right",width:"110"},{prop:"invoiceTotalTax",label:"税额",align:"center",width:"110"},{prop:"remarks",label:"备注",align:"center",width:"200"}]),Te=o([{prop:"id",align:"center",show:!1},{prop:"goodsLineNo",label:"序号",align:"center",show:!0,width:"60"},{prop:"goodsCode",label:"商品编号",show:!0,align:"center",width:"200"},{prop:"goodsName",label:"商品名称",show:!0,align:"center",width:"160"},{prop:"goodsSpecification",label:"规格型号",show:!0,align:"center",width:"180"},{prop:"goodsUnit",label:"单位",show:!0,align:"center",width:"100"},{prop:"goodsQuantity",label:"数量",show:!0,align:"center",width:"120"},{prop:"goodsPrice",label:"单价",show:!0,align:"center",width:"120"},{prop:"goodsTotalPrice",label:"价税合计",show:!0,align:"right",width:"120"},{prop:"notaxamount",label:"无税金额",show:!0,align:"right",width:"120"},{prop:"goodsTaxRate",label:"税率/征收率",show:!0,align:"center",width:"200"},{prop:"goodsTotalTax",label:"税额",show:!0,align:"center"}]),Ce=e=>{A.value=e.id,E.value=e.serialNo,L.value=e.buyerTaxNo,M.value=e.buyerName,R.value=e.invoiceTotalPrice,$.value=e.invoiceTotalTax,ye.value=J,ee.value="修改",D.value=!0},ke=async()=>{try{const e=await C.post("user/GetUserInvoiceDepartByUser",k.stringify({userid:pe.value.userId}));e.success&&(me.value=e.data,fe.value=e.data[0].id)}catch{}},Ne=()=>{ge.value=!1},Ie=(e,t)=>{e!=null&&(j.value=e.id,n.value.number=1,x())},te=o({}),x=async()=>{v.value=!0,te.value={id:j.value,size:n.value.size,number:n.value.number,order:n.value.order};try{const e=await C.post("/Invoice/GetInvoiceDetailMain",k.stringify(te.value));K.value=e.data.rows,n.value.total=e.data.total}catch(e){d.msg(e.message,"error",!1)}finally{v.value=!1}},Se=e=>{u.value=Array.from(new Set(e.map(t=>t.id)))},Pe=async()=>{if(u.value==""){d.msg("请选择要开票的数据","warning",!1);return}for(let e=0;e<u.value.length;e++)for(let t=0;t<y.value.length;t++)if(u.value[e]==y.value[t].id&&y.value[t].buyerTaxNo==""){d.msg("请选择有纳税人识别号的数据","warning",!1);return}S.value=!0,P.value.invoicedepartname=h.value.accountname,P.value.taxno=h.value.taxno;for(let e=0;e<u.value.length;e++){P.value.Id=u.value[e];try{await ze()}catch{d.msg("开票失败","error",!1),w.value++}}};Je(p,e=>{b.value=Math.floor((p.value+w.value)/Number(u.value.length)*100),p.value>0,b.value===100&&setTimeout(()=>{S.value=!1},800)});const ze=async()=>{const e=await C.post("/Invoice/OpenInvoice?srcorgid="+h.value.id,k.stringify(P.value));e.code==0?(p.value++,d.notify("第"+p.value+"张",e.msg,"success")):(w.value++,d.notify("",e.msg,"error"))},De=()=>{b.value=0,p.value=0,w.value=0,u.value=[],ve()},Ue=e=>{n.value.size=e,x()},Ve=e=>{n.value.number=e,x()};function ae({row:e,column:t,rowIndex:U,columnIndex:V}){return{color:"#000",textAlign:"center"}}function Be({row:e}){if(e.goodsTotalPrice===0)return{backgroundColor:"yellow"}}function Fe({row:e}){if(e.isedit==1)return{backgroundColor:"#ec5353"}}const je=e=>e<34?"#409eff":e<60?"#e6a23c":"#67c23a";return q("getTableData",Z),q("postSaleDetail",x),q("dialogShow",D),(e,t)=>{const U=r("el-button"),V=r("el-form-item"),oe=r("el-form"),T=r("el-table-column"),le=r("el-table"),Ae=r("el-pagination"),Ee=r("FullScreen"),Le=r("el-icon"),ne=r("el-dialog"),Me=r("el-progress"),ie=r("el-statistic"),se=Xe("loading");return ue((f(),B("div",null,[l(oe,{ref:"formbutton",inline:""},{default:i(()=>[l(V,null,{default:i(()=>[l(U,{icon:G(Oe),type:"primary",onClick:Pe},{default:i(()=>[m("开票")]),_:1},8,["icon"]),l(U,{icon:G(qe),type:"success",onClick:Ne},{default:i(()=>[m("关闭")]),_:1},8,["icon"])]),_:1}),l(V,{label:"开票单位",prop:"sobItemsName"},{default:i(()=>[m(g(h.value.accountname),1)]),_:1}),l(V,{label:"税号",prop:"sobTaxno"},{default:i(()=>[m(g(h.value.taxno),1)]),_:1})]),_:1},512),s("div",tt,[l(le,Qe({data:y.value,stripe:n.value.tableStripe,border:"","highlight-current-row":n.value.tableHighlightCurrentRow,"max-height":"300",style:{width:"100%",color:"#000"},"header-cell-style":ae},e.$attrs,{onCurrentChange:Ie,onSelectionChange:Se,"row-style":Fe}),{default:i(()=>[H("",!0),H("",!0),l(T,{type:"selection",width:"55",align:"center"}),l(T,{type:"index",label:"序号",align:"center",width:"60"}),(f(!0),B(Y,null,ce(xe.value,(a,re)=>(f(),O(T,{key:re,prop:a.prop,label:a.label,align:a.align,fit:"","show-overflow-tooltip":"","min-width":a.width},null,8,["prop","label","align","min-width"]))),128)),l(T,{label:"操作",align:"center",fixed:"right",width:"100"},{default:i(a=>[l(U,{type:"primary",size:"small",onClick:re=>Ce(a.row)},{default:i(()=>[m("修改")]),_:2},1032,["onClick"])]),_:1})]),_:1},16,["data","stripe","highlight-current-row"])]),s("div",at,[s("table",ot,[s("tr",null,[s("td",lt," 发票张数："+g(X.value)+"张 ",1),s("td",nt," 价税合计："+g(N.value)+"元 ",1),s("td",it," 合计税额："+g(I.value)+"元 ",1)])])]),st,s("div",rt,[ue((f(),O(le,{data:K.value,stripe:n.value.tableStripe,border:"","highlight-current-row":n.value.tableHighlightCurrentRow,"max-height":"400",style:{width:"100%",color:"#000"},"header-cell-style":ae,"default-sort":Q.value,"row-style":Be},{default:i(()=>[(f(!0),B(Y,null,ce(Te.value,a=>(f(),B(Y,null,[a.show?(f(),O(T,{key:0,fit:"","show-overflow-tooltip":"",prop:a.prop,label:a.label,align:a.align,width:a.width},null,8,["prop","label","align","width"])):H("",!0)],64))),256))]),_:1},8,["data","stripe","highlight-current-row","default-sort"])),[[se,v.value]])]),s("div",ut,[l(Ae,{currentPage:n.value.number,"onUpdate:currentPage":t[0]||(t[0]=a=>n.value.number=a),"page-size":n.value.size,"onUpdate:pageSize":t[1]||(t[1]=a=>n.value.size=a),"page-sizes":n.value.sizes,background:n.value.background,layout:n.value.layout,total:n.value.total,onSizeChange:Ue,onCurrentChange:Ve},null,8,["currentPage","page-size","page-sizes","background","layout","total"])]),l(ne,{modelValue:D.value,"onUpdate:modelValue":t[9]||(t[9]=a=>D.value=a),fullscreen:z.value,style:{position:"relative"},title:ee.value,"align-center":"","destroy-on-close":"",onClose:t[10]||(t[10]=a=>z.value=!1),width:"1300px",draggable:"","close-on-click-modal":!1},{default:i(()=>[l(G(J),{id:A.value,"onUpdate:id":t[2]||(t[2]=a=>A.value=a),serialNo:E.value,"onUpdate:serialNo":t[3]||(t[3]=a=>E.value=a),buyerTaxNo:L.value,"onUpdate:buyerTaxNo":t[4]||(t[4]=a=>L.value=a),buyerName:M.value,"onUpdate:buyerName":t[5]||(t[5]=a=>M.value=a),invoiceTotalPrice:R.value,"onUpdate:invoiceTotalPrice":t[6]||(t[6]=a=>R.value=a),invoiceTotalTax:$.value,"onUpdate:invoiceTotalTax":t[7]||(t[7]=a=>$.value=a)},null,8,["id","serialNo","buyerTaxNo","buyerName","invoiceTotalPrice","invoiceTotalTax"]),l(Le,{onClick:t[8]||(t[8]=a=>z.value=!z.value),style:{position:"absolute",right:"45px",top:"24px",cursor:"pointer","font-size":"14px"}},{default:i(()=>[l(Ee)]),_:1})]),_:1},8,["modelValue","fullscreen","title"]),l(ne,{modelValue:S.value,"onUpdate:modelValue":t[11]||(t[11]=a=>S.value=a),top:"5vh",title:"完成进度","align-center":"",onClosed:De,"destroy-on-close":"",width:"600px",draggable:"","close-on-click-modal":!1},{default:i(()=>[l(oe,{style:{width:"100%"}},{default:i(()=>[s("div",ct,[l(Me,{"text-inside":!0,"stroke-width":18,color:je,percentage:b.value,striped:"","striped-flow":""},{default:i(()=>[dt,s("span",null,g(b.value)+"%",1)]),_:1},8,["percentage"]),s("div",vt,[s("div",pt,[l(ie,{value:p.value},{title:i(()=>[gt]),suffix:i(()=>[m("/"+g(u.value.length)+"张",1)]),_:1},8,["value"])]),s("div",ft,[l(ie,{value:w.value},{title:i(()=>[mt]),suffix:i(()=>[m("张")]),_:1},8,["value"])])])])]),_:1})]),_:1},8,["modelValue"])])),[[se,v.value]])}}});const St=$e(ht,[["__scopeId","data-v-20d0e6e3"]]);export{St as default};
