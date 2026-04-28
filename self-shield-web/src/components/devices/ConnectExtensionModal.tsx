'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Globe, Copy, Check, Loader2, ShieldCheck, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export function ConnectExtensionModal() {
  const [open, setOpen] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();
  const queryClient = useQueryClient();

  const connectExtension = async () => {
    setLoading(true);
    try {
      const deviceName = 'Browser Extension (' + navigator.userAgent.split(' ').pop() + ')';
      
      const response = await fetch('/api/extension/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceName })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Registration failed:', data);
        throw new Error(data.error || 'Failed to register device');
      }

      setDeviceId(data.deviceId);
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Extension Device Created!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to connect extension');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (deviceId) {
      navigator.clipboard.writeText(deviceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Device ID copied to clipboard');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="border-primary/20 hover:bg-primary/5" />}>
        <Globe className="w-4 h-4 mr-2 text-primary" />
        Connect Extension
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle>Connect Browser Extension</DialogTitle>
          </div>
          <DialogDescription>
            Follow these steps to pair your browser extension with the admin panel.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {!deviceId ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50 text-sm space-y-3">
                <p className="font-medium">1. Create Extension Device</p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Click the button below to generate a unique Device ID for your browser. This will allow you to control rules directly from this dashboard.
                </p>
                <Button 
                  onClick={connectExtension} 
                  disabled={loading}
                  className="w-full mt-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  Generate Device ID
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-3">
                <p className="text-sm font-medium">2. Copy your Device ID</p>
                <div className="bg-muted p-4 rounded-xl border border-border flex items-center justify-between group">
                  <code className="text-xs font-mono text-primary truncate max-w-[240px]">
                    {deviceId}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
                <p className="text-sm font-medium text-primary">3. Paste in Extension</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Open the Self-Shield extension in your browser, click <strong>"Pair Device"</strong>, and paste the ID above.
                </p>
              </div>

              <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
