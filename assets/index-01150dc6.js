import{ai as y,aT as d,c as x,a as o,W as l,bD as a,bF as B,F as X,aV as Y,bv as O,aX as i,aY as Q,o as c,U as g,H as L,b9 as p}from"./_@vue-5ba92de9.js";const Z={style:{height:"inherit"}},ee={class:"roaduim_title"},te=o("span",null,"文档中心",-1),le=o("h4",null,"文档目录",-1),ae={class:"roadui_treenode"},ne={style:{padding:"0 12px"}},oe=["infinite-scroll-disabled"],ie=["onClick"],se={class:"roaduim_main_todonote"},de={class:"roadui_note",style:{"text-align":"center",padding:"10px 0"}},pe={__name:"index",setup(re){const k=y("ajax"),D=y("utils"),U=y("qs"),z=y("indexm_openurl"),r=d({}),u=d(!1),C=d(""),N=d([]),V=d([]),$={children:"children",label:"title",isLeaf:"isLeaf"},j=d(null),F=n=>{r.value.dirId=n.id,C.value=n.title,u.value=!1,v(!0)},G=(n,e)=>{if(n.level===0)k.post("/Doc/GetDirTreeJson").then(s=>{N.value=s.data,D.length(s.data)>0&&(V.value.push(s.data[0].id),r.value.dirId=s.data[0].id,C.value=s.data[0].title),v(!0)}).catch(()=>{});else{if(D.length(n.data.children)>0){e(n.data.children);return}k.post("/Doc/GetDirTreeChildsJson?parentid="+n.data.id).then(s=>{e(s.data)}).catch(()=>{})}},b=d(!1),_=d(!1),m=d([]);let f=0;const I=()=>{_.value||(f++,v(!1))},v=n=>{n&&(m.value=new Array,f=1),b.value=!0,_.value=!0,r.value.size=8,r.value.number=f,r.value.order="",k.post("/Doc/GetList",U.stringify(r.value)).then(e=>{m.value=m.value.concat(e.data.rows),_.value=f>=Math.ceil(e.data.total/8),b.value=!1}).catch(()=>{b.value=!1})},q=n=>{const e="/mobile/document/show.vue?id="+n.id;z("doc_m_"+n.id,e)};return(n,e)=>{const s=i("Briefcase"),h=i("el-icon"),w=i("el-button"),E=i("document"),J=i("folder"),M=i("el-tree"),R=i("el-drawer"),S=i("el-input"),T=i("el-form-item"),A=i("el-form"),H=i("User"),K=i("el-space"),P=Q("infinite-scroll");return c(),x("div",Z,[o("div",ee,[l(h,null,{default:a(()=>[l(s)]),_:1}),te]),o("div",null,[l(R,{modelValue:u.value,"onUpdate:modelValue":e[1]||(e[1]=t=>u.value=t),title:"",size:"90%","show-close":!1,class:"roaduim_doc_drawer",direction:"ltr"},{header:a(({close:t,titleId:W,titleClass:ue})=>[le,l(w,{type:"primary",onClick:e[0]||(e[0]=ce=>u.value=!1)},{default:a(()=>[g("关闭")]),_:1})]),default:a(()=>[l(M,{data:N.value,props:$,load:G,lazy:"",ref_key:"dirTreeRef",ref:j,"node-key":"id","highlight-current":"","default-expanded-keys":V.value,"expand-on-click-node":!1,style:{height:"inherit","padding-right":"14px"},onNodeClick:F},{default:a(t=>[o("div",ae,[t.node.isLeaf?(c(),L(h,{key:0},{default:a(()=>[l(E)]),_:1})):(c(),L(h,{key:1},{default:a(()=>[l(J)]),_:1})),o("span",null,p(t.node.label),1)])]),_:1},8,["data","default-expanded-keys"])]),_:1},8,["modelValue"]),o("div",ne,[l(A,{inline:!0},{default:a(()=>[l(T,{label:"",style:{margin:"0 12px 0 0",width:"150px"}},{default:a(()=>[l(S,{modelValue:r.value.title,"onUpdate:modelValue":e[2]||(e[2]=t=>r.value.title=t),clearable:""},null,8,["modelValue"])]),_:1}),l(T,{style:{margin:"0"}},{default:a(()=>[l(w,{type:"primary",onClick:e[3]||(e[3]=t=>v(!0))},{default:a(()=>[g("查询")]),_:1}),l(w,{type:"primary",onClick:e[4]||(e[4]=t=>u.value=!u.value)},{default:a(()=>[g("显示目录")]),_:1})]),_:1})]),_:1}),B((c(),x("div",{"infinite-scroll-disabled":_.value,"infinite-scroll-immediate":!0},[(c(!0),x(X,null,Y(m.value,t=>(c(),x("div",{key:t.id,onClick:W=>q(t),class:"roaduim_main_todoitem"},[o("div",null,p(t.title),1),o("div",se,[l(K,{size:15,wrap:""},{default:a(()=>[o("span",null,[l(h,null,{default:a(()=>[l(H)]),_:1}),g(p(t.writeUserName),1)]),o("span",null,p(t.dirName),1),o("span",null,p(t.writeTime),1)]),_:2},1024)])],8,ie))),128)),B(o("div",de,"没有更多了",512),[[O,_.value]])],8,oe)),[[P,I]])])])])}}};export{pe as default};
