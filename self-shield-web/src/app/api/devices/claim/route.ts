import { supabaseAdmin } from '@/lib/supabase/admin';
import { apiSuccess, apiError } from '@/lib/api-helpers';

// POST /api/devices/claim — Claim a pending device with pairing code
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pairing_code, fcm_token, device_name, os_version, model } = body;

    if (!pairing_code) {
      return apiError('VALIDATION_ERROR', 'pairing_code is required', 422);
    }

    // Find the device with this pairing code
    const { data: device, error } = await supabaseAdmin
      .from('devices')
      .select('*')
      .eq('pairing_code', pairing_code)
      .eq('status', 'pending')
      .single();

    if (error || !device) {
      return apiError('INVALID_CODE', 'Invalid or expired pairing code', 400);
    }

    // Update the device with FCM token and info
    const { data: updated, error: updateErr } = await supabaseAdmin
      .from('devices')
      .update({
        fcm_token: fcm_token,
        device_name: device_name || device.device_name,
        os_version: os_version || device.os_version,
        model: model || device.model,
        status: 'online',
        pairing_code: null, // Clear the code after successful claim
        last_seen_at: new Date().toISOString()
      })
      .eq('id', device.id)
      .select()
      .single();

    if (updateErr) {
      console.error('Claim Error:', updateErr);
      return apiError('DB_ERROR', 'Failed to claim device', 500);
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
