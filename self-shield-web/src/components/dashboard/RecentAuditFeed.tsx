'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export function RecentAuditFeed() {
  // Mock data for now
  const events: any[] = [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" />
          Recent Tamper Alerts
        </CardTitle>
        <CardDescription>Security events from the last 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-destructive/10">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground border border-dashed rounded-lg">
            No recent tamper events. All systems secure.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
