import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

const commonAddictions = ['Smoking', 'Alcohol', 'Vaping', 'Sugar', 'Social Media', 'Gambling', 'Porn', 'Caffeine', 'Junk Food', 'Weed'];

export default function NewStreakForm({ onSubmit, onCancel }) {
  const [addiction, setAddiction] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!addiction.trim()) return;
    onSubmit({ addiction_type: addiction.trim(), start_date: startDate, is_active: true });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold">Start a New Streak</h3>
        <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <Label>What are you quitting?</Label>
        <Input
          value={addiction}
          onChange={(e) => setAddiction(e.target.value)}
          placeholder="e.g. Smoking, Alcohol..."
          className="bg-secondary border-border"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {commonAddictions.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAddiction(a)}
              className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                addiction === a
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>When did you start?</Label>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-secondary border-border"
        />
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 font-heading font-semibold">
        <Plus className="w-4 h-4 mr-2" />
        Start Streak
      </Button>
    </form>
  );
}
