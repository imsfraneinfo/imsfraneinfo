/* Atlas editorial magazine: live search, category filters, load-more and sidebar. */
document.addEventListener('DOMContentLoaded',function(){
  const main=document.querySelector('.ij-magazine');if(!main)return;
  const cards=Array.from(main.querySelectorAll('.ij-grid .blog-card'));
  const search=main.querySelector('#ij-search-input');const filters=Array.from(main.querySelectorAll('[data-ij-filter]'));
  const more=main.querySelector('#ij-load-more');const empty=main.querySelector('#ij-empty');
  let active='all',limit=9;
  const keywords={mountain:/montagn|jebel|imsfrane|sommet|randonn|hiking|mountain|atlas|trail|vtt/i,river:/rivière|river|ahansal|gorge|oued|waterfall|cascade|rafting|kayak/i,adventure:/aventure|adventure|camping|rafting|vtt|quad|randonn|hiking|vélo|biking/i,culture:/culture|village|tilouguite|amazigh|tradition|local|patrimoine/i};
  function update(){const q=(search?.value||'').trim().toLocaleLowerCase();let found=0;cards.forEach(card=>{const txt=(card.textContent||'').toLocaleLowerCase();const match=(!q||txt.includes(q))&&(active==='all'||keywords[active].test(txt));if(match)found++;card.classList.toggle('ij-hidden',!match||found>limit)});if(empty)empty.hidden=found!==0;if(more)more.hidden=found<=limit;}
  filters.forEach(btn=>btn.addEventListener('click',()=>{active=btn.dataset.ijFilter;limit=9;filters.forEach(x=>x.classList.toggle('active',x===btn));update()}));
  if(search)search.addEventListener('input',()=>{limit=9;update()});
  if(more)more.addEventListener('click',()=>{limit+=9;update()});
  const popular=main.querySelector('#ij-popular');if(popular){cards.slice(0,5).forEach(card=>{const link=card.querySelector('h2 a')||card.querySelector('.blog-card-image a');if(!link)return;const a=document.createElement('a');a.className='ij-popular-link';a.href=link.getAttribute('href');const img=card.querySelector('.blog-card-image img');if(img){const small=img.cloneNode(false);small.removeAttribute('srcset');small.loading='lazy';a.appendChild(small)}const title=document.createElement('span');title.textContent=(card.querySelector('h2')?.textContent||'').trim();a.appendChild(title);popular.appendChild(a)})}
  // Disable older load-more implementation if present; our own handler owns the same button.
  update();
});
