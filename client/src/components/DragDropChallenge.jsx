import React, { useState } from 'react';
import { useDragDrop } from '../hooks/useDragDrop.js';
import DragCard from './DragCard.jsx';
import DropZone from './DropZone.jsx';

// ─── Scoring helpers ───────────────────────────────────────────────────────

function scoreBucket(placed, correctAnswer) {
  let correct = 0;
  let total = 0;
  for (const [zoneId, correctIds] of Object.entries(correctAnswer)) {
    total += correctIds.length;
    const placedHere = placed[zoneId] ?? [];
    for (const id of placedHere) {
      if (correctIds.includes(id)) correct++;
    }
  }
  return total === 0 ? 100 : Math.round((correct / total) * 100);
}

function scoreOrder(placedOrder, correctOrder) {
  if (!placedOrder.length) return 0;
  let correct = 0;
  for (let i = 0; i < placedOrder.length; i++) {
    if (placedOrder[i] === correctOrder[i]) correct++;
  }
  return Math.round((correct / correctOrder.length) * 100);
}

function scoreMatch(placed, correctAnswer) {
  return scoreBucket(placed, correctAnswer);
}

export function computeRawScore(challenge, placed) {
  switch (challenge.type) {
    case 'bucket': return scoreBucket(placed, challenge.correctAnswer);
    case 'order':  return scoreOrder(placed, challenge.correctAnswer);
    case 'match':  return scoreMatch(placed, challenge.correctAnswer);
    default:       return 0;
  }
}

// ─── OrderChallenge ────────────────────────────────────────────────────────

