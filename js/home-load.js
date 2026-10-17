/* Non-critical homepage integrations follow visitor interaction. */
(function(){
 'use strict';
 // Keep far-off photography out of the initial network queue. Real scrolling
 // loads each photo shortly before it enters view, with its reserved geometry.
 const photos=document.querySelectorAll('img[data-home-lazy]');
 function loadPhoto(img){
  if(img.dataset.srcset)img.srcset=img.dataset.srcset;
  img.src=img.dataset.src;
  img.removeAttribute('data-home-lazy');
 }
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(e=>{if(e.isIntersecting){observer.unobserve(e.target);loadPhoto(e.target)}});
  },{rootMargin:'200px 0px'});
  photos.forEach(img=>observer.observe(img));
 }else photos.forEach(loadPhoto);
 let activated=false;
 function activate(){
  if(activated)return;
  activated=true;
  document.querySelectorAll('script[data-ims-ads][data-deferred-src]').forEach(placeholder=>{
   const script=document.createElement('script');
   script.async=true;
   script.crossOrigin='anonymous';
   script.src=placeholder.dataset.deferredSrc;
   placeholder.replaceWith(script);
  });
 }
 window.addEventListener('pointerdown',activate,{once:true,passive:true});
 window.addEventListener('keydown',activate,{once:true});
 window.addEventListener('scroll',activate,{once:true,passive:true});
})();
