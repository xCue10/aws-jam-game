import React from 'react';

const colorMap = {
  success: 'border-green-500 bg-green-500/10 text-green-300',
  danger: 'border-red-500 bg-red-500/10 text-red-300',
  orange: 'border-orange-500 bg-orange-500/10 text-orange-300',
  sky: 'border-sky-400 bg-sky-400/10 text-sky-300',
  warn: 'border-yellow-500 bg-yellow-500/10 text-yellow-300',
  neutral: 'border-slate-500 bg-slate-500/10 text-slate-300',
  default: 'border-slate-600 bg-slate-800/60 text-white',
};

export default function DragCard({ item, onDragStart, onDragEnd, onTouchDrop, color = 'default', small = false, className = '' }) {
  const handleTouchStart = (e) => {
    onDragStart?.(item.id);
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    if (!touch) return;
    // Find the element under the finger at release
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    // Walk up the DOM to find a drop zone (marked with data-zone-id)
    let target = el;
    while (target && target !== document.body) {
      if (target.dataset?.zoneId) {
        onTouchDrop?.(target.dataset.zoneId);
        return;
      }
      target = target.parentElement;
    }
    // No zone found — trigger onDragEnd to return to source
    onDragEnd?.();
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        onDragStart?.(item.id);
      }}
      onDragEnd={() => onDragEnd?.()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={[
        'border rounded-lg cursor-grab active:cursor-grabbing select-none transition-all',
        'hover:scale-[1.02] hover:shadow-lg touch-none',
        small ? 'px-3 py-2 text-sm' : 'px-4 py-3',
        colorMap[color] ?? colorMap.default,
        className,
      ].join(' ')}
    >
      <p className={`font-mono font-medium leading-snug ${small ? 'text-xs' : 'text-sm'}`}>{item.label}</p>
      {item.detail && !small && (
        <p className="mt-1 text-xs text-slate-400">{item.detail}</p>
      )}
    </div>
  );
}
