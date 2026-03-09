// components/ArtworkCard.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Artwork } from '@/artworks.config'
import { previewRegistry } from '@/components/registry'

export default function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const [hovered, setHovered] = useState(false)
  const Preview = previewRegistry[artwork.slug]

  return (
    <Link
      href={`/art/${artwork.slug}`}
      className="relative block overflow-hidden bg-white border border-neutral-100 rounded-sm"
      style={{ height: artwork.height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Preview — always running */}
      {Preview && (
        <div className="absolute inset-0">
          <Preview />
        </div>
      )}

      {/* Title + tags — fades out on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 p-5 transition-opacity duration-300"
        style={{ opacity: hovered ? 0 : 1 }}
      >
        <p className="text-sm font-medium text-white tracking-tight">
          {artwork.title}
        </p>
        <p className="mt-0.5 text-xs text-white/50">
          {artwork.tags.join(' · ')}
        </p>
      </div>
    </Link>
  )
}
