'use client';
import { useState } from "react";

export default function Home() {
  const [WitnessName, setWitnessName] = useState("");
  const [TranscriptText, setTranscriptText] = useState("");
  const [Issues, setIssues] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const accentColor = "hsl(220,60%,55%)";

  const handleGenerate = async () => {
    const body = {
      witness_name: WitnessName,
        transcript_text: TranscriptText,
        issues: Issues,
    };
        setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setOutput(data.result || data.error || "No response");
    } catch (e: any) {
      setOutput("Error: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: accentColor }}>Ai Deposition Summary</h1>
          <p className="text-gray-400 text-sm mt-0.5">witness_name + transcript_text + issues</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
          DeepSeek-powered
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Input Panel */}
        <div className="p-6 lg:p-8 flex flex-col gap-5 border-r border-white/5">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Input</div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-300 font-medium" htmlFor="witness_name">WitnessName</label>
              <input
                id="witness_name"
                type="text"
                value={WitnessName}
                onChange={e => setWitnessName(e.target.value)}
                placeholder="Enter witness name..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
            <textarea
              id="transcript_text"
              value={TranscriptText}
              onChange={e => setTranscriptText(e.target.value)}
              placeholder="Enter transcript text..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              rows={4}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-300 font-medium" htmlFor="issues">Issues</label>
              <input
                id="issues"
                type="text"
                value={Issues}
                onChange={e => setIssues(e.target.value)}
                placeholder="Enter issues..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !WitnessName || !TranscriptText || !Issues}
            className="rounded-lg py-3 text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95"
            style={{ backgroundColor: accentColor }}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* Output Panel */}
        <div className="p-6 lg:p-8 flex flex-col gap-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Output</div>
          <div className="flex-1 bg-gray-900/60 border border-white/10 rounded-lg p-5 text-sm text-gray-300 whitespace-pre-wrap overflow-auto prose prose-invert prose-sm max-w-none">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                Generating response...
              </span>
            ) : output ? (
              output
            ) : (
              <span className="text-gray-600">Response will appear here.</span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
