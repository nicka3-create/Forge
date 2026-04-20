import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Flame, Brain, Send, ChevronDown, ChevronUp, UserX } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { getBestDays } from '@/lib/badgeSystem';

function StreakSummary({ partnerEmail, partnerName }) {
  const { data: streaks } = useQuery({
    queryKey: ['partner-streaks', partnerEmail],
    queryFn: () => base44.entities.Streak.filter({ created_by: partnerEmail }),
    initialData: [],
  });

  const bestDays = getBestDays(streaks);
  const activeStreaks = streaks.filter(s => s.is_active !== false);

  return (
    <div className="bg-secondary rounded-lg p-3 space-y-2">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{partnerName}'s Progress</p>
      {activeStreaks.length === 0 ? (
        <p className="text-xs text-muted-foreground">No active streaks yet.</p>
      ) : (
        <div className="space-y-1.5">
          {activeStreaks.slice(0, 3).map((streak) => {
            const days = differenceInDays(new Date(), new Date(streak.start_date));
            return (
              <div key={streak.id} className="flex items-center justify-between">
                <span className="text-xs capitalize text-foreground/80">{streak.addiction_type}</span>
                <span className="text-xs font-heading font-bold text-primary">{days}d 🔥</span>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex items-center gap-3 pt-1 border-t border-border/50">
        <span className="text-xs text-muted-foreground">Best streak:</span>
        <span className="text-xs font-heading font-bold text-primary">{bestDays} days</span>
      </div>
    </div>
  );
}

export default function PartnerCard({ partnership, currentUser, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const partnerEmail = partnership.from_email === currentUser.email
    ? partnership.to_email
    : partnership.from_email;
  const partnerName = partnership.from_email === currentUser.email
    ? (partnership.to_name || partnerEmail)
    : partnership.from_name;

  const { data: messages } = useQuery({
    queryKey: ['accountability-messages', partnership.id],
    queryFn: () => base44.entities.AccountabilityMessage.filter({ partnership_id: partnership.id }, '-created_date', 20),
    enabled: expanded,
    initialData: [],
  });

  const sendMessage = useMutation({
    mutationFn: () => base44.entities.AccountabilityMessage.create({
      partnership_id: partnership.id,
      from_email: currentUser.email,
      from_name: currentUser.full_name || currentUser.email,
      content: message.trim(),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountability-messages', partnership.id] });
      setMessage('');
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-heading font-bold text-primary">
            {(partnerName || 'P')[0].toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-sm">{partnerName}</p>
            <p className="text-xs text-muted-foreground">{partnerEmail}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground hover:text-foreground"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(partnership.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <UserX className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
              {/* Partner streak summary */}
              <StreakSummary partnerEmail={partnerEmail} partnerName={partnerName} />

              {/* Private messages */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Private Messages</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {messages.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No messages yet. Send some support!</p>
                  ) : (
                    [...messages].reverse().map((msg) => {
                      const isMe = msg.from_email === currentUser.email;
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs ${isMe ? 'bg-primary/20 text-foreground' : 'bg-secondary text-foreground'}`}>
                            {!isMe && <p className="font-semibold text-primary mb-0.5">{msg.from_name}</p>}
                            <p>{msg.content}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="flex gap-2 pt-1">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Send some encouragement…"
                    className="bg-secondary border-border text-xs min-h-[56px] flex-1 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && message.trim()) {
                        e.preventDefault();
                        sendMessage.mutate();
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    onClick={() => sendMessage.mutate()}
                    disabled={!message.trim() || sendMessage.isPending}
                    className="bg-primary hover:bg-primary/90 shrink-0 self-end"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
