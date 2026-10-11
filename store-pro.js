/* Imsfrane Demo shop · catalog, search, sorting, accessible basket and direct WhatsApp enquiry. */
(function(){
"use strict";
var root=document.getElementById("imsfrane-shop"),catalog=document.getElementById("spCatalog");
if(!root||!catalog)return;
var config;
try{config=JSON.parse(catalog.textContent)}catch(e){return}
var language=(document.documentElement.lang||"fr").toLowerCase().startsWith("en")?"en":"fr";
var i18n=language==="fr"?{
 count:"produits",single:"produit",cartEmpty:"Votre panier attend ses premières découvertes.",
 qty:"Quantité",remove:"Retirer",added:"Produit ajouté au panier",removed:"Produit retiré du panier",
 messageTitle:"DEMANDE DE COMMANDE — BOUTIQUE IMSFRANE",confirmation:"Merci de confirmer la disponibilité, les quantités, le conditionnement, le prix final et la livraison."
}:{
 count:"products",single:"product",cartEmpty:"Your basket is waiting for its first discoveries.",
 qty:"Quantity",remove:"Remove",added:"Added to basket",removed:"Removed from basket",
 messageTitle:"ORDER REQUEST — IMSFRANE SHOP",confirmation:"Please confirm availability, quantities, packaging, final price and delivery options."
};
var $=function(selector){return root.querySelector(selector)};
var products=config.products||[],productById=Object.create(null);
products.forEach(function(product){productById[product.id]=product});
var qtyById=Object.create(null),currentCategory="all",cards=[].slice.call(root.querySelectorAll(".sp-card"));
var search=$("#sp-search"),sort=$("#sp-sort"),results=$("#sp-results"),grid=$("#sp-grid"),empty=$("#sp-no-results");
var cart=$("#sp-cart"),backdrop=$("#sp-backdrop"),cartItems=$("#sp-cart-list"),toast=$("#sp-toast");
var lastFocus=null,toastTimer=null;
function money(number){return new Intl.NumberFormat(language==="fr"?"fr-FR":"en-GB",{maximumFractionDigits:0}).format(number)+" MAD"}
function count(){return products.reduce(function(total,p){return total+(qtyById[p.id]||0)},0)}
function sum(){return products.reduce(function(total,p){return total+(qtyById[p.id]||0)*p.price},0)}
function nameOf(p){return p[language==="fr"?"nameFr":"nameEn"]}
function unitOf(p){return p[language==="fr"?"unitFr":"unitEn"]}
function node(tag,className,text){
  var el=document.createElement(tag);
  if(className)el.className=className;
  if(text!==undefined)el.textContent=text;
  return el
}
function showToast(text){
  toast.textContent=text;
  toast.hidden=false;
  if(toastTimer!==null)clearTimeout(toastTimer);
  toastTimer=setTimeout(function(){toast.hidden=true},2400)
}
function updateFilters(){
 var term=search.value.toLocaleLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
 var match=0;
 var sorted=cards.slice();
 if(sort.value==="asc"||sort.value==="desc"){
   sorted.sort(function(a,b){
     return sort.value==="asc"?(Number(a.dataset.price)-Number(b.dataset.price)):(Number(b.dataset.price)-Number(a.dataset.price))
   })
 }
 sorted.forEach(function(card){
  var hay=(card.dataset.search||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  var show=(currentCategory==="all"||card.dataset.category===currentCategory)&&(!term||hay.indexOf(term)>-1);
  card.hidden=!show;
  if(show)match++;
  grid.appendChild(card)
 });
 [].slice.call(root.querySelectorAll("[data-category][aria-pressed]")).forEach(function(button){
   button.setAttribute("aria-pressed",String(button.dataset.category===currentCategory))
 });
 results.textContent=match+" "+(match===1?i18n.single:i18n.count);
 empty.hidden=match!==0
}
function categoryChosen(value){
 currentCategory=["all","honey","oil","herbs"].indexOf(value)>-1?value:"all";
 updateFilters()
}
root.addEventListener("click",function(ev){
 var filter=ev.target.closest(".sp-cat[data-category],.sp-chip[data-category]");
 if(filter&&root.contains(filter)){categoryChosen(filter.dataset.category);return}
 var add=ev.target.closest("button[data-add]");
 if(add&&root.contains(add)){
   var id=add.dataset.add;if(!productById[id])return;
   qtyById[id]=Math.min(99,(qtyById[id]||0)+1);
   renderCart();showToast(i18n.added);return
 }
 var delta=ev.target.closest("button[data-cart-delta]");
 if(delta&&cart.contains(delta)){
   var key=delta.dataset.cartDelta;
   if(!productById[key])return;
   qtyById[key]=Math.max(0,Math.min(99,(qtyById[key]||0)+Number(delta.dataset.delta)));
   renderCart();return
 }
 var remove=ev.target.closest("button[data-cart-remove]");
 if(remove&&cart.contains(remove)){qtyById[remove.dataset.cartRemove]=0;renderCart();showToast(i18n.removed)}
});
search.addEventListener("input",updateFilters);
sort.addEventListener("change",updateFilters);
$("#sp-clear").addEventListener("click",function(){search.value="";sort.value="featured";categoryChosen("all");search.focus()});
function renderCart(){
 var n=count();
 $("#sp-cart-count").textContent=String(n);
 $("#sp-mobile-count").textContent=String(n);
 $("#sp-total").textContent=money(sum());
 $("#sp-checkout").disabled=n===0;
 cartItems.replaceChildren();
 var chosen=products.filter(function(p){return qtyById[p.id]>0});
 if(!chosen.length){cartItems.appendChild(node("p","sp-cart-empty",i18n.cartEmpty));return}
 chosen.forEach(function(p){
   var item=node("div","sp-cart-line");
   var picture=node("img");picture.src="../images/"+p.image;picture.alt=nameOf(p);picture.loading="lazy";
   item.appendChild(picture);
   var details=node("div");
   details.appendChild(node("div","sp-cart-product-title",nameOf(p)));
   details.appendChild(node("div","sp-cart-product-price",money(p.price)+" · "+unitOf(p)));
   var actions=node("div","sp-cart-line-controls");
   var stepper=node("div","sp-qty");
   var minus=node("button",null,"−");minus.type="button";minus.dataset.cartDelta=p.id;minus.dataset.delta="-1";minus.setAttribute("aria-label","− "+nameOf(p));minus.disabled=qtyById[p.id]<=0;
   var amount=node("output",null,String(qtyById[p.id]));
   var plus=node("button",null,"+");plus.type="button";plus.dataset.cartDelta=p.id;plus.dataset.delta="1";plus.disabled=qtyById[p.id]>=99;plus.setAttribute("aria-label","+ "+nameOf(p));
   stepper.append(minus,amount,plus);
   var del=node("button","sp-remove",i18n.remove);del.type="button";del.dataset.cartRemove=p.id;del.setAttribute("aria-label",i18n.remove+" "+nameOf(p));
   actions.append(stepper,del);details.appendChild(actions);item.appendChild(details);cartItems.appendChild(item)
 })
}
function openCart(){
 lastFocus=document.activeElement;
 backdrop.hidden=false;cart.hidden=false;cart.setAttribute("aria-hidden","false");
 $("#sp-cart-close").focus()
}
function closeCart(){
 backdrop.hidden=true;cart.hidden=true;cart.setAttribute("aria-hidden","true");
 if(lastFocus&&typeof lastFocus.focus==="function")lastFocus.focus()
}
$("#sp-cart-open").addEventListener("click",openCart);
$("#sp-mobile-cart").addEventListener("click",openCart);
$("#sp-cart-close").addEventListener("click",closeCart);
backdrop.addEventListener("click",closeCart);
document.addEventListener("keydown",function(ev){
 if(cart.hidden)return;
 if(ev.key==="Escape"){ev.preventDefault();closeCart();return}
 if(ev.key!=="Tab")return;
 var focusables=[].slice.call(cart.querySelectorAll("button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled)"));
 if(!focusables.length)return;
 if(ev.shiftKey&&document.activeElement===focusables[0]){ev.preventDefault();focusables[focusables.length-1].focus()}
 else if(!ev.shiftKey&&document.activeElement===focusables[focusables.length-1]){ev.preventDefault();focusables[0].focus()}
});
$("#sp-checkout").addEventListener("click",function(){
 var chosen=products.filter(function(p){return qtyById[p.id]>0});
 if(!chosen.length)return;
 var lines=["*"+i18n.messageTitle+"*",""];
 chosen.forEach(function(p){lines.push("• "+nameOf(p)+" × "+qtyById[p.id]+" — "+money(qtyById[p.id]*p.price)+" ("+unitOf(p)+")")});
 lines.push("","*TOTAL "+(language==="fr"?"INDICATIF":"ESTIMATE")+": "+money(sum())+"*","",i18n.confirmation);
 window.location.assign("https://wa.me/"+config.whatsapp+"?text="+encodeURIComponent(lines.join("\n")))
});
updateFilters();renderCart()
})();
