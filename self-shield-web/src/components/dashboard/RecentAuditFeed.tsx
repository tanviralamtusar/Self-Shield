'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { formatDistanceToNow, parseISO } from 'date-fns';

export function RecentAuditFeed() {
  const { data: logs, isLoading } = useAuditLogs(undefined, 5);

  const securityEvents = logs?.filter(log => 
    ['uninstall_attempt', 'adb_detected', 'vpn_killed', 'factory_reset_attempt'].includes(log.event_type)
  ) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-primary" />
          Security Feed
        </CardTitle>
        <CardDescription>Recent tamper events and system alerts</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-6 text-muted-foreground">Loading feed...</div>
        ) : securityEvents.length > 0 ? (
          <div className="space-y-3">
            {securityEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border text-sm">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-destructive capitalize">
                    {event.event_type.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {event.devices.device_name} • {formatDistanceToNow(parseISO(event.occurred_at))} ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg bg-muted/10">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-xs">No recent security events.</p>
            <p className="text-[10px]">All systems secure.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

