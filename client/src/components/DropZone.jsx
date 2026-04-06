import React, { useState } from 'react';
import DragCard from './DragCard.jsx';

const headerColorMap = {
  success: 'text-green-400 border-green-500/40 bg-green-500/10',
  danger: 'text-red-400 border-red-500/40 bg-red-500/10',
  orange: 'text-orange-400 border-orange-500/40 bg-orange-500/10',
  sky: 'text-sky-400 border-sky-400/40 bg-sky-400/10',
  warn: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10',
  neutral: 'text-slate-400 border-slate-500/40 bg-slate-500/10',
};

export default function DropZone({ zone, placedItems, allItems, onDrop, onReturnToSource, onDragStart }) {
  const [isOver, setIsOver] = useState(false);
  const header = headerColorMap[zone.color] ?? 'text-white border-slate-600 bg-slate-800/40';

  return (
    <div
      data-zone-id={zone.id}
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => { e.preventDefault(); setIsOver(false); onDrop(zone.id); }}
      className={[
        'flex flex-col rounded-xl border-2 transition-all min-h-32',
        isOver ? 'border-orange-400 bg-orange-400/10 scale-[1.01]' : `border-slate-600/60 bg-slate-800/30`,
      ].join(' ')}
    >
      {/* Zone header */}
      <div className={`rounded-t-xl px-4 py-2 border-b text-sm font-semibold tracking-wide ${header}`}>
        {zone.label}
        {placedItems.length > 0 && (
          <span className="ml-2 text-xs opacity-70">({placedItems.length})</span>
        )}
      </div>

      {/* Dropped cards */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        {placedItems.length === 0 && (
          <p className="text-slate-600 text-xs text-center my-auto">Drop here</p>
        )}
        {placedItems.map((id) => {
          const item = allItems.find((i) => i.id === id);
          if (!item) return null;
          return (
            <DragCard
              key={id}
              item={item}
              color={zone.color}
              small
              onDragStart={onDragStart}
              onDragEnd={() => onReturnToSource(id)}
              onTouchDrop={onDrop}
            />
          );
        })}
      </div>
    </div>
  );
}
