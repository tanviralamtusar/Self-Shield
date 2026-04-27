'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useDevices } from '@/hooks/useDevices';
import { Smartphone, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';

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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Device</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Seen</TableHead>
            <TableHead>Version</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.map((device) => {
            const status = getStatus(device.last_seen_at);
            return (
              <TableRow key={device.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    {device.device_name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {status.label === 'Online' ? (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                      </span>
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/30"></span>
                    )}
                    <Badge 
                      variant={status.color} 
                      className={status.label === 'Online' ? 'bg-success/10 text-success border-success/20 hover:bg-success/20' : 'bg-muted/50'}
                    >
                      {status.label}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {device.last_seen_at 
                    ? `${formatDistanceToNow(parseISO(device.last_seen_at))} ago` 
                    : 'Never'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  v{device.app_version || '1.0.0'}
                </TableCell>
                <TableCell className="text-right">
                  <Button nativeButton={false} variant="ghost" size="sm" render={<Link href={`/devices/${device.id}`} />}>
                    View Details
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
