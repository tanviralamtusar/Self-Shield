'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Info, AlertTriangle, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';

export function AuditLogTable() {
  // Mock data
  const logs = [
    { 
      id: '1', 
      type: 'Tamper', 
      device: 'Pixel 7', 
      description: 'Accessibility Service disabled', 
      timestamp: new Date().toISOString(),
      severity: 'high'
    },
    { 
      id: '2', 
      type: 'Block', 
      device: 'Pixel 7', 
      description: 'Blocked access to instagram.com', 
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      severity: 'info'
    },
    { 
      id: '3', 
      type: 'Security', 
      device: 'Samsung S22', 
      description: 'App uninstallation attempt blocked', 
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      severity: 'medium'
    },
    { 
      id: '4', 
      type: 'System', 
      device: 'Pixel 7', 
      description: 'Blocklist updated successfully', 
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      severity: 'success'
    }
  ];

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
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getSeverityIcon(log.severity)}
                  <span className="capitalize text-xs font-medium">{log.severity}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getSeverityColor(log.severity) as any}>
                  {log.type}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">{log.device}</TableCell>
              <TableCell className="max-w-[400px] truncate">{log.description}</TableCell>
              <TableCell className="text-right text-muted-foreground tabular-nums">
                {format(new Date(log.timestamp), 'MMM d, HH:mm')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
