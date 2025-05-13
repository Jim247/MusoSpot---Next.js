import { UserProfileProvider } from '@components/UserProfileContext';
import Hero from '@components/widgets/Hero';
import AuthHeroActions from '@components/AuthHeroActions';

export default function Home() {
  return (
    <UserProfileProvider>
      <Hero
        image={{ src: '/assets/images/hero-image.jpg', alt: 'Find-a-Muso Hero Image' }}
        title="MusoSpot"
        subtitle={
          <span className="hidden sm:inline">
            <span>Built by professional musicians.</span>
            <br className="hidden md:inline" />
            <span>
              Showcase your talent, gain work, and manage your reputation as a musician.
            </span>
          </span>
        }
        actions={<AuthHeroActions />}
      />
    </UserProfileProvider>
  );
}