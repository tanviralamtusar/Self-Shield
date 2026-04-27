'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuditLogTable } from '@/components/audit/AuditLogTable';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { downloadCSV } from '@/lib/csv-export';
import { format } from 'date-fns';

export default function AuditPage() {
  const { data: logs } = useAuditLogs();

  const handleExport = () => {
    if (!logs) return;
    
    const exportData = logs.map(log => ({
      ID: log.id,
      Device: log.devices.device_name,
      Type: log.event_type,
      OccurredAt: format(new Date(log.occurred_at), 'yyyy-MM-dd HH:mm:ss'),
      Details: JSON.stringify(log.details)
    }));

    downloadCSV(exportData, `audit-log-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Audit Log</h2>
          <p className="text-muted-foreground mt-1">
            Review security events, tamper attempts, and blocking activity.
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} disabled={!logs || logs.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
          <CardDescription>A chronological log of all important device events.</CardDescription>
        </CardHeader>
        <CardContent>
          <AuditLogTable />
        </CardContent>
      </Card>
    </div>
  );
}

