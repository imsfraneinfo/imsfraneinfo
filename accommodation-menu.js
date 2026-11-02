(function(){
function init(){
 var button=document.getElementById('atnavAccommodation'),list=document.getElementById('atnavAccommodationList');
 if(!button||!list)return;
 button.addEventListener('click',function(){
  var open=button.getAttribute('aria-expanded')!=='true';
  button.setAttribute('aria-expanded',String(open));
  list.classList.toggle('is-collapsed',!open);
  list.setAttribute('aria-hidden',String(!open));
  list.inert=!open;
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();