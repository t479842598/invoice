import{ai as P,aT as m,aF as Xe,by as Ke,c as C,W as a,bD as o,a as r,bF as v,H as A,b9 as p,A as Ze,aX as g,aY as el,o as w,U as N,I as $,bv as f,F as O,aV as re,aP as ll,aM as al}from"./_@vue-5ba92de9.js";import"./__vendor-5e6ac033.js";import{_ as tl}from"./index-823f4b27.js";import{a as ue}from"./_element-plus-8c7ce171.js";import"./_@element-plus-ad4c9002.js";import"./_crypto-js-0812dcff.js";import"./_pdfjs-dist-c04561eb.js";import"./_@microsoft-43c4e133.js";import"./_vue-codemirror-50da885a.js";import"./_@popperjs-c75af06c.js";const G=U=>(ll("data-v-8a7b3d76"),U=U(),al(),U),ol={style:{height:"86.7vh",overflow:"hidden","overflow-y":"scroll"}},nl={border:"1",cellpadding:"1",cellspacing:"1",style:{"line-height":"50px","border-color":"#99938f","border-width":"1px",color:"#6f4946",width:"100%","margin-bottom":"0"},class:"table maintable"},rl={class:"type",colspan:"4",height:"50",style:{"padding-left":"5px","font-weight":"bold",color:"#6f4946"}},ul={colspan:"4",height:"50",class:"type",style:{"padding-left":"5px","font-weight":"bold",color:"#6f4946"}},sl={style:{height:"100px !important"}},il=G(()=>r("td",{width:"26",class:"center vertical-text",style:{"font-weight":"bolder"}},"购买方",-1)),dl={colspan:"3",width:"250",style:{padding:"15px 10px 0px 10px"}},pl={style:{display:"inline-block",width:"40px"}},cl=G(()=>r("td",{width:"26",class:"center vertical-text",style:{"font-weight":"bolder"}},"销售方",-1)),ml={colspan:"3",width:"250",style:{padding:"15px 10px 0px 10px"}},vl={class:"black"},gl={class:"black"},fl={class:"black"},bl={class:"black"},hl={class:"black"},yl={class:"black"},wl={key:1},Nl={border:"1",cellpadding:"1",cellspacing:"1",style:{"line-height":"50px","border-color":"#99938f","border-width":"1px",color:"#6f4946",width:"100%","margin-bottom":"0"},class:"table remarkTable"},_l={colspan:"8",height:"40",class:"amountshow"},Tl={style:{display:"flex","justify-content":"space-around"}},kl={style:{height:"100px !important"}},xl=G(()=>r("td",{width:"26",class:"center vertical-text",style:{"font-weight":"bolder"}},"备注",-1)),Pl={colspan:"3",width:"270",style:{padding:"0"}},Bl=G(()=>r("td",{width:"26",class:"center vertical-text",style:{"font-weight":"bolder"}},"交付到",-1)),Vl={colspan:"3",width:"250",style:{padding:"15px 10px 0px 10px !important"}},Sl={class:"roadui_pagerdiv"},Cl={__name:"taskEdit",props:{query:{type:String,default:()=>""},modelValue:{type:Boolean,default:!1},id:{type:String,default:""},serialNo:{type:String,default:""},buyerTaxNo:{type:String,default:""},buyerName:{type:String,default:""},invoiceTotalPrice:{type:String,default:""},invoiceTotalTax:{type:String,default:""},billcode:{type:String,default:""}},emits:["update:id","update:serialNo","update:buyerTaxNo","update:buyerName","update:invoiceTotalPrice","update:invoiceTotalTax","update:billcode"],setup(U,{expose:se,emit:ie}){const _=P("ajax"),b=P("utils"),V=P("qs");P("config");const de=P("getTableData");P("postSaleDetail");const pe=P("dialogShow"),ce=P("index_refreshtab"),L=m({prop:"goodsLineNo",order:"ascending"}),q=m(b.getPager(L.value));m(!1);const F=m(!1),j=m([]),T=m([]),J=m(0),I=m(!1),Y=m([]),M=m(""),Q=m(!1),h=m(b.getPager(L.value)),S=m({projectname:""}),y=m("");localStorage.getItem("sobInfo")!=""&&(y.value=JSON.parse(localStorage.getItem("sobInfo"))),Xe(()=>{Se(),Pe()});const me=ie,ve=U;function z(l){return Ze({get:()=>ve[l],set:t=>{me(`update:${l}`,t)}})}const B=z("id"),ge=z("serialNo"),fe=z("buyerTaxNo"),be=z("buyerName"),he=z("billcode"),e=m({id:"",serialNo:"",buyerTaxNo:"",buyerName:"",buyerPhone:"",buyerAddress:"",buyerBankAccount:"",buyerBankName:"",remarks:"",buyerEmail:"",sellerName:"",sellerTaxNo:"",sellerAddress:"",sellerAddressPhone:"",sellerBankName:"",sellerBankNumber:"",invoiceTotalPrice:"",invoiceTotalPriceTax:"",invoiceTotalTax:"",invoiceTypeName:"",buyerNaturalPerson:"N"}),ye=m([{prop:"id",align:"center",show:!1,useTemplate:!1},{prop:"goodsLineNo",label:"序号",align:"center",useTemplate:!1,show:!1,width:"75"},{prop:"goodsCode",label:"商品编号",show:!0,useTemplate:!1,align:"center",width:"150"},{prop:"goodsName",label:"商品名称",show:!0,useTemplate:!1,align:"center",width:"200"},{prop:"spec",label:"规格型号",show:!0,useTemplate:!1,align:"center",width:"160"},{prop:"unitname",label:"单位",show:!0,align:"center",useTemplate:!1,width:"100"},{prop:"taxrate",label:"税率(%)",show:!0,align:"center",useTemplate:!1,minWidth:"150%"},{prop:"goodsQuantity",label:"数量",show:!1,align:"center",useTemplate:!1,width:"120"},{prop:"goodsPrice",label:"单价",show:!1,align:"center",useTemplate:!1,width:"120"},{prop:"goodsTotalPrice",label:"价税合计",show:!1,align:"right",useTemplate:!1,width:"120"},{prop:"notaxamount",label:"无税金额",show:!1,align:"right",useTemplate:!1,width:"120"},{prop:"goodsTotalTax",label:"税额",show:!1,useTemplate:!1,align:"center",width:"120"},{prop:"priceTaxMark",label:"发票行性质",show:!1,align:"center",useTemplate:!1,width:"200"},{prop:"preferentialMarkFlag",label:"",show:!1,align:"center",useTemplate:!1,width:"200"},{prop:"vatSpecialManagement",label:"",show:!1,align:"center",useTemplate:!1,width:"200"},{prop:"freeTaxMark ",label:"",show:!1,align:"center",useTemplate:!1,width:"200"}]),we=m([{prop:"id",align:"center",show:!1,useTemplate:!1},{prop:"goodsLineNo",label:"序号",align:"center",useTemplate:!1,show:!0,width:"80"},{prop:"goodsCode",label:"商品编号",show:!0,useTemplate:!0,align:"center",width:"200"},{prop:"goodsName",label:"商品名称",show:!0,useTemplate:!0,align:"center",width:"160"},{prop:"goodsSpecification",label:"规格型号",show:!0,useTemplate:!0,align:"center",width:"180"},{prop:"goodsUnit",label:"单位",show:!0,align:"center",useTemplate:!0,width:"100"},{prop:"goodsQuantity",label:"数量",show:!0,align:"center",useTemplate:!0,width:"120"},{prop:"goodsPrice",label:"单价",show:!0,align:"center",useTemplate:!1,width:"120"},{prop:"goodsTotalPrice",label:"价税合计",show:!0,align:"right",useTemplate:!0,width:"120"},{prop:"notaxamount",label:"无税金额",show:!0,align:"right",useTemplate:!1,width:"120"},{prop:"goodsTotalTax",label:"税额",show:!0,useTemplate:!0,align:"center",width:"150"},{prop:"goodsTaxRate",label:"税率/征收率(%)",show:!0,align:"center",useTemplate:!0,minWidth:"140"},{prop:"invoiceLineNature",label:"发票行性质",show:!1,align:"center",useTemplate:!0,width:"200"},{prop:"discountRate",label:"折扣率",show:!1,align:"center",useTemplate:!0,width:"200"},{prop:"discountAmount",label:"折扣额",show:!1,align:"center",useTemplate:!0,width:"200"}]);function Ne(){e.value={id:B.value,serialNo:ge.value,buyerTaxNo:fe.value,buyerName:be.value,invoiceTypeName:invoiceTypeName.value}}function _e(l,t){if(l=="")t([]);else{let s=[];_.post("/Customer/GetAllCustomer?srcorgid="+y.value.id,{}).then(u=>{u.success&&(s=u.data.customer,s=s.filter(i=>i.customername.toLowerCase().indexOf(l.toLowerCase())>-1),t(s))}).catch(()=>{})}}const Te=l=>{T.value=JSON.parse(JSON.stringify(l))};function ke(l){e.value.buyerTaxNo=l.buyerTaxno,e.value.buyerAddress=l.Address,e.value.buyerPhone=l.Phone,e.value.buyerBankName=l.BankName,e.value.buyerEmail=l.Email,e.value.buyerAddress=l.Address,e.value.buyerBankName=l.BankName,e.value.buyerBankNumber=l.Account}function xe(){document.activeElement.blur(),e.value.buyerTaxNo="",e.value.buyerAddress="",e.value.buyerPhone="",e.value.buyerBankName="",e.value.buyerBankNumber="",e.value.buyerEmail=""}const Pe=async()=>{F.value=!0;try{const l=await _.post("/Invoice/GetInvoiceDetailMainNoPageList",V.stringify({id:B.value}));d.value=l.data.rows}catch(l){b.msg(l.message,"error",!1)}finally{F.value=!1}},Be=()=>{if(T.value.length===0){b.msg("请选择要添加的行","warning",!1);return}for(let l=0;l<T.value.length;l++)_.post("/Flow/GetLongId").then(t=>{M.value=t.data;const s={goodsLineNo:d.value.length+1,id:M.value,mainid:B.value,goodsCode:T.value[l].goodsCode,goodsName:T.value[l].goodsName,goodsSpecification:T.value[l].spec,goodsUnit:T.value[l].unitname,goodsQuantity:"",goodsPrice:"0",goodsTotalPrice:"",goodsTaxRate:T.value[l].taxrate,goodsTotalTax:"",invoiceLineNature:J.value,discountRate:"0",discountAmount:"0",priceTaxMark:"1",preferentialMarkFlag:T.value[l].preferentialMarkFlag,vatSpecialManagement:T.value[l].vatSpecialManagement};d.value.push(s)}).catch(()=>{});I.value=!1},Ve=()=>{J.value=0,I.value=!0},Se=async()=>{F.value=!0;try{const l=await _.post("/Invoice/Get",V.stringify({ids:B.value}));Array.isArray(l.data.invoicemain)&&l.data.invoicemain.length>0&&(e.value=l.data.invoicemain[0],e.value.sellerName=y.value.accountname,e.value.sellerTaxNo=y.value.taxno,e.value.sellerid=y.value.id,e.value.sellerAddress=y.value.address,e.value.sellerPhone=y.value.phone,e.value.sellerBankName=y.value.openbank,e.value.sellerBankNumber=y.value.bankaccount,Ce())}catch{}finally{F.value=!1}},Ce=async()=>{try{const l=await _.post("/Systemset/Get?srcorgid="+y.value.id,{});e.value.buyershow=l.data.invoicesystemset.是否默认选中购买方,e.value.sellershow=l.data.invoicesystemset.是否默认选中销售方}catch{}};function Ae(){_.post("/invoice/GetInvoiceDetailHB?srcorgid="+y.value.id,V.stringify({id:B.value})).then(l=>{if(l.success)b.msg("合并成功","success",!1),d.value=l.data.rows;else{b.msg(l.msg,"error",!1);return}}).catch(()=>{})}function Ue(){_.post("/Flow/GetLongId").then(l=>{M.value=l.data;const t={goodsLineNo:d.value.length+1,id:M.value,mainid:B.value,goodsCode:"",goodsName:"",goodsSpecification:"",goodsUnit:"",goodsQuantity:"",goodsPrice:"0",goodsTotalPrice:"",goodsTaxRate:"",goodsTotalTax:"",invoiceLineNature:1,discountRate:"0",discountAmount:"0",priceTaxMark:"1",preferentialMarkFlag:"0",vatSpecialManagement:""};d.value.push(t)}).catch(()=>{})}function Fe(){J.value=2,I.value=!0}function Ie(){X()}const X=()=>{S.value.size=h.value.size,S.value.number=h.value.number,_.post("/invoiceproduct/GetAllProduct?srcorgid="+y.value.id,V.stringify(S.value)).then(l=>{l.success&&(Y.value=l.data.product,h.value.total=l.data.total)}).catch(()=>{})};function ze(){const l=j.value;if(l.length===0){b.msg("请选择要删除的行","warning",!1);return}for(let t=0;t<l.length;t++){const s=d.value.indexOf(l[t]);d.value.splice(s,1)}for(let t=0;t<d.value.length;t++)d.value[t].goodsLineNo=t+1}function De(){ue.confirm("确定要保存吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{_.post("/Invoice/Save?srcorgid="+y.value.id,V.stringify({invoiceJSON:JSON.stringify(e.value),invoicedetailsJSON:JSON.stringify(d.value)})).then(l=>{const t=l.success?"success":"error";b.msg(l.msg,t,!1),l.success&&(de(),pe.value=!1)}).catch(()=>{})}).catch(()=>{})}function Re(){ue.confirm("确定要作废吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{_.post("/Invoice/DeleteAll",V.stringify({id:B.value,type:he.value})).then(l=>{const t=l.success?"success":"error";b.msg(l.msg,t,!1),l.success&&ce()}).catch(()=>{})}).catch(()=>{})}const Ee=l=>{j.value=l,j.value.length>0?Q.value=!0:Q.value=!1},d=m([]);function Le(l,t){if(l===0){b.msg("已经是第一行了","warning",!1);return}const s=d.value[l-1];d.value[l-1]=d.value[l],d.value[l]=s,d.value.forEach((u,i)=>{u.goodsLineNo=i+1}),b.notify("","操作成功","success")}function Me(l,t){if(l===d.value.length-1){b.msg("已经是最后一行了","warning",!1);return}const s=d.value[l+1];d.value[l+1]=d.value[l],d.value[l]=s,d.value.forEach((u,i)=>{u.goodsLineNo=i+1}),b.notify("","操作成功","success")}function H({row:l,column:t,rowIndex:s,columnIndex:u}){return{color:"#000",textAlign:"center"}}function $e({row:l}){if(l.goodsTotalPrice===0)return{backgroundColor:"yellow"}}Ke(()=>d.value,l=>{let t=0,s=0,u=0;l.forEach(i=>{if(t+=Number(i.goodsTotalPrice),s+=Number(i.goodsTotalTax),i.goodsQuantity==""||i.goodsQuantity==null)i.goodsPrice=0;else{let x=(Number(i.goodsTotalPrice)/Number(i.goodsQuantity)).toFixed(8);i.goodsPrice=isNaN(x)?0:x}const W=1+Number(i.goodsTaxRate/100);var c=(Number(i.goodsTotalPrice)/Number(W)).toFixed(2);i.goodsTotalTax=(Number(i.goodsTotalPrice)-c).toFixed(2),i.notaxamount=Number(c),u+=Number(c)}),e.value.invoiceTotalPriceTax=Number(t.toFixed(2)),e.value.invoiceTotalTax=Number(s.toFixed(2)),e.value.invoiceTotalPrice=Number(u.toFixed(2))},{deep:!0});let K="",Z="",ee="",le="",ae="",te="";function Oe(){let l=e.value.remarks;e.value.buyerBankName==null&&(e.value.buyerBankName=""),e.value.buyerBankNumber==null&&(e.value.buyerBankNumber=""),e.value.buyershow==!0&&e.value.buyerBankName!=""&&e.value.buyerBankNumber!=""?(K=e.value.buyerBankName,Z=e.value.buyerBankNumber,l!=null?e.value.remarks="购买方开户银行:"+e.value.buyerBankName+";       银行账号:"+e.value.buyerBankNumber+`;
`+l:e.value.remarks="购买方开户银行:"+e.value.buyerBankName+";       银行账号:"+e.value.buyerBankNumber+`;
`):e.value.remarks=e.value.remarks.replace("购买方开户银行:"+K+";       银行账号:"+Z+`;
`,"")}function Ge(){e.value.sellershow==!0?(ae=e.value.sellerBankName,te=e.value.sellerBankNumber,e.value.remarks!=null?e.value.remarks+="销售方开户银行:"+e.value.sellerBankName+";       银行账号:"+e.value.sellerBankNumber+`;
`:e.value.remarks="销售方开户银行:"+e.value.sellerBankName+";       银行账号:"+e.value.sellerBankNumber+`;
`):e.value.remarks=e.value.remarks.replace("销售方开户银行:"+ae+";       银行账号:"+te+`;
`,"")}function je(){ee=e.value.buyerAddress||"",le=e.value.buyerPhone||"",e.value.buyerAddress=e.value.buyerAddress||"",e.value.buyerPhone=e.value.buyerPhone||"";const l=new RegExp(`购买方地址:${ee};\\s*电话:${le};`,"g");e.value.buyerAddshow&&e.value.buyerAddress&&e.value.buyerPhone?e.value.remarks?e.value.remarks+=`购买方地址:${e.value.buyerAddress}; 电话:${e.value.buyerPhone};
`:e.value.remarks=`购买方地址:${e.value.buyerAddress}; 电话:${e.value.buyerPhone};
`:(e.value.remarks=e.value.remarks.replace(l,""),e.value.remarks=e.value.remarks.replace(/^[;\n]+|[,;\n]+$/g,""))}return se({open:Ne,headerCellStyle:H}),(l,t)=>{const s=g("el-button"),u=g("el-form-item"),i=g("el-form"),W=g("el-autocomplete"),c=g("el-col"),x=g("el-checkbox"),D=g("el-row"),k=g("el-input"),R=g("el-table-column"),oe=g("el-dropdown-item"),Je=g("el-dropdown-menu"),Qe=g("el-dropdown"),ne=g("el-table"),He=g("el-pagination"),We=g("el-dialog"),qe=el("loading");return w(),C("div",ol,[a(i,{inline:"",style:{display:"flex","justify-content":"space-between"}},{default:o(()=>[l.isflow?$("",!0):(w(),A(u,{key:0},{default:o(()=>[a(s,{type:"primary",icon:"Plus",onClick:Ve},{default:o(()=>[N("增行")]),_:1}),a(s,{type:"primary",onClick:Ue},{default:o(()=>[N("添加折扣行")]),_:1}),a(s,{type:"primary",onClick:Fe},{default:o(()=>[N("添加被折扣行")]),_:1}),a(s,{type:"primary",onClick:Ae},{default:o(()=>[N("合并明细行")]),_:1}),a(s,{type:"danger",disabled:!Q.value,onClick:ze},{default:o(()=>[N("删除行")]),_:1},8,["disabled"])]),_:1})),l.isflow?$("",!0):(w(),A(u,{key:1},{default:o(()=>[a(s,{icon:"Select",type:"primary",onClick:De},{default:o(()=>[N("暂存")]),_:1}),a(s,{icon:"Delete",type:"danger",onClick:Re},{default:o(()=>[N("作废")]),_:1})]),_:1}))]),_:1}),r("table",nl,[r("tbody",null,[r("tr",null,[r("td",rl,[a(i,{model:e.value,ref:"ruleFormRef"},{default:o(()=>[a(u,{style:{margin:"auto"},label:"发票类型:",prop:"invoiceTypeName"},{default:o(()=>[r("span",null,p(e.value.invoiceTypeName),1)]),_:1})]),_:1},8,["model"])]),r("td",ul,[a(i,{model:e.value,ref:"ruleFormRef"},{default:o(()=>[a(u,{style:{margin:"auto"},label:"开票流水号:"},{default:o(()=>[r("span",null,p(e.value.serialNo),1)]),_:1})]),_:1},8,["model"])])]),r("tr",sl,[il,r("td",dl,[a(i,{model:e.value,ref:"ruleFormRef","label-width":"100px"},{default:o(()=>[a(D,{gutter:20},{default:o(()=>[a(c,{span:13.5,style:{"padding-right":"0"}},{default:o(()=>[a(u,{label:"名称",prop:"buyerName"},{default:o(()=>[a(W,{style:{width:"250px"},"trigger-on-focus":"true","fetch-suggestions":_e,modelValue:e.value.buyerName,"onUpdate:modelValue":t[0]||(t[0]=n=>e.value.buyerName=n),onSelect:ke,clearable:"",onClear:t[1]||(t[1]=n=>xe())},null,8,["modelValue"]),a(s,{style:{display:"inline-block"},class:"selectBtn",type:"default",icon:"Operation",onClick:l.showmodel},null,8,["onClick"])]),_:1})]),_:1}),a(c,{span:2,style:{"line-height":"30px"}},{default:o(()=>[v(r("div",pl," (个人) ",512),[[f,e.value.buyerNaturalPerson=="Y"]])]),_:1}),a(c,{span:5,style:{"line-height":"30px"}},{default:o(()=>[a(x,{"true-label":"Y","false-label":"N",modelValue:e.value.buyerNaturalPerson,"onUpdate:modelValue":t[2]||(t[2]=n=>e.value.buyerNaturalPerson=n),label:"是否开票给自然人"},null,8,["modelValue"])]),_:1})]),_:1}),a(u,{label:"纳税人识别号",prop:"buyerTaxNo"},{default:o(()=>[v(a(k,{style:{width:"90%"},modelValue:e.value.buyerTaxNo,"onUpdate:modelValue":t[3]||(t[3]=n=>e.value.buyerTaxNo=n)},null,8,["modelValue"]),[[f,!l.readonly]]),v(r("span",null,p(e.value.buyerTaxNo),513),[[f,l.readonly]])]),_:1}),a(D,{gutter:20},{default:o(()=>[a(c,{span:11},{default:o(()=>[a(u,{label:"地址",prop:"buyerAddress"},{default:o(()=>[v(a(k,{modelValue:e.value.buyerAddress,"onUpdate:modelValue":t[4]||(t[4]=n=>e.value.buyerAddress=n)},null,8,["modelValue"]),[[f,!l.readonly]]),v(r("span",null,p(e.value.buyerAddress),513),[[f,l.readonly]])]),_:1})]),_:1}),a(c,{span:11},{default:o(()=>[a(u,{label:"电话",prop:"buyerPhone"},{default:o(()=>[v(a(k,{modelValue:e.value.buyerPhone,"onUpdate:modelValue":t[5]||(t[5]=n=>e.value.buyerPhone=n)},null,8,["modelValue"]),[[f,!l.readonly]]),v(r("span",null,p(e.value.buyerPhone),513),[[f,l.readonly]])]),_:1})]),_:1}),a(c,{span:2,class:"show"},{default:o(()=>[a(u,{prop:"show"},{default:o(()=>[a(x,{style:{"font-size":"12px"},onChange:t[6]||(t[6]=n=>je()),modelValue:e.value.buyerAddshow,"onUpdate:modelValue":t[7]||(t[7]=n=>e.value.buyerAddshow=n),label:"展示"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),a(D,{gutter:20},{default:o(()=>[a(c,{span:11},{default:o(()=>[a(u,{label:"开户银行",prop:"buyerBankName"},{default:o(()=>[v(a(k,{modelValue:e.value.buyerBankName,"onUpdate:modelValue":t[8]||(t[8]=n=>e.value.buyerBankName=n)},null,8,["modelValue"]),[[f,!l.readonly]]),v(r("span",null,p(e.value.buyerBankName),513),[[f,l.readonly]])]),_:1})]),_:1}),a(c,{span:11},{default:o(()=>[a(u,{label:"银行账号",prop:"buyerBankNumber"},{default:o(()=>[v(a(k,{modelValue:e.value.buyerBankNumber,"onUpdate:modelValue":t[9]||(t[9]=n=>e.value.buyerBankNumber=n)},null,8,["modelValue"]),[[f,!l.readonly]]),v(r("span",null,p(e.value.buyerBankNumber),513),[[f,l.readonly]])]),_:1})]),_:1}),a(c,{span:2,class:"show"},{default:o(()=>[a(u,{prop:"show"},{default:o(()=>[a(x,{style:{"font-size":"12px"},onChange:t[10]||(t[10]=n=>Oe()),modelValue:e.value.buyershow,"onUpdate:modelValue":t[11]||(t[11]=n=>e.value.buyershow=n),label:"展示"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1},8,["model"])]),cl,r("td",ml,[a(i,{model:e.value,ref:"ruleFormRef","label-width":"110px"},{default:o(()=>[a(u,{label:"名称",prop:"sellerid"},{default:o(()=>[r("span",vl,p(e.value.sellerName),1)]),_:1}),a(u,{label:"纳税人识别号",prop:"sellerTaxNo"},{default:o(()=>[r("span",gl,p(e.value.sellerTaxNo),1)]),_:1}),a(D,{gutter:20},{default:o(()=>[a(c,{span:11},{default:o(()=>[a(u,{label:"地址",prop:"sellerAddress"},{default:o(()=>[r("span",fl,p(e.value.sellerAddress),1)]),_:1})]),_:1}),a(c,{span:11},{default:o(()=>[a(u,{label:"电话",prop:"sellerPhone"},{default:o(()=>[r("span",bl,p(e.value.sellerPhone),1)]),_:1})]),_:1}),a(c,{span:2,class:"show"},{default:o(()=>[a(u,{prop:"sellershow"},{default:o(()=>[a(x,{style:{"font-size":"12px"},onChange:t[12]||(t[12]=n=>l.sellerAddshow()),modelValue:e.value.sellerAddshow,"onUpdate:modelValue":t[13]||(t[13]=n=>e.value.sellerAddshow=n),label:"展示"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),a(D,{gutter:20},{default:o(()=>[a(c,{span:11},{default:o(()=>[a(u,{label:"开户银行",prop:"sellerBankName"},{default:o(()=>[r("span",hl,p(e.value.sellerBankName),1)]),_:1})]),_:1}),a(c,{span:11},{default:o(()=>[a(u,{label:"银行账号",class:"colschange",prop:"sellerBankNumber"},{default:o(()=>[r("span",yl,p(e.value.sellerBankNumber),1)]),_:1})]),_:1}),a(c,{span:2,class:"show"},{default:o(()=>[a(u,{prop:"sellershow"},{default:o(()=>[a(x,{style:{"font-size":"12px"},onChange:t[14]||(t[14]=n=>Ge()),modelValue:e.value.sellershow,"onUpdate:modelValue":t[15]||(t[15]=n=>e.value.sellershow=n),label:"展示"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1},8,["model"])])])])]),v((w(),A(ne,{class:"eltable show_table",height:"380",data:d.value,stripe:q.value.tableStripe,"highlight-current-row":q.value.tableHighlightCurrentRow,style:{width:"100%",color:"#000"},"header-cell-style":H,"default-sort":L.value,onSelectionChange:Ee,"row-style":$e},{default:o(()=>[a(R,{type:"selection",width:"55",align:"center"}),a(R,{label:"",width:"20"},{default:o(n=>[a(Qe,{placement:"bottom-start",size:"small","hide-on-click":!0},{dropdown:o(()=>[a(Je,null,{default:o(()=>[a(oe,{icon:"CaretTop",onClick:E=>Le(n.$index,n.row)},{default:o(()=>[N("上移")]),_:2},1032,["onClick"]),a(oe,{icon:"CaretBottom",divided:"",onClick:E=>Me(n.$index,n.row)},{default:o(()=>[N("下移")]),_:2},1032,["onClick"])]),_:2},1024)]),default:o(()=>[a(s,{type:"primary",size:"small",icon:"DCaret"})]),_:2},1024)]),_:1}),(w(!0),C(O,null,re(we.value,n=>(w(),C(O,null,[n.show?(w(),A(R,{key:0,prop:n.prop,"min-width":n.minWidth,label:n.label,align:n.align,width:n.width,sortable:""},{default:o(E=>[n.useTemplate&&!l.isflow?(w(),A(k,{key:0,modelValue:E.row[n.prop],"onUpdate:modelValue":Ye=>E.row[n.prop]=Ye},null,8,["modelValue","onUpdate:modelValue"])):(w(),C("span",wl,p(E.row[n.prop]),1))]),_:2},1032,["prop","min-width","label","align","width"])):$("",!0)],64))),256))]),_:1},8,["data","stripe","highlight-current-row","default-sort"])),[[qe,F.value]]),r("table",Nl,[r("tbody",null,[r("tr",null,[r("td",_l,[r("div",Tl,[r("span",null,"原单据含税金额:"+p(e.value.oldinvoiceTotalPriceTax),1),r("span",null,"原单据税额:"+p(e.value.oldinvoiceTotalTax),1),r("span",null,"原单据无税金额:"+p(e.value.oldinvoiceTotalPrice),1),r("span",null,"价税合计:"+p(e.value.invoiceTotalPriceTax),1),r("span",null,"无税金额:"+p(e.value.invoiceTotalPrice),1),r("span",null,"税额:"+p(e.value.invoiceTotalTax),1)])])]),r("tr",kl,[xl,r("td",Pl,[a(i,{style:{height:"100%"},model:e.value,ref:"ruleFormRef"},{default:o(()=>[a(u,{style:{margin:"0px 0px 0px !important",padding:"0 !important"},prop:"remarks"},{default:o(()=>[a(k,{type:"textarea",modelValue:e.value.remarks,"onUpdate:modelValue":t[16]||(t[16]=n=>e.value.remarks=n)},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),Bl,r("td",Vl,[a(i,{model:e.value,rules:l.rules,ref:"ruleFormRef"},{default:o(()=>[a(u,{label:"手机号码:",prop:"phone"},{default:o(()=>[v(a(k,{placeholder:"请输入手机号码",modelValue:e.value.phone,"onUpdate:modelValue":t[17]||(t[17]=n=>e.value.phone=n)},null,8,["modelValue"]),[[f,!l.readonly]]),v(r("span",null,p(e.value.phone),513),[[f,l.readonly]])]),_:1}),a(u,{label:"邮箱地址:",prop:"buyerEmail"},{default:o(()=>[v(a(k,{placeholder:"请输入邮箱地址",modelValue:e.value.buyerEmail,"onUpdate:modelValue":t[18]||(t[18]=n=>e.value.buyerEmail=n)},null,8,["modelValue"]),[[f,!l.readonly]]),v(r("span",null,p(e.value.buyerEmail),513),[[f,l.readonly]])]),_:1})]),_:1},8,["model","rules"])])])])]),a(We,{title:"选择产品",style:{height:"637px"},modelValue:I.value,"onUpdate:modelValue":t[22]||(t[22]=n=>I.value=n),"align-center":"",onOpen:Ie,onClose:l.Productclosed,"destroy-on-close":"",width:"1200px",draggable:"","close-on-click-modal":!1},{default:o(()=>[a(i,{inline:!0,model:S.value,class:"inline"},{default:o(()=>[a(u,null,{default:o(()=>[a(k,{placeholder:"请输入商品名称",modelValue:S.value.productname,"onUpdate:modelValue":t[19]||(t[19]=n=>S.value.productname=n),style:{width:"250px"},clearable:""},null,8,["modelValue"])]),_:1}),a(u,null,{default:o(()=>[a(s,{type:"primary",onClick:X},{default:o(()=>[N("查询")]),_:1}),a(s,{type:"primary",onClick:Be},{default:o(()=>[N("选择商品")]),_:1})]),_:1})]),_:1},8,["model"]),a(ne,{class:"eltable",data:Y.value,stripe:h.value.tableStripe,border:"","highlight-current-row":h.value.tableHighlightCurrentRow,height:"460",style:{color:"#000"},"header-cell-style":H,"default-sort":L.value,onSelectionChange:Te},{default:o(()=>[a(R,{type:"selection",width:"55",align:"center"}),(w(!0),C(O,null,re(ye.value,n=>(w(),C(O,null,[n.show?(w(),A(R,{key:0,prop:n.prop,fixed:n.fixed,label:n.label,align:n.align,"min-width":n.width},null,8,["prop","fixed","label","align","min-width"])):$("",!0)],64))),256))]),_:1},8,["data","stripe","highlight-current-row","default-sort"]),r("div",Sl,[a(He,{currentPage:h.value.number,"onUpdate:currentPage":t[20]||(t[20]=n=>h.value.number=n),"page-size":h.value.size,"onUpdate:pageSize":t[21]||(t[21]=n=>h.value.size=n),"page-sizes":h.value.sizes,background:h.value.background,layout:h.value.layout,total:h.value.total,onSizeChange:l.ProductSizeChange,onCurrentChange:l.ProductCurrentChange},null,8,["currentPage","page-size","page-sizes","background","layout","total","onSizeChange","onCurrentChange"])])]),_:1},8,["modelValue","onClose"])])}}},$l=tl(Cl,[["__scopeId","data-v-8a7b3d76"]]);export{$l as default};