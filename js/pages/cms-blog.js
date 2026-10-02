(function(){
  const lang=document.documentElement.lang==='en'?'en':'fr';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const when=v=>{const d=new Date(v);return isNaN(d)?null:d};
  const live=a=>a.published!==false && (!when(a.publish_at)||when(a.publish_at)<=new Date());
  const date=v=>{const d=when(v);return d?new Intl.DateTimeFormat(lang==='fr'?'fr-FR':'en-GB',{day:'numeric',month:'long',year:'numeric'}).format(d):''};
  fetch('../content/blog-'+lang+'.json?'+Date.now()).then(r=>r.ok?r.json():Promise.reject()).then(data=>{
    const grid=document.querySelector('.blog-grid'); if(!grid)return;
    (data.articles||[]).filter(live).sort((a,b)=>new Date(b.publish_at)-new Date(a.publish_at)).forEach(a=>{
      const card=document.createElement('article'); card.className='blog-card cms-blog-card';
      card.innerHTML='<div class="blog-card-image"><img loading="lazy" decoding="async" src="'+esc(a.image||'../images/21.webp')+'" alt="'+esc(a.title)+'"></div><div class="blog-card-content"><div class="blog-meta"><span><i class="fa-regular fa-calendar"></i><span>'+esc(date(a.publish_at))+'</span></span><span><i class="fa-solid fa-tag"></i><span>'+esc(a.category||'')+'</span></span></div><h2>'+esc(a.title)+'</h2><p>'+esc(a.summary||'')+'</p><a class="blog-read-button" href="blog-post.html?slug='+encodeURIComponent(a.slug||'')+'"><span>'+(lang==='fr'?'Lire l’article':'Read article')+'</span><i class="fa-solid fa-arrow-right"></i></a></div>';
      grid.prepend(card);
    });
  }).catch(()=>{});
})();
