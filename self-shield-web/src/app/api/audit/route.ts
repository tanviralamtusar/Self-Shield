import { supabaseAdmin } from '@/lib/supabase/admin';
import { apiSuccess, apiError, requireAuth, isAuthError } from '@/lib/api-helpers';

// POST /api/audit — batch insert audit events from device
export async function POST(request: Request) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;

  const { device_id, events } = await request.json();
  if (!device_id || !events?.length) {
    return apiError('VALIDATION_ERROR', 'device_id and events required', 422);
  }

  const rows = events.map((e: Record<string, unknown>) => ({ ...e, device_id }));
  const { error } = await supabaseAdmin.from('audit_log').insert(rows);

  if (error) return apiError('DB_ERROR', 'Failed to insert audit events', 500);
  return apiSuccess({ inserted: rows.length }, 201);
}

// GET /api/audit?deviceId=xxx&type=xxx&limit=50&offset=0
export async function GET(request: Request) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;
  if (auth.role !== 'admin') return apiError('FORBIDDEN', 'Admin required', 403);

  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get('deviceId');
  if (!deviceId) return apiError('VALIDATION_ERROR', 'deviceId required', 422);

  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = supabaseAdmin.from('audit_log').select('*').eq('device_id', deviceId);
  const eventType = searchParams.get('type');
  if (eventType) query = query.eq('event_type', eventType);

  const { data, error } = await query
    .order('occurred_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return apiError('DB_ERROR', 'Failed to fetch audit log', 500);
  return apiSuccess(data);
}
