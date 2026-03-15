import { motion } from 'motion/react';
import { Container } from '../layout/Container';
import { SectionTitle } from '../ui/SectionTitle';
import { Mail, MessageSquare } from 'lucide-react';

export function ContactUsSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-black/40 border-y border-white/5">
      <Container>
        <SectionTitle title="تواصل معنا" subtitle="نحن هنا للإجابة على استفساراتكم" />
        
        <div className="mt-16 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center"
          >
            <a href="mailto:contact@powr.gg" className="bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col items-center gap-4 hover:bg-white/10 transition-colors group">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                <Mail size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">البريد الإلكتروني</h3>
              <p className="text-gray-400">contact@powr.gg</p>
            </a>
            <a href="https://discord.gg/powr" target="_blank" rel="noopener noreferrer" className="bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col items-center gap-4 hover:bg-white/10 transition-colors group">
              <div className="w-16 h-16 bg-[#5865F2]/20 rounded-full flex items-center justify-center text-[#5865F2] group-hover:scale-110 transition-transform">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">الدعم الفني</h3>
              <p className="text-gray-400">عبر سيرفر الديسكورد</p>
            </a>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
