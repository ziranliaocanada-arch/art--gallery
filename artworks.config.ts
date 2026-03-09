// artworks.config.ts
export type Artwork = {
  slug: string
  title: string
  tags: string[]
  year: number
  height: number  // card height in px — controls masonry variation
}

export const artworks: Artwork[] = [
  {
    slug: 'demo-wave',
    title: '波',
    tags: ['Canvas', 'Generative'],
    year: 2026,
    height: 420,
  },
  {
    slug: 'neuron',
    title: '神经元',
    tags: ['Canvas', 'Interactive', 'Simulation'],
    year: 2026,
    height: 500,
  },
]

export function getArtwork(slug: string): Artwork | undefined {
  return artworks.find((a) => a.slug === slug)
}
