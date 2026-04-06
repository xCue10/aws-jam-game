import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const MAX_TOTAL = 1200;

const TIER_LABEL = (score) => {
  if (score >= 1000) return { label: 'Expert', color: 'text-orange-400' };
  if (score >= 720)  return { label: 'Analyst', color: 'text-sky-400' };
  if (score >= 450)  return { label: 'Defender', color: 'text-green-400' };
  return { label: 'Apprentice', color: 'text-yellow-400' };
};

const MEDAL = ['🥇', '🥈', '🥉'];

export default function Leaderboard({ playerName }) {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchLeaderboard = useCallback(() => {
    fetch('/api/scores/leaderboard')
      .then((r) => r.json())
      .then((data) => {
        setRows(Array.isArray(data) ? data : []);
        setLastUpdated(new Date());
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  return (
    <div className="min-h-screen bg-[#161F2E] px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-1">
              Live Rankings
            </p>
            <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
            {lastUpdated && (
              <p className="text-xs text-slate-500 mt-1">
                Updated {lastUpdated.toLocaleTimeString()} · refreshes every 15s
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchLeaderboard}
              className="px-3 py-2 rounded-lg border border-slate-600 hover:border-slate-400 text-slate-400 hover:text-white text-sm transition-all"
            >
              ↻ Refresh
            </button>
            <button
              onClick={() => navigate(playerName ? '/board' : '/')}
              className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm transition-all"
            >
              {playerName ? 'My Board' : 'Play'}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
          {loading && (
            <div className="text-center py-12 text-slate-500">Loading scores...</div>
          )}
          {!loading && rows.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No scores yet — be the first to finish!
            </div>
          )}
          {!loading && rows.length > 0 && (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 text-xs text-slate-500 uppercase tracking-widest">
                  <th className="text-left px-5 py-3 w-12">#</th>
                  <th className="text-left px-5 py-3">Player</th>
                  <th className="text-right px-5 py-3">Score</th>
                  <th className="text-right px-5 py-3 hidden sm:table-cell">Tier</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  const tier = TIER_LABEL(row.total_score);
                  const isMe = playerName && row.player_name.toLowerCase() === playerName.toLowerCase();
                  const pct = Math.round((row.total_score / MAX_TOTAL) * 100);

                  return (
                    <tr
                      key={row.id}
                      className={[
                        'border-b border-slate-700/50 last:border-0 transition-colors',
                        isMe ? 'bg-orange-500/10' : 'hover:bg-slate-700/30',
                      ].join(' ')}
                    >
                      {/* Rank */}
                      <td className="px-5 py-4 text-center">
                        {idx < 3 ? (
                          <span className="text-xl">{MEDAL[idx]}</span>
                        ) : (
                          <span className="font-mono text-slate-500 text-sm">{idx + 1}</span>
                        )}
                      </td>

                      {/* Player */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold truncate max-w-[140px]">
                            {row.player_name}
                          </span>
                          {isMe && (
                            <span className="text-xs text-orange-400 border border-orange-500/40 bg-orange-500/10 px-1.5 py-0.5 rounded-full">
                              you
                            </span>
                          )}
                        </div>
                        {/* Mini bar */}
                        <div className="mt-1.5 h-1 bg-slate-700 rounded-full w-full max-w-[180px]">
                          <div
                            className="h-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>

                      {/* Score */}
                      <td className="px-5 py-4 text-right font-mono font-bold text-white tabular-nums">
                        {row.total_score}
                        <span className="text-slate-600 text-xs font-normal">/{MAX_TOTAL}</span>
                      </td>

                      {/* Tier */}
                      <td className={`px-5 py-4 text-right text-sm font-semibold hidden sm:table-cell ${tier.color}`}>
                        {tier.label}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-center text-slate-600 text-xs">
          CSN Low Code Cloud Club · AWS Security Jam Simulator
        </p>
      </div>
    </div>
  );
}
