import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smile, BookOpen, BrainCircuit, TrendingUp } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MoodEntry, JournalEntry, MeditationSession } from "@shared/schema";

export default function Dashboard() {
  const { data: moods = [], isLoading: moodsLoading } = useQuery<MoodEntry[]>({
    queryKey: ["/api/moods"],
  });

  const { data: journals = [], isLoading: journalsLoading } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journals"],
  });

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery<MeditationSession[]>({
    queryKey: ["/api/meditation-sessions"],
  });

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const moodData = last7Days.map((date) => {
    const dayMoods = moods.filter((m) => m.date === date);
    const avgIntensity =
      dayMoods.length > 0
        ? dayMoods.reduce((sum, m) => sum + m.intensity, 0) / dayMoods.length
        : 0;
    return {
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      intensity: avgIntensity,
    };
  });

  const totalMeditation = sessions.reduce((sum, s) => sum + s.completed, 0);
  const journalStreak = journals.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-display font-semibold text-foreground mb-2">
          Welcome back
        </h1>
        <p className="text-muted-foreground text-lg">
          Here's how you've been doing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mood Entries</CardTitle>
            <Smile className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-semibold" data-testid="text-mood-count">
              {moods.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total tracked
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Journal Entries</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-semibold" data-testid="text-journal-count">
              {journalStreak}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Thoughts captured
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meditation Time</CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-semibold" data-testid="text-meditation-time">
              {totalMeditation}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Minutes practiced
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-semibold" data-testid="text-weekly-trend">
              {moods.length > 0 ? "Stable" : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Mood pattern
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl font-display">Mood Trends</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your emotional patterns over the last 7 days
          </p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {moodsLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Loading mood data...</p>
            </div>
          ) : moods.length === 0 ? (
            <div className="h-[300px] flex flex-col items-center justify-center text-center">
              <Smile className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No mood entries yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Start tracking your moods to see trends here
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moodData}>
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  domain={[0, 5]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="intensity"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
