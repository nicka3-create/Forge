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
  );
}

export default function BadgesPanel({ streaks, userEmail }) {
  const { data: earnedMilestones } = useQuery({
    queryKey: ['user-milestones', userEmail],
    queryFn: () => base44.entities.UserMilestone.filter({ user_email: userEmail }),
    enabled: !!userEmail,
    initialData: [],
  });

  const earnedIds = new Set(earnedMilestones.map(m => m.badge_id));
  const totalEarned = earnedIds.size;

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-lg">Badges & Milestones</h2>
        <span className="text-xs bg-primary/15 text-primary px-2.5 py-1 rounded-full font-medium">
          {totalEarned} / {MILESTONES.length} earned
        </span>
      </div>

      {Object.entries(MILESTONE_CATEGORIES).map(([catKey, { label, icon }]) => {
        const catBadges = MILESTONES.filter(m => m.category === catKey);
        const catEarned = catBadges.filter(m => earnedIds.has(m.id));

        return (
          <div key={catKey}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm">{icon}</span>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
              <span className="text-xs text-muted-foreground/60 ml-auto">{catEarned.length}/{catBadges.length}</span>
            </div>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
              {catBadges.map((badge, i) => (
                <BadgeTile key={badge.id} badge={badge} earned={earnedIds.has(badge.id)} index={i} />
              ))}
            </div>
          </div>
        );
      })}

      {totalEarned === 0 && (
        <p className="text-sm text-muted-foreground text-center py-2">Keep going — your first badge is just around the corner!</p>
      )}
    </div>
  );
}
