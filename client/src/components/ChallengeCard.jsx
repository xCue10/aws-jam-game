import React from 'react';
import { useNavigate } from 'react-router-dom';

const DIFFICULTY_STYLES = {
  easy:   'bg-green-500/20 text-green-400 border-green-500/40',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  hard:   'bg-red-500/20 text-red-400 border-red-500/40',
};

export default function ChallengeCard({ challenge, score, completed }) {
  const navigate = useNavigate();
  const diffStyle = DIFFICULTY_STYLES[challenge.difficulty] ?? '';

  return (
    <button
      onClick={() => navigate(`/challenge/${challenge.id}`)}
      className="group w-full text-left rounded-2xl border border-slate-700 bg-slate-800/50 hover:border-orange-500/60 hover:bg-slate-800 transition-all p-5 flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-3xl">{challenge.icon}</span>
        <div className="flex flex-col items-end gap-1">
          {challenge.difficulty && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${diffStyle}`}>
              {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
            </span>
          )}
          {completed ? (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-green-500/20 text-green-400 border-green-500/40">
              {score} pts
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-500 border border-slate-700 px-2 py-0.5 rounded-full">
              {challenge.maxPoints} pts max
            </span>
          )}
        </div>
      </div>

      {/* Text */}
      <div>
        <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-1">
          {challenge.domain}
        </p>
        <h3 className="text-white font-semibold text-lg leading-tight group-hover:text-orange-300 transition-colors">
          {challenge.title}
        </h3>
        <p className="mt-2 text-slate-400 text-sm leading-snug">{challenge.description}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 mt-auto">
        <span className="text-xs text-sky-400 font-mono">{challenge.awsTool}</span>
      </div>
    </button>
  );
}
