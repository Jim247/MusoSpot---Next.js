import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Set your Supabase URL and service role key (never expose service role key in client code)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Dummy users to seed
const dummyUsers = [
  {
    id: uuidv4(),
    first_name: 'James',
    last_name: 'Burgess',
    username: 'jburgess',
    email: 'jay249@hotmail.co.uk',
    phone: '07700900000',
    postcode: 'BS20 0LH',
    search_radius: 25,
    geopoint: {
      type: 'Point',
      coordinates: [-2.238, 51.8642], // GeoJSON [lng, lat]
    },
    ward: 'Portishead',
    region: 'South West',
    instruments: ['Guitar'],
    role: 'musician',
    country: 'England',
    bio: 'The OG',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=LlFVXa36FWalmdaO',
    slug: 'james-burgess-123',
    pa_system: true,
    lighting: true,
    transport: true,
    years_experience: 5,
  },
  {
    id: uuidv4(),
    first_name: 'Alex',
    last_name: 'Agent',
    username: 'agent',
    email: 'agent@agency.com',
    phone: '07700900001',
    postcode: 'BS1 4DJ',
    search_radius: 50,
    geopoint: {
      type: 'Point',
      coordinates: [-2.5879, 51.4545],
    },
    ward: 'Bristol Central',
    region: 'South West',
    instruments: [],
    role: 'agent',
    country: 'England',
    bio: 'I am an agent looking for talented musicians to fill gigs across the South West.',
    video: '',
    slug: 'alex-agent-001',
    pa_system: false,
    lighting: false,
    transport: true,
    years_experience: 10,
    agency_name: 'South West Talent',
    city: 'Bristol',
  },
];

async function seedUsers() {
  for (const user of dummyUsers) {
    const { error } = await supabase.from('users').insert([user]);
    if (error) {
      console.error('Error inserting user:', user.email, error);
    } else {
      console.log(`Created user: ${user.first_name} ${user.last_name}`);
    }
  }
}

seedUsers()
  .then(() => console.log('Seeding users complete!'))
  .catch(console.error);
