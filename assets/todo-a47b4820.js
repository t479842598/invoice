import{ai as d,aT as _,c as p,a,W as o,bD as i,bF as y,F as S,aV as A,bv as G,aX as n,aY as V,o as r,U as g,H,b9 as c,bi as C,I as W}from"./_@vue-5ba92de9.js";const X={style:{height:"inherit"}},Y={class:"roaduim_title"},J=a("span",null,"待办事项",-1),K={style:{padding:"0 12px"}},O=["infinite-scroll-disabled"],P=["onClick"],Q={class:"roaduim_main_todonote"},R={class:"roadui_note",style:{"text-align":"center",padding:"10px 0"}},oe={__name:"todo",setup(Z){const D=d("ajax"),b=d("utils"),k=d("qs"),I=d("indexm_openurl");d("indexm_backpage"),d("indexm_refreshpage");const m=_(!1),u=_(!1),x=_(0);let v=0;const s=_({}),f=_([]),B=()=>{u.value||(v++,w(!1))},w=l=>{l&&(f.value=new Array,v=1),m.value=!0,u.value=!0,s.value.size=8,s.value.number=v,s.value.order="receivetime desc",D.post("/Flow/GetTodoList",k.stringify(s.value)).then(t=>{f.value=f.value.concat(t.data.rows),x.value=t.data.total,u.value=v>=Math.ceil(t.data.total/8),m.value=!1}).catch(()=>{m.value=!1})},F=l=>{const t="task_m_todo_"+l.id,h="/flow/run/index.vue?flowid="+l.flowId+"&stepid="+l.stepId+"&taskid="+l.id+"&groupid="+l.groupId+"&instanceid="+l.instanceId+"&ismobile=1";I(t,h)};return(l,t)=>{const h=n("Edit"),T=n("el-icon"),U=n("el-input"),N=n("el-form-item"),j=n("el-button"),E=n("el-form"),L=n("el-tag"),$=n("User"),q=n("el-space"),z=V("infinite-scroll"),M=V("loading");return r(),p("div",X,[a("div",Y,[o(T,null,{default:i(()=>[o(h)]),_:1}),J]),y((r(),p("div",null,[a("div",K,[o(E,{inline:!0},{default:i(()=>[o(N,{label:"",style:{margin:"0 12px 0 0",width:"220px"}},{default:i(()=>[o(U,{modelValue:s.value.title,"onUpdate:modelValue":t[0]||(t[0]=e=>s.value.title=e),placeholder:`共${x.value}项`,clearable:""},null,8,["modelValue","placeholder"])]),_:1}),o(N,{style:{margin:"0"}},{default:i(()=>[o(j,{type:"primary",onClick:t[1]||(t[1]=e=>w(!0))},{default:i(()=>[g("查询")]),_:1})]),_:1})]),_:1})]),y((r(),p("div",{style:{padding:"0 6px"},"infinite-scroll-disabled":u.value,"infinite-scroll-immediate":!0},[(r(!0),p(S,null,A(f.value,e=>(r(),p("div",{key:e.id,class:"roaduim_main_todoitem",onClick:ee=>F(e)},[a("div",null,[e.taskType>0?(r(),H(L,{key:0,effect:"dark",style:{"margin-right":"5px","border-width":"0"},color:C(b).getTaskTypeColor(e.taskType)},{default:i(()=>[g(c(C(b).getTaskTypeTitle(e.taskType)),1)]),_:2},1032,["color"])):W("",!0),g(" "+c(e.title),1)]),a("div",Q,[o(q,{size:15,wrap:""},{default:i(()=>[a("span",null,[o(T,null,{default:i(()=>[o($)]),_:1}),g(c(e.senderName),1)]),a("span",null,c(e.flowName)+" - "+c(e.stepName),1),a("span",null,c(e.receiveTime),1)]),_:2},1024)])],8,P))),128)),y(a("div",R," 没有更多了 ",512),[[G,u.value]])],8,O)),[[z,B]])])),[[M,m.value]])])}}};export{oe as default};
