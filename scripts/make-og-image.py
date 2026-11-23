#!/usr/bin/env python3
"""Generate public/og.png (1200x630) for the portfolio.

Draws the site's name and claim with the site fonts on the paper
token, the verified wash behind 'prove every claim', and a thin
verified-ink rule. Fonts are fetched as static TTFs from Google Fonts
(old user-agent) into /tmp; nothing is installed.
"""
import re
import urllib.request
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "og.png"
TMP = Path("/tmp/og-fonts")
TMP.mkdir(exist_ok=True)

UA_OLD = {"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1)"}


def fetch_variable_ttf(path: str) -> Path:
    """Download a variable TTF from the google/fonts repo."""
    url = f"https://raw.githubusercontent.com/google/fonts/main/{path}"
    dest = TMP / Path(path).name
    if not dest.exists():
        req = urllib.request.Request(url, headers={"User-Agent": "curl/8"})
        dest.write_bytes(urllib.request.urlopen(req, timeout=60).read())
    return dest


def main() -> None:
    from PIL import Image, ImageDraw, ImageFont

    grotesk_path = fetch_variable_ttf(
        "ofl/schibstedgrotesk/SchibstedGrotesk%5Bwght%5D.ttf"
    )
    grotesk_bold = ImageFont.truetype(str(grotesk_path), 76)
    grotesk_bold.set_variation_by_axes([700])
    grotesk_med = ImageFont.truetype(str(grotesk_path), 44)
    grotesk_med.set_variation_by_axes([500])
    grotesk_small = ImageFont.truetype(str(grotesk_path), 30)
    grotesk_small.set_variation_by_axes([500])

    W, H = 1200, 630
    paper = (244, 246, 245)
    ink = (35, 42, 46)
    margin = (91, 102, 107)
    wash = (205, 232, 217)
    verified = (14, 107, 73)

    img = Image.new("RGB", (W, H), paper)
    d = ImageDraw.Draw(img)

    x = 80
    y = 120
    d.text((x, y), "Shamas Ur Rehman", font=grotesk_bold, fill=ink)

    y = 250
    line1 = "I build data & ML systems"
    d.text((x, y), line1, font=grotesk_med, fill=ink)
    y = 310
    # "and prove every claim" with the wash behind "prove every claim"
    prefix = "and "
    mark = "prove every claim"
    d.text((x, y), prefix + mark, font=grotesk_med, fill=ink)
    pw = d.textlength(prefix, font=grotesk_med)
    mw = d.textlength(mark, font=grotesk_med)
    # wash rectangle behind the marked words (drawn first, text redrawn)
    d.rectangle([x + pw - 6, y + 4, x + pw + mw + 6, y + 52], fill=wash)
    d.text((x, y), prefix + mark, font=grotesk_med, fill=ink)
    y = 370
    d.text((x, y), "on this page.", font=grotesk_med, fill=ink)

    y = 480
    d.text((x, y), "Software Engineer — Dresden, Germany", font=grotesk_small, fill=margin)

    # thin verified rule at the bottom edge
    d.rectangle([0, H - 8, W, H], fill=verified)

    img.save(OUT, "PNG")
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
