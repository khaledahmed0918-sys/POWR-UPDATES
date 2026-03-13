import { motion } from 'motion/react';
import { Container } from '../layout/Container';
import { SectionTitle } from '../ui/SectionTitle';
import { Card } from '../ui/Card';
import { FaBolt, FaBullseye, FaStar } from 'react-icons/fa6';

const features = [
  {
    icon: FaBolt,
    title: 'سرعة في النقل',
    description: 'نغطي أحدث الأخبار والتحديثات لحظة بلحظة لنبقيك دائماً في قلب الحدث.'
  },
  {
    icon: FaBullseye,
    title: 'دقة ومصداقية',
    description: 'نحرص على توفير المعلومات من مصادرها الموثوقة لضمان أعلى معايير الدقة.'
  },
  {
    icon: FaStar,
    title: 'تغطية حصرية',
    description: 'محتوى حصري ومقابلات وتغطيات خاصة لا تجدها في أي مكان آخر.'
  }
];

export function FeaturesSection() {
  return (
    <section className="w-full py-16 relative">
      <Container>
        <SectionTitle title="لماذا تتابعنا؟" subtitle="نحن نقدم لك أفضل تجربة لمتابعة أخبار باور" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="flex flex-col items-center text-center h-full">
                <div className="w-20 h-20 rounded-full bg-red-900/20 flex items-center justify-center mb-6 text-red-500 shadow-[0_0_20px_rgba(139,0,0,0.2)]">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-lg">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
