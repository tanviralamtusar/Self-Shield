import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export type DailyReport = {
  id: string;
  device_id: string;
  report_date: string;
  total_screen_sec: number;
  blocks_triggered: number;
  keywords_blocked: number;
  top_apps: any;
  top_blocked_sites: any;
  focus_sessions_count: number;
  focus_total_min: number;
  created_at: string;
};

export function useReports(deviceId?: string, days = 7) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['reports', deviceId, days],
    staleTime: 60000, // Reports don't change often, keep for 1 min
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      let query = supabase
        .from('daily_reports')
        .select('*, devices(device_name)')
        .gte('report_date', startDate.toISOString().split('T')[0]);
      
      if (deviceId) {
        query = query.eq('device_id', deviceId);
      }

      const { data, error } = await query.order('report_date', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as (DailyReport & { devices: { device_name: string } })[];
    },
  });
}

export function useReportStats(deviceId?: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['report-stats', deviceId],
    staleTime: 30000, // Stats can be cached for 30s
    queryFn: async () => {
      let reportsQuery = supabase
        .from('daily_reports')
        .select('total_screen_sec, blocks_triggered');
      
      if (deviceId) {
        reportsQuery = reportsQuery.eq('device_id', deviceId);
      }

      const { data: reports, error: reportsError } = await reportsQuery;

      let devicesQuery = supabase
        .from('devices')
        .select('*', { count: 'exact', head: true });
      
      if (deviceId) {
        devicesQuery = devicesQuery.eq('id', deviceId);
      }

      const { count: deviceCount, error: deviceError } = await devicesQuery;

      const { data: recentEvents, error: eventsError } = await supabase
        .from('usage_events')
        .select('event_type')
        .eq('event_type', 'block_triggered');

      if (reportsError || deviceError || eventsError) {
        throw new Error('Failed to fetch stats');
      }

      const totalBlocks = reports?.reduce((acc, r) => acc + (r.blocks_triggered || 0), 0) || 0;
      const totalScreenTimeSec = reports?.reduce((acc, r) => acc + (r.total_screen_sec || 0), 0) || 0;
      const avgScreenTimeMin = reports && reports.length > 0 
        ? Math.round((totalScreenTimeSec / reports.length) / 60) 
        : 0;

      return {
        totalBlocks,
        avgScreenTimeMin,
        deviceCount: deviceCount || 0,
        overrideRate: 12, // Mock for now as we don't have enough data for a real rate
      };
    },
  });
}
