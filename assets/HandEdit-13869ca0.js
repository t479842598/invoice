import{d as Ll,ai as V,aT as r,aF as Dl,by as Le,c as B,W as a,bD as o,a as s,bF as g,H as S,b9 as c,A as Ol,aX as v,aY as $l,aP as Jl,aM as jl,o as f,U as h,I as $,bi as Gl,bv as y,F as M,aV as oe,P as Ql}from"./_@vue-5ba92de9.js";import{e as Hl}from"./excel-1d8df660.js";import{a as ql}from"./_element-plus-8c7ce171.js";import{_ as Wl}from"./index-823f4b27.js";import"./__vendor-5e6ac033.js";import"./_@element-plus-ad4c9002.js";import"./_@popperjs-c75af06c.js";import"./_crypto-js-0812dcff.js";import"./_pdfjs-dist-c04561eb.js";import"./_@microsoft-43c4e133.js";import"./_vue-codemirror-50da885a.js";const R=J=>(Jl("data-v-ad64177d"),J=J(),jl(),J),Yl={style:{height:"86.7vh",overflow:"hidden","overflow-y":"scroll"},class:"topdiv"},Xl={border:"1",cellpadding:"1",cellspacing:"1",style:{"line-height":"50px","border-color":"#99938f","border-width":"1px",color:"#6f4946",width:"100%","margin-bottom":"0"},class:"table maintable"},Kl={class:"type",colspan:"4",height:"50",style:{"padding-left":"5px","font-weight":"bold",color:"#6f4946"}},Zl={colspan:"4",height:"50",class:"type",style:{"padding-left":"5px","font-weight":"bold",color:"#6f4946"}},ea={style:{height:"100px !important"}},la=R(()=>s("td",{width:"26",class:"center vertical-text",style:{"font-weight":"bolder"}},"购买方",-1)),aa={colspan:"3",width:"250",style:{padding:"15px 10px 0px 10px"}},ta={style:{display:"inline-block",width:"40px"}},oa=R(()=>s("td",{width:"26",class:"center vertical-text",style:{"font-weight":"bolder"}},"销售方",-1)),na={colspan:"3",width:"250",style:{padding:"15px 10px 0px 10px"}},sa={class:"black"},ua={class:"black"},ra={class:"black"},ia={class:"black"},da={class:"black"},pa={class:"black"},ca={key:1},va={border:"1",cellpadding:"1",cellspacing:"1",style:{"line-height":"50px","border-color":"#99938f","border-width":"1px",color:"#6f4946",width:"100%","margin-bottom":"0"},class:"table remarkTable"},ma={colspan:"8",height:"40",class:"amountshow"},ga={style:{display:"flex","justify-content":"space-around"}},fa={style:{height:"100px !important"}},ha=R(()=>s("td",{width:"26",class:"center vertical-text",style:{"font-weight":"bolder"}},"备注",-1)),ba={colspan:"3",width:"270",style:{padding:"0"}},ya=R(()=>s("td",{width:"26",class:"center vertical-text",style:{"font-weight":"bolder"}},"交付到",-1)),wa={colspan:"3",width:"250",style:{padding:"15px 10px 0px 10px !important"}},_a={class:"roadui_pagerdiv"},xa={class:"roadui_pagerdiv"},ka={style:{margin:"auto",width:"80%"}},Na=R(()=>s("span",null,"正在开票中",-1)),Ta={style:{"margin-top":"10px",margin:"10px auto",display:"flex","justify-content":"space-around"}},Ca={class:"successfa"},Pa=R(()=>s("div",{style:{display:"inline-flex","align-items":"center","font-size":"14px"}}," 已开票 ",-1)),Va={class:"errorfa"},Ba=R(()=>s("div",{style:{display:"inline-flex","align-items":"center","font-size":"14px"}}," 开票失败 ",-1)),Sa=Ll({__name:"HandEdit",props:{query:{type:String,default:()=>""},modelValue:{type:Boolean,default:!1},id:{type:String,default:"0"},copy:{type:String,default:""},isnew:{type:Boolean,default:!1}},emits:["update:id","update:isnew"],setup(J,{expose:De,emit:Oe}){const N=V("ajax"),m=V("utils"),A=V("qs"),$e=V("config"),ne=V("index_openmenu"),ge=V("index_removetab"),fe=V("index_refreshtab");V("index_dialogshow"),V("index_regcomponent");const Je=V("index_userinfo"),se=r(!1),b=r("");localStorage.getItem("sobInfo")!=""&&(b.value=JSON.parse(localStorage.getItem("sobInfo")));const L=r({prop:"goodsLineNo",order:"ascending"}),he=r(m.getPager(L.value)),_=r(m.getPager(L.value)),x=r(m.getPager(L.value)),D=r([]),C=r([]),je=r([]),ue=r(!1),Y=r(""),X=r(!1),be=r(),ye=r([]),Ge=r(),K=r(!1),j=r(!1),re=r(0),Qe=r([{id:"01",label:"全电专用发票"},{id:"02",label:"全电普通发票"}]),I=r({customername:""}),z=r({projectname:""});r([]);const He=Oe,qe=J;function ie(l){return Ol({get:()=>qe[l],set:t=>{He(`update:${l}`,t)}})}const G=ie("id"),We=ie("isnew"),Ye=ie("copy"),Xe=r("");r(""),Dl(()=>{gl(G.value),pl(),_e()});const Q=r(),w=r(!1),de=r(!1),Z=r({Id:"",invoicedepartname:"",taxno:""}),U=r(0),H=r(0),ee=r(0),Ke=()=>{N.post("/Invoice/Save?srcorgid="+b.value.id,A.stringify({invoiceJSON:JSON.stringify(e.value),invoicedetailsJSON:JSON.stringify(d.value)})).then(l=>{l.success?(K.value=!0,Z.value.invoicedepartname=b.value.accountname,Z.value.taxno=b.value.taxno,Z.value.Id=e.value.id,ll()):m.msg(l.msg,"error",!1)}).catch(()=>{})};Le(U,l=>{H.value=Math.floor((U.value+ee.value)/Number(D.value.length)*100),U.value>0,H.value===100&&setTimeout(()=>{K.value=!1},800)});const d=r([]);function Ze(l,t){if(l===0){m.msg("已经是第一行了","warning",!1);return}const u=d.value[l-1];d.value[l-1]=d.value[l],d.value[l]=u,d.value.forEach((T,i)=>{T.goodsLineNo=i+1}),m.notify("","操作成功","success")}function el(l,t){if(l===d.value.length-1){m.msg("已经是最后一行了","warning",!1);return}const u=d.value[l+1];d.value[l+1]=d.value[l],d.value[l]=u,d.value.forEach((T,i)=>{T.goodsLineNo=i+1}),m.notify("","操作成功","success")}const ll=async()=>{const l=await N.post("/Invoice/OpenInvoice?srcorgid="+b.value.id,A.stringify(Z.value));l.code==0?(U.value++,m.notify("第"+U.value+"张",l.msg,"success"),ge(),ne({appIco:"",children:[],closable:!0,componentId:"492732716728389",height:0,ico:"Tickets",icoColor:"",id:"492732716728389",openMode:0,parentId:"485253976780869",scopedSlots:{icon:"custom"},title:"已开票查询",title_en:"Menus",title_tw:"菜單",url:"/Invoice/Completedlist",width:0})):(ee.value++,m.notify("",l.msg,"error"))},al=()=>{H.value=0,U.value=0,ee.value=0,D.value=[],fe()},e=r({invoiceTypeCode:"",serialNo:"",buyerName:"",buyerTaxNo:"",buyerEmail:"",buyerAddress:"",buyerBankName:"",buyerBankNumber:"",buyerPhone:"",sellerName:"",sellerid:"",sellerTaxNo:"",sellerAddress:"",sellerPhone:"",sellerBankName:"",sellerBankNumber:"",remarks:"",invoiceTotalPriceTax:0,invoiceTotalTax:0,invoiceTotal:0,buyerNaturalPerson:"N"});function tl(l,t){if(l=="")t([]);else{let u=[];N.post("/Customer/GetAllCustomer?srcorgid="+b.value.id,{}).then(T=>{T.success&&(u=T.data.customer,u=u.filter(i=>i.customername.toLowerCase().indexOf(l.toLowerCase())>-1),t(u))}).catch(()=>{})}}function ol(l){e.value.buyerTaxNo=l.buyerTaxno,e.value.buyerAddress=l.Address,e.value.buyerPhone=l.Phone,e.value.buyerBankName=l.BankName,e.value.buyerEmail=l.Email,e.value.buyerAddress=l.Address,e.value.buyerBankName=l.BankName,e.value.buyerBankNumber=l.Account}function nl(){document.activeElement.blur(),e.value.buyerTaxNo="",e.value.buyerAddress="",e.value.buyerPhone="",e.value.buyerBankName="",e.value.buyerBankNumber="",e.value.buyerEmail=""}const sl=()=>{m.showFileName(ne,{name:"手工开票模板"},$e.SERVER_WEBADDRESS)},ul={buyerName:[{required:!0,message:"请输入购方名称",trigger:"blur"}]},rl=r([{prop:"id",align:"center",show:!1,useTemplate:!1},{prop:"goodsCode",label:"商品编号",show:!0,useTemplate:!0,align:"center",width:"180"},{prop:"goodsName",label:"商品名称",show:!0,useTemplate:!0,align:"center",width:"180"},{prop:"goodsSpecification",label:"规格型号",show:!0,useTemplate:!0,align:"center",width:"130"},{prop:"goodsUnit",label:"单位",show:!0,align:"center",useTemplate:!0,width:"100"},{prop:"goodsQuantity",label:"数量",show:!0,align:"center",useTemplate:!0,width:"120"},{prop:"goodsPrice",label:"单价",show:!0,align:"right",useTemplate:!1,width:"120"},{prop:"goodsTotalPrice",label:"价税合计",show:!0,align:"right",useTemplate:!0,width:"120"},{prop:"notaxamount",label:"无税金额",show:!0,align:"right",useTemplate:!1,width:"120"},{prop:"goodsTotalTax",label:"税额",show:!0,useTemplate:!1,align:"center",width:"120"},{prop:"goodsTaxRate",label:"税率(%)",show:!0,align:"right",useTemplate:!0,width:"120"},{prop:"invoiceLineNature",label:"发票行性质",show:!1,align:"center",useTemplate:!0,width:"200"},{prop:"discountRate",label:"折扣率",show:!1,align:"center",useTemplate:!0,width:"200"},{prop:"discountAmount",label:"折扣额",show:!1,align:"center",useTemplate:!0,width:"200"}]),il=r([{prop:"id",align:"center",show:!1,useTemplate:!1},{prop:"customername",label:"购买方名称",show:!0,align:"center",useTemplate:!1,width:"240"},{prop:"customercode",label:"购买方编号",show:!1,align:"center",useTemplate:!1,width:"200"},{prop:"Taxno",label:"税号",show:!0,align:"center",useTemplate:!1,width:"180"},{prop:"Phone",label:"电话",show:!0,align:"center",useTemplate:!1,width:"140"},{prop:"Email",label:"邮箱",show:!0,align:"center",useTemplate:!1,width:"140"},{prop:"Address",label:"地址",show:!0,align:"center",useTemplate:!1,width:"200"},{prop:"BankName",label:"开户行",show:!0,align:"center",useTemplate:!1,width:"170"},{prop:"Account",label:"银行账号",show:!0,align:"center",useTemplate:!1,width:"200"},{prop:"BankAccount",label:"银行账号",show:!0,align:"center",useTemplate:!1,width:"200"},{prop:"AddressPhone",label:"地址电话",show:!0,align:"center",useTemplate:!1,width:"200"},{label:"操作",show:!0,align:"center",useTemplate:!0,width:"100",fixed:"right"}]),dl=r([{prop:"id",align:"center",show:!1,useTemplate:!1},{prop:"goodsLineNo",label:"序号",align:"center",useTemplate:!1,show:!1,width:"60"},{prop:"goodsCode",label:"商品编号",show:!0,useTemplate:!1,align:"center",width:"150"},{prop:"goodsName",label:"商品名称",show:!0,useTemplate:!1,align:"center",width:"200"},{prop:"spec",label:"规格型号",show:!0,useTemplate:!1,align:"center",width:"160"},{prop:"unitname",label:"单位",show:!0,align:"center",useTemplate:!1,width:"100"},{prop:"taxrate",label:"税率(%)",show:!0,align:"center",useTemplate:!1,minWidth:"150%"},{prop:"goodsQuantity",label:"数量",show:!1,align:"center",useTemplate:!1,width:"120"},{prop:"goodsPrice",label:"单价",show:!1,align:"center",useTemplate:!1,width:"120"},{prop:"goodsTotalPrice",label:"价税合计",show:!1,align:"right",useTemplate:!1,width:"120"},{prop:"notaxamount",label:"无税金额",show:!1,align:"right",useTemplate:!1,width:"120"},{prop:"goodsTotalTax",label:"税额",show:!1,useTemplate:!1,align:"center",width:"120"},{prop:"priceTaxMark",label:"发票行性质",show:!1,align:"center",useTemplate:!1,width:"200"},{prop:"preferentialMarkFlag",label:"",show:!1,align:"center",useTemplate:!1,width:"200"},{prop:"vatSpecialManagement",label:"",show:!1,align:"center",useTemplate:!1,width:"200"},{prop:"freeTaxMark ",label:"",show:!1,align:"center",useTemplate:!1,width:"200"}]),pl=async()=>{try{const l=await N.post("user/GetUserInvoiceDepartByUser",A.stringify({userid:Je.value.userId}));l.success&&(je.value=l.data,Ge.value=l.data[0].id)}catch{}};function we(){O()}function cl(){le()}const le=()=>{z.value.size=x.value.size,z.value.number=x.value.number,N.post("/invoiceproduct/GetAllProduct?srcorgid="+b.value.id,A.stringify(z.value)).then(l=>{l.success&&(ye.value=l.data.product,x.value.total=l.data.total)}).catch(()=>{})},O=()=>{I.value.size=_.value.size,I.value.number=_.value.number,N.post("/Customer/GetList?srcorgid="+b.value.id,A.stringify(I.value)).then(l=>{l.success&&(be.value=l.data.rows,_.value.total=l.data.total)}).catch(()=>{})},_e=async()=>{try{const l=await N.post("/Systemset/Get?srcorgid="+b.value.id,{});Xe.value=l.data.invoicesystemset,e.value.invoiceTypeCode=l.data.invoicesystemset.默认发票类型,e.value.buyershow=l.data.invoicesystemset.是否默认选中购买方,e.value.sellershow=l.data.invoicesystemset.是否默认选中销售方,Ae(),ze(),Ue(),Ie()}catch{}};function vl(){I.value.customername="",O()}function ml(){z.value.goodsName="",O()}const gl=async l=>{de.value=!0;try{const t=await N.post("/Invoice/GetInvoiceApply",A.stringify({id:l,type:"手工开票(旧)",copy:Ye.value}));e.value=t.data.invoicemain,G.value=t.data.invoicemain.id,d.value=t.data.invoicedetail,e.value.sellerName=b.value.accountname,e.value.sellerTaxNo=b.value.taxno,e.value.sellerid=b.value.id,e.value.sellerAddress=b.value.address,e.value.sellerPhone=b.value.phone,e.value.sellerBankName=b.value.openbank,e.value.sellerBankNumber=b.value.bankaccount,_e()}catch{}finally{de.value=!1}},fl=()=>{if(e.value.buyerName==""){m.msg("购方名称不能为空","warning",!1);return}N.post("/Invoice/Save?srcorgid="+b.value.id,A.stringify({invoiceJSON:JSON.stringify(e.value),invoicedetailsJSON:JSON.stringify(d.value)})).then(l=>{l.success?(m.msg(l.msg,"success",!1),ge(),ne({id:"492732745289797",title:"开票任务列表",closable:!0,componentId:"492732745289797",height:0,ico:"Tickets",icoColor:"",openMode:0,parentId:"485253976780869",scopedSlots:{icon:"custom"},title_en:"Menus",title_tw:"菜單",url:"/Invoice/tasklist",width:0})):m.msg(l.msg,"error",!1)}).catch(()=>{})},hl=l=>{C.value=JSON.parse(JSON.stringify(l))},bl=()=>{if(C.value.length===0){m.msg("请选择要添加的行","warning",!1);return}for(let l=0;l<C.value.length;l++)N.post("/Flow/GetLongId").then(t=>{Y.value=t.data;const u={goodsLineNo:d.value.length+1,id:Y.value,mainid:G.value,goodsCode:C.value[l].goodsCode,goodsName:C.value[l].goodsName,goodsSpecification:C.value[l].spec,goodsUnit:C.value[l].unitname,goodsQuantity:"",goodsPrice:"0",goodsTotalPrice:"",goodsTaxRate:C.value[l].taxrate,goodsTotalTax:"",invoiceLineNature:re.value,discountRate:"0",discountAmount:"0",priceTaxMark:"1",preferentialMarkFlag:C.value[l].preferentialMarkFlag,vatSpecialManagement:C.value[l].vatSpecialManagement,freeTaxMark:C.value[l].freeTaxMark};d.value.push(u)}).catch(()=>{});j.value=!1},yl=()=>{X.value=!0},wl=()=>{re.value=0,j.value=!0};function _l(){N.post("/Flow/GetLongId").then(l=>{Y.value=l.data;const t={goodsLineNo:d.value.length+1,id:Y.value,mainid:G.value,goodsCode:"",goodsName:"",goodsSpecification:"",goodsUnit:"",goodsQuantity:"",goodsPrice:"0",goodsTotalPrice:"",goodsTaxRate:"",goodsTotalTax:"",invoiceLineNature:1,discountRate:"0",discountAmount:"0",priceTaxMark:"1",preferentialMarkFlag:"0",vatSpecialManagement:""};d.value.push(t)}).catch(()=>{})}function xl(){re.value=2,j.value=!0}function kl(){const l=D.value;if(l.length===0){m.msg("请选择要删除的行","warning",!1);return}for(let t=0;t<l.length;t++){const u=d.value.indexOf(l[t]);d.value.splice(u,1)}for(let t=0;t<d.value.length;t++)d.value[t].goodsLineNo=t+1}const xe=l=>{D.value=l,D.value.length>0?se.value=!0:se.value=!1};function ae({row:l,column:t,rowIndex:u,columnIndex:T}){return{color:"#000",textAlign:"center"}}function Nl({row:l}){if(l.goodsTotalPrice===0)return{backgroundColor:"yellow"}}const Tl=l=>{_.value.size=l,O()},Cl=l=>{_.value.number=l,O()},Pl=l=>{x.value.size=l,le()},Vl=l=>{x.value.number=l,le()};Le(()=>d.value,l=>{let t=0,u=0,T=0;const i=r(0);l.forEach(p=>{if(t+=Number(p.goodsTotalPrice),u+=Number(p.goodsTotalTax),p.goodsQuantity==""||p.goodsQuantity==null)p.goodsPrice=0;else{let te=(Number(p.goodsTotalPrice)/Number(p.goodsQuantity)).toFixed(8);p.goodsPrice=isNaN(te)?0:te}const ce=1+Number(p.goodsTaxRate/100);i.value=(Number(p.goodsTotalPrice)/Number(ce)).toFixed(2),p.goodsTotalTax=(Number(p.goodsTotalPrice)-i.value).toFixed(2),p.notaxamount=i.value,T+=Number(p.notaxamount)}),e.value.invoiceTotalPriceTax=Number(t.toFixed(2)),e.value.invoiceTotalTax=Number(u.toFixed(2)),e.value.invoiceTotal=Number(T.toFixed(2))},{deep:!0});const Bl=l=>{X.value=!1,e.value.buyerName=l.customername,e.value.buyerTaxNo=l.Taxno,e.value.buyerEmail=l.Email,e.value.buyerAddress=l.Address,e.value.buyerBankName=l.BankName,e.value.buyerBankNumber=l.Account,e.value.buyerPhone=l.Phone},pe=r(),Sl=l=>{pe.value.clearFiles();const t=l[0];pe.value.handleStart(t)},Al=l=>{Hl(l.raw).then(t=>{d.value.length=0,t.forEach(u=>{d.value.push({goodsLineNo:d.value.length+1,goodsName:u.商品名称,goodsCode:u.税收分类编码,goodsSpecification:u.规格型号,goodsUnit:u.单位,goodsQuantity:u.数量,goodsPrice:u.单价,goodsTotalPrice:u.价税合计,goodsTotalTax:u.税额,goodsTaxRate:u["税率(%)"],notaxamount:u.无税金额})})})};function Il(l){return l.type!=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"&&l.type!=="application/vnd.ms-excel"?(m.msg("要导入的文件必须是excel格式文件!",!1),!1):!0}function zl(){ql.confirm("确定要作废吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{N.post("/Invoice/DeleteAll",A.stringify({id:G.value,type:"手工开票"})).then(l=>{const t=l.success?"success":"error";m.msg(l.msg,t,!1),l.success&&fe()}).catch(()=>{})}).catch(()=>{})}let ke="",Ne="",Te="",Ce="",Pe="",Ve="",Be="",Se="";function Ae(){let l=e.value.remarks;e.value.buyerBankName==null&&(e.value.buyerBankName=""),e.value.buyerBankNumber==null&&(e.value.buyerBankNumber=""),e.value.buyershow==!0&&e.value.buyerBankName!=""&&e.value.buyerBankNumber!=""?(ke=e.value.buyerBankName,Ne=e.value.buyerBankNumber,l!=null?e.value.remarks="购买方开户银行:"+e.value.buyerBankName+";      银行账号:"+e.value.buyerBankNumber+`;
`+l:e.value.remarks="购买方开户银行:"+e.value.buyerBankName+";      银行账号:"+e.value.buyerBankNumber+`;
`):e.value.remarks=e.value.remarks.replace("购买方开户银行:"+ke+";      银行账号:"+Ne+`;
`,"")}function Ie(){let l=e.value.remarks;Te=e.value.buyerAddress,Ce=e.value.buyerPhone,e.value.buyerAddress==null&&(e.value.buyerAddress=""),e.value.buyerPhone==null&&(e.value.buyerPhone=""),e.value.buyerAddshow==!0&&e.value.buyerAddress!=""&&e.value.buyerPhone!=""?l!=null?e.value.remarks="购买方地址:"+e.value.buyerAddress+";      电话:"+e.value.buyerPhone+`;
`+l:e.value.remarks="购买方地址:"+e.value.buyerAddress+";      电话:"+e.value.buyerPhone+`;
`:e.value.remarks=e.value.remarks.replace("购买方地址:"+Te+";      电话:"+Ce+`;
`,"")}function ze(){e.value.sellershow==!0?(Pe=e.value.sellerBankName,Ve=e.value.sellerBankNumber,e.value.remarks!=null?e.value.remarks+="销售方开户银行:"+e.value.sellerBankName+";      银行账号:"+e.value.sellerBankNumber+`;
`:e.value.remarks="销售方开户银行:"+e.value.sellerBankName+";      银行账号:"+e.value.sellerBankNumber+`;
`):e.value.remarks=e.value.remarks.replace("销售方开户银行:"+Pe+";      银行账号:"+Ve+`;
`,"")}function Ue(){e.value.sellerAddshow==!0?(Be=e.value.sellerAddress,Se=e.value.sellerPhone,e.value.remarks!=null?e.value.remarks+="销售方地址:"+e.value.sellerAddress+";      电话:"+e.value.sellerPhone+`;
`:e.value.remarks="销售方地址:"+e.value.sellerAddress+";      电话:"+e.value.sellerPhone+`;
`):e.value.remarks=e.value.remarks.replace("销售方地址:"+Be+";      电话:"+Se+`;
`,"")}return De({open:we,headerCellStyle:ae}),(l,t)=>{const u=v("el-button"),T=v("el-upload"),i=v("el-form-item"),p=v("el-form"),ce=v("el-radio"),te=v("el-radio-group"),Ul=v("el-autocomplete"),k=v("el-col"),q=v("el-checkbox"),W=v("el-row"),P=v("el-input"),E=v("el-table-column"),Ee=v("el-dropdown-item"),El=v("el-dropdown-menu"),Fl=v("el-dropdown"),ve=v("el-table"),Fe=v("el-pagination"),me=v("el-dialog"),Ml=v("el-progress"),Me=v("el-statistic"),Rl=$l("loading");return f(),B("div",Yl,[a(p,{inline:"",style:{display:"flex","justify-content":"space-between"}},{default:o(()=>[ue.value?$("",!0):(f(),S(i,{key:0},{default:o(()=>[a(u,{type:"primary",icon:"Plus",onClick:wl},{default:o(()=>[h("增行")]),_:1}),a(u,{type:"primary",onClick:_l},{default:o(()=>[h("添加折扣行")]),_:1}),a(u,{type:"primary",onClick:xl},{default:o(()=>[h("添加被折扣行")]),_:1}),a(u,{type:"danger",disabled:!se.value,onClick:kl},{default:o(()=>[h("删除行")]),_:1},8,["disabled"]),a(T,{ref_key:"upload",ref:pe,limit:1,style:{"margin-left":"15px","margin-bottom":"2px"},"on-change":Al,"on-exceed":Sl,accept:".xlsx,.xls","auto-upload":!1,"before-upload":Il,"show-file-list":!1},{trigger:o(()=>[a(u,{icon:"Upload",type:"warning"},{default:o(()=>[h("导入Excel数据")]),_:1})]),_:1},512),a(u,{type:"primary",link:"",onClick:t[0]||(t[0]=n=>sl())},{default:o(()=>[h("下载导入模板")]),_:1})]),_:1})),ue.value?$("",!0):(f(),S(i,{key:1,style:{float:"right"}},{default:o(()=>[a(u,{type:"primary",icon:"DocumentAdd",onClick:t[1]||(t[1]=n=>fl())},{default:o(()=>[h("暂存")]),_:1}),a(u,{type:"primary",icon:"DocumentCopy",onClick:Ke},{default:o(()=>[h("立即开票")]),_:1}),Gl(We)==!1?(f(),S(u,{key:0,icon:"Delete",type:"danger",onClick:zl},{default:o(()=>[h("作废")]),_:1})):$("",!0)]),_:1}))]),_:1}),s("table",Xl,[s("tbody",null,[s("tr",null,[s("td",Kl,[a(p,{model:e.value,ref_key:"ruleFormRef",ref:Q},{default:o(()=>[a(i,{style:{margin:"auto"},label:"发票类型:",prop:"invoiceTypeCode"},{default:o(()=>[g(a(te,{modelValue:e.value.invoiceTypeCode,"onUpdate:modelValue":t[2]||(t[2]=n=>e.value.invoiceTypeCode=n)},{default:o(()=>[(f(!0),B(M,null,oe(Qe.value,n=>(f(),S(ce,{label:n.id},{default:o(()=>[h(c(n.label),1)]),_:2},1032,["label"]))),256))]),_:1},8,["modelValue"]),[[y,!w.value]]),g(s("span",null,c(e.value.invoiceTypeName),513),[[y,w.value]])]),_:1})]),_:1},8,["model"])]),s("td",Zl,[a(i,{style:{margin:"auto"},label:"开票流水号:"},{default:o(()=>[s("span",null,c(e.value.serialNo),1)]),_:1})])]),s("tr",ea,[la,s("td",aa,[a(p,{model:e.value,ref_key:"ruleFormRef",ref:Q,"label-width":"100px"},{default:o(()=>[a(W,{gutter:20},{default:o(()=>[a(k,{span:13.5,style:{"padding-right":"0"}},{default:o(()=>[a(i,{label:"名称",prop:"buyerName"},{default:o(()=>[a(Ul,{style:{width:"250px"},"trigger-on-focus":"true","fetch-suggestions":tl,modelValue:e.value.buyerName,"onUpdate:modelValue":t[3]||(t[3]=n=>e.value.buyerName=n),onSelect:ol,clearable:"",onClear:t[4]||(t[4]=n=>nl())},null,8,["modelValue"]),a(u,{style:{display:"inline-block"},class:"selectBtn",type:"default",icon:"Operation",onClick:yl})]),_:1})]),_:1}),a(k,{span:2,style:{"line-height":"30px"}},{default:o(()=>[g(s("div",ta," (个人) ",512),[[y,e.value.buyerNaturalPerson=="Y"]])]),_:1}),a(k,{span:5,style:{"line-height":"30px"}},{default:o(()=>[a(q,{"true-label":"Y","false-label":"N",modelValue:e.value.buyerNaturalPerson,"onUpdate:modelValue":t[5]||(t[5]=n=>e.value.buyerNaturalPerson=n),label:"是否开票给自然人"},null,8,["modelValue"])]),_:1})]),_:1}),a(i,{label:"纳税人识别号",prop:"buyerTaxNo"},{default:o(()=>[g(a(P,{modelValue:e.value.buyerTaxNo,"onUpdate:modelValue":t[6]||(t[6]=n=>e.value.buyerTaxNo=n)},null,8,["modelValue"]),[[y,!w.value]]),g(s("span",null,c(e.value.buyerTaxNo),513),[[y,w.value]])]),_:1}),a(W,{gutter:20},{default:o(()=>[a(k,{span:11},{default:o(()=>[a(i,{label:"地址",prop:"buyerAddress"},{default:o(()=>[g(a(P,{modelValue:e.value.buyerAddress,"onUpdate:modelValue":t[7]||(t[7]=n=>e.value.buyerAddress=n)},null,8,["modelValue"]),[[y,!w.value]]),g(s("span",null,c(e.value.buyerAddress),513),[[y,w.value]])]),_:1})]),_:1}),a(k,{span:11},{default:o(()=>[a(i,{label:"电话",prop:"buyerPhone"},{default:o(()=>[g(a(P,{modelValue:e.value.buyerPhone,"onUpdate:modelValue":t[8]||(t[8]=n=>e.value.buyerPhone=n)},null,8,["modelValue"]),[[y,!w.value]]),g(s("span",null,c(e.value.buyerPhone),513),[[y,w.value]])]),_:1})]),_:1}),a(k,{span:2,class:"show"},{default:o(()=>[a(i,{prop:"show"},{default:o(()=>[a(q,{style:{"font-size":"12px"},onChange:t[9]||(t[9]=n=>Ie()),modelValue:e.value.buyerAddshow,"onUpdate:modelValue":t[10]||(t[10]=n=>e.value.buyerAddshow=n),label:"展示"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),a(W,{gutter:20},{default:o(()=>[a(k,{span:11},{default:o(()=>[a(i,{label:"开户银行",prop:"buyerBankName"},{default:o(()=>[g(a(P,{modelValue:e.value.buyerBankName,"onUpdate:modelValue":t[11]||(t[11]=n=>e.value.buyerBankName=n)},null,8,["modelValue"]),[[y,!w.value]]),g(s("span",null,c(e.value.buyerBankName),513),[[y,w.value]])]),_:1})]),_:1}),a(k,{span:11},{default:o(()=>[a(i,{label:"银行账号",prop:"buyerBankNumber"},{default:o(()=>[g(a(P,{modelValue:e.value.buyerBankNumber,"onUpdate:modelValue":t[12]||(t[12]=n=>e.value.buyerBankNumber=n)},null,8,["modelValue"]),[[y,!w.value]]),g(s("span",null,c(e.value.buyerBankNumber),513),[[y,w.value]])]),_:1})]),_:1}),a(k,{span:2,class:"show"},{default:o(()=>[a(i,{prop:"show"},{default:o(()=>[a(q,{style:{"font-size":"12px"},onChange:t[13]||(t[13]=n=>Ae()),modelValue:e.value.buyershow,"onUpdate:modelValue":t[14]||(t[14]=n=>e.value.buyershow=n),label:"展示"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1},8,["model"])]),oa,s("td",na,[a(p,{model:e.value,ref_key:"ruleFormRef",ref:Q,"label-width":"110px"},{default:o(()=>[a(i,{label:"名称",prop:"sellerid"},{default:o(()=>[s("span",sa,c(e.value.sellerName),1)]),_:1}),a(i,{label:"纳税人识别号",prop:"sellerTaxNo"},{default:o(()=>[s("span",ua,c(e.value.sellerTaxNo),1)]),_:1}),a(W,{gutter:20},{default:o(()=>[a(k,{span:11},{default:o(()=>[a(i,{label:"地址",prop:"sellerAddress"},{default:o(()=>[s("span",ra,c(e.value.sellerAddress),1)]),_:1})]),_:1}),a(k,{span:11},{default:o(()=>[a(i,{label:"电话",prop:"sellerPhone"},{default:o(()=>[s("span",ia,c(e.value.sellerPhone),1)]),_:1})]),_:1}),a(k,{span:2,class:"show"},{default:o(()=>[a(i,{prop:"sellershow"},{default:o(()=>[a(q,{style:{"font-size":"12px"},onChange:t[15]||(t[15]=n=>Ue()),modelValue:e.value.sellerAddshow,"onUpdate:modelValue":t[16]||(t[16]=n=>e.value.sellerAddshow=n),label:"展示"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),a(W,{gutter:20},{default:o(()=>[a(k,{span:11},{default:o(()=>[a(i,{label:"开户银行",prop:"sellerBankName"},{default:o(()=>[s("span",da,c(e.value.sellerBankName),1)]),_:1})]),_:1}),a(k,{span:11},{default:o(()=>[a(i,{label:"银行账号",class:"colschange",prop:"sellerBankNumber"},{default:o(()=>[s("span",pa,c(e.value.sellerBankNumber),1)]),_:1})]),_:1}),a(k,{span:2,class:"show"},{default:o(()=>[a(i,{prop:"sellershow"},{default:o(()=>[a(q,{style:{"font-size":"12px"},onChange:t[17]||(t[17]=n=>ze()),modelValue:e.value.sellershow,"onUpdate:modelValue":t[18]||(t[18]=n=>e.value.sellershow=n),label:"展示"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1},8,["model"])])])])]),s("div",null,[g((f(),S(ve,{class:"eltable show_table",data:d.value,height:"370",stripe:he.value.tableStripe,"highlight-current-row":he.value.tableHighlightCurrentRow,style:{width:"100%",color:"#000"},"header-cell-style":ae,"default-sort":L.value,onSelectionChange:xe,"row-style":Nl},{default:o(()=>[a(E,{type:"selection",width:"55",align:"center"}),a(E,{label:"",width:"20"},{default:o(n=>[a(Fl,{placement:"bottom-start",size:"small","hide-on-click":!0},{dropdown:o(()=>[a(El,null,{default:o(()=>[a(Ee,{icon:"CaretTop",onClick:F=>Ze(n.$index,n.row)},{default:o(()=>[h("上移")]),_:2},1032,["onClick"]),a(Ee,{icon:"CaretBottom",divided:"",onClick:F=>el(n.$index,n.row)},{default:o(()=>[h("下移")]),_:2},1032,["onClick"])]),_:2},1024)]),default:o(()=>[a(u,{type:"primary",size:"small",icon:"DCaret"})]),_:2},1024)]),_:1}),a(E,{prop:"goodsLineNo",label:"序号",width:"55",align:"center"}),(f(!0),B(M,null,oe(rl.value,n=>(f(),B(M,null,[n.show?(f(),S(E,{key:0,prop:n.prop,"min-width":n.width,label:n.label,align:n.align,sortable:""},{default:o(F=>[n.useTemplate&&!ue.value?(f(),S(P,{key:0,modelValue:F.row[n.prop],"onUpdate:modelValue":Re=>F.row[n.prop]=Re},null,8,["modelValue","onUpdate:modelValue"])):(f(),B("span",ca,c(F.row[n.prop]),1))]),_:2},1032,["prop","min-width","label","align"])):$("",!0)],64))),256))]),_:1},8,["data","stripe","highlight-current-row","default-sort"])),[[Rl,de.value]])]),s("table",va,[s("tbody",null,[s("tr",null,[s("td",ma,[s("div",ga,[s("span",null,"价税合计:"+c(e.value.invoiceTotalPriceTax),1),s("span",null,"无税金额:"+c(e.value.invoiceTotal),1),s("span",null,"税额:"+c(e.value.invoiceTotalTax),1)])])]),s("tr",fa,[ha,s("td",ba,[a(p,{style:{height:"100%"},model:e.value,ref_key:"ruleFormRef",ref:Q},{default:o(()=>[a(i,{style:{margin:"0px 0px 0px !important",padding:"0 !important"},prop:"remarks"},{default:o(()=>[a(P,{type:"textarea",modelValue:e.value.remarks,"onUpdate:modelValue":t[19]||(t[19]=n=>e.value.remarks=n)},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),ya,s("td",wa,[a(p,{model:e.value,rules:ul,ref_key:"ruleFormRef",ref:Q},{default:o(()=>[a(i,{label:"手机号码:",prop:"phone"},{default:o(()=>[g(a(P,{placeholder:"请输入手机号码",modelValue:e.value.phone,"onUpdate:modelValue":t[20]||(t[20]=n=>e.value.phone=n)},null,8,["modelValue"]),[[y,!w.value]]),g(s("span",null,c(e.value.phone),513),[[y,w.value]])]),_:1}),a(i,{label:"邮箱地址:",prop:"buyerEmail"},{default:o(()=>[g(a(P,{placeholder:"请输入邮箱地址",modelValue:e.value.buyerEmail,"onUpdate:modelValue":t[21]||(t[21]=n=>e.value.buyerEmail=n)},null,8,["modelValue"]),[[y,!w.value]]),g(s("span",null,c(e.value.buyerEmail),513),[[y,w.value]])]),_:1})]),_:1},8,["model"])])])])]),a(me,{title:"选择购买方",style:{"min-height":"637px"},modelValue:X.value,"onUpdate:modelValue":t[25]||(t[25]=n=>X.value=n),"align-center":"",onOpen:we,onClose:vl,"destroy-on-close":"",width:"1200px",draggable:"","close-on-click-modal":!1},{default:o(()=>[a(p,{inline:!0,model:I.value,class:"inline"},{default:o(()=>[a(i,null,{default:o(()=>[a(P,{placeholder:"请输入购买方名称",style:{"min-width":"300px"},modelValue:I.value.customername,"onUpdate:modelValue":t[22]||(t[22]=n=>I.value.customername=n),clearable:""},null,8,["modelValue"])]),_:1}),a(i,null,{default:o(()=>[a(u,{type:"primary",onClick:O},{default:o(()=>[h("查询")]),_:1})]),_:1})]),_:1},8,["model"]),a(ve,{class:"eltable",data:be.value,stripe:_.value.tableStripe,border:"","highlight-current-row":_.value.tableHighlightCurrentRow,"max-height":"460",style:{color:"#000"},"header-cell-style":ae,"default-sort":L.value,onSelectionChange:xe},{default:o(()=>[(f(!0),B(M,null,oe(il.value,n=>(f(),B(M,null,[n.show?(f(),S(E,{key:0,prop:n.prop,fixed:n.fixed,label:n.label,align:n.align,width:n.width},Ql({_:2},[n.useTemplate?{name:"default",fn:o(F=>[a(u,{type:"primary",size:"small",onClick:Re=>Bl(F.row)},{default:o(()=>[h("选择")]),_:2},1032,["onClick"])]),key:"0"}:void 0]),1032,["prop","fixed","label","align","width"])):$("",!0)],64))),256))]),_:1},8,["data","stripe","highlight-current-row","default-sort"]),s("div",_a,[a(Fe,{currentPage:_.value.number,"onUpdate:currentPage":t[23]||(t[23]=n=>_.value.number=n),"page-size":_.value.size,"onUpdate:pageSize":t[24]||(t[24]=n=>_.value.size=n),"page-sizes":_.value.sizes,background:_.value.background,layout:_.value.layout,total:_.value.total,onSizeChange:Tl,onCurrentChange:Cl},null,8,["currentPage","page-size","page-sizes","background","layout","total"])])]),_:1},8,["modelValue"]),a(me,{title:"选择产品",style:{height:"637px"},modelValue:j.value,"onUpdate:modelValue":t[29]||(t[29]=n=>j.value=n),"align-center":"",onOpen:cl,onClose:ml,"destroy-on-close":"",width:"1200px",draggable:"","close-on-click-modal":!1},{default:o(()=>[a(p,{inline:!0,model:z.value,class:"inline"},{default:o(()=>[a(i,null,{default:o(()=>[a(P,{placeholder:"请输入商品名称",modelValue:z.value.productname,"onUpdate:modelValue":t[26]||(t[26]=n=>z.value.productname=n),style:{width:"250px"},clearable:""},null,8,["modelValue"])]),_:1}),a(i,null,{default:o(()=>[a(u,{type:"primary",onClick:le},{default:o(()=>[h("查询")]),_:1}),a(u,{type:"primary",onClick:bl},{default:o(()=>[h("选择商品")]),_:1})]),_:1})]),_:1},8,["model"]),a(ve,{class:"eltable",data:ye.value,stripe:x.value.tableStripe,border:"","highlight-current-row":x.value.tableHighlightCurrentRow,height:"460",style:{color:"#000"},"header-cell-style":ae,"default-sort":L.value,onSelectionChange:hl},{default:o(()=>[a(E,{type:"selection",width:"55",align:"center"}),(f(!0),B(M,null,oe(dl.value,n=>(f(),B(M,null,[n.show?(f(),S(E,{key:0,prop:n.prop,fixed:n.fixed,label:n.label,align:n.align,"min-width":n.width},null,8,["prop","fixed","label","align","min-width"])):$("",!0)],64))),256))]),_:1},8,["data","stripe","highlight-current-row","default-sort"]),s("div",xa,[a(Fe,{currentPage:x.value.number,"onUpdate:currentPage":t[27]||(t[27]=n=>x.value.number=n),"page-size":x.value.size,"onUpdate:pageSize":t[28]||(t[28]=n=>x.value.size=n),"page-sizes":x.value.sizes,background:x.value.background,layout:x.value.layout,total:x.value.total,onSizeChange:Pl,onCurrentChange:Vl},null,8,["currentPage","page-size","page-sizes","background","layout","total"])])]),_:1},8,["modelValue"]),a(me,{modelValue:K.value,"onUpdate:modelValue":t[30]||(t[30]=n=>K.value=n),top:"5vh",title:"完成进度","align-center":"",onClosed:al,"destroy-on-close":"",width:"600px",draggable:"","close-on-click-modal":!1},{default:o(()=>[a(p,{style:{width:"100%"}},{default:o(()=>[s("div",ka,[a(Ml,{"text-inside":!0,"stroke-width":18,color:l.customColorMethod,percentage:H.value,striped:"","striped-flow":""},{default:o(()=>[Na,s("span",null,c(H.value)+"%",1)]),_:1},8,["color","percentage"]),s("div",Ta,[s("div",Ca,[a(Me,{value:U.value},{title:o(()=>[Pa]),suffix:o(()=>[h("/"+c(D.value.length)+"张",1)]),_:1},8,["value"])]),s("div",Va,[a(Me,{value:ee.value},{title:o(()=>[Ba]),suffix:o(()=>[h("张")]),_:1},8,["value"])])])])]),_:1})]),_:1},8,["modelValue"])])}}});const $a=Wl(Sa,[["__scopeId","data-v-ad64177d"]]);export{$a as default};