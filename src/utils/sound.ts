// Dual audio helper: Web Speech API (ru-RU) + Web Audio API synthesized feedback tones

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playTone(
  freq: number,
  duration = 0.12,
  type: OscillatorType = 'sine',
  volume = 0.12,
  delay = 0
): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export function playPop(enabled = true): void {
  if (!enabled) return;
  playTone(520, 0.08, 'triangle', 0.1);
}

export function playFlip(enabled = true): void {
  if (!enabled) return;
  playTone(390, 0.07, 'sine', 0.08);
}

export function playSuccess(enabled = true): void {
  if (!enabled) return;
  playTone(523.25, 0.12, 'triangle', 0.12, 0); // C5
  playTone(659.25, 0.14, 'triangle', 0.12, 0.08); // E5
  playTone(783.99, 0.22, 'triangle', 0.14, 0.16); // G5
}

export function playError(enabled = true): void {
  if (!enabled) return;
  playTone(280, 0.14, 'sine', 0.1, 0);
  playTone(220, 0.18, 'sine', 0.1, 0.1);
}

export function playFanfare(enabled = true): void {
  if (!enabled) return;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((n, idx) => {
    playTone(n, 0.22, 'triangle', 0.13, idx * 0.1);
  });
}

export function speakRussian(text: string, enabled = true, rate = 0.85): void {
  if (!enabled || typeof window === 'undefined') return;
  if (!('speechSynthesis' in window)) {
    playPop(true);
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = rate;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const ruVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith('ru')) ||
      voices.find((v) => v.name.toLowerCase().includes('russian'));

    if (ruVoice) {
      utterance.voice = ruVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    playPop(true);
  }
}
