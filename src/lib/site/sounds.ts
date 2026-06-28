// ═══ Sound Effects System for St. Xavier's Website ═══
// Uses real audio files from /public/sounds/ + Web Audio API fallback
// Sounds are loaded on-demand (lazy) for better performance

let audioCtx: AudioContext | null = null;
const audioCache = new Map<string, HTMLAudioElement>();

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

// Play an audio file from /public/sounds/
function playFile(name: string, volume = 0.3) {
  if (typeof window === "undefined") return;
  
  // Check if already cached
  let audio = audioCache.get(name);
  if (!audio) {
    audio = new Audio(`/sounds/${name}.wav`);
    audio.preload = "auto";
    audioCache.set(name, audio);
  }
  
  // Clone for overlapping playback
  const clone = audio.cloneNode() as HTMLAudioElement;
  clone.volume = volume;
  clone.play().catch(() => {
    // Autoplay policy — will work after first user interaction
  });
}

// Web Audio API fallback tone (used if file fails to load)
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

export const sounds = {
  // Soft click for buttons — real audio file
  click() {
    playFile("click", 0.4);
  },
  
  // Hover sound — very subtle
  hover() {
    playFile("hover", 0.15);
  },
  
  // Success — pleasant rising melody
  success() {
    playFile("success", 0.5);
  },
  
  // Error — descending tone
  error() {
    playFile("error", 0.4);
  },
  
  // Notification bell
  notification() {
    playFile("notification", 0.4);
  },
  
  // Whoosh — for page transitions / scroll to top
  whoosh() {
    playFile("whoosh", 0.3);
  },
  
  // Pop — for accordion expand
  pop() {
    playFile("pop", 0.4);
  },
  
  // Slide open — for mobile menu
  slideOpen() {
    playFile("slide-open", 0.4);
  },
  
  // Slide close — reverse of slideOpen
  slideClose() {
    playFile("slide-close", 0.4);
  },
  
  // Sparkle — for hero confetti
  sparkle() {
    playFile("sparkle", 0.4);
  },
  
  // Toggle — for theme/language switch
  toggle() {
    playFile("toggle", 0.4);
  },
  
  // Chime — for section reveals (subtle, pleasant)
  chime() {
    playFile("chime", 0.2);
  },
  
  // Tada — for special achievements / success
  tada() {
    playFile("tada", 0.5);
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
