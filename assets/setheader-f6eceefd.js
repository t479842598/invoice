import{V as E}from"./_vue-cropper-aa77d280.js";import{ai as n,aT as c,aF as H,c as R,a as u,W as r,bD as i,bi as m,aX as v,o as S,U as d}from"./_@vue-5ba92de9.js";const T={cellpadding:"0",cellspacing:"0",border:"0",style:{width:"100%"}},V={style:{"padding-top":"20px"}},W={style:{width:"700px",height:"500px"}},A={__name:"setheader",setup(k){const g=n("ajax"),l=n("utils"),h=n("qs"),_=n("config"),p=n("index_userinfo"),f=c(null),o=c(!1),a=c({img:"",outputType:"png",autoCrop:!0,autoCropWidth:200,autoCropHeight:200,centerBox:!0}),y=(e,t)=>{const s=new FileReader;s.addEventListener("load",()=>t(s.result)),s.readAsDataURL(e)};H(()=>{a.value.img=p.value.headerImg});const C=e=>e.type!=="image/jpeg"&&e.type!=="image/png"&&e.type!=="image/gif"?(l.msg("头像必须是图片格式!",!1),!1):e.size/1024/1024>1?(l.msg("上传的图片文件不能大于1M!",!1),!1):!0,x=(e,t)=>{y(t.raw,s=>{a.value.img=s})},b=()=>{if(l.length(a.value.img)<=0){l.msg("没有要保存的头像！",!1);return}f.value.getCropData(e=>{o.value=!0,g.post("/User/SaveHeader",h.stringify({img:e})).then(t=>{l.msg(t.success?"保存成功！":"保存失败！",t.success),t.success&&(p.value.headerImg=e,o.value=!1)}).catch(()=>{o.value=!1})})},B=()=>{g.post("/User/ResetHeader").then(e=>{l.msg(e.success?"恢复成功！":"恢复失败！",e.success),e.success&&(a.value.img="",p.value.headerImg="",o.value=!1)}).catch(()=>{o.value=!1})};return(e,t)=>{const s=v("el-button"),j=v("el-upload");return S(),R("div",null,[u("table",T,[u("tr",null,[u("td",null,[r(j,{action:m(_).SERVER_WEBADDRESS+"/Files/SaveFiles","show-file-list":!1,"with-credentials":"",accept:".jpg,.jpeg,.png,.gif",data:{filetype:".jpg,.jpeg,.png,.gif",uploadtype:0},"on-success":x,"before-upload":C},{default:i(()=>[r(s,{type:"primary"},{default:i(()=>[d("上传")]),_:1})]),_:1},8,["action","data"]),r(s,{style:{"margin-left":"14px"},type:"primary",disabled:o.value,onClick:t[0]||(t[0]=D=>b())},{default:i(()=>[d("保存头像")]),_:1},8,["disabled"]),r(s,{type:"primary",disabled:o.value,onClick:t[1]||(t[1]=D=>B())},{default:i(()=>[d("恢复默认")]),_:1},8,["disabled"])])]),u("tr",null,[u("td",V,[u("div",W,[r(m(E),{ref_key:"cropper",ref:f,img:a.value.img,autoCrop:a.value.autoCrop,autoCropWidth:a.value.autoCropWidth,autoCropHeight:a.value.autoCropHeight,centerBox:a.value.centerBox,outputType:a.value.outputType},null,8,["img","autoCrop","autoCropWidth","autoCropHeight","centerBox","outputType"])])])])])])}}};export{A as default};
