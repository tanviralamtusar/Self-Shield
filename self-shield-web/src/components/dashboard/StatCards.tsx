'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDevices } from '@/hooks/useDevices';
import { useReportStats } from '@/hooks/useReports';
import { useOverrideRequests } from '@/hooks/useOverrideRequests';
import { Smartphone, ShieldAlert, Shield, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function StatCards() {
  const { data: devices, isLoading: devicesLoading } = useDevices();
  const { data: stats, isLoading: statsLoading } = useReportStats();
  const { data: overrides, isLoading: overridesLoading } = useOverrideRequests();

  const isLoading = devicesLoading || statsLoading || overridesLoading;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const activeDevices = devices?.length || 0;
  const pendingOverrides = overrides?.filter(o => o.status === 'pending').length || 0;
  const totalBlocks = stats?.totalBlocks || 0;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <Smartphone className="h-4 w-4" />
          </div>
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">{activeDevices}</div>
          <p className="text-xs text-muted-foreground mt-1">Systems currently protected</p>
        </CardContent>
      </Card>
      
      <Card className="border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className="p-2 rounded-full bg-amber-500/10 text-amber-500">
            <Clock className="h-4 w-4" />
          </div>
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Action Needed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">{pendingOverrides}</div>
          <p className={`text-xs mt-1 ${pendingOverrides > 0 ? "text-amber-500 font-medium" : "text-muted-foreground"}`}>
            {pendingOverrides > 0 ? "Manual review required" : "No pending requests"}
          </p>
        </CardContent>
      </Card>
      
      <Card className="border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className="p-2 rounded-full bg-rose-500/10 text-rose-500">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Blocked Threats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">{totalBlocks.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Total items neutralized</p>
        </CardContent>
      </Card>
    </div>
  );
}
