import{d as F,ai as s,aT as d,aF as J,c as m,W as a,bD as l,A as O,aX as r,o as u,F as v,aV as g,H as z,U as i,b9 as G}from"./_@vue-5ba92de9.js";import{_ as L}from"./index-823f4b27.js";import"./__vendor-5e6ac033.js";import"./_@element-plus-ad4c9002.js";import"./_crypto-js-0812dcff.js";import"./_element-plus-8c7ce171.js";import"./_@popperjs-c75af06c.js";import"./_pdfjs-dist-c04561eb.js";import"./_@microsoft-43c4e133.js";import"./_vue-codemirror-50da885a.js";const H=F({__name:"CustomerProfileEdit",props:{query:{type:String,default:()=>""},modelValue:{type:Boolean,default:!1},id:{type:String,default:""}},emits:["update:id"],setup(x,{emit:h}){const p=s("ajax"),_=s("utils");s("config");const f=s("qs");s("index_openmenu"),s("index_removetab");const C=s("index_refreshtab"),y=d("");localStorage.getItem("sobInfo")!=""&&(y.value=JSON.parse(localStorage.getItem("sobInfo")));const V=h,S=x;function k(e){return O({get:()=>S[e],set:n=>{V(`update:${e}`,n)}})}const P=k("id"),A=d([{value:!0,label:"是"},{value:!1,label:"否"}]);J(async()=>{await E()});const o=d({customercode:"",customername:"",Taxno:"",AddressPhone:"",Phone:"",BankAccount:"",Email:"",ists:!1}),B=[{label:"客户编号",model:"customercode",type:""},{label:"客户名称",model:"customername",type:""},{label:"纳税人识别号",model:"Taxno",type:""},{label:"开户行",model:"BankName",type:""},{label:"银行账号",model:"Account",type:""},{label:"地址",model:"Address",type:""},{label:"电话",model:"Phone",type:""},{label:"邮箱",model:"Email",type:""}],E=async()=>{try{const e=await p.post("/Customer/Get",f.stringify({id:P.value}));o.value=e.data.customer}catch{}},I=async()=>{try{const e=await p.post("/Customer/Save?srcorgid="+y.value.id,f.stringify({customerJSON:JSON.stringify(o.value)})),n=e.success?"success":"error";_.msg(e.msg,n,!1),e.success&&C()}catch{_.msg("保存数据时出现错误","error",!1)}},w=()=>{o.value={customercode:"",customername:"",Taxno:"",AddressPhone:"",Phone:"",BankAccount:"",Email:""}};return(e,n)=>{const T=r("el-input"),c=r("el-form-item"),D=r("el-radio"),N=r("el-radio-group"),b=r("el-button"),U=r("el-form");return u(),m("div",null,[a(U,{model:o.value,class:"inline","label-width":"130px"},{default:l(()=>[(u(),m(v,null,g(B,(t,j)=>a(c,{key:j,label:t.label},{default:l(()=>[a(T,{autosize:t.auto,type:t.type,style:{width:"300px"},modelValue:o.value[t.model],"onUpdate:modelValue":q=>o.value[t.model]=q},null,8,["autosize","type","modelValue","onUpdate:modelValue"])]),_:2},1032,["label"])),64)),a(c,{label:"是否推送客户邮箱"},{default:l(()=>[a(N,{modelValue:o.value.ists,"onUpdate:modelValue":n[0]||(n[0]=t=>o.value.ists=t)},{default:l(()=>[(u(!0),m(v,null,g(A.value,t=>(u(),z(D,{label:t.value},{default:l(()=>[i(G(t.label),1)]),_:2},1032,["label"]))),256))]),_:1},8,["modelValue"])]),_:1}),a(c,null,{default:l(()=>[a(b,{type:"primary",onClick:I},{default:l(()=>[i("保存")]),_:1}),a(b,{type:"default",onClick:w},{default:l(()=>[i("重置")]),_:1})]),_:1})]),_:1},8,["model"])])}}});const te=L(H,[["__scopeId","data-v-109b0713"]]);export{te as default};