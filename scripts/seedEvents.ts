import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Set your Supabase URL and service role key (never expose service role key in client code)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Mock events to seed
const dummyPosts = [
  {
    id: uuidv4(),
    poster_id: uuidv4(),
    postcode: 'GL1 1DG',
    geopoint: {
      type: 'Point',
      coordinates: [-2.238, 51.8642], // GeoJSON uses [longitude, latitude] order
    },
    event_date: '2024-02-01',
    event_type: 'private',
    instruments_needed: ['Guitar'],
    budget: 300,
    status: 'open',
    created_at: new Date().toISOString(),
  },
];

async function seedEvents() {
  for (const post of dummyPosts) {
    // Insert event into the "events" table
    const { error } = await supabase.from('events').insert([post]);
    if (error) {
      console.error('Error inserting post:', error);
    } else {
      console.log(`Created post: ${post.event_id}`);
    }
  }
}

seedEvents()
  .then(() => console.log('Seeding posts complete!'))
  .catch(console.error);
