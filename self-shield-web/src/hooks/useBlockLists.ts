import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export type BlockList = {
  id: string;
  owner_id: string | null;
  name: string;
  type: 'hostname' | 'app_package' | 'keyword';
  category: string | null;
  is_default: boolean;
  is_public: boolean;
  version: number;
  created_at: string;
  updated_at: string;
};

export type DeviceSubscription = {
  id: string;
  device_id: string;
  block_list_id: string;
  is_enabled: boolean;
  synced_at: string | null;
  block_lists: BlockList;
};

export function useBlockLists() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['block-lists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('block_lists')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as BlockList[];
    },
  });
}

export function useDeviceSubscriptions(deviceId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['device-subscriptions', deviceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('device_block_list_subscriptions')
        .select('*, block_lists(*)')
        .eq('device_id', deviceId);

      if (error) {
        throw new Error(error.message);
      }

      return data as DeviceSubscription[];
    },
  });
}

export function useToggleSubscription() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ deviceId, blockListId, enabled }: { deviceId: string, blockListId: string, enabled: boolean }) => {
      const { data, error } = await supabase
        .from('device_block_list_subscriptions')
        .upsert({ 
          device_id: deviceId, 
          block_list_id: blockListId, 
          is_enabled: enabled 
        }, { onConflict: 'device_id,block_list_id' })
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['device-subscriptions', variables.deviceId] });
    },
  });
}
