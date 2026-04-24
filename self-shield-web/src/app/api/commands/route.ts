import { supabaseAdmin } from '@/lib/supabase/admin';
import { apiSuccess, apiError, requireAuth, isAuthError } from '@/lib/api-helpers';
import { sendFcmMessage } from '@/lib/firebase';

// POST /api/commands — create a remote command
export async function POST(request: Request) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;
  if (auth.role !== 'admin') return apiError('FORBIDDEN', 'Admin required', 403);

  const { device_id, command_type, payload } = await request.json();
  if (!device_id || !command_type) {
    return apiError('VALIDATION_ERROR', 'device_id and command_type required', 422);
  }

  // Verify admin owns device
  const { data: device } = await supabaseAdmin
    .from('devices').select('id, fcm_token')
    .eq('id', device_id).eq('admin_id', auth.userId).single();
  if (!device) return apiError('NOT_FOUND', 'Device not found', 404);

  // Create command
  const { data: cmd, error } = await supabaseAdmin
    .from('remote_commands')
    .insert({ device_id, command_type, payload })
    .select().single();
  if (error || !cmd) return apiError('DB_ERROR', 'Failed to create command', 500);

  // Send FCM
  if (device.fcm_token) {
    await sendFcmMessage(device.fcm_token, {
      command_id: cmd.id, type: command_type, payload: JSON.stringify(payload || {}),
    });
    await supabaseAdmin.from('remote_commands').update({ status: 'delivered' }).eq('id', cmd.id);
  }

  return apiSuccess(cmd, 201);
}

// GET /api/commands?deviceId=xxx — poll pending commands for a device
export async function GET(request: Request) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;

  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get('deviceId');
  if (!deviceId) return apiError('VALIDATION_ERROR', 'deviceId query param required', 422);

  const { data, error } = await supabaseAdmin
    .from('remote_commands').select('*')
    .eq('device_id', deviceId).in('status', ['pending', 'delivered'])
    .order('created_at', { ascending: true });

  if (error) return apiError('DB_ERROR', 'Failed to fetch commands', 500);
  return apiSuccess(data);
}
