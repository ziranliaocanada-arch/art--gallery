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
