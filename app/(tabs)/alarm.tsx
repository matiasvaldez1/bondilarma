import React, { useState, useEffect } from "react";
import { Alert, StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import useAlarms from "hooks/useAlarms";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { dataStorageService } from "services/DataStorageService";

export default function AlarmScreen() {
  const { alarm, refetch } = useAlarms();
  const [loading, setLoading] = useState(false);

  const handleDeleteAlarm = async () => {
    setLoading(true);
    await dataStorageService.deleteAlarm();
    await refetch();
    setLoading(false);
    Alert.alert("Alarma borrada");
  };

  if (loading) return <Text>Cargando...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alarma</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {!alarm && <Text>No hay ninguna alarma activada</Text>}
      {alarm && (
        <View
          style={{
            borderColor: "white",
            borderWidth: 1,
            borderRadius: 10,
            padding: 20,
          }}
          key={alarm?.createdAt}
        >
          <AntDesign
            style={{ marginLeft: "auto" }}
            name="close"
            size={24}
            color="white"
            onPress={handleDeleteAlarm}
          />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Ionicons name="ios-alarm-outline" size={24} color="white" />
            <View style={{ flexDirection: "column", gap: 10 }}>
              <Text>{alarm?.name}</Text>
              <Text>{`Sonará a ${alarm?.totalDistance} cuadras de distancia`}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
