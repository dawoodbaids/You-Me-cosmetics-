import Storefront from '@/components/Storefront'
import CatalogueError from '@/components/CatalogueError'
import PreviewBanner from '@/components/PreviewBanner'
import { getCatalogue } from '@/lib/products/queries'

// Prices must never be baked into a static build: read them on every request.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const result = await getCatalogue()

  if (result.status === 'error') {
    return <CatalogueError message={result.message} />
  }

  return (
    <>
      {result.source === 'preview' && <PreviewBanner />}
      <Storefront products={result.products} settings={result.settings} />
    </>
  )
}
