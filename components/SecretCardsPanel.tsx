
import React from 'react';
import { SecretCardType } from '../types';
import { SECRET_CARDS } from '../constants';

interface SecretCardsPanelProps {
  teamName: string;
  activeCards: SecretCardType[];
  onActivate: (type: SecretCardType) => void;
  color: 'yellow' | 'cyan';
}

const SecretCardsPanel: React.FC<SecretCardsPanelProps> = ({ teamName, activeCards, onActivate, color }) => {
  const isYellow = color === 'yellow';
  const borderColor = isYellow ? 'border-yellow-500/20' : 'border-cyan-500/20';
  const textColor = isYellow ? 'text-yellow-500' : 'text-cyan-400';
  const accentColor = isYellow ? 'rgba(234,179,8,0.1)' : 'rgba(34,211,238,0.1)';

  return (
    <div className={`bg-slate-900/60 rounded-3xl p-6 border ${borderColor} shadow-xl backdrop-blur-md`}>
      <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-5 flex items-center gap-2 ${textColor}`}>
        <i className="fa-solid fa-bolt-lightning animate-pulse"></i> Cartas: {teamName}
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {SECRET_CARDS.map((card) => {
          const isUsed = activeCards.includes(card.type);
          return (
            <button
              key={card.type}
              onClick={() => onActivate(card.type)}
              disabled={isUsed}
              title={card.description}
              className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all btn-glow group overflow-hidden ${
                isUsed 
                  ? 'bg-slate-950/80 border-slate-900 opacity-30 grayscale cursor-not-allowed' 
                  : `bg-slate-800/40 border-white/5 hover:border-white/20 hover:scale-[1.02] active:scale-95`
              }`}
              style={!isUsed ? { backgroundColor: accentColor } : {}}
            >
              <i className={`fa-solid ${card.icon} text-xl mb-2 ${isUsed ? 'text-slate-700' : textColor} group-hover:scale-110 transition-transform`}></i>
              <span className="text-[9px] font-black uppercase tracking-wider text-center leading-tight">{card.label}</span>
              
              {isUsed && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                  <div className="bg-red-500/80 text-white text-[7px] font-black -rotate-12 px-2 py-0.5 rounded shadow-lg border border-red-400">EXECUTADA</div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SecretCardsPanel;
