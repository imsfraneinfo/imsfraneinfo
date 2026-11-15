/* Demo Homepage: slideshow using the original five photos, mobile swipes, keyboard and reduced-motion support. */
(function(){
"use strict";
var hero=document.querySelector(".hp-home .hp-hero-slider");
if(!hero)return;
var slides=Array.prototype.slice.call(hero.querySelectorAll(".hp-slide"));
var dots=Array.prototype.slice.call(hero.querySelectorAll(".hp-slide-dot"));
var arrows=Array.prototype.slice.call(hero.querySelectorAll(".hp-slide-arrow"));
if(!slides.length||slides.length!==dots.length)return;
var index=0, timer=null, paused=false, engaged=false, requested=0;
var motion=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)");
var observer=null, inView=true, touchStart=null;
const pending = new WeakMap();
async function waitForPhoto(image) {
 if(typeof image.decode==="function"){
  try{await image.decode();return true}catch(error){return image.complete&&image.naturalWidth>0}
 }
 if(image.complete)return image.naturalWidth>0;
 return new Promise(function(resolve){
  function finish(){
   image.removeEventListener("load",finish);
   image.removeEventListener("error",finish);
   resolve(image.naturalWidth>0);
  }
  image.addEventListener("load",finish);
  image.addEventListener("error",finish);
 });
}
function loadPhoto(image){
 if(!image)return Promise.resolve(false);
 if(pending.has(image))return pending.get(image);
 image.loading="eager";
 if(image.dataset.src){
  if(image.dataset.srcset)image.srcset=image.dataset.srcset;
  image.src=image.dataset.src;
  delete image.dataset.src;
 }
 const photo=waitForPhoto(image).then(async function(ready){
  if(ready||!image.srcset||!image.hasAttribute("src")||image.closest("picture"))return ready;
  // Try the original full-size source if a responsive variant cannot load.
  image.removeAttribute("srcset");
  return waitForPhoto(image);
 }).finally(function(){pending.delete(image)});
 pending.set(image,photo);
 return photo;
}
async function show(next){
 const target=((next%slides.length)+slides.length)%slides.length;
 const ticket=++requested;
 if(target===index)return;
 const ready=await loadPhoto(slides[target].querySelector("img"));
 if(!ready||ticket!==requested)return;
 index=target;
 slides.forEach(function(slide,i){
   var on=i===index;
   slide.classList.toggle("is-active",on);
   slide.setAttribute("aria-hidden",String(!on));
 });
 dots.forEach(function(dot,i){
   var on=i===index;
   dot.classList.toggle("is-active",on);
   dot.setAttribute("aria-current",on?"true":"false");
 });
}
function stop(){if(timer!==null){window.clearInterval(timer);timer=null}}
function shouldPlay(){return engaged&&!paused&&inView&&!document.hidden&&!(motion&&motion.matches)}
function start(){
 stop();
 if(shouldPlay()){timer=window.setInterval(function(){show(index+1)},5500)}
}
arrows.forEach(function(button){
 button.addEventListener("click",function(){
   show(index+Number(button.dataset.slideDir||1));
   start();
 })
});
dots.forEach(function(dot){
 dot.addEventListener("click",function(){show(Number(dot.dataset.slideTo));start()})
});
hero.addEventListener("mouseenter",function(){paused=true;stop()});
hero.addEventListener("mouseleave",function(){paused=false;start()});
hero.addEventListener("focusin",function(ev){
 // Pause only for keyboard navigation; a tap on an arrow must not stop autoplay.
 if(ev.target.matches&&ev.target.matches(":focus-visible")){paused=true;stop()}
});
hero.addEventListener("focusout",function(ev){if(!hero.contains(ev.relatedTarget)){paused=false;start()}});
hero.addEventListener("keydown",function(ev){
 if(ev.target.closest("button")&&(ev.key==="ArrowRight"||ev.key==="ArrowLeft")){
   ev.preventDefault();
   show(index+(ev.key==="ArrowRight"?1:-1));start()
 }
});
hero.addEventListener("touchstart",function(ev){
 if(ev.touches.length===1)touchStart={x:ev.touches[0].clientX,y:ev.touches[0].clientY}
},{passive:true});
hero.addEventListener("touchend",function(ev){
 if(!touchStart||!ev.changedTouches.length)return;
 var dx=ev.changedTouches[0].clientX-touchStart.x;
 var dy=ev.changedTouches[0].clientY-touchStart.y;
 touchStart=null;
 if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3){show(index+(dx<0?1:-1));start()}
},{passive:true});
document.addEventListener("visibilitychange",start);
if(motion&&motion.addEventListener)motion.addEventListener("change",start);
if("IntersectionObserver" in window){
 observer=new IntersectionObserver(function(entries){inView=entries[0].isIntersecting;start()},{threshold:0.1});
 observer.observe(hero)
}
// Hidden slide photos are fetched only when needed; autoplay follows the
// visitor's first interaction, saving data during an unattended initial load.
function engage(){
 if(engaged)return;
 engaged=true;
 if(!(motion&&motion.matches)){
  loadPhoto(slides[(index+1)%slides.length].querySelector("img"));
 }
 start();
}
window.addEventListener('pointerdown',engage,{once:true,passive:true});
window.addEventListener('keydown',engage,{once:true});
window.addEventListener('scroll',engage,{once:true,passive:true});
start()
})();
