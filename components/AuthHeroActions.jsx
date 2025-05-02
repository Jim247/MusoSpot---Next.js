"use client"
import { useUserProfile } from './UserProfileContext';

export default function AuthHeroActions() {
  const { user } = useUserProfile();

  if (user) {
    return (
      <div className="flex justify-center gap-4">
        <a href="/dashboard" className="btn-primary">
          Go to Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-4">
      <a href="/signup" className="btn-primary">
        Sign up
      </a>
    </div>
  );
}