/* ============================================================
   PROJECT PREVIEW CAPTURE
   ============================================================
   Screenshots every live URL in `projects` (src/data/index.js) and
   writes src/assets/projects/<slug>.jpg — the previews shown on
   /projects.

   Run it by hand when a project is added or a client site is
   redesigned:  npm run previews

   It is deliberately NOT part of `npm run build`: it drives the
   locally installed Chrome, which Vercel's build image does not
   have. The committed JPEGs are what ship.

   No new dependency. It talks to Chrome over the DevTools Protocol
   using Node's built-in WebSocket (Node >= 22), which buys three
   things the `--screenshot` flag cannot:
     · JPEG straight out of Chrome, so no image library is needed
     · a scaled capture (1440px layout rendered down to 1200px)
     · a chance to run script in the page first — several of these
       sites throw a lead-capture modal over the fold on load, and
       a portfolio shot of someone else's popup is worthless

   Usage:
     node scripts/capture-previews.mjs            # all projects
     node scripts/capture-previews.mjs dumuzi …   # only these slugs
   ============================================================ */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root      = path.resolve(__dirname, '..');
const outDir    = path.join(root, 'src/assets/projects');

/* Render at desktop width, emit at 2x the ~600px a card ever needs. */
const LAYOUT  = { width: 1440, height: 900 };
const OUT     = { width: 1200, height: 750 };
const QUALITY = 82;

const PORT       = 9333;
const MOUNT_WAIT = 25000;  // ceiling on waiting for a client-rendered app to mount
const LOAD_WAIT  = 1500;   // grace after mount, before chasing images
const IMAGE_WAIT = 15000;  // ceiling on waiting for <img>s to decode
const SETTLE     = 1200;   // after the overlay sweep, for exit animations
const ATTEMPTS   = 4;      // per site, against flaky client hosting
const MIN_BYTES  = 20000;  // below this a 1200x750 JPEG is a flat, contentless frame

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

const chromePath = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
if (!chromePath) {
  console.error('✗ Chrome not found. Set CHROME_PATH to the executable and retry.');
  process.exit(1);
}

/* pathToFileURL — a bare Windows path like C:\… is not a valid ESM specifier. */
const { projects } = await import(
  pathToFileURL(path.join(root, 'src/data/index.js')).href
);

const only    = process.argv.slice(2);
const targets = only.length ? projects.filter((p) => only.includes(p.slug)) : projects;

