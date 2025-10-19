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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import FindTherapists from "@/pages/find-therapists";
import MiniGames from "@/pages/mini-games";
import Settings from "@/pages/settings";
import AnonForum from "@/pages/anon-forum";
import NotFound from "@/pages/not-found";
import flowerPfp from "@assets/Flower Pfp_1760870955852.jpg";
import leafPfp from "@assets/Leaf Pfp_1760870955897.jpg";
import moonPfp from "@assets/Moon Pfp_1760870955902.jpg";
import sunPfp from "@assets/Sun Profile_1760870955903.jpg";

const avatarPresetMap: Record<string, string> = {
  "preset:flower": flowerPfp,
  "preset:leaf": leafPfp,
  "preset:moon": moonPfp,
  "preset:sun": sunPfp,
};

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
      <Route path="/mood-tracker" component={MoodTracker} />
      <Route path="/journal" component={Journal} />
      <Route path="/meditation" component={Meditation} />
      <Route path="/chat" component={Chat} />
      <Route path="/assessment" component={Assessment} />
      <Route path="/sounds" component={Sounds} />
      <Route path="/find-therapists" component={FindTherapists} />
      <Route path="/mini-games" component={MiniGames} />
      <Route path="/anon-forum" component={AnonForum} />
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
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8" data-testid="avatar-user">
                    {(user as any).profileImageUrl && (
                      <AvatarImage 
                        src={avatarPresetMap[(user as any).profileImageUrl] || (user as any).profileImageUrl}
                        alt="Profile"
                      />
                    )}
                    <AvatarFallback className="text-lg">
                      {(user as any).email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground" data-testid="text-user-email">
                    {(user as any).email}
                  </span>
                </div>
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
