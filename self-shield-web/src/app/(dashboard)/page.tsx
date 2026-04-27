import { StatCards } from '@/components/dashboard/StatCards';
import { DeviceStatusTable } from '@/components/dashboard/DeviceStatusTable';
import { RecentAuditFeed } from '@/components/dashboard/RecentAuditFeed';

export default function DashboardOverview() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground mt-1">
          Monitor your devices and maintain your digital discipline.
        </p>
      </div>

      <StatCards />

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-4 lg:col-span-5">
          <DeviceStatusTable />
        </div>
        <div className="md:col-span-3 lg:col-span-2">
          <RecentAuditFeed />
        </div>
      </div>
    </div>
  );
}
