# HiBrands website

Built with **Next.js 16** (App Router). Every page is generated as static HTML at build
time, so it is fast and fully readable by Google.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000, with live reload
npm run build    # production build
npm start        # serve the production build
```

Deploys to Vercel automatically. Vercel detects Next.js; no extra settings are needed.

## Writing a blog post

Posts are Markdown files in `content/blog/`. The file name becomes the web address:
`content/blog/local-seo.md` is published at `/blog/local-seo`.

1. Create a post from the template:
   ```bash
   npm run new-post -- "Your post title"
   ```
2. Open the new file in `content/blog/` and fill in the details at the top:
   ```yaml
   title: "Your post title"
   excerpt: "One or two sentences. Shown on the blog page and in Google."
   date: 2026-10-14
   category: SEO            # SEO, Social Media, Google Ads, Websites or Landing Pages
   tags: ["Local SEO", "Google Maps"]
   author: Your name
   cover: /blog/my-image.jpg   # optional; put the image in public/blog/
   draft: true
   ```
3. Write the post below the `---` line in normal Markdown (`## Heading`, `- list`, `**bold**`, links, images).
4. Preview it with `npm run dev`. Drafts show there with a red "Draft" label.
5. When it's ready, delete the `draft: true` line, commit and push. It goes live on the next deploy.
   The sitemap, RSS feed (`/blog/rss.xml`) and Google structured data update automatically.

Files that start with `_` (like `_template.md`) are never published.

## Where things are

| What | Where |
|---|---|
| Pages and routes | `src/app/` (one folder per URL) |
| Page content and layout | `src/views/` |
| Header, footer, forms | `src/components/` |
| Services, projects, team, prices, contact details | `src/data/index.js` |
| Page titles and descriptions for Google | `src/seo/seo.config.js` |
| Colours, fonts, buttons | `src/index.css` |
| Blog posts | `content/blog/` |
| Logo kit | `brand/` |
| Project screenshots | `public/projects/` (refresh with `npm run previews`) |
