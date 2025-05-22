import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';


// Set your Supabase URL and service role key (never expose service role key in client code)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Mock events to seed
const dummyPosts = [
  {
    id: 'post1',
    poster_id: 'user1',
    postcode: 'GL1 1DG',
    geo_point: {
      lat: 51.8642,
      lng: -2.238,
    },
    date: '2024-02-01',
    instruments_needed: ['Violin'],
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
      console.log(`Created post: ${post.id}`);
    }
  }
}

seedEvents()
  .then(() => console.log('Seeding posts complete!'))
  .catch(console.error);