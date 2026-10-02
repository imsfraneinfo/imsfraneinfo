/* Easy Admin content loader - generated for Imsfrane */
(function(){
  function norm(s){return (s||'').replace(/\s+/g,' ').trim();}
  function replaceExact(root, oldText, newText){
    if(!oldText || newText==null) return;
    var all=root.querySelectorAll('strong,span,div,p');
    for(var i=0;i<all.length;i++){
      var el=all[i];
      if(el.children.length===0 && norm(el.textContent)===norm(oldText)){el.textContent=newText; return;}
    }
  }
  fetch('/content/site-content.json',{cache:'no-store'}).then(function(r){return r.json();}).then(function(c){
    var lang=document.body.getAttribute('data-lang')||document.documentElement.lang||'fr'; lang=lang.indexOf('en')===0?'en':'fr';
    var m=(document.body.className||'').match(/page-(rafting|randonnee|camping|vtt|quad|hebergement)/);
    if(m && c.activities && c.activities[m[1]] && c.activities[m[1]][lang]){
      var d=c.activities[m[1]][lang], h=document.querySelector('main h1')||document.querySelector('h1');
      if(h && d.title) h.textContent=d.title;
      if(h && d.description){var p=h.parentElement&&h.parentElement.querySelector('p'); if(p)p.textContent=d.description;}
      var defaults=(window.__cmsDefaults&&window.__cmsDefaults[lang]&&window.__cmsDefaults[lang][m[1]])||[];
      (d.prices||[]).forEach(function(v,i){if(defaults[i])replaceExact(document,defaults[i],v);});
    }
    if(c.settings){
      if(c.settings.email) document.querySelectorAll('a[href^="mailto:"]').forEach(function(a){a.href='mailto:'+c.settings.email; a.textContent=c.settings.email;});
      if(c.settings.whatsapp) document.querySelectorAll('a[href*="wa.me/"]').forEach(function(a){a.href=a.href.replace(/wa\.me\/\d+/, 'wa.me/'+c.settings.whatsapp);});
      if(c.settings.phone) document.querySelectorAll('a[href^="tel:"]').forEach(function(a){a.href='tel:'+c.settings.phone.replace(/\s+/g,''); a.textContent=c.settings.phone;});
    }
  }).catch(function(e){console.warn('CMS content unavailable',e);});
})();