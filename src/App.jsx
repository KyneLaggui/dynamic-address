import { useState, useEffect } from "react";
import { MapPin, Check, Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

function App() {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [otherAddress, setOtherAddress] = useState("");
  const [displayAddress, setDisplayAddress] = useState("");

  const [isLoadingRegions, setIsLoadingRegions] = useState(true);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingBarangays, setIsLoadingBarangays] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchRegions = async () => {
      setIsLoadingRegions(true);
      try {
        const response = await fetch("https://psgc.cloud/api/regions");
        const data = await response.json();
        if (Array.isArray(data)) {
          setRegions(data);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching regions:", error);
      } finally {
        setIsLoadingRegions(false);
      }
    };

    fetchRegions();
  }, []);

  const handleRegionChange = (value) => {
    setSelectedRegion(value);
    setSelectedProvince("");
    setSelectedCity("");
    setSelectedBarangay("");
    setProvinces([]);
    setCities([]);
    setBarangays([]);
    setErrors({});

    if (value) {
      setIsLoadingProvinces(true);
      fetch(`https://psgc.cloud/api/regions/${value}/provinces`)
        .then((response) => response.json())
        .then((data) => setProvinces(data || []))
        .catch((error) => console.error("Error fetching provinces:", error))
        .finally(() => setIsLoadingProvinces(false));
    }
  };

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedCity("");
    setSelectedBarangay("");
    setCities([]);
    setBarangays([]);
    setErrors({});

    if (value) {
      setIsLoadingCities(true);
      fetch(`https://psgc.cloud/api/provinces/${value}/cities-municipalities`)
        .then((response) => response.json())
        .then((data) => setCities(data || []))
        .catch((error) => console.error("Error fetching cities:", error))
        .finally(() => setIsLoadingCities(false));
    }
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
    setSelectedBarangay("");
    setBarangays([]);
    setErrors({});

    if (value) {
      setIsLoadingBarangays(true);
      fetch(`https://psgc.cloud/api/municipalities/${value}/barangays`)
        .then((response) => response.json())
        .then((data) => setBarangays(data || []))
        .catch((error) => console.error("Error fetching barangays:", error))
        .finally(() => setIsLoadingBarangays(false));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedRegion) newErrors.region = "Region is required";
    if (!selectedProvince) newErrors.province = "Province is required";
    if (!selectedCity) newErrors.city = "City/Municipality is required";
    if (!selectedBarangay) newErrors.barangay = "Barangay is required";
    if (!zipCode) {
      newErrors.zipCode = "ZIP Code is required";
    } else if (!/^\d{4}$/.test(zipCode)) {
      newErrors.zipCode = "ZIP Code must be 4 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate a slight delay for better UX
    setTimeout(() => {
      const regionName =
        regions.find((region) => region.code === selectedRegion)?.name ||
        "Unknown Region";
      const provinceName =
        provinces.find((province) => province.code === selectedProvince)
          ?.name || "Unknown Province";
      const cityName =
        cities.find((city) => city.code === selectedCity)?.name ||
        "Unknown City";
      const barangayName =
        barangays.find((barangay) => barangay.code === selectedBarangay)
          ?.name || "Unknown Barangay";

      setDisplayAddress(
        `${
          otherAddress ? otherAddress + ", " : ""
        }${barangayName}, ${cityName}, ${provinceName}, ${regionName}, ${zipCode}, Philippines.`
      );

      setIsSubmitting(false);
    }, 600);
  };

  const isLoading =
    isLoadingRegions ||
    isLoadingProvinces ||
    isLoadingCities ||
    isLoadingBarangays;

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">My Address</CardTitle>
          <CardDescription>
            Enter your Philippine address details using the hierarchical
            selection below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {displayAddress && (
            <Alert className="bg-primary/10 border-primary/20">
              <MapPin className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary">Your Address</AlertTitle>
              <AlertDescription className="text-primary/90 font-medium">
                {displayAddress}
              </AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="region"
                className={errors.region ? "text-destructive" : ""}
              >
                Region <span className="text-destructive">*</span>
              </Label>
              {isLoadingRegions ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={selectedRegion}
                  onValueChange={handleRegionChange}
                >
                  <SelectTrigger
                    id="region"
                    className={
                      errors.region ? "border-destructive ring-destructive" : ""
                    }
                  >
                    <SelectValue placeholder="Select a Region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.code} value={region.code}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.region && (
                <p className="text-sm text-destructive">{errors.region}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="province"
                className={errors.province ? "text-destructive" : ""}
              >
                Province <span className="text-destructive">*</span>
              </Label>
              {isLoadingProvinces ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={selectedProvince}
                  onValueChange={handleProvinceChange}
                  disabled={!selectedRegion}
                >
                  <SelectTrigger
                    id="province"
                    className={
                      errors.province
                        ? "border-destructive ring-destructive"
                        : ""
                    }
                  >
                    <SelectValue placeholder="Select a Province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province.code} value={province.code}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.province && (
                <p className="text-sm text-destructive">{errors.province}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="city"
                className={errors.city ? "text-destructive" : ""}
              >
                City/Municipality <span className="text-destructive">*</span>
              </Label>
              {isLoadingCities ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={selectedCity}
                  onValueChange={handleCityChange}
                  disabled={!selectedProvince}
                >
                  <SelectTrigger
                    id="city"
                    className={
                      errors.city ? "border-destructive ring-destructive" : ""
                    }
                  >
                    <SelectValue placeholder="Select a City" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.code} value={city.code}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="barangay"
                className={errors.barangay ? "text-destructive" : ""}
              >
                Barangay <span className="text-destructive">*</span>
              </Label>
              {isLoadingBarangays ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={selectedBarangay}
                  onValueChange={setSelectedBarangay}
                  disabled={!selectedCity}
                >
                  <SelectTrigger
                    id="barangay"
                    className={
                      errors.barangay
                        ? "border-destructive ring-destructive"
                        : ""
                    }
                  >
                    <SelectValue placeholder="Select a Barangay" />
                  </SelectTrigger>
                  <SelectContent>
                    {barangays.map((barangay) => (
                      <SelectItem key={barangay.code} value={barangay.code}>
                        {barangay.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.barangay && (
                <p className="text-sm text-destructive">{errors.barangay}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="zipCode"
                className={errors.zipCode ? "text-destructive" : ""}
              >
                ZIP Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="zipCode"
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter ZIP code (e.g., 1000)"
                className={
                  errors.zipCode ? "border-destructive ring-destructive" : ""
                }
              />
              {errors.zipCode && (
                <p className="text-sm text-destructive">{errors.zipCode}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherAddress">
                Other Address{" "}
                <span className="text-muted-foreground text-sm">
                  (Optional)
                </span>
              </Label>
              <Input
                id="otherAddress"
                type="text"
                value={otherAddress}
                onChange={(e) => setOtherAddress(e.target.value)}
                placeholder="House/Building No., Street, etc."
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <Button
            onClick={handleConfirm}
            disabled={isLoading || isSubmitting}
            className="w-full sm:w-auto px-8"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Confirm Address
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
