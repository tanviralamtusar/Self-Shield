import { supabaseAdmin } from '@/lib/supabase/admin';
import { apiSuccess, apiError, requireAuth, isAuthError } from '@/lib/api-helpers';

// GET /api/devices/[id] — get single device
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from('devices')
    .select('*')
    .eq('id', id)
    .eq('admin_id', auth.userId)
    .single();

  if (error || !data) return apiError('NOT_FOUND', 'Device not found', 404);
  return apiSuccess(data);
}

// PATCH /api/devices/[id] — update device settings
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;
  if (auth.role !== 'admin') return apiError('FORBIDDEN', 'Admin required', 403);

  const { id } = await params;
  const body = await request.json();

  // Upsert device_settings
  const { data, error } = await supabaseAdmin
    .from('device_settings')
    .upsert({ device_id: id, ...body, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) return apiError('DB_ERROR', 'Failed to update settings', 500);
  return apiSuccess(data);
}

// DELETE /api/devices/[id] — unlink device
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;
  if (auth.role !== 'admin') return apiError('FORBIDDEN', 'Admin required', 403);

  const { id } = await params;
  const { error } = await supabaseAdmin
    .from('devices')
    .delete()
    .eq('id', id)
    .eq('admin_id', auth.userId);

  if (error) return apiError('DB_ERROR', 'Failed to delete device', 500);
  return apiSuccess({ deleted: true });
}
