import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // Get user from cookies
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('[Register] Auth error:', authError?.message || 'No user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const deviceName = body.deviceName || 'Browser Extension';

    console.log(`[Register] Creating device for user: ${user.id}, name: ${deviceName}`);

    // 1. Create the device record using Admin client (bypass RLS)
    const { data: device, error: deviceError } = await supabaseAdmin
      .from('devices')
      .insert({
        owner_id: user.id,
        admin_id: user.id,
        device_name: deviceName,
        is_admin_active: true,
        last_seen_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (deviceError) {
      console.error('[Register] Device creation error:', deviceError);
      return NextResponse.json({ error: deviceError.message }, { status: 500 });
    }

    console.log(`[Register] Device created: ${device.id}`);

    // 2. Create the settings record
    const { error: settingsError } = await supabaseAdmin
      .from('device_settings')
      .insert({
        device_id: device.id,
        vpn_enabled: true,
        accessibility_enabled: true,
        keyword_blocking: true,
      });

    if (settingsError) {
      console.error('[Register] Settings creation error:', settingsError);
    } else {
      console.log(`[Register] Settings created for device: ${device.id}`);
    }

    return NextResponse.json({ deviceId: device.id });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Register] Unexpected error:', message);
    return NextResponse.json({ error: 'Internal server error: ' + message }, { status: 500 });
  }
}
