import { motion } from 'motion/react';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { FaTrophy, FaCalendarCheck } from 'react-icons/fa6';

const achievements = [
  {
    title: 'المتفاعل الأول',
    date: 'شهر 9 / 2025',
    icon: FaTrophy
  },
  {
    title: 'المتفاعل الأول',
    date: 'شهر 2 / 2026',
    icon: FaTrophy
  }
];

export function AchievementsSection() {
  return (
    <section className="w-full py-16 relative bg-black/30 border-y border-white/5">
      <Container>
        <div className="flex flex-col items-center mb-16">
          <div 
            className="flex flex-col items-center text-center"
          >
            <div 
              className="flex items-center justify-center gap-3 md:gap-4 mb-4"
            >
              <h2 className="text-2xl md:text-4xl font-bold text-white mt-4">
                إنجازات حساب @POWR UPDATES
              </h2>
              <div 
                className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)] flex-shrink-0"
              >
                <img 
                  src="https://i.postimg.cc/mgqrqxng/IMG-9107.jpg" 
                  alt="المؤسس" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            
            <p 
              className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto"
            >
              في مجتمع باور
            </p>
            
            <div 
              className="h-1.5 bg-gradient-to-r from-red-800 to-red-500 mx-auto mt-6 rounded-full w-[80px]"
            />
          </div>
        </div>

        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          {achievements.map((achievement, index) => (
            <div
              key={index}
            >
              <Card className="flex items-center gap-6 p-6 border-white/10 hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-900/40 to-red-600/20 flex items-center justify-center flex-shrink-0 border border-red-500/20">
                  <achievement.icon size={28} className="text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-1">{achievement.title}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <FaCalendarCheck className="text-red-500/70" />
                    <span>{achievement.date}</span>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
