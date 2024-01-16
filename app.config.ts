import { ExpoConfig, ConfigContext } from "@expo/config";
import * as dotenv from "dotenv";

// initialize dotenv
dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Bondilarma",
  owner: "mati1212",
  slug: "bondilarma",
  extra: {
    eas: {
      projectId: process.env.PROJECT_ID,
    },
  },
  ios: {
    supportsTablet: true,
    config: {
      googleMapsApiKey: process.env.GOOGLE_CLOUD_API_KEY,
    },
  },
  android: {
    package: "com.mati.bondilarma",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./assets/images/favicon.png",
      backgroundColor: "#008080",
    },
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_CLOUD_API_KEY,
      },
    },
  },
});
