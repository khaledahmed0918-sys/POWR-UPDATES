import { SocialLink } from '../types';
import { FaXTwitter, FaTelegram, FaInstagram } from 'react-icons/fa6';

export const socialLinks: SocialLink[] = [
  {
    id: 'x',
    name: 'X',
    url: 'https://x.com/powrupdates?s=21',
    color: '#ffffff', // White for dark mode contrast
    icon: FaXTwitter,
  },
  {
    id: 'telegram',
    name: 'Telegram',
    url: 'https://t.me/powr_updates',
    color: '#229ED9',
    icon: FaTelegram,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://www.instagram.com/powrupdates?igsh=MXN4YjFtbTJ2MWZvNA==',
    color: '#E1306C',
    icon: FaInstagram,
  },
];
