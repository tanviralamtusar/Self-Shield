import { supabaseAdmin } from '@/lib/supabase/admin';
import { apiSuccess, apiError, requireAuth, isAuthError } from '@/lib/api-helpers';

// GET /api/reports?deviceId=xxx&type=daily|weekly&date=YYYY-MM-DD&start=YYYY-MM-DD
export async function GET(request: Request) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;
  if (auth.role !== 'admin') return apiError('FORBIDDEN', 'Admin required', 403);

  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get('deviceId');
  const type = searchParams.get('type') || 'daily';

  if (!deviceId) return apiError('VALIDATION_ERROR', 'deviceId required', 422);

  if (type === 'daily') {
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const { data, error } = await supabaseAdmin
      .from('daily_reports').select('*')
      .eq('device_id', deviceId).eq('report_date', date).single();
    if (error || !data) return apiError('NOT_FOUND', 'No report for this date', 404);
    return apiSuccess(data);
  }

  if (type === 'weekly') {
    const start = searchParams.get('start');
    if (!start) return apiError('VALIDATION_ERROR', 'start param required for weekly', 422);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const { data, error } = await supabaseAdmin
      .from('daily_reports').select('*')
      .eq('device_id', deviceId)
      .gte('report_date', start).lt('report_date', end.toISOString().split('T')[0])
      .order('report_date', { ascending: true });
    if (error) return apiError('DB_ERROR', 'Failed to fetch reports', 500);
    return apiSuccess(data);
  }

  return apiError('VALIDATION_ERROR', 'type must be daily or weekly', 422);
}
