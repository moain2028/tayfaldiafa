#!/usr/bin/env python3
"""Arabic web-font comparison: download candidates from google/fonts, read licence facts,
subset to the characters an Arabic-only site needs, and report real WOFF2 sizes.

Usage:  python3 scripts/measure/fonts.py <outDir>        (outDir must be inside .tools/)
Needs:  pip install fonttools brotli   (brotli may be installed with --target and PYTHONPATH)
Writes: <outDir>/ttf/*.ttf, <outDir>/spec/*.woff2 (subset), <outDir>/full/*.woff2 (whole font),
        <outDir>/spec/index.html, <outDir>/fonts.json
Numbers are file facts. They say nothing about how a font looks: open spec/index.html on a real phone.
"""
import json, os, re, sys, urllib.parse, urllib.request
from fontTools import subset
from fontTools.ttLib import TTFont

OUT = sys.argv[1] if len(sys.argv) > 1 else '.tools/fonts'
RAW = 'https://raw.githubusercontent.com/google/fonts/main/ofl/'
# (google/fonts dir, file, role, weight shown in the specimen)
FONTS = [
    ('arefruqaa', 'ArefRuqaa-Bold.ttf', 'display', 700), ('amiri', 'Amiri-Bold.ttf', 'display', 700),
    ('elmessiri', 'ElMessiri[wght].ttf', 'display', 700), ('reemkufi', 'ReemKufi[wght].ttf', 'display', 700),
    ('markazitext', 'MarkaziText[wght].ttf', 'display', 700), ('cairo', 'Cairo[slnt,wght].ttf', 'display', 700),
    ('ibmplexsansarabic', 'IBMPlexSansArabic-Regular.ttf', 'body', 400), ('ibmplexsansarabic', 'IBMPlexSansArabic-SemiBold.ttf', 'body', 600),
    ('notonaskharabic', 'NotoNaskhArabic[wght].ttf', 'body', 400), ('tajawal', 'Tajawal-Regular.ttf', 'body', 400),
    ('tajawal', 'Tajawal-Bold.ttf', 'body', 700), ('almarai', 'Almarai-Regular.ttf', 'body', 400),
    ('almarai', 'Almarai-Bold.ttf', 'body', 700), ('notosansarabic', 'NotoSansArabic[wdth,wght].ttf', 'body', 400),
    ('readexpro', 'ReadexPro[HEXP,wght].ttf', 'body', 400), ('amiri', 'Amiri-Regular.ttf', 'body', 400),
]
# Characters kept: Basic Latin, a few quotes/dashes, Arabic letters, tashkeel, tatweel,
# Arabic punctuation and Arabic-Indic digits. 172 code points.
KEEP = (list(range(0x20, 0x7F)) + [0xA0, 0xAB, 0xBB, 0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2026,
        0x200C, 0x200D, 0x200E, 0x200F, 0x60C, 0x61B, 0x61F] + list(range(0x621, 0x63B))
        + list(range(0x640, 0x653)) + list(range(0x660, 0x66D)) + [0x670, 0x671])
CONTROL = {0xA0, 0x200C, 0x200D, 0x200E, 0x200F}


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=60).read()


