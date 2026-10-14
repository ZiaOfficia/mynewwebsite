import fs from 'node:fs';
import path from 'node:path';

/* Slugs that have a screenshot in public/projects (made by `npm run previews`). */
export function getPreviews() {
  const dir = path.join(process.cwd(), 'public', 'projects');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .map((f) => f.replace(/\.\w+$/, ''));
}
