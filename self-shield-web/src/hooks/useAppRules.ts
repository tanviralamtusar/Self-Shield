import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export type AppRule = {
  id: string;
  device_id: string;
  package_name: string;
  app_name: string | null;
  is_blocked: boolean;
  is_uninstall_protected: boolean;
  inapp_block_reels: boolean;
  inapp_block_shorts: boolean;
  inapp_block_status: boolean;
  inapp_block_channels: boolean;
  inapp_block_feed: boolean;
  schedule_enabled: boolean;
  created_at: string;
  updated_at: string;
};

export function useAppRules(deviceId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['app-rules', deviceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_rules')
        .select('*')
        .eq('device_id', deviceId)
        .order('app_name', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as AppRule[];
    },
  });
}

export function useUpdateAppRule() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rule: Partial<AppRule> & { id: string }) => {
      const { data, error } = await supabase
        .from('app_rules')
        .update(rule)
        .eq('id', rule.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['app-rules', data.device_id] });
    },
  });
}
