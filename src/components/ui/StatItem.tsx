import React from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { StatData } from '../../types';

interface StatItemProps {
  stat: StatData;
}

export const StatItem: React.FC<StatItemProps> = ({ stat }) => {
  // Determine if it needs a progress bar
  const hasProgress = stat.id === 'followers';
  
  let progressValue = 0;
  if (stat.id === 'followers' && stat.numericValue && stat.numericGoal) {
    progressValue = (stat.numericValue / stat.numericGoal) * 100;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      }}
    >
      <Card className="h-full flex flex-col justify-center items-center text-center gap-2">
        <h3 className="text-gray-400 text-sm md:text-base font-medium">{stat.label}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
          {stat.goal && (
            <span className="text-xs md:text-sm text-gray-500 font-medium">
              الهدف: {stat.goal}
            </span>
          )}
        </div>
        
        {hasProgress && (
          <div className="w-full mt-3">
            <ProgressBar 
              progress={progressValue} 
              color="bg-red-600" 
            />
          </div>
        )}
      </Card>
    </motion.div>
  );
};
