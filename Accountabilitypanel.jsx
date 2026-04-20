import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { UserPlus, Shield, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SendRequestForm from './SendRequestForm';
import PartnerCard from './PartnerCard';

export default function AccountabilityPanel({ currentUser }) {
  const [showSendForm, setShowSendForm] = useState(false);
  const queryClient = useQueryClient();

  // Requests sent TO me (pending)
  const { data: incomingRequests } = useQuery({
    queryKey: ['accountability-incoming', currentUser?.email],
    queryFn: () => base44.entities.AccountabilityRequest.filter({ to_email: currentUser.email, status: 'pending' }),
    enabled: !!currentUser,
    initialData: [],
  });

  // All accepted partnerships involving me
  const { data: acceptedSent } = useQuery({
    queryKey: ['accountability-sent-accepted', currentUser?.email],
    queryFn: () => base44.entities.AccountabilityRequest.filter({ from_email: currentUser.email, status: 'accepted' }),
    enabled: !!currentUser,
    initialData: [],
  });

  const { data: acceptedReceived } = useQuery({
    queryKey: ['accountability-received-accepted', currentUser?.email],
    queryFn: () => base44.entities.AccountabilityRequest.filter({ to_email: currentUser.email, status: 'accepted' }),
    enabled: !!currentUser,
    initialData: [],
  });

  // Pending requests I sent
  const { data: pendingSent } = useQuery({
    queryKey: ['accountability-pending-sent', currentUser?.email],
    queryFn: () => base44.entities.AccountabilityRequest.filter({ from_email: currentUser.email, status: 'pending' }),
    enabled: !!currentUser,
    initialData: [],
  });

  const partnerships = [...acceptedSent, ...acceptedReceived];

  const sendRequest = useMutation({
    mutationFn: (toEmail) => base44.entities.AccountabilityRequest.create({
      from_email: currentUser.email,
      from_name: currentUser.full_name || currentUser.email,
      to_email: toEmail,
      status: 'pending',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountability-pending-sent'] });
      setShowSendForm(false);
    },
  });

  const respondToRequest = useMutation({
    mutationFn: ({ id, status }) => base44.entities.AccountabilityRequest.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountability-incoming'] });
      queryClient.invalidateQueries({ queryKey: ['accountability-sent-accepted'] });
      queryClient.invalidateQueries({ queryKey: ['accountability-received-accepted'] });
    },
  });

  const removePartnership = useMutation({
    mutationFn: (id) => base44.entities.AccountabilityRequest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountability-sent-accepted'] });
      queryClient.invalidateQueries({ queryKey: ['accountability-received-accepted'] });
    },
  });

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="font-heading font-bold text-lg">Accountability</h2>
          {incomingRequests.length > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
              {incomingRequests.length}
            </span>
          )}
        </div>
        {!showSendForm && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSendForm(true)}
            className="font-heading text-xs"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            Add Partner
          </Button>
        )}
      </div>

      {/* Send Request Form */}
      <AnimatePresence>
        {showSendForm && (
          <SendRequestForm
            onSend={(email) => sendRequest.mutate(email)}
            isSending={sendRequest.isPending}
            onCancel={() => setShowSendForm(false)}
          />
        )}
      </AnimatePresence>

      {/* Incoming Requests */}
      {incomingRequests.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Requests</p>
          {incomingRequests.map((req) => (
            <div key={req.id} className="flex items-center justify-between bg-secondary rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-heading font-bold text-primary text-sm">
                  {(req.from_name || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{req.from_name}</p>
                  <p className="text-xs text-muted-foreground">{req.from_email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => respondToRequest.mutate({ id: req.id, status: 'accepted' })}
                  className="bg-primary hover:bg-primary/90 h-8 font-heading text-xs"
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => respondToRequest.mutate({ id: req.id, status: 'declined' })}
                  className="h-8 text-muted-foreground hover:text-destructive text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pending sent */}
      {pendingSent.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Pending</p>
          {pendingSent.map((req) => (
            <div key={req.id} className="flex items-center justify-between bg-secondary/50 rounded-lg px-4 py-2.5">
              <p className="text-sm text-muted-foreground">{req.to_email}</p>
              <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">Awaiting</span>
            </div>
          ))}
        </div>
      )}

      {/* Active Partners */}
      {partnerships.length === 0 && incomingRequests.length === 0 && pendingSent.length === 0 ? (
        <div className="text-center py-6">
          <Shield className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No accountability partners yet.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Add a partner to stay accountable together.</p>
        </div>
      ) : partnerships.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Partners</p>
          {partnerships.map((p) => (
            <PartnerCard
              key={p.id}
              partnership={p}
              currentUser={currentUser}
              onRemove={(id) => removePartnership.mutate(id)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
