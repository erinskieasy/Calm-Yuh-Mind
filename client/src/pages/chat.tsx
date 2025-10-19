import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ChatMessage } from "@shared/schema";

export default function Chat() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat"],
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest("POST", "/api/chat", { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat"] });
      setInput("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sendMessage.isPending) return;
    sendMessage.mutate(input.trim());
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-4xl font-display font-semibold text-foreground mb-2">
          AI Support
        </h1>
        <p className="text-muted-foreground text-lg">
          Talk to your compassionate AI wellness companion
        </p>
      </div>

      <Card className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading conversation...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Start a conversation with your AI companion
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Share what's on your mind, ask for coping strategies, or just chat
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
                data-testid={`message-${message.role}-${message.id}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-2xl p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p className="text-xs opacity-70 mt-2">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-accent-foreground" />
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className="resize-none"
            rows={2}
            disabled={sendMessage.isPending}
            data-testid="input-chat-message"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || sendMessage.isPending}
            data-testid="button-send-message"
          >
            {sendMessage.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
