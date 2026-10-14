
/* Safe member-email campaign composer. No API secrets in frontend. Preview first, consent for mass email. */
(function(){
"use strict";
const host=document.getElementById("imsDashUi");if(!host)return;
const texts={
fr:{eyebrow:"ADMINISTRATION · E-MAIL",title:"Envoyer une annonce par e-mail",description:"Annonces de rafting, randonnées et nouvelles d’Imsfrane. Les e-mails partent uniquement aux membres qui ont activé les actualités par e-mail.",unavailable:"L’envoi d’e-mails n’est pas encore connecté. Il faut vérifier le domaine imsfrane.com dans Resend et configurer les secrets dans Supabase. Aucun e-mail n’a été envoyé.",ready:"Service e-mail configuré. Envoyez d’abord un test sur votre propre adresse.",kind:"Type d’annonce",subject:"Sujet (français)",message:"Message (français)",url:"Destination",preview:"M’envoyer un e-mail de test",send:"Envoyer aux abonnés",continue:"Continuer l’envoi",required:"Veuillez renseigner un titre et un message (3–120 / 5–1500 caractères).",partial:"Remplissez les deux champs pour la traduction, ou laissez-les vides.",sent:"Envoi traité",notReady:"Le service e-mail doit d’abord être configuré.",confirm:"Confirmer l’envoi à tous les membres ayant autorisé les e-mails ? Aucun destinataire non abonné ne sera contacté.",summary:"Messages acceptés par le fournisseur",failed:"échecs",left:"encore à traiter",none:"Aucun e-mail envoyé. Vérifiez le consentement des membres.",more:"Plus de destinataires à traiter : continuer l’envoi.",server:"Échec de l’envoi. Veuillez réessayer après vérification du service.",translation:"Traductions optionnelles EN · ES · AR",translationHint:"Si une traduction manque, le texte français sera utilisé.",note:"Le test ne part que sur votre adresse d’administrateur. Les messages commerciaux nécessitent aussi le consentement aux offres.",subjectPh:"Ex. Informations sur la prochaine saison de rafting",bodyPh:"Indiquez les dates, les conditions et les informations utiles, sans annoncer l’ouverture avant confirmation."},
en:{eyebrow:"ADMIN · EMAIL",title:"Send members an email",description:"Share rafting, hiking and Imsfrane updates. Emails are only sent to members who chose to receive email updates.",unavailable:"Email delivery has not been configured yet. Verify imsfrane.com in Resend and configure Supabase secrets. No email was sent.",ready:"Email delivery is configured. Send yourself a test before emailing subscribers.",kind:"Announcement type",subject:"Subject (French)",message:"Message (French)",url:"Destination",preview:"Send test email to myself",send:"Email subscribers",continue:"Continue sending",required:"Provide a subject and message (3–120 / 5–1500 characters).",partial:"Fill both translation fields or leave both empty.",sent:"Sending processed",notReady:"The email service must be configured first.",confirm:"Send this message to all members who explicitly opted in to emails? No other members will be contacted.",summary:"Accepted by email provider",failed:"failures",left:"still pending",none:"No emails sent. Check members' email consent.",more:"More emails to process: continue sending.",server:"Sending failed. Please check the email service.",translation:"Optional EN · ES · AR translations",translationHint:"Missing translations fall back to French.",note:"Test sends only to your administrator email. Offers also require promotional opt-in.",subjectPh:"E.g. Updates on the upcoming rafting season",bodyPh:"Share confirmed dates, conditions and practical information."},
ar:{eyebrow:"الإدارة · البريد الإلكتروني",title:"إرسال إعلان للأعضاء عبر البريد",description:"أرسل أخبار الرافتينغ والأنشطة إلى الأعضاء الذين وافقوا على تلقي الإشعارات عبر البريد الإلكتروني.",unavailable:"إرسال البريد غير مفعّل بعد. يجب توثيق imsfrane.com في Resend وإعداد مفاتيح Supabase. لم تُرسل أي رسالة.",ready:"خدمة البريد مضبوطة. جرّب الإرسال إلى بريدك أولاً.",kind:"نوع الإعلان",subject:"العنوان (بالفرنسية)",message:"النص (بالفرنسية)",url:"رابط الوجهة",preview:"إرسال تجربة إلى بريدي",send:"إرسال للمشتركين",continue:"متابعة الإرسال",required:"أدخل عنواناً ونصاً صالحين.",partial:"اكتب العنوان والنص للترجمة معاً أو اتركهما فارغين.",sent:"نتيجة الإرسال",notReady:"يجب إعداد خدمة البريد أولاً.",confirm:"هل تريد إرسال الرسالة إلى كل الأعضاء الذين وافقوا على البريد الإلكتروني فقط؟",summary:"رسائل قبلها مزوّد البريد",failed:"إخفاقات",left:"متبقية",none:"لم تُرسل أي رسالة. تحقق من موافقة الأعضاء.",more:"هناك رسائل متبقية: تابع الإرسال.",server:"تعذر الإرسال. تحقق من إعدادات البريد.",translation:"ترجمات اختيارية EN · ES · AR",translationHint:"إذا غابت الترجمة يُستعمل النص الفرنسي.",note:"التجربة تُرسل لبريد المدير وحده. العروض التجارية تتطلب موافقة إضافية.",subjectPh:"مثلاً: معلومات حول موسم الرافتينغ القادم",bodyPh:"اكتب المواعيد المؤكدة والشروط والمعلومات."},
es:{eyebrow:"ADMINISTRACIÓN · EMAIL",title:"Enviar novedades por correo",description:"Comparte novedades de rafting, senderismo e Imsfrane solo con miembros que aceptaron recibir correos.",unavailable:"El servicio de correo aún no está conectado. Verifica imsfrane.com en Resend y configura los secretos de Supabase. No se envió ningún correo.",ready:"Servicio de correo configurado. Prueba primero el envío a tu correo.",kind:"Categoría",subject:"Asunto (francés)",message:"Mensaje (francés)",url:"Destino",preview:"Enviarme un correo de prueba",send:"Enviar a suscriptores",continue:"Continuar envío",required:"Introduce asunto y mensaje válidos.",partial:"Completa ambos campos de una traducción o déjalos vacíos.",sent:"Resultado del envío",notReady:"Configura el servicio de correo primero.",confirm:"¿Enviar a todos los miembros que aceptaron recibir correos? No se contactará a otros miembros.",summary:"Aceptados por proveedor",failed:"errores",left:"pendientes",none:"Ningún correo enviado. Comprueba el consentimiento.",more:"Quedan correos por enviar.",server:"No se pudo enviar. Revisa el servicio.",translation:"Traducciones opcionales EN · ES · AR",translationHint:"Si falta una traducción, se usa el francés.",note:"La prueba se envía solo al correo del administrador. Las ofertas requieren consentimiento adicional.",subjectPh:"Ej. Información sobre la próxima temporada de rafting",bodyPh:"Indica fechas confirmadas, condiciones y detalles prácticos."}
};
const labels={news:"News / Actualités",rafting:"Rafting",hiking:"Randonnée / Hiking",camping:"Camping",vtt:"VTT",quad:"Quad",offers:"Offres / Offers"};
const slugs={news:"",rafting:"rafting/",hiking:"randonnee/",camping:"camping/",vtt:"vtt/",quad:"quad/",offers:"booking/"};
const format=()=>{const l=document.documentElement.lang;return texts[l]||texts.fr};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let db=null,currentUser=null,admin=false,configured=false,pendingId=0,busy=false,widget=null;
async function client(){if(!db){const sdk=await import("https://esm.sh/@supabase/supabase-js@2");db=sdk.createClient("https://ktrcrfoywokuuwzwnqsu.supabase.co","sb_publishable_GS2PtVM4vBv7epvV6aZSpA_XQyD9bCj")}return db}
function status(text,isGood,isBad){const area=widget?.querySelector("#imsEmailStatus");if(!area)return;area.className="ims-email-alert"+(isGood?" ok":isBad?" bad":"");area.textContent=text}
function render(){
 if(!admin)return;
 const t=format();
 let pane=host.querySelector('[data-dash-pane="account"]');if(!pane)return;
 widget?.remove();widget=document.createElement("section");widget.className="ims-email-admin";widget.id="imsEmailAdmin";
 let category=Object.entries(labels).map(pair=>'<option value="'+pair[0]+'">'+escape(pair[1])+'</option>').join("");
 let translations=["en","es","ar"].map(lang=>'<div class="ims-email-two"><div><label for="imsEmailTitle-'+lang+'">'+lang.toUpperCase()+' · Title</label><input maxlength="120" id="imsEmailTitle-'+lang+'"></div><div><label for="imsEmailBody-'+lang+'">'+lang.toUpperCase()+' · Message</label><textarea maxlength="1500" id="imsEmailBody-'+lang+'" rows="3"></textarea></div></div>').join("");
 widget.innerHTML='<span class="ims-email-kicker">'+escape(t.eyebrow)+'</span><h3>'+escape(t.title)+'</h3><p>'+escape(t.description)+'</p>'
 +'<div id="imsEmailStatus" class="ims-email-alert" role="status" aria-live="polite"></div>'
 +'<form id="imsEmailForm"><div class="ims-email-two"><div><label for="imsEmailCategory">'+escape(t.kind)+'</label><select id="imsEmailCategory">'+category+'</select></div><div><label for="imsEmailDest">'+escape(t.url)+'</label><input id="imsEmailDest" readonly value="/fr/"></div></div>'
 +'<label for="imsEmailTitle">'+escape(t.subject)+'</label><input id="imsEmailTitle" required minlength="3" maxlength="120" placeholder="'+escape(t.subjectPh)+'">'
 +'<label for="imsEmailBody">'+escape(t.message)+'</label><textarea id="imsEmailBody" required minlength="5" maxlength="1500" rows="5" placeholder="'+escape(t.bodyPh)+'"></textarea>'
 +'<details><summary>'+escape(t.translation)+'</summary><p>'+escape(t.translationHint)+'</p>'+translations+'</details>'
 +'<p>'+escape(t.note)+'</p><div class="ims-email-buttons"><button id="imsEmailTest" type="button" class="ims-email-test">'+escape(t.preview)+'</button><button id="imsEmailSend" type="button" class="ims-email-send">'+escape(t.send)+'</button><button id="imsEmailContinue" type="button" class="ims-email-more" hidden>'+escape(t.continue)+'</button></div></form>';
 pane.append(widget);
 const cat=widget.querySelector("#imsEmailCategory"),dest=widget.querySelector("#imsEmailDest");
 cat.addEventListener("change",()=>{dest.value="/fr/"+slugs[cat.value]});
 widget.querySelector("#imsEmailTest").onclick=()=>submit(true);
 widget.querySelector("#imsEmailSend").onclick=()=>submit(false);
 widget.querySelector("#imsEmailContinue").onclick=()=>dispatch(pendingId);
 status(configured?t.ready:t.unavailable,configured,!configured);
 widget.querySelector("#imsEmailTest").disabled=!configured;widget.querySelector("#imsEmailSend").disabled=!configured;
}
async function check(){
 try{const api=await client();const r=await api.functions.invoke("member-email-dispatch",{body:{action:"status"}});configured=!r.error&&r.data?.configured===true}catch{configured=false}
 if(admin)render();
}
async function verify(){
 const api=await client(),session=await api.auth.getSession();currentUser=session.data.session?.user||null;admin=false;
 if(!currentUser){widget?.remove();widget=null;return}
 const q=await api.from("member_admins").select("user_id").eq("user_id",currentUser.id).maybeSingle();
 admin=!q.error&&!!q.data;
 if(!admin){widget?.remove();widget=null;return}
 await check();
}
function values(){
 const $=id=>widget.querySelector("#"+id),t=format(),category=$("imsEmailCategory").value;
 const title=$("imsEmailTitle").value.trim(),body=$("imsEmailBody").value.trim();
 if(title.length<3||title.length>120||body.length<5||body.length>1500){status(t.required,false,true);return null}
 let translations={};
 for(const l of ["en","es","ar"]){
  const translatedTitle=$("imsEmailTitle-"+l).value.trim(),translatedBody=$("imsEmailBody-"+l).value.trim();
  if((translatedTitle&&!translatedBody)||(!translatedTitle&&translatedBody)||translatedTitle.length>120||translatedBody.length>1500){status(t.partial,false,true);return null}
  if(translatedTitle&&translatedBody)translations[l]={title:translatedTitle,body:translatedBody};
 }
 return{p_title:title,p_body:body,p_category:category,p_link_path:$("imsEmailDest").value,p_marketing:category==="offers",p_translations:translations};
}
async function dispatch(id){
 if(!id||busy)return;
 busy=true;const t=format(),more=widget.querySelector("#imsEmailContinue"),test=widget.querySelector("#imsEmailTest"),send=widget.querySelector("#imsEmailSend");
 [test,send,more].forEach(x=>x.disabled=true);
 let accepted=0,failed=0,remaining=0,skipped=0;
 try{
  const api=await client();
  let rounds=0;
  do{
   const r=await api.functions.invoke("member-email-dispatch",{body:{broadcast_id:id}});
   if(r.error||!r.data||r.data.error)throw Error(r.data?.error||"Delivery failed");
   accepted+=Number(r.data.sent||0);failed+=Number(r.data.failed||0);skipped+=Number(r.data.skipped||0);remaining=Number(r.data.remaining||0);
   rounds++;
  }while(remaining>0&&rounds<5&&accepted+failed<100);
  status(t.sent+": "+t.summary+" "+accepted+" · "+t.failed+" "+failed+" · "+t.left+" "+remaining+" · Ignorés: "+skipped,true,false);
  more.hidden=remaining===0;pendingId=remaining>0?id:0;
 }catch(e){status(t.server+" ("+String(e?.message||"Error").slice(0,80)+")",false,true);more.hidden=!pendingId}
 finally{busy=false;[test,send].forEach(x=>x.disabled=!configured);more.disabled=!configured||!pendingId}
}
async function submit(preview){
 if(busy)return;
 const t=format();
 if(!configured){status(t.notReady,false,true);return}
 const v=values();if(!v)return;
 if(!preview&&!confirm(t.confirm))return;
 busy=true;const buttons=widget.querySelectorAll("button");buttons.forEach(x=>x.disabled=true);
 try{
  const api=await client(),result=await api.rpc("send_member_announcement",{...v,p_preview_only:preview});
  if(result.error)throw result.error;
  const row=Array.isArray(result.data)?result.data[0]:result.data;
  if(!row?.broadcast_id)throw Error("No broadcast ID returned");
  pendingId=Number(row.broadcast_id);
 }catch(e){status(t.server+" ("+String(e?.message||"").slice(0,110)+")",false,true);pendingId=0}
 finally{busy=false;buttons.forEach(x=>x.disabled=false)}
 if(pendingId)await dispatch(pendingId);
}
async function init(){
 await verify();
 if(!db)return;
 db.auth.onAuthStateChange(()=>{setTimeout(()=>verify().catch(console.warn),30)});
 document.addEventListener("ims:member-language",()=>{if(admin)render()});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>init().catch(console.warn),{once:true});else init().catch(console.warn);
})();
