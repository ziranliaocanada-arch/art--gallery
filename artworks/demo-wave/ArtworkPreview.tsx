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

    return () => cancelAnimationFrame(raf)
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
