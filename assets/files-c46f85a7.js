import{ai as S,aT as g,aF as z,H as k,bD as d,aX as r,o as h,W as o,a as t,b9 as y,c as V,aV as E,bi as w,F as N,U as u,bF as C,bv as J}from"./_@vue-5ba92de9.js";import{d as H}from"./form-design-8c117009.js";import"./index-823f4b27.js";import"./__vendor-5e6ac033.js";import"./_@element-plus-ad4c9002.js";import"./_crypto-js-0812dcff.js";import"./_element-plus-8c7ce171.js";import"./_@popperjs-c75af06c.js";import"./_pdfjs-dist-c04561eb.js";import"./_@microsoft-43c4e133.js";import"./_vue-codemirror-50da885a.js";import"./_jquery-3a83ed9f.js";const K={class:"roadui_formtable",style:{width:"98%",margin:"0 auto"}},L=t("th",{style:{width:"60px"}},"控件id",-1),M={class:"roadui_formfont"},W=t("th",null,"绑定字段",-1),X={class:"roadui_note1"},G={style:{"margin-left":"12px"}},P=t("th",null,"宽度",-1),Q=t("th",null,"文件类型",-1),Y=t("th",null,"显示类型",-1),Z=t("span",{class:"roadui_note",style:{"margin-left":"12px","vertical-align":"middle"}},"只读时的显示方式",-1),$=t("th",null,"控件类型",-1),ee=t("span",{style:{"margin-left":"12px","vertical-align":"middle"}},"显示样式",-1),le=t("th",null,"显示方式",-1),te={style:{"margin-left":"12px"}},ae={style:{"margin-left":"12px"}},oe={class:"roadui_formtable",style:{width:"98%",margin:"0 auto"}},ne=t("th",{style:{width:"50px"}},"事件",-1),de=t("th",null,"脚本",-1),fe={__name:"files",props:{query:{type:String,default:()=>""}},setup(O){const i=S("utils"),F=S("ElCodemirror"),R=O,j=i.query("editorname",R.query),c=window.parent.CKEDITOR.instances[j],_=c.formAttributeJSON,e=g({}),s=g({}),b=g(""),x=g([]);H.defaultValueOptions(),z(()=>{_&&i.getConnTableFields(_.dbConn,_.dbTable).then(n=>{x.value=n}),T()});const T=n=>{if(e.value={id:"",label:"",field:"",width:"",placeholder:"",fileType:"",showType:"",showImg:!1,showIndex:!1},s.value={},n||(n=c.currentSelectEditorElement),n){if(e.value.id=n.getAttribute("data-id"),e.value.label=n.getAttribute("data-label"),e.value.field=n.getAttribute("data-bindfiled"),e.value.width=n.getAttribute("data-width")||"",e.value.placeholder=n.getAttribute("data-placeholder"),e.value.fileType=n.getAttribute("data-filetype"),e.value.showType=n.getAttribute("data-showtype"),e.value.showImg=n.getAttribute("data-showimg")=="true",e.value.showIndex=n.getAttribute("data-showindex")=="true",e.value.showStyle=i.decodeURI(n.getAttribute("data-showstyle")),parseInt(n.getAttribute("data-limit"))&&(e.value.limit=parseInt(n.getAttribute("data-limit"))),e.value.size=n.getAttribute("data-size"),e.value.controlType=i.decodeURI(n.getAttribute("data-controlType")||"0"),e.value.controlShowType=i.decodeURI(n.getAttribute("data-controlShowType")||"0"),e.value.tip=i.decodeURI(n.getAttribute("data-tip")),e.value.buttonText=i.decodeURI(n.getAttribute("data-buttonText")||""),s.value=i.getArrayObj(c.formEventsJSON,e.value.id,"id"),i.isUndef(s.value))s.value={id:e.value.id,events:[{name:"change",script:""},{name:"click",script:""}]},c.formEventsJSON.push(s.value);else if(i.length(s.value.events)===0)s.value={id:e.value.id,events:[{name:"change",script:""},{name:"click",script:""}]};else{let a=["change","click"];for(let m=0;m<a.length;m++)i.inArray(s.value.events,a[m],"name")||s.value.events.push({name:a[m],script:""})}b.value=s.value.events[0].name}c.currentSelectEditorElementJson=e.value,c.initFunction_files=T};return(n,a)=>{const m=r("el-option"),U=r("el-select"),p=r("el-input"),B=r("el-input-number"),v=r("el-radio"),f=r("el-radio-group"),A=r("el-checkbox"),I=r("el-tab-pane"),D=r("el-tabs");return h(),k(D,null,{default:d(()=>[o(I,{name:"0",label:"属性",style:{height:"100%"}},{default:d(()=>[t("table",K,[t("tr",null,[L,t("td",M,y(e.value.id),1)]),t("tr",null,[W,t("td",null,[o(U,{modelValue:e.value.field,"onUpdate:modelValue":a[0]||(a[0]=l=>e.value.field=l),filterable:"",style:{width:"260px"},clearable:""},{default:d(()=>[(h(!0),V(N,null,E(x.value,l=>(h(),k(m,{key:l.name,value:l.name,label:l.name+(w(i).length(l.comment)>0?" - "+l.comment:"")},{default:d(()=>[t("span",null,y(l.name),1),t("span",X,y(w(i).length(l.comment)>0?" - "+l.comment:""),1)]),_:2},1032,["value","label"]))),128))]),_:1},8,["modelValue"]),t("span",G,[u(" 标签"),o(p,{modelValue:e.value.label,"onUpdate:modelValue":a[1]||(a[1]=l=>e.value.label=l),placeholder:"控件label",style:{width:"285px","margin-left":"12px"},clearable:""},null,8,["modelValue"])])])]),t("tr",null,[P,t("td",null,[o(p,{modelValue:e.value.width,"onUpdate:modelValue":a[2]||(a[2]=l=>e.value.width=l),style:{width:"260px","margin-right":"12px"},clearable:"",placeholder:"px或%"},null,8,["modelValue"]),u(" 背景文字"),o(p,{modelValue:e.value.placeholder,"onUpdate:modelValue":a[3]||(a[3]=l=>e.value.placeholder=l),style:{width:"257px","margin-left":"12px"},clearable:"",placeholder:"placeholder"},null,8,["modelValue"])])]),t("tr",null,[Q,t("td",null,[o(p,{modelValue:e.value.fileType,"onUpdate:modelValue":a[4]||(a[4]=l=>e.value.fileType=l),style:{width:"260px","margin-right":"12px"},clearable:"",placeholder:"可上传的文件类型，例：.jpg,.png,.docx等。"},null,8,["modelValue"]),u(" 文件数量"),o(B,{modelValue:e.value.limit,"onUpdate:modelValue":a[5]||(a[5]=l=>e.value.limit=l),style:{width:"100px","margin-left":"12px"},min:1,"controls-position":"right",clearable:""},null,8,["modelValue"])])]),t("tr",null,[Y,t("td",null,[o(f,{modelValue:e.value.showType,"onUpdate:modelValue":a[6]||(a[6]=l=>e.value.showType=l),style:{"vertical-align":"middle"}},{default:d(()=>[o(v,{label:"link"},{default:d(()=>[u("链接")]),_:1}),o(v,{label:"linkbr"},{default:d(()=>[u("链接换行")]),_:1})]),_:1},8,["modelValue"]),o(A,{style:{"margin-left":"22px","vertical-align":"middle"},modelValue:e.value.showImg,"onUpdate:modelValue":a[7]||(a[7]=l=>e.value.showImg=l)},{default:d(()=>[u("显示图片")]),_:1},8,["modelValue"]),o(A,{modelValue:e.value.showIndex,"onUpdate:modelValue":a[8]||(a[8]=l=>e.value.showIndex=l),style:{"vertical-align":"middle"}},{default:d(()=>[u("显示序号")]),_:1},8,["modelValue"]),Z])]),t("tr",null,[$,t("td",null,[o(f,{modelValue:e.value.controlType,"onUpdate:modelValue":a[9]||(a[9]=l=>e.value.controlType=l),style:{"vertical-align":"middle"}},{default:d(()=>[o(v,{label:"0"},{default:d(()=>[u("弹出层")]),_:1}),o(v,{label:"1"},{default:d(()=>[u("Element")]),_:1})]),_:1},8,["modelValue"]),ee,o(p,{modelValue:e.value.showStyle,"onUpdate:modelValue":a[10]||(a[10]=l=>e.value.showStyle=l),style:{width:"330px","margin-left":"12px","vertical-align":"middle"},clearable:"",placeholder:"显示时的css样式"},null,8,["modelValue"])])]),C(t("tr",null,[le,t("td",null,[o(f,{modelValue:e.value.controlShowType,"onUpdate:modelValue":a[11]||(a[11]=l=>e.value.controlShowType=l),style:{"vertical-align":"middle"}},{default:d(()=>[o(v,{label:"0"},{default:d(()=>[u("列表")]),_:1}),o(v,{label:"1"},{default:d(()=>[u("头像")]),_:1}),o(v,{label:"2"},{default:d(()=>[u("照片墙")]),_:1})]),_:1},8,["modelValue"]),t("span",te,[u(" 提示"),o(p,{modelValue:e.value.tip,"onUpdate:modelValue":a[12]||(a[12]=l=>e.value.tip=l),style:{"margin-left":"12px",width:"180px"},placeholder:"对上传文件的要求说明等提示"},null,8,["modelValue"])]),t("span",ae,[u(" 按钮文字"),o(p,{modelValue:e.value.buttonText,"onUpdate:modelValue":a[13]||(a[13]=l=>e.value.buttonText=l),style:{"margin-left":"12px",width:"80px"},placeholder:""},null,8,["modelValue"])])])],512),[[J,e.value.controlType=="1"]])])]),_:1}),o(I,{name:"1",label:"事件",style:{height:"100%"}},{default:d(()=>[t("table",oe,[t("tr",null,[ne,t("td",null,[o(U,{modelValue:b.value,"onUpdate:modelValue":a[14]||(a[14]=l=>b.value=l)},{default:d(()=>[o(m,{value:"change",label:"change"}),o(m,{value:"click",label:"click"})]),_:1},8,["modelValue"])])]),t("tr",null,[de,t("td",null,[(h(!0),V(N,null,E(s.value.events,l=>C((h(),V("div",{style:{width:"620px"},key:"script_"+l.name},[o(w(F),{modelValue:l.script,"onUpdate:modelValue":q=>l.script=q,height:"300px"},null,8,["modelValue","onUpdate:modelValue"])])),[[J,b.value==l.name]])),128))])])])]),_:1})]),_:1})}}};export{fe as default};
