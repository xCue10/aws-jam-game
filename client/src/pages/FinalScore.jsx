import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { challenges } from '../data/challenges.js';

// 2×easy(85) + 5×medium(110) + 3×hard(160) = 170+550+480 = 1200
const MAX_TOTAL = 1200;

function ScoreTier({ score }) {
  if (score >= 1000) return { label: 'Cloud Security Expert', color: 'text-orange-400', emoji: '🏆' };
  if (score >= 720)  return { label: 'Security Analyst', color: 'text-sky-400', emoji: '🛡️' };
  if (score >= 450)  return { label: 'Cloud Defender', color: 'text-green-400', emoji: '☁️' };
  return { label: 'Security Apprentice', color: 'text-yellow-400', emoji: '📚' };
}

export default function FinalScore({ playerName, scores, totalScore }) {
  const navigate = useNavigate();
  const [rank, setRank] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const tier = ScoreTier({ score: totalScore });

  useEffect(() => {
    const completedCount = Object.keys(scores).length;
    if (completedCount < challenges.length) {
      navigate('/board');
      return;
    }

    if (!submitted) {
      setSubmitting(true);
      fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName, scores, totalScore }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.rank) setRank(data.rank);
          setSubmitted(true);
        })
        .catch(() => setSubmitted(true))
        .finally(() => setSubmitting(false));
    }
  }, []);

  const shareText = `I scored ${totalScore}/${MAX_TOTAL} on the AWS Security Jam Simulator! 🔐☁️ #AWSJam #CloudSecurity #LC3 #CSN`;

  return (
    <div className="min-h-screen bg-[#161F2E] px-4 py-8 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6">

        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="text-6xl">{tier.emoji}</div>
          <h1 className="text-4xl font-bold text-white">{playerName}</h1>
          <p className={`text-2xl font-semibold ${tier.color}`}>{tier.label}</p>
          {rank && (
            <p className="text-slate-400 text-sm">
              Leaderboard rank <span className="text-white font-semibold">#{rank}</span>
            </p>
          )}
          {submitting && <p className="text-slate-500 text-xs">Saving score...</p>}
        </div>

        {/* Total score */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Final Score</p>
          <div className="text-8xl font-bold font-mono text-orange-400">{totalScore}</div>
          <p className="text-slate-500 text-sm mt-1">out of {MAX_TOTAL}</p>
          <div className="w-full bg-slate-700 rounded-full h-3 mt-4">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-300 transition-all duration-700"
              style={{ width: `${Math.round((totalScore / MAX_TOTAL) * 100)}%` }}
            />
          </div>
        </div>

        {/* Per-challenge breakdown */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-4">Score Breakdown</p>
          <div className="space-y-3">
            {challenges.map((c) => {
              const s = scores[c.id] ?? 0;
              return (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="text-xl w-8 shrink-0">{c.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-200 truncate">{c.title}</span>
                      <span className="font-mono text-white ml-2 shrink-0">{s} pts</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          s >= 80 ? 'bg-green-500' : s >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${s}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/leaderboard')}
            className="flex-1 py-3 rounded-xl font-semibold text-white bg-sky-600 hover:bg-sky-500 transition-all"
          >
            🏆 View Leaderboard
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(shareText);
              alert('Copied to clipboard!');
            }}
            className="flex-1 py-3 rounded-xl font-semibold text-slate-300 border border-slate-600 hover:border-slate-400 hover:text-white transition-all"
          >
            📋 Copy Share Text
          </button>
          <button
            onClick={() => navigate('/board')}
            className="flex-1 py-3 rounded-xl font-semibold text-white bg-orange-500 hover:bg-orange-400 transition-all"
          >
            Play Again
          </button>
        </div>

        <p className="text-center text-slate-600 text-xs">CSN Low Code Cloud Club · AWS Security Jam Simulator</p>
      </div>
    </div>
  );
}
