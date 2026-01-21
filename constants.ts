import { SecretCard, SoundEvent } from './types';

export const MATCH_CONFIG = {
  FIRST_HALF_DURATION: 20 * 60,
  SECOND_HALF_START: 20 * 60,
  SECOND_HALF_DURATION: 16 * 60,
  TOTAL_DURATION: 36 * 60,
  SCALE_UP_LIMIT: 5 * 60,
  DICE_TIME: 18 * 60,
  // SUSPENSION_DURATION: 120, // 2 minutos
};

export const SOUND_FILES: Record<SoundEvent, string> = {
  START: '/sounds/sirene.mp3',
  GOAL: '/sounds/gol.mp3',
  CARD: '/sounds/carta-secreta.mp3',
  DICE: '/sounds/dado.mp3',
  PRESIDENT: '/sounds/penalti-presidente.mp3',
  COUNTDOWN: '/sounds/ultimos-10-sec-1-tempo.mp3',
};

export const SECRET_CARDS: SecretCard[] = [
  {
    type: 'GOAL_X2',
    label: 'Gol x2',
    icon: 'fa-futbol',
    description: 'Os gols marcados nos próximos 2 minutos valem o dobro.',
    color: 'bg-yellow-500'
  },
  {
    type: 'PENALTI',
    label: 'Penâlti',
    icon: 'fa-solid fa-bullseye',
    description: 'Penâlti à favor da equipe.',
    color: 'bg-red-500'
  },
  {
    type: 'STAR_PLAYER',
    label: 'Jogador Estrela',
    icon: 'fa-star',
    description: 'Um jogador escolhido terá gols valendo x2 permanentemente.',
    color: 'bg-blue-500'
  },
  {
    type: 'SHOOTOUT',
    label: 'Shootout',
    icon: 'fa-crosshairs',
    description: 'Concede um pênalti estilo shootout imediato.',
    color: 'bg-purple-500'
  }
];
