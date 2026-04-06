import React, { useEffect, useState, useRef } from 'react';

const MAX_TOTAL = 1200;

const TIER = (score) => {
  if (score >= 1000) return { label: 'Expert',    color: 'text-orange-400', bar: 'from-orange-500 to-orange-300' };
  if (score >= 720)  return { label: 'Analyst',   color: 'text-sky-400',    bar: 'from-sky-500 to-sky-300' };
  if (score >= 450)  return { label: 'Defender',  color: 'text-green-400',  bar: 'from-green-500 to-green-300' };
  return              { label: 'Apprentice', color: 'text-yellow-400', bar: 'from-yellow-500 to-yellow-300' };
};

const MEDAL = ['🥇', '🥈', '🥉'];

export default function Screen() {
  const [rows, setRows] = useState([]);
  const [flash, setFlash] = useState({});         // id → true while animating rank change
  const prevOrder = useRef([]);

  useEffect(() => {
    const poll = () => {
      fetch('/api/scores/leaderboard')
        .then((r) => r.json())
        .then((data) => {
          if (!Array.isArray(data)) return;
          // Detect rank changes and flash those cards
          const newIds = data.map((r) => r.id);
          const changed = {};
          newIds.forEach((id, idx) => {
            const prevIdx = prevOrder.current.indexOf(id);
            if (prevIdx !== -1 && prevIdx !== idx) changed[id] = true;
          });
          if (Object.keys(changed).length) {
            setFlash(changed);
            setTimeout(() => setFlash({}), 1200);
          }
          prevOrder.current = newIds;
          setRows(data);
        })
        .catch(() => {});
    };
    poll();
    const id = setInterval(poll, 3000);
    return () => clearInterval(id);
  }, []);

  const avgScore = rows.length
    ? Math.round(rows.reduce((a, r) => a + r.total_score, 0) / rows.length)
    : 0;
  const expertCount = rows.filter((r) => r.total_score >= 1000).length;
  const topScore = rows[0]?.total_score ?? 0;

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white px-6 py-6 flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-1">
            CSN Low Code Cloud Club · Live Leaderboard
          </p>
          <h1 className="text-4xl font-bold tracking-tight">AWS Security Jam</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Players', value: rows.length, color: 'text-white' },
              { label: 'Avg Score', value: avgScore, color: 'text-sky-400' },
              { label: 'Experts', value: expertCount, color: 'text-orange-400' },
            ].map((s) => (
              <div key={s.label} className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2 min-w-[80px]">
                <p className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</p>
                <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-1 ml-2">
            <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-mono">LIVE</span>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      {rows.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-600 text-2xl font-mono animate-pulse">Waiting for players...</p>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 content-start">
          {rows.map((row, idx) => {
            const tier = TIER(row.total_score);
            const pct = Math.round((row.total_score / MAX_TOTAL) * 100);
            const isFlashing = flash[row.id];
            return (
              <div
                key={row.id}
                className={`flex items-center gap-4 rounded-2xl border px-5 py-4 transition-all duration-500 ${
                  isFlashing
                    ? 'border-orange-400/80 bg-orange-500/10 scale-[1.01]'
                    : idx === 0
                    ? 'border-orange-500/40 bg-slate-800/70'
                    : 'border-slate-700 bg-slate-800/40'
                }`}
              >
                {/* Rank */}
                <div className="w-10 shrink-0 text-center">
                  {idx < 3
                    ? <span className="text-3xl">{MEDAL[idx]}</span>
                    : <span className="text-xl font-bold font-mono text-slate-500">#{idx + 1}</span>
                  }
                </div>

                {/* Name + tier + bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <p className="text-xl font-bold truncate">{row.player_name}</p>
                    <span className={`text-sm font-semibold shrink-0 ${tier.color}`}>{tier.label}</span>
                  </div>
                  <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${tier.bar} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Score */}
                <div className="shrink-0 text-right">
                  <p className="text-3xl font-bold font-mono text-orange-400 tabular-nums">{row.total_score}</p>
                  <p className="text-xs text-slate-500 font-mono">/ {MAX_TOTAL}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Top score banner */}
      {topScore > 0 && (
        <div className="text-center text-slate-700 text-xs font-mono">
          Top score: {topScore} · {rows.length} player{rows.length !== 1 ? 's' : ''} · Refreshes every 3s
        </div>
      )}
    </div>
  );
}
