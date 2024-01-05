export interface AlarmType {
  totalDistance: number;
  createdAt: string;
  name: string;
  isActive: boolean;
  destinationPlace: LocationType;
}

export type AlarmTypeKeys = "totalDistance" | "createdAt" | "name";

export interface LocationType {
  longitude: number;
  latitude: number;
}
