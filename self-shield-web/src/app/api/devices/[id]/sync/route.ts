import { supabaseAdmin } from '@/lib/supabase/admin';
import { apiSuccess, apiError, requireAuth, isAuthError } from '@/lib/api-helpers';

// POST /api/devices/[id]/sync — receive sync payload from device
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(supabaseAdmin, request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  const { usage_events, audit_events, device_info } = await request.json();

  // Update device last_seen + info
  await supabaseAdmin
    .from('devices')
    .update({
      last_seen_at: new Date().toISOString(),
      android_version: device_info?.android_version,
      app_version: device_info?.app_version,
      is_device_owner: device_info?.is_device_owner,
    })
    .eq('id', id);

  // Batch insert usage events
  if (usage_events?.length > 0) {
    await supabaseAdmin.from('usage_events').insert(
      usage_events.map((e: Record<string, unknown>) => ({ ...e, device_id: id }))
    );
  }

  // Batch insert audit events
  if (audit_events?.length > 0) {
    await supabaseAdmin.from('audit_log').insert(
      audit_events.map((e: Record<string, unknown>) => ({ ...e, device_id: id }))
    );
  }

  return apiSuccess({ synced: true });
}
