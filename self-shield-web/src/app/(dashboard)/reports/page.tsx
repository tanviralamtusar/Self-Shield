'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsageChart } from '@/components/reports/UsageChart';
import { Smartphone, Clock, ShieldAlert, History } from 'lucide-react';
import { useReports, useReportStats } from '@/hooks/useReports';
import { WeeklyReportPreview } from '@/components/reports/WeeklyReportPreview';
import { format, parseISO } from 'date-fns';

export default function ReportsPage() {
  const { data: reports, isLoading: reportsLoading } = useReports(undefined, 7);
  const { data: stats, isLoading: statsLoading } = useReportStats();

  // Process data for the chart
  const chartData = reports?.map(report => ({
    name: format(parseISO(report.report_date), 'EEE'),
    usage: Math.round(report.total_screen_sec / 60)
  })) || [];

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
        <p className="text-muted-foreground mt-1">
          View usage patterns and screen time across your devices.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Avg</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : formatDuration(stats?.avgScreenTimeMin || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devices</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : stats?.deviceCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blocks</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : stats?.totalBlocks.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Override Rate</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : `${stats?.overrideRate}%`}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Screen Time Overview</CardTitle>
            <CardDescription>Daily usage across all devices for the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <UsageChart data={chartData} loading={reportsLoading} />
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <WeeklyReportPreview />
        </div>
      </div>
    </div>
  );
}

