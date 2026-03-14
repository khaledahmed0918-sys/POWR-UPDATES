import { motion } from 'motion/react';
import { Container } from '../layout/Container';
import { SectionTitle } from '../ui/SectionTitle';
import { TimelineSection } from '../layout/TimelineSection';

const tournaments = [
  { name: 'الكينقز ليق', icon: '👑' },
  { name: 'كاس العالم ببجي', icon: '🏆' },
  { name: 'دوري صناع المحتوى', icon: '❤️' },
  { name: 'الدوري السعودي للرياضات الالكترونية', icon: '🏆' }
];

export function TournamentsSection() {
  return (
    <TimelineSection className="overflow-hidden">
      {/* Background Image - Masked to perfectly reveal the site's global background gradient */}
      <div 
        className="absolute inset-0 z-0 w-full h-full pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
        }}
      >
        <img 
          src="https://i.postimg.cc/xC729ZhY/IMG-9111.jpg" 
          alt="Tournaments Background" 
          className="w-full h-full object-cover object-top opacity-30"
          fetchPriority="high"
          loading="eager"
        />
        {/* Overall subtle darkening to ensure text readability */}
        <div className="absolute inset-0 bg-[#1A0505]/40" />
      </div>
      
      <Container className="relative z-10 py-24">
        <SectionTitle 
          title="البـطـولات اللي غـطيناها خلال هذا العام" 
          subtitle="تغطية حصرية لأبرز الأحداث والبطولات المحلية والعالمية" 
        />
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {tournaments.map((tournament, index) => (
            <motion.div
              key={tournament.name}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="group relative flex items-center justify-between p-8 rounded-2xl bg-[#1A0505]/80 border border-white/5 hover:bg-[#1A0505] hover:border-red-900/50 transition-all duration-300 overflow-hidden shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-900/0 via-red-900/0 to-red-900/10 group-hover:from-red-900/20 transition-all duration-500" />
              
              <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-red-400 transition-colors duration-300 relative z-10">
                {tournament.name}
              </h3>
              <span className="text-4xl relative z-10 group-hover:scale-110 transition-transform duration-300">
                {tournament.icon}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </TimelineSection>
  );
}
