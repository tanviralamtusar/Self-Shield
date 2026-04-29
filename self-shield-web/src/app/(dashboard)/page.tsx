'use client';

import { StatCards } from '@/components/dashboard/StatCards';
import { RecentAuditFeed } from '@/components/dashboard/RecentAuditFeed';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { DeviceHealthGrid } from '@/components/dashboard/DeviceHealthGrid';

export default function DashboardOverview() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Command Center</h1>
          <p className="text-sm text-muted-foreground font-medium">
            Monitoring <span className="text-primary">All Active Nodes</span> across the distributed network.
          </p>
        </div>
        
        <QuickActions />
      </div>

      {/* Primary Stats */}
      <StatCards />

      {/* Device Health Nodes (Integrated Registry) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-semibold tracking-tight">Active Nodes</h3>
        </div>
        <DeviceHealthGrid />
      </div>

      {/* Security Activity - Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-semibold tracking-tight">Security Intelligence</h3>
        </div>
        <RecentAuditFeed />
      </div>
    </div>
  );
}
