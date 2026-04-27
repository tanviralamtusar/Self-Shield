import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Smartphone, Shield, ShieldAlert, Clock } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import type { Device } from '@/hooks/useDevices';

export function DeviceCard({ device }: { device: Device }) {
  const isOnline = device.last_seen_at 
    ? new Date().getTime() - new Date(device.last_seen_at).getTime() < 1000 * 60 * 5 // 5 mins
    : false;

  const protectionStatus = device.is_device_owner && device.is_admin_active ? 'Full' : 'Partial';

  return (
    <Card className="flex flex-col hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{device.device_name || 'Unnamed Device'}</CardTitle>
              <CardDescription className="text-xs flex items-center mt-1">
                <Clock className="w-3 h-3 mr-1" />
                {device.last_seen_at ? `Seen ${formatDistanceToNow(new Date(device.last_seen_at), { addSuffix: true })}` : 'Never seen'}
              </CardDescription>
            </div>
          </div>
          <Badge variant={isOnline ? 'default' : 'secondary'} className={isOnline ? 'bg-success hover:bg-success/90' : ''}>
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-1 border-b">
            <span className="text-muted-foreground">Protection</span>
            <span className="font-medium flex items-center gap-1">
              {protectionStatus === 'Full' ? <Shield className="w-4 h-4 text-success" /> : <ShieldAlert className="w-4 h-4 text-warning" />}
              {protectionStatus}
            </span>
          </div>
          <div className="flex justify-between items-center py-1 border-b">
            <span className="text-muted-foreground">Android OS</span>
            <span className="font-medium">{device.android_version || 'Unknown'}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-muted-foreground">App Version</span>
            <span className="font-medium">{device.app_version || 'Unknown'}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button nativeButton={false} render={<Link href={`/devices/${device.id}`} />} variant="outline" className="w-full">
          Manage Rules
        </Button>
      </CardFooter>
    </Card>
  );
}
