import { Params, DEFAULT_PARAMS } from '../core/types'

const PRESETS_KEY = 'particle-dust-presets'

export function savePreset(name: string, params: Params): void {
  const presets = loadAllPresets()
  presets[name] = params
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets))
}

export function loadPreset(name: string): Params | null {
  const presets = loadAllPresets()
  return presets[name] || null
}

export function loadAllPresets(): Record<string, Params> {
  const stored = localStorage.getItem(PRESETS_KEY)
  return stored ? JSON.parse(stored) : {}
}

export function deletePreset(name: string): void {
  const presets = loadAllPresets()
  delete presets[name]
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets))
}
