"use client";
import { useEffect, useRef } from "react";

export function BackgroundAmbience() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onVol = () => {
      const v =
        Number(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--sound-scale"
          )
        ) || 0;
      el.volume = Math.max(0, Math.min(v, 1));
    };
    onVol();
    const id = setInterval(onVol, 500); // poll tokens (simple)
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -z-10 inset-0"
      >
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald-100 blur-3xl opacity-[calc(0.5*var(--motion-scale))]" />
        <div className="absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-sky-100 blur-3xl opacity-[calc(0.5*var(--motion-scale))]" />
      </div>
      {/* lightweight, license-free ambience placeholder; replace with your asset */}
      <audio ref={audioRef} loop preload="none" className="hidden">
        <source src="/ambience.mp3" type="audio/mpeg" />
      </audio>
    </>
  );
}
