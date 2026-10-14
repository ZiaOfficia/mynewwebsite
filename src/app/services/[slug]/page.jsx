import { notFound } from 'next/navigation';
import ServiceDetail from '@/views/ServiceDetail.jsx';
import { services, serviceDetails } from '@/data/index.js';
import { getRouteSeo } from '@/seo/seo.config.js';
import { serviceSchema } from '@/seo/schema.js';
import { pageMetadata, JsonLd } from '@/seo/meta.jsx';

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

function describe(slug) {
  const meta = services.find((s) => s.slug === slug);
  return getRouteSeo(`/services/${slug}`)?.description || (meta?.summary || '').slice(0, 160);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return pageMetadata({ pathname: `/services/${slug}` });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const service = serviceDetails[slug];
  if (!service) notFound();
  const pathname = `/services/${slug}`;
  return (
    <>
      <JsonLd
        pathname={pathname}
        title={service.title}
        extra={[serviceSchema({ name: service.title, description: describe(slug), pathname })]}
      />
      <ServiceDetail slug={slug} />
    </>
  );
}
