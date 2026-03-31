// ─────────────────────────────────────────────────────────────
// Weather Service — OpenWeatherMap free tier
// Sign up free at: https://openweathermap.org/api
// Free plan: 60 calls/min, 1M calls/month
// ─────────────────────────────────────────────────────────────

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export interface WeatherData {
  city: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  rainfall_1h: number;  // mm in last 1 hour
  rainfall_3h: number;  // mm in last 3 hours
  windSpeed: number;    // km/h
  visibility: number;   // km
  aqi?: number;
  isDisrupted: boolean;
  disruptionType: string;
  payoutAmount: number;
  lat: number;
  lon: number;
}

export interface ForecastDay {
  date: string;
  day: string;
  temp: number;
  icon: string;
  risk: "Low" | "Medium" | "High" | "Critical";
  rainfall: number;
  description: string;
}

// Disruption thresholds
const THRESHOLDS = {
  HEAVY_RAIN_MM_HR: 15,
  EXTREME_HEAT_C: 43,
  HIGH_WIND_KMH: 60,
};

// Calculate disruption from weather data
const calculateDisruption = (data: {
  rain?: { "1h"?: number; "3h"?: number };
  main: { temp: number };
  wind: { speed: number };
}): { isDisrupted: boolean; disruptionType: string; payoutAmount: number } => {
  const rain1h = data.rain?.["1h"] || 0;
  const rain3h = data.rain?.["3h"] || 0;
  const tempC = data.main.temp - 273.15;
  const windKmh = data.wind.speed * 3.6;

  if (rain1h >= THRESHOLDS.HEAVY_RAIN_MM_HR || rain3h >= THRESHOLDS.HEAVY_RAIN_MM_HR * 2) {
    return { isDisrupted: true, disruptionType: "Heavy Rain 🌧️", payoutAmount: 180 };
  }
  if (rain1h >= 30 || rain3h >= 60) {
    return { isDisrupted: true, disruptionType: "Flood Risk 🌊", payoutAmount: 360 };
  }
  if (tempC >= THRESHOLDS.EXTREME_HEAT_C) {
    return { isDisrupted: true, disruptionType: "Extreme Heat 🔥", payoutAmount: 144 };
  }
  if (windKmh >= THRESHOLDS.HIGH_WIND_KMH) {
    return { isDisrupted: true, disruptionType: "High Wind 🌪️", payoutAmount: 216 };
  }
  return { isDisrupted: false, disruptionType: "Normal", payoutAmount: 0 };
};

// Get weather icon emoji
const getWeatherEmoji = (iconCode: string, rain: number): string => {
  if (rain >= 15) return "⛈️";
  if (rain > 5) return "🌧️";
  if (iconCode.startsWith("01")) return "☀️";
  if (iconCode.startsWith("02") || iconCode.startsWith("03")) return "🌤️";
  if (iconCode.startsWith("04")) return "☁️";
  if (iconCode.startsWith("09") || iconCode.startsWith("10")) return "🌧️";
  if (iconCode.startsWith("11")) return "⛈️";
  if (iconCode.startsWith("13")) return "🌨️";
  return "🌤️";
};

// Risk level from rain + temp
const getRiskLevel = (rain: number, temp: number): "Low" | "Medium" | "High" | "Critical" => {
  const tempC = temp - 273.15;
  if (rain >= 30 || tempC >= 45) return "Critical";
  if (rain >= 15 || tempC >= 43) return "High";
  if (rain >= 5 || tempC >= 40) return "Medium";
  return "Low";
};

// MOCK data for when API key is not configured
const getMockWeather = (lat: number, lon: number): WeatherData => {
  const mockRain = Math.random() > 0.6 ? Math.random() * 25 : 0;
  const mockTemp = 28 + Math.random() * 10;
  const disruption = calculateDisruption({
    rain: { "1h": mockRain },
    main: { temp: mockTemp + 273.15 },
    wind: { speed: 5 + Math.random() * 10 },
  });

  return {
    city: "Your Location",
    temperature: Math.round(mockTemp),
    feelsLike: Math.round(mockTemp + 2),
    humidity: Math.round(60 + Math.random() * 30),
    description: mockRain > 15 ? "heavy rain" : mockRain > 5 ? "moderate rain" : "partly cloudy",
    icon: mockRain > 15 ? "⛈️" : mockRain > 5 ? "🌧️" : "🌤️",
    rainfall_1h: Math.round(mockRain * 10) / 10,
    rainfall_3h: Math.round(mockRain * 2.5 * 10) / 10,
    windSpeed: Math.round(20 + Math.random() * 30),
    visibility: Math.round(5 + Math.random() * 5),
    isDisrupted: disruption.isDisrupted,
    disruptionType: disruption.disruptionType,
    payoutAmount: disruption.payoutAmount,
    lat,
    lon,
  };
};

