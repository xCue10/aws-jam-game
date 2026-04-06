import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import MissionBoard from './pages/MissionBoard.jsx';
import Challenge from './pages/Challenge.jsx';
import Results from './pages/Results.jsx';
import FinalScore from './pages/FinalScore.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Dashboard from './pages/Dashboard.jsx';

const LS_KEY = 'aws-jam-session';

function loadSession() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(playerName, scores, cluesUsed) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ playerName, scores, cluesUsed }));
  } catch {}
}

export default function App() {
  const saved = loadSession();
  const [playerName, setPlayerName] = useState(saved?.playerName ?? '');
  const [scores, setScores] = useState(saved?.scores ?? {});
  const [cluesUsed, setCluesUsed] = useState(saved?.cluesUsed ?? {});

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  // Persist session to localStorage on every change
  useEffect(() => {
    if (playerName) saveSession(playerName, scores, cluesUsed);
  }, [playerName, scores, cluesUsed]);

  const handleStart = (name) => {
    setPlayerName(name);
    setScores({});
    setCluesUsed({});
    saveSession(name, {}, {});
  };

  /** Called by Challenge page after submission */
  const handleComplete = (challengeId, rawScore, timeBonus, usedClue, maxPoints = 100) => {
    const penalty = usedClue ? 25 : 0;
    const scaled = Math.round((rawScore / 100) * maxPoints);
    const final = Math.max(0, scaled - penalty + timeBonus);
    const newScores = { ...scores, [challengeId]: final };
    const newTotal = Object.values(newScores).reduce((a, b) => a + b, 0);
    setScores(newScores);
    if (usedClue) {
      setCluesUsed((prev) => ({ ...prev, [challengeId]: true }));
    }
    // Submit running score so dashboard tracks in-progress players
    fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName, scores: newScores, totalScore: newTotal }),
    }).catch(() => {});
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing onStart={handleStart} />} />
        <Route
          path="/board"
          element={
            playerName
              ? <MissionBoard playerName={playerName} scores={scores} totalScore={totalScore} />
              : <Navigate to="/" replace />
          }
        />
        <Route
          path="/challenge/:id"
          element={
            playerName
              ? <Challenge onComplete={handleComplete} scores={scores} />
              : <Navigate to="/" replace />
          }
        />
        <Route
          path="/results/:id"
          element={
            playerName
              ? <Results scores={scores} cluesUsed={cluesUsed} />
              : <Navigate to="/" replace />
          }
        />
        <Route
          path="/final"
          element={
            playerName
              ? <FinalScore playerName={playerName} scores={scores} totalScore={totalScore} />
              : <Navigate to="/" replace />
          }
        />
        <Route path="/leaderboard" element={<Leaderboard playerName={playerName} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
