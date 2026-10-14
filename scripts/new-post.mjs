/* Create a new blog post from the template.
   Usage:  npm run new-post -- "My post title"
   Creates content/blog/my-post-title.md as a draft dated today. */
import fs from 'node:fs';
import path from 'node:path';

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('Give the post a title:  npm run new-post -- "My post title"');
  process.exit(1);
}

const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
const dir = path.join(process.cwd(), 'content', 'blog');
const file = path.join(dir, `${slug}.md`);
if (fs.existsSync(file)) {
  console.error(`content/blog/${slug}.md already exists.`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const template = fs.readFileSync(path.join(dir, '_template.md'), 'utf8')
  .replace(/^title: .*$/m, `title: ${JSON.stringify(title)}`)
  .replace(/^date: .*$/m, `date: ${today}`);

fs.writeFileSync(file, template);
console.log(`Created content/blog/${slug}.md`);
console.log(`Preview it at http://localhost:3000/blog/${slug} (run "npm run dev")`);
console.log('Remove the "draft: true" line when it is ready to publish.');
