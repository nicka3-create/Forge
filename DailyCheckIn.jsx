import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Flame, Brain } from 'lucide-react';

function RatingSlider({ value, onChange, color }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-2 appearance-none rounded-full cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${(value - 1) / 9 * 100}%, hsl(var(--secondary)) ${(value - 1) / 9 * 100}%, hsl(var(--secondary)) 100%)`
        }}
      />
      <span className="font-heading font-black text-xl w-6 text-right" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

export default function DailyCheckIn({ existingEntry, onSubmit, isSubmitting }) {
  const [addictionStrength, setAddictionStrength] = useState(existingEntry?.addiction_strength ?? 5);
  const [mentalClarity, setMentalClarity] = useState(existingEntry?.mental_clarity ?? 5);
  const [note, setNote] = useState(existingEntry?.note ?? '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ addiction_strength: addictionStrength, mental_clarity: mentalClarity, note });
  };

  const addictionLabel = addictionStrength <= 3 ? 'Barely there' : addictionStrength <= 6 ? 'Noticeable' : addictionStrength <= 8 ? 'Strong' : 'Overwhelming';
  const clarityLabel = mentalClarity <= 3 ? 'Foggy' : mentalClarity <= 6 ? 'Okay' : mentalClarity <= 8 ? 'Sharp' : 'Crystal clear';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-5 space-y-5"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-lg">Today's Check-In</h2>
        {existingEntry && (
          <span className="text-xs bg-primary/15 text-primary px-2.5 py-1 rounded-full font-medium">
            Already logged — edit below
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Addiction Strength */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Flame className="w-4 h-4 text-orange-400" />
              Addiction Strength
            </label>
            <span className="text-xs text-muted-foreground">{addictionLabel}</span>
          </div>
          <RatingSlider value={addictionStrength} onChange={setAddictionStrength} color="#f97316" />
          <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
            <span>Weak</span>
            <span>Overwhelming</span>
          </div>
        </div>

        {/* Mental Clarity */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Brain className="w-4 h-4 text-cyan-400" />
              Mental Clarity
            </label>
            <span className="text-xs text-muted-foreground">{clarityLabel}</span>
          </div>
          <RatingSlider value={mentalClarity} onChange={setMentalClarity} color="#22d3ee" />
          <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
            <span>Foggy</span>
            <span>Crystal clear</span>
          </div>
        </div>

        {/* Note */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Note (optional)</label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="How are you feeling today? What triggered the urge?"
            className="bg-secondary border-border min-h-[72px] text-sm"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 font-heading font-semibold"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Saving…' : existingEntry ? 'Update Entry' : 'Log Today'}
        </Button>
      </form>
    </motion.div>
  );
}
