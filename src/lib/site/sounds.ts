// ═══ Sound Effects System for St. Xavier's Website ═══
// Lightweight Web Audio API based — no external files needed
// All sounds generated programmatically, ~0 KB download

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

// Play a tone with given frequency, duration, type, and volume
function tone(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.1, delay = 0) {
  const ctx = getCtx();
  if (!ctx) return;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = type;
  osc.frequency.value = freq;
  
  const startTime = ctx.currentTime + delay;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(startTime);
  osc.stop(startTime + duration);
}

// Play a chord (multiple frequencies simultaneously)
function chord(freqs: number[], duration: number, type: OscillatorType = "sine", volume = 0.08) {
  freqs.forEach(f => tone(f, duration, type, volume));
}

export const sounds = {
  // Soft click for buttons
  click() {
    tone(800, 0.05, "sine", 0.05);
  },
  
  // Hover sound — very subtle
  hover() {
    tone(1200, 0.03, "sine", 0.02);
  },
  
  // Success — pleasant rising chord (C-E-G)
  success() {
    tone(523.25, 0.15, "sine", 0.08); // C5
    tone(659.25, 0.15, "sine", 0.08, 0.05); // E5
    tone(783.99, 0.25, "sine", 0.08, 0.1); // G5
  },
  
  // Error — descending minor (A-F)
  error() {
    tone(440, 0.15, "sawtooth", 0.06); // A4
    tone(349.23, 0.25, "sawtooth", 0.06, 0.1); // F4
  },
  
  // Notification bell — pleasant ding
  notification() {
    tone(880, 0.3, "sine", 0.1); // A5
    tone(1760, 0.3, "sine", 0.05); // A6 (harmonic)
  },
  
  // Whoosh — for page transitions / reveals
  whoosh() {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  },
  
  // Pop — for accordion expand
  pop() {
    tone(600, 0.08, "sine", 0.06);
    tone(900, 0.08, "sine", 0.04, 0.02);
  },
  
  // Slide — for mobile menu open
  slideOpen() {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  },
  
  // Slide close — reverse of slideOpen
  slideClose() {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  },
  
  // Sparkle — for hero confetti
  sparkle() {
    tone(1318.51, 0.1, "sine", 0.06); // E6
    tone(1567.98, 0.1, "sine", 0.05, 0.05); // G6
    tone(2093, 0.15, "sine", 0.04, 0.1); // C7
  },
  
  // Toggle — for theme/language switch
  toggle() {
    tone(500, 0.05, "square", 0.03);
    tone(750, 0.05, "square", 0.03, 0.03);
  },
};

// Sound preferences
let _soundEnabled = true;

export function setSoundEnabled(enabled: boolean) {
  _soundEnabled = enabled;
  try { localStorage.setItem("xavier-sound", enabled ? "1" : "0"); } catch {}
}

export function isSoundEnabled() {
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem("xavier-sound");
    if (stored !== null) return stored === "1";
  } catch {}
  return true;
}

// Initialize from storage
if (typeof window !== "undefined") {
  _soundEnabled = isSoundEnabled();
}

// Safe play — checks if sound is enabled
export function play(soundName: keyof typeof sounds) {
  if (!_soundEnabled) return;
  try { sounds[soundName](); } catch {}
}
