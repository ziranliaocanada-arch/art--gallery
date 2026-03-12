'use client'

import { ShapeGenerator } from './ShapeGenerator'

export class SVGPathGenerator implements ShapeGenerator {
  private svgPath: string

  constructor(svgPath: string) {
    this.svgPath = svgPath
  }

  generate(width: number, height: number, density: number): Float32Array {
    // Parse SVG path to get outline points
    const points = this.parseSVGPath(this.svgPath)

    // Scale and center points
    const scaled = this.scaleAndCenter(points, width, height)

    // Fill shape with particles using Bresenham-like algorithm
    const particles = this.fillShape(scaled, density)

    // Convert to flat Float32Array [x, y, x, y, ...]
    const result = new Float32Array(particles.length * 2)
    particles.forEach((p, i) => {
      result[i * 2] = p.x
      result[i * 2 + 1] = p.y
    })

    return result
  }

  getName(): string {
    return 'svg-path'
  }

  private parseSVGPath(pathData: string): Array<{ x: number; y: number }> {
    // Simple SVG path parser for basic shapes
    // This is a simplified version - for production use a library like svg-pathdata
    const points: Array<{ x: number; y: number }> = []

    // Basic parsing for M (moveto), L (lineto), C (curveto), S (smooth curveto), Q (quadratic), T (smooth quadratic), A (arc), Z (closepath)
    const commands = pathData.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g) || []

    let currentPoint = { x: 0, y: 0 }

    for (const cmd of commands) {
      const type = cmd[0]
      const args = cmd.slice(1).trim().split(/[\s,]+/).map(Number)

      if (type === 'M' || type === 'm') {
        currentPoint = { x: args[0], y: args[1] }
        points.push(currentPoint)
      } else if (type === 'L' || type === 'l') {
        currentPoint = { x: args[0], y: args[1] }
        points.push(currentPoint)
      } else if (type === 'Z' || type === 'z') {
        // Close path - add first point again if different from current
        if (points.length > 0 && (currentPoint.x !== points[0].x || currentPoint.y !== points[0].y)) {
          points.push(points[0])
        }
      }
    }

    return points.length > 0 ? points : [{ x: 0, y: 0 }]
  }

  private scaleAndCenter(
    points: Array<{ x: number; y: number }>,
    canvasWidth: number,
    canvasHeight: number
  ): Array<{ x: number; y: number }> {
    if (points.length === 0) return []

    // Find bounds
    let minX = Infinity, maxX = -Infinity
    let minY = Infinity, maxY = -Infinity

    for (const p of points) {
      minX = Math.min(minX, p.x)
      maxX = Math.max(maxX, p.x)
      minY = Math.min(minY, p.y)
      maxY = Math.max(maxY, p.y)
    }

    const width = maxX - minX
    const height = maxY - minY

    // Scale to 80% of canvas
    const scale = Math.min(
      (canvasWidth * 0.8) / width,
      (canvasHeight * 0.8) / height
    )

    // Center
    return points.map(p => ({
      x: (p.x - minX) * scale + (canvasWidth - width * scale) / 2,
      y: (p.y - minY) * scale + (canvasHeight - height * scale) / 2,
    }))
  }

  private fillShape(
    outline: Array<{ x: number; y: number }>,
    density: number
  ): Array<{ x: number; y: number }> {
    // Create particles along outline and fill interior
    const particles: Array<{ x: number; y: number }> = []

    // Outline particles
    for (let i = 0; i < outline.length; i++) {
      particles.push(outline[i])
    }

    // Interior particles (simplified: add random points within bounds)
    const bounds = this.getBounds(outline)
    const estimatedParticles = Math.ceil(
      (bounds.width * bounds.height * density) / 100
    )

    for (let i = 0; i < estimatedParticles; i++) {
      particles.push({
        x: bounds.minX + Math.random() * bounds.width,
        y: bounds.minY + Math.random() * bounds.height,
      })
    }

    return particles
  }

  private getBounds(points: Array<{ x: number; y: number }>) {
    let minX = Infinity, maxX = -Infinity
    let minY = Infinity, maxY = -Infinity

    for (const p of points) {
      minX = Math.min(minX, p.x)
      maxX = Math.max(maxX, p.x)
      minY = Math.min(minY, p.y)
      maxY = Math.max(maxY, p.y)
    }

    return {
      minX,
      maxX,
      minY,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
    }
  }
}
