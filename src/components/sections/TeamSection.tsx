import { motion } from 'motion/react';
import { Container } from '../layout/Container';
import { SectionTitle } from '../ui/SectionTitle';
import { FaXTwitter, FaCrown, FaStar, FaPenNib, FaHandshake } from 'react-icons/fa6';
import { TimelineSection } from '../layout/TimelineSection';

const teamMembers = [
  {
    name: 'الرئيس',
    role: 'الرئيس',
    username: '@powr_sxb9',
    url: 'https://x.com/powr_sxb9',
    avatar: 'https://i.postimg.cc/k5pdF4C1/IMG-9113.jpg',
    icon: FaCrown,
    color: 'text-yellow-500'
  },
  {
    name: 'المؤسس',
    role: 'المؤسس',
    username: '@TU36Y',
    url: 'https://x.com/TU36Y',
    avatar: 'https://i.postimg.cc/43STbdZs/IMG_9114.jpg',
    icon: FaStar,
    color: 'text-red-500'
  },
  {
    name: 'المصمم',
    role: 'فريق المصممين',
    username: '@3Z__DESING',
    url: 'https://x.com/3Z__DESING',
    avatar: 'https://i.postimg.cc/0NBqdQxx/IMG_9115.jpg',
    icon: FaPenNib,
    color: 'text-blue-400'
  },
  {
    name: 'المصمم',
    role: 'فريق المصممين',
    username: '@b3sv1',
    url: 'https://x.com/b3sv1',
    avatar: 'https://i.postimg.cc/Xvz0cJ3Y/IMG_9116.jpg',
    icon: FaPenNib,
    color: 'text-blue-400'
  },
  {
    name: 'المساهم',
    role: 'المساهم',
    username: '@XMehdixxx',
    url: 'https://x.com/XMehdixxx',
    avatar: 'https://i.postimg.cc/bJSf6hNG/IMG_9117.jpg',
    icon: FaHandshake,
    color: 'text-green-500'
  },
  {
    name: 'HS9N',
    role: 'محرر',
    username: '@hs9nn',
    url: 'https://x.com/hs9nn?s=21',
    avatar: 'https://i.postimg.cc/W43p3Lxz/IMG-9341.jpg',
    icon: FaPenNib,
    color: 'text-purple-500'
  }
];

export function TeamSection() {
  return (
    <TimelineSection className="bg-black/40 border-y border-white/5">
      <Container>
        <SectionTitle 
          title="فريق العمل" 
          subtitle="الأشخاص الذين يقفون خلف نجاح حساب POWR UPDATES" 
        />
        
        <motion.div 
          className="flex flex-wrap justify-center gap-8 mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          {teamMembers.map((member, index) => (
            <motion.a
              key={index}
              href={member.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }
              }}
              className="group relative flex flex-col items-center w-44 md:w-56 bg-gradient-to-b from-white/10 to-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/15 hover:border-red-500/50 transition-all duration-300 shadow-2xl hover:shadow-[0_10px_50px_-10px_rgba(220,38,38,0.3)] backdrop-blur-sm"
            >
              {/* Role Badge */}
              <div className="absolute -top-4 bg-black/80 border border-white/10 px-3 py-1 rounded-full flex items-center gap-2 shadow-lg z-10">
                <div className={`${member.color} text-sm`}>
                  <member.icon />
                </div>
                <span className="text-xs font-bold text-gray-200">{member.role}</span>
              </div>

              {/* Avatar */}
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-red-500/50 transition-colors duration-300 mb-4 mt-2">
                <img 
                  src={member.avatar} 
                  alt={member.username} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col items-center text-center w-full">
                <span className="text-lg font-bold text-white mb-1">
                  {member.name}
                </span>
                <span className="text-sm text-gray-400 group-hover:text-[#1DA1F2] transition-colors duration-300 truncate w-full" dir="ltr">
                  {member.username}
                </span>
                <div className="mt-4 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#1DA1F2]/20 transition-colors duration-300 border border-white/10 group-hover:border-[#1DA1F2]/30">
                  <div className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] group-hover:text-[#1DA1F2] group-hover:drop-shadow-[0_0_8px_rgba(29,161,242,0.6)] transition-all duration-300 text-[16px]">
                    <FaXTwitter />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </Container>
    </TimelineSection>
  );
}
