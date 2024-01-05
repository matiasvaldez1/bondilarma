import { LocationType } from "types";

const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };
  
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  };
  
  export const isCloseToTargetLocation = (currentLocation: LocationType, targetLocation: LocationType, proximityThreshold = 0.1) => {
    // Check if the distance between current and target location is within the proximity threshold
    const distance = getDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      targetLocation.latitude,
      targetLocation.longitude
    );
  
    return distance <= proximityThreshold;
  };
  