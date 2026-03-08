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
