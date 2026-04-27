import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export type Device = {
  id: string;
  device_name: string;
  android_version: number | null;
  app_version: string | null;
  is_device_owner: boolean;
  is_admin_active: boolean;
  last_seen_at: string | null;
  created_at: string;
};

export function useDevices() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      
      return data as Device[];
    },
  });
}
