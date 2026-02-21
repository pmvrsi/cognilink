// app/page.js
"use client";
import { useState } from "react";

export default function Home() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  const callGemini = async () => {
    setLoading(true);
    const res = await fetch("/api/gemini", {
      method: "POST",
      body: JSON.stringify({ prompt: "Write a 1-sentence hello world message." }),
    });
    const result = await res.json();
    setData(result.message);
    setLoading(false);
  };

  return (
    <main className="p-10">
      <button 
        onClick={callGemini}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Thinking..." : "Click me to call Gemini"}
      </button>
      <div className="mt-4 p-4 border rounded bg-gray-50">
        <strong>Response:</strong> {data}
      </div>
    </main>
  );
}