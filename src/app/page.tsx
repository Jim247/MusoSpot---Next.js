import { UserProfileProvider } from '@components/UserProfileContext';
import Hero from '@components/widgets/Hero';
import AuthHeroActions from '@components/AuthHeroActions';
import { IconUserPlus, IconId, IconSearch, IconCheck } from '@tabler/icons-react'; // Import Tabler Icons
import Steps from '@components/widgets/Steps';
import WidgetWrapper from '@components/widgets/WidgetWrapper';
import FAQs from '@components/widgets/FAQs';

export default function Home() {
  return (
    <>
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
              icon: IconUserPlus, 
            },
            {
              title: 'Step 2: Create Profile',
              description:
                'Fill out your profile with your skills, experience, and a promo video. This helps potential clients understand your expertise and book you for gigs.',
              icon: IconId, 
            },
            {
              title: 'Step 3: Find Gigs',
              description:
                'When relevant gigs are posted, apply for them. If the poster likes your profile, they will reach out to you directly.',
              icon: IconSearch, 
            },
            {
              title: 'Step 4: Perform & Gain Reviews',
              description:
              'Deliver a great performance and build your reputation. Get booked again as your profile grows!',
              icon: IconCheck, 
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
      <WidgetWrapper>
        <FAQs
          title="Frequently Asked Questions"
          subtitle="Dive into the following questions to gain insights into the powerful features that AstroWind offers and how it can elevate your web development journey."
          tagline="FAQs"
          classes={{ container: 'max-w-6xl' }}
          items={[
            {
              question: 'What is MusoSpot?',
              answer:
                'MusoSpot is a platform designed for professional musicians to showcase their skills, find gigs, and connect with event organizers and bands looking for talent.',
            },
            {
              question: 'Who can use MusoSpot?',
              answer:
                'MusoSpot is for any musician looking to find work, whether you are a solo artist, a band leader, or a session musician. Event organizers can also use the platform to find and book musicians.',
            },
            {
              question: 'Is it free to create a profile?',
              answer:
                'Yes, creating and maintaining a basic profile on MusoSpot is completely free. This includes the ability to showcase your skills, experience, and upload a promo video.',
            },
            {
              question: 'How do I get gigs through MusoSpot?',
              answer:
                'When event organizers or bands post gig opportunities, you can apply directly through the platform. If they`re interested, they will contact you through our messaging system to discuss details.',
            },
            {
              question: 'What should I include in my profile?',
              answer:
                'Your profile can include your musical skills, years of experience,  a professional photo, and ideally a short video showcasing your talent. The more complete your profile, the better your chances of getting noticed.',
            },
            {
              question: 'How does the booking process work?',
              answer:
                'Once you apply for a gig, the organizer can view your profile and contact you through our platform. All initial communications and agreements happen through MusoSpot for security and transparency.',
            },
            {
              question: 'How do reviews and ratings work?',
              answer:
                'After completing a gig, clients can leave reviews and ratings on your profile. This helps build your reputation and increases your chances of getting future bookings.',
            },
          ]}
        />
      </WidgetWrapper>
            </UserProfileProvider>
    </>
  );
}
