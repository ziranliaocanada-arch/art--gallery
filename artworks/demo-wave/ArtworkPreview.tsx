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
