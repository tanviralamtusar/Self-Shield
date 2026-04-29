import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function syncUsers() {
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error('Error fetching auth users:', authError);
    return;
  }

  console.log(`Found ${authUsers.users.length} auth users. Syncing to public.users...`);

  for (const user of authUsers.users) {
    const { error } = await supabase.from('users').upsert({
      id: user.id,
      email: user.email,
      role: 'admin', // Default to admin for now
      display_name: user.email?.split('@')[0],
    });

    if (error) {
      console.error(`Error syncing user ${user.id}:`, error);
    } else {
      console.log(`Synced user: ${user.email}`);
    }
  }
}

syncUsers();
