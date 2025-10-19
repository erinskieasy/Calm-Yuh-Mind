import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { AudioProvider } from "@/contexts/AudioContext";
import { PersistentAudioPlayer } from "@/components/persistent-audio-player";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import MoodTracker from "@/pages/mood-tracker";
import Journal from "@/pages/journal";
import Meditation from "@/pages/meditation";
import Chat from "@/pages/chat";
import Assessment from "@/pages/assessment";
import Sounds from "@/pages/sounds";
import TherapistProfile from "@/pages/therapist-profile";
import FindTherapists from "@/pages/find-therapists";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/mood" component={MoodTracker} />
      <Route path="/journal" component={Journal} />
      <Route path="/meditation" component={Meditation} />
      <Route path="/chat" component={Chat} />
      <Route path="/assessment" component={Assessment} />
      <Route path="/sounds" component={Sounds} />
      <Route path="/therapist-profile" component={TherapistProfile} />
      <Route path="/find-therapists" component={FindTherapists} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="default">
        <AudioProvider>
          <TooltipProvider>
            <AuthenticatedApp style={style} />
            <Toaster />
          </TooltipProvider>
        </AudioProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function AuthenticatedApp({ style }: { style: Record<string, string> }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Router />;
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b gap-4">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-4">
              {user && (user as any).email && (
                <span className="text-sm text-muted-foreground" data-testid="text-user-email">
                  {(user as any).email}
                </span>
              )}
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = "/api/logout"}
                data-testid="button-logout"
              >
                Logout
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-8">
            <Router />
          </main>
        </div>
      </div>
      <PersistentAudioPlayer />
    </SidebarProvider>
  );
}

export default App;
