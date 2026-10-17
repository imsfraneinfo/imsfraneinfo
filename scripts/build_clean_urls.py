#!/usr/bin/env python3
"""Create GitHub Pages clean URLs for all four locales while retaining old links."""
import html
import re
import sys
from datetime import date
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit
from xml.etree import ElementTree as ET

HOST = "https://imsfrane.com"
LANGUAGES = ("fr", "en", "ar", "es")
# These are dynamic CMS/query-string templates rather than standalone articles.
EXCLUDE = {"article.html", "blog-post.html"}
MARKER = "<!-- IMSFRANE_CLEAN_URL_REDIRECT -->"
PRIMARY = ("index.html","about.html","blog.html","rafting.html","randonnee.html",
           "camping.html","vtt.html","quad.html","programme.html","booking.html",
           "guide.html","hebergement.html","memories.html","contact.html","store.html")
ATTR = re.compile(r"""(?P<attr>\b(?:href|src|poster|action|formaction|data-src|data-href|srcset|imagesrcset))(?P<eq>\s*=\s*)(?P<q>["'])(?P<val>.*?)(?P=q)""",re.I|re.S)
CSS = re.compile(r"""url\(\s*(?P<q>["']?)(?P<val>[^)'"\s]+)(?P=q)\s*\)""",re.I)
JS_ASSET = re.compile(r"""(?P<q>["'])(?P<path>(?:\.\./)+(?:images|css|js|fonts|content|posts|fr|en|es|ar)/[^"']+|(?:\./)?(?:images|css|js|fonts)/[^"']+)(?P=q)""")

def clean(path, files):
    m = re.fullmatch(r"/(fr|en|ar|es)/([^/?#]+\.html)", path)
    if not m or m[2] not in files[m[1]]:
        return path
    return "/"+m[1]+"/" + ("" if m[2]=="index.html" else m[2][:-5]+"/")

def local(uri, base, files):
    uri = html.unescape(uri.strip())
    if not uri or uri.startswith(("#","//","data:","blob:","mailto:","tel:","sms:","javascript:")):
        return uri
    u = urlsplit(uri)
    if (u.scheme and u.scheme not in ("http","https")) or (u.netloc and u.netloc.lower() not in ("imsfrane.com","www.imsfrane.com")):
        return uri
    absurl = urlsplit(urljoin(base,uri))
    if absurl.netloc.lower() not in ("imsfrane.com","www.imsfrane.com"):
        return uri
    return urlunsplit(("","",clean(absurl.path,files),absurl.query,absurl.fragment))

def transform(doc, lang, filename, files):
    base=HOST+"/"+lang+"/"+filename
    def attr_replace(m):
        val=m["val"]
        if m["attr"].lower() in ("srcset","imagesrcset"):
            # A data URI contains a comma inside the URL, not between candidates.
            if val.lstrip().startswith("data:"):
                return m[0]
            chunks=[]
            for item in val.split(","):
                parts=re.match(r"^(\s*)(\S+)(.*)$",item,re.S)
                if parts:
                    a,b,c=parts.groups()
                    chunks.append(a+html.escape(local(b,base,files),quote=True)+c)
                else:chunks.append(item)
            result=",".join(chunks)
        else:
            result=html.escape(local(val,base,files),quote=True)
        return m["attr"]+m["eq"]+m["q"]+result+m["q"]
    doc=ATTR.sub(attr_replace,doc)
    doc=CSS.sub(lambda m:"url("+m["q"]+local(m["val"],base,files)+m["q"]+")",doc)
    doc=JS_ASSET.sub(lambda m:m["q"]+local(m["path"],base,files)+m["q"],doc)
    # Also update absolute internal links in Open Graph and JSON-LD data.
    for l,names in files.items():
        for name in sorted(names,key=len,reverse=True):
            old="/"+l+"/"+name
            new=clean(old,files)
            if old!=new:doc=doc.replace(old,new)
    # Handle static relative JS links; leave template data-nav-active untouched.
    for name in sorted(files[lang],key=len,reverse=True):
        path=clean("/"+lang+"/"+name,files)
        doc=re.sub(r"""(?P<q>["'])"""+re.escape(name)+r"""(?P=q)""",
                   lambda m:m["q"]+path+m["q"],doc)
    doc=re.sub(r"""<link\b(?=[^>]*\brel\s*=\s*["']canonical["'])[^>]*>""","",doc,flags=re.I)
    # Restore the page filename used for active-menu state in existing UI.
    clean_active = clean("/"+lang+"/"+filename,files)
    doc = doc.replace('data-nav-active="'+clean_active+'"',
                      'data-nav-active="'+filename+'"')
    if "</head>" not in doc:
        raise RuntimeError("No head end: "+lang+"/"+filename)
    doc=doc.replace("</head>",'<link rel="canonical" href="'+HOST+clean("/"+lang+"/"+filename,files)+'"/></head>',1)
    # Discovery metadata must stay absolute even when navigation is root-relative.
    def absolute_metadata(m):
        tag = m[0]
        if "hreflang" in tag or 'rel="canonical"' in tag:
            tag = re.sub(r'(href=["\'])(/[^/][^"\']*)', r'\1' + HOST + r'\2', tag)
        return tag
    doc = re.sub(r"<link\b[^>]*>", absolute_metadata, doc, flags=re.I)
    doc = re.sub(r'(<meta\b(?=[^>]*property=["\']og:url["\'])[^>]*content=["\'])(/[^/][^"\']*)',
                 r'\1' + HOST + r'\2', doc)
    return doc

