/* Demo-wide account favorites for all 14 homepage activities. */
(function(){
"use strict";
const m=location.pathname.match(/^\/Imsfrane-demo\/(fr|en|ar|es)\//);
if(!m)return;
const lang=m[1],catalog=["rafting","camping","randonnee","vtt","quad","hebergement","tubing","jetski","4x4","passage","zrkan","anergui","almou","ahidous"],tags={
 fr:{save:"Ajouter aux favoris",remove:"Retirer des favoris",login:"Connectez-vous pour enregistrer vos favoris.",saved:"Ajouté à vos favoris",removed:"Retiré de vos favoris",error:"Impossible d’enregistrer ce favori."},
 en:{save:"Add to favorites",remove:"Remove from favorites",login:"Sign in to save your favorites.",saved:"Added to favorites",removed:"Removed from favorites",error:"Could not save this favorite."},
 ar:{save:"إضافة إلى المفضلة",remove:"إزالة من المفضلة",login:"سجّل الدخول لحفظ الأنشطة المفضلة.",saved:"أُضيف إلى المفضلة",removed:"أُزيل من المفضلة",error:"تعذّر حفظ النشاط المفضل."},
 es:{save:"Añadir a favoritos",remove:"Quitar de favoritos",login:"Inicia sesión para guardar favoritos.",saved:"Añadido a favoritos",removed:"Eliminado de favoritos",error:"No se pudo guardar el favorito."}
}[lang];
let db,user=null,items=new Set(),busy=new Set();
const key="ims-demo-fav-pending";
const css=document.createElement("style");css.textContent='.ims-fav-target{position:relative!important}.ims-fav-heart{position:absolute;z-index:20;top:12px;inset-inline-end:12px;min-width:40px;min-height:40px;width:40px;height:40px;display:grid;place-items:center;padding:0!important;margin:0!important;border-radius:50%!important;background:#faf9f0f2!important;border:1.5px solid #c6a43f!important;box-shadow:0 3px 13px #102f2638;color:#27513c!important;font-size:24px!important;cursor:pointer;line-height:1!important}.ims-fav-heart[aria-pressed=true]{background:#c6a43f!important;color:#103724!important}.ims-fav-heart:focus-visible{outline:3px solid #ceaa3d;outline-offset:3px}.ims-fav-detail{position:relative;display:inline-flex;align-items:center;gap:8px;margin:12px 0!important;border:1.5px solid #c6a43f!important;border-radius:12px!important;background:#113929!important;color:#f5db8b!important;padding:10px 17px!important;font-weight:800!important;font-size:14px!important}.ims-fav-detail[aria-pressed=true]{background:#d9b65a!important;color:#17392e!important}@media(max-width:600px){.ims-fav-heart{top:8px;inset-inline-end:8px;width:38px;height:38px;min-height:38px}}';document.head.append(css);const pro=document.createElement("link");pro.rel="stylesheet";pro.href="/css/ims-favorites-pro.css?v=20261013hearts-v1";document.head.append(pro);
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
function matchLink(a){if(!a)return null;try{let u=new URL(a.getAttribute("href"),location.href);if(u.origin!==location.origin)return null;let match=u.pathname.match(/\/(fr|en|ar|es)\/(rafting|camping|randonnee|vtt|quad|hebergement)\.html$/);return match?.[2]||null}catch(e){return null}}
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
 document.querySelectorAll("main .activity-card,main .experience-card,main .tour-card,main .program-card,main .service-card").forEach(card=>{
  const links=Array.from(card.querySelectorAll("a[href]"));
  const slug=links.map(matchLink).find(Boolean);
  if(slug)addHeart(slug,card);
 });
 const slug=location.pathname.match(/\/(rafting|camping|randonnee|vtt|quad|hebergement)\.html$/)?.[1];
 if(slug&&!document.getElementById("imsFavDetailButton")){
  const h=document.querySelector("main h1")||document.querySelector("h1");
  if(h){let b=button(slug,true);b.id="imsFavDetailButton";h.insertAdjacentElement("afterend",b)}
 }
}
async function setup(){if(db)return db;let sdk=await import("https://esm.sh/@supabase/supabase-js@2");db=sdk.createClient("https://ktrcrfoywokuuwzwnqsu.supabase.co","sb_publishable_GS2PtVM4vBv7epvV6aZSpA_XQyD9bCj");let {data}=await db.auth.getSession();user=data.session?.user||null;db.auth.onAuthStateChange((_evt,s)=>{user=s?.user||null;refresh().catch(console.warn)});return db}
async function refresh(){if(!db)return;items.clear();if(user){let {data,error}=await db.from("member_favorites").select("item_slug").eq("user_id",user.id);if(!error)(data||[]).forEach(x=>items.add(x.item_slug));rerender();let pending=sessionStorage.getItem(key);if(catalog.includes(pending)){sessionStorage.removeItem(key);await store(pending,!items.has(pending))}}else rerender()}
async function store(slug,add){busy.add(slug);try{const r=add?await db.from("member_favorites").insert({user_id:user.id,item_slug:slug}):await db.from("member_favorites").delete().eq("user_id",user.id).eq("item_slug",slug);if(r.error)throw r.error;if(add)items.add(slug);else items.delete(slug);rerender();message(add?tags.saved:tags.removed);window.dispatchEvent(new CustomEvent("ims:favorites-changed",{detail:{items:Array.from(items)}}))}catch(e){console.error(e);message(tags.error)}finally{busy.delete(slug)}}
async function toggle(slug){if(busy.has(slug))return;try{await setup();if(!user){sessionStorage.setItem(key,slug);message(tags.login);let login=document.querySelector(".ims-member-entry");if(login)login.click();else location.href="/members.html?lang="+lang;return}await store(slug,!items.has(slug))}catch(e){console.error(e);message(tags.error)}}
function init(){place();setup().then(refresh).catch(console.warn)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();