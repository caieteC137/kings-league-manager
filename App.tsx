import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MatchPhase, MatchState, SecretCardType, SoundEvent, MatchEvent } from './types';
import { MATCH_CONFIG, SECRET_CARDS, SOUND_FILES } from './constants';
import Scoreboard from './components/Scoreboard';
import TimerDisplay from './components/TimerDisplay';
import SecretCardsPanel from './components/SecretCardsPanel';
import MatchControls from './components/MatchControls';
import ScaleUpInfo from './components/ScaleUpInfo';
import Notification from './components/Notification';
import SoundPanel from './components/SoundPanel';
import MatchLog from './components/MatchLog';

const App: React.FC = () => {
  const createInitialState = (): MatchState => ({
    phase: MatchPhase.NOT_STARTED,
    seconds: 0,
    isRunning: false,
    home: { name: 'TIME DA CASA', score: 0, fouls: 0, activeCards: [] },
    away: { name: 'TIME VISITANTE', score: 0, fouls: 0, activeCards: [] },
    events: [],
  });

  const phaseLabels: Record<MatchPhase, string> = {
    [MatchPhase.NOT_STARTED]: 'NÃO INICIADO',
    [MatchPhase.FIRST_HALF]: '1º TEMPO',
    [MatchPhase.HALFTIME]: 'INTERVALO',
    [MatchPhase.SECOND_HALF]: '2º TEMPO',
    [MatchPhase.SHOOTOUTS]: 'SHOOTOUTS',
    [MatchPhase.FINISHED]: 'ENCERRADO',
  };

  const [match, setMatch] = useState<MatchState>(createInitialState());
  const [notification, setNotification] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const lastSoundSecondRef = useRef<string>("");

  const playSound = useCallback((event: SoundEvent) => {
    if (isMuted) return;
    const path = SOUND_FILES[event];
    const audio = new Audio(path);
    audio.play().catch(e => console.warn(`Erro ao tocar ${event}:`, e));
  }, [isMuted]);

  const playSoundAndWait = useCallback((event: SoundEvent): Promise<void> => {
    return new Promise((resolve) => {
      if (isMuted) {
        resolve();
        return;
      }
      const path = SOUND_FILES[event];
      const audio = new Audio(path);

      const handleEnd = () => {
        audio.removeEventListener('ended', handleEnd);
        audio.removeEventListener('error', handleError);
        resolve();
      };

      const handleError = () => {
        audio.removeEventListener('ended', handleEnd);
        audio.removeEventListener('error', handleError);
        console.warn(`Erro ao tocar ${event}`);
        resolve();
      };

      audio.addEventListener('ended', handleEnd);
      audio.addEventListener('error', handleError);
      audio.play().catch(e => {
        console.warn(`Erro ao tocar ${event}:`, e);
        resolve();
      });
    });
  }, [isMuted]);

  const addLog = (description: string, type: MatchEvent['type'] = 'INFO') => {
    const newEvent: MatchEvent = {
      id: Math.random().toString(36).substr(2, 9),
      time: match.seconds,
      description,
      type
    };
    setMatch(prev => ({ ...prev, events: [newEvent, ...prev.events] }));
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    if (!match.isRunning) return;
    const currentKey = `${match.phase}-${match.seconds}`;
    if (lastSoundSecondRef.current === currentKey) return;
    lastSoundSecondRef.current = currentKey;

    if (match.seconds === MATCH_CONFIG.DICE_TIME) {
      playSound('DICE');
      addLog("🎲 HORA DOS DADOS (Minuto 18)", "INFO");
      showNotification("DADOS EM CAMPO!");
    }

    const isEndingFirstHalf = match.phase === MatchPhase.FIRST_HALF && match.seconds >= (MATCH_CONFIG.FIRST_HALF_DURATION - 10) && match.seconds < MATCH_CONFIG.FIRST_HALF_DURATION;
    const isEndingMatch = match.phase === MatchPhase.SECOND_HALF && match.seconds >= (MATCH_CONFIG.TOTAL_DURATION - 10) && match.seconds < MATCH_CONFIG.TOTAL_DURATION;

    if (isEndingFirstHalf || isEndingMatch) {
      playSound('COUNTDOWN');
    }
  }, [match.seconds, match.phase, match.isRunning, playSound]);

  useEffect(() => {
    let interval: number;
    if (match.isRunning) {
      interval = window.setInterval(() => {
        setMatch((prev) => {
          if (!prev.isRunning) return prev;
          const nextSeconds = prev.seconds + 1;
          let nextPhase = prev.phase;
          let nextIsRunning: boolean = prev.isRunning;
          let finalSeconds = nextSeconds;

          if (prev.phase === MatchPhase.FIRST_HALF && nextSeconds >= MATCH_CONFIG.FIRST_HALF_DURATION) {
            playSound('START');
            nextPhase = MatchPhase.HALFTIME;
            nextIsRunning = false;
            finalSeconds = MATCH_CONFIG.FIRST_HALF_DURATION;
          } else if (prev.phase === MatchPhase.SECOND_HALF && nextSeconds >= MATCH_CONFIG.TOTAL_DURATION) {
            playSound('START');
            nextPhase = MatchPhase.FINISHED;
            nextIsRunning = false;
            finalSeconds = MATCH_CONFIG.TOTAL_DURATION;
          }

          return {
            ...prev,
            seconds: finalSeconds,
            phase: nextPhase,
            isRunning: nextIsRunning,
            home: { ...prev.home },
            away: { ...prev.away }
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [match.isRunning, playSound]);

  const handleStartStop = () => {
    if (match.phase === MatchPhase.NOT_STARTED || match.phase === MatchPhase.HALFTIME) {
      const nextPhase = match.phase === MatchPhase.NOT_STARTED ? MatchPhase.FIRST_HALF : MatchPhase.SECOND_HALF;

      // Play tic-tac first, then sirene before starting the game
      if (!isMuted) {
        const ticTacAudio = new Audio('/sounds/tic-tac.m4a');
        ticTacAudio.addEventListener('ended', () => {
          playSoundAndWait('START').then(() => {
            setMatch(prev => ({ ...prev, phase: nextPhase, isRunning: true }));
            addLog(`INÍCIO: ${phaseLabels[nextPhase]}`, 'INFO');
          });
        });
        ticTacAudio.addEventListener('error', () => {
          playSoundAndWait('START').then(() => {
            setMatch(prev => ({ ...prev, phase: nextPhase, isRunning: true }));
            addLog(`INÍCIO: ${phaseLabels[nextPhase]}`, 'INFO');
          });
        });
        ticTacAudio.play().catch(() => {
          playSoundAndWait('START').then(() => {
            setMatch(prev => ({ ...prev, phase: nextPhase, isRunning: true }));
            addLog(`INÍCIO: ${phaseLabels[nextPhase]}`, 'INFO');
          });
        });
      } else {
        setMatch(prev => ({ ...prev, phase: nextPhase, isRunning: true }));
        addLog(`INÍCIO: ${phaseLabels[nextPhase]}`, 'INFO');
      }
    } else {
      setMatch(prev => ({ ...prev, isRunning: !prev.isRunning }));
    }
  };

  const handleReset = () => {
    if (window.confirm("CONFIRMAR REINÍCIO: Deseja zerar toda a partida, placar e histórico?")) {
      lastSoundSecondRef.current = "";
      setMatch(createInitialState());
      showNotification("SISTEMA ZERADO");
    }
  };

  const updateScore = (team: 'home' | 'away', delta: number) => {
    if (delta > 0) {
      playSound('GOAL');
      addLog(`GOL: ${match[team].name}!`, 'GOAL');
    }
    setMatch(prev => ({
      ...prev,
      [team]: { ...prev[team], score: Math.max(0, prev[team].score + delta) }
    }));
  };

  const setTeamName = (team: 'home' | 'away', name: string) => {
    setMatch(prev => ({
      ...prev,
      [team]: { ...prev[team], name: name.toUpperCase() }
    }));
  };

  const activateCard = (team: 'home' | 'away', cardType: SecretCardType) => {
    const minutes = match.seconds / 60;
    const isFirstHalfValid = minutes >= 5 && minutes < 17;
    const isSecondHalfValid = minutes >= 23 && minutes < 36;

    if (!isFirstHalfValid && !isSecondHalfValid) {
      showNotification("CARTAS APENAS ENTRE 5'-17' E 23'-36'");
      return;
    }

    if (match[team].activeCards.includes(cardType)) {
      showNotification("CARTA JÁ UTILIZADA");
      return;
    }

    playSound('CARD');
    const cardInfo = SECRET_CARDS.find(c => c.type === cardType);
    addLog(`CARTA: ${cardInfo?.label} para ${match[team].name}`, 'CARD');

    // Novo bloco simplificado: apenas adiciona a carta à lista de usadas do time
    setMatch(prev => ({
      ...prev,
      [team]: {
        ...prev[team],
        activeCards: [...prev[team].activeCards, cardType]
      }
    }));
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 lg:p-10 flex flex-col items-center gap-6">
      <header className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/40 p-6 rounded-3xl border border-white/5 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-32 h-16 md:w-60 md:h-28 flex items-center justify-center overflow-hidden">
            <img
              src="/images/rede_esportes_logo.png"
              alt="Logo_rede_esportes"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-widest bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Gerenciador de Elite</h1>
        </div>
        <div className="flex gap-4 items-center">
          <div className="px-6 py-2 bg-slate-950 rounded-full border border-pink-500/30 text-pink-500 font-digital text-sm shadow-[0_0_15px_rgba(236,72,153,0.3)] uppercase tracking-widest">
            {phaseLabels[match.phase]}
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-slate-900/30 rounded-[3rem] p-6 lg:px-12 lg:py-10 border border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-md flex flex-col items-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

            <div className="w-full max-w-3xl flex justify-center">
              <Scoreboard
                home={match.home}
                away={match.away}
                onScoreChange={updateScore}
                onNameChange={setTeamName}
                onFoulChange={(team, delta) => {
                  if (delta > 0) addLog(`FALTA: ${match[team].name}`, 'FOUL');
                  setMatch(prev => ({ ...prev, [team]: { ...prev[team], fouls: Math.max(0, prev[team].fouls + delta) } }))
                }}
              />
            </div>

            <div className="mt-12 flex flex-col items-center gap-10">
              <TimerDisplay seconds={match.seconds} />
              <MatchControls
                isRunning={match.isRunning}
                phase={match.phase}
                onStartStop={handleStartStop}
                onReset={handleReset}
              />
            </div>
          </section>

          <ScaleUpInfo seconds={match.seconds} phase={match.phase} />
          <MatchLog events={match.events} />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <SoundPanel
            onPlaySound={(e) => {
              if (e === 'PRESIDENT') addLog("PÊNALTI DO PRESIDENTE!", "CARD");
              playSound(e);
            }}
            isMuted={isMuted}
            toggleMute={() => setIsMuted(!isMuted)}
          />

          <SecretCardsPanel
            teamName={match.home.name}
            activeCards={match.home.activeCards}
            onActivate={(type) => activateCard('home', type)}
            color="yellow"
          />
          <SecretCardsPanel
            teamName={match.away.name}
            activeCards={match.away.activeCards}
            onActivate={(type) => activateCard('away', type)}
            color="cyan"
          />
        </div>
      </main>

      <Notification message={notification} />
    </div>
  );
};

export default App;