function OrderChallenge({ challenge, dragDrop }) {
  const { placed, unplaced, onDragStart, onDrop, onReturnToSource } = dragDrop;
  const [isOverList, setIsOverList] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Source pool */}
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">Events to place</p>
        <div className="flex flex-col gap-2">
          {unplaced.map((id) => {
            const item = challenge.items.find((i) => i.id === id);
            if (!item) return null;
            return (
              <DragCard key={id} item={item} onDragStart={onDragStart} onTouchDrop={(zoneId) => onDrop(zoneId)} />
            );
          })}
          {unplaced.length === 0 && (
            <p className="text-slate-600 text-sm">All events placed ✓</p>
          )}
        </div>
      </div>

      {/* Ordered list */}
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">
          Timeline — drag into order
        </p>
        <div
          data-zone-id="list"
          onDragOver={(e) => { e.preventDefault(); setIsOverList(true); }}
          onDragLeave={() => setIsOverList(false)}
          onDrop={(e) => { e.preventDefault(); setIsOverList(false); onDrop('list'); }}
          className={[
            'min-h-48 rounded-xl border-2 p-3 flex flex-col gap-2 transition-all',
            isOverList
              ? 'border-orange-400 bg-orange-400/10'
              : 'border-slate-600/60 bg-slate-800/30',
          ].join(' ')}
        >
          {placed.length === 0 && (
            <p className="text-slate-600 text-xs text-center m-auto">Drop events here in order</p>
          )}
          {placed.map((id, idx) => {
            const item = challenge.items.find((i) => i.id === id);
            if (!item) return null;
            return (
              <div key={id} className="flex items-start gap-3">
                <span className="font-mono text-xs text-orange-400 w-5 pt-3 shrink-0 text-right">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <DragCard
                    item={item}
                    color="sky"
                    onDragStart={onDragStart}
                    onDragEnd={() => onReturnToSource(id)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── BucketChallenge ───────────────────────────────────────────────────────

function BucketChallenge({ challenge, dragDrop }) {
  const { placed, unplaced, onDragStart, onDrop, onReturnToSource } = dragDrop;

  return (
    <div className="space-y-6">
      {/* Source pool */}
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">Items to classify</p>
        <div className="flex flex-wrap gap-2">
          {unplaced.map((id) => {
            const item = challenge.items.find((i) => i.id === id);
            if (!item) return null;
            return <DragCard key={id} item={item} onDragStart={onDragStart} onTouchDrop={onDrop} />;
          })}
          {unplaced.length === 0 && (
            <p className="text-slate-600 text-sm">All items placed ✓</p>
          )}
        </div>
      </div>

      {/* Drop zones */}
      <div className={`grid gap-4 ${challenge.zones.length === 2 ? 'grid-cols-2' : challenge.zones.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {challenge.zones.map((zone) => (
          <DropZone
            key={zone.id}
            zone={zone}
            placedItems={placed[zone.id] ?? []}
            allItems={challenge.items}
            onDrop={onDrop}
            onReturnToSource={onReturnToSource}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
}

// ─── MatchChallenge ────────────────────────────────────────────────────────

function MatchChallenge({ challenge, dragDrop }) {
  const { placed, unplaced, onDragStart, onDrop, onReturnToSource } = dragDrop;

  return (
    <div className="space-y-6">
      {/* Source pool */}
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">Items to match</p>
        <div className="flex flex-wrap gap-2">
          {unplaced.map((id) => {
            const item = challenge.items.find((i) => i.id === id);
            if (!item) return null;
            return <DragCard key={id} item={item} onDragStart={onDragStart} onTouchDrop={onDrop} />;
          })}
          {unplaced.length === 0 && (
            <p className="text-slate-600 text-sm">All strategies matched ✓</p>
          )}
        </div>
      </div>

      {/* Match zones — each accepts exactly one item */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {challenge.zones.map((zone) => (
          <DropZone
            key={zone.id}
            zone={zone}
            placedItems={placed[zone.id] ?? []}
            allItems={challenge.items}
            onDrop={onDrop}
            onReturnToSource={onReturnToSource}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────

export default function DragDropChallenge({ challenge, onSubmit, autoSubmitRef }) {
  const dragDrop = useDragDrop(challenge.type, challenge.items);
  const [showClue, setShowClue] = useState(false);

  const handleSubmit = () => {
    const rawScore = computeRawScore(challenge, dragDrop.placed);
    onSubmit(rawScore, dragDrop.placed, showClue);
  };

  // Expose auto-submit so Challenge page can call it on timer expiry
  if (autoSubmitRef) {
    autoSubmitRef.current = handleSubmit;
  }

  return (
    <div className="space-y-8">
      {/* Clue toggle */}
      {!showClue ? (
        <button
          onClick={() => setShowClue(true)}
          className="text-xs text-slate-400 hover:text-yellow-400 border border-slate-600 hover:border-yellow-500/60 px-3 py-1.5 rounded-lg transition-all"
        >
          💡 Use Clue <span className="text-red-400">(-25 pts)</span>
        </button>
      ) : (
        <div className="border border-yellow-500/40 bg-yellow-500/10 rounded-lg px-4 py-3">
          <p className="text-yellow-300 text-sm">
            <span className="font-semibold">Clue: </span>{challenge.clue}
          </p>
        </div>
      )}

      {/* Challenge-type renderer */}
      {challenge.type === 'order' && (
        <OrderChallenge challenge={challenge} dragDrop={dragDrop} />
      )}
      {challenge.type === 'bucket' && (
        <BucketChallenge challenge={challenge} dragDrop={dragDrop} />
      )}
      {challenge.type === 'match' && (
        <MatchChallenge challenge={challenge} dragDrop={dragDrop} />
      )}

      {/* Submit */}
      <div className="flex gap-4 items-center pt-2">
        <button
          onClick={handleSubmit}
          disabled={!dragDrop.isComplete}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
        >
          Submit Answer
        </button>
        <button
          onClick={dragDrop.reset}
          className="px-4 py-3 text-slate-400 hover:text-white border border-slate-600 hover:border-slate-400 rounded-xl transition-all text-sm"
        >
          Reset
        </button>
        {!dragDrop.isComplete && (
          <p className="text-slate-500 text-sm">Place all items to submit</p>
        )}
      </div>
    </div>
  );
}
