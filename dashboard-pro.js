/* Imsfrane member dashboard, Demo only: real member data, no fictional points or bookings. */
(function(){
"use strict";
const dash=document.getElementById("imsDashUi"),mobile=document.getElementById("imsDashMobileNav"),settings=document.getElementById("imsSettingsPanel");
if(!dash||!mobile||!settings)return;
const langs=["fr","en","ar","es"],base="/";
const translations={
 fr:{hello:"BONJOUR,",yourSpace:"VOTRE ESPACE IMSFRANE",welcome:"Votre prochaine aventure commence ici.",official:"↗ Retour au site officiel",dashboard:"Tableau de bord",home:"Accueil",bookings:"Mes commandes",favorites:"Favoris",activities:"Activités",account:"Compte",navigation:"VOTRE NAVIGATION",return:"Reprendre ma visite",returnDesc:"Retrouvez la dernière page que vous avez consultée.",gettingStarted:"VOS PREMIÈRES ÉTAPES",start:"Bien démarrer avec Imsfrane",done:"TERMINÉ",todo:"À COMPLÉTER",stepCreated:"Compte créé",stepCreatedDesc:"Votre compte Imsfrane est prêt.",stepVerified:"Adresse e-mail vérifiée",stepVerifiedDesc:"La vérification dépend de votre méthode de connexion.",stepProfile:"Complétez votre profil",stepProfileDesc:"Ajoutez votre nom public.",completeProfile:"Compléter mon profil →",stepExplore:"Découvrez nos aventures",stepExploreDesc:"Explorez les activités proposées à Imsfrane.",discover:"Découvrir les activités →",savedItems:"favoris sur cet appareil",completion:"profil complété",nextAdventure:"VOTRE PROCHAINE AVENTURE",nextTitle:"Prêt à explorer l’Atlas ?",noBooking:"Vos réservations ne sont pas encore reliées à votre compte.",noBookingDesc:"Découvrez les expériences, puis contactez-nous pour organiser votre aventure.",seeAdventures:"Découvrir les aventures",bookingSection:"MES COMMANDES",bookingTitle:"Suivi de mes expériences",bookingUnavailable:"Aucune réservation synchronisée",bookingExplain:"Les réservations se font actuellement avec notre équipe. Elles n’apparaissent pas encore automatiquement ici.",contactBook:"Réserver une activité",favoriteSection:"MES FAVORIS",favoritesTitle:"Les expériences qui m’inspirent",favoritesHint:"Retrouvez vos activités préférées avec les mêmes photos et informations que sur notre site.",addFavorites:"Parcourir les activités",activitySection:"IMSFRANE · ATLAS",activitiesTitle:"Choisir ma prochaine activité",activityHint:"Enregistrez vos activités préférées ou consultez leur page.",profileSection:"MES INFORMATIONS",profileTitle:"Mon profil et mes préférences",profileHint:"Modifiez vos informations et les préférences de votre compte ci-dessous.",view:"Voir",save:"Ajouter aux favoris",remove:"Retirer des favoris",emptyFavorites:"Vous n’avez pas encore ajouté d’activités favorites.",securityNote:"Cette fonctionnalité est en préparation."},
 en:{hello:"HELLO,",yourSpace:"YOUR IMSFRANE SPACE",welcome:"Your next adventure starts here.",official:"↗ Back to the official website",dashboard:"My dashboard",home:"Home",bookings:"My orders",favorites:"Favorites",activities:"Activities",account:"Account",navigation:"YOUR LAST VISIT",return:"Continue exploring",returnDesc:"Go back to the last page you visited.",gettingStarted:"YOUR FIRST STEPS",start:"Getting started with Imsfrane",done:"COMPLETE",todo:"TO DO",stepCreated:"Account created",stepCreatedDesc:"Your Imsfrane account is ready.",stepVerified:"Email verified",stepVerifiedDesc:"Verification depends on your sign-in method.",stepProfile:"Complete your profile",stepProfileDesc:"Add your public name.",completeProfile:"Complete my profile →",stepExplore:"Explore the adventures",stepExploreDesc:"See the experiences available in Imsfrane.",discover:"Discover activities →",savedItems:"favorites on this device",completion:"profile complete",nextAdventure:"YOUR NEXT ADVENTURE",nextTitle:"Ready to explore the Atlas?",noBooking:"Bookings are not yet linked to your account.",noBookingDesc:"Browse experiences and contact our team to plan your visit.",seeAdventures:"Browse adventures",bookingSection:"MY ORDERS",bookingTitle:"My experiences",bookingUnavailable:"No synced bookings",bookingExplain:"Bookings are currently arranged directly with our team and do not automatically appear here yet.",contactBook:"Book an activity",favoriteSection:"MY FAVORITES",favoritesTitle:"Experiences I love",favoritesHint:"Your saved activities appear here with the same photos and details as on our website.",addFavorites:"Explore activities",activitySection:"IMSFRANE · ATLAS",activitiesTitle:"Choose my next activity",activityHint:"Save activities to favorites or open their pages.",profileSection:"MY DETAILS",profileTitle:"My profile and preferences",profileHint:"Edit your information and account preferences below.",view:"View",save:"Add to favorites",remove:"Remove favorite",emptyFavorites:"You have not saved any favorites yet.",securityNote:"This feature is under development."},
 ar:{hello:"مرحباً،",yourSpace:"فضاؤك في مسفران",welcome:"مغامرتك القادمة تبدأ من هنا.",official:"↗ العودة إلى الموقع الرسمي",dashboard:"لوحة التحكم",home:"الرئيسية",bookings:"طلباتي",favorites:"المفضلة",activities:"الأنشطة",account:"حسابي",navigation:"متابعة التصفح",return:"العودة إلى آخر صفحة",returnDesc:"تابع تصفح الصفحة الأخيرة التي زرتها.",gettingStarted:"خطواتك الأولى",start:"ابدأ رحلتك مع مسفران",done:"مكتمل",todo:"غير مكتمل",stepCreated:"إنشاء الحساب",stepCreatedDesc:"حسابك في مسفران جاهز.",stepVerified:"تأكيد البريد الإلكتروني",stepVerifiedDesc:"يعتمد التأكيد على طريقة تسجيل الدخول.",stepProfile:"إكمال الملف الشخصي",stepProfileDesc:"أضف اسمك الذي سيظهر للآخرين.",completeProfile:"إكمال ملفي الشخصي ←",stepExplore:"اكتشاف المغامرات",stepExploreDesc:"تصفح الأنشطة المتاحة في مسفران.",discover:"اكتشف الأنشطة ←",savedItems:"أنشطة مفضلة على هذا الجهاز",completion:"اكتمال الملف الشخصي",nextAdventure:"مغامرتك القادمة",nextTitle:"هل أنت مستعد لاكتشاف الأطلس؟",noBooking:"الحجوزات غير مرتبطة بحسابك حتى الآن.",noBookingDesc:"اكتشف تجاربنا وتواصل معنا لترتيب مغامرتك.",seeAdventures:"استكشاف المغامرات",bookingSection:"طلباتي",bookingTitle:"متابعة تجاربي",bookingUnavailable:"لا توجد حجوزات متزامنة",bookingExplain:"يتم تنسيق الحجوزات حالياً مباشرة مع فريقنا، ولا تظهر تلقائياً في حسابك بعد.",contactBook:"حجز نشاط",favoriteSection:"قائمة المفضلة",favoritesTitle:"التجارب التي تهمني",favoritesHint:"تظهر أنشطتك المفضلة هنا بنفس الصور والتفاصيل الموجودة في الموقع.",addFavorites:"تصفح الأنشطة",activitySection:"مسفران · الأطلس",activitiesTitle:"اختر نشاطك القادم",activityHint:"احفظ أنشطتك المفضلة أو افتح صفحاتها لمعرفة التفاصيل.",profileSection:"معلوماتي الشخصية",profileTitle:"ملفي الشخصي وتفضيلاتي",profileHint:"يمكنك تعديل معلوماتك وتفضيلات الحساب أدناه.",view:"عرض",save:"إضافة إلى المفضلة",remove:"إزالة من المفضلة",emptyFavorites:"لم تُضف أي نشاط إلى المفضلة بعد.",securityNote:"هذه الخاصية قيد التطوير."},
 es:{hello:"¡HOLA!",yourSpace:"TU ESPACIO IMSFRANE",welcome:"Tu próxima aventura empieza aquí.",official:"↗ Volver al sitio oficial",dashboard:"Panel personal",home:"Inicio",bookings:"Mis pedidos",favorites:"Favoritos",activities:"Actividades",account:"Mi cuenta",navigation:"TU NAVEGACIÓN",return:"Continuar mi visita",returnDesc:"Vuelve a la última página que visitaste.",gettingStarted:"TUS PRIMEROS PASOS",start:"Empieza con Imsfrane",done:"COMPLETADO",todo:"PENDIENTE",stepCreated:"Cuenta creada",stepCreatedDesc:"Tu cuenta Imsfrane ya está lista.",stepVerified:"Correo verificado",stepVerifiedDesc:"La verificación depende del método de acceso.",stepProfile:"Completa tu perfil",stepProfileDesc:"Añade tu nombre público.",completeProfile:"Completar mi perfil →",stepExplore:"Descubre aventuras",stepExploreDesc:"Explora las actividades disponibles en Imsfrane.",discover:"Descubrir actividades →",savedItems:"favoritos en este dispositivo",completion:"perfil completado",nextAdventure:"TU PRÓXIMA AVENTURA",nextTitle:"¿Listo para explorar el Atlas?",noBooking:"Las reservas aún no están vinculadas a tu cuenta.",noBookingDesc:"Explora las experiencias y contacta con nuestro equipo para organizar tu viaje.",seeAdventures:"Descubrir aventuras",bookingSection:"MIS PEDIDOS",bookingTitle:"Mis experiencias",bookingUnavailable:"Sin reservas sincronizadas",bookingExplain:"Las reservas se organizan directamente con nuestro equipo y todavía no aparecen aquí automáticamente.",contactBook:"Reservar una actividad",favoriteSection:"MIS FAVORITOS",favoritesTitle:"Experiencias que me inspiran",favoritesHint:"Aquí encontrarás tus actividades favoritas con las mismas fotos y detalles que en nuestro sitio.",addFavorites:"Explorar actividades",activitySection:"IMSFRANE · ATLAS",activitiesTitle:"Elegir mi próxima actividad",activityHint:"Guarda experiencias favoritas o consulta sus páginas.",profileSection:"MIS DATOS",profileTitle:"Mi perfil y preferencias",profileHint:"Edita tus datos y las preferencias de tu cuenta.",view:"Ver",save:"Guardar favorito",remove:"Eliminar favorito",emptyFavorites:"Todavía no tienes actividades favoritas.",securityNote:"Esta función está en desarrollo."}
};
const activities=[
 {
  "id": "rafting",
  "photo": "images/raft2-800.webp",
  "names": {
   "fr": "Rafting",
   "en": "Rafting",
   "ar": "التجديف في المياه البيضاء",
   "es": "Rafting"
  }
 },
 {
  "id": "kayak",
  "photo": "images/kayak/kayak-group.webp",
  "names": {
   "fr": "Kayak",
   "en": "Kayak",
   "ar": "التجديف بالكاياك",
   "es": "Kayak"
  }
 },
 {
  "id": "randonnee",
  "photo": "images/19-800.webp",
  "names": {
   "fr": "Randonnée",
   "en": "Hiking",
   "ar": "المشي الجبلي",
   "es": "Senderismo"
  }
 },
 {
  "id": "camping",
  "photo": "images/camping-1-800.webp",
  "names": {
   "fr": "Camping",
   "en": "Camping",
   "ar": "التخييم",
   "es": "Acampada"
  }
 },
 {
  "id": "vtt",
  "photo": "images/vtt-800.webp",
  "names": {
   "fr": "VTT",
   "en": "Mountain biking",
   "ar": "الدراجات الجبلية",
   "es": "BTT"
  }
 },
 {
  "id": "quad",
  "photo": "images/quad-800.webp",
  "names": {
   "fr": "Quad",
   "en": "Quad biking",
   "ar": "الكواد",
   "es": "Quad"
  }
 },
 {
  "id": "hebergement",
  "photo": "images/bab2-800.webp",
  "names": {
   "fr": "Hébergement",
   "en": "Accommodation",
   "ar": "الإقامة",
   "es": "Alojamiento"
  }
 },
 {
  "id": "tubing",
  "photo": "images/tubing-800.webp",
  "names": {
   "fr": "Tubing",
   "en": "River tubing",
   "ar": "التزلج بالعوامة في النهر",
   "es": "Descenso en flotador"
  }
 },
 {
  "id": "jetski",
  "photo": "images/jetski-lake.webp",
  "names": {
   "fr": "Jet Ski",
   "en": "Jet Ski",
   "ar": "الدراجات المائية",
   "es": "Moto de agua"
  }
 },
 {
  "id": "4x4",
  "photo": "images/4x4-800.webp",
  "names": {
   "fr": "Excursion 4×4",
   "en": "4×4 Excursion",
   "ar": "جولة بسيارة رباعية الدفع",
   "es": "Excursión en 4×4"
  }
 },
 {
  "id": "passage",
  "photo": "images/passage-800.webp",
  "names": {
   "fr": "Passage Amazigh",
   "en": "Amazigh Passage",
   "ar": "الممر الأمازيغي في تاغية",
   "es": "Pasaje Amazige de Taghia"
  }
 },
 {
  "id": "zrkan",
  "photo": "images/zrkan-800.webp",
  "names": {
   "fr": "Cascades Zrkan",
   "en": "Zrkan Waterfalls",
   "ar": "شلالات زركان",
   "es": "Cascadas de Zrkan"
  }
 },
 {
  "id": "anergui",
  "photo": "images/anergui-800.webp",
  "names": {
   "fr": "Visite d’Anergui",
   "en": "Explore Anergui",
   "ar": "زيارة أنرگي",
   "es": "Visita a Anergui"
  }
 },
 {
  "id": "almou",
  "photo": "images/almo-800.webp",
  "names": {
   "fr": "Almou Ntalmast",
   "en": "Almou Ntalmast",
   "ar": "ألمو نتالماست",
   "es": "Almou Ntalmast"
  }
 },
 {
  "id": "ahidous",
  "photo": "images/ahidous-800.webp",
  "names": {
   "fr": "Soirée Ahidous",
   "en": "Ahidous Evening",
   "ar": "أمسية أحيدوس",
   "es": "Velada de Ahidous"
  }
 }
];
let currentUser=null,storedName="",tab="home";
const getLang=()=>langs.includes(document.documentElement.lang)?document.documentElement.lang:"fr";
const tr=()=>translations[getLang()];
const el=id=>document.getElementById(id);
const path=slug=>base+getLang()+"/"+slug+".html";
const safe=(fn,fallback)=>{try{return fn()}catch(_e){return fallback}};

let favoriteIds=[],storedPhone="",storedAvatar="",apiPromise=null;
const seenKey=()=>"imsfrane-demo-explored:"+String(currentUser?.id||"guest");
const savedFavorites=()=>favoriteIds.filter(id=>activities.some(a=>a.id===id));
function getDB(){if(!apiPromise)apiPromise=import("https://esm.sh/@supabase/supabase-js@2").then(sdk=>sdk.createClient("https://ktrcrfoywokuuwzwnqsu.supabase.co","sb_publishable_GS2PtVM4vBv7epvV6aZSpA_XQyD9bCj"));return apiPromise}
async function syncFavorites(){
 if(!currentUser){favoriteIds=[];renderActivities();renderFavorites();return}
 const userId=currentUser.id;try{const db=await getDB(),r=await db.from("member_favorites").select("item_slug").eq("user_id",userId);if(r.error)throw r.error;if(currentUser?.id!==userId)return;favoriteIds=(r.data||[]).map(x=>x.item_slug);renderActivities();renderFavorites()}catch(e){console.warn("Favorites could not load",e)}
}
async function rememberFavorites(id){
 if(!currentUser)return;
 const db=await getDB(),add=!favoriteIds.includes(id);
 const r=add?await db.from("member_favorites").insert({user_id:currentUser.id,item_slug:id}):await db.from("member_favorites").delete().eq("user_id",currentUser.id).eq("item_slug",id);
 if(r.error)throw r.error;await syncFavorites()
}
const orderLabels={
 fr:{requested:"Demande enregistrée · en attente de confirmation",confirmed:"Confirmée",cancelled:"Annulée",completed:"Terminée",title:"Mes commandes",pending:"Ce récapitulatif ne confirme pas l’envoi du message WhatsApp.",total:"Estimation",persons:"personnes"},
 en:{requested:"Request saved · awaiting confirmation",confirmed:"Confirmed",cancelled:"Cancelled",completed:"Completed",title:"My orders",pending:"This record does not confirm WhatsApp delivery.",total:"Estimate",persons:"people"},
 ar:{requested:"تم حفظ الطلب · في انتظار التأكيد",confirmed:"مؤكد",cancelled:"ملغى",completed:"مكتمل",title:"طلباتي",pending:"حفظ الطلب لا يعني أن رسالة واتساب أُرسلت بنجاح.",total:"التقدير",persons:"أشخاص"},
 es:{requested:"Solicitud guardada · pendiente de confirmación",confirmed:"Confirmada",cancelled:"Cancelada",completed:"Completada",title:"Mis pedidos",pending:"Guardar la solicitud no confirma el envío de WhatsApp.",total:"Estimación",persons:"personas"}
};
async function loadOrders(){
 const container=el("imsDashOrders");if(!container||!currentUser)return;
 container.replaceChildren();const currentId=currentUser.id;
 try{
 const db=await getDB(),r=await db.from("member_orders").select("id,status,created_at,start_date,travelers,items,extras,estimated_total_mad").eq("user_id",currentId).order("created_at",{ascending:false}).limit(60);
 if(r.error)throw r.error;if(currentUser?.id!==currentId)return;
 const orders=r.data||[],t=orderLabels[getLang()];
 const empty=dash.querySelector('[data-dash-pane="bookings"] .ims-dash-empty');
 if(empty)empty.hidden=orders.length>0;
 const homeEmpty=dash.querySelector('.ims-dash-next .ims-dash-empty');
 if(homeEmpty)homeEmpty.hidden=orders.length>0;
 const homeTotal=el("imsDashOrderCount");
 if(homeTotal)homeTotal.textContent=orders.length;
 for(const order of orders){
  const card=document.createElement("article");card.className="ims-order-card";
  const title=document.createElement("h4");title.textContent="#"+order.id+" · "+new Date(order.created_at).toLocaleDateString(getLang()==="ar"?"ar-MA":getLang());
  const status=document.createElement("span");status.className="ims-order-status ims-order-"+order.status;status.textContent=t[order.status]||t.requested;
  const dates=document.createElement("p");dates.textContent=order.start_date+" · "+order.travelers+" "+t.persons;
  const names=document.createElement("p");
  const offers=Array.isArray(order.items)?order.items:[];
  names.textContent=offers.map(x=>x.label||x.id||"").filter(Boolean).slice(0,12).join(" · ")||"—";
  const money=document.createElement("small");money.textContent=t.total+": "+Number(order.estimated_total_mad||0).toLocaleString()+" MAD";
  const note=document.createElement("small");note.className="ims-order-note";note.textContent=t.pending;
  card.append(title,status,dates,names,money,note);container.append(card)
 }
 const summary=el("imsOrderSummary");if(summary)summary.textContent=orders.length?String(orders.length)+" · "+t.title:"";
 }catch(e){console.warn("Orders could not load",e);const n=document.createElement("p");n.textContent=getLang()==="ar"?"تعذر تحميل الطلبات. حاول مجدداً.":"Unable to load orders. Please try again.";container.append(n)}
}
function avatar(user){
 const target=el("imsDashAvatar");if(!target)return;target.replaceChildren();const photo=storedAvatar||user?.user_metadata?.avatar_url||user?.user_metadata?.picture;let valid=false;
 if(typeof photo==="string")try{const u=new URL(photo);valid=u.protocol==="https:"&&u.hostname!=="localhost"}catch(e){}
 if(valid){const img=document.createElement("img");img.src=photo;img.alt="";img.referrerPolicy="no-referrer";img.onerror=()=>{img.remove();target.textContent=(user?.email||"I")[0].toUpperCase()};target.append(img)}
 else target.textContent=(storedName||user?.user_metadata?.name||user?.email||"I")[0].toUpperCase();
}
function renderProgress(){
 const named=storedName.trim().length>0&&storedPhone.replace(/\D/g,"").length>=7,verified=!!currentUser?.email_confirmed_at,seen=safe(()=>localStorage.getItem(seenKey())==="yes",false);
 const completed={created:!!currentUser,verified:verified,named:named,explored:seen};
 let done=Object.values(completed).filter(Boolean).length;
 for(const [step,flag] of Object.entries(completed)){const card=dash.querySelector('[data-step="'+step+'"]');if(!card)continue;card.classList.toggle("is-done",flag);const status=card.querySelector("small");if(status)status.textContent=flag?tr().done:tr().todo;const dot=card.querySelector(".ims-step-dot");if(dot)dot.textContent=flag?"✓":String(["created","verified","named","explored"].indexOf(step)+1)}
 el("imsDashStepCount").textContent=done+"/4";el("imsDashMeter").style.width=(done*25)+"%";el("imsProfilePct").textContent=(done*25)+"%";
}
function updateGreeting(){
 if(!currentUser)return;
 const name=storedName||currentUser.user_metadata?.full_name||currentUser.user_metadata?.name||currentUser.email?.split("@")[0]||"Imsfrane";
 el("imsDashName").textContent=name;el("imsDashMail").textContent=currentUser.email||"";
 avatar(currentUser);renderProgress();
}
let activitiesRenderVersion=0;
async function renderActivities(){
 const generation=++activitiesRenderVersion;
 const target=el("imsActivitiesList");if(!target)return;
 target.replaceChildren();
 const language=getLang(),ids=activities.map(a=>a.id);
 const home=await sourceHomepage(language);
 if(generation!==activitiesRenderVersion||language!==getLang())return;
 const selected=new Set(savedFavorites()),fragment=document.createDocumentFragment();
 ids.forEach(id=>fragment.append(originalFavoriteCard(id,language,home,selected.has(id))));
 target.append(fragment);
}
/* Render saved activities from the actual localized homepage, not separate mini-cards.
   This preserves each original image, heading, description, price and card design. */
const homepageCache=new Map();
let favoritesRenderVersion=0;
const fallbackCardImages={"rafting":"images/rafting-new/IMG_9129.webp","kayak":"images/kayak/kayak-group.webp","randonnee":"images/19-800.webp","camping":"images/camping-1-800.webp","vtt":"images/IMG_2604.webp","quad":"images/quad-new/IMG_0310.webp","hebergement":"images/bab2-800.webp","tubing":"images/tubing-800.webp","jetski":"images/jetski-lake.webp","4x4":"images/4x4-800.webp","passage":"images/passage-800.webp","zrkan":"images/zrkan-800.webp","anergui":"images/anergui-800.webp","almou":"images/almo-800.webp","ahidous":"images/ahidous-800.webp"};
function sourceHomepage(language){
 if(!homepageCache.has(language)){
  const url=base+language+"/index.html";
  // The homepage is the single source of truth for cards.
  homepageCache.set(language,fetch(url,{credentials:"same-origin"}).then(async response=>{
   if(!response.ok)throw Error("Homepage unavailable");
   return new DOMParser().parseFromString(await response.text(),"text/html");
  }).catch(error=>{console.warn("Could not load original favorite cards",error);homepageCache.delete(language);return null}));
 }
 return homepageCache.get(language);
}
function originalFavoriteCard(id,language,homeDocument,selected=true){
 const source=homeDocument?.querySelector(".hp-activity-grid .hp-activity-card.hp-"+id);
 let card;
 if(source){
  card=document.importNode(source,true);
  const sourceUrl=new URL(base+language+"/index.html",location.href);
  card.querySelectorAll("a[href]").forEach(link=>{
   try{const href=link.getAttribute("href");if(href)link.href=new URL(href,sourceUrl).href}catch(e){}
  });
  card.querySelectorAll("img[src]").forEach(img=>{
   try{const src=img.getAttribute("src");if(src)img.src=new URL(src,sourceUrl).href}catch(e){}
  });
 }else{
  // Network fallback uses the very same image as the actual homepage card.
  const a=activities.find(item=>item.id===id);
  card=document.createElement("article");
  card.className="hp-activity-card hp-"+id;
  const link=document.createElement("a");link.className="hp-activity-image";link.href=path(id);
  const photo=document.createElement("img");photo.src=base+fallbackCardImages[id];photo.alt=a?.names[language]||id;photo.loading="lazy";link.append(photo);
  const content=document.createElement("div");content.className="hp-activity-body";
  const title=document.createElement("h3");title.textContent=a?.names[language]||id;
  const bottom=document.createElement("div");bottom.className="hp-activity-bottom";
  const action=document.createElement("a");action.href=path(id);action.textContent=tr().view;
  bottom.append(action);content.append(title,bottom);card.append(link,content);
 }
 card.style.position="relative";
 const remove=document.createElement("button");
 remove.type="button";remove.className="ims-original-fav-heart";
 remove.dataset.favorite=id;
 remove.setAttribute("aria-label",selected?tr().remove:tr().save);
 remove.setAttribute("aria-pressed",String(selected));
 remove.title=selected?tr().remove:tr().save;
 const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
 svg.classList.add("ims-heart-svg");svg.setAttribute("viewBox","0 0 24 24");svg.setAttribute("aria-hidden","true");svg.setAttribute("focusable","false");
 const heartPath=document.createElementNS("http://www.w3.org/2000/svg","path");
 heartPath.setAttribute("d","M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z");
 svg.append(heartPath);remove.append(svg);
 card.append(remove);
 return card;
}
async function renderFavorites(){
 const generation=++favoritesRenderVersion;
 const target=el("imsFavoritesList");if(!target)return;
 target.replaceChildren();
 const ids=savedFavorites(),language=getLang();
 el("imsFavCount").textContent=ids.length;
 if(!ids.length){
  const empty=document.createElement("p");empty.className="ims-dash-muted";empty.textContent=tr().emptyFavorites;
  target.append(empty);return;
 }
 const home=await sourceHomepage(language);
 if(generation!==favoritesRenderVersion||language!==getLang())return;
 const fragment=document.createDocumentFragment();
 ids.forEach(id=>fragment.append(originalFavoriteCard(id,language,home)));
 target.append(fragment);
}
function setTab(name,scroll){
 if(!["home","bookings","favorites","activities","account"].includes(name))name="home";
 tab=name;dash.dataset.view=name;
 dash.querySelectorAll("[data-dash-pane]").forEach(p=>{p.hidden=p.dataset.dashPane!==name});
 settings.hidden=name!=="account";
 document.body.classList.toggle("ims-view-account",name==="account");
 document.querySelectorAll("[data-dash-tab]").forEach(b=>{if(b.dataset.dashTab===name)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current")});
 if(name==="activities"){safe(()=>localStorage.setItem(seenKey(),"yes"));renderProgress()}
 if(name==="favorites")renderFavorites();
 if(scroll)window.scrollTo({top:0,behavior:"smooth"});
}
function decorate(){
 const t=tr(),lang=getLang();
 dash.querySelectorAll("[data-i18n-dash]").forEach(e=>{const k=e.dataset.i18nDash;if(t[k])e.textContent=t[k]});
 const official="https://imsfrane.com/"+lang+"/";el("imsDashOfficial").href=official;
 el("imsDashBooking").href=path("booking");dash.querySelectorAll(".ims-dash-booking").forEach(a=>a.href=path("booking"));
 const prev=safe(()=>sessionStorage.getItem("ims-demo-lastpage"),null);
 let valid=null;if(prev)try{const u=new URL(prev,location.href);if(u.origin===location.origin&&u.pathname.startsWith(base+lang+"/")&&u.pathname!==location.pathname)valid=u.href}catch(e){}
 el("imsDashReturn").href=valid||base+lang+"/index.html";
 renderActivities();renderFavorites();renderProgress();
 document.querySelectorAll("[data-dash-tab]").forEach(b=>b.querySelector("span")&&(b.querySelector("span").textContent=t[b.dataset.dashTab]));
}
function init(){
 mobile.innerHTML=dash.querySelector(".ims-dash-tabs").innerHTML;
 document.addEventListener("ims:member-session",e=>{currentUser=e.detail?.user||null;if(currentUser){updateGreeting();mobile.hidden=false;syncFavorites();loadOrders()}else{mobile.hidden=true;favoriteIds=[];storedName="";storedPhone="";storedAvatar="";document.body.classList.remove("ims-view-account")};renderFavorites()});
 document.addEventListener("ims:member-profile",e=>{storedName=e.detail?.name||"";storedPhone=e.detail?.phone||"";storedAvatar=e.detail?.avatarUrl||"";updateGreeting()});
 document.addEventListener("ims:member-language",()=>{decorate();loadOrders()});window.addEventListener("ims:favorites-changed",()=>syncFavorites());
 dash.addEventListener("click",e=>{
  const go=e.target.closest("[data-dash-go]");if(go){setTab(go.dataset.dashGo,true);return}
  const tabBtn=e.target.closest("[data-dash-tab]");if(tabBtn){setTab(tabBtn.dataset.dashTab,true);return}
  const heart=e.target.closest("button[data-favorite]");if(heart){heart.disabled=true;rememberFavorites(heart.dataset.favorite).catch(console.warn).finally(()=>heart.disabled=false)}
 });
 mobile.addEventListener("click",e=>{const b=e.target.closest("[data-dash-tab]");if(b)setTab(b.dataset.dashTab,true)});
 const after=window.IMSFRANE_MEMBER_DATA;
 if(after){currentUser=after.user||null;storedName=after.name||"";storedPhone=after.phone||"";storedAvatar=after.avatarUrl||"";if(currentUser){updateGreeting();mobile.hidden=false;syncFavorites();loadOrders()}}
 decorate();setTab("home",false);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();