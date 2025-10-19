import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Smile, Frown, Meh, Laugh, Angry } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { MoodEntry, InsertMoodEntry } from "@shared/schema";

const moods = [
  { name: "joyful", icon: Laugh, color: "hsl(45, 85%, 70%)", label: "Joyful" },
  { name: "calm", icon: Smile, color: "hsl(200, 60%, 75%)", label: "Calm" },
  { name: "neutral", icon: Meh, color: "hsl(210, 35%, 60%)", label: "Neutral" },
  { name: "anxious", icon: Frown, color: "hsl(280, 40%, 70%)", label: "Anxious" },
  { name: "sad", icon: Angry, color: "hsl(210, 35%, 60%)", label: "Sad" },
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState("");
  const { toast } = useToast();

  const { data: moodEntries = [], isLoading } = useQuery<MoodEntry[]>({
    queryKey: ["/api/moods"],
  });

  const createMood = useMutation({
    mutationFn: async (data: InsertMoodEntry) => {
      return await apiRequest("POST", "/api/moods", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/moods"] });
      toast({
        title: "Mood logged",
        description: "Your mood has been recorded successfully.",
      });
      setSelectedMood(null);
      setIntensity(3);
      setNote("");
    },
  });

  const handleSubmit = () => {
    if (!selectedMood) return;
    
    const today = new Date().toISOString().split("T")[0];
    createMood.mutate({
      date: today,
      mood: selectedMood,
      intensity,
      note: note || undefined,
    });
  };

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split("T")[0];
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-display font-semibold text-foreground mb-2">
          Mood Tracker
        </h1>
        <p className="text-muted-foreground text-lg">
          How are you feeling today?
        </p>
      </div>

      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl font-display">Log Your Mood</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0 space-y-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {moods.map((mood) => {
              const Icon = mood.icon;
              const isSelected = selectedMood === mood.name;
              return (
                <button
                  key={mood.name}
                  onClick={() => setSelectedMood(mood.name)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all hover-elevate ${
                    isSelected ? "ring-4 ring-primary" : ""
                  }`}
                  style={{
                    backgroundColor: isSelected
                      ? `${mood.color}20`
                      : "hsl(var(--card))",
                  }}
                  data-testid={`button-mood-${mood.name}`}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: mood.color }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-sm font-medium">{mood.label}</span>
                </button>
              );
            })}
          </div>

          {selectedMood && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Intensity: {intensity}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full accent-primary"
                  data-testid="input-intensity"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Mild</span>
                  <span>Intense</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Note (optional)
                </label>
                <Textarea
                  placeholder="What's on your mind?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="resize-none"
                  rows={3}
                  data-testid="input-mood-note"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={createMood.isPending}
                className="w-full"
                data-testid="button-save-mood"
              >
                {createMood.isPending ? "Saving..." : "Save Mood Entry"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl font-display">Mood Calendar</CardTitle>
          <p className="text-sm text-muted-foreground">Last 30 days</p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-7 md:grid-cols-10 gap-2">
              {last30Days.map((date) => {
                const dayMood = moodEntries.find((m) => m.date === date);
                const moodConfig = moods.find((m) => m.name === dayMood?.mood);
                return (
                  <div
                    key={date}
                    className="aspect-square rounded-lg flex items-center justify-center text-xs"
                    style={{
                      backgroundColor: dayMood
                        ? `${moodConfig?.color}40`
                        : "hsl(var(--muted))",
                    }}
                    title={date}
                    data-testid={`calendar-day-${date}`}
                  >
                    {new Date(date).getDate()}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
