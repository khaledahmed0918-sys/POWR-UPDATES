import { Container } from '../layout/Container';
import { TimelineSection } from '../layout/TimelineSection';

interface CombinedSectionProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export function CombinedSection({ left, right }: CombinedSectionProps) {
  return (
    <TimelineSection isSplit>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="flex flex-col justify-center items-center text-center">
            {left}
          </div>
          <div className="flex flex-col justify-center items-center text-center">
            {right}
          </div>
        </div>
      </Container>
    </TimelineSection>
  );
}
