# Art Gallery Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a white minimalist art gallery in Next.js with a masonry grid, hover-triggered animation previews, and full-screen independent artwork pages optimized for WebGL/WebGPU.

**Architecture:** Next.js 15 App Router. Central `artworks.config.ts` registry holds metadata. A `components/registry.ts` maps slugs to dynamically-imported components (previews + full versions). Each artwork exports two React components — `ArtworkPreview` (animated on hover in the grid) and `ArtworkFull` (100vw×100vh on the detail page).

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, CSS columns for masonry, next/dynamic for code splitting.

---

### Task 1: Scaffold Next.js project

**Files:**
- Create: `art-gallery/` (full Next.js project in existing folder)

**Step 1: Initialize project inside existing folder**

```bash
cd /Users/nature/9-ClaudeCode/art-gallery
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias="@/*" --yes
```

Expected output: "Success! Created art-gallery" (may say project created at `.`)

**Step 2: Verify dev server runs**

```bash
npm run dev
```

Open http://localhost:3000 — default Next.js page should appear. Stop server with Ctrl+C.

**Step 3: Remove boilerplate files**

```bash
rm -f app/page.tsx app/globals.css
# We'll recreate these in later tasks
```

**Step 4: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js 15 project"
```

---

### Task 2: Create artwork registry and component maps

**Files:**
- Create: `artworks.config.ts`
- Create: `components/registry.ts`

**Step 1: Write artworks.config.ts**

```ts
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
]

export function getArtwork(slug: string): Artwork | undefined {
  return artworks.find((a) => a.slug === slug)
}
```

**Step 2: Write components/registry.ts**

This is the single file to update when adding a new artwork. Uses next/dynamic for code splitting — preview and full components are only loaded when needed.

```ts
// components/registry.ts
import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

export const previewRegistry: Record<string, ComponentType> = {
  'demo-wave': dynamic(() => import('@/artworks/demo-wave/ArtworkPreview'), {
    loading: () => null,
  }),
}

export const fullRegistry: Record<string, ComponentType> = {
  'demo-wave': dynamic(() => import('@/artworks/demo-wave/ArtworkFull')),
}
```

**Step 3: Commit**

```bash
git add artworks.config.ts components/registry.ts
git commit -m "feat: add artwork registry and component maps"
```

---

### Task 3: Create demo-wave artwork

**Files:**
- Create: `artworks/demo-wave/ArtworkPreview.tsx`
- Create: `artworks/demo-wave/ArtworkFull.tsx`

**Step 1: Write ArtworkPreview.tsx**

Canvas 2D sine wave. Animates while mounted, cleans up on unmount. White background, dark line.

```tsx
// artworks/demo-wave/ArtworkPreview.tsx
'use client'
import { useEffect, useRef } from 'react'

