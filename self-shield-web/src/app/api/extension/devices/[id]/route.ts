import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createServerSupabase } from '@/lib/supabase/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    console.log(`[Device Unpair] User ${user.id} unpairing device ${id}`);

    // Update the device to clear active session data using admin client
    const { error } = await supabaseAdmin
      .from('devices')
      .update({ 
        last_seen_at: null,
        is_admin_active: false 
      })
      .eq('id', id);

    if (error) {
      console.error('[Device Unpair] Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`[Device Unpair] Device ${id} unpaired successfully`);
    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Device Unpair] Error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    console.log(`[Device Delete] User ${user.id} deleting device ${id}`);

    // Delete settings first (foreign key)
    await supabaseAdmin
      .from('device_settings')
      .delete()
      .eq('device_id', id);

    // Delete the device using admin client (bypasses RLS)
    const { error } = await supabaseAdmin
      .from('devices')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Device Delete] Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`[Device Delete] Device ${id} deleted successfully`);
    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Device Delete] Error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
