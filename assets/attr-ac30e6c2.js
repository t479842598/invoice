import{ai as V,aT as g,aF as ee,c as f,W as a,bD as s,aX as m,o as v,U as c,a as t,b9 as h,bi as u,F as x,aV as U,H as C}from"./_@vue-5ba92de9.js";const le={cellpadding:"0",cellspacing:"0",border:"0",class:"roadui_fromtable"},te=t("th",{style:{width:"80px"}},"流程id",-1),ae=t("th",null,"流程名称",-1),ne=t("th",null,"流程分类",-1),oe={style:{"margin-left":"12px"}},ue=t("th",null,"流程管理",-1),se={style:{"margin-left":"12px"}},de=t("th",null,"调试模式",-1),ie=t("th",null,"流程图标",-1),re=t("span",{style:{margin:"0 12px"}},"颜色",-1),me=t("span",{class:"roadui_note",style:{"margin-left":"12px"}},"流程发起页面显示的图标和颜色",-1),pe=t("th",null,"备注",-1),_e={class:"roadui_note1"},ve={class:"roadui_note1"},ye={cellpadding:"0",cellspacing:"0",border:"0",class:"roadui_fromtable"},ce=t("th",{style:{width:"80px"}},"标识字段",-1),be={class:"roadui_note1"},he=t("th",null,"标识值",-1),Ve=t("th",null,"完成后事件",-1),ge=t("th",null,"暂缓后事件",-1),fe=t("th",null,"终止后事件",-1),we=t("th",null,"作废后事件",-1),Ue={__name:"attr",setup(ke){const j=V("ajax"),i=V("utils"),N=V("qs"),O=V("ElSelectorg"),$=V("ElSelectico"),n=V("flowJson"),B=g([]),E=g([]);ee(()=>{J()});const J=()=>{j.post("/Flow/GetApiSystemOptions?flowtype="+n.value.type).then(o=>{E.value=o.data.options,P()}).catch(()=>{})},P=()=>{const o=[{id:"system_applibrary_flowtype",key:"type",children:!0,valueField:"id"}];j.post("/Dictionary/GetMultipleOptions",N.stringify({json:JSON.stringify(o)})).then(l=>{B.value=l.data.type,I()}).catch(()=>{})},S=g([]),p=g([]),D=g({}),q=()=>{p.value.push({key:i.createGuid(!1),id:"",table:"",primaryKey:"",conns:[...S.value],tables:[],fields:[]})},z=o=>{i.removeArrayObj(p.value,o.key,"key")},I=()=>{i.getConns().then(o=>{S.value=[...o];let l=i.length(n.value.databases)>0?n.value.databases:[];for(let _=0;_<l.length;_++){let y={key:i.createGuid(!1),id:l[_].link,table:l[_].table,primaryKey:l[_].primaryKey,conns:[...o],tables:[],fields:[]};i.length(y.id)>0&&A(y,!0),p.value.push(y)}L()})},A=(o,l)=>{i.isUndef(o)||i.getConnTables(o.id).then(_=>{o.tables=_,l&&G(o)})},G=o=>{i.isUndef(o)||i.getConnTableFields(o.id,o.table).then(l=>{o.fields=l,p.value.length>0&&p.value[0].key===o.key&&(D.value=l)})},F=()=>{let o=[];for(let l=0;l<p.value.length;l++){if(i.length(p.value[l].id)===0||i.length(p.value[l].table)===0||i.length(p.value[l].primaryKey)===0)continue;let _="";const y=i.getArrayObj(S.value,p.value[l].id,"id");i.isDef(y)&&(_=y.title),o.push({index:l,link:p.value[l].id,name:_,table:p.value[l].table,primaryKey:p.value[l].primaryKey})}n.value.databases=o},r=g({}),L=()=>{if(i.length(n.value.titleField)>0)r.value=n.value.titleField;else{const o={link:"",table:"",primaryKey:"",field:"",value:"",eventCompleted:"",eventStop:""};n.value.titleField=o,r.value=o}i.length(n.value.databases)>0&&(r.value.link=n.value.databases[0].link,r.value.primaryKey=n.value.databases[0].primaryKey,i.getConnTableFields(r.value.link,r.value.table).then(o=>{D.value=o}))};return(o,l)=>{const _=m("Operation"),y=m("el-icon"),b=m("el-input"),H=m("el-cascader"),w=m("el-option"),k=m("el-select"),W=m("el-switch"),X=m("el-color-picker"),T=m("el-tab-pane"),Q=m("Coin"),K=m("el-table-column"),M=m("el-button"),R=m("el-table"),Y=m("Discount"),Z=m("el-tabs");return v(),f("div",null,[a(Z,null,{default:s(()=>[a(T,{name:"0",style:{height:"100%"}},{label:s(()=>[a(y,{class:"roadui_main_tabsvg"},{default:s(()=>[a(_)]),_:1}),c("流程属性 ")]),default:s(()=>[t("table",le,[t("tr",null,[te,t("td",null,h(u(n).id),1)]),t("tr",null,[ae,t("td",null,[a(b,{modelValue:u(n).name,"onUpdate:modelValue":l[0]||(l[0]=e=>u(n).name=e),clearable:""},null,8,["modelValue"])])]),t("tr",null,[ne,t("td",null,[a(H,{modelValue:u(n).type,"onUpdate:modelValue":l[1]||(l[1]=e=>u(n).type=e),options:B.value,style:{width:"330px"},props:{expandTrigger:"hover"},clearable:""},null,8,["modelValue","options"]),t("span",oe,[c(" 所属系统"),a(k,{modelValue:u(n).systemId,"onUpdate:modelValue":l[2]||(l[2]=e=>u(n).systemId=e),clearable:"",style:{width:"253px","margin-left":"12px"}},{default:s(()=>[(v(!0),f(x,null,U(E.value,e=>(v(),C(w,{key:e.value,value:e.value,label:e.title},null,8,["value","label"]))),128))]),_:1},8,["modelValue"])])])]),t("tr",null,[ue,t("td",null,[a(u(O),{modelValue:u(n).manager,"onUpdate:modelValue":l[3]||(l[3]=e=>u(n).manager=e),"select-type":"user",style:{width:"330px"},clearable:""},null,8,["modelValue"]),t("span",se,[c(" 实例管理"),a(u(O),{modelValue:u(n).instanceManager,"onUpdate:modelValue":l[4]||(l[4]=e=>u(n).instanceManager=e),"select-type":"user",style:{width:"253px","margin-left":"12px"},clearable:""},null,8,["modelValue"])])])]),t("tr",null,[de,t("td",null,[a(W,{modelValue:u(n).debug,"onUpdate:modelValue":l[5]||(l[5]=e=>u(n).debug=e),style:{"margin-right":"12px"},"active-value":"1","inactive-value":"0"},null,8,["modelValue"]),c(" 调试人员"),a(u(O),{modelValue:u(n).debugUsers,"onUpdate:modelValue":l[6]||(l[6]=e=>u(n).debugUsers=e),style:{"margin-left":"12px",width:"543px"}},null,8,["modelValue"])])]),t("tr",null,[ie,t("td",null,[a(u($),{modelValue:u(n).ico,"onUpdate:modelValue":l[7]||(l[7]=e=>u(n).ico=e),style:{width:"280px"},clearable:""},null,8,["modelValue"]),re,a(X,{modelValue:u(n).color,"onUpdate:modelValue":l[8]||(l[8]=e=>u(n).color=e)},null,8,["modelValue"]),me])]),t("tr",null,[pe,t("td",null,[a(b,{modelValue:u(n).note,"onUpdate:modelValue":l[9]||(l[9]=e=>u(n).note=e),clearable:"",style:{width:"100%"}},null,8,["modelValue"])])])])]),_:1}),a(T,{name:"1",style:{height:"100%"}},{label:s(()=>[a(y,{class:"roadui_main_tabsvg"},{default:s(()=>[a(Q)]),_:1}),c("数据连接 ")]),default:s(()=>[a(R,{data:p.value,"row-key":e=>e.key,style:{width:"100%"}},{default:s(()=>[a(K,{label:"数据连接",width:"160"},{default:s(e=>[a(k,{modelValue:e.row.id,"onUpdate:modelValue":d=>e.row.id=d,onChange:d=>{A(e.row),F()}},{default:s(()=>[(v(!0),f(x,null,U(e.row.conns,d=>(v(),C(w,{key:d.id,value:d.id,label:d.title},null,8,["value","label"]))),128))]),_:2},1032,["modelValue","onUpdate:modelValue","onChange"])]),_:1}),a(K,{label:"数据表",width:"250"},{default:s(e=>[a(k,{modelValue:e.row.table,"onUpdate:modelValue":d=>e.row.table=d,onChange:d=>{G(e.row),F()},filterable:""},{default:s(()=>[(v(!0),f(x,null,U(e.row.tables,d=>(v(),C(w,{key:d.key,value:d.key},{default:s(()=>[t("span",null,h(d.key),1),t("span",_e,h(u(i).length(d.label)>0?" - "+d.label:""),1)]),_:2},1032,["value"]))),128))]),_:2},1032,["modelValue","onUpdate:modelValue","onChange"])]),_:1}),a(K,{label:"表主键",width:"250"},{default:s(e=>[a(k,{modelValue:e.row.primaryKey,"onUpdate:modelValue":d=>e.row.primaryKey=d,onChange:l[10]||(l[10]=d=>F()),filterable:""},{default:s(()=>[(v(!0),f(x,null,U(e.row.fields,d=>(v(),C(w,{key:d.name,value:d.name},{default:s(()=>[t("span",null,h(d.name),1),t("span",ve,h(u(i).length(d.comment)>0?" - "+d.comment:""),1)]),_:2},1032,["value"]))),128))]),_:2},1032,["modelValue","onUpdate:modelValue"])]),_:1}),a(K,{width:"75"},{header:s(()=>[a(M,{size:"small",type:"primary",onClick:q},{default:s(()=>[c("添加")]),_:1})]),default:s(e=>[a(M,{size:"small",type:"primary",onClick:d=>{z(e.row),F()}},{default:s(()=>[c("删除")]),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data","row-key"])]),_:1}),a(T,{name:"2",style:{height:"100%"}},{label:s(()=>[a(y,{class:"roadui_main_tabsvg"},{default:s(()=>[a(Y)]),_:1}),c("标识事件 ")]),default:s(()=>[t("table",ye,[t("tr",null,[ce,t("td",null,[a(k,{modelValue:r.value.field,"onUpdate:modelValue":l[11]||(l[11]=e=>r.value.field=e),filterable:"",clearable:"",style:{width:"100%"}},{default:s(()=>[(v(!0),f(x,null,U(D.value,e=>(v(),C(w,{disabled:e.isPrimaryKey,key:e.name,value:e.name},{default:s(()=>[t("span",null,h(e.name),1),t("span",be,h(u(i).length(e.comment)>0?" - "+e.comment:""),1)]),_:2},1032,["disabled","value"]))),128))]),_:1},8,["modelValue"])])]),t("tr",null,[he,t("td",null,[a(b,{modelValue:r.value.value,"onUpdate:modelValue":l[12]||(l[12]=e=>r.value.value=e),clearable:""},null,8,["modelValue"])])]),t("tr",null,[Ve,t("td",null,[a(b,{modelValue:r.value.eventCompleted,"onUpdate:modelValue":l[13]||(l[13]=e=>r.value.eventCompleted=e),type:"textarea",placeholder:"流程审批结束后执行"},null,8,["modelValue"])])]),t("tr",null,[ge,t("td",null,[a(b,{modelValue:r.value.eventPostpone,"onUpdate:modelValue":l[14]||(l[14]=e=>r.value.eventPostpone=e),type:"textarea",placeholder:"流程审批暂缓后执行"},null,8,["modelValue"])])]),t("tr",null,[fe,t("td",null,[a(b,{modelValue:r.value.eventStop,"onUpdate:modelValue":l[15]||(l[15]=e=>r.value.eventStop=e),type:"textarea",placeholder:"流程审批终止后执行"},null,8,["modelValue"])])]),t("tr",null,[we,t("td",null,[a(b,{modelValue:r.value.eventDelete,"onUpdate:modelValue":l[16]||(l[16]=e=>r.value.eventDelete=e),type:"textarea",placeholder:"流程作废后执行"},null,8,["modelValue"])])])])]),_:1})]),_:1})])}}};export{Ue as default};