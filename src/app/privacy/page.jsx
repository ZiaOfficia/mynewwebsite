import LegalPage from '@/views/LegalPage.jsx';
import { getLegalDoc } from '@/lib/legal.js';
import { pageMetadata, JsonLd } from '@/seo/meta.jsx';

export const metadata = pageMetadata({ pathname: '/privacy' });

export default function Page() {
  return (
    <>
      <JsonLd pathname="/privacy" />
      <LegalPage doc={getLegalDoc('privacy')} />
    </>
  );
}
