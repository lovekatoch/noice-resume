/**
 * Sound Engine — Web Audio API synthesizer
 *
 * Framework-agnostic layer that handles AudioContext lifecycle and
 * sound synthesis via oscillator nodes. No audio files needed.
 *
 * Inspired by sensory-ui (https://sensory-ui.com).
 */

let audioContext: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (audioContext?.state === "closed") {
    audioContext = null;
  }
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export interface SoundPlayback {
  stop: () => void;
}

export interface PlaySoundOptions {
  volume?: number;
  playbackRate?: number;
  onEnd?: () => void;
}

// ─── Note frequencies ───

const NOTE = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
  C6: 1046.5, D6: 1174.66, E6: 1318.51, G6: 1567.98,
} as const;

// ─── Synthesizer functions ───
// Each returns a SoundPlayback handle. Uses "crisp" character:
// triangle waves, sharp attack, quick decay, bright filter.

function playTone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  volume: number,
  type: OscillatorType = "triangle",
  pitchMult = 1.1
): { osc: OscillatorNode; gain: GainNode } {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq * pitchMult;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);

  return { osc, gain };
}

/** interaction.tap — short, crisp tick */
export function soundTap(ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.5;
  const { osc, gain } = playTone(ctx, NOTE.C5, t, 0.06, vol, "triangle", 1.1);

  osc.onended = () => {
    try { osc.disconnect(); gain.disconnect(); } catch {}
    opts.onEnd?.();
  };

  return { stop: () => { try { osc.stop(); } catch {} } };
}

/** interaction.subtle — softer tick for sliders, keypresses */
export function soundSubtle(ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.3;
  const { osc, gain } = playTone(ctx, NOTE.E5, t, 0.03, vol, "sine", 1.0);

  osc.onended = () => {
    try { osc.disconnect(); gain.disconnect(); } catch {}
    opts.onEnd?.();
  };

  return { stop: () => { try { osc.stop(); } catch {} } };
}

