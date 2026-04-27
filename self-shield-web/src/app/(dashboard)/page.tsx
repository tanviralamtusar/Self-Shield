'use client';

import { StatCards } from '@/components/dashboard/StatCards';
import { DeviceStatusTable } from '@/components/dashboard/DeviceStatusTable';
import { RecentAuditFeed } from '@/components/dashboard/RecentAuditFeed';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { CategoryDistribution } from '@/components/dashboard/CategoryDistribution';
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="md:col-span-1 lg:col-span-5">
          <DeviceStatusTable />
        </div>
        <div className="md:col-span-1 lg:col-span-2">
          <CategoryDistribution />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-7">
          <RecentAuditFeed />
        </div>
      </div>
    </div>
  );
}
