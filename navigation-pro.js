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

})();