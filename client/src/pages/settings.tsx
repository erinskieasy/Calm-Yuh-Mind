import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Palette } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

const themes = [
  {
    id: "default",
    name: "Default",
    description: "Calming sage and sky blue",
    gradient: "linear-gradient(135deg, #81c784 0%, #64b5f6 100%)",
    preview: {
      primary: "#81c784",
      secondary: "#64b5f6",
    }
  },
  {
    id: "midnight-breeze",
    name: "Midnight Breeze",
    description: "Light blue to deep midnight",
    gradient: "linear-gradient(135deg, #89d4f7 0%, #1e3a8a 100%)",
    preview: {
      primary: "#89d4f7",
      secondary: "#1e3a8a",
    }
  },
  {
    id: "tropical-sunset",
    name: "Tropical Sunset",
    description: "Warm sunset oranges and reds",
    gradient: "linear-gradient(135deg, #ff9068 0%, #fd4e50 100%)",
    preview: {
      primary: "#ff9068",
      secondary: "#fd4e50",
    }
  },
  {
    id: "meadow-fields",
    name: "Meadow Fields",
    description: "Fresh meadow greens",
    gradient: "linear-gradient(135deg, #a8e063 0%, #56ab2f 100%)",
    preview: {
      primary: "#a8e063",
      secondary: "#56ab2f",
    }
  },
];

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Customize your Serenity experience
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme & Colors
          </CardTitle>
          <CardDescription>
            Choose a color theme that brings you peace and comfort
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id as any)}
                className={`
                  relative p-6 rounded-lg border-2 transition-all text-left
                  hover-elevate active-elevate-2
                  ${theme === themeOption.id 
                    ? 'border-primary shadow-md' 
                    : 'border-border'
                  }
                `}
                data-testid={`button-theme-${themeOption.id}`}
              >
                {theme === themeOption.id && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
                
                <div 
                  className="w-full h-24 rounded-md mb-4 shadow-sm"
                  style={{ background: themeOption.gradient }}
                />
                
                <h3 className="font-semibold text-lg mb-1">{themeOption.name}</h3>
                <p className="text-sm text-muted-foreground">{themeOption.description}</p>
                
                <div className="flex gap-2 mt-3">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-border shadow-sm"
                    style={{ backgroundColor: themeOption.preview.primary }}
                  />
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-border shadow-sm"
                    style={{ backgroundColor: themeOption.preview.secondary }}
                  />
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">About Themes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Each theme is carefully designed to create a specific mood and atmosphere:
          </p>
          <ul className="space-y-2 ml-4">
            <li className="flex gap-2">
              <span className="text-foreground">•</span>
              <div>
                <strong className="text-foreground">Default:</strong> Our original calming sage and sky blue palette, 
                perfect for balanced mental wellness
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground">•</span>
              <div>
                <strong className="text-foreground">Midnight Breeze:</strong> Cool blues evoke tranquility and deep reflection, 
                ideal for evening meditation
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground">•</span>
              <div>
                <strong className="text-foreground">Tropical Sunset:</strong> Warm tones bring energy and optimism, 
                great for motivation and mood lifting
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground">•</span>
              <div>
                <strong className="text-foreground">Meadow Fields:</strong> Fresh greens promote growth and renewal, 
                perfect for journaling and self-reflection
              </div>
            </li>
          </ul>
          <p className="pt-2">
            Your theme preference is saved automatically and will persist across sessions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
