import { motion } from 'motion/react';
import { SectionTitle } from '../ui/SectionTitle';

export function AboutSection() {
  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
      }}
      className="max-w-4xl mx-auto text-center w-full"
    >
      <SectionTitle title="من نحن" />
      
      <p className="text-lg md:text-xl leading-relaxed md:leading-loose text-gray-300 font-medium bg-black/40 p-6 rounded-2xl border border-white/5 shadow-xl">
        أهلاً وسهلاً بالجميع! حساب <span className="text-white font-bold">POWR UPDATES</span> الاخباري ينقل كل مايخص باور ، ويعتبر أعلى حساب اخباري مخصص لـنقل اخبار الفريق .. ويمتلك أكثر من <span className="text-red-500 font-bold">40 ألـف متابع</span> عبر حساباته في مواقع التواصل الاجتماعي
      </p>
    </motion.div>
  );
}
