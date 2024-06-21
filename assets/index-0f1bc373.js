import{D as te}from"./_vuedraggable-a473ce37.js";import{p as F,_ as oe}from"./_splitpanes-c98d9122.js";import{ai as w,aF as se,aK as de,aT as g,c as I,W as a,bD as o,bi as h,aX as r,o as V,a as y,H as A,b9 as R,U as f}from"./_@vue-5ba92de9.js";import"./__vendor-5e6ac033.js";const ie={style:{height:"inherit"}},ne={class:"roadui_treenode"},ue={key:0,style:{width:"750px",padding:"0 0 0 20px"}},ce={key:1},re={class:"roadui_draggable_item"},fe={class:"dialog-footer"},pe=y("span",{class:"dialog-footer"},null,-1),be={__name:"index",setup(me){const _=w("ajax"),s=w("utils"),j=w("config"),D=w("qs");se(()=>{document.body.ondrop=function(l){try{l.preventDefault(),l.stopPropagation()}catch{}}}),de(()=>{document.body.ondrop=null});const E=g(null),N=g([]),T=g([]),G={children:"children",label:"title",isLeaf:"isLeaf"},$=(l,e)=>{if(l.level===0)_.post("/Dictionary/GetTreeJson").then(n=>{N.value=n.data,s.length(n.data)>0&&T.value.push(n.data[0].id),loadTableData(!1)}).catch(()=>{});else{if(s.length(l.data.children)>0){e(l.data.children);return}_.post("/Dictionary/GetTreeChildsJson?parentid="+l.data.id).then(n=>{e(n.data)}).catch(()=>{})}},q=l=>{K(l.id)},x=l=>{_.post("/Dictionary/GetTreeChildsJson?parentid="+l).then(e=>{E.value.updateKeyChildren(l,e.data)}).catch(()=>{})},d=g(!1),t=g({}),U=g(null),J={title:[{required:!0,message:"请输入字典标题",trigger:"blur"}]},K=l=>{d.value=!0,_.post("/Dictionary/Get?dictid="+l).then(e=>{if(e.code==-1){s.msg("未找到字典！",e.success);return}t.value=e.data,d.value=!1}).catch(()=>{d.value=!1})},W=()=>{t.value={id:t.value.id||"",parentId:t.value.parentId||"",status:0}},L=async(l,e)=>{l&&await l.validate(n=>{n&&s.confirm("您确定要保存"+(e===1?"为下级":"")+"吗？",()=>{d.value=!0,_.post("/Dictionary/Save?dictid="+(t.value.id||"")+"&savetype="+(e||0).toString(),D.stringify(t.value)).then(c=>{d.value=!1;let u=c.msg;if(s.length(u)===0&&(c.success?u="保存成功！":c.code==1?u="数据验证错误！":c.code==2?u="唯一代码重复！":u="保存失败！"),s.msg(u,c.success),c.success){const p=E.value.getNode(t.value.id),m=s.isDef(p)&&p.isLeaf,b=e===1&&!m?t.value.id:t.value.parentId;x(b),m&&T.value.push(t.value.id)}}).catch(()=>{d.value=!1})})})},P=()=>{if(s.length(t.value.id)===0){s.msg("请选择要删除的字典！","error");return}s.confirm("此操作将会删除该字典及其所有下级字典，您确定要删除吗？",()=>{d.value=!0,_.post("/Dictionary/Delete",D.stringify({dictid:t.value.id})).then(l=>{let e=l.msg;if(s.length(e)===0&&(l.code==-1?e="未找到要删除的字典！":l.code==1?e="不能删除根节点！":e=l.success?"删除成功！":"删除失败！"),s.msg(e,l.success),l.success){const n=t.value.parentId;x(n),t.value={}}d.value=!1}).catch(()=>{d.value=!1})})},k=g(!1),C=g([]),H=()=>{d.value=!0,_.post("/Dictionary/LoadChilds?dictid="+t.value.id).then(l=>{if(!l.success||s.length(l.data)<=1){s.msg(s.length(l.data)===0?"当前字典没有下级字典，勿需排序！":"当前字典只有一个下级字典，勿需排序！",!1);return}C.value=l.data,k.value=!0,d.value=!1}).catch(()=>{d.value=!1})},M=()=>{let l=[];for(let e=0;e<C.value.length;e++)l.push(C.value[e].id);d.value=!0,_.post("/Dictionary/SaveSort?dictid="+t.value.id,D.stringify({dicts:l.join(",")})).then(e=>{let n=e.msg;if(s.length(n)===0&&(n=e.success?"保存成功！":"保存失败！"),s.msg(n,e.success),e.success){k.value=!1;const c=t.value.id;x(c)}d.value=!1}).catch(()=>{d.value=!1})},X=()=>{if(s.length(t.value.id)===0){s.alert("您没有选择要导出的字典！","","",!1);return}const l=j.SERVER_WEBADDRESS+"/Export/DictionaryExport?dictid="+t.value.id;window.location.href=l},S=g(!1),O=()=>{S.value=!0},Q=l=>l.type!=="application/json"?(s.msg("要导入的文件必须是json格式文件!",!1),!1):!0,Y=(l,e)=>{if(e.status==="success"){if(l.code!=0){s.msg("文件上传失败！",!1);return}const c=l.data.id;_.post("/Dictionary/ImportDict",D.stringify({files:c})).then(u=>{let p=u.msg;s.length(p)===0&&(u.success?p="导入成功！":u.code==1?p="要导入的文件不存在！":u.code==2?p="要导入的文件不是有效的json格式文件！":p="导入失败！"),s.msg(p,u.success),u.success&&(S.value=!1,x(t.value.id))}).catch(()=>{})}else e.status==="error"&&s.msg("文件上传失败！",!1)};return(l,e)=>{const n=r("document"),c=r("el-icon"),u=r("folder"),p=r("el-tree"),m=r("el-form-item"),b=r("el-input"),B=r("el-radio"),Z=r("el-radio-group"),v=r("el-button"),ee=r("el-form"),le=r("el-empty"),z=r("el-dialog"),ae=r("el-upload");return V(),I("div",ie,[a(h(oe),{class:"default-theme",style:{height:"inherit"}},{default:o(()=>[a(h(F),{size:20,"min-size":"20","max-size":"50",style:{overflow:"auto",background:"#fff"}},{default:o(()=>[a(p,{data:N.value,props:G,"node-key":"id",load:$,lazy:"",ref_key:"dictTreeRef",ref:E,"highlight-current":"","default-expanded-keys":T.value,style:{height:"inherit","padding-right":"14px"},"expand-on-click-node":!1,onNodeClick:q},{default:o(i=>[y("div",ne,[i.node.isLeaf?(V(),A(c,{key:0},{default:o(()=>[a(n)]),_:1})):(V(),A(c,{key:1},{default:o(()=>[a(u)]),_:1})),y("span",null,R(i.node.label),1)])]),_:1},8,["data","default-expanded-keys"])]),_:1}),a(h(F),{size:80,style:{background:"#fff",overflow:"auto","padding-left":"5px"}},{default:o(()=>[h(s).length(t.value)>0&&t.value.id>h(s).emptyLong?(V(),I("div",ue,[a(ee,{model:t.value,ref_key:"ruleFormRef",ref:U,rules:J,"label-width":"80px"},{default:o(()=>[a(m,{label:"字典id",class:"roadui_formfont"},{default:o(()=>[f(R(t.value.id),1)]),_:1}),a(m,{label:"字典标题",prop:"title"},{default:o(()=>[a(b,{modelValue:t.value.title,"onUpdate:modelValue":e[0]||(e[0]=i=>t.value.title=i),clearable:""},null,8,["modelValue"])]),_:1}),a(m,{label:"唯一代码",prop:"code"},{default:o(()=>[a(b,{modelValue:t.value.code,"onUpdate:modelValue":e[1]||(e[1]=i=>t.value.code=i),clearable:""},null,8,["modelValue"])]),_:1}),a(m,{label:"字典值",prop:"value"},{default:o(()=>[a(b,{modelValue:t.value.value,"onUpdate:modelValue":e[2]||(e[2]=i=>t.value.value=i),clearable:""},null,8,["modelValue"])]),_:1}),a(m,{label:"备注",prop:"note"},{default:o(()=>[a(b,{modelValue:t.value.note,"onUpdate:modelValue":e[3]||(e[3]=i=>t.value.note=i),clearable:""},null,8,["modelValue"])]),_:1}),a(m,{label:"其他",prop:"other"},{default:o(()=>[a(b,{modelValue:t.value.other,"onUpdate:modelValue":e[4]||(e[4]=i=>t.value.other=i),clearable:""},null,8,["modelValue"])]),_:1}),a(m,{label:"状态",prop:"status"},{default:o(()=>[a(Z,{modelValue:t.value.status,"onUpdate:modelValue":e[5]||(e[5]=i=>t.value.status=i)},{default:o(()=>[a(B,{label:0},{default:o(()=>[f("正常")]),_:1}),a(B,{label:1},{default:o(()=>[f("作废")]),_:1})]),_:1},8,["modelValue"])]),_:1}),a(m,{label:""},{default:o(()=>[a(v,{type:"primary",disabled:d.value,onClick:W},{default:o(()=>[f("清空")]),_:1},8,["disabled"]),a(v,{type:"primary",disabled:d.value,onClick:e[6]||(e[6]=i=>L(U.value,0))},{default:o(()=>[f("保存")]),_:1},8,["disabled"]),a(v,{type:"primary",disabled:d.value,onClick:e[7]||(e[7]=i=>L(U.value,1))},{default:o(()=>[f("保存为下级")]),_:1},8,["disabled"]),a(v,{type:"danger",disabled:d.value,onClick:P},{default:o(()=>[f("删除")]),_:1},8,["disabled"]),a(v,{type:"info",disabled:d.value,onClick:H},{default:o(()=>[f("下级排序")]),_:1},8,["disabled"]),a(v,{disabled:d.value,onClick:X},{default:o(()=>[f("导出")]),_:1},8,["disabled"]),a(v,{disabled:d.value,onClick:O},{default:o(()=>[f("导入")]),_:1},8,["disabled"])]),_:1})]),_:1},8,["model"])])):(V(),I("div",ce,[a(le,{description:"请点击左边字典项进行操作"})]))]),_:1})]),_:1}),a(z,{modelValue:k.value,"onUpdate:modelValue":e[9]||(e[9]=i=>k.value=i),title:"排序","destroy-on-close":"",width:"550px","align-center":"",draggable:"","close-on-click-modal":!1},{footer:o(()=>[y("span",fe,[a(v,{disabled:d.value,type:"primary",onClick:M},{default:o(()=>[f("保存")]),_:1},8,["disabled"]),a(v,{disabled:d.value,onClick:e[8]||(e[8]=i=>k.value=!1)},{default:o(()=>[f("关闭")]),_:1},8,["disabled"])])]),default:o(()=>[a(h(te),{list:C.value,"item-key":"id",animation:200,group:{name:"menu",pull:!0},class:"roadui_draggable_chosen"},{item:o(({element:i})=>[y("div",re,[y("div",null,R(i.title),1)])]),_:1},8,["list"])]),_:1},8,["modelValue"]),a(z,{modelValue:S.value,"onUpdate:modelValue":e[10]||(e[10]=i=>S.value=i),title:"导入",class:"el-dialog__padding1","align-center":"","destroy-on-close":"",width:"350px",draggable:"","close-on-click-modal":!1},{footer:o(()=>[pe]),default:o(()=>[a(ae,{action:h(j).SERVER_WEBADDRESS+"/Files/SaveFiles","show-file-list":!1,accept:".json",headers:{"nroadflow-token":h(s).getToken()},"with-credentials":"",data:{filetype:".json",uploadtype:0},"on-success":Y,"before-upload":Q},{default:o(()=>[a(v,{type:"primary"},{default:o(()=>[f("选择文件")]),_:1})]),_:1},8,["action","headers","data"])]),_:1},8,["modelValue"])])}}};export{be as default};