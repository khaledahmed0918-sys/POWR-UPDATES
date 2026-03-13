export interface StatData {
  id: string;
  label: string;
  value: string;
  numericValue?: number;
  isPercentage?: boolean;
  goal?: string;
  numericGoal?: number;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  color: string;
  icon: React.ElementType;
}

export interface CreditPerson {
  role: string;
  name: string;
  avatar: string;
  socials?: {
    platform: string;
    url: string;
    username?: string;
    color: string;
    icon: React.ElementType;
  }[];
}
