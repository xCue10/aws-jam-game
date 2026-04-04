import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CHALLENGE_MAP } from '../data/challenges.js';
import DragDropChallenge from '../components/DragDropChallenge.jsx';
import { useTimer } from '../hooks/useTimer.js';

export default function Challenge({ onComplete, scores }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const challenge = CHALLENGE_MAP[id];
  const { elapsed, start, stop, timeBonus } = useTimer();

  useEffect(() => {
    if (challenge) start();
  }, [challenge?.id]);

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#161F2E] flex items-center justify-center text-white">
        Challenge not found.{' '}
        <button onClick={() => navigate('/board')} className="text-orange-400 underline ml-2">
          Back to board
        </button>
      </div>
    );
  }

  const alreadyPlayed = scores[challenge.id] !== undefined;

  const handleSubmit = (rawScore, placed, usedClue) => {
    const finalElapsed = stop();
    const tb = finalElapsed < 60 ? 10 : finalElapsed < 90 ? 5 : 0;
    onComplete(challenge.id, rawScore, tb, usedClue);
    navigate(`/results/${challenge.id}`);
  };

  return (
    <div className="min-h-screen bg-[#161F2E] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/board')}
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          ← Mission Board
        </button>

        {/* Challenge header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-1">
              {challenge.domain}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <span>{challenge.icon}</span>
              {challenge.title}
            </h1>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-3">
            <div className="font-mono text-2xl text-slate-300 tabular-nums">
              {String(Math.floor(elapsed / 60)).padStart(2, '0')}:
              {String(elapsed % 60).padStart(2, '0')}
            </div>
            {elapsed < 60 && (
              <span className="text-xs text-green-400 border border-green-500/40 bg-green-500/10 px-2 py-0.5 rounded-full">
                +10 bonus
              </span>
            )}
          </div>
        </div>

        {/* Already played banner */}
        {alreadyPlayed && (
          <div className="bg-sky-500/10 border border-sky-500/40 rounded-xl px-4 py-3 text-sky-300 text-sm">
            You scored <strong>{scores[challenge.id]} pts</strong> on this challenge. Re-submitting will overwrite your score.
          </div>
        )}

        {/* Scenario */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Scenario</p>
          <p className="text-slate-200 leading-relaxed">{challenge.scenario}</p>
        </div>

        {/* Drag-drop engine */}
        <DragDropChallenge challenge={challenge} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