def main():
    for d in ('ttf', 'spec', 'lic'):
        os.makedirs(f'{OUT}/{d}', exist_ok=True)
    rows, lic = [], {}
    for d, fname, role, weight in FONTS:
        if d not in lic:
            ofl = get(f'{RAW}{d}/OFL.txt').decode('utf-8', 'replace')
            open(f'{OUT}/lic/{d}.OFL.txt', 'w', encoding='utf-8').write(ofl)
            head = ofl.split('-----')[0]
            lic[d] = {'ofl11': 'SIL OPEN FONT LICENSE Version 1.1' in ofl,
                      'rfn': [m.strip(' ."“”\r') for m in re.findall(r'Reserved Font Name[s]?\s+([^\n]+)', head)]}
        src = f'{OUT}/ttf/{fname}'
        if not os.path.exists(src):
            open(src, 'wb').write(get(f'{RAW}{d}/{urllib.parse.quote(fname)}'))
        f = TTFont(src)
        names = {n.nameID: n.toUnicode() for n in f['name'].names}
        cmap, hh, upm = f.getBestCmap(), f['hhea'], f['head'].unitsPerEm
        axes = [[a.axisTag, a.minValue, a.defaultValue, a.maxValue] for a in f['fvar'].axes] if 'fvar' in f else []
        opt = subset.Options()
        opt.flavor, opt.layout_features, opt.name_IDs, opt.notdef_outline = 'woff2', ['*'], ['*'], True
        f2 = TTFont(src)
        s = subset.Subsetter(opt); s.populate(unicodes=KEEP); s.subset(f2)
        slug = re.sub(r'\[.*\]', '', fname).replace('.ttf', '')
        f2.flavor = 'woff2'; f2.save(f'{OUT}/spec/{slug}.woff2')
        kept = {n.nameID for n in TTFont(f'{OUT}/spec/{slug}.woff2')['name'].names}
        os.makedirs(f'{OUT}/full', exist_ok=True)
        f3 = TTFont(src); f3.flavor = 'woff2'; f3.save(f'{OUT}/full/{slug}.woff2')  # whole font, compression only
        rows.append({
            'family': names.get(16) or names.get(1), 'file': fname, 'slug': slug, 'role': role, 'weight': weight,
            'ofl_1_1': lic[d]['ofl11'], 'reserved_font_names': lic[d]['rfn'], 'fsType': f['OS/2'].fsType,
            'axes': axes, 'glyphs': len(f.getGlyphOrder()),
            'missing': [hex(u) for u in KEEP if u not in cmap and u not in CONTROL],
            'ttf_kb': round(os.path.getsize(src) / 1024, 1),
            'subset_woff2_kb': round(os.path.getsize(f'{OUT}/spec/{slug}.woff2') / 1024, 1),
            'full_woff2_kb': round(os.path.getsize(f'{OUT}/full/{slug}.woff2') / 1024, 1),
            'subset_keeps_copyright_and_licence': 0 in kept and 13 in kept,
            'hhea_line_height': round((hh.ascent - hh.descent + hh.lineGap) / upm, 2),
        })
        print(f"{rows[-1]['family']:24} {fname:32} subset {rows[-1]['subset_woff2_kb']:6} KB  RFN {lic[d]['rfn']}")
    json.dump({'codepoints': len(KEEP), 'source': 'github.com/google/fonts (ofl/)', 'fonts': rows},
              open(f'{OUT}/fonts.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

    css = ''.join(f"@font-face{{font-family:'F-{r['slug']}';src:url('{r['slug']}.woff2') format('woff2');font-weight:100 900;font-display:block}}" for r in rows)
    head, sub = 'طيف الضيافة', 'قهوجيين وصبابين في الدمام والخبر'
    para = ('نص تجريبي لقياس القراءة فقط: يصل الفريق قبل الموعد، يجهّز ركن القهوة والشاي، ويخدم الضيوف حتى نهاية المناسبة. '
            'الأرقام: 0123456789 و ٠١٢٣٤٥٦٧٨٩، وعلامات الترقيم: ، ؛ ؟')
    h = ("<!doctype html><html lang='ar' dir='rtl'><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>"
         "<meta name='robots' content='noindex'><title>عيّنات الخطوط</title><style>" + css +
         "body{margin:0;padding:16px;background:#fff;color:#111;font-family:sans-serif}section{border-top:1px solid #ccc;padding:14px 0}"
         "small{font:12px/1.4 monospace;color:#555;direction:ltr;display:block;text-align:left}h2{margin:6px 0 2px;font-size:40px;line-height:1.25}"
         "h3{margin:0;font-size:22px;line-height:1.4}p{margin:6px 0 0;font-size:17px;line-height:1.8}"
         "h1{font:700 15px sans-serif;background:#111;color:#fff;padding:6px 10px;margin:18px 0 0}</style>"
         "<h1>خطوط العناوين: 40 و22 بكسل</h1>")
    for r in [r for r in rows if r['role'] == 'display']:
        st = f"font-family:'F-{r['slug']}';font-weight:{r['weight']}"
        h += f"<section><small>{r['family']} · {r['weight']} · {r['subset_woff2_kb']} KB</small><h2 style=\"{st}\">{head}</h2><h3 style=\"{st}\">{sub}</h3></section>"
    h += '<h1>خطوط النص: 17 بكسل، ارتفاع السطر 1.8</h1>'
    for r in [r for r in rows if r['role'] == 'body']:
        st = f"font-family:'F-{r['slug']}';font-weight:{r['weight']}"
        h += f"<section><small>{r['family']} · {r['weight']} · {r['subset_woff2_kb']} KB</small><p style=\"{st}\">{para}</p></section>"
    open(f'{OUT}/spec/index.html', 'w', encoding='utf-8').write(h)


main()
