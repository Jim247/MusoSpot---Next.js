import { UserProfileProvider } from '@components/UserProfileContext';
import Hero from '@components/widgets/Hero';
import AuthHeroActions from '@components/AuthHeroActions';
import { IconUserPlus, IconId, IconSearch, IconCheck } from '@tabler/icons-react'; // Import Tabler Icons
import Steps from '@components/widgets/Steps';
import WidgetWrapper from '@components/widgets/WidgetWrapper';

export default function Home() {
  return (
    <UserProfileProvider>

        <Hero
          image={{ src: '/assets/images/hero-image.jpg', alt: 'Find-a-Muso Hero Image' }}
          title="MusoSpot"
          subtitle={
            <span className="hidden sm:inline">
              <span>A Web Platform For Working Musicians.</span>
              <br className="hidden md:inline" />
              <span>
                Showcase your talent, gain work, and manage your reputation as a musician.
              </span>
            </span>
          }
          actions={<AuthHeroActions />}
        />

      <WidgetWrapper>
        <Steps
          title="Get your own profile page, for free, it's easy!"
          items={[
            {
              title: 'Step 1: Sign Up',
              description:
                "Create your account by providing your basic details. It's quick and easy, and you'll be ready to explore the platform in no time.",
              icon: IconUserPlus, // Pass the Tabler Icon component
            },
            {
              title: 'Step 2: Create Profile',
              description:
                'Fill out your profile with your skills, experience, and a promo video. This helps potential clients understand your expertise and book you for gigs.',
              icon: IconId, // Pass the Tabler Icon component
            },
            {
              title: 'Step 3: Find Gigs',
              description:
                'When relevant gigs are posted, apply for them. If the poster likes your profile, they will reach out to you directly.',
              icon: IconSearch, // Pass the Tabler Icon component
            },
            {
              title: 'Ready!',
              icon: IconCheck, // Pass the Tabler Icon component
            },
          ]}
          image={
            <img
              src="https://images.unsplash.com/photo-1616198814651-e71f960c3180?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
              alt="Steps image"
              className="rounded-xl shadow-md w-full h-auto object-cover"
            />
          }
        />
      </WidgetWrapper>
    </UserProfileProvider>
  );
}