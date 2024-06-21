import{ai as f,aT as p,aF as X,c as A,a as w,W as t,bD as n,bF as J,H as k,aX as s,aY as K,o as h,bi as z,U as c,b9 as V}from"./_@vue-5ba92de9.js";const Q={class:"roadui_page"},Z=["onClick"],ee={class:"roadui_pagerdiv"},te={__name:"mystart",props:{query:{type:String,default:()=>""}},setup(N){const T=f("ajax"),r=f("utils"),B=f("qs"),P=f("ElSelectflow"),x=f("index_openmenu"),y=N,g=p(!1),d=p(!1),u=p({status:r.query("status",y.query)||"0"}),v=p([]),D=p([]),S=p({prop:"receivetime",order:"descending"}),o=p(r.getPager(S.value));X(()=>{m(!1)});const Y=a=>{o.value.size=a,m(!1)},$=a=>{o.value.number=a,m(!1)},j=a=>{o.value.order=r.getOrder(a),m(!1)},m=a=>{a&&(o.value.number=1),g.value=!0,d.value=!0,u.value.size=o.value.size,u.value.number=o.value.number,u.value.order=o.value.order,u.value.date1=r.length(v.value)>0?v.value[0]:"",u.value.date2=r.length(v.value)>1?v.value[1]:"",T.post("/Flow/GetMyStartList",B.stringify(u.value)).then(e=>{D.value=e.data.rows,o.value.total=e.data.total,d.value=!1,g.value=!1}).catch(()=>{d.value=!1,g.value=!1})},q=a=>{let e="/flow/run/index?flowid="+a.flowId+"&stepid="+a.stepId+"&taskid="+a.id+"&groupid="+a.groupId+"&instanceid="+a.instanceId,b=0;r.query("isiframe",y.query)==1&&(e+="&nroadflow-token="+r.query("nroadflow-token",y.query),b=1);const i={title:a.title,id:"task_"+a.id,url:e,ico:"Folder",openMode:b,width:1e3,height:620};x(i)},F=a=>{const e={id:"task_process_"+r.createGuid(!1),title:a.title,url:"/flow/run/process?flowid="+a.flowId+"&groupid="+a.groupId+"&status="+u.value.status,openMode:1,width:"1150px",customClass:"el-dialog__padding",center:!1};x(e)};return(a,e)=>{const b=s("el-input"),i=s("el-form-item"),E=s("el-date-picker"),I=s("el-radio-button"),H=s("el-radio-group"),C=s("el-button"),G=s("el-form"),_=s("el-table-column"),U=s("el-tag"),O=s("el-space"),R=s("el-table"),L=s("el-pagination"),W=K("loading");return h(),A("div",Q,[w("div",null,[t(G,{inline:!0},{default:n(()=>[t(i,{label:"标题"},{default:n(()=>[t(b,{modelValue:u.value.title,"onUpdate:modelValue":e[0]||(e[0]=l=>u.value.title=l),style:{width:"130px"},clearable:""},null,8,["modelValue"])]),_:1}),t(i,{label:"流程"},{default:n(()=>[t(z(P),{modelValue:u.value.flowId,"onUpdate:modelValue":e[1]||(e[1]=l=>u.value.flowId=l),"auth-type":6,style:{width:"160px"}},null,8,["modelValue"])]),_:1}),t(i,{label:"发起时间"},{default:n(()=>[t(E,{modelValue:v.value,"onUpdate:modelValue":e[2]||(e[2]=l=>v.value=l),style:{width:"210px"},type:"daterange","value-format":"YYYY-MM-DD","unlink-panels":"","start-placeholder":"开始日期","end-placeholder":"结束日期",shortcuts:z(r).dateShortucts},null,8,["modelValue","shortcuts"])]),_:1}),t(i,{label:"流程状态"},{default:n(()=>[t(H,{modelValue:u.value.status,"onUpdate:modelValue":e[3]||(e[3]=l=>u.value.status=l),onChange:e[4]||(e[4]=l=>m(!0))},{default:n(()=>[t(I,{label:"0"},{default:n(()=>[c("进行中")]),_:1}),t(I,{label:"1"},{default:n(()=>[c("已结束")]),_:1})]),_:1},8,["modelValue"])]),_:1}),t(i,null,{default:n(()=>[t(C,{type:"primary",disabled:d.value,onClick:e[5]||(e[5]=l=>m(!0))},{default:n(()=>[c("查询")]),_:1},8,["disabled"])]),_:1})]),_:1})]),w("div",null,[J((h(),k(R,{data:D.value,stripe:o.value.tableStripe,border:o.value.tableBorder,style:{width:"100%"},"highlight-current-row":o.value.tableHighlightCurrentRow,"default-sort":S.value,onSortChange:j},{default:n(()=>[t(_,{prop:"title",label:"标题",sortable:"custom"},{default:n(l=>[w("a",{class:"roaduia",href:"javascript:;",onClick:M=>q(l.row)},V(l.row.title),9,Z)]),_:1}),t(_,{prop:"flowName",label:"流程",width:"190",sortable:"custom"}),t(_,{prop:"receiveTime",label:"发起时间",width:"150",sortable:"custom"}),t(_,{prop:"stepName",label:"当前步骤",width:"190"},{default:n(l=>[u.value.status==0?(h(),k(U,{key:0},{default:n(()=>[c(V(l.row.stepName),1)]),_:2},1024)):(h(),k(U,{key:1},{default:n(()=>[c(V(z(r).getTaskHadleTitle(parseInt(l.row.stepName)||2)),1)]),_:2},1024))]),_:1}),t(_,{width:"138"},{default:n(l=>[t(O,null,{default:n(()=>[t(C,{type:"primary",size:"small",disabled:d.value,onClick:M=>q(l.row)},{default:n(()=>[c("表单")]),_:2},1032,["disabled","onClick"]),t(C,{type:"info",size:"small",disabled:d.value,onClick:M=>F(l.row)},{default:n(()=>[c("过程")]),_:2},1032,["disabled","onClick"])]),_:2},1024)]),_:1})]),_:1},8,["data","stripe","border","highlight-current-row","default-sort"])),[[W,g.value]]),w("div",ee,[t(L,{currentPage:o.value.number,"onUpdate:currentPage":e[6]||(e[6]=l=>o.value.number=l),"page-size":o.value.size,"onUpdate:pageSize":e[7]||(e[7]=l=>o.value.size=l),"page-sizes":o.value.sizes,background:o.value.background,layout:o.value.layout,total:o.value.total,disabled:d.value,onSizeChange:Y,onCurrentChange:$},null,8,["currentPage","page-size","page-sizes","background","layout","total","disabled"])])])])}}};export{te as default};
