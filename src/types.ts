export interface Channel {
  username: string;
  avatar: string;
  banner: string | null;
  bio: string | null;
  followers: number;
  live: boolean;
  viewers: number;
  title: string | null;
  last_stream: string | null;
  socials: {
    twitter: string | null;
    instagram: string | null;
    youtube: string | null;
    discord: string | null;
    tiktok: string | null;
    facebook: string | null;
  };
  error?: boolean;
  isLoading: boolean;
}

export interface StatData {
  id: string;
  label: string;
  value: string;
  numericValue: number;
  goal?: string;
  numericGoal?: number;
}

export interface CreditPerson {
  role: string;
  name: string;
  avatar: string;
  socials: {
    platform: string;
    url: string;
    color: string;
    icon: any;
    username?: string;
  }[];
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  color: string;
  icon: any;
}
