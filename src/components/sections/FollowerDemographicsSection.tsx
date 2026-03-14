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

const maxPercentage = 59.5;

export function FollowerDemographicsSection() {
  return (
    <TimelineSection className="bg-black/20 border-y border-white/5 py-16">
      <Container>
        <SectionTitle title="الدول المتابعة" subtitle="توزيع متابعينا حول العالم" />
        
        <div className="flex flex-row-reverse items-end justify-center gap-2 md:gap-6 h-80 mt-12 px-2">
          {countries.map((c, index) => {
            const height = Math.max(50, (c.percentage / maxPercentage) * 100);
            
            return (
              <div key={index} className="flex flex-col items-center w-full max-w-[60px]">
                {/* Flag and Pole */}
                <div className="flex flex-col items-center mb-2">
                  <div className="animate-wave text-2xl md:text-4xl">{c.flag}</div>
                  <div className="w-1 h-6 md:h-10 bg-amber-900/80 -mt-1"></div>
                </div>

                {/* Tower */}
                <div className="relative w-full flex flex-col items-center">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.1 }}
                    className="w-full bg-blue-600 rounded-t-lg relative shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                  >
                    {/* Percentage Text */}
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: -25 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.1 }}
                      className="absolute -top-8 w-full text-center text-blue-200 font-bold text-xs md:text-sm"
                    >
                      {c.percentage}%
                    </motion.span>
                  </motion.div>
                </div>
                
                {/* Country Name */}
                <span className="text-white text-[10px] md:text-xs mt-4 font-medium truncate w-full text-center">
                  {c.name}
                </span>
              </div>
            );
          })}
        </div>
      </Container>
    </TimelineSection>
  );
}
