import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Profile {
  username: string;
  name: string;
  profilePhoto?: string;
  website?: string;
  bio?: string;
  email?: string;
  phone?: string;
  gender?: string;
  followers?: number;
  following?: number;
}

interface ProfileContextType {
  profile: Profile;
  updateProfile: (profile: Partial<Profile>) => void;
}

const defaultProfile: Profile = {
  username: '',
  name: '',
};

const ProfileContext = createContext<ProfileContextType>({
  profile: defaultProfile,
  updateProfile: () => {},
});

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const updateProfile = (updates: Partial<Profile>) => setProfile((p) => ({ ...p, ...updates }));
  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}; 