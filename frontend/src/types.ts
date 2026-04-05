export type Platform = 'Zomato' | 'Swiggy' | 'Zepto' | 'Blinkit' | 'Porter' | 'Uber' | 'Ola' | 'Rapido';
export type Vehicle = 'Bike' | 'Bicycle' | 'Auto' | 'Car';
export type Shift = 'Morning' | 'Afternoon' | 'Evening' | 'Night' | 'Full Day';
export type ClaimStatus = 'Approved' | 'Pending' | 'Rejected' | 'Paid';

export interface User {
  id: string;
  phone: string;
  name: string;
  platform: Platform;
  vehicle: Vehicle;
  upiId: string;
  shift: Shift;
  location: {
    city: string;
    zone: string;
    pincode: string;
  };
  gigScore: number;
  totalEarnings: number;
  totalClaims: number;
  isActive: boolean;
  isAdmin?: boolean;
}

export interface Claim {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  date: string;
  reason: string;
  status: ClaimStatus;
  type: 'Rain' | 'AQI' | 'Accident' | 'Delay';
}

export interface WeatherData {
  temp: number;
  condition: string;
  aqi: number;
  isRaining: boolean;
}
