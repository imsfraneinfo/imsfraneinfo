/* Imsfrane Cathédrale private in-app announcements — Demo preview (admin only).
   No emails or browser push messages are sent by this script. */
(function(){
"use strict";
const current=()=>{const s=new URLSearchParams(location.search).get("lang")||document.documentElement.lang||location.pathname.match(/\/(fr|en|ar|es)\//)?.[1]||"fr";return ["fr","en","ar","es"].includes(s)?s:"fr"};
const C={
 fr:{bell:"Notifications",none:"Vous n’avez pas de nouvelles notifications.",open:"Afficher les notifications",close:"Fermer",markAll:"Tout marquer comme lu",refresh:"Actualiser",new:"Nouveau",notice:"Les messages sont visibles dans votre espace membre. Les e-mails et notifications push ne sont pas activés.",admin:"Envoyer une annonce",preview:"Mode DEMO : le test est envoyé uniquement à votre compte administrateur. Aucun membre ne recevra ce message.",subject:"Titre de l’annonce",body:"Votre message",category:"Thème",link:"Lien interne facultatif",test:"M’envoyer un test",sending:"Envoi…",sent:"Test envoyé à votre compte.",error:"Impossible d’envoyer le test.",marketing:"Annonce promotionnelle : consentement marketing requis",categories:{news:"Actualités",rafting:"Rafting",hiking:"Randonnée",camping:"Camping",vtt:"VTT",quad:"Quad",offers:"Offres"},empty:"Vous n’avez aucun message pour le moment.",unread:"non lu",read:"lu"},
 en:{bell:"Notifications",none:"No new notifications.",open:"Show notifications",close:"Close",markAll:"Mark all as read",refresh:"Refresh",new:"New",notice:"Messages appear in your member account. Email and browser push delivery are not active.",admin:"Create an announcement",preview:"DEMO mode: this test goes only to your administrator account. Other members will not receive it.",subject:"Announcement title",body:"Message",category:"Topic",link:"Optional internal link",test:"Send test to my account",sending:"Sending…",sent:"Test delivered to your account.",error:"Could not send the test.",marketing:"Promotional announcement: marketing consent required",categories:{news:"News",rafting:"Rafting",hiking:"Hiking",camping:"Camping",vtt:"Biking",quad:"Quad",offers:"Offers"},empty:"You have no messages yet.",unread:"unread",read:"read"},
 ar:{bell:"الإشعارات",none:"لا توجد إشعارات جديدة.",open:"عرض الإشعارات",close:"إغلاق",markAll:"تحديد الكل كمقروء",refresh:"تحديث",new:"جديد",notice:"تظهر الرسائل داخل حسابك. إرسال البريد الإلكتروني وإشعارات الهاتف غير مفعّل حالياً.",admin:"إنشاء إعلان",preview:"الوضع التجريبي: سيُرسل الاختبار إلى حساب المدير فقط، ولن يصل إلى بقية الأعضاء.",subject:"عنوان الإعلان",body:"نص الرسالة",category:"التصنيف",link:"رابط داخلي اختياري",test:"إرسال تجربة إلى حسابي",sending:"جارٍ الإرسال…",sent:"وصلت الرسالة التجريبية إلى حسابك.",error:"تعذّر إرسال التجربة.",marketing:"إعلان ترويجي: يتطلب الموافقة على التسويق",categories:{news:"الأخبار",rafting:"الرافتينغ",hiking:"المشي الجبلي",camping:"التخييم",vtt:"الدراجات الجبلية",quad:"الكواد",offers:"العروض"},empty:"ليس لديك رسائل حتى الآن.",unread:"غير مقروء",read:"مقروء"},
 es:{bell:"Notificaciones",none:"No hay notificaciones nuevas.",open:"Ver notificaciones",close:"Cerrar",markAll:"Marcar todo leído",refresh:"Actualizar",new:"Nuevo",notice:"Los mensajes aparecen en tu cuenta. El envío por correo electrónico y las notificaciones push aún no están activos.",admin:"Crear anuncio",preview:"Modo DEMO: la prueba llegará solo a tu cuenta administradora. Ningún otro miembro la recibirá.",subject:"Título del anuncio",body:"Mensaje",category:"Tema",link:"Enlace interno opcional",test:"Enviarme una prueba",sending:"Enviando…",sent:"Prueba enviada a tu cuenta.",error:"No se pudo enviar la prueba.",marketing:"Anuncio promocional: requiere consentimiento",categories:{news:"Noticias",rafting:"Rafting",hiking:"Senderismo",camping:"Camping",vtt:"BTT",quad:"Quad",offers:"Ofertas"},empty:"Todavía no tienes mensajes.",unread:"sin leer",read:"leído"}
};
const base="/",url="https://ktrcrfoywokuuwzwnqsu.supabase.co",key="sb_publishable_GS2PtVM4vBv7epvV6aZSpA_XQyD9bCj";
const svgns="http://www.w3.org/2000/svg";
function bellSvg(){const x=document.createElementNS(svgns,"svg");x.setAttribute("viewBox","0 0 24 24");x.setAttribute("aria-hidden","true");x.setAttribute("fill","none");x.setAttribute("stroke","currentColor");x.setAttribute("stroke-width","1.8");x.setAttribute("stroke-linecap","round");x.setAttribute("stroke-linejoin","round");for(const d of ["M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9","M10 21h4"]){const p=document.createElementNS(svgns,"path");p.setAttribute("d",d);x.append(p)}return x}
let supabase,me=null,rows=[],isAdmin=false,btn,panel,list,status,adminForm;
function node(tag,cls,content){const n=document.createElement(tag);if(cls)n.className=cls;if(content!==undefined)n.textContent=content;return n}
function getLabels(){return C[current()]}
function build(){
 const mount=document.querySelector(".ims-member-entry")||document.querySelector(".ims-sitebar .ims-dash-header-lang");
 if(!mount)return;
 btn=node("button","ims-notif-bell");btn.type="button";btn.hidden=true;btn.append(bellSvg());
 const badge=node("span","ims-notif-badge");badge.hidden=true;btn.append(badge);
 btn.setAttribute("aria-label",getLabels().open);btn.title=getLabels().bell;
 mount.insertAdjacentElement("afterend",btn);
 const backdrop=node("div","ims-notif-backdrop");backdrop.hidden=true;
 panel=node("aside","ims-notif-panel");panel.id="ims-notif-panel";panel.hidden=true;panel.setAttribute("role","dialog");panel.setAttribute("aria-modal","true");panel.setAttribute("aria-label",getLabels().bell);panel.dir=current()==="ar"?"rtl":"ltr";
 const head=node("div","ims-notif-head"),name=node("h2",null,getLabels().bell),close=node("button","ims-notif-close","×");close.type="button";close.setAttribute("aria-label",getLabels().close);head.append(name,close);
 const tools=node("div","ims-notif-tools"),all=node("button","ims-notif-mark",getLabels().markAll),refresh=node("button","ims-notif-refresh",getLabels().refresh);
 all.type=refresh.type="button";tools.append(all,refresh);
 list=node("div","ims-notif-list");list.id="ims-notif-list";
 const info=node("p","ims-notif-note",getLabels().notice),state=node("p","ims-notif-status");state.setAttribute("role","status");
 panel.append(head,tools,list,info,state);status=state;
 const adbox=node("section","ims-notif-admin");adbox.hidden=true;const title=node("h3",null,getLabels().admin),preview=node("p","ims-notif-preview",getLabels().preview);
 const form=node("form","ims-notif-form");
 const label=(txt,id,field)=>{const wrap=node("label","ims-notif-field");const span=node("span",null,txt);field.id=id;wrap.append(span,field);return wrap};
 const subject=node("input");subject.name="title";subject.maxLength=120;subject.minLength=3;subject.required=true;
 const body=node("textarea");body.name="body";body.maxLength=1500;body.minLength=5;body.required=true;body.rows=5;
 const category=node("select");category.name="category";for(const [k,v] of Object.entries(getLabels().categories)){const option=node("option",null,v);option.value=k;category.append(option)}
 const link=node("input");link.name="link";link.maxLength=220;link.placeholder="/fr/rafting/";
 const send=node("button","ims-notif-send",getLabels().test);send.type="submit";
 form.append(label(getLabels().subject,"ims-notif-subject",subject),label(getLabels().body,"ims-notif-body",body),label(getLabels().category,"ims-notif-category",category),label(getLabels().link,"ims-notif-link",link),send);
 adbox.append(title,preview,form);panel.append(adbox);adminForm=form;
 document.body.append(backdrop,panel);
 function closePanel(){panel.hidden=true;backdrop.hidden=true;document.body.classList.remove("ims-notif-open");btn.focus()}
 function openPanel(){panel.hidden=false;backdrop.hidden=false;document.body.classList.add("ims-notif-open");load().catch(report);close.focus()}
 btn.onclick=()=>panel.hidden?openPanel():closePanel();backdrop.onclick=closePanel;close.onclick=closePanel;document.addEventListener("keydown",e=>{if(!panel.hidden&&e.key==="Escape")closePanel()});
 refresh.onclick=()=>load().catch(report);
 all.onclick=async()=>{if(!me)return;const d=new Date().toISOString(),{error}=await supabase.from("member_notifications").update({read_at:d}).eq("user_id",me.id).is("read_at",null);if(error)return report(error);await load()};
 form.onsubmit=async e=>{
 e.preventDefault();if(!me||!isAdmin)return;
 const fd=new FormData(form),val=Object.fromEntries(fd),category=String(val.category||"news"),marketing=category==="offers";
 const linkPath=String(val.link||"").trim()||null;
 if(linkPath&&!/^\/(fr|en|ar|es)\/[a-z0-9/_-]*$/.test(linkPath)){status.textContent="Invalid internal path";return}
 const button=form.querySelector('button[type="submit"]');button.disabled=true;button.textContent=getLabels().sending;
 try{
 const params={p_title:String(val.title||"").trim(),p_body:String(val.body||"").trim(),p_category:category,p_link_path:linkPath,p_marketing:marketing,p_preview_only:true,p_translations:{}};
 const r=await supabase.rpc("send_member_announcement",params);
 if(r.error)throw r.error;
 status.textContent=getLabels().sent;
 form.reset();await load();
 }catch(err){report(err)}finally{button.disabled=false;button.textContent=getLabels().test}
 };
 return {adbox}
}
function safeLink(path){if(!path||!/^\/(fr|en|ar|es)\/[a-z0-9/_-]*$/.test(path))return null;return base+path.replace(/^\/(fr|en|ar|es)\//,"/"+current()+"/").slice(1)}
function paint(){
 if(!btn)return;
 const badge=btn.querySelector(".ims-notif-badge"),unread=rows.filter(r=>!r.read_at).length;
 badge.hidden=unread===0;badge.textContent=unread>99?"99+":String(unread);
 btn.setAttribute("aria-label",getLabels().bell+(unread?" ("+unread+")":""));
 list.replaceChildren();
 if(!rows.length){list.append(node("p","ims-notif-empty",getLabels().empty));return}
 for(const entry of rows){
 const card=node("article","ims-notif-card"+(!entry.read_at?" is-unread":""));
 const tag=node("small","ims-notif-category",getLabels().categories[entry.category]||getLabels().categories.news);
 const h=node("h3",null,entry.title),p=node("p",null,entry.body),time=node("time",null,new Date(entry.created_at).toLocaleDateString(current()==="ar"?"ar-MA":current()));
 card.append(tag,h,p,time);
 const link=safeLink(entry.link_path);
 if(link){const a=node("a","ims-notif-link",current()==="ar"?"فتح الصفحة ←":"Visit page →");a.href=link;a.onclick=()=>markOne(entry.id).catch(report);card.append(a)}
 if(!entry.read_at){const read=node("button","ims-notif-read",getLabels().markAll);read.type="button";read.textContent=current()==="ar"?"تحديد كمقروء":current()==="fr"?"Marquer comme lu":current()==="es"?"Marcar como leído":"Mark read";read.onclick=()=>markOne(entry.id).catch(report);card.append(read)}
 list.append(card)
 }
}
async function markOne(id){const r=await supabase.from("member_notifications").update({read_at:new Date().toISOString()}).eq("id",id).eq("user_id",me.id);if(r.error)throw r.error;await load()}
function report(e){console.warn("Notification service",e);if(status)status.textContent=getLabels().error}
async function load(){if(!supabase||!me)return;const id=me.id;const r=await supabase.from("member_notifications").select("id,title,body,category,link_path,read_at,created_at").eq("user_id",id).order("created_at",{ascending:false}).limit(80);if(r.error)throw r.error;if(me?.id!==id)return;rows=r.data||[];paint()}
async function auth(user){me=user;btn.hidden=!user;rows=[];paint();if(!user){panel.hidden=true;return}try{let check=await supabase.from("member_admins").select("user_id").eq("user_id",user.id).maybeSingle();isAdmin=!check.error&&!!check.data;panel.querySelector(".ims-notif-admin").hidden=!(isAdmin&&location.pathname.endsWith("/members.html"));await load()}catch(e){report(e)}}
async function start(){
 if(!document.querySelector(".ims-member-entry,.ims-sitebar .ims-dash-header-lang"))return;
 build();try{const sdk=await import("https://esm.sh/@supabase/supabase-js@2");supabase=sdk.createClient(url,key);const session=await supabase.auth.getSession();await auth(session.data.session?.user||null);supabase.auth.onAuthStateChange((_event,s)=>{setTimeout(()=>auth(s?.user||null).catch(report),0)})}catch(e){report(e)}
 document.addEventListener("visibilitychange",()=>{if(!document.hidden&&me)load().catch(report)});
 setInterval(()=>{if(me&&!document.hidden)load().catch(report)},90000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();
