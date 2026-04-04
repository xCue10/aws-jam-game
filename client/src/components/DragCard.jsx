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

export default function DragCard({ item, onDragStart, onDragEnd, color = 'default', small = false, className = '' }) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        onDragStart?.(item.id);
      }}
      onDragEnd={() => onDragEnd?.()}
      className={[
        'border rounded-lg cursor-grab active:cursor-grabbing select-none transition-all',
        'hover:scale-[1.02] hover:shadow-lg',
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
