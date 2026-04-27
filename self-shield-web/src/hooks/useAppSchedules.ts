import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export type AppSchedule = {
  id: string;
  app_rule_id: string;
  day_of_week: number[];
  start_time: string;
  end_time: string;
  created_at: string;
};

export function useAppSchedules(appRuleId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['app-schedules', appRuleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_schedules')
        .select('*')
        .eq('app_rule_id', appRuleId);

      if (error) {
        throw new Error(error.message);
      }

      return data as AppSchedule[];
    },
    enabled: !!appRuleId,
  });
}

export function useUpsertAppSchedule() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (schedule: Partial<AppSchedule> & { app_rule_id: string }) => {
      const { data, error } = await supabase
        .from('app_schedules')
        .upsert(schedule)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['app-schedules', data.app_rule_id] });
    },
  });
}

export function useDeleteAppSchedule() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, appRuleId }: { id: string; appRuleId: string }) => {
      const { error } = await supabase
        .from('app_schedules')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['app-schedules', variables.appRuleId] });
    },
  });
}
