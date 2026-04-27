import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

  useEffect(() => {
    const channelId = `devices-live-${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'devices' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['devices'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, queryClient]);

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

