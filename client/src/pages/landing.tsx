import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, MessageCircle, Activity, Music, FileText } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground">
              CalmYuhMind
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Your personal companion for mental health and wellness
            </p>
            <p className="text-lg text-muted-foreground/80 max-w-xl mx-auto">
              Track your moods, journal your thoughts, practice mindfulness, and get AI-powered support—all in one calming space
            </p>
            <div className="pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-login"
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
            <Card className="hover-elevate">
              <CardHeader>
                <Activity className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Mood Tracking</CardTitle>
                <CardDescription>
                  Log your daily emotions and visualize patterns over time
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <FileText className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Digital Journal</CardTitle>
                <CardDescription>
                  Express your thoughts and feelings in a private, secure space
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <Brain className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Meditation</CardTitle>
                <CardDescription>
                  Guided breathing exercises and mindfulness practices
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <MessageCircle className="w-10 h-10 text-primary mb-2" />
                <CardTitle>AI Support</CardTitle>
                <CardDescription>
                  Compassionate AI companion for emotional support and coping strategies
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <Heart className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Self-Assessment</CardTitle>
                <CardDescription>
                  Evidence-based screenings to understand your mental health
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <Music className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Soothing Sounds</CardTitle>
                <CardDescription>
                  Calming ambient soundscapes to help you relax and focus
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Call to Action */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="font-display text-2xl font-semibold">
                Ready to start your wellness journey?
              </h2>
              <p className="text-muted-foreground">
                Sign in to access all features and begin tracking your mental health
              </p>
              <Button 
                size="lg"
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-login-cta"
              >
                Sign In
              </Button>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto pt-8 border-t">
            <strong>Important:</strong> Serenity is a wellness tool designed to support your mental health journey. 
            It is not a replacement for professional mental health care. If you're experiencing a crisis or need 
            immediate support, please contact a mental health professional or crisis helpline.
          </p>
        </div>
      </div>
    </div>
  );
}
