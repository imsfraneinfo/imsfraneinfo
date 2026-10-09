/* Imsfrane image controls — editable from CloudCannon per page. */
(()=>{'use strict';
const page=location.pathname.replace(/\/$/,'/index.html').split('/').filter(Boolean);
const name=page.length>1 && /^(fr|en)$/.test(page[0]) ? page[0]+'-'+(page[page.length-1].replace(/\.html$/,'')||'index') : 'home';
const prefix=page.length>1 && /^(fr|en)$/.test(page[0]) ? '../' : '';
const css=document.createElement('style');css.textContent='[data-image-control]{--im-x:50%;--im-y:50%;--im-z:1}img[data-image-control]{object-fit:cover!important;object-position:var(--im-x) var(--im-y)!important;transform:scale(var(--im-z));transform-origin:var(--im-x) var(--im-y)}[data-image-control]:not(img){background-position:var(--im-x) var(--im-y)!important;background-size:cover!important}';document.head.append(css);
function apply(data){for(const item of data.images||[]){const el=document.querySelector('[data-image-control="'+CSS.escape(item.id)+'"]');if(!el)continue;const x=Math.max(0,Math.min(100,Number(item.position_x)||0)),y=Math.max(0,Math.min(100,Number(item.position_y)||0)),z=Math.max(100,Math.min(200,Number(item.zoom)||100));el.style.setProperty('--im-x',x+'%');el.style.setProperty('--im-y',y+'%');el.style.setProperty('--im-z',z/100);if(item.fit==='contain'&&el.tagName==='IMG')el.style.setProperty('object-fit','contain','important');}}
fetch(prefix+'image-settings/'+encodeURIComponent(name)+'.json',{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(d=>{if(d)apply(d)}).catch(()=>{});
})();
