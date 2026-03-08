// app/art/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getArtwork, artworks } from '@/artworks.config'
import ArtworkFullWrapper from './ArtworkFullWrapper'

export function generateStaticParams() {
  return artworks.map((a) => ({ slug: a.slug }))
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const artwork = getArtwork(slug)
  if (!artwork) notFound()

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <ArtworkFullWrapper slug={artwork.slug} />
      <a
        href="/"
        className="absolute top-5 left-5 z-10 text-xs text-white/40 hover:text-white/80 transition-colors"
        aria-label="Back to gallery"
      >
        ← Gallery
      </a>
    </div>
  )
}
