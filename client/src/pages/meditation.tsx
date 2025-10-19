import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, BrainCircuit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { MeditationSession, InsertMeditationSession } from "@shared/schema";

const exercises = [
  {
    id: "breathing-4-7-8",
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8 seconds",
    duration: 5,
    color: "hsl(200, 60%, 75%)",
  },
  {
    id: "box-breathing",
    name: "Box Breathing",
    description: "Inhale, hold, exhale, hold - 4 seconds each",
    duration: 5,
    color: "hsl(160, 45%, 65%)",
  },
  {
    id: "mindful-awareness",
    name: "Mindful Awareness",
    description: "Focus on the present moment with gentle awareness",
    duration: 10,
    color: "hsl(280, 40%, 70%)",
  },
  {
    id: "body-scan",
    name: "Body Scan",
    description: "Progressive relaxation through body awareness",
    duration: 15,
    color: "hsl(45, 85%, 70%)",
  },
];

export default function Meditation() {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const { toast } = useToast();

  const { data: sessions = [] } = useQuery<MeditationSession[]>({
    queryKey: ["/api/meditation-sessions"],
  });

  const saveSession = useMutation({
    mutationFn: async (data: InsertMeditationSession) => {
      return await apiRequest("POST", "/api/meditation-sessions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meditation-sessions"] });
    },
  });

  const exercise = exercises.find((e) => e.id === selectedExercise);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            if (exercise) {
              const today = new Date().toISOString().split("T")[0];
              saveSession.mutate({
                type: exercise.id,
                duration: exercise.duration,
                completed: exercise.duration,
                date: today,
              });
              toast({
                title: "Session complete!",
                description: "Great job on completing your meditation.",
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startExercise = () => {
    if (!exercise) return;
    setTimeLeft(exercise.duration * 60);
    setIsActive(true);
  };

  const togglePause = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    if (exercise) {
      setTimeLeft(exercise.duration * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const totalMinutes = sessions.reduce((sum, s) => sum + s.completed, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-display font-semibold text-foreground mb-2">
          Meditation
        </h1>
        <p className="text-muted-foreground text-lg">
          Find peace through guided practice
        </p>
      </div>

      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl font-display">Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <div>
              <p className="text-3xl font-display font-semibold">
                {totalMinutes} minutes
              </p>
              <p className="text-sm text-muted-foreground">
                Total meditation time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {!selectedExercise ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exercises.map((ex) => (
            <Card
              key={ex.id}
              className="p-6 cursor-pointer hover-elevate active-elevate-2"
              onClick={() => setSelectedExercise(ex.id)}
              style={{
                borderLeft: `4px solid ${ex.color}`,
              }}
              data-testid={`card-exercise-${ex.id}`}
            >
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl font-display">{ex.name}</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-2">
                <p className="text-muted-foreground">{ex.description}</p>
                <p className="text-sm font-medium text-primary">
                  {ex.duration} minutes
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <CardContent className="p-0 space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-display font-semibold">
                  {exercise?.name}
                </h2>
                <p className="text-muted-foreground">{exercise?.description}</p>
              </div>

              <div className="flex items-center justify-center">
                <div
                  className="w-64 h-64 rounded-full flex items-center justify-center relative"
                  style={{
                    background: `conic-gradient(${exercise?.color} ${
                      ((exercise!.duration * 60 - timeLeft) /
                        (exercise!.duration * 60)) *
                      100
                    }%, hsl(var(--muted)) 0%)`,
                  }}
                >
                  <div className="w-56 h-56 rounded-full bg-card flex items-center justify-center">
                    <p
                      className="text-5xl font-display font-semibold"
                      data-testid="text-timer"
                    >
                      {formatTime(timeLeft)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                {timeLeft === 0 || timeLeft === exercise!.duration * 60 ? (
                  <Button
                    size="lg"
                    onClick={startExercise}
                    data-testid="button-start"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Session
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={togglePause}
                      data-testid="button-pause"
                    >
                      {isActive ? (
                        <>
                          <Pause className="h-5 w-5 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 mr-2" />
                          Resume
                        </>
                      )}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={reset}
                      data-testid="button-reset"
                    >
                      <RotateCcw className="h-5 w-5 mr-2" />
                      Reset
                    </Button>
                  </>
                )}
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => {
                    setSelectedExercise(null);
                    setIsActive(false);
                    setTimeLeft(0);
                  }}
                  data-testid="button-back"
                >
                  Back to Exercises
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
