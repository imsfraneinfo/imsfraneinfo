(function(){
 function esc(s){return String(s||'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}
 var lang=(document.documentElement.lang||'fr').startsWith('en')?'en':'fr';
 fetch('/content/blog-posts.json',{cache:'no-store'}).then(r=>r.json()).then(db=>{
  var posts=db.posts||[];
  if(document.body.classList.contains('page-blog')){
    var host=document.querySelector('.blog-grid,.articles-grid,.posts-grid,main .container'); if(!host)return;
    posts.slice().reverse().forEach(p=>{var a=document.createElement('article');a.className='cms-blog-card';a.innerHTML='<a href="article.html?slug='+encodeURIComponent(p.slug)+'"><img src="'+esc(p.image||'/images/logo.jpeg')+'" alt=""><h2>'+esc(p['title_'+lang])+'</h2><p>'+esc(p['excerpt_'+lang])+'</p></a>';host.appendChild(a);});
  }
  if(document.body.classList.contains('page-cms-article')){
    var slug=new URLSearchParams(location.search).get('slug'),p=posts.find(x=>x.slug===slug),host=document.querySelector('#cmsArticle'); if(!p||!host)return;
    document.title=p['title_'+lang]+' | Imsfrane Cathédrale'; host.innerHTML='<h1>'+esc(p['title_'+lang])+'</h1><img class="cms-article-hero" src="'+esc(p.image||'')+'" alt=""><div class="cms-article-body">'+esc(p['body_'+lang]).replace(/\n\n/g,'</p><p>').replace(/^/,'<p>').replace(/$/,'</p>')+'</div>';
  }
 }).catch(()=>{});
})();