
import React from 'react';
import { SoundEvent } from '../types';

interface SoundPanelProps {
  onPlaySound: (event: SoundEvent) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const SoundPanel: React.FC<SoundPanelProps> = ({ onPlaySound, isMuted, toggleMute }) => {
  const sounds: { label: string; icon: string; event: SoundEvent; color: string }[] = [
    { label: 'Sirene', icon: 'fa-bullhorn', event: 'START', color: 'text-white' },
    { label: 'Mágica/Carta', icon: 'fa-magic', event: 'CARD', color: 'text-purple-400' },
    { label: 'Dados (18\')', icon: 'fa-dice', event: 'DICE', color: 'text-yellow-400' },
    { label: 'Pênalti Presidente', icon: 'fa-crown', event: 'PRESIDENT', color: 'text-pink-500' },
    { label: 'Tic-Tac', icon: 'fa-clock', event: 'COUNTDOWN', color: 'text-slate-400' },
  ];

  return (
    <div className="bg-slate-900/80 rounded-2xl p-4 border border-white/5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
          <i className="fa-solid fa-waveform-lines"></i> Mesa de Som
        </h3>
        <button 
          onClick={toggleMute}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-slate-400'}`}
        >
          <i className={`fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {sounds.map((s) => (
          <button
            key={s.event}
            onClick={() => onPlaySound(s.event)}
            className="flex items-center gap-3 p-3 bg-slate-800/40 border border-white/5 rounded-xl hover:bg-slate-800 hover:border-white/10 transition-all text-left group"
          >
            <i className={`fa-solid ${s.icon} ${s.color} group-hover:scale-110 transition-transform`}></i>
            <span className="text-[10px] font-bold uppercase leading-tight">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SoundPanel;
