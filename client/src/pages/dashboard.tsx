import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smile, BookOpen, BrainCircuit, TrendingUp, Quote } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MoodEntry, JournalEntry, MeditationSession } from "@shared/schema";

const historicalQuotes = [
  { quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { quote: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { quote: "If life were predictable it would cease to be life, and be without flavor.", author: "Eleanor Roosevelt" },
  { quote: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { quote: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { quote: "Whoever is happy will make others happy too.", author: "Anne Frank" },
  { quote: "You will face many defeats in life, but never let yourself be defeated.", author: "Maya Angelou" },
  { quote: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln" },
  { quote: "Never let the fear of striking out keep you from playing the game.", author: "Babe Ruth" },
  { quote: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
  { quote: "Many of life's failures are people who did not realize how close they were to success when they gave up.", author: "Thomas Edison" },
  { quote: "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.", author: "Dr. Seuss" },
  { quote: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { quote: "In this life we cannot do great things. We can only do small things with great love.", author: "Mother Teresa" },
  { quote: "Only a life lived for others is a life worthwhile.", author: "Albert Einstein" },
  { quote: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
  { quote: "You may say I'm a dreamer, but I'm not the only one.", author: "John Lennon" },
  { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { quote: "An unexamined life is not worth living.", author: "Socrates" },
  { quote: "Your limitation—it's only your imagination.", author: "Unknown" },
  { quote: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "What we think, we become.", author: "Buddha" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "The mind is everything. What you think you become.", author: "Buddha" },
  { quote: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", author: "Buddha" },
  { quote: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
];

const getDailyQuote = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  return historicalQuotes[dayOfYear % historicalQuotes.length];
};

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
  const dailyQuote = getDailyQuote();

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

      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Quote className="h-8 w-8 text-primary flex-shrink-0 mt-1" data-testid="icon-quote" />
            <div className="space-y-2">
              <p className="text-lg font-medium italic text-foreground" data-testid="text-daily-quote">
                "{dailyQuote.quote}"
              </p>
              <p className="text-sm text-muted-foreground" data-testid="text-quote-author">
                — {dailyQuote.author}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
