'use client'

export interface ShapeGenerator {
  /**
   * Generate initial particle positions for a given canvas size
   */
  generate(width: number, height: number, density: number): Float32Array

  /**
   * Get generator name
   */
  getName(): string
}