if (!targets.length) {
  console.error(`✗ No projects matched: ${only.join(', ')}`);
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ── In-page cleanup ────────────────────────────────────────
   Dismisses whatever is covering the fold: presses the modal's own
   close control where there is one, drops any leftover full-screen
   fixed layer, and undoes the scroll lock those modals leave behind.
   Fixed elements shorter than 60% of the viewport are left alone so
   headers and cookie strips stay in the shot — they are part of how
   the site really looks. */
const DISMISS_OVERLAYS = `(() => {
  const vw = innerWidth, vh = innerHeight;

  /* An app shell can also be fixed and full-bleed. Never touch anything
     that carries the page's own landmarks or mount node — on two of these
     sites that was the difference between a screenshot and a blank frame. */
  const landmarks = [...document.querySelectorAll('main, header, nav, footer, #root, #__next, #app')];
  const isStructural = (el) => landmarks.some((l) => el === l || el.contains(l));

  const covering = [...document.querySelectorAll('body *')].filter((el) => {
    const s = getComputedStyle(el);
    if (s.position !== 'fixed') return false;
    if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return false;
    if (!(Number(s.zIndex) >= 10)) return false;
    const r = el.getBoundingClientRect();
    return r.width >= vw * 0.6 && r.height >= vh * 0.6 && !isStructural(el);
  });

  let n = 0;
  for (const el of covering) {
    const close = el.querySelector('[aria-label*="close" i], [class*="close" i], [data-dismiss], [class*="dismiss" i]');
    if (close) { try { close.click(); } catch {} }
    el.remove();
    n++;
  }
  for (const el of [document.documentElement, document.body]) {
    el.style.overflow = '';
    el.style.position = '';
    el.style.paddingRight = '';
  }

  /* One client's hero art is served by a slow third party that regularly
     times out. Hiding the failed <img> shows what a visitor on a slow
     connection sees — the layout without it — rather than Chrome's broken
     image glyph and alt text, which belong to neither site. */
  for (const img of document.images) {
    if (img.complete && img.naturalWidth === 0) img.style.visibility = 'hidden';
  }

  scrollTo(0, 0);
  return n;
})()`;

/* Visible text length — the cheap check that the sweep did not gut the page. */
const TEXT_LENGTH = `(document.body.innerText || '').trim().length`;

/* These are all client-rendered, and the heaviest of them needs well over
   ten seconds to mount. Wait for real text rather than a fixed delay —
   a fixed delay photographed one of them as an empty #root. */
const CONTENT_READY = `new Promise((resolve) => {
  /* Both conditions matter: one site renders a promo marquee before React
     mounts, which clears a text-only check while the page is still empty.
     A mounted page is also taller than the viewport. */
  const ready = () =>
    (document.body.innerText || '').trim().length > 500 &&
    document.body.scrollHeight > innerHeight * 1.5;
  if (ready()) return resolve(true);
  const started = Date.now();
  const poll = setInterval(() => {
    if (ready() || Date.now() - started > ${MOUNT_WAIT}) {
      clearInterval(poll);
      resolve(ready());
    }
  }, 400);
})`;

/* Reveal-on-scroll sections sit at opacity 0 until an IntersectionObserver
   fires, which never happens in a headless tab that is never scrolled — one
   of these sites photographed as a black rectangle because of it. Scrolling
   down and back up trips every observer, then restores the fold. */
const PRIME_REVEALS = `new Promise((resolve) => {
  scrollTo(0, document.body.scrollHeight);
  setTimeout(() => {
    scrollTo(0, Math.round(innerHeight / 2));
    setTimeout(() => { scrollTo(0, 0); setTimeout(resolve, 700); }, 300);
  }, 900);
})`;

/* Resolves once every <img> has decoded, or the ceiling is hit. */
const IMAGES_READY = `new Promise((resolve) => {
  const done = () => resolve([...document.images].filter((i) => !i.complete).length);
  if ([...document.images].every((i) => i.complete)) return done();
  const t = setTimeout(done, ${IMAGE_WAIT});
  let pending = [...document.images].filter((i) => !i.complete).length;
  for (const img of document.images) {
    if (img.complete) continue;
    const tick = () => { if (--pending <= 0) { clearTimeout(t); done(); } };
    img.addEventListener('load', tick, { once: true });
    img.addEventListener('error', tick, { once: true });
  }
})`;

/* ── Minimal CDP client ─────────────────────────────────────── */
class Cdp {
  #ws; #id = 0; #pending = new Map();

  static async connect(wsUrl) {
    const cdp = new Cdp();
    cdp.#ws = new WebSocket(wsUrl);
    cdp.#ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      const waiter = cdp.#pending.get(msg.id);
      if (!waiter) return;                       // an event, not a reply
      cdp.#pending.delete(msg.id);
      msg.error ? waiter.reject(new Error(msg.error.message)) : waiter.resolve(msg.result);
    });
    await new Promise((resolve, reject) => {
      cdp.#ws.addEventListener('open', resolve, { once: true });
      cdp.#ws.addEventListener('error', () => reject(new Error('CDP socket failed')), { once: true });
    });
    return cdp;
  }

  send(method, params = {}) {
    const id = ++this.#id;
    return new Promise((resolve, reject) => {
      this.#pending.set(id, { resolve, reject });
      this.#ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.#pending.delete(id)) reject(new Error(`${method} timed out`));
      }, 60_000);
    });
  }

  /* Evaluates in the page and waits on any promise it returns. */
  eval(expression) {
    return this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  }

  close() { try { this.#ws.close(); } catch {} }
}

/* ── Launch Chrome ──────────────────────────────────────────── */
const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hb-previews-'));
const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-features=Translate,MediaRouter',
  `--user-data-dir=${profileDir}`,
  `--remote-debugging-port=${PORT}`,
  `--window-size=${LAYOUT.width},${LAYOUT.height}`,
  'about:blank',
], { stdio: 'ignore' });

async function waitForChrome() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) return;
    } catch { /* not listening yet */ }
    await sleep(250);
  }
  throw new Error('Chrome did not open a debugging port');
}

