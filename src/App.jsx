import { useEffect, useMemo, useRef, useState } from 'react';
import { Rocket } from 'lucide-react';
import HeroSpline from './components/HeroSpline';
import TelemetryPanel from './components/TelemetryPanel';
import ControlsPanel from './components/ControlsPanel';
import MissionLog from './components/MissionLog';

export default function App() {
  const [armed, setArmed] = useState(false);
  const [throttle, setThrottle] = useState(60);
  const [countdown, setCountdown] = useState(null); // seconds or null
  const [launched, setLaunched] = useState(false);
  const [stage, setStage] = useState(1);

  const [telemetry, setTelemetry] = useState({
    speed: 0, // m/s
    altitude: 0, // m
    fuel: 100, // %
    pitch: 90, // degrees (90 = vertical)
    yaw: 0,
    roll: 0,
    gforce: 1,
  });

  const [history, setHistory] = useState({ speed: [], altitude: [], fuel: [], gforce: [] });
  const [log, setLog] = useState([]);

  const logRef = useRef([]);
  const appendLog = (message) => {
    const entry = { time: new Date(), message };
    logRef.current = [...logRef.current, entry];
    setLog(logRef.current);
  };

  // Initialize log
  useEffect(() => {
    appendLog('Mission Control initialized. Systems in standby.');
  }, []);

  // Countdown logic
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setCountdown(null);
      setLaunched(true);
      appendLog('Ignition. Liftoff!');
      return;
    }
    const t = setTimeout(() => setCountdown((c) => (c !== null ? c - 1 : null)), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Telemetry simulation
  useEffect(() => {
    let raf;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); // seconds, cap delta for stability
      last = now;

      setTelemetry((prev) => {
        let { speed, altitude, fuel, pitch, yaw, roll, gforce } = prev;

        const thr = throttle / 100;
        // Fuel consumption
        const burnRate = launched ? 0.6 * thr + (stage > 1 ? 0.2 * thr : 0) : countdown !== null ? 0.1 * thr : 0.02; // % per sec
        fuel = Math.max(0, fuel - burnRate * dt);

        // Acceleration model
        let thrustAccel = launched && fuel > 0 ? 40 * thr * (stage === 1 ? 1 : 0.6) : 0; // m/s^2
        const gravity = 9.81; // m/s^2
        const drag = 0.02 * speed; // simplistic drag
        let netAccel = thrustAccel - gravity - drag;
        if (!launched) netAccel = 0;

        // Update speed and altitude
        speed = Math.max(0, speed + netAccel * dt);
        altitude = Math.max(0, altitude + speed * dt);

        // Orientation dynamics
        if (launched) {
          pitch = Math.max(0, pitch - 3 * dt); // gradual pitch-over
          yaw = (yaw + 5 * dt) % 360;
          roll = (roll + (stage === 1 ? 20 : 10) * dt) % 360;
          gforce = 1 + Math.max(0, (thrustAccel - gravity) / 9.81);
        } else if (countdown !== null) {
          gforce = 1.05;
        } else {
          gforce = 1;
        }

        const next = { speed, altitude, fuel, pitch, yaw, roll, gforce };

        setHistory((h) => ({
          speed: [...h.speed, speed].slice(-64),
          altitude: [...h.altitude, altitude].slice(-64),
          fuel: [...h.fuel, fuel].slice(-64),
          gforce: [...h.gforce, gforce].slice(-64),
        }));

        // Stage separation trigger
        if (launched && stage === 1 && altitude > 35000 && fuel < 60) {
          setStage(2);
          appendLog('Main engine cutoff confirmed. Stage separation nominal.');
        }

        // Fuel depleted
        if (launched && fuel <= 0 && speed > 0) {
          appendLog('Fuel depleted. Beginning ballistic trajectory.');
        }

        return next;
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [launched, throttle, countdown, stage]);

  const initiateLaunch = () => {
    if (!armed) {
      appendLog('Launch blocked: System not armed.');
      return;
    }
    if (launched || countdown !== null) return;
    setCountdown(10);
    appendLog('Auto-sequence start. T-10 seconds.');
  };

  const abortLaunch = () => {
    if (countdown !== null) {
      setCountdown(null);
      appendLog('Abort received. Countdown halted.');
      return;
    }
    if (launched) {
      appendLog('Abort command ignored: Vehicle already launched.');
    }
  };

  const resetMission = () => {
    setArmed(false);
    setThrottle(60);
    setCountdown(null);
    setLaunched(false);
    setStage(1);
    setTelemetry({ speed: 0, altitude: 0, fuel: 100, pitch: 90, yaw: 0, roll: 0, gforce: 1 });
    setHistory({ speed: [], altitude: [], fuel: [], gforce: [] });
    logRef.current = [];
    setLog([]);
    appendLog('Mission reset. Systems in standby.');
  };

  const status = useMemo(() => {
    if (countdown !== null) return `T-${countdown}s`;
    if (launched) return `Flight • Stage ${stage}`;
    return armed ? 'Armed' : 'Safe';
  }, [countdown, launched, stage, armed]);

  return (
    <div className="min-h-screen bg-[#070712] text-zinc-100 selection:bg-fuchsia-500/30 selection:text-white">
      <header className="relative">
        <HeroSpline />
        <div className="absolute inset-x-0 bottom-0 pointer-events-none bg-gradient-to-t from-[#070712] via-[#070712]/60 to-transparent h-40" />
        <div className="absolute inset-x-0 top-0 p-6 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-fuchsia-500/20 border border-fuchsia-400/30 flex items-center justify-center">
              <Rocket className="text-fuchsia-300" size={18} />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Starship Mission Control</h1>
              <p className="text-xs text-zinc-400">Mars Ascent and Transit Operations</p>
            </div>
          </div>
          <div className="text-xs text-zinc-400">Status: <span className="text-fuchsia-300 font-medium">{status}</span></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 -mt-14 pb-24 relative z-10">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TelemetryPanel telemetry={telemetry} history={history} stage={stage} />
          </div>
          <div className="lg:col-span-1">
            <ControlsPanel
              armed={armed}
              setArmed={setArmed}
              throttle={throttle}
              setThrottle={setThrottle}
              countdown={countdown}
              launched={launched}
              stage={stage}
              onInitiate={initiateLaunch}
              onAbort={abortLaunch}
              onReset={resetMission}
            />
          </div>
        </section>

        <section className="mt-6">
          <MissionLog entries={log} />
        </section>
      </main>
    </div>
  );
}
