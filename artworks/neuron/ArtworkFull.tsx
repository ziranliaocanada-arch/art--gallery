'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useNeuronSim, DEFAULT_PARAMS, type Params } from './useNeuronSim'
import { drawArc, drawGlow, drawPulse } from './draw'
import ControlPanel from './ControlPanel'

export default function ArtworkFull() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [params, setParamsState] = useState<Params>(DEFAULT_PARAMS)
  const sim = useNeuronSim()
  const simRef = useRef(sim)
  simRef.current = sim

  const handleChange = useCallback((next: Params) => {
    setParamsState(next)
    simRef.current.setParams(next)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number
    let lastTime = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
      simRef.current.init(window.innerWidth, window.innerHeight)
    }

    const loop = (now: number) => {
      const dt = lastTime === 0 ? 16 : Math.min(now - lastTime, 100)
      lastTime = now
      const s = simRef.current
      s.tick(dt, now)

      const { nodes, pulses } = s.stateRef.current
      const { mode } = s.paramsRef.current
      const w = window.innerWidth
      const h = window.innerHeight

      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, w, h)

      if (mode === 'arc') drawArc(ctx, nodes)
      else if (mode === 'glow') drawGlow(ctx, nodes)
      else drawPulse(ctx, nodes, pulses, now)

      raf = requestAnimationFrame(loop)
    }

    const onMouseMove = (e: MouseEvent) => simRef.current.onMouseMove(e.clientX, e.clientY)
    const onClickEvt = (e: MouseEvent) => simRef.current.onClick(e.clientX, e.clientY)

    resize()
    raf = requestAnimationFrame(loop)
    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('click', onClickEvt)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('click', onClickEvt)
    }
  }, [])

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <ControlPanel params={params} onChange={handleChange} />
    </div>
  )
}
