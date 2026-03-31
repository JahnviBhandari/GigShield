import { useState } from "react";
import { ArrowRight, Loader2, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegistration, PlatformType, VehicleType } from "@/context/RegistrationContext";
import { getCurrentLocation } from "@/services/gpsService";

const vehicles: VehicleType[] = [
  "Two-Wheeler",
  "Three-Wheeler",
  "Bicycle",
  "Four-Wheeler",
  "",
];

const platforms: PlatformType[] = ["Zomato", "Swiggy"];

const Step2_Platform = () => {
  const { data, updateData, nextStep } = useRegistration();

  const [platform, setPlatform] = useState<PlatformType>(data.platform || "");
  const [city, setCity] = useState(data.city || "");
  const [vehicle, setVehicle] = useState<VehicleType>(data.vehicleType || "");
  const [detecting, setDetecting] = useState(false);
  const [gpsAddress, setGpsAddress] = useState("");
  const [gpsAccuracy, setGpsAccuracy] = useState(0);
  const [gpsError, setGpsError] = useState("");
  const [error, setError] = useState("");

  // 🔥 GPS DETECTION
  const handleDetectGPS = async () => {
    setDetecting(true);
    setGpsError("");

    try {
      const loc = await getCurrentLocation();

      setCity(loc.city || "");
      setGpsAddress(loc.address || "");
      setGpsAccuracy(loc.accuracy || 0);

      updateData({
        city: loc.city,
        latitude: loc.lat,
        longitude: loc.lon,
      });

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not detect location";
      setGpsError(msg);
    } finally {
      setDetecting(false);
    }
  };

  // 🔥 MANUAL CITY INPUT
  const handleCityManual = (c: string) => {
    setCity(c);
    updateData({ city: c });
  };

  const handleNext = () => {
    if (!platform) {
      setError("Please select your delivery platform");
      return;
    }

    if (!city) {
      setError("Please enter your city");
      return;
    }

    if (!vehicle) {
      setError("Please select your vehicle type");
      return;
    }

    updateData({
      platform,
      city,
      vehicleType: vehicle,
    });

    nextStep();
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-100 mb-4">
          <span className="text-2xl">🛵</span>
        </div>
        <h2 className="text-xl font-bold">Your Work Details</h2>
        <p className="text-sm text-muted-foreground">
          Tell us where and how you deliver
        </p>
      </div>

      {/* PLATFORM */}
      <div>
        <label className="text-sm font-medium">Select Platform</label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`p-4 rounded-xl border transition ${
                platform === p
                  ? "border-primary bg-primary/10"
                  : "border-gray-300 hover:border-primary/50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* GPS BUTTON */}
      <div>
        <Button onClick={handleDetectGPS} disabled={detecting} className="w-full">
          {detecting ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Detecting...
            </>
          ) : (
            <>
              <Navigation className="mr-2" />
              Auto Detect Location
            </>
          )}
        </Button>

        {gpsError && (
          <p className="text-red-500 text-xs mt-1">{gpsError}</p>
        )}
      </div>

      {/* GPS RESULT */}
      {city && (
        <div className="bg-green-50 p-3 rounded-lg border border-green-300">
          <p className="text-sm font-bold">📍 {city}</p>
          {gpsAddress && <p className="text-xs">{gpsAddress}</p>}
          {gpsAccuracy > 0 && (
            <p className="text-xs">Accuracy: ±{gpsAccuracy}m</p>
          )}
        </div>
      )}

      {/* MANUAL INPUT */}
      <div>
        <label className="text-sm">Or enter city manually</label>
        <input
          type="text"
          value={city}
          onChange={(e) => handleCityManual(e.target.value)}
          placeholder="Enter your city"
          className="w-full border p-2 rounded"
        />
      </div>

      {/* VEHICLE */}
      <div>
        <label className="text-sm">Vehicle Type</label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {vehicles
            .filter((v) => v !== "")
            .map((v) => (
              <button
                key={v}
                onClick={() => setVehicle(v)}
                className={`p-2 border rounded transition ${
                  vehicle === v
                    ? "bg-primary/10 border-primary"
                    : "hover:border-primary/50"
                }`}
              >
                {v}
              </button>
            ))}
        </div>
      </div>

      {/* ERROR */}
      {error && <p className="text-red-500 text-xs">{error}</p>}

      {/* NEXT BUTTON */}
      <Button onClick={handleNext} className="w-full">
        Continue <ArrowRight className="ml-2" />
      </Button>
    </div>
  );
};

export default Step2_Platform;