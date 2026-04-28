'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Globe, Monitor, Laptop, Tablet, LayoutGrid } from 'lucide-react';
import { useDevices, Device } from '@/hooks/useDevices';
import { DeviceCard } from '@/components/devices/DeviceCard';
import { PairDeviceModal } from '@/components/devices/PairDeviceModal';
import { ConnectExtensionModal } from '@/components/devices/ConnectExtensionModal';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

export default function DevicesPage() {
  const { data: devices, isLoading, error } = useDevices();

  const categorizedDevices = useMemo(() => {
    if (!devices) return null;

    // First, sort all devices by creation date (Ascending - oldest first)
    const sortedDevices = [...devices].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // Map devices to include their global sequential index
    const devicesWithIndex = sortedDevices.map((d, index) => ({
      ...d,
      globalIndex: index + 1
    }));

    const groups: {
      extensions: (Device & { globalIndex: number })[];
      mobiles: Record<string, (Device & { globalIndex: number })[]>;
      computers: Record<string, (Device & { globalIndex: number })[]>;
    } = {
      extensions: [],
      mobiles: {},
      computers: {},
    };

    devicesWithIndex.forEach((device) => {
      const name = device.device_name.toLowerCase();
      
      // Extension Check
      if (name.includes('extension') || name.includes('browser') || name.includes('chrome') || name.includes('firefox') || name.includes('safari')) {
        groups.extensions.push(device);
      } 
      // Computer Check
      else if (name.includes('windows') || name.includes('pc') || name.includes('laptop') || name.includes('desktop') || name.includes('mac') || name.includes('linux')) {
        let os = 'Unknown OS';
        if (name.includes('windows')) os = 'Windows';
        else if (name.includes('mac')) os = 'macOS';
        else if (name.includes('linux')) os = 'Linux';
        
        if (!groups.computers[os]) groups.computers[os] = [];
        groups.computers[os].push(device);
      } 
      // Mobile Check (Default)
      else {
        let os = 'Android';
        if (name.includes('ios') || name.includes('iphone')) os = 'iOS';
        
        if (!groups.mobiles[os]) groups.mobiles[os] = [];
        groups.mobiles[os].push(device);
      }
    });

    return groups;
  }, [devices]);

  const renderSectionHeader = (title: string, Icon: any, count: number) => (
    <div className="flex items-center gap-2 mb-4 mt-8 first:mt-0">
      <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-lg font-bold tracking-tight">{title}</h3>
      <span className="text-xs font-medium bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{count}</span>
    </div>
  );

  return (
    <div className="pb-20">
      {/* Full-Width Sticky Header Bar with Blur */}
      <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-row justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h2 className="text-xl font-black tracking-tight leading-none">Devices</h2>
              <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-widest hidden md:block">
                Network Management
              </p>
            </div>
            <div className="h-6 w-px bg-border/40 hidden md:block mx-1" />
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/5 border border-primary/10">
              <LayoutGrid className="w-3 h-3 text-primary/60" />
              <span className="text-[10px] font-bold text-primary/70 uppercase tracking-tight">
                {devices?.length || 0} Nodes
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ConnectExtensionModal />
            <PairDeviceModal />
          </div>
        </div>
      </div>

      {/* Main Content Container - Balanced for full-page layout */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-card/50 shadow-sm h-64 p-6 space-y-4 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center text-destructive border-dashed bg-destructive/5">
          <p className="font-bold">Access Denied or Error</p>
          <p className="text-sm opacity-80 mt-1">{error.message}</p>
        </Card>
      ) : !devices || devices.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed bg-muted/20">
          <div className="p-4 bg-primary/10 text-primary rounded-2xl mb-4">
            <LayoutGrid className="w-8 h-8" />
          </div>
          <p className="text-xl font-bold">No Active Nodes</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs">
            Link your browser extensions or Android devices to start monitoring.
          </p>
        </Card>
      ) : (
        <div className="space-y-12">
          {/* Extensions Section */}
          {categorizedDevices?.extensions.length! > 0 && (
            <div>
              {renderSectionHeader('Browser Extensions', Globe, categorizedDevices!.extensions.length)}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categorizedDevices!.extensions.map(device => (
                  <DeviceCard key={device.id} device={device} index={device.globalIndex} />
                ))}
              </div>
            </div>
          )}

          {Object.entries(categorizedDevices?.mobiles || {}).map(([os, devs]) => (
            <div key={os}>
              {renderSectionHeader(`${os} Devices`, Smartphone, devs.length)}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {devs.map(device => (
                  <DeviceCard key={device.id} device={device} index={device.globalIndex} />
                ))}
              </div>
            </div>
          ))}

          {Object.entries(categorizedDevices?.computers || {}).map(([os, devs]) => (
            <div key={os}>
              {renderSectionHeader(`${os} Workstations`, Monitor, devs.length)}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {devs.map(device => (
                  <DeviceCard key={device.id} device={device} index={device.globalIndex} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
