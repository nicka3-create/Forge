import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SendRequestForm({ onSend, isSending, onCancel }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    onSend(email.trim().toLowerCase());
    setEmail('');
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      onSubmit={handleSubmit}
      className="bg-secondary rounded-xl p-4 space-y-3"
    >
      <p className="text-sm text-muted-foreground">Enter the email address of the person you want as your accountability partner.</p>
      <div className="flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="partner@email.com"
          className="bg-background border-border flex-1"
          required
        />
        <Button type="submit" disabled={isSending} className="bg-primary hover:bg-primary/90 font-heading shrink-0">
          <UserPlus className="w-4 h-4 mr-1.5" />
          {isSending ? 'Sending…' : 'Send'}
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </motion.form>
  );
}
