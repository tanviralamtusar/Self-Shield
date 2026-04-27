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
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground mt-1">
          Monitor your devices and maintain your digital discipline.
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary fill-primary" />
          <h3 className="text-lg font-semibold tracking-tight">Quick Actions</h3>
        </div>
        <QuickActions />
      </section>

      <StatCards />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <DeviceStatusTable />
          <div className="grid gap-6 md:grid-cols-2">
            <CategoryDistribution />
            <SystemHealth />
          </div>
          <RecentAuditFeed />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <ThreatAnalysis />
          {/* We can add more side panels here later */}
        </div>
      </div>
    </div>
  );
}
