#!/usr/bin/env python3
"""Convert CloudCannon Markdown posts into real static HTML and blog cards."""
from pathlib import Path
from datetime import date, datetime
from html import escape
import re
import yaml
import mistune

ROOT = Path(__file__).resolve().parents[1]
START = '<!-- GENERATED_CLOUDCANNON_POSTS_START -->'
END = '<!-- GENERATED_CLOUDCANNON_POSTS_END -->'

def e(v): return escape(str(v), quote=True)

def load_post(file):
    raw = file.read_text(encoding='utf-8')
    match = re.match(r'\A---\s*\n(.*?)\n---\s*\n(.*)\Z', raw, re.S)
    if not match:
        raise ValueError(f'Missing YAML front matter: {file}')
    data = yaml.safe_load(match.group(1)) or {}
    if not isinstance(data, dict): raise ValueError(f'Invalid front matter: {file}')
    data['body'] = match.group(2)
    data['slug'] = re.sub(r'[^a-z0-9-]+','-',file.stem.lower()).strip('-')
    if not data['slug']: raise ValueError(f'Invalid filename: {file}')
    return data

def published(data):
    value = data.get('published', True)
    if value is False or str(value).lower() in ('false','no','draft'): return False
    d = data.get('date')
    if isinstance(d, (date, datetime)): return d.date() <= date.today() if isinstance(d,datetime) else d <= date.today()
    if d:
        try: return date.fromisoformat(str(d)[:10]) <= date.today()
        except ValueError: pass
    return True

def image_url(path):
    path = str(path or '/images/blog-hero.webp')
    if path.startswith(('https://','http://')): return path
    return '/' + path.lstrip('/')

def build_article(lang, data):
    slug=data['slug']; title=str(data.get('title') or slug); description=str(data.get('description') or '')
    img=image_url(data.get('image')); when=str(data.get('date') or '')[:10]
    template=(ROOT/lang/'blog-jebel-imsfrane.html').read_text(encoding='utf-8')
    body=mistune.html(data['body'])
    crumb='Accueil' if lang=='fr' else 'Home'
    cta='Réserver une expérience' if lang=='fr' else 'Book an experience'
    main=f'<main class="standalone-article" id="mainContent"><div class="container"><nav class="article-breadcrumb"><a href="index.html">{crumb}</a> › <a href="blog.html">Blog</a> › {e(title)}</nav><article><img src="{e(img)}" alt="{e(title)}" loading="lazy" style="width:100%;height:auto;object-fit:cover"><h1>{e(title)}</h1><p class="article-date">{e(when)}</p><div class="cms-article-body">{body}</div><p><a class="button button-primary" href="booking.html">{cta}</a></p></article></div></main>'
    template,n=re.subn(r'<main\b[^>]*>.*?</main>',lambda _:main,template,count=1,flags=re.S)
    if n!=1: raise RuntimeError(f'No main element in {lang} article template')
    template=re.sub(r'<title\b[^>]*>.*?</title>',lambda _:f'<title>{e(title)} | Imsfrane</title>',template,count=1,flags=re.S)
    template=re.sub(r'<meta\s+content="[^"]*"\s+name="description"\s*/?>',lambda _:f'<meta content="{e(description)}" name="description"/>',template,count=1)
    template=re.sub(r'<link\s+href="https://imsfrane.com/'+lang+r'/blog-jebel-imsfrane.html"\s+rel="canonical"\s*/>',lambda _:f'<link href="https://imsfrane.com/{lang}/blog-{e(slug)}.html" rel="canonical"/>',template,count=1)
    (ROOT/lang/f'blog-{slug}.html').write_text(template,encoding='utf-8')

def build_card(lang,data):
    slug=data['slug']; title=e(data.get('title') or slug); desc=e(data.get('description') or '')
    img=e(image_url(data.get('image'))); when=e(str(data.get('date') or '')[:10])
    read='Lire l’article' if lang=='fr' else 'Read article'
    return f'<article class="blog-card"><div class="blog-card-image"><a href="blog-{e(slug)}.html"><img src="{img}" alt="{title}" loading="lazy" style="width:100%;height:100%;object-fit:cover"></a></div><div class="blog-card-content"><div class="blog-meta"><span>{when}</span></div><h2>{title}</h2><p>{desc}</p><a class="blog-read-button" href="blog-{e(slug)}.html"><span>{read}</span><i class="fa-solid fa-arrow-right"></i></a></div></article>'

def main():
    for lang in ('fr','en'):
        posts=[]
        for file in sorted((ROOT/'posts'/lang).glob('*.md')):
            data=load_post(file)
            if published(data) and data.get('title'):
                posts.append(data)
                build_article(lang,data)
        posts.sort(key=lambda d:str(d.get('date') or ''),reverse=True)
        listing=ROOT/lang/'blog.html'
        html=listing.read_text(encoding='utf-8')
        cards='\n'.join(build_card(lang,p) for p in posts)
        block=START+'\n'+cards+'\n'+END
        if START in html and END in html:
            html=re.sub(re.escape(START)+r'.*?'+re.escape(END),lambda _:block,html,flags=re.S)
        else:
            html,n=re.subn(r'<div class="blog-grid">',lambda _: '<div class="blog-grid">\n'+block,html,count=1)
            if n!=1: raise RuntimeError(f'No blog-grid in {listing}')
        listing.write_text(html,encoding='utf-8')
        print(f'{lang}: generated {len(posts)} articles')

if __name__=='__main__': main()
