import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Use environment variables — NEVER hardcode secrets
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkDevice() {
  const deviceId = process.argv[2] || '';
  
  if (!deviceId) {
    console.error('Usage: npx tsx scratch/check-device-state.ts <deviceId>');
    process.exit(1);
  }

  console.log(`Checking device: ${deviceId}`);
  
  const { data: device, error: deviceError } = await supabaseAdmin
    .from('devices')
    .select('*')
    .eq('id', deviceId)
    .single();

  if (deviceError) {
    console.log('Device not found in "devices" table:', deviceError.message);
  } else {
    console.log('Device found:', device);
  }

  const { data: settings, error: settingsError } = await supabaseAdmin
    .from('device_settings')
    .select('*')
    .eq('device_id', deviceId)
    .single();

  if (settingsError) {
    console.log('Settings not found in "device_settings" table:', settingsError.message);
  } else {
    console.log('Settings found:', settings);
  }
}

checkDevice();