function shutdown() {
  chrome.kill();
  /* Chrome can still hold the profile open for a moment after SIGKILL;
     a stale temp dir is not worth failing the run over. */
  try {
    fs.rmSync(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch { /* the OS will reap it */ }
}
process.on('exit', shutdown);

let ok = 0;
try {
  await waitForChrome();
  fs.mkdirSync(outDir, { recursive: true });

  for (const project of targets) {
    console.log(`  ${project.slug.padEnd(24)} ${project.url}`);
    /* Client sites drop connections; one flaky fetch should not leave a
       gap in the portfolio. */
    for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    let cdp;
    try {
      /* A fresh target per site — no cookie or scroll state carried over. */
      const target = await (await fetch(
        `http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' }
      )).json();
      cdp = await Cdp.connect(target.webSocketDebuggerUrl);

      await cdp.send('Page.enable');
      await cdp.send('Runtime.enable');
      /* Fractional scale: the page lays out at 1440 and renders at 1200. */
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width:  LAYOUT.width,
        height: LAYOUT.height,
        deviceScaleFactor: OUT.width / LAYOUT.width,
        mobile: false,
      });

      const nav = await cdp.send('Page.navigate', { url: project.url });
      if (nav.errorText) throw new Error(`navigation failed — ${nav.errorText}`);

      /* A transient DNS or connection drop lands on Chrome's own error
         page, which navigate still reports as a success. */
      const failed = (await cdp.eval(
        `document.querySelector('#main-frame-error, .neterror') !== null`
      )).result.value;
      if (failed) throw new Error('site did not load (Chrome error page)');

      const mounted = (await cdp.eval(CONTENT_READY)).result.value;
      if (!mounted) throw new Error('app never rendered any content');
      await sleep(LOAD_WAIT);

      const stalled = await cdp.eval(IMAGES_READY);
      await cdp.eval(PRIME_REVEALS);

      const before = (await cdp.eval(TEXT_LENGTH)).result.value;
      await cdp.eval(DISMISS_OVERLAYS);
      await sleep(SETTLE);

      /* If the sweep took the page down with the popup, the untouched
         page — popup and all — is still the more honest screenshot. */
      const after = (await cdp.eval(TEXT_LENGTH)).result.value;
      if (before > 0 && after < before * 0.3) {
        console.log('    … overlay sweep gutted the page, re-capturing untouched');
        await cdp.send('Page.reload');
        await cdp.eval(CONTENT_READY);
        await sleep(LOAD_WAIT);
        await cdp.eval(IMAGES_READY);
        await cdp.eval(PRIME_REVEALS);
        await sleep(SETTLE);
      }

      const { data } = await cdp.send('Page.captureScreenshot', {
        format: 'jpeg', quality: QUALITY, captureBeyondViewport: false,
      });
      const bytes = Buffer.from(data, 'base64');

      /* JPEG size is a decent proxy for detail: a real page at this size
         never compresses this small, so anything under the floor is a flat
         frame — a hero mid-crossfade, or a section that never painted.
         Throwing hands it to the retry loop for a fresh load. */
      if (bytes.length < MIN_BYTES) {
        throw new Error(`frame looks blank (${(bytes.length / 1024).toFixed(0)} kB)`);
      }

      const file = path.join(outDir, `${project.slug}.jpg`);
      fs.writeFileSync(file, bytes);

      const kb = (bytes.length / 1024).toFixed(0);
      const note = stalled.result?.value ? `  (${stalled.result.value} image(s) never loaded)` : '';
      console.log(`    ✓ ${path.relative(root, file)}  ${kb} kB${note}`);
      ok++;

      await cdp.send('Target.closeTarget', { targetId: target.id }).catch(() => {});
      break;
    } catch (err) {
      const last = attempt === ATTEMPTS;
      console.error(`    ${last ? '✗' : '…'} ${err.message}${last ? '' : ' — retrying'}`);
      if (!last) await sleep(2000);
    } finally {
      cdp?.close();
    }
    }
  }
} finally {
  shutdown();
}

console.log(`\n✓ ${ok}/${targets.length} previews captured → ${path.relative(root, outDir)}\n`);
if (ok < targets.length) process.exitCode = 1;
