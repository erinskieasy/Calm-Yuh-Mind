import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import popSoundUrl from "@assets/Pop! Sound Effect_1760869241625.mp3";

type Bubble = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
};

const colors = ["#81c784", "#64b5f6", "#ba68c8", "#ffb74d", "#ff8a80"];

export function BubblePopGame() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [nextId, setNextId] = useState(0);
  const popSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    popSoundRef.current = new Audio(popSoundUrl);
    popSoundRef.current.volume = 0.4;
  }, []);

  const createBubble = (): Bubble => {
    return {
      id: nextId,
      x: Math.random() * 80 + 10,
      y: 100,
      size: Math.random() * 40 + 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 1.5 + 0.5,
    };
  };

  useEffect(() => {
    if (!isActive) return;

    const spawnInterval = setInterval(() => {
      setBubbles((prev) => {
        if (prev.length < 15) {
          setNextId((id) => id + 1);
          return [...prev, createBubble()];
        }
        return prev;
      });
    }, 800);

    return () => clearInterval(spawnInterval);
  }, [isActive, nextId]);

  useEffect(() => {
    if (!isActive) return;

    const moveInterval = setInterval(() => {
      setBubbles((prev) =>
        prev
          .map((bubble) => ({
            ...bubble,
            y: bubble.y - bubble.speed,
          }))
          .filter((bubble) => bubble.y > -10)
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, [isActive]);

  const handleBubbleClick = (id: number) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setScore((prev) => prev + 1);
    
    if (popSoundRef.current) {
      popSoundRef.current.currentTime = 0;
      popSoundRef.current.play().catch(() => {
        // Ignore errors if audio playback is blocked
      });
    }
  };

  const handleStart = () => {
    setIsActive(true);
    setScore(0);
    setBubbles([]);
    setNextId(0);
  };

  const handleStop = () => {
    setIsActive(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Mindful Bubbles</CardTitle>
          <div className="text-sm text-muted-foreground">
            <span data-testid="text-bubbles-score">Score: {score}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="relative w-full h-96 bg-gradient-to-b from-primary/5 to-primary/10 rounded-lg overflow-hidden"
          data-testid="bubble-game-area"
        >
          {bubbles.map((bubble) => (
            <button
              key={bubble.id}
              onClick={() => handleBubbleClick(bubble.id)}
              className={cn(
                "absolute rounded-full transition-all hover:scale-110 active:scale-90",
                "flex items-center justify-center cursor-pointer"
              )}
              style={{
                left: `${bubble.x}%`,
                bottom: `${bubble.y}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                backgroundColor: `${bubble.color}40`,
                border: `3px solid ${bubble.color}`,
              }}
              data-testid={`bubble-${bubble.id}`}
            >
              <div
                className="w-1/2 h-1/2 rounded-full"
                style={{
                  backgroundColor: `${bubble.color}60`,
                }}
              />
            </button>
          ))}
          
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground">
                Click bubbles to pop them and release stress
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!isActive ? (
            <Button
              onClick={handleStart}
              className="flex-1"
              data-testid="button-start-bubbles"
            >
              Start Game
            </Button>
          ) : (
            <Button
              onClick={handleStop}
              variant="outline"
              className="flex-1"
              data-testid="button-stop-bubbles"
            >
              Stop Game
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
