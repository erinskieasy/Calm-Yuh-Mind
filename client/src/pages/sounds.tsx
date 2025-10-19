import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Play, Pause, Volume2, Upload, Trash2, Music } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Sounds() {
  const { playing, volume, togglePlay, setVolume, tracks, refreshCustomSounds } = useAudio();
  const [soundName, setSoundName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile || !soundName.trim()) {
        throw new Error("Please provide both a name and file");
      }

      const formData = new FormData();
      formData.append("audio", selectedFile);
      formData.append("name", soundName.trim());

      const response = await fetch("/api/custom-sounds", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload sound");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Sound uploaded!",
        description: "Your custom sound has been added successfully.",
      });
      setSoundName("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      refreshCustomSounds();
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (soundId: string) => {
      const response = await fetch(`/api/custom-sounds/${soundId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete sound");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Sound deleted",
        description: "Your custom sound has been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/custom-sounds"] });
      refreshCustomSounds();
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Could not delete the sound. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.includes("audio/mpeg") && !file.name.toLowerCase().endsWith(".mp3")) {
        toast({
          title: "Invalid file type",
          description: "Please select an MP3 file.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    uploadMutation.mutate();
  };

  const handleDelete = (soundId: string) => {
    if (playing === soundId) {
      togglePlay(soundId); // Stop playing before deleting
    }
    deleteMutation.mutate(soundId);
  };

  const defaultTracks = tracks.filter(t => !t.isCustom);
  const customTracks = tracks.filter(t => t.isCustom);

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

      <div>
        <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
          Built-in Sounds
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {defaultTracks.map((track) => {
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
                    disabled={!track.audioSrc}
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
                        {track.audioSrc ? "Play" : "Coming Soon"}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Music className="h-6 w-6" />
          Custom Sounds
        </h2>
        <p className="text-muted-foreground mb-6">
          Upload your own MP3 audio files to create a personalized playlist
        </p>

        <Card className="p-6 mb-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl font-display flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload New Sound
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Sound Name
              </label>
              <Input
                type="text"
                placeholder="e.g., My Favorite Meditation Track"
                value={soundName}
                onChange={(e) => setSoundName(e.target.value)}
                data-testid="input-sound-name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                MP3 File
              </label>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".mp3,audio/mpeg"
                onChange={handleFileChange}
                data-testid="input-sound-file"
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
            <Button
              onClick={handleUpload}
              disabled={!soundName.trim() || !selectedFile || uploadMutation.isPending}
              className="w-full"
              data-testid="button-upload-sound"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload Sound"}
            </Button>
          </CardContent>
        </Card>

        {customTracks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customTracks.map((track) => {
              const isPlaying = playing === track.id;
              return (
                <Card
                  key={track.id}
                  className="p-6 hover-elevate"
                  style={{
                    borderTop: `4px solid ${track.color}`,
                  }}
                  data-testid={`card-custom-sound-${track.id}`}
                >
                  <CardHeader className="px-0 pt-0 flex flex-row items-start justify-between gap-2">
                    <CardTitle className="text-lg font-display flex-1">
                      {track.name}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(track.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${track.id}`}
                      className="flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardHeader>
                  <CardContent className="px-0 pb-0 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {track.description}
                    </p>
                    <Button
                      className="w-full"
                      variant={isPlaying ? "default" : "outline"}
                      onClick={() => togglePlay(track.id)}
                      data-testid={`button-play-custom-${track.id}`}
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
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No custom sounds yet. Upload your first MP3 file above to get started!
            </p>
          </Card>
        )}
      </div>

      <div className="h-24" />
    </div>
  );
}
