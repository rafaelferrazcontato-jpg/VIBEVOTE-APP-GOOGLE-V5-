import { Artist, Reward } from '../types';

export const VALID_CODES = ["VIBE2026", "HOUSEMAG", "ADMIN"];

// Helper to match Python script's drive link fix
const fixDriveUrl = (id: string) => `https://drive.google.com/uc?export=view&id=${id}`;

export const HERO_IMAGE = fixDriveUrl("1Ei0dmt9Ttgu34pd_CFR9WtcVpw_enhSl");

export const ARTISTS: Artist[] = [
  { 
    id: 1, 
    name: "ALOK", 
    genre: "BRAZILIAN BASS", 
    desc: "O pioneiro que levou o som do Brasil para os maiores palcos do mundo.", 
    img: fixDriveUrl("18H-ZAczi_cRacEqq05xmP_8hI1UKwtyn"), 
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    votes: 98, 
    status: "CONFIRMADO",
    in_lineup: true 
  },
  { 
    id: 2, 
    name: "VINTAGE CULTURE", 
    genre: "HOUSE MUSIC", 
    desc: "Sets de longa duração que conectam o underground ao mainstage com maestria.", 
    img: fixDriveUrl("1CXsFSOQ4K2I-zy25P38MYMtCnehbX0yi"), 
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    votes: 95, 
    status: "CONFIRMADO",
    in_lineup: true 
  },
  { 
    id: 3, 
    name: "MOCHAKK", 
    genre: "TECH HOUSE", 
    desc: "Fenômeno global conhecido por sua presença de palco e pesquisa musical profunda.", 
    img: fixDriveUrl("17eJ19Jmsr9hJasisKkpqetEwR3yawU-c"), 
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    votes: 92, 
    status: "CONFIRMADO",
    in_lineup: true 
  },
  { 
    id: 4, 
    name: "ANNA", 
    genre: "TECHNO", 
    desc: "Uma das maiores DJs de Techno do mundo, com um som potente e hipnótico.", 
    img: fixDriveUrl("1V0PQAprYBqtWwn6FmfnE-0f4vAdykEN3"), 
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    votes: 89, 
    status: "CONFIRMADO",
    in_lineup: true 
  },
  // --- CUT-OFF POINT ---
  { 
    id: 5, 
    name: "CHARLOTTE DE WITTE", 
    genre: "ACID TECHNO", 
    desc: "A força implacável do techno belga, fundadora da KNTXT.", 
    img: fixDriveUrl("1qRpailFgM4aeIWFKcgk-rTUVA_0J9ph6"), 
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    votes: 45, 
    status: "ELIMINADO",
    in_lineup: false 
  },
  { 
    id: 6, 
    name: "CARL COX", 
    genre: "LEGEND", 
    desc: "O rei indiscutível. Um ícone que dispensa apresentações.", 
    img: fixDriveUrl("16NUWaHIGKyxTmzmpVHtQENXrMQtSQxuV"), 
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    votes: 42, 
    status: "ELIMINADO",
    in_lineup: false 
  },
  { 
    id: 7, 
    name: "AMELIE LENS", 
    genre: "TECHNO", 
    desc: "Energy, atmosphere and acid techno from Belgium.", 
    img: fixDriveUrl("1mvJMh3_32ABbQLwBoR0lwl7_yD9LA9Xy"), 
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    votes: 38, 
    status: "ELIMINADO",
    in_lineup: false 
  },
  { 
    id: 8, 
    name: "FATBOY SLIM", 
    genre: "BIG BEAT", 
    desc: "Right here, right now. The legend of dance music.", 
    img: fixDriveUrl("1gbEZFpad8rAJKaPbSlQtHCIr0PZ-6HQ_"), 
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    votes: 35, 
    status: "ELIMINADO",
    in_lineup: false 
  }
];

export const REWARDS: Reward[] = [
  { title: "Upgrade VIP", cost: 500, icon: "🎫", desc: "Acesso exclusivo a área VIP.", active: false },
  { title: "Drink Grátis", cost: 150, icon: "🍸", desc: "Válido em qualquer bar.", active: true },
  { title: "Camiseta 2026", cost: 300, icon: "👕", desc: "Merch oficial do evento.", active: false }
];