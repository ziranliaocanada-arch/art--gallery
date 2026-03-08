// app/art/[slug]/ArtworkFullWrapper.tsx
'use client'
import { fullRegistry } from '@/components/registry'

export default function ArtworkFullWrapper({ slug }: { slug: string }) {
  const Component = fullRegistry[slug]
  if (!Component) return null
  return <Component />
}
