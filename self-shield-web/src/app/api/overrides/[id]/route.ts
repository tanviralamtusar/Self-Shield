import { supabaseAdmin } from '@/lib/supabase/admin';
import { apiSuccess, apiError, requireAuth, isAuthError } from '@/lib/api-helpers';
import { sendFcmMessage } from '@/lib/firebase';

// GET /api/overrides/[id] — poll status
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from('override_requests')
    .select('status, duration_min, expires_at')
    .eq('id', id).single();

  if (error || !data) return apiError('NOT_FOUND', 'Override not found', 404);
  return apiSuccess(data);
}

// PATCH /api/overrides/[id] — approve or deny
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;
  if (auth.role !== 'admin') return apiError('FORBIDDEN', 'Admin required', 403);

  const { id } = await params;
  const { action, duration_min = 15 } = await request.json();

  if (action === 'approve') {
    const expiresAt = new Date(Date.now() + duration_min * 60 * 1000);
    const { data, error } = await supabaseAdmin
      .from('override_requests')
      .update({
        status: 'approved', approved_by: auth.userId,
        duration_min, expires_at: expiresAt.toISOString(),
        resolved_at: new Date().toISOString(),
      })
      .eq('id', id).select('*, devices!inner(fcm_token)').single();

    if (error || !data) return apiError('NOT_FOUND', 'Override not found', 404);

    // Send FCM command
    const fcmToken = (data as any).devices?.fcm_token;
    if (fcmToken) {
      const { data: cmd } = await supabaseAdmin.from('remote_commands').insert({
        device_id: data.device_id, command_type: 'approve_override',
        payload: { duration_min, expires_at: expiresAt.toISOString() },
      }).select().single();
      if (cmd) await sendFcmMessage(fcmToken, {
        command_id: cmd.id, type: 'approve_override',
        payload: JSON.stringify({ duration_min, expires_at: expiresAt.toISOString() }),
      });
    }
    return apiSuccess(data);
  }

  if (action === 'deny') {
    const { data, error } = await supabaseAdmin
      .from('override_requests')
      .update({ status: 'denied', approved_by: auth.userId, resolved_at: new Date().toISOString() })
      .eq('id', id).select().single();
    if (error || !data) return apiError('NOT_FOUND', 'Override not found', 404);
    return apiSuccess(data);
  }

  return apiError('VALIDATION_ERROR', 'action must be approve or deny', 422);
}
