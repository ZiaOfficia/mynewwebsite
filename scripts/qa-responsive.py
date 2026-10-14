"""Run:  npm run build && npm start   (in one terminal)
         python scripts/qa-responsive.py [--shots]
   Needs: pip install playwright && playwright install chromium
"""
"""Responsive QA: every route × every width.
Checks: horizontal scroll, elements past the viewport edge, overlapping text,
small tap targets, tiny text. Prints a report; saves screenshots on request."""
import asyncio, json, sys
from playwright.async_api import async_playwright

import os
BASE = os.environ.get('QA_BASE', 'http://localhost:3000')
ROUTES = ['/', '/about', '/projects', '/contact', '/blog', '/blog/seo-mistakes-killing-rankings',
          '/services/web-development', '/services/landing-pages', '/services/seo',
          '/services/smo', '/services/google-ads', '/does-not-exist']
WIDTHS = [320, 360, 375, 390, 414, 600, 768, 820, 1024, 1280, 1440, 1920]
SHOTS = '--shots' in sys.argv

CHECK = r"""
() => {
  const vw = document.documentElement.clientWidth;
  const out = { hscroll: document.documentElement.scrollWidth - vw, offscreen: [], overlaps: [], tiny: [], taps: [] };
  const visible = (el) => {
    const s = getComputedStyle(el);
    if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const name = (el) => {
    let n = el.tagName.toLowerCase();
    if (el.className && typeof el.className === 'string') n += '.' + el.className.trim().split(/\s+/).slice(0,2).join('.');
    const t = (el.innerText || '').trim().slice(0, 30).replace(/\s+/g,' ');
    return t ? `${n} "${t}"` : n;
  };
  // ignore things intentionally off-canvas
  const skip = (el) => el.closest('.header__mobile, .eq-panel, .eq-backdrop, .bkm-overlay, .loader, .pj-filters, .scroll-progress, .mbar');

  // 1. off-screen content
  document.querySelectorAll('body *').forEach((el) => {
    if (skip(el) || !visible(el)) return;
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 || r.left < -1) {
      // only report leaves-ish (avoid duplicate parents)
      if (![...el.children].some((c) => { const cr = c.getBoundingClientRect(); return cr.right > vw + 1 || cr.left < -1; }))
        out.offscreen.push(`${name(el)} [${Math.round(r.left)}→${Math.round(r.right)}]`);
    }
  });

  // 2. text overlap between separate text blocks
  const texts = [...document.querySelectorAll('h1,h2,h3,h4,p,li,a,button,span,label,input,select,textarea,blockquote,figcaption,time')]
    .filter((el) => !skip(el) && visible(el) && ((el.innerText || '').trim() || ['INPUT','SELECT','TEXTAREA'].includes(el.tagName)))
    .filter((el) => ![...el.children].some((c) => (c.innerText || '').trim()) || el.tagName === 'A' || el.tagName === 'BUTTON');
  const rects = texts.map((el) => ({ el, r: el.getBoundingClientRect() }));
  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      const a = rects[i], b = rects[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const x = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
      const y = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
      if (x > 4 && y > 4) {
        // decorative stacks inside hero visuals are allowed to overlap each other's cards,
        // but a floating chip must not cover readable text
        const inHv = a.el.closest('.hv') && b.el.closest('.hv');
        const chip = a.el.closest('.hv-chip') || b.el.closest('.hv-chip');
        if (inHv && !chip) continue;
        if (a.el.closest('.eq-trigger') || b.el.closest('.eq-trigger')) { out.overlaps.push(`ENQUIRE TAB over ${name(a.el.closest('.eq-trigger') ? b.el : a.el)}`); continue; }
        out.overlaps.push(`${name(a.el)}  ×  ${name(b.el)}`);
      }
    }
  }

  // 3. tiny text (readable content only, not decorative)
  texts.forEach((el) => {
    if (el.closest('[aria-hidden="true"]')) return;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 12) out.tiny.push(`${name(el)} ${fs}px`);
  });

  // 4. small tap targets (phones only)
  if (vw < 768) {
    document.querySelectorAll('a, button, input, select, textarea').forEach((el) => {
      if (skip(el) || !visible(el) || el.closest('.prose')) return;
      const r = el.getBoundingClientRect();
      if (r.height < 40 || r.width < 40) out.taps.push(`${name(el)} ${Math.round(r.width)}×${Math.round(r.height)}`);
    });
  }
  return out;
}
"""

async def main():
    report = {}
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for w in WIDTHS:
            ctx = await b.new_context(viewport={'width': w, 'height': 900 if w > 700 else 800}, device_scale_factor=1)
            await ctx.add_init_script("try{sessionStorage.setItem('hb-greeted','1')}catch(e){}")
            pg = await ctx.new_page()
            for route in ROUTES:
                await pg.goto(BASE + route, wait_until='networkidle')
                await pg.wait_for_timeout(2600)  # let entrance animations finish
                res = await pg.evaluate(CHECK)
                # sticky bar must never hide the end of the page
                end = await pg.evaluate('''async () => {
                  window.scrollTo(0, document.documentElement.scrollHeight);
                  await new Promise(r => setTimeout(r, 500));
                  const bar = document.querySelector('.mbar');
                  if (!bar || getComputedStyle(bar).display === 'none') return 0;
                  const last = [...document.querySelectorAll('.footer__bottom p, .footer__bottom a')].pop();
                  return Math.max(0, Math.round(last.getBoundingClientRect().bottom - bar.getBoundingClientRect().top));
                }''')
                if end: res['bar_covers_footer'] = end
                key = f'{w} {route}'
                issues = {k: v for k, v in res.items() if (v if isinstance(v, list) else v > 0)}
                if issues: report[key] = issues
                if SHOTS and w in (320, 390, 768):
                    n = route.strip('/').replace('/', '_') or 'home'
                    await pg.screenshot(path=f'qa-shots/{w}-{n}.png', full_page=True)
            await ctx.close()
        await b.close()
    json.dump(report, open('qa-report.json', 'w'), indent=1)
    # summary
    for key, iss in report.items():
        print(f'\n== {key}')
        for k, v in iss.items():
            if isinstance(v, list):
                uniq = list(dict.fromkeys(v))
                print(f'  {k} ({len(uniq)}): ' + ' | '.join(uniq[:6]))
            else:
                print(f'  {k}: {v}px')

asyncio.run(main())
