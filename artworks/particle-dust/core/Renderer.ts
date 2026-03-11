'use client'

import { Params, ParticleState } from './types'

export class Renderer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private width: number
  private height: number

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.canvas = canvas
    this.width = width
    this.height = height

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Failed to get 2D canvas context')
    }
    this.ctx = ctx
  }

  /**
   * Initialize particle rendering (called once at startup)
   */
  async initializeParticles(state: ParticleState, params: Params): Promise<void> {
    // Canvas 2D rendering doesn't need pre-initialization
    // The render() method will handle drawing particles
  }

  /**
   * Update and render particles
   */
  updateParticles(state: ParticleState, params: Params): void {
    // Clear canvas
    this.ctx.fillStyle = '#000000'
    this.ctx.fillRect(0, 0, this.width, this.height)

    // Draw particles
    const positions = state.positions
    const energy = state.energy

    for (let i = 0; i < positions.length; i += 2) {
      const x = positions[i]
      const y = positions[i + 1]
      const energyIdx = Math.floor(i / 2)
      const eng = energy[energyIdx] || 0

      // Skip invisible particles
      if (eng < 0.01) continue

      // Calculate color and opacity based on energy
      const hue = 180 + eng * 60 // Cyan to magenta
      const saturation = 100
      const lightness = 50 + eng * 20
      const alpha = eng * 0.8

      this.ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`

      // Draw particle as a circle with glow
      const radius = params.particleSize + eng * 2
      this.ctx.beginPath()
      this.ctx.arc(x, y, radius, 0, Math.PI * 2)
      this.ctx.fill()

      // Add glow effect
      if (eng > 0.3) {
        const glowRadius = radius * 2 * eng
        const gradient = this.ctx.createRadialGradient(x, y, radius, x, y, glowRadius)
        gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * 0.5})`)
        gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness}%, 0)`)
        this.ctx.fillStyle = gradient
        this.ctx.beginPath()
        this.ctx.arc(x, y, glowRadius, 0, Math.PI * 2)
        this.ctx.fill()
      }
    }
  }

  /**
   * Render a frame (called by animation loop)
   */
  render(): void {
    // Rendering is handled by updateParticles
    // This is kept for API compatibility
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    // Canvas 2D doesn't require cleanup
  }

  /**
   * Handle window resize
   */
  onWindowResize(width: number, height: number): void {
    this.width = width
    this.height = height
    this.canvas.width = width
    this.canvas.height = height
  }
}
