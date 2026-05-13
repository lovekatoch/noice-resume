"use client";

import { useCallback } from "react";
import { useSound } from "./provider";
import type { SoundRole } from "./engine";

/**
 * useSoundEffect — plays a sound when `play()` is called.
 * Silently no-ops when disabled/muted.
 *
 * @example
 * ```tsx
 * const { play } = useSoundEffect("interaction.tap");
 * <button onClick={play}>Click me</button>
 * ```
 */
export function useSoundEffect(role: SoundRole): () => void {
  const { play, enabled } = useSound();
  return useCallback(() => {
    if (enabled) void play(role);
  }, [play, role, enabled]);
}
