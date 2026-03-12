'use client'

import { ShapeGenerator } from './ShapeGenerator'

export class CircleGenerator implements ShapeGenerator {
  generate(width: number, height: number, density: number): Float32Array {
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.35

    const particles: Array<{ x: number; y: number }> = []
    const particleCount = Math.ceil(Math.PI * radius * radius * density)

    // Fibonacci sphere / sunflower pattern for even distribution
    const goldenRatio = 1.618033988749895

    for (let i = 0; i < particleCount; i++) {
      const angle = (2 * Math.PI * i) / goldenRatio
      const distance = radius * Math.sqrt(i / particleCount)

      particles.push({
        x: centerX + distance * Math.cos(angle),
        y: centerY + distance * Math.sin(angle),
      })
    }

    const result = new Float32Array(particles.length * 2)
    particles.forEach((p, i) => {
      result[i * 2] = p.x
      result[i * 2 + 1] = p.y
    })

    return result
  }

  getName(): string {
    return 'circle'
  }
}
