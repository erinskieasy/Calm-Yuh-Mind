import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Sparkles, Circle, Brain } from "lucide-react";
import { MemoryGame } from "@/components/games/memory-game";
import { BreathingGame } from "@/components/games/breathing-game";
import { BubblePopGame } from "@/components/games/bubble-pop-game";

type GameType = "memory" | "breathing" | "bubbles" | null;

export default function MiniGames() {
  const [activeGame, setActiveGame] = useState<GameType>(null);

  const games = [
    {
      id: "memory" as const,
      title: "Memory Match",
      description: "Match peaceful icons to improve focus and memory",
      icon: Brain,
      color: "#81c784",
    },
    {
      id: "breathing" as const,
      title: "Breathing Rhythm",
      description: "Follow the breathing pattern to calm your mind",
      icon: Circle,
      color: "#64b5f6",
    },
    {
      id: "bubbles" as const,
      title: "Mindful Bubbles",
      description: "Pop bubbles to release stress and tension",
      icon: Sparkles,
      color: "#ba68c8",
    },
  ];

  if (activeGame) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold">Mini Games</h1>
          <Button
            variant="outline"
            onClick={() => setActiveGame(null)}
            data-testid="button-back-to-games"
          >
            Back to Games
          </Button>
        </div>

        {activeGame === "memory" && <MemoryGame />}
        {activeGame === "breathing" && <BreathingGame />}
        {activeGame === "bubbles" && <BubblePopGame />}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Mini Games</h1>
        <p className="text-muted-foreground mt-2">
          Take a mindful break with calming games designed for wellness
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <Card
              key={game.id}
              className="hover-elevate cursor-pointer"
              onClick={() => setActiveGame(game.id)}
              data-testid={`card-game-${game.id}`}
            >
              <CardHeader>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${game.color}20` }}
                >
                  <Icon className="w-8 h-8" style={{ color: game.color }} />
                </div>
                <CardTitle>{game.title}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveGame(game.id);
                  }}
                  data-testid={`button-play-${game.id}`}
                >
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Play Game
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
