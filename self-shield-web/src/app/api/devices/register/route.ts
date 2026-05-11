import { supabaseAdmin } from '@/lib/supabase/admin';
import { apiSuccess, apiError } from '@/lib/api-helpers';

// POST /api/devices/register — Register device and get pairing code
// This is called by the Android app on first launch
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { device_id, device_name, os_version, model } = body;

    if (!device_id) {
      return apiError('VALIDATION_ERROR', 'device_id is required', 422);
    }

    // Upsert device entry (without pairing code)
    const { data, error } = await supabaseAdmin
      .from('devices')
      .upsert({
        id: device_id,
        device_name: device_name || 'New Android Device',
        os_version: os_version || 'Android',
        model: model || 'Unknown',
        status: 'pending'
      }, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Registration Error:', error);
      return apiError('DB_ERROR', 'Failed to register device', 500);
    }

    return apiSuccess({
      status: data.status
    }, 201);
  } catch (err: unknown) {
    return apiError('INTERNAL_ERROR', (err as Error).message, 500);
  }
}
