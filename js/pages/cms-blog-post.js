(function(){
 const lang=document.documentElement.lang==='en'?'en':'fr', q=new URLSearchParams(location.search), slug=q.get('slug')||'';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const live=a=>a.published!==false && (!a.publish_at || new Date(a.publish_at)<=new Date());
 const fmt=v=>{const d=new Date(v);return isNaN(d)?'':new Intl.DateTimeFormat(lang==='fr'?'fr-FR':'en-GB',{day:'numeric',month:'long',year:'numeric'}).format(d)};
 fetch('../content/blog-'+lang+'.json?'+Date.now()).then(r=>r.json()).then(data=>{
   const a=(data.articles||[]).find(x=>x.slug===slug && live(x)), box=document.getElementById('cmsArticle');
   if(!a){box.innerHTML='<h1>'+(lang==='fr'?'Article introuvable':'Article not found')+'</h1>';return;}
   document.title=a.seo_title||a.title+' | Imsfrane Blog'; document.getElementById('cmsCrumb').textContent=a.title;
   const img=a.image?'<img src="'+esc(a.image)+'" alt="'+esc(a.title)+'" loading="eager">':'';
   box.innerHTML=img+'<h1>'+esc(a.title)+'</h1><p class="article-date">'+esc(fmt(a.publish_at))+'</p><div class="cms-article-body">'+String(a.body||'')+'</div><p><a class="button button-primary" href="booking.html">'+(lang==='fr'?'Réserver une expérience':'Book an experience')+'</a></p>';
   const md=document.querySelector('meta[name="description"]'); if(md&&a.seo_description)md.content=a.seo_description;
 }).catch(()=>{document.getElementById('cmsArticle').innerHTML='<h1>'+(lang==='fr'?'Erreur de chargement':'Loading error')+'</h1>'});
})();
