import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin, Mail, Phone, Globe, Video, Users, Award } from "lucide-react";
import type { TherapistProfile, User } from "@shared/schema";

interface TherapistWithUser extends TherapistProfile {
  user: User;
  distance?: number;
}

export default function FindTherapists() {
  const { toast } = useToast();
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [maxDistance, setMaxDistance] = useState("50");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [onlyVirtual, setOnlyVirtual] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const queryParams = new URLSearchParams();
  if (latitude && longitude) {
    queryParams.append("latitude", latitude.toString());
    queryParams.append("longitude", longitude.toString());
    queryParams.append("maxDistance", maxDistance);
  }
  if (specialtyFilter) {
    queryParams.append("specialties", specialtyFilter);
  }
  if (onlyVirtual) {
    queryParams.append("offersVirtual", "true");
  }

  const { data: therapists = [], isLoading } = useQuery<TherapistWithUser[]>({
    queryKey: ["/api/therapists/nearby", queryParams.toString()],
    queryFn: async () => {
      const res = await fetch(`/api/therapists/nearby?${queryParams.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch therapists");
      return res.json();
    },
  });

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setIsGettingLocation(false);
          toast({ title: "Location detected successfully" });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Failed to get location",
            description: "Please enable location permissions",
            variant: "destructive",
          });
          setIsGettingLocation(false);
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      setIsGettingLocation(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Find Mental Health Specialists</h1>
        <p className="text-muted-foreground mt-2">
          Connect with licensed therapists and mental health professionals near you
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Filters</CardTitle>
          <CardDescription>Refine your search to find the right specialist</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Location</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="flex-1"
                data-testid="button-get-location"
              >
                {isGettingLocation ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Getting location...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 mr-2" />
                    Use My Location
                  </>
                )}
              </Button>
              {latitude && longitude && (
                <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
                  <span data-testid="text-location-status">Location detected</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="distance">Max Distance (km)</Label>
            <Input
              id="distance"
              type="number"
              min="1"
              max="500"
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
              disabled={!latitude || !longitude}
              data-testid="input-distance"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty</Label>
            <Input
              id="specialty"
              placeholder="e.g., Anxiety, Depression, Trauma"
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              data-testid="input-specialty-filter"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="virtual"
              checked={onlyVirtual}
              onCheckedChange={setOnlyVirtual}
              data-testid="switch-virtual-only"
            />
            <Label htmlFor="virtual">Virtual sessions only</Label>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {therapists.length} {therapists.length === 1 ? "Specialist" : "Specialists"} Found
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-96">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : therapists.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                No therapists found matching your criteria.{" "}
                {!latitude && !longitude && "Try enabling location to see nearby specialists."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {therapists.map((therapist) => (
              <Card
                key={therapist.id}
                className="hover-elevate active-elevate-2"
                data-testid={`card-therapist-${therapist.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {therapist.user.firstName} {therapist.user.lastName}
                        {therapist.credentials && (
                          <Badge variant="secondary" className="font-normal">
                            {therapist.credentials}
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {therapist.city && therapist.state && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {therapist.city}, {therapist.state}
                            {therapist.distance && (
                              <span className="ml-2 font-medium" data-testid={`text-distance-${therapist.id}`}>
                                ({therapist.distance.toFixed(1)} km away)
                              </span>
                            )}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    {therapist.acceptingClients && (
                      <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                        Accepting Clients
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {therapist.bio && (
                    <p className="text-sm text-muted-foreground" data-testid={`text-bio-${therapist.id}`}>
                      {therapist.bio}
                    </p>
                  )}

                  {therapist.specialties && therapist.specialties.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Specialties</Label>
                      <div className="flex flex-wrap gap-2" data-testid={`specialties-${therapist.id}`}>
                        {therapist.specialties.map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {therapist.yearsExperience && (
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        {therapist.yearsExperience} years experience
                      </span>
                    )}
                    {therapist.offersVirtualSessions && (
                      <span className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        Virtual sessions
                      </span>
                    )}
                    {therapist.offersInPerson && (
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        In-person sessions
                      </span>
                    )}
                  </div>

                  <Separator />

                  <div className="flex flex-wrap gap-3 text-sm">
                    {therapist.phoneNumber && (
                      <a
                        href={`tel:${therapist.phoneNumber}`}
                        className="flex items-center gap-1 text-primary hover:underline"
                        data-testid={`link-phone-${therapist.id}`}
                      >
                        <Phone className="w-4 h-4" />
                        {therapist.phoneNumber}
                      </a>
                    )}
                    {therapist.user.email && (
                      <a
                        href={`mailto:${therapist.user.email}`}
                        className="flex items-center gap-1 text-primary hover:underline"
                        data-testid={`link-email-${therapist.id}`}
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </a>
                    )}
                    {therapist.website && (
                      <a
                        href={therapist.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                        data-testid={`link-website-${therapist.id}`}
                      >
                        <Globe className="w-4 h-4" />
                        Website
                      </a>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    data-testid={`button-request-consultation-${therapist.id}`}
                  >
                    Request Consultation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
