import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TYPE_CONFIG, STAGE_CONFIG } from './ResourceCard';

const EMPTY = {
  title: '', description: '', url: '', type: 'article',
  recovery_stage: 'all', addiction_type: '', duration_label: '',
  image_url: '', is_featured: false,
};

export default function ResourceForm({ initial = EMPTY, onSubmit, onCancel, isSaving }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-card border border-border rounded-xl p-5 space-y-4"
    >
      <h3 className="font-heading font-bold text-base">{initial.id ? 'Edit Resource' : 'Add Resource'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input placeholder="Title *" value={form.title} onChange={e => set('title', e.target.value)} className="bg-secondary border-border" />
        <Input placeholder="URL *" value={form.url} onChange={e => set('url', e.target.value)} className="bg-secondary border-border" />
        <Select value={form.type} onValueChange={v => set('type', v)}>
          <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            {Object.entries(TYPE_CONFIG).map(([k, { label, emoji }]) => (
              <SelectItem key={k} value={k}>{emoji} {label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={form.recovery_stage} onValueChange={v => set('recovery_stage', v)}>
          <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Recovery Stage" /></SelectTrigger>
          <SelectContent>
            {Object.entries(STAGE_CONFIG).map(([k, { label }]) => (
              <SelectItem key={k} value={k}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input placeholder="Addiction type (e.g. alcohol, nicotine, general)" value={form.addiction_type} onChange={e => set('addiction_type', e.target.value)} className="bg-secondary border-border" />
        <Input placeholder="Duration (e.g. 5 min read, 20 min audio)" value={form.duration_label} onChange={e => set('duration_label', e.target.value)} className="bg-secondary border-border" />
        <Input placeholder="Thumbnail URL (optional)" value={form.image_url} onChange={e => set('image_url', e.target.value)} className="bg-secondary border-border md:col-span-2" />
        <label className="flex items-center gap-2 cursor-pointer px-1">
          <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} className="accent-primary w-4 h-4" />
          <span className="text-sm text-muted-foreground">Featured resource</span>
        </label>
      </div>
      <Textarea
        placeholder="Short description (optional)"
        value={form.description}
        onChange={e => set('description', e.target.value)}
        className="bg-secondary border-border min-h-[64px]"
      />
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={onCancel}><X className="w-4 h-4 mr-1" />Cancel</Button>
        <Button
          size="sm"
          disabled={!form.title.trim() || !form.url.trim() || isSaving}
          onClick={() => onSubmit(form)}
          className="bg-primary hover:bg-primary/90 font-heading"
        >
          <Check className="w-4 h-4 mr-1" />{isSaving ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </motion.div>
  );
}
