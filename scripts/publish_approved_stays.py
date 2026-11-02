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
