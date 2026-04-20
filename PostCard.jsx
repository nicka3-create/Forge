import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Flame, Lightbulb, Megaphone, CloudLightning } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const typeConfig = {
  journey: { icon: Flame, label: 'Journey', color: 'bg-primary/15 text-primary border-primary/20' },
  tip: { icon: Lightbulb, label: 'Tip', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  motivation: { icon: Megaphone, label: 'Motivation', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  vent: { icon: CloudLightning, label: 'Vent', color: 'bg-violet-500/15 text-violet-400 border-violet-500/20' },
};

export default function PostCard({ post, currentUserEmail, onLike }) {
  const config = typeConfig[post.type] || typeConfig.journey;
  const Icon = config.icon;
  const isLiked = post.liked_by?.includes(currentUserEmail);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    onLike(post);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/post/${post.id}`} className="block">
        <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all duration-300 group">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm font-bold font-heading text-foreground">
                {(post.author_name || 'A')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{post.author_name || 'Anonymous'}</p>
                <p className="text-xs text-muted-foreground">
                  {post.created_date ? format(new Date(post.created_date), 'MMM d, yyyy') : ''}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={`${config.color} border text-xs`}>
              <Icon className="w-3 h-3 mr-1" />
              {config.label}
            </Badge>
          </div>

          {/* Content */}
          <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
            {post.content}
          </p>

          {/* Addiction tag */}
          {post.addiction_type && (
            <span className="inline-block text-xs bg-secondary px-2.5 py-1 rounded-full text-secondary-foreground mb-3">
              {post.addiction_type}
            </span>
          )}

          {/* Footer */}
          <div className="flex items-center gap-4 pt-3 border-t border-border">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-sm transition-all ${
                isLiked ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-primary' : ''}`} />
              <span>{post.likes || 0}</span>
            </button>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments_count || 0}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
