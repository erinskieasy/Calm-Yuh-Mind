import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { JournalEntry, InsertJournalEntry } from "@shared/schema";

export default function Journal() {
  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const { data: entries = [], isLoading } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journals"],
  });

  const createEntry = useMutation({
    mutationFn: async (data: InsertJournalEntry) => {
      return await apiRequest("POST", "/api/journals", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journals"] });
      toast({
        title: "Entry saved",
        description: "Your journal entry has been saved.",
      });
      setTitle("");
      setContent("");
      setIsWriting(false);
    },
  });

  const deleteEntry = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/journals/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journals"] });
      toast({
        title: "Entry deleted",
        description: "Your journal entry has been removed.",
      });
    },
  });

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please add both a title and content.",
        variant: "destructive",
      });
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    createEntry.mutate({
      title: title.trim(),
      content: content.trim(),
      date: today,
      mood: undefined,
    });
  };

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-semibold text-foreground mb-2">
            Journal
          </h1>
          <p className="text-muted-foreground text-lg">
            Express your thoughts and feelings
          </p>
        </div>
        <Button
          onClick={() => setIsWriting(!isWriting)}
          data-testid="button-new-entry"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </div>

      {isWriting && (
        <Card className="p-6 animate-in fade-in duration-300">
          <CardContent className="p-0 space-y-4">
            <Input
              placeholder="Entry title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-display"
              data-testid="input-journal-title"
            />
            <Textarea
              placeholder="What's on your mind? Write freely..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] resize-none leading-relaxed"
              data-testid="input-journal-content"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsWriting(false);
                  setTitle("");
                  setContent("");
                }}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createEntry.isPending}
                data-testid="button-save-entry"
              >
                {createEntry.isPending ? "Saving..." : "Save Entry"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Loading entries...</p>
          </div>
        ) : entries.length === 0 ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No journal entries yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Start writing to capture your thoughts
              </p>
            </div>
          </Card>
        ) : (
          sortedEntries.map((entry) => (
            <Card
              key={entry.id}
              className="p-6 hover-elevate"
              data-testid={`card-journal-${entry.id}`}
            >
              <CardHeader className="px-0 pt-0 flex flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl font-display mb-1">
                    {entry.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteEntry.mutate(entry.id)}
                  disabled={deleteEntry.isPending}
                  data-testid={`button-delete-${entry.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
