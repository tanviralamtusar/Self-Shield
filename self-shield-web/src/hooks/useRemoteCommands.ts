'use client';

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

import { toast } from 'sonner';

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

      if (error) throw new Error(error.message);
      return data;
    },
    onMutate: async (newCommand) => {
      await queryClient.cancelQueries({ queryKey: ['remote-commands', newCommand.deviceId] });
      const previousCommands = queryClient.getQueryData(['remote-commands', newCommand.deviceId]);

      queryClient.setQueryData(['remote-commands', newCommand.deviceId], (old: any) => [
        {
          id: Math.random().toString(),
          device_id: newCommand.deviceId,
          command_type: newCommand.commandType,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
        ...(old || [])
      ]);

      toast.info(`Sending ${newCommand.commandType.replace(/_/g, ' ')}...`);
      return { previousCommands };
    },
    onError: (err, newCommand, context) => {
      queryClient.setQueryData(['remote-commands', newCommand.deviceId], context?.previousCommands);
      toast.error('Failed to send command');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['remote-commands', data.device_id] });
      toast.success('Command sent');
    },
  });
}

