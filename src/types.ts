export interface UserLocation {
  ip: string;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  timestamp: string;
}

export interface User {
  email: string;
  password: string;
  locations: UserLocation[];
}