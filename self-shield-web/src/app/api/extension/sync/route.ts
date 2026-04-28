import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const deviceId = searchParams.get('deviceId');

  console.log(`[Extension Sync] Request for deviceId: ${deviceId}`);

  if (!deviceId) {
    console.error('[Extension Sync] Missing deviceId');
    return NextResponse.json({ error: 'Device ID required' }, { status: 400 });
  }

  try {
    // 1. Fetch device settings
    let { data: settings, error: settingsError } = await supabaseAdmin
      .from('device_settings')
      .select('*')
      .eq('device_id', deviceId)
      .single();

    // If settings don't exist, let's try to find the device first
    if (settingsError || !settings) {
      console.log(`[Extension Sync] Settings not found for ${deviceId}, checking device existence...`);
      const { data: device, error: deviceError } = await supabaseAdmin
        .from('devices')
        .select('*')
        .eq('id', deviceId)
        .single();

      if (device) {
        // Device exists but settings don't. Create settings.
        const { data: newSettings, error: createError } = await supabaseAdmin
          .from('device_settings')
          .insert({
            device_id: deviceId,
            vpn_enabled: true,
            accessibility_enabled: true,
            keyword_blocking: true
          })
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating default settings:', createError);
        } else {
          settings = newSettings;
        }
      } else {
        return NextResponse.json({ error: 'Device not found. Please pair again.' }, { status: 404 });
      }
    }

    if (!settings) {
      console.error(`[Extension Sync] Failed to initialize settings for ${deviceId}`);
      return NextResponse.json({ error: 'Failed to initialize settings' }, { status: 500 });
    }

    console.log(`[Extension Sync] Settings for ${deviceId}: vpn_enabled=${settings.vpn_enabled}`);

    // 2. If vpn_enabled is false, return early (disabled)
    if (!settings.vpn_enabled) {
      return NextResponse.json({ 
        is_enabled: false, 
        blocked_urls: [] 
      });
    }

    // 3. Fetch subscribed blocklists
    const { data: subs, error: subsError } = await supabaseAdmin
      .from('device_block_list_subscriptions')
      .select('block_list_id')
      .eq('device_id', deviceId)
      .eq('is_enabled', true);

    if (subsError) {
      console.error('Subscriptions fetch error:', subsError);
      return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
    }

    const listIds = subs.map(s => s.block_list_id);

    if (listIds.length === 0) {
      return NextResponse.json({ 
        is_enabled: true, 
        blocked_urls: [] 
      });
    }

    // 4. Fetch entries for those blocklists
    const { data: entries, error: entriesError } = await supabaseAdmin
      .from('block_list_entries')
      .select('value')
      .in('block_list_id', listIds);

    if (entriesError) {
      console.error('Entries fetch error:', entriesError);
      return NextResponse.json({ error: 'Failed to fetch blocklist entries' }, { status: 500 });
    }

    const blocked_urls = [...new Set(entries.map(e => e.value))];

    const response = NextResponse.json({
      is_enabled: true,
      blocked_urls
    });

    // Add CORS and Cache headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;

  } catch (error: any) {
    console.error('Extension sync error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
