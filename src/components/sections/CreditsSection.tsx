import { motion } from 'motion/react';
import { creditsData } from '../../data/credits';
import { Container } from '../layout/Container';

export function CreditsSection() {
  return (
    <section className="w-full py-12 border-t border-white/10 mt-8 bg-black/40">
      <Container>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
          {creditsData.map((credit, index) => (
            <motion.div
              key={credit.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-full border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-900">
                <img 
                  src={credit.avatar} 
                  alt={credit.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium">{credit.role}</span>
                <span className="text-sm md:text-base font-bold text-white">{credit.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
