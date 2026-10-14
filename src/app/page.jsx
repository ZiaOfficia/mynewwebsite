import Home from '@/views/Home.jsx';
import { getPreviews } from '@/lib/previews.js';
import { pageMetadata, JsonLd } from '@/seo/meta.jsx';

export const metadata = pageMetadata({ pathname: '/' });

export default function Page() {
  return (
    <>
      <JsonLd pathname="/" />
      <Home previews={getPreviews()} />
    </>
  );
}
