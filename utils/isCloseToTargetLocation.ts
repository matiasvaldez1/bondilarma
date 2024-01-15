import { LocationType } from "types";

const calculateHaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Earth's radius in kilometers

  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return distance;
};

const deg2rad = (degree: number) => degree * (Math.PI / 180);

export const isCloseToTargetLocation = (
  currentLocation: LocationType,
  targetLocation: LocationType,
  proximityThreshold = 0.1
) => {
  const distance = calculateHaversineDistance(
    currentLocation.latitude,
    currentLocation.longitude,
    targetLocation.latitude,
    targetLocation.longitude
  );
  return Number(distance.toFixed(3)) <= (proximityThreshold * 100) / 1000;
};
