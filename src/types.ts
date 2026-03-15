export interface Channel {
  username: string;
  display_name: string;
  profile_pic: string;
  is_live: boolean;
  live_title: string | null;
  viewer_count: number | null;
  live_since: string | null;
  last_stream_start_time: string | null;
  live_url: string;
  profile_url: string;
  error?: boolean;
  last_checked_at: string;
  bio: string | null;
  followers_count: number | null;
  banner_image: string | null;
  live_category: string | null;
  social_links: { [key: string]: string };
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
