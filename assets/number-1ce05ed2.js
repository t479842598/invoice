import{ai as S,aT as f,aF as K,H as y,bD as d,aX as r,o as i,W as n,a as t,b9 as x,c as V,aV as w,bi as h,F as A,U as m,bF as C,bv as O}from"./_@vue-5ba92de9.js";import{d as L}from"./form-design-8c117009.js";import"./index-823f4b27.js";import"./__vendor-5e6ac033.js";import"./_@element-plus-ad4c9002.js";import"./_crypto-js-0812dcff.js";import"./_element-plus-8c7ce171.js";import"./_@popperjs-c75af06c.js";import"./_pdfjs-dist-c04561eb.js";import"./_@microsoft-43c4e133.js";import"./_vue-codemirror-50da885a.js";import"./_jquery-3a83ed9f.js";const M={class:"roadui_formtable",style:{width:"98%",margin:"0 auto"}},W=t("th",{style:{width:"60px"}},"控件id",-1),X={class:"roadui_formfont"},z=t("th",null,"绑定字段",-1),G={class:"roadui_note1"},P={style:{"margin-left":"12px"}},Q=t("th",null,"默认值",-1),Y=t("th",null,"宽度",-1),Z={style:{"margin-left":"12px"}},$={style:{"margin-left":"12px"}},ee=t("th",null,"步长",-1),le=t("th",null,"最小值",-1),te={style:{"margin-left":"12px"}},ae={style:{"margin-left":"12px"}},oe={class:"roadui_formtable",style:{width:"98%",margin:"0 auto"}},ne=t("th",{style:{width:"50px"}},"事件",-1),ue=t("th",null,"脚本",-1),he={__name:"number",props:{query:{type:String,default:()=>""}},setup(J){const u=S("utils"),F=J,T=S("ElCodemirror"),D=u.query("editorname",F.query),p=window.parent.CKEDITOR.instances[D],_=p.formAttributeJSON,e=f({}),s=f({}),c=f(""),U=f([]),B=L.defaultValueOptions();K(()=>{_&&u.getConnTableFields(_.dbConn,_.dbTable).then(a=>{U.value=a}),N()});const j=a=>{u.length(a)!==0&&(e.value.defaultValue+=a[a.length-1])},N=a=>{e.value={field:"",width:"",defaultValue:"",placeholder:"",disabled:!1,stepstrictly:!1,controls:!0,controlsposition:!1},s.value={},a||(a=p.currentSelectEditorElement),a&&(e.value.id=a.getAttribute("data-id"),e.value.label=a.getAttribute("data-label"),e.value.field=a.getAttribute("data-bindfiled"),e.value.defaultValue=u.decodeURI(a.getAttribute("data-defaultvalue")),e.value.width=a.getAttribute("data-width"),e.value.align=a.getAttribute("data-align"),e.value.prefix=a.getAttribute("data-prefix"),e.value.suffix=a.getAttribute("data-suffix"),e.value.disabled=a.getAttribute("data-disabled")=="true",e.value.readonly=a.getAttribute("data-readonly")=="true",e.value.placeholder=a.getAttribute("data-placeholder"),u.isNumber(parseInt(a.getAttribute("data-step")))&&(e.value.step=parseInt(a.getAttribute("data-step"))),u.isNumber(parseInt(a.getAttribute("data-precision")))&&(e.value.precision=parseInt(a.getAttribute("data-precision"))),u.isNumber(parseInt(a.getAttribute("data-min")))&&(e.value.min=parseInt(a.getAttribute("data-min"))),u.isNumber(parseInt(a.getAttribute("data-max")))&&(e.value.max=parseInt(a.getAttribute("data-max"))),e.value.stepstrictly=a.getAttribute("data-stepstrictly")=="true",e.value.controls=a.getAttribute("data-controls")=="true",e.value.controlsposition=a.getAttribute("data-controlsposition")=="true",s.value=u.getArrayObj(p.formEventsJSON,e.value.id,"id"),u.isUndef(s.value)?(s.value={id:e.value.id,events:[{name:"change",script:""}]},p.formEventsJSON.push(s.value)):u.length(s.value.events)===0&&(s.value={id:e.value.id,events:[{name:"change",script:""}]}),c.value=s.value.events[0].name),p.currentSelectEditorElementJson=e.value,p.initFunction_number=N};return(a,o)=>{const E=r("el-option"),I=r("el-select"),b=r("el-input"),q=r("el-cascader"),v=r("el-checkbox"),g=r("el-input-number"),k=r("el-tab-pane"),R=r("el-tabs");return i(),y(R,null,{default:d(()=>[n(k,{name:"0",label:"属性",style:{height:"100%"}},{default:d(()=>[t("table",M,[t("tr",null,[W,t("td",X,x(e.value.id),1)]),t("tr",null,[z,t("td",null,[n(I,{modelValue:e.value.field,"onUpdate:modelValue":o[0]||(o[0]=l=>e.value.field=l),filterable:"",style:{width:"260px"},clearable:""},{default:d(()=>[(i(!0),V(A,null,w(U.value,l=>(i(),y(E,{key:l.name,value:l.name,label:l.name+(h(u).length(l.comment)>0?" - "+l.comment:"")},{default:d(()=>[t("span",null,x(l.name),1),t("span",G,x(h(u).length(l.comment)>0?" - "+l.comment:""),1)]),_:2},1032,["value","label"]))),128))]),_:1},8,["modelValue"]),t("span",P,[m(" 标签"),n(b,{modelValue:e.value.label,"onUpdate:modelValue":o[1]||(o[1]=l=>e.value.label=l),placeholder:"控件label",style:{width:"285px","margin-left":"12px"},clearable:""},null,8,["modelValue"])])])]),t("tr",null,[Q,t("td",null,[n(q,{placeholder:"选择默认值",options:h(B),props:{expandTrigger:"hover",checkStrictly:!1},clearable:"",onChange:j,style:{width:"260px","margin-right":"18px"}},null,8,["options"]),n(b,{modelValue:e.value.defaultValue,"onUpdate:modelValue":o[2]||(o[2]=l=>e.value.defaultValue=l),style:{width:"323px"},clearable:""},null,8,["modelValue"])])]),t("tr",null,[Y,t("td",null,[n(b,{modelValue:e.value.width,"onUpdate:modelValue":o[3]||(o[3]=l=>e.value.width=l),placeholder:"%或px",style:{width:"140px","margin-right":"12px"},clearable:""},null,8,["modelValue"]),m(" 背景文字 "),n(b,{modelValue:e.value.placeholder,"onUpdate:modelValue":o[4]||(o[4]=l=>e.value.placeholder=l),placeholder:"placeholder",style:{width:"203px","margin-left":"12px"},clearable:""},null,8,["modelValue"]),t("span",Z,[n(v,{modelValue:e.value.disabled,"onUpdate:modelValue":o[5]||(o[5]=l=>e.value.disabled=l),label:"禁用",style:{"vertical-align":"middle"}},null,8,["modelValue"])]),t("span",$,[n(v,{modelValue:e.value.readonly,"onUpdate:modelValue":o[6]||(o[6]=l=>e.value.readonly=l),label:"只读",style:{"vertical-align":"middle"}},null,8,["modelValue"])])])]),t("tr",null,[ee,t("td",null,[n(g,{modelValue:e.value.step,"onUpdate:modelValue":o[7]||(o[7]=l=>e.value.step=l),style:{width:"120px","margin-right":"12px"},clearable:"","controls-position":"right"},null,8,["modelValue"]),m(" 小数位 "),n(g,{modelValue:e.value.precision,"onUpdate:modelValue":o[8]||(o[8]=l=>e.value.precision=l),style:{width:"120px",margin:"0 12px"},clearable:"","controls-position":"right"},null,8,["modelValue"]),t("span",null,[n(v,{modelValue:e.value.stepstrictly,"onUpdate:modelValue":o[9]||(o[9]=l=>e.value.stepstrictly=l),style:{"vertical-align":"middle"}},{default:d(()=>[m("只能输入步长的倍数")]),_:1},8,["modelValue"])])])]),t("tr",null,[le,t("td",null,[n(g,{modelValue:e.value.min,"onUpdate:modelValue":o[10]||(o[10]=l=>e.value.min=l),style:{width:"120px","margin-right":"12px"},clearable:"","controls-position":"right"},null,8,["modelValue"]),m(" 最大值 "),n(g,{modelValue:e.value.max,"onUpdate:modelValue":o[11]||(o[11]=l=>e.value.max=l),style:{width:"120px","margin-left":"12px"},clearable:"","controls-position":"right"},null,8,["modelValue"]),t("span",te,[n(v,{modelValue:e.value.controls,"onUpdate:modelValue":o[12]||(o[12]=l=>e.value.controls=l),style:{"vertical-align":"middle"}},{default:d(()=>[m("显示控制按钮")]),_:1},8,["modelValue"])]),C(t("span",ae,[n(v,{modelValue:e.value.controlsposition,"onUpdate:modelValue":o[13]||(o[13]=l=>e.value.controlsposition=l),style:{"vertical-align":"middle"}},{default:d(()=>[m("按钮在右边")]),_:1},8,["modelValue"])],512),[[O,e.value.controls]])])])])]),_:1}),n(k,{name:"1",label:"事件",style:{height:"100%"}},{default:d(()=>[t("table",oe,[t("tr",null,[ne,t("td",null,[n(I,{modelValue:c.value,"onUpdate:modelValue":o[14]||(o[14]=l=>c.value=l)},{default:d(()=>[(i(!0),V(A,null,w(s.value.events,l=>(i(),y(E,{key:l.name,value:l.name,label:l.name},null,8,["value","label"]))),128))]),_:1},8,["modelValue"])])]),t("tr",null,[ue,t("td",null,[(i(!0),V(A,null,w(s.value.events,l=>C((i(),V("div",{style:{width:"620px"},key:"script_"+l.name},[n(h(T),{modelValue:l.script,"onUpdate:modelValue":H=>l.script=H,height:"300px"},null,8,["modelValue","onUpdate:modelValue"])])),[[O,c.value==l.name]])),128))])])])]),_:1})]),_:1})}}};export{he as default};
