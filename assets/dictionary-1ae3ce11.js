import{ai as p,aT as c,aF as N,c as v,W as o,bD as u,aX as n,o as s,a as t,bi as h,U as f,F as x,aV as w,H as j,b9 as z,bF as O,bv as P}from"./_@vue-5ba92de9.js";import{d as H}from"./form-design-8c117009.js";import"./index-823f4b27.js";import"./__vendor-5e6ac033.js";import"./_@element-plus-ad4c9002.js";import"./_crypto-js-0812dcff.js";import"./_element-plus-8c7ce171.js";import"./_@popperjs-c75af06c.js";import"./_pdfjs-dist-c04561eb.js";import"./_@microsoft-43c4e133.js";import"./_vue-codemirror-50da885a.js";import"./_jquery-3a83ed9f.js";const J={class:"roadui_formdesign_subtablediv"},K={class:"roadui_formtable",style:{width:"98%",margin:"0 auto"}},L=t("th",null,"默认值",-1),M=t("th",null,"宽度",-1),W=t("th",null,"选择设置",-1),X=t("th",null,"选择范围",-1),q=t("span",{class:"roadui_note",style:{"margin-left":"12px"}},"0或空不限制",-1),A={class:"roadui_formtable",style:{width:"98%",margin:"0 auto"}},G=t("th",{style:{width:"50px"}},"事件",-1),I=t("th",null,"脚本",-1),ie={__name:"dictionary",setup(Q){const d=p("utils"),U=p("ElSelectdict"),k=p("ElCodemirror"),g=c(null),_=p("setEditRecord"),l=c({}),R=H.defaultValueOptions(),i=c(""),b=c("属性");N(()=>{l.value=_.value.set,d.length(l.value.events)>0&&(i.value=l.value.events[0].name),d.length(_.value.title)>0&&(b.value=_.value.title),g.value.initTitle(l.value.range)});const E=r=>{d.length(r)!==0&&(d.hasKey(l.value,"defaultValue")||(l.value.defaultValue=""),l.value.defaultValue+=r[r.length-1])};return(r,a)=>{const S=n("el-cascader"),V=n("el-input"),m=n("el-checkbox"),D=n("el-input-number"),y=n("el-tab-pane"),C=n("el-option"),T=n("el-select"),B=n("el-tabs");return s(),v("div",J,[o(B,null,{default:u(()=>[o(y,{name:"0",label:b.value,style:{height:"100%"}},{default:u(()=>[t("table",K,[t("tr",null,[L,t("td",null,[o(S,{placeholder:"选择默认值",options:h(R),props:{expandTrigger:"hover",checkStrictly:!1},clearable:"",onChange:E,style:{width:"260px","margin-right":"18px"}},null,8,["options"]),o(V,{modelValue:l.value.defaultValue,"onUpdate:modelValue":a[0]||(a[0]=e=>l.value.defaultValue=e),style:{width:"730px"},clearable:""},null,8,["modelValue"])])]),t("tr",null,[M,t("td",null,[o(V,{modelValue:l.value.width,"onUpdate:modelValue":a[1]||(a[1]=e=>l.value.width=e),placeholder:"%或px",style:{width:"260px","margin-right":"12px"}},null,8,["modelValue"]),f(" 背景文字"),o(V,{modelValue:l.value.placeholder,"onUpdate:modelValue":a[2]||(a[2]=e=>l.value.placeholder=e),placeholder:"placeholder",style:{width:"260px","margin-left":"12px"}},null,8,["modelValue"])])]),t("tr",null,[W,t("td",null,[o(m,{modelValue:l.value.showRoot,"onUpdate:modelValue":a[3]||(a[3]=e=>l.value.showRoot=e),label:"显示根",style:{"vertical-align":"middle"}},null,8,["modelValue"]),o(m,{modelValue:l.value.selectRoot,"onUpdate:modelValue":a[4]||(a[4]=e=>l.value.selectRoot=e),label:"选择根",style:{"vertical-align":"middle"}},null,8,["modelValue"]),o(m,{modelValue:l.value.selectParent,"onUpdate:modelValue":a[5]||(a[5]=e=>l.value.selectParent=e),label:"选择父节点",style:{"vertical-align":"middle"}},null,8,["modelValue"]),o(m,{modelValue:l.value.multiple,"onUpdate:modelValue":a[6]||(a[6]=e=>l.value.multiple=e),label:"多选",style:{"vertical-align":"middle"}},null,8,["modelValue"])])]),t("tr",null,[X,t("td",null,[o(h(U),{ref_key:"selectDictRef",ref:g,modelValue:l.value.range,"onUpdate:modelValue":a[7]||(a[7]=e=>l.value.range=e),multiple:"",style:{width:"601px","margin-right":"12px"}},null,8,["modelValue"]),f(" 选择个数 "),o(D,{modelValue:l.value.selectSize,"onUpdate:modelValue":a[8]||(a[8]=e=>l.value.selectSize=e),style:{width:"90px","margin-left":"12px","vertical-align":"middle"},clearable:"","controls-position":"right"},null,8,["modelValue"]),q])])])]),_:1},8,["label"]),o(y,{name:"1",label:"事件",style:{height:"100%"}},{default:u(()=>[t("table",A,[t("tr",null,[G,t("td",null,[o(T,{modelValue:i.value,"onUpdate:modelValue":a[9]||(a[9]=e=>i.value=e)},{default:u(()=>[(s(!0),v(x,null,w(l.value.events,e=>(s(),j(C,{key:e.name,value:e.name},{default:u(()=>[f(z(e.name),1)]),_:2},1032,["value"]))),128))]),_:1},8,["modelValue"])])]),t("tr",null,[I,t("td",null,[(s(!0),v(x,null,w(l.value.events,e=>O((s(),v("div",{style:{width:"1040px"},key:"script_"+e.name},[o(h(k),{modelValue:e.script,"onUpdate:modelValue":F=>e.script=F,height:"250px"},null,8,["modelValue","onUpdate:modelValue"])])),[[P,i.value==e.name]])),128))])])])]),_:1})]),_:1})])}}};export{ie as default};