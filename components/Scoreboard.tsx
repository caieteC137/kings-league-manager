import React, { useState } from 'react';
import { TeamState } from '../types';

interface ScoreboardProps {
  home: TeamState;
  away: TeamState;
  onScoreChange: (team: 'home' | 'away', delta: number) => void;
  onFoulChange: (team: 'home' | 'away', delta: number) => void;
  onNameChange: (team: 'home' | 'away', name: string) => void;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ home, away, onScoreChange, onFoulChange, onNameChange }) => {
  const [editingTeam, setEditingTeam] = useState<'home' | 'away' | null>(null);

  const TeamSection = ({ team, side }: { team: TeamState, side: 'home' | 'away' }) => {
    const isYellow = side === 'home';
    const mainColorClass = isYellow ? 'text-yellow-500' : 'text-cyan-400';
    const btnColorClass = isYellow ? 'bg-yellow-500' : 'bg-cyan-400';
    const glowClass = isYellow ? 'drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]' : 'drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]';
    const btnShadow = isYellow ? 'shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'shadow-[0_0_15px_rgba(34,211,238,0.3)]';

    return (
      <div className="flex-1 flex flex-col items-center gap-4 w-full max-w-[280px]">
        {editingTeam === side ? (
          <input
            autoFocus
            className={`bg-slate-800 border-b-2 border-pink-500 text-center text-xl font-black uppercase italic tracking-tighter p-2 outline-none w-full text-white`}
            value={team.name}
            onChange={(e) => onNameChange(side, e.target.value)}
            onBlur={() => setEditingTeam(null)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingTeam(null)}
          />
        ) : (
          <h2
            onClick={() => setEditingTeam(side)}
            className={`text-2xl lg:text-4xl font-black ${mainColorClass} uppercase italic tracking-tighter ${glowClass} cursor-pointer hover:opacity-80 transition-all text-center leading-tight h-[2.5em] flex items-center justify-center`}
          >
            {team.name}
          </h2>
        )}

        <div className="flex items-center gap-4 lg:gap-6">
          <button onClick={() => onScoreChange(side, -1)} className="w-10 h-10 lg:w-14 lg:h-14 rounded-2xl bg-slate-800 border border-white/5 hover:bg-slate-700 flex items-center justify-center font-bold text-xl transition-all active:scale-90">-</button>
          <span className="text-7xl lg:text-9xl font-digital font-bold text-white leading-none select-none tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            {team.score}
          </span>
          <button onClick={() => onScoreChange(side, 1)} className={`w-10 h-10 lg:w-14 lg:h-14 rounded-2xl ${btnColorClass} text-black hover:brightness-110 flex items-center justify-center font-bold text-xl transition-all active:scale-90 ${btnShadow}`}>+</button>
        </div>

        <div className="flex items-center bg-slate-800/80 rounded-2xl p-2 px-4 border border-red-500/30">
          <button onClick={() => onFoulChange(side, -1)} className="text-slate-500 hover:text-white px-2 font-bold text-lg">-</button>
          <span className="text-red-500 font-black px-4 text-xs uppercase tracking-wider whitespace-nowrap">{team.fouls} FALTAS</span>
          <button onClick={() => onFoulChange(side, 1)} className="text-slate-500 hover:text-white px-2 font-bold text-lg">+</button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16 w-full">
      <TeamSection team={home} side="home" />
      <div className="text-slate-800 font-black italic text-4xl lg:text-6xl select-none hidden md:block opacity-20">VS</div>
      <TeamSection team={away} side="away" />
    </div>
  );
};

export default Scoreboard;
