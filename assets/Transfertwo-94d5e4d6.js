import{_ as A}from"./index-823f4b27.js";import{c as C,a as r,W as a,bD as n,b9 as u,aX as g,o as d,U as c,F as v,aV as x,H as T}from"./_@vue-5ba92de9.js";import"./__vendor-5e6ac033.js";import"./_@element-plus-ad4c9002.js";import"./_crypto-js-0812dcff.js";import"./_element-plus-8c7ce171.js";import"./_@popperjs-c75af06c.js";import"./_pdfjs-dist-c04561eb.js";import"./_@microsoft-43c4e133.js";import"./_vue-codemirror-50da885a.js";const N={name:"transferPage",inject:["Savecolum"],props:{titles:{type:Array,default:()=>["待选列表","已选列表"]},filterPlaceholder:{type:String,default:"请输入内容"},filterable:{type:Boolean,default:!1},leftTransferData:{type:Array,default:()=>[]},rightTransferData:{type:Array,default:()=>[]}},data(){return{leftOriginDataList:[],leftAllDataList:[],leftTransferDataList:[],leftCheckKeys:[],leftCheckList:[],leftSearch:"",leftPageOption:{currentPage:1,pageSize:10,total:0},rightOriginDataList:[],rightAllDataList:[],rightTransferDataList:[],rightCheckKeys:[],rightCheckList:[],rightSearch:"",rightPageOption:{currentPage:1,pageSize:10,total:0},search:{code:"",name:""},stashSearch:{code:"",name:""}}},created(){},computed:{leftTotal(){return this.leftOriginDataList.length},rightTotal(){return this.rightOriginDataList.length}},watch:{leftTransferData:{handler(){this.leftOriginDataList=JSON.parse(JSON.stringify(this.leftTransferData)),this.rightOriginDataList=JSON.parse(JSON.stringify(this.rightTransferData)),this.leftAllDataList=JSON.parse(JSON.stringify(this.leftTransferData)),this.rightAllDataList=JSON.parse(JSON.stringify(this.rightTransferData)),this.init()},deep:!0,immediate:!0},rightOriginDataList:{handler(){this.$emit("transferChange",this.rightOriginDataList)},deep:!0}},methods:{init(){this.leftOriginDataList=JSON.parse(JSON.stringify(this.leftTransferData)),this.rightOriginDataList=JSON.parse(JSON.stringify(this.rightTransferData)),this.leftAllDataList=JSON.parse(JSON.stringify(this.leftTransferData)),this.rightAllDataList=JSON.parse(JSON.stringify(this.rightTransferData)),this.handleDataChange()},chooseAll(e){this[`${e}CheckList`]=this[`${e}AllDataList`],this[`${e}CheckKeys`]=this[`${e}AllDataList`].map(t=>t.label)},chooseCurrentAll(e){this[`${e}CheckList`]=this[`${e}TransferDataList`],this[`${e}CheckKeys`]=this[`${e}TransferDataList`].map(t=>t.label),this.$forceUpdate()},chooseReverse(e){let t=this[`${e}CheckKeys`];this[`${e}CheckList`]=this[`${e}TransferDataList`].filter(l=>!t.includes(l.label)),this[`${e}CheckKeys`]=this[`${e}CheckList`].map(l=>l.label)},handleCheck(e,t,l){e?this[`${l}CheckList`].push(t):this[`${l}CheckList`].splice(this[`${l}CheckList`].map(h=>h.label).indexOf(t.label),1)},transferData(e){let t,l;e=="toLeft"?(t=this.rightCheckList,l=this.rightCheckKeys,t.forEach(h=>h.isvisible=!h.isvisible),this.leftOriginDataList.unshift(...t),this.rightOriginDataList=this.rightOriginDataList.filter(h=>!l.includes(h.label))):e=="toRight"&&(t=this.leftCheckList,l=this.leftCheckKeys,t.forEach(h=>h.isvisible=!h.isvisible),this.rightOriginDataList.unshift(...t),this.leftOriginDataList=this.leftOriginDataList.filter(h=>!l.includes(h.label))),this.rightCheckList=[],this.rightCheckKeys=[],this.leftCheckList=[],this.leftCheckKeys=[],this.handleDataChange()},handleDataChange(){this.searchFilter("left"),this.searchFilter("right"),this.leftPageOption.total=this.leftAllDataList.length,this.rightPageOption.total=this.rightAllDataList.length,this.leftPageOption.total!==0&&this.leftPageOption.total<=(this.leftPageOption.currentPage-1)*this.leftPageOption.pageSize&&this.leftPageOption.currentPage--,this.rightPageOption.total!==0&&this.rightPageOption.total<=(this.rightPageOption.currentPage-1)*this.rightPageOption.pageSize&&this.rightPageOption.currentPage--,this.leftTransferDataList=this.handleData(this.leftAllDataList,this.leftPageOption),this.rightTransferDataList=this.handleData(this.rightAllDataList,this.rightPageOption)},searchFilter(e){this[`${e}Search`]=this[`${e}Search`]?this[`${e}Search`].trim():"";let t=[];this[`${e}Search`]?t=this[`${e}OriginDataList`].filter(l=>{var h;return(h=l.label)==null?void 0:h.includes(this[`${e}Search`])}):t=JSON.parse(JSON.stringify(this[`${e}OriginDataList`])),this[`${e}PageOption`].total=t.length,this[`${e}AllDataList`]=t,this[`${e}TransferDataList`]=this.handleData(this[`${e}AllDataList`],this[`${e}PageOption`])},searchClick(e,t){this[`${t}PageOption`].currentPage=1,this[`${t}Search`]=e,this.searchFilter(t)},handleData(e,t){let l=(t.currentPage-1)*t.pageSize,h=l+t.pageSize,s=[];return s=e.slice(l,h),s},handleCurrentChange(e,t){this[`${t}PageOption`].currentPage=e,this[`${t}TransferDataList`]=this.handleData(this[`${t}AllDataList`],this[`${t}PageOption`])}}},w={class:"transfer"},J={class:"left-box card-box"},y={class:"box-top"},V={class:"el-dropdown-link"},K={class:"total-tip"},z={class:"title-tip"},$={class:"box-content"},F={class:"search-margin"},U={class:"checkbox-group"},B={class:"box-bottom"},R={class:"buttons-box"},j={class:"right-box card-box"},E={class:"box-top"},I={class:"el-dropdown-link"},H={class:"total-tip"},W={class:"title-tip"},X={class:"box-content"},q={class:"search-margin"},G={class:"checkbox-group"},M={class:"box-bottom"};function Q(e,t,l,h,s,o){const D=g("ArrowDown"),m=g("el-icon"),f=g("el-dropdown-item"),L=g("el-dropdown-menu"),k=g("el-dropdown"),O=g("el-input"),b=g("el-checkbox"),P=g("el-checkbox-group"),S=g("el-pagination"),p=g("el-button");return d(),C("div",w,[r("div",J,[r("div",y,[a(k,{placement:"bottom-start"},{dropdown:n(()=>[a(L,null,{default:n(()=>[a(f,{onClick:t[0]||(t[0]=i=>o.chooseAll("left"))},{default:n(()=>[c("全选所有")]),_:1}),a(f,{onClick:t[1]||(t[1]=i=>o.chooseCurrentAll("left"))},{default:n(()=>[c("全选当页")]),_:1}),a(f,{onClick:t[2]||(t[2]=i=>o.chooseReverse("left"))},{default:n(()=>[c("反选当页")]),_:1})]),_:1})]),default:n(()=>[r("span",V,[a(m,null,{default:n(()=>[a(D)]),_:1})])]),_:1}),r("span",K,u(`${s.leftCheckList.length}/${o.leftTotal}`),1),r("span",z,u(l.titles[0]),1)]),r("div",$,[r("div",F,[a(O,{placeholder:l.filterPlaceholder,"prefix-icon":"el-icon-search",size:"small",modelValue:s.leftSearch,"onUpdate:modelValue":t[3]||(t[3]=i=>s.leftSearch=i),clearable:"",onInput:t[4]||(t[4]=i=>o.searchClick(i,"left"))},null,8,["placeholder","modelValue"])]),r("div",U,[a(P,{modelValue:s.leftCheckKeys,"onUpdate:modelValue":t[5]||(t[5]=i=>s.leftCheckKeys=i)},{default:n(()=>[(d(!0),C(v,null,x(s.leftTransferDataList,i=>(d(),T(b,{class:"wrap-text",onChange:_=>o.handleCheck(_,i,"left"),key:i.value,label:i.label},null,8,["onChange","label"]))),128))]),_:1},8,["modelValue"])])]),r("div",B,[a(S,{small:"",slot:"left-footer",onCurrentChange:t[6]||(t[6]=i=>o.handleCurrentChange(i,"left")),"current-page":s.leftPageOption.currentPage,"page-size":s.leftPageOption.pageSize,layout:"prev, pager, next, jumper",total:s.leftPageOption.total},null,8,["current-page","page-size","total"])])]),r("div",R,[a(p,{type:"primary",onClick:t[7]||(t[7]=i=>o.Savecolum())},{default:n(()=>[c("保存")]),_:1}),a(p,{type:"primary",disabled:s.leftCheckList.length<1,onClick:t[8]||(t[8]=i=>o.transferData("toRight"))},{default:n(()=>[c("显示")]),_:1},8,["disabled"]),a(p,{type:"primary",disabled:s.rightCheckList.length<1,onClick:t[9]||(t[9]=i=>o.transferData("toLeft"))},{default:n(()=>[c("隐藏")]),_:1},8,["disabled"])]),r("div",j,[r("div",E,[a(k,{placement:"bottom-start"},{dropdown:n(()=>[a(L,null,{default:n(()=>[a(f,{onClick:t[10]||(t[10]=i=>o.chooseAll("right"))},{default:n(()=>[c("全选所有")]),_:1}),a(f,{onClick:t[11]||(t[11]=i=>o.chooseCurrentAll("right"))},{default:n(()=>[c("全选当页")]),_:1}),a(f,{onClick:t[12]||(t[12]=i=>o.chooseReverse("right"))},{default:n(()=>[c("反选当页")]),_:1})]),_:1})]),default:n(()=>[r("span",I,[a(m,null,{default:n(()=>[a(D)]),_:1})])]),_:1}),r("span",H,u(`${s.rightCheckList.length}/${o.rightTotal}`),1),r("span",W,u(l.titles[1]),1)]),r("div",X,[r("div",q,[a(O,{placeholder:l.filterPlaceholder,"prefix-icon":"el-icon-search",size:"small",modelValue:s.rightSearch,"onUpdate:modelValue":t[13]||(t[13]=i=>s.rightSearch=i),clearable:"",onInput:t[14]||(t[14]=i=>o.searchClick(i,"right"))},null,8,["placeholder","modelValue"])]),r("div",G,[a(P,{modelValue:s.rightCheckKeys,"onUpdate:modelValue":t[15]||(t[15]=i=>s.rightCheckKeys=i)},{default:n(()=>[(d(!0),C(v,null,x(s.rightTransferDataList,i=>(d(),T(b,{class:"wrap-text",key:i.value,label:i.label,onChange:_=>o.handleCheck(_,i,"right")},null,8,["label","onChange"]))),128))]),_:1},8,["modelValue"])])]),r("div",M,[a(S,{small:"",slot:"right-footer",onCurrentChange:t[16]||(t[16]=i=>o.handleCurrentChange(i,"right")),"current-page":s.rightPageOption.currentPage,"page-size":s.rightPageOption.pageSize,layout:"prev, pager, next, jumper",total:s.rightPageOption.total},null,8,["current-page","page-size","total"])])])])}const ht=A(N,[["render",Q],["__scopeId","data-v-695f4d08"]]);export{ht as default};
