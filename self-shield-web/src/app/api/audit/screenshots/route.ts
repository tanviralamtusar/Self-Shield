import { supabaseAdmin } from '@/lib/supabase/admin';
import { apiSuccess, apiError, requireAuth, isAuthError } from '@/lib/api-helpers';

// GET /api/audit/screenshots?deviceId=xxx
export async function GET(request: Request) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;
  if (auth.role !== 'admin') return apiError('FORBIDDEN', 'Admin required', 403);

  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get('deviceId');
  if (!deviceId) return apiError('VALIDATION_ERROR', 'deviceId required', 422);

  const { data, error } = await supabaseAdmin
    .from('audit_log')
    .select('id, event_type, screenshot_url, occurred_at')
    .eq('device_id', deviceId)
    .not('screenshot_url', 'is', null)
    .order('occurred_at', { ascending: false })
    .limit(50);

  if (error) return apiError('DB_ERROR', 'Failed to fetch screenshots', 500);
  return apiSuccess(data);
}
