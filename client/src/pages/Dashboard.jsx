import React, { useEffect, useState, useCallback } from 'react';
import { challenges } from '../data/challenges.js';

const MAX_TOTAL = 1200;

const TIER = (score) => {
  if (score >= 1000) return { label: 'Expert', color: 'text-orange-400', dot: 'bg-orange-400' };
  if (score >= 720)  return { label: 'Analyst', color: 'text-sky-400', dot: 'bg-sky-400' };
  if (score >= 450)  return { label: 'Defender', color: 'text-green-400', dot: 'bg-green-400' };
  return { label: 'Apprentice', color: 'text-yellow-400', dot: 'bg-yellow-400' };
};

export default function Dashboard() {
  const [rows, setRows] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetch_ = useCallback(() => {
    fetch('/api/scores/leaderboard')
      .then((r) => r.json())
      .then((data) => {
        setRows(Array.isArray(data) ? data : []);
        setLastUpdated(new Date());
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch_();
    const interval = setInterval(fetch_, 5000);
    return () => clearInterval(interval);
  }, [fetch_]);

  const avgScore = rows.length
    ? Math.round(rows.reduce((a, r) => a + r.total_score, 0) / rows.length)
    : 0;
  const topScore = rows[0]?.total_score ?? 0;
  const expertCount = rows.filter((r) => r.total_score >= 1000).length;

  return (
    <div className="min-h-screen bg-[#0d1117] px-4 py-6 text-white">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-1">
              Instructor View · Live
            </p>
            <h1 className="text-3xl font-bold">AWS Security Jam Dashboard</h1>
            {lastUpdated && (
              <p className="text-xs text-slate-500 mt-1">
                Refreshing every 5s · Last updated {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-sm font-mono">LIVE</span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Players', value: rows.length, color: 'text-white' },
            { label: 'Avg Score', value: avgScore, color: 'text-sky-400' },
            { label: 'Top Score', value: topScore, color: 'text-orange-400' },
            { label: 'Experts', value: expertCount, color: 'text-yellow-400' },
          ].map((s) => (
            <div key={s.label} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-4xl font-bold font-mono ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Player grid */}
        {rows.length === 0 ? (
          <div className="text-center py-20 text-slate-600">No scores yet — waiting for players...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rows.map((row, idx) => {
              const tier = TIER(row.total_score);
              const pct = Math.round((row.total_score / MAX_TOTAL) * 100);
              const challengeScores = row.scores ?? {};
              const completedCount = Object.keys(challengeScores).length;

              return (
                <div
                  key={row.id}
                  className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 space-y-3"
                >
                  {/* Name + rank */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">{row.player_name}</p>
                      <p className={`text-xs font-semibold ${tier.color}`}>{tier.label}</p>
                    </div>
                    <span className="font-mono text-slate-500 text-sm shrink-0">#{idx + 1}</span>
                  </div>

                  {/* Total score bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{completedCount}/{challenges.length} done</span>
                      <span className="font-mono text-orange-400 font-bold">{row.total_score} pts</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-300 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Per-challenge dots */}
                  <div className="flex flex-wrap gap-1.5">
                    {challenges.map((c) => {
                      const s = challengeScores[c.id];
                      const done = s !== undefined;
                      const maxP = (c.maxPoints ?? 100) + 10;
                      const quality = done ? Math.round((s / maxP) * 100) : 0;
                      return (
                        <div
                          key={c.id}
                          title={`${c.title}: ${done ? s + ' pts' : 'not started'}`}
                          className={`w-6 h-6 rounded-md text-xs flex items-center justify-center border transition-all ${
                            done
                              ? quality >= 80
                                ? 'bg-green-500/30 border-green-500/60 text-green-300'
                                : quality >= 50
                                ? 'bg-yellow-500/30 border-yellow-500/60 text-yellow-300'
                                : 'bg-red-500/30 border-red-500/60 text-red-300'
                              : 'bg-slate-700/40 border-slate-600 text-slate-600'
                          }`}
                        >
                          {c.icon}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-slate-700 text-xs pt-4">
          CSN Low Code Cloud Club · AWS Security Jam Simulator · /dashboard
        </p>
      </div>
    </div>
  );
}
