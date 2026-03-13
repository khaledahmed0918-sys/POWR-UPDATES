import { motion } from 'motion/react';
import { Container } from '../layout/Container';

export function AboutSection() {
  return (
    <section className="w-full py-20 bg-black/20 border-b border-white/5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-red-900/5 blur-[120px] rounded-full pointer-events-none" />
      
      <Container className="relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center justify-center gap-3">
            <span className="w-12 h-[2px] bg-red-600 rounded-full"></span>
            من نحن
            <span className="w-12 h-[2px] bg-red-600 rounded-full"></span>
          </h2>
          
          <p className="text-lg md:text-2xl leading-relaxed md:leading-loose text-gray-300 font-medium">
            أهلاً وسهلاً بالجميع! ، حساب <span className="text-white font-bold">POWR UPDATES</span> الاخباري ينقل كل مايخص باور ، ويعتبر أعلى حساب اخباري مخصص لـنقل اخبار الفريق .. ويمتلك أكثر من <span className="text-red-500 font-bold">40 ألـف متابع</span> عبر حساباته في مواقع التواصل الاجتماعي
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
