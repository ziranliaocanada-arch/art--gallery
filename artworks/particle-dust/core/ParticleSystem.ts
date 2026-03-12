'use client'

import { Params, ParticleState, CursorState, DEFAULT_PARAMS } from './types'
import { ShapeGenerator } from '../shapes/ShapeGenerator'

export class ParticleSystem {
  private state: ParticleState
  private targetState: ParticleState
  private cursorState: CursorState
  private params: Params
  private width: number
  private height: number
  private shapeGenerator: ShapeGenerator

  constructor(
    width: number,
    height: number,
    shapeGenerator: ShapeGenerator,
    params: Params = DEFAULT_PARAMS
  ) {
    this.width = width
    this.height = height
    this.shapeGenerator = shapeGenerator
    this.params = { ...params }

    // Initialize particles from shape
    const initialPositions = shapeGenerator.generate(width, height, params.particleDensity)

    this.state = {
      positions: new Float32Array(initialPositions),
      velocities: new Float32Array(initialPositions.length),
      targetPositions: new Float32Array(initialPositions),
      energy: new Float32Array(initialPositions.length / 2).fill(0),
    }

    this.targetState = {
      positions: new Float32Array(initialPositions),
      velocities: new Float32Array(initialPositions.length),
      targetPositions: new Float32Array(initialPositions),
      energy: new Float32Array(initialPositions.length / 2),
    }

    this.cursorState = { x: 0, y: 0, vx: 0, vy: 0, active: false }
  }

  /**
   * Update cursor position and compute vortex effect
   */
  updateCursor(x: number, y: number): void {
    this.cursorState.x = x
    this.cursorState.y = y
    this.cursorState.active = true
  }

  /**
   * Update parameters (may trigger re-initialization)
   */
  updateParams(params: Params): void {
    const oldParticleCount = this.params.particleCount
    const oldDensity = this.params.particleDensity
    const oldShape = this.params.shapeType

    this.params = { ...params }

    // Re-generate if particle count or density changed
    if (
      params.particleCount !== oldParticleCount ||
      params.particleDensity !== oldDensity ||
      params.shapeType !== oldShape
    ) {
      this.reinitialize()
    }
  }

  /**
   * Get current state (for renderer to read)
   */
  getState(): ParticleState {
    return this.state
  }

  /**
   * Get parameters
   */
  getParams(): Params {
    return { ...this.params }
  }

  /**
   * Get cursor state
   */
  getCursorState(): CursorState {
    return { ...this.cursorState }
  }

  /**
   * Reinitialize particle positions from shape
   */
  private reinitialize(): void {
    const positions = this.shapeGenerator.generate(
      this.width,
      this.height,
      this.params.particleDensity
    )

    this.state.positions = new Float32Array(positions)
    this.state.velocities = new Float32Array(positions.length)
    this.state.targetPositions = new Float32Array(positions)
    this.state.energy = new Float32Array(positions.length / 2)
  }

  /**
   * Called by GPU compute shader to read current state
   * (this is a CPU-side representation for debugging)
   */
  tick(deltaTime: number): void {
    // CPU-side tick is minimal - most work happens in GPU Compute Shader
    // This is just for state management and parameter syncing

    // Decay energy
    const energyDecay = 0.95
    for (let i = 0; i < this.state.energy.length; i++) {
      this.state.energy[i] *= energyDecay
    }
  }
}
