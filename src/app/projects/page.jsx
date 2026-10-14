import ProjectsPage from '@/views/ProjectsPage.jsx';
import { projects } from '@/data/index.js';
import { getPreviews } from '@/lib/previews.js';
import { pageMetadata, JsonLd } from '@/seo/meta.jsx';

export const metadata = pageMetadata({ pathname: '/projects' });

/* Lets Google read the portfolio as one collection of real works. */
const itemListSchema = {
  '@type': 'ItemList',
  name: 'HiBrands Projects',
  itemListElement: projects.map((project, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: { '@type': 'CreativeWork', name: project.name, description: project.description, url: project.url },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd pathname="/projects" extra={[itemListSchema]} />
      <ProjectsPage previews={getPreviews()} />
    </>
  );
}
