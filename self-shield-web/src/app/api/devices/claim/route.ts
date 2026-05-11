import { supabaseAdmin } from '@/lib/supabase/admin';
import { apiSuccess, apiError, requireAuth, isAuthError } from '@/lib/api-helpers';

// POST /api/devices/claim — Claim a pending device with pairing code
export async function POST(request: Request) {
  try {
    // 1. Require authentication from the child device calling this
    const authResult = await requireAuth(supabaseAdmin, request);
    if (isAuthError(authResult)) return authResult;
    const { userId: ownerId } = authResult;

    const body = await request.json();
    const { pairing_code, device_id, fcm_token, device_name, os_version, model } = body;

    if (!pairing_code || !device_id) {
      return apiError('VALIDATION_ERROR', 'pairing_code and device_id are required', 422);
    }

    // 2. Find the placeholder device entry with this pairing code
    const { data: placeholder, error: findErr } = await supabaseAdmin
      .from('devices')
      .select('id, admin_id')
      .eq('pairing_code', pairing_code)
      .eq('status', 'pending')
      .single();

    if (findErr || !placeholder) {
      return apiError('INVALID_CODE', 'Invalid or expired pairing code', 400);
    }

    // 3. Link the actual device (identified by device_id) to the admin and owner
    const { data: updated, error: updateErr } = await supabaseAdmin
      .from('devices')
      .upsert({
        id: device_id,
        admin_id: placeholder.admin_id,
        owner_id: ownerId,
        fcm_token: fcm_token,
        device_name: device_name || 'Android Device',
        os_version: os_version,
        model: model,
        status: 'online',
        pairing_code: null, // Ensure this row doesn't have a pairing code
        last_seen_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select()
      .single();

    if (updateErr) {
      console.error('Claim Update Error:', updateErr);
      return apiError('DB_ERROR', 'Failed to link device to account', 500);
    }

    // 4. Clean up the placeholder row if it's different from the actual device row
    if (placeholder.id !== device_id) {
      await supabaseAdmin
        .from('devices')
        .delete()
        .eq('id', placeholder.id);
    }

    return apiSuccess({
      device_id: updated.id,
      admin_id: updated.admin_id,
      status: updated.status
    });
  } catch (err: unknown) {
    return apiError('INTERNAL_ERROR', (err as Error).message, 500);
  }
}
