import { supabaseAdmin } from '@/lib/supabase/admin';
import { apiSuccess, apiError, requireAuth, isAuthError } from '@/lib/api-helpers';

// GET /api/devices — list all devices for admin
export async function GET(request: Request) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;
  if (auth.role !== 'admin') return apiError('FORBIDDEN', 'Admin access required', 403);

  const { data, error } = await supabaseAdmin
    .from('devices')
    .select('*')
    .eq('admin_id', auth.userId)
    .order('created_at', { ascending: false });

  if (error) return apiError('DB_ERROR', 'Failed to fetch devices', 500);
  return apiSuccess(data);
}

// POST /api/devices — pair a new device
export async function POST(request: Request) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;

  const body = await request.json();
  const { pairing_code } = body;

  if (!pairing_code || pairing_code.length !== 6) {
    return apiError('VALIDATION_ERROR', 'Pairing code must be 6 digits', 422);
  }

  const { data: device, error } = await supabaseAdmin
    .from('devices')
    .select('*')
    .eq('pairing_code', pairing_code)
    .single();

  if (error || !device) return apiError('INVALID_CODE', 'Invalid or expired pairing code', 400);

  const { data: updated, error: updateErr } = await supabaseAdmin
    .from('devices')
    .update({ admin_id: auth.userId, pairing_code: null })
    .eq('id', device.id)
    .select()
    .single();

  if (updateErr) return apiError('DB_ERROR', 'Failed to pair device', 500);
  return apiSuccess(updated, 201);
}
