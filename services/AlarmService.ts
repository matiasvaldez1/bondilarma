import { Audio } from "expo-av";
import { AlarmType } from "types";

export const playDefaultAlarm = async () => {
  const { sound } = await Audio.Sound.createAsync(
    require("assets/default-alarm.mp3")
  );
  await sound.playAsync();
};

export const playUserAlarm = async (audio: AlarmType["audio"]) => {
  const { sound } = await Audio.Sound.createAsync({
    uri: audio[0].uri!,
  });
  await sound.playAsync();
};
