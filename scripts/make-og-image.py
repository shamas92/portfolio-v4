#!/usr/bin/env python3
"""Generate public/og.png (1200x630) for the portfolio.

Draws the site's name and claim with the site fonts on the ground
token, with a thin cobalt rule at the bottom edge. Fonts are
fetched as variable TTFs from Google Fonts into /tmp; nothing is
installed.
"""
import urllib.request
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "og.png"
TMP = Path("/tmp/og-fonts")
TMP.mkdir(exist_ok=True)


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

    geist_path = fetch_variable_ttf("ofl/geist/Geist%5Bwght%5D.ttf")
    name_font = ImageFont.truetype(str(geist_path), 76)
    name_font.set_variation_by_axes([600])

    claim_font = ImageFont.truetype(str(geist_path), 44)
    claim_font.set_variation_by_axes([600])

    mono_path = fetch_variable_ttf(
        "ofl/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf"
    )
    status_font = ImageFont.truetype(str(mono_path), 26)
    status_font.set_variation_by_axes([400])

    W, H = 1200, 630
    ground = (250, 249, 247)
    ink = (20, 20, 19)
    ink_muted = (87, 83, 78)
    accent = (29, 78, 216)

    img = Image.new("RGB", (W, H), ground)
    d = ImageDraw.Draw(img)

    x = 80
    y = 120
    d.text((x, y), "Shamas Ur Rehman", font=name_font, fill=ink)

    y = 250
    d.text((x, y), "I build data & ML systems", font=claim_font, fill=ink)
    y = 310
    d.text((x, y), "and prove every claim", font=claim_font, fill=ink)
    y = 370
    d.text((x, y), "on this page.", font=claim_font, fill=ink)

    y = 480
    d.text(
        (x, y),
        "MSc Computer Science, TU Dresden, Dresden, Germany",
        font=status_font,
        fill=ink_muted,
    )

    # thin cobalt rule at the bottom edge
    d.rectangle([0, H - 8, W, H], fill=accent)

    img.save(OUT, "PNG")
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
