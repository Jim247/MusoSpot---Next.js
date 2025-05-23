import { UserProfileProvider } from './UserProfileContext';

export default function WithUserProfileProvider({ children }) {
  return <UserProfileProvider>{children}</UserProfileProvider>;
}
