"""Publish the owner-approved accommodation and booking release from a pinned demo."""
from pathlib import Path
import subprocess,sys,re,xml.etree.ElementTree as ET
root=Path.cwd()
source=Path(sys.argv[1]).resolve()
subprocess.run([sys.executable,str(source/'build_stays_demo.py'),str(root)],check=True)
changed=subprocess.check_output(['git','ls-files','--modified','--others','--exclude-standard'],text=True).splitlines()
for name in changed:
 p=root/name
 if not p.is_file() or p.suffix not in {'.html','.css','.js','.json'}:continue
 s=p.read_text()
 s=s.replace('https://imsfraneinfo.github.io/Imsfrane-demo/','https://imsfrane.com/').replace('/Imsfrane-demo/','/')
 generated=p.suffix=='.html' and (name.startswith(('apartment-content-','gite-content-')) or any('/'+r in name for r in ['hebergement/','hebergements/','gite-atlas/','booking/']) or name.endswith(('hebergement.html','booking.html')))
 if generated:
  s=re.sub(r'<meta\b[^>]*name=["\']robots["\'][^>]*>','',s,flags=re.I)
  if not name.startswith(('apartment-content-','gite-content-')):
   url='https://imsfrane.com/'+name.removesuffix('index.html')
   s=re.sub(r'<link\b[^>]*rel=["\']canonical["\'][^>]*>','',s,flags=re.I)
   s=s.replace('</head>',f'<link rel="canonical" href="{url}"></head>')
 p.write_text(s)
# Add the new indexable accommodation URLs to the production sitemap.
p=root/'sitemap.xml'
if p.exists():
 ns='http://www.sitemaps.org/schemas/sitemap/0.9';ET.register_namespace('',ns)
 tree=ET.parse(p);node=tree.getroot();existing={e.text for e in node.iter('{'+ns+'}loc')}
 for lang in ['fr','en','es','ar']:
  for route in ['hebergement','hebergements','gite-atlas','booking']:
   url=f'https://imsfrane.com/{lang}/{route}/'
   if url not in existing:ET.SubElement(ET.SubElement(node,'{'+ns+'}url'),'{'+ns+'}loc').text=url
 tree.write(p,encoding='utf-8',xml_declaration=True)
# Fail before publication if a demo URL or empty image remains.
for name in changed:
 p=root/name
 if p.is_file() and p.suffix in {'.html','.css','.js','.json'}:
  assert '/Imsfrane-demo/' not in p.read_text(),name
for lang in ['fr','en','es','ar']:
 s=(root/lang/'gite-atlas/index.html').read_text();assert 'noindex' not in s
 s=(root/f'gite-content-{lang}.html').read_text();assert s.count('class="gite-slide"')==18
 s=(root/lang/'booking/index.html').read_text();assert 'gite250' in s
for p in (root/'images/gite-atlas').glob('*.webp'):assert p.stat().st_size>0,p
assert (root/'CNAME').read_text().strip()=='imsfrane.com'
print('Approved stays and booking release validated for imsfrane.com')

# Inline social icons remain visible when the external icon font is unavailable.
icons={
 'fa-facebook-f':'<path d="M14 21v-8h3l.5-4H14V7c0-1 .4-1.5 1.7-1.5H18V2.2C17.3 2.1 16.2 2 15 2c-3 0-5 1.8-5 5v2H7v4h3v8z"/>',
 'fa-instagram':'<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2"/>',
 'fa-tiktok':'<path d="M14 2h3c.3 2.2 1.8 3.7 4 4v3a9 9 0 0 1-4-1v8a6 6 0 1 1-6-6v3a3 3 0 1 0 3 3z"/>',
 'fa-whatsapp':'<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.4 14.7l-.4-.3-2.3.6.6-2.2-.3-.5A8 8 0 0 1 12 4z"/><path d="M8.1 6.8c-.4 0-1.1.7-1.1 1.8 0 2.4 3.3 6.1 6.5 7.3 1.6.6 3.1-.2 3.5-1.5.1-.4-.1-.6-.5-.8l-1.9-.9c-.3-.1-.5 0-.7.3l-.7.9c-.2.2-.4.2-.7.1-1.3-.6-2.5-1.6-3.2-2.9-.2-.3-.1-.4.1-.6l.6-.8c.2-.2.2-.4.1-.7l-.9-2c-.2-.3-.4-.3-1.1-.2z"/>',
 'fa-chevron-up':'<path d="m5 15 7-7 7 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'
}
def inline_icon(match):
 classes=match[1].split()
 for key,paths in icons.items():
  if key in classes:
   return '<svg xmlns="http://www.w3.org/2000/svg" class="ims-inline-social" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true" focusable="false" style="display:inline-block;flex-shrink:0;vertical-align:middle">'+paths+'</svg>'
 return match[0]
for page in root.rglob('*.html'):
 if '.git' in page.parts:continue
 html=page.read_text()
 html=re.sub(r'<i\b[^>]*class="([^"]*)"[^>]*>\s*</i>',inline_icon,html)
 page.write_text(html)

# Repair duplicated accommodation fragments left by repeated older builds.
# Keep the first complete section; the next label belongs inside the same nav.
menu_pattern=re.compile(r'(<section class="stay-menu">.*?</section>).*?(?=<span class="atnav-label atnav-label-separated">)',re.S)
repaired=0
for page in root.rglob('*.html'):
 if '.git' in page.parts:continue
 html=page.read_text()
 fixed=menu_pattern.sub(lambda m:m[1],html)
 if fixed!=html:
  page.write_text(fixed);repaired+=1
 if 'id="atnavAccommodation"' in fixed:
  assert fixed.count('id="atnavAccommodation"')==1,page
  section=re.search(r'<section class="stay-menu">.*?</section>',fixed,re.S)[0]
  assert section.count('class="atnav-submenu-link"')==2,page
print(f'Repaired accommodation navigation on {repaired} pages')

# Repeated releases must not duplicate the gite favorite hook.
favorite=root/'js/ims-favorites-demo.js'
code=favorite.read_text()
hook=re.compile(r'      const frame=document.getElementById\("giteExperienceFrame"\);.*?      placeGite\(\);',re.S)
matches=list(hook.finditer(code))
if len(matches)>1:
 first=matches[0].start()
 code=code[:first]+matches[0][0]+hook.sub('',code[matches[0].end():])
favorite.write_text(code)
subprocess.run(['node','--check',str(favorite)],check=True)
nav=root/'navigation-pro.js'
nav.write_text(re.sub(r'ims-favorites-demo\.js\?[^"]*','ims-favorites-demo.js?v=menu-fix-20261102',nav.read_text()))
for page in root.rglob('*.html'):
 if '.git' in page.parts:continue
 html=page.read_text()
 html=re.sub(r'navigation-pro\.js\?[^"\s>]*','navigation-pro.js?v=menu-fix-20261102',html)
 page.write_text(html)
