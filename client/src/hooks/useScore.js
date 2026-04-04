import { useState, useCallback } from 'react';
import { CHALLENGE_IDS } from '../data/challenges.js';

const MAX_PER_CHALLENGE = 100;
const CLUE_PENALTY = 25;

export function useScore() {
  const [scores, setScores] = useState({});
  const [cluesUsed, setCluesUsed] = useState({});

  const recordScore = useCallback((challengeId, rawScore, timeBonus) => {
    const penalty = cluesUsed[challengeId] ? CLUE_PENALTY : 0;
    const final = Math.max(0, Math.min(MAX_PER_CHALLENGE, rawScore) - penalty + timeBonus);
    setScores((prev) => ({ ...prev, [challengeId]: final }));
    return final;
  }, [cluesUsed]);

  const useClue = useCallback((challengeId) => {
    setCluesUsed((prev) => ({ ...prev, [challengeId]: true }));
  }, []);

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const completedCount = Object.keys(scores).length;
  const allComplete = completedCount === CHALLENGE_IDS.length;

  return { scores, totalScore, completedCount, allComplete, recordScore, useClue, cluesUsed };
}
