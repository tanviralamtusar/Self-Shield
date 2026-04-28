import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Smartphone, Shield, ShieldAlert, Clock, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import type { Device } from '@/hooks/useDevices';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function DeviceCard({ device }: { device: Device }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const isOnline = device.last_seen_at 
    ? new Date().getTime() - new Date(device.last_seen_at).getTime() < 1000 * 60 * 5 // 5 mins
    : false;

  const protectionStatus = device.is_device_owner && device.is_admin_active ? 'Full' : 'Partial';

  const removeDevice = async () => {
    if (!confirm(`Are you sure you want to remove ${device.device_name || 'this device'}?`)) {
      return;
    }

    setIsDeleting(true);
    
    // INSTANT: Tell the extension to go inactive IMMEDIATELY (before API call)
    window.postMessage({ type: 'SELF_SHIELD_DEVICE_DELETED', deviceId: device.id }, '*');

    try {
      const response = await fetch(`/api/extension/devices/${device.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete');

      toast.success('Device removed successfully');
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    } catch (error: any) {
      console.error('Error removing device:', error);
      toast.error(error.message || 'Failed to remove device');
    } finally {
      setIsDeleting(false);
    }
  };

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
          <div className="flex items-center gap-2">
            <Badge variant={isOnline ? 'default' : 'secondary'} className={isOnline ? 'bg-success hover:bg-success/90' : ''}>
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={removeDevice}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </div>
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
