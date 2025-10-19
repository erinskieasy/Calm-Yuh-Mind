import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User, Loader2, Mic, MicOff, Volume2, VolumeX, Play, Pause, Trash2, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ChatMessage } from "@shared/schema";

export default function Chat() {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const recordingRecognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat"],
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest("POST", "/api/chat", { content });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat"] });
      setInput("");
      
      // Auto-speak AI response
      if (autoSpeak && data?.assistant?.content) {
        speakText(data.assistant.content);
      }
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

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    }

    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        
        // Auto-send after voice input
        if (transcript.trim()) {
          setTimeout(() => {
            sendMessage.mutate(transcript.trim());
          }, 500);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          toast({
            title: "Microphone access denied",
            description: "Please allow microphone access to use voice input.",
            variant: "destructive",
          });
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, [toast]);

  const speakText = (text: string) => {
    if (!speechSynthesisRef.current) {
      toast({
        title: "Voice output not supported",
        description: "Your browser doesn't support voice output.",
        variant: "destructive",
      });
      return;
    }

    // Cancel any ongoing speech
    speechSynthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to use a more natural voice
    const voices = speechSynthesisRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Natural') ||
      voice.lang === 'en-US'
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesisRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const startRecording = async () => {
    try {
      // Initialize speech recognition for transcription
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        toast({
          title: "Voice recognition not supported",
          description: "Your browser doesn't support voice recognition. Try Chrome or Edge.",
          variant: "destructive",
        });
        return;
      }

      const recordingRecognition = new SpeechRecognition();
      recordingRecognition.continuous = true;
      recordingRecognition.interimResults = true;
      recordingRecognition.lang = 'en-US';

      let finalTranscript = '';

      recordingRecognition.onresult = (event: any) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscribedText(finalTranscript + interimTranscript);
      };

      recordingRecognition.onerror = (event: any) => {
        console.error('Recording recognition error:', event.error);
      };

      recordingRecognitionRef.current = recordingRecognition;

      // Start audio recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      // Start both recording and transcription
      mediaRecorder.start();
      recordingRecognition.start();
      setIsRecording(true);
      setTranscribedText('');
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast({
        title: "Recording failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (recordingRecognitionRef.current) {
      recordingRecognitionRef.current.stop();
    }
  };

  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setIsPlaying(false);
  };

  const sendVoiceNote = () => {
    if (!transcribedText.trim()) {
      toast({
        title: "No voice detected",
        description: "Could not transcribe your voice. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Send the transcribed text to AI
    sendMessage.mutate(transcribedText.trim());
    
    // Clean up after sending
    deleteRecording();
    setTranscribedText('');
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice input not supported",
        description: "Your browser doesn't support voice input. Try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Stop any ongoing speech before listening
      stopSpeaking();
      
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start recognition:', error);
        toast({
          title: "Voice input failed",
          description: "Could not start voice input. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-semibold text-foreground mb-2">
              AI Voice Support
            </h1>
            <p className="text-muted-foreground text-lg">
              Send voice notes with playback controls or type your message
            </p>
          </div>
          <Button
            variant={autoSpeak ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoSpeak(!autoSpeak)}
            className="gap-2"
            data-testid="button-toggle-auto-speak"
          >
            {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {autoSpeak ? "Voice On" : "Voice Off"}
          </Button>
        </div>
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
                Record a voice note or type your message
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Send voice notes, replay them, and get AI voice responses
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

        <div className="space-y-3">
          {isSpeaking && (
            <div className="flex items-center gap-2 text-primary animate-pulse" data-testid="indicator-ai-speaking">
              <Volume2 className="h-4 w-4" />
              <span className="text-sm">AI is speaking...</span>
              <Button
                variant="outline"
                size="sm"
                onClick={stopSpeaking}
                data-testid="button-stop-speaking"
              >
                Stop
              </Button>
            </div>
          )}
          
          {isListening && (
            <div className="flex items-center gap-2 text-destructive animate-pulse" data-testid="indicator-listening">
              <Mic className="h-4 w-4" />
              <span className="text-sm">Listening...</span>
            </div>
          )}

          {isRecording && (
            <div className="flex items-center gap-2 text-destructive animate-pulse" data-testid="indicator-recording">
              <Square className="h-4 w-4 fill-current" />
              <span className="text-sm">Recording voice note...</span>
            </div>
          )}

          {audioUrl && !isRecording && (
            <Card className="p-3" data-testid="voice-note-player">
              <div className="space-y-3">
                {transcribedText && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Transcribed text:</p>
                    <p className="text-sm">{transcribedText}</p>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={isPlaying ? pauseRecording : playRecording}
                    data-testid="button-play-pause-recording"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Your voice note</p>
                    <p className="text-xs text-muted-foreground">
                      {isPlaying ? "Playing..." : transcribedText ? "Ready to send" : "Transcribing..."}
                    </p>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={sendVoiceNote}
                    disabled={sendMessage.isPending || !transcribedText.trim()}
                    data-testid="button-send-voice-note"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Send
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={deleteRecording}
                    data-testid="button-delete-recording"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <audio
                ref={audioRef}
                src={audioUrl || undefined}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </Card>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              placeholder="Type a message or record a voice note..."
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
              disabled={sendMessage.isPending || isListening || isRecording || !!audioUrl}
              data-testid="input-chat-message"
            />
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                size="icon"
                variant={isRecording ? "destructive" : "default"}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={sendMessage.isPending || isSpeaking || isListening || !!audioUrl}
                data-testid="button-record-voice"
              >
                {isRecording ? (
                  <Square className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
              <Button
                type="submit"
                size="icon"
                variant="outline"
                disabled={!input.trim() || sendMessage.isPending || isListening || isRecording || !!audioUrl}
                data-testid="button-send-message"
              >
                {sendMessage.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
