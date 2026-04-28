import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { deviceName } = await req.json();

    // 1. Create the device record using Admin client (bypass RLS)
    const { data: device, error: deviceError } = await supabaseAdmin
      .from('devices')
      .insert({
        owner_id: user.id,
        admin_id: user.id,
        device_name: deviceName || 'Browser Extension',
        is_admin_active: true,
        last_seen_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (deviceError) {
      console.error('Device creation error:', deviceError);
      return NextResponse.json({ error: deviceError.message }, { status: 500 });
    }

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
      console.error('Settings creation error:', settingsError);
      // We don't fail the whole request if settings fail, but it's not ideal
    }

    return NextResponse.json({ deviceId: device.id });

  } catch (error: any) {
    console.error('Extension registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
