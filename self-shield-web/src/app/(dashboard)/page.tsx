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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-br from-card/80 to-card border border-primary/10 shadow-sm backdrop-blur-md">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Command Center</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              System Live • v2.4.0 • Distributed Network
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:flex flex-col items-end px-4 border-r border-border/50">
                <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-tighter">Sync Status</span>
                <span className="text-xs font-semibold text-success uppercase">Optimized</span>
             </div>
             <div className="flex flex-col items-end px-4">
                <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-tighter">Database</span>
                <span className="text-xs font-semibold uppercase">Cloud-Sync</span>
             </div>
          </div>
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
