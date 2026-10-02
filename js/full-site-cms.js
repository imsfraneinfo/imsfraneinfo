/* Full-site CMS loader */
(function(){
 var lang=(document.documentElement.lang||'fr').toLowerCase().startsWith('en')?'en':'fr';
 var file=(location.pathname.split('/').pop()||'index.html').split('?')[0]; var page=file.replace(/\.html$/,'');
 fetch('/content/full-site.json',{cache:'no-store'}).then(r=>r.json()).then(db=>{
   var p=(db.pages||[]).find(x=>x.name===page); if(!p)return;
   (p.texts||[]).forEach(x=>{var id=x[lang+'_id'],v=x[lang]; if(!id||v==null)return; var el=document.querySelector('[data-cms-text="'+CSS.escape(id)+'"]'); if(!el)return; for(var n of el.childNodes){if(n.nodeType===3&&n.nodeValue.trim()){n.nodeValue=n.nodeValue.replace(n.nodeValue.trim(),v);break;}}});
   (p.images||[]).forEach(x=>{var id=x[lang+'_id'],v=x[lang]; if(!id||!v)return; var el=document.querySelector('[data-cms-image="'+CSS.escape(id)+'"]'); if(el){el.src=v;el.removeAttribute('srcset');}});
 }).catch(e=>console.warn('Full CMS content unavailable',e));
})();