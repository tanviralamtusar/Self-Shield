'use client';

import { useMemo, useState, useEffect } from 'react';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppRules } from '@/hooks/useAppRules';
import { useDevices } from '@/hooks/useDevices';

export function CategoryDistribution() {
  const [mounted, setMounted] = useState(false);
  const { data: devices } = useDevices();
  const { data: appRules } = useAppRules(devices?.[0]?.id || '');

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = useMemo(() => {
    // In a real app, we'd aggregate across all devices
    const categories = [
      { subject: 'Social', A: 120, fullMark: 150 },
      { subject: 'Gaming', A: 98, fullMark: 150 },
      { subject: 'Video', A: 86, fullMark: 150 },
      { subject: 'News', A: 45, fullMark: 150 },
      { subject: 'Dating', A: 30, fullMark: 150 },
      { subject: 'Productivity', A: 20, fullMark: 150 },
    ];
    return categories;
  }, []);

  return (
    <Card className="h-full border border-border/50 bg-card/30 backdrop-blur-sm">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-semibold">Protection Focus</CardTitle>
        <CardDescription className="text-[11px]">Intensity of blocking across content categories.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] w-full">
        {!mounted ? (
          <div className="h-full w-full bg-muted/5 animate-pulse rounded-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} style={{ outline: 'none' }}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data} style={{ outline: 'none' }} tabIndex={-1}>
              <PolarGrid strokeOpacity={0.1} />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.5 }} />
              <Radar
                name="Blocking Intensity"
                dataKey="A"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.4}
                animationDuration={500}
                activeDot={false}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
