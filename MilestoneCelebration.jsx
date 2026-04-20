import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MilestoneCelebration({ badge, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 6000);
    return () => clearTimeout(t);
  }, [onClose]);

  if (!badge) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 80, scale: 0.85 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-sm"
      >
        <div className="relative bg-card border border-primary/40 rounded-2xl p-5 shadow-2xl overflow-hidden">
          {/* Glow */}
          <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-10 pointer-events-none`} />

          <Button
            variant="ghost" size="icon"
            className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, -8, 8, -4, 4, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className={`w-16 h-16 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-3xl shadow-lg shrink-0`}
            >
              {badge.emoji}
            </motion.div>
            <div>
              <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-0.5">Badge Unlocked!</p>
              <h3 className="font-heading font-black text-xl leading-tight">{badge.label}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{badge.desc}</p>
            </div>
          </div>

          {/* Progress bar auto-close */}
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 6, ease: 'linear' }}
            className="absolute bottom-0 left-0 h-0.5 bg-primary/50"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
