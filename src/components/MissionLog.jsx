export default function MissionLog({ entries = [] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0b18]/80 backdrop-blur-md p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-zinc-300">Mission Log</h3>
        <span className="text-[10px] uppercase tracking-widest text-zinc-400">Live Feed</span>
      </div>
      <div className="h-56 overflow-auto rounded-md bg-black/20 border border-white/5 p-3 font-mono text-xs text-zinc-300">
        {entries.length === 0 && <div className="text-zinc-500">Awaiting events…</div>}
        {entries.map((e, i) => (
          <div key={i} className="flex gap-2 py-0.5">
            <span className="text-zinc-500">[{new Date(e.time).toLocaleTimeString()}]</span>
            <span className="text-zinc-200">{e.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
