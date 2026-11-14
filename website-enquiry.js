(function () {
'use strict';
const language = document.documentElement.lang?.slice(0,2) || 'en';
const words = {
 fr:{email:'Envoyer par e-mail',whatsapp:'Envoyer sur WhatsApp',address:'Adresse e-mail',phone:'Téléphone / WhatsApp',hint:'Choisissez l’e-mail ou WhatsApp pour envoyer votre demande. Pour un envoi par e-mail, le téléphone est facultatif.',sending:'Envoi en cours…',sent:'Votre demande a été envoyée par e-mail. Nous vous répondrons à l’adresse indiquée. La réservation reste à confirmer.',failed:'L’envoi par e-mail n’a pas abouti. Vos informations sont conservées : réessayez ou choisissez WhatsApp.',unavailable:'L’envoi direct par e-mail est temporairement indisponible. Vos informations sont conservées. Vous pouvez utiliser WhatsApp ou nous écrire à imsfraneinfo@gmail.com.',limit:'Veuillez patienter avant de réessayer, ou contactez-nous sur WhatsApp.',opening:'Ouverture de WhatsApp…',contact:'Demande depuis le site',optional:'Facultatif pour l’envoi par e-mail',emailHint:'Requise pour l’envoi par e-mail, facultative pour WhatsApp.'},
 en:{email:'Send by email',whatsapp:'Send on WhatsApp',address:'Email address',phone:'Phone / WhatsApp',hint:'Send your enquiry by email or WhatsApp. A phone number is optional when sending by email.',sending:'Sending…',sent:'Your enquiry was sent by email. We will reply to the email address you provided. Your booking still needs confirmation.',failed:'Your email could not be sent. Your details are still here: try again or choose WhatsApp.',unavailable:'Direct email sending is temporarily unavailable. Your details are still here. Use WhatsApp or email us at imsfraneinfo@gmail.com.',limit:'Please wait before trying again, or contact us on WhatsApp.',opening:'Opening WhatsApp…',contact:'Website enquiry',optional:'Optional when sending by email',emailHint:'Required for email, optional for WhatsApp.'},
 es:{email:'Enviar por correo',whatsapp:'Enviar por WhatsApp',address:'Correo electrónico',phone:'Teléfono / WhatsApp',hint:'Envía tu solicitud por correo electrónico o WhatsApp. El teléfono es opcional para el envío por correo.',sending:'Enviando…',sent:'Tu solicitud se ha enviado por correo electrónico. Responderemos a la dirección indicada. La reserva está pendiente de confirmación.',failed:'No se ha podido enviar el correo. Tus datos se conservan: inténtalo de nuevo o elige WhatsApp.',unavailable:'El envío directo por correo no está disponible temporalmente. Tus datos se conservan. Usa WhatsApp o escribe a imsfraneinfo@gmail.com.',limit:'Espera antes de volver a intentarlo o contáctanos por WhatsApp.',opening:'Abriendo WhatsApp…',contact:'Consulta desde la web',optional:'Opcional para el envío por correo',emailHint:'Obligatorio para correo, opcional para WhatsApp.'},
 ar:{email:'إرسال بالبريد الإلكتروني',whatsapp:'إرسال عبر واتساب',address:'البريد الإلكتروني',phone:'الهاتف / واتساب',hint:'اختر إرسال طلبك بالبريد الإلكتروني أو عبر واتساب. رقم الهاتف اختياري عند الإرسال بالبريد الإلكتروني.',sending:'جارٍ الإرسال…',sent:'تم إرسال طلبك بالبريد الإلكتروني. سنرد على العنوان الذي أدخلته. يبقى الحجز رهن التأكيد.',failed:'تعذّر إرسال الرسالة. بقيت معلوماتك محفوظة في الاستمارة، ويمكنك المحاولة مجدداً أو اختيار واتساب.',unavailable:'الإرسال المباشر بالبريد الإلكتروني غير متاح مؤقتاً. بقيت معلوماتك في الاستمارة. يمكنك استخدام واتساب أو مراسلتنا على imsfraneinfo@gmail.com.',limit:'يرجى الانتظار قبل المحاولة مجدداً، أو التواصل معنا عبر واتساب.',opening:'جارٍ فتح واتساب…',contact:'طلب من الموقع',optional:'اختياري عند الإرسال بالبريد الإلكتروني',emailHint:'مطلوب للإرسال بالبريد الإلكتروني، واختياري لواتساب.'}
};
const t = words[language] || words.en;
const endpoint = 'https://ktrcrfoywokuuwzwnqsu.supabase.co/functions/v1/website-enquiry';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0cmNyZm95d29rdXV3enducXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4MDAxNDUsImV4cCI6MjEwNzM3NjE0NX0.PyabGDs6Qi48GtOyZuaJH7pC_Q9qgx7_YoybOG9PfGU';
const pending = new WeakSet();
const requestIds = new WeakMap();
async function send(form, payload, status, button) {
 if (pending.has(form)) return;
 pending.add(form); const oldText=button.textContent;
 const controls=[...form.querySelectorAll('button[type="submit"],#sendEmail')];
 controls.forEach(b=>b.disabled=true); form.setAttribute('aria-busy','true');
 status.textContent=t.sending; status.dataset.state='pending'; button.textContent=t.sending;
 const signature=JSON.stringify(payload); let attempt=requestIds.get(form);
 if(!attempt || attempt.signature!==signature){attempt={signature,id:crypto.randomUUID()};requestIds.set(form,attempt);}
 try {
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','apikey':apiKey,'Authorization':'Bearer '+apiKey},signal:AbortSignal.timeout(25000),body:JSON.stringify({...payload,id:attempt.id,language,website:form.querySelector('[name="website"]')?.value || ''})});
  const result=await response.json();
  if(!response.ok || result.sent!==true){const error=new Error(result.error || 'SEND_FAILED');throw error;}
  status.textContent=t.sent;status.dataset.state='success';
 } catch(error) {
  status.textContent=error.message==='EMAIL_NOT_CONFIGURED'?t.unavailable:error.message==='RATE_LIMITED'?t.limit:t.failed;status.dataset.state='error';
 } finally {pending.delete(form);controls.forEach(b=>b.disabled=false);form.removeAttribute('aria-busy');button.textContent=oldText;}
}
window.ImsEnquiry={send};
function init() {
 const form=document.getElementById('bookingForm') || document.getElementById('contactForm');if(!form)return;
 const booking=form.id==='bookingForm';
 const email=document.getElementById(booking?'email':'contactEmail'),phone=document.getElementById(booking?'phone':'contactPhone');
 const buttons=[...form.querySelectorAll('button[type="submit"],#sendEmail')];
 const channel=(type)=>{email.required=type==='email';phone.required=type!=='email';};
 // Validation follows the chosen channel, including native validation before submit.
 buttons.forEach(button=>button.addEventListener('click',()=>channel(button.dataset.channel==='email'?'email':'whatsapp')));
 channel('email');
 if(booking){
  const label=email.closest('label');if(label) [...label.childNodes].filter(n=>n.nodeType===3).forEach(n=>n.textContent=t.address);
 }
 form.addEventListener('input',()=>{requestIds.delete(form);const status=form.querySelector('[data-enquiry-status]');if(status?.dataset.state==='success'){status.textContent='';delete status.dataset.state;}});
 if(booking)return;
 const status=document.getElementById('contactFormMessage'),date=document.getElementById('contactDate');
 if(date){const now=new Date();date.min=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');}
 const value=id=>(document.getElementById(id)?.value || '').trim();
 const select=document.getElementById('contactSubject');
 const message=()=>[language==='ar'?'مسفران':'IMSFRANE',...['contactName','contactPhone','contactEmail','contactCountry','contactDate','contactPeople'].map(id=>{
  const label=form.querySelector('label[for="'+id+'"]')?.textContent.trim() || id;return label+': '+value(id);
 }),select.options[select.selectedIndex]?.textContent.trim() || '',value('contactMessage')].join('\n');
 form.addEventListener('submit',event=>{
  event.preventDefault();if(!form.reportValidity() || pending.has(form))return;
  const emailChannel=event.submitter?.dataset.channel==='email';
  if(emailChannel)send(form,{kind:'contact',name:value('contactName'),email:value('contactEmail'),subject:select.options[select.selectedIndex]?.textContent.trim() || t.contact,message:message()},status,event.submitter);
  else{status.textContent=t.opening;delete status.dataset.state;window.open('https://wa.me/212667772551?text='+encodeURIComponent(message()),'_blank','noopener,noreferrer');}
 });
 document.querySelectorAll('.contact-faq-item').forEach(item=>{const button=item.querySelector('button'),answer=item.querySelector('.contact-faq-answer');if(!button||!answer)return;button.setAttribute('aria-expanded','false');answer.hidden=true;button.addEventListener('click',()=>{const open=item.classList.toggle('open');button.setAttribute('aria-expanded',String(open));answer.hidden=!open;});});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
