import{d as oe,aT as e,ai as u,aF as ne,by as re,c as w,bF as O,a as f,W as o,bD as r,H as y,aX as c,aY as se,aN as ie,o as s,U as I,F as P,aV as U,I as $,av as ue,bv as ce}from"./_@vue-5ba92de9.js";import{cC as de}from"./__vendor-5e6ac033.js";const pe={class:"form-container"},me=f("h4",null,"按发票种类统计(开票)",-1),ge={class:"table-container"},he=f("h4",null,"按税率/征收率统计",-1),ve={class:"table-container"},we=oe({__name:"reportTable",props:{query:{type:String,default:()=>""}},setup(fe){e(!1),e(!1);const j=u("ajax"),F=u("utils"),G=u("config"),R=u("qs");u("index_openmenu"),u("index_removetab"),u("index_refreshtab"),u("submit_dialogshow");const Y=e("");localStorage.getItem("sobInfo")!=""&&(Y.value=JSON.parse(localStorage.getItem("sobInfo")));const M=e({prop:"serialNo",order:"ascending"}),W=e({prop:"goodsLineNo",order:"ascending"}),x=e(F.getPager(M.value));e(F.getPager(W.value));const B=e(!1),E=e(!1),T=e(!1),N=e(!1);e(!1),e(""),e(""),e(),e(""),u("index_userinfo");const k=e(!1),b=e(!1),S=e([]),_=e([]),A=e(),X=e([{prop:"invoicetypename",label:"发票种类",align:"center"},{prop:"bluenum",label:"正数发票份数",align:"right"},{prop:"rednum",label:"负数发票份数",align:"right"}]),z=e([{prop:"id",align:"center",show:!1},{prop:"invoicetypename",label:"发票种类",align:"center",show:!0,width:"200"},{prop:"goodsTaxRate",label:"税率/征收率",show:!0,align:"right",width:"120"},{prop:"goodsTotalPrice",label:"开具蓝字发票金额",show:!0,align:"right",width:"150"},{prop:"goodsTotalTax",label:"开具蓝字发票税额",show:!0,align:"right",width:"150"},{prop:"redgoodsTotalPrice",label:"开具红字发票金额",show:!0,align:"right",width:"150"},{prop:"redgoodsTotalTax",label:"开具红字发票税额",show:!0,align:"right",width:"150"},{prop:"chagoodsTotalPrice",label:"实际开具发票金额",show:!0,align:"right",width:"150"},{prop:"chagoodsTotalTax",label:"实际开具发票税颜",show:!0,align:"right",width:"150"}]);ne(async()=>{await V(),await K()});async function V(){try{T.value=!0,N.value=!0,B.value=!0,E.value=!0,l.value.spec=_.value.join(","),l.value.time!=null?(l.value.time1=l.value.time[0],l.value.time2=l.value.time[1]):(l.value.time1="",l.value.time2="");const t=await j.post("/Report/ReportInvoice?srcorgid="+Y.value.id,R.stringify(l.value));T.value=!1,N.value=!1,B.value=!1,E.value=!1,q.value=t.data.invoicenum,H.value=t.data.invoice}catch{B.value=!1,E.value=!1,T.value=!1,N.value=!1}finally{}}const K=async()=>{try{const t=await j.post("invoice_BaseInfo/GetAll",R.stringify({}));t.success&&(S.value=t.data.main)}catch{}},l=e({type:"",spec:"",time:""}),Q=()=>{l.value={type:"",spec:"",time:""},V()};re(l.value.spec,t=>{t.length===0?(k.value=!1,b.value=!1):t.length===S.value.length?(k.value=!0,b.value=!1):b.value=!0});const Z=t=>{b.value=!1,_.value=t?S.value.map(n=>n.code):[],l.value.spec=_.value.join(",")},q=e([]),H=e([]);function ee(){l.value.time1=l.value.time[0],l.value.time2=l.value.time[1],l.value.srcorgid=Y.value.id,ue(()=>{le()})}function le(){de.debounce(()=>{A.value.action=G.SERVER_PRO_APIADDRESS+"/Report/ExportInvoiceDetail?"+R.stringify({whereJSON:JSON.stringify(l.value)}),A.value.submit()},300)()}function J({row:t,column:n,rowIndex:g,columnIndex:i}){return{color:"#000",textAlign:"center"}}const ae=t=>{const{columns:n,data:g}=t,i=[],h=["goodsTotalPrice","goodsTotalTax","deletegoodsTotalPrice","redgoodsTotalPrice","redgoodsTotalTax","deleteredgoodsTotalPrice","deleteredgoodsTotalTax","chagoodsTotalPrice","chagoodsTotalTax","deletegoodsTotalTax"];return n.forEach((D,p)=>{if(p===0){i[p]="合计";return}if(h.includes(D.property)){const v=g.map(d=>Number(d[D.property]));v.every(d=>Number.isNaN(d))?i[p]="":i[p]=` ${v.reduce((d,m)=>{const C=Number(m);return Number.isNaN(C)?Number(d):Number(d)+Number(m)},0).toFixed(2)}`}else i[p]=""}),i};return ie("getTableData",V),(t,n)=>{const g=c("el-option"),i=c("el-select"),h=c("el-form-item"),D=c("el-checkbox"),p=c("el-date-picker"),v=c("el-button"),d=c("el-form"),m=c("el-table-column"),C=c("el-table"),L=se("loading");return s(),w("div",null,[O(f("form",{ref_key:"formref",ref:A,action:"",method:"post"},null,512),[[ce,!1]]),f("div",pe,[o(d,{inline:!0,model:l.value},{default:r(()=>[o(h,{label:"发票类型"},{default:r(()=>[o(i,{modelValue:l.value.type,"onUpdate:modelValue":n[0]||(n[0]=a=>l.value.type=a),placeholder:"",style:{width:"240px"}},{default:r(()=>[o(g,{label:"增值税普通发票",value:"02"}),o(g,{label:"增值税专用发票",value:"01"})]),_:1},8,["modelValue"])]),_:1}),o(h,{label:"特殊票种"},{default:r(()=>[o(i,{modelValue:_.value,"onUpdate:modelValue":n[2]||(n[2]=a=>_.value=a),multiple:"",clearable:"","collapse-tags":"",placeholder:"","popper-class":"custom-header","max-collapse-tags":1,style:{width:"240px"}},{header:r(()=>[o(D,{modelValue:k.value,"onUpdate:modelValue":n[1]||(n[1]=a=>k.value=a),indeterminate:b.value,onChange:Z},{default:r(()=>[I(" 全部 ")]),_:1},8,["modelValue","indeterminate"])]),default:r(()=>[(s(!0),w(P,null,U(S.value,a=>(s(),y(g,{key:a.code,label:a.name,value:a.code},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),o(h,{label:"时间"},{default:r(()=>[o(p,{modelValue:l.value.time,"onUpdate:modelValue":n[3]||(n[3]=a=>l.value.time=a),style:{width:"220px"},format:"YYYY-MM-DD","value-format":"YYYY-MM-DD",type:"daterange","range-separator":"到","start-placeholder":"开始时间","end-placeholder":"结束时间"},null,8,["modelValue"])]),_:1}),o(h,null,{default:r(()=>[o(v,{type:"primary",onClick:n[4]||(n[4]=a=>V()),icon:"Search"},{default:r(()=>[I("查询")]),_:1}),o(v,{icon:"Refresh",style:{"text-align":"right"},onClick:Q},{default:r(()=>[I("重置")]),_:1}),o(v,{type:"warning",onClick:ee,icon:"Upload"},{default:r(()=>[I("导出")]),_:1})]),_:1})]),_:1},8,["model"])]),me,f("div",ge,[O((s(),y(C,{data:q.value,stripe:x.value.tableStripe,border:"","highlight-current-row":x.value.tableHighlightCurrentRow,"max-height":"180",style:{width:"100%",color:"#000"},"header-cell-style":J,onSelectionChange:t.handleSelectionChange},{default:r(()=>[$("",!0),o(m,{type:"index",width:"65",label:"序号",align:"center"}),(s(!0),w(P,null,U(X.value,(a,te)=>(s(),y(m,{fit:"","show-overflow-tooltip":"",key:te,prop:a.prop,label:a.label,align:a.align,width:a.width},null,8,["prop","label","align","width"]))),128))]),_:1},8,["data","stripe","highlight-current-row","onSelectionChange"])),[[L,T.value]])]),he,f("div",ve,[O((s(),y(C,{data:H.value,stripe:x.value.tableStripe,border:"","highlight-current-row":x.value.tableHighlightCurrentRow,"max-height":"500",style:{width:"100%",color:"#000"},"header-cell-style":J,"default-sort":M.value,"summary-method":ae,"show-summary":""},{default:r(()=>[o(m,{type:"index",width:"65",label:"序号",align:"center"}),(s(!0),w(P,null,U(z.value,a=>(s(),w(P,null,[a.show?(s(),y(m,{key:0,fit:"","show-overflow-tooltip":"",prop:a.prop,label:a.label,align:a.align,"min-width":a.width},null,8,["prop","label","align","min-width"])):$("",!0)],64))),256))]),_:1},8,["data","stripe","highlight-current-row","default-sort"])),[[L,N.value]])])])}}});export{we as default};
