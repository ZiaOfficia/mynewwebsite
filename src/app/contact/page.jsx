import ContactPage from '@/views/ContactPage.jsx';
import { pageMetadata, JsonLd } from '@/seo/meta.jsx';

export const metadata = pageMetadata({ pathname: '/contact' });

export default function Page() {
  return (
    <>
      <JsonLd pathname="/contact" />
      <ContactPage />
    </>
  );
}
