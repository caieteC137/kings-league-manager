
import React from 'react';
import { MatchPhase } from '../types';

interface MatchControlsProps {
  isRunning: boolean;
  phase: MatchPhase;
  onStartStop: () => void;
  onReset: () => void;
}

const MatchControls: React.FC<MatchControlsProps> = ({ isRunning, phase, onStartStop, onReset }) => {
  const isFinished = phase === MatchPhase.FINISHED;

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center">
      <button 
        onClick={onStartStop}
        disabled={isFinished}
        className={`w-full sm:w-auto min-w-[200px] px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all btn-glow shadow-2xl flex items-center justify-center gap-3 ${
          isRunning 
          ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700' 
          : isFinished 
            ? 'bg-slate-900 text-slate-700 cursor-not-allowed border border-slate-800 opacity-50' 
            : 'bg-white text-black hover:scale-105 hover:shadow-white/10 active:scale-95'
        }`}
      >
        {isRunning ? (
          <><i className="fa-solid fa-pause text-xl"></i> Pausar</>
        ) : (
          <>
            <i className={`fa-solid ${phase === MatchPhase.NOT_STARTED ? 'fa-play' : 'fa-forward-step'} text-xl`}></i>
            {phase === MatchPhase.NOT_STARTED ? 'Iniciar Jogo' : 'Retomar Partida'}
          </>
        )}
      </button>

      <button 
        onClick={onReset}
        className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-slate-900/80 border border-pink-500/20 text-slate-400 font-black uppercase text-xs hover:bg-slate-800 hover:text-white hover:border-pink-500/40 transition-all flex items-center justify-center gap-2 active:scale-95"
      >
        <i className="fa-solid fa-rotate-left"></i> Resetar Partida
      </button>
    </div>
  );
};

export default MatchControls;
