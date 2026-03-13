import { motion } from 'motion/react';
import { Container } from '../layout/Container';
import { SectionTitle } from '../ui/SectionTitle';
import { Card } from '../ui/Card';
import { FaBolt, FaBullseye, FaBookOpen } from 'react-icons/fa6';

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
    icon: FaBookOpen,
    title: 'ملخصات سريعة',
    description: 'تلخيص احداث فريق باور بطريقة مُبسطة وسريعة لتكون على اطلاع دائم بكل جديد.'
  }
];

export function FeaturesSection() {
  return (
    <section className="w-full py-16 relative">
      <Container>
        <SectionTitle title="لماذا تتابعنا؟" subtitle="نحن نقدم لك أفضل تجربة لمتابعة أخبار باور" />
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <Card className="flex flex-col items-center text-center h-full">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                  <feature.icon size={24} className="text-red-500" />
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-lg">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
