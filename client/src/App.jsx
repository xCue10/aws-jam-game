import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import MissionBoard from './pages/MissionBoard.jsx';
import Challenge from './pages/Challenge.jsx';
import Results from './pages/Results.jsx';
import FinalScore from './pages/FinalScore.jsx';
import Leaderboard from './pages/Leaderboard.jsx';

export default function App() {
  const [playerName, setPlayerName] = useState('');
  const [scores, setScores] = useState({});
  const [cluesUsed, setCluesUsed] = useState({});

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  const handleStart = (name) => {
    setPlayerName(name);
    setScores({});
    setCluesUsed({});
  };

  /** Called by Challenge page after submission */
  const handleComplete = (challengeId, rawScore, timeBonus, usedClue, maxPoints = 100) => {
    const penalty = usedClue ? 25 : 0;
    const scaled = Math.round((rawScore / 100) * maxPoints);
    const final = Math.max(0, scaled - penalty + timeBonus);
    setScores((prev) => ({ ...prev, [challengeId]: final }));
    if (usedClue) {
      setCluesUsed((prev) => ({ ...prev, [challengeId]: true }));
    }
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
