'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { ParticleSystem } from '../core/ParticleSystem'
import { Renderer } from '../core/Renderer'
import { Params, DEFAULT_PARAMS } from '../core/types'
import { SVGPathGenerator } from '../shapes/SVGPathGenerator'
import { CircleGenerator } from '../shapes/ProceduralGenerator'

export function useParticleSim(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  initialParams: Params = DEFAULT_PARAMS
) {
  const [params, setParams] = useState(initialParams)
  const particleSystemRef = useRef<ParticleSystem | null>(null)
  const rendererRef = useRef<Renderer | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(Date.now())

  // Initialize systems
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    // Create shape generator
    let shapeGenerator
    if (params.shapeType === 'face') {
      shapeGenerator = new SVGPathGenerator(`
        M 100 20 C 140 20 170 50 170 100 C 170 150 140 190 100 190 C 60 190 30 150 30 100 C 30 50 60 20 100 20 Z
        M 70 90 L 80 90
        M 130 90 L 140 90
        M 100 100 L 95 130 L 105 130
        M 70 150 Q 100 170 130 150
      `)
    } else {
      shapeGenerator = new CircleGenerator()
    }

    // Initialize particle system
    particleSystemRef.current = new ParticleSystem(width, height, shapeGenerator, params)

    // Initialize renderer
    rendererRef.current = new Renderer(canvas, width, height)
    rendererRef.current.initializeParticles(
      particleSystemRef.current.getState(),
      params
    )

    return () => {
      rendererRef.current?.dispose()
    }
  }, [canvasRef])

  // Update parameters
  useEffect(() => {
    if (particleSystemRef.current) {
      particleSystemRef.current.updateParams(params)
    }
  }, [params])

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!canvasRef.current || !particleSystemRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    particleSystemRef.current.updateCursor(x, y)
  }, [canvasRef])

  // Animation loop
  const animate = useCallback(() => {
    if (!particleSystemRef.current || !rendererRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate)
      return
    }

    const now = Date.now()
    const deltaTime = (now - lastTimeRef.current) / 1000
    lastTimeRef.current = now

    // Tick simulation
    particleSystemRef.current.tick(deltaTime)

    // Update renderer with new state
    rendererRef.current.updateParticles(
      particleSystemRef.current.getState(),
      particleSystemRef.current.getParams()
    )

    // Render
    rendererRef.current.render()

    animationFrameRef.current = requestAnimationFrame(animate)
  }, [])

  // Start animation and attach event listeners
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.addEventListener('mousemove', handleMouseMove)
      animationFrameRef.current = requestAnimationFrame(animate)

      return () => {
        canvasRef.current?.removeEventListener('mousemove', handleMouseMove)
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }
  }, [animate, handleMouseMove])

  return { params, setParams }
}
