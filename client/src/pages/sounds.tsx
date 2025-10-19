import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2 } from "lucide-react";
import oceanSoundsAudio from "@assets/Ocean Sounds_1760846545743.mp3";
import windChimesAudio from "@assets/Wind Chimes_1760847358473.mp3";

const tracks = [
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
  },
  {
    id: "forest",
    name: "Forest Ambience",
    description: "Birds chirping in the woods",
    color: "hsl(160, 45%, 65%)",
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
  },
  {
    id: "white-noise",
    name: "White Noise",
    description: "Steady background hum",
    color: "hsl(220, 10%, 50%)",
  },
];

export default function Sounds() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = (trackId: string) => {
    if (playing === trackId) {
      setPlaying(null);
    } else {
      setPlaying(trackId);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      const currentTrack = tracks.find(t => t.id === playing);
      if (currentTrack?.audioSrc) {
        audio.src = currentTrack.audioSrc;
        audio.play().catch(err => {
          console.error("Error playing audio:", err);
        });
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
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-display font-semibold text-foreground mb-2">
          Soothing Sounds
        </h1>
        <p className="text-muted-foreground text-lg">
          Relax with calming ambient soundscapes
        </p>
      </div>

      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl font-display flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Volume Control
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="flex items-center gap-4">
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={100}
              step={1}
              className="flex-1"
              data-testid="slider-volume"
            />
            <span className="text-sm font-medium w-12 text-right">
              {volume}%
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((track) => {
          const isPlaying = playing === track.id;
          return (
            <Card
              key={track.id}
              className="p-6 hover-elevate"
              style={{
                borderTop: `4px solid ${track.color}`,
              }}
              data-testid={`card-sound-${track.id}`}
            >
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-lg font-display">
                  {track.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-4">
                <p className="text-sm text-muted-foreground">
                  {track.description}
                </p>
                <Button
                  className="w-full"
                  variant={isPlaying ? "default" : "outline"}
                  onClick={() => togglePlay(track.id)}
                  data-testid={`button-play-${track.id}`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {playing && (
        <Card className="fixed bottom-0 left-0 right-0 p-4 rounded-none border-t">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: tracks.find((t) => t.id === playing)?.color,
                }}
              >
                <Play className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium">
                  {tracks.find((t) => t.id === playing)?.name}
                </p>
                <p className="text-sm text-muted-foreground">Now Playing</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => setPlaying(null)}
              data-testid="button-stop-player"
            >
              Stop
            </Button>
          </div>
        </Card>
      )}

      <audio
        ref={audioRef}
        loop
        preload="auto"
      />

      <div className="h-24" />
    </div>
  );
}
