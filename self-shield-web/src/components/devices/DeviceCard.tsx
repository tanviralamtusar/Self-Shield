import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Smartphone, Shield, ShieldAlert, Clock, Trash2, Loader2, Copy, Globe, Monitor } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import type { Device } from '@/hooks/useDevices';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const getDeviceIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('extension') || lowerName.includes('browser') || lowerName.includes('chrome') || lowerName.includes('firefox')) {
    return Globe;
  }
  if (lowerName.includes('windows') || lowerName.includes('pc') || lowerName.includes('laptop') || lowerName.includes('desktop') || lowerName.includes('mac')) {
    return Monitor;
  }
  return Smartphone;
};

export function DeviceCard({ device, index }: { device: Device, index?: number }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const isOnline = device.last_seen_at 
    ? new Date().getTime() - new Date(device.last_seen_at).getTime() < 1000 * 60 * 5 // 5 mins
    : false;

  const protectionStatus = device.is_device_owner && device.is_admin_active ? 'Full' : 'Partial';

  const handleAction = async (isDelete: boolean) => {
    const actionType = isDelete ? 'delete' : 'unpair';
    const confirmMsg = isDelete 
      ? `Are you sure you want to DELETE this node? This will remove all history and settings permanently.`
      : `Are you sure you want to UNPAIR this node? The extension will stop protecting immediately.`;

    if (!confirm(confirmMsg)) return;

    setIsDeleting(true);
    
    // INSTANT: Tell the extension to go inactive IMMEDIATELY (before API call)
    window.postMessage({ type: 'SELF_SHIELD_DEVICE_DELETED', deviceId: device.id }, '*');

    try {
      const response = await fetch(`/api/extension/devices/${device.id}`, {
        method: isDelete ? 'DELETE' : 'PATCH',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Failed to ${actionType}`);

      toast.success(isDelete ? 'Device deleted' : 'Device unpaired');
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    } catch (error: any) {
      console.error(`Error ${actionType} device:`, error);
      toast.error(error.message || `Failed to ${actionType} device`);
    } finally {
      setIsDeleting(false);
    }
  };

  const DeviceIcon = getDeviceIcon(device.device_name || '');

  return (
    <Card className="group relative border border-border/80 bg-card/30 backdrop-blur-md transition-[border-color,background-color,shadow] duration-300 hover:border-primary/50 hover:bg-card/40 shadow-lg hover:shadow-primary/5 overflow-hidden">
      
      {/* Node Number - Sharp Minimalist Tag */}
      {index && (
        <div className="absolute top-3 right-4 z-20 select-none pointer-events-none opacity-90 transition-opacity duration-300">
          <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded border border-primary/30 bg-primary/10 font-mono">
            <div className="w-1 h-1 rounded-full bg-primary/60" />
            <span className="text-[10px] font-black text-primary/80 tracking-tight">
              {index.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      )}

      {/* Hover top glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* ── INNER HEADER PANEL ───────────────────── */}
      <div className="m-5 mb-0 rounded-xl border border-border/30 bg-muted/10 p-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-4 min-w-0">
          {/* Icon container */}
          <div className="p-3 rounded-xl bg-card/60 border border-border/40 shrink-0 group-hover:border-primary/30 group-hover:bg-primary/5 transition-[border-color,background-color] duration-300">
            <DeviceIcon className="w-6 h-6 text-muted-foreground/80 group-hover:text-primary transition-colors duration-300" />
          </div>

          {/* Name + status */}
          <div className="min-w-0">
            <p className="text-lg font-bold text-foreground truncate leading-tight tracking-tight pr-10">
              {device.device_name || 'Unnamed Node'}
            </p>
            <div className="flex items-center gap-2.5 mt-2">
              {/* Online pill */}
              <span className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                isOnline
                   ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : "bg-muted/20 text-muted-foreground/60 border-border/20"
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", isOnline ? "bg-emerald-500" : "bg-muted-foreground/50")} />
                {isOnline ? 'Live' : 'Offline'}
              </span>
              <span className="text-[11px] text-muted-foreground/50">
                {device.last_seen_at ? formatDistanceToNow(new Date(device.last_seen_at), { addSuffix: true }) : 'Never'}
              </span>
            </div>
          </div>
        </div>

        {/* Delete button (Trash icon) */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 rounded-full text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-colors mt-0.5"
          onClick={() => handleAction(true)}
          disabled={isDeleting}
          title="Delete Card"
        >
          {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
        </Button>
      </div>

      {/* ── FEATURES GRID ───────────────────────────── */}
      <div className="grid grid-cols-2 gap-2 px-4 py-3">
        {/* Security Status */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/10 border border-border/20">
          {protectionStatus === 'Full'
            ? <Shield className="w-3.5 h-3.5 text-emerald-500/80 shrink-0" />
            : <ShieldAlert className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
          }
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold text-muted-foreground/70 tracking-wider leading-none mb-1">Security</p>
            <p className="text-[13px] font-bold text-foreground leading-none">{protectionStatus}</p>
          </div>
        </div>

        {/* Version Info */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/10 border border-border/20">
          <div className="w-3.5 h-3.5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold text-muted-foreground/70 tracking-wider leading-none mb-1">Version</p>
            <p className="text-[13px] font-mono font-bold text-foreground leading-none">v{device.app_version || '1.0.0'}</p>
          </div>
        </div>

        {/* Admin Status */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/10 border border-border/20">
          <Smartphone className={cn(
            "w-3.5 h-3.5 shrink-0",
            device.is_admin_active ? "text-primary/70" : "text-muted-foreground/50"
          )} />
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold text-muted-foreground/70 tracking-wider leading-none mb-1">Admin Mode</p>
            <p className="text-[13px] font-bold text-foreground leading-none">
              {device.is_admin_active ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>

        {/* Device Role */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/10 border border-border/20">
          <Shield className={cn(
            "w-3.5 h-3.5 shrink-0",
            device.is_device_owner ? "text-emerald-500/60" : "text-primary/50"
          )} />
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold text-muted-foreground/70 tracking-wider leading-none mb-1">Node Role</p>
            <p className="text-[13px] font-bold text-foreground leading-none">
              {device.is_device_owner ? 'Primary' : 'Shield Node'}
            </p>
          </div>
        </div>
      </div>

      {/* ── IDENTITY ─────────────────────────────── */}
      <div className="flex items-center gap-2 mx-4 mb-3 px-3 py-2 rounded-lg bg-muted/10 border border-border/20">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase font-bold text-muted-foreground/70 tracking-wider mb-1">Identity Token</p>
          <code className="text-[11px] font-mono text-foreground/80 truncate block transition-colors">
            {device.id}
          </code>
        </div>
        <button
          className="shrink-0 p-1.5 rounded-md text-muted-foreground/60 hover:text-primary hover:bg-primary/5 transition-all"
          onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText(device.id); toast.success('Copied!'); }}
        >
          <Copy className="w-4" />
        </button>
      </div>

      {/* ── FOOTER: action buttons ─────────── */}
      <div className="px-4 pb-4 flex gap-2">
        <Button
          nativeButton={false}
          render={<Link href={`/devices/${device.id}`} />}
          variant="outline"
          className="flex-1 h-10 text-[12px] font-black uppercase tracking-wider border-border/40 bg-transparent text-foreground/70 hover:bg-primary hover:text-white hover:border-primary transition-colors duration-200"
        >
          Manage
        </Button>
        <Button
          onClick={() => handleAction(false)}
          disabled={isDeleting || !device.last_seen_at}
          variant="outline"
          className="flex-1 h-10 text-[12px] font-black uppercase tracking-wider border-destructive/30 bg-transparent text-destructive/60 hover:bg-destructive hover:text-white hover:border-destructive transition-colors duration-200 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-destructive/50 disabled:hover:border-destructive/30"
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Unpair'}
        </Button>
      </div>




    </Card>
  );
}
