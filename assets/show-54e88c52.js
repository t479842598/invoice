import{ai as o,aT as E,aF as R,c as a,a as e,b9 as d,W as _,bD as u,bi as s,U as c,F as q,aV as B,I as p,aX as h,o as l}from"./_@vue-5ba92de9.js";const F={class:"roadui_page",style:{padding:"0 12px"}},N={cellpadding:"0",cellspacing:"0",border:"0",style:{width:"100%","margin-top":"12px"}},T={align:"center",class:"roadui_showdoc_title"},j={align:"center",class:"roadui_showdoc_title1"},L={key:0},M=e("span",{style:{"margin-right":"12px"}},"来源",-1),z={key:1},H=e("span",{style:{"margin-right":"12px"}},"等级",-1),I=["innerHTML"],W={key:0},$={class:"roadui_showdoc_files"},U={__name:"show",props:{query:{type:String,default:()=>""}},setup(m){const y=o("ajax"),n=o("utils");o("qs");const f=m,k=n.query("id",f.query),x=o("indexm_backpage"),v=o("index_openmenu"),w=o("config"),t=E({});R(()=>{b()});const b=()=>{y.post("/Doc/GetDocShow?docid="+k).then(i=>{if(i.code==1){n.msg("加载文档数据失败！",!1);return}if(i.code==2){n.msg("您无权查看该文档！",!1);return}t.value=i.data}).catch(()=>{})};return(i,g)=>{const D=h("el-button"),C=h("el-space"),S=h("el-link");return l(),a("div",F,[e("table",N,[e("tr",null,[e("td",T,d(t.value.title),1)]),e("tr",null,[e("td",j,[_(C,{size:20},{default:u(()=>[s(n).length(t.value.source)>0?(l(),a("span",L,[M,c(d(t.value.source),1)])):p("",!0),s(n).length(t.value.docRank)>0?(l(),a("span",z,[H,c(d(t.value.docRank),1)])):p("",!0),e("span",null,[_(D,{size:"small",type:"primary",onClick:g[0]||(g[0]=r=>s(x)())},{default:u(()=>[c("关闭")]),_:1})])]),_:1})])]),e("tr",null,[e("td",null,[e("div",{class:"roadui_showdoc_contents1",innerHTML:t.value.contents},null,8,I)])]),s(n).length(t.value.files)>0?(l(),a("tr",W,[e("td",$,[c(" 附件： "),(l(!0),a(q,null,B(t.value.files,(r,V)=>(l(),a("span",{style:{"margin-right":"12px"},key:r.id},[_(S,{onClick:A=>s(n).showFile(s(v),r,s(w).SERVER_WEBADDRESS,!0)},{default:u(()=>[c(d(++V+"、"+r.name),1)]),_:2},1032,["onClick"])]))),128))])])):p("",!0)])])}}};export{U as default};
