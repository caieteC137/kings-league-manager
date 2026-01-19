
import React from 'react';
import { MatchPhase } from '../types';
import { MATCH_CONFIG } from '../constants';

interface ScaleUpInfoProps {
  seconds: number;
  phase: MatchPhase;
}

const ScaleUpInfo: React.FC<ScaleUpInfoProps> = ({ seconds, phase }) => {
  const isScaleUpTime = phase === MatchPhase.FIRST_HALF && seconds <= MATCH_CONFIG.SCALE_UP_LIMIT;
  
  const playersPerTeam = isScaleUpTime 
    ? Math.min(7, Math.floor(seconds / 60) + 1) 
    : 7;

  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 flex items-center justify-between backdrop-blur-sm relative overflow-hidden group shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex items-center gap-6 z-10">
        <div className="bg-slate-950 h-16 w-16 rounded-2xl flex items-center justify-center text-3xl font-black border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
          {playersPerTeam}
        </div>
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Modo de Jogo</div>
          <div className="text-2xl font-black text-slate-200 uppercase tracking-tighter italic">
            {playersPerTeam} <span className="text-slate-600 text-base mx-1">x</span> {playersPerTeam}
          </div>
        </div>
      </div>

      {isScaleUpTime ? (
        <div className="flex flex-col items-end z-10">
          <div className="text-[10px] font-black uppercase text-yellow-500 tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_10px_#eab308]"></span>
            Scale-Up Ativo
          </div>
          <div className="text-3xl font-digital font-bold text-white leading-none mt-1">
            {60 - (seconds % 60)}<span className="text-sm ml-1 text-slate-500 font-normal">s</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-end z-10">
          <div className="text-[10px] font-black uppercase text-slate-600 tracking-[0.2em]">Formato Final</div>
          <div className="text-lg font-black text-slate-700 italic">EQUIPES 7x7</div>
        </div>
      )}
    </div>
  );
};

export default ScaleUpInfo;
