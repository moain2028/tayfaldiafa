#!/usr/bin/env python3
"""Photo pipeline. Reads site/photos/photos.json + site/photos/src/, writes AVIF and WebP at several
widths to site/public/img/ and a manifest (site/photos/manifest.json) the builder reads.
Usage: python3 site/scripts/images.py     Needs: Pillow with AVIF and WebP support (Pillow 11.3+).
Never upscales. Run again after adding or replacing a photo, then commit src, public/img and the manifest."""
import json, os, sys
from PIL import Image, features

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SRC, OUT = os.path.join(ROOT, 'photos', 'src'), os.path.join(ROOT, 'public', 'img')
WIDTHS = [480, 800, 1200]

def main():
    if not (features.check('avif') and features.check('webp')):
        sys.exit('Pillow lacks AVIF or WebP support')
    os.makedirs(OUT, exist_ok=True)
    spec = json.load(open(os.path.join(ROOT, 'photos', 'photos.json'), encoding='utf-8'))
    man, total = {}, 0
    for p in spec['photos']:
        im = Image.open(os.path.join(SRC, p['file'])).convert('RGB')
        w0, h0 = im.size
        widths = [w for w in WIDTHS if w < w0] + [w0] if w0 < max(WIDTHS) else WIDTHS
        widths = sorted(set(widths))
        # drop a width that is within 15% of the next one (pointless extra file)
        widths = [w for i, w in enumerate(widths) if i == len(widths) - 1 or widths[i + 1] / w > 1.15]
        for w in widths:
            h = round(h0 * w / w0)
            r = im if w == w0 else im.resize((w, h), Image.LANCZOS)
            for ext, kw in (('avif', dict(quality=58, speed=4)), ('webp', dict(quality=76, method=6))):
                f = os.path.join(OUT, f"{p['key']}-{w}.{ext}")
                r.save(f, **kw)
                total += os.path.getsize(f)
        man[p['key']] = {'w': w0, 'h': h0, 'widths': widths, 'alt': p['alt'], 'focus': p.get('focus', '50% 50%')}
        print(f"{p['key']:14} {w0}x{h0} -> {widths}")
    json.dump(man, open(os.path.join(ROOT, 'photos', 'manifest.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f"{len(man)} photos, {total // 1024} KB written to public/img")

main()
