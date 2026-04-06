import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';


const DOMAINS = [
  '🔐 IAM', '🏛️ SCPs', '🛡️ GuardDuty', '🔍 Inspector',
  '⚙️ Systems Manager', '🌐 WAF', '🗄️ Macie/KMS',
  '🔑 Secrets Manager', '📋 CloudTrail', '💾 Backup',
];

export default function Landing({ onStart }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/scores/player/${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      const restoredScores = data.scores && typeof data.scores === 'object' ? data.scores : {};
      onStart(trimmed, restoredScores);
    } catch {
      onStart(trimmed, {});
    } finally {
      setLoading(false);
    }
    navigate('/board');
  };

  return (
    <div className="min-h-screen bg-[#161F2E] flex flex-col items-center justify-center px-4">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#00A3E0 1px, transparent 1px), linear-gradient(90deg, #00A3E0 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 w-full max-w-lg text-center space-y-8">
        {/* Logo / badge */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-4xl">
            ☁️
          </div>
          <p className="text-xs font-semibold tracking-widest text-orange-400 uppercase">
            CSN Low Code Cloud Club
          </p>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            AWS Security<br />
            <span className="text-orange-400">Jam Simulator</span>
          </h1>
          <p className="mt-4 text-slate-400 text-lg">
            10 real-world cloud security challenges.<br />
            Drag, drop, and defend.
          </p>
        </div>

        {/* Challenge domains */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
          {DOMAINS.map((d) => (
            <span key={d} className="bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-1.5 font-mono text-center">
              {d}
            </span>
          ))}
        </div>

        {/* Event info */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-400 text-center space-y-0.5">
          <p className="text-orange-400 font-semibold uppercase tracking-widest text-xs">National AWS Jam Showdown · Prep Workshop</p>
          <p>April 7, 2026 · CSN Charleston · Bldg C, Room 115</p>
        </div>

        {/* Start form */}
        <form onSubmit={handleStart} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your name to begin..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            className="w-full bg-slate-800 border border-slate-600 focus:border-orange-500 outline-none text-white placeholder-slate-500 rounded-xl px-4 py-3 font-mono text-sm transition-colors"
            autoFocus
          />
          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-orange-500 hover:bg-orange-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-all text-lg"
          >
            {loading ? 'Loading...' : 'Start Mission →'}
          </button>
        </form>

        <div className="flex items-center justify-center gap-4 text-slate-600 text-xs">
          <span>No account required</span>
          <span>·</span>
          <button onClick={() => navigate('/leaderboard')} className="hover:text-slate-400 transition-colors underline underline-offset-2">
            View leaderboard
          </button>
        </div>

        {/* QR code */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-white p-3 rounded-xl">
            <QRCodeSVG value={typeof window !== 'undefined' ? window.location.origin : ''} size={96} />
          </div>
          <p className="text-slate-600 text-xs">Scan to open on your device</p>
        </div>
      </div>
    </div>
  );
}
