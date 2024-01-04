export interface AlarmType {
  totalMinutes: string;
  createdAt: string;
  name: string;
  isActive: boolean;
  destinationPlace: LocationType;
}

export type AlarmTypeKeys = "totalMinutes" | "createdAt" | "name";

export interface LocationType {
  longitude: number;
  latitude: number;
}
