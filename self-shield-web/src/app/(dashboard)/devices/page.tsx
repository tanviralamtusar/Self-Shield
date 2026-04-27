'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';
import { useDevices } from '@/hooks/useDevices';
import { DeviceCard } from '@/components/devices/DeviceCard';
import { PairDeviceModal } from '@/components/devices/PairDeviceModal';
import { ConnectExtensionModal } from '@/components/devices/ConnectExtensionModal';
import { Skeleton } from '@/components/ui/skeleton';

export default function DevicesPage() {
  const { data: devices, isLoading, error } = useDevices();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Devices</h2>
          <p className="text-muted-foreground mt-1">
            Manage your linked devices and their protection rules.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ConnectExtensionModal />
          <PairDeviceModal />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          // Skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card text-card-foreground shadow h-56 p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          ))
        ) : error ? (
          <Card className="flex flex-col items-center justify-center p-6 text-center text-destructive h-48 border-dashed col-span-full">
            Error loading devices: {error.message}
          </Card>
        ) : devices?.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-8 text-center h-48 border-dashed col-span-full bg-muted/30">
            <div className="p-3 bg-primary/10 text-primary rounded-full mb-3">
              <Smartphone className="w-6 h-6" />
            </div>
            <p className="text-muted-foreground font-medium">No devices paired yet</p>
            <p className="text-sm text-muted-foreground mt-1">Click "Pair Device" to link an Android device</p>
          </Card>
        ) : (
          devices?.map(device => (
            <DeviceCard key={device.id} device={device} />
          ))
        )}
      </div>
    </div>
  );
}
