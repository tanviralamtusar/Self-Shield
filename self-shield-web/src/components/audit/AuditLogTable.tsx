'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Info, AlertTriangle, ShieldCheck, Loader2, Image as ImageIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useAuditLogs } from '@/hooks/useAuditLogs';

export function AuditLogTable({ deviceId }: { deviceId?: string }) {
  const { data: logs, isLoading } = useAuditLogs(deviceId);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'medium': return <ShieldAlert className="w-4 h-4 text-warning" />;
      case 'success': return <ShieldCheck className="w-4 h-4 text-success" />;
      default: return <Info className="w-4 h-4 text-primary" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'success': return 'default';
      default: return 'outline';
    }
  };

  const mapEventType = (type: string) => {
    const map: Record<string, { label: string; severity: string }> = {
      'uninstall_attempt': { label: 'Tamper', severity: 'high' },
      'adb_detected': { label: 'Security', severity: 'high' },
      'safe_mode_boot': { label: 'Security', severity: 'medium' },
      'wrong_pin': { label: 'Auth', severity: 'medium' },
      'vpn_killed': { label: 'System', severity: 'high' },
      'admin_settings_access': { label: 'System', severity: 'info' },
      'factory_reset_attempt': { label: 'Tamper', severity: 'high' },
      'app_kill_attempt': { label: 'Tamper', severity: 'medium' },
    };
    return map[type] || { label: type, severity: 'info' };
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Loading audit logs...</p>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <ShieldCheck className="w-12 h-12 mb-4 opacity-20" />
        <p>No audit events recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Severity</TableHead>
            <TableHead>Event Type</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => {
            const { label, severity } = mapEventType(log.event_type);
            return (
              <TableRow key={log.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(severity)}
                    <span className="capitalize text-xs font-medium">{severity}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getSeverityColor(severity) as any}>
                    {label}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{log.devices.device_name}</TableCell>
                <TableCell className="max-w-[400px] truncate">
                  <div className="flex items-center gap-2">
                    {log.details?.message || log.event_type.replace(/_/g, ' ')}
                    {log.screenshot_url && (
                      <a 
                        href={log.screenshot_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                        title="View Screenshot"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">
                  {format(parseISO(log.occurred_at), 'MMM d, HH:mm')}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

