import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Clock, Pencil, Trash2, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const TYPE_CONFIG = {
  article:    { label: 'Article',    emoji: '📄', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  audio:      { label: 'Audio',      emoji: '🎧', color: 'bg-violet-500/15 text-violet-400 border-violet-500/20' },
  meditation: { label: 'Meditation', emoji: '🧘', color: 'bg-teal-500/15 text-teal-400 border-teal-500/20' },
  video:      { label: 'Video',      emoji: '🎬', color: 'bg-rose-500/15 text-rose-400 border-rose-500/20' },
  tool:       { label: 'Tool',       emoji: '🛠️', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  book:       { label: 'Book',       emoji: '📚', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
};

const STAGE_CONFIG = {
  early:     { label: 'Early Recovery',   color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  building:  { label: 'Building Habits',  color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  thriving:  { label: 'Thriving',         color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  all:       { label: 'All Stages',       color: 'bg-secondary text-muted-foreground border-border' },
};

export { TYPE_CONFIG, STAGE_CONFIG };

export default function ResourceCard({ resource, isAdmin, onEdit, onDelete }) {
  const type = TYPE_CONFIG[resource.type] || TYPE_CONFIG.article;
  const stage = STAGE_CONFIG[resource.recovery_stage] || STAGE_CONFIG.all;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl overflow-hidden flex flex-col group"
    >
      {/* Thumbnail or emoji banner */}
      {resource.image_url ? (
        <div className="h-36 overflow-hidden bg-secondary shrink-0">
          <img src={resource.image_url} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="h-20 flex items-center justify-center bg-secondary/60 text-4xl shrink-0">
          {type.emoji}
        </div>
      )}

      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className={`${type.color} border text-xs`}>{type.label}</Badge>
          <Badge variant="outline" className={`${stage.color} border text-xs`}>{stage.label}</Badge>
          {resource.is_featured && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
              <Star className="w-3 h-3 mr-1 fill-primary" />Featured
            </Badge>
          )}
        </div>

        {/* Title + admin actions */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-bold text-sm leading-snug flex-1">{resource.title}</h3>
          {isAdmin && (
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => onEdit(resource)}>
                <Pencil className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => onDelete(resource.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Addiction type tag */}
        {resource.addiction_type && (
          <span className="text-[11px] bg-secondary text-muted-foreground rounded-full px-2 py-0.5 w-fit capitalize">
            {resource.addiction_type}
          </span>
        )}

        {resource.description && (
          <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-3">{resource.description}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 gap-2">
          {resource.duration_label && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground/70">
              <Clock className="w-3 h-3" />{resource.duration_label}
            </span>
          )}
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-heading font-semibold rounded-lg px-3 py-2 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open
          </a>
        </div>
      </div>
    </motion.div>
  );
}
