'use client';

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
  // Browser extension fields
  browser_name: string | null;
  browser_version: string | null;
  os_name: string | null;
  os_version: string | null;
  device_type: 'android' | 'browser_extension' | 'ios' | null;
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
          console.log('[Realtime] Devices table changed, re-fetching...');
          queryClient.refetchQueries({ queryKey: ['devices'] });
        }
      )
      .subscribe((status) => {
        console.log(`[Realtime] Subscription status: ${status}`);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, queryClient]);

  return useQuery({
    queryKey: ['devices'],
    refetchInterval: 3000, // Faster polling as a fallback
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

