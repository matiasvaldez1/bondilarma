import { Platform } from "react-native";
import * as Location from "expo-location";
import { isCloseToTargetLocation } from "utils/isCloseToTargetLocation";
import { playAlarm } from "./AlarmService";

export const IS_IOS: boolean = Platform.OS === "ios";

export const checkAndRequestLocationPermission = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.warn("Location permission denied");
      return;
    }

    if (IS_IOS) {
      // For iOS, you may also need to request background location permission
      const { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== "granted") {
        console.warn("Background location permission denied");
        return;
      }
    }

    await startBackgroundGeolocation();
  } catch (error) {
    console.error("Error checking or requesting location permission:", error);
  }
};

const startBackgroundGeolocation = async () => {
  try {
    await Location.startLocationUpdatesAsync("backgroundLocationTask", {
      accuracy: Location.Accuracy.High,
    });

    // Set up your BackgroundGeolocation logic here
    // Example:
    Location.watchPositionAsync(
      {
        accuracy: 1,
        distanceInterval: 1,
        timeInterval: 5000,
      },
      (location) => {
        console.log("Location update", location);

        const currentLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        const targetLocation = { latitude: 37.7749, longitude: -122.4194 };
        const proximityThreshold = 0.1;

        const closeToTarget = isCloseToTargetLocation(
          currentLocation,
          targetLocation,
          proximityThreshold
        );

        if (closeToTarget) {
          playAlarm();
        }
      }
    );
  } catch (error) {
    console.error("Error starting background geolocation:", error);
  }
};
