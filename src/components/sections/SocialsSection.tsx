import { motion } from 'motion/react';
import { socialLinks } from '../../data/socials';
import { SectionTitle } from '../ui/SectionTitle';

export function SocialsSection() {
  return (
    <div className="w-full">
      <SectionTitle title="تواصل معنا" subtitle="تابعنا على منصات التواصل الاجتماعي" />
      <motion.div 
        className="flex justify-center gap-4 md:gap-6 flex-wrap"
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
        {socialLinks.map((social, index) => {
          const Icon = social.icon;
          const isX = social.id === 'x';
          return (
            <motion.a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={{
                hidden: { scale: 0, opacity: 0 },
                visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 20 } }
              }}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`w-16 h-16 rounded-full bg-black/40 border flex items-center justify-center shadow-xl transition-all duration-300 ${
                isX 
                  ? 'border-white/30 hover:bg-white/10 hover:border-white/60 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
                  : 'border-white/10 hover:bg-white/5 hover:border-red-500/30'
              }`}
            >
              <Icon 
                size={28} 
                color={social.color} 
                className={isX ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" : ""} 
              />
            </motion.a>
          );
        })}
      </motion.div>
    </div>
  );
}
