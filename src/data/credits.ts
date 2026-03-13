import { CreditPerson } from '../types';
import { FaXTwitter, FaDiscord } from 'react-icons/fa6';

export const creditsData: CreditPerson[] = [
  {
    role: 'المؤسس',
    name: 'POWR UPDATES',
    avatar: 'https://i.postimg.cc/mgqrqxng/IMG-9107.jpg',
    socials: [
      {
        platform: 'X',
        url: 'https://x.com/powrupdates?s=21',
        color: '#1DA1F2',
        icon: FaXTwitter
      }
    ]
  },
  {
    role: 'المطوّر',
    name: 'Mohammed',
    avatar: 'https://i.postimg.cc/Rq5kfRpV/IMG-4848.jpg',
    socials: [
      {
        platform: 'X',
        url: 'https://x.com/i_mohammedqht?s=21',
        color: '#1DA1F2',
        icon: FaXTwitter
      },
      {
        platform: 'Discord',
        url: '#',
        username: '221.k',
        color: '#5865F2',
        icon: FaDiscord
      }
    ]
  }
];
