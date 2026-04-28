import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    // Use the project's existing server auth helper
    const supabase = await createServerSupabase();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('[Register] Auth error:', authError?.message || 'No user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const deviceName = body.deviceName || 'Browser Extension';

    console.log(`[Register] Creating device for user: ${user.id}, name: ${deviceName}`);

    // Use Admin client to bypass RLS
    const { data: device, error: deviceError } = await supabaseAdmin
      .from('devices')
      .insert({
        owner_id: user.id,
        admin_id: user.id,
        device_name: deviceName,
        is_admin_active: true,
        last_seen_at: null,
      })
      .select()
      .single();

    if (deviceError) {
      console.error('[Register] Device creation error:', deviceError);
      return NextResponse.json({ error: deviceError.message }, { status: 500 });
    }

    console.log(`[Register] Device created: ${device.id}`);

    // Create settings
    const { error: settingsError } = await supabaseAdmin
      .from('device_settings')
      .insert({
        device_id: device.id,
        vpn_enabled: true,
        accessibility_enabled: true,
        keyword_blocking: true,
      });

    if (settingsError) {
      console.error('[Register] Settings error:', settingsError);
    }

    return NextResponse.json({ deviceId: device.id });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Register] Error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