/** interaction.toggle — two-tone for checkboxes, switches */
export function soundToggle(ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.4;
  const oscs: OscillatorNode[] = [];
  const gains: GainNode[] = [];

  [NOTE.C5, NOTE.E5].forEach((freq, i) => {
    const nt = t + i * 0.04;
    const { osc, gain } = playTone(ctx, freq, nt, 0.08, vol, "triangle", 1.1);
    oscs.push(osc);
    gains.push(gain);

    if (i === 1) {
      osc.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        gains.forEach(g => { try { g.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
}

/** interaction.confirm — ascending two-tone for saves */
export function soundConfirm(ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.45;
  const oscs: OscillatorNode[] = [];
  const gains: GainNode[] = [];

  [NOTE.G4, NOTE.D5].forEach((freq, i) => {
    const nt = t + i * 0.08;
    const { osc, gain } = playTone(ctx, freq, nt, i === 1 ? 0.2 : 0.1, vol, "triangle", 1.1);
    oscs.push(osc);
    gains.push(gain);

    if (i === 1) {
      osc.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        gains.forEach(g => { try { g.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
}

/** overlay.open — rising whoosh */
export function soundOverlayOpen(ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.35;

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(NOTE.C4, t);
  osc.frequency.linearRampToValueAtTime(NOTE.C5, t + 0.12);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, t);
  gain.gain.linearRampToValueAtTime(vol, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.2);

  osc.onended = () => {
    try { osc.disconnect(); gain.disconnect(); } catch {}
    opts.onEnd?.();
  };

  return { stop: () => { try { osc.stop(); } catch {} } };
}

/** overlay.close — falling whoosh */
export function soundOverlayClose(ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.3;

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(NOTE.C5, t);
  osc.frequency.linearRampToValueAtTime(NOTE.C3, t + 0.1);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, t);
  gain.gain.linearRampToValueAtTime(vol, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.17);

  osc.onended = () => {
    try { osc.disconnect(); gain.disconnect(); } catch {}
    opts.onEnd?.();
  };

  return { stop: () => { try { osc.stop(); } catch {} } };
}

/** overlay.expand — quick upward blip */
export function soundExpand(ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.35;
  const { osc, gain } = playTone(ctx, NOTE.G4, t, 0.1, vol, "triangle", 1.1);

  osc.onended = () => {
    try { osc.disconnect(); gain.disconnect(); } catch {}
    opts.onEnd?.();
  };

  return { stop: () => { try { osc.stop(); } catch {} } };
}

/** overlay.collapse — quick downward blip */
export function soundCollapse(ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.3;

  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(NOTE.E4, t);
  osc.frequency.linearRampToValueAtTime(NOTE.C4, t + 0.06);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, t);
  gain.gain.linearRampToValueAtTime(vol, t + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.12);

  osc.onended = () => {
    try { osc.disconnect(); gain.disconnect(); } catch {}
    opts.onEnd?.();
  };

  return { stop: () => { try { osc.stop(); } catch {} } };
}

/** navigation.tab — neutral blip */
export function soundTab(ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.35;
  const { osc, gain } = playTone(ctx, NOTE.D5, t, 0.05, vol, "triangle", 1.0);

  osc.onended = () => {
    try { osc.disconnect(); gain.disconnect(); } catch {}
    opts.onEnd?.();
  };

  return { stop: () => { try { osc.stop(); } catch {} } };
}

/** navigation.forward — ascending step */
export function soundForward(ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.35;
  const oscs: OscillatorNode[] = [];
  const gains: GainNode[] = [];

  [NOTE.C5, NOTE.E5, NOTE.G5].forEach((freq, i) => {
    const nt = t + i * 0.04;
    const { osc, gain } = playTone(ctx, freq, nt, 0.05, vol, "triangle", 1.1);
    oscs.push(osc);
    gains.push(gain);

    if (i === 2) {
      osc.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        gains.forEach(g => { try { g.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
}

/** navigation.backward — descending step */
export function soundBackward(ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.3;
  const oscs: OscillatorNode[] = [];
  const gains: GainNode[] = [];

  [NOTE.G5, NOTE.E5, NOTE.C5].forEach((freq, i) => {
    const nt = t + i * 0.04;
    const { osc, gain } = playTone(ctx, freq, nt, 0.05, vol, "triangle", 1.1);
    oscs.push(osc);
    gains.push(gain);

    if (i === 2) {
      osc.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        gains.forEach(g => { try { g.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
}

/** notification.success — bright ascending arpeggio */
export function soundSuccess(ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.5;
  const oscs: OscillatorNode[] = [];
  const gains: GainNode[] = [];

  [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6].forEach((freq, i) => {
    const nt = t + i * 0.06;
    const dur = i === 3 ? 0.3 : 0.06;
    const { osc, gain } = playTone(ctx, freq, nt, dur, vol, "triangle", 1.1);
    oscs.push(osc);
    gains.push(gain);

    if (i === 3) {
      osc.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        gains.forEach(g => { try { g.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
}

/** notification.info — single chime */
export function soundInfo(ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.4;
  const { osc, gain } = playTone(ctx, NOTE.A4, t, 0.2, vol, "sine", 1.0);

  osc.onended = () => {
    try { osc.disconnect(); gain.disconnect(); } catch {}
    opts.onEnd?.();
  };

  return { stop: () => { try { osc.stop(); } catch {} } };
}

/** hero.complete — pentatonic fanfare (download, milestone) */
export function soundHeroComplete(ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.6;
  const oscs: OscillatorNode[] = [];
  const gains: GainNode[] = [];

  // Pentatonic ascending run
  const notes = [NOTE.C5, NOTE.D5, NOTE.E5, NOTE.G5, NOTE.A5, NOTE.C6];
  notes.forEach((freq, i) => {
    const nt = t + i * 0.08;
    const isLast = i === notes.length - 1;
    const dur = isLast ? 0.35 : 0.06;

    const { osc, gain } = playTone(ctx, freq, nt, dur, vol, "triangle", 1.1);
    oscs.push(osc);
    gains.push(gain);

    if (isLast) {
      osc.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        gains.forEach(g => { try { g.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
}

/** hero.milestone — shorter celebratory arpeggio */
export function soundHeroMilestone(ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.55;
  const oscs: OscillatorNode[] = [];
  const gains: GainNode[] = [];

  [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6].forEach((freq, i) => {
    const nt = t + i * 0.07;
    const isLast = i === 3;
    const dur = isLast ? 0.25 : 0.05;

    const { osc, gain } = playTone(ctx, freq, nt, dur, vol, "triangle", 1.1);
    oscs.push(osc);
    gains.push(gain);

    if (isLast) {
      osc.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        gains.forEach(g => { try { g.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
}

// ─── Sound role map ───

export type SoundRole =
  | "interaction.tap"
  | "interaction.subtle"
  | "interaction.toggle"
  | "interaction.confirm"
  | "overlay.open"
  | "overlay.close"
  | "overlay.expand"
  | "overlay.collapse"
  | "navigation.tab"
  | "navigation.forward"
  | "navigation.backward"
  | "notification.info"
  | "notification.success"
  | "notification.warning"
  | "notification.error"
  | "hero.complete"
  | "hero.milestone";

const SOUND_MAP: Record<SoundRole, (ctx: AudioContext, opts: PlaySoundOptions) => SoundPlayback> = {
  "interaction.tap": soundTap,
  "interaction.subtle": soundSubtle,
  "interaction.toggle": soundToggle,
  "interaction.confirm": soundConfirm,
  "overlay.open": soundOverlayOpen,
  "overlay.close": soundOverlayClose,
  "overlay.expand": soundExpand,
  "overlay.collapse": soundCollapse,
  "navigation.tab": soundTab,
  "navigation.forward": soundForward,
  "navigation.backward": soundBackward,
  "notification.info": soundInfo,
  "notification.success": soundSuccess,
  "notification.warning": soundSuccess, // reuse success for now
  "notification.error": soundSuccess,   // reuse success for now
  "hero.complete": soundHeroComplete,
  "hero.milestone": soundHeroMilestone,
};

let activePlayback: SoundPlayback | null = null;

export async function playSound(
  role: SoundRole,
  options: PlaySoundOptions = {}
): Promise<SoundPlayback | null> {
  const { volume = 1, playbackRate = 1, onEnd } = options;

  try {
    const ctx = getAudioContext();

    if (ctx.state !== "running") {
      await ctx.resume();
    }

    // Cancel previous sound to prevent overlap on spam-clicks
    if (activePlayback) {
      try { activePlayback.stop(); } catch {}
      activePlayback = null;
    }

    const synthesizer = SOUND_MAP[role];
    if (!synthesizer) return null;

    const playback = synthesizer(ctx, {
      volume,
      playbackRate,
      onEnd: () => {
        if (activePlayback === playback) activePlayback = null;
        onEnd?.();
      },
    });

    activePlayback = playback;
    return playback;
  } catch {
    return null;
  }
}
