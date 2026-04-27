import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export type OverrideRequest = {
  id: string;
  device_id: string;
  reason: string | null;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  approved_by: string | null;
  duration_min: number;
  expires_at: string | null;
  created_at: string;
  resolved_at: string | null;
};

export function useOverrideRequests() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['override-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('override_requests')
        .select('*, devices(device_name)')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as (OverrideRequest & { devices: { device_name: string } })[];
    },
  });
}

export function useResolveOverride() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, adminId }: { id: string; status: 'approved' | 'denied'; adminId: string }) => {
      const { data, error } = await supabase
        .from('override_requests')
        .update({ 
          status, 
          approved_by: adminId,
          resolved_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // If approved, we should also send a remote command to the device
      if (status === 'approved') {
        await supabase.from('remote_commands').insert({
          device_id: data.device_id,
          command_type: 'approve_override',
          payload: { request_id: id, duration_min: data.duration_min },
          status: 'pending'
        });
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['override-requests'] });
    },
  });
}
