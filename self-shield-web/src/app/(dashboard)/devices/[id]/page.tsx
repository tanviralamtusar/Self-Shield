'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Shield, Activity, FileText, Settings, Key, Clock, ShieldAlert, History, Globe } from 'lucide-react';
import { useDevices } from '@/hooks/useDevices';
import { DeviceRulesEditor } from '@/components/devices/DeviceRulesEditor';
import { AuditLogTable } from '@/components/audit/AuditLogTable';
import { ActivityLog } from '@/components/devices/ActivityLog';
import { UsageChart } from '@/components/reports/UsageChart';
import { useReports, useReportStats } from '@/hooks/useReports';
import { useSendCommand } from '@/hooks/useRemoteCommands';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

function DeviceUsageChart({ deviceId }: { deviceId: string }) {
  const { data: reports, isLoading } = useReports(deviceId, 7);
  
  const chartData = reports?.map(report => ({
    name: format(parseISO(report.report_date), 'EEE'),
    usage: Math.round(report.total_screen_sec / 60)
  })) || [];

  return <UsageChart data={chartData} loading={isLoading} />;
}

function DeviceReportStats({ deviceId }: { deviceId: string }) {
  const { data: stats, isLoading } = useReportStats(deviceId);

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Avg</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? '...' : formatDuration(stats?.avgScreenTimeMin || 0)}
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
            {isLoading ? '...' : stats?.totalBlocks.toLocaleString()}
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
            {isLoading ? '...' : `${stats?.overrideRate}%`}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QuickActions({ deviceId }: { deviceId: string }) {
  const sendCommand = useSendCommand();

  const handleCommand = async (type: string, label: string) => {
    try {
      await sendCommand.mutateAsync({ deviceId, commandType: type });
      toast.success(`${label} requested`, {
        description: 'The command has been queued for the device.'
      });
    } catch (error: any) {
      toast.error(`Failed to request ${label}`, { description: error.message });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common commands for this device</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          className="w-full justify-start" 
          variant="outline"
          disabled={sendCommand.isPending}
          onClick={() => handleCommand('push_blocklist', 'Update Blocklists')}
        >
          <Shield className="w-4 h-4 mr-2" />
          {sendCommand.isPending ? 'Sending...' : 'Update Blocklists'}
        </Button>
        <Button 
          className="w-full justify-start" 
          variant="outline"
          disabled={sendCommand.isPending}
          onClick={() => handleCommand('sync_request', 'Request Full Sync')}
        >
          <Activity className="w-4 h-4 mr-2" />
          {sendCommand.isPending ? 'Sending...' : 'Request Full Sync'}
        </Button>
        <Button 
          className="w-full justify-start text-destructive hover:text-destructive" 
          variant="outline"
          disabled={sendCommand.isPending}
          onClick={() => handleCommand('lock_device', 'Lock Device')}
        >
          <Key className="w-4 h-4 mr-2" />
          Lock Device
        </Button>
      </CardContent>
    </Card>
  );
}

export default function DeviceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: devices, isLoading } = useDevices();
  
  const device = devices?.find(d => d.id === id);
  const [activeTab, setActiveTab] = useState('summary');

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading device details...</div>;
  }

  if (!device) {
    return <div className="p-8 text-center text-destructive">Device not found.</div>;
  }

  const tabs = [
    { id: 'summary', label: 'Summary', icon: Smartphone },
    { id: 'rules', label: 'Rules', icon: Shield },
    { id: 'reports', label: 'Reports', icon: Activity },
    { id: 'activity', label: 'Activity Log', icon: Globe },
    { id: 'audit', label: 'Audit Log', icon: FileText },
    { id: 'commands', label: 'Commands', icon: Key },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{device.device_name || 'Unnamed Device'}</h2>
        <p className="text-muted-foreground mt-1">
          Android {device.android_version} • App v{device.app_version}
        </p>
      </div>

      <div className="flex border-b overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                isActive 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="pt-4">
        {activeTab === 'summary' && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Protection Status</CardTitle>
                <CardDescription>Current state of Self-Shield on this device</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border">
                  <span className="font-medium">VPN Blocker</span>
                  <span className="text-success font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border">
                  <span className="font-medium">Accessibility (In-App)</span>
                  <span className="text-success font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border">
                  <span className="font-medium">Device Owner Mode</span>
                  <span className={device.is_device_owner ? 'text-success font-medium' : 'text-warning font-medium'}>
                    {device.is_device_owner ? 'Enabled' : 'Not Enabled'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <QuickActions deviceId={device.id} />
          </div>
        )}

        {activeTab === 'rules' && (
          <DeviceRulesEditor deviceId={device.id} />
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <DeviceReportStats deviceId={device.id} />
            <Card>
              <CardHeader>
                <CardTitle>Usage History</CardTitle>
                <CardDescription>Daily screen time for this device.</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <DeviceUsageChart deviceId={device.id} />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'activity' && (
          <ActivityLog deviceId={device.id} />
        )}

        {activeTab === 'audit' && (
          <Card>
            <CardHeader>
              <CardTitle>Security Events</CardTitle>
              <CardDescription>Tamper attempts and system logs for this device.</CardDescription>
            </CardHeader>
            <CardContent>
              <AuditLogTable deviceId={device.id} />
            </CardContent>
          </Card>
        )}

        {['commands', 'settings'].includes(activeTab) && (
          <Card>
            <CardHeader>
              <CardTitle className="capitalize">{activeTab}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Content for the {activeTab} tab is under construction.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
