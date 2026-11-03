"""Publish the approved Programme and shared footer from one pinned demo revision.
Run from the official checkout. It never copies the rest of the demo website.
"""
from pathlib import Path
from contextlib import contextmanager
from types import ModuleType
from bs4 import BeautifulSoup
import json,re,os,subprocess,sys
APPROVED_DEMO_COMMIT='5303f808ff19bacbbd550806d53a116d507e3f2d'
@contextmanager
def working(path):
 old=Path.cwd();os.chdir(path)
 try:yield
 finally:os.chdir(old)
def load(source,name,official_origin=False):
 code=(source/(name+'.py')).read_text()
 if official_origin:code=code.replace('https://imsfraneinfo.github.io','https://imsfrane.com')
 module=ModuleType(name);module.__file__=str(source/(name+'.py'))
 exec(compile(code,module.__file__,'exec'),module.__dict__)
 return module
def outside_footer(text):
 text=re.sub(r'<footer\b[^>]*>.*?</footer\s*>','',text,flags=re.S|re.I)
 text=re.sub(r'<link\b[^>]*href=["\'][^"\']*footer-pro\.css[^"\']*["\'][^>]*>','',text,flags=re.I)
 return re.sub(r'<script\b[^>]*src=["\'][^"\']*footer-pro\.js[^"\']*["\'][^>]*>.*?</script>','',text,flags=re.S|re.I)
def main():
 target=Path.cwd().resolve();source=Path(sys.argv[1]).resolve()
 actual=subprocess.check_output(['git','-C',str(source),'rev-parse','HEAD'],text=True).strip()
 assert actual==APPROVED_DEMO_COMMIT,('Unapproved demo revision',actual)
 assert (target/'CNAME').read_text().strip()=='imsfrane.com'
 before={p.relative_to(target).as_posix():p.read_text() for p in target.rglob('*.html') if '.git' not in p.parts}
 programmes={f'{lang}/{suffix}' for lang in ('fr','en','ar','es') for suffix in ('programme.html','programme/index.html')}
 with working(source):
  programme=load(source,'build_weekend_programme',True);programme.ROOT=target;programme.BASE='/'
  programme.build()
  footer=load(source,'build_footer_pro');footer.ROOT=target;footer.BASE='/'
  footer.build()
  # The small runtime language switcher must request production fragments.
  js=target/'footer-pro.js';js.write_text(js.read_text().replace('/Imsfrane-demo/','/'))
  check=load(source,'qa_footer_pro');check.ROOT=target;check.BASE='/';check.check()
 for name,old in before.items():
  if name not in programmes:
   new=(target/name).read_text()
   assert outside_footer(new)==outside_footer(old),('Unrelated page content changed',name)
 for name in programmes:
  page=(target/name).read_text();soup=BeautifulSoup(page,'html.parser')
  assert len(soup.main.select('.wk-day h2'))==3,name
  assert len(soup.main.select('.wk-stage'))==10,name
  assert not soup.main.select('h3,.wk-count'),name
  assert '18:00' in soup.main.text and '850' in soup.main.text,name
  assert all(a.contents[0].get('class')==['wk-copy'] for a in soup.main.select('.wk-stage')),name
  assert 'https://imsfrane.com/' in soup.select_one('link[rel="canonical"]')['href'],name
  assert 'noindex' not in page.lower(),name
  assert '/Imsfrane-demo/' not in page and 'imsfraneinfo.github.io' not in page,name
  assert soup.select_one('.fp-phone')['href']=='tel:+212667772551',name
 for asset in ('footer-pro.js','footer-pro.css','weekend-programme.css'):
  assert '/Imsfrane-demo/' not in (target/asset).read_text(),asset
 report=json.loads((target/'footer-build-report.json').read_text())
 report.update(approved_demo_commit=APPROVED_DEMO_COMMIT,scope='Approved weekend Programme, its photographs, and the shared footer')
 (target/'scripts/approved-programme-footer-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 (target/'footer-build-report.json').unlink()
 assert (target/'CNAME').read_text().strip()=='imsfrane.com'
 print(f"PASS: approved Programme in four languages, footer on {report['count']} pages, production paths and canonical URLs, unrelated page content unchanged.")
if __name__=='__main__':main()
