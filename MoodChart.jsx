import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { format, parseISO } from 'date-fns';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 text-xs shadow-xl space-y-1">
      <p className="font-heading font-semibold text-foreground mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: <span className="font-bold">{entry.value}</span>/10
        </p>
      ))}
    </div>
  );
};

export default function MoodChart({ entries }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 text-center py-10">
        <p className="text-muted-foreground text-sm">Log at least one day to see your trend.</p>
      </div>
    );
  }

  const data = [...entries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30) // last 30 days
    .map((e) => ({
      date: format(parseISO(e.date), 'MMM d'),
      'Addiction Strength': e.addiction_strength,
      'Mental Clarity': e.mental_clarity,
    }));

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-lg">Progress Trend</h2>
        <span className="text-xs text-muted-foreground">Last {data.length} entr{data.length === 1 ? 'y' : 'ies'}</span>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[1, 10]}
              ticks={[1, 5, 10]}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              formatter={(value) => <span style={{ color: 'hsl(var(--muted-foreground))' }}>{value}</span>}
            />
            <Line
              type="monotone"
              dataKey="Addiction Strength"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ r: 3, fill: '#f97316' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="Mental Clarity"
              stroke="#22d3ee"
              strokeWidth={2}
              dot={{ r: 3, fill: '#22d3ee' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
