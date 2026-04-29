import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const deviceId = searchParams.get('deviceId');
  const urlToCheck = searchParams.get('url');

  if (!deviceId || !urlToCheck) {
    const res = NextResponse.json({ error: 'Device ID and URL required' }, { status: 400 });
    res.headers.set('Access-Control-Allow-Origin', '*');
    return res;
  }

  try {
    // 1. Normalize hostname
    let hostname = urlToCheck;
    try {
      if (urlToCheck.includes('://')) {
        hostname = new URL(urlToCheck).hostname;
      } else {
        hostname = new URL(`http://${urlToCheck}`).hostname;
      }
    } catch (e) {
      // Use original if URL parsing fails
    }
    hostname = hostname.toLowerCase().replace(/^www\./, '');

    // 2. Fetch device settings to see if protection is enabled
    const { data: settings } = await supabaseAdmin
      .from('device_settings')
      .select('vpn_enabled, safe_search_enabled, server_side_check_enabled')
      .eq('device_id', deviceId)
      .single();

    if (!settings || !settings.vpn_enabled || !settings.server_side_check_enabled) {
      const res = NextResponse.json({ blocked: false });
      res.headers.set('Access-Control-Allow-Origin', '*');
      return res;
    }

    // 3. Check against all active blocklists for this device
    // This includes subscribed lists and system default lists if safe search is on
    const { data: subs } = await supabaseAdmin
      .from('device_block_list_subscriptions')
      .select('block_list_id')
      .eq('device_id', deviceId)
      .eq('is_enabled', true);

    const activeListIds = (subs || []).map(s => s.block_list_id);

    // Add system lists if safe search is enabled
    if (settings.safe_search_enabled) {
      const { data: systemLists } = await supabaseAdmin
        .from('block_lists')
        .select('id')
        .eq('is_default', true)
        .in('category', ['porn', 'gambling']); // Added gambling as well
      
      if (systemLists) {
        systemLists.forEach(l => {
          if (!activeListIds.includes(l.id)) activeListIds.push(l.id);
        });
      }
    }

    if (activeListIds.length > 0) {
      // Check if hostname matches any entry in these lists
      // We check for both exact match and subdomain matches
      const { data: matches, error } = await supabaseAdmin
        .from('block_list_entries')
        .select('value, block_lists(name)')
        .in('block_list_id', activeListIds)
        .or(`value.eq.${hostname},value.eq.www.${hostname},value.ilike.%.${hostname}`)
        .limit(1);

      if (matches && matches.length > 0) {
        const res = NextResponse.json({ 
          blocked: true, 
          reason: `Matched blocklist: ${matches[0].block_lists?.name || 'Restricted Site'}` 
        });
        res.headers.set('Access-Control-Allow-Origin', '*');
        return res;
      }
    }

    const res = NextResponse.json({ blocked: false });
    res.headers.set('Access-Control-Allow-Origin', '*');
    return res;

  } catch (error) {
    console.error('[CheckURL] Error:', error);
    const res = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    res.headers.set('Access-Control-Allow-Origin', '*');
    return res;
  }
}
