'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Copy, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export function PairDeviceModal() {
  const [open, setOpen] = useState(false);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();
  const queryClient = useQueryClient();

  const generateCode = async () => {
    setLoading(true);
    // In a real app, this would call a backend endpoint to securely generate
    // and store the pairing code. For now, we'll simulate it.
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      // Generate random 6 digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setPairingCode(code);
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate code');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset state when closing
      setTimeout(() => {
        setPairingCode(null);
        setCopied(false);
      }, 300);
    } else {
      generateCode();
    }
  };

  const copyToClipboard = () => {
    if (pairingCode) {
      navigator.clipboard.writeText(pairingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Pairing code copied to clipboard');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>
        <Plus className="w-4 h-4 mr-2" />
        Pair Device
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pair a New Device</DialogTitle>
          <DialogDescription>
            Enter this 6-digit code in the Self-Shield Android app to link it to your account.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Generating secure code...</p>
            </div>
          ) : pairingCode ? (
            <>
              <div className="bg-muted p-6 rounded-lg w-full flex items-center justify-center relative group">
                <span className="text-5xl font-mono tracking-[0.25em] font-bold text-foreground">
                  {pairingCode}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-center text-muted-foreground">
                This code will expire in 10 minutes.
              </p>
            </>
          ) : (
            <div className="text-destructive text-sm text-center">
              Failed to generate pairing code. Please try again.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
