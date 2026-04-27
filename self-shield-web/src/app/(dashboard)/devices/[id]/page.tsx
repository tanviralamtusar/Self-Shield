'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Shield, Activity, FileText, Settings, Key } from 'lucide-react';
import { useDevices } from '@/hooks/useDevices';
import { DeviceRulesEditor } from '@/components/devices/DeviceRulesEditor';

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

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common commands for this device</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="w-4 h-4 mr-2" />
                  Update Blocklists
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="w-4 h-4 mr-2" />
                  Request Full Sync
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'rules' && (
          <DeviceRulesEditor deviceId={device.id} />
        )}

        {/* Placeholders for other tabs */}
        {['reports', 'audit', 'commands', 'settings'].includes(activeTab) && (
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
