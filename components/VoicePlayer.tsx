"use client";

import { useState, useRef } from "react";
import { Volume2, Square, Loader2 } from "lucide-react";

interface VoicePlayerProps {
  text: string;
  label?: string;
  className?: string;
}

type PlayerState = "idle" | "loading" | "playing" | "error";

export default function VoicePlayer({ text, label = "Listen", className = "" }: VoicePlayerProps) {
  const [state, setState] = useState<PlayerState>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setState("idle");
  };

  const play = async () => {
    setState("loading");
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("TTS failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setState("idle");
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        setState("error");
        URL.revokeObjectURL(url);
      };

      await audio.play();
      setState("playing");
    } catch {
      setState("error");
    }
  };

  const handleClick = () => {
    if (state === "playing") return stop();
    if (state === "loading") return;
    play();
  };

  const getButtonStyle = (): string => {
    if (state === "playing") return "bg-red-500/15 border-red-500/40 text-red-400 hover:bg-red-500/25";
    if (state === "error")   return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20";
    return "bg-[#219ebc]/10 border-[#219ebc]/30 text-[#219ebc] hover:bg-[#219ebc]/20";
  };

  const getLabel = (): string => {
    if (state === "loading") return "Loading...";
    if (state === "playing") return "Stop";
    if (state === "error")   return "Retry";
    return label;
  };

  return (
    <button
      onClick={handleClick}
      disabled={state === "loading"}
      className={[
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
        "border transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        getButtonStyle(),
        className,
      ].join(" ")}
    >
      {state === "loading" && <Loader2 size={14} className="animate-spin" />}
      {state === "playing" && <Square size={14} />}
      {(state === "idle" || state === "error") && <Volume2 size={14} />}
      <span>{getLabel()}</span>
    </button>
  );
}
