import Spline from '@splinetool/react-spline';

export default function HeroSpline() {
  return (
    <div className="relative w-full h-[60vh] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070712]/20 to-[#070712] pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-200 text-xs tracking-wide">
            MISSION • ARES-M7
          </div>
          <h2 className="mt-4 text-3xl sm:text-5xl font-semibold leading-tight">
            Engage the stars. Chart a path to Mars.
          </h2>
          <p className="mt-3 text-zinc-300 max-w-2xl mx-auto">
            A dark, futuristic control deck with live telemetry and launch controls. Interact with the scene, arm systems, and run a simulated countdown.
          </p>
        </div>
      </div>
    </div>
  );
}
