"""
Builds the inner pages (products, about, contact) from _src/*.html,
reusing the header, footer and CTA from index.html so they stay in sync.

Usage:  python3 build.py
Edit index.html for shared nav/footer changes, then re-run.
"""
import re
from pathlib import Path

root = Path(__file__).parent
index = (root / "index.html").read_text(encoding="utf-8")

head, rest = index.split("<main>", 1)
_, foot = rest.split("</main>", 1)
cta = "<!-- ============ CTA ============ -->" + rest.split("<!-- ============ CTA ============ -->", 1)[1].split("</main>", 1)[0]

for src in sorted((root / "_src").glob("*.html")):
    body = src.read_text(encoding="utf-8")
    meta = dict(re.findall(r"<!--(TITLE|DESC|ACTIVE):(.*?)-->", body))
    body = re.sub(r"<!--(TITLE|DESC|ACTIVE):.*?-->\n?", "", body)
    body = body.replace("<!--CTA-->", cta)

    h = head
    h = re.sub(r"<title>.*?</title>", f"<title>{meta['TITLE']}</title>", h)
    h = re.sub(r'(<meta name="description" content=").*?(">)', rf"\g<1>{meta['DESC']}\g<2>", h)
    h = re.sub(r'(<meta property="og:title" content=").*?(">)', rf"\g<1>{meta['TITLE']}\g<2>", h)
    h = re.sub(r'(<meta property="og:description" content=").*?(">)', rf"\g<1>{meta['DESC']}\g<2>", h)
    h = h.replace(' class="active"', "")
    h = h.replace(f'<a href="{meta["ACTIVE"]}">', f'<a href="{meta["ACTIVE"]}" class="active">', 1)

    (root / src.name).write_text(h + "<main>\n" + body + "\n</main>" + foot, encoding="utf-8")
    print("built", src.name)
