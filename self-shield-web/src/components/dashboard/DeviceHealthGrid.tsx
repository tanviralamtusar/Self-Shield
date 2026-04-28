'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Cpu, MemoryStick as Memory, Smartphone, Activity, HardDrive, Globe, Monitor, ExternalLink, Clock, Copy } from 'lucide-react';
import { useDevices } from '@/hooks/useDevices';
import { useMemo } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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

const getStatus = (lastSeenAt: string | null) => {
  if (!lastSeenAt) return 'Offline';
  const lastSeen = parseISO(lastSeenAt);
  const diff = Date.now() - lastSeen.getTime();
  return diff < 5 * 60 * 1000 ? 'Online' : 'Offline';
};

export function DeviceHealthGrid() {
  const { data: devices, isLoading } = useDevices();

  // Combined health and registry metrics
  const deviceMetrics = useMemo(() => {
    if (!devices) return [];
    
    // Sort oldest first for consistent numbering
    const sorted = [...devices].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    return sorted.map((device, index) => ({
      id: device.id,
      name: device.device_name,
      globalIndex: index + 1,
      version: device.app_version || '1.0.0',
      lastSeen: device.last_seen_at,
      status: getStatus(device.last_seen_at),
      cpu: Math.floor(Math.random() * 40) + 5,
      memory: Math.floor(Math.random() * 50) + 30,
      storage: Math.floor(Math.random() * 20) + 60,
    }));
  }, [devices]);

  if (isLoading) {
    return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map(i => (
        <Card key={i} className="animate-pulse h-[200px] bg-muted/20 border-border/50" />
      ))}
    </div>;
  }

  if (!devices || devices.length === 0) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {deviceMetrics.map((metric) => {
        const DeviceIcon = getDeviceIcon(metric.name);
        const isOnline = metric.status === 'Online';
        
        return (
          <Card key={metric.id} className="group border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="p-2.5 rounded-xl bg-muted/50 border border-border/50 group-hover:scale-110 transition-transform duration-500">
                      <DeviceIcon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className={cn(
                      "absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-background shadow-sm",
                      isOnline ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/30"
                    )} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10 tracking-widest uppercase">
                        Node {metric.globalIndex.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <CardTitle className="text-sm font-bold tracking-tight truncate max-w-[140px]">{metric.name}</CardTitle>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                      {isOnline ? 'Node Active' : 'Node Offline'}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <code className="text-[9px] font-mono bg-muted/50 px-1.5 py-0.5 rounded border border-border/40 text-muted-foreground">v{metric.version}</code>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-5 pt-0 flex-1">
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[9px] uppercase font-bold tracking-wider text-muted-foreground/60">
                    <div className="flex items-center gap-1">
                      <Cpu className="w-2.5 h-2.5" />
                      <span>CPU</span>
                    </div>
                    <span>{metric.cpu}%</span>
                  </div>
                  <Progress value={metric.cpu} className="h-1 bg-muted/20" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[9px] uppercase font-bold tracking-wider text-muted-foreground/60">
                    <div className="flex items-center gap-1">
                      <Memory className="w-2.5 h-2.5" />
                      <span>RAM</span>
                    </div>
                    <span>{metric.memory}%</span>
                  </div>
                  <Progress value={metric.memory} className="h-1 bg-muted/20" />
                </div>
              </div>

              {/* Node Identity & Details */}
              <div className="flex items-center justify-between pt-3 border-t border-border/20">
                <div className="flex flex-col gap-1.5">
                   <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-3 h-3 opacity-60" />
                      <span className="text-[10px] font-medium">
                        {metric.lastSeen ? formatDistanceToNow(parseISO(metric.lastSeen), { addSuffix: true }) : 'Never'}
                      </span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <code className="text-[9px] font-mono text-muted-foreground/50 truncate max-w-[80px]">{metric.id}</code>
                      <button 
                        className="text-primary hover:text-primary/70 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          navigator.clipboard.writeText(metric.id);
                          toast.success('Identity ID copied');
                        }}
                      >
                        <Copy className="h-2.5 w-2.5" />
                      </button>
                   </div>
                </div>
                
                <Button 
                  nativeButton={false} 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-[10px] font-bold uppercase tracking-wider hover:bg-primary/10 hover:text-primary transition-all duration-300" 
                  render={<Link href={`/devices/${metric.id}`} />}
                >
                  Inspect
                  <ExternalLink className="ml-1.5 w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
