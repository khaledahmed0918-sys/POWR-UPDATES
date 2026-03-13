import { motion } from 'motion/react';
import { socialLinks } from '../../data/socials';
import { Container } from '../layout/Container';
import { SectionTitle } from '../ui/SectionTitle';

export function SocialsSection() {
  return (
    <section className="w-full py-16">
      <Container>
        <SectionTitle title="تواصل معنا" subtitle="تابعنا على منصات التواصل الاجتماعي ليصلك كل جديد" />
        <div className="flex justify-center gap-6 md:gap-10">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.1 }}
                whileHover={{ scale: 1.15, rotate: 5, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-xl hover:bg-white/10 hover:shadow-red-900/30 transition-all duration-300"
              >
                <Icon size={36} color={social.color} className="drop-shadow-md" />
              </motion.a>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
