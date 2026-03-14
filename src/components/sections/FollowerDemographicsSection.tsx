import { motion } from 'motion/react';
import { Container } from '../layout/Container';
import { SectionTitle } from '../ui/SectionTitle';
import { TimelineSection } from '../layout/TimelineSection';

const countries = [
  { name: "السعودية", flag: "🇸🇦", percentage: 59.5 },
  { name: "العراق", flag: "🇮🇶", percentage: 7.2 },
  { name: "الأردن", flag: "🇯🇴", percentage: 4.0 },
  { name: "الجزائر", flag: "🇩🇿", percentage: 3.5 },
  { name: "عُمان", flag: "🇴🇲", percentage: 3.5 },
  { name: "الكويت", flag: "🇰🇼", percentage: 3.1 },
  { name: "الإمارات", flag: "🇦🇪", percentage: 3.0 },
];

export function FollowerDemographicsSection() {
  return (
    <TimelineSection className="bg-black/20 border-y border-white/5 py-24">
      <Container>
        <SectionTitle title="الدول المتابعة" subtitle="توزيع متابعينا حول العالم" className="mb-12" />
        
        {/* Grid background behind towers */}
        <div className="relative mt-20 px-4">
          <div className="absolute inset-0 opacity-10 z-0" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="relative z-10 flex flex-row-reverse items-end justify-center gap-4 md:gap-8 h-[450px]">
            {countries.map((c, index) => {
              // Saudi (59.5%) should be just above 50%.
              // Scale others proportionally.
              const height = c.name === "السعودية" ? 55 : (c.percentage / 59.5) * 50;
              
              return (
                <div key={index} className="flex flex-col items-center w-full max-w-[80px]">
                  {/* Flag and Pole */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="animate-wave text-3xl md:text-5xl drop-shadow-lg">{c.flag}</div>
                    <div className="w-1 h-10 md:h-16 bg-gradient-to-b from-amber-700 to-amber-900 -mt-1 rounded-b-full"></div>
                  </div>

                  {/* Tower Container */}
                  <div className="relative w-full h-[300px] flex flex-col items-end justify-end bg-white/5 rounded-t-lg border border-white/10 overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.1 }}
                      className="w-full bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 rounded-t-sm relative shadow-[0_0_20px_rgba(37,99,235,0.4)] will-change-transform"
                    >
                      {/* Percentage Text */}
                      <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: -35 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.1 }}
                        className="absolute -top-10 w-full text-center text-white font-bold text-xs md:text-sm drop-shadow-md will-change-transform"
                      >
                        {c.percentage}%
                      </motion.span>
                    </motion.div>
                  </div>
                  
                  {/* Country Name */}
                  <span className="text-white text-xs md:text-sm mt-6 font-bold truncate w-full text-center bg-white/5 px-2 py-1 rounded-full">
                    {c.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </TimelineSection>
  );
}
