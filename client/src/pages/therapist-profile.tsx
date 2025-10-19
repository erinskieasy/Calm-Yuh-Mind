import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Loader2, MapPin, Plus, X } from "lucide-react";

const profileFormSchema = z.object({
  bio: z.string().optional(),
  credentials: z.string().optional(),
  specialties: z.array(z.string()).default([]),
  yearsExperience: z.coerce.number().min(0).optional().nullable(),
  acceptingClients: z.boolean().default(true),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().default("USA"),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  phoneNumber: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  offersVirtualSessions: z.boolean().default(true),
  offersInPerson: z.boolean().default(true),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function TherapistProfile() {
  const { toast } = useToast();
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const { data: profile, isLoading } = useQuery<any>({
    queryKey: ["/api/therapist/profile"],
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      bio: "",
      credentials: "",
      specialties: [],
      acceptingClients: true,
      country: "USA",
      offersVirtualSessions: true,
      offersInPerson: true,
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        bio: profile.bio || "",
        credentials: profile.credentials || "",
        specialties: profile.specialties || [],
        yearsExperience: profile.yearsExperience,
        acceptingClients: profile.acceptingClients,
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        zipCode: profile.zipCode || "",
        country: profile.country || "USA",
        latitude: profile.latitude,
        longitude: profile.longitude,
        phoneNumber: profile.phoneNumber || "",
        website: profile.website || "",
        offersVirtualSessions: profile.offersVirtualSessions,
        offersInPerson: profile.offersInPerson,
      });
    }
  }, [profile, form]);

  const createMutation = useMutation({
    mutationFn: (data: ProfileFormValues) => apiRequest("POST", "/api/therapist/profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/therapist/profile"] });
      toast({ title: "Profile created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create profile", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProfileFormValues) => apiRequest("PUT", "/api/therapist/profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/therapist/profile"] });
      toast({ title: "Profile updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update profile", variant: "destructive" });
    },
  });

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue("latitude", position.coords.latitude);
          form.setValue("longitude", position.coords.longitude);
          setIsGettingLocation(false);
          toast({ title: "Location captured successfully" });
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

  const onSubmit = (data: ProfileFormValues) => {
    if (profile) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const addSpecialty = () => {
    if (specialtyInput.trim()) {
      const currentSpecialties = form.getValues("specialties");
      if (!currentSpecialties.includes(specialtyInput.trim())) {
        form.setValue("specialties", [...currentSpecialties, specialtyInput.trim()]);
      }
      setSpecialtyInput("");
    }
  };

  const removeSpecialty = (specialty: string) => {
    const currentSpecialties = form.getValues("specialties");
    form.setValue(
      "specialties",
      currentSpecialties.filter((s) => s !== specialty)
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Therapist Profile</h1>
        <p className="text-muted-foreground mt-2">
          Set up your professional profile to help clients find and connect with you
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>Tell clients about your expertise and background</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell clients about your approach and experience..."
                        className="min-h-32"
                        data-testid="input-bio"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="credentials"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credentials</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., LCSW, PhD, PsyD"
                        data-testid="input-credentials"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Professional licenses and certifications</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yearsExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        data-testid="input-experience"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialties"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialties</FormLabel>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a specialty (e.g., Anxiety, Depression)"
                          value={specialtyInput}
                          onChange={(e) => setSpecialtyInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addSpecialty();
                            }
                          }}
                          data-testid="input-specialty"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={addSpecialty}
                          data-testid="button-add-specialty"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2" data-testid="specialties-list">
                        {field.value.map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="gap-1">
                            {specialty}
                            <button
                              type="button"
                              onClick={() => removeSpecialty(specialty)}
                              className="ml-1 hover:bg-destructive/10 rounded-full"
                              data-testid={`button-remove-specialty-${specialty}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <FormDescription>Areas of expertise and focus</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location & Contact</CardTitle>
              <CardDescription>Help clients find you based on location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" data-testid="input-address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" data-testid="input-city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" data-testid="input-state" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input placeholder="12345" data-testid="input-zipcode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Coordinates</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="w-full"
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
                      Use Current Location
                    </>
                  )}
                </Button>
                {form.watch("latitude") && form.watch("longitude") && (
                  <p className="text-sm text-muted-foreground" data-testid="text-coordinates">
                    Lat: {form.watch("latitude")?.toFixed(6)}, Lon:{" "}
                    {form.watch("longitude")?.toFixed(6)}
                  </p>
                )}
              </div>

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(555) 123-4567"
                        data-testid="input-phone"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        data-testid="input-website"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Availability & Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="acceptingClients"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Accepting New Clients</FormLabel>
                      <FormDescription>
                        Let clients know if you're currently accepting new consultations
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-accepting-clients"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="offersVirtualSessions"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Offers Virtual Sessions</FormLabel>
                      <FormDescription>Online/video consultations available</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-virtual"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="offersInPerson"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Offers In-Person Sessions</FormLabel>
                      <FormDescription>Face-to-face consultations available</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-in-person"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-save-profile"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
