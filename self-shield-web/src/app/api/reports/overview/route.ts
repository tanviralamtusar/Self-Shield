import { supabaseAdmin } from '@/lib/supabase/admin';
import { apiSuccess, apiError, requireAuth, isAuthError } from '@/lib/api-helpers';

// GET /api/reports/overview — admin's dashboard overview (all devices, today's stats)
export async function GET(request: Request) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;
  if (auth.role !== 'admin') return apiError('FORBIDDEN', 'Admin required', 403);

  const today = new Date().toISOString().split('T')[0];

  const { data: devices } = await supabaseAdmin
    .from('devices')
    .select('id, device_name, last_seen_at')
    .eq('admin_id', auth.userId);

  const deviceIds = (devices || []).map(d => d.id);

  const { data: todayReports } = await supabaseAdmin
    .from('daily_reports')
    .select('*')
    .eq('report_date', today)
    .in('device_id', deviceIds.length ? deviceIds : ['none']);

  const { data: pendingOverrides } = await supabaseAdmin
    .from('override_requests')
    .select('id, device_id, reason, created_at')
    .in('device_id', deviceIds.length ? deviceIds : ['none'])
    .eq('status', 'pending');

  return apiSuccess({
    devices: devices || [],
    reports: todayReports || [],
    pending_overrides: pendingOverrides || [],
  });
}
