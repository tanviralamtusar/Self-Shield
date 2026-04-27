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
      <Card className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 border border-primary/10 bg-gradient-to-br from-card to-card/50">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-110"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 relative z-10">
          <CardTitle className="text-[11px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Devices</CardTitle>
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Smartphone className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pb-4 relative z-10">
          <div className="text-3xl font-black tracking-tight">{activeDevices}</div>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-success font-medium uppercase tracking-tighter">
            <span className="h-1 w-1 rounded-full bg-success animate-pulse"></span>
            Online
          </div>
        </CardContent>
      </Card>
      
      <Card className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-success/10 border border-success/10 bg-gradient-to-br from-card to-card/50">
        <div className="absolute top-0 right-0 w-24 h-24 bg-success/5 rounded-full -mr-12 -mt-12"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 relative z-10">
          <CardTitle className="text-[11px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Protection</CardTitle>
          <div className="p-1.5 rounded-lg bg-success/10 text-success">
            <Shield className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pb-4 relative z-10">
          <div className="text-3xl font-black tracking-tight">{protectedAppsCount}</div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1 tracking-tighter">Apps Secured</p>
        </CardContent>
      </Card>
      
      <Card className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-warning/10 border border-warning/10 bg-gradient-to-br from-card to-card/50">
        <div className="absolute top-0 right-0 w-24 h-24 bg-warning/5 rounded-full -mr-12 -mt-12"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 relative z-10">
          <CardTitle className="text-[11px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Requests</CardTitle>
          <div className="p-1.5 rounded-lg bg-warning/10 text-warning">
            <Clock className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pb-4 relative z-10">
          <div className="text-3xl font-black tracking-tight">{pendingOverrides}</div>
          <p className="text-[10px] text-warning uppercase font-bold mt-1 tracking-tighter">Requires Action</p>
        </CardContent>
      </Card>
      
      <Card className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-destructive/10 border border-destructive/10 bg-gradient-to-br from-card to-card/50">
        <div className="absolute top-0 right-0 w-24 h-24 bg-destructive/5 rounded-full -mr-12 -mt-12"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 relative z-10">
          <CardTitle className="text-[11px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Neutralized</CardTitle>
          <div className="p-1.5 rounded-lg bg-destructive/10 text-destructive">
            <ShieldAlert className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pb-4 relative z-10">
          <div className="text-3xl font-black tracking-tight">{totalBlocks.toLocaleString()}</div>
          <p className="text-[10px] text-destructive uppercase font-bold mt-1 tracking-tighter">Threats Blocked</p>
        </CardContent>
      </Card>
    </div>
  );
}

