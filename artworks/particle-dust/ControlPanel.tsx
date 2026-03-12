'use client'

import { useState } from 'react'
import { Params, DEFAULT_PARAMS } from './core/types'
import { savePreset, loadPreset, loadAllPresets, deletePreset } from './utils/presets'
import styles from './ControlPanel.module.css'

interface ControlPanelProps {
  params: Params
  onParamsChange: (params: Params) => void
}

export function ControlPanel({ params, onParamsChange }: ControlPanelProps) {
  const [presetName, setPresetName] = useState('')
  const [presets] = useState(() => loadAllPresets())

  const handleSliderChange = (key: keyof Params, value: number | string) => {
    onParamsChange({ ...params, [key]: value })
  }

  const handleModeChange = (mode: 'magnetic' | 'random') => {
    onParamsChange({ ...params, recoveryMode: mode })
  }

  const handleShapeChange = (shape: 'face' | 'logo' | 'circle') => {
    onParamsChange({ ...params, shapeType: shape })
  }

  const handleSavePreset = () => {
    if (presetName.trim()) {
      savePreset(presetName, params)
      setPresetName('')
      alert(`Preset "${presetName}" saved!`)
    }
  }

  const handleLoadPreset = (name: string) => {
    const loaded = loadPreset(name)
    if (loaded) {
      onParamsChange(loaded)
    }
  }

  const handleReset = () => {
    onParamsChange(DEFAULT_PARAMS)
  }

  return (
    <div className={styles.controlPanel}>
      <h2>Particle Dust Control Panel</h2>

      {/* Mode Selection */}
      <section className={styles.section}>
        <h3>📌 Mode</h3>
        <label>
          <input
            type="radio"
            checked={params.recoveryMode === 'magnetic'}
            onChange={() => handleModeChange('magnetic')}
          />
          Magnetic Recovery
        </label>
        <label>
          <input
            type="radio"
            checked={params.recoveryMode === 'random'}
            onChange={() => handleModeChange('random')}
          />
          Random Drift
        </label>
      </section>

      {/* Basic Parameters */}
      <section className={styles.section}>
        <h3>🎨 Basic Parameters</h3>
        <div className={styles.sliderGroup}>
          <label>
            Particle Count: {Math.floor(params.particleCount).toLocaleString()}
            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={params.particleCount}
              onChange={(e) => handleSliderChange('particleCount', Number(e.target.value))}
            />
          </label>
        </div>

        <div className={styles.sliderGroup}>
          <label>
            Particle Size: {params.particleSize.toFixed(1)}
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.1"
              value={params.particleSize}
              onChange={(e) => handleSliderChange('particleSize', Number(e.target.value))}
            />
          </label>
        </div>

        <div className={styles.sliderGroup}>
          <label>
            Color:
            <input
              type="color"
              value={params.color}
              onChange={(e) => handleSliderChange('color', e.target.value)}
            />
          </label>
        </div>

        <div className={styles.sliderGroup}>
          <label>
            Opacity: {params.opacity.toFixed(2)}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={params.opacity}
              onChange={(e) => handleSliderChange('opacity', Number(e.target.value))}
            />
          </label>
        </div>
      </section>

      {/* Cursor Vortex Parameters */}
      <section className={styles.section}>
        <h3>🌪️ Cursor Vortex</h3>
        <div className={styles.sliderGroup}>
          <label>
            Cursor Radius: {Math.floor(params.cursorRadius)}
            <input
              type="range"
              min="50"
              max="300"
              step="10"
              value={params.cursorRadius}
              onChange={(e) => handleSliderChange('cursorRadius', Number(e.target.value))}
            />
          </label>
        </div>

        <div className={styles.sliderGroup}>
          <label>
            Cursor Strength: {params.cursorStrength.toFixed(2)}
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={params.cursorStrength}
              onChange={(e) => handleSliderChange('cursorStrength', Number(e.target.value))}
            />
          </label>
        </div>

        <div className={styles.sliderGroup}>
          <label>
            Decay Factor: {params.decayFactor.toFixed(3)}
            <input
              type="range"
              min="0.9"
              max="0.99"
              step="0.001"
              value={params.decayFactor}
              onChange={(e) => handleSliderChange('decayFactor', Number(e.target.value))}
            />
          </label>
        </div>
      </section>

      {/* Recovery Parameters (Magnetic Mode) */}
      {params.recoveryMode === 'magnetic' && (
        <section className={styles.section}>
          <h3>🧲 Recovery (Magnetic Mode)</h3>
          <div className={styles.sliderGroup}>
            <label>
              Recovery Speed: {params.recoverySpeed.toFixed(3)}
              <input
                type="range"
                min="0.01"
                max="0.2"
                step="0.01"
                value={params.recoverySpeed}
                onChange={(e) => handleSliderChange('recoverySpeed', Number(e.target.value))}
              />
            </label>
          </div>

          <div className={styles.sliderGroup}>
            <label>
              Friction: {params.friction.toFixed(3)}
              <input
                type="range"
                min="0.95"
                max="0.99"
                step="0.001"
                value={params.friction}
                onChange={(e) => handleSliderChange('friction', Number(e.target.value))}
              />
            </label>
          </div>
        </section>
      )}

      {/* Shape Parameters */}
      <section className={styles.section}>
        <h3>📐 Shape</h3>
        <label>
          Shape Type:
          <select value={params.shapeType} onChange={(e) => handleShapeChange(e.target.value as any)}>
            <option value="face">Human Face</option>
            <option value="logo">Custom Logo</option>
            <option value="circle">Circle</option>
          </select>
        </label>

        <div className={styles.sliderGroup}>
          <label>
            Particle Density: {params.particleDensity.toFixed(2)}
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={params.particleDensity}
              onChange={(e) => handleSliderChange('particleDensity', Number(e.target.value))}
            />
          </label>
        </div>

        <div className={styles.sliderGroup}>
          <label>
            Boundary Fill: {params.boundaryFill.toFixed(2)}
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={params.boundaryFill}
              onChange={(e) => handleSliderChange('boundaryFill', Number(e.target.value))}
            />
          </label>
        </div>
      </section>

      {/* Visual Parameters */}
      <section className={styles.section}>
        <h3>✨ Visual Effects</h3>
        <div className={styles.sliderGroup}>
          <label>
            Glow Intensity: {params.glowIntensity.toFixed(2)}
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={params.glowIntensity}
              onChange={(e) => handleSliderChange('glowIntensity', Number(e.target.value))}
            />
          </label>
        </div>

        <div className={styles.sliderGroup}>
          <label>
            Trail Strength: {params.trailStrength.toFixed(2)}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={params.trailStrength}
              onChange={(e) => handleSliderChange('trailStrength', Number(e.target.value))}
            />
          </label>
        </div>

        <div className={styles.sliderGroup}>
          <label>
            Motion Blur: {params.motionBlur.toFixed(2)}
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              value={params.motionBlur}
              onChange={(e) => handleSliderChange('motionBlur', Number(e.target.value))}
            />
          </label>
        </div>
      </section>

      {/* Preset Management */}
      <section className={styles.section}>
        <h3>💾 Preset Management</h3>
        <div className={styles.presetInput}>
          <input
            type="text"
            placeholder="Preset name..."
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
          />
          <button onClick={handleSavePreset}>Save</button>
        </div>

        {Object.keys(presets).length > 0 && (
          <div className={styles.presetList}>
            {Object.keys(presets).map((name) => (
              <div key={name} className={styles.presetItem}>
                <button onClick={() => handleLoadPreset(name)}>{name}</button>
                <button onClick={() => deletePreset(name)}>Delete</button>
              </div>
            ))}
          </div>
        )}

        <button onClick={handleReset}>Reset to Default</button>
      </section>
    </div>
  )
}
