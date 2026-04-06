import React from 'react';
import { challenges, CHALLENGE_IDS } from '../data/challenges.js';

const MAX_TOTAL = 1200;
const R = 44;
const CIRC = 2 * Math.PI * R; // ≈ 276.5

export default function ScoreBar({ scores, totalScore }) {
  const scorePct = Math.min(100, Math.round((totalScore / MAX_TOTAL) * 100));
  const scoreOffset = CIRC * (1 - scorePct / 100);
  const completedCount = Object.keys(scores).length;
  const total = challenges.length;

  return (
    <div className="flex items-center gap-6">
      {/* Circular progress ring */}
      <div className="relative shrink-0 w-28 h-28">
        <svg width="112" height="112" viewBox="0 0 100 100" className="-rotate-90">
          {/* Track */}
          <circle
            cx="50" cy="50" r={R}
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
          />
          {/* Progress */}
          <circle
            cx="50" cy="50" r={R}
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={scoreOffset}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold font-mono text-orange-400 leading-none">{totalScore}</span>
          <span className="text-xs text-slate-500 font-mono">/ {MAX_TOTAL}</span>
        </div>
      </div>

      {/* Right side: challenge count + per-challenge dots */}
      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-slate-400">
            <span className="text-white font-semibold">{completedCount}</span>
            <span className="text-slate-500"> / {total} challenges</span>
          </span>
          <span className="text-xs font-mono text-orange-400">{scorePct}%</span>
        </div>

        {/* Per-challenge dots */}
        <div className="flex gap-1.5 flex-wrap">
          {challenges.map((c) => {
            const s = scores[c.id];
            const done = s !== undefined;
            const maxP = (c.maxPoints ?? 100) + 10;
            const q = done ? Math.round((s / maxP) * 100) : 0;
            return (
              <div
                key={c.id}
                title={`${c.title}: ${done ? s + ' pts' : 'not started'}`}
                className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center border transition-all ${
                  done
                    ? q >= 80
                      ? 'bg-green-500/30 border-green-500/60'
                      : q >= 50
                      ? 'bg-yellow-500/30 border-yellow-500/60'
                      : 'bg-red-500/30 border-red-500/60'
                    : 'bg-slate-700/40 border-slate-700'
                }`}
              >
                {c.icon}
              </div>
            );
          })}
        </div>

        {/* Thin score bar */}
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-orange-300 rounded-full transition-all duration-500"
            style={{ width: `${scorePct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
