import{d as E,ai as o,aT as e,b5 as J,c as R,W as t,bD as i,a as v,bF as y,H as w,Q as V,aX as s,aY as X,o as g,U as c,I as x,b9 as j}from"./_@vue-5ba92de9.js";import{_ as H}from"./index-823f4b27.js";import"./__vendor-5e6ac033.js";import"./_@element-plus-ad4c9002.js";import"./_crypto-js-0812dcff.js";import"./_element-plus-8c7ce171.js";import"./_@popperjs-c75af06c.js";import"./_pdfjs-dist-c04561eb.js";import"./_@microsoft-43c4e133.js";import"./_vue-codemirror-50da885a.js";const U={class:"table-container"},F=V('<div class="table-text" data-v-5bba7e7a><table border="0" class="table" data-v-5bba7e7a><tr data-v-5bba7e7a><td width="65%" align="center" data-v-5bba7e7a> 发票张数：9999张 </td><td width="17.5%" data-v-5bba7e7a> 发票总金额：99999元 </td><td width="17.5%" data-v-5bba7e7a> 发票总税额：99999元 </td></tr></table></div><div data-v-5bba7e7a><h3 class="before" data-v-5bba7e7a>发票明细</h3></div>',2),O={class:"table-container"},z=E({__name:"task",props:{query:{type:String,default:()=>""}},setup(T){o("ajax");const l=o("utils");o("config"),o("qs"),o("index_openmenu"),o("index_removetab"),o("index_refreshtab");const q=o("view_dialogshow"),r=T,p=e({prop:"userNumber",order:"ascending"}),u=e(l.getPager(p.value));e(!1);const N=e(!1),k=e(!1);l.getToken(),e([{title:"我的文件",dir:""}]),o("index_dialogshow"),o("index_regcomponent"),l.query("formid",r.query),l.length(l.query("programid",r.query))>0?o("programrun_programcomponentref"):e(null),l.query("isminiprogram",r.query);var D=l.query("isapp",r.query);l.query("isemail",r.query),C=="1"&&D!="1"&&o("indexm_refreshpage"),o("index_dialogcomponentId"),o("index_dialogcomponentquery"),e(!1),e(""),e(""),e(""),l.query("stepid",r.query),l.query("taskid",r.query),l.query("instanceid",r.query),e(null),e("");const S=e("");localStorage.getItem("sobInfo")!=""&&(S.value=JSON.parse(localStorage.getItem("sobInfo"))),e([]),e([]),e([]),e({}),e({}),e(null),e(""),l.query("display",r.query),l.query("openmode",r.query);var C=l.query("ismobile",r.query);e(!1),e(""),e(""),e(""),e(""),e(!0),J(null),o("flowrun_form"),o("flowrun_step"),e(null),e([]),e("");const I=e([{id:1,MissionNumber:"0001",billcode:"10001",buyerName:"深圳市腾讯计算机系统有限公司",TaxpayerNumber:"91440300MA5EJQ6X7D",invoiceDate:"2021-07-01",invoiceTotalPrice:"1000.00",goodsTotalTax:"100.00",status:"开票完成",invoiceresult:"开票成功"},{id:2,MissionNumber:"0002",billcode:"10002",buyerName:"深圳市腾讯计算机系统有限公司",TaxpayerNumber:"91440300MA5EJQ6X7D",invoiceDate:"2021-07-01",invoiceTotalPrice:"1000.00",goodsTotalTax:"100.00",status:"开票完成",invoiceresult:"开票成功"},{id:3,MissionNumber:"0003",billcode:"10003",buyerName:"深圳市腾讯计算机系统有限公司",TaxpayerNumber:"91440300MA5EJQ6X7D",invoiceDate:"2021-07-01",invoiceTotalPrice:"1000.00",goodsTotalTax:"100.00",status:"开票完成",invoiceresult:"开票成功"},{id:4,MissionNumber:"0004",billcode:"10004",buyerName:"深圳市腾讯计算机系统有限公司",TaxpayerNumber:"91440300MA5EJQ6X7D",invoiceDate:"2021-07-01",invoiceTotalPrice:"1000.00",goodsTotalTax:"100.00",status:"开票完成",invoiceresult:"开票成功"}]),M=e([{id:1,peojectname:"项目名称",goodsSpecification:"规格型号",goodsUnit:"单位",goodsQuantity:"数量",goodsPrice:"单价",invoiceTotalPrice:"金额",goodsTaxRate:"税率/征收率",goodsTotalTax:"税额"}]),P=()=>{q.value=!1};function m({row:B,column:b,rowIndex:n,columnIndex:_}){return{color:"#000",textAlign:"center"}}return e(""),e(""),e("部门项目"),e(),e(),e({id:""}),e({}),(B,b)=>{const n=s("el-button"),_=s("el-form-item"),Q=s("el-form"),a=s("el-table-column"),A=s("el-tag"),f=s("el-table"),h=X("loading");return g(),R("div",null,[t(Q,{ref:"formbutton",inline:""},{default:i(()=>[t(_,null,{default:i(()=>[t(n,{icon:"Files",type:"warning"},{default:i(()=>[c("保存")]),_:1}),t(n,{icon:"Select",type:"primary"},{default:i(()=>[c("提交")]),_:1}),t(n,{icon:"Delete",type:"danger"},{default:i(()=>[c("作废")]),_:1}),t(n,{icon:"Close",type:"default",onClick:P},{default:i(()=>[c("关闭")]),_:1})]),_:1})]),_:1},512),v("div",U,[y((g(),w(f,{data:I.value,stripe:u.value.tableStripe,border:"","highlight-current-row":u.value.tableHighlightCurrentRow,style:{width:"100%",color:"#000"},"header-cell-style":m,"default-sort":p.value},{default:i(()=>[x("",!0),t(a,{label:"序号",type:"index",align:"center",width:"60"}),t(a,{prop:"MissionNumber",label:"任务号",align:"center",width:"100"}),t(a,{prop:"billcode",label:"销售单据号",align:"center",width:"200"}),t(a,{prop:"buyerName",label:"客户名称",align:"center",width:"250"}),t(a,{prop:"TaxpayerNumber",label:"税号",align:"center",width:"200"}),t(a,{prop:"invoiceDate",label:"开票日期",align:"center",width:"150"}),t(a,{prop:"invoiceTotalPrice",label:"金额",align:"right",width:"120"}),t(a,{prop:"goodsTotalTax",label:"税额",align:"center",width:"100"}),t(a,{prop:"status",label:"开票状态",align:"center",width:"150"},{default:i(d=>[t(A,{effect:"light",type:d.row.status=="开票完成"?"success":d.row.status=="待开票"?"danger":d.row.status=="已开票待返回电子版"?"warning":"info"},{default:i(()=>[c(j(d.row.status),1)]),_:2},1032,["type"])]),_:1}),t(a,{prop:"invoiceresult",label:"开票结果",align:"center",width:"150"}),t(a,{label:"操作",align:"center"},{default:i(d=>[t(n,{type:"success",size:"small",onClick:b[0]||(b[0]=()=>{})},{default:i(()=>[c("预览")]),_:1})]),_:1})]),_:1},8,["data","stripe","highlight-current-row","default-sort"])),[[h,N.value]])]),F,v("div",O,[y((g(),w(f,{data:M.value,stripe:u.value.tableStripe,border:"","highlight-current-row":u.value.tableHighlightCurrentRow,style:{width:"80%",color:"#000"},"header-cell-style":m,"default-sort":p.value},{default:i(()=>[x("",!0),t(a,{prop:"peojectname",label:"项目名称",align:"center",width:"200"}),t(a,{prop:"goodsSpecification",label:"规格型号",align:"center",width:"200"}),t(a,{prop:"goodsUnit",label:"单位",align:"center",width:"100"}),t(a,{prop:"goodsQuantity",label:"数量",align:"center",width:"100"}),t(a,{prop:"goodsPrice",label:"单价",align:"center",width:"120"}),t(a,{prop:"invoiceTotalPrice",label:"金额",align:"right",width:"120"}),t(a,{prop:"goodsTaxRate",label:"税率/征收率",align:"center",width:"200"}),t(a,{prop:"goodsTotalTax",label:"税额",align:"center"})]),_:1},8,["data","stripe","highlight-current-row","default-sort"])),[[h,k.value]])])])}}});const oe=H(z,[["__scopeId","data-v-5bba7e7a"]]);export{oe as default};