export default function ArtworkPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number
    let t = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }

    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)
      ctx.strokeStyle = '#111111'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let x = 0; x <= w; x++) {
        const y = h / 2 + Math.sin((x / w) * Math.PI * 4 + t) * (h * 0.28)
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
      t += 0.04
      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()

    return () => cancelAnimationFrame(raf)
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
```

**Step 2: Write ArtworkFull.tsx**

Multiple layered waves on a black background, fills full viewport.

```tsx
// artworks/demo-wave/ArtworkFull.tsx
'use client'
import { useEffect, useRef } from 'react'

export default function ArtworkFull() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number
    let t = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
    }

    const draw = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, w, h)

      for (let i = 0; i < 7; i++) {
        const alpha = 1 - i * 0.12
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.lineWidth = 1
        ctx.beginPath()
        for (let x = 0; x <= w; x++) {
          const y =
            h / 2 +
            Math.sin((x / w) * Math.PI * 4 + t + i * 0.5) * (h * 0.18) +
            Math.sin((x / w) * Math.PI * 2 + t * 0.7 + i * 0.3) * (h * 0.06)
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      t += 0.015
      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-screen h-screen" />
}
```

**Step 3: Commit**

```bash
git add artworks/
git commit -m "feat: add demo-wave artwork (Preview + Full)"
```

---

### Task 4: Build ArtworkCard component

**Files:**
- Create: `components/ArtworkCard.tsx`

**Step 1: Write the component**

```tsx
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
      {/* Preview — only mounted on hover */}
      {hovered && Preview && (
        <div className="absolute inset-0">
          <Preview />
        </div>
      )}

      {/* Title + tags — fades out on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 p-5 transition-opacity duration-200"
        style={{ opacity: hovered ? 0 : 1 }}
      >
        <p className="text-sm font-medium text-neutral-900 tracking-tight">
          {artwork.title}
        </p>
        <p className="mt-0.5 text-xs text-neutral-400">
          {artwork.tags.join(' · ')}
        </p>
      </div>
    </Link>
  )
}
```

**Step 2: Commit**

```bash
git add components/ArtworkCard.tsx
git commit -m "feat: add ArtworkCard with hover-triggered preview"
```

---

### Task 5: Build gallery homepage

**Files:**
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`

**Step 1: Write globals.css**

```css
/* app/globals.css */
@import "tailwindcss";

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}
```

**Step 2: Write app/layout.tsx**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Interactive art gallery',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}
```

**Step 3: Write app/page.tsx**

```tsx
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
```

**Step 4: Verify in browser**

```bash
npm run dev
```

Open http://localhost:3000. You should see:
- White page with "Gallery" header
- One card labeled "波" with tag "Canvas · Generative"
- Hovering the card shows the sine wave animation
- The label fades out on hover

**Step 5: Commit**

```bash
git add app/
git commit -m "feat: build gallery homepage with masonry grid"
```

---

### Task 6: Build full-screen artwork page

**Files:**
- Create: `app/art/[slug]/page.tsx`
- Create: `app/art/[slug]/ArtworkFullWrapper.tsx`

**Step 1: Write ArtworkFullWrapper.tsx (client component)**

```tsx
// app/art/[slug]/ArtworkFullWrapper.tsx
'use client'
import { fullRegistry } from '@/components/registry'

export default function ArtworkFullWrapper({ slug }: { slug: string }) {
  const Component = fullRegistry[slug]
  if (!Component) return null
  return <Component />
}
```

**Step 2: Write app/art/[slug]/page.tsx**

```tsx
// app/art/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getArtwork, artworks } from '@/artworks.config'
import ArtworkFullWrapper from './ArtworkFullWrapper'

export function generateStaticParams() {
  return artworks.map((a) => ({ slug: a.slug }))
}

export default function ArtworkPage({
  params,
}: {
  params: { slug: string }
}) {
  const artwork = getArtwork(params.slug)
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
```

**Step 3: Verify in browser**

Click the "波" card — should navigate to `/art/demo-wave`. You should see:
- Black background filling the entire viewport
- Multiple white sine waves animating
- "← Gallery" link in the top-left (semi-transparent)
- Clicking "← Gallery" or browser back button returns to the gallery

**Step 4: Commit**

```bash
git add app/art/
git commit -m "feat: add full-screen artwork page"
```

---

### Task 7: Final check and TypeScript build

**Step 1: Run TypeScript type check**

```bash
npx tsc --noEmit
```

Expected: no errors. If errors appear, fix them before continuing.

**Step 2: Run production build**

```bash
npm run build
```

Expected: build succeeds with no errors.

**Step 3: Fix any build errors**

Common issues:
- `params` type in Next.js 15 may need to be `Promise<{ slug: string }>` — if build errors mention this, update the page to:
  ```tsx
  export default async function ArtworkPage({
    params,
  }: {
    params: Promise<{ slug: string }>
  }) {
    const { slug } = await params
    const artwork = getArtwork(slug)
    ...
  ```

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: verify build passes"
```

---

## Adding a New Artwork (Reference)

When you create a new artwork later, follow these two steps:

**1. Create the artwork folder:**
```
artworks/your-slug/
├── ArtworkPreview.tsx   # Copy demo-wave as template
└── ArtworkFull.tsx      # Copy demo-wave as template
```

**2. Register in two files:**

`artworks.config.ts` — add metadata:
```ts
{ slug: 'your-slug', title: '作品名', tags: ['WebGL'], year: 2026, height: 500 }
```

`components/registry.ts` — add component imports:
```ts
'your-slug': dynamic(() => import('@/artworks/your-slug/ArtworkPreview'), { loading: () => null }),
// and in fullRegistry:
'your-slug': dynamic(() => import('@/artworks/your-slug/ArtworkFull')),
```
