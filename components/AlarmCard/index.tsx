import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AlarmType } from "types";

type TimeRemaining = {
  hours: number;
  minutes: number;
  seconds: number;
};

const AlarmComponent = ({ alarm }: { alarm: AlarmType }) => {
    console.log(alarm)
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(
    getTimeRemaining(new Date(alarm.createdAt))
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(getTimeRemaining(new Date(alarm.createdAt)));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function getTimeRemaining(alarmDate: Date): TimeRemaining {
    const now = new Date();
    const timeDifference = Math.max(alarmDate.getTime() - now.getTime(), 0); // Ensure non-negative time difference

    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  }

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 10,
        padding: 20,
      }}
      key={alarm.createdAt}
    >
      <Ionicons name="ios-alarm-outline" size={24} color="white" />
      <View style={{ flexDirection: "column" }}>
        <Text>{alarm.name}</Text>
        <Text>{`Sonará a las: ${timeRemaining.hours} horas, ${timeRemaining.minutes} minutos, ${timeRemaining.seconds} segundos`}</Text>
      </View>
    </View>
  );
};

export default AlarmComponent;
