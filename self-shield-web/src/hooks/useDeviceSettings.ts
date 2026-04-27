import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export type DeviceSettings = {
  device_id: string;
  vpn_enabled: boolean;
  accessibility_enabled: boolean;
  keyword_blocking: boolean;
  inapp_blocking: boolean;
  focus_mode_active: boolean;
  theme: 'light' | 'dark' | 'system';
  biometric_enabled: boolean;
  updated_at: string;
};

export function useDeviceSettings(deviceId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['device-settings', deviceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('device_settings')
        .select('*')
        .eq('device_id', deviceId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw new Error(error.message);
      }

      return data as DeviceSettings | null;
    },
  });
}

export function useUpdateDeviceSettings() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<DeviceSettings> & { device_id: string }) => {
      const { data, error } = await supabase
        .from('device_settings')
        .upsert(settings)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['device-settings', data.device_id] });
    },
  });
}
