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
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/devices">Pair a Device</Link>
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
                  <Badge variant={status.color}>{status.label}</Badge>
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
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/devices/${device.id}`}>
                      View Details
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Link>
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
