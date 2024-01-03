import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import * as Location from "expo-location";
import MapView from "react-native-maps";

export default function MapScreen() {
  const { width, height } = Dimensions.get('window')
  const [location, setLocation] = useState<{
    longitude: number;
    latitude: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: coords.latitude, longitude: coords.longitude });
    })();
  }, []);

  if(!location) return <Text>Cargando..</Text>

  return (
    <View style={styles.container}>
      <MapView
        zoomEnabled
        zoomControlEnabled
        showsUserLocation
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
        style={{flex: 1, width: width * 1, height: height * 0.6}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
  map: {
    width: 300,
    height: 300,
  },
});
