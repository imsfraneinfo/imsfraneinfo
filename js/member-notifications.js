/* Imsfrane account inbox. DEMO uses admin-only test delivery; do not broadcast to members from staging. */
(function(){
"use strict";
const demo=location.pathname.startsWith("/"),base=demo?"/":"/";
const isMember=location.pathname===base+"members.html",locale=(v)=>["fr","en","ar","es"].includes(v)?v:"fr";
const lang=()=>locale(document.documentElement.lang||new URLSearchParams(location.search).get("lang")||"fr");
const translated={
 fr:{notifications:"Mes notifications",empty:"Vous n’avez pas encore de notifications.",read:"Marquer comme lu",readAll:"Tout marquer comme lu",see:"Voir",unread:"non lues",showAll:"Toutes les notifications",error:"Impossible de charger les notifications.",admin:"Envoyer une annonce",adminDesc:"Créez une annonce pour les membres ayant activé les notifications.",preview:"DEMO : envoi de test à votre propre compte uniquement",title:"Titre",body:"Message",category:"Catégorie",link:"Lien vers une page du site (facultatif)",market:"Message promotionnel : uniquement aux personnes qui ont accepté les offres",send:"M’envoyer un test",sending:"Envoi…",success:"Notification de test enregistrée",validation:"Renseignez un titre et un message valides.",sent:"Annonces récentes",audience:"Destinataires",template:"Exemple : début de la saison de rafting",language:"Version",draft:"Versions EN / AR / ES facultatives (si vides, le français sera utilisé).",access:"Connectez-vous pour consulter vos notifications.",categories:{news:"Actualité",rafting:"Rafting",hiking:"Randonnée",camping:"Camping",vtt:"VTT",quad:"Quad",offers:"Offre"}},
 en:{notifications:"My notifications",empty:"No notifications yet.",read:"Mark as read",readAll:"Mark all as read",see:"Open",unread:"unread",showAll:"View all notifications",error:"Unable to load notifications.",admin:"Send announcement",adminDesc:"Prepare a message for members who opted into notifications.",preview:"DEMO: test messages only go to your own account",title:"Title",body:"Message",category:"Category",link:"Link to a site page (optional)",market:"Promotional message: only members who opted into offers",send:"Send a test to myself",sending:"Sending…",success:"Test notification saved",validation:"Enter a valid title and message.",sent:"Recent announcements",audience:"Recipients",template:"Example: rafting season is open",language:"Version",draft:"EN / AR / ES versions are optional (French is used when blank).",access:"Sign in to read your notifications.",categories:{news:"News",rafting:"Rafting",hiking:"Hiking",camping:"Camping",vtt:"MTB",quad:"Quad",offers:"Offer"}},
 ar:{notifications:"إشعاراتي",empty:"ما زالت ما عندك حتى رسالة جديدة.",read:"وضع علامة مقروء",readAll:"تعليم الكل كمقروء",see:"التفاصيل",unread:"غير مقروءة",showAll:"جميع الإشعارات",error:"تعذّر تحميل الإشعارات.",admin:"إرسال إشعار",adminDesc:"اكتب رسالة للأعضاء الذين فعّلوا الإشعارات.",preview:"نسخة تجريبية: الإرسال لحسابك فقط",title:"العنوان",body:"الرسالة",category:"النوع",link:"رابط داخل الموقع (اختياري)",market:"رسالة ترويجية: فقط لمن وافق على العروض",send:"إرسال تجربة لحسابي",sending:"جارٍ الإرسال…",success:"تم حفظ الإشعار التجريبي",validation:"أدخل عنواناً ورسالة صالحين.",sent:"آخر الإشعارات المرسلة",audience:"المستلمون",template:"مثال: انطلاق موسم الرافتينغ",language:"النسخة",draft:"نسخ الإنجليزية والعربية والإسبانية اختيارية (تعتمد الفرنسية إن كانت فارغة).",access:"سجل الدخول لمشاهدة إشعاراتك.",categories:{news:"مستجدات",rafting:"رافتينغ",hiking:"المشي الجبلي",camping:"التخييم",vtt:"الدراجات الجبلية",quad:"كواد",offers:"عرض"}},
 es:{notifications:"Mis notificaciones",empty:"Todavía no tienes notificaciones.",read:"Marcar como leído",readAll:"Marcar todo como leído",see:"Ver",unread:"sin leer",showAll:"Todas las notificaciones",error:"No se pudieron cargar las notificaciones.",admin:"Enviar aviso",adminDesc:"Prepara un mensaje para los socios que aceptaron recibir notificaciones.",preview:"DEMO: los avisos de prueba solo llegan a tu propia cuenta",title:"Título",body:"Mensaje",category:"Categoría",link:"Enlace a una página del sitio (opcional)",market:"Mensaje promocional: solo para personas que aceptaron ofertas",send:"Enviarme una prueba",sending:"Enviando…",success:"Notificación de prueba guardada",validation:"Introduce un título y un mensaje válidos.",sent:"Avisos recientes",audience:"Destinatarios",template:"Ejemplo: empieza la temporada de rafting",language:"Versión",draft:"Las versiones EN / AR / ES son opcionales (se usa francés si están vacías).",access:"Inicia sesión para ver tus notificaciones.",categories:{news:"Novedades",rafting:"Rafting",hiking:"Senderismo",camping:"Camping",vtt:"BTT",quad:"Quad",offers:"Oferta"}}
};
const tr=()=>translated[lang()]||translated.fr;
const colors={news:"📣",rafting:"🌊",hiking:"🥾",camping:"⛺",vtt:"🚵",quad:"🏍️",offers:"🎁"};
let client=null,user=null,notes=[],unread=0,admin=false,refreshing=false,lastCheck=0;
const el=(tag,klass,txt)=>{let v=document.createElement(tag);if(klass)v.className=klass;if(txt!=null)v.textContent=txt;return v};
const pick=(id)=>document.getElementById(id);
let badge=null,bell=null,drawer=null,adminPanel=null,inbox=null,toast=null,adminState=null;
function notice(s){
 if(!toast){toast=el("div","ims-notify-toast");toast.setAttribute("role","status");document.body.append(toast)}
 toast.textContent=s;toast.hidden=false;clearTimeout(notice.timer);notice.timer=setTimeout(()=>{toast.hidden=true},4000)
}
function accountUrl(){return base+"members.html?lang="+lang()+"#notifications"}
function localizedLink(raw){
 if(!raw)return null;
 try{let u=new URL(raw,location.origin);if(u.origin!==location.origin||!/^(?:\/Imsfrane-demo)?\/(?:fr|en|ar|es)\/[a-z0-9/_-]*$/.test(u.pathname))return null;
 let path=u.pathname.replace(/^\/,"");
 return base+lang()+"/"+path.replace(/^\/(?:fr|en|ar|es)\//,"");
 }catch(_e){return null}
}
function iconBell(){let svg=document.createElementNS("http://www.w3.org/2000/svg","svg");svg.setAttribute("viewBox","0 0 24 24");svg.setAttribute("aria-hidden","true");svg.innerHTML='<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>';return svg}
function renderBadge(){if(!bell)return;badge.textContent=unread>99?"99+":String(unread);badge.hidden=unread===0;bell.setAttribute("aria-label",tr().notifications+(unread?" · "+unread+" "+tr().unread:""));bell.title=tr().notifications}
function renderNotes(root,compact){
 root.replaceChildren();
 const h=el("div","ims-notify-head");const title=el("h3","",tr().notifications);
 const mark=el("button","ims-notify-small-action",tr().readAll);mark.type="button";mark.disabled=!notes.some(x=>!x.read_at);mark.addEventListener("click",markAll);
 h.append(title,mark);root.append(h);
 let set=compact?notes.slice(0,4):notes;
 if(!set.length){root.append(el("p","ims-notify-empty",tr().empty))}
 for(const n of set){
  const card=el("article","ims-notify-card"+(n.read_at?"":" is-unread"));
  const icon=el("span","ims-notify-emoji",colors[n.category]||"📣");icon.setAttribute("aria-hidden","true");
  const box=el("div","ims-notify-copy");const meta=el("small","",(tr().categories[n.category]||tr().categories.news)+" · "+new Date(n.created_at).toLocaleDateString(lang()==="ar"?"ar-MA":lang()));
  const title=el("strong","",n.title);
  const body=el("p","",n.body);
  const controls=el("div","ims-notify-actions");
  if(!n.read_at){let bt=el("button","ims-notify-small-action",tr().read);bt.type="button";bt.addEventListener("click",()=>markOne(n.id));controls.append(bt)}
  const href=localizedLink(n.link_path);
  if(href){const link=el("a","ims-notify-view",tr().see+" ↗");link.href=href;controls.append(link)}
  box.append(meta,title,body,controls);card.append(icon,box);root.append(card)
 }
 if(compact){const more=el("a","ims-notify-all",tr().showAll+" →");more.href=accountUrl();root.append(more)}
}
function rerender(){
 renderBadge();
 if(inbox)renderNotes(inbox,false);
 if(drawer&&drawer.dataset.open==="true")renderNotes(drawer,true)
}
async function refresh(){
 if(!client||!user||refreshing)return;
 refreshing=true;
 try{
  const request=await client.from("member_notifications").select("id,title,body,category,link_path,read_at,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(75);
  if(request.error)throw request.error;
  notes=request.data||[];
  const count=await client.from("member_notifications").select("id",{count:"exact",head:true}).eq("user_id",user.id).is("read_at",null);
  unread=count.error?notes.filter(x=>!x.read_at).length:count.count||0;
  lastCheck=Date.now();rerender()
 }catch(e){console.warn("Notification retrieval failed",e);if(inbox&&!notes.length)inbox.replaceChildren(el("p","ims-notify-empty",tr().error))}
 finally{refreshing=false}
}
async function markOne(id){
 if(!user)return;
 const resp=await client.from("member_notifications").update({read_at:new Date().toISOString()}).eq("id",id).eq("user_id",user.id).is("read_at",null);
 if(resp.error){notice(tr().error);return}
 await refresh()
}
async function markAll(){
 if(!user||!unread)return;
 const resp=await client.from("member_notifications").update({read_at:new Date().toISOString()}).eq("user_id",user.id).is("read_at",null);
 if(resp.error){notice(tr().error);return}
 await refresh()
}
function makeBell(){
 const siteAnchor=document.querySelector(".ims-member-entry"),languageAnchor=document.querySelector(".ims-dash-header-lang");
 const spot=isMember?languageAnchor:siteAnchor;
 if(!spot)return false;
 bell=el("button","ims-notify-bell");bell.type="button";bell.id=isMember?"imsMemberNoticeBell":"imsSiteNoticeBell";bell.append(iconBell());
 badge=el("span","ims-notify-badge");bell.append(badge);badge.hidden=true;
 spot.insertAdjacentElement(isMember?"beforebegin":"afterend",bell);
 bell.addEventListener("click",()=>{
  if(!user){if(siteAnchor&&!isMember){siteAnchor.click();return}notice(tr().access);return}
  if(isMember)openInbox();
  else{if(!drawer)createDrawer();let open=drawer.dataset.open!=="true";drawer.dataset.open=String(open);drawer.hidden=!open;if(open){renderNotes(drawer,true);refresh()}}
 });
 return true
}
function createDrawer(){
 drawer=el("aside","ims-notify-popover");drawer.hidden=true;drawer.dataset.open="false";drawer.setAttribute("aria-label",tr().notifications);document.body.append(drawer);
 document.addEventListener("click",(e)=>{if(drawer&&!drawer.hidden&&!drawer.contains(e.target)&&!bell.contains(e.target)){drawer.hidden=true;drawer.dataset.open="false"}});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&drawer){drawer.hidden=true;drawer.dataset.open="false"}});
}
function openInbox(){
 const panel=pick("imsMemberNotifications");
 if(!panel)return;
 const dash=pick("imsDashUi");
 dash.querySelectorAll("[data-dash-pane]").forEach(x=>x.hidden=true);
 const settings=pick("imsSettingsPanel");if(settings)settings.hidden=true;
 document.body.classList.remove("ims-view-account");
 dash.querySelectorAll("[data-dash-tab]").forEach(x=>x.removeAttribute("aria-current"));
 panel.hidden=false;
 history.replaceState(null,"",location.pathname+location.search+"#notifications");
 refresh();window.scrollTo({top:0,behavior:"smooth"})
}
function buildInbox(){
 if(!isMember)return;
 const dash=pick("imsDashUi");if(!dash)return;
 const pane=el("section","ims-notify-account-panel ims-dash-pane");
 pane.id="imsMemberNotifications";pane.dataset.dashPane="notifications";pane.hidden=true;
 inbox=el("div","ims-notify-inbox");pane.append(inbox);dash.append(pane);
 document.addEventListener("ims:member-session",event=>{user=event.detail?.user||null;if(user)refresh();else{notes=[];unread=0;rerender()}});
 document.addEventListener("ims:member-language",()=>rerender());
 document.addEventListener("click",e=>{const tab=e.target.closest("[data-dash-tab]");if(tab&&pane&&!pane.hidden){pane.hidden=true;history.replaceState(null,"",location.pathname+location.search)}});
 if(location.hash==="#notifications")setTimeout(()=>{if(user)openInbox()},700);
}
function addField(parent,label,element){const wrap=el("label","ims-notify-field");wrap.append(el("span","",label),element);parent.append(wrap);return element}
function template(){
 return{
 fr:["La saison de rafting est ouverte !","Les descentes de rafting sur l’Oued Ahansal reprennent selon le niveau de l’eau. Contactez notre équipe pour connaître les dates et les parcours disponibles."],
 en:["Rafting season is open!","Rafting trips on the Ahansal River are resuming, depending on water levels. Contact our team to check dates and available routes."],
 ar:["انطلاق موسم الرافتينغ!","بدأت رحلات الرافتينغ على وادي أحنصال حسب مستوى المياه. تواصلوا معنا لمعرفة المواعيد والمسارات المتاحة."],
 es:["¡Empieza la temporada de rafting!","Los descensos de rafting en el río Ahansal vuelven según el caudal. Contacta con nuestro equipo para consultar fechas y recorridos disponibles."]
 }
}
async function checkAdmin(){
 if(!isMember||!user||adminPanel)return;
 try{
  const r=await client.from("member_admins").select("user_id").eq("user_id",user.id).maybeSingle();
  if(r.error||!r.data)return;
  buildAdmin()
 }catch(e){console.warn("Admin notifications unavailable",e)}
}
function buildAdmin(){
 const target=pick("imsDashUi")?.querySelector('[data-dash-pane="account"]');
 if(!target)return;
 adminPanel=el("section","ims-notify-admin");adminPanel.id="imsNotificationAdmin";
 const heading=el("h3","",tr().admin),hint=el("p","",tr().adminDesc+" "+tr().preview);
 const form=el("form","ims-notify-compose");form.id="imsNotifyCompose";
 const category=el("select");category.name="category";
 for(const c of ["news","rafting","hiking","camping","vtt","quad","offers"]){const opt=el("option","",tr().categories[c]);opt.value=c;category.append(opt)}
 addField(form,tr().category,category);
 const url=el("input");url.name="link";url.type="text";url.placeholder="/fr/rafting/";url.maxLength=220;addField(form,tr().link,url);
 const consent=el("label","ims-notify-check"),marketing=el("input");marketing.type="checkbox";marketing.name="marketing";consent.append(marketing,el("span","",tr().market));form.append(consent);
 const panes=el("div","ims-notify-languages");
 const fields={};
 for(const l of ["fr","en","ar","es"]){
  const group=el("fieldset","ims-notify-language");group.append(el("legend","",l.toUpperCase()));const title=el("input");title.maxLength=120;title.placeholder=tr().title;title.dir=l==="ar"?"rtl":"auto";title.required=l==="fr";
  const body=el("textarea");body.maxLength=1500;body.rows=3;body.placeholder=tr().body;body.dir=l==="ar"?"rtl":"auto";body.required=l==="fr";
  addField(group,tr().title,title);addField(group,tr().body,body);fields[l]={title,body};panes.append(group)
 }
 form.append(panes);
 const sample=el("button","ims-notify-example",tr().template);sample.type="button";sample.addEventListener("click",()=>{
  const t=template();for(const l of ["fr","en","ar","es"]){fields[l].title.value=t[l][0];fields[l].body.value=t[l][1]}
  category.value="rafting";url.value="/fr/rafting/";marketing.checked=false
 });
 const send=el("button","ims-notify-send",tr().send);send.type="submit";
 adminState=el("p","ims-notify-admin-state");adminState.setAttribute("role","status");
 form.append(sample,send,adminState);
 const historyTitle=el("h4","",tr().sent),history=el("div","ims-notify-history");
 adminPanel.append(heading,hint,form,historyTitle,history);
 target.append(adminPanel);
 form.addEventListener("submit",async e=>{
  e.preventDefault();if(!user)return;
  const fr=fields.fr,frTitle=fr.title.value.trim(),frBody=fr.body.value.trim(),translations={};
  for(const l of ["en","ar","es"]){
   const t=fields[l].title.value.trim(),b=fields[l].body.value.trim();
   if(t&&b)translations[l]={title:t,body:b};
   else if(t||b){adminState.textContent=tr().validation;return}
  }
  if(frTitle.length<3||frBody.length<5||frTitle.length>120||frBody.length>1500){adminState.textContent=tr().validation;return}
  if(category.value==="offers"&&!marketing.checked){adminState.textContent=tr().market;return}
  send.disabled=true;send.textContent=tr().sending;adminState.textContent="";
  try{
   const resp=await client.rpc("send_member_announcement",{p_title:frTitle,p_body:frBody,p_category:category.value,p_link_path:url.value.trim()||null,p_marketing:marketing.checked,p_preview_only:true,p_translations:translations});
   if(resp.error)throw resp.error;
   const count=resp.data?.[0]?.delivered??0;
   adminState.textContent=tr().success+" · "+count+" "+tr().audience;
   await refresh();await loadHistory(history)
  }catch(err){console.error(err);adminState.textContent=tr().error+" "+(err.message||"")}
  finally{send.disabled=false;send.textContent=tr().send}
 });
 loadHistory(history)
}
async function loadHistory(target){
 if(!target||!user)return;
 const r=await client.from("member_broadcasts").select("id,title,recipient_count,created_at,preview_only").order("created_at",{ascending:false}).limit(12);
 target.replaceChildren();
 if(r.error)return;
 for(const item of r.data||[]){target.append(el("p","",new Date(item.created_at).toLocaleDateString(lang())+" · "+item.title+" · "+item.recipient_count+" "+tr().audience))}
}
async function initialize(){
 buildInbox();makeBell();
 const css=document.createElement("link");css.rel="stylesheet";css.href=base+"css/member-notifications.css?v=notif-demo-v1";document.head.append(css);
 try{
  const sdk=await import("https://esm.sh/@supabase/supabase-js@2");
  client=sdk.createClient("https://ktrcrfoywokuuwzwnqsu.supabase.co","sb_publishable_GS2PtVM4vBv7epvV6aZSpA_XQyD9bCj");
  const s=await client.auth.getSession();user=s.data.session?.user||null;
  if(user){await refresh();await checkAdmin();if(isMember&&location.hash==="#notifications")openInbox()}
  client.auth.onAuthStateChange((_event,sess)=>{
   const prior=user?.id;user=sess?.user||null;
   setTimeout(()=>{if(user){if(!prior||prior!==user.id){notes=[];unread=0;refresh()}checkAdmin()}else{notes=[];unread=0;rerender();if(adminPanel){adminPanel.remove();adminPanel=null}}},0)
  });
  setInterval(()=>{if(document.visibilityState!=="hidden"&&user&&Date.now()-lastCheck>40000)refresh()},45000);
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&user&&Date.now()-lastCheck>15000)refresh()});
 }catch(err){console.warn("Notifications unavailable",err)}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initialize,{once:true});else initialize();
})();