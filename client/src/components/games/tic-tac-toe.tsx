import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

type Player = "X" | "O" | null;
type Board = Player[];

const calculateWinner = (board: Board): Player => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

const getBestMove = (board: Board): number => {
  // Simple AI: find winning move, block player, or take center/corners
  const emptyIndices = board.map((cell, i) => cell === null ? i : -1).filter(i => i !== -1);
  
  // Check if AI can win
  for (const index of emptyIndices) {
    const testBoard = [...board];
    testBoard[index] = "O";
    if (calculateWinner(testBoard) === "O") return index;
  }
  
  // Check if need to block player
  for (const index of emptyIndices) {
    const testBoard = [...board];
    testBoard[index] = "X";
    if (calculateWinner(testBoard) === "X") return index;
  }
  
  // Take center if available
  if (board[4] === null) return 4;
  
  // Take corners
  const corners = [0, 2, 6, 8].filter(i => board[i] === null);
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
  
  // Take any available
  return emptyIndices[0];
};

export function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState({ player: 0, ai: 0, draws: 0 });

  const winner = calculateWinner(board);
  const isBoardFull = board.every(cell => cell !== null);

  const handleClick = (index: number) => {
    if (board[index] || winner || gameOver || !isXNext) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsXNext(false);

    // Check if player won
    const playerWon = calculateWinner(newBoard);
    if (playerWon) {
      setGameOver(true);
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
      return;
    }

    // Check for draw
    if (newBoard.every(cell => cell !== null)) {
      setGameOver(true);
      setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
      return;
    }

    // AI move
    setTimeout(() => {
      const aiMove = getBestMove(newBoard);
      const aiBoard = [...newBoard];
      aiBoard[aiMove] = "O";
      setBoard(aiBoard);
      setIsXNext(true);

      // Check if AI won
      const aiWon = calculateWinner(aiBoard);
      if (aiWon) {
        setGameOver(true);
        setScore(prev => ({ ...prev, ai: prev.ai + 1 }));
        return;
      }

      // Check for draw
      if (aiBoard.every(cell => cell !== null)) {
        setGameOver(true);
        setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
      }
    }, 500);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
  };

  const getStatus = () => {
    if (winner === "X") return "You win! 🎉";
    if (winner === "O") return "AI wins!";
    if (isBoardFull || gameOver) return "It's a draw!";
    if (!isXNext) return "AI is thinking...";
    return "Your turn (X)";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tic Tac Toe</CardTitle>
        <CardDescription>Play against the AI and practice strategic thinking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-lg font-medium mb-2" data-testid="text-game-status">
            {getStatus()}
          </p>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <span data-testid="text-player-score">You: {score.player}</span>
            <span data-testid="text-draws">Draws: {score.draws}</span>
            <span data-testid="text-ai-score">AI: {score.ai}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-[300px] mx-auto">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              disabled={!!cell || !!winner || gameOver || !isXNext}
              className={`
                aspect-square rounded-lg border-2 
                text-4xl font-bold
                transition-all duration-200
                hover-elevate active-elevate-2
                ${cell === "X" ? "bg-primary/10 border-primary text-primary" : ""}
                ${cell === "O" ? "bg-accent/10 border-accent text-accent" : ""}
                ${!cell ? "bg-card border-border hover:border-primary/50" : ""}
                ${!cell && !winner && !gameOver && isXNext ? "cursor-pointer" : "cursor-not-allowed"}
              `}
              data-testid={`button-cell-${index}`}
            >
              {cell}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={resetGame}
            variant="outline"
            className="gap-2"
            data-testid="button-reset-game"
          >
            <RotateCcw className="h-4 w-4" />
            New Game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
