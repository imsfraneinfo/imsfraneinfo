"""Apply the monochrome palette to the official Imsfrane styles."""
from pathlib import Path
import re


CSS_COLOR = re.compile(
    r"""(?P<protected>/\*.*?\*/|\burl\([^)]*\)|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')"""
    r"|(?<![\w/\-])#(?P<hex>[\da-f]{8}|[\da-f]{6}|[\da-f]{4}|[\da-f]{3})(?![\w-])"
    r"|\b(?P<rgb>rgba?)\(\s*(?P<r>\d+)\s*,\s*(?P<g>\d+)\s*,\s*(?P<b>\d+)(?P<alpha>\s*,[^)]*)?\s*\)",
    re.I | re.S,
)
INLINE_STYLE = re.compile(r'(<style\b[^>]*>)(.*?)(</style>)', re.I | re.S)
STYLE_ATTRIBUTE = re.compile(r"""(\sstyle\s*=\s*)(["'])(.*?)\2""", re.I | re.S)
CSS_LINK = re.compile(r"""(<link\b[^>]*\bhref=["'])([^"'?#]+\.css(?:\?[^"']*)?)(["'])""", re.I)
MENU_BRAND = re.compile(r'<div class="atnav-drawer-brand">(.*?)</div>', re.S)

OVERRIDES = """
html body { background-color: #fff; color: #151515; }
body.atnav-ready #siteHeader,
body.atnav-ready .atnav-article-header,
#atnavDrawer,
#ims-footer,
.site-footer {
  background: #111 !important;
  border-color: #333 !important;
}
body.atnav-ready #siteHeader .brand-content small { color: #d1d1d1 !important; }
body.atnav-ready #siteHeader .atnav-desktop a[aria-current="page"],
body.atnav-ready #siteHeader .atnav-desktop a:hover {
  color: #fff !important;
  text-decoration: underline;
  text-underline-offset: .35em;
}
body.atnav-ready #siteHeader .atnav-open {
  background: #242424;
  border-color: #777;
  color: #fff;
}
#atnavDrawer .atnav-book,
#ims-footer .fp-cta {
  background: #fff !important;
  border-color: #fff !important;
  color: #111 !important;
}
#atnavDrawer .atnav-book:hover,
#ims-footer .fp-cta:hover { background: #dedede !important; }
#atnavDrawer .atnav-drawer-brand:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 5px;
}
#atnavDrawer .atnav-drawer-brand:hover strong {
  text-decoration: underline;
  text-underline-offset: .25em;
}
::selection { background: #191919; color: #fff; }
"""


def grey(red, green, blue):
    value = round(0.2126 * red + 0.7152 * green + 0.0722 * blue)
    if max(red, green, blue) - min(red, green, blue) < 6:
        return value
    if min(red, green, blue) >= 220:
        return min(255, value + 7)
    if value < 85:
        return max(12, round(value * .65))
    return value


def transform(css):
    def replace(match):
        if match['protected']:
            return match[0]
        if match['hex']:
            original = match['hex']
            expanded = ''.join(char * 2 for char in original) if len(original) in (3, 4) else original
            channels = [int(expanded[start:start + 2], 16) for start in (0, 2, 4)]
            value = grey(*channels)
            return f'#{value:02x}{value:02x}{value:02x}{expanded[6:]}'
        channels = [int(match[channel]) for channel in ('r', 'g', 'b')]
        value = grey(*channels)
        return f"{match['rgb']}({value},{value},{value}{match['alpha'] or ''})"

    return CSS_COLOR.sub(replace, css)


def version_link(match):
    url = match[2]
    if 'palette=mono1' in url or '/monochrome.css' in url:
        return match[0]
    if url.startswith(('https:', 'http:', '//')):
        return match[0]
    return f"{match[1]}{url}{'&' if '?' in url else '?'}palette=mono1{match[3]}"


def build(root: Path):
    for stylesheet in root.rglob('*.css'):
        if any(vendor in stylesheet.name.lower() for vendor in ('bootstrap', 'fontawesome', 'font-awesome', 'animate', 'swiper', 'all.min')):
            continue
        original = stylesheet.read_text(encoding='utf-8')
        updated = transform(original)
        if updated != original:
            stylesheet.write_text(updated, encoding='utf-8')

    for page in root.rglob('*.html'):
        parts = page.relative_to(root).parts
        if 'admin' in parts:
            continue
        original = page.read_text(encoding='utf-8')
        updated = INLINE_STYLE.sub(lambda m: m[1] + transform(m[2]) + m[3], original)
        updated = STYLE_ATTRIBUTE.sub(lambda m: m[1] + m[2] + transform(m[3]) + m[2], updated)
        if '</head>' not in updated or '<body' not in updated:
            continue
        updated = CSS_LINK.sub(version_link, updated)
        if parts[0] in ('fr', 'en', 'es', 'ar'):
            home = f'/{parts[0]}/'
            updated = MENU_BRAND.sub(
                lambda match: f'<a class="atnav-drawer-brand" href="{home}">{match[1]}</a>',
                updated,
            )
        if '/monochrome.css?v=1' not in updated:
            updated = updated.replace('</head>', '<link rel="stylesheet" href="/monochrome.css?v=1">\n</head>', 1)
        if updated != original:
            page.write_text(updated, encoding='utf-8')

    (root / 'monochrome.css').write_text(OVERRIDES, encoding='utf-8')


if __name__ == '__main__':
    build(Path(__file__).resolve().parents[1])
