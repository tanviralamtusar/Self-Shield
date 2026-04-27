'use client';

import { StatCards } from '@/components/dashboard/StatCards';
import { DeviceStatusTable } from '@/components/dashboard/DeviceStatusTable';
import { RecentAuditFeed } from '@/components/dashboard/RecentAuditFeed';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { CategoryDistribution } from '@/components/dashboard/CategoryDistribution';
import { SystemHealth } from '@/components/dashboard/SystemHealth';
import { ThreatAnalysis } from '@/components/dashboard/ThreatAnalysis';
import { Zap } from 'lucide-react';

export default function DashboardOverview() {
  return (
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">System Monitor • v2.4.0</p>
        </div>

        {/* Quick Actions & Stats Row */}
        <div className="grid gap-4 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8">
            <StatCards />
          </div>
          <div className="lg:col-span-4">
            <QuickActions />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Central Control Unit */}
          <div className="lg:col-span-8 space-y-4">
            <DeviceStatusTable />
            <div className="grid gap-4 md:grid-cols-2">
              <CategoryDistribution />
              <SystemHealth />
            </div>
            <RecentAuditFeed />
          </div>

          {/* Side Intelligence Panel */}
          <div className="lg:col-span-4">
            <ThreatAnalysis />
          </div>
        </div>
      </div>
  );
}
