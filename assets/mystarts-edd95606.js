import{ai as v,aT as c,c as s,a as u,W as l,bD as o,bF as h,F as q,aV as z,bv as E,aX as i,aY as D,o as d,U as x,b9 as f,bi as G}from"./_@vue-5ba92de9.js";const H={style:{height:"inherit"}},W={class:"roaduim_title"},X=u("span",null,"我的流程",-1),Y={style:{padding:"0 12px"}},J=["infinite-scroll-disabled"],K=["onClick"],O={class:"roaduim_main_todonote"},P={key:0},Q={key:1},R={class:"roadui_note",style:{"text-align":"center",padding:"10px 0"}},le={__name:"mystarts",setup(Z){const C=v("ajax"),F=v("utils"),N=v("qs"),T=v("indexm_openurl"),_=c(!1),r=c(!1),w=c(0);let p=0;const a=c({status:0}),m=c([]),I=()=>{r.value||(p++,b(!1))},b=n=>{n&&(m.value=new Array,p=1),_.value=!0,r.value=!0,a.value.size=8,a.value.number=p,a.value.order="receivetime desc",C.post("/Flow/GetMyStartList",N.stringify(a.value)).then(e=>{m.value=m.value.concat(e.data.rows),w.value=e.data.total,r.value=p>=Math.ceil(e.data.total/8),_.value=!1}).catch(()=>{_.value=!1})},$=n=>{const e="task_completed_"+n.id,g="/flow/run/index.vue?flowid="+n.flowId+"&stepid="+n.stepId+"&taskid="+n.id+"&groupid="+n.groupId+"&instanceid="+n.instanceId+"&ismobile=1";T(e,g)};return(n,e)=>{const g=i("FolderAdd"),j=i("el-icon"),k=i("el-input"),y=i("el-form-item"),V=i("el-radio-button"),A=i("el-radio-group"),B=i("el-button"),L=i("el-form"),M=i("el-space"),S=D("infinite-scroll"),U=D("loading");return d(),s("div",H,[u("div",W,[l(j,null,{default:o(()=>[l(g)]),_:1}),X]),h((d(),s("div",null,[u("div",Y,[l(L,{inline:!0},{default:o(()=>[l(y,{label:"",style:{margin:"0 12px 0 0",width:"100px"}},{default:o(()=>[l(k,{modelValue:a.value.title,"onUpdate:modelValue":e[0]||(e[0]=t=>a.value.title=t),placeholder:`共${w.value}项`,clearable:""},null,8,["modelValue","placeholder"])]),_:1}),l(y,{label:"",style:{margin:"0 12px 0 0"}},{default:o(()=>[l(A,{modelValue:a.value.status,"onUpdate:modelValue":e[1]||(e[1]=t=>a.value.status=t),onChange:e[2]||(e[2]=t=>b(!0))},{default:o(()=>[l(V,{label:"0"},{default:o(()=>[x("进行中")]),_:1}),l(V,{label:"1"},{default:o(()=>[x("已结束")]),_:1})]),_:1},8,["modelValue"])]),_:1}),l(y,{style:{margin:"0"}},{default:o(()=>[l(B,{type:"primary",onClick:e[3]||(e[3]=t=>b(!0))},{default:o(()=>[x("查询")]),_:1})]),_:1})]),_:1})]),h((d(),s("div",{style:{padding:"0 6px"},"infinite-scroll-disabled":r.value,"infinite-scroll-immediate":!0},[(d(!0),s(q,null,z(m.value,t=>(d(),s("div",{key:t.id,class:"roaduim_main_todoitem",onClick:ee=>{$(t)}},[u("div",null,f(t.title),1),u("div",O,[l(M,{size:15,wrap:""},{default:o(()=>[a.value.status==0?(d(),s("span",P,f(t.stepName),1)):(d(),s("span",Q,f(G(F).getTaskHadleTitle(parseInt(t.stepName)||2)),1)),u("span",null,f(t.receiveTime),1)]),_:2},1024)])],8,K))),128)),h(u("div",R,"没有更多了",512),[[E,r.value]])],8,J)),[[S,I]])])),[[U,_.value]])])}}};export{le as default};
