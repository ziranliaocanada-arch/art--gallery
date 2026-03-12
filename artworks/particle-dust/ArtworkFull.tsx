'use client'

import { useRef, useState } from 'react'
import { useParticleSim } from './hooks/useParticleSim'
import { ControlPanel } from './ControlPanel'
import { Params, DEFAULT_PARAMS } from './core/types'
import styles from './ArtworkFull.module.css'

export function ArtworkFull() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS)
  const [showPanel, setShowPanel] = useState(true)

  useParticleSim(canvasRef as React.RefObject<HTMLCanvasElement>, params)

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        style={{
          width: '100%',
          height: '100%',
        }}
      />

      {showPanel && (
        <div className={styles.panelContainer}>
          <ControlPanel params={params} onParamsChange={setParams} />
        </div>
      )}

      <button
        className={styles.toggleButton}
        onClick={() => setShowPanel(!showPanel)}
      >
        {showPanel ? '▶' : '◀'}
      </button>
    </div>
  )
}
