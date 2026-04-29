'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Cpu, MemoryStick as Memory, HardDrive, Thermometer } from 'lucide-react';
import { useState, useEffect } from 'react';

export function SystemHealth() {
  const [metrics, setMetrics] = useState({
    cpu: 12,
    memory: 45,
    storage: 28,
    temp: 42
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.max(5, Math.min(95, prev.cpu + (Math.random() * 10 - 5))),
        memory: Math.max(30, Math.min(80, prev.memory + (Math.random() * 2 - 1))),
        storage: prev.storage,
        temp: Math.max(35, Math.min(75, prev.temp + (Math.random() * 4 - 2)))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border border-border/50 bg-card/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Global Node Health</CardTitle>
        <CardDescription className="text-[11px]">Real-time performance of the protection engine.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3 text-primary" />
              <span>Engine CPU</span>
            </div>
            <span className="font-mono">{Math.round(metrics.cpu)}%</span>
          </div>
          <Progress value={metrics.cpu} className="h-1" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Memory className="w-3 h-3 text-success" />
              <span>Memory Heap</span>
            </div>
            <span className="font-mono">{Math.round(metrics.memory)}%</span>
          </div>
          <Progress value={metrics.memory} className="h-1" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Thermometer className="w-4 h-4 text-warning" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Temp</p>
              <p className="text-sm font-bold">{Math.round(metrics.temp)}°C</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <HardDrive className="w-4 h-4 text-info" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Log Size</p>
              <p className="text-sm font-bold">1.2 GB</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
