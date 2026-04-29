import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { supabaseAdmin } from '../src/lib/supabase/admin';

async function activateDevice() {
  const deviceId = '1f852832-e47b-4340-8f30-b7720fa77539';
  
  console.log(`Activating device: ${deviceId}`);
  
  // Upsert settings
  const { data, error } = await supabaseAdmin
    .from('device_settings')
    .upsert({
      device_id: deviceId,
      vpn_enabled: true,
      accessibility_enabled: true,
      keyword_blocking: true,
      updated_at: new Date().toISOString()
    })
    .select();

  if (error) {
    console.error('Error activating device:', error);
  } else {
    console.log('Device activated successfully:', data);
  }
}

activateDevice();
