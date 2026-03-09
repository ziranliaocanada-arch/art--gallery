import type { Node, ActivePulse } from './useNeuronSim'

export function drawArc(ctx: CanvasRenderingContext2D, nodes: Node[]) {
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i]
    if (a.energy < 0.1) continue
    for (const j of a.neighbors) {
      if (j <= i) continue
      const b = nodes[j]
      if (b.energy < 0.1) continue
      const e = Math.min(a.energy, b.energy)
      ctx.strokeStyle = `rgba(160, 210, 255, ${e * 0.85})`
      ctx.lineWidth = e * 1.5
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      const nx = -(b.y - a.y)
      const ny = b.x - a.x
      const len = Math.sqrt(nx * nx + ny * ny) || 1
      for (let s = 1; s < 4; s++) {
        const t = s / 4
        const mx = a.x + (b.x - a.x) * t
        const my = a.y + (b.y - a.y) * t
        const jitter = (Math.random() - 0.5) * 18 * e
        ctx.lineTo(mx + (nx / len) * jitter, my + (ny / len) * jitter)
      }
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }
  }
  for (const node of nodes) {
    if (node.energy < 0.05) continue
    ctx.beginPath()
    ctx.arc(node.x, node.y, 2 + node.energy * 3, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(200, 230, 255, ${node.energy})`
    ctx.fill()
  }
}

export function drawGlow(ctx: CanvasRenderingContext2D, nodes: Node[]) {
  ctx.shadowBlur = 0
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i]
    for (const j of a.neighbors) {
      if (j <= i) continue
      const b = nodes[j]
      const e = Math.max(a.energy, b.energy)
      if (e < 0.02) continue
      ctx.strokeStyle = `rgba(80, 160, 255, ${e * 0.3})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }
  }
  for (const node of nodes) {
    if (node.energy < 0.02) continue
    const r = Math.round(20 + node.energy * 180)
    const g = Math.round(60 + node.energy * 180)
    const b = Math.round(120 + node.energy * 135)
    ctx.shadowBlur = node.energy * 25
    ctx.shadowColor = `rgb(${r},${g},${b})`
    ctx.beginPath()
    ctx.arc(node.x, node.y, 1.5 + node.energy * 2.5, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${r},${g},${b},${node.energy})`
    ctx.fill()
  }
  ctx.shadowBlur = 0
}

export function drawPulse(
  ctx: CanvasRenderingContext2D,
  nodes: Node[],
  pulses: ActivePulse[],
  now: number
) {
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i]
    for (const j of a.neighbors) {
      if (j <= i) continue
      const b = nodes[j]
      ctx.strokeStyle = 'rgba(60, 100, 160, 0.15)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }
  }
  for (const node of nodes) {
    const e = 0.15 + node.energy * 0.5
    ctx.beginPath()
    ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(100, 160, 255, ${e})`
    ctx.fill()
  }
  ctx.shadowColor = 'rgba(140, 210, 255, 0.9)'
  ctx.shadowBlur = 12
  for (const pulse of pulses) {
    const progress = (now - pulse.startTime) / pulse.duration
    if (progress < 0 || progress > 1) continue
    const from = nodes[pulse.from]
    const to = nodes[pulse.to]
    if (!from || !to) continue
    const x = from.x + (to.x - from.x) * progress
    const y = from.y + (to.y - from.y) * progress
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(180, 230, 255, 0.9)'
    ctx.fill()
  }
  ctx.shadowBlur = 0
}
