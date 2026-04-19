"use client";

import { useState } from "react";

export default function DepositionSummaryPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">AI Deposition Summary Generator</h1>
          </div>
          <p className="text-gray-400 text-lg">Generate structured, attorney-ready deposition summaries with key testimony analysis</p>
        </header>

        <div className="space-y-4 mb-6">
          <label className="block text-sm font-medium text-gray-300">Deposition Transcript</label>
          <textarea
            className="w-full h-48 bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none"
            placeholder="Paste the deposition transcript or key excerpts here...&#10;&#10;Example:&#10;Q: Can you describe the events of March 15th?&#10;A: Yes, I arrived at the facility around 9 AM and observed the respondent performing the activity in question.&#10;Q: Who else was present?&#10;A: Mr. Thompson and Ms. Garcia were there.&#10;Q: Did you document anything?&#10;A: I took photographs and made contemporaneous notes."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <button
          onClick={analyze}
          disabled={loading || !input.trim()}
          className="w-full py-3.5 px-6 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating Summary...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Summary
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-700/50 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-200 mb-3">Deposition Summary</h2>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
              {result}
            </div>
          </div>
        )}

        <footer className="mt-12 text-center text-gray-600 text-xs">
          Powered by DeepSeek AI · Attorney work product · Not legal advice
        </footer>
      </div>
    </main>
  );
}
