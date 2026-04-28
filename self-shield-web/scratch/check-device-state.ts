import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://nkadwmptdzjsmwuujcid.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rYWR3bXB0ZHpqc213dXVqY2lkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAyMjg5NywiZXhwIjoyMDkyNTk4ODk3fQ.TAKRuxzV7IeI7T3ku2DSPhT3VU7ad1P7IAHyvgaspn4";

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkDevice() {
  const deviceId = '3d20181d-fecd-4594-9ba4-4a37c522f31f';
  
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
