import { Platform } from "react-native";
import * as Location from "expo-location";
import { isCloseToTargetLocation } from "utils/isCloseToTargetLocation";
import { dataStorageService } from "./DataStorageService";
import { playDefaultAlarm, playUserAlarm } from "./AlarmService";
import { Audio } from "expo-av";

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
      accuracy: Location.Accuracy.Highest,
      foregroundService: {
        notificationTitle: "BackgroundLocation Is On",
        notificationBody: "We are tracking your location",
        notificationColor: "#ffce52",
      },
    });

    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
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
          if (alarm?.audio) {
            await playUserAlarm(alarm.audio);
          } else {
            await playDefaultAlarm();
          }
          await dataStorageService.deleteAlarm();
          return;
        }
      }
    );
  } catch (error) {
    console.error("Error starting background geolocation:", error);
  }
};
