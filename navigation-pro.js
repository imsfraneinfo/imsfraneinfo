/* Demo-wide Imsfrane Cathédrale premium navigation. Native, no dependencies. */
(function(){
"use strict";
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

function initMemberEntry(){
 var menu=document.querySelector(".atnav-langmini");
 if(!menu || document.querySelector(".ims-member-entry"))return;
 var current=(document.documentElement.lang || "fr").slice(0,2);
 var title={fr:"Se connecter",en:"Sign in",ar:"تسجيل الدخول",es:"Iniciar sesión"}[current] || "Sign in";
 var link=document.createElement("a");
 link.className="ims-member-entry";link.href="/members.html?lang="+encodeURIComponent(current);
 link.setAttribute("aria-label",title);link.setAttribute("title",title);
 link.innerHTML='<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.6"/><path d="M4.8 20c.3-4.4 3-6.6 7.2-6.6s6.9 2.2 7.2 6.6"/></svg>';
 menu.insertAdjacentElement("afterend",link);
 if(!document.getElementById("ims-member-entry-style")){
 var css=document.createElement("style");css.id="ims-member-entry-style";
 css.textContent='.ims-member-entry{display:inline-grid;place-items:center;width:39px;height:39px;flex:0 0 39px;border:1px solid #e2bf7c72;border-radius:10px;background:#f5d88617;color:#f4d788!important;text-decoration:none;margin-inline:6px;transition:background .2s,border-color .2s}.ims-member-entry:hover,.ims-member-entry:focus-visible{background:#f5d88632;border-color:#e2bf7c;outline-offset:2px}.ims-member-entry svg{display:block}@media(max-width:420px){.ims-member-entry{width:34px;height:36px;flex-basis:34px;margin-inline:3px}}';
 document.head.appendChild(css);
 }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initMemberEntry,{once:true});else initMemberEntry();

function enableArticleDiscussion(){
 if(!/^\/(fr|en|ar|es)\/blog-[a-z0-9-]+\/?$/i.test(location.pathname))return;
 if(document.querySelector('script[data-imsfrane-comments]'))return;
 var tag=document.createElement("script");tag.src="/js/member-blog-comments.js";tag.defer=true;tag.dataset.imsfraneComments="1";document.head.appendChild(tag);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",enableArticleDiscussion,{once:true});else enableArticleDiscussion();

function fixArabicArticleLabels(){
 if(!/^\/ar\/blog-[a-z0-9-]+\/?$/i.test(location.pathname))return;
 var nav=document.querySelector(".article-nav nav");
 if(nav){
  Array.from(nav.querySelectorAll("a")).forEach(function(a){
   if(a.textContent.includes("Tous les articles"))a.textContent="← جميع المقالات";
   var val=a.textContent.trim();
   if(val==="FR"&&a.getAttribute("href")===location.pathname)a.href=location.pathname.replace(/^\/ar\//,"/fr/");
   if(val==="EN"&&a.getAttribute("href")===location.pathname)a.href=location.pathname.replace(/^\/ar\//,"/en/");
  });
 }
 var hero=document.querySelector(".article-hero-text span");
 if(hero){
  var labels={"Itinéraires":"طرق الوصول","Randonnée":"المشي الجبلي","Camping":"التخييم","Découverte":"اكتشاف","Nature":"الطبيعة","Rafting":"التجديف النهري","Culture":"الثقافة","Conseils":"نصائح","VTT":"الدراجات الجبلية","Saisons":"مواسم الزيارة"};
  var first=hero.textContent.trim();
  Object.keys(labels).forEach(function(k){if(first.startsWith(k+" ·"))hero.textContent=labels[k]+first.slice(k.length)});
 }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",fixArabicArticleLabels,{once:true});else fixArabicArticleLabels();

})();