import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { MessageCircle, Trophy, Palette, Music, Heart, Sparkles, ChevronRight } from "lucide-react";
import type { Forum } from "@shared/schema";

const iconMap: Record<string, any> = {
  MessageCircle,
  Trophy,
  Palette,
  Music,
  Heart,
  Sparkles,
};

export default function ForumPage() {
  const { data: forums, isLoading } = useQuery<Forum[]>({
    queryKey: ["/api/forums"],
  });

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto bg-background">
        <div className="p-6 max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Community Forums</h1>
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-8 bg-muted rounded mb-3" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Community Forums</h1>
          <p className="text-muted-foreground">
            Connect anonymously with others in a safe, supportive space
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {forums?.map((forum) => {
            const Icon = iconMap[forum.icon] || MessageCircle;
            return (
              <Link key={forum.id} href={`/forum/${forum.id}`}>
                <Card
                  className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer group"
                  data-testid={`card-forum-${forum.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                          {forum.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {forum.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
