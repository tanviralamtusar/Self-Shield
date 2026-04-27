'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDevices } from '@/hooks/useDevices';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export function DeviceStatusTable() {
  const { data: devices, isLoading } = useDevices();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Device Status</CardTitle>
          <CardDescription>Current protection status across all devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            Loading devices...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Status</CardTitle>
        <CardDescription>Current protection status across all devices</CardDescription>
      </CardHeader>
      <CardContent>
        {devices && devices.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => {
                const isOnline = device.last_seen_at 
                  ? new Date().getTime() - new Date(device.last_seen_at).getTime() < 1000 * 60 * 5
                  : false;
                  
                return (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.device_name || 'Unnamed Device'}</TableCell>
                    <TableCell>
                      {device.last_seen_at 
                        ? formatDistanceToNow(new Date(device.last_seen_at), { addSuffix: true }) 
                        : 'Never'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={isOnline ? 'default' : 'secondary'} className={isOnline ? 'bg-success hover:bg-success/90' : ''}>
                        {isOnline ? 'Online' : 'Offline'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/devices/${device.id}`}>
                          Manage
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-muted-foreground border border-dashed rounded-lg">
            No devices paired yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
