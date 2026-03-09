'use client'
import { useRef, useCallback, useEffect } from 'react'

export type Mode = 'arc' | 'glow' | 'pulse'

export type Params = {
  mode: Mode
  nodeCount: number
  connectionRadius: number
  propagationSpeed: number
  decayTime: number
  mouseRadius: number
}

export const DEFAULT_PARAMS: Params = {
  mode: 'glow',
  nodeCount: 150,
  connectionRadius: 120,
  propagationSpeed: 0.6,
  decayTime: 800,
  mouseRadius: 80,
}

export type Node = {
  x: number
  y: number
  energy: number
  neighbors: number[]
  lastFiredAt: number
}

export type ActivePulse = {
  from: number
  to: number
  startTime: number
  duration: number
}

export type SimState = {
  nodes: Node[]
  pulses: ActivePulse[]
  width: number
  height: number
}

export function useNeuronSim() {
  const stateRef = useRef<SimState>({ nodes: [], pulses: [], width: 0, height: 0 })
  const paramsRef = useRef<Params>(DEFAULT_PARAMS)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }, [])

  const init = useCallback((width: number, height: number) => {
    clearTimeouts()
    const { nodeCount, connectionRadius } = paramsRef.current
    const nodes: Node[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      energy: 0,
      neighbors: [],
      lastFiredAt: 0,
    }))
    const r2 = connectionRadius * connectionRadius
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        if (dx * dx + dy * dy < r2) {
          nodes[i].neighbors.push(j)
          nodes[j].neighbors.push(i)
        }
      }
    }
    stateRef.current = { nodes, pulses: [], width, height }
  }, [clearTimeouts])

  const setParams = useCallback((next: Params) => {
    const prev = paramsRef.current
    paramsRef.current = next
    if (next.nodeCount !== prev.nodeCount || next.connectionRadius !== prev.connectionRadius) {
      const { width, height } = stateRef.current
      if (width > 0) init(width, height)
    }
  }, [init])

  const fireNode = useCallback((nodeId: number, depth: number, now: number) => {
    const { nodes, pulses } = stateRef.current
    const { mode, decayTime, propagationSpeed } = paramsRef.current
    const node = nodes[nodeId]
    if (!node) return
    if (now - node.lastFiredAt < decayTime * 0.5) return
    node.lastFiredAt = now
    node.energy = 1
    if (depth >= 6) return

    for (const nbrId of node.neighbors) {
      if (mode === 'pulse') {
        const nbr = nodes[nbrId]
        const dx = nbr.x - node.x
        const dy = nbr.y - node.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const duration = dist / (propagationSpeed * 0.3)
        pulses.push({ from: nodeId, to: nbrId, startTime: now, duration })
      }
      const delay = (depth + 1) * decayTime * 0.12
      const t = setTimeout(() => fireNode(nbrId, depth + 1, Date.now()), delay)
      timeoutsRef.current.push(t)
    }
  }, [])

  const onMouseMove = useCallback((x: number, y: number) => {
    const { nodes } = stateRef.current
    const r = paramsRef.current.mouseRadius
    for (const node of nodes) {
      const dx = node.x - x
      const dy = node.y - y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < r) {
        const activation = 1 - dist / r
        if (activation > node.energy) node.energy = activation
      }
    }
  }, [])

  const onClick = useCallback((x: number, y: number) => {
    const { nodes } = stateRef.current
    let nearest = -1
    let minDist2 = Infinity
    for (let i = 0; i < nodes.length; i++) {
      const dx = nodes[i].x - x
      const dy = nodes[i].y - y
      const d2 = dx * dx + dy * dy
      if (d2 < minDist2) { minDist2 = d2; nearest = i }
    }
    if (nearest >= 0) fireNode(nearest, 0, Date.now())
  }, [fireNode])

  const tick = useCallback((dt: number, now: number) => {
    const { nodes } = stateRef.current
    const { decayTime } = paramsRef.current
    const decayFactor = Math.exp(-dt / decayTime)
    for (const node of nodes) {
      node.energy *= decayFactor
      if (node.energy < 0.005) node.energy = 0
    }
    stateRef.current.pulses = stateRef.current.pulses.filter(
      p => now - p.startTime < p.duration
    )
  }, [])

  useEffect(() => () => clearTimeouts(), [clearTimeouts])

  return { stateRef, paramsRef, init, setParams, onMouseMove, onClick, tick }
}
