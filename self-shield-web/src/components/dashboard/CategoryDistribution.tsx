import { useMemo } from 'react';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppRules } from '@/hooks/useAppRules';
import { useDevices } from '@/hooks/useDevices';

export function CategoryDistribution() {
  const { data: devices } = useDevices();
  const { data: appRules, isLoading } = useAppRules(devices?.[0]?.id || ''); // Just for demo, use first device

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
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Protection Focus</CardTitle>
        <CardDescription>Intensity of blocking across different content categories.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid strokeOpacity={0.1} />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.5 }} />
              <Radar
                name="Blocking Intensity"
                dataKey="A"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
