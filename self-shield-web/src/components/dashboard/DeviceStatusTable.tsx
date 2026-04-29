'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDevices } from '@/hooks/useDevices';
import { Smartphone, ExternalLink, Globe, Monitor } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';

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

export function DeviceStatusTable() {
  const { data: devices, isLoading } = useDevices();

  const getStatus = (lastSeenAt: string | null) => {
    if (!lastSeenAt) return { label: 'Never', color: 'secondary' as const };
    
    const lastSeen = parseISO(lastSeenAt);
    const diff = Date.now() - lastSeen.getTime();
    
    if (diff < 5 * 60 * 1000) { // 5 minutes
      return { label: 'Online', color: 'default' as const };
    }
    return { label: 'Offline', color: 'outline' as const };
  };

  if (isLoading) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        Loading devices...
      </div>
    );
  }

  if (!devices || devices.length === 0) {
    return (
      <div className="rounded-md border p-12 text-center text-muted-foreground">
        <Smartphone className="mx-auto h-12 w-12 opacity-20 mb-4" />
        <p>No devices paired yet.</p>
        <Button nativeButton={false} variant="outline" className="mt-4" render={<Link href="/devices" />}>
          Pair a Device
        </Button>
      </div>
    );
  }

  return (
    <Card className="border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-border/50">
            <TableHead className="text-[11px] uppercase font-bold tracking-wider">Device</TableHead>
            <TableHead className="text-[11px] uppercase font-bold tracking-wider">Status</TableHead>
            <TableHead className="text-[11px] uppercase font-bold tracking-wider">Last Seen</TableHead>
            <TableHead className="text-[11px] uppercase font-bold tracking-wider">Version</TableHead>
            <TableHead className="text-right text-[11px] uppercase font-bold tracking-wider">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.map((device) => {
            const status = getStatus(device.last_seen_at);
            const DeviceIcon = getDeviceIcon(device.device_name);
            return (
              <TableRow key={device.id} className="border-border/40 hover:bg-muted/20 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-muted/50 border border-border/50">
                      <DeviceIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <span className="text-sm">{device.device_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex h-1.5 w-1.5">
                      <span className={status.label === 'Online' ? 'relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500' : 'relative inline-flex rounded-full h-1.5 w-1.5 bg-muted-foreground/30'}></span>
                    </div>
                    <span className={`text-[11px] font-semibold uppercase tracking-tight ${status.label === 'Online' ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                      {status.label}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {device.last_seen_at 
                    ? `${formatDistanceToNow(parseISO(device.last_seen_at))} ago` 
                    : 'Never'}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  <code className="bg-muted/50 px-1.5 py-0.5 rounded text-[10px] border border-border/50">v{device.app_version || '1.0.0'}</code>
                </TableCell>
                <TableCell className="text-right">
                  <Button nativeButton={false} variant="ghost" size="sm" className="h-8 text-xs font-medium hover:bg-muted/50" render={<Link href={`/devices/${device.id}`} />}>
                    Details
                    <ExternalLink className="ml-1.5 h-3 w-3 opacity-50" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
