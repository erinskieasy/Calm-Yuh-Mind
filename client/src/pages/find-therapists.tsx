import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Loader2, AlertCircle, Navigation } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue with Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Therapist {
  id: number;
  lat: number;
  lon: number;
  name: string;
  type: string;
  address?: string;
  phone?: string;
  website?: string;
}

interface UserLocation {
  lat: number;
  lon: number;
}

// Component to center map on user location
function LocationMarker({ position, onLocationFound }: { 
  position: UserLocation | null; 
  onLocationFound: (location: UserLocation) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!position) {
      map.locate().on("locationfound", (e) => {
        const location = { lat: e.latlng.lat, lon: e.latlng.lng };
        onLocationFound(location);
        map.flyTo(e.latlng, 13);
      });
    }
  }, [map, position, onLocationFound]);

  return position ? (
    <>
      <Marker position={[position.lat, position.lon]}>
        <Popup>
          <strong>Your Location</strong>
          <br />
          You are here
        </Popup>
      </Marker>
    </>
  ) : null;
}

export default function FindTherapists() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [radius, setRadius] = useState(5000); // meters
  const [showCircle, setShowCircle] = useState(true);

  const fetchTherapists = async (location: UserLocation, searchRadius: number) => {
    setLoading(true);
    setError(null);

    try {
      const overpassUrl = "https://overpass-api.de/api/interpreter";
      
      // Query for mental health professionals
      const query = `
        [out:json][timeout:25];
        (
          node["healthcare"="psychotherapist"](around:${searchRadius},${location.lat},${location.lon});
          way["healthcare"="psychotherapist"](around:${searchRadius},${location.lat},${location.lon});
          node["healthcare"="psychiatry"](around:${searchRadius},${location.lat},${location.lon});
          way["healthcare"="psychiatry"](around:${searchRadius},${location.lat},${location.lon});
          node["amenity"="clinic"]["healthcare:speciality"="mental_health"](around:${searchRadius},${location.lat},${location.lon});
          way["amenity"="clinic"]["healthcare:speciality"="mental_health"](around:${searchRadius},${location.lat},${location.lon});
          node["amenity"="clinic"]["healthcare:speciality"="psychiatry"](around:${searchRadius},${location.lat},${location.lon});
          way["amenity"="clinic"]["healthcare:speciality"="psychiatry"](around:${searchRadius},${location.lat},${location.lon});
        );
        out body;
        >;
        out skel qt;
      `;

      const response = await fetch(overpassUrl, {
        method: "POST",
        body: query,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch therapists from OpenStreetMap");
      }

      const data = await response.json();
      
      // Process and format results
      const formattedTherapists: Therapist[] = data.elements
        .filter((el: any) => el.lat && el.lon)
        .map((el: any) => ({
          id: el.id,
          lat: el.lat,
          lon: el.lon,
          name: el.tags?.name || "Mental Health Professional",
          type: el.tags?.healthcare || el.tags?.amenity || "Unknown",
          address: el.tags?.["addr:street"] 
            ? `${el.tags["addr:housenumber"] || ""} ${el.tags["addr:street"]}, ${el.tags["addr:city"] || ""}`.trim()
            : undefined,
          phone: el.tags?.phone,
          website: el.tags?.website,
        }));

      setTherapists(formattedTherapists);
      
      if (formattedTherapists.length === 0) {
        setError("No therapists found in this area. Try increasing the search radius or searching in a different location.");
      }
    } catch (err) {
      console.error("Error fetching therapists:", err);
      setError("Unable to load therapists. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationFound = (location: UserLocation) => {
    setUserLocation(location);
    fetchTherapists(location, radius);
  };

  const handleGetLocation = () => {
    setError(null);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        handleLocationFound(location);
      },
      (err) => {
        setLoading(false);
        if (err.code === 1) {
          setError("Location access denied. Please enable location permissions in your browser.");
        } else if (err.code === 2) {
          setError("Unable to determine your location. Please try again.");
        } else if (err.code === 3) {
          setError("Location request timed out. Please try again.");
        } else {
          setError("An error occurred while getting your location.");
        }
      }
    );
  };

  const handleRadiusChange = (newRadius: string) => {
    const radiusValue = parseInt(newRadius);
    setRadius(radiusValue);
    if (userLocation) {
      fetchTherapists(userLocation, radiusValue);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Find Nearby Therapists</h1>
        <p className="text-muted-foreground mt-2">
          Discover mental health professionals near you using OpenStreetMap
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Search Controls
          </CardTitle>
          <CardDescription>
            Use your live location to find nearby therapists and psychiatrists
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="radius">Search Radius</Label>
              <Select value={radius.toString()} onValueChange={handleRadiusChange}>
                <SelectTrigger id="radius" data-testid="select-radius">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1000">1 km (0.6 miles)</SelectItem>
                  <SelectItem value="2000">2 km (1.2 miles)</SelectItem>
                  <SelectItem value="5000">5 km (3.1 miles)</SelectItem>
                  <SelectItem value="10000">10 km (6.2 miles)</SelectItem>
                  <SelectItem value="20000">20 km (12.4 miles)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleGetLocation}
              disabled={loading}
              data-testid="button-get-location"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  Use My Location
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCircle(!showCircle)}
              disabled={!userLocation}
              data-testid="button-toggle-circle"
            >
              {showCircle ? "Hide" : "Show"} Radius
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {therapists.length > 0 && (
            <Alert>
              <MapPin className="h-4 w-4" />
              <AlertDescription>
                Found {therapists.length} mental health professional{therapists.length !== 1 ? "s" : ""} within {radius / 1000} km
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div style={{ height: "600px", width: "100%" }}>
            <MapContainer
              center={userLocation ? [userLocation.lat, userLocation.lon] : [40.7128, -74.0060]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              data-testid="map-container"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <LocationMarker position={userLocation} onLocationFound={handleLocationFound} />
              
              {userLocation && showCircle && (
                <Circle
                  center={[userLocation.lat, userLocation.lon]}
                  radius={radius}
                  pathOptions={{
                    color: "hsl(var(--primary))",
                    fillColor: "hsl(var(--primary))",
                    fillOpacity: 0.1,
                  }}
                />
              )}
              
              {therapists.map((therapist) => (
                <Marker
                  key={therapist.id}
                  position={[therapist.lat, therapist.lon]}
                  data-testid={`marker-therapist-${therapist.id}`}
                >
                  <Popup>
                    <div className="space-y-1">
                      <h3 className="font-semibold">{therapist.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {therapist.type.replace(/_/g, " ")}
                      </p>
                      {therapist.address && (
                        <p className="text-sm">{therapist.address}</p>
                      )}
                      {therapist.phone && (
                        <p className="text-sm">
                          <a href={`tel:${therapist.phone}`} className="text-primary hover:underline">
                            {therapist.phone}
                          </a>
                        </p>
                      )}
                      {therapist.website && (
                        <p className="text-sm">
                          <a 
                            href={therapist.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Visit Website
                          </a>
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">How This Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              1
            </div>
            <div>
              <p className="font-medium text-foreground">Share Your Location</p>
              <p>
                Click "Use My Location" to allow your browser to access your current location.
                Your location is only used locally and never stored.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              2
            </div>
            <div>
              <p className="font-medium text-foreground">Search Nearby</p>
              <p>
                The map will search OpenStreetMap for mental health professionals within your selected radius.
                Adjust the radius to expand or narrow your search.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              3
            </div>
            <div>
              <p className="font-medium text-foreground">View Details</p>
              <p>
                Click on any marker to see details about the therapist, including their name, address,
                phone number, and website (when available).
              </p>
            </div>
          </div>
          <div className="p-3 bg-background rounded-md border mt-4">
            <p className="text-xs">
              <strong>Note:</strong> Data is sourced from OpenStreetMap, a crowd-sourced mapping platform.
              Coverage may vary by location. Always verify information directly with the provider before making an appointment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
