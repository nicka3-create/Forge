import React from 'react';
import { Flame, Lightbulb, Megaphone, CloudLightning, LayoutGrid } from 'lucide-react';

const filters = [
  { key: 'all', label: 'All', icon: LayoutGrid },
  { key: 'journey', label: 'Journeys', icon: Flame },
  { key: 'tip', label: 'Tips', icon: Lightbulb },
  { key: 'motivation', label: 'Motivation', icon: Megaphone },
  { key: 'vent', label: 'Vents', icon: CloudLightning },
];

export default function PostTypeFilter({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            active === key
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
