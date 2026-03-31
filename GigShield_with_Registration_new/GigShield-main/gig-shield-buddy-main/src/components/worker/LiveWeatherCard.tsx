import { useEffect, useState } from "react";
import { CloudRain, Thermometer, Wind, Eye, Droplets, Loader2, Navigation, RefreshCw } from "lucide-react";
import { fetchWeatherByCoords, fetchWeatherByCity, WeatherData } from "@/services/weatherService";
import { getCurrentLocation } from "@/services/gpsService";

interface Props {
  city?: string;
}

const LiveWeatherCard = ({ city }: Props) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError("");
    try {
      let data: WeatherData;
      // Try GPS first
      try {
        const loc = await getCurrentLocation();
        data = await fetchWeatherByCoords(loc.lat, loc.lon);
      } catch {
        // Fallback to city name
        if (city) {
          data = await fetchWeatherByCity(city);
        } else {
          throw new Error("No location available");
        }
      }
      setWeather(data);
      setLastUpdated(new Date());
    } catch {
      setError("Could not fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWeather(); }, [city]);

  if (loading) return (
    <div className="stat-card flex items-center justify-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
      <span className="text-sm text-muted-foreground">Fetching live weather...</span>
    </div>
  );

  if (error || !weather) return (
    <div className="stat-card">
      <p className="text-xs text-muted-foreground text-center">{error || "Weather unavailable"}</p>
    </div>
  );

  return (
    <div className={`stat-card ${weather.isDisrupted ? "border-l-4 border-destructive" : "border-l-4 border-success"}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <CloudRain className={`h-4 w-4 ${weather.isDisrupted ? "text-destructive" : "text-info"}`} />
          Live Weather — {weather.city}
        </h3>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <button onClick={fetchWeather} className="text-muted-foreground hover:text-primary transition-colors">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main weather display */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{weather.icon}</span>
          <div>
            <p className="text-2xl font-bold">{weather.temperature}°C</p>
            <p className="text-xs text-muted-foreground capitalize">{weather.description}</p>
          </div>
        </div>
        {weather.isDisrupted && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2 text-center">
            <p className="text-xs font-bold text-destructive">{weather.disruptionType}</p>
            <p className="text-sm font-bold text-destructive">₹{weather.payoutAmount}</p>
            <p className="text-xs text-destructive/70">Auto-payout</p>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="rounded-lg bg-muted/50 p-2">
          <Droplets className="h-3 w-3 text-blue-500 mx-auto mb-1" />
          <p className="text-xs font-bold">{weather.humidity}%</p>
          <p className="text-xs text-muted-foreground">Humidity</p>
        </div>
        <div className={`rounded-lg p-2 ${weather.rainfall_1h >= 15 ? "bg-destructive/10" : "bg-muted/50"}`}>
          <CloudRain className={`h-3 w-3 mx-auto mb-1 ${weather.rainfall_1h >= 15 ? "text-destructive" : "text-blue-500"}`} />
          <p className={`text-xs font-bold ${weather.rainfall_1h >= 15 ? "text-destructive" : ""}`}>{weather.rainfall_1h}mm</p>
          <p className="text-xs text-muted-foreground">Rain/hr</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-2">
          <Wind className="h-3 w-3 text-gray-500 mx-auto mb-1" />
          <p className="text-xs font-bold">{weather.windSpeed}km/h</p>
          <p className="text-xs text-muted-foreground">Wind</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-2">
          <Eye className="h-3 w-3 text-purple-500 mx-auto mb-1" />
          <p className="text-xs font-bold">{weather.visibility}km</p>
          <p className="text-xs text-muted-foreground">Visibility</p>
        </div>
      </div>

      {/* Disruption alert */}
      {weather.isDisrupted && (
        <div className="mt-3 rounded-lg bg-destructive/10 border border-destructive/30 p-2.5">
          <p className="text-xs font-bold text-destructive text-center">
            ⚡ Disruption detected — Auto-payout of ₹{weather.payoutAmount} is being processed
          </p>
        </div>
      )}

      {!weather.isDisrupted && (
        <div className="mt-3 rounded-lg bg-success/10 border border-success/20 p-2">
          <p className="text-xs text-success text-center font-medium">✅ No disruption — Good riding conditions</p>
        </div>
      )}

      {/* Threshold info */}
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Trigger threshold: &gt;15mm/hr rain</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Navigation className="h-3 w-3" /> Live GPS
        </div>
      </div>
    </div>
  );
};

export default LiveWeatherCard;
