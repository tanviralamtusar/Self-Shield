import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export type UsageEvent = {
  id: number;
  device_id: string;
  event_type: string;
  target: string | null;
  duration_sec: number | null;
  occurred_at: string;
  synced_at: string;
};

export function useActivityLog(deviceId: string, days = 3) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['activity-log', deviceId, days],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('usage_events')
        .select('*')
        .eq('device_id', deviceId)
        .gte('occurred_at', startDate.toISOString())
        .order('occurred_at', { ascending: false })
        .limit(500);

      if (error) {
        throw new Error(error.message);
      }

      return data as UsageEvent[];
    },
    refetchInterval: 30000, // Auto-refresh every 30s while tab is open
  });
}
