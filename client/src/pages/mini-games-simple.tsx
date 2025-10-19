import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2 } from "lucide-react";

export default function MiniGames() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Mini Games</h1>
        <p className="text-muted-foreground mt-2">
          Take a mindful break with calming games designed for wellness
        </p>
      </div>

      <Card>
        <CardHeader>
          <Gamepad2 className="w-12 h-12 text-primary mb-2" />
          <CardTitle>Mini Games Coming Soon</CardTitle>
          <CardDescription>
            Calming wellness-focused games will be available here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We're preparing Memory Match, Breathing Rhythm, and Mindful Bubbles games for you.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
