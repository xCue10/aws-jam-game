import React from 'react';
import { useNavigate } from 'react-router-dom';
import { challenges } from '../data/challenges.js';
import ChallengeCard from '../components/ChallengeCard.jsx';
import ScoreBar from '../components/ScoreBar.jsx';

export default function MissionBoard({ playerName, scores, totalScore }) {
  const navigate = useNavigate();
  const completedCount = Object.keys(scores).length;
  const allComplete = completedCount === challenges.length;

  return (
    <div className="min-h-screen bg-[#161F2E] px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-1">
              Mission Board
            </p>
            <h1 className="text-3xl font-bold text-white">
              Welcome, <span className="text-orange-400">{playerName}</span>
            </h1>
            <p className="text-slate-400 mt-1">
              {completedCount}/{challenges.length} challenges complete
              {allComplete && <span className="ml-2 text-green-400">· All done!</span>}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/leaderboard')}
              className="px-4 py-2 rounded-xl border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white text-sm font-semibold transition-all"
            >
              🏆 Leaderboard
            </button>
            {allComplete && (
              <button
                onClick={() => navigate('/final')}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl transition-all"
              >
                View Final Score →
              </button>
            )}
          </div>
        </div>

        {/* Score bar */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
          <ScoreBar scores={scores} totalScore={totalScore} />
        </div>

        {/* Challenge grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((c) => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              score={scores[c.id]}
              completed={scores[c.id] !== undefined}
            />
          ))}
        </div>

        {/* Tip */}
        {!allComplete && (
          <p className="text-slate-600 text-sm text-center">
            Complete all 10 challenges in any order to unlock your final score.
          </p>
        )}
      </div>
    </div>
  );
}
