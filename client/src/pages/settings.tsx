import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Palette, Type, LogOut, User, Upload } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User as UserType } from "@shared/schema";
import { useRef, useState } from "react";
import flowerPfp from "@assets/Flower Pfp_1760870955852.jpg";
import leafPfp from "@assets/Leaf Pfp_1760870955897.jpg";
import moonPfp from "@assets/Moon Pfp_1760870955902.jpg";
import sunPfp from "@assets/Sun Profile_1760870955903.jpg";

const themes = [
  {
    id: "default",
    name: "Default",
    description: "Calming sage and sky blue",
    gradient: "linear-gradient(135deg, #5fba7d 0%, #42a5f5 100%)",
    preview: {
      primary: "#5fba7d",
      secondary: "#42a5f5",
    }
  },
  {
    id: "midnight-breeze",
    name: "Midnight Breeze",
    description: "Light blue to deep midnight",
    gradient: "linear-gradient(135deg, #4fc3f7 0%, #1e3a8a 100%)",
    preview: {
      primary: "#4fc3f7",
      secondary: "#1e3a8a",
    }
  },
  {
    id: "tropical-sunset",
    name: "Tropical Sunset",
    description: "Warm sunset oranges and reds",
    gradient: "linear-gradient(135deg, #ff7043 0%, #f44336 100%)",
    preview: {
      primary: "#ff7043",
      secondary: "#f44336",
    }
  },
  {
    id: "meadow-fields",
    name: "Meadow Fields",
    description: "Fresh meadow greens",
    gradient: "linear-gradient(135deg, #9ccc65 0%, #66bb6a 100%)",
    preview: {
      primary: "#9ccc65",
      secondary: "#66bb6a",
    }
  },
];

const fontStyles = [
  {
    id: "inter",
    name: "Inter",
    description: "Clean, modern sans-serif (default)",
    preview: "The quick brown fox",
  },
  {
    id: "georgia",
    name: "Georgia",
    description: "Classic serif font",
    preview: "The quick brown fox",
  },
  {
    id: "comic-sans",
    name: "Comic Sans",
    description: "Fun, playful style",
    preview: "The quick brown fox",
  },
  {
    id: "open-dyslexic",
    name: "OpenDyslexic",
    description: "Designed for dyslexia accessibility",
    preview: "The quick brown fox",
  },
];

const avatarPresets = [
  { id: "flower", image: flowerPfp, name: "Flower", color: "#FFB74D" },
  { id: "leaf", image: leafPfp, name: "Leaf", color: "#81C784" },
  { id: "moon", image: moonPfp, name: "Moon", color: "#FFD93D" },
  { id: "sun", image: sunPfp, name: "Sun", color: "#FF9800" },
];

export default function Settings() {
  const { theme, setTheme, fontStyle, setFontStyle } = useTheme();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: user } = useQuery<UserType>({
    queryKey: ['/api/auth/user'],
  });

  const updateProfilePictureMutation = useMutation({
    mutationFn: async (avatarId: string) => {
      const avatar = avatarPresets.find((a) => a.id === avatarId);
      if (!avatar) throw new Error("Avatar not found");
      
      return apiRequest(`/api/user/profile-picture`, {
        method: 'PATCH',
        body: JSON.stringify({ profileImageUrl: `preset:${avatarId}` }),
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: "Profile updated",
        description: "Your profile picture has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile picture. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await fetch('/api/user/profile-picture/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      await queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      toast({
        title: "Profile updated",
        description: "Your custom profile picture has been uploaded.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Customize your CalmYuhMind experience
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Picture
          </CardTitle>
          <CardDescription>
            Choose an avatar to represent you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-3">Default Avatars</p>
            <div className="grid grid-cols-4 gap-4">
              {avatarPresets.map((avatar) => {
                const isSelected = user?.profileImageUrl === `preset:${avatar.id}`;
                return (
                  <button
                    key={avatar.id}
                    onClick={() => updateProfilePictureMutation.mutate(avatar.id)}
                    disabled={updateProfilePictureMutation.isPending}
                    className={`
                      relative p-3 rounded-lg border-2 transition-all text-center
                      hover-elevate active-elevate-2
                      ${isSelected 
                        ? 'border-primary shadow-md' 
                        : 'border-border'
                      }
                    `}
                    data-testid={`button-avatar-${avatar.id}`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                    
                    <img 
                      src={avatar.image}
                      alt={avatar.name}
                      className="w-16 h-16 mx-auto mb-2 rounded-full object-cover"
                    />
                    
                    <p className="text-xs text-muted-foreground">{avatar.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-3">Custom Profile Picture</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              data-testid="input-profile-upload"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
              data-testid="button-upload-profile-picture"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload Your Own Image"}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Max 5MB. Recommended: Square image (1:1 ratio)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5" />
            Font Style
          </CardTitle>
          <CardDescription>
            Select a font that's comfortable for reading
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fontStyles.map((font) => (
              <button
                key={font.id}
                onClick={() => setFontStyle(font.id as any)}
                className={`
                  relative p-6 rounded-lg border-2 transition-all text-left
                  hover-elevate active-elevate-2
                  ${fontStyle === font.id 
                    ? 'border-primary shadow-md' 
                    : 'border-border'
                  }
                `}
                data-testid={`button-font-${font.id}`}
              >
                {fontStyle === font.id && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
                
                <h3 className="font-semibold text-lg mb-1">{font.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{font.description}</p>
                
                <div 
                  className={`font-${font.id} text-base p-3 bg-muted/30 rounded-md`}
                  style={{
                    fontFamily: font.id === 'inter' ? 'Inter, sans-serif' :
                                font.id === 'georgia' ? 'Georgia, serif' :
                                font.id === 'comic-sans' ? '"Comic Sans MS", cursive' :
                                '"OpenDyslexic", Verdana, sans-serif'
                  }}
                >
                  {font.preview}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            Account
          </CardTitle>
          <CardDescription>
            Manage your account settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full md:w-auto"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
