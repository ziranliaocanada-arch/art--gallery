'use client'
import { useState } from 'react'
import type { Params, Mode } from './useNeuronSim'

type Props = {
  params: Params
  onChange: (p: Params) => void
}

const SLIDERS = [
  { key: 'nodeCount',        label: 'Nodes',  min: 50,  max: 300,  step: 10  },
  { key: 'connectionRadius', label: 'Reach',  min: 40,  max: 200,  step: 5   },
  { key: 'propagationSpeed', label: 'Speed',  min: 0.1, max: 2.0,  step: 0.1 },
  { key: 'decayTime',        label: 'Decay',  min: 200, max: 2000, step: 100 },
  { key: 'mouseRadius',      label: 'Cursor', min: 30,  max: 200,  step: 10  },
] as const

export default function ControlPanel({ params, onChange }: Props) {
  const [open, setOpen] = useState(true)

  const set = (key: keyof Params, value: number | Mode) =>
    onChange({ ...params, [key]: value })

  return (
    <div className="fixed top-5 right-5 z-10 w-52 rounded-lg overflow-hidden text-xs text-white/80 select-none">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 bg-black/70 backdrop-blur-sm hover:bg-black/80 transition-colors"
      >
        <span className="font-medium tracking-widest uppercase text-[10px]">Controls</span>
        <span className="text-white/30">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="bg-black/60 backdrop-blur-sm px-3 py-3 space-y-3">
          <div>
            <div className="text-white/30 mb-1.5 uppercase text-[10px] tracking-widest">Mode</div>
            <div className="flex gap-1">
              {(['arc', 'glow', 'pulse'] as Mode[]).map(m => (
                <button
                  key={m}
                  onClick={() => set('mode', m)}
                  className={`flex-1 py-1 rounded text-[11px] capitalize transition-colors ${
                    params.mode === m
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {SLIDERS.map(({ key, label, min, max, step }) => (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <span className="text-white/30 uppercase text-[10px] tracking-widest">{label}</span>
                <span className="tabular-nums text-white/50">{params[key]}</span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={params[key] as number}
                onChange={e => {
                  const v = step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value)
                  set(key, v)
                }}
                className="w-full h-1 accent-white/50 cursor-pointer"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
