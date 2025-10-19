import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "inhale" | "hold" | "exhale" | "rest";

export function BreathingGame() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>("inhale");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);

  const phaseDurations: Record<Phase, number> = {
    inhale: 4000,
    hold: 4000,
    exhale: 4000,
    rest: 2000,
  };

  const phaseOrder: Phase[] = ["inhale", "hold", "exhale", "rest"];

  useEffect(() => {
    if (!isActive) return;

    const timer = setTimeout(() => {
      const currentIndex = phaseOrder.indexOf(phase);
      const nextIndex = (currentIndex + 1) % phaseOrder.length;
      const nextPhase = phaseOrder[nextIndex];
      
      setPhase(nextPhase);
      
      if (nextPhase === "inhale") {
        setRound((prev) => prev + 1);
        setScore((prev) => prev + 10);
      }
    }, phaseDurations[phase]);

    return () => clearTimeout(timer);
  }, [isActive, phase]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase("inhale");
    setScore(0);
    setRound(0);
  };

  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe Out";
      case "rest":
        return "Rest";
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "inhale":
        return "#64b5f6";
      case "hold":
        return "#81c784";
      case "exhale":
        return "#ba68c8";
      case "rest":
        return "#ffb74d";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Breathing Rhythm</CardTitle>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span data-testid="text-breathing-round">Round: {round}</span>
            <span data-testid="text-breathing-score">Score: {score}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center py-12 space-y-8">
          <div
            className={cn(
              "rounded-full transition-all duration-1000 flex items-center justify-center",
              phase === "inhale" && "w-48 h-48",
              phase === "hold" && "w-48 h-48",
              phase === "exhale" && "w-32 h-32",
              phase === "rest" && "w-32 h-32"
            )}
            style={{
              backgroundColor: `${getPhaseColor()}40`,
              border: `4px solid ${getPhaseColor()}`,
            }}
            data-testid="breathing-circle"
          >
            <div
              className="w-24 h-24 rounded-full"
              style={{ backgroundColor: getPhaseColor() }}
            />
          </div>

          <div className="text-center space-y-2">
            <p
              className="text-3xl font-bold"
              style={{ color: getPhaseColor() }}
              data-testid="text-breathing-phase"
            >
              {getPhaseText()}
            </p>
            <p className="text-sm text-muted-foreground">
              {isActive ? "Follow the circle" : "Press play to begin"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleToggle}
            className="flex-1"
            data-testid="button-toggle-breathing"
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start
              </>
            )}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            data-testid="button-reset-breathing"
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
