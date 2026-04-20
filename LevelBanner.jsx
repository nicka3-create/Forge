import React from 'react';
import { motion } from 'framer-motion';
import { getCurrentLevel, getNextLevel } from '@/lib/badgeSystem';

export default function LevelBanner({ bestDays, userName }) {
  const current = getCurrentLevel(bestDays);
  const next = getNextLevel(bestDays);
  const progress = next
    ? Math.min(100, Math.round(((bestDays - current.minDays) / (next.minDays - current.minDays)) * 100))
    : 100;

  return (
    <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

      <div className="flex items-center gap-4 relative">
        {/* Avatar / Level badge */}
        <div className={`w-16 h-16 rounded-full bg-secondary ring-4 ${current.ring} flex items-center justify-center shrink-0`}>
          <span className={`font-heading font-black text-2xl ${current.color}`}>
            {current.level}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-muted-foreground text-sm">{userName || 'Fighter'}</p>
          </div>
          <h2 className={`font-heading text-2xl font-black tracking-tight ${current.color}`}>
            {current.label}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Level {current.level} · {bestDays} day{bestDays !== 1 ? 's' : ''} best streak
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className={`font-heading text-4xl font-black ${current.color}`}>{current.level}</span>
          <p className="text-xs text-muted-foreground">LEVEL</p>
        </div>
      </div>

      {/* Progress to next level */}
      {next && (
        <div className="mt-5 relative">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>{current.label}</span>
            <span>{next.label} at {next.minDays}d</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              className="h-full bg-primary rounded-full"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 text-right">
            {next.minDays - bestDays} day{next.minDays - bestDays !== 1 ? 's' : ''} to next level
          </p>
        </div>
      )}

      {!next && (
        <div className="mt-4 text-center">
          <span className="text-xs text-yellow-400 font-heading font-semibold">✦ MAX LEVEL REACHED ✦</span>
        </div>
      )}
    </div>
  );
}
