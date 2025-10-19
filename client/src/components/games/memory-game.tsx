import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Smile, Sun, Moon, Star, Cloud, Flower, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = [Heart, Smile, Sun, Moon, Star, Cloud, Flower, Leaf];

type CardType = {
  id: number;
  icon: typeof Heart;
  isFlipped: boolean;
  isMatched: boolean;
};

export function MemoryGame() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const initializeGame = () => {
    const gameCards: CardType[] = [];
    icons.forEach((icon, index) => {
      gameCards.push(
        { id: index * 2, icon, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, icon, isFlipped: false, isMatched: false }
      );
    });
    
    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }
    
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setIsWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards.find((c) => c.id === first);
      const secondCard = cards.find((c) => c.id === second);

      if (firstCard?.icon === secondCard?.icon) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first || card.id === second
                ? { ...card, isMatched: true, isFlipped: true }
                : card
            )
          );
          setMatches((prev) => prev + 1);
          setFlippedCards([]);
          
          if (matches + 1 === icons.length) {
            setIsWon(true);
          }
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first || card.id === second
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards, matches]);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return;
    
    const card = cards.find((c) => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
    );
    setFlippedCards((prev) => [...prev, id]);
    
    if (flippedCards.length === 1) {
      setMoves((prev) => prev + 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Memory Match</CardTitle>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span data-testid="text-moves">Moves: {moves}</span>
            <span data-testid="text-matches">Matches: {matches}/{icons.length}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isWon && (
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <p className="text-lg font-semibold text-primary">
              🎉 Congratulations! You won in {moves} moves!
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-4 gap-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={cn(
                  "aspect-square rounded-lg flex items-center justify-center transition-all active-elevate-2",
                  card.isFlipped || card.isMatched
                    ? "bg-primary/20"
                    : "bg-muted hover-elevate"
                )}
                disabled={card.isFlipped || card.isMatched}
                data-testid={`card-memory-${card.id}`}
              >
                {(card.isFlipped || card.isMatched) && (
                  <Icon className="w-8 h-8 text-primary" />
                )}
              </button>
            );
          })}
        </div>

        <Button
          onClick={initializeGame}
          className="w-full"
          data-testid="button-restart-memory"
        >
          New Game
        </Button>
      </CardContent>
    </Card>
  );
}
