import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ExternalLink, MapPin } from "lucide-react";

const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "au", label: "Australia" },
  { value: "nz", label: "New Zealand" },
  { value: "ie", label: "Ireland" },
  { value: "other", label: "Other" },
];

const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const canadianProvinces = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
  "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island",
  "Quebec", "Saskatchewan", "Yukon"
];

const ukRegions = [
  "England", "Scotland", "Wales", "Northern Ireland"
];

const australianStates = [
  "New South Wales", "Queensland", "South Australia", "Tasmania", "Victoria",
  "Western Australia", "Australian Capital Territory", "Northern Territory"
];

export default function FindTherapists() {
  const [country, setCountry] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [city, setCity] = useState("");
  const [customLocation, setCustomLocation] = useState("");

  const getRegionOptions = () => {
    switch (country) {
      case "us":
        return usStates;
      case "ca":
        return canadianProvinces;
      case "uk":
        return ukRegions;
      case "au":
        return australianStates;
      default:
        return [];
    }
  };

  const getRegionLabel = () => {
    switch (country) {
      case "us":
        return "State";
      case "ca":
        return "Province/Territory";
      case "uk":
        return "Region";
      case "au":
        return "State/Territory";
      default:
        return "State/Province";
    }
  };

  const handleSearch = () => {
    let location = "";
    
    if (country === "other") {
      location = customLocation;
    } else {
      const parts = [];
      if (city) parts.push(city);
      if (stateProvince) parts.push(stateProvince);
      
      const countryName = countries.find(c => c.value === country)?.label;
      if (countryName && countryName !== "Other") parts.push(countryName);
      
      location = parts.join(", ");
    }

    if (!location.trim()) {
      return;
    }

    // Construct Google search query
    const searchQuery = `therapists OR psychiatrists OR mental health counselors in ${location}`;
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    
    // Open in new tab
    window.open(googleSearchUrl, "_blank");
  };

  const isSearchDisabled = () => {
    if (country === "other") {
      return !customLocation.trim();
    }
    return !country || !stateProvince;
  };

  const resetForm = () => {
    setCountry("");
    setStateProvince("");
    setCity("");
    setCustomLocation("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Find Mental Health Professionals</h1>
        <p className="text-muted-foreground mt-2">
          Search for therapists, psychiatrists, and mental health counselors in your area
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Select Your Location
          </CardTitle>
          <CardDescription>
            Choose your country and region to find mental health professionals near you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="country" data-testid="select-country">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {country && country !== "other" && getRegionOptions().length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="state-province">{getRegionLabel()} *</Label>
              <Select value={stateProvince} onValueChange={setStateProvince}>
                <SelectTrigger id="state-province" data-testid="select-state">
                  <SelectValue placeholder={`Select a ${getRegionLabel().toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {getRegionOptions().map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {country && country !== "other" && (
            <div className="space-y-2">
              <Label htmlFor="city">City (Optional)</Label>
              <Input
                id="city"
                placeholder="e.g., Los Angeles, Toronto, London"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                data-testid="input-city"
              />
            </div>
          )}

          {country === "other" && (
            <div className="space-y-2">
              <Label htmlFor="custom-location">Location *</Label>
              <Input
                id="custom-location"
                placeholder="e.g., Paris, France or Tokyo, Japan"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                data-testid="input-custom-location"
              />
              <p className="text-sm text-muted-foreground">
                Enter your city and country
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSearch}
              disabled={isSearchDisabled()}
              className="flex-1"
              data-testid="button-search-google"
            >
              <Search className="w-4 h-4 mr-2" />
              Search on Google
            </Button>
            <Button
              variant="outline"
              onClick={resetForm}
              data-testid="button-reset"
            >
              Reset
            </Button>
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
              <p className="font-medium text-foreground">Select Your Location</p>
              <p>Choose your country, state/province, and optionally your city</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              2
            </div>
            <div>
              <p className="font-medium text-foreground">Search on Google</p>
              <p>
                Click the search button to open Google results for "therapists OR psychiatrists in [your location]"
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              3
            </div>
            <div>
              <p className="font-medium text-foreground">Browse Results</p>
              <p>
                Review Google's search results to find mental health professionals, read reviews, 
                check their websites, and contact them directly
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 bg-background rounded-md border mt-4">
            <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-xs">
              Clicking "Search on Google" will open a new browser tab with Google search results. 
              You'll be able to see therapist listings, reviews, contact information, and websites.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
