import{ai as w,aT as g,aF as M,H as U,bD as u,aX as r,o as i,W as n,a as t,b9 as A,c as h,aV as O,bi as v,F as C,U as m,bF as W,bv as X}from"./_@vue-5ba92de9.js";import{d as E}from"./form-design-8c117009.js";import"./index-823f4b27.js";import"./__vendor-5e6ac033.js";import"./_@element-plus-ad4c9002.js";import"./_crypto-js-0812dcff.js";import"./_element-plus-8c7ce171.js";import"./_@popperjs-c75af06c.js";import"./_pdfjs-dist-c04561eb.js";import"./_@microsoft-43c4e133.js";import"./_vue-codemirror-50da885a.js";import"./_jquery-3a83ed9f.js";const z={class:"roadui_formtable",style:{width:"98%",margin:"0 auto"}},G=t("th",{style:{width:"60px"}},"控件id",-1),P={class:"roadui_formfont"},Q=t("th",null,"绑定字段",-1),Y={class:"roadui_note1"},Z={style:{"margin-left":"12px"}},$=t("th",null,"默认值",-1),ee=t("th",null,"宽度",-1),le={style:{"margin-left":"12px"}},te={style:{"margin-left":"12px"}},ae={style:{"margin-left":"12px"}},oe=t("th",null,"最大字符",-1),ne=t("th",null,"前缀图标",-1),ue=t("th",null,"输入类型",-1),de={class:"roadui_formtable",style:{width:"98%",margin:"0 auto"}},re=t("th",{style:{width:"50px"}},"事件",-1),se=t("th",null,"脚本",-1),ye={__name:"texts",props:{query:{type:String,default:()=>""}},setup(J){const s=w("utils"),S=w("ElSelectico"),F=w("ElCodemirror"),D=J,B=s.query("editorname",D.query),p=window.parent.CKEDITOR.instances[B],_=p.formAttributeJSON,e=g({}),d=g({}),b=g(""),T=g([]),I=E.defaultValueOptions();E.valueTypeOptions(),E.formatOptions(),M(()=>{_&&s.getConnTableFields(_.dbConn,_.dbTable).then(o=>{T.value=o}),k()});const L=o=>{s.length(o)!==0&&(e.value.defaultValue+=o[o.length-1])},k=o=>{e.value={field:"",width:"",defaultValue:"",align:"left",prefix:"",suffix:"",placeholder:"",disabled:!1,allowClear:!1,inputType:"text"},d.value={},o||(o=p.currentSelectEditorElement),o&&(e.value.id=o.getAttribute("data-id"),e.value.label=o.getAttribute("data-label"),e.value.field=o.getAttribute("data-bindfiled"),e.value.defaultValue=s.decodeURI(o.getAttribute("data-defaultvalue")),e.value.width=o.getAttribute("data-width"),e.value.align=o.getAttribute("data-align"),e.value.prefix=o.getAttribute("data-prefix"),e.value.suffix=o.getAttribute("data-suffix"),e.value.disabled=o.getAttribute("data-disabled")=="true",e.value.allowClear=o.getAttribute("data-allowclear")=="true",e.value.readOnly=o.getAttribute("data-readonly")=="true",parseInt(o.getAttribute("data-maxlength"))&&(e.value.maxLength=parseInt(o.getAttribute("data-maxlength"))),e.value.placeholder=o.getAttribute("data-placeholder"),e.value.inputType=o.getAttribute("data-inputtype"),d.value=s.getArrayObj(p.formEventsJSON,e.value.id,"id"),s.isUndef(d.value)?(d.value={id:e.value.id,events:[{name:"change",script:""}]},p.formEventsJSON.push(d.value)):s.length(d.value.events)===0&&(d.value={id:e.value.id,events:[{name:"change",script:""}]}),b.value=d.value.events[0].name),p.currentSelectEditorElementJson=e.value,p.initFunction_text=k};return(o,a)=>{const c=r("el-option"),V=r("el-select"),f=r("el-input"),j=r("el-cascader"),x=r("el-checkbox"),q=r("el-input-number"),y=r("el-radio"),R=r("el-radio-group"),N=r("el-tab-pane"),H=r("el-tabs");return i(),U(H,null,{default:u(()=>[n(N,{name:"0",label:"属性",style:{height:"100%"}},{default:u(()=>[t("table",z,[t("tr",null,[G,t("td",P,A(e.value.id),1)]),t("tr",null,[Q,t("td",null,[n(V,{modelValue:e.value.field,"onUpdate:modelValue":a[0]||(a[0]=l=>e.value.field=l),filterable:"",style:{width:"260px"},clearable:""},{default:u(()=>[(i(!0),h(C,null,O(T.value,l=>(i(),U(c,{key:l.name,value:l.name,label:l.name+(v(s).length(l.comment)>0?" - "+l.comment:"")},{default:u(()=>[t("span",null,A(l.name),1),t("span",Y,A(v(s).length(l.comment)>0?" - "+l.comment:""),1)]),_:2},1032,["value","label"]))),128))]),_:1},8,["modelValue"]),t("span",Z,[m(" 标签"),n(f,{modelValue:e.value.label,"onUpdate:modelValue":a[1]||(a[1]=l=>e.value.label=l),placeholder:"控件label",style:{width:"285px","margin-left":"12px"},clearable:""},null,8,["modelValue"])])])]),t("tr",null,[$,t("td",null,[n(j,{placeholder:"选择默认值",options:v(I),props:{expandTrigger:"hover",checkStrictly:!1},clearable:"",onChange:L,style:{width:"260px","margin-right":"18px"}},null,8,["options"]),n(f,{modelValue:e.value.defaultValue,"onUpdate:modelValue":a[2]||(a[2]=l=>e.value.defaultValue=l),style:{width:"323px"},clearable:""},null,8,["modelValue"])])]),t("tr",null,[ee,t("td",null,[n(f,{modelValue:e.value.width,"onUpdate:modelValue":a[3]||(a[3]=l=>e.value.width=l),placeholder:"%或px",style:{width:"140px","margin-right":"12px"},clearable:""},null,8,["modelValue"]),m(" 对齐方式 "),n(V,{modelValue:e.value.align,"onUpdate:modelValue":a[4]||(a[4]=l=>e.value.align=l),style:{width:"100px","margin-left":"12px"},clearable:""},{default:u(()=>[n(c,{value:"left",label:"左对齐"}),n(c,{value:"center",label:"居中"}),n(c,{value:"right",label:"右对齐"})]),_:1},8,["modelValue"]),t("span",le,[n(x,{modelValue:e.value.disabled,"onUpdate:modelValue":a[5]||(a[5]=l=>e.value.disabled=l),label:"禁用",style:{"vertical-align":"middle"}},null,8,["modelValue"])]),t("span",te,[n(x,{modelValue:e.value.readOnly,"onUpdate:modelValue":a[6]||(a[6]=l=>e.value.readOnly=l),label:"只读",style:{"vertical-align":"middle"}},null,8,["modelValue"])]),t("span",ae,[n(x,{modelValue:e.value.allowClear,"onUpdate:modelValue":a[7]||(a[7]=l=>e.value.allowClear=l),label:"可清除",style:{"vertical-align":"middle"}},null,8,["modelValue"])])])]),t("tr",null,[oe,t("td",null,[n(q,{min:0,modelValue:e.value.maxLength,"onUpdate:modelValue":a[8]||(a[8]=l=>e.value.maxLength=l),style:{width:"120px","margin-right":"12px"},clearable:"","controls-position":"right"},null,8,["modelValue"]),m(" 背景文字"),n(f,{modelValue:e.value.placeholder,"onUpdate:modelValue":a[9]||(a[9]=l=>e.value.placeholder=l),placeholder:"placeholder",style:{width:"313px","margin-left":"12px"},clearable:""},null,8,["modelValue"])])]),t("tr",null,[ne,t("td",null,[n(v(S),{modelValue:e.value.prefix,"onUpdate:modelValue":a[10]||(a[10]=l=>e.value.prefix=l),style:{width:"200px","margin-right":"12px"},clearable:""},null,8,["modelValue"]),m(" 后缀图标 "),n(v(S),{modelValue:e.value.suffix,"onUpdate:modelValue":a[11]||(a[11]=l=>e.value.suffix=l),style:{width:"200px",margin:"0 12px"},clearable:""},null,8,["modelValue"])])]),t("tr",null,[ue,t("td",null,[n(R,{modelValue:e.value.inputType,"onUpdate:modelValue":a[12]||(a[12]=l=>e.value.inputType=l)},{default:u(()=>[n(y,{label:"text"},{default:u(()=>[m("明文")]),_:1}),n(y,{label:"password"},{default:u(()=>[m("密码")]),_:1}),n(y,{label:"url"},{default:u(()=>[m("Url")]),_:1})]),_:1},8,["modelValue"])])])])]),_:1}),n(N,{name:"1",label:"事件",style:{height:"100%"}},{default:u(()=>[t("table",de,[t("tr",null,[re,t("td",null,[n(V,{modelValue:b.value,"onUpdate:modelValue":a[13]||(a[13]=l=>b.value=l)},{default:u(()=>[(i(!0),h(C,null,O(d.value.events,l=>(i(),U(c,{key:l.name,value:l.name,label:l.name},null,8,["value","label"]))),128))]),_:1},8,["modelValue"])])]),t("tr",null,[se,t("td",null,[(i(!0),h(C,null,O(d.value.events,l=>W((i(),h("div",{style:{width:"620px"},key:"script_"+l.name},[n(v(F),{modelValue:l.script,"onUpdate:modelValue":K=>l.script=K,height:"330px"},null,8,["modelValue","onUpdate:modelValue"])])),[[X,b.value==l.name]])),128))])])])]),_:1})]),_:1})}}};export{ye as default};
