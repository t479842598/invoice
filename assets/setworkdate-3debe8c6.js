import{ai as b,aT as _,aF as G,c as r,a as t,U as B,W as C,bD as D,b9 as x,aX as h,o,F as k,aV as m,H as T,aw as U,bi as $}from"./_@vue-5ba92de9.js";const E={class:"roadui_page"},H={style:{"margin-bottom":"20px"}},J=t("span",{class:"roadui_note"},"提示：点击单元格背景即设置为节假日",-1),K={style:{"font-weight":"bold","margin-bottom":"8px"}},L={cellpadding:"0",cellspacing:"0",border:"0",class:"roadui_workdatetable"},M=t("tr",null,[t("td",null,"一"),t("td",null,"二"),t("td",null,"三"),t("td",null,"四"),t("td",null,"五"),t("td",null,"六"),t("td",null,"日")],-1),X=["onClick"],Q={__name:"setworkdate",setup(A){const f=b("ajax"),d=b("utils"),F=b("qs"),V=_([]),y=_(new Date().getFullYear()),n=_([]),s=_(!1),W=_(0);G(()=>{N()});const N=()=>{s.value=!0,f.post("/Calendar/GetWorkDateYearOptions").then(a=>{V.value=a.data,s.value=!1,g()}).catch(()=>{s.value=!1})},g=()=>{s.value=!0,f.post("/Calendar/GetWorkDateDays?year="+y.value).then(a=>{n.value=a.data.days,W.value=a.data.workdaycount,s.value=!1}).catch(()=>{s.value=!1})},O=()=>{g()},Y=a=>{d.length(a.day)<=0||(a.iswork==0?a.iswork=1:a.iswork=0)},S=()=>{let a=[];for(let e=0;e<n.value.length;e++){let v=n.value[e].month;for(let u=0;u<n.value[e].days.length;u++)for(let i=0;i<n.value[e].days[u].days.length;i++){let c=n.value[e].days[u].days[i].day;if(d.length(c)<=0)continue;let l=n.value[e].days[u].days[i].iswork;a.push({day:y.value+"-"+(d.length(v)<2?"0"+v:v)+"-"+(d.length(c)<2?"0"+c:c),iswork:l})}}s.value=!0,f.post("/Calendar/SaveWorkDate",F.stringify({year:y.value,days:JSON.stringify(a)})).then(e=>{d.msg(e.success?"保存成功！":"保存失败！",e.success),g(),s.value=!1}).catch(()=>{s.value=!1})};return(a,e)=>{const v=h("el-option"),u=h("el-select"),i=h("el-button"),c=h("el-space");return o(),r("div",E,[t("div",H,[B(" 年份："),C(u,{onChange:O,modelValue:y.value,"onUpdate:modelValue":e[0]||(e[0]=l=>y.value=l),style:{"margin-right":"10px",width:"120px"}},{default:D(()=>[(o(!0),r(k,null,m(V.value,l=>(o(),T(v,{key:l.value,label:l.title,value:l.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"]),t("span",null,"共有工作日"+x(W.value)+"天",1),C(i,{onClick:e[1]||(e[1]=l=>S()),type:"primary",style:{margin:"0 10px"},disabled:s.value},{default:D(()=>[B("保存设置")]),_:1},8,["disabled"]),J]),C(c,{wrap:"",size:40},{default:D(()=>[(o(!0),r(k,null,m(n.value,(l,w)=>(o(),r("div",{key:"month_"+w},[t("div",K,x(l.month)+"月",1),t("table",L,[M,(o(!0),r(k,null,m(l.days,(q,j)=>(o(),r("tr",{key:"day_"+w+j},[(o(!0),r(k,null,m(q.days,(p,z)=>(o(),r("td",{key:"day1_"+w+j+z,onClick:I=>Y(p),class:U($(d).hasKey(p,"iswork")&&p.iswork==0?"roadui_workdatework":"")},x(p.day),11,X))),128))]))),128))])]))),128))]),_:1})])}}};export{Q as default};
