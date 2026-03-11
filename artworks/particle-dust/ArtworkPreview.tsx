'use client'

import { useRef, useEffect } from 'react'
import { ParticleSystem } from './core/ParticleSystem'
import { Renderer } from './core/Renderer'
import { CircleGenerator } from './shapes/ProceduralGenerator'
import { DEFAULT_PARAMS } from './core/types'

export function ArtworkPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    // Create a simple circle generator for preview
    const shapeGenerator = new CircleGenerator()
    const particleSystem = new ParticleSystem(width, height, shapeGenerator, DEFAULT_PARAMS)
    const renderer = new Renderer(canvas, width, height)

    renderer.initializeParticles(particleSystem.getState(), DEFAULT_PARAMS)

    // Simple animation loop for preview
    let lastTime = Date.now()
    let animationFrame: number | null = null

    const animate = () => {
      const now = Date.now()
      const dt = (now - lastTime) / 1000
      lastTime = now

      particleSystem.tick(dt)
      renderer.updateParticles(particleSystem.getState(), DEFAULT_PARAMS)
      renderer.render()

      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame)
      }
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
}
