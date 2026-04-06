import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CHALLENGE_MAP } from '../data/challenges.js';
import DragDropChallenge from '../components/DragDropChallenge.jsx';
import { useTimer } from '../hooks/useTimer.js';

const DIFFICULTY_STYLES = {
  easy:   'bg-green-500/20 text-green-400 border-green-500/40',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  hard:   'bg-red-500/20 text-red-400 border-red-500/40',
};

function DifficultyBadge({ difficulty }) {
  if (!difficulty) return null;
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${DIFFICULTY_STYLES[difficulty] ?? ''}`}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  );
}

export default function Challenge({ onComplete, scores }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const challenge = CHALLENGE_MAP[id];
  const { elapsed, remaining, isExpired, start, stop, timeBonus } = useTimer();
  const autoSubmitRef = useRef(null);

  useEffect(() => {
    if (challenge) start();
  }, [challenge?.id]);

  // Auto-submit when countdown expires
  useEffect(() => {
    if (isExpired && autoSubmitRef.current) {
      autoSubmitRef.current();
    }
  }, [isExpired]);

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
    onComplete(challenge.id, rawScore, tb, usedClue, challenge.maxPoints ?? 100);
    navigate(`/results/${challenge.id}`);
  };

  // Countdown display
  const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
  const secs = String(remaining % 60).padStart(2, '0');
  const timerUrgent = remaining <= 60;
  const timerWarning = remaining <= 120 && remaining > 60;

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
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest">
                {challenge.domain}
              </p>
              <DifficultyBadge difficulty={challenge.difficulty} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <span>{challenge.icon}</span>
              {challenge.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">Up to {challenge.maxPoints} pts</p>
          </div>

          {/* Countdown timer */}
          <div className="flex flex-col items-end gap-1">
            <div className={`font-mono text-2xl tabular-nums font-bold ${
              timerUrgent ? 'text-red-400 animate-pulse' :
              timerWarning ? 'text-yellow-400' :
              'text-slate-300'
            }`}>
              {mins}:{secs}
            </div>
            {elapsed < 60 && (
              <span className="text-xs text-green-400 border border-green-500/40 bg-green-500/10 px-2 py-0.5 rounded-full">
                +10 speed bonus
              </span>
            )}
            {elapsed >= 60 && elapsed < 90 && (
              <span className="text-xs text-sky-400 border border-sky-500/40 bg-sky-500/10 px-2 py-0.5 rounded-full">
                +5 speed bonus
              </span>
            )}
            {timerUrgent && (
              <span className="text-xs text-red-400">Time running out!</span>
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
        <DragDropChallenge
          challenge={challenge}
          onSubmit={handleSubmit}
          autoSubmitRef={autoSubmitRef}
        />
      </div>
    </div>
  );
}
