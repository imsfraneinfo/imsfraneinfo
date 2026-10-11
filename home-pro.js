/* Demo Homepage: slideshow using the original five photos, mobile swipes, keyboard and reduced-motion support. */
(function(){
"use strict";
var hero=document.querySelector(".hp-home .hp-hero-slider");
if(!hero)return;
var slides=Array.prototype.slice.call(hero.querySelectorAll(".hp-slide"));
var dots=Array.prototype.slice.call(hero.querySelectorAll(".hp-slide-dot"));
var arrows=Array.prototype.slice.call(hero.querySelectorAll(".hp-slide-arrow"));
if(!slides.length||slides.length!==dots.length)return;
var index=0, timer=null, paused=false;
var motion=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)");
var observer=null, inView=true, touchStart=null;
function show(next){
 index=((next%slides.length)+slides.length)%slides.length;
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
function shouldPlay(){return !paused&&inView&&!document.hidden&&!(motion&&motion.matches)}
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
show(0);start()
})();