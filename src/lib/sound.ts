/**
 * Tiny synthesised interaction sounds — no audio assets. Only ever called
 * after the visitor has explicitly enabled sound in Control Center.
 */
type Tick = "open" | "close" | "toggle";

const FREQ: Record<Tick, number> = { open: 880, close: 620, toggle: 520 };

let ctx: AudioContext | null = null;

export function playTick(kind: Tick = "toggle"): void {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(FREQ[kind], t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.05, t + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  } catch {
    /* Audio unavailable — silently ignore. */
  }
}
