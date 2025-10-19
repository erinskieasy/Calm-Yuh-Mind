import { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import type { CustomSound } from "@shared/schema";
import oceanSoundsAudio from "@assets/Ocean Sounds_1760846545743.mp3";
import windChimesAudio from "@assets/Wind Chimes_1760847358473.mp3";
import fireplaceAudio from "@assets/Crackling Sounds_1760848106418.mp3";
import rainAudio from "@assets/Rain Sounds_1760848622709.mp3";
import whiteNoiseAudio from "@assets/White Noise_1760849619231.mp3";
import natureSoundsAudio from "@assets/Short 10 Min Nature Sounds Meditation - Relaxing Forest Morning Birds Chirping - Calm Sleeping Sound_1760864476540.mp3";

export interface Track {
  id: string;
  name: string;
  description?: string;
  color: string;
  audioSrc?: string;
  isCustom?: boolean;
}

export const defaultTracks: Track[] = [
  {
    id: "ocean-waves",
    name: "Ocean Waves",
    description: "Gentle waves lapping on the shore",
    color: "hsl(200, 60%, 75%)",
    audioSrc: oceanSoundsAudio,
  },
  {
    id: "rain",
    name: "Rainfall",
    description: "Soft rain on leaves",
    color: "hsl(210, 35%, 60%)",
    audioSrc: rainAudio,
  },
  {
    id: "wind-chimes",
    name: "Wind Chimes",
    description: "Peaceful chimes in the breeze",
    color: "hsl(280, 40%, 70%)",
    audioSrc: windChimesAudio,
  },
  {
    id: "fireplace",
    name: "Crackling Fire",
    description: "Warm fireplace sounds",
    color: "hsl(25, 75%, 65%)",
    audioSrc: fireplaceAudio,
  },
  {
    id: "white-noise",
    name: "White Noise",
    description: "Steady background hum",
    color: "hsl(220, 10%, 50%)",
    audioSrc: whiteNoiseAudio,
  },
  {
    id: "nature-sounds",
    name: "Nature Sounds",
    description: "Forest morning birds chirping",
    color: "hsl(120, 50%, 60%)",
    audioSrc: natureSoundsAudio,
  },
];

interface AudioContextType {
  playing: string | null;
  volume: number;
  togglePlay: (trackId: string) => void;
  setVolume: (volume: number) => void;
  currentTrack: Track | null;
  tracks: Track[];
  refreshCustomSounds: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch custom sounds
  const { data: customSounds = [], refetch: refreshCustomSounds } = useQuery<CustomSound[]>({
    queryKey: ["/api/custom-sounds"],
  });

  // Merge default tracks with custom sounds
  const tracks: Track[] = [
    ...defaultTracks,
    ...customSounds.map(sound => ({
      id: sound.id,
      name: sound.name,
      description: "Custom sound",
      color: "hsl(180, 50%, 60%)",
      audioSrc: sound.filePath,
      isCustom: true,
    }))
  ];

  const togglePlay = (trackId: string) => {
    if (playing === trackId) {
      setPlaying(null);
    } else {
      setPlaying(trackId);
    }
  };

  const currentTrack = playing ? tracks.find(t => t.id === playing) || null : null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      const track = tracks.find(t => t.id === playing);
      if (track?.audioSrc) {
        audio.src = track.audioSrc;
        audio.loop = true;
        audio.volume = volume / 100;
        audio.load();
        audio.play().catch(console.error);
      }
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [playing]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume / 100;
    }
  }, [volume]);

  return (
    <AudioContext.Provider value={{ 
      playing, 
      volume, 
      togglePlay, 
      setVolume, 
      currentTrack,
      tracks,
      refreshCustomSounds: () => refreshCustomSounds(),
    }}>
      {children}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