def old_redirect(lang,filename):
    url="/"+lang+"/"+filename[:-5]+"/"
    return ('<!doctype html>\n'+MARKER+'\n<html lang="'+lang+'"><head>'
            '<meta charset="utf-8"><meta name="robots" content="noindex,follow">'
            '<meta http-equiv="refresh" content="0;url='+url+'">'
            '<link rel="canonical" href="'+HOST+url+'">'
            '<script>location.replace('+repr(url)+'+location.search+location.hash);</script>'
            '</head><body><a href="'+url+'">Open the updated page</a></body></html>\n')

def build_sitemap(files):
    ns="http://www.sitemaps.org/schemas/sitemap/0.9"
    x="http://www.w3.org/1999/xhtml"
    ET.register_namespace("",ns)
    ET.register_namespace("xhtml",x)
    out=ET.Element("{"+ns+"}urlset")
    names=sorted(set().union(*files.values()),key=lambda s:(PRIMARY.index(s) if s in PRIMARY else len(PRIMARY),s))
    for name in names:
        available=[l for l in LANGUAGES if name in files[l]]
        default="en" if "en" in available else available[0]
        for l in available:
            item=ET.SubElement(out,"{"+ns+"}url")
            ET.SubElement(item,"{"+ns+"}loc").text=HOST+clean("/"+l+"/"+name,files)
            ET.SubElement(item,"{"+ns+"}lastmod").text=date.today().isoformat()
            for t in available:
                ET.SubElement(item,"{"+x+"}link",{"rel":"alternate","hreflang":t,
                               "href":HOST+clean("/"+t+"/"+name,files)})
            ET.SubElement(item,"{"+x+"}link",{"rel":"alternate","hreflang":"x-default",
                           "href":HOST+clean("/"+default+"/"+name,files)})
    return '<?xml version="1.0" encoding="UTF-8"?>\n'+ET.tostring(out,encoding="unicode")+"\n"

def main(root):
    files={}
    for l in LANGUAGES:
        folder=root/l
        if not folder.is_dir():raise RuntimeError("Missing language "+l)
        files[l]={p.name for p in folder.glob("*.html") if p.name not in EXCLUDE}
        if not {"index.html","camping.html","booking.html","blog.html"}.issubset(files[l]):
            raise RuntimeError("Missing core pages in "+l)
    pages=0
    for l in LANGUAGES:
        for name in sorted(files[l]):
            old=root/l/name
            source=old.read_text(encoding="utf-8")
            if name!="index.html" and MARKER in source:
                source=(root/l/name[:-5]/"index.html").read_text(encoding="utf-8")
            converted=transform(source,l,name,files)
            dest=old if name=="index.html" else root/l/name[:-5]/"index.html"
            dest.parent.mkdir(parents=True,exist_ok=True)
            dest.write_text(converted,encoding="utf-8")
            if name!="index.html":old.write_text(old_redirect(l,name),encoding="utf-8")
            pages+=1
    entry=root/"index.html"
    s=entry.read_text(encoding="utf-8")
    s=s.replace('code + "/index.html"','code + "/"').replace('"en/index.html"','"/en/"')
    for l in LANGUAGES:s=s.replace(l+"/index.html",l+"/")
    entry.write_text(s,encoding="utf-8")
    xml=build_sitemap(files)
    (root/"sitemap.xml").write_text(xml,encoding="utf-8")
    # Check XML references are self-consistent and all public pages have a route.
    tree=ET.fromstring(xml)
    locs=[e.text for e in tree.iter() if e.tag.endswith("}loc")]
    alts=[e.get("href") for e in tree.iter() if e.tag.endswith("}link")]
    if pages<150 or len(locs)!=pages or len(set(locs))!=pages or any(a not in locs for a in alts):
        raise RuntimeError("Sitemap missing pages or has wrong alternates")
    for l in LANGUAGES:
        if HOST+"/"+l+"/" not in locs:raise RuntimeError("Missing homepage "+l)
        for name in ("camping","rafting","booking","blog"):
            p=root/l/name/"index.html"
            contents=p.read_text(encoding="utf-8")
            if '<link rel="canonical" href="'+HOST+"/"+l+"/"+name+'/"/>' not in contents:
                raise RuntimeError("Canonical wrong in "+str(p))
            for m in ATTR.finditer(contents):
                if m["attr"].lower() in ("srcset","imagesrcset"):continue
                val=html.unescape(m["val"])
                if val and not val.startswith(("/","#","data:","mailto:","tel:","sms:","http:","https:","blob:","javascript:")):
                    raise RuntimeError("Unresolved relative asset/link "+repr(val[:80])+" in "+str(p))
            if MARKER not in (root/l/(name+".html")).read_text(encoding="utf-8"):
                raise RuntimeError("Old link not preserved in "+l+"/"+name)
    if (root/"CNAME").read_text(encoding="utf-8").strip()!="imsfrane.com":
        raise RuntimeError("Official domain protection failed")
    print("Published",pages,"SEO pages with clean URLs; protected",pages-len(LANGUAGES),"legacy links.")

if __name__=="__main__":
    main(Path(sys.argv[1]) if len(sys.argv)>1 else Path("."))
