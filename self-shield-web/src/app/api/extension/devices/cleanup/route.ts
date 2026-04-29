import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { deviceId } = await req.json();

    if (!deviceId) {
      return NextResponse.json({ error: 'Missing deviceId' }, { status: 400 });
    }

    // Only delete if the device has NEVER been seen (last_seen_at is null)
    // and belongs to the current user
    const { data: device, error: fetchError } = await supabaseAdmin
      .from('devices')
      .select('last_seen_at')
      .eq('id', deviceId)
      .eq('owner_id', user.id)
      .single();

    if (fetchError || !device) {
      return NextResponse.json({ message: 'Device not found or already deleted' });
    }

    if (device.last_seen_at === null) {
      console.log(`[Cleanup] Deleting unused phantom device: ${deviceId}`);
      await supabaseAdmin.from('devices').delete().eq('id', deviceId);
      return NextResponse.json({ success: true, deleted: true });
    }

    return NextResponse.json({ success: true, deleted: false, message: 'Device is active, keeping it.' });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
