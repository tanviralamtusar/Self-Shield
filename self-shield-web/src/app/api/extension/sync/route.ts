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
    const res = NextResponse.json({ error: 'Device ID required' }, { status: 400 });
    res.headers.set('Access-Control-Allow-Origin', '*');
    return res;
  }

  try {
    const isPairing = searchParams.get('isPairing') === 'true';
    const status = searchParams.get('status');
    const lastSeenValue = status === 'offline' ? '1970-01-01T00:00:00Z' : new Date().toISOString();

    // Browser info from extension
    const browserName = searchParams.get('browserName');
    const browserVersion = searchParams.get('browserVersion');
    const osName = searchParams.get('osName');
    const osVersion = searchParams.get('osVersion');
    const extVersion = searchParams.get('extVersion');

    const updatePayload: Record<string, unknown> = {
      last_seen_at: lastSeenValue,
    };

    if (isPairing) {
      updatePayload.is_admin_active = true;
    }

    if (browserName) {
      updatePayload.device_name = `${browserName} Extension`;
      updatePayload.browser_name = browserName;
      updatePayload.browser_version = browserVersion || null;
      updatePayload.os_name = osName || null;
      updatePayload.os_version = osVersion || null;
      updatePayload.device_type = 'browser_extension';
      if (extVersion) updatePayload.app_version = extVersion;
    }

    // 1. Update and fetch current status in one go
    const { data: device, error: updateError } = await supabaseAdmin
      .from('devices')
      .update(updatePayload)
      .eq('id', deviceId)
      .select('is_admin_active')
      .single();

    if (updateError || !device) {
      console.log(`[Sync] Device ${deviceId} update failed:`, updateError?.message);
      const res = NextResponse.json({ error: 'Device not found' }, { status: 404 });
      res.headers.set('Access-Control-Allow-Origin', '*');
      return res;
    }

    // Check if device is unpaired and we're not trying to re-pair it
    if (!device.is_admin_active && !isPairing) {
      console.log(`[Sync] Device ${deviceId} is inactive. Returning 404 for heartbeat.`);
      const res = NextResponse.json({ error: 'Device unpaired' }, { status: 404 });
      res.headers.set('Access-Control-Allow-Origin', '*');
      return res;
    }

    if (status === 'offline') {
      const res = NextResponse.json({ success: true, message: 'Device marked offline' });
      res.headers.set('Access-Control-Allow-Origin', '*');
      return res;
    }

    // 2. Fetch device settings
    let { data: settings, error: settingsError } = await supabaseAdmin
      .from('device_settings')
      .select('*')
      .eq('device_id', deviceId)
      .single();

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
        const res = NextResponse.json({ error: 'Failed to initialize settings' }, { status: 500 });
        res.headers.set('Access-Control-Allow-Origin', '*');
        return res;
      }
      settings = newSettings;
    }

    // 3. Fetch subscribed blocklists
    const { data: subs, error: subsError } = await supabaseAdmin
      .from('device_block_list_subscriptions')
      .select('block_list_id')
      .eq('device_id', deviceId)
      .eq('is_enabled', true);

    let blocked_urls: string[] = [];
    let blocked_keywords: string[] = [];

    const activeListIds = (subs || []).map(s => s.block_list_id);

    // 4. Add System Safe Search lists if enabled
    if (settings.safe_search_enabled) {
      const { data: systemLists } = await supabaseAdmin
        .from('block_lists')
        .select('id')
        .eq('is_default', true)
        .eq('category', 'porn');
      
      if (systemLists) {
        systemLists.forEach(l => {
          if (!activeListIds.includes(l.id)) activeListIds.push(l.id);
        });
      }
    }

    if (activeListIds.length > 0) {
      const { data: entries, error: entriesError } = await supabaseAdmin
        .from('block_list_entries')
        .select('value, block_lists(type)')
        .in('block_list_id', activeListIds);

      if (!entriesError && entries) {
        entries.forEach((e: any) => {
          if (e.block_lists?.type === 'keyword') {
            blocked_keywords.push(e.value);
          } else {
            blocked_urls.push(e.value);
          }
        });
      }
    }

    const response = NextResponse.json({
      is_enabled: settings.vpn_enabled,
      safe_search_enabled: settings.safe_search_enabled === true,
      blocked_urls: [...new Set(blocked_urls)],
      blocked_keywords: [...new Set(blocked_keywords)]
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
    const res = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    res.headers.set('Access-Control-Allow-Origin', '*');
    return res;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deviceId } = body;

    if (!deviceId) {
      const res = NextResponse.json({ error: 'Device ID required' }, { status: 400 });
      res.headers.set('Access-Control-Allow-Origin', '*');
      return res;
    }

    const events: Array<{ eventType: string; target: string; occurredAt?: string; durationSec?: number }> = [];
    if (Array.isArray(body.events)) {
      events.push(...body.events);
    } else if (body.eventType && body.target) {
      events.push({
        eventType: body.eventType,
        target: body.target,
        occurredAt: body.occurredAt,
      });
    }

    if (events.length > 0) {
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
      }
    }

    const response = NextResponse.json({ success: true });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;

  } catch (error: unknown) {
    console.error('Extension event error:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}
