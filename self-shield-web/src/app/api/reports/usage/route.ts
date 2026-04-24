import { supabaseAdmin } from '@/lib/supabase/admin';
import { apiSuccess, apiError, requireAuth, isAuthError } from '@/lib/api-helpers';

// GET /api/reports/usage?deviceId=xxx&limit=50&offset=0
export async function GET(request: Request) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;
  if (auth.role !== 'admin') return apiError('FORBIDDEN', 'Admin required', 403);

  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get('deviceId');
  if (!deviceId) return apiError('VALIDATION_ERROR', 'deviceId required', 422);

  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  const { data, error } = await supabaseAdmin
    .from('usage_events')
    .select('*')
    .eq('device_id', deviceId)
    .order('occurred_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return apiError('DB_ERROR', 'Failed to fetch usage events', 500);
  return apiSuccess(data);
}
