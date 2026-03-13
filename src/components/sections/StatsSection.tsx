import { statsData } from '../../data/stats';
import { StatItem } from '../ui/StatItem';
import { Container } from '../layout/Container';
import { SectionTitle } from '../ui/SectionTitle';

export function StatsSection() {
  return (
    <section className="w-full py-16 relative">
      <Container>
        <SectionTitle 
          title="إحصائياتنا" 
          subtitle="أرقام تعكس ثقتكم بنا وتفاعلكم المستمر مع محتوانا" 
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {statsData.map((stat, index) => (
            <StatItem key={stat.id} stat={stat} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
