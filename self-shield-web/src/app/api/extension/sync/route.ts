import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const deviceId = searchParams.get('deviceId');

  if (!deviceId) {
    return NextResponse.json({ error: 'Device ID required' }, { status: 400 });
  }

  try {
    // 0. Update device metadata + last seen
    const status = searchParams.get('status');
    const lastSeenValue = status === 'offline' ? '1970-01-01T00:00:00Z' : new Date().toISOString();

    if (status === 'offline') {
      console.log(`[Extension Sync] Marking device ${deviceId} as OFFLINE`);
    }

    // Browser info from extension (sent on every sync)
    const browserName = searchParams.get('browserName');
    const browserVersion = searchParams.get('browserVersion');
    const osName = searchParams.get('osName');
    const osVersion = searchParams.get('osVersion');
    const extVersion = searchParams.get('extVersion');

    // Get pairing flag
    const isPairing = searchParams.get('isPairing') === 'true';

    const updatePayload: Record<string, unknown> = {
      last_seen_at: lastSeenValue,
    };

    // ONLY re-activate if this is an explicit pairing request
    if (isPairing) {
      updatePayload.is_admin_active = true;
    }

    // Only update browser info if provided (extension sync sends these)
    if (browserName) {
      updatePayload.device_name = `${browserName} Extension`;
      updatePayload.browser_name = browserName;
      updatePayload.browser_version = browserVersion || null;
      updatePayload.os_name = osName || null;
      updatePayload.os_version = osVersion || null;
      updatePayload.device_type = 'browser_extension';
      if (extVersion) updatePayload.app_version = extVersion;
    }

    await supabaseAdmin
      .from('devices')
      .update(updatePayload)
      .eq('id', deviceId);

    // Cleanup: delete usage events older than 3 days (fire-and-forget)
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    supabaseAdmin
      .from('usage_events')
      .delete()
      .eq('device_id', deviceId)
      .lt('occurred_at', threeDaysAgo)
      .then(({ error }) => {
        if (error) console.error('[Sync] Cleanup error:', error.message);
      });

    if (status === 'offline') {
      return NextResponse.json({ success: true, message: 'Device marked offline' });
    }

    // 1. Fetch device and settings
    const { data: device, error: deviceError } = await supabaseAdmin
      .from('devices')
      .select('is_admin_active')
      .eq('id', deviceId)
      .single();

    if (deviceError || !device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    if (!device.is_admin_active && !isPairing) {
      return NextResponse.json({ error: 'Device unpaired' }, { status: 404 });
    }

    let { data: settings, error: settingsError } = await supabaseAdmin
      .from('device_settings')
      .select('*')
      .eq('device_id', deviceId)
      .single();

    // If settings don't exist, create them
    if (settingsError || !settings) {
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
        return NextResponse.json({ error: 'Failed to initialize settings' }, { status: 500 });
      }
      settings = newSettings;
    }

    if (!settings) {
      console.error(`[Extension Sync] Failed to initialize settings for ${deviceId}`);
      return NextResponse.json({ error: 'Failed to initialize settings' }, { status: 500 });
    }

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deviceId } = body;

    if (!deviceId) {
      return NextResponse.json({ error: 'Device ID required' }, { status: 400 });
    }

    // Support batched events (new) and single event (backward compat)
    const events: Array<{ eventType: string; target: string; occurredAt?: string; durationSec?: number }> = [];

    if (Array.isArray(body.events) && body.events.length > 0) {
      events.push(...body.events);
    } else if (body.eventType && body.target) {
      events.push({
        eventType: body.eventType,
        target: body.target,
        occurredAt: body.occurredAt,
      });
    }

    if (events.length === 0) {
      return NextResponse.json({ error: 'No events provided' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('usage_events')
      .insert(
        events.map(e => ({
          device_id: deviceId,
          event_type: e.eventType,
          target: e.target,
          duration_sec: e.durationSec ?? null,
          occurred_at: e.occurredAt || new Date().toISOString()
        }))
      );

    if (error) {
      console.error('Error logging usage events:', error);
      return NextResponse.json({ error: 'Failed to log events' }, { status: 500 });
    }

    const response = NextResponse.json({ success: true, count: events.length });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Extension event error:', msg);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

