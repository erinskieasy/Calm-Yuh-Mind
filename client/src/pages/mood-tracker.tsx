import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Smile, Frown, Meh, Laugh, Angry, Calendar as CalendarIcon, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { MoodEntry, InsertMoodEntry } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";

const moods = [
  { name: "joyful", icon: Laugh, color: "hsl(45, 85%, 70%)", label: "Joyful", value: 5 },
  { name: "calm", icon: Smile, color: "hsl(200, 60%, 75%)", label: "Calm", value: 4 },
  { name: "neutral", icon: Meh, color: "hsl(210, 35%, 60%)", label: "Neutral", value: 3 },
  { name: "anxious", icon: Frown, color: "hsl(280, 40%, 70%)", label: "Anxious", value: 2 },
  { name: "sad", icon: Angry, color: "hsl(210, 35%, 60%)", label: "Sad", value: 1 },
];

// Helper function to calculate average mood for a day
const calculateAverageMood = (entries: MoodEntry[]) => {
  if (entries.length === 0) return null;
  if (entries.length === 1) return entries[0];
  
  // Calculate weighted average: (mood value * intensity) for each entry
  let totalWeightedValue = 0;
  let totalWeight = 0;
  
  entries.forEach(entry => {
    const moodConfig = moods.find(m => m.name === entry.mood);
    if (moodConfig) {
      const weight = entry.intensity;
      totalWeightedValue += moodConfig.value * weight;
      totalWeight += weight;
    }
  });
  
  const avgValue = totalWeightedValue / totalWeight;
  
  // Find the closest mood to the average value
  const closestMood = moods.reduce((prev, curr) => {
    return Math.abs(curr.value - avgValue) < Math.abs(prev.value - avgValue) ? curr : prev;
  });
  
  // Calculate average intensity
  const avgIntensity = Math.round(
    entries.reduce((sum, e) => sum + e.intensity, 0) / entries.length
  );
  
  // Return a synthetic entry representing the average
  return {
    ...entries[0], // Use first entry as template
    mood: closestMood.name,
    intensity: avgIntensity,
    note: `${entries.length} mood entries today`,
  };
};

interface BubbleProps {
  Icon: LucideIcon;
  color: string;
  delay: number;
}

function Bubble({ Icon, color, delay }: BubbleProps) {
  const randomX = Math.random() * 200 - 100;
  const randomRotate = Math.random() * 360;
  
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 0, 
        x: 0,
        scale: 0.5,
        rotate: 0
      }}
      animate={{ 
        opacity: [0, 1, 1, 0], 
        y: -200,
        x: randomX,
        scale: [0.5, 1.2, 1, 0.8],
        rotate: randomRotate
      }}
      transition={{ 
        duration: 2,
        delay,
        ease: "easeOut"
      }}
      className="absolute pointer-events-none"
      style={{
        left: "50%",
        top: "50%",
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        style={{ backgroundColor: color }}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
    </motion.div>
  );
}

