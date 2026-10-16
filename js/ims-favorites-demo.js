/* Demo-wide account favorites: all 15 home activities, activity listings and detail pages. */
(function(){
"use strict";
const m=location.pathname.match(/^\/(fr|en|ar|es)\//);
if(!m)return;
const lang=m[1],catalog=["rafting","kayak","camping","randonnee","vtt","quad","hebergement","tubing","jetski","4x4","passage","zrkan","anergui","almou","ahidous"],tags={
 fr:{save:"Ajouter aux favoris",remove:"Retirer des favoris",login:"Connectez-vous pour enregistrer vos favoris.",saved:"Ajouté à vos favoris",removed:"Retiré de vos favoris",error:"Impossible d’enregistrer ce favori."},
 en:{save:"Add to favorites",remove:"Remove from favorites",login:"Sign in to save your favorites.",saved:"Added to favorites",removed:"Removed from favorites",error:"Could not save this favorite."},
 ar:{save:"إضافة إلى المفضلة",remove:"إزالة من المفضلة",login:"سجّل الدخول لحفظ الأنشطة المفضلة.",saved:"أُضيف إلى المفضلة",removed:"أُزيل من المفضلة",error:"تعذّر حفظ النشاط المفضل."},
 es:{save:"Añadir a favoritos",remove:"Quitar de favoritos",login:"Inicia sesión para guardar favoritos.",saved:"Añadido a favoritos",removed:"Eliminado de favoritos",error:"No se pudo guardar el favorito."}
}[lang];
let db,user=null,items=new Set(),busy=new Set();
const key="ims-demo-fav-pending";
const css=document.createElement("style");css.textContent='.ims-fav-target{position:relative!important}.ims-fav-heart{position:absolute;z-index:20;inset-block-start:10px;inset-inline-end:10px;display:grid;place-items:center;width:29px;height:29px;min-width:29px;min-height:29px;padding:0;margin:0;border-radius:50%;background:rgba(255,255,255,.96);border:1px solid rgba(207,194,159,.95);color:#27513c;box-shadow:0 4px 15px rgba(8,37,26,.18);cursor:pointer}.ims-fav-heart[aria-pressed=true]{background:#204d39;color:#f4d388;border-color:#bfa367}.ims-fav-detail{display:inline-flex;align-items:center;gap:8px;cursor:pointer}.ims-fav-heart:focus-visible,.ims-fav-detail:focus-visible{outline:3px solid #c6a43f;outline-offset:3px}@media(max-width:600px){.ims-fav-heart{inset-block-start:7px;inset-inline-end:7px;width:27px;height:27px;min-height:27px;min-width:27px}}';document.head.append(css);const pro=document.createElement("link");pro.rel="stylesheet";pro.href="/css/ims-favorites-pro.css?v=20261016petite-heart-v3";document.head.append(pro);

function message(t){let n=document.getElementById("imsFavToast");if(!n){n=document.createElement("div");n.id="imsFavToast";n.setAttribute("role","status");n.style.cssText="position:fixed;z-index:2147483100;bottom:86px;left:50%;transform:translateX(-50%);max-width:calc(100vw - 28px);background:#153d2e;color:white;border:1px solid #c6a43f;border-radius:12px;padding:12px 19px;font:700 13px system-ui;box-shadow:0 9px 27px #0004;text-align:center";document.body.append(n)}n.textContent=t;n.hidden=false;setTimeout(()=>n.hidden=true,3500)}

function heartSvg(){
 const ns="http://www.w3.org/2000/svg";
 const svg=document.createElementNS(ns,"svg");svg.classList.add("ims-heart-svg");svg.setAttribute("viewBox","0 0 24 24");svg.setAttribute("aria-hidden","true");svg.setAttribute("focusable","false");
 const path=document.createElementNS(ns,"path");path.setAttribute("d","M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z");svg.append(path);return svg;
}
function icon(b,slug){
 const on=items.has(slug),detail=b.classList.contains("ims-fav-detail");
 b.setAttribute("aria-pressed",String(on));b.setAttribute("aria-label",on?tags.remove:tags.save);b.title=on?tags.remove:tags.save;
 if(detail){const label=b.querySelector(".ims-heart-label");if(label)label.textContent=on?tags.remove:tags.save}
}
function rerender(){document.querySelectorAll("[data-ims-favorite]").forEach(b=>icon(b,b.dataset.imsFavorite))}
function matchLink(a){if(!a)return null;try{let u=new URL(a.getAttribute("href"),location.href);if(u.origin!==location.origin)return null;let match=u.pathname.match(/\/(fr|en|ar|es)\/(rafting|kayak|camping|randonnee|vtt|quad|hebergement)(?:\.html|\/)?$/);return match?.[2]||null}catch(e){return null}}
function button(slug,detail){
 let b=document.createElement("button");b.type="button";b.className=detail?"ims-fav-detail":"ims-fav-heart";b.dataset.imsFavorite=slug;
 b.append(heartSvg());
 if(detail){const label=document.createElement("span");label.className="ims-heart-label";b.append(label)}
 icon(b,slug);b.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();toggle(slug)});return b
}
function addHeart(slug,target){if(!target||target.querySelector(":scope > .ims-fav-heart"))return;target.classList.add("ims-fav-target");target.append(button(slug,false))}

function place(){
 document.querySelectorAll(".hp-activity-grid .hp-activity-card").forEach(card=>{
  const slug=catalog.find(id=>card.classList.contains("hp-"+id));
  if(slug)addHeart(slug,card);
 });
 document.querySelectorAll("main .activity-card,main .experience-card,main .tour-card,main .program-card,main .service-card,main .related-card,main .activity-tile,main .destination-card,main .gp-card,main .card").forEach(card=>{
  const links=Array.from(card.querySelectorAll("a[href]"));
  const slug=links.map(matchLink).find(Boolean);
  if(slug)addHeart(slug,card);
 });
 const slug=location.pathname.match(/\/(rafting|kayak|camping|randonnee|vtt|quad|hebergement)(?:\.html|\/)?$/)?.[1];
 if(slug&&!document.getElementById("imsFavDetailButton")){
  const h=document.querySelector("main h1")||document.querySelector("h1");
  if(h){let b=button(slug,true);b.id="imsFavDetailButton";const actions=slug==="kayak"?document.querySelector(".ky-hero-actions"):null;if(actions)actions.append(b);else h.insertAdjacentElement("afterend",b)}
 }
}
async function setup(){if(db)return db;let sdk=await import("https://esm.sh/@supabase/supabase-js@2");db=sdk.createClient("https://ktrcrfoywokuuwzwnqsu.supabase.co","sb_publishable_GS2PtVM4vBv7epvV6aZSpA_XQyD9bCj");let {data}=await db.auth.getSession();user=data.session?.user||null;db.auth.onAuthStateChange((_evt,s)=>{user=s?.user||null;refresh().catch(console.warn)});return db}
async function refresh(){if(!db)return;items.clear();if(user){let {data,error}=await db.from("member_favorites").select("item_slug").eq("user_id",user.id);if(!error)(data||[]).forEach(x=>items.add(x.item_slug));rerender();let pending=sessionStorage.getItem(key);if(catalog.includes(pending)){sessionStorage.removeItem(key);await store(pending,!items.has(pending))}}else rerender()}
async function store(slug,add){busy.add(slug);try{const r=add?await db.from("member_favorites").insert({user_id:user.id,item_slug:slug}):await db.from("member_favorites").delete().eq("user_id",user.id).eq("item_slug",slug);if(r.error)throw r.error;if(add)items.add(slug);else items.delete(slug);rerender();message(add?tags.saved:tags.removed);window.dispatchEvent(new CustomEvent("ims:favorites-changed",{detail:{items:Array.from(items)}}))}catch(e){console.error(e);message(tags.error)}finally{busy.delete(slug)}}
async function toggle(slug){if(busy.has(slug))return;try{await setup();if(!user){sessionStorage.setItem(key,slug);message(tags.login);let login=document.querySelector(".ims-member-entry");if(login)login.click();else location.href="/members.html?lang="+lang;return}await store(slug,!items.has(slug))}catch(e){console.error(e);message(tags.error)}}
function init(){place();const main=document.querySelector("main");if(main&&window.MutationObserver){let queued=false;const watch=new MutationObserver(list=>{if(!list.some(x=>x.addedNodes.length))return;if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;place()})});watch.observe(main,{childList:true,subtree:true})}setup().then(refresh).catch(console.warn)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();