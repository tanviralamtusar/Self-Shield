import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export type RemoteCommand = {
  id: string;
  device_id: string;
  command_type: 'push_blocklist' | 'reset_pin' | 'approve_override' | 'update_app_rules' | 'sync_request' | 'lock_device';
  payload: any;
  status: 'pending' | 'delivered' | 'executed' | 'failed';
  created_at: string;
  executed_at: string | null;
};

export function useSendCommand() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ deviceId, commandType, payload }: { deviceId: string; commandType: string; payload?: any }) => {
      const { data, error } = await supabase
        .from('remote_commands')
        .insert({
          device_id: deviceId,
          command_type: commandType,
          payload: payload || {},
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      // We could invalidate some queries here if needed, 
      // but usually we just want to know it was sent.
      queryClient.invalidateQueries({ queryKey: ['remote-commands', data.device_id] });
    },
  });
}
