# Art Gallery — Design Document

Date: 2026-03-08

## Overview

A web gallery showcasing interactive art pieces. Each piece lives in a masonry grid with hover-triggered animation previews. Clicking enters a full-screen independent page optimized for WebGL/WebGPU workloads.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS (gallery UI only)
- **Artwork rendering**: Unrestricted — Canvas 2D, WebGL, WebGPU, Three.js, etc.
- **Deployment**: Vercel

## Project Structure

```
art-gallery/
├── artworks.config.ts          # Central artwork registry
├── artworks/                   # One folder per artwork
│   └── demo-wave/
│       ├── ArtworkPreview.tsx  # Small animated preview (shown on hover)
│       └── ArtworkFull.tsx     # Full-screen version
├── app/
│   ├── page.tsx                # Gallery homepage (masonry grid)
│   └── art/[slug]/
│       └── page.tsx            # Full-screen artwork page
├── components/
│   ├── ArtworkCard.tsx         # Masonry card with hover logic
│   └── MasonryGrid.tsx         # Masonry layout component
└── docs/plans/
```

## Artwork Registry (`artworks.config.ts`)

```ts
export type Artwork = {
  slug: string
  title: string
  tags: string[]
  year: number
  height: number  // card height in px, drives masonry variation
}

export const artworks: Artwork[] = [
  {
    slug: 'demo-wave',
    title: '波',
    tags: ['Canvas', 'Generative'],
    year: 2026,
    height: 400,
  },
]
```

## Gallery Page UI

- White minimalist aesthetic, large whitespace
- Minimal top bar: title left, year right
- 3-column masonry grid, card heights vary via `height` field in config
- **Card default state**: white background, thin border, title + tags at bottom
- **Card hover state**: `ArtworkPreview` component activates and fills the card, title fades out
- **Card click**: navigates to `/art/[slug]`

## Full-Screen Artwork Page

- Black background
- `ArtworkFull` fills 100vw × 100vh
- Semi-transparent back arrow top-left
- Browser back button returns to gallery

## Adding a New Artwork (Two Steps)

1. Create `artworks/[slug]/ArtworkPreview.tsx` and `ArtworkFull.tsx`
2. Add one entry to `artworks.config.ts`

## Performance Rationale

Independent page navigation (not modal) is used so that:
- Each artwork gets a fresh GPU context with no resource conflicts
- Browser fully cleans up WebGL/WebGPU contexts on navigation
- No manual cleanup code required in artwork components
- Browsers limit ~8–16 WebGL contexts per tab; independent pages avoid hitting this ceiling

## Demo Artwork: `demo-wave`

A Canvas 2D flowing sine wave animation. Serves as the reference implementation showing the two-component pattern (Preview + Full). Subsequent artworks copy this structure.
