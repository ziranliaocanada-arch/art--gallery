// app/page.tsx
import { artworks } from '@/artworks.config'
import ArtworkCard from '@/components/ArtworkCard'

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-8 py-6 border-b border-neutral-100">
        <span className="text-base font-medium tracking-tight text-neutral-900">
          Gallery
        </span>
        <span className="text-sm text-neutral-400">2026</span>
      </header>

      <div className="px-8 py-8">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {artworks.map((artwork) => (
            <div key={artwork.slug} className="break-inside-avoid mb-4">
              <ArtworkCard artwork={artwork} />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
