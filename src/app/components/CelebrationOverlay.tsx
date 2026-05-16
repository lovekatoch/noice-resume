"use client";

import { useEffect, useState, useRef } from "react";
import { useSound } from "lib/sound/provider";

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  rotation: number;
  drift: number;
}

interface CelebrationOverlayProps {
  show: boolean;
  onComplete?: () => void;
}

const COLORS = ["#1E3A5F", "#27A644", "#FFD700", "#FF6B6B", "#4ECDC4", "#A78BFA", "#FF9F43"];

function randomDownloaderNum(): number {
  return 12000 + Math.floor(Math.random() * 4000);
}

function MilestoneCard({ downloaderNum }: { downloaderNum: number }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className="flex flex-col items-center text-center px-6 py-5 rounded-2xl"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 24px 48px rgba(0,0,0,0.12)",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0) scale(1)" : "translateY(12px) scale(0.96)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        className="flex items-center justify-center rounded-full mb-3"
        style={{
          width: 40,
          height: 40,
          backgroundColor: "rgba(39,166,68,0.12)",
          color: "var(--success)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <p className="text-sm font-semibold" style={{ color: "var(--fg)", fontFamily: "var(--font-display)" }}>
        You are downloader
      </p>
      <p
        className="text-3xl font-bold mt-0.5 tabular-nums"
        style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}
      >
        #{downloaderNum.toLocaleString()}
      </p>
      <p className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>
        today
      </p>
    </div>
  );
}

export function CelebrationOverlay({ show, onComplete }: CelebrationOverlayProps) {
  const { play } = useSound();
  const [particles, setParticles] = useState<Particle[]>([]);
  const downloaderNum = useRef(randomDownloaderNum());

  useEffect(() => {
    if (show) {
      void play("hero.milestone");

      const newParticles: Particle[] = Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 3 + Math.random() * 5,
        rotation: Math.random() * 360,
        drift: -20 + Math.random() * 40,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 3800);
      return () => clearTimeout(timer);
    }
  }, [show]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!show || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100]" aria-hidden="true">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-celebration-particle"
            style={{
              left: `${p.x}%`,
              bottom: "-8px",
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              borderRadius: p.id % 3 === 0 ? "2px" : "50%",
              animationDelay: `${p.id * 0.03}s`,
              ["--drift" as string]: `${p.drift}px`,
              ["--rotation" as string]: `${p.rotation}deg`,
            }}
          />
        ))}
      </div>
      <div className="relative" style={{ marginTop: "-15vh" }}>
        <MilestoneCard downloaderNum={downloaderNum.current} />
      </div>
    </div>
  );
}
