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
  // We'll use device count for now or a hardcoded value if we don't have total apps
  const protectedAppsCount = 12; // Mock or calculate if we have a way to get total apps

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Devices</CardTitle>
          <Smartphone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeDevices}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Protected Apps</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{protectedAppsCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pending Overrides</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingOverrides}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Blocks</CardTitle>
          <ShieldAlert className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBlocks.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
}