export default function MoodTracker() {
  const currentDate = new Date();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState("");
  const [showBubbles, setShowBubbles] = useState(false);
  const [bubbleMood, setBubbleMood] = useState<{ icon: LucideIcon; color: string } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: moodEntries = [], isLoading } = useQuery<MoodEntry[]>({
    queryKey: ["/api/moods", selectedMonth, selectedYear],
    queryFn: async () => {
      const response = await fetch(`/api/moods?month=${selectedMonth}&year=${selectedYear}`);
      if (!response.ok) throw new Error("Failed to fetch moods");
      return response.json();
    },
  });

  // Group moods by date for daily averaging
  const moodsByDate = useMemo(() => {
    const grouped = new Map<string, MoodEntry[]>();
    moodEntries.forEach(entry => {
      const existing = grouped.get(entry.date) || [];
      grouped.set(entry.date, [...existing, entry]);
    });
    return grouped;
  }, [moodEntries]);

  // Calculate daily average moods
  const dailyAverageMoods = useMemo(() => {
    const averages = new Map<string, MoodEntry>();
    moodsByDate.forEach((entries, date) => {
      const avg = calculateAverageMood(entries);
      if (avg) {
        averages.set(date, avg);
      }
    });
    return averages;
  }, [moodsByDate]);

  const createMood = useMutation({
    mutationFn: async (data: InsertMoodEntry) => {
      return await apiRequest("POST", "/api/moods", data);
    },
    onSuccess: () => {
      const currentMoodConfig = moods.find((m) => m.name === selectedMood);
      if (currentMoodConfig) {
        setBubbleMood({ icon: currentMoodConfig.icon, color: currentMoodConfig.color });
        setShowBubbles(true);
        setTimeout(() => setShowBubbles(false), 2500);
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/moods", selectedMonth, selectedYear] });
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

  // Calculate days for selected month
  const daysInSelectedMonth = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(selectedYear, selectedMonth - 1, i + 1);
      return date.toISOString().split("T")[0];
    });
  }, [selectedMonth, selectedYear]);

  // Calculate statistics for selected month
  const monthStats = useMemo(() => {
    const moodCounts: Record<string, number> = {};
    let totalIntensity = 0;
    
    moodEntries.forEach((entry) => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      totalIntensity += entry.intensity;
    });

    const totalEntries = moodEntries.length;
    const avgIntensity = totalEntries > 0 ? (totalIntensity / totalEntries).toFixed(1) : "0";
    const mostFrequentMood = Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0]?.[0];

    return {
      totalEntries,
      avgIntensity,
      mostFrequentMood,
      moodCounts,
    };
  }, [moodEntries]);

  // Generate years for selector (30 years past to 30 years future)
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 30;
    const endYear = currentYear + 30;
    const totalYears = endYear - startYear + 1;
    return Array.from({ length: totalYears }, (_, i) => startYear + i).reverse();
  }, []);

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const selectedDateMoods = useMemo(() => {
    if (!selectedDate) return [];
    return moodsByDate.get(selectedDate) || [];
  }, [selectedDate, moodsByDate]);

  const selectedDateAverage = useMemo(() => {
    if (!selectedDate) return null;
    return dailyAverageMoods.get(selectedDate) || null;
  }, [selectedDate, dailyAverageMoods]);

  const selectedDateAverageConfig = useMemo(() => {
    if (!selectedDateAverage) return null;
    return moods.find((m) => m.name === selectedDateAverage.mood);
  }, [selectedDateAverage]);

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

      <Card className="p-6 relative overflow-visible">
        <AnimatePresence>
          {showBubbles && bubbleMood && (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <Bubble
                  key={i}
                  Icon={bubbleMood.icon}
                  color={bubbleMood.color}
                  delay={i * 0.15}
                />
              ))}
            </>
          )}
        </AnimatePresence>
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
        <CardHeader className="px-0 pt-0 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="text-xl font-display flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Mood Calendar
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                View your mood history
              </p>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger className="w-36" data-testid="select-month">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-28" data-testid="select-year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Statistics for selected month */}
          {!isLoading && monthStats.totalEntries > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total Entries</p>
                <p className="text-2xl font-semibold" data-testid="text-total-entries">
                  {monthStats.totalEntries}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Avg. Intensity</p>
                <p className="text-2xl font-semibold" data-testid="text-avg-intensity">
                  {monthStats.avgIntensity}/5
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Most Frequent</p>
                <p className="text-2xl font-semibold capitalize" data-testid="text-most-frequent">
                  {monthStats.mostFrequentMood || "—"}
                </p>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {daysInSelectedMonth.map((date) => {
                const dayAverage = dailyAverageMoods.get(date);
                const moodConfig = dayAverage ? moods.find((m) => m.name === dayAverage.mood) : null;
                const dayEntries = moodsByDate.get(date) || [];
                const entriesCount = dayEntries.length;
                
                return (
                  <button
                    key={date}
                    onClick={() => handleDateClick(date)}
                    className="aspect-square rounded-lg flex flex-col items-center justify-center text-xs gap-0.5 hover-elevate active-elevate-2 transition-all cursor-pointer"
                    style={{
                      backgroundColor: dayAverage
                        ? `${moodConfig?.color}40`
                        : "hsl(var(--muted))",
                    }}
                    title={`${date}${dayAverage ? ` - ${moodConfig?.label} (${dayAverage.intensity}/5)${entriesCount > 1 ? ` - ${entriesCount} entries` : ''}` : " - Click to view"}`}
                    data-testid={`calendar-day-${date}`}
                  >
                    <span className="font-medium">{new Date(date).getDate()}</span>
                    {dayAverage && moodConfig && (
                      <div className="flex items-center gap-0.5">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: moodConfig.color }}
                        />
                        {entriesCount > 1 && (
                          <span className="text-[10px] font-semibold">{entriesCount}</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
          
          {!isLoading && monthStats.totalEntries === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No mood entries for this month yet.</p>
              <p className="text-sm mt-1">Start tracking your mood above!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Date Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent data-testid="dialog-date-details">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedDateMoods.length > 0 ? (
              <>
                {/* Show average if multiple entries */}
                {selectedDateMoods.length > 1 && selectedDateAverage && selectedDateAverageConfig && (
                  <div className="p-4 rounded-lg border-2 border-primary/30" style={{ backgroundColor: `${selectedDateAverageConfig.color}10` }}>
                    <p className="text-xs font-medium text-muted-foreground mb-2">DAILY AVERAGE</p>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: selectedDateAverageConfig.color }}
                      >
                        {(() => {
                          const Icon = selectedDateAverageConfig.icon;
                          return <Icon className="w-6 h-6 text-white" />;
                        })()}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold capitalize">{selectedDateAverageConfig.label}</h3>
                        <p className="text-sm text-muted-foreground">
                          Average Intensity: {selectedDateAverage.intensity}/5 · {selectedDateMoods.length} entries
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show all entries */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">
                    {selectedDateMoods.length > 1 ? 'All Entries' : 'Mood Entry'}
                  </h4>
                  {selectedDateMoods.map((entry, index) => {
                    const config = moods.find(m => m.name === entry.mood);
                    if (!config) return null;
                    
                    return (
                      <div key={entry.id} className="p-3 rounded-lg" style={{ backgroundColor: `${config.color}15` }}>
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: config.color }}
                          >
                            {(() => {
                              const Icon = config.icon;
                              return <Icon className="w-5 h-5 text-white" />;
                            })()}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold capitalize">{config.label}</h3>
                            <p className="text-xs text-muted-foreground">
                              Intensity: {entry.intensity}/5 · {new Date(entry.createdAt).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                        {entry.note && (
                          <p className="text-sm text-muted-foreground bg-background/50 p-2 rounded">
                            {entry.note}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-lg mb-2">No mood logged for this date</p>
                <p className="text-sm">Use the form above to log your mood.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
