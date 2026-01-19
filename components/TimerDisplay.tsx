
import React from 'react';

interface TimerDisplayProps {
  seconds: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ seconds }) => {
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center group">
      <div className="text-[10vw] lg:text-[140px] font-digital font-bold tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all leading-none">
        {formatTime(seconds)}
      </div>
      <div className="h-1 w-24 bg-pink-500 mt-4 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.8)]"></div>
    </div>
  );
};

export default TimerDisplay;
