import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { MILESTONES, MILESTONE_CATEGORIES } from '@/lib/milestones';

function BadgeTile({ badge, earned, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="relative flex flex-col items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl relative transition-all duration-300 ${
        earned ? `bg-gradient-to-br ${badge.color} shadow-lg` : 'bg-secondary'
      } ${earned && hovered ? 'scale-110' : ''}`}>
        {earned ? badge.emoji : <Lock className="w-4 h-4 text-muted-foreground/40" />}
        {earned && (
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
            <span className="text-[8px] text-white font-bold">✓</span>
          </span>
        )}
      </div>

      <p className={`text-[11px] font-medium mt-2 text-center leading-tight ${earned ? 'text-foreground' : 'text-muted-foreground/40'}`}>
        {badge.label}
      </p>

      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 bg-popover border border-border text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl pointer-events-none max-w-[160px] text-center"
        >
          {earned ? badge.desc : `🔒 ${badge.desc}`}
        </motion.div>
      )}
    </motion.div>
 
