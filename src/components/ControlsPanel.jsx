import { Flame, Shield, Sliders, Timer, Power } from 'lucide-react';

export default function ControlsPanel({ armed, setArmed, throttle, setThrottle, countdown, launched, stage, onInitiate, onAbort, onReset }) {
  const canLaunch = armed && countdown === null && !launched;
  return (
    <div className="rounded-2xl border border-fuchsia-400/20 bg-[#0b0b18]/80 backdrop-blur-md p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-zinc-300">Launch Controls</h3>
        <span className="text-[10px] uppercase tracking-widest text-fuchsia-300">Stage {stage}</span>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={16} className={armed ? 'text-emerald-300' : 'text-zinc-400'} />
            <span className="text-sm">System Arm</span>
          </div>
          <button
            onClick={() => setArmed((v) => !v)}
            className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${armed ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200' : 'border-zinc-600/50 bg-zinc-800 text-zinc-300'}`}
            disabled={launched}
          >
            {armed ? 'Armed' : 'Safe'}
          </button>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sliders size={16} className="text-zinc-300" />
            <span className="text-sm">Throttle</span>
            <span className="ml-auto text-xs text-fuchsia-300">{throttle}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={throttle}
            onChange={(e) => setThrottle(parseInt(e.target.value))}
            className="w-full accent-fuchsia-400"
            disabled={launched}
          />
          <div className="mt-1 text-[10px] text-zinc-400">Controls engine throttle authority.</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onInitiate}
            disabled={!canLaunch}
            className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${canLaunch ? 'border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-200 hover:bg-fuchsia-500/20' : 'border-zinc-700 bg-zinc-800 text-zinc-400 cursor-not-allowed'}`}
          >
            <Flame size={16} /> Initiate
          </button>
          <button
            onClick={onAbort}
            disabled={countdown === null}
            className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${countdown !== null ? 'border-rose-400/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20' : 'border-zinc-700 bg-zinc-800 text-zinc-400 cursor-not-allowed'}`}
          >
            <Power size={16} /> Abort
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2 text-sm">
            <Timer size={16} className="text-zinc-300" />
            <span>Countdown</span>
            <span className="ml-auto text-fuchsia-300 font-mono">{countdown === null ? '—' : `T-${countdown}s`}</span>
          </div>
          <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-fuchsia-400 to-violet-400 transition-all"
              style={{ width: countdown === null ? '0%' : `${(1 - (countdown / 10)) * 100}%` }}
            />
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full rounded-lg border border-zinc-600/50 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm py-2"
        >
          Reset Mission
        </button>
      </div>
    </div>
  );
}
