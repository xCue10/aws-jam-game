import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CHALLENGE_MAP } from '../data/challenges.js';

function CorrectAnswerReveal({ challenge }) {
  if (challenge.type === 'order') {
    return (
      <div className="space-y-2">
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">Correct order</p>
        {challenge.correctAnswer.map((id, idx) => {
          const item = challenge.items.find((i) => i.id === id);
          return (
            <div key={id} className="flex items-start gap-3 bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2">
              <span className="font-mono text-orange-400 w-5 shrink-0">{idx + 1}</span>
              <div>
                <p className="text-sm text-white font-mono">{item?.label}</p>
                {item?.detail && <p className="text-xs text-slate-400 mt-0.5">{item.detail}</p>}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">Correct placements</p>
      {challenge.zones.map((zone) => {
        const correctIds = challenge.correctAnswer[zone.id] ?? [];
        return (
          <div key={zone.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
            <p className="text-sm font-semibold text-white mb-2">{zone.label}</p>
            <div className="flex flex-wrap gap-2">
              {correctIds.map((id) => {
                const item = challenge.items.find((i) => i.id === id);
                return (
                  <span
                    key={id}
                    className="text-xs font-mono bg-slate-700 text-slate-200 border border-slate-600 px-2 py-1 rounded"
                  >
                    {item?.label}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Results({ scores, cluesUsed }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const challenge = CHALLENGE_MAP[id];

  if (!challenge || scores[id] === undefined) {
    navigate('/board');
    return null;
  }

  const score = scores[id];
  const usedClue = cluesUsed?.[id];
  const pct = score;

  const grade =
    score >= 90 ? { label: 'Excellent', color: 'text-green-400' }
    : score >= 70 ? { label: 'Good', color: 'text-sky-400' }
    : score >= 50 ? { label: 'Partial', color: 'text-yellow-400' }
    : { label: 'Needs Work', color: 'text-red-400' };

  return (
    <div className="min-h-screen bg-[#161F2E] px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Score card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">{challenge.domain} · {challenge.title}</p>
          <div className="text-7xl font-bold font-mono text-white my-4">{score}</div>
          <div className={`text-2xl font-semibold ${grade.color} mb-2`}>{grade.label}</div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-4">
            <div
              className={`h-2 rounded-full transition-all ${
                pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {usedClue && (
            <p className="mt-3 text-xs text-yellow-400">-25 pts clue penalty applied</p>
          )}
        </div>

        {/* Explanation */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 space-y-4">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Explanation</p>
            <p className="text-slate-200 leading-relaxed">{challenge.explanation}</p>
          </div>
          <div className="border-t border-slate-700 pt-4">
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Real AWS Tool</p>
            <p className="text-sky-400 font-mono font-semibold">{challenge.awsTool}</p>
          </div>
        </div>

        {/* Correct answer reveal */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
          <CorrectAnswerReveal challenge={challenge} />
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/board')}
            className="flex-1 py-3 rounded-xl font-semibold text-white bg-orange-500 hover:bg-orange-400 transition-all"
          >
            Back to Mission Board
          </button>
          <button
            onClick={() => navigate(`/challenge/${id}`)}
            className="px-6 py-3 rounded-xl text-slate-300 hover:text-white border border-slate-600 hover:border-slate-400 transition-all text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
