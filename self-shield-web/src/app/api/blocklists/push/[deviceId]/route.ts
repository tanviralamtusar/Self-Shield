import { supabaseAdmin } from '@/lib/supabase/admin';
import { apiSuccess, apiError, requireAuth, isAuthError } from '@/lib/api-helpers';
import { sendFcmMessage } from '@/lib/firebase';

// POST /api/blocklists/push/[deviceId] — push updated blocklists to device
export async function POST(
  request: Request,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;
  if (auth.role !== 'admin') return apiError('FORBIDDEN', 'Admin required', 403);

  const { deviceId } = await params;
  const { list_ids } = await request.json();

  const { data: device } = await supabaseAdmin
    .from('devices')
    .select('fcm_token')
    .eq('id', deviceId)
    .eq('admin_id', auth.userId)
    .single();

  if (!device?.fcm_token) {
    return apiError('NOT_FOUND', 'Device not found or no FCM token', 404);
  }

  const { data: command, error } = await supabaseAdmin
    .from('remote_commands')
    .insert({
      device_id: deviceId,
      command_type: 'push_blocklist',
      payload: { list_ids },
    })
    .select()
    .single();

  if (error || !command) return apiError('DB_ERROR', 'Failed to create command', 500);

  await sendFcmMessage(device.fcm_token, {
    command_id: command.id,
    type: 'push_blocklist',
    payload: JSON.stringify({ list_ids }),
  });

  return apiSuccess({ command_id: command.id, status: 'sent' });
}
