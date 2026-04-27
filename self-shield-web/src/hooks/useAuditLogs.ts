import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export type AuditLogEntry = {
  id: string;
  device_id: string;
  event_type: string;
  details: any;
  screenshot_url: string | null;
  occurred_at: string;
  synced_at: string;
};

export function useAuditLogs(deviceId?: string, limit = 50) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['audit-logs', deviceId, limit],
    queryFn: async () => {
      let query = supabase
        .from('audit_log')
        .select('*, devices(device_name)');
      
      if (deviceId) {
        query = query.eq('device_id', deviceId);
      }

      const { data, error } = await query
        .order('occurred_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(error.message);
      }

      return data as (AuditLogEntry & { devices: { device_name: string } })[];
    },
  });
}
