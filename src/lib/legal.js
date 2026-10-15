/* Legal pages live as Markdown in content/legal/<name>.md */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { createRenderer, slugify } from './blog.js';

export function getLegalDoc(name) {
  const raw = fs.readFileSync(path.join(process.cwd(), 'content', 'legal', `${name}.md`), 'utf8');
  const { data, content } = matter(raw);
  const updated = data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : String(data.updated);
  const toc = [...content.matchAll(/^## (.+)$/gm)].map((m) => ({ text: m[1].trim(), id: slugify(m[1]) }));
  return { title: data.title, summary: data.summary, updated, toc, html: labelTableCells(createRenderer().parse(content)) };
}

/* Copy each column heading onto its cells (data-label), so on phones a
   table can be shown as stacked cards that still say what each value is. */
function labelTableCells(html) {
  return html.replace(/<table>([\s\S]*?)<\/table>/g, (table) => {
    const heads = [...table.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').replace(/"/g, '&quot;'));
    return table.replace(/<tr>([\s\S]*?)<\/tr>/g, (row) => {
      let i = 0;
      return row.replace(/<td([^>]*)>/g, (m, attrs) => `<td${attrs} data-label="${heads[i++] || ''}">`);
    });
  });
}