// Fetch current weather by coordinates (real GPS)
export const fetchWeatherByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  if (!API_KEY || API_KEY === "your_openweathermap_api_key_here") {
    console.log("⚠️ No OpenWeatherMap API key — using mock weather data");
    return getMockWeather(lat, lon);
  }

  try {
    const res = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    if (!res.ok) throw new Error("Weather API error");
    const data = await res.json();

    const rain1h = data.rain?.["1h"] || 0;
    const rain3h = data.rain?.["3h"] || 0;
    const disruption = calculateDisruption({
      rain: { "1h": rain1h, "3h": rain3h },
      main: { temp: data.main.temp + 273.15 },
      wind: { speed: data.wind.speed },
    });

    return {
      city: data.name,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: getWeatherEmoji(data.weather[0].icon, rain1h),
      rainfall_1h: rain1h,
      rainfall_3h: rain3h,
      windSpeed: Math.round(data.wind.speed * 3.6),
      visibility: Math.round((data.visibility || 10000) / 1000),
      isDisrupted: disruption.isDisrupted,
      disruptionType: disruption.disruptionType,
      payoutAmount: disruption.payoutAmount,
      lat,
      lon,
    };
  } catch (err) {
    console.error("Weather fetch error:", err);
    return getMockWeather(lat, lon);
  }
};

// Fetch weather by city name
export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  if (!API_KEY || API_KEY === "your_openweathermap_api_key_here") {
    return getMockWeather(0, 0);
  }

  try {
    const res = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)},IN&appid=${API_KEY}&units=metric`
    );
    if (!res.ok) throw new Error("Weather API error");
    const data = await res.json();

    return fetchWeatherByCoords(data.coord.lat, data.coord.lon);
  } catch {
    return getMockWeather(0, 0);
  }
};

// Fetch 7-day forecast
export const fetchForecast = async (lat: number, lon: number): Promise<ForecastDay[]> => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (!API_KEY || API_KEY === "your_openweathermap_api_key_here") {
    // Return mock forecast
    return Array.from({ length: 7 }, (_, i) => {
      const mockRain = Math.random() > 0.5 ? Math.random() * 20 : 0;
      const mockTemp = 26 + Math.random() * 12;
      const d = new Date();
      d.setDate(d.getDate() + i);
      return {
        date: d.toLocaleDateString(),
        day: i === 0 ? "Today" : days[d.getDay()],
        temp: Math.round(mockTemp),
        icon: mockRain > 15 ? "⛈️" : mockRain > 5 ? "🌧️" : "☀️",
        risk: getRiskLevel(mockRain, mockTemp + 273.15),
        rainfall: Math.round(mockRain * 10) / 10,
        description: mockRain > 15 ? "Heavy Rain" : mockRain > 5 ? "Light Rain" : "Clear",
      };
    });
  }

  try {
    const res = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&cnt=40`
    );
    if (!res.ok) throw new Error("Forecast API error");
    const data = await res.json();

    // Group by day (take one entry per day — midday)
    const seen = new Set<string>();
    const forecast: ForecastDay[] = [];

    for (const item of data.list) {
      const d = new Date(item.dt * 1000);
      const dateKey = d.toDateString();
      if (!seen.has(dateKey) && forecast.length < 7) {
        seen.add(dateKey);
        const rain = item.rain?.["3h"] || 0;
        forecast.push({
          date: d.toLocaleDateString(),
          day: forecast.length === 0 ? "Today" : days[d.getDay()],
          temp: Math.round(item.main.temp),
          icon: getWeatherEmoji(item.weather[0].icon, rain),
          risk: getRiskLevel(rain, item.main.temp + 273.15),
          rainfall: Math.round(rain * 10) / 10,
          description: item.weather[0].description,
        });
      }
    }
    return forecast;
  } catch {
    return [];
  }
};
