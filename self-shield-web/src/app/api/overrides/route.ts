import { supabaseAdmin } from '@/lib/supabase/admin';
import { apiSuccess, apiError, requireAuth, isAuthError } from '@/lib/api-helpers';
import { sendFcmMessage } from '@/lib/firebase';

// POST /api/overrides — child device requests override
export async function POST(request: Request) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;

  const { device_id, reason } = await request.json();
  const { data, error } = await supabaseAdmin
    .from('override_requests')
    .insert({ device_id, reason }).select().single();

  if (error) return apiError('DB_ERROR', 'Failed to create override', 500);
  return apiSuccess(data, 201);
}

// GET /api/overrides — admin gets pending override requests
export async function GET(request: Request) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;
  if (auth.role !== 'admin') return apiError('FORBIDDEN', 'Admin required', 403);

  const { data, error } = await supabaseAdmin
    .from('override_requests')
    .select('*, devices!inner(device_name, admin_id)')
    .eq('devices.admin_id', auth.userId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) return apiError('DB_ERROR', 'Failed to fetch overrides', 500);
  return apiSuccess(data);
}
