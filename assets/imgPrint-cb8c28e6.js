import{aT as n,ai as c,bm as b,aF as C,c as W,a as l,W as d,bD as p,aX as v,o as E,U as h}from"./_@vue-5ba92de9.js";const L={style:{width:"100%","max-height":"90vh",overflow:"hidden","overflow-y":"scroll"}},T={style:{"margin-bottom":"20px",width:"100%","text-align":"center"}},M={class:"demo-image__preview"},B=l("div",{id:"printme",style:{display:"none"}},null,-1),k={__name:"imgPrint",props:{selectListid:{},selectListidModifiers:{}},emits:["update:selectListid"],setup(w){const _=window.document.location.href,r=n(_+"upload/"),m=c("imgshow"),f=c("viewfileshow");c("index_refreshtab"),n(null),n({}),n(!0),n([]),b(w,"selectListid");const a=n([]);C(()=>{m.value.forEach(i=>{a.value.push(r.value+i.imagename)}),document.querySelector("#printme").innerHTML=m.value.map(i=>`<div style="width:100%;text-align:center;"><img src="${r.value+i.imagename}" style="width: 95%;" alt=""></div>`).join("")}),n(""),n("");function x(){var i=document.getElementById("printme"),e=document.createElement("IFRAME"),o=null;e.setAttribute("style","position:absolute;width:0px;height:0px;left:-500px;top:-500px;"),document.body.appendChild(e),o=e.contentWindow.document,o.write('<div class="detail-content content_wrap pl30">'+i.innerHTML+"</div>"),o.close();var s=".content_wrapxxx",t=e.contentWindow.document.createElement("style");if(t.setAttribute("type","text/css"),t.styleSheet)t.styleSheet.cssText=s;else{var y=e.contentWindow.document.createTextNode(s);t.appendChild(y)}var u=e.contentWindow.document.getElementsByTagName("head");u.length?u[0].appendChild(t):e.contentWindow.document.documentElement.appendChild(t),e.contentWindow.focus(),e.onload=function(){e.contentWindow.print()}}function g(){f.value=!1}return(i,e)=>{const o=v("el-button"),s=v("el-image");return E(),W("div",null,[l("div",L,[l("div",T,[d(o,{type:"primary",icon:"Printer",onClick:e[0]||(e[0]=t=>x())},{default:p(()=>[h("打印")]),_:1}),d(o,{onClick:e[1]||(e[1]=t=>g()),icon:"CircleClose"},{default:p(()=>[h("关闭")]),_:1})]),l("div",M,[d(s,{style:{width:"950px",height:"680px"},src:a.value[0],"zoom-rate":1.2,"max-scale":1.5,"min-scale":.2,"preview-src-list":a.value,"initial-index":4,fit:"scale-down",infinite:""},null,8,["src","preview-src-list"])]),B])])}}};export{k as default};