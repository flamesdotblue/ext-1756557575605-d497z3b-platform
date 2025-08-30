import { Activity, Gauge, Satellite, Timer } from 'lucide-react';

function StatCard({ label, value, unit, icon: Icon, accent = 'fuchsia' }) {
  const accentClasses = {
    fuchsia: 'from-fuchsia-500/20 to-transparent border-fuchsia-400/30 text-fuchsia-300',
    cyan: 'from-cyan-500/20 to-transparent border-cyan-400/30 text-cyan-300',
    violet: 'from-violet-500/20 to-transparent border-violet-400/30 text-violet-300',
    emerald: 'from-emerald-500/20 to-transparent border-emerald-400/30 text-emerald-300',
  };
  return (
    <div className={`relative overflow-hidden rounded-xl border bg-[#0b0b18]/60 backdrop-blur-sm ${accentClasses[accent]} p-4`}> 
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-zinc-400">{label}</div>
        <Icon size={16} className="opacity-80" />
      </div>
      <div className="mt-2 flex items-end gap-1">
        <div className="text-2xl font-semibold">{value}</div>
        {unit && <div className="text-xs text-zinc-400 mb-1">{unit}</div>}
      </div>
    </div>
  );
}

function Sparkline({ data = [], stroke = '#f0abfc' }) {
  const w = 240; const h = 64; const pad = 6;
  if (data.length === 0) return <svg width={w} height={h} />;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = (w - pad * 2) / Math.max(1, data.length - 1);
  const pts = data.map((d, i) => {
    const x = pad + i * step;
    const y = h - pad - ((d - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} className="opacity-80">
      <polyline fill="none" stroke={stroke} strokeWidth="2" points={pts} />
    </svg>
  );
}

export default function TelemetryPanel({ telemetry, history, stage }) {
  const { speed, altitude, fuel, pitch, yaw, roll, gforce } = telemetry;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Velocity" value={(speed).toFixed(1)} unit="m/s" icon={Gauge} accent="fuchsia" />
        <StatCard label="Altitude" value={(altitude / 1000).toFixed(2)} unit="km" icon={Satellite} accent="cyan" />
        <StatCard label="Fuel" value={fuel.toFixed(1)} unit="%" icon={Activity} accent="emerald" />
        <StatCard label="G-Force" value={gforce.toFixed(2)} unit="g" icon={Timer} accent="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-fuchsia-400/20 bg-[#0b0b18]/60 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-300">Velocity Profile</h3>
            <span className="text-[10px] uppercase tracking-widest text-fuchsia-300">Stage {stage}</span>
          </div>
          <div className="mt-2">
            <Sparkline data={history.speed} stroke="#f0abfc" />
          </div>
        </div>
        <div className="rounded-xl border border-cyan-400/20 bg-[#0b0b18]/60 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-300">Altitude Profile</h3>
            <span className="text-[10px] uppercase tracking-widest text-cyan-300">Max {(Math.max(0, ...history.altitude)/1000).toFixed(1)} km</span>
          </div>
          <div className="mt-2">
            <Sparkline data={history.altitude} stroke="#67e8f9" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-emerald-400/20 bg-[#0b0b18]/60 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-300">Fuel Reserve</h3>
            <span className="text-[10px] uppercase tracking-widest text-emerald-300">{fuel.toFixed(0)}%</span>
          </div>
          <div className="mt-3 h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-200" style={{ width: `${Math.max(0, Math.min(100, fuel))}%` }} />
          </div>
        </div>
        <div className="rounded-xl border border-violet-400/20 bg-[#0b0b18]/60 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-300">Attitude</h3>
            <span className="text-[10px] uppercase tracking-widest text-violet-300">Pitch {pitch.toFixed(0)}°</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center text-sm text-zinc-300">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">Yaw<br/><span className="text-violet-300">{yaw.toFixed(0)}°</span></div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">Roll<br/><span className="text-violet-300">{roll.toFixed(0)}°</span></div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">G<br/><span className="text-violet-300">{gforce.toFixed(2)}</span></div>
          </div>
        </div>
        <div className="rounded-xl border border-pink-400/20 bg-[#0b0b18]/60 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-300">Fuel Trend</h3>
            <span className="text-[10px] uppercase tracking-widest text-pink-300">Live</span>
          </div>
          <div className="mt-2">
            <Sparkline data={history.fuel} stroke="#f472b6" />
          </div>
        </div>
      </div>
    </div>
  );
}
