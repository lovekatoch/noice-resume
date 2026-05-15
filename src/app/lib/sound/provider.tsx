"use client";

import React, { createContext, useContext, useCallback, useMemo, useState, useEffect } from "react";
import { playSound, type SoundRole, type SoundPlayback } from "./engine";

// ─── Context shape ───

export interface SoundContextValue {
  /** Play a sound by its semantic role. Returns null if sounds are disabled. */
  play: (role: SoundRole) => Promise<SoundPlayback | null>;
  /** Whether the sound system is globally active. */
  enabled: boolean;
  /** Master volume (0–1). */
  volume: number;
  /** Whether sounds are muted. */
  muted: boolean;
  /** Toggle mute. */
  setMuted: (muted: boolean) => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

// ─── Hook ───

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    throw new Error("[SoundProvider] useSound must be called inside <SoundProvider>");
  }
  return ctx;
}

/** Convenience hook: returns a play function for a specific sound role. */
export function useSoundFor(role: SoundRole): () => void {
  const { play, enabled } = useSound();
  return useCallback(() => {
    if (enabled) void play(role);
  }, [play, role, enabled]);
}

// ─── Reduced motion hook ───

function useReducedMotion(): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    
    // Handle case where matchMedia is not available (e.g., in JSDOM test environment)
    if (typeof window.matchMedia !== "function") {
      return false;
    }
    
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Handle case where matchMedia is not available (e.g., in JSDOM test environment)
    if (typeof window.matchMedia !== "function") {
      return;
    }
    
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return matches;
}

// ─── Provider ───

interface SoundProviderProps {
  children: React.ReactNode;
  /** Master volume 0–1. Default 0.35. */
  volume?: number;
  /** Start enabled or disabled. Default true. */
  enabled?: boolean;
}

export function SoundProvider({
  children,
  volume: masterVolume = 0.35,
  enabled: startEnabled = true,
}: SoundProviderProps) {
  const [muted, setMuted] = useState(false);
  const reducedMotion = useReducedMotion();
  const shouldPlay = startEnabled && !muted && !reducedMotion;

  const play = useCallback(
    async (role: SoundRole): Promise<SoundPlayback | null> => {
      if (typeof window === "undefined") return null;
      if (!shouldPlay) return null;
      return playSound(role, { volume: masterVolume });
    },
    [shouldPlay, masterVolume]
  );

  const value = useMemo(
    () => ({
      play,
      enabled: shouldPlay,
      volume: masterVolume,
      muted,
      setMuted,
    }),
    [play, shouldPlay, masterVolume, muted]
  );

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
}
