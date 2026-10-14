/* Demo-wide Imsfrane Cathédrale premium navigation. Native, no dependencies. */
(function(){
"use strict";
try{if(/^\/Imsfrane-demo\/(?:fr|en|ar|es)\//.test(location.pathname))sessionStorage.setItem("ims-demo-lastpage",location.href)}catch(e){}
function init(){
var body=document.body, drawer=document.getElementById("atnavDrawer"), backdrop=document.getElementById("atnavBackdrop"), opener=document.getElementById("atnavOpen"), closer=document.getElementById("atnavClose"), toggle=document.getElementById("atnavActivities"), list=document.getElementById("atnavActivityList");
if(!drawer||!backdrop||!opener||!closer||!toggle||!list)return;
var lastFocus=null, isOpen=false;
function focusables(){return Array.prototype.slice.call(drawer.querySelectorAll('a[href]:not([hidden]),button:not([disabled]):not([hidden])')).filter(function(el){return !el.closest('[hidden]') && el.offsetWidth>0 && el.offsetHeight>0})}
function show(yes){
 if(yes===isOpen)return;
 isOpen=yes;
 if(yes)lastFocus=document.activeElement;
 backdrop.classList.toggle("is-open",yes);
 drawer.classList.toggle("is-open",yes);
 body.classList.toggle("atnav-lock",yes);
 opener.setAttribute("aria-expanded",String(yes));
 drawer.setAttribute("aria-hidden",String(!yes));
 drawer.inert=!yes;
 backdrop.setAttribute("aria-hidden",String(!yes));
 if(yes)closer.focus({preventScroll:true});
 else if(lastFocus&&typeof lastFocus.focus==="function")lastFocus.focus({preventScroll:true});
}
opener.addEventListener("click",function(e){e.preventDefault();show(!isOpen)});
closer.addEventListener("click",function(){show(false)});
backdrop.addEventListener("click",function(){show(false)});
toggle.addEventListener("click",function(){
 var on=toggle.getAttribute("aria-expanded")!=="true";
 toggle.setAttribute("aria-expanded",String(on));
 list.classList.toggle("is-collapsed",!on);
 list.setAttribute("aria-hidden",String(!on));
 list.inert=!on;
});
drawer.querySelectorAll("a").forEach(function(a){
 a.addEventListener("click",function(){show(false)})
});
document.addEventListener("keydown",function(e){
 if(!isOpen)return;
 if(e.key==="Escape"){e.preventDefault();show(false);return}
 if(e.key!=="Tab")return;
 var els=focusables();
 if(!els.length){e.preventDefault();closer.focus();return}
 var first=els[0],last=els[els.length-1];
 if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
 else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
});
drawer.inert=true;
list.inert=false;
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
else init();

function initLanguageMenus(){
 var menus=Array.prototype.slice.call(document.querySelectorAll(".atnav-langmini"));
 if(!menus.length)return;
 function close(except){menus.forEach(function(menu){if(menu===except)return;var p=menu.querySelector(".atnav-langmini-panel"),b=menu.querySelector(".atnav-langmini-trigger");if(!p||!b)return;p.hidden=true;b.setAttribute("aria-expanded","false")})}
 menus.forEach(function(menu){
   var b=menu.querySelector(".atnav-langmini-trigger"),p=menu.querySelector(".atnav-langmini-panel");
   if(!b||!p)return;
   b.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();var open=p.hidden;close();p.hidden=!open;b.setAttribute("aria-expanded",String(open));});
   menu.addEventListener("keydown",function(e){if(e.key==="Escape"&&!p.hidden){e.preventDefault();p.hidden=true;b.setAttribute("aria-expanded","false");b.focus()}});
 });
 document.addEventListener("click",function(e){if(!e.target.closest(".atnav-langmini"))close()});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initLanguageMenus,{once:true});else initLanguageMenus();


/* DEMO article reading: keep the single four-language selector in the main header.
   The article's old language row duplicated it and omitted Spanish. */
function simplifyBlogArticleNav(){
 var legacy=document.querySelector("header.article-nav");
 var official=document.querySelector(".atnav-article-header .atnav-langmini, #siteHeader .atnav-langmini");
 if(!legacy||!official)return;
 var lang=(document.documentElement.lang||"fr").slice(0,2);
 var text={fr:"Tous les articles",en:"All articles",ar:"جميع المقالات",es:"Todos los artículos"}[lang]||"All articles";
 var bar=document.createElement("nav");
 bar.className="ims-blog-return";
 bar.setAttribute("aria-label",text);
 var link=document.createElement("a");
 link.href="blog.html";
 link.setAttribute("aria-label",text);
 var arrow=document.createElement("span");
 arrow.className="ims-blog-return-arrow";
 arrow.setAttribute("aria-hidden","true");
 arrow.textContent=lang==="ar"?"→":"←";
 var label=document.createElement("span");label.textContent=text;
 link.append(arrow,label);bar.append(link);
 legacy.replaceWith(bar);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",simplifyBlogArticleNav,{once:true});else simplifyBlogArticleNav();

function initMemberEntry(){
  var menu=document.querySelector(".atnav-langmini");
  if(!menu || document.querySelector(".ims-member-entry"))return;
  var current=(document.documentElement.lang || "fr").slice(0,2);
  var title={fr:"Se connecter",en:"Sign in",ar:"تسجيل الدخول",es:"Iniciar sesión"}[current] || "Sign in";
  var link=document.createElement("a");
  link.className="ims-member-entry";
  link.href="/members.html?lang="+encodeURIComponent(current);
  link.setAttribute("aria-label",title);
  link.setAttribute("title",title);
  link.innerHTML='<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.6"/><path d="M4.8 20c.3-4.4 3-6.6 7.2-6.6s6.9 2.2 7.2 6.6"/></svg>';
  menu.insertAdjacentElement("afterend",link);
  if(!document.getElementById("ims-member-entry-style")){
    var css=document.createElement("style");
    css.id="ims-member-entry-style";
    css.textContent='.ims-member-entry{display:inline-grid;place-items:center;width:39px;height:39px;flex:0 0 39px;border:1px solid #e2bf7c72;border-radius:10px;background:#f5d88617;color:#f4d788!important;text-decoration:none;margin-inline:6px;transition:background .2s,border-color .2s}.ims-member-entry:hover,.ims-member-entry:focus-visible{background:#f5d88632;border-color:#e2bf7c;outline-offset:2px}.ims-member-entry svg{display:block}@media(max-width:420px){.ims-member-entry{width:34px;height:36px;flex-basis:34px;margin-inline:3px}}';
    document.head.appendChild(css);
  }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initMemberEntry,{once:true});else initMemberEntry();

function initAccountModal(){
 var entry=document.querySelector(".ims-member-entry");if(!entry)return;
 var lang=(document.documentElement.lang||"fr").slice(0,2);
 var labels={
 fr:["VOTRE ESPACE IMSFRANE","Heureux de vous revoir","Retrouvez votre communauté et les aventures de l’Atlas.","Se connecter","Créer un compte","Se connecter avec Google","ou avec votre email","Adresse email","Mot de passe","Mot de passe oublié ?","Se connecter","Créer mon compte","Vos informations sont protégées.","Fermer","Consultez votre boîte email pour confirmer le compte.","Un lien de réinitialisation a été envoyé.","Mon compte","Se déconnecter"],
 en:["YOUR IMSFRANE SPACE","Welcome back","Discover your Atlas adventure community.","Sign in","Create account","Continue with Google","or with your email","Email address","Password","Forgot password?","Sign in","Create my account","Your information is protected.","Close","Check your email to confirm your account.","Check your inbox for a reset link.","My account","Sign out"],
 ar:["فضاؤك في مسفران","مرحباً بعودتك","انضم إلى مجتمع محبي المغامرة في جبال الأطلس.","تسجيل الدخول","إنشاء حساب","المتابعة باستخدام Google","أو بواسطة البريد الإلكتروني","البريد الإلكتروني","كلمة المرور","هل نسيت كلمة المرور؟","تسجيل الدخول","إنشاء حساب","معلوماتك محمية.","إغلاق","يرجى تأكيد الحساب عبر بريدك الإلكتروني.","تم إرسال رابط استعادة كلمة المرور.","حسابي","تسجيل الخروج"],
 es:["TU ESPACIO IMSFRANE","¡Bienvenido de nuevo!","Disfruta de nuestra comunidad del Atlas.","Iniciar sesión","Crear cuenta","Continuar con Google","o con tu correo","Correo electrónico","Contraseña","¿Olvidaste tu contraseña?","Iniciar sesión","Crear mi cuenta","Tus datos están protegidos.","Cerrar","Confirma tu cuenta desde el correo.","Revisa el correo para cambiar la contraseña.","Mi cuenta","Cerrar sesión"]
 }[lang]||[];
 var css=document.createElement("style");css.textContent='.ims-login-overlay[hidden]{display:none!important}.ims-login-overlay{position:fixed;inset:0;z-index:2147483000;background:#09251db5;backdrop-filter:blur(5px);display:grid;place-items:center;padding:15px}.ims-login-dialog{width:min(100%,490px);max-height:calc(100dvh - 30px);overflow:auto;border-radius:23px;background:white;color:#102f2a;box-shadow:0 30px 90px #09261f66;font:500 14px/1.5 system-ui,sans-serif;direction:inherit}.ims-login-head{display:flex;gap:13px;align-items:flex-start;padding:25px;border-bottom:1px solid #e2e9e7;background:#fafeff}.ims-login-mark{background:#e7f5f6;color:#099baf;border-radius:15px;padding:14px;font-size:24px}.ims-login-head-copy{flex:1}.ims-login-head small{font-weight:800;color:#18aab6;letter-spacing:.08em}.ims-login-head h2{font:800 23px/1.25 system-ui,sans-serif;color:#102f2a;margin:5px 0}.ims-login-head p{font-size:12px;color:#647c78;margin:0}.ims-login-close{background:white;border:1px solid #dbe3dc;border-radius:12px;width:41px;height:41px;cursor:pointer;font-size:26px;color:#193c30}.ims-login-body{padding:25px}.ims-login-tabs{display:flex;gap:5px;padding:5px;border-radius:14px;background:#f2f6f5;margin-bottom:20px}.ims-login-tab{flex:1;border:0;border-radius:10px;background:none;color:#64746f;padding:12px;cursor:pointer;font-weight:800}.ims-login-tab[aria-selected=true]{background:white;color:#11362c;box-shadow:0 3px 9px #193b2618}.ims-login-google{width:100%;background:white;border:1px solid #dce3de;border-radius:10px;padding:14px;display:flex;gap:14px;align-items:center;justify-content:center;font-size:14px;color:#2e3e36;cursor:pointer}.ims-login-divider{display:flex;gap:12px;align-items:center;color:#798b86;margin:21px 0}.ims-login-divider:before,.ims-login-divider:after{content:"";height:1px;flex:1;background:#e0e7e1}.ims-login-form label{display:block;margin:14px 0 7px;font-size:13px;font-weight:700}.ims-login-form input{width:100%;box-sizing:border-box;border:1px solid #d7e0d9;border-radius:11px;padding:14px;color:#122f25;background:white;font:inherit}.ims-login-submit{width:100%;margin-top:19px;border:0;border-radius:12px;background:#1ab4c2;color:white;padding:15px;font-weight:800;cursor:pointer;font-size:14px}.ims-login-forgot{display:block;margin:12px 0 0 auto;background:none;border:0;color:#128b98;cursor:pointer;font-size:12px;font-weight:700}.ims-login-state{color:#37756e;font-size:12px;margin-top:12px;white-space:pre-wrap}.ims-login-security{border-top:1px solid #e1e8e3;padding-top:14px;margin-top:20px;color:#70847b;font-size:11px}.ims-login-dialog button:focus-visible{outline:3px solid #19aab2;outline-offset:2px}@media(max-width:490px){.ims-login-head{padding:19px 15px}.ims-login-body{padding:20px 17px}.ims-login-dialog{border-radius:20px}.ims-login-head h2{font-size:21px}}';css.textContent+="\n/* IMSFRANE DESIGN SYSTEM — forest and gold account modal */\n.ims-login-overlay{background:#071f1acc!important}\n.ims-login-head{background:linear-gradient(120deg,#123a30,#0d2c25)!important;border-bottom:1px solid #bb9a56!important}\n.ims-login-head h2,.ims-login-head p{color:#fff!important}\n.ims-login-head small{color:#e8c978!important}\n.ims-login-mark{background:#e6cc8129!important;color:#f3d78b!important}\n.ims-login-close{background:#f4e7c7!important;color:#193629!important;border-color:#d1b478!important}\n.ims-login-tab[aria-selected=true]{color:#143e2d!important;border:1px solid #c6a43f88!important}\n.ims-login-google:hover{border-color:#bba05e!important;background:#fcfaf4!important}\n.ims-login-submit{background:#183e30!important;box-shadow:0 9px 22px #183e3026!important}\n.ims-login-submit:hover{background:#265b43!important}\n.ims-login-forgot{color:#9b7834!important}\n.ims-login-form input:focus{outline:2px solid #c6a43f!important;outline-offset:1px}\n.ims-login-dialog button:focus-visible{outline-color:#c6a43f!important}\n.ims-login-security{color:#6c7a6d!important}\n";document.head.appendChild(css);
 var dialog=document.createElement("div");dialog.className="ims-login-overlay";dialog.hidden=true;dialog.innerHTML='<div class="ims-login-dialog" role="dialog" aria-modal="true" aria-labelledby="ims-login-title"><header class="ims-login-head"><span class="ims-login-mark" aria-hidden="true"><img src="/images/logo.webp" alt="" width="44" height="44" style="border-radius:50%;object-fit:cover"></span><div class="ims-login-head-copy"><small></small><h2 id="ims-login-title"></h2><p></p></div><button type="button" class="ims-login-close">×</button></header><div class="ims-login-body"><div class="ims-login-tabs"><button class="ims-login-tab" type="button" data-mode="login"></button><button class="ims-login-tab" type="button" data-mode="signup"></button></div><button type="button" class="ims-login-google"><svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.7 1.2 9.2 3.6l6.8-6.8C35.9 2.4 30.3 0 24 0 14.6 5.4 6.5 13.2l7.9 6.1C12.3 13.6 17.7 9.5 24 9.5Z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94a11 11 0 0 1-4.8 7.24l7.73 6C44.38 38.08 46.98 31.94 46.98 24.55Z"/><path fill="#FBBC05" d="M10.39 28.69A14.4 14.4 0 0 1 9.62 24c0-1.63.28-3.2.76-4.69l-7.88-6.1A23.96 23.96 0 0 0 0 24c0 3.87.93 7.52 2.5 10.79l7.89-6.1Z"/><path fill="#34A853" d="M24 48c6.48 0 11.9-2.13 15.87-5.74l-7.73-6A14.4 14.4 0 0 1 24 38.5c-6.3 0-11.67-4.07-13.61-9.81l-7.88 6.1C6.5 42.6 14.6 48 24 48Z"/></svg><span></span></button><div class="ims-login-divider"></div><form class="ims-login-form"><label for="ims-login-email"></label><input id="ims-login-email" autocomplete="email" type="email" required placeholder="vous@exemple.com"><label for="ims-login-pass"></label><input id="ims-login-pass" autocomplete="current-password" type="password" minlength="6" required placeholder="••••••••"><button type="button" class="ims-login-forgot"></button><button type="submit" class="ims-login-submit"></button></form><p class="ims-login-state" role="status" aria-live="polite"></p><p class="ims-login-security"></p></div></div>';document.body.appendChild(dialog);
 var q=function(x){return dialog.querySelector(x)},client,mode="login",oldFocus;
 q(".ims-login-head small").textContent=labels[0];q(".ims-login-head h2").textContent=labels[1];q(".ims-login-head p").textContent=labels[2];q(".ims-login-close").setAttribute("aria-label",labels[13]);
 q('[data-mode="login"]').textContent=labels[3];q('[data-mode="signup"]').textContent=labels[4];q(".ims-login-google span").textContent=labels[5];q(".ims-login-divider").textContent=labels[6];
 q('label[for="ims-login-email"]').textContent=labels[7];q('label[for="ims-login-pass"]').textContent=labels[8];q(".ims-login-forgot").textContent=labels[9];q(".ims-login-security").textContent="🛡 "+labels[12];
 q(".ims-login-dialog").dir=lang==="ar"?"rtl":"ltr";
 function render(){q('[data-mode="login"]').setAttribute("aria-selected",String(mode==="login"));q('[data-mode="signup"]').setAttribute("aria-selected",String(mode==="signup"));q(".ims-login-submit").textContent=mode==="login"?labels[10]:labels[11];}
 function message(v){q(".ims-login-state").textContent=v||""}
 function close(){dialog.hidden=true;document.body.style.overflow="";if(oldFocus)oldFocus.focus()}
 async function getClient(){if(!client){var sdk=await import("https://esm.sh/@supabase/supabase-js@2");client=sdk.createClient("https://ktrcrfoywokuuwzwnqsu.supabase.co","sb_publishable_GS2PtVM4vBv7epvV6aZSpA_XQyD9bCj");}return client}

 var profile=document.createElement("div");profile.className="ims-demo-profile";profile.hidden=true;
 profile.innerHTML='<div class="ims-demo-person"><span class="ims-demo-avatar"></span><div><strong class="ims-demo-name"></strong><small class="ims-demo-mail"></small></div></div><a class="ims-demo-account-link" href="/members.html"></a><button type="button" class="ims-demo-logout"></button>';
 q(".ims-login-body").appendChild(profile);
 var profileStyle=document.createElement("style");profileStyle.textContent='.ims-login-dialog [hidden]{display:none!important}.ims-demo-profile[hidden]{display:none!important}.ims-demo-person{display:flex;align-items:center;gap:14px;padding:8px 0 20px}.ims-demo-avatar{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;background:#173e30;color:#e8ca77;font-size:20px;font-weight:800;overflow:hidden;flex:none}.ims-demo-avatar img{width:100%;height:100%;object-fit:cover}.ims-demo-person strong,.ims-demo-person small{display:block;overflow-wrap:anywhere}.ims-demo-person small{color:#6e8177;font-size:12px;margin-top:3px}.ims-demo-account-link,.ims-demo-logout{display:block!important;text-align:center;text-decoration:none;margin-top:12px;padding:13px;border-radius:11px;font-weight:800;font-size:13px}.ims-demo-account-link{color:white!important;background:#173e30}.ims-demo-logout{width:100%;background:#f3f4ee;color:#315344;border:1px solid #e3e8db;cursor:pointer}.ims-member-entry.ims-signed-in{padding:0;overflow:hidden;border-radius:50%;border:2px solid #c6a43f;background:#193e30;color:#f2d680!important}.ims-member-entry.ims-signed-in img{width:100%;height:100%;object-fit:cover;border-radius:50%}.ims-member-entry.ims-signed-in .ims-initial{font-size:15px;font-weight:800}';document.head.appendChild(profileStyle);
 function safePhotoUrl(u){try{var url=new URL(u);return url.protocol==="https:"&&url.hostname!=="localhost"?url.href:null}catch(e){return null}}
 function setAvatar(el,user){el.replaceChildren();var photo=safePhotoUrl(user.user_metadata&&(user.user_metadata.avatar_url||user.user_metadata.picture));if(photo){var img=document.createElement("img");img.src=photo;img.alt="";img.referrerPolicy="no-referrer";img.onerror=function(){img.remove();el.textContent=(user.email||"U")[0].toUpperCase()};el.appendChild(img)}else{el.textContent=(user.user_metadata?.full_name||user.email||"U")[0].toUpperCase()}}
 async function loadPrivateAvatar(u){
 if(!u||!client)return;
 try{
  const p=await client.from("member_profiles").select("avatar_path").eq("user_id",u.id).maybeSingle();
  if(p.error||!p.data?.avatar_path)return;
  const pic=await client.storage.from("member-avatars").createSignedUrl(p.data.avatar_path,3600);
  if(pic.error||!pic.data?.signedUrl)return;
  if(accountUser?.id!==u.id)return;
  const safe=pic.data.signedUrl;
  const avatarTargets=[entry,q(".ims-demo-avatar")];
  avatarTargets.forEach(target=>{if(!target)return;target.replaceChildren();const img=document.createElement("img");img.src=safe;img.alt="";img.referrerPolicy="no-referrer";target.append(img)});
 }catch(e){console.warn("Avatar currently unavailable")}
}
function refreshAccount(u){
  entry.classList.toggle("ims-signed-in",!!u);
  var title=u?({fr:"Mon profil",en:"My profile",ar:"ملفي الشخصي",es:"Mi perfil"}[lang]):labels[3];
  entry.title=title;entry.setAttribute("aria-label",title);
  if(u){setAvatar(entry,u);loadPrivateAvatar(u);q(".ims-login-tabs").hidden=true;q(".ims-login-google").hidden=true;q(".ims-login-divider").hidden=true;q(".ims-login-form").hidden=true;profile.hidden=false;setAvatar(q(".ims-demo-avatar"),u);
   q(".ims-demo-name").textContent=u.user_metadata?.full_name||u.user_metadata?.name||u.email?.split("@")[0]||labels[16];
   q(".ims-demo-mail").textContent=u.email||"";q(".ims-demo-account-link").textContent=labels[16];q(".ims-demo-account-link").href="/members.html?lang="+lang;q(".ims-demo-logout").textContent=labels[17]
  }else{entry.innerHTML='<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.6"/><path d="M4.8 20c.3-4.4 3-6.6 7.2-6.6s6.9 2.2 7.2 6.6"/></svg>';q(".ims-login-tabs").hidden=false;q(".ims-login-google").hidden=false;q(".ims-login-divider").hidden=false;q(".ims-login-form").hidden=false;profile.hidden=true}
 }
 var accountUser=null;
 entry.addEventListener("click",async function(e){e.preventDefault();oldFocus=entry;dialog.hidden=false;document.body.style.overflow="hidden";message("");render();q(".ims-login-close").focus();try{var db=await getClient(),r=await db.auth.getUser();accountUser=r.data?.user||null;refreshAccount(accountUser)}catch(e){message(e.message||"Connection error")}});
 q(".ims-demo-logout").onclick=async function(){try{var db=await getClient(),r=await db.auth.signOut();if(r.error)throw r.error;accountUser=null;refreshAccount(null);close()}catch(e){message(e.message)}};
 (async function(){try{var db=await getClient(),r=await db.auth.getUser();accountUser=r.data?.user||null;refreshAccount(accountUser);db.auth.onAuthStateChange(function(_event,session){accountUser=session?.user||null;refreshAccount(accountUser)})}catch(e){}})();

 q(".ims-login-close").onclick=close;dialog.addEventListener("click",function(e){if(e.target===dialog)close()});document.addEventListener("keydown",function(e){if(!dialog.hidden&&e.key==="Escape")close()});
 dialog.querySelectorAll(".ims-login-tab").forEach(function(b){b.onclick=function(){mode=b.dataset.mode;render()}});
 q(".ims-login-google").onclick=async function(){try{var db=await getClient();sessionStorage.setItem("ims-demo-return",location.href);var r=await db.auth.signInWithOAuth({provider:"google",options:{redirectTo:location.origin+"/members.html"}});if(r.error)throw r.error}catch(e){message(e.message)}};
 q(".ims-login-form").onsubmit=async function(e){e.preventDefault();try{var db=await getClient(),email=q("#ims-login-email").value.trim(),password=q("#ims-login-pass").value;var r=mode==="signup"?await db.auth.signUp({email:email,password:password,options:{emailRedirectTo:location.origin+"/members.html"}}):await db.auth.signInWithPassword({email:email,password:password});if(r.error)throw r.error;if(!r.data.session)message(labels[14]);else{close();location.reload()}}catch(e){message(e.message)}};
 q(".ims-login-forgot").onclick=async function(){var email=q("#ims-login-email").value.trim();if(!email){q("#ims-login-email").focus();return}try{var db=await getClient(),r=await db.auth.resetPasswordForEmail(email,{redirectTo:location.origin+"/members.html"});if(r.error)throw r.error;message(labels[15])}catch(e){message(e.message)}};
 render();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initAccountModal,{once:true});else initAccountModal();

function loadFavoriteHearts(){if(!/^\/Imsfrane-demo\/(fr|en|ar|es)\//.test(location.pathname))return;if(document.querySelector('script[data-ims-fav]'))return;var script=document.createElement("script");script.src="/js/ims-favorites-demo.js?v=20261013all14proheart-v1";script.defer=true;script.dataset.imsFav="yes";document.head.append(script)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",loadFavoriteHearts,{once:true});else loadFavoriteHearts();

/* Site header: no notification bell. The full inbox stays on members.html. */


/* AdSense readiness: provide a discoverable privacy link on every site page. */
function addPrivacyFooterLink(){
 var lang=(document.documentElement.lang||document.body?.dataset?.lang||"fr").slice(0,2);
 if(!/^(fr|en|es|ar)$/.test(lang))lang="fr";
 if(document.querySelector("a.ims-privacy-link"))return;
 var footer=document.querySelector("footer.site-footer .footer-bottom-inner")||document.querySelector("footer");
 if(!footer)return;
 var words={fr:"Politique de confidentialité",en:"Privacy policy",es:"Política de privacidad",ar:"سياسة الخصوصية"};
 var anchor=document.createElement("a");anchor.className="ims-privacy-link";anchor.href="/"+lang+"/privacy/";anchor.textContent=words[lang];
 if(!footer.classList.contains("footer-bottom-inner")){var separator=document.createElement("span");separator.textContent=" · ";footer.appendChild(separator)}
 footer.appendChild(anchor);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",addPrivacyFooterLink,{once:true});else addPrivacyFooterLink();


})();