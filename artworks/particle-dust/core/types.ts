'use client'

export type RecoveryMode = 'magnetic' | 'random'
export type ShapeType = 'face' | 'logo' | 'circle'

export interface Params {
  // Mode
  recoveryMode: RecoveryMode

  // Basic parameters
  particleCount: number // 1000 - 100000
  particleSize: number // 0.5 - 10
  color: string // hex #RRGGBB
  opacity: number // 0 - 1

  // Cursor vortex
  cursorRadius: number // 50 - 300
  cursorStrength: number // 0.1 - 3.0
  decayFactor: number // 0.9 - 0.99

  // Recovery parameters (magnetic mode)
  recoverySpeed: number // 0.01 - 0.2
  friction: number // 0.95 - 0.99

  // Shape parameters
  shapeType: ShapeType
  particleDensity: number // 0.5 - 2.0
  boundaryFill: number // 0 - 1

  // Visual parameters
  glowIntensity: number // 0 - 2.0
  trailStrength: number // 0 - 1.0
  motionBlur: number // 0 - 0.5
}

export const DEFAULT_PARAMS: Params = {
  recoveryMode: 'magnetic',
  particleCount: 50000,
  particleSize: 2,
  color: '#00CCFF',
  opacity: 0.8,
  cursorRadius: 150,
  cursorStrength: 1.5,
  decayFactor: 0.95,
  recoverySpeed: 0.05,
  friction: 0.98,
  shapeType: 'face',
  particleDensity: 1.0,
  boundaryFill: 0.8,
  glowIntensity: 1.2,
  trailStrength: 0.3,
  motionBlur: 0.1,
}

export interface ParticleState {
  positions: Float32Array // [x, y, x, y, ...] for particleCount
  velocities: Float32Array // [vx, vy, vx, vy, ...]
  targetPositions: Float32Array // original shape positions
  energy: Float32Array // activation energy [0-1]
}

export interface CursorState {
  x: number
  y: number
  vx: number
  vy: number
  active: boolean
}
