import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import React from 'react';

export function TamperAlertListener() {
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel('audit-log-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'audit_log',
        },
        async (payload) => {
          const event = payload.new;
          
          // Only notify for high-severity events
          const highSeverityEvents = [
            'uninstall_attempt',
            'adb_detected',
            'vpn_killed',
            'factory_reset_attempt'
          ];

          if (highSeverityEvents.includes(event.event_type)) {
            // Fetch device name for the alert
            const { data: device } = await supabase
              .from('devices')
              .select('device_name')
              .eq('id', event.device_id)
              .single();

            toast.error(`TAMPER ALERT: ${device?.device_name || 'Device'}`, {
              description: event.event_type.replace(/_/g, ' '),
              duration: 10000,
              icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return null;
}
