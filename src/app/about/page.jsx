import AboutPage from '@/views/AboutPage.jsx';
import { pageMetadata, JsonLd } from '@/seo/meta.jsx';

export const metadata = pageMetadata({ pathname: '/about' });

export default function Page() {
  return (
    <>
      <JsonLd pathname="/about" />
      <AboutPage />
    </>
  );
}
