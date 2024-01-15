import { DocumentPickerAsset } from "expo-document-picker";

export interface AlarmType {
  totalDistance: number;
  createdAt: string;
  name: string;
  isActive: boolean;
  destinationPlace: LocationType;
  audio: DocumentPickerAsset[]
}

export type AlarmTypeKeys = "totalDistance" | "createdAt" | "name";

export interface LocationType {
  longitude: number;
  latitude: number;
}
