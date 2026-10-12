#!/usr/bin/env python3
"""Conservative fixes for confirmed localization SEO and legacy camping contact links."""
from pathlib import Path
import re, html
COUNT=0
for locale in ("ar","es"):
 for file in Path(locale).rglob("index.html"):
  s=file.read_text(encoding="utf-8")
  if "IMSFRANE_CLEAN_URL_REDIRECT" in s:continue
  def meta_fix(m):
   global COUNT
   tag=m.group(0)
   if not re.search(r'(?:name|property)="(?:description|og:description|twitter:description)"',tag,re.I):return tag
   val=re.search(r'content="([^"]*)"',tag,re.I)
   if not val:return tag
   original=html.unescape(val.group(1))
   french=re.search(r'\b(?:Histoires|Comment rejoindre|Découvrez|Conseils pratiques|Guide du|Explorez|Découvrir|Visitez)\b',original)
   if not french:return tag
   heading=re.search(r'<h1\b[^>]*>(.*?)</h1>',s,re.I|re.S)
   title=re.search(r'<title\b[^>]*>(.*?)</title>',s,re.I|re.S)
   name=html.unescape(re.sub(r'<[^>]+>',' ',heading.group(1) if heading else title.group(1) if title else "Imsfrane")).strip()
   name=re.sub(r'\s+',' ',name)[:98]
   if locale=="ar":description=name+" — استكشف مسفران وجبال الأطلس المغربي، واكتشف الأنشطة الطبيعية والنصائح المحلية المفيدة لزيارة المنطقة."
   else:description=name+" — Descubre Imsfrane y las montañas del Atlas de Marruecos, con consejos locales para preparar tu viaje."
   COUNT+=1
   return tag[:val.start(1)]+html.escape(description,quote=True)+tag[val.end(1):]
  updated=re.sub(r'<meta\b[^>]+>',meta_fix,s,flags=re.I)
  if updated!=s:file.write_text(updated,encoding="utf-8")
for locale in ("ar","es","fr","en"):
 file=Path(locale)/"camping"/"index.html"
 if not file.is_file():continue
 old=file.read_text(encoding="utf-8")
 new=old.replace('href="/contact.html"','href="/'+locale+'/contact/"')
 if new!=old:file.write_text(new,encoding="utf-8");COUNT+=1
print("Fixed metadata/link occurrences:",COUNT)
