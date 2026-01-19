
import React from 'react';
import { MatchEvent } from '../types';

interface MatchLogProps {
  events: MatchEvent[];
}

const MatchLog: React.FC<MatchLogProps> = ({ events }) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getIcon = (type: MatchEvent['type']) => {
    switch (type) {
      case 'GOAL': return 'fa-futbol text-cyan-400';
      case 'CARD': return 'fa-bolt text-yellow-500';
      case 'FOUL': return 'fa-hand text-red-500';
      default: return 'fa-info-circle text-slate-500';
    }
  };

  return (
    <div className="bg-slate-900/50 rounded-3xl border border-white/5 p-6 h-48 flex flex-col shadow-inner backdrop-blur-md">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
        <i className="fa-solid fa-timeline"></i> Cronologia da Partida
      </h3>
      <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
        {events.length === 0 ? (
          <div className="text-slate-600 text-xs italic text-center mt-6">Aguardando início da partida...</div>
        ) : (
          events.map(event => (
            <div key={event.id} className="flex items-center gap-4 bg-slate-950/40 p-3 rounded-xl border border-white/5 animate-fade-in hover:bg-slate-950/60 transition-colors">
              <span className="font-digital text-[11px] text-pink-500 w-12 font-bold">{formatTime(event.time)}</span>
              <i className={`fa-solid ${getIcon(event.type)} text-[12px]`}></i>
              <span className="text-[11px] lg:text-xs font-bold text-slate-300 uppercase tracking-tight">{event.description}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MatchLog;
