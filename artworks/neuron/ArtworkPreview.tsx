'use client'
import { useEffect, useRef } from 'react'
import { useNeuronSim } from './useNeuronSim'
import { drawGlow } from './draw'

const PREVIEW_PARAMS = {
  mode: 'glow' as const,
  nodeCount: 60,
  connectionRadius: 80,
  propagationSpeed: 0.6,
  decayTime: 1000,
  mouseRadius: 60,
}

export default function ArtworkPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sim = useNeuronSim()
  const simRef = useRef(sim)
  simRef.current = sim

  useEffect(() => {
    simRef.current.setParams(PREVIEW_PARAMS)

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number
    let lastTime = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
      simRef.current.init(canvas.offsetWidth, canvas.offsetHeight)
    }

    const loop = (now: number) => {
      const dt = lastTime === 0 ? 16 : Math.min(now - lastTime, 100)
      lastTime = now
      const s = simRef.current
      s.tick(dt, now)

      const { nodes } = s.stateRef.current
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight

      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, w, h)
      drawGlow(ctx, nodes)

      raf = requestAnimationFrame(loop)
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      simRef.current.onMouseMove(e.clientX - rect.left, e.clientY - rect.top)
    }

    resize()
    raf = requestAnimationFrame(loop)
    canvas.addEventListener('mousemove', onMouseMove)

    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
