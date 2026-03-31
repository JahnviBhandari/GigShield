// ─────────────────────────────────────────────────────────────
// GPS Location Service — uses browser native Geolocation API
// No API key needed — built into all modern browsers
// ─────────────────────────────────────────────────────────────

export interface GPSLocation {
  lat: number;
  lon: number;
  accuracy: number; // metres
  city: string;
  zone: string;
  address: string;
  timestamp: number;
}

// City bounding boxes for zone detection
const CITY_BOUNDS: Record<string, { lat: [number, number]; lon: [number, number] }> = {
  Mumbai:    { lat: [18.87, 19.27], lon: [72.77, 73.00] },
  Bangalore: { lat: [12.83, 13.14], lon: [77.46, 77.75] },
  Delhi:     { lat: [28.40, 28.88], lon: [76.84, 77.35] },
  Chennai:   { lat: [12.90, 13.23], lon: [80.13, 80.33] },
  Hyderabad: { lat: [17.18, 17.60], lon: [78.27, 78.67] },
  Pune:      { lat: [18.41, 18.63], lon: [73.73, 74.00] },
};

// Detect city from coordinates
const detectCity = (lat: number, lon: number): string => {
  for (const [city, bounds] of Object.entries(CITY_BOUNDS)) {
    if (
      lat >= bounds.lat[0] && lat <= bounds.lat[1] &&
      lon >= bounds.lon[0] && lon <= bounds.lon[1]
    ) {
      return city;
    }
  }
  return "Unknown";
};

// Zone names per city (based on rough lat/lon quadrants)
const CITY_ZONES: Record<string, string[]> = {
  Mumbai:    ["Andheri West", "Bandra", "Dharavi", "Kurla", "Dadar", "Malad", "Borivali"],
  Bangalore: ["Koramangala", "Whitefield", "Indiranagar", "HSR Layout", "Electronic City", "Marathahalli", "Hebbal"],
  Delhi:     ["Connaught Place", "Lajpat Nagar", "Dwarka", "Rohini", "Saket", "Janakpuri", "Noida"],
  Chennai:   ["T Nagar", "Anna Nagar", "Adyar", "Velachery", "OMR", "Porur", "Tambaram"],
  Hyderabad: ["Banjara Hills", "Hitech City", "Gachibowli", "Ameerpet", "Kondapur", "Secunderabad", "LB Nagar"],
  Pune:      ["Kothrud", "Viman Nagar", "Hinjewadi", "Wakad", "Hadapsar", "Baner", "Aundh"],
};

// Detect zone from city + lat/lon (rough quadrant mapping)
const detectZone = (city: string, lat: number, lon: number): string => {
  const zones = CITY_ZONES[city];
  if (!zones) return "Central Zone";
  // Use lat/lon decimal to pick a deterministic zone
  const idx = Math.abs(Math.round((lat * 100 + lon * 10) % zones.length));
  return zones[idx] || zones[0];
};

// Reverse geocode using OpenStreetMap Nominatim (free, no key needed)
const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`,
      { headers: { "User-Agent": "GigShield-App/1.0" } }
    );
    if (!res.ok) throw new Error("Geocode failed");
    const data = await res.json();
    const addr = data.address;
    const parts = [
      addr.suburb || addr.neighbourhood || addr.quarter,
      addr.city || addr.town || addr.village,
    ].filter(Boolean);
    return parts.join(", ") || data.display_name?.split(",").slice(0, 2).join(", ") || "Your location";
  } catch {
    return "Your location";
  }
};

// Get current GPS position
export const getCurrentLocation = (): Promise<GPSLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy);

        const city = detectCity(lat, lon);
        const zone = detectZone(city, lat, lon);

        // Try to get human-readable address
        let address = `${zone}, ${city}`;
        try {
          address = await reverseGeocode(lat, lon);
        } catch {
          // Use fallback
        }

        resolve({
          lat,
          lon,
          accuracy,
          city: city !== "Unknown" ? city : address.split(",").pop()?.trim() || "Your City",
          zone,
          address,
          timestamp: Date.now(),
        });
      },
      (error) => {
        let message = "Location access denied";
        if (error.code === error.PERMISSION_DENIED) message = "Location permission denied";
        else if (error.code === error.POSITION_UNAVAILABLE) message = "Location unavailable";
        else if (error.code === error.TIMEOUT) message = "Location request timed out";
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  });
};

// Watch location continuously (for live tracking)
export const watchLocation = (
  onUpdate: (location: GPSLocation) => void,
  onError: (error: string) => void
): number => {
  if (!navigator.geolocation) {
    onError("Geolocation not supported");
    return -1;
  }

  return navigator.geolocation.watchPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const city = detectCity(lat, lon);
      const zone = detectZone(city, lat, lon);

      onUpdate({
        lat,
        lon,
        accuracy: Math.round(position.coords.accuracy),
        city: city !== "Unknown" ? city : "Your City",
        zone,
        address: `${zone}, ${city}`,
        timestamp: Date.now(),
      });
    },
    (error) => onError(error.message),
    { enableHighAccuracy: true, maximumAge: 15000 }
  );
};

// Stop watching location
export const stopWatchingLocation = (watchId: number) => {
  if (watchId >= 0) navigator.geolocation.clearWatch(watchId);
};
