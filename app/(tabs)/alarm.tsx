import React, { useState, useEffect } from "react";
import { Alert, StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import useAlarms from "hooks/useAlarms";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { dataStorageService } from "services/DataStorageService";

export default function AlarmScreen() {
  const { alarms, refetch } = useAlarms();
  const [loading, setLoading] = useState(false);

  const handleDeleteAlarm = async (name: string) => {
    setLoading(true);
    await dataStorageService.deleteAlarmByName(name);
    await refetch();
    setLoading(false);
    Alert.alert("Alarma borrada");
  };

  const getTimeRemaining = (alarmDate: Date) => {
    const now = new Date();
    const timeDifference = Math.max(alarmDate.getTime() - now.getTime(), 0);

    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  const [timeRemaining, setTimeRemaining] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (alarms && alarms.length > 0 && alarms[0].isActive) {
        setTimeRemaining(getTimeRemaining(new Date(alarms[0].createdAt)));
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [alarms]);

  if (loading) return <Text>Cargando...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alarma</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {alarms?.length === 0 && <Text>No hay ninguna alarma activada</Text>}
      {alarms?.map((alarm) => {
        if (!alarm.isActive) return null;
        return (
          <View
            style={{
              borderColor: "white",
              borderWidth: 1,
              borderRadius: 10,
              padding: 20,
            }}
            key={alarm.createdAt}
          >
            <AntDesign
              style={{ marginLeft: "auto" }}
              name="close"
              size={24}
              color="white"
              onPress={() => handleDeleteAlarm(alarm.name)}
            />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Ionicons name="ios-alarm-outline" size={24} color="white" />
              <View style={{ flexDirection: "column", gap: 10 }}>
                <Text>{alarm.name}</Text>
                <Text>{`Sonará a las: ${timeRemaining.hours} horas, ${timeRemaining.minutes} minutos, ${timeRemaining.seconds} segundos`}</Text>
              </View>
            </View>
          </View>
        );
      })}
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
