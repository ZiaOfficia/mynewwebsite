# Client logos

Downloaded from each client's own live site, then trimmed of transparent
margins and scaled to fit 96px (PNG, alpha preserved) so the hero tile field
stays light. Re-download from the same paths if a client rebrands.

| File | Source |
|------|--------|
| `elegantize.png` | https://elegantize.com/faviconlogo/elegantize-logo-fav.webp |
| `paramount-psychiatry.svg` | https://paramountpsychiatrynj.com/favicon.svg |
| `dumuzi.png` | https://www.dumuzi.in/images/favicon/apple-touch-icon.png |
| `aaghazz-foundation.png` | https://aaghazzia.vercel.app/images/assets/aaghaz-logo.png |
| `max-miracle-buildcare.png` | https://www.maxmiraclebuildcare.com/Logo_03_page-0001.jpg |
| `nios-admission.png` | https://niosadmissionoffice.com/favicon.png |
| `adstube-promotion.png` | https://grow.adstube.in/logo2.png |
| `watertech.png` | https://watertechlandingpage.vercel.app/logo/mainlogo.png |

The file name must match the project's `slug` in `src/data/index.js` — the
Projects page globs this folder and matches by name. A project with no logo
here falls back to its monogram in the hero tile.
