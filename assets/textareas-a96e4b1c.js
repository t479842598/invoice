import{ai as S,aT as g,aF as q,H as x,bD as r,aX as s,o as i,W as n,a as t,b9 as y,c as h,aV as w,bi as f,F as A,U as v,bF as R,bv as H}from"./_@vue-5ba92de9.js";import{d as K}from"./form-design-8c117009.js";import"./index-823f4b27.js";import"./__vendor-5e6ac033.js";import"./_@element-plus-ad4c9002.js";import"./_crypto-js-0812dcff.js";import"./_element-plus-8c7ce171.js";import"./_@popperjs-c75af06c.js";import"./_pdfjs-dist-c04561eb.js";import"./_@microsoft-43c4e133.js";import"./_vue-codemirror-50da885a.js";import"./_jquery-3a83ed9f.js";const M={class:"roadui_formtable",style:{width:"98%",margin:"0 auto"}},W=t("th",{style:{width:"60px"}},"控件id",-1),X={class:"roadui_formfont"},z=t("th",null,"绑定字段",-1),G={class:"roadui_note1"},P={style:{"margin-left":"12px"}},Q=t("th",null,"默认值",-1),Y=t("th",null,"宽度",-1),Z={style:{"margin-left":"12px"}},$={style:{"margin-left":"12px"}},ee=t("th",null,"最大字符",-1),le=t("th",null,"背景文字",-1),te={class:"roadui_formtable",style:{width:"98%",margin:"0 auto"}},ae=t("th",{style:{width:"50px"}},"事件",-1),oe=t("th",null,"脚本",-1),he={__name:"textareas",props:{query:{type:String,default:()=>""}},setup(N){const d=S("utils"),J=N,T=S("ElCodemirror"),F=d.query("editorname",J.query),m=window.parent.CKEDITOR.instances[F],_=m.formAttributeJSON,e=g({}),u=g({}),c=g(""),U=g([]),I=K.defaultValueOptions();q(()=>{_&&d.getConnTableFields(_.dbConn,_.dbTable).then(a=>{U.value=a}),O()});const D=a=>{d.length(a)!==0&&(e.value.defaultValue+=a[a.length-1])},O=a=>{e.value={field:"",width:"",defaultValue:"",align:"left",placeholder:"",disabled:!1,allowClear:!1},u.value={},a||(a=m.currentSelectEditorElement),a&&(e.value.id=a.getAttribute("data-id"),e.value.label=a.getAttribute("data-label"),e.value.field=a.getAttribute("data-bindfiled"),e.value.defaultValue=d.decodeURI(a.getAttribute("data-defaultvalue")),e.value.width=a.getAttribute("data-width"),e.value.align=a.getAttribute("data-align"),e.value.prefix=a.getAttribute("data-prefix"),e.value.suffix=a.getAttribute("data-suffix"),e.value.disabled=a.getAttribute("data-disabled")=="true",e.value.allowClear=a.getAttribute("data-allowclear")=="true",e.value.readOnly=a.getAttribute("data-readonly")=="true",parseInt(a.getAttribute("data-maxlength"))&&(e.value.maxLength=parseInt(a.getAttribute("data-maxlength"))),e.value.placeholder=a.getAttribute("data-placeholder"),e.value.inputType=a.getAttribute("data-inputtype"),parseInt(a.getAttribute("data-rows"))&&(e.value.rows=parseInt(a.getAttribute("data-rows"))),u.value=d.getArrayObj(m.formEventsJSON,e.value.id,"id"),d.isUndef(u.value)?(u.value={id:e.value.id,events:[{name:"change",script:""}]},m.formEventsJSON.push(u.value)):d.length(u.value.events)===0&&(u.value={id:e.value.id,events:[{name:"change",script:""}]}),c.value=u.value.events[0].name),m.currentSelectEditorElementJson=e.value,m.initFunction_textarea=O};return(a,o)=>{const p=s("el-option"),V=s("el-select"),b=s("el-input"),B=s("el-cascader"),C=s("el-checkbox"),E=s("el-input-number"),k=s("el-tab-pane"),L=s("el-tabs");return i(),x(L,null,{default:r(()=>[n(k,{name:"0",label:"属性",style:{height:"100%"}},{default:r(()=>[t("table",M,[t("tr",null,[W,t("td",X,y(e.value.id),1)]),t("tr",null,[z,t("td",null,[n(V,{modelValue:e.value.field,"onUpdate:modelValue":o[0]||(o[0]=l=>e.value.field=l),filterable:"",style:{width:"260px"},clearable:""},{default:r(()=>[(i(!0),h(A,null,w(U.value,l=>(i(),x(p,{key:l.name,value:l.name,label:l.name+(f(d).length(l.comment)>0?" - "+l.comment:"")},{default:r(()=>[t("span",null,y(l.name),1),t("span",G,y(f(d).length(l.comment)>0?" - "+l.comment:""),1)]),_:2},1032,["value","label"]))),128))]),_:1},8,["modelValue"]),t("span",P,[v(" 标签"),n(b,{modelValue:e.value.label,"onUpdate:modelValue":o[1]||(o[1]=l=>e.value.label=l),placeholder:"控件label",style:{width:"285px","margin-left":"12px"},clearable:""},null,8,["modelValue"])])])]),t("tr",null,[Q,t("td",null,[n(B,{placeholder:"选择默认值",options:f(I),props:{expandTrigger:"hover",checkStrictly:!1},clearable:"",onChange:D,style:{width:"260px","margin-right":"18px"}},null,8,["options"]),n(b,{modelValue:e.value.defaultValue,"onUpdate:modelValue":o[2]||(o[2]=l=>e.value.defaultValue=l),style:{width:"323px"},clearable:""},null,8,["modelValue"])])]),t("tr",null,[Y,t("td",null,[n(b,{modelValue:e.value.width,"onUpdate:modelValue":o[3]||(o[3]=l=>e.value.width=l),placeholder:"%或px",style:{width:"140px","margin-right":"12px"},clearable:""},null,8,["modelValue"]),v(" 对齐方式 "),n(V,{modelValue:e.value.align,"onUpdate:modelValue":o[4]||(o[4]=l=>e.value.align=l),style:{width:"100px","margin-left":"12px"},clearable:""},{default:r(()=>[n(p,{value:"left",label:"左对齐"}),n(p,{value:"center",label:"居中"}),n(p,{value:"right",label:"右对齐"})]),_:1},8,["modelValue"]),t("span",Z,[n(C,{modelValue:e.value.disabled,"onUpdate:modelValue":o[5]||(o[5]=l=>e.value.disabled=l),style:{"vertical-align":"middle"}},{default:r(()=>[v("禁用")]),_:1},8,["modelValue"])]),t("span",$,[n(C,{modelValue:e.value.readOnly,"onUpdate:modelValue":o[6]||(o[6]=l=>e.value.readOnly=l),style:{"vertical-align":"middle"}},{default:r(()=>[v("只读")]),_:1},8,["modelValue"])])])]),t("tr",null,[ee,t("td",null,[n(E,{min:0,modelValue:e.value.maxLength,"onUpdate:modelValue":o[7]||(o[7]=l=>e.value.maxLength=l),style:{width:"120px","margin-right":"12px"},clearable:"","controls-position":"right"},null,8,["modelValue"]),v(" 行数 "),n(E,{min:0,modelValue:e.value.rows,"onUpdate:modelValue":o[8]||(o[8]=l=>e.value.rows=l),style:{width:"120px","margin-left":"12px"},clearable:"","controls-position":"right"},null,8,["modelValue"])])]),t("tr",null,[le,t("td",null,[n(b,{modelValue:e.value.placeholder,"onUpdate:modelValue":o[9]||(o[9]=l=>e.value.placeholder=l),placeholder:"placeholder",style:{width:"98%"},clearable:""},null,8,["modelValue"])])])])]),_:1}),n(k,{name:"1",label:"事件",style:{height:"100%"}},{default:r(()=>[t("table",te,[t("tr",null,[ae,t("td",null,[n(V,{modelValue:c.value,"onUpdate:modelValue":o[10]||(o[10]=l=>c.value=l)},{default:r(()=>[(i(!0),h(A,null,w(u.value.events,l=>(i(),x(p,{key:l.name,value:l.name,label:l.name},null,8,["value","label"]))),128))]),_:1},8,["modelValue"])])]),t("tr",null,[oe,t("td",null,[(i(!0),h(A,null,w(u.value.events,l=>R((i(),h("div",{style:{width:"620px"},key:"script_"+l.name},[n(f(T),{modelValue:l.script,"onUpdate:modelValue":j=>l.script=j,height:"300px"},null,8,["modelValue","onUpdate:modelValue"])])),[[H,c.value==l.name]])),128))])])])]),_:1})]),_:1})}}};export{he as default};
