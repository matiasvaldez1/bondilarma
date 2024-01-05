import { Platform } from "react-native";
import * as Location from "expo-location";
import { isCloseToTargetLocation } from "utils/isCloseToTargetLocation";
import { dataStorageService } from "./DataStorageService";

export const IS_IOS: boolean = Platform.OS === "ios";

export const checkAndRequestLocationPermission = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.warn("Location permission denied");
      return;
    }

    if (IS_IOS) {
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

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 1,
        timeInterval: 1000,
      },
      async (location) => {
        const alarm = await dataStorageService.getAlarm();
        if (!alarm) return;

        const targetLocation = {
          latitude: alarm.destinationPlace.latitude,
          longitude: alarm.destinationPlace.longitude,
        };

        const currentLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        const proximityThreshold = alarm.totalDistance;

        const closeToTarget = isCloseToTargetLocation(
          currentLocation,
          targetLocation,
          proximityThreshold
        );

        if (closeToTarget) {
          console.log("IM CLOSE")
          return;
          /* playAlarm(); */
        }
        console.log("IM NOT CLOSE")

      }
    );
  } catch (error) {
    console.error("Error starting background geolocation:", error);
  }
};
