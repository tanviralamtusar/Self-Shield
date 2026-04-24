import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load env vars
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

const listsDir = path.join(__dirname, '../../self-shield-blocklists/lists');

async function seed() {
  console.log('Seeding block lists...');

  const files = fs.readdirSync(listsDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    // Only parse the ones that fit block_lists structure
    if (['pornography.json', 'gambling.json', 'lgbtq.json', 'islamophobic.json', 'keywords.json'].includes(file)) {
      console.log(`Processing ${file}...`);
      const data = JSON.parse(fs.readFileSync(path.join(listsDir, file), 'utf-8'));

      // Insert or Update Block List
      const { data: list, error: listError } = await supabaseAdmin
        .from('block_lists')
        .upsert({
          id: data.id, // Using the deterministic ID from JSON
          name: data.name,
          type: data.type,
          is_default: true,
          is_public: true,
          version: data.version,
        }, { onConflict: 'id' })
        .select()
        .single();

      if (listError) {
        console.error(`Error inserting list ${data.name}:`, listError);
        continue;
      }

      console.log(`Inserted list: ${list.name}`);

      // Insert entries
      if (data.entries && data.entries.length > 0) {
        // Clear existing entries for this list first to avoid duplicates
        await supabaseAdmin.from('block_list_entries').delete().eq('block_list_id', list.id);

        const entryRows = data.entries.map((entry: any) => {
          if (typeof entry === 'string') {
            return {
              block_list_id: list.id,
              value: entry,
              is_regex: false,
            };
          } else {
            return {
              block_list_id: list.id,
              value: entry.value,
              is_regex: entry.is_regex || false,
            };
          }
        });

        const { error: entriesError } = await supabaseAdmin
          .from('block_list_entries')
          .insert(entryRows);

        if (entriesError) {
          console.error(`Error inserting entries for ${data.name}:`, entriesError);
        } else {
          console.log(`Inserted ${entryRows.length} entries for ${data.name}.`);
        }
      }
    }
  }

  console.log('Seeding complete.');
}

seed().catch(console.error);
