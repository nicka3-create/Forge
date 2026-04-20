import React from 'react';
import { Flame, Trash2 } from 'lucide-react';
import { differenceInDays, differenceInHours } from 'date-fns';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function StreakCard({ streak, onDelete }) {
  const startDate = new Date(streak.start_date);
  const now = new Date();
  const days = differenceInDays(now, startDate);
  const hours = differenceInHours(now, startDate) % 24;

  const getFireLevel = () => {
    if (days >= 365) return '🏆';
    if (days >= 90) return '🔥🔥🔥';
    if (days >= 30) return '🔥🔥';
    if (days >= 7) return '🔥';
    return '💪';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-xl p-5 relative overflow-hidden"
    >
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
      
      <div className="flex items-start justify-between relative">
        <div>
          <span className="text-2xl mb-2 block">{getFireLevel()}</span>
          <h3 className="font-heading font-bold text-lg capitalize">{streak.addiction_type}</h3>
          <p className="text-muted-foreground text-sm mt-1">Free since {new Date(streak.start_date).toLocaleDateString()}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(streak.id)}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="mt-4 flex items-end gap-1">
        <span className="font-heading text-4xl font-bold text-primary">{days}</span>
        <span className="text-muted-foreground text-sm mb-1.5">days</span>
        <span className="font-heading text-2xl font-semibold text-foreground/60 ml-2">{hours}</span>
        <span className="text-muted-foreground text-sm mb-1">hrs</span>
      </div>

      {/* Progress milestones */}
      <div className="mt-4 flex gap-2">
        {[7, 30, 90, 365].map((milestone) => (
          <div
            key={milestone}
            className={`text-xs px-2 py-1 rounded-full ${
              days >= milestone
                ? 'bg-primary/20 text-primary'
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            {milestone}d
          </div>
        ))}
      </div>
    </motion.div>
  );
}
