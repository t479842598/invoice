import{ai as V,aT as c,aF as K,H as y,bD as d,aX as r,o as i,W as n,a as t,b9 as w,c as _,aV as x,bi as v,F as U,U as m,bF as N,bv as O}from"./_@vue-5ba92de9.js";import{d as L}from"./form-design-8c117009.js";import"./index-823f4b27.js";import"./__vendor-5e6ac033.js";import"./_@element-plus-ad4c9002.js";import"./_crypto-js-0812dcff.js";import"./_element-plus-8c7ce171.js";import"./_@popperjs-c75af06c.js";import"./_pdfjs-dist-c04561eb.js";import"./_@microsoft-43c4e133.js";import"./_vue-codemirror-50da885a.js";import"./_jquery-3a83ed9f.js";const M={class:"roadui_formtable",style:{width:"98%",margin:"0 auto"}},W=t("th",{style:{width:"60px"}},"控件id",-1),X={class:"roadui_formfont"},G=t("th",null,"绑定字段",-1),Q={class:"roadui_note1"},Y={style:{"margin-left":"12px"}},Z=t("th",null,"默认值",-1),$=t("th",null,"宽度",-1),ee=t("th",null,"选择设置",-1),le=t("span",{class:"roadui_note",style:{"margin-left":"12px"}},"0或空不限制",-1),te=t("th",null,"选择范围",-1),ae={class:"roadui_formtable",style:{width:"98%",margin:"0 auto"}},oe=t("th",{style:{width:"50px"}},"事件",-1),ne=t("th",null,"脚本",-1),_e={__name:"dictionary",props:{query:{type:String,default:()=>""}},setup(D){const s=V("utils"),J=V("ElSelectdict"),T=V("ElCodemirror"),F=D,z=s.query("editorname",F.query),p=window.parent.CKEDITOR.instances[z],f=p.formAttributeJSON,e=c({}),u=c({}),h=c(""),A=c([]),B=L.defaultValueOptions(),S=c(null);K(()=>{f&&s.getConnTableFields(f.dbConn,f.dbTable).then(o=>{A.value=o}),E()});const I=o=>{s.length(o)!==0&&(e.value.defaultValue+=o[o.length-1])},E=o=>{e.value={id:"",label:"",field:"",defaultValue:"",width:"",placeholder:"",range:"",multiple:!1,showRoot:!0,selectRoot:!0,selectParent:!0},u.value={},o||(o=p.currentSelectEditorElement),o&&(e.value.id=o.getAttribute("data-id"),e.value.label=o.getAttribute("data-label"),e.value.field=o.getAttribute("data-bindfiled"),e.value.defaultValue=s.decodeURI(o.getAttribute("data-defaultvalue")),e.value.width=o.getAttribute("data-width"),e.value.placeholder=o.getAttribute("data-placeholder"),e.value.range=o.getAttribute("data-range"),e.value.multiple=o.getAttribute("data-multiple")=="true",e.value.showRoot=o.getAttribute("data-showroot")=="true",e.value.selectRoot=o.getAttribute("data-selectroot")=="true",e.value.selectParent=o.getAttribute("data-selectparent")=="true",parseInt(o.getAttribute("data-selectsize"))&&(e.value.selectSize=parseInt(o.getAttribute("data-selectsize"))),S.value.initTitle(e.value.range),u.value=s.getArrayObj(p.formEventsJSON,e.value.id,"id"),s.isUndef(u.value)?(u.value={id:e.value.id,events:[{name:"change",script:""}]},p.formEventsJSON.push(u.value)):s.length(u.value.events)===0&&(u.value={id:e.value.id,events:[{name:"change",script:""}]}),h.value=u.value.events[0].name),p.currentSelectEditorElementJson=e.value,p.initFunction_dictionary=E};return(o,a)=>{const R=r("el-option"),k=r("el-select"),g=r("el-input"),P=r("el-cascader"),b=r("el-checkbox"),j=r("el-input-number"),C=r("el-tab-pane"),q=r("el-tabs");return i(),y(q,null,{default:d(()=>[n(C,{name:"0",label:"属性",style:{height:"100%"}},{default:d(()=>[t("table",M,[t("tr",null,[W,t("td",X,w(e.value.id),1)]),t("tr",null,[G,t("td",null,[n(k,{modelValue:e.value.field,"onUpdate:modelValue":a[0]||(a[0]=l=>e.value.field=l),filterable:"",style:{width:"260px"},clearable:""},{default:d(()=>[(i(!0),_(U,null,x(A.value,l=>(i(),y(R,{key:l.name,value:l.name,label:l.name+(v(s).length(l.comment)>0?" - "+l.comment:"")},{default:d(()=>[t("span",null,w(l.name),1),t("span",Q,w(v(s).length(l.comment)>0?" - "+l.comment:""),1)]),_:2},1032,["value","label"]))),128))]),_:1},8,["modelValue"]),t("span",Y,[m(" 标签"),n(g,{modelValue:e.value.label,"onUpdate:modelValue":a[1]||(a[1]=l=>e.value.label=l),placeholder:"控件label",style:{width:"285px","margin-left":"12px"},clearable:""},null,8,["modelValue"])])])]),t("tr",null,[Z,t("td",null,[n(P,{placeholder:"选择默认值",options:v(B),props:{expandTrigger:"hover",checkStrictly:!1},clearable:"",onChange:I,style:{width:"260px","margin-right":"18px"}},null,8,["options"]),n(g,{modelValue:e.value.defaultValue,"onUpdate:modelValue":a[2]||(a[2]=l=>e.value.defaultValue=l),style:{width:"323px"},clearable:""},null,8,["modelValue"])])]),t("tr",null,[$,t("td",null,[n(g,{modelValue:e.value.width,"onUpdate:modelValue":a[3]||(a[3]=l=>e.value.width=l),placeholder:"%或px",style:{width:"140px","margin-right":"12px"}},null,8,["modelValue"]),m(" 背景文字"),n(g,{modelValue:e.value.placeholder,"onUpdate:modelValue":a[4]||(a[4]=l=>e.value.placeholder=l),placeholder:"placeholder",style:{width:"203px","margin-left":"12px"}},null,8,["modelValue"])])]),t("tr",null,[ee,t("td",null,[n(b,{modelValue:e.value.showRoot,"onUpdate:modelValue":a[5]||(a[5]=l=>e.value.showRoot=l),style:{"vertical-align":"middle"}},{default:d(()=>[m("显示根")]),_:1},8,["modelValue"]),n(b,{modelValue:e.value.selectRoot,"onUpdate:modelValue":a[6]||(a[6]=l=>e.value.selectRoot=l),style:{"vertical-align":"middle"}},{default:d(()=>[m("选择根")]),_:1},8,["modelValue"]),n(b,{modelValue:e.value.selectParent,"onUpdate:modelValue":a[7]||(a[7]=l=>e.value.selectParent=l),style:{"vertical-align":"middle"}},{default:d(()=>[m("选择父节点")]),_:1},8,["modelValue"]),n(b,{modelValue:e.value.multiple,"onUpdate:modelValue":a[8]||(a[8]=l=>e.value.multiple=l),style:{"vertical-align":"middle","margin-right":"12px"}},{default:d(()=>[m("多选")]),_:1},8,["modelValue"]),N(t("span",null,[m(" 选择个数 "),n(j,{modelValue:e.value.selectSize,"onUpdate:modelValue":a[9]||(a[9]=l=>e.value.selectSize=l),style:{width:"90px","margin-left":"12px"},clearable:"","controls-position":"right"},null,8,["modelValue"]),le],512),[[O,e.value.multiple]])])]),t("tr",null,[te,t("td",null,[n(v(J),{modelValue:e.value.range,"onUpdate:modelValue":a[10]||(a[10]=l=>e.value.range=l),ref_key:"selectDictRef",ref:S,multiple:"",style:{width:"601px"}},null,8,["modelValue"])])])])]),_:1}),n(C,{name:"1",label:"事件",style:{height:"100%"}},{default:d(()=>[t("table",ae,[t("tr",null,[oe,t("td",null,[n(k,{modelValue:h.value,"onUpdate:modelValue":a[11]||(a[11]=l=>h.value=l)},{default:d(()=>[(i(!0),_(U,null,x(u.value.events,l=>(i(),y(R,{key:l.name,value:l.name,label:l.name},null,8,["value","label"]))),128))]),_:1},8,["modelValue"])])]),t("tr",null,[ne,t("td",null,[(i(!0),_(U,null,x(u.value.events,l=>N((i(),_("div",{style:{width:"620px"},key:"script_"+l.name},[n(v(T),{modelValue:l.script,"onUpdate:modelValue":H=>l.script=H,height:"300px"},null,8,["modelValue","onUpdate:modelValue"])])),[[O,h.value==l.name]])),128))])])])]),_:1})]),_:1})}}};export{_e as default};
