import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useAudio } from "@/contexts/AudioContext";
import { useState } from "react";

export function PersistentAudioPlayer() {
  const { playing, volume, togglePlay, setVolume, currentTrack } = useAudio();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  if (!playing || !currentTrack) {
    return null;
  }

  return (
    <Card className="fixed bottom-0 left-0 right-0 p-3 rounded-none border-t z-50 bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: currentTrack.color,
            }}
          >
            <Play className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate" data-testid="text-now-playing">
              {currentTrack.name}
            </p>
            <p className="text-xs text-muted-foreground">Now Playing</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {showVolumeSlider && (
            <div className="flex items-center gap-2 w-32">
              <Slider
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                max={100}
                step={1}
                className="flex-1"
                data-testid="slider-mini-volume"
              />
              <span className="text-xs w-8 text-right">{volume}%</span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
            data-testid="button-toggle-volume"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => togglePlay(playing)}
            data-testid="button-pause-player"
          >
            <Pause className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => togglePlay(playing)}
            data-testid="button-stop-mini-player"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
