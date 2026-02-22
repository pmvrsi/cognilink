"use client";

import { useState, useRef } from "react";

interface VoicePlayerProps {
  text: string;           // The summary / lecture text to read aloud
  label?: string;         // Optional button label
}
export default function VoicePlayer({ text, label = "Listen" }: VoicePlayerProps) {
  const [state, setState] = useState<"idle" | "loading" | "playing" | "error">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = async () => {
    // If already playing, stop it
    if (state === "playing") {
      audioRef.current?.pause();
      audioRef.current = null;
      setState("idle");
      return;
    }

    setState("loading");

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("TTS request failed");

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
    } catch (err) {
      console.error(err);
      setState("error");
    }
  };

  const icons = {
    idle:    "",
    loading: "",
    playing: "⏹",
    error:   "",
  };

  const labels = {
    idle:    label,
    loading: "Loading...",
    playing: "Stop",
    error:   "Error – retry?",
  };

  return (
    <button
      onClick={handlePlay}
      disabled={state === "loading"}
      className={
        inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
        transition-colors duration-200
        ${state === "playing"
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-[#219ebc] hover:bg-[#1a7e96] text-white"}
        disabled:opacity-50 disabled:cursor-not-allowed
      }
    >
      <span>{icons[state]}</span>
      <span>{labels[state]}</span>
    </button>
  );
}
