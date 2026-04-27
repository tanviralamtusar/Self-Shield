import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

export function OverrideNotificationListener() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const channelId = `override-requests-live-${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'override_requests',
        },
        async (payload) => {
          const request = payload.new;
          
          if (request.status === 'pending') {
            // Fetch device name
            const { data: device } = await supabase
              .from('devices')
              .select('device_name')
              .eq('id', request.device_id)
              .single();

            toast('New Override Request', {
              description: `${device?.device_name || 'A device'} is requesting ${request.duration_min} minutes of access.`,
              duration: 15000,
              icon: <Clock className="h-5 w-5 text-warning" />,
              action: {
                label: 'Review',
                onClick: () => router.push('/overrides'),
              },
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return null;
}
