import{ai as y,aT as v,aF as q,H as _,bD as d,aX as r,o as u,W as s,a as t,b9 as h,c as p,aV as f,bi as c,F as V,U as w,bF as H,bv as I}from"./_@vue-5ba92de9.js";import{d as K}from"./form-design-8c117009.js";import"./index-823f4b27.js";import"./__vendor-5e6ac033.js";import"./_@element-plus-ad4c9002.js";import"./_crypto-js-0812dcff.js";import"./_element-plus-8c7ce171.js";import"./_@popperjs-c75af06c.js";import"./_pdfjs-dist-c04561eb.js";import"./_@microsoft-43c4e133.js";import"./_vue-codemirror-50da885a.js";import"./_jquery-3a83ed9f.js";const L={class:"roadui_formtable",style:{width:"98%",margin:"0 auto"}},M=t("th",{style:{width:"60px"}},"控件id",-1),R={class:"roadui_formfont"},W=t("th",null,"绑定字段",-1),X={class:"roadui_note1"},z={style:{"margin-left":"12px"}},G=t("th",null,"图标",-1),P=t("th",null,"类型",-1),Q={class:"roadui_formtable",style:{width:"98%",margin:"0 auto"}},Y=t("th",{style:{width:"50px"}},"事件",-1),Z=t("th",null,"脚本",-1),me={__name:"buttons",props:{query:{type:String,default:()=>""}},setup(A){const i=y("utils"),N=y("ElSelectico"),C=y("ElCodemirror"),J=A,O=i.query("editorname",J.query),m=window.parent.CKEDITOR.instances[O],g=m.formAttributeJSON,l=v({}),n=v({}),b=v(""),x=v([]);K.defaultValueOptions(),q(()=>{g&&i.getConnTableFields(g.dbConn,g.dbTable).then(a=>{x.value=a}),E()});const E=a=>{l.value={id:"",field:"",defaultValue:"",label:"",width:"",buttonType:"",icon:""},n.value={},a||(a=m.currentSelectEditorElement),a&&(l.value.id=a.getAttribute("data-id"),l.value.label=a.getAttribute("data-label"),l.value.field=a.getAttribute("data-bindfiled"),l.value.width=a.getAttribute("data-width"),l.value.buttonType=a.getAttribute("data-buttontype")||"",l.value.icon=a.getAttribute("data-icon"),n.value=i.getArrayObj(m.formEventsJSON,l.value.id,"id"),i.isUndef(n.value)?(n.value={id:l.value.id,events:[{name:"click",script:""}]},m.formEventsJSON.push(n.value)):i.length(n.value.events)===0&&(n.value={id:l.value.id,events:[{name:"click",script:""}]}),b.value=n.value.events[0].name),m.currentSelectEditorElementJson=l.value,m.initFunction_button=E};return(a,o)=>{const S=r("el-option"),T=r("el-select"),U=r("el-input"),F=r("el-radio"),B=r("el-radio-group"),k=r("el-tab-pane"),D=r("el-tabs");return u(),_(D,null,{default:d(()=>[s(k,{name:"0",label:"属性",style:{height:"100%"}},{default:d(()=>[t("table",L,[t("tr",null,[M,t("td",R,h(l.value.id),1)]),t("tr",null,[W,t("td",null,[s(T,{modelValue:l.value.field,"onUpdate:modelValue":o[0]||(o[0]=e=>l.value.field=e),filterable:"",style:{width:"260px"},clearable:""},{default:d(()=>[(u(!0),p(V,null,f(x.value,e=>(u(),_(S,{key:e.name,value:e.name,label:e.name+(c(i).length(e.comment)>0?" - "+e.comment:"")},{default:d(()=>[t("span",null,h(e.name),1),t("span",X,h(c(i).length(e.comment)>0?" - "+e.comment:""),1)]),_:2},1032,["value","label"]))),128))]),_:1},8,["modelValue"]),t("span",z,[w(" 标签"),s(U,{modelValue:l.value.label,"onUpdate:modelValue":o[1]||(o[1]=e=>l.value.label=e),placeholder:"控件label",style:{width:"285px","margin-left":"12px"},clearable:""},null,8,["modelValue"])])])]),t("tr",null,[G,t("td",null,[s(c(N),{modelValue:l.value.icon,"onUpdate:modelValue":o[2]||(o[2]=e=>l.value.icon=e),clearable:"",style:{width:"260px","margin-right":"12px"}},null,8,["modelValue"]),w(" 宽度"),s(U,{modelValue:l.value.width,"onUpdate:modelValue":o[3]||(o[3]=e=>l.value.width=e),clearable:"",placeholder:"px或%",style:{width:"285px","margin-left":"12px"}},null,8,["modelValue"])])]),t("tr",null,[P,t("td",null,[s(B,{modelValue:l.value.buttonType,"onUpdate:modelValue":o[4]||(o[4]=e=>l.value.buttonType=e)},{default:d(()=>[(u(!0),p(V,null,f(c(i).buttonTypes,e=>(u(),_(F,{label:e.value},{default:d(()=>[w(h(e.label),1)]),_:2},1032,["label"]))),256))]),_:1},8,["modelValue"])])])])]),_:1}),s(k,{name:"1",label:"事件",style:{height:"100%"}},{default:d(()=>[t("table",Q,[t("tr",null,[Y,t("td",null,[s(T,{modelValue:b.value,"onUpdate:modelValue":o[5]||(o[5]=e=>b.value=e)},{default:d(()=>[(u(!0),p(V,null,f(n.value.events,e=>(u(),_(S,{key:e.name,value:e.name,label:e.name},null,8,["value","label"]))),128))]),_:1},8,["modelValue"])])]),t("tr",null,[Z,t("td",null,[(u(!0),p(V,null,f(n.value.events,e=>H((u(),p("div",{style:{width:"620px"},key:"script_"+e.name},[s(c(C),{modelValue:e.script,"onUpdate:modelValue":j=>e.script=j,height:"260px"},null,8,["modelValue","onUpdate:modelValue"])])),[[I,b.value==e.name]])),128))])])])]),_:1})]),_:1})}}};export{me as default};
