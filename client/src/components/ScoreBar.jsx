import React from 'react';
import { CHALLENGE_IDS } from '../data/challenges.js';

const MAX_TOTAL = 660; // 6 × 100 + 6 × 10 time bonus

export default function ScoreBar({ scores, totalScore }) {
  const pct = Math.round((totalScore / MAX_TOTAL) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1 text-sm">
        <span className="text-slate-400">Total Score</span>
        <span className="font-mono text-orange-400 font-bold">
          {totalScore} / {MAX_TOTAL}
        </span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex gap-1 mt-2">
        {CHALLENGE_IDS.map((id) => (
          <div
            key={id}
            className={[
              'h-1.5 flex-1 rounded-full transition-all duration-300',
              scores[id] !== undefined
                ? scores[id] >= 80
                  ? 'bg-green-500'
                  : scores[id] >= 50
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
                : 'bg-slate-700',
            ].join(' ')}
            title={`${id}: ${scores[id] ?? 'not played'}`}
          />
        ))}
      </div>
    </div>
  );
}